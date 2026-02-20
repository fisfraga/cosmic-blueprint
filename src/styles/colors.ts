/**
 * Centralized Color System for Cosmic Copilot
 *
 * This file contains all color definitions used throughout the application.
 * Import from here instead of defining colors inline.
 */

// ------------------------------------
// Element Colors (Fire, Earth, Air, Water)
// ------------------------------------

export type ElementColorKey = 'fire' | 'earth' | 'air' | 'water';

export interface ElementColorSet {
  gradient: string;
  gradientHover: string;
  border: string;
  borderHover: string;
  text: string;
  bg: string;
  accent: string;
  ring: string;
}

export const elementColors: Record<ElementColorKey, ElementColorSet> = {
  fire: {
    gradient: 'from-fire-500/20 to-fire-600/10',
    gradientHover: 'from-fire-500/30 to-fire-600/20',
    border: 'border-fire-500/30',
    borderHover: 'border-fire-400/50',
    text: 'text-fire-400',
    bg: 'bg-fire-500/10',
    accent: 'text-fire-400',
    ring: 'ring-fire-500/50',
  },
  earth: {
    gradient: 'from-earth-500/20 to-earth-600/10',
    gradientHover: 'from-earth-500/30 to-earth-600/20',
    border: 'border-earth-500/30',
    borderHover: 'border-earth-400/50',
    text: 'text-earth-400',
    bg: 'bg-earth-500/10',
    accent: 'text-earth-400',
    ring: 'ring-earth-500/50',
  },
  air: {
    gradient: 'from-air-500/20 to-air-600/10',
    gradientHover: 'from-air-500/30 to-air-600/20',
    border: 'border-air-500/30',
    borderHover: 'border-air-400/50',
    text: 'text-air-400',
    bg: 'bg-air-500/10',
    accent: 'text-air-400',
    ring: 'ring-air-500/50',
  },
  water: {
    gradient: 'from-water-500/20 to-water-600/10',
    gradientHover: 'from-water-500/30 to-water-600/20',
    border: 'border-water-500/30',
    borderHover: 'border-water-400/50',
    text: 'text-water-400',
    bg: 'bg-water-500/10',
    accent: 'text-water-400',
    ring: 'ring-water-500/50',
  },
};

// ------------------------------------
// Entity Type Colors (for cards, badges, etc.)
// ------------------------------------

export type EntityColorKey = 'fire' | 'earth' | 'air' | 'water' | 'neutral' | 'humandesign' | 'genekey';

export interface EntityColorSet {
  bg: string;
  border: string;
  accent: string;
}

export const entityCardColors: Record<EntityColorKey, EntityColorSet> = {
  fire: {
    bg: 'bg-fire-500/10',
    border: 'border-fire-500/30 hover:border-fire-400/50',
    accent: 'text-fire-400',
  },
  earth: {
    bg: 'bg-earth-500/10',
    border: 'border-earth-500/30 hover:border-earth-400/50',
    accent: 'text-earth-400',
  },
  air: {
    bg: 'bg-air-500/10',
    border: 'border-air-500/30 hover:border-air-400/50',
    accent: 'text-air-400',
  },
  water: {
    bg: 'bg-water-500/10',
    border: 'border-water-500/30 hover:border-water-400/50',
    accent: 'text-water-400',
  },
  neutral: {
    bg: 'bg-neutral-800/50',
    border: 'border-neutral-700 hover:border-neutral-600',
    accent: 'text-neutral-300',
  },
  humandesign: {
    bg: 'bg-humandesign-500/10',
    border: 'border-humandesign-500/30 hover:border-humandesign-400/50',
    accent: 'text-humandesign-400',
  },
  genekey: {
    bg: 'bg-genekey-500/10',
    border: 'border-genekey-500/30 hover:border-genekey-400/50',
    accent: 'text-genekey-400',
  },
};

// ------------------------------------
// Philosophy Colors (Astrology, Gene Keys, Human Design)
// ------------------------------------

export interface PhilosophyColorSet {
  gradient: string;
  border: string;
  text: string;
  textHover: string;
  bg: string;
  accent: string;
}

export const philosophyColors = {
  astrology: {
    gradient: 'from-blue-500/10 to-blue-600/5',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    textHover: 'text-blue-300',
    bg: 'bg-blue-500/10',
    accent: 'text-blue-300',
  },
  genekeys: {
    gradient: 'from-genekey-500/10 to-genekey-600/5',
    border: 'border-genekey-500/20',
    text: 'text-genekey-400',
    textHover: 'text-genekey-300',
    bg: 'bg-genekey-500/10',
    accent: 'text-genekey-300',
  },
  humandesign: {
    gradient: 'from-humandesign-500/10 to-humandesign-600/5',
    border: 'border-humandesign-500/20',
    text: 'text-humandesign-400',
    textHover: 'text-humandesign-300',
    bg: 'bg-humandesign-500/10',
    accent: 'text-humandesign-300',
  },
} as const;

// ------------------------------------
// Exploration Tool Colors
// ------------------------------------

export const toolColors: Record<string, string> = {
  purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/30 hover:border-purple-400/50',
  blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/30 hover:border-blue-400/50',
  green: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 hover:border-emerald-400/50',
  teal: 'from-teal-500/20 to-teal-600/5 border-teal-500/30 hover:border-teal-400/50',
  rose: 'from-rose-500/20 to-rose-600/5 border-rose-500/30 hover:border-rose-400/50',
  orange: 'from-orange-500/20 to-orange-600/5 border-orange-500/30 hover:border-orange-400/50',
  cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/30 hover:border-cyan-400/50',
  amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/30 hover:border-amber-400/50',
};

// ------------------------------------
// Spectrum Colors (Gene Keys)
// ------------------------------------

export const spectrumColors = {
  shadow: {
    text: 'text-red-400/80',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  gift: {
    text: 'text-genekey-400',
    bg: 'bg-genekey-500/10',
    border: 'border-genekey-500/20',
  },
  siddhi: {
    text: 'text-yellow-400/80',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
  },
} as const;

// ------------------------------------
// Planet Element Mapping
// ------------------------------------

export const planetElementMap: Record<string, ElementColorKey> = {
  sun: 'fire',
  mars: 'fire',
  jupiter: 'fire',
  moon: 'water',
  venus: 'water',
  neptune: 'water',
  mercury: 'air',
  uranus: 'air',
  saturn: 'earth',
  pluto: 'earth',
};

// ------------------------------------
// Helper Functions
// ------------------------------------

/**
 * Get element color key for a planet by ID
 */
export function getPlanetElementColor(planetId: string): ElementColorKey | 'neutral' {
  return planetElementMap[planetId] || 'neutral';
}

/**
 * Get element colors by element ID
 */
export function getElementColors(elementId: string): ElementColorSet | undefined {
  return elementColors[elementId as ElementColorKey];
}

/**
 * Get entity card colors by color key
 */
export function getEntityCardColors(colorKey: EntityColorKey): EntityColorSet {
  return entityCardColors[colorKey] || entityCardColors.neutral;
}
