/**
 * Transit-to-Natal Aspect Calculation Service
 *
 * Calculates aspects between current transiting planets and natal chart positions.
 * Uses accurate ephemeris data for transit positions.
 */

import { getPlanetaryPositions } from './ephemeris';
import { signPositionToAbsoluteDegree } from '../data';
import { planets } from '../data';

// Natal placement interface matching ProfileContext structure
export interface NatalPlacement {
  planetId: string;
  signId: string;
  degree: number;
  minute: number;
  retrograde?: boolean;
}

export interface TransitNatalAspect {
  transitPlanet: string;
  transitPlanetId: string;
  transitSymbol: string;
  transitDegree: number;
  transitSign: string;
  natalPlanet: string;
  natalPlanetId: string;
  natalSymbol: string;
  natalDegree: number;
  natalSign: string;
  aspectType: string;
  aspectSymbol: string;
  aspectAngle: number;
  orb: number;
  isApplying: boolean;
  nature: 'harmonious' | 'challenging' | 'neutral';
  importance: number; // Higher = more significant (based on planets involved)
}

// Aspect definitions with orbs for transit aspects
// Transit orbs are typically tighter than natal orbs
const TRANSIT_ASPECTS = [
  { name: 'Conjunction', symbol: '☌', angle: 0, orb: 8, nature: 'neutral' as const },
  { name: 'Sextile', symbol: '⚹', angle: 60, orb: 4, nature: 'harmonious' as const },
  { name: 'Square', symbol: '□', angle: 90, orb: 6, nature: 'challenging' as const },
  { name: 'Trine', symbol: '△', angle: 120, orb: 6, nature: 'harmonious' as const },
  { name: 'Opposition', symbol: '☍', angle: 180, orb: 8, nature: 'challenging' as const },
];

// Planet importance for sorting (higher = more impactful transits)
const TRANSIT_PLANET_IMPORTANCE: Record<string, number> = {
  pluto: 10,
  neptune: 9,
  uranus: 8,
  saturn: 7,
  jupiter: 6,
  mars: 5,
  sun: 4,
  venus: 3,
  mercury: 2,
  moon: 1,
};

const NATAL_PLANET_IMPORTANCE: Record<string, number> = {
  sun: 10,
  moon: 9,
  ascendant: 8,
  midheaven: 7,
  mercury: 6,
  venus: 5,
  mars: 5,
  jupiter: 4,
  saturn: 4,
  uranus: 3,
  neptune: 3,
  pluto: 3,
  northnode: 2,
  southnode: 2,
  chiron: 2,
};

// Planet symbols lookup
const PLANET_SYMBOLS: Record<string, string> = {
  sun: '☉',
  moon: '☽',
  mercury: '☿',
  venus: '♀',
  mars: '♂',
  jupiter: '♃',
  saturn: '♄',
  uranus: '♅',
  neptune: '♆',
  pluto: '♇',
  ascendant: 'AC',
  midheaven: 'MC',
  northnode: '☊',
  southnode: '☋',
  chiron: '⚷',
};

/**
 * Convert longitude to sign ID
 */
function longitudeToSignId(longitude: number): string {
  const signs = [
    'aries', 'taurus', 'gemini', 'cancer',
    'leo', 'virgo', 'libra', 'scorpio',
    'sagittarius', 'capricorn', 'aquarius', 'pisces',
  ];
  const normalizedLon = ((longitude % 360) + 360) % 360;
  return signs[Math.floor(normalizedLon / 30)];
}

/**
 * Calculate angular difference between two positions (0-180)
 */
function angularDifference(deg1: number, deg2: number): number {
  let diff = Math.abs(deg1 - deg2);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

/**
 * Determine if an aspect is applying or separating
 * Applying = transit planet moving toward exact aspect
 */
function isAspectApplying(
  transitDegree: number,
  natalDegree: number,
  aspectAngle: number
): boolean {
  // Simplified: compare with yesterday's position direction
  // For now, use a heuristic based on which side of exact the transit is
  const currentDiff = angularDifference(transitDegree, natalDegree);

  // If the orb is getting smaller, it's applying
  // Use planet speed direction as proxy
  // Most planets move direct (counter-clockwise in the zodiac)
  // So if transit is behind natal + aspect angle, it's applying

  const targetDegree = (natalDegree + aspectAngle) % 360;
  const altTargetDegree = (natalDegree - aspectAngle + 360) % 360;

  // Simplified: within 1 degree of exact is applying
  const exactOrb = Math.min(
    angularDifference(transitDegree, targetDegree),
    angularDifference(transitDegree, altTargetDegree)
  );

  return exactOrb < 1 || currentDiff > aspectAngle;
}

/**
 * Get planet name with proper capitalization
 */
function getPlanetName(planetId: string): string {
  const planet = planets.get(planetId);
  return planet?.name || planetId.charAt(0).toUpperCase() + planetId.slice(1);
}

/**
 * Calculate all transit-to-natal aspects for a given date
 */
export function calculateTransitNatalAspects(
  date: Date,
  natalPlacements: NatalPlacement[]
): TransitNatalAspect[] {
  const transits = getPlanetaryPositions(date);
  const aspects: TransitNatalAspect[] = [];

  // Transit planets we're tracking
  const transitPlanets = [
    { id: 'sun', degree: transits.sun },
    { id: 'moon', degree: transits.moon },
    { id: 'mercury', degree: transits.mercury },
    { id: 'venus', degree: transits.venus },
    { id: 'mars', degree: transits.mars },
    { id: 'jupiter', degree: transits.jupiter },
    { id: 'saturn', degree: transits.saturn },
    { id: 'uranus', degree: transits.uranus },
    { id: 'neptune', degree: transits.neptune },
    { id: 'pluto', degree: transits.pluto },
  ];

  // Convert natal placements to absolute degrees
  const natalPositions = natalPlacements.map(placement => ({
    ...placement,
    absoluteDegree: signPositionToAbsoluteDegree(
      placement.signId,
      placement.degree,
      placement.minute
    ),
  }));

  // Check each transit planet against each natal planet
  for (const transit of transitPlanets) {
    const transitSignId = longitudeToSignId(transit.degree);

    for (const natal of natalPositions) {
      // Skip self-aspects (e.g., transiting Sun to natal Sun can be meaningful though)
      // Actually, let's keep these - transiting planet to natal same planet is significant

      const diff = angularDifference(transit.degree, natal.absoluteDegree);

      // Check against each aspect type
      for (const aspectDef of TRANSIT_ASPECTS) {
        const orb = Math.abs(diff - aspectDef.angle);

        if (orb <= aspectDef.orb) {
          const transitImportance = TRANSIT_PLANET_IMPORTANCE[transit.id] || 1;
          const natalImportance = NATAL_PLANET_IMPORTANCE[natal.planetId] || 1;
          const importance = transitImportance + natalImportance;

          aspects.push({
            transitPlanet: getPlanetName(transit.id),
            transitPlanetId: transit.id,
            transitSymbol: PLANET_SYMBOLS[transit.id] || '?',
            transitDegree: Math.round(transit.degree * 100) / 100,
            transitSign: transitSignId,
            natalPlanet: getPlanetName(natal.planetId),
            natalPlanetId: natal.planetId,
            natalSymbol: PLANET_SYMBOLS[natal.planetId] || '?',
            natalDegree: natal.absoluteDegree,
            natalSign: natal.signId,
            aspectType: aspectDef.name,
            aspectSymbol: aspectDef.symbol,
            aspectAngle: aspectDef.angle,
            orb: Math.round(orb * 100) / 100,
            isApplying: isAspectApplying(
              transit.degree,
              natal.absoluteDegree,
              aspectDef.angle
            ),
            nature: aspectDef.nature,
            importance,
          });
        }
      }
    }
  }

  // Sort by importance (highest first), then by orb (tightest first)
  return aspects.sort((a, b) => {
    if (b.importance !== a.importance) return b.importance - a.importance;
    return a.orb - b.orb;
  });
}

/**
 * Get a brief interpretation of a transit aspect
 */
export function getTransitInterpretation(aspect: TransitNatalAspect): string {
  const natureText = {
    harmonious: 'supports',
    challenging: 'activates tension with',
    neutral: 'merges with',
  };

  const transitTheme = getTransitTheme(aspect.transitPlanetId);
  const natalTheme = getNatalTheme(aspect.natalPlanetId);

  return `Transit ${aspect.transitPlanet} ${natureText[aspect.nature]} your natal ${aspect.natalPlanet}. ${transitTheme} meets ${natalTheme}.`;
}

function getTransitTheme(planetId: string): string {
  const themes: Record<string, string> = {
    sun: 'Vitality and conscious awareness',
    moon: 'Emotional currents and needs',
    mercury: 'Mental activity and communication',
    venus: 'Love, values, and pleasure',
    mars: 'Drive, action, and assertion',
    jupiter: 'Growth, optimism, and opportunity',
    saturn: 'Structure, responsibility, and lessons',
    uranus: 'Sudden change and awakening',
    neptune: 'Inspiration, dreams, and dissolution',
    pluto: 'Transformation and deep power',
  };
  return themes[planetId] || 'Cosmic energy';
}

function getNatalTheme(planetId: string): string {
  const themes: Record<string, string> = {
    sun: 'your core identity',
    moon: 'your emotional nature',
    mercury: 'your mind and communication style',
    venus: 'your values and relationships',
    mars: 'your drive and desires',
    jupiter: 'your path of growth',
    saturn: 'your structures and boundaries',
    uranus: 'your individuality',
    neptune: 'your dreams and spirituality',
    pluto: 'your transformative power',
    ascendant: 'your self-image and approach',
    midheaven: 'your public role and direction',
    northnode: 'your soul growth direction',
    southnode: 'your familiar patterns',
    chiron: 'your healing journey',
  };
  return themes[planetId] || 'your being';
}

/**
 * Filter aspects to show only the most significant ones
 */
export function getTopTransitAspects(
  aspects: TransitNatalAspect[],
  limit: number = 5
): TransitNatalAspect[] {
  // Already sorted by importance, just take top N
  return aspects.slice(0, limit);
}

/**
 * Group aspects by nature (harmonious, challenging, neutral)
 */
export function groupAspectsByNature(
  aspects: TransitNatalAspect[]
): Record<'harmonious' | 'challenging' | 'neutral', TransitNatalAspect[]> {
  return {
    harmonious: aspects.filter(a => a.nature === 'harmonious'),
    challenging: aspects.filter(a => a.nature === 'challenging'),
    neutral: aspects.filter(a => a.nature === 'neutral'),
  };
}

/**
 * Get aspects involving a specific natal planet
 */
export function getAspectsToNatalPlanet(
  aspects: TransitNatalAspect[],
  natalPlanetId: string
): TransitNatalAspect[] {
  return aspects.filter(a => a.natalPlanetId === natalPlanetId);
}

/**
 * Get aspects from a specific transiting planet
 */
export function getAspectsFromTransitPlanet(
  aspects: TransitNatalAspect[],
  transitPlanetId: string
): TransitNatalAspect[] {
  return aspects.filter(a => a.transitPlanetId === transitPlanetId);
}
