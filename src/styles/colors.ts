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
// Semantic Colors (challenge/strength/neutral)
// ------------------------------------

export const semanticColors = {
  challenge: { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  strength: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  neutral: { text: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' },
} as const;

// ------------------------------------
// Spectrum Colors (Gene Keys)
// ------------------------------------

export const spectrumColors = {
  shadow: semanticColors.challenge,
  gift: semanticColors.strength,
  siddhi: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
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
// D3 Visualization Colors (hex values for SVG/Canvas rendering)
// Normalized to match Tailwind config values above
// ------------------------------------

export interface D3ElementColor {
  fill: string;
  stroke: string;
  glow: string;
}

/** Element colors for D3 SVG fills/strokes (CelestialMandala, etc.) */
export const d3ElementColors: Record<string, D3ElementColor> = {
  fire:  { fill: '#FF6B35', stroke: '#FFB088', glow: 'rgba(255, 107, 53, 0.4)' },
  earth: { fill: '#5A8A35', stroke: '#7DA85A', glow: 'rgba(90, 138, 53, 0.4)' },
  air:   { fill: '#4A90D9', stroke: '#7BB3E8', glow: 'rgba(74, 144, 217, 0.4)' },
  water: { fill: '#3A8BA0', stroke: '#5AABBF', glow: 'rgba(58, 139, 160, 0.4)' },
};

/** Flat element color map for simpler use (ConstellationGraph node colors) */
export const d3ElementFlatColors: Record<string, string> = {
  fire: '#FF6B35',
  earth: '#5A8A35',
  air: '#4A90D9',
  water: '#3A8BA0',
  sulphur: '#FFB347',
  salt: '#C0C0C0',
  'mercury-alchemical': '#9B59B6',
};

/** Entity type colors for D3 graph nodes (38 types) */
export const d3EntityTypeColors: Record<string, string> = {
  planet: '#A67C52',
  sign: '#9B59B6',
  house: '#5D7A8C',
  element: '#E74C3C',
  aspect: '#1ABC9C',
  configuration: '#F39C12',
  dignity: '#95A5A6',
  point: '#E91E63',
  decan: '#8E44AD',
  'fixed-star': '#ECF0F1',
  'hd-gate': '#F59E0B',
  'hd-channel': '#EAB308',
  'hd-center': '#D97706',
  'hd-type': '#FB923C',
  'hd-strategy': '#FBBF24',
  'hd-authority': '#F97316',
  'hd-line': '#FCD34D',
  'hd-profile': '#FDE68A',
  'hd-variable': '#FDBA74',
  'gene-key': '#8B5CF6',
  'gk-sphere': '#A855F7',
  'gk-line': '#C084FC',
  'gk-sequence': '#9333EA',
  'codon-ring': '#7C3AED',
  'amino-acid': '#A78BFA',
  'trigram': '#10B981',
  'line': '#6366F1',
  'numerology-number': '#06B6D4',
  'chakra': '#10B981',
  'hermetic-principle': '#F59E0B',
  'profile-placement': '#F472B6',
  'profile-gk-placement': '#C084FC',
  'profile-hd-placement': '#FDE047',
  'profile-aspect': '#F9A8D4',
  'profile-channel': '#FACC15',
  'profile-configuration': '#FB7185',
};

/** Relationship type colors for D3 graph edges */
export const d3RelationshipColors: Record<string, string> = {
  RULES: '#FFD700',
  RULES_HOUSE: '#FFD700',
  HAS_DIGNITY: '#9B59B6',
  HAS_ELEMENT: '#E74C3C',
  HAS_MODALITY: '#95A5A6',
  OPPOSES: '#E74C3C',
  CONTAINS_DECAN: '#8E44AD',
  RULED_BY: '#FFD700',
  BELONGS_TO: '#8E44AD',
  DECAN_RULED_BY: '#FFD700',
  COMPLEMENTS: '#1ABC9C',
  HOUSE_RULED_BY_SIGN: '#3498DB',
  HOUSE_RULED_BY_PLANET: '#FFD700',
  ELEMENT_CONTAINS: '#E74C3C',
  ENERGIZES: '#2ECC71',
  CHALLENGES: '#E74C3C',
  FLOWS_WITH: '#3498DB',
  PLACED_IN_SIGN: '#9B59B6',
  PLACED_IN_HOUSE: '#3498DB',
  ASPECTS: '#F39C12',
  PART_OF_CONFIGURATION: '#F39C12',
  HAS_ALCHEMICAL_ELEMENT: '#8E44AD',
  GATE_IN_CENTER: '#F59E0B',
  GATE_CONNECTS_TO: '#D97706',
  GATE_IN_SIGN: '#B45309',
  GATE_CORRESPONDS_TO_GK: '#8B5CF6',
  GK_PROGRAMMING_PARTNER: '#7C3AED',
  GK_IN_CODON_RING: '#6D28D9',
  GK_ENCODES_AMINO_ACID: '#5B21B6',
  GK_CORRESPONDS_TO_GATE: '#F59E0B',
};

/** Alchemical substance colors for HouseSubstanceWheel */
export const d3SubstanceColors = {
  yang:   { fill: '#F59E0B', stroke: '#D97706', label: 'Sulphur', polarity: 'Yang' as const },
  bridge: { fill: '#10B981', stroke: '#059669', label: 'Sal',     polarity: 'Bridge' as const },
  yin:    { fill: '#6366F1', stroke: '#4F46E5', label: 'Mercurius', polarity: 'Yin' as const },
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
