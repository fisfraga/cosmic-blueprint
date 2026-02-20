/**
 * Profile Validation Runner
 *
 * This script runs the validation for the Felipe Fraga profile and outputs
 * the full validation report.
 *
 * Run with: npx tsx scripts/runValidation.ts
 *
 * Note: This script uses the same calculation logic as the app but runs
 * in Node.js with tsx for easier testing.
 */

// @ts-expect-error - astronomy-engine CommonJS import
import * as Astronomy from 'astronomy-engine';
const { Body, GeoVector, Ecliptic, EclipticLongitude } = Astronomy;

// ============================================
// Constants
// ============================================

const PLANET_ORDER = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'] as const;

type PlanetId = (typeof PLANET_ORDER)[number];

interface PlanetaryPositions {
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

// ============================================
// HD Gates Data (simplified for validation)
// ============================================

// Gate degree ranges - each gate spans ~5.625° (360°/64)
// The wheel starts at 0° Aries = 15° in the HD wheel system
// This is a simplified mapping based on the tropical zodiac positions

interface GateRange {
  gateNumber: number;
  degreeStart: number;
  degreeEnd: number;
}

// HD Gates mapped to zodiac degrees (0° Aries = 0°)
// Source: Human Design gate positions in tropical zodiac
const HD_GATES: GateRange[] = [
  { gateNumber: 41, degreeStart: 0, degreeEnd: 5.625 },
  { gateNumber: 19, degreeStart: 5.625, degreeEnd: 11.25 },
  { gateNumber: 13, degreeStart: 11.25, degreeEnd: 16.875 },
  { gateNumber: 49, degreeStart: 16.875, degreeEnd: 22.5 },
  { gateNumber: 30, degreeStart: 22.5, degreeEnd: 28.125 },
  { gateNumber: 55, degreeStart: 28.125, degreeEnd: 33.75 },
  { gateNumber: 37, degreeStart: 33.75, degreeEnd: 39.375 },
  { gateNumber: 63, degreeStart: 39.375, degreeEnd: 45 },
  { gateNumber: 22, degreeStart: 45, degreeEnd: 50.625 },
  { gateNumber: 36, degreeStart: 50.625, degreeEnd: 56.25 },
  { gateNumber: 25, degreeStart: 56.25, degreeEnd: 61.875 },
  { gateNumber: 17, degreeStart: 61.875, degreeEnd: 67.5 },
  { gateNumber: 21, degreeStart: 67.5, degreeEnd: 73.125 },
  { gateNumber: 51, degreeStart: 73.125, degreeEnd: 78.75 },
  { gateNumber: 42, degreeStart: 78.75, degreeEnd: 84.375 },
  { gateNumber: 3, degreeStart: 84.375, degreeEnd: 90 },
  { gateNumber: 27, degreeStart: 90, degreeEnd: 95.625 },
  { gateNumber: 24, degreeStart: 95.625, degreeEnd: 101.25 },
  { gateNumber: 2, degreeStart: 101.25, degreeEnd: 106.875 },
  { gateNumber: 23, degreeStart: 106.875, degreeEnd: 112.5 },
  { gateNumber: 8, degreeStart: 112.5, degreeEnd: 118.125 },
  { gateNumber: 20, degreeStart: 118.125, degreeEnd: 123.75 },
  { gateNumber: 16, degreeStart: 123.75, degreeEnd: 129.375 },
  { gateNumber: 35, degreeStart: 129.375, degreeEnd: 135 },
  { gateNumber: 45, degreeStart: 135, degreeEnd: 140.625 },
  { gateNumber: 12, degreeStart: 140.625, degreeEnd: 146.25 },
  { gateNumber: 15, degreeStart: 146.25, degreeEnd: 151.875 },
  { gateNumber: 52, degreeStart: 151.875, degreeEnd: 157.5 },
  { gateNumber: 39, degreeStart: 157.5, degreeEnd: 163.125 },
  { gateNumber: 53, degreeStart: 163.125, degreeEnd: 168.75 },
  { gateNumber: 62, degreeStart: 168.75, degreeEnd: 174.375 },
  { gateNumber: 56, degreeStart: 174.375, degreeEnd: 180 },
  { gateNumber: 31, degreeStart: 180, degreeEnd: 185.625 },
  { gateNumber: 33, degreeStart: 185.625, degreeEnd: 191.25 },
  { gateNumber: 7, degreeStart: 191.25, degreeEnd: 196.875 },
  { gateNumber: 4, degreeStart: 196.875, degreeEnd: 202.5 },
  { gateNumber: 29, degreeStart: 202.5, degreeEnd: 208.125 },
  { gateNumber: 59, degreeStart: 208.125, degreeEnd: 213.75 },
  { gateNumber: 40, degreeStart: 213.75, degreeEnd: 219.375 },
  { gateNumber: 64, degreeStart: 219.375, degreeEnd: 225 },
  { gateNumber: 47, degreeStart: 225, degreeEnd: 230.625 },
  { gateNumber: 6, degreeStart: 230.625, degreeEnd: 236.25 },
  { gateNumber: 46, degreeStart: 236.25, degreeEnd: 241.875 },
  { gateNumber: 18, degreeStart: 241.875, degreeEnd: 247.5 },
  { gateNumber: 48, degreeStart: 247.5, degreeEnd: 253.125 },
  { gateNumber: 57, degreeStart: 253.125, degreeEnd: 258.75 },
  { gateNumber: 32, degreeStart: 258.75, degreeEnd: 264.375 },
  { gateNumber: 50, degreeStart: 264.375, degreeEnd: 270 },
  { gateNumber: 28, degreeStart: 270, degreeEnd: 275.625 },
  { gateNumber: 44, degreeStart: 275.625, degreeEnd: 281.25 },
  { gateNumber: 1, degreeStart: 281.25, degreeEnd: 286.875 },
  { gateNumber: 43, degreeStart: 286.875, degreeEnd: 292.5 },
  { gateNumber: 14, degreeStart: 292.5, degreeEnd: 298.125 },
  { gateNumber: 34, degreeStart: 298.125, degreeEnd: 303.75 },
  { gateNumber: 9, degreeStart: 303.75, degreeEnd: 309.375 },
  { gateNumber: 5, degreeStart: 309.375, degreeEnd: 315 },
  { gateNumber: 26, degreeStart: 315, degreeEnd: 320.625 },
  { gateNumber: 11, degreeStart: 320.625, degreeEnd: 326.25 },
  { gateNumber: 10, degreeStart: 326.25, degreeEnd: 331.875 },
  { gateNumber: 58, degreeStart: 331.875, degreeEnd: 337.5 },
  { gateNumber: 38, degreeStart: 337.5, degreeEnd: 343.125 },
  { gateNumber: 54, degreeStart: 343.125, degreeEnd: 348.75 },
  { gateNumber: 61, degreeStart: 348.75, degreeEnd: 354.375 },
  { gateNumber: 60, degreeStart: 354.375, degreeEnd: 360 },
];

// ============================================
// Calculation Functions
// ============================================

function calculateLongitude(planetId: PlanetId, date: Date): number {
  const body = BODY_MAP[planetId];

  try {
    if (body === Body.Sun) {
      const sunVec = GeoVector(body, date, true);
      const eclip = Ecliptic(sunVec);
      return eclip.elon;
    } else {
      return EclipticLongitude(body, date);
    }
  } catch (e) {
    console.error(`Error calculating ${planetId} for ${date}:`, e);
    return 0;
  }
}

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

function longitudeToZodiac(longitude: number): { sign: string; degree: number; minute: number } {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

  const normalizedLon = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLon / 30);
  const degreeInSign = normalizedLon % 30;
  const degree = Math.floor(degreeInSign);
  const minute = Math.floor((degreeInSign - degree) * 60);

  return { sign: signs[signIndex], degree, minute };
}

function getGateByDegree(absoluteDegree: number): { gateNumber: number; line: number } | undefined {
  const normalizedDegree = ((absoluteDegree % 360) + 360) % 360;

  for (const gate of HD_GATES) {
    if (normalizedDegree >= gate.degreeStart && normalizedDegree < gate.degreeEnd) {
      const gateSpan = gate.degreeEnd - gate.degreeStart;
      const positionInGate = normalizedDegree - gate.degreeStart;
      const line = Math.floor((positionInGate / gateSpan) * 6) + 1;
      return { gateNumber: gate.gateNumber, line: Math.min(Math.max(line, 1), 6) };
    }
  }

  // Handle wraparound at 360°
  if (normalizedDegree >= 354.375) {
    const gate = HD_GATES.find(g => g.gateNumber === 60)!;
    const positionInGate = normalizedDegree - gate.degreeStart;
    const gateSpan = gate.degreeEnd - gate.degreeStart;
    const line = Math.floor((positionInGate / gateSpan) * 6) + 1;
    return { gateNumber: 60, line: Math.min(Math.max(line, 1), 6) };
  }

  return undefined;
}

function calculateEarthPosition(sunLongitude: number): number {
  return (sunLongitude + 180) % 360;
}

function calculateDesignDate(birthDate: Date, birthSunLongitude: number): Date {
  // Target longitude is 88° before birth Sun position
  const targetLongitude = ((birthSunLongitude - 88) % 360 + 360) % 360;

  // Binary search to find the exact date when Sun was at target longitude
  let lowDate = new Date(birthDate);
  lowDate.setDate(lowDate.getDate() - 95);
  let highDate = new Date(birthDate);
  highDate.setDate(highDate.getDate() - 80);

  for (let i = 0; i < 15; i++) {
    const midDate = new Date((lowDate.getTime() + highDate.getTime()) / 2);
    const midPositions = calculatePositions(midDate);
    const midSunLon = midPositions.sun;

    let diff = midSunLon - targetLongitude;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    if (Math.abs(diff) < 0.05) {
      return midDate;
    }

    if (diff > 0) {
      highDate = midDate;
    } else {
      lowDate = midDate;
    }
  }

  return new Date((lowDate.getTime() + highDate.getTime()) / 2);
}

// ============================================
// Sphere Mapping
// ============================================

const SPHERE_PLANET_MAP: Record<string, { planetId: string; isDesign: boolean }> = {
  'lifesWork': { planetId: 'sun', isDesign: false },
  'evolution': { planetId: 'earth', isDesign: false },
  'radiance': { planetId: 'sun', isDesign: true },
  'purpose': { planetId: 'earth', isDesign: true },
  'attraction': { planetId: 'moon', isDesign: true },
  'iq': { planetId: 'venus', isDesign: false },
  'eq': { planetId: 'mars', isDesign: false },
  'sq': { planetId: 'venus', isDesign: true },
  'core': { planetId: 'mars', isDesign: true },
  'vocation': { planetId: 'mars', isDesign: true },
  'culture': { planetId: 'jupiter', isDesign: true },
  'brand': { planetId: 'sun', isDesign: false },
  'pearl': { planetId: 'jupiter', isDesign: false },
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
// Felipe Fraga Profile Data
// ============================================

const FELIPE_STORED = {
  lifesWork: { geneKeyNumber: 32, line: 5 },
  evolution: { geneKeyNumber: 42, line: 5 },
  radiance: { geneKeyNumber: 56, line: 1 },
  purpose: { geneKeyNumber: 60, line: 1 },
  attraction: { geneKeyNumber: 15, line: 3 },
  iq: { geneKeyNumber: 48, line: 5 },
  eq: { geneKeyNumber: 4, line: 2 },
  sq: { geneKeyNumber: 50, line: 1 },
  core: { geneKeyNumber: 16, line: 6 },
  vocation: { geneKeyNumber: 16, line: 6 },
  culture: { geneKeyNumber: 28, line: 4 },
  pearl: { geneKeyNumber: 1, line: 6 },
  brand: { geneKeyNumber: 32, line: 5 },
  relating: { geneKeyNumber: 57, line: 1 },
  creativity: { geneKeyNumber: 54, line: 4 },
  stability: { geneKeyNumber: 36, line: 1 },
};

// ============================================
// Main Validation
// ============================================

function runValidation() {
  console.log('='.repeat(70));
  console.log('FELIPE FRAGA PROFILE VALIDATION REPORT');
  console.log('='.repeat(70));
  console.log('');

  // Birth data
  const birthData = {
    date: '1994-10-18',
    time: '08:10',
    city: 'Rio de Janeiro, Brazil',
    lat: -22.9068,
    lon: -43.1729,
    timezone: 'America/Sao_Paulo (UTC-3)',
  };

  console.log('BIRTH DATA:');
  console.log(`  Date: ${birthData.date}`);
  console.log(`  Time: ${birthData.time} (local)`);
  console.log(`  City: ${birthData.city}`);
  console.log(`  Coordinates: ${birthData.lat}, ${birthData.lon}`);
  console.log(`  Timezone: ${birthData.timezone}`);
  console.log('');

  // Create natal date (convert to UTC: Rio is UTC-3, so add 3 hours)
  const natalDate = new Date(Date.UTC(1994, 9, 18, 11, 10, 0)); // 08:10 + 3 hours = 11:10 UTC
  console.log(`  Natal Date (UTC): ${natalDate.toISOString()}`);

  // Get natal positions
  const natalPositions = calculatePositions(natalDate);

  // Calculate design date
  const designDate = calculateDesignDate(natalDate, natalPositions.sun);
  const designDays = Math.round((natalDate.getTime() - designDate.getTime()) / (1000 * 60 * 60 * 24));
  console.log(`  Design Date (UTC): ${designDate.toISOString()}`);
  console.log(`  Design Days Before Birth: ${designDays}`);
  console.log('');

  // Get design positions
  const designPositions = calculatePositions(designDate);

  // Calculate Earth positions
  const natalEarth = calculateEarthPosition(natalPositions.sun);
  const designEarth = calculateEarthPosition(designPositions.sun);

  // Output natal positions
  console.log('-'.repeat(70));
  console.log('NATAL PLANETARY POSITIONS');
  console.log('-'.repeat(70));

  for (const planetId of [...PLANET_ORDER, 'earth'] as const) {
    const lon = planetId === 'earth' ? natalEarth : natalPositions[planetId as PlanetId];
    const zodiac = longitudeToZodiac(lon);
    const gate = getGateByDegree(lon);
    const gateStr = gate ? `Gate ${gate.gateNumber}.${gate.line}` : 'N/A';
    console.log(`  ${planetId.padEnd(10)} ${zodiac.sign.padEnd(12)} ${String(zodiac.degree).padStart(2)}°${String(zodiac.minute).padStart(2)}'  ${gateStr}`);
  }
  console.log('');

  // Output design positions
  console.log('-'.repeat(70));
  console.log('DESIGN PLANETARY POSITIONS');
  console.log('-'.repeat(70));

  for (const planetId of [...PLANET_ORDER, 'earth'] as const) {
    const lon = planetId === 'earth' ? designEarth : designPositions[planetId as PlanetId];
    const zodiac = longitudeToZodiac(lon);
    const gate = getGateByDegree(lon);
    const gateStr = gate ? `Gate ${gate.gateNumber}.${gate.line}` : 'N/A';
    console.log(`  ${planetId.padEnd(10)} ${zodiac.sign.padEnd(12)} ${String(zodiac.degree).padStart(2)}°${String(zodiac.minute).padStart(2)}'  ${gateStr}`);
  }
  console.log('');

  // Validate spheres
  console.log('-'.repeat(70));
  console.log('GENE KEYS SPHERE VALIDATION');
  console.log('-'.repeat(70));
  console.log('');

  let matches = 0;
  let mismatches = 0;

  for (const [sphereKey, mapping] of Object.entries(SPHERE_PLANET_MAP)) {
    const sphereName = SPHERE_NAMES[sphereKey];
    const positions = mapping.isDesign ? designPositions : natalPositions;
    const earthLon = mapping.isDesign ? designEarth : natalEarth;

    let lon: number;
    if (mapping.planetId === 'earth') {
      lon = earthLon;
    } else {
      lon = positions[mapping.planetId as PlanetId];
    }

    const calculated = getGateByDegree(lon);
    const stored = FELIPE_STORED[sphereKey as keyof typeof FELIPE_STORED];

    const calcStr = calculated ? `GK-${calculated.gateNumber}.${calculated.line}` : 'N/A';
    const storedStr = `GK-${stored.geneKeyNumber}.${stored.line}`;
    const match = calculated &&
                  calculated.gateNumber === stored.geneKeyNumber &&
                  calculated.line === stored.line;

    const status = match ? '✓' : '✗';
    const sourceType = mapping.isDesign ? 'Design' : 'Natal';
    const sourcePlanet = mapping.planetId.charAt(0).toUpperCase() + mapping.planetId.slice(1);

    console.log(`${status} ${sphereName.padEnd(15)} (${sourceType} ${sourcePlanet.padEnd(8)})`);
    console.log(`    Calculated: ${calcStr.padEnd(12)} Stored: ${storedStr}`);

    if (!match) {
      console.log(`    ⚠ MISMATCH: Expected ${calcStr}, but stored ${storedStr}`);
      mismatches++;
    } else {
      matches++;
    }
    console.log('');
  }

  // Summary
  console.log('='.repeat(70));
  console.log('SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total Spheres: ${matches + mismatches}`);
  console.log(`Matching: ${matches}`);
  console.log(`Mismatching: ${mismatches}`);
  console.log(`Validation: ${mismatches === 0 ? 'PASSED ✓' : 'FAILED ✗'}`);
  console.log('');

  if (mismatches > 0) {
    console.log('='.repeat(70));
    console.log('CORRECTED VALUES');
    console.log('='.repeat(70));
    console.log('');
    console.log('Use these values to update the profile:');
    console.log('');

    for (const [sphereKey, mapping] of Object.entries(SPHERE_PLANET_MAP)) {
      // sphereName available via SPHERE_NAMES[sphereKey] if needed
      const positions = mapping.isDesign ? designPositions : natalPositions;
      const earthLon = mapping.isDesign ? designEarth : natalEarth;

      let lon: number;
      if (mapping.planetId === 'earth') {
        lon = earthLon;
      } else {
        lon = positions[mapping.planetId as PlanetId];
      }

      const calculated = getGateByDegree(lon);
      const stored = FELIPE_STORED[sphereKey as keyof typeof FELIPE_STORED];

      const match = calculated &&
                    calculated.gateNumber === stored.geneKeyNumber &&
                    calculated.line === stored.line;

      if (!match && calculated) {
        console.log(`${sphereKey}: { geneKeyNumber: ${calculated.gateNumber}, line: ${calculated.line} },`);
      }
    }
  }
}

// Run the validation
runValidation();
