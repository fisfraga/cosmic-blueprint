/**
 * Astrology API Service
 *
 * This service provides an abstraction layer for external astrology APIs.
 * It handles the calculation of natal charts including placements, houses,
 * aspects, and elemental analysis.
 *
 * Gene Keys and Human Design are calculated locally (via chartCalculation.ts).
 * Traditional astrology (houses, aspects) requires this external API.
 *
 * Provider: FreeAstroAPI
 * Docs: https://freeastroapi.com/docs/western/natal
 */

import type {
  BirthData,
  NatalPlacement,
  HousePosition,
  NatalAspect,
  ElementalAnalysis,
  NatalConfiguration,
} from '../types';
import { isAstrologyAPIConfigured } from '../config/astrology';

// ============================================================================
// Response Types
// ============================================================================

export interface AstrologyAPIResponse {
  placements: NatalPlacement[];
  housePositions: HousePosition[];
  aspects: {
    planetary: NatalAspect[];
    other: NatalAspect[];
  };
  configurations: NatalConfiguration[];
  elementalAnalysis: ElementalAnalysis;
  chartRulers: {
    traditional: string;
    modern: string;
  };
}

// FreeAstroAPI response structure
interface FreeAstroPlanet {
  name: string;
  sign: string;
  sign_num: number;
  position: number;  // degree within sign
  abs_pos: number;   // absolute degree (0-360)
  house: number;
  retrograde: boolean;
  speed?: number;
}

interface FreeAstroHouse {
  house: number;
  sign: string;
  sign_num: number;
  position: number;
}

interface FreeAstroAspect {
  p1_name: string;
  p2_name: string;
  aspect: string;
  orbit: number;
  aspect_degrees: number;
  diff: number;
}

interface FreeAstroResponse {
  subject?: { name?: string };
  planets: FreeAstroPlanet[];
  houses: FreeAstroHouse[];
  aspects: FreeAstroAspect[];
}

// ============================================================================
// Constants
// ============================================================================

// Sign name to ID mapping
const SIGN_IDS: Record<string, string> = {
  'Ari': 'aries', 'Aries': 'aries',
  'Tau': 'taurus', 'Taurus': 'taurus',
  'Gem': 'gemini', 'Gemini': 'gemini',
  'Can': 'cancer', 'Cancer': 'cancer',
  'Leo': 'leo',
  'Vir': 'virgo', 'Virgo': 'virgo',
  'Lib': 'libra', 'Libra': 'libra',
  'Sco': 'scorpio', 'Scorpio': 'scorpio',
  'Sag': 'sagittarius', 'Sagittarius': 'sagittarius',
  'Cap': 'capricorn', 'Capricorn': 'capricorn',
  'Aqu': 'aquarius', 'Aquarius': 'aquarius',
  'Pis': 'pisces', 'Pisces': 'pisces',
};

// Planet name to ID mapping
const PLANET_IDS: Record<string, string> = {
  'Sun': 'sun',
  'Moon': 'moon',
  'Mercury': 'mercury',
  'Venus': 'venus',
  'Mars': 'mars',
  'Jupiter': 'jupiter',
  'Saturn': 'saturn',
  'Uranus': 'uranus',
  'Neptune': 'neptune',
  'Pluto': 'pluto',
  'Chiron': 'chiron',
  'Lilith': 'lilith',
  'True_Node': 'north-node',
  'Mean_Node': 'north-node',
};

// Aspect name to ID mapping
const ASPECT_IDS: Record<string, string> = {
  'conjunction': 'conjunction',
  'opposition': 'opposition',
  'trine': 'trine',
  'square': 'square',
  'sextile': 'sextile',
  'quincunx': 'quincunx',
  'semisextile': 'semi-sextile',
  'semisquare': 'semi-square',
  'sesquiquadrate': 'sesquiquadrate',
  'quintile': 'quintile',
};

// Element mapping
const SIGN_ELEMENTS: Record<string, string> = {
  aries: 'fire', leo: 'fire', sagittarius: 'fire',
  taurus: 'earth', virgo: 'earth', capricorn: 'earth',
  gemini: 'air', libra: 'air', aquarius: 'air',
  cancer: 'water', scorpio: 'water', pisces: 'water',
};

// Sign rulers
const SIGN_RULERS: Record<string, { traditional: string; modern: string }> = {
  aries: { traditional: 'mars', modern: 'mars' },
  taurus: { traditional: 'venus', modern: 'venus' },
  gemini: { traditional: 'mercury', modern: 'mercury' },
  cancer: { traditional: 'moon', modern: 'moon' },
  leo: { traditional: 'sun', modern: 'sun' },
  virgo: { traditional: 'mercury', modern: 'mercury' },
  libra: { traditional: 'venus', modern: 'venus' },
  scorpio: { traditional: 'mars', modern: 'pluto' },
  sagittarius: { traditional: 'jupiter', modern: 'jupiter' },
  capricorn: { traditional: 'saturn', modern: 'saturn' },
  aquarius: { traditional: 'saturn', modern: 'uranus' },
  pisces: { traditional: 'jupiter', modern: 'neptune' },
};

// ============================================================================
// Transformation Functions
// ============================================================================

function getSignId(sign: string): string {
  return SIGN_IDS[sign] || sign.toLowerCase();
}

function getPlanetId(name: string): string | null {
  return PLANET_IDS[name] || null;
}

function getAspectId(aspect: string): string | null {
  return ASPECT_IDS[aspect.toLowerCase()] || null;
}

/**
 * Transform FreeAstroAPI response to our format
 */
function transformFreeAstroResponse(
  data: FreeAstroResponse,
  profileId: string
): AstrologyAPIResponse {
  // Transform planets to placements
  const placements: NatalPlacement[] = data.planets
    .filter(p => getPlanetId(p.name))
    .map(p => {
      const planetId = getPlanetId(p.name)!;
      const signId = getSignId(p.sign);
      const degree = Math.floor(p.position);
      const minute = Math.round((p.position - degree) * 60);

      return {
        id: `${profileId}-${planetId}`,
        profileId,
        planetId,
        signId,
        houseId: `house-${p.house}`,
        degree,
        minute,
        retrograde: p.retrograde,
        fullName: `${p.name} in ${p.sign}`,
        shortName: `${p.name.substring(0, 3)} ${p.sign.substring(0, 3)}`,
      };
    });

  // Transform houses
  const housePositions: HousePosition[] = data.houses.map(h => {
    const signId = getSignId(h.sign);
    const degree = Math.floor(h.position);
    const minute = Math.round((h.position - degree) * 60);

    return {
      id: `${profileId}-house-${h.house}`,
      profileId,
      houseId: `house-${h.house}`,
      signId,
      degree,
      minute,
    };
  });

  // Transform aspects
  const planetaryAspects: NatalAspect[] = data.aspects
    .filter(a => {
      const p1 = getPlanetId(a.p1_name);
      const p2 = getPlanetId(a.p2_name);
      const aspect = getAspectId(a.aspect);
      return p1 && p2 && aspect;
    })
    .map((a, index) => {
      const planet1Id = getPlanetId(a.p1_name)!;
      const planet2Id = getPlanetId(a.p2_name)!;
      const aspectId = getAspectId(a.aspect)!;
      const orbDegree = Math.floor(Math.abs(a.orbit));
      const orbMinute = Math.round((Math.abs(a.orbit) - orbDegree) * 60);

      return {
        id: `${profileId}-aspect-${index}`,
        profileId,
        aspectId,
        planet1Id,
        placement1Id: `${profileId}-${planet1Id}`,
        planet2Id,
        placement2Id: `${profileId}-${planet2Id}`,
        orbDegree,
        orbMinute,
        direction: a.orbit >= 0 ? 'Separating' as const : 'Applying' as const,
        fullName: `${a.p1_name} ${a.aspect} ${a.p2_name}`,
      };
    });

  // Calculate elemental analysis
  const elementalAnalysis = calculateElementalAnalysis(placements, profileId);

  // Get chart rulers from first house (Ascendant sign)
  let chartRulers = { traditional: '', modern: '' };
  const firstHouse = housePositions.find(h => h.houseId === 'house-1');
  if (firstHouse) {
    const rulers = SIGN_RULERS[firstHouse.signId];
    if (rulers) {
      chartRulers = rulers;
    }
  }

  return {
    placements,
    housePositions,
    aspects: {
      planetary: planetaryAspects,
      other: [],
    },
    configurations: [],
    elementalAnalysis,
    chartRulers,
  };
}

/**
 * Calculate elemental analysis from placements
 */
function calculateElementalAnalysis(
  placements: NatalPlacement[],
  profileId: string
): ElementalAnalysis {
  const counts = { fire: 0, earth: 0, air: 0, water: 0 };
  const planetLists: Record<string, string[]> = {
    fire: [], earth: [], air: [], water: [],
  };

  placements.forEach(p => {
    const element = SIGN_ELEMENTS[p.signId];
    if (element && counts[element as keyof typeof counts] !== undefined) {
      counts[element as keyof typeof counts]++;
      planetLists[element].push(p.planetId);
    }
  });

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0][0];
  const deficient = sorted[sorted.length - 1][0];

  return {
    id: `${profileId}-elemental`,
    profileId,
    fire: counts.fire,
    earth: counts.earth,
    air: counts.air,
    water: counts.water,
    firePlanetIds: planetLists.fire,
    earthPlanetIds: planetLists.earth,
    airPlanetIds: planetLists.air,
    waterPlanetIds: planetLists.water,
    dominant,
    deficient,
  };
}

// ============================================================================
// Main API Functions
// ============================================================================

/**
 * Fetch astrology chart from FreeAstroAPI via serverless function
 */
export async function fetchAstrologyChart(
  birthData: BirthData
): Promise<AstrologyAPIResponse | null> {
  if (!isAstrologyAPIConfigured()) {
    console.log('Astrology API not configured');
    return null;
  }

  try {
    console.log('Calling FreeAstroAPI via serverless function...');

    const response = await fetch('/api/astrology', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birthData }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('FreeAstroAPI error:', response.status, errorData);
      return null;
    }

    const data: FreeAstroResponse = await response.json();
    console.log('FreeAstroAPI response received');

    const profileId = `temp-${Date.now()}`;
    return transformFreeAstroResponse(data, profileId);
  } catch (error) {
    console.error('FreeAstroAPI call failed:', error);
    return null;
  }
}

/**
 * Create empty astrology data structure
 */
export function createEmptyAstrologyData(profileId: string): AstrologyAPIResponse {
  return {
    placements: [],
    housePositions: [],
    aspects: { planetary: [], other: [] },
    configurations: [],
    elementalAnalysis: {
      id: `${profileId}-elemental`,
      profileId,
      fire: 0, earth: 0, air: 0, water: 0,
      firePlanetIds: [], earthPlanetIds: [], airPlanetIds: [], waterPlanetIds: [],
      dominant: '', deficient: '',
    },
    chartRulers: { traditional: '', modern: '' },
  };
}

/**
 * Check if a profile has astrology data
 */
export function hasAstrologyData(profile: { placements?: NatalPlacement[] }): boolean {
  return Array.isArray(profile.placements) && profile.placements.length > 0;
}
