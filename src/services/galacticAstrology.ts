// Galactic Astrology Service — Sprint R
// Finds natal conjunctions to the major galactic points
// (Galactic Center, Galactic Anti-Center, Super Galactic Center, Great Attractor)
import type { GalacticPoint, NatalPlacement } from '../types';
import type { TransitPosition } from './transits';
import { galacticPoints, signPositionToAbsoluteDegree } from '../data';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GalacticConjunction {
  point: GalacticPoint;
  planetId: string;
  placement: NatalPlacement;
  eclipticLongitudePlanet: number;
  orbDegree: number;
  isExact: boolean; // orb ≤ 0.5°
}

export interface GalacticTransitActivation {
  point: GalacticPoint;
  transitPlanetId: string;
  transitPlanetName: string;
  transitPlanetSymbol: string;
  transitLongitude: number;
  orbDegree: number;
  /** True when this transit activates a natal planet already conjunct this galactic point */
  isPersonal: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Compute the angular separation between two ecliptic longitudes,
 * handling the 0°/360° wraparound.
 */
function eclipticOrb(lon1: number, lon2: number): number {
  const diff = Math.abs(lon1 - lon2);
  return Math.min(diff, 360 - diff);
}

// ─── Natal Conjunctions ───────────────────────────────────────────────────────

/**
 * Find all galactic point conjunctions for a set of natal placements.
 *
 * @param placements - Array of natal planet placements (from AstroProfile)
 * @returns Conjunctions sorted by orb (tightest first)
 *
 * @example
 * // Sun at 27° Sag (= 267°) → conjuncts Galactic Center (267.15°) within 2° orb
 * getGalacticConjunctions(profile.placements)
 */
export function getGalacticConjunctions(placements: NatalPlacement[]): GalacticConjunction[] {
  const conjunctions: GalacticConjunction[] = [];

  for (const placement of placements) {
    const planetLon = signPositionToAbsoluteDegree(
      placement.signId,
      placement.degree,
      placement.minute,
    );

    for (const point of galacticPoints.values()) {
      const orb = eclipticOrb(planetLon, point.eclipticLongitude);
      if (orb <= point.orb) {
        conjunctions.push({
          point,
          planetId: placement.planetId,
          placement,
          eclipticLongitudePlanet: planetLon,
          orbDegree: orb,
          isExact: orb <= 0.5,
        });
      }
    }
  }

  return conjunctions.sort((a, b) => a.orbDegree - b.orbDegree);
}

/**
 * Check whether a natal chart has any galactic point conjunctions at all.
 */
export function hasGalacticConjunctions(placements: NatalPlacement[]): boolean {
  return getGalacticConjunctions(placements).length > 0;
}

/**
 * Get the single tightest galactic conjunction, if any.
 */
export function getTightestGalacticConjunction(
  placements: NatalPlacement[],
): GalacticConjunction | null {
  const all = getGalacticConjunctions(placements);
  return all.length > 0 ? all[0] : null;
}

// ─── Transit Activations ──────────────────────────────────────────────────────

/**
 * Find real-time sky activations: transiting planets currently conjunct any galactic point.
 *
 * @param transitPositions - Current transit positions (degree = absolute ecliptic longitude)
 * @param natalConjunctions - Optional: natal conjunctions to flag personal activations
 */
export function getGalacticTransitActivations(
  transitPositions: TransitPosition[],
  natalConjunctions?: GalacticConjunction[],
): GalacticTransitActivation[] {
  const activations: GalacticTransitActivation[] = [];
  const natalPointIds = new Set(natalConjunctions?.map((c) => c.point.id) ?? []);

  for (const transit of transitPositions) {
    for (const point of galacticPoints.values()) {
      const orb = eclipticOrb(transit.degree, point.eclipticLongitude);
      if (orb <= point.orb) {
        activations.push({
          point,
          transitPlanetId: transit.planetId,
          transitPlanetName: transit.planetName,
          transitPlanetSymbol: transit.symbol,
          transitLongitude: transit.degree,
          orbDegree: orb,
          isPersonal: natalPointIds.has(point.id),
        });
      }
    }
  }

  return activations.sort((a, b) => a.orbDegree - b.orbDegree);
}

/**
 * Format galactic conjunctions into a compact narrative for AI context.
 */
export function formatGalacticConjunctionsForContext(
  conjunctions: GalacticConjunction[],
): string {
  if (conjunctions.length === 0) {
    return 'No natal galactic point conjunctions within orb.';
  }

  return conjunctions
    .map((c) => {
      const exactLabel = c.isExact ? ' (exact)' : '';
      return `- ${c.placement.planetId.replace(/-/g, ' ')} conjunct ${c.point.name} at ${c.orbDegree.toFixed(2)}° orb${exactLabel}. Archetype: ${c.point.archetype}. Theme: ${c.point.contemplationTheme}`;
    })
    .join('\n');
}
