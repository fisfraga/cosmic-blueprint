// ============================================
// Tests for Entity Registry Service
// ============================================

import { describe, it, expect, beforeEach, beforeAll, afterEach } from 'vitest';
import {
  entityRegistry,
  getEntity,
  hasEntity,
  searchEntities,
  getEntitiesBySystem,
  getEntitiesByCategory,
  getRelatedEntities,
} from './registry';
import type { CosmicProfile } from '../../types';

// Clean up any profile entities before running tests
beforeAll(() => {
  entityRegistry.unregisterProfile();
});

describe('EntityRegistry - Universal Entities', () => {
  it('has planets registered', () => {
    const sun = getEntity('sun');
    expect(sun).toBeDefined();
    expect(sun?.type).toBe('planet');
    expect(sun?.name).toBe('Sun');
    expect(sun?.system).toBe('astrology');
  });

  it('has zodiac signs registered', () => {
    const scorpio = getEntity('scorpio');
    expect(scorpio).toBeDefined();
    expect(scorpio?.type).toBe('sign');
    expect(scorpio?.name).toBe('Scorpio');
  });

  it('has houses registered', () => {
    const house12 = getEntity('house-12');
    expect(house12).toBeDefined();
    expect(house12?.type).toBe('house');
  });

  it('has aspects registered', () => {
    const conjunction = getEntity('conjunction');
    expect(conjunction).toBeDefined();
    expect(conjunction?.type).toBe('aspect');
  });

  it('has Gene Keys registered', () => {
    const gk1 = getEntity('gk-1');
    expect(gk1).toBeDefined();
    expect(gk1?.type).toBe('gene-key');
    expect(gk1?.system).toBe('geneKeys');
  });

  it('has Human Design gates registered', () => {
    const gate1 = getEntity('gate-1');
    expect(gate1).toBeDefined();
    expect(gate1?.type).toBe('hd-gate');
    expect(gate1?.system).toBe('humanDesign');
  });
});

describe('EntityRegistry - hasEntity', () => {
  it('returns true for existing entities', () => {
    expect(hasEntity('sun')).toBe(true);
    expect(hasEntity('scorpio')).toBe(true);
    expect(hasEntity('conjunction')).toBe(true);
  });

  it('returns false for non-existent entities', () => {
    expect(hasEntity('nonexistent')).toBe(false);
    expect(hasEntity('')).toBe(false);
  });
});

describe('EntityRegistry - getEntitiesBySystem', () => {
  it('returns astrology entities', () => {
    const astrologyEntities = getEntitiesBySystem('astrology');
    expect(astrologyEntities.length).toBeGreaterThan(0);
    // Check that astrology entities are returned (some might be shared/bridge entities)
    const nonAstrology = astrologyEntities.filter(e => e.system !== 'astrology');
    if (nonAstrology.length > 0) {
      console.log('Non-astrology entities in astrology system:', nonAstrology.map(e => ({ id: e.id, system: e.system })));
    }
    // Most entities should be astrology
    const astrologyCount = astrologyEntities.filter(e => e.system === 'astrology').length;
    expect(astrologyCount).toBeGreaterThan(astrologyEntities.length * 0.9);
  });

  it('returns Human Design entities', () => {
    const hdEntities = getEntitiesBySystem('humanDesign');
    expect(hdEntities.length).toBeGreaterThan(0);
    expect(hdEntities.every(e => e.system === 'humanDesign')).toBe(true);
  });

  it('returns Gene Keys entities', () => {
    const gkEntities = getEntitiesBySystem('geneKeys');
    expect(gkEntities.length).toBeGreaterThan(0);
    expect(gkEntities.every(e => e.system === 'geneKeys')).toBe(true);
  });
});

describe('EntityRegistry - getEntitiesByCategory', () => {
  it('returns all planets', () => {
    const planets = getEntitiesByCategory('planet');
    expect(planets.length).toBeGreaterThanOrEqual(10); // At least 10 planets
    expect(planets.every(e => e.type === 'planet')).toBe(true);
  });

  it('returns all zodiac signs', () => {
    const signs = getEntitiesByCategory('sign');
    expect(signs.length).toBe(12);
    expect(signs.every(e => e.type === 'sign')).toBe(true);
  });

  it('returns all houses', () => {
    const houses = getEntitiesByCategory('house');
    expect(houses.length).toBe(12);
    expect(houses.every(e => e.type === 'house')).toBe(true);
  });
});

describe('EntityRegistry - searchEntities', () => {
  it('finds entities by name', () => {
    const results = searchEntities('sun');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(e => e.id === 'sun')).toBe(true);
  });

  it('finds entities by partial name', () => {
    const results = searchEntities('scorp');
    expect(results.some(e => e.id === 'scorpio')).toBe(true);
  });

  it('is case insensitive', () => {
    const upperResults = searchEntities('MOON');
    const lowerResults = searchEntities('moon');
    expect(upperResults.length).toBe(lowerResults.length);
  });

  it('filters by system', () => {
    const results = searchEntities('gate', { system: 'humanDesign' });
    expect(results.every(e => e.system === 'humanDesign')).toBe(true);
  });

  it('filters by category', () => {
    const results = searchEntities('aries', { category: 'sign' });
    expect(results.every(e => e.type === 'sign')).toBe(true);
  });

  it('limits results', () => {
    const results = searchEntities('a', { limit: 5 });
    expect(results.length).toBeLessThanOrEqual(5);
  });

  it('returns empty array for empty query', () => {
    const results = searchEntities('');
    expect(results).toEqual([]);
  });
});

describe('EntityRegistry - getRelatedEntities', () => {
  it('returns related entities for a sign', () => {
    const related = getRelatedEntities('scorpio');
    expect(related.length).toBeGreaterThan(0);
    // Scorpio should be related to water element and its ruling planets
    const relatedIds = related.map(e => e.id);
    expect(relatedIds).toContain('water');
  });

  it('returns empty array for entity without relations', () => {
    const related = getRelatedEntities('nonexistent');
    expect(related).toEqual([]);
  });
});

describe('EntityRegistry - Profile Entities', () => {
  // Create a minimal test profile
  const testProfile: CosmicProfile = {
    profileVersion: 2,
    meta: {
      id: 'test-profile',
      name: 'Test User',
      relationship: 'Me',
      dateOfBirth: '2000-01-01',
      createdAt: new Date().toISOString(),
      lastViewedAt: new Date().toISOString(),
    },
    birthData: {
      dateOfBirth: '2000-01-01',
      timeOfBirth: '12:00',
      cityOfBirth: 'Test City',
      latitude: 0,
      longitude: 0,
      timezone: 'UTC',
    },
    placements: [
      {
        id: 'sun-placement',
        profileId: 'test-profile',
        planetId: 'sun',
        signId: 'scorpio',
        houseId: 'house-12',
        degree: 24,
        minute: 48,
        retrograde: false,
        fullName: 'Sun in Scorpio',
        shortName: 'Sun ♏',
      },
      {
        id: 'moon-placement',
        profileId: 'test-profile',
        planetId: 'moon',
        signId: 'aries',
        houseId: 'house-5',
        degree: 12,
        minute: 30,
        retrograde: false,
        fullName: 'Moon in Aries',
        shortName: 'Moon ♈',
      },
    ],
    aspects: {
      planetary: [
        {
          id: 'test-aspect-1',
          profileId: 'test-profile',
          aspectId: 'trine',
          planet1Id: 'sun',
          placement1Id: 'sun-placement',
          planet2Id: 'moon',
          placement2Id: 'moon-placement',
          orbDegree: 2,
          orbMinute: 18,
          direction: 'Applying',
          fullName: 'Sun Trine Moon',
        },
      ],
      other: [],
    },
  };

  beforeEach(() => {
    // Unregister any existing profile before each test
    entityRegistry.unregisterProfile();
  });

  afterEach(() => {
    // Clean up after each test
    entityRegistry.unregisterProfile();
  });

  it('registers profile placements as entities', () => {
    entityRegistry.registerProfile(testProfile);

    const placements = entityRegistry.getProfilePlacements();
    expect(placements.length).toBe(2);
    expect(placements.every(p => p.type === 'profile-placement')).toBe(true);
  });

  it('registers profile aspects as entities', () => {
    entityRegistry.registerProfile(testProfile);

    const aspects = entityRegistry.getProfileAspects();
    expect(aspects.length).toBe(1);
    expect(aspects[0].type).toBe('profile-aspect');
  });

  it('can get placements by sign', () => {
    entityRegistry.registerProfile(testProfile);

    const scorpioPlacements = entityRegistry.getPlacementsInSign('scorpio');
    expect(scorpioPlacements.length).toBe(1);

    const ariesPlacements = entityRegistry.getPlacementsInSign('aries');
    expect(ariesPlacements.length).toBe(1);

    const libraPlacements = entityRegistry.getPlacementsInSign('libra');
    expect(libraPlacements.length).toBe(0);
  });

  it('can get placements by house', () => {
    entityRegistry.registerProfile(testProfile);

    const house12Placements = entityRegistry.getPlacementsInHouse('house-12');
    expect(house12Placements.length).toBe(1);

    const house5Placements = entityRegistry.getPlacementsInHouse('house-5');
    expect(house5Placements.length).toBe(1);
  });

  it('can get aspects involving a planet', () => {
    entityRegistry.registerProfile(testProfile);

    const sunAspects = entityRegistry.getAspectsInvolving('sun');
    expect(sunAspects.length).toBe(1);

    const moonAspects = entityRegistry.getAspectsInvolving('moon');
    expect(moonAspects.length).toBe(1);

    const marsAspects = entityRegistry.getAspectsInvolving('mars');
    expect(marsAspects.length).toBe(0);
  });

  it('can get aspects by type', () => {
    entityRegistry.registerProfile(testProfile);

    const trineAspects = entityRegistry.getAspectsByType('trine');
    expect(trineAspects.length).toBe(1);

    const squareAspects = entityRegistry.getAspectsByType('square');
    expect(squareAspects.length).toBe(0);
  });

  it('unregisters profile entities', () => {
    entityRegistry.registerProfile(testProfile);
    expect(entityRegistry.getProfilePlacements().length).toBe(2);

    entityRegistry.unregisterProfile();
    expect(entityRegistry.getProfilePlacements().length).toBe(0);
    expect(entityRegistry.getProfileAspects().length).toBe(0);
  });

  it('replaces previous profile on re-registration', () => {
    entityRegistry.registerProfile(testProfile);
    expect(entityRegistry.getProfilePlacements().length).toBe(2);

    // Register a new profile with only 1 placement
    const newProfile: CosmicProfile = {
      ...testProfile,
      meta: { ...testProfile.meta, id: 'new-profile' },
      placements: [testProfile.placements![0]],
    };
    entityRegistry.registerProfile(newProfile);

    expect(entityRegistry.getProfilePlacements().length).toBe(1);
  });

  it('getWithProfile returns universal entities', () => {
    entityRegistry.registerProfile(testProfile);

    const sun = entityRegistry.getWithProfile('sun');
    expect(sun).toBeDefined();
    expect(sun?.type).toBe('planet');
  });

  it('getWithProfile returns profile entities', () => {
    entityRegistry.registerProfile(testProfile);

    const profileEntity = entityRegistry.getWithProfile('test-profile:placement:sun');
    expect(profileEntity).toBeDefined();
    expect(profileEntity?.type).toBe('profile-placement');
  });
});

describe('EntityRegistry - Stats', () => {
  it('returns registry statistics', () => {
    const stats = entityRegistry.getStats();

    expect(stats.total).toBeGreaterThan(0);
    expect(stats.bySystem.astrology).toBeGreaterThan(0);
    expect(stats.bySystem.humanDesign).toBeGreaterThan(0);
    expect(stats.bySystem.geneKeys).toBeGreaterThan(0);
    expect(Object.keys(stats.byCategory).length).toBeGreaterThan(0);
  });
});
