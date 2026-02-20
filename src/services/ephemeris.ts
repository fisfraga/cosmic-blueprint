/**
 * Ephemeris Service
 *
 * Provides accurate planetary positions using:
 * 1. Pre-computed data (2020-2035) for fast lookups
 * 2. astronomy-engine library as fallback for any date
 */

import { Body, GeoVector, Ecliptic } from 'astronomy-engine';

// Import pre-computed ephemeris data
import ephemerisData from '../data/ephemeris/positions-2020-2035.json';

// Planet IDs matching the order in ephemeris data
const PLANET_ORDER = [
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
] as const;

type PlanetId = (typeof PLANET_ORDER)[number];

export interface PlanetaryPositions {
  date: Date;
  sun: number;
  moon: number;
  mercury: number;
  venus: number;
  mars: number;
  jupiter: number;
  saturn: number;
  uranus: number;
  neptune: number;
  pluto: number;
}

// Map planet IDs to astronomy-engine Body enum
const BODY_MAP: Record<PlanetId, Body> = {
  sun: Body.Sun,
  moon: Body.Moon,
  mercury: Body.Mercury,
  venus: Body.Venus,
  mars: Body.Mars,
  jupiter: Body.Jupiter,
  saturn: Body.Saturn,
  uranus: Body.Uranus,
  neptune: Body.Neptune,
  pluto: Body.Pluto,
};

// Parse metadata from ephemeris data
const META = ephemerisData.meta as {
  startDate: string;
  endDate: string;
  planets: string[];
};

const DATA_START = new Date(`${META.startDate}T00:00:00Z`);
const DATA_END = new Date(`${META.endDate}T00:00:00Z`);

/**
 * Get day index for a date within the pre-computed range
 */
function getDayIndex(date: Date): number {
  const utcDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  const diffMs = utcDate.getTime() - DATA_START.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Check if a date is within the pre-computed range
 */
function isInDataRange(date: Date): boolean {
  const utcDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  return utcDate >= DATA_START && utcDate <= DATA_END;
}

/**
 * Get planetary positions from pre-computed data
 * Returns null if date is outside the data range
 */
function getPositionsFromData(date: Date): PlanetaryPositions | null {
  if (!isInDataRange(date)) {
    return null;
  }

  const dayIndex = getDayIndex(date);
  const positions = ephemerisData.data[dayIndex] as number[];

  if (!positions) {
    return null;
  }

  return {
    date,
    sun: positions[0],
    moon: positions[1],
    mercury: positions[2],
    venus: positions[3],
    mars: positions[4],
    jupiter: positions[5],
    saturn: positions[6],
    uranus: positions[7],
    neptune: positions[8],
    pluto: positions[9],
  };
}

/**
 * Calculate planetary longitude using astronomy-engine
 *
 * IMPORTANT: Use GeoVector + Ecliptic for ALL planets to get GEOCENTRIC coordinates.
 * EclipticLongitude returns heliocentric coordinates which are incorrect for astrology.
 * Astrology uses Earth-centered (geocentric) positions.
 */
function calculateLongitude(planetId: PlanetId, date: Date): number {
  const body = BODY_MAP[planetId];

  try {
    // All planets: use geocentric vector then convert to ecliptic coordinates
    const geoVec = GeoVector(body, date, true);
    const eclip = Ecliptic(geoVec);
    return eclip.elon;
  } catch (e) {
    console.error(`Error calculating ${planetId} for ${date}:`, e);
    return 0;
  }
}

/**
 * Calculate all planetary positions using astronomy-engine
 * Used as fallback for dates outside pre-computed range
 */
function calculatePositions(date: Date): PlanetaryPositions {
  return {
    date,
    sun: calculateLongitude('sun', date),
    moon: calculateLongitude('moon', date),
    mercury: calculateLongitude('mercury', date),
    venus: calculateLongitude('venus', date),
    mars: calculateLongitude('mars', date),
    jupiter: calculateLongitude('jupiter', date),
    saturn: calculateLongitude('saturn', date),
    uranus: calculateLongitude('uranus', date),
    neptune: calculateLongitude('neptune', date),
    pluto: calculateLongitude('pluto', date),
  };
}

/**
 * Get planetary positions for a given date
 * Uses pre-computed data when available, falls back to calculation
 */
export function getPlanetaryPositions(date: Date): PlanetaryPositions {
  // Try pre-computed data first (faster)
  const fromData = getPositionsFromData(date);
  if (fromData) {
    return fromData;
  }

  // Fallback to calculation for dates outside range
  return calculatePositions(date);
}

/**
 * Get position for a single planet on a given date
 */
export function getPlanetPosition(planetId: PlanetId, date: Date): number {
  const positions = getPlanetaryPositions(date);
  return positions[planetId];
}

/**
 * Convert ecliptic longitude to zodiac sign and degree
 */
export function longitudeToZodiac(longitude: number): {
  sign: string;
  signIndex: number;
  degree: number;
  minute: number;
} {
  const signs = [
    'Aries',
    'Taurus',
    'Gemini',
    'Cancer',
    'Leo',
    'Virgo',
    'Libra',
    'Scorpio',
    'Sagittarius',
    'Capricorn',
    'Aquarius',
    'Pisces',
  ];

  // Normalize longitude to 0-360
  const normalizedLon = ((longitude % 360) + 360) % 360;

  const signIndex = Math.floor(normalizedLon / 30);
  const degreeInSign = normalizedLon % 30;
  const degree = Math.floor(degreeInSign);
  const minute = Math.floor((degreeInSign - degree) * 60);

  return {
    sign: signs[signIndex],
    signIndex,
    degree,
    minute,
  };
}

/**
 * Get the ephemeris data range info
 */
export function getEphemerisInfo(): {
  startDate: string;
  endDate: string;
  totalDays: number;
  source: string;
} {
  return {
    startDate: META.startDate,
    endDate: META.endDate,
    totalDays: ephemerisData.data.length,
    source: 'astronomy-engine',
  };
}
