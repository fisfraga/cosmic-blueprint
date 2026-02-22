// ============================================
// ILOS — Intentional Life OS UI Utilities
// VPER cycle + 12 Key Areas + elemental mapping
// Used by ProfileLifePurpose, CosmicDashboard, and any component
// needing ILOS/VPER language for astro data.
// ============================================

import { signs } from '../data';
import type { VperPhase } from '../types';
import type { TransitPosition } from './transits';

// ─── 12 Key Areas ────────────────────────────────────────────────────────────────

export const ILOS_KEY_AREAS: Record<number, string> = {
  1: 'Health & Vitality',
  2: 'Finances & Resources',
  3: 'Communication & Learning',
  4: 'Home & Family',
  5: 'Creativity & Joy',
  6: 'Work & Wellness',
  7: 'Relationships & Partnerships',
  8: 'Transformation & Depth',
  9: 'Growth & Vision',
  10: 'Career & Public Life',
  11: 'Community & Purpose',
  12: 'Spirituality & Inner Life',
};

// Natural zodiac: Aries=H1, Taurus=H2, ... Pisces=H12
export const SIGN_TO_HOUSE: Record<string, number> = {
  aries: 1, taurus: 2, gemini: 3, cancer: 4,
  leo: 5, virgo: 6, libra: 7, scorpio: 8,
  sagittarius: 9, capricorn: 10, aquarius: 11, pisces: 12,
};

// ─── VPER Config ─────────────────────────────────────────────────────────────────

export interface VperPhaseConfig {
  label: string;
  icon: string;
  color: string;
  textColor: string;
  borderColor: string;
  description: string;
  /** Opposite pole (Growth Edge) */
  oppositePole: VperPhase;
}

export const VPER_CONFIG: Record<VperPhase, VperPhaseConfig> = {
  vision: {
    label: 'Vision (Fire)',
    icon: '🔥',
    color: 'bg-fire-500/15',
    textColor: 'text-fire-400',
    borderColor: 'border-fire-500/30',
    description: 'Inspiration, new beginnings, direction-setting. The cosmos invites bold vision.',
    oppositePole: 'review',
  },
  plan: {
    label: 'Plan (Air)',
    icon: '💨',
    color: 'bg-air-500/15',
    textColor: 'text-air-400',
    borderColor: 'border-air-500/30',
    description: 'Strategy, communication, connection-making. The cosmos invites thoughtful design.',
    oppositePole: 'execute',
  },
  execute: {
    label: 'Execute (Earth)',
    icon: '🌱',
    color: 'bg-earth-500/15',
    textColor: 'text-earth-400',
    borderColor: 'border-earth-500/30',
    description: 'Steady building, disciplined action, grounded implementation. The cosmos invites consistent work.',
    oppositePole: 'plan',
  },
  review: {
    label: 'Review (Water)',
    icon: '🌊',
    color: 'bg-water-500/15',
    textColor: 'text-water-400',
    borderColor: 'border-water-500/30',
    description: 'Integration, reflection, releasing what no longer serves. The cosmos invites deep listening.',
    oppositePole: 'vision',
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────────

/** Get Key Area name for a house number */
export function getKeyAreaName(houseNum: number): string {
  return ILOS_KEY_AREAS[houseNum] ?? 'Life Activation';
}

/** Get Key Area info from a sign ID (natural zodiac fallback) */
export function getKeyArea(
  signId: string,
  housePosition?: number,
): { houseNum: number; areaName: string } {
  const houseNum = housePosition ?? SIGN_TO_HOUSE[signId] ?? 1;
  return { houseNum, areaName: getKeyAreaName(houseNum) };
}

/** Parse 'house-N' ID to number, returns null if not parseable */
export function houseNumFromId(houseId: string): number | null {
  const n = parseInt(houseId.replace('house-', ''), 10);
  return isNaN(n) ? null : n;
}

// ─── VPER Summary ────────────────────────────────────────────────────────────────

export interface VperSummary {
  dominantPhase: VperPhase | null;
  phaseCounts: Partial<Record<VperPhase, number>>;
  /** Top 3 Key Areas activated by the given positions */
  activeArenas: { houseNum: number; areaName: string; planetName: string; vperPhase: VperPhase | undefined }[];
}

/**
 * Analyse a set of transit positions and return the dominant VPER phase
 * plus the top Key Area activations.
 */
export function getCosmicVperSummary(positions: TransitPosition[]): VperSummary {
  const phaseCounts: Partial<Record<VperPhase, number>> = {};
  const arenas: VperSummary['activeArenas'] = [];

  for (const pos of positions) {
    const sign = signs.get(pos.signId);
    if (sign?.vperPhase) {
      phaseCounts[sign.vperPhase] = (phaseCounts[sign.vperPhase] ?? 0) + 1;
    }
    const { houseNum, areaName } = getKeyArea(pos.signId, pos.housePosition);
    arenas.push({
      houseNum,
      areaName,
      planetName: pos.planetName,
      vperPhase: sign?.vperPhase,
    });
  }

  const sorted = (Object.entries(phaseCounts) as [VperPhase, number][]).sort((a, b) => b[1] - a[1]);
  const dominantPhase = sorted.length > 0 ? sorted[0][0] : null;

  return { dominantPhase, phaseCounts, activeArenas: arenas };
}
