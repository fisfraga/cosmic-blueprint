// ============================================
// Tests for Sprint Q/R Contemplation Architecture
// Covers: CONTEMPLATION_TYPES completeness, migrateSessionCategory,
//         getCustomPrompt, loadCustomTypes, getFocusOptions contracts
// ============================================

import { describe, it, expect } from 'vitest';

import {
  CONTEMPLATION_TYPES,
  CATEGORY_INFO,
  migrateSessionCategory,
} from '../../hooks/useContemplation';
import {
  getCustomPrompt,
  loadCustomTypes,
} from './customTypes';
import type { ContemplationCategory, ContemplationType } from './context';
import type { SavedSession } from '../sessions';

// ─── Structural completeness ─────────────────────────────────────────────────

describe('CONTEMPLATION_TYPES structural completeness', () => {
  const allCategories: ContemplationCategory[] = [
    'astrology', 'humanDesign', 'geneKeys', 'crossSystem', 'lifeOS',
    'alchemy', 'numerology', 'cosmicEmbodiment', 'fixedStars', 'galacticAstrology',
  ];

  it('every ContemplationCategory has entries in CONTEMPLATION_TYPES', () => {
    for (const cat of allCategories) {
      expect(
        CONTEMPLATION_TYPES[cat],
        `Missing CONTEMPLATION_TYPES entry for category: ${cat}`
      ).toBeDefined();
      expect(
        CONTEMPLATION_TYPES[cat].length,
        `CONTEMPLATION_TYPES[${cat}] should have at least one type`
      ).toBeGreaterThan(0);
    }
  });

  it('every ContemplationCategory has an entry in CATEGORY_INFO', () => {
    for (const cat of allCategories) {
      const info = CATEGORY_INFO[cat];
      expect(info, `Missing CATEGORY_INFO entry for: ${cat}`).toBeDefined();
      expect(info.name.length, `CATEGORY_INFO[${cat}].name should not be empty`).toBeGreaterThan(0);
      expect(info.icon.length, `CATEGORY_INFO[${cat}].icon should not be empty`).toBeGreaterThan(0);
    }
  });

  it('every type definition has required fields', () => {
    for (const [cat, types] of Object.entries(CONTEMPLATION_TYPES)) {
      for (const t of types) {
        expect(t.id, `${cat} type missing id`).toBeTruthy();
        expect(t.name, `${cat}/${t.id} missing name`).toBeTruthy();
        expect(t.description, `${cat}/${t.id} missing description`).toBeTruthy();
      }
    }
  });

  it('all type ids are unique within each category', () => {
    for (const [cat, types] of Object.entries(CONTEMPLATION_TYPES)) {
      const idsInCat = types.map(t => t.id);
      const uniqueIds = new Set(idsInCat);
      expect(
        uniqueIds.size,
        `Duplicate type ids within category: ${cat}`
      ).toBe(idsInCat.length);
    }
  });

  it('Sprint Q categories are present: numerology, cosmicEmbodiment, fixedStars', () => {
    expect(CONTEMPLATION_TYPES['numerology']).toBeDefined();
    expect(CONTEMPLATION_TYPES['cosmicEmbodiment']).toBeDefined();
    expect(CONTEMPLATION_TYPES['fixedStars']).toBeDefined();
  });

  it('Sprint R galacticAstrology category is present with 3 types', () => {
    const types = CONTEMPLATION_TYPES['galacticAstrology'];
    expect(types).toBeDefined();
    expect(types.length).toBe(3);
    const ids = types.map(t => t.id);
    expect(ids).toContain('galacticProfile' as ContemplationType);
    expect(ids).toContain('galacticPointReading' as ContemplationType);
    expect(ids).toContain('galacticAlignment' as ContemplationType);
  });

  it('Sprint R cosmicEmbodiment has elementalEmbodiment and sequenceEmbodiment', () => {
    const types = CONTEMPLATION_TYPES['cosmicEmbodiment'];
    const ids = types.map(t => t.id);
    expect(ids).toContain('elementalEmbodiment' as ContemplationType);
    expect(ids).toContain('sequenceEmbodiment' as ContemplationType);
  });

  it('crossSystem has the two Sprint Q new types', () => {
    const types = CONTEMPLATION_TYPES['crossSystem'];
    const ids = types.map(t => t.id);
    expect(ids).toContain('elementalSystemBridge' as ContemplationType);
    expect(ids).toContain('lifePathSynthesis' as ContemplationType);
  });

  it('alchemy no longer contains numerology types', () => {
    const types = CONTEMPLATION_TYPES['alchemy'];
    const ids = types.map(t => t.id);
    expect(ids).not.toContain('numerologyReading' as ContemplationType);
    expect(ids).not.toContain('numerologyOverview' as ContemplationType);
  });

  it('cosmicEmbodiment (category) no longer lives in crossSystem', () => {
    const crossTypes = CONTEMPLATION_TYPES['crossSystem'];
    const ids = crossTypes.map(t => t.id);
    expect(ids).not.toContain('cosmicEmbodiment' as ContemplationType);
  });
});

// ─── Sprint T — lifeOS Julia Balaz + ILOS expansion ─────────────────────────

describe('Sprint T lifeOS expansion', () => {
  const lifeOSTypes = CONTEMPLATION_TYPES['lifeOS'];
  const lifeOSIds = lifeOSTypes.map(t => t.id);

  it('lifeOS has 12 types after Sprint U expansion (3 existing + 7 Sprint T + 2 Sprint U)', () => {
    expect(lifeOSTypes.length).toBe(12);
  });

  it('all 7 new Sprint T types are present in lifeOS', () => {
    const sprintTTypes: ContemplationType[] = [
      'lifePurposeReading',
      'idealSelfBlueprint',
      'shadowToLightReading',
      'careerPathReading',
      'transitPlanningMap',
      'soulCallingIntegration',
      'vperPhaseReading',
    ];
    for (const typeId of sprintTTypes) {
      expect(lifeOSIds, `Missing Sprint T type: ${typeId}`).toContain(typeId);
    }
  });

  it('vperPhaseReading is registered with level advanced', () => {
    const vper = lifeOSTypes.find(t => t.id === 'vperPhaseReading');
    expect(vper).toBeDefined();
    expect(vper?.level).toBe('advanced');
  });

  it('soulCallingIntegration is registered with level master', () => {
    const soulCalling = lifeOSTypes.find(t => t.id === 'soulCallingIntegration');
    expect(soulCalling).toBeDefined();
    expect(soulCalling?.level).toBe('master');
  });

  it('all new Sprint T types have non-empty name and description', () => {
    const sprintTIds = [
      'lifePurposeReading', 'idealSelfBlueprint', 'shadowToLightReading',
      'careerPathReading', 'transitPlanningMap', 'soulCallingIntegration', 'vperPhaseReading',
    ];
    for (const id of sprintTIds) {
      const t = lifeOSTypes.find(opt => opt.id === id);
      expect(t, `Type ${id} not found`).toBeDefined();
      expect(t?.name.length, `${id} name should not be empty`).toBeGreaterThan(0);
      expect(t?.description.length, `${id} description should not be empty`).toBeGreaterThan(0);
    }
  });

  it('no Sprint T type requires needsFocus (all work without a specific entity)', () => {
    const sprintTIds = [
      'lifePurposeReading', 'idealSelfBlueprint', 'shadowToLightReading',
      'careerPathReading', 'transitPlanningMap', 'soulCallingIntegration', 'vperPhaseReading',
    ];
    for (const id of sprintTIds) {
      const t = lifeOSTypes.find(opt => opt.id === id);
      expect(t?.needsFocus, `${id} should not require needsFocus`).toBeFalsy();
    }
  });

  it('existing lifeOS types are preserved after Sprint T expansion', () => {
    expect(lifeOSIds).toContain('lifeAreaAlignment' as ContemplationType);
    expect(lifeOSIds).toContain('goalCosmicContext' as ContemplationType);
    expect(lifeOSIds).toContain('purposeReview' as ContemplationType);
  });

  // Sprint U — Elemental VPER types
  it('Sprint U elemental types are registered in lifeOS', () => {
    expect(lifeOSIds).toContain('elementalProfileReading' as ContemplationType);
    expect(lifeOSIds).toContain('oppositePolePractice' as ContemplationType);
  });

  it('elementalProfileReading is registered with level beginner', () => {
    const t = lifeOSTypes.find(t => t.id === 'elementalProfileReading');
    expect(t).toBeDefined();
    expect(t?.level).toBe('beginner');
  });

  it('oppositePolePractice is registered with level advanced', () => {
    const t = lifeOSTypes.find(t => t.id === 'oppositePolePractice');
    expect(t).toBeDefined();
    expect(t?.level).toBe('advanced');
  });
});

// ─── migrateSessionCategory ───────────────────────────────────────────────────

function makeSession(overrides: Partial<SavedSession> = {}): SavedSession {
  return {
    id: 'test-session',
    category: 'alchemy',
    contemplationType: 'numerologyReading',
    title: 'Test',
    timestamp: Date.now(),
    messages: [],
    ...overrides,
  } as SavedSession;
}

describe('migrateSessionCategory', () => {
  it('migrates numerologyReading from alchemy → numerology', () => {
    const session = makeSession({ category: 'alchemy', contemplationType: 'numerologyReading' });
    const result = migrateSessionCategory(session);
    expect(result.category).toBe('numerology');
  });

  it('migrates numerologyOverview from alchemy → numerology', () => {
    const session = makeSession({ category: 'alchemy', contemplationType: 'numerologyOverview' });
    const result = migrateSessionCategory(session);
    expect(result.category).toBe('numerology');
  });

  it('no-ops when category is already correct', () => {
    const session = makeSession({ category: 'numerology', contemplationType: 'numerologyReading' });
    const result = migrateSessionCategory(session);
    expect(result.category).toBe('numerology');
    expect(result).toBe(session); // same reference — not cloned unnecessarily
  });

  it('no-ops for types that never moved', () => {
    const session = makeSession({ category: 'astrology', contemplationType: 'natalOverview' });
    const result = migrateSessionCategory(session);
    expect(result.category).toBe('astrology');
    expect(result).toBe(session);
  });
});

// ─── Custom Types scaffold ────────────────────────────────────────────────────

describe('getCustomPrompt', () => {
  it('returns null for unknown type ids (empty JSON scaffold)', () => {
    expect(getCustomPrompt('unknownType')).toBeNull();
    expect(getCustomPrompt('alchemicalNatalReading')).toBeNull();
  });
});

describe('loadCustomTypes', () => {
  it('returns empty array for any category (empty JSON scaffold)', () => {
    const allCats: ContemplationCategory[] = [
      'astrology', 'humanDesign', 'geneKeys', 'crossSystem', 'lifeOS',
      'alchemy', 'numerology', 'cosmicEmbodiment', 'fixedStars', 'galacticAstrology',
    ];
    for (const cat of allCats) {
      expect(loadCustomTypes(cat)).toEqual([]);
    }
  });
});

// ─── Sprint V — Ra Uru Hu HD depth layer ─────────────────────────────────────

describe('Sprint V humanDesign Ra Uru Hu depth layer', () => {
  const hdTypes = CONTEMPLATION_TYPES['humanDesign'];
  const hdIds = hdTypes.map(t => t.id);

  it('deconditioningJourney is in humanDesign category', () => {
    expect(hdIds).toContain('deconditioningJourney' as ContemplationType);
  });

  it('typeExperimentSetup is in humanDesign category', () => {
    expect(hdIds).toContain('typeExperimentSetup' as ContemplationType);
  });

  it('notSelfDiagnosis is in humanDesign category', () => {
    expect(hdIds).toContain('notSelfDiagnosis' as ContemplationType);
  });

  it('deconditioningJourney has level advanced', () => {
    const t = hdTypes.find(t => t.id === 'deconditioningJourney');
    expect(t).toBeDefined();
    expect(t?.level).toBe('advanced');
  });

  it('typeExperimentSetup has level beginner', () => {
    const t = hdTypes.find(t => t.id === 'typeExperimentSetup');
    expect(t).toBeDefined();
    expect(t?.level).toBe('beginner');
  });

  it('notSelfDiagnosis has level advanced', () => {
    const t = hdTypes.find(t => t.id === 'notSelfDiagnosis');
    expect(t).toBeDefined();
    expect(t?.level).toBe('advanced');
  });

  it('Sprint V types do not appear in other categories', () => {
    const v03Types: ContemplationType[] = ['deconditioningJourney', 'typeExperimentSetup', 'notSelfDiagnosis'];
    const nonHDCategories: ContemplationCategory[] = [
      'astrology', 'geneKeys', 'crossSystem', 'lifeOS',
      'alchemy', 'numerology', 'cosmicEmbodiment', 'fixedStars', 'galacticAstrology',
    ];
    for (const cat of nonHDCategories) {
      const ids = CONTEMPLATION_TYPES[cat].map(t => t.id);
      for (const typeId of v03Types) {
        expect(ids, `${typeId} should not appear in ${cat}`).not.toContain(typeId);
      }
    }
  });

  it('Sprint V types do not require needsFocus (full-profile readings)', () => {
    const v03Ids = ['deconditioningJourney', 'typeExperimentSetup', 'notSelfDiagnosis'];
    for (const id of v03Ids) {
      const t = hdTypes.find(opt => opt.id === id);
      expect(t?.needsFocus, `${id} should not require needsFocus`).toBeFalsy();
    }
  });

  it('all Sprint V types have non-empty name and description', () => {
    const v03Ids = ['deconditioningJourney', 'typeExperimentSetup', 'notSelfDiagnosis'];
    for (const id of v03Ids) {
      const t = hdTypes.find(opt => opt.id === id);
      expect(t, `Type ${id} not found`).toBeDefined();
      expect(t?.name.length, `${id} name should not be empty`).toBeGreaterThan(0);
      expect(t?.description.length, `${id} description should not be empty`).toBeGreaterThan(0);
    }
  });
});

// ─── Sprint W — Authority mechanics + Incarnation purpose ────────────────────

describe('Sprint W humanDesign authority + incarnation cross types', () => {
  const hdTypes = CONTEMPLATION_TYPES['humanDesign'];
  const hdIds = hdTypes.map(t => t.id);

  it('authorityDeepDive is in humanDesign category', () => {
    expect(hdIds).toContain('authorityDeepDive' as ContemplationType);
  });

  it('incarnationCrossReading is in humanDesign category', () => {
    expect(hdIds).toContain('incarnationCrossReading' as ContemplationType);
  });

  it('authorityDeepDive has level advanced', () => {
    const t = hdTypes.find(t => t.id === 'authorityDeepDive');
    expect(t).toBeDefined();
    expect(t?.level).toBe('advanced');
  });

  it('incarnationCrossReading has level master', () => {
    const t = hdTypes.find(t => t.id === 'incarnationCrossReading');
    expect(t).toBeDefined();
    expect(t?.level).toBe('master');
  });

  it('Sprint W types do not appear in other categories', () => {
    const wTypes: ContemplationType[] = ['authorityDeepDive', 'incarnationCrossReading'];
    const nonHDCategories: ContemplationCategory[] = [
      'astrology', 'geneKeys', 'crossSystem', 'lifeOS',
      'alchemy', 'numerology', 'cosmicEmbodiment', 'fixedStars', 'galacticAstrology',
    ];
    for (const cat of nonHDCategories) {
      const ids = CONTEMPLATION_TYPES[cat].map(t => t.id);
      for (const typeId of wTypes) {
        expect(ids, `${typeId} should not appear in ${cat}`).not.toContain(typeId);
      }
    }
  });

  it('all Sprint W types have non-empty name and description', () => {
    const wIds = ['authorityDeepDive', 'incarnationCrossReading'];
    for (const id of wIds) {
      const t = hdTypes.find(opt => opt.id === id);
      expect(t, `Type ${id} not found`).toBeDefined();
      expect(t?.name.length, `${id} name should not be empty`).toBeGreaterThan(0);
      expect(t?.description.length, `${id} description should not be empty`).toBeGreaterThan(0);
    }
  });
});
