import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import {
  loadFlagOverrides,
  saveFlagOverrides,
  resolveFlagValue,
  type FeatureFlagId,
  type FeatureFlagsOverrides,
} from '../services/featureFlags';

interface FeatureFlagsContextValue {
  isEnabled: (flagId: FeatureFlagId) => boolean;
  setFlag: (flagId: FeatureFlagId, value: boolean) => void;
  resetAll: () => void;
  /** Server-side overrides — set these after auth resolves for membership tier gating */
  serverOverrides: Partial<Record<FeatureFlagId, boolean>>;
  setServerOverrides: (overrides: Partial<Record<FeatureFlagId, boolean>>) => void;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextValue | null>(null);

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<FeatureFlagsOverrides>(loadFlagOverrides);
  const [serverOverrides, setServerOverrides] = useState<Partial<Record<FeatureFlagId, boolean>>>({});

  const isEnabled = useCallback(
    (flagId: FeatureFlagId) => resolveFlagValue(flagId, overrides, serverOverrides),
    [overrides, serverOverrides],
  );

  const setFlag = useCallback((flagId: FeatureFlagId, value: boolean) => {
    setOverrides(prev => {
      const next = { ...prev, [flagId]: value };
      // Prune true values — sparse storage only stores false overrides
      if (value === true) delete next[flagId];
      saveFlagOverrides(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    saveFlagOverrides({});
    setOverrides({});
  }, []);

  return (
    <FeatureFlagsContext.Provider
      value={{ isEnabled, setFlag, resetAll, serverOverrides, setServerOverrides }}
    >
      {children}
    </FeatureFlagsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFeatureFlags(): FeatureFlagsContextValue {
  const ctx = useContext(FeatureFlagsContext);
  if (!ctx) throw new Error('useFeatureFlags must be used within FeatureFlagsProvider');
  return ctx;
}
