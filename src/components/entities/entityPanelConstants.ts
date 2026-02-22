import type { EntitySystem } from '../../services/entities';
import type { ElementColorKey } from '../../styles/colors';

// Shared shape for panel color tokens
export type PanelColors = { bg: string; border: string; accent: string; text: string };

// System colors for header styling
export const SYSTEM_COLORS: Record<EntitySystem, PanelColors> = {
  astrology: {
    bg: 'bg-purple-900/50',
    border: 'border-purple-500/30',
    accent: 'bg-purple-500',
    text: 'text-purple-300',
  },
  humanDesign: {
    bg: 'bg-amber-900/50',
    border: 'border-amber-500/30',
    accent: 'bg-amber-500',
    text: 'text-amber-300',
  },
  geneKeys: {
    bg: 'bg-emerald-900/50',
    border: 'border-emerald-500/30',
    accent: 'bg-emerald-500',
    text: 'text-emerald-300',
  },
  shared: {
    bg: 'bg-blue-900/50',
    border: 'border-blue-500/30',
    accent: 'bg-blue-500',
    text: 'text-blue-300',
  },
};

// Sign panel colors — element-based (fire/earth/air/water)
// bg/border/text from elementColors; accent uses solid bg for badge/button consistency with SYSTEM_COLORS
export const SIGN_ELEMENT_PANEL_COLORS: Record<ElementColorKey, PanelColors> = {
  fire:  { bg: 'bg-fire-500/10',  border: 'border-fire-500/30',  accent: 'bg-fire-500',  text: 'text-fire-400' },
  earth: { bg: 'bg-earth-500/10', border: 'border-earth-500/30', accent: 'bg-earth-500', text: 'text-earth-400' },
  air:   { bg: 'bg-air-500/10',   border: 'border-air-500/30',   accent: 'bg-air-500',   text: 'text-air-400' },
  water: { bg: 'bg-water-500/10', border: 'border-water-500/30', accent: 'bg-water-500', text: 'text-water-400' },
};

// Chakra panel colors — per-chakra static map (avoids dynamic Tailwind purge issues with colorHex)
export const CHAKRA_PANEL_COLORS: Record<string, PanelColors> = {
  'chakra-1-root':         { bg: 'bg-red-900/30',    border: 'border-red-500/30',    accent: 'bg-red-500',    text: 'text-red-300' },
  'chakra-2-sacral':       { bg: 'bg-orange-900/30', border: 'border-orange-500/30', accent: 'bg-orange-500', text: 'text-orange-300' },
  'chakra-3-solar-plexus': { bg: 'bg-yellow-900/30', border: 'border-yellow-500/30', accent: 'bg-yellow-500', text: 'text-yellow-300' },
  'chakra-4-heart':        { bg: 'bg-green-900/30',  border: 'border-green-500/30',  accent: 'bg-green-500',  text: 'text-green-300' },
  'chakra-5-throat':       { bg: 'bg-sky-900/30',    border: 'border-sky-500/30',    accent: 'bg-sky-500',    text: 'text-sky-300' },
  'chakra-6-third-eye':    { bg: 'bg-indigo-900/30', border: 'border-indigo-500/30', accent: 'bg-indigo-500', text: 'text-indigo-300' },
  'chakra-7-crown':        { bg: 'bg-violet-900/30', border: 'border-violet-500/30', accent: 'bg-violet-500', text: 'text-violet-300' },
};

// Personal context entity colors — warm amber
export const PERSONAL_ENTITY_COLORS: PanelColors = {
  bg: 'bg-amber-900/30', border: 'border-amber-400/30', accent: 'bg-amber-400', text: 'text-amber-300',
};

// System labels
export const SYSTEM_LABELS: Record<EntitySystem, string> = {
  astrology: 'Astrology',
  humanDesign: 'Human Design',
  geneKeys: 'Gene Keys',
  shared: 'Reference',
};

// Category labels
export const CATEGORY_LABELS: Record<string, string> = {
  // Astrology
  planet: 'Planet',
  sign: 'Zodiac Sign',
  house: 'House',
  element: 'Element',
  aspect: 'Aspect',
  configuration: 'Configuration',
  point: 'Astro Point',
  decan: 'Decan',
  dignity: 'Dignity',
  // Human Design
  'hd-type': 'HD Type',
  'hd-strategy': 'Strategy',
  'hd-authority': 'Authority',
  'hd-center': 'Center',
  'hd-gate': 'Gate',
  'hd-channel': 'Channel',
  'hd-profile': 'Profile',
  'hd-line': 'Line',
  'hd-variable': 'Variable',
  // Gene Keys
  'gene-key': 'Gene Key',
  'gk-sphere': 'Sphere',
  'gk-line': 'Line',
  'gk-sequence': 'Sequence',
  'codon-ring': 'Codon Ring',
  'amino-acid': 'Amino Acid',
  trigram: 'Trigram',
  // Wisdom Traditions
  'chakra': 'Chakra',
  'numerology-number': 'Number',
  'hermetic-principle': 'Principle',
  'fixed-star': 'Fixed Star',
  // Personal Context
  'personal-project': 'Your Project',
  'occupation': 'Your Occupation',
  // Profile entities
  'natal-placement': 'Your Placement',
  'natal-aspect': 'Your Aspect',
  'profile-placement': 'Your Placement',
  'profile-gk-placement': 'Your Gene Key',
  'profile-hd-placement': 'Your Gate',
  'profile-aspect': 'Your Aspect',
  'profile-channel': 'Your Channel',
  'profile-configuration': 'Your Pattern',
};

// Sphere display names
export const SPHERE_DISPLAY_NAMES: Record<string, string> = {
  lifesWork: "Life's Work",
  evolution: 'Evolution',
  radiance: 'Radiance',
  purpose: 'Purpose',
  attraction: 'Attraction',
  iq: 'IQ',
  eq: 'EQ',
  sq: 'SQ',
  core: 'Core',
  vocation: 'Vocation',
  culture: 'Culture',
  pearl: 'Pearl',
  brand: 'Brand',
  creativity: 'Creativity',
  relating: 'Relating',
  stability: 'Stability',
};
