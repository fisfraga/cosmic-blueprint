import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { AstroProfile, CosmicProfile, ProfileMeta } from '../types';
import {
  getProfile,
  getProfileList,
  getCosmicProfileById,
  saveProfile as serviceSaveProfile,
  saveCosmicProfile as serviceSaveCosmicProfile,
  setActiveProfile as serviceSetActiveProfile,
  deleteProfile as serviceDeleteProfile,
  canAddMoreProfiles,
} from '../services/profiles';
import { getAsCosmicProfile, cosmicToAstroProfile } from '../services/profileMigration';
import { registerProfile } from '../services/entities/registry';
import { getSession } from '../services/authService';
import { pushProfileToCloud } from '../services/profileSync';

interface ProfileContextType {
  // Current active profile (AstroProfile for backwards compatibility)
  profile: AstroProfile | null;
  // Current active profile in new CosmicProfile format
  cosmicProfile: CosmicProfile | null;
  isLoading: boolean;
  hasProfile: boolean;

  // Single profile operations (backwards compatible)
  saveProfile: (profile: AstroProfile) => void;
  clearProfile: () => void;

  // CosmicProfile operations
  saveCosmicProfile: (profile: CosmicProfile) => { success: boolean; error?: string };
  getCosmicProfile: (profileId: string) => CosmicProfile | null;

  // Multi-profile operations
  allProfiles: ProfileMeta[];
  switchProfile: (profileId: string) => void;
  addProfile: (profile: AstroProfile | CosmicProfile) => { success: boolean; error?: string };
  removeProfile: (profileId: string) => boolean;
  canAddMore: boolean;
  refreshProfiles: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<AstroProfile | null>(null);
  const [cosmicProfile, setCosmicProfile] = useState<CosmicProfile | null>(null);
  const [allProfiles, setAllProfiles] = useState<ProfileMeta[]>([]);
  const [canAddMore, setCanAddMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfiles = useCallback(() => {
    const active = getProfile();
    const list = getProfileList();

    setAllProfiles(list);
    setCanAddMore(canAddMoreProfiles());

    if (active) {
      const activeCosmic = getAsCosmicProfile(active);
      setProfile(cosmicToAstroProfile(activeCosmic));
      setCosmicProfile(activeCosmic);
      registerProfile(activeCosmic);
    } else {
      setProfile(null);
      setCosmicProfile(null);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const persistAndSync = useCallback(async (cosmic: CosmicProfile) => {
    try {
      const session = await getSession();
      if (session?.user) {
        pushProfileToCloud(cosmic, session.user.id).catch(console.error);
      }
    } catch {
      // Cloud sync is best-effort; localStorage write already succeeded
    }
  }, []);

  const saveProfile = useCallback(
    (newProfile: AstroProfile) => {
      const result = serviceSaveProfile(newProfile);
      if (result.success) {
        const cosmic = getAsCosmicProfile(newProfile);
        setProfile(newProfile);
        setCosmicProfile(cosmic);
        setAllProfiles(getProfileList());
        setCanAddMore(canAddMoreProfiles());
        registerProfile(cosmic);
        persistAndSync(cosmic);
      }
    },
    [persistAndSync]
  );

  const saveCosmicProfile = useCallback(
    (newProfile: CosmicProfile): { success: boolean; error?: string } => {
      const result = serviceSaveCosmicProfile(newProfile);
      if (result.success) {
        const isActive = cosmicProfile?.meta.id === newProfile.meta.id;
        if (isActive) {
          const legacyForm = getAsCosmicProfile(newProfile);
          setCosmicProfile(legacyForm);
        }
        setAllProfiles(getProfileList());
        setCanAddMore(canAddMoreProfiles());
        persistAndSync(newProfile);
      }
      return result;
    },
    [cosmicProfile, persistAndSync]
  );

  const switchProfile = useCallback((profileId: string) => {
    const switched = serviceSetActiveProfile(profileId);
    if (switched) {
      setProfile(cosmicToAstroProfile(switched));
      setCosmicProfile(switched);
      setAllProfiles(getProfileList());
      registerProfile(switched);
    }
  }, []);

  const addProfile = useCallback(
    (newProfile: AstroProfile | CosmicProfile): { success: boolean; error?: string } => {
      const result = serviceSaveProfile(newProfile);
      if (result.success) {
        setAllProfiles(getProfileList());
        setCanAddMore(canAddMoreProfiles());
        const cosmic = getAsCosmicProfile(newProfile);
        persistAndSync(cosmic);
      }
      return result;
    },
    [persistAndSync]
  );

  const removeProfile = useCallback((profileId: string): boolean => {
    const deleted = serviceDeleteProfile(profileId);
    if (deleted) {
      // If we deleted the active profile, reload it
      const newActive = getProfile();
      if (newActive) {
        const cosmic = getAsCosmicProfile(newActive);
        setProfile(newActive);
        setCosmicProfile(cosmic);
        registerProfile(cosmic);
      } else {
        setProfile(null);
        setCosmicProfile(null);
      }
      setAllProfiles(getProfileList());
      setCanAddMore(canAddMoreProfiles());
    }
    return deleted;
  }, []);

  const clearProfile = useCallback(() => {}, []);

  const getCosmicProfile = useCallback(
    (profileId: string) => getCosmicProfileById(profileId),
    []
  );

  const refreshProfiles = useCallback(() => {
    loadProfiles();
  }, [loadProfiles]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        cosmicProfile,
        isLoading,
        hasProfile: profile !== null,
        saveProfile,
        clearProfile,
        saveCosmicProfile,
        getCosmicProfile,
        allProfiles,
        switchProfile,
        addProfile,
        removeProfile,
        canAddMore,
        refreshProfiles,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
