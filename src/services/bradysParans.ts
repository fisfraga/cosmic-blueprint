/**
 * Brady's Parans Service
 *
 * Computes mundane parans: fixed stars sharing an angle (rising/setting/
 * culminating/anti-culminating) with natal planets on the birth date,
 * as seen from the birth location.
 *
 * Based on Bernadette Brady's paran technique. Unlike ecliptic conjunctions,
 * parans use the local horizon and meridian — they are latitude-sensitive.
 *
 * Limitation: fixed stars in the knowledge base only have ecliptic longitude
 * (no RA/Dec). We approximate RA/Dec by assuming ecliptic latitude = 0.
 * Stars far from the ecliptic plane will have less accurate paran times.
 */

import {
  Body,
  Observer,
  DefineStar,
  SearchRiseSet,
  SearchHourAngle,
  MakeTime,
} from 'astronomy-engine';
import type { AstroTime } from 'astronomy-engine';
import type { FixedStar, BirthData } from '../types';
import { fixedStars } from '../data';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AngleType = 'rising' | 'setting' | 'culminating' | 'anti-culminating';

export interface Paran {
  star: FixedStar;
  starAngle: AngleType;
  planetId: string;
  planetAngle: AngleType;
  /** Minutes of time separation between star and planet angle events */
  orbMinutes: number;
}

export interface ParanGroup {
  star: FixedStar;
  parans: Paran[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Mean obliquity of the ecliptic (J2000), in degrees */
const OBLIQUITY_DEG = 23.4393;
const OBLIQUITY_RAD = (OBLIQUITY_DEG * Math.PI) / 180;

/**
 * Maximum time separation (in minutes) for a paran to be considered valid.
 * Brady uses the entire birth day (any time on that calendar date), so the
 * theoretical maximum is ~1440 min. We use a generous window — any co-occurrence
 * on the same calendar day counts.
 */
const PARAN_ORB_MINUTES = 1440; // Full day (Brady's method)

/**
 * Map from our planet IDs to astronomy-engine Body enum.
 * Only includes bodies that astronomy-engine can compute.
 */
const PLANET_BODY_MAP: Record<string, Body> = {
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

/**
 * The 8 user-defined star body slots in astronomy-engine.
 */
const STAR_BODIES: Body[] = [
  Body.Star1, Body.Star2, Body.Star3, Body.Star4,
  Body.Star5, Body.Star6, Body.Star7, Body.Star8,
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Convert ecliptic longitude (degrees) to approximate equatorial coordinates (RA/Dec).
 * Assumes ecliptic latitude = 0 (star on the ecliptic plane).
 *
 * @returns [ra (hours, 0-24), dec (degrees, -90 to +90)]
 */
function eclipticToEquatorial(eclipticLonDeg: number): [number, number] {
  const lonRad = (eclipticLonDeg * Math.PI) / 180;
  const sinLon = Math.sin(lonRad);
  const cosLon = Math.cos(lonRad);
  const sinObl = Math.sin(OBLIQUITY_RAD);
  const cosObl = Math.cos(OBLIQUITY_RAD);

  // RA = atan2(sinLon * cosObl, cosLon)
  let raRad = Math.atan2(sinLon * cosObl, cosLon);
  if (raRad < 0) raRad += 2 * Math.PI;
  const raHours = (raRad * 180) / Math.PI / 15; // Convert radians -> degrees -> hours

  // Dec = asin(sinLon * sinObl)
  const decRad = Math.asin(sinLon * sinObl);
  const decDeg = (decRad * 180) / Math.PI;

  return [raHours, decDeg];
}

/**
 * Create an AstroTime for the start of the birth date (00:00 UTC).
 * The birth date string is in ISO format "YYYY-MM-DD" and the timezone
 * is used to determine the local calendar date.
 */
function makeBirthDayStart(birthData: BirthData): AstroTime {
  // Parse birth date as local date, find start of that local day in UTC
  const [year, month, day] = birthData.dateOfBirth.split('-').map(Number);
  const [hours, minutes] = birthData.timeOfBirth.split(':').map(Number);

  // Use the actual birth time's UTC equivalent as an anchor, then scan +-12h
  // For simplicity we start from midnight UTC on the birth date
  // Brady's method: any co-occurrence on the birth calendar day counts
  return MakeTime(new Date(Date.UTC(year, month - 1, day, hours, minutes)));
}

// ─── Star Angle Event Calculation ─────────────────────────────────────────────

interface StarAngleEvent {
  star: FixedStar;
  angle: AngleType;
  time: AstroTime;
}

/**
 * Find all four angle events (rise, set, culminate, anti-culminate) for a
 * fixed star on the birth day.
 *
 * Because astronomy-engine only has 8 DefineStar slots, we process stars
 * in batches. This function handles a single star using a specified slot.
 */
function getStarAngleEvents(
  star: FixedStar,
  starBody: Body,
  observer: Observer,
  dayStart: AstroTime,
): StarAngleEvent[] {
  const events: StarAngleEvent[] = [];
  const [ra, dec] = eclipticToEquatorial(star.eclipticLongitude);

  // Register this star in the astronomy-engine slot
  DefineStar(starBody, ra, dec, 1000);

  // Search within 1 day from the anchor time
  try {
    // Rising (direction = +1)
    const rise = SearchRiseSet(starBody, observer, +1, dayStart, 1);
    if (rise) {
      events.push({ star, angle: 'rising', time: rise });
    }
  } catch {
    // Star may be circumpolar (never rises) at this latitude — skip
  }

  try {
    // Setting (direction = -1)
    const set = SearchRiseSet(starBody, observer, -1, dayStart, 1);
    if (set) {
      events.push({ star, angle: 'setting', time: set });
    }
  } catch {
    // Star may be circumpolar — skip
  }

  try {
    // Culminating (hour angle = 0, upper meridian transit)
    const culm = SearchHourAngle(starBody, observer, 0, dayStart, +1);
    if (culm) {
      events.push({ star, angle: 'culminating', time: culm.time });
    }
  } catch {
    // Unlikely to fail for culmination, but handle gracefully
  }

  try {
    // Anti-culminating (hour angle = 12, lower meridian transit)
    const antiCulm = SearchHourAngle(starBody, observer, 12, dayStart, +1);
    if (antiCulm) {
      events.push({ star, angle: 'anti-culminating', time: antiCulm.time });
    }
  } catch {
    // Handle gracefully
  }

  return events;
}

// ─── Planet Angle Detection ───────────────────────────────────────────────────

interface PlanetAngleMatch {
  planetId: string;
  planetAngle: AngleType;
  orbMinutes: number;
}

/**
 * For each planet, find its four angle events on the birth day,
 * then for a given star event time, check if any planet was near an angle.
 */
function findPlanetAnglesNearTime(
  starEventTime: AstroTime,
  planetAngleEvents: Map<string, { angle: AngleType; time: AstroTime }[]>,
): PlanetAngleMatch[] {
  const matches: PlanetAngleMatch[] = [];
  const starMs = starEventTime.date.getTime();

  for (const [planetId, events] of planetAngleEvents) {
    for (const event of events) {
      const diffMs = Math.abs(event.time.date.getTime() - starMs);
      const diffMinutes = diffMs / 60000;

      if (diffMinutes <= PARAN_ORB_MINUTES) {
        matches.push({
          planetId,
          planetAngle: event.angle,
          orbMinutes: Math.round(diffMinutes),
        });
      }
    }
  }

  return matches;
}

/**
 * Pre-compute all planet angle events (rise/set/culminate/anti-culminate)
 * for the birth day.
 */
function computePlanetAngleEvents(
  observer: Observer,
  dayStart: AstroTime,
): Map<string, { angle: AngleType; time: AstroTime }[]> {
  const planetEvents = new Map<string, { angle: AngleType; time: AstroTime }[]>();

  for (const [planetId, body] of Object.entries(PLANET_BODY_MAP)) {
    const events: { angle: AngleType; time: AstroTime }[] = [];

    try {
      const rise = SearchRiseSet(body, observer, +1, dayStart, 1);
      if (rise) events.push({ angle: 'rising', time: rise });
    } catch {
      // Circumpolar or other edge case
    }

    try {
      const set = SearchRiseSet(body, observer, -1, dayStart, 1);
      if (set) events.push({ angle: 'setting', time: set });
    } catch {
      // Circumpolar or other edge case
    }

    try {
      const culm = SearchHourAngle(body, observer, 0, dayStart, +1);
      if (culm) events.push({ angle: 'culminating', time: culm.time });
    } catch {
      // Handle gracefully
    }

    try {
      const antiCulm = SearchHourAngle(body, observer, 12, dayStart, +1);
      if (antiCulm) events.push({ angle: 'anti-culminating', time: antiCulm.time });
    } catch {
      // Handle gracefully
    }

    if (events.length > 0) {
      planetEvents.set(planetId, events);
    }
  }

  return planetEvents;
}

// ─── Main API ─────────────────────────────────────────────────────────────────

/**
 * Compute Brady's Parans for a birth chart.
 *
 * Finds all fixed stars that share an angle with a natal planet on the birth date.
 * A paran occurs when a star is on one angle while a planet is on any angle,
 * within the same calendar day (Brady's full-day method).
 *
 * @param birthData - Birth data with date, time, coordinates
 * @returns Array of parans sorted by orb (tightest first), grouped by star
 */
export function computeParans(birthData: BirthData): Paran[] {
  const { latitude, longitude } = birthData;

  // Require coordinates for mundane calculations
  if (latitude === undefined || longitude === undefined) {
    return [];
  }

  const observer = new Observer(latitude, longitude, 0);
  const dayStart = makeBirthDayStart(birthData);

  // Step 1: Compute all planet angle events for the birth day
  const planetAngleEvents = computePlanetAngleEvents(observer, dayStart);

  // Step 2: For each fixed star, find its angle events and match with planets
  const allParans: Paran[] = [];
  const stars = Array.from(fixedStars.values());

  // Process stars in batches of 8 (astronomy-engine DefineStar slot limit)
  for (let batchStart = 0; batchStart < stars.length; batchStart += STAR_BODIES.length) {
    const batch = stars.slice(batchStart, batchStart + STAR_BODIES.length);

    for (let i = 0; i < batch.length; i++) {
      const star = batch[i];
      const starBody = STAR_BODIES[i];
      const starEvents = getStarAngleEvents(star, starBody, observer, dayStart);

      for (const starEvent of starEvents) {
        const planetMatches = findPlanetAnglesNearTime(starEvent.time, planetAngleEvents);

        for (const match of planetMatches) {
          allParans.push({
            star: starEvent.star,
            starAngle: starEvent.angle,
            planetId: match.planetId,
            planetAngle: match.planetAngle,
            orbMinutes: match.orbMinutes,
          });
        }
      }
    }
  }

  // Sort by orb (tightest first)
  return allParans.sort((a, b) => a.orbMinutes - b.orbMinutes);
}

/**
 * Group parans by star for display purposes.
 */
export function groupParansByStar(parans: Paran[]): ParanGroup[] {
  const groups = new Map<string, ParanGroup>();

  for (const paran of parans) {
    let group = groups.get(paran.star.id);
    if (!group) {
      group = { star: paran.star, parans: [] };
      groups.set(paran.star.id, group);
    }
    group.parans.push(paran);
  }

  return Array.from(groups.values());
}

/**
 * Format an angle type for display.
 */
export function formatAngle(angle: AngleType): string {
  switch (angle) {
    case 'rising': return 'Rising';
    case 'setting': return 'Setting';
    case 'culminating': return 'Culminating';
    case 'anti-culminating': return 'Anti-Culminating';
  }
}
