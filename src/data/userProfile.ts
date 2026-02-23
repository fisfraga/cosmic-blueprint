// ============================================
// USER NATAL PROFILE — Display Adapter
// ============================================
//
// This module converts canonical NatalPlacement[] (from AstroProfile)
// into a display-friendly format suitable for entity detail pages.
// It replaces the legacy hardcoded Felipe data.
//

import { planets, points } from './index';
import type { AstroProfile, NatalPlacement as CanonicalNatalPlacement } from '../types';

export type PlacementType = 'planet' | 'point';

export interface NatalPlacement {
  planetId: string;
  planetSymbol: string;
  planetName: string;
  signId: string;
  degree: string;       // formatted as "24°48'"
  houseNumber: number;
  isRetrograde: boolean;
  dignity?: string;
  placementType: PlacementType;
  importance: number; // 4=luminaries/angles, 2=personal planets, 1=outer, 0.5=points
}

/**
 * Convert a single canonical NatalPlacement into the display format.
 */
function canonicalToDisplay(p: CanonicalNatalPlacement): NatalPlacement {
  const planetEntity = planets.get(p.planetId) ?? points.get(p.planetId);
  const houseNumber = p.houseId ? parseInt(p.houseId.replace('house-', ''), 10) : 0;

  return {
    planetId: p.planetId,
    planetSymbol: planetEntity?.symbol ?? '',
    planetName: planetEntity?.name ?? p.planetId,
    signId: p.signId,
    degree: `${p.degree}°${String(p.minute).padStart(2, '0')}'`,
    houseNumber,
    isRetrograde: p.retrograde,
    dignity: p.dignityId || undefined,
    placementType: planets.has(p.planetId) ? 'planet' : 'point',
    importance: (planetEntity as { planetImportance?: number } | undefined)?.planetImportance ?? 0.5,
  };
}

/**
 * Build display-friendly placements from the active profile.
 * Returns [] when no profile is loaded or placements are empty.
 */
export function buildDisplayPlacements(profile: AstroProfile | null): NatalPlacement[] {
  if (!profile?.placements?.length) return [];
  return profile.placements.map(canonicalToDisplay);
}

/**
 * Get all placements for a specific sign, sorted by importance.
 */
export function getPlacementsInSign(signId: string, profile: AstroProfile | null): NatalPlacement[] {
  return buildDisplayPlacements(profile)
    .filter(p => p.signId === signId)
    .sort((a, b) => b.importance - a.importance);
}

/**
 * Get all placements in a specific house, sorted by importance.
 */
export function getPlacementsInHouse(houseNumber: number, profile: AstroProfile | null): NatalPlacement[] {
  return buildDisplayPlacements(profile)
    .filter(p => p.houseNumber === houseNumber)
    .sort((a, b) => b.importance - a.importance);
}

/**
 * Get the placement for a specific planet/point.
 */
export function getPlacementByPlanetId(planetId: string, profile: AstroProfile | null): NatalPlacement | undefined {
  return buildDisplayPlacements(profile).find(p => p.planetId === planetId);
}
