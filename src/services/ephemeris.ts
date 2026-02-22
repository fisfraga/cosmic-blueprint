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
  'true-node': number;
  chiron: number;
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

// ============================================================================
// True Lunar Node (Meeus Chapter 47)
// Accurate to approximately 1-2 degrees — sufficient for HD gate assignment.
// ============================================================================

/**
 * Compute the Julian Day Number for a UTC Date.
 */
function julianDay(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d =
    date.getUTCDate() +
    date.getUTCHours() / 24 +
    date.getUTCMinutes() / 1440 +
    date.getUTCSeconds() / 86400;
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045
  );
}

/**
 * Calculate the True Lunar Node (ascending node) ecliptic longitude.
 *
 * Uses the Meeus (Astronomical Algorithms, 2nd ed., Chapter 47) algorithm.
 * Accuracy: ~1–2° compared to Swiss Ephemeris, which is sufficient for
 * Human Design gate assignment (each gate spans 5.625°).
 */
function calculateTrueLunarNode(date: Date): number {
  const JD = julianDay(date);
  const T = (JD - 2451545.0) / 36525;
  const toRad = Math.PI / 180;

  // Mean longitude of ascending node (Table 47.a)
  const Omega =
    125.0445479 -
    1934.1362608 * T +
    0.0020754 * T * T +
    (T * T * T) / 467441 -
    (T * T * T * T) / 60616000;

  // Fundamental arguments
  const M =
    357.52911 + 35999.05029 * T - 0.0001537 * T * T; // Sun mean anomaly
  const Mprime =
    134.96298 + 477198.867398 * T + 0.0086972 * T * T; // Moon mean anomaly
  const F =
    93.27191 + 483202.017538 * T - 0.0036825 * T * T; // Moon arg of latitude
  const D =
    297.85036 + 445267.11480 * T - 0.0019142 * T * T; // Moon mean elongation

  // Principal periodic correction terms (Meeus Table 47.b, most significant)
  const N =
    Omega +
    -1.4979 * Math.sin(2 * (F - Omega) * toRad) +
    -0.15 * Math.sin(M * toRad) +
    -0.1226 * Math.sin(2 * F * toRad) +
    0.1176 * Math.sin(2 * (F - D) * toRad) +
    -0.0801 * Math.sin(2 * (Mprime - F) * toRad);

  return ((N % 360) + 360) % 360;
}

// ============================================================================
// Chiron (2060 Chiron) — Keplerian orbital elements
// Calibrated against Swiss Ephemeris reference positions.
// Osculating elements sourced from JPL SBDB, epoch J2000.0.
// Accurate to approximately 1–3 degrees for dates 1970–2050.
// ============================================================================

/**
 * Solve Kepler's equation  M = E - e·sin(E)  for the eccentric anomaly E.
 * Uses Newton-Raphson iteration.
 */
function solveKeplerEquation(M_deg: number, e: number): number {
  const toRad = Math.PI / 180;
  let E = M_deg * toRad;
  for (let i = 0; i < 50; i++) {
    const dE = (M_deg * toRad - E + e * Math.sin(E)) / (1 - e * Math.cos(E));
    E += dE;
    if (Math.abs(dE) < 1e-10) break;
  }
  return E; // radians
}

/**
 * Calculate Chiron's ecliptic longitude using Keplerian orbital mechanics.
 *
 * Orbital elements (J2000.0 epoch, from JPL SBDB):
 *   a = 13.64846 AU, e = 0.37955, i = 6.94963°
 *   Ω = 209.3543°, ω = 339.4416°, period = 18417.2 days
 *   M₀ = 29.30° (calibrated so that Chiron's position matches Swiss Ephemeris
 *        at known reference dates in the 1990s–2000s)
 *
 * Accuracy: ~1–3° vs Swiss Ephemeris; sufficient for HD gate assignment.
 */
function calculateChironLongitude(date: Date): number {
  const JD = julianDay(date);
  const t = JD - 2451545.0; // days from J2000.0

  const e = 0.37955;
  const i_deg = 6.94963;
  const Omega_deg = 209.3543;
  const omega_deg = 339.4416;
  const period_days = 18417.2;
  // M₀ at J2000.0 — calibrated against Swiss Ephemeris reference positions
  const M0_deg = 29.3;

  const n = 360 / period_days; // deg/day
  const M = ((M0_deg + n * t) % 360 + 360) % 360;

  const E = solveKeplerEquation(M, e); // radians
  const toRad = Math.PI / 180;
  const toDeg = 180 / Math.PI;

  // True anomaly from eccentric anomaly
  const nu =
    2 *
    Math.atan2(
      Math.sqrt(1 + e) * Math.sin(E / 2),
      Math.sqrt(1 - e) * Math.cos(E / 2)
    ) *
    toDeg;

  // Argument of latitude
  const u = ((nu + omega_deg) % 360 + 360) % 360;
  const u_rad = u * toRad;
  const Omega = Omega_deg * toRad;
  const ir = i_deg * toRad;

  // Convert to ecliptic longitude
  const x =
    Math.cos(Omega) * Math.cos(u_rad) -
    Math.sin(Omega) * Math.sin(u_rad) * Math.cos(ir);
  const y =
    Math.sin(Omega) * Math.cos(u_rad) +
    Math.cos(Omega) * Math.sin(u_rad) * Math.cos(ir);

  return ((Math.atan2(y, x) * toDeg) % 360 + 360) % 360;
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
    // True Node and Chiron are not in the pre-computed table; calculate directly.
    'true-node': calculateTrueLunarNode(date),
    chiron: calculateChironLongitude(date),
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
    // True Node via Meeus (astronomy-engine lacks this body)
    'true-node': calculateTrueLunarNode(date),
    // Chiron via Keplerian orbital elements (astronomy-engine lacks this body)
    chiron: calculateChironLongitude(date),
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
 * Determine if a planet is retrograde at a given date.
 *
 * A planet is retrograde when its geocentric ecliptic longitude is decreasing
 * (i.e., it appears to move backward through the zodiac). We compare positions
 * one day apart and check the direction of motion.
 *
 * Sun and Moon are never retrograde. Earth is never retrograde from our
 * geocentric perspective.
 */
export function isRetrograde(planetId: string, date: Date): boolean {
  // Sun, Moon, and Earth are never retrograde from geocentric perspective
  if (planetId === 'sun' || planetId === 'moon' || planetId === 'earth') {
    return false;
  }

  // True Node moves retrograde on average but with oscillations;
  // Chiron can be retrograde or direct. Both are handled by the diff check below.
  if (planetId === 'true-node' || planetId === 'chiron') {
    const pos1 = getPlanetaryPositions(date);
    const pos2 = getPlanetaryPositions(
      new Date(date.getTime() - 86400000)
    );
    const today = pos1[planetId as keyof PlanetaryPositions] as number;
    const yesterday = pos2[planetId as keyof PlanetaryPositions] as number;
    let diff = (today as number) - (yesterday as number);
    if (diff > 180) return true;
    if (diff < -180) return false;
    return diff < 0;
  }

  const today = getPlanetPosition(planetId as PlanetId, date);
  const yesterday = getPlanetPosition(
    planetId as PlanetId,
    new Date(date.getTime() - 86400000)
  );

  // Calculate the difference in longitude
  let diff = today - yesterday;

  // Handle 0°/360° wraparound: if the absolute difference is > 180°,
  // the planet crossed the 0° boundary
  if (diff > 180) {
    // Crossed backward over 0° (e.g., 1° -> 359° gives diff = -358, normalized to +2)
    // A large positive diff after crossing means retrograde
    return true;
  }
  if (diff < -180) {
    // Crossed forward over 0° (e.g., 359° -> 1° gives diff = -358)
    // A large negative diff after crossing means direct motion
    return false;
  }

  // Normal case: negative diff = retrograde (longitude decreasing)
  return diff < 0;
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
