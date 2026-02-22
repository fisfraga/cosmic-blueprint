/**
 * Profile Calculation Script
 *
 * Uses the existing chart calculation pipeline to compute
 * full CosmicProfile v2 fixtures for Felipe and Duda Fraga.
 *
 * Run with: npx vite-node scripts/calculate-profiles.ts
 */

import { calculateProfilesFromBirthData } from '../src/services/chartCalculation';
import type { BirthData, CosmicProfile } from '../src/types';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

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
  const result = calculateProfilesFromBirthData(birthData);

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
    calculatedChart: result.calculatedChart,
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
