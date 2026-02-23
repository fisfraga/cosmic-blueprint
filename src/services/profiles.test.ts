// ============================================
// Tests for Profile Service
// ============================================

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { CosmicProfile } from '../types';

// ─── localStorage Mock ──────────────────────────────────────────────────────

function createLocalStorageMock() {
  const store = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => { store.set(key, value); }),
    removeItem: vi.fn((key: string) => { store.delete(key); }),
    clear: vi.fn(() => { store.clear(); }),
    get length() { return store.size; },
    key: vi.fn((_: number) => null),
  };
}

// ─── Test Helpers ───────────────────────────────────────────────────────────

function makeCosmicProfile(overrides: Partial<CosmicProfile> & { meta?: Partial<CosmicProfile['meta']>; birthData?: Partial<CosmicProfile['birthData']> } = {}): CosmicProfile {
  const id = overrides.meta?.id ?? `test-${Date.now()}`;
  return {
    profileVersion: 2,
    meta: {
      id,
      name: overrides.meta?.name ?? 'Test User',
      relationship: overrides.meta?.relationship ?? 'Me',
      dateOfBirth: overrides.meta?.dateOfBirth ?? '1990-01-15',
      createdAt: overrides.meta?.createdAt ?? '2024-01-01T00:00:00.000Z',
      lastViewedAt: overrides.meta?.lastViewedAt ?? '2024-01-01T00:00:00.000Z',
      ...overrides.meta,
    },
    birthData: {
      dateOfBirth: overrides.birthData?.dateOfBirth ?? '1990-01-15',
      timeOfBirth: overrides.birthData?.timeOfBirth ?? '12:00',
      timezone: overrides.birthData?.timezone ?? 'UTC',
      latitude: overrides.birthData?.latitude ?? 0,
      longitude: overrides.birthData?.longitude ?? 0,
      cityOfBirth: overrides.birthData?.cityOfBirth ?? 'Test City',
      ...overrides.birthData,
    },
    ...overrides,
  } as CosmicProfile;
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('Profile Service', () => {
  let mockStorage: ReturnType<typeof createLocalStorageMock>;

  beforeEach(async () => {
    vi.resetModules();
    mockStorage = createLocalStorageMock();
    vi.stubGlobal('localStorage', mockStorage);
    // Prevent seeding from running by setting both seed keys
    mockStorage.setItem('cosmic-copilot-seeded', '1');
    mockStorage.setItem('cosmic-copilot-seeded-v2', '1');
  });

  async function importProfiles() {
    return import('./profiles');
  }

  describe('loadAllProfiles', () => {
    it('returns empty array when no profiles stored', async () => {
      const { loadAllProfiles } = await importProfiles();
      const profiles = loadAllProfiles();
      expect(profiles).toEqual([]);
    });

    it('returns stored profiles', async () => {
      const profile = makeCosmicProfile({ meta: { id: 'p1', name: 'Alice', relationship: 'Me', dateOfBirth: '1990-01-15', createdAt: '2024-01-01T00:00:00.000Z', lastViewedAt: '2024-01-01T00:00:00.000Z' } });
      mockStorage.setItem('cosmic-copilot-profiles', JSON.stringify([profile]));

      const { loadAllProfiles } = await importProfiles();
      const profiles = loadAllProfiles();
      expect(profiles).toHaveLength(1);
      expect(profiles[0].meta.name).toBe('Alice');
    });

    it('handles corrupted storage gracefully', async () => {
      mockStorage.setItem('cosmic-copilot-profiles', 'not-json');

      const { loadAllProfiles } = await importProfiles();
      const profiles = loadAllProfiles();
      expect(profiles).toEqual([]);
    });

    it('handles non-array storage gracefully', async () => {
      mockStorage.setItem('cosmic-copilot-profiles', JSON.stringify({ foo: 'bar' }));

      const { loadAllProfiles } = await importProfiles();
      const profiles = loadAllProfiles();
      expect(profiles).toEqual([]);
    });
  });

  describe('saveCosmicProfile', () => {
    it('saves a new profile', async () => {
      const { saveCosmicProfile, loadAllProfiles } = await importProfiles();
      const profile = makeCosmicProfile({ meta: { id: 'new-1', name: 'Bob', relationship: 'Me', dateOfBirth: '1990-01-15', createdAt: '2024-01-01T00:00:00.000Z', lastViewedAt: '2024-01-01T00:00:00.000Z' } });

      const result = saveCosmicProfile(profile);

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
      expect(loadAllProfiles()).toHaveLength(1);
    });

    it('updates an existing profile', async () => {
      const { saveCosmicProfile, loadAllProfiles } = await importProfiles();
      const profile = makeCosmicProfile({ meta: { id: 'up-1', name: 'Charlie', relationship: 'Me', dateOfBirth: '1990-01-15', createdAt: '2024-01-01T00:00:00.000Z', lastViewedAt: '2024-01-01T00:00:00.000Z' } });
      saveCosmicProfile(profile);

      const updated = { ...profile, meta: { ...profile.meta, name: 'Charlie Updated' } };
      const result = saveCosmicProfile(updated);

      expect(result.success).toBe(true);
      const profiles = loadAllProfiles();
      expect(profiles).toHaveLength(1);
      expect(profiles[0].meta.name).toBe('Charlie Updated');
    });

    it('auto-activates first saved profile', async () => {
      const { saveCosmicProfile, getActiveProfileId } = await importProfiles();
      const profile = makeCosmicProfile({ meta: { id: 'first-1', name: 'First', relationship: 'Me', dateOfBirth: '1990-01-15', createdAt: '2024-01-01T00:00:00.000Z', lastViewedAt: '2024-01-01T00:00:00.000Z' } });

      saveCosmicProfile(profile);

      expect(getActiveProfileId()).toBe('first-1');
    });
  });

  describe('MAX_PROFILES enforcement', () => {
    it('rejects new profiles when at maximum (10)', async () => {
      const { saveCosmicProfile } = await importProfiles();

      // Save 10 profiles
      for (let i = 0; i < 10; i++) {
        const p = makeCosmicProfile({ meta: { id: `max-${i}`, name: `User ${i}`, relationship: 'Me', dateOfBirth: '1990-01-15', createdAt: '2024-01-01T00:00:00.000Z', lastViewedAt: '2024-01-01T00:00:00.000Z' } });
        const r = saveCosmicProfile(p);
        expect(r.success).toBe(true);
      }

      // 11th should fail
      const overflow = makeCosmicProfile({ meta: { id: 'max-overflow', name: 'Overflow', relationship: 'Me', dateOfBirth: '1990-01-15', createdAt: '2024-01-01T00:00:00.000Z', lastViewedAt: '2024-01-01T00:00:00.000Z' } });
      const result = saveCosmicProfile(overflow);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Maximum');
    });

    it('allows updating existing profile when at maximum', async () => {
      const { saveCosmicProfile, loadAllProfiles } = await importProfiles();

      for (let i = 0; i < 10; i++) {
        const p = makeCosmicProfile({ meta: { id: `full-${i}`, name: `User ${i}`, relationship: 'Me', dateOfBirth: '1990-01-15', createdAt: '2024-01-01T00:00:00.000Z', lastViewedAt: '2024-01-01T00:00:00.000Z' } });
        saveCosmicProfile(p);
      }

      const existing = loadAllProfiles()[0];
      existing.meta.name = 'Updated Name';
      const result = saveCosmicProfile(existing);
      expect(result.success).toBe(true);
    });
  });

  describe('deleteProfile', () => {
    it('deletes an existing profile', async () => {
      const { saveCosmicProfile, deleteProfile, loadAllProfiles } = await importProfiles();
      const p1 = makeCosmicProfile({ meta: { id: 'del-1', name: 'Alice', relationship: 'Me', dateOfBirth: '1990-01-15', createdAt: '2024-01-01T00:00:00.000Z', lastViewedAt: '2024-01-01T00:00:00.000Z' } });
      const p2 = makeCosmicProfile({ meta: { id: 'del-2', name: 'Bob', relationship: 'Me', dateOfBirth: '1990-01-15', createdAt: '2024-01-01T00:00:00.000Z', lastViewedAt: '2024-01-01T00:00:00.000Z' } });
      saveCosmicProfile(p1);
      saveCosmicProfile(p2);

      const result = deleteProfile('del-1');

      expect(result).toBe(true);
      expect(loadAllProfiles()).toHaveLength(1);
      expect(loadAllProfiles()[0].meta.id).toBe('del-2');
    });

    it('returns false for non-existent profile', async () => {
      const { deleteProfile } = await importProfiles();
      const result = deleteProfile('nonexistent');
      expect(result).toBe(false);
    });

    it('reassigns active profile when deleting active', async () => {
      const { saveCosmicProfile, deleteProfile, setActiveProfile, getActiveProfileId } = await importProfiles();
      const p1 = makeCosmicProfile({ meta: { id: 'act-1', name: 'A', relationship: 'Me', dateOfBirth: '1990-01-15', createdAt: '2024-01-01T00:00:00.000Z', lastViewedAt: '2024-01-01T00:00:00.000Z' } });
      const p2 = makeCosmicProfile({ meta: { id: 'act-2', name: 'B', relationship: 'Me', dateOfBirth: '1990-01-15', createdAt: '2024-01-01T00:00:00.000Z', lastViewedAt: '2024-01-01T00:00:00.000Z' } });
      saveCosmicProfile(p1);
      saveCosmicProfile(p2);
      setActiveProfile('act-1');

      deleteProfile('act-1');

      expect(getActiveProfileId()).toBe('act-2');
    });

    it('clears active when deleting last profile', async () => {
      const { saveCosmicProfile, deleteProfile, getActiveProfileId } = await importProfiles();
      const p = makeCosmicProfile({ meta: { id: 'last-1', name: 'Solo', relationship: 'Me', dateOfBirth: '1990-01-15', createdAt: '2024-01-01T00:00:00.000Z', lastViewedAt: '2024-01-01T00:00:00.000Z' } });
      saveCosmicProfile(p);

      deleteProfile('last-1');

      expect(getActiveProfileId()).toBeNull();
    });
  });

  describe('getActiveProfileId', () => {
    it('returns null when no profiles exist', async () => {
      const { getActiveProfileId } = await importProfiles();
      expect(getActiveProfileId()).toBeNull();
    });

    it('returns first profile if stored active id is invalid', async () => {
      const { saveCosmicProfile, getActiveProfileId } = await importProfiles();
      const p = makeCosmicProfile({ meta: { id: 'valid-1', name: 'Valid', relationship: 'Me', dateOfBirth: '1990-01-15', createdAt: '2024-01-01T00:00:00.000Z', lastViewedAt: '2024-01-01T00:00:00.000Z' } });
      saveCosmicProfile(p);
      // Set an invalid active ID
      mockStorage.setItem('cosmic-copilot-active-profile-id', 'nonexistent');

      expect(getActiveProfileId()).toBe('valid-1');
    });
  });

  describe('setActiveProfile', () => {
    it('sets the active profile and returns it', async () => {
      const { saveCosmicProfile, setActiveProfile, getActiveProfileId } = await importProfiles();
      const p1 = makeCosmicProfile({ meta: { id: 'set-1', name: 'One', relationship: 'Me', dateOfBirth: '1990-01-15', createdAt: '2024-01-01T00:00:00.000Z', lastViewedAt: '2024-01-01T00:00:00.000Z' } });
      const p2 = makeCosmicProfile({ meta: { id: 'set-2', name: 'Two', relationship: 'Me', dateOfBirth: '1990-01-15', createdAt: '2024-01-01T00:00:00.000Z', lastViewedAt: '2024-01-01T00:00:00.000Z' } });
      saveCosmicProfile(p1);
      saveCosmicProfile(p2);

      const result = setActiveProfile('set-2');

      expect(result).not.toBeNull();
      expect(result!.meta.id).toBe('set-2');
      expect(getActiveProfileId()).toBe('set-2');
    });

    it('returns null for non-existent profile', async () => {
      const { setActiveProfile } = await importProfiles();
      const result = setActiveProfile('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('generateProfileId', () => {
    it('generates slug-based ID from name', async () => {
      const { generateProfileId } = await importProfiles();
      const id = generateProfileId('John Smith');
      expect(id).toMatch(/^john-smith-\d+$/);
    });

    it('handles special characters', async () => {
      const { generateProfileId } = await importProfiles();
      const id = generateProfileId('José María');
      expect(id).toMatch(/^jos-mara-\d+$/);
    });

    it('uses "profile" as fallback for empty name', async () => {
      const { generateProfileId } = await importProfiles();
      const id = generateProfileId('');
      expect(id).toMatch(/^profile-\d+$/);
    });
  });

  describe('canAddMoreProfiles', () => {
    it('returns true when under limit', async () => {
      const { canAddMoreProfiles } = await importProfiles();
      expect(canAddMoreProfiles()).toBe(true);
    });

    it('returns false when at limit', async () => {
      const { saveCosmicProfile, canAddMoreProfiles } = await importProfiles();
      for (let i = 0; i < 10; i++) {
        saveCosmicProfile(makeCosmicProfile({ meta: { id: `cap-${i}`, name: `U${i}`, relationship: 'Me', dateOfBirth: '1990-01-15', createdAt: '2024-01-01T00:00:00.000Z', lastViewedAt: '2024-01-01T00:00:00.000Z' } }));
      }
      expect(canAddMoreProfiles()).toBe(false);
    });
  });

  describe('seedDefaultProfileOnFirstRun', () => {
    it('fresh install: seeds both Felipe and Duda, Felipe is active', async () => {
      // Clear both seed flags so seeding runs from scratch
      mockStorage.removeItem('cosmic-copilot-seeded');
      mockStorage.removeItem('cosmic-copilot-seeded-v2');

      const { loadAllProfiles, getActiveProfileId } = await importProfiles();

      const profiles = loadAllProfiles();
      expect(profiles).toHaveLength(2);
      expect(profiles[0].meta.id).toBe('felipe-fraga');
      expect(profiles[1].meta.id).toBe('duda-fraga-19980119');
      expect(profiles[1].meta.relationship).toBe('partner');
      expect(getActiveProfileId()).toBe('felipe-fraga');
    });

    it('existing user (v1 only): appends Duda without changing active profile', async () => {
      // beforeEach set SEED_KEY; remove SEED_V2_KEY to simulate upgrade path
      mockStorage.removeItem('cosmic-copilot-seeded-v2');
      const felipeProfile = makeCosmicProfile({ meta: { id: 'felipe-fraga', name: 'Felipe Fraga', relationship: 'Me', dateOfBirth: '1994-10-18', createdAt: '2024-10-18T08:10:00.000Z', lastViewedAt: '2024-10-18T08:10:00.000Z' } });
      mockStorage.setItem('cosmic-copilot-profiles', JSON.stringify([felipeProfile]));
      mockStorage.setItem('cosmic-copilot-active-profile-id', 'felipe-fraga');

      const { loadAllProfiles, getActiveProfileId } = await importProfiles();

      const profiles = loadAllProfiles();
      expect(profiles).toHaveLength(2);
      expect(profiles.some((p) => p.meta.id === 'duda-fraga-19980119')).toBe(true);
      expect(getActiveProfileId()).toBe('felipe-fraga'); // Active unchanged
    });

    it('v2 already seeded: no-op (both flags set)', async () => {
      // beforeEach already set both SEED_KEY and SEED_V2_KEY — no-op expected

      const { loadAllProfiles } = await importProfiles();

      expect(loadAllProfiles()).toHaveLength(0); // Nothing seeded
    });

    it('idempotent: Duda not duplicated if already present during v1→v2 upgrade', async () => {
      // Existing user already has both profiles; remove SEED_V2_KEY to trigger upgrade path
      mockStorage.removeItem('cosmic-copilot-seeded-v2');
      const felipeProfile = makeCosmicProfile({ meta: { id: 'felipe-fraga', name: 'Felipe Fraga', relationship: 'Me', dateOfBirth: '1994-10-18', createdAt: '2024-10-18T08:10:00.000Z', lastViewedAt: '2024-10-18T08:10:00.000Z' } });
      const dudaProfile = makeCosmicProfile({ meta: { id: 'duda-fraga-19980119', name: 'Duda Fraga', relationship: 'partner', dateOfBirth: '1998-01-19', createdAt: '2026-02-22T00:00:00.000Z', lastViewedAt: '2026-02-22T00:00:00.000Z' } });
      mockStorage.setItem('cosmic-copilot-profiles', JSON.stringify([felipeProfile, dudaProfile]));
      mockStorage.setItem('cosmic-copilot-active-profile-id', 'felipe-fraga');
      // SEED_KEY set by beforeEach; SEED_V2_KEY removed above

      const { loadAllProfiles } = await importProfiles();

      const profiles = loadAllProfiles();
      expect(profiles).toHaveLength(2); // No duplicate
      expect(profiles.filter((p) => p.meta.id === 'duda-fraga-19980119')).toHaveLength(1);
    });
  });
});
