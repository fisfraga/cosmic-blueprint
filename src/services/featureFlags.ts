// Feature Flags — controls which contemplation types and library sections are visible
// All flags default to true (permissive). Only false overrides are stored in localStorage.
// Future: serverOverrides (from Supabase / membership tier) take precedence over user settings.

import type { ContemplationCategory, ContemplationType } from './contemplation/context';

// ─── Flag IDs ────────────────────────────────────────────────────────────────

export type FeatureFlagId =
  // Domain A — optional/niched contemplation categories
  | 'contemplation.fixedStars'
  | 'contemplation.galacticAstrology'
  | 'contemplation.yearAhead'
  | 'contemplation.alchemy'
  | 'contemplation.numerology'
  | 'contemplation.cosmicEmbodiment'
  | 'contemplation.vocation'    // Sprint AG
  // Domain B — KB-person types (spread across core categories)
  | 'kb.debraSilverman'
  | 'kb.isadoraSynthesis'
  | 'kb.lifePurposeAstrology'
  | 'kb.raUruHu'
  | 'kb.richardRudd'
  // Domain C — library navigation sections
  | 'library.fixedStars'
  | 'library.galacticAstrology'
  | 'library.lostOctave'
  | 'library.wisdomTraditions';

// ─── Metadata (for Settings UI) ──────────────────────────────────────────────

export interface FlagMeta {
  label: string;
  description: string;
  domain: 'contemplation' | 'kb' | 'library';
}

export const FLAG_METADATA: Record<FeatureFlagId, FlagMeta> = {
  // Contemplation categories
  'contemplation.fixedStars': {
    label: 'Fixed Stars',
    description: 'Fixed star archetype readings and stellar conjunction contemplations',
    domain: 'contemplation',
  },
  'contemplation.galacticAstrology': {
    label: 'Galactic Astrology',
    description: 'Galactic center, great attractor, and super-galactic center readings',
    domain: 'contemplation',
  },
  'contemplation.yearAhead': {
    label: 'Year Ahead',
    description: 'Annual forecasts, solar returns, personal year cycles, and transit maps',
    domain: 'contemplation',
  },
  'contemplation.alchemy': {
    label: 'Alchemy & Hermetic',
    description: 'Chakra activations, hermetic laws, and alchemical mapping',
    domain: 'contemplation',
  },
  'contemplation.numerology': {
    label: 'Numerology',
    description: 'Life path number and numerology readings',
    domain: 'contemplation',
  },
  'contemplation.cosmicEmbodiment': {
    label: 'Cosmic Embodiment',
    description: 'Let cosmic energies speak in their own voice — first-person entity contemplations',
    domain: 'contemplation',
  },
  'contemplation.vocation': {
    label: 'Vocational Astrology',
    description: 'MC, North Node, MC Ruler, and elemental hunger as vocational calling (4 types)',
    domain: 'contemplation',
  },
  // KB persons
  'kb.debraSilverman': {
    label: 'Debra Silverman',
    description: 'Psychological astrology: gremlin witnessing, observer activation, sign medicine (3 types)',
    domain: 'kb',
  },
  'kb.isadoraSynthesis': {
    label: 'Isadora Synthesis',
    description: 'Multi-system synthesis: activation reading, blueprint journey, ancestral integration (6 types)',
    domain: 'kb',
  },
  'kb.lifePurposeAstrology': {
    label: 'Life Purpose Astrology',
    description: 'Life purpose reading, elemental profile balance, opposite pole practice (3 types)',
    domain: 'kb',
  },
  'kb.raUruHu': {
    label: 'Ra Uru Hu',
    description: 'HD depth: deconditioning journey, not-self diagnosis, authority deep dive (5 types)',
    domain: 'kb',
  },
  'kb.richardRudd': {
    label: 'Richard Rudd',
    description: 'Gene Keys depth: shadow contemplation, programming partner dynamics, Golden Path (3 types)',
    domain: 'kb',
  },
  // Library sections
  'library.fixedStars': {
    label: 'Fixed Stars library',
    description: 'Fixed Stars section in the Astrology navigation',
    domain: 'library',
  },
  'library.galacticAstrology': {
    label: 'Galactic Astrology library',
    description: 'Galactic Astrology section in the Astrology navigation (coming soon)',
    domain: 'library',
  },
  'library.lostOctave': {
    label: 'Lost Octave library',
    description: 'Lost Octave 72-gate system in the Human Design navigation',
    domain: 'library',
  },
  'library.wisdomTraditions': {
    label: 'Wisdom Traditions library',
    description: 'Numerology, Chakras, and Hermetic Laws sections in navigation',
    domain: 'library',
  },
};

// ─── Type-to-flag mapping ────────────────────────────────────────────────────
// Maps each KB-specific ContemplationType to the flag that controls its visibility.
// Core / always-on types have no entry here.

export const TYPE_FLAG_MAP: Partial<Record<ContemplationType, FeatureFlagId>> = {
  // Debra Silverman
  gremlinWitnessing: 'kb.debraSilverman',
  observerActivation: 'kb.debraSilverman',
  signMedicinePrescription: 'kb.debraSilverman',
  // Isadora Synthesis
  multiSystemActivationReading: 'kb.isadoraSynthesis',
  embodimentPortalReading: 'kb.isadoraSynthesis',
  ancestralIntegrationContemplation: 'kb.isadoraSynthesis',
  innerLandscapeAwareness: 'kb.isadoraSynthesis',
  incarnationCrossIntegration: 'kb.isadoraSynthesis',
  fullBlueprintJourney: 'kb.isadoraSynthesis',
  // Life Purpose Astrology
  lifePurposeReading: 'kb.lifePurposeAstrology',
  elementalProfileReading: 'kb.lifePurposeAstrology',
  oppositePolePractice: 'kb.lifePurposeAstrology',
  // Ra Uru Hu
  deconditioningJourney: 'kb.raUruHu',
  typeExperimentSetup: 'kb.raUruHu',
  notSelfDiagnosis: 'kb.raUruHu',
  authorityDeepDive: 'kb.raUruHu',
  incarnationCrossReading: 'kb.raUruHu',
  // Richard Rudd
  shadowContemplate: 'kb.richardRudd',
  programmingPartnerDynamics: 'kb.richardRudd',
  goldenPathReading: 'kb.richardRudd',
};

// ─── Category-to-flag mapping ────────────────────────────────────────────────
// Maps optional ContemplationCategory values to their flags.
// Core categories (astrology, humanDesign, geneKeys, crossSystem, lifeOS) are always on.

export const CATEGORY_FLAG_MAP: Partial<Record<ContemplationCategory, FeatureFlagId>> = {
  fixedStars: 'contemplation.fixedStars',
  galacticAstrology: 'contemplation.galacticAstrology',
  yearAhead: 'contemplation.yearAhead',
  alchemy: 'contemplation.alchemy',
  numerology: 'contemplation.numerology',
  cosmicEmbodiment: 'contemplation.cosmicEmbodiment',
  vocation: 'contemplation.vocation',
};

// ─── Storage ─────────────────────────────────────────────────────────────────

const FLAGS_KEY = 'cosmic-copilot-feature-flags';

// Sparse format: only stores false overrides.
// Absent key → flag is ON (default true).
export type FeatureFlagsOverrides = Partial<Record<FeatureFlagId, boolean>>;

export function loadFlagOverrides(): FeatureFlagsOverrides {
  try {
    const raw = localStorage.getItem(FLAGS_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
    return parsed as FeatureFlagsOverrides;
  } catch {
    return {};
  }
}

export function saveFlagOverrides(overrides: FeatureFlagsOverrides): void {
  try {
    localStorage.setItem(FLAGS_KEY, JSON.stringify(overrides));
  } catch {
    // Ignore storage errors (private browsing quota exceeded etc.)
  }
}

// ─── Resolution ──────────────────────────────────────────────────────────────

/**
 * Resolve the effective value of a flag.
 * Precedence (highest wins): serverOverrides → userOverrides → default (true)
 */
export function resolveFlagValue(
  flagId: FeatureFlagId,
  overrides: FeatureFlagsOverrides,
  serverOverrides?: Partial<Record<FeatureFlagId, boolean>>,
): boolean {
  // Server override wins (future membership tier / remote config)
  if (serverOverrides && flagId in serverOverrides) {
    return serverOverrides[flagId]!;
  }
  // User override second
  if (flagId in overrides) {
    return overrides[flagId]!;
  }
  // Default: all flags are ON
  return true;
}
