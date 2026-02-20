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
