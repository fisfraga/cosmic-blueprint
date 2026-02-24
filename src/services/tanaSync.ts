/**
 * Tana Sync Service
 *
 * Generates Tana Paste markup from Cosmic Blueprint data.
 * Supports one-way export: Insights and Sessions → Tana ILOS workspace.
 *
 * Two export paths:
 * 1. Browser (clipboard): formatX functions generate Tana Paste text
 *    that users copy via the export buttons in InsightLibrary / SessionsLibrary.
 * 2. Claude Code (MCP): Call mcp__tana-local__import_tana_paste with
 *    parentNodeId: Nd-vpOR3Vvg3_CAPTURE_INBOX and content from formatX functions.
 *
 * Tana tag IDs (Fis Tana v2 workspace — Nd-vpOR3Vvg3):
 *   #insight       → QPpCKCABr5Kd
 *   #contemplation → -_JLK13vLzNG
 *
 * Field IDs on #insight (via #reflection-object):
 *   Details   → d0sEDiEyQ6K5
 *   AI Advice → pBjGH8k57RiS
 */

import type { SavedInsight } from './insights';
import type { SavedSession } from './sessions';
import type { CosmicProfile } from '../types';
import { geneKeys, lines } from '../data';

// ─── Tana IDs ─────────────────────────────────────────────────────────────────

const INSIGHT_TAG = 'QPpCKCABr5Kd';
const CONTEMPLATION_TAG = '-_JLK13vLzNG';
const INSIGHT_DETAILS_FIELD = 'd0sEDiEyQ6K5';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toTanaDate(isoString: string): string {
  return isoString.slice(0, 10); // YYYY-MM-DD
}

function formatCategory(category: string): string {
  const LABELS: Record<string, string> = {
    astrology: 'Astrology',
    humanDesign: 'Human Design',
    geneKeys: 'Gene Keys',
    crossSystem: 'Cross-System',
    lifeOS: 'Life OS',
    alchemy: 'Alchemy & Numbers',
  };
  return LABELS[category] ?? category;
}

function formatType(type: string): string {
  return type
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

/** Truncate text for use as a node name (single line). */
function nodeTitle(text: string, maxLength = 80): string {
  const oneLine = text.replace(/\s+/g, ' ').trim();
  return oneLine.length <= maxLength ? oneLine : oneLine.slice(0, maxLength) + '…';
}

/** Collapse newlines in field values so Tana Paste doesn't break. */
function fieldValue(text: string): string {
  return text.replace(/\r?\n/g, ' ').trim();
}

// ─── Insight Formatters ───────────────────────────────────────────────────────

/**
 * Format a single SavedInsight as Tana Paste markup.
 *
 * Output example:
 *   - The invitation here is to soften into… #[[^QPpCKCABr5Kd]]
 *     - [[^d0sEDiEyQ6K5]]:: [full text]
 *     - Source:: Cosmic Blueprint — Astrology / Natal Overview
 *     - [[date:2026-02-20]]
 *     - Tags:: growth, saturn
 */
export function formatInsightAsTanaPaste(insight: SavedInsight): string {
  const date = toTanaDate(insight.createdAt);
  const title = nodeTitle(insight.content);
  const source = `${formatCategory(insight.category)} / ${formatType(insight.contemplationType)}`;

  const lines = [
    `- ${title} #[[^${INSIGHT_TAG}]]`,
    `  - [[^${INSIGHT_DETAILS_FIELD}]]:: ${fieldValue(insight.content)}`,
    `  - Source:: Cosmic Blueprint — ${source}`,
    `  - [[date:${date}]]`,
  ];

  if (insight.tags.length > 0) {
    lines.push(`  - Tags:: ${insight.tags.join(', ')}`);
  }

  return lines.join('\n');
}

/**
 * Format multiple insights as a single Tana Paste block
 * (for bulk paste or MCP import).
 */
export function formatInsightsAsTanaPaste(insights: SavedInsight[]): string {
  return insights.map(formatInsightAsTanaPaste).join('\n');
}

// ─── Session Formatters ───────────────────────────────────────────────────────

/**
 * Format a single SavedSession as Tana Paste markup.
 *
 * Output example:
 *   - Contemplation: Natal Overview — 2026-02-20 #[[^-_JLK13vLzNG]]
 *     - Category:: Astrology
 *     - AI Opening:: The stars at your birth moment…
 *     - Messages:: 6
 *     - Source:: Cosmic Blueprint
 *     - [[date:2026-02-20]]
 */
export function formatSessionAsTanaPaste(session: SavedSession): string {
  const date = toTanaDate(session.createdAt);
  const typeLabel = formatType(session.contemplationType);
  const categoryLabel = formatCategory(session.category);

  const firstAiMessage = session.messages.find((m) => m.role === 'assistant');
  const aiOpening = firstAiMessage?.content
    ? fieldValue(firstAiMessage.content.slice(0, 300)) +
      (firstAiMessage.content.length > 300 ? '…' : '')
    : null;

  const lines = [
    `- Contemplation: ${typeLabel} — ${date} #[[^${CONTEMPLATION_TAG}]]`,
    `  - Category:: ${categoryLabel}`,
  ];

  if (session.focusEntity) {
    lines.push(`  - Focus Entity:: ${session.focusEntity.name}`);
  }

  if (aiOpening) {
    lines.push(`  - AI Opening:: ${aiOpening}`);
  }

  lines.push(`  - Messages:: ${session.messages.length}`);
  lines.push(`  - Source:: Cosmic Blueprint`);
  lines.push(`  - [[date:${date}]]`);

  return lines.join('\n');
}

/**
 * Format multiple sessions as a single Tana Paste block.
 */
export function formatSessionsAsTanaPaste(sessions: SavedSession[]): string {
  return sessions.map(formatSessionAsTanaPaste).join('\n');
}

// ─── ILOS Export Formatters ───────────────────────────────────────────────────

/**
 * Format an Elemental Profile Reading result as a Tana QUANTUM node
 * Source: ILOS Elemental VPER — self-knowledge layer
 */
export function formatElementalProfileNode(
  elementalData: {
    distribution: Record<string, number>;  // e.g. { fire: 3, earth: 4, air: 2, water: 1 }
    dominantElement: string;
    weakElement: string;
    vperStrength: string;  // e.g. "execute"
    vperGrowthEdge: string;  // e.g. "vision"
    growthPractices: string[];
  }
): string {
  const lines = [
    `- Elemental Profile`,
    `  - Distribution:: Fire ${elementalData.distribution.fire ?? 0} · Earth ${elementalData.distribution.earth ?? 0} · Air ${elementalData.distribution.air ?? 0} · Water ${elementalData.distribution.water ?? 0}`,
    `  - Dominant Element:: ${elementalData.dominantElement}`,
    `  - Weak Element:: ${elementalData.weakElement}`,
    `  - VPER Strength:: ${elementalData.vperStrength}`,
    `  - VPER Growth Edge:: ${elementalData.vperGrowthEdge}`,
  ];
  if (elementalData.growthPractices.length > 0) {
    lines.push(`  - Growth Practices::`);
    elementalData.growthPractices.forEach(p => lines.push(`    - ${p}`));
  }
  return lines.join('\n');
}

/**
 * Format a VPER phase insight as a Tana TIME node entry
 * Source: ILOS TIME dimension — weekly/monthly planning context
 */
export function formatVperPhaseInsight(
  vperData: {
    currentPhase: string;       // e.g. "execute"
    phaseLabel: string;         // e.g. "Execute / Earth"
    activeKeyAreas: string[];   // e.g. ["Work & Wellness", "Finances & Resources"]
    cosmicContext: string;      // 1-sentence description of current transits
    suggestedFocus: string;     // 1 action/focus recommendation
  }
): string {
  const lines = [
    `- VPER Phase Insight`,
    `  - Current Phase:: ${vperData.phaseLabel}`,
    `  - Cosmic Context:: ${vperData.cosmicContext}`,
    `  - Suggested Focus:: ${vperData.suggestedFocus}`,
  ];
  if (vperData.activeKeyAreas.length > 0) {
    lines.push(`  - Active Key Areas::`);
    vperData.activeKeyAreas.forEach(area => lines.push(`    - ${area}`));
  }
  return lines.join('\n');
}

// ─── Inner Landscape Protocol Export (Sprint BB) ─────────────────────────────

/**
 * Format a developmental imprinting protocol as Tana Paste for QUANTUM workspace.
 * Maps the four Venus Sequence spheres to developmental imprinting layers.
 *
 * Layer map:
 *   Mental Gift Pattern → IQ sphere (Personality Venus, ages 14-21)
 *   Emotional Imprint   → EQ sphere (Personality Mars, ages 7-14)
 *   Inner Grounding     → SQ sphere (Design Saturn, ages 0-7)
 *   Ancestral Integration → Core sphere (Design Mars, pre-birth)
 */
export function formatInnerLandscapeProtocol(profile: CosmicProfile): string {
  const gkProfile = profile.geneKeysProfile;
  const name = profile.meta?.name ?? 'My Blueprint';

  if (!gkProfile) {
    return `- Inner Landscape Protocol — ${name}\n  - Status:: Gene Keys profile not available`;
  }

  type SphereLayer = {
    label: string;
    sphere: typeof gkProfile.iq;
    devNote: string;
    lineFieldExtras: (lineNum: number) => string[];
  };

  const layers: SphereLayer[] = [
    {
      label: 'Mental Gift Pattern (IQ — Personality Venus)',
      sphere: gkProfile.iq,
      devNote: 'Ages 14-21 · How the mind learned to be brilliant and to protect itself through brilliance',
      lineFieldExtras: (lineNum) => {
        const ld = lines.get(`line-${lineNum}`);
        const extras: string[] = [];
        if (ld?.communicationGuardian) {
          extras.push(`Communication Style:: ${fieldValue(ld.communicationGuardian)}`);
        }
        extras.push(`Integration Invitation:: What would it feel like to trust this mind's gifts without needing to prove them?`);
        return extras;
      },
    },
    {
      label: 'Emotional Imprint (EQ — Personality Mars)',
      sphere: gkProfile.eq,
      devNote: 'Ages 7-14 · The emotional defense pattern and the love language beneath it',
      lineFieldExtras: (lineNum) => {
        const ld = lines.get(`line-${lineNum}`);
        const extras: string[] = [];
        if (ld?.emotionalImprint) {
          extras.push(`Defense Pattern:: ${fieldValue(ld.emotionalImprint.defensePattern)}`);
          extras.push(`Love Language:: ${fieldValue(ld.emotionalImprint.loveLanguage)}`);
        }
        return extras;
      },
    },
    {
      label: 'Inner Grounding (SQ — Design Saturn)',
      sphere: gkProfile.sq,
      devNote: 'Ages 0-7 · The earliest developmental need — safety, consistency, and the ground beneath',
      lineFieldExtras: (lineNum) => {
        const ld = lines.get(`line-${lineNum}`);
        const extras: string[] = [];
        if (ld?.innerGrounding) {
          extras.push(`Core Need:: ${fieldValue(ld.innerGrounding.coreNeed)}`);
          extras.push(`When Denied:: ${fieldValue(ld.innerGrounding.whenDenied)}`);
        }
        return extras;
      },
    },
    {
      label: 'Ancestral Integration (Core — Design Mars)',
      sphere: gkProfile.core,
      devNote: 'Pre-birth · Inherited conditioning and the evolutionary responsibility the soul chose',
      lineFieldExtras: (lineNum) => {
        const ld = lines.get(`line-${lineNum}`);
        const extras: string[] = [];
        if (ld?.ancestralIntegration) {
          extras.push(`Ancestral Wound:: ${fieldValue(ld.ancestralIntegration.wound)}`);
          extras.push(`Integration Path:: ${fieldValue(ld.ancestralIntegration.remedy)}`);
        }
        return extras;
      },
    },
  ];

  const outputLines: string[] = [`- Inner Landscape Protocol — ${name}`];

  for (const layer of layers) {
    const { sphere } = layer;
    const activation = `${sphere.geneKeyNumber}.${sphere.line}`;
    const gk = geneKeys.get(sphere.geneKeyId);
    const ld = lines.get(`line-${sphere.line}`);

    outputLines.push(`  - ${layer.label}`);
    outputLines.push(`    - Activation:: ${activation}${gk ? ` — ${gk.name}` : ''}`);
    outputLines.push(`    - Developmental Window:: ${layer.devNote}`);

    if (gk) {
      outputLines.push(`    - Shadow:: ${fieldValue(gk.shadow.name)}`);
      outputLines.push(`    - Gift:: ${fieldValue(gk.gift.name)}`);
    }

    if (ld?.chakraResonance && ld?.elementalExpression) {
      outputLines.push(`    - Embodiment Portal:: ${ld.chakraResonance} Chakra · ${ld.elementalExpression} Element`);
    }

    const extras = layer.lineFieldExtras(sphere.line);
    extras.forEach(e => outputLines.push(`    - ${e}`));
  }

  return outputLines.join('\n');
}

// ─── Elemental Survey Export ──────────────────────────────────────────────────

interface ElementalSurveyScores {
  fire: number;
  air: number;
  earth: number;
  water: number;
  savedAt: string;
}

function interpretElementTier(score: number): string {
  if (score >= 5) return 'Dominant';
  if (score >= 3) return 'Strong';
  if (score >= 1) return 'Developing';
  return 'Hunger';
}

const ELEMENT_VPER_LABEL: Record<string, string> = {
  fire: 'Vision (V)', air: 'Plan (P)', earth: 'Execute (E)', water: 'Review (R)',
};

/**
 * Format an elemental survey result as Tana Paste.
 * Can be called with data from CosmicProfile.personalContext.elementalSurveyScores
 * or from localStorage directly.
 */
export function formatElementalSurveyAsTanaPaste(
  scores: ElementalSurveyScores,
  profileName?: string,
): string {
  const date = scores.savedAt.slice(0, 10);
  const elements = ['fire', 'air', 'earth', 'water'] as const;

  const dominant = elements.filter(e => scores[e] >= 5);
  const hunger = elements.filter(e => scores[e] === 0);

  const header = profileName
    ? `Elemental Profile — ${profileName}`
    : 'Elemental Profile Survey';

  const tanaPasteLines = [
    `- ${header}`,
    `  - Type:: Elemental Survey (Debra Silverman)`,
    `  - [[date:${date}]]`,
  ];

  for (const el of elements) {
    const score = scores[el];
    const tier = interpretElementTier(score);
    tanaPasteLines.push(`  - ${el.charAt(0).toUpperCase() + el.slice(1)} (${ELEMENT_VPER_LABEL[el]}):: ${score}/6 — ${tier}`);
  }

  if (dominant.length > 0) {
    tanaPasteLines.push(`  - Dominant:: ${dominant.join(', ')}`);
  }
  if (hunger.length > 0) {
    tanaPasteLines.push(`  - Hunger (Soul Calling):: ${hunger.join(', ')}`);
  }

  return tanaPasteLines.join('\n');
}

// ─── Clipboard Utility ────────────────────────────────────────────────────────

/**
 * Copy text to the system clipboard.
 * Returns true on success, false on failure.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      return true;
    } catch {
      return false;
    }
  }
}
