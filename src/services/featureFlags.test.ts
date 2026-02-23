import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  loadFlagOverrides,
  saveFlagOverrides,
  resolveFlagValue,
  TYPE_FLAG_MAP,
  CATEGORY_FLAG_MAP,
  FLAG_METADATA,
  type FeatureFlagId,
  type FeatureFlagsOverrides,
} from './featureFlags';
import type { ContemplationCategory } from './contemplation/context';
import { CONTEMPLATION_TYPES } from '../hooks/useContemplation';

const FLAGS_KEY = 'cosmic-copilot-feature-flags';

describe('featureFlags', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ─── Default values ─────────────────────────────────────────────────────────

  describe('resolveFlagValue defaults', () => {
    it('returns true for every flag when there are no overrides', () => {
      const overrides: FeatureFlagsOverrides = {};
      const allFlags = Object.keys(FLAG_METADATA) as FeatureFlagId[];
      for (const id of allFlags) {
        expect(resolveFlagValue(id, overrides)).toBe(true);
      }
    });

    it('returns true when localStorage is empty (loadFlagOverrides returns {})', () => {
      const overrides = loadFlagOverrides();
      expect(overrides).toEqual({});
      const allFlags = Object.keys(FLAG_METADATA) as FeatureFlagId[];
      for (const id of allFlags) {
        expect(resolveFlagValue(id, overrides)).toBe(true);
      }
    });
  });

  // ─── Sparse storage ──────────────────────────────────────────────────────────

  describe('saveFlagOverrides / loadFlagOverrides (sparse storage)', () => {
    it('saves only false overrides to localStorage', () => {
      saveFlagOverrides({ 'kb.debraSilverman': false });
      const raw = localStorage.getItem(FLAGS_KEY);
      const parsed = JSON.parse(raw!);
      expect(parsed).toEqual({ 'kb.debraSilverman': false });
    });

    it('loads saved overrides correctly', () => {
      saveFlagOverrides({ 'contemplation.fixedStars': false, 'library.lostOctave': false });
      const loaded = loadFlagOverrides();
      expect(loaded['contemplation.fixedStars']).toBe(false);
      expect(loaded['library.lostOctave']).toBe(false);
    });

    it('returns {} when localStorage has invalid JSON', () => {
      localStorage.setItem(FLAGS_KEY, 'not-json');
      const loaded = loadFlagOverrides();
      expect(loaded).toEqual({});
    });

    it('returns {} when localStorage has no entry', () => {
      const loaded = loadFlagOverrides();
      expect(loaded).toEqual({});
    });
  });

  // ─── resolveFlagValue precedence ────────────────────────────────────────────

  describe('resolveFlagValue precedence', () => {
    it('user override (false) wins over default (true)', () => {
      const overrides: FeatureFlagsOverrides = { 'kb.richardRudd': false };
      expect(resolveFlagValue('kb.richardRudd', overrides)).toBe(false);
    });

    it('server override (false) wins over user override (truthy/absent)', () => {
      const overrides: FeatureFlagsOverrides = {};
      const serverOverrides: Partial<Record<FeatureFlagId, boolean>> = {
        'kb.isadoraSynthesis': false,
      };
      expect(resolveFlagValue('kb.isadoraSynthesis', overrides, serverOverrides)).toBe(false);
    });

    it('server override (false) wins over user override (false)', () => {
      // Both say false — server still wins (same result, but correct path)
      const overrides: FeatureFlagsOverrides = { 'kb.raUruHu': false };
      const serverOverrides: Partial<Record<FeatureFlagId, boolean>> = { 'kb.raUruHu': false };
      expect(resolveFlagValue('kb.raUruHu', overrides, serverOverrides)).toBe(false);
    });

    it('server override (true) wins even if user override is false', () => {
      const overrides: FeatureFlagsOverrides = { 'contemplation.yearAhead': false };
      const serverOverrides: Partial<Record<FeatureFlagId, boolean>> = {
        'contemplation.yearAhead': true,
      };
      expect(resolveFlagValue('contemplation.yearAhead', overrides, serverOverrides)).toBe(true);
    });

    it('falls back to default (true) when absent from both overrides', () => {
      expect(resolveFlagValue('library.wisdomTraditions', {}, {})).toBe(true);
    });
  });

  // ─── TYPE_FLAG_MAP validity ──────────────────────────────────────────────────

  describe('TYPE_FLAG_MAP', () => {
    // Collect all valid ContemplationType values from CONTEMPLATION_TYPES
    const validTypes = new Set<string>(
      Object.values(CONTEMPLATION_TYPES)
        .flat()
        .map((t) => t.id),
    );

    it('every key in TYPE_FLAG_MAP is a valid ContemplationType', () => {
      for (const typeId of Object.keys(TYPE_FLAG_MAP)) {
        expect(validTypes.has(typeId), `"${typeId}" not found in CONTEMPLATION_TYPES`).toBe(true);
      }
    });

    it('every value in TYPE_FLAG_MAP is a valid FeatureFlagId', () => {
      const validFlags = new Set(Object.keys(FLAG_METADATA));
      for (const flagId of Object.values(TYPE_FLAG_MAP)) {
        expect(validFlags.has(flagId!), `"${flagId}" not in FLAG_METADATA`).toBe(true);
      }
    });

    it('all mapped types belong to the kb.* domain flags', () => {
      for (const flagId of Object.values(TYPE_FLAG_MAP)) {
        expect(flagId!.startsWith('kb.')).toBe(true);
      }
    });
  });

  // ─── CATEGORY_FLAG_MAP validity ──────────────────────────────────────────────

  describe('CATEGORY_FLAG_MAP', () => {
    it('every value in CATEGORY_FLAG_MAP is a valid FeatureFlagId', () => {
      const validFlags = new Set(Object.keys(FLAG_METADATA));
      for (const flagId of Object.values(CATEGORY_FLAG_MAP)) {
        expect(validFlags.has(flagId!), `"${flagId}" not in FLAG_METADATA`).toBe(true);
      }
    });

    it('all mapped categories belong to the contemplation.* domain flags', () => {
      for (const flagId of Object.values(CATEGORY_FLAG_MAP)) {
        expect(flagId!.startsWith('contemplation.')).toBe(true);
      }
    });

    it('core categories (astrology, humanDesign, geneKeys, crossSystem, lifeOS) are NOT in the map', () => {
      const coreCategories: ContemplationCategory[] = [
        'astrology', 'humanDesign', 'geneKeys', 'crossSystem', 'lifeOS',
      ];
      for (const cat of coreCategories) {
        expect(CATEGORY_FLAG_MAP[cat]).toBeUndefined();
      }
    });
  });

  // ─── FLAG_METADATA completeness ─────────────────────────────────────────────

  describe('FLAG_METADATA', () => {
    it('every flag has a non-empty label and description', () => {
      for (const [id, meta] of Object.entries(FLAG_METADATA)) {
        expect(meta.label.length, `${id} label empty`).toBeGreaterThan(0);
        expect(meta.description.length, `${id} description empty`).toBeGreaterThan(0);
      }
    });

    it('every flag has a domain of contemplation, kb, or library', () => {
      const validDomains = new Set(['contemplation', 'kb', 'library']);
      for (const [id, meta] of Object.entries(FLAG_METADATA)) {
        expect(validDomains.has(meta.domain), `${id} has unknown domain "${meta.domain}"`).toBe(true);
      }
    });
  });
});
