import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '../services/authService';
import { getSession, onAuthStateChange, isSupabaseConfigured } from '../services/authService';
import { syncInsightsOnSignIn } from '../services/insightSync';
import { syncProfilesOnSignIn } from '../services/profileSync';
import { syncProgressOnSignIn } from '../services/pathwaySync';
import { syncSessionsOnSignIn } from '../services/sessionSync';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  loading: true,
  isConfigured: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    // Load initial session
    getSession().then((s) => {
      setSession(s);
      setLoading(false);
    });

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChange((event, newSession) => {
      setSession(newSession);
      // Sync all data when user signs in
      if (event === 'SIGNED_IN' && newSession?.user) {
        syncInsightsOnSignIn(newSession.user).catch(console.error);
        syncProfilesOnSignIn(newSession.user).catch(console.error);
        syncProgressOnSignIn(newSession.user).catch(console.error);
        syncSessionsOnSignIn(newSession.user).catch(console.error);
      }
    });

    return unsubscribe;
  }, [configured]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        isConfigured: configured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
