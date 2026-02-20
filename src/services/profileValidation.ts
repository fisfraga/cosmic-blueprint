/**
 * Profile Validation Service
 *
 * Validates Gene Keys and Human Design profile data by:
 * 1. Calculating planetary positions for natal and design dates
 * 2. Mapping positions to Gates/Gene Keys
 * 3. Comparing calculated values against stored profile values
 */

import { getPlanetaryPositions, longitudeToZodiac, type PlanetaryPositions } from './ephemeris';
import { getGateByDegree } from '../data';
import type { AstroProfile, GeneKeySphere } from '../types';

// ============================================
// Types
// ============================================

export interface BirthData {
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:MM
  timezone: string;
  latitude: number;
  longitude: number;
  cityOfBirth: string;
}

export interface CalculatedPosition {
  planetId: string;
  longitude: number;
  zodiac: {
    sign: string;
    signIndex: number;
    degree: number;
    minute: number;
  };
  gate: {
    gateNumber: number;
    gateName: string;
    line: number;
  } | null;
  geneKey: {
    keyNumber: number;
    line: number;
  } | null;
}

export interface CalculatedSphere {
  sphereName: string;
  sphereId: string;
  planetarySource: string;
  isDesign: boolean;
  calculated: {
    geneKeyNumber: number;
    line: number;
  };
  stored?: {
    geneKeyNumber: number;
    line: number;
  };
  match: boolean;
  discrepancy?: string;
}

export interface ValidationReport {
  profileName: string;
  birthData: BirthData;
  natalDate: Date;
  designDate: Date;
  designDaysBeforeBirth: number;

  // Calculated positions
  natalPositions: CalculatedPosition[];
  designPositions: CalculatedPosition[];

  // Sphere validations
  sphereValidations: CalculatedSphere[];

  // Summary
  totalSpheres: number;
  matchingSpheres: number;
  mismatchingSpheres: number;
  validationPassed: boolean;
}

// ============================================
// Design Date Calculation
// ============================================

/**
 * Calculate the Design Date (approximately 88 days before birth)
 *
 * In Human Design, the Design calculation uses the moment when the Sun
 * was 88 degrees earlier in the zodiac (not exactly 88 calendar days).
 * For simplicity, we approximate with 88 calendar days, which is close
 * enough for validation purposes.
 *
 * @param birthDate - The birth date
 * @returns The design date (approximately 88 days before birth)
 */
export function calculateDesignDate(birthDate: Date): Date {
  const designDate = new Date(birthDate);
  designDate.setDate(designDate.getDate() - 88);
  return designDate;
}

/**
 * Calculate the exact Design Date based on 88° of solar arc
 *
 * This is the more accurate calculation that tracks when the Sun
 * was 88° earlier in the zodiac. The Sun moves approximately 1° per day,
 * but this varies slightly, so we need to find the exact moment.
 *
 * @param birthDate - The birth date
 * @param birthSunLongitude - The Sun's longitude at birth
 * @returns The design date when Sun was 88° earlier
 */
export function calculateExactDesignDate(birthDate: Date, birthSunLongitude: number): Date {
  // Target longitude is 88° before birth Sun position
  const targetLongitude = ((birthSunLongitude - 88) % 360 + 360) % 360;

  // Start with approximation (88 days before)
  const designDate = new Date(birthDate);
  designDate.setDate(designDate.getDate() - 88);

  // Refine by checking actual Sun position
  // Binary search to find the exact date
  let lowDate = new Date(birthDate);
  lowDate.setDate(lowDate.getDate() - 95); // Start 95 days before
  let highDate = new Date(birthDate);
  highDate.setDate(highDate.getDate() - 80); // End 80 days before

  for (let i = 0; i < 10; i++) {
    const midDate = new Date((lowDate.getTime() + highDate.getTime()) / 2);
    const midPositions = getPlanetaryPositions(midDate);
    const midSunLon = midPositions.sun;

    // Calculate angular distance (accounting for 0°/360° boundary)
    let diff = midSunLon - targetLongitude;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    if (Math.abs(diff) < 0.1) {
      // Close enough (within ~0.1° or ~2.4 hours)
      return midDate;
    }

    if (diff > 0) {
      // Sun is ahead of target, need earlier date
      highDate = midDate;
    } else {
      // Sun is behind target, need later date
      lowDate = midDate;
    }
  }

  // Return best approximation
  return new Date((lowDate.getTime() + highDate.getTime()) / 2);
}

// ============================================
// Position Calculation
// ============================================

/**
 * Calculate Earth's position (opposite the Sun)
 *
 * @param sunLongitude - Sun's ecliptic longitude (0-360)
 * @returns Earth's longitude (180° opposite the Sun)
 */
export function calculateEarthPosition(sunLongitude: number): number {
  return (sunLongitude + 180) % 360;
}

/**
 * Convert planetary positions to calculated positions with gate/gene key info
 */
export function calculatePositionsWithGates(positions: PlanetaryPositions): CalculatedPosition[] {
  const planetIds = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'] as const;

  const results: CalculatedPosition[] = [];

  for (const planetId of planetIds) {
    const longitude = positions[planetId];
    const zodiac = longitudeToZodiac(longitude);
    const gateResult = getGateByDegree(longitude);

    results.push({
      planetId,
      longitude,
      zodiac,
      gate: gateResult ? {
        gateNumber: gateResult.gate.gateNumber,
        gateName: gateResult.gate.name,
        line: gateResult.line,
      } : null,
      geneKey: gateResult ? {
        keyNumber: gateResult.gate.gateNumber, // Gene Key number = Gate number
        line: gateResult.line,
      } : null,
    });
  }

  // Add Earth position (opposite Sun)
  const earthLongitude = calculateEarthPosition(positions.sun);
  const earthZodiac = longitudeToZodiac(earthLongitude);
  const earthGateResult = getGateByDegree(earthLongitude);

  results.push({
    planetId: 'earth',
    longitude: earthLongitude,
    zodiac: earthZodiac,
    gate: earthGateResult ? {
      gateNumber: earthGateResult.gate.gateNumber,
      gateName: earthGateResult.gate.name,
      line: earthGateResult.line,
    } : null,
    geneKey: earthGateResult ? {
      keyNumber: earthGateResult.gate.gateNumber,
      line: earthGateResult.line,
    } : null,
  });

  return results;
}

// ============================================
// Sphere Mapping
// ============================================

/**
 * Mapping of Gene Keys spheres to their planetary sources
 */
const SPHERE_PLANET_MAP: Record<string, { planetId: string; isDesign: boolean }> = {
  // Activation Sequence
  'lifesWork': { planetId: 'sun', isDesign: false },
  'evolution': { planetId: 'earth', isDesign: false },
  'radiance': { planetId: 'sun', isDesign: true },
  'purpose': { planetId: 'earth', isDesign: true },

  // Venus Sequence
  'attraction': { planetId: 'moon', isDesign: true },
  'iq': { planetId: 'venus', isDesign: false },
  'eq': { planetId: 'mars', isDesign: false },
  'sq': { planetId: 'venus', isDesign: true },
  'core': { planetId: 'mars', isDesign: true },

  // Pearl Sequence
  'vocation': { planetId: 'mars', isDesign: true },
  'culture': { planetId: 'jupiter', isDesign: true },
  'brand': { planetId: 'sun', isDesign: false },
  'pearl': { planetId: 'jupiter', isDesign: false },

  // Additional Spheres
  'relating': { planetId: 'mercury', isDesign: false },
  'creativity': { planetId: 'uranus', isDesign: true },
  'stability': { planetId: 'saturn', isDesign: true },
};

const SPHERE_NAMES: Record<string, string> = {
  'lifesWork': "Life's Work",
  'evolution': 'Evolution',
  'radiance': 'Radiance',
  'purpose': 'Purpose',
  'attraction': 'Attraction',
  'iq': 'IQ',
  'eq': 'EQ',
  'sq': 'SQ',
  'core': 'Core',
  'vocation': 'Vocation',
  'culture': 'Culture',
  'brand': 'Brand',
  'pearl': 'Pearl',
  'relating': 'Relating',
  'creativity': 'Creativity',
  'stability': 'Stability',
};

// ============================================
// Validation
// ============================================

/**
 * Extract birth data from an AstroProfile
 */
export function extractBirthData(profile: AstroProfile): BirthData {
  return {
    dateOfBirth: profile.dateOfBirth,
    timeOfBirth: profile.timeOfBirth,
    timezone: profile.coordinates?.timezone || 'UTC',
    latitude: profile.coordinates?.latitude || 0,
    longitude: profile.coordinates?.longitude || 0,
    cityOfBirth: profile.cityOfBirth,
  };
}

/**
 * Parse birth date and time into a Date object
 */
export function parseBirthDateTime(birthData: BirthData): Date {
  const [year, month, day] = birthData.dateOfBirth.split('-').map(Number);
  const [hour, minute] = birthData.timeOfBirth.split(':').map(Number);

  // Create date in UTC (ephemeris calculations are in UTC)
  // For more accurate results, we'd need to convert from local timezone
  return new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
}

/**
 * Validate a Gene Keys profile against calculated positions
 */
export function validateGeneKeysProfile(profile: AstroProfile): ValidationReport {
  const birthData = extractBirthData(profile);
  const natalDate = parseBirthDateTime(birthData);

  // Get natal planetary positions
  const natalPlanetary = getPlanetaryPositions(natalDate);
  const natalPositions = calculatePositionsWithGates(natalPlanetary);

  // Calculate design date and get design planetary positions
  const designDate = calculateExactDesignDate(natalDate, natalPlanetary.sun);
  const designDaysBeforeBirth = Math.round((natalDate.getTime() - designDate.getTime()) / (1000 * 60 * 60 * 24));
  const designPlanetary = getPlanetaryPositions(designDate);
  const designPositions = calculatePositionsWithGates(designPlanetary);

  // Validate each sphere
  const sphereValidations: CalculatedSphere[] = [];
  const gkProfile = profile.geneKeysProfile;

  for (const [sphereKey, mapping] of Object.entries(SPHERE_PLANET_MAP)) {
    const positions = mapping.isDesign ? designPositions : natalPositions;
    const position = positions.find(p => p.planetId === mapping.planetId);

    if (!position || !position.geneKey) {
      sphereValidations.push({
        sphereName: SPHERE_NAMES[sphereKey] || sphereKey,
        sphereId: sphereKey,
        planetarySource: `${mapping.isDesign ? 'Design' : 'Natal'} ${mapping.planetId.charAt(0).toUpperCase() + mapping.planetId.slice(1)}`,
        isDesign: mapping.isDesign,
        calculated: { geneKeyNumber: 0, line: 0 },
        match: false,
        discrepancy: 'Could not calculate position',
      });
      continue;
    }

    // Get stored value if exists
    const storedSphere = gkProfile?.[sphereKey as keyof typeof gkProfile] as GeneKeySphere | undefined;
    const stored = storedSphere && typeof storedSphere === 'object' && 'geneKeyNumber' in storedSphere ? {
      geneKeyNumber: storedSphere.geneKeyNumber,
      line: storedSphere.line,
    } : undefined;

    const calculated = {
      geneKeyNumber: position.geneKey.keyNumber,
      line: position.geneKey.line,
    };

    const match = stored
      ? stored.geneKeyNumber === calculated.geneKeyNumber && stored.line === calculated.line
      : false;

    const discrepancy = !match && stored
      ? `Expected GK-${calculated.geneKeyNumber}.${calculated.line}, stored GK-${stored.geneKeyNumber}.${stored.line}`
      : !stored
        ? 'No stored value'
        : undefined;

    sphereValidations.push({
      sphereName: SPHERE_NAMES[sphereKey] || sphereKey,
      sphereId: sphereKey,
      planetarySource: `${mapping.isDesign ? 'Design' : 'Natal'} ${mapping.planetId.charAt(0).toUpperCase() + mapping.planetId.slice(1)}`,
      isDesign: mapping.isDesign,
      calculated,
      stored,
      match,
      discrepancy,
    });
  }

  const matchingSpheres = sphereValidations.filter(s => s.match).length;
  const mismatchingSpheres = sphereValidations.filter(s => !s.match).length;

  return {
    profileName: profile.name,
    birthData,
    natalDate,
    designDate,
    designDaysBeforeBirth,
    natalPositions,
    designPositions,
    sphereValidations,
    totalSpheres: sphereValidations.length,
    matchingSpheres,
    mismatchingSpheres,
    validationPassed: mismatchingSpheres === 0,
  };
}

// ============================================
// Report Generation
// ============================================

/**
 * Format a validation report as a readable string
 */
export function formatValidationReport(report: ValidationReport): string {
  const lines: string[] = [];

  lines.push('=' .repeat(60));
  lines.push('PROFILE VALIDATION REPORT');
  lines.push('=' .repeat(60));
  lines.push('');

  // Profile Info
  lines.push(`Profile: ${report.profileName}`);
  lines.push(`Birth Date: ${report.birthData.dateOfBirth} ${report.birthData.timeOfBirth}`);
  lines.push(`Location: ${report.birthData.cityOfBirth}`);
  lines.push(`Coordinates: ${report.birthData.latitude}, ${report.birthData.longitude}`);
  lines.push('');

  // Design Date
  lines.push(`Natal Date (UTC): ${report.natalDate.toISOString()}`);
  lines.push(`Design Date (UTC): ${report.designDate.toISOString()}`);
  lines.push(`Design Days Before Birth: ${report.designDaysBeforeBirth}`);
  lines.push('');

  // Natal Positions
  lines.push('-'.repeat(60));
  lines.push('NATAL PLANETARY POSITIONS');
  lines.push('-'.repeat(60));
  for (const pos of report.natalPositions) {
    const zodiacStr = `${pos.zodiac.sign} ${pos.zodiac.degree}°${pos.zodiac.minute}'`;
    const gateStr = pos.gate ? `Gate ${pos.gate.gateNumber}.${pos.gate.line}` : 'N/A';
    lines.push(`  ${pos.planetId.padEnd(10)} ${zodiacStr.padEnd(20)} ${gateStr}`);
  }
  lines.push('');

  // Design Positions
  lines.push('-'.repeat(60));
  lines.push('DESIGN PLANETARY POSITIONS');
  lines.push('-'.repeat(60));
  for (const pos of report.designPositions) {
    const zodiacStr = `${pos.zodiac.sign} ${pos.zodiac.degree}°${pos.zodiac.minute}'`;
    const gateStr = pos.gate ? `Gate ${pos.gate.gateNumber}.${pos.gate.line}` : 'N/A';
    lines.push(`  ${pos.planetId.padEnd(10)} ${zodiacStr.padEnd(20)} ${gateStr}`);
  }
  lines.push('');

  // Sphere Validations
  lines.push('-'.repeat(60));
  lines.push('GENE KEYS SPHERE VALIDATION');
  lines.push('-'.repeat(60));
  for (const sphere of report.sphereValidations) {
    const calcStr = `GK-${sphere.calculated.geneKeyNumber}.${sphere.calculated.line}`;
    const storedStr = sphere.stored ? `GK-${sphere.stored.geneKeyNumber}.${sphere.stored.line}` : 'N/A';
    const status = sphere.match ? '✓' : '✗';
    lines.push(`  ${status} ${sphere.sphereName.padEnd(15)} (${sphere.planetarySource.padEnd(15)})`);
    lines.push(`      Calculated: ${calcStr.padEnd(10)} Stored: ${storedStr}`);
    if (sphere.discrepancy) {
      lines.push(`      ⚠ ${sphere.discrepancy}`);
    }
  }
  lines.push('');

  // Summary
  lines.push('=' .repeat(60));
  lines.push('SUMMARY');
  lines.push('=' .repeat(60));
  lines.push(`Total Spheres: ${report.totalSpheres}`);
  lines.push(`Matching: ${report.matchingSpheres}`);
  lines.push(`Mismatching: ${report.mismatchingSpheres}`);
  lines.push(`Validation: ${report.validationPassed ? 'PASSED ✓' : 'FAILED ✗'}`);
  lines.push('');

  return lines.join('\n');
}

/**
 * Generate expected Gene Keys profile based on calculated positions
 */
export function generateExpectedGeneKeysProfile(
  natalPositions: CalculatedPosition[],
  designPositions: CalculatedPosition[]
): Record<string, { geneKeyNumber: number; line: number; planetarySource: string }> {
  const expected: Record<string, { geneKeyNumber: number; line: number; planetarySource: string }> = {};

  for (const [sphereKey, mapping] of Object.entries(SPHERE_PLANET_MAP)) {
    const positions = mapping.isDesign ? designPositions : natalPositions;
    const position = positions.find(p => p.planetId === mapping.planetId);

    if (position?.geneKey) {
      expected[sphereKey] = {
        geneKeyNumber: position.geneKey.keyNumber,
        line: position.geneKey.line,
        planetarySource: `${mapping.isDesign ? 'Pre-Natal / Design' : 'Natal'} ${mapping.planetId.charAt(0).toUpperCase() + mapping.planetId.slice(1)}`,
      };
    }
  }

  return expected;
}
