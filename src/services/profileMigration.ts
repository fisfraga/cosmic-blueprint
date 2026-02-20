/**
 * Profile Migration Service
 *
 * Handles migration from legacy AstroProfile format to new CosmicProfile format.
 * The new format separates immutable birth data from calculated chart data.
 */

import type {
  AstroProfile,
  CosmicProfile,
  BirthData,
  ProfileMeta,
} from '../types';

// Storage version constants
export const CURRENT_PROFILE_VERSION = 2;
export const LEGACY_PROFILE_VERSION = 1;

/**
 * Check if a profile is in the new CosmicProfile format
 */
export function isCosmicProfile(profile: unknown): profile is CosmicProfile {
  return (
    typeof profile === 'object' &&
    profile !== null &&
    'profileVersion' in profile &&
    (profile as CosmicProfile).profileVersion === CURRENT_PROFILE_VERSION
  );
}

/**
 * Check if a profile is in the legacy AstroProfile format
 */
export function isLegacyProfile(profile: unknown): profile is AstroProfile {
  return (
    typeof profile === 'object' &&
    profile !== null &&
    'id' in profile &&
    'dateOfBirth' in profile &&
    !('profileVersion' in profile)
  );
}

/**
 * Extract BirthData from an AstroProfile
 */
export function extractBirthData(profile: AstroProfile): BirthData {
  return {
    dateOfBirth: profile.dateOfBirth,
    timeOfBirth: profile.timeOfBirth,
    timezone: profile.coordinates?.timezone || 'UTC',
    latitude: profile.coordinates?.latitude || 0,
    longitude: profile.coordinates?.longitude || 0,
    cityOfBirth: profile.cityOfBirth,
  };
}

/**
 * Extract ProfileMeta from an AstroProfile
 */
export function extractProfileMeta(
  profile: AstroProfile & { createdAt?: string; lastViewedAt?: string }
): ProfileMeta {
  return {
    id: profile.id,
    name: profile.name,
    relationship: profile.relationship || 'Me',
    dateOfBirth: profile.dateOfBirth,
    createdAt: profile.createdAt || new Date().toISOString(),
    lastViewedAt: profile.lastViewedAt || new Date().toISOString(),
  };
}

/**
 * Migrate a legacy AstroProfile to the new CosmicProfile format
 *
 * This preserves all existing data while reorganizing it into the new structure.
 * The migration is non-destructive - all original data is kept.
 */
export function migrateToCosmicProfile(
  legacy: AstroProfile & { createdAt?: string; lastViewedAt?: string }
): CosmicProfile {
  const birthData = extractBirthData(legacy);
  const meta = extractProfileMeta(legacy);

  return {
    profileVersion: CURRENT_PROFILE_VERSION,
    meta,
    birthData,

    // Preserve existing calculated data
    geneKeysProfile: legacy.geneKeysProfile,
    humanDesignProfile: legacy.humanDesignProfile,

    // Preserve astrology data
    placements: legacy.placements,
    housePositions: legacy.housePositions,
    aspects: legacy.aspects,
    configurations: legacy.configurations,
    elementalAnalysis: legacy.elementalAnalysis,
    chartRulers: legacy.chartRulers,

    // Note: calculatedChart will be populated on first recalculation
  };
}

/**
 * Convert CosmicProfile back to AstroProfile format for backwards compatibility
 *
 * This allows components that haven't been updated to still work with the old format.
 */
export function cosmicToAstroProfile(cosmic: CosmicProfile): AstroProfile {
  return {
    id: cosmic.meta.id,
    name: cosmic.meta.name,
    relationship: cosmic.meta.relationship,
    dateOfBirth: cosmic.birthData.dateOfBirth,
    timeOfBirth: cosmic.birthData.timeOfBirth,
    cityOfBirth: cosmic.birthData.cityOfBirth,
    coordinates: {
      latitude: cosmic.birthData.latitude,
      longitude: cosmic.birthData.longitude,
      timezone: cosmic.birthData.timezone,
    },
    placements: cosmic.placements || [],
    housePositions: cosmic.housePositions || [],
    aspects: cosmic.aspects || { planetary: [], other: [] },
    configurations: cosmic.configurations || [],
    elementalAnalysis: cosmic.elementalAnalysis || {
      id: '',
      profileId: cosmic.meta.id,
      fire: 0,
      earth: 0,
      air: 0,
      water: 0,
      firePlanetIds: [],
      earthPlanetIds: [],
      airPlanetIds: [],
      waterPlanetIds: [],
      dominant: '',
      deficient: '',
    },
    chartRulers: cosmic.chartRulers || { traditional: '', modern: '' },
    geneKeysProfile: cosmic.geneKeysProfile,
    humanDesignProfile: cosmic.humanDesignProfile,
  };
}

/**
 * Get a profile in AstroProfile format, regardless of storage format
 *
 * This is a helper for backwards compatibility during the transition period.
 */
export function getAsAstroProfile(
  profile: AstroProfile | CosmicProfile
): AstroProfile {
  if (isCosmicProfile(profile)) {
    return cosmicToAstroProfile(profile);
  }
  return profile;
}

/**
 * Get a profile in CosmicProfile format, migrating if necessary
 */
export function getAsCosmicProfile(
  profile: AstroProfile | CosmicProfile
): CosmicProfile {
  if (isCosmicProfile(profile)) {
    return profile;
  }
  return migrateToCosmicProfile(profile as AstroProfile & { createdAt?: string; lastViewedAt?: string });
}

/**
 * Check if a profile needs migration
 */
export function needsMigration(profile: unknown): boolean {
  return isLegacyProfile(profile) && !isCosmicProfile(profile);
}

/**
 * Migrate all profiles in storage to the new format
 */
export function migrateAllProfiles(
  profiles: (AstroProfile | CosmicProfile)[]
): CosmicProfile[] {
  return profiles.map((profile) => getAsCosmicProfile(profile));
}
