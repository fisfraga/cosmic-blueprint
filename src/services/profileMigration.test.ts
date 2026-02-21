// ============================================
// Tests for Profile Migration Service
// ============================================

import { describe, it, expect } from 'vitest';
import {
  isCosmicProfile,
  isLegacyProfile,
  extractBirthData,
  extractProfileMeta,
  migrateToCosmicProfile,
  cosmicToAstroProfile,
  getAsAstroProfile,
  getAsCosmicProfile,
  needsMigration,
  migrateAllProfiles,
  CURRENT_PROFILE_VERSION,
  LEGACY_PROFILE_VERSION,
} from './profileMigration';
import type { AstroProfile, CosmicProfile } from '../types';

// ─── Test Helpers ───────────────────────────────────────────────────────────

function makeLegacyProfile(overrides: Partial<AstroProfile & { createdAt?: string; lastViewedAt?: string }> = {}): AstroProfile & { createdAt?: string; lastViewedAt?: string } {
  return {
    id: 'legacy-1',
    name: 'Legacy User',
    relationship: 'Me',
    dateOfBirth: '1994-10-18',
    timeOfBirth: '08:10',
    cityOfBirth: 'Sao Paulo',
    coordinates: {
      latitude: -23.5505,
      longitude: -46.6333,
      timezone: 'America/Sao_Paulo',
    },
    placements: [],
    housePositions: [],
    aspects: { planetary: [], other: [] },
    configurations: [],
    elementalAnalysis: {
      id: 'ea-1',
      profileId: 'legacy-1',
      fire: 3,
      earth: 2,
      air: 4,
      water: 1,
      firePlanetIds: ['mars', 'sun', 'jupiter'],
      earthPlanetIds: ['venus', 'saturn'],
      airPlanetIds: ['mercury', 'uranus', 'pluto', 'moon'],
      waterPlanetIds: ['neptune'],
      dominant: 'air',
      deficient: 'water',
    },
    chartRulers: { traditional: 'venus', modern: 'uranus' },
    createdAt: '2024-01-01T00:00:00.000Z',
    lastViewedAt: '2024-06-15T12:00:00.000Z',
    ...overrides,
  };
}

function makeCosmicProfile(overrides: Partial<CosmicProfile> = {}): CosmicProfile {
  return {
    profileVersion: 2,
    meta: {
      id: 'cosmic-1',
      name: 'Cosmic User',
      relationship: 'Me',
      dateOfBirth: '1994-10-18',
      createdAt: '2024-01-01T00:00:00.000Z',
      lastViewedAt: '2024-06-15T12:00:00.000Z',
    },
    birthData: {
      dateOfBirth: '1994-10-18',
      timeOfBirth: '08:10',
      timezone: 'America/Sao_Paulo',
      latitude: -23.5505,
      longitude: -46.6333,
      cityOfBirth: 'Sao Paulo',
    },
    ...overrides,
  } as CosmicProfile;
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('Profile Migration Service', () => {
  describe('constants', () => {
    it('has correct version numbers', () => {
      expect(CURRENT_PROFILE_VERSION).toBe(2);
      expect(LEGACY_PROFILE_VERSION).toBe(1);
    });
  });

  describe('isCosmicProfile', () => {
    it('returns true for v2 CosmicProfile', () => {
      const profile = makeCosmicProfile();
      expect(isCosmicProfile(profile)).toBe(true);
    });

    it('returns false for legacy AstroProfile', () => {
      const profile = makeLegacyProfile();
      expect(isCosmicProfile(profile)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isCosmicProfile(null)).toBe(false);
    });

    it('returns false for non-object', () => {
      expect(isCosmicProfile('string')).toBe(false);
      expect(isCosmicProfile(42)).toBe(false);
    });

    it('returns false for object with wrong version', () => {
      expect(isCosmicProfile({ profileVersion: 1 })).toBe(false);
      expect(isCosmicProfile({ profileVersion: 3 })).toBe(false);
    });
  });

  describe('isLegacyProfile', () => {
    it('returns true for legacy profile with id and dateOfBirth', () => {
      const profile = makeLegacyProfile();
      expect(isLegacyProfile(profile)).toBe(true);
    });

    it('returns false for CosmicProfile', () => {
      const profile = makeCosmicProfile();
      expect(isLegacyProfile(profile)).toBe(false);
    });

    it('returns false for null', () => {
      expect(isLegacyProfile(null)).toBe(false);
    });

    it('returns false for objects without required fields', () => {
      expect(isLegacyProfile({ id: 'x' })).toBe(false);
      expect(isLegacyProfile({ dateOfBirth: '2000-01-01' })).toBe(false);
    });
  });

  describe('extractBirthData', () => {
    it('extracts birth data from legacy profile', () => {
      const profile = makeLegacyProfile();
      const birthData = extractBirthData(profile);

      expect(birthData.dateOfBirth).toBe('1994-10-18');
      expect(birthData.timeOfBirth).toBe('08:10');
      expect(birthData.timezone).toBe('America/Sao_Paulo');
      expect(birthData.latitude).toBe(-23.5505);
      expect(birthData.longitude).toBe(-46.6333);
      expect(birthData.cityOfBirth).toBe('Sao Paulo');
    });

    it('defaults to UTC when coordinates are missing', () => {
      const profile = makeLegacyProfile({ coordinates: undefined });
      const birthData = extractBirthData(profile);

      expect(birthData.timezone).toBe('UTC');
      expect(birthData.latitude).toBe(0);
      expect(birthData.longitude).toBe(0);
    });
  });

  describe('extractProfileMeta', () => {
    it('extracts profile metadata', () => {
      const profile = makeLegacyProfile();
      const meta = extractProfileMeta(profile);

      expect(meta.id).toBe('legacy-1');
      expect(meta.name).toBe('Legacy User');
      expect(meta.relationship).toBe('Me');
      expect(meta.dateOfBirth).toBe('1994-10-18');
      expect(meta.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(meta.lastViewedAt).toBe('2024-06-15T12:00:00.000Z');
    });

    it('defaults relationship to "Me" when missing', () => {
      const profile = makeLegacyProfile({ relationship: undefined });
      const meta = extractProfileMeta(profile);
      expect(meta.relationship).toBe('Me');
    });

    it('generates createdAt when missing', () => {
      const profile = makeLegacyProfile({ createdAt: undefined });
      const meta = extractProfileMeta(profile);
      expect(meta.createdAt).toBeTruthy();
      // Should be a valid ISO date
      expect(new Date(meta.createdAt).getTime()).not.toBeNaN();
    });

    it('generates lastViewedAt when missing', () => {
      const profile = makeLegacyProfile({ lastViewedAt: undefined });
      const meta = extractProfileMeta(profile);
      expect(meta.lastViewedAt).toBeTruthy();
      expect(new Date(meta.lastViewedAt).getTime()).not.toBeNaN();
    });
  });

  describe('migrateToCosmicProfile (v1 to v2)', () => {
    it('creates CosmicProfile with correct version', () => {
      const legacy = makeLegacyProfile();
      const cosmic = migrateToCosmicProfile(legacy);

      expect(cosmic.profileVersion).toBe(2);
    });

    it('preserves meta information', () => {
      const legacy = makeLegacyProfile();
      const cosmic = migrateToCosmicProfile(legacy);

      expect(cosmic.meta.id).toBe('legacy-1');
      expect(cosmic.meta.name).toBe('Legacy User');
      expect(cosmic.meta.relationship).toBe('Me');
    });

    it('separates birth data into birthData field', () => {
      const legacy = makeLegacyProfile();
      const cosmic = migrateToCosmicProfile(legacy);

      expect(cosmic.birthData.dateOfBirth).toBe('1994-10-18');
      expect(cosmic.birthData.timeOfBirth).toBe('08:10');
      expect(cosmic.birthData.timezone).toBe('America/Sao_Paulo');
      expect(cosmic.birthData.latitude).toBe(-23.5505);
      expect(cosmic.birthData.longitude).toBe(-46.6333);
      expect(cosmic.birthData.cityOfBirth).toBe('Sao Paulo');
    });

    it('preserves astrology placements', () => {
      const legacy = makeLegacyProfile();
      const cosmic = migrateToCosmicProfile(legacy);

      expect(cosmic.placements).toEqual(legacy.placements);
      expect(cosmic.housePositions).toEqual(legacy.housePositions);
      expect(cosmic.aspects).toEqual(legacy.aspects);
      expect(cosmic.configurations).toEqual(legacy.configurations);
    });

    it('preserves elemental analysis', () => {
      const legacy = makeLegacyProfile();
      const cosmic = migrateToCosmicProfile(legacy);

      expect(cosmic.elementalAnalysis?.dominant).toBe('air');
      expect(cosmic.elementalAnalysis?.deficient).toBe('water');
    });

    it('preserves chart rulers', () => {
      const legacy = makeLegacyProfile();
      const cosmic = migrateToCosmicProfile(legacy);

      expect(cosmic.chartRulers?.traditional).toBe('venus');
      expect(cosmic.chartRulers?.modern).toBe('uranus');
    });

    it('preserves Gene Keys profile when present', () => {
      const gkProfile = {
        lifesWork: { sphereName: "Life's Work", geneKeyId: 'gk-42', geneKeyNumber: 42, line: 3, planetarySource: 'Natal Sun' },
        evolution: { sphereName: 'Evolution', geneKeyId: 'gk-31', geneKeyNumber: 31, line: 1, planetarySource: 'Natal Earth' },
        radiance: { sphereName: 'Radiance', geneKeyId: 'gk-50', geneKeyNumber: 50, line: 5, planetarySource: 'Design Sun' },
        purpose: { sphereName: 'Purpose', geneKeyId: 'gk-3', geneKeyNumber: 3, line: 2, planetarySource: 'Design Earth' },
        attraction: { sphereName: 'Attraction', geneKeyId: 'gk-36', geneKeyNumber: 36, line: 4, planetarySource: 'Design Moon' },
        iq: { sphereName: 'IQ', geneKeyId: 'gk-22', geneKeyNumber: 22, line: 6, planetarySource: 'Natal Venus' },
        eq: { sphereName: 'EQ', geneKeyId: 'gk-36', geneKeyNumber: 36, line: 1, planetarySource: 'Natal Mars' },
        sq: { sphereName: 'SQ', geneKeyId: 'gk-22', geneKeyNumber: 22, line: 3, planetarySource: 'Design Venus' },
        core: { sphereName: 'Core', geneKeyId: 'gk-25', geneKeyNumber: 25, line: 2, planetarySource: 'Design Mars' },
        vocation: { sphereName: 'Vocation', geneKeyId: 'gk-25', geneKeyNumber: 25, line: 2, planetarySource: 'Design Mars' },
        culture: { sphereName: 'Culture', geneKeyId: 'gk-7', geneKeyNumber: 7, line: 4, planetarySource: 'Design Jupiter' },
        pearl: { sphereName: 'Pearl', geneKeyId: 'gk-46', geneKeyNumber: 46, line: 5, planetarySource: 'Natal Jupiter' },
      };

      const legacy = makeLegacyProfile({ geneKeysProfile: gkProfile });
      const cosmic = migrateToCosmicProfile(legacy);

      expect(cosmic.geneKeysProfile).toBeTruthy();
      expect(cosmic.geneKeysProfile!.lifesWork.geneKeyNumber).toBe(42);
    });

    it('preserves Human Design profile when present', () => {
      const hdProfile = {
        type: 'Projector' as const,
        strategy: 'Wait for Invitation' as const,
        authority: 'Splenic' as const,
        profile: '5/1' as const,
        definition: 'Single' as const,
        personalityGates: [],
        designGates: [],
        definedCenterIds: [],
        definedChannelIds: [],
      };

      const legacy = makeLegacyProfile({ humanDesignProfile: hdProfile });
      const cosmic = migrateToCosmicProfile(legacy);

      expect(cosmic.humanDesignProfile).toBeTruthy();
      expect(cosmic.humanDesignProfile!.type).toBe('Projector');
      expect(cosmic.humanDesignProfile!.strategy).toBe('Wait for Invitation');
    });
  });

  describe('cosmicToAstroProfile', () => {
    it('converts CosmicProfile back to AstroProfile format', () => {
      const cosmic = makeCosmicProfile();
      const astro = cosmicToAstroProfile(cosmic);

      expect(astro.id).toBe('cosmic-1');
      expect(astro.name).toBe('Cosmic User');
      expect(astro.relationship).toBe('Me');
      expect(astro.dateOfBirth).toBe('1994-10-18');
      expect(astro.timeOfBirth).toBe('08:10');
      expect(astro.cityOfBirth).toBe('Sao Paulo');
    });

    it('reconstructs coordinates object', () => {
      const cosmic = makeCosmicProfile();
      const astro = cosmicToAstroProfile(cosmic);

      expect(astro.coordinates?.latitude).toBe(-23.5505);
      expect(astro.coordinates?.longitude).toBe(-46.6333);
      expect(astro.coordinates?.timezone).toBe('America/Sao_Paulo');
    });

    it('provides default values for missing optional fields', () => {
      const cosmic = makeCosmicProfile();
      // cosmic has no placements, aspects, etc.
      const astro = cosmicToAstroProfile(cosmic);

      expect(astro.placements).toEqual([]);
      expect(astro.housePositions).toEqual([]);
      expect(astro.aspects).toEqual({ planetary: [], other: [] });
      expect(astro.configurations).toEqual([]);
      expect(astro.chartRulers).toEqual({ traditional: '', modern: '' });
    });

    it('provides default elemental analysis when missing', () => {
      const cosmic = makeCosmicProfile();
      const astro = cosmicToAstroProfile(cosmic);

      expect(astro.elementalAnalysis).toBeTruthy();
      expect(astro.elementalAnalysis.profileId).toBe('cosmic-1');
      expect(astro.elementalAnalysis.fire).toBe(0);
    });
  });

  describe('getAsCosmicProfile', () => {
    it('returns CosmicProfile as-is when already v2', () => {
      const cosmic = makeCosmicProfile();
      const result = getAsCosmicProfile(cosmic);

      expect(result).toBe(cosmic); // Same reference
      expect(result.profileVersion).toBe(2);
    });

    it('migrates legacy profile to CosmicProfile', () => {
      const legacy = makeLegacyProfile();
      const result = getAsCosmicProfile(legacy);

      expect(result.profileVersion).toBe(2);
      expect(result.meta.id).toBe('legacy-1');
      expect(result.birthData.dateOfBirth).toBe('1994-10-18');
    });
  });

  describe('getAsAstroProfile', () => {
    it('converts CosmicProfile to AstroProfile', () => {
      const cosmic = makeCosmicProfile();
      const result = getAsAstroProfile(cosmic);

      expect(result.id).toBe('cosmic-1');
      expect(result.dateOfBirth).toBe('1994-10-18');
    });

    it('returns AstroProfile as-is when already legacy', () => {
      const legacy = makeLegacyProfile();
      const result = getAsAstroProfile(legacy);

      expect(result).toBe(legacy); // Same reference
    });
  });

  describe('needsMigration', () => {
    it('returns true for legacy profiles', () => {
      const legacy = makeLegacyProfile();
      expect(needsMigration(legacy)).toBe(true);
    });

    it('returns false for CosmicProfiles', () => {
      const cosmic = makeCosmicProfile();
      expect(needsMigration(cosmic)).toBe(false);
    });

    it('returns false for null/undefined', () => {
      expect(needsMigration(null)).toBe(false);
      expect(needsMigration(undefined)).toBe(false);
    });
  });

  describe('migrateAllProfiles', () => {
    it('migrates array of mixed profiles', () => {
      const legacy = makeLegacyProfile();
      const cosmic = makeCosmicProfile();

      const result = migrateAllProfiles([legacy, cosmic]);

      expect(result).toHaveLength(2);
      result.forEach(p => {
        expect(p.profileVersion).toBe(2);
      });
    });

    it('handles empty array', () => {
      const result = migrateAllProfiles([]);
      expect(result).toEqual([]);
    });
  });

  describe('round-trip migration', () => {
    it('preserves data through legacy -> cosmic -> astro cycle', () => {
      const legacy = makeLegacyProfile();
      const cosmic = migrateToCosmicProfile(legacy);
      const backToAstro = cosmicToAstroProfile(cosmic);

      expect(backToAstro.id).toBe(legacy.id);
      expect(backToAstro.name).toBe(legacy.name);
      expect(backToAstro.dateOfBirth).toBe(legacy.dateOfBirth);
      expect(backToAstro.timeOfBirth).toBe(legacy.timeOfBirth);
      expect(backToAstro.cityOfBirth).toBe(legacy.cityOfBirth);
      expect(backToAstro.coordinates?.latitude).toBe(legacy.coordinates?.latitude);
      expect(backToAstro.coordinates?.longitude).toBe(legacy.coordinates?.longitude);
      expect(backToAstro.coordinates?.timezone).toBe(legacy.coordinates?.timezone);
    });

    it('preserves elemental analysis through round-trip', () => {
      const legacy = makeLegacyProfile();
      const cosmic = migrateToCosmicProfile(legacy);
      const backToAstro = cosmicToAstroProfile(cosmic);

      expect(backToAstro.elementalAnalysis.dominant).toBe(legacy.elementalAnalysis.dominant);
      expect(backToAstro.elementalAnalysis.deficient).toBe(legacy.elementalAnalysis.deficient);
      expect(backToAstro.elementalAnalysis.fire).toBe(legacy.elementalAnalysis.fire);
    });

    it('preserves chart rulers through round-trip', () => {
      const legacy = makeLegacyProfile();
      const cosmic = migrateToCosmicProfile(legacy);
      const backToAstro = cosmicToAstroProfile(cosmic);

      expect(backToAstro.chartRulers.traditional).toBe(legacy.chartRulers.traditional);
      expect(backToAstro.chartRulers.modern).toBe(legacy.chartRulers.modern);
    });
  });
});
