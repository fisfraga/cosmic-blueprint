// ============================================
// ILOS Context Module
// Bridges Intentional Life OS with Contemplation Chamber
// ============================================

import personalContext from '../../data/ilos/personal-context.json';
import activeSnapshot from '../../data/ilos/active-snapshot.json';
import areaHouseBridge from '../../data/ilos/area-house-bridge.json';
import methodology from '../../data/ilos/methodology.json';

export interface ILOSContext {
  personalContext: typeof personalContext;
  activeSnapshot: typeof activeSnapshot;
  areaHouseBridge: typeof areaHouseBridge;
  methodology: typeof methodology;
}

export function getILOSContext(): ILOSContext {
  return {
    personalContext,
    activeSnapshot,
    areaHouseBridge,
    methodology,
  };
}

/**
 * Format a concise ILOS context section for inclusion in prompts.
 * Includes: active goals, recent wins count, FPs, MTPs, HHGs, methodology summary.
 * Kept concise since this gets appended to already-long system prompts.
 */
export function formatILOSContext(): string {
  const sections: string[] = [];

  sections.push(`
═══════════════════════════════════════════════════════════════════════════════
                    INTENTIONAL LIFE OS CONTEXT
═══════════════════════════════════════════════════════════════════════════════`);

  // Active Goals
  const goals = activeSnapshot.goals;
  if (goals.length > 0) {
    sections.push('\n[ACTIVE GOALS]');
    goals.forEach(g => {
      sections.push(`  ${g.level}: ${g.name}`);
    });
  }

  // Recent Wins Summary
  const wins = activeSnapshot.wins;
  if (wins.length > 0) {
    sections.push(`\n[RECENT WINS] ${wins.length} wins in the last 30 days`);
    wins.slice(0, 5).forEach(w => {
      sections.push(`  - ${w.name}`);
    });
    if (wins.length > 5) {
      sections.push(`  ... and ${wins.length - 5} more`);
    }
  }

  // Favorite Problems (concise)
  const fps = activeSnapshot.favoriteProblems;
  if (fps.length > 0) {
    sections.push(`\n[FAVORITE PROBLEMS] ${fps.length} active questions`);
    fps.slice(0, 5).forEach(fp => {
      sections.push(`  - ${fp}`);
    });
    if (fps.length > 5) {
      sections.push(`  ... and ${fps.length - 5} more`);
    }
  }

  // MTPs
  const mtps = activeSnapshot.mtps;
  if (mtps.length > 0) {
    sections.push('\n[MASSIVELY TRANSFORMATIVE PURPOSES]');
    mtps.forEach(mtp => {
      sections.push(`  - ${mtp}`);
    });
  }

  // HHGs (concise)
  const hhgs = activeSnapshot.hhgs;
  if (hhgs.length > 0) {
    sections.push(`\n[HIGH HARD GOALS] ${hhgs.length} active`);
    hhgs.slice(0, 5).forEach(hhg => {
      sections.push(`  - ${hhg}`);
    });
    if (hhgs.length > 5) {
      sections.push(`  ... and ${hhgs.length - 5} more`);
    }
  }

  // Methodology Summary
  sections.push('\n[METHODOLOGY]');
  sections.push(`  VPER: ${methodology.vperCycle.substring(0, 200)}...`);
  sections.push(`  Gap to Gain: Always start with wins. Measure against past self, not ideals.`);
  sections.push(`  Extreme Prioritization: Max 3 goals per period.`);

  return sections.join('\n');
}

/**
 * Category-specific ILOS context formatting.
 * Different categories get different levels of ILOS context.
 */
export function formatILOSContextForCategory(category: string): string {
  switch (category) {
    case 'lifeOS':
    case 'crossSystem':
      return formatFullILOSContext();

    case 'astrology':
      return formatAstrologyILOSContext();

    case 'humanDesign':
      return formatHumanDesignILOSContext();

    case 'geneKeys':
      return formatGeneKeysILOSContext();

    case 'numerology':
      // Numerology connects to purpose — same context as Gene Keys
      return formatGeneKeysILOSContext();

    case 'cosmicEmbodiment':
    case 'fixedStars':
    case 'alchemy':
    default:
      return '';
  }
}

function formatFullILOSContext(): string {
  const sections: string[] = [];

  sections.push(formatILOSContext());

  // Add personal context
  sections.push('\n[PERSONAL CONTEXT]');
  sections.push(`  Identity: ${personalContext.identity}`);
  sections.push(`  Business: ${personalContext.businessContext}`);
  sections.push(`  Non-negotiables: ${personalContext.nonNegotiables}`);

  // Add area-house bridge summary
  sections.push('\n[AREA-HOUSE BRIDGE]');
  sections.push('  12 Life Areas mapped to 12 Astrological Houses:');
  areaHouseBridge.houses.forEach(h => {
    const planetInfo = h.natal_planets.length > 0 ? ` [${h.natal_planets.join(', ')}]` : '';
    sections.push(`  H${h.house} (${h.cusp_sign}): ${h.area_name}${planetInfo}`);
  });

  return sections.join('\n');
}

function formatAstrologyILOSContext(): string {
  const sections: string[] = [];

  sections.push(`
═══════════════════════════════════════════════════════════════════════════════
                    ILOS — AREA-HOUSE BRIDGE
═══════════════════════════════════════════════════════════════════════════════`);

  // Area-house mapping with goals in activated houses
  sections.push('\n[LIFE AREAS = ASTROLOGICAL HOUSES]');
  areaHouseBridge.houses.forEach(h => {
    const planetInfo = h.natal_planets.length > 0 ? ` | Natal: ${h.natal_planets.join(', ')}` : '';
    const areaGoals = activeSnapshot.goals.filter(g =>
      g.area && h.area_name.toLowerCase().includes(g.area.toLowerCase())
    );
    const goalInfo = areaGoals.length > 0 ? ` | Goals: ${areaGoals.map(g => g.name).join('; ')}` : '';
    sections.push(`  H${h.house} ${h.cusp_sign}: ${h.area_name}${planetInfo}${goalInfo}`);
  });

  // Active goals for reference
  if (activeSnapshot.goals.length > 0) {
    sections.push('\n[ACTIVE GOALS]');
    activeSnapshot.goals.forEach(g => {
      sections.push(`  ${g.level}: ${g.name}`);
    });
  }

  return sections.join('\n');
}

function formatHumanDesignILOSContext(): string {
  const sections: string[] = [];

  sections.push(`
═══════════════════════════════════════════════════════════════════════════════
                    ILOS — STRATEGY & AUTHORITY CONTEXT
═══════════════════════════════════════════════════════════════════════════════`);

  // Goals + wins for strategy/authority context
  if (activeSnapshot.goals.length > 0) {
    sections.push('\n[ACTIVE GOALS]');
    activeSnapshot.goals.forEach(g => {
      sections.push(`  ${g.level}: ${g.name}`);
    });
  }

  // Recent wins
  if (activeSnapshot.wins.length > 0) {
    sections.push(`\n[RECENT WINS] ${activeSnapshot.wins.length} wins (Gap to Gain)`);
    activeSnapshot.wins.slice(0, 5).forEach(w => {
      sections.push(`  - ${w.name}`);
    });
  }

  // Methodology note
  sections.push('\n[NOTE] When discussing HD Strategy and Authority, connect to active goals.');
  sections.push('  How does their decision-making design inform pursuit of these goals?');

  return sections.join('\n');
}

function formatGeneKeysILOSContext(): string {
  const sections: string[] = [];

  sections.push(`
═══════════════════════════════════════════════════════════════════════════════
                    ILOS — PURPOSE ARCHITECTURE
═══════════════════════════════════════════════════════════════════════════════`);

  // Favorite Problems as purpose compass
  if (activeSnapshot.favoriteProblems.length > 0) {
    sections.push('\n[FAVORITE PROBLEMS — Life Questions]');
    activeSnapshot.favoriteProblems.slice(0, 7).forEach(fp => {
      sections.push(`  - ${fp}`);
    });
  }

  // MTPs
  if (activeSnapshot.mtps.length > 0) {
    sections.push('\n[MASSIVELY TRANSFORMATIVE PURPOSES]');
    activeSnapshot.mtps.forEach(mtp => {
      sections.push(`  - ${mtp}`);
    });
  }

  // Goals mapped to purpose
  if (activeSnapshot.goals.length > 0) {
    sections.push('\n[ACTIVE GOALS — Current Expression of Purpose]');
    activeSnapshot.goals.forEach(g => {
      sections.push(`  ${g.level}: ${g.name}`);
    });
  }

  // Methodology connection
  sections.push('\n[NOTE] Connect Gene Key themes to Favorite Problems and MTPs.');
  sections.push('  The VPER cycle mirrors the shadow-gift-siddhi journey:');
  sections.push('  Shadow = unconscious pattern, Gift = conscious expression, Siddhi = transcendence.');

  return sections.join('\n');
}
