/**
 * Profile Service
 *
 * Multi-profile CRUD backed by localStorage.
 * Supabase cloud sync is handled separately by profileSync.ts.
 *
 * localStorage keys:
 *   'cosmic-copilot-profiles'           → CosmicProfile[] (all profiles)
 *   'cosmic-copilot-active-profile-id'  → string (active profile ID)
 */

import type { AstroProfile, CosmicProfile, ProfileMeta } from '../types';
import { getAsCosmicProfile, cosmicToAstroProfile } from './profileMigration';
import felipeData from '../data/profile/felipe.json';
import dudaData from '../data/profile/duda-fraga.json';
import catarinaData from '../data/profile/catarina-goldani.json';

// Re-export ProfileMeta type for backwards compatibility
export type { ProfileMeta };

// ─── Constants ────────────────────────────────────────────────────────────────

const PROFILES_KEY = 'cosmic-copilot-profiles';
const ACTIVE_PROFILE_KEY = 'cosmic-copilot-active-profile-id';
const SEED_KEY = 'cosmic-copilot-seeded';
const SEED_V2_KEY = 'cosmic-copilot-seeded-v2';
const SEED_V3_KEY = 'cosmic-copilot-seeded-v3';
const MAX_PROFILES = 10;

// ─── localStorage I/O ────────────────────────────────────────────────────────

function readFromStorage(): CosmicProfile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.map((p) => getAsCosmicProfile(p));
  } catch {
    return [];
  }
}

function writeToStorage(profiles: CosmicProfile[]): void {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch (err) {
    console.error('[profiles] Failed to persist profiles to localStorage:', err);
    throw err;
  }
}

function getStoredActiveId(): string | null {
  return localStorage.getItem(ACTIVE_PROFILE_KEY);
}

// ─── Public load (used by profileSync.ts) ────────────────────────────────────

export function loadAllProfiles(): CosmicProfile[] {
  return readFromStorage();
}

// ─── ID generation ───────────────────────────────────────────────────────────

export function generateProfileId(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  return `${slug || 'profile'}-${Date.now()}`;
}

// ─── Read operations ─────────────────────────────────────────────────────────

export function getProfileList(): ProfileMeta[] {
  return readFromStorage().map((p) => ({
    id: p.meta.id,
    name: p.meta.name,
    relationship: p.meta.relationship,
    dateOfBirth: p.meta.dateOfBirth,
    createdAt: p.meta.createdAt,
    lastViewedAt: p.meta.lastViewedAt,
  }));
}

export function getActiveProfileId(): string | null {
  const stored = getStoredActiveId();
  if (stored) {
    const profiles = readFromStorage();
    if (profiles.some((p) => p.meta.id === stored)) return stored;
  }
  const profiles = readFromStorage();
  return profiles.length > 0 ? profiles[0].meta.id : null;
}

export function getActiveCosmicProfile(): CosmicProfile | null {
  const id = getActiveProfileId();
  if (!id) return null;
  const profiles = readFromStorage();
  return profiles.find((p) => p.meta.id === id) ?? profiles[0] ?? null;
}

export function getCosmicProfileById(profileId: string): CosmicProfile | null {
  return readFromStorage().find((p) => p.meta.id === profileId) ?? null;
}

export function getActiveProfile(): AstroProfile | null {
  const cosmic = getActiveCosmicProfile();
  if (!cosmic) return null;
  return cosmicToAstroProfile(cosmic);
}

/** Legacy alias used by ProfileContext */
export function getProfile(): AstroProfile | null {
  return getActiveProfile();
}

export function getProfileById(profileId: string): AstroProfile | null {
  const cosmic = getCosmicProfileById(profileId);
  if (!cosmic) return null;
  return cosmicToAstroProfile(cosmic);
}

export function getProfileCount(): number {
  return readFromStorage().length;
}

export function canAddMoreProfiles(): boolean {
  return readFromStorage().length < MAX_PROFILES;
}

// ─── Write operations ────────────────────────────────────────────────────────

export function saveCosmicProfile(profile: CosmicProfile): { success: boolean; error?: string } {
  const profiles = readFromStorage();
  const idx = profiles.findIndex((p) => p.meta.id === profile.meta.id);

  if (idx >= 0) {
    profiles[idx] = profile;
  } else {
    if (profiles.length >= MAX_PROFILES) {
      return { success: false, error: `Maximum of ${MAX_PROFILES} profiles reached` };
    }
    profiles.push(profile);
  }

  writeToStorage(profiles);

  // Auto-activate if this is the first/only profile
  if (!getStoredActiveId() || profiles.length === 1) {
    localStorage.setItem(ACTIVE_PROFILE_KEY, profile.meta.id);
  }

  return { success: true };
}

export function saveProfile(
  profile: AstroProfile | CosmicProfile
): { success: boolean; error?: string } {
  return saveCosmicProfile(getAsCosmicProfile(profile));
}

export function setActiveProfile(profileId: string): CosmicProfile | null {
  const profile = getCosmicProfileById(profileId);
  if (!profile) return null;
  localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
  return profile;
}

export function deleteProfile(profileId: string): boolean {
  const profiles = readFromStorage();
  const filtered = profiles.filter((p) => p.meta.id !== profileId);
  if (filtered.length === profiles.length) return false;

  writeToStorage(filtered);

  // Reassign active if the deleted profile was active
  if (getStoredActiveId() === profileId) {
    const next = filtered[0];
    if (next) {
      localStorage.setItem(ACTIVE_PROFILE_KEY, next.meta.id);
    } else {
      localStorage.removeItem(ACTIVE_PROFILE_KEY);
    }
  }

  return true;
}

export function renameProfile(profileId: string, newName: string): boolean {
  const profiles = readFromStorage();
  const idx = profiles.findIndex((p) => p.meta.id === profileId);
  if (idx < 0) return false;

  profiles[idx] = { ...profiles[idx], meta: { ...profiles[idx].meta, name: newName } };
  writeToStorage(profiles);
  return true;
}

export function updateProfileRelationship(profileId: string, relationship: string): boolean {
  const profiles = readFromStorage();
  const idx = profiles.findIndex((p) => p.meta.id === profileId);
  if (idx < 0) return false;

  profiles[idx] = { ...profiles[idx], meta: { ...profiles[idx].meta, relationship } };
  writeToStorage(profiles);
  return true;
}

// ─── First-run seed ───────────────────────────────────────────────────────────

/**
 * Seeds default profiles into localStorage on first run.
 *
 * v1: Felipe | v2: + Duda | v3: + Catarina
 *
 * Cases:
 * - All seed flags present → no-op (fully seeded)
 * - Neither present (fresh install) → seed all profiles, activate Felipe
 * - Missing v2/v3 (existing user upgrading) → append missing profiles,
 *   leave active profile unchanged, set missing seed flags
 */
function seedDefaultProfileOnFirstRun(): void {
  try {
    if (typeof window === 'undefined') return;

    const hasSeedV1 = !!localStorage.getItem(SEED_KEY);
    const hasSeedV2 = !!localStorage.getItem(SEED_V2_KEY);
    const hasSeedV3 = !!localStorage.getItem(SEED_V3_KEY);

    if (hasSeedV1 && hasSeedV2 && hasSeedV3) return; // Fully seeded — no-op

    const dudaCosmic = getAsCosmicProfile(dudaData as unknown as AstroProfile);
    const catarinaCosmic = getAsCosmicProfile(catarinaData as unknown as AstroProfile);

    if (!hasSeedV1) {
      // Fresh install — seed all profiles
      const felipeCosmic = getAsCosmicProfile(felipeData as unknown as AstroProfile);
      const felipeSeeded: CosmicProfile = {
        ...felipeCosmic,
        meta: {
          ...felipeCosmic.meta,
          id: 'felipe-fraga',
          createdAt: '2024-10-18T08:10:00.000Z',
          lastViewedAt: new Date().toISOString(),
        },
      };

      writeToStorage([felipeSeeded, dudaCosmic, catarinaCosmic]);
      localStorage.setItem(ACTIVE_PROFILE_KEY, felipeSeeded.meta.id);
      localStorage.setItem(SEED_KEY, '1');
      localStorage.setItem(SEED_V2_KEY, '1');
      localStorage.setItem(SEED_V3_KEY, '1');
    } else {
      // Existing user — append missing profiles
      const profiles = readFromStorage();

      if (!hasSeedV2) {
        const dudaAlreadyExists = profiles.some((p) => p.meta.id === 'duda-fraga-19980119');
        if (!dudaAlreadyExists) {
          profiles.push(dudaCosmic);
        }
        localStorage.setItem(SEED_V2_KEY, '1');
      }

      if (!hasSeedV3) {
        const catarinaAlreadyExists = profiles.some((p) => p.meta.id === 'catarina-goldani-19930810');
        if (!catarinaAlreadyExists) {
          profiles.push(catarinaCosmic);
        }
        localStorage.setItem(SEED_V3_KEY, '1');
      }

      if (!hasSeedV2 || !hasSeedV3) {
        writeToStorage(profiles);
      }
    }
  } catch {
    // localStorage may be unavailable (SSR, strict privacy modes)
  }
}

seedDefaultProfileOnFirstRun();
