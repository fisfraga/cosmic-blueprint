// Fixed Stars Calculation Service
// Ecliptic conjunction approach for V1 (Brady's parans = future Sprint Q)
import type { FixedStar, NatalPlacement } from '../types';
import type { TransitPosition } from './transits';
import { fixedStars, signPositionToAbsoluteDegree } from '../data';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FixedStarConjunction {
  star: FixedStar;
  planetId: string;
  placement: NatalPlacement;
  eclipticLongitudePlanet: number;
  orbDegree: number;
  isExact: boolean; // orb ≤ 0.5°
}

export interface TransitStarActivation {
  star: FixedStar;
  transitPlanetId: string;
  transitPlanetName: string;
  transitPlanetSymbol: string;
  transitLongitude: number;
  orbDegree: number;
  /** True when the transit also touches a natal fixed star conjunction */
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
 * Find all fixed star conjunctions for a set of natal placements.
 * A conjunction is detected when the planet falls within the star's orb.
 *
 * @param placements - Array of natal planet placements (from AstroProfile)
 * @returns Conjunctions sorted by orb (tightest first)
 *
 * @example
 * // Sun at 0° Virgo (= 150° ecliptic) → conjuncts Regulus (150°) within 2° orb
 * getFixedStarConjunctions(profile.placements)
 */
export function getFixedStarConjunctions(placements: NatalPlacement[]): FixedStarConjunction[] {
  const conjunctions: FixedStarConjunction[] = [];

  for (const placement of placements) {
    const planetLon = signPositionToAbsoluteDegree(
      placement.signId,
      placement.degree,
      placement.minute,
    );

    for (const star of fixedStars.values()) {
      const orb = eclipticOrb(planetLon, star.eclipticLongitude);
      if (orb <= star.orb) {
        conjunctions.push({
          star,
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
 * Group natal conjunctions by exactness tier:
 * - Exact:  orb ≤ 0.5°
 * - Close:  orb ≤ 1.0°
 * - Wide:   orb ≤ star's maximum orb
 */
export function groupConjunctionsByExactness(conjunctions: FixedStarConjunction[]): {
  exact: FixedStarConjunction[];
  close: FixedStarConjunction[];
  wide: FixedStarConjunction[];
} {
  return {
    exact: conjunctions.filter((c) => c.orbDegree <= 0.5),
    close: conjunctions.filter((c) => c.orbDegree > 0.5 && c.orbDegree <= 1.0),
    wide:  conjunctions.filter((c) => c.orbDegree > 1.0),
  };
}

// ─── Transit Activations ──────────────────────────────────────────────────────

/**
 * Find real-time sky activations: transiting planets currently conjunct any fixed star.
 *
 * @param transitPositions - Current transit positions (degree = absolute ecliptic longitude)
 * @param natalConjunctions - Optional: natal conjunctions to flag personal activations
 */
export function getTransitStarActivations(
  transitPositions: TransitPosition[],
  natalConjunctions?: FixedStarConjunction[],
): TransitStarActivation[] {
  const activations: TransitStarActivation[] = [];
  const natalStarIds = new Set(natalConjunctions?.map((c) => c.star.id) ?? []);

  for (const transit of transitPositions) {
    // transit.degree is absolute ecliptic longitude (0–360°) per MEMORY.md
    for (const star of fixedStars.values()) {
      const orb = eclipticOrb(transit.degree, star.eclipticLongitude);
      if (orb <= star.orb) {
        activations.push({
          star,
          transitPlanetId: transit.planetId,
          transitPlanetName: transit.planetName,
          transitPlanetSymbol: transit.symbol,
          transitLongitude: transit.degree,
          orbDegree: orb,
          isPersonal: natalStarIds.has(star.id),
        });
      }
    }
  }

  return activations.sort((a, b) => a.orbDegree - b.orbDegree);
}

/**
 * Find personal transit activations: transiting planets conjunct the natal longitude
 * of an existing fixed star conjunction (i.e. activating the natal star degree).
 *
 * This fires when a transit planet returns to (or opposes) the exact degree where
 * a natal planet already conjuncts a fixed star.
 *
 * @param transitPositions - Current transit positions
 * @param natalConjunctions - User's natal fixed star conjunctions
 */
export function getPersonalTransitActivations(
  transitPositions: TransitPosition[],
  natalConjunctions: FixedStarConjunction[],
): TransitStarActivation[] {
  const activations: TransitStarActivation[] = [];

  for (const transit of transitPositions) {
    for (const nc of natalConjunctions) {
      // Check if transit planet is conjunct the natal conjunction longitude
      const orb = eclipticOrb(transit.degree, nc.eclipticLongitudePlanet);
      if (orb <= nc.star.orb) {
        activations.push({
          star: nc.star,
          transitPlanetId: transit.planetId,
          transitPlanetName: transit.planetName,
          transitPlanetSymbol: transit.symbol,
          transitLongitude: transit.degree,
          orbDegree: orb,
          isPersonal: true,
        });
      }
    }
  }

  return activations.sort((a, b) => a.orbDegree - b.orbDegree);
}
