/**
 * Knowledge Excerpts Loader
 * Curated wisdom tradition excerpts for AI context injection (Path B).
 *
 * These are loaded as static strings (Vite static import pattern) and
 * injected into AI prompts to enrich contemplation quality.
 *
 * Sources:
 * - Stefano: Astrological Alchemy (house-chakra, three substances)
 * - Kybalion: The Seven Hermetic Principles
 * - Integration Guide: Cross-tradition synthesis bridges
 * - Gene Keys: Golden Path sequences (Richard Rudd)
 * - Astrology: 12 Houses as Life Areas / ILOS bridge
 * - Human Design: Ra Uru Hu 1994 introduction (body graph, types, centers, conditioning)
 */

// Static imports — Vite bundles these as string literals
import houseChakraCorrespondences from './astrology/house-chakra-correspondences.md?raw';
import housesLifeAreas from './astrology/12-houses-life-areas.md?raw';
import threeSubstances from './alchemy/three-substances.md?raw';
import hermeticPrinciples from './alchemy/hermetic-principles.md?raw';
import traditionBridges from './integration/tradition-bridges.md?raw';
import numerologyHarmonicFrequencies from './numerology/harmonic-frequencies.md?raw';
import chakraEnergyCenters from './chakras/energy-centers.md?raw';
import geneKeysGoldenPath from './gene-keys/golden-path.md?raw';
import humanDesignBodygraph from './human-design/bodygraph-overview.md?raw';

export type KnowledgeDomain =
  | 'astrology'
  | 'alchemy'
  | 'chakras'
  | 'hermetic'
  | 'human-design'
  | 'integration'
  | 'numerology'
  | 'gene-keys';

export interface KnowledgeExcerpt {
  id: string;
  domain: KnowledgeDomain;
  title: string;
  content: string;
  relevantCategories: string[];
  relevantTypes: string[];
  tokenEstimate: number; // approximate token count for budget management
}

// The full library of knowledge excerpts
export const KNOWLEDGE_EXCERPTS: KnowledgeExcerpt[] = [
  {
    id: 'house-chakra-correspondences',
    domain: 'astrology',
    title: 'House–Chakra Correspondences',
    content: houseChakraCorrespondences,
    relevantCategories: ['astrology', 'crossSystem', 'lifeOS'],
    relevantTypes: [
      'natalOverview', 'placementDeepDive', 'placementOverview',
      'transitReading', 'transitOverview', 'holisticReading',
      'cosmicEmbodiment', 'lifeAreaAlignment'
    ],
    tokenEstimate: 800,
  },
  {
    id: 'three-substances',
    domain: 'alchemy',
    title: 'The Three Alchemical Substances',
    content: threeSubstances,
    relevantCategories: ['crossSystem', 'astrology'],
    relevantTypes: [
      'natalOverview', 'placementDeepDive', 'holisticReading',
      'cosmicEmbodiment', 'elementalBalance', 'gateKeyBridge'
    ],
    tokenEstimate: 900,
  },
  {
    id: 'hermetic-principles',
    domain: 'hermetic',
    title: 'The Seven Hermetic Principles (Kybalion)',
    content: hermeticPrinciples,
    relevantCategories: ['crossSystem', 'lifeOS'],
    relevantTypes: [
      'holisticReading', 'cosmicEmbodiment', 'purposeReview',
      'lifeAreaAlignment', 'goalCosmicContext'
    ],
    tokenEstimate: 1200,
  },
  {
    id: 'tradition-bridges',
    domain: 'integration',
    title: 'Cross-Tradition Synthesis Bridges',
    content: traditionBridges,
    relevantCategories: ['crossSystem', 'lifeOS'],
    relevantTypes: [
      'gateKeyBridge', 'gateKeyOverview', 'planetSphereSynthesis',
      'holisticReading', 'cosmicEmbodiment'
    ],
    tokenEstimate: 700,
  },
  {
    id: 'numerology-harmonic-frequencies',
    domain: 'numerology',
    title: 'Numerology: Numbers as Dimensional Frequencies (Adam Apollo)',
    content: numerologyHarmonicFrequencies,
    relevantCategories: ['crossSystem', 'lifeOS', 'astrology'],
    relevantTypes: [
      'natalOverview', 'placementDeepDive', 'holisticReading',
      'cosmicEmbodiment', 'lifeAreaAlignment', 'purposeReview',
      'goalCosmicContext'
    ],
    tokenEstimate: 950,
  },
  {
    id: 'chakra-energy-centers',
    domain: 'chakras',
    title: 'The Seven Chakras: Energy Centers of Embodied Consciousness',
    content: chakraEnergyCenters,
    relevantCategories: ['crossSystem', 'astrology', 'lifeOS'],
    relevantTypes: [
      'natalOverview', 'placementDeepDive', 'placementOverview',
      'transitReading', 'holisticReading', 'cosmicEmbodiment',
      'lifeAreaAlignment', 'elementalBalance'
    ],
    tokenEstimate: 1100,
  },
  {
    id: 'human-design-bodygraph',
    domain: 'human-design',
    title: 'Human Design: The Living System (Ra Uru Hu)',
    content: humanDesignBodygraph,
    relevantCategories: ['crossSystem', 'lifeOS'],
    relevantTypes: [
      'gateKeyBridge', 'gateKeyOverview', 'gateKeyActivation',
      'planetSphereSynthesis', 'holisticReading', 'cosmicEmbodiment',
      'purposeReview', 'lifeAreaAlignment', 'natalOverview'
    ],
    tokenEstimate: 1400,
  },
  {
    id: 'gene-keys-golden-path',
    domain: 'gene-keys',
    title: 'The Gene Keys Golden Path: Activation, Venus & Pearl Sequences',
    content: geneKeysGoldenPath,
    relevantCategories: ['crossSystem', 'lifeOS'],
    relevantTypes: [
      'gateKeyActivation', 'gateKeyBridge', 'gateKeyOverview',
      'planetSphereSynthesis', 'holisticReading', 'cosmicEmbodiment',
      'purposeReview', 'lifeAreaAlignment'
    ],
    tokenEstimate: 1300,
  },
  {
    id: '12-houses-life-areas',
    domain: 'astrology',
    title: 'The 12 Astrological Houses as Life Areas',
    content: housesLifeAreas,
    relevantCategories: ['astrology', 'lifeOS', 'crossSystem'],
    relevantTypes: [
      'natalOverview', 'placementDeepDive', 'placementOverview',
      'transitReading', 'transitOverview', 'holisticReading',
      'lifeAreaAlignment', 'goalCosmicContext', 'purposeReview'
    ],
    tokenEstimate: 1100,
  },
];

/**
 * Get knowledge excerpts relevant to the given contemplation category and type.
 *
 * Budget-aware: returns excerpts ordered by relevance, capped at tokenBudget.
 */
export function getRelevantExcerpts(
  category: string,
  type: string,
  tokenBudget: number = 2000
): KnowledgeExcerpt[] {
  const relevant = KNOWLEDGE_EXCERPTS.filter(excerpt =>
    excerpt.relevantCategories.includes(category) ||
    excerpt.relevantTypes.includes(type)
  );

  // Sort: exact type match first, then category match
  relevant.sort((a, b) => {
    const aTypeMatch = a.relevantTypes.includes(type) ? 1 : 0;
    const bTypeMatch = b.relevantTypes.includes(type) ? 1 : 0;
    return bTypeMatch - aTypeMatch;
  });

  // Budget-aware selection
  const selected: KnowledgeExcerpt[] = [];
  let usedTokens = 0;

  for (const excerpt of relevant) {
    if (usedTokens + excerpt.tokenEstimate <= tokenBudget) {
      selected.push(excerpt);
      usedTokens += excerpt.tokenEstimate;
    }
  }

  return selected;
}

/**
 * Get a single knowledge excerpt by ID.
 */
export function getExcerptById(id: string): KnowledgeExcerpt | undefined {
  return KNOWLEDGE_EXCERPTS.find(e => e.id === id);
}

/**
 * Format excerpts for AI injection.
 * Returns a compact section header + content block.
 */
export function formatExcerptsForContext(excerpts: KnowledgeExcerpt[]): string {
  if (excerpts.length === 0) return '';

  const sections = excerpts.map(e =>
    `## ${e.title}\n\n${e.content}`
  );

  return `
═══════════════════════════════════════════════════════════════════════════════
                     KNOWLEDGE TRADITIONS REFERENCE
═══════════════════════════════════════════════════════════════════════════════
The following curated wisdom tradition knowledge provides depth context for
your response. Use these frameworks naturally in synthesis — they are resources
for you to draw on, not scripts to follow.

${sections.join('\n\n---\n\n')}
`;
}
