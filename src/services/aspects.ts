// ============================================
// COSMIC COPILOT — Aspect Prioritization Utilities
// ============================================
// Functions for sorting, filtering, and prioritizing natal aspects

import type { NatalAspect } from '../types';

// Priority weights for different factors
const PRIORITY_WEIGHTS = {
  // Planet importance (highest priority for luminaries)
  luminary: 30,      // Sun, Moon
  angle: 25,         // Ascendant, Midheaven
  personal: 5,       // Mercury, Venus, Mars

  // Aspect type importance
  aspectType: {
    'conjunction': 20,
    'opposition': 18,
    'square': 16,
    'trine': 14,
    'sextile': 12,
    'quincunx': 8,
    'semi-square': 6,
    'sesqui-square': 6,
    'semi-sextile': 4,
    'quintile': 4,
    'biquintile': 4,
  } as Record<string, number>,

  // Orb scoring (tighter orbs = higher priority)
  maxOrbScore: 10,
};

// Planet categories for priority calculation
const LUMINARIES = ['sun', 'moon'];
const ANGLES = ['ascendant', 'midheaven', 'mc', 'asc'];
const PERSONAL_PLANETS = ['mercury', 'venus', 'mars'];

/**
 * Calculate the priority score for a natal aspect
 * Higher scores = more important aspects
 *
 * Factors:
 * 1. Luminary involvement (Sun, Moon) - highest weight
 * 2. Angle involvement (Ascendant, MC) - high weight
 * 3. Aspect type (conjunction > opposition > square > trine...)
 * 4. Orb tightness (tighter = higher priority)
 * 5. Personal planets (Mercury, Venus, Mars) - bonus
 */
export function calculateAspectPriority(aspect: NatalAspect): number {
  let priority = 0;

  // 1. Luminary involvement (highest priority)
  if (LUMINARIES.includes(aspect.planet1Id)) priority += PRIORITY_WEIGHTS.luminary;
  if (LUMINARIES.includes(aspect.planet2Id)) priority += PRIORITY_WEIGHTS.luminary;

  // 2. Angle involvement
  if (ANGLES.includes(aspect.planet1Id)) priority += PRIORITY_WEIGHTS.angle;
  if (ANGLES.includes(aspect.planet2Id)) priority += PRIORITY_WEIGHTS.angle;

  // 3. Aspect type importance
  priority += PRIORITY_WEIGHTS.aspectType[aspect.aspectId] || 0;

  // 4. Orb tightness (0° = 10 points, 10°+ = 0 points)
  const orbScore = Math.max(0, PRIORITY_WEIGHTS.maxOrbScore - aspect.orbDegree);
  priority += orbScore;

  // 5. Personal planets bonus
  if (PERSONAL_PLANETS.includes(aspect.planet1Id)) priority += PRIORITY_WEIGHTS.personal;
  if (PERSONAL_PLANETS.includes(aspect.planet2Id)) priority += PRIORITY_WEIGHTS.personal;

  return priority;
}

/**
 * Sort aspects by priority (highest first)
 */
export function sortAspectsByPriority(aspects: NatalAspect[]): NatalAspect[] {
  return [...aspects].sort((a, b) => {
    const priorityA = calculateAspectPriority(a);
    const priorityB = calculateAspectPriority(b);
    return priorityB - priorityA;
  });
}

/**
 * Get the top N aspects by priority
 */
export function getTopAspects(aspects: NatalAspect[], count: number): NatalAspect[] {
  return sortAspectsByPriority(aspects).slice(0, count);
}

/**
 * Filter aspects to only those involving specific planets
 */
export function filterAspectsByPlanets(
  aspects: NatalAspect[],
  planetIds: string[]
): NatalAspect[] {
  return aspects.filter(
    (aspect) =>
      planetIds.includes(aspect.planet1Id) || planetIds.includes(aspect.planet2Id)
  );
}

/**
 * Get aspects involving luminaries (Sun, Moon)
 */
export function getLuminaryAspects(aspects: NatalAspect[]): NatalAspect[] {
  return filterAspectsByPlanets(aspects, LUMINARIES);
}

/**
 * Get aspects involving angles (Ascendant, MC)
 */
export function getAngleAspects(aspects: NatalAspect[]): NatalAspect[] {
  return filterAspectsByPlanets(aspects, ANGLES);
}

/**
 * Get aspects by aspect type (e.g., all conjunctions)
 */
export function filterAspectsByType(
  aspects: NatalAspect[],
  aspectIds: string[]
): NatalAspect[] {
  return aspects.filter((aspect) => aspectIds.includes(aspect.aspectId));
}

/**
 * Group aspects by their nature (challenging, harmonious, neutral)
 */
export function groupAspectsByNature(aspects: NatalAspect[]): {
  challenging: NatalAspect[];
  harmonious: NatalAspect[];
  neutral: NatalAspect[];
} {
  const challenging: NatalAspect[] = [];
  const harmonious: NatalAspect[] = [];
  const neutral: NatalAspect[] = [];

  const CHALLENGING_ASPECTS = ['square', 'opposition', 'quincunx', 'semi-square', 'sesqui-square'];
  const HARMONIOUS_ASPECTS = ['trine', 'sextile', 'semi-sextile', 'quintile', 'biquintile'];
  const NEUTRAL_ASPECTS = ['conjunction'];

  for (const aspect of aspects) {
    if (CHALLENGING_ASPECTS.includes(aspect.aspectId)) {
      challenging.push(aspect);
    } else if (HARMONIOUS_ASPECTS.includes(aspect.aspectId)) {
      harmonious.push(aspect);
    } else if (NEUTRAL_ASPECTS.includes(aspect.aspectId)) {
      neutral.push(aspect);
    }
  }

  return { challenging, harmonious, neutral };
}

/**
 * Get priority tier for display purposes
 * Returns 'high', 'medium', or 'low' based on priority score
 */
export function getAspectPriorityTier(aspect: NatalAspect): 'high' | 'medium' | 'low' {
  const priority = calculateAspectPriority(aspect);

  // Thresholds:
  // High: 50+ (involves luminary + major aspect + tight orb)
  // Medium: 25-49 (involves personal planet or moderate aspect)
  // Low: <25 (minor aspects, wide orbs, outer planets only)
  if (priority >= 50) return 'high';
  if (priority >= 25) return 'medium';
  return 'low';
}

/**
 * Get aspects grouped by priority tier
 */
export function groupAspectsByPriorityTier(aspects: NatalAspect[]): {
  high: NatalAspect[];
  medium: NatalAspect[];
  low: NatalAspect[];
} {
  const high: NatalAspect[] = [];
  const medium: NatalAspect[] = [];
  const low: NatalAspect[] = [];

  for (const aspect of aspects) {
    const tier = getAspectPriorityTier(aspect);
    if (tier === 'high') high.push(aspect);
    else if (tier === 'medium') medium.push(aspect);
    else low.push(aspect);
  }

  // Sort each tier by priority
  return {
    high: sortAspectsByPriority(high),
    medium: sortAspectsByPriority(medium),
    low: sortAspectsByPriority(low),
  };
}

// Major aspects for quick filtering
export const MAJOR_ASPECT_IDS = ['conjunction', 'sextile', 'square', 'trine', 'opposition'];

// Minor aspects
export const MINOR_ASPECT_IDS = [
  'quincunx',
  'semi-sextile',
  'semi-square',
  'sesqui-square',
  'quintile',
  'biquintile',
];
