// ============================================
// Tests for Aspect Prioritization Utilities
// ============================================

import { describe, it, expect } from 'vitest';
import {
  calculateAspectPriority,
  sortAspectsByPriority,
  getTopAspects,
  getAspectPriorityTier,
  groupAspectsByNature,
  groupAspectsByPriorityTier,
  filterAspectsByPlanets,
  filterAspectsByType,
  MAJOR_ASPECT_IDS,
  MINOR_ASPECT_IDS,
} from './aspects';
import type { NatalAspect } from '../types';

// Helper to create test aspects
function createAspect(overrides: Partial<NatalAspect> = {}): NatalAspect {
  return {
    id: 'test-aspect',
    profileId: 'test-profile',
    aspectId: 'conjunction',
    planet1Id: 'mars',
    placement1Id: 'mars',
    planet2Id: 'jupiter',
    placement2Id: 'jupiter',
    orbDegree: 2,
    orbMinute: 30,
    direction: 'Applying',
    fullName: 'Mars Conjunction Jupiter',
    ...overrides,
  };
}

describe('calculateAspectPriority', () => {
  it('gives highest priority to Sun-Moon aspects', () => {
    const sunMoonAspect = createAspect({
      planet1Id: 'sun',
      planet2Id: 'moon',
      aspectId: 'conjunction',
      orbDegree: 0,
    });
    const priority = calculateAspectPriority(sunMoonAspect);
    // Sun (30) + Moon (30) + conjunction (20) + orb 0 (10) = 90
    expect(priority).toBe(90);
  });

  it('prioritizes Ascendant/MC involvement', () => {
    const ascendantAspect = createAspect({
      planet1Id: 'ascendant',
      planet2Id: 'mars',
      aspectId: 'conjunction',
      orbDegree: 1,
    });
    const priority = calculateAspectPriority(ascendantAspect);
    // Ascendant (25) + Mars personal (5) + conjunction (20) + orb 1 (9) = 59
    expect(priority).toBe(59);
  });

  it('weights aspect types correctly', () => {
    const conjunction = createAspect({ aspectId: 'conjunction', orbDegree: 5 });
    const opposition = createAspect({ aspectId: 'opposition', orbDegree: 5 });
    const square = createAspect({ aspectId: 'square', orbDegree: 5 });
    const trine = createAspect({ aspectId: 'trine', orbDegree: 5 });
    const sextile = createAspect({ aspectId: 'sextile', orbDegree: 5 });

    expect(calculateAspectPriority(conjunction)).toBeGreaterThan(calculateAspectPriority(opposition));
    expect(calculateAspectPriority(opposition)).toBeGreaterThan(calculateAspectPriority(square));
    expect(calculateAspectPriority(square)).toBeGreaterThan(calculateAspectPriority(trine));
    expect(calculateAspectPriority(trine)).toBeGreaterThan(calculateAspectPriority(sextile));
  });

  it('prioritizes tighter orbs', () => {
    const tightOrb = createAspect({ orbDegree: 0 });
    const wideOrb = createAspect({ orbDegree: 8 });

    expect(calculateAspectPriority(tightOrb)).toBeGreaterThan(calculateAspectPriority(wideOrb));
  });

  it('adds bonus for personal planets', () => {
    const personalPlanet = createAspect({ planet1Id: 'venus', planet2Id: 'mars' });
    const outerPlanet = createAspect({ planet1Id: 'uranus', planet2Id: 'neptune' });

    expect(calculateAspectPriority(personalPlanet)).toBeGreaterThan(calculateAspectPriority(outerPlanet));
  });
});

describe('sortAspectsByPriority', () => {
  it('sorts aspects by priority (highest first)', () => {
    const aspects = [
      createAspect({ id: 'low', planet1Id: 'uranus', planet2Id: 'neptune', aspectId: 'sextile', orbDegree: 8 }),
      createAspect({ id: 'high', planet1Id: 'sun', planet2Id: 'moon', aspectId: 'conjunction', orbDegree: 0 }),
      createAspect({ id: 'medium', planet1Id: 'venus', planet2Id: 'mars', aspectId: 'square', orbDegree: 3 }),
    ];

    const sorted = sortAspectsByPriority(aspects);

    expect(sorted[0].id).toBe('high');
    expect(sorted[1].id).toBe('medium');
    expect(sorted[2].id).toBe('low');
  });

  it('does not mutate the original array', () => {
    const aspects = [
      createAspect({ id: 'a', orbDegree: 5 }),
      createAspect({ id: 'b', orbDegree: 1 }),
    ];
    const original = [...aspects];

    sortAspectsByPriority(aspects);

    expect(aspects[0].id).toBe(original[0].id);
    expect(aspects[1].id).toBe(original[1].id);
  });
});

describe('getTopAspects', () => {
  it('returns the top N aspects by priority', () => {
    const aspects = [
      createAspect({ id: 'a', orbDegree: 5 }),
      createAspect({ id: 'b', planet1Id: 'sun', planet2Id: 'moon', orbDegree: 0 }),
      createAspect({ id: 'c', orbDegree: 8 }),
    ];

    const top2 = getTopAspects(aspects, 2);

    expect(top2).toHaveLength(2);
    expect(top2[0].id).toBe('b'); // Sun-Moon should be first
  });

  it('handles count larger than array', () => {
    const aspects = [createAspect({ id: 'a' })];
    const result = getTopAspects(aspects, 5);
    expect(result).toHaveLength(1);
  });
});

describe('getAspectPriorityTier', () => {
  it('returns high for luminary aspects with tight orbs', () => {
    const aspect = createAspect({
      planet1Id: 'sun',
      planet2Id: 'moon',
      aspectId: 'conjunction',
      orbDegree: 0,
    });
    expect(getAspectPriorityTier(aspect)).toBe('high');
  });

  it('returns medium for personal planet aspects', () => {
    const aspect = createAspect({
      planet1Id: 'venus',
      planet2Id: 'mars',
      aspectId: 'square',
      orbDegree: 3,
    });
    expect(getAspectPriorityTier(aspect)).toBe('medium');
  });

  it('returns low for outer planet minor aspects with wide orbs', () => {
    const aspect = createAspect({
      planet1Id: 'uranus',
      planet2Id: 'neptune',
      aspectId: 'semi-sextile',
      orbDegree: 8,
    });
    expect(getAspectPriorityTier(aspect)).toBe('low');
  });
});

describe('groupAspectsByNature', () => {
  it('correctly groups aspects by nature', () => {
    const aspects = [
      createAspect({ id: 'conj', aspectId: 'conjunction' }),
      createAspect({ id: 'square', aspectId: 'square' }),
      createAspect({ id: 'trine', aspectId: 'trine' }),
      createAspect({ id: 'opposition', aspectId: 'opposition' }),
      createAspect({ id: 'sextile', aspectId: 'sextile' }),
    ];

    const grouped = groupAspectsByNature(aspects);

    expect(grouped.neutral.map(a => a.id)).toContain('conj');
    expect(grouped.challenging.map(a => a.id)).toContain('square');
    expect(grouped.challenging.map(a => a.id)).toContain('opposition');
    expect(grouped.harmonious.map(a => a.id)).toContain('trine');
    expect(grouped.harmonious.map(a => a.id)).toContain('sextile');
  });
});

describe('groupAspectsByPriorityTier', () => {
  it('groups and sorts aspects within each tier', () => {
    const aspects = [
      createAspect({ id: 'high1', planet1Id: 'sun', planet2Id: 'moon', orbDegree: 0 }),
      createAspect({ id: 'low1', planet1Id: 'uranus', planet2Id: 'neptune', aspectId: 'semi-sextile', orbDegree: 8 }),
      createAspect({ id: 'medium1', planet1Id: 'venus', planet2Id: 'mars', orbDegree: 3 }),
    ];

    const grouped = groupAspectsByPriorityTier(aspects);

    expect(grouped.high.map(a => a.id)).toContain('high1');
    expect(grouped.medium.map(a => a.id)).toContain('medium1');
    expect(grouped.low.map(a => a.id)).toContain('low1');
  });
});

describe('filterAspectsByPlanets', () => {
  it('filters aspects involving specified planets', () => {
    const aspects = [
      createAspect({ id: 'a', planet1Id: 'sun', planet2Id: 'moon' }),
      createAspect({ id: 'b', planet1Id: 'mars', planet2Id: 'venus' }),
      createAspect({ id: 'c', planet1Id: 'sun', planet2Id: 'venus' }),
    ];

    const filtered = filterAspectsByPlanets(aspects, ['sun']);

    expect(filtered).toHaveLength(2);
    expect(filtered.map(a => a.id)).toContain('a');
    expect(filtered.map(a => a.id)).toContain('c');
  });
});

describe('filterAspectsByType', () => {
  it('filters aspects by aspect type', () => {
    const aspects = [
      createAspect({ id: 'a', aspectId: 'conjunction' }),
      createAspect({ id: 'b', aspectId: 'square' }),
      createAspect({ id: 'c', aspectId: 'trine' }),
    ];

    const filtered = filterAspectsByType(aspects, ['conjunction', 'trine']);

    expect(filtered).toHaveLength(2);
    expect(filtered.map(a => a.id)).toContain('a');
    expect(filtered.map(a => a.id)).toContain('c');
  });
});

describe('Constants', () => {
  it('MAJOR_ASPECT_IDS contains the 5 major aspects', () => {
    expect(MAJOR_ASPECT_IDS).toHaveLength(5);
    expect(MAJOR_ASPECT_IDS).toContain('conjunction');
    expect(MAJOR_ASPECT_IDS).toContain('opposition');
    expect(MAJOR_ASPECT_IDS).toContain('trine');
    expect(MAJOR_ASPECT_IDS).toContain('square');
    expect(MAJOR_ASPECT_IDS).toContain('sextile');
  });

  it('MINOR_ASPECT_IDS contains minor aspects', () => {
    expect(MINOR_ASPECT_IDS).toContain('quincunx');
    expect(MINOR_ASPECT_IDS).toContain('semi-sextile');
    expect(MINOR_ASPECT_IDS).toContain('quintile');
  });
});
