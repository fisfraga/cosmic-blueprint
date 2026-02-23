/**
 * Year Ahead Calculation Services
 *
 * Reusable calculators for the Year Ahead contemplation category:
 * - Personal Year Number (numerology)
 * - Universal Year Number (numerology)
 * - Chakra 7-Year Lifecycle Phase
 * - Solar Return Date
 * - Yearly Slow-Planet Transit Highlights
 */

import { SearchSunLongitude, MakeTime } from 'astronomy-engine';
import { reduceToNumerology } from './profileEnrichment';
import { getPlanetaryPositions, longitudeToZodiac, isRetrograde } from './ephemeris';
import { getGateByDegree } from '../data';

// ─── Personal Year Number ────────────────────────────────────────────────────

/**
 * Calculate Personal Year Number.
 * Sum: birth month digits + birth day digits + target year digits → reduce to 1-9 (preserve 11/22/33).
 */
export function calculatePersonalYear(birthMonth: number, birthDay: number, year: number): number {
  const digits = `${birthMonth}${birthDay}${year}`;
  const sum = digits.split('').reduce((acc, d) => acc + Number(d), 0);
  return reduceToNumerology(sum);
}

// ─── Universal Year Number ───────────────────────────────────────────────────

/**
 * Calculate Universal Year Number.
 * Sum all digits of the year → reduce to 1-9 (preserve 11/22/33).
 */
export function calculateUniversalYear(year: number): number {
  const sum = String(year).split('').reduce((acc, d) => acc + Number(d), 0);
  return reduceToNumerology(sum);
}

// ─── Chakra 7-Year Lifecycle ─────────────────────────────────────────────────

export interface ChakraLifecyclePhase {
  chakraNumber: number;        // 1-7
  chakraId: string;            // e.g. "chakra-5-throat"
  chakraName: string;          // e.g. "Throat (Vishuddha)"
  periodStartAge: number;      // e.g. 28
  periodEndAge: number;        // e.g. 35
  yearInPeriod: number;        // e.g. 5 (year 5 of 7)
  cycleNumber: number;         // e.g. 5 (5th 7-year cycle)
  isTransitionYear: boolean;   // last year of period
}

const CHAKRA_MAP: Array<{ id: string; name: string }> = [
  { id: 'chakra-1-root',         name: 'Root (Muladhara)' },
  { id: 'chakra-2-sacral',       name: 'Sacral (Svadhisthana)' },
  { id: 'chakra-3-solar-plexus', name: 'Solar Plexus (Manipura)' },
  { id: 'chakra-4-heart',        name: 'Heart (Anahata)' },
  { id: 'chakra-5-throat',       name: 'Throat (Vishuddha)' },
  { id: 'chakra-6-third-eye',    name: 'Third Eye (Ajna)' },
  { id: 'chakra-7-crown',        name: 'Crown (Sahasrara)' },
];

/**
 * Get the chakra lifecycle phase for a person at a given date.
 * The 7-year cycle: 0-7=Root, 7-14=Sacral, ..., 42-49=Crown, then repeats.
 *
 * @param birthDate ISO date string (YYYY-MM-DD)
 * @param targetDate Date to calculate phase for
 */
export function getChakraLifecyclePhase(birthDate: string, targetDate: Date): ChakraLifecyclePhase {
  const birth = new Date(birthDate + 'T00:00:00');
  const ageMs = targetDate.getTime() - birth.getTime();
  const ageYears = ageMs / (365.25 * 24 * 60 * 60 * 1000);
  const age = Math.floor(ageYears);

  // Which 7-year cycle (1-indexed)
  const cycleNumber = Math.floor(age / 7) + 1;

  // Which chakra within the cycle (0-6)
  const chakraIndex = (Math.floor(age / 7)) % 7;

  // Period boundaries
  const periodStartAge = Math.floor(age / 7) * 7;
  const periodEndAge = periodStartAge + 7;

  // Year within the 7-year period (1-7)
  const yearInPeriod = (age % 7) + 1;

  const chakra = CHAKRA_MAP[chakraIndex];

  return {
    chakraNumber: chakraIndex + 1,
    chakraId: chakra.id,
    chakraName: chakra.name,
    periodStartAge,
    periodEndAge,
    yearInPeriod,
    cycleNumber,
    isTransitionYear: yearInPeriod === 7,
  };
}

// ─── Solar Return Date ───────────────────────────────────────────────────────

/**
 * Calculate the exact solar return date for a given year.
 * Uses astronomy-engine SearchSunLongitude to find when the transiting Sun
 * returns to the natal Sun's exact ecliptic longitude.
 *
 * @param natalSunLongitude Natal Sun ecliptic longitude (0-360°)
 * @param year Target year for the solar return
 * @returns Exact UTC Date of the solar return
 */
export function calculateSolarReturnDate(natalSunLongitude: number, year: number): Date {
  // Start searching from Jan 1 of the target year
  const startTime = MakeTime(new Date(`${year}-01-01T00:00:00Z`));
  const result = SearchSunLongitude(natalSunLongitude, startTime, 366);
  if (!result) {
    throw new Error(`Solar return not found for longitude ${natalSunLongitude} in ${year}`);
  }
  return result.date;
}

// ─── Yearly Slow-Planet Transit Highlights ───────────────────────────────────

export interface YearlyTransitHighlight {
  month: number;         // 1-12
  planet: string;        // e.g. "Jupiter"
  planetId: string;      // e.g. "jupiter"
  signId: string;        // e.g. "gemini"
  signName: string;      // e.g. "Gemini"
  gateNumber: number;    // HD gate number
  line: number;          // HD gate line
  isRetrograde: boolean;
}

const SLOW_PLANETS: Array<{ id: string; name: string }> = [
  { id: 'jupiter', name: 'Jupiter' },
  { id: 'saturn', name: 'Saturn' },
  { id: 'uranus', name: 'Uranus' },
  { id: 'neptune', name: 'Neptune' },
  { id: 'pluto', name: 'Pluto' },
];

/**
 * Compute first-of-month positions for the 5 slow planets across a calendar year.
 * Shows which signs + HD gates they occupy month by month.
 */
export function getYearlySlowTransits(year: number): YearlyTransitHighlight[] {
  const highlights: YearlyTransitHighlight[] = [];

  for (let month = 1; month <= 12; month++) {
    const date = new Date(`${year}-${String(month).padStart(2, '0')}-01T00:00:00Z`);
    const positions = getPlanetaryPositions(date);

    for (const planet of SLOW_PLANETS) {
      const lon = positions[planet.id as keyof typeof positions] as number;
      const zodiac = longitudeToZodiac(lon);
      const gateResult = getGateByDegree(lon);
      const retro = isRetrograde(planet.id, date);

      const SIGN_NAMES: Record<string, string> = {
        aries: 'Aries', taurus: 'Taurus', gemini: 'Gemini', cancer: 'Cancer',
        leo: 'Leo', virgo: 'Virgo', libra: 'Libra', scorpio: 'Scorpio',
        sagittarius: 'Sagittarius', capricorn: 'Capricorn', aquarius: 'Aquarius', pisces: 'Pisces',
      };

      highlights.push({
        month,
        planet: planet.name,
        planetId: planet.id,
        signId: zodiac.sign,
        signName: SIGN_NAMES[zodiac.sign] || zodiac.sign,
        gateNumber: gateResult?.gate.gateNumber ?? 0,
        line: gateResult?.line ?? 0,
        isRetrograde: retro,
      });
    }
  }

  return highlights;
}
