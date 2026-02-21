import type { EntitySystem } from '../../services/entities';

// System colors for header styling
export const SYSTEM_COLORS: Record<EntitySystem, {
  bg: string;
  border: string;
  accent: string;
  text: string;
}> = {
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
