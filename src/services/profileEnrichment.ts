/**
 * Profile Enrichment Service
 *
 * Calculates Numerology, Chakra Activations, and Alchemical Profile
 * from BirthData + NatalPlacements. Called at the end of the chart
 * calculation pipeline to enrich CosmicProfile with these three systems.
 */

import type {
  BirthData,
  NatalPlacement,
  NumerologyProfile,
  ChakraActivation,
  AlchemicalProfile,
  CosmicProfile,
} from '../types';
import { chakras } from '../data';

/**
 * Reduce a number to a single digit, preserving master numbers 11, 22, 33.
 */
function reduceToNumerology(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n;
  if (n <= 9) return n;
  const sum = String(n)
    .split('')
    .reduce((acc, digit) => acc + Number(digit), 0);
  return reduceToNumerology(sum);
}

/**
 * Calculate Life Path Number from date of birth.
 * Sum ALL digits of the full date string (without dashes), then reduce.
 */
export function calculateLifePathNumber(dateOfBirth: string): number {
  const digits = dateOfBirth.replace(/-/g, '');
  const sum = digits
    .split('')
    .reduce((acc, digit) => acc + Number(digit), 0);
  return reduceToNumerology(sum);
}

/**
 * Calculate Birthday Number from the day portion of date of birth.
 * Extract the day, sum its digits, then reduce.
 */
export function calculateBirthdayNumber(dateOfBirth: string): number {
  const day = parseInt(dateOfBirth.split('-')[2], 10);
  return reduceToNumerology(day);
}

const MASTER_NUMBERS = [11, 22, 33] as const;

/**
 * Compute the base digit for a master number.
 * 33 → 3+3 = 6, 22 → 2+2 = 4, 11 → 1+1 = 2
 */
function getMasterBase(master: number): number {
  return String(master)
    .split('')
    .reduce((acc, d) => acc + Number(d), 0);
}

/**
 * Calculate full numerology profile from birth data.
 * Master numbers (11, 22, 33) are preserved and their base digit is
 * stored separately so the AI can present them as "33/6" format.
 */
export function calculateNumerologyProfile(birthData: BirthData): NumerologyProfile {
  const lifePathNumber = calculateLifePathNumber(birthData.dateOfBirth);
  const birthdayNumber = calculateBirthdayNumber(birthData.dateOfBirth);
  return {
    lifePathNumber,
    birthdayNumber,
    lifePathBase: (MASTER_NUMBERS as readonly number[]).includes(lifePathNumber)
      ? getMasterBase(lifePathNumber)
      : undefined,
    birthdayBase: (MASTER_NUMBERS as readonly number[]).includes(birthdayNumber)
      ? getMasterBase(birthdayNumber)
      : undefined,
    lifePathEntityId: `num-${lifePathNumber}`,
    birthdayEntityId: `num-${birthdayNumber}`,
  };
}

/**
 * Calculate chakra activations from natal placements.
 * For each chakra, find placements whose signId matches
 * any of the chakra's relatedSigns.
 */
export function calculateChakraActivations(placements: NatalPlacement[]): ChakraActivation[] {
  const activations: ChakraActivation[] = [];

  for (const chakra of chakras.values()) {
    const relatedSigns = chakra.relatedSigns; // lowercase sign names
    const matchingPlacements = placements.filter(
      (p) => relatedSigns.includes(p.signId)
    );

    if (matchingPlacements.length > 0) {
      activations.push({
        chakraId: chakra.id,
        activatingPlanetIds: matchingPlacements.map((p) => p.planetId),
        primarySignId: matchingPlacements[0].signId,
        alchemicalSubstance: chakra.alchemicalSubstance,
      });
    }
  }

  return activations;
}

/**
 * Map an alchemical substance string to one of the three canonical buckets.
 */
function classifySubstance(substance: string): 'sulphur' | 'mercury' | 'salt' {
  const lower = substance.toLowerCase();

  // Check for transition strings first (assign to first-mentioned element)
  if (lower.includes('sulphur-sal') || lower.includes('sulphur')) {
    return 'sulphur';
  }
  if (lower.includes('sal-mercurius') || lower === 'sal' || lower.startsWith('sal ')) {
    return 'salt';
  }
  if (lower.includes('mercurius')) {
    return 'mercury';
  }

  // Default fallback
  return 'salt';
}

/**
 * Calculate alchemical profile from chakra activations.
 * Counts activating planets per substance bucket.
 */
export function calculateAlchemicalProfile(chakraActivations: ChakraActivation[]): AlchemicalProfile {
  let sulphurCount = 0;
  let mercuryCount = 0;
  let saltCount = 0;
  const allPlanetIds = new Set<string>();

  for (const activation of chakraActivations) {
    const bucket = classifySubstance(activation.alchemicalSubstance);
    const count = activation.activatingPlanetIds.length;

    switch (bucket) {
      case 'sulphur':
        sulphurCount += count;
        break;
      case 'mercury':
        mercuryCount += count;
        break;
      case 'salt':
        saltCount += count;
        break;
    }

    for (const planetId of activation.activatingPlanetIds) {
      allPlanetIds.add(planetId);
    }
  }

  // Determine dominant substance (tie goes to salt)
  let dominantSubstance: 'sulphur' | 'mercury' | 'salt' = 'salt';
  if (sulphurCount > mercuryCount && sulphurCount > saltCount) {
    dominantSubstance = 'sulphur';
  } else if (mercuryCount > sulphurCount && mercuryCount > saltCount) {
    dominantSubstance = 'mercury';
  }

  return {
    dominantSubstance,
    sulphurCount,
    mercuryCount,
    saltCount,
    activatingPlanetIds: Array.from(allPlanetIds),
  };
}

/**
 * Main enrichment function.
 * Calculates numerology from birth data, and optionally
 * chakra activations + alchemical profile from placements.
 */
export function enrichProfile(
  birthData: BirthData,
  placements?: NatalPlacement[]
): Partial<Pick<CosmicProfile, 'numerologyProfile' | 'chakraActivations' | 'alchemicalProfile'>> {
  const enrichment: Partial<Pick<CosmicProfile, 'numerologyProfile' | 'chakraActivations' | 'alchemicalProfile'>> = {};

  enrichment.numerologyProfile = calculateNumerologyProfile(birthData);

  if (placements && placements.length > 0) {
    const chakraActivations = calculateChakraActivations(placements);
    if (chakraActivations.length > 0) {
      enrichment.chakraActivations = chakraActivations;
      enrichment.alchemicalProfile = calculateAlchemicalProfile(chakraActivations);
    }
  }

  return enrichment;
}
