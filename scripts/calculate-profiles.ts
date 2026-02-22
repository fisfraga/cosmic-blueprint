/**
 * Profile Calculation Script
 *
 * Uses the existing chart calculation pipeline to compute
 * full CosmicProfile v2 fixtures for Felipe and Duda Fraga.
 *
 * True Node and Chiron positions are fetched from Swiss Ephemeris via a
 * Kerykeion Python helper for maximum accuracy, then injected into the chart
 * to override the Meeus/Keplerian approximations from ephemeris.ts.
 *
 * Run with: npx vite-node scripts/calculate-profiles.ts
 */

import {
  calculateProfilesFromBirthData,
  calculateHumanDesignProfile,
  toGateActivations,
} from '../src/services/chartCalculation';
import type { BirthData, CosmicProfile, PlanetaryPosition } from '../src/types';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// ESM-compatible __dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

// Path to Python venv in astrology-service
const PYTHON_BIN = resolve(__dirname, '../astrology-service/.venv/bin/python3');
const HELPER_SCRIPT = resolve(__dirname, 'get-true-node-chiron.py');

const ZODIAC_SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

/**
 * Get accurate True Node and Chiron longitudes from Swiss Ephemeris
 * via Kerykeion Python helper. The input date should be UTC.
 */
function getAccurateTrueNodeAndChiron(utcDate: Date): {
  trueNodeLon: number;
  chironLon: number;
  trueNodeRetro: boolean;
  chironRetro: boolean;
} | null {
  try {
    const y = utcDate.getUTCFullYear();
    const m = utcDate.getUTCMonth() + 1;
    const d = utcDate.getUTCDate();
    const h = utcDate.getUTCHours();
    const min = utcDate.getUTCMinutes();
    const cmd = `${PYTHON_BIN} ${HELPER_SCRIPT} ${y} ${m} ${d} ${h} ${min} 0 0 UTC`;
    const output = execSync(cmd, { encoding: 'utf8' }).trim();
    const result = JSON.parse(output);
    return {
      trueNodeLon: result.true_node as number,
      chironLon: result.chiron as number,
      trueNodeRetro: result.true_node_retrograde as boolean,
      chironRetro: result.chiron_retrograde as boolean,
    };
  } catch (err) {
    console.warn('  Warning: Kerykeion lookup failed, using approximate values:', String(err).split('\n')[0]);
    return null;
  }
}

/**
 * Override True Node and Chiron entries in a PlanetaryPosition array
 * with values from Swiss Ephemeris.
 */
function patchPositions(
  positions: PlanetaryPosition[],
  data: { trueNodeLon: number; chironLon: number; trueNodeRetro: boolean; chironRetro: boolean }
): PlanetaryPosition[] {
  return positions.map(p => {
    if (p.planetId === 'true-node' || p.planetId === 'chiron') {
      const lon = p.planetId === 'true-node' ? data.trueNodeLon : data.chironLon;
      const retro = p.planetId === 'true-node' ? data.trueNodeRetro : data.chironRetro;
      const normalizedLon = ((lon % 360) + 360) % 360;
      const signIndex = Math.floor(normalizedLon / 30);
      const degreeInSign = normalizedLon % 30;
      const degree = Math.floor(degreeInSign);
      const minute = Math.floor((degreeInSign - degree) * 60);
      return { ...p, longitude: lon, signId: ZODIAC_SIGNS[signIndex], degree, minute, retrograde: retro };
    }
    return p;
  });
}

const felipeBirthData: BirthData = {
  dateOfBirth: '1994-10-18',
  timeOfBirth: '08:10',
  timezone: 'America/Sao_Paulo',
  latitude: -22.9068,
  longitude: -43.1729,
  cityOfBirth: 'Rio de Janeiro',
};

const dudaBirthData: BirthData = {
  dateOfBirth: '1998-01-19',
  timeOfBirth: '06:20',
  timezone: 'America/Sao_Paulo',
  latitude: -22.9068,
  longitude: -43.1729,
  cityOfBirth: 'Rio de Janeiro',
};

function buildCosmicProfile(
  birthData: BirthData,
  id: string,
  name: string,
  relationship: string
): CosmicProfile {
  // Step 1: Run standard calculation (uses Meeus/Keplerian for TN + Chiron)
  const result = calculateProfilesFromBirthData(birthData);
  const chart = result.calculatedChart!;

  // Step 2: Get accurate True Node + Chiron from Swiss Ephemeris
  console.log(`  Fetching natal TN + Chiron (Swiss Ephemeris)...`);
  const natalAcc = getAccurateTrueNodeAndChiron(new Date(chart.natalDate));
  console.log(`  Fetching design TN + Chiron (Swiss Ephemeris)...`);
  const designAcc = getAccurateTrueNodeAndChiron(new Date(chart.designDate));

  if (natalAcc && designAcc) {
    // Step 3: Patch positions with exact values
    chart.natalPositions = patchPositions(chart.natalPositions, natalAcc);
    chart.designPositions = patchPositions(chart.designPositions, designAcc);

    // Step 4: Recompute gate activations with accurate positions
    chart.natalGates = toGateActivations(chart.natalPositions, true);
    chart.designGates = toGateActivations(chart.designPositions, false);

    // Step 5: Recompute HD profile with accurate gate activations
    result.humanDesignProfile = calculateHumanDesignProfile(
      chart.natalPositions,
      chart.designPositions
    );
  }

  return {
    profileVersion: 2,
    meta: {
      id,
      name,
      relationship,
      dateOfBirth: birthData.dateOfBirth,
      createdAt: '2026-02-22T00:00:00.000Z',
      lastViewedAt: '2026-02-22T00:00:00.000Z',
    },
    birthData,
    calculatedChart: chart,
    geneKeysProfile: result.geneKeysProfile,
    humanDesignProfile: result.humanDesignProfile,
    numerologyProfile: result.numerologyProfile,
  };
}

// Calculate Felipe
console.log('=== Calculating Felipe Fraga ===');
const felipeProfile = buildCosmicProfile(
  felipeBirthData,
  'felipe-fraga-19941018',
  'Felipe Fraga',
  'self'
);

// Calculate Duda
console.log('=== Calculating Duda Fraga ===');
const dudaProfile = buildCosmicProfile(
  dudaBirthData,
  'duda-fraga-19980119',
  'Duda Fraga',
  'partner'
);

// Write files
const profileDir = resolve(__dirname, '../src/data/profile');

writeFileSync(
  resolve(profileDir, 'felipe-fraga.json'),
  JSON.stringify(felipeProfile, null, 2) + '\n'
);
console.log('Wrote: src/data/profile/felipe-fraga.json');

writeFileSync(
  resolve(profileDir, 'duda-fraga.json'),
  JSON.stringify(dudaProfile, null, 2) + '\n'
);
console.log('Wrote: src/data/profile/duda-fraga.json');

// Print human-readable summary
function printSummary(label: string, profile: CosmicProfile) {
  const chart = profile.calculatedChart!;
  const gk = profile.geneKeysProfile!;
  const hd = profile.humanDesignProfile!;

  // Find Sun position
  const sun = chart.natalPositions.find(p => p.planetId === 'sun')!;
  const signNames: Record<string, string> = {
    aries: 'Aries', taurus: 'Taurus', gemini: 'Gemini', cancer: 'Cancer',
    leo: 'Leo', virgo: 'Virgo', libra: 'Libra', scorpio: 'Scorpio',
    sagittarius: 'Sagittarius', capricorn: 'Capricorn', aquarius: 'Aquarius', pisces: 'Pisces',
  };

  console.log(`\n--- ${label} ---`);
  console.log(`Sun: ${signNames[sun.signId]} ${sun.degree}°${sun.minute}' (longitude: ${sun.longitude.toFixed(4)}°)`);
  console.log(`Sun HD Gate: ${chart.natalGates.find(g => g.planet === 'Sun')?.gateNumber}.${chart.natalGates.find(g => g.planet === 'Sun')?.line}`);
  console.log(`Life's Work GK: ${gk.lifesWork.geneKeyNumber}.${gk.lifesWork.line}`);
  console.log(`HD Type: ${hd.type}`);
  console.log(`HD Authority: ${hd.authority}`);
  console.log(`HD Profile: ${hd.profile}`);
  console.log(`HD Definition: ${hd.definition}`);
  console.log(`Incarnation Cross: ${hd.incarnationCross}`);
  console.log(`Defined Centers: ${hd.definedCenterIds.join(', ')}`);
  console.log(`Defined Channels: ${hd.definedChannelIds.join(', ')}`);
  console.log(`Natal Date (UTC): ${chart.natalDate}`);
  console.log(`Design Date (UTC): ${chart.designDate}`);
  console.log(`Numerology Life Path: ${profile.numerologyProfile?.lifePathNumber}`);
  console.log(`Numerology Birthday: ${profile.numerologyProfile?.birthdayNumber}`);

  // Print all natal gates
  console.log(`\nPersonality Gates:`);
  for (const g of hd.personalityGates) {
    console.log(`  ${g.planet}: Gate ${g.gateNumber}.${g.line}`);
  }
  console.log(`\nDesign Gates:`);
  for (const g of hd.designGates) {
    console.log(`  ${g.planet}: Gate ${g.gateNumber}.${g.line}`);
  }

  // Print GK spheres
  console.log(`\nGene Keys Activation Sequence:`);
  console.log(`  Life's Work: GK ${gk.lifesWork.geneKeyNumber}.${gk.lifesWork.line} (${gk.lifesWork.planetarySource})`);
  console.log(`  Evolution: GK ${gk.evolution.geneKeyNumber}.${gk.evolution.line} (${gk.evolution.planetarySource})`);
  console.log(`  Radiance: GK ${gk.radiance.geneKeyNumber}.${gk.radiance.line} (${gk.radiance.planetarySource})`);
  console.log(`  Purpose: GK ${gk.purpose.geneKeyNumber}.${gk.purpose.line} (${gk.purpose.planetarySource})`);
}

printSummary('Felipe Fraga', felipeProfile);
printSummary('Duda Fraga', dudaProfile);

console.log('\n=== Done ===');
