// ============================================
// Tests for ILOS Utility Service
// calculateElementalBalance + VPER helpers
// ============================================

import { describe, it, expect } from 'vitest';
import { calculateElementalBalance, ELEMENT_VPER, ELEMENT_PRACTICES } from './ilos';
import type { NatalPlacement } from '../types';

// Minimal NatalPlacement factory — only required fields
function makePlacement(planetId: string, signId: string): NatalPlacement {
  return {
    id: `${planetId}-${signId}`,
    profileId: 'test-profile',
    planetId,
    signId,
    houseId: 'house-1',
    degree: 10,
    minute: 0,
    retrograde: false,
    fullName: planetId,
    shortName: planetId,
  };
}

describe('calculateElementalBalance', () => {
  it('identifies a fire-dominant chart (Sun, Moon, Mars in Aries)', () => {
    const placements: NatalPlacement[] = [
      makePlacement('sun', 'aries'),     // fire
      makePlacement('moon', 'aries'),    // fire
      makePlacement('mars', 'aries'),    // fire
      makePlacement('mercury', 'virgo'), // earth
      makePlacement('venus', 'virgo'),   // earth
    ];
    const result = calculateElementalBalance(placements);
    expect(result.fire).toBe(3);
    expect(result.earth).toBe(2);
    expect(result.air).toBe(0);
    expect(result.water).toBe(0);
    expect(result.dominant).toBe('fire');
    expect(result.summary).toContain('Fire dominant');
  });

  it('identifies a water-dominant chart (Sun Scorpio, Moon Pisces, Venus Cancer, Mercury Cancer)', () => {
    const placements: NatalPlacement[] = [
      makePlacement('sun', 'scorpio'),   // water
      makePlacement('moon', 'pisces'),   // water
      makePlacement('venus', 'cancer'),  // water
      makePlacement('mercury', 'cancer'), // water
      makePlacement('mars', 'aries'),    // fire
    ];
    const result = calculateElementalBalance(placements);
    expect(result.water).toBe(4);
    expect(result.fire).toBe(1);
    expect(result.dominant).toBe('water');
    expect(result.weakest).not.toBe('water');
  });

  it('returns no dominant for balanced distribution', () => {
    const placements: NatalPlacement[] = [
      makePlacement('sun', 'aries'),     // fire
      makePlacement('moon', 'taurus'),   // earth
      makePlacement('mercury', 'gemini'), // air
      makePlacement('venus', 'cancer'),  // water
      makePlacement('mars', 'aries'),    // fire  (2 fire, 1 earth, 1 air, 1 water)
    ];
    const result = calculateElementalBalance(placements);
    // fire=2 earth=1 air=1 water=1 — fire dominant but weakest could be earth/air/water (all tied at 1)
    expect(result.fire).toBe(2);
    expect(result.dominant).toBe('fire');
    // No definitive weakest when multiple elements tied at 1 vs dominant 2
    expect(['earth', 'air', 'water']).toContain(result.weakest);
  });

  it('includes ASC and MC sign contributions when houseCusps provided', () => {
    const placements: NatalPlacement[] = [
      makePlacement('sun', 'taurus'),   // earth
    ];
    // ASC = Aquarius (air), MC = Gemini (air) → adds 2 air
    const result = calculateElementalBalance(placements, {
      ascendantSignId: 'aquarius',
      midheaveSignId: 'gemini',
    });
    expect(result.earth).toBe(1);
    expect(result.air).toBe(2);
    expect(result.dominant).toBe('air');
  });

  it('ignores outer planets (Jupiter, Saturn, etc.) in element count', () => {
    const placements: NatalPlacement[] = [
      makePlacement('sun', 'aries'),       // fire — counted
      makePlacement('jupiter', 'taurus'), // earth — NOT counted (not personal)
      makePlacement('saturn', 'virgo'),   // earth — NOT counted
    ];
    const result = calculateElementalBalance(placements);
    expect(result.fire).toBe(1);
    expect(result.earth).toBe(0); // Jupiter and Saturn ignored
  });

  it('returns balanced summary when no placements', () => {
    const result = calculateElementalBalance([]);
    expect(result.dominant).toBeUndefined();
    expect(result.summary).toBe('Balanced elemental distribution');
  });
});

describe('ELEMENT_VPER', () => {
  it('maps all four elements to correct VPER phases', () => {
    expect(ELEMENT_VPER.fire).toBe('vision');
    expect(ELEMENT_VPER.air).toBe('plan');
    expect(ELEMENT_VPER.earth).toBe('execute');
    expect(ELEMENT_VPER.water).toBe('review');
  });
});

describe('ELEMENT_PRACTICES', () => {
  it('has exactly two practices per element', () => {
    for (const el of ['fire', 'air', 'earth', 'water']) {
      expect(ELEMENT_PRACTICES[el]).toHaveLength(2);
    }
  });
});
