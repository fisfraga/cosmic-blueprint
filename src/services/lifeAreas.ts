/**
 * Life Areas Service
 *
 * Maps the 12 astrological houses to ILD (Intentional Life Design) Key Areas.
 * Computes which transit planets are currently activating each life area.
 *
 * House N always maps to Life Area N (ILD archetypal principle).
 * Transit position detection uses absolute ecliptic longitude (0-360°).
 */

import type { HousePosition } from '../types';
import type { TransitPosition } from './transits';

// Zodiac sign start degrees (absolute ecliptic longitude)
const SIGN_STARTS: Record<string, number> = {
  aries: 0,
  taurus: 30,
  gemini: 60,
  cancer: 90,
  leo: 120,
  virgo: 150,
  libra: 180,
  scorpio: 210,
  sagittarius: 240,
  capricorn: 270,
  aquarius: 300,
  pisces: 330,
};

// Natural zodiac house cusps (no birth chart — Aries = H1)
const NATURAL_CUSPS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

export type LifeAreaElement = 'fire' | 'earth' | 'air' | 'water';

export interface LifeAreaDefinition {
  house: number;          // 1-12
  name: string;           // "Health & Vitality"
  archetype: string;      // "Aries / 1st House"
  themes: string;         // short themes list
  icon: string;           // zodiac symbol
  element: LifeAreaElement;
  tanaNodeId: string;     // Tana ILOS workspace node ID
}

export const LIFE_AREAS: LifeAreaDefinition[] = [
  {
    house: 1,
    name: 'Health & Vitality',
    archetype: 'Aries / 1st House',
    themes: 'Self, Identity, Appearance, Physical Vitality',
    icon: '♈',
    element: 'fire',
    tanaNodeId: 'yJfV3o1HVbTH',
  },
  {
    house: 2,
    name: 'Finances & Resources',
    archetype: 'Taurus / 2nd House',
    themes: 'Resources, Values, Income, Self-Worth',
    icon: '♉',
    element: 'earth',
    tanaNodeId: '1ANiVcshhGV7',
  },
  {
    house: 3,
    name: 'Intellectual Life',
    archetype: 'Gemini / 3rd House',
    themes: 'Communication, Learning, Siblings, Local Environment',
    icon: '♊',
    element: 'air',
    tanaNodeId: 'n_MnUdjeBDYZ',
  },
  {
    house: 4,
    name: 'Home & Family',
    archetype: 'Cancer / 4th House',
    themes: 'Home, Family, Roots, Inner Foundation',
    icon: '♋',
    element: 'water',
    tanaNodeId: 'hg6UQLfpqB4G',
  },
  {
    house: 5,
    name: 'Creative Expression',
    archetype: 'Leo / 5th House',
    themes: 'Creativity, Romance, Children, Play, Joy',
    icon: '♌',
    element: 'fire',
    tanaNodeId: 'Q-dJ7es_p30l',
  },
  {
    house: 6,
    name: 'Routines & Work Life',
    archetype: 'Virgo / 6th House',
    themes: 'Health Routines, Daily Work, Service',
    icon: '♍',
    element: 'earth',
    tanaNodeId: 'kKBTbcODuoJY',
  },
  {
    house: 7,
    name: 'Love Relationship',
    archetype: 'Libra / 7th House',
    themes: 'Partnership, Marriage, Intimate Relationships',
    icon: '♎',
    element: 'air',
    tanaNodeId: 'RdLauDuNmZu1',
  },
  {
    house: 8,
    name: 'Emotional Life',
    archetype: 'Scorpio / 8th House',
    themes: 'Transformation, Shared Resources, Shadow Work, Depth',
    icon: '♏',
    element: 'water',
    tanaNodeId: 'WNx101qK1IwG',
  },
  {
    house: 9,
    name: 'Life Vision & Meaning',
    archetype: 'Sagittarius / 9th House',
    themes: 'Higher Learning, Philosophy, Travel, Belief Systems',
    icon: '♐',
    element: 'fire',
    tanaNodeId: '_yyaVClf16Bi',
  },
  {
    house: 10,
    name: 'Career & Public Life',
    archetype: 'Capricorn / 10th House',
    themes: 'Career, Public Reputation, Authority, Legacy',
    icon: '♑',
    element: 'earth',
    tanaNodeId: '-UN3Powg7RdW',
  },
  {
    house: 11,
    name: 'Social Life & Community',
    archetype: 'Aquarius / 11th House',
    themes: 'Community, Hopes, Friends, Collective Vision',
    icon: '♒',
    element: 'air',
    tanaNodeId: 'tq5ZdS0Fl2Dk',
  },
  {
    house: 12,
    name: 'Spirituality & Inner Life',
    archetype: 'Pisces / 12th House',
    themes: 'Unconscious, Spirituality, Hidden Service, Surrender, Inner Work',
    icon: '♓',
    element: 'water',
    tanaNodeId: 'Qi3eRvZ0sH7e',
  },
];

/**
 * Convert a HousePosition (sign + degree within sign) to absolute ecliptic longitude.
 */
function housePositionToAbsolute(hp: HousePosition): number {
  const signStart = SIGN_STARTS[hp.signId] ?? 0;
  return (signStart + hp.degree + hp.minute / 60) % 360;
}

/**
 * Extract the house number from a houseId string (e.g. "house-1" → 1).
 */
function houseIdToNumber(houseId: string): number {
  const match = houseId.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Build an ordered array of 12 absolute cusp degrees [house1, house2, ..., house12]
 * from a CosmicProfile's housePositions.
 */
export function extractCuspDegrees(housePositions: HousePosition[]): number[] {
  return [...housePositions]
    .sort((a, b) => houseIdToNumber(a.houseId) - houseIdToNumber(b.houseId))
    .slice(0, 12)
    .map(housePositionToAbsolute);
}

/**
 * Given an absolute ecliptic longitude and an ordered array of 12 cusp degrees,
 * return which house (1-12) the longitude falls in.
 *
 * Handles the 0°/360° wraparound correctly.
 */
export function getHouseFromLongitude(longitude: number, cuspDegrees: number[]): number {
  const lon = ((longitude % 360) + 360) % 360;

  for (let i = 0; i < 12; i++) {
    const start = cuspDegrees[i];
    const end = cuspDegrees[(i + 1) % 12];

    if (end > start) {
      // Normal: no wraparound within this house
      if (lon >= start && lon < end) return i + 1;
    } else {
      // Wraparound: house crosses 0°
      if (lon >= start || lon < end) return i + 1;
    }
  }

  return 1; // fallback
}

export interface TransitActivation {
  houseNumber: number;     // 1-12
  planet: TransitPosition;
}

/**
 * Map each transit planet to the house it currently occupies.
 *
 * Uses the profile's house cusp degrees when available;
 * falls back to the natural zodiac (Aries = House 1).
 */
export function computeTransitActivations(
  positions: TransitPosition[],
  housePositions?: HousePosition[],
): TransitActivation[] {
  const cusps =
    housePositions && housePositions.length >= 12
      ? extractCuspDegrees(housePositions)
      : NATURAL_CUSPS;

  return positions.map((planet) => ({
    houseNumber: getHouseFromLongitude(planet.degree, cusps),
    planet,
  }));
}

/**
 * Get all transit activations for a specific house number.
 */
export function getActivationsForHouse(
  houseNumber: number,
  activations: TransitActivation[],
): TransitPosition[] {
  return activations
    .filter((a) => a.houseNumber === houseNumber)
    .map((a) => a.planet);
}
