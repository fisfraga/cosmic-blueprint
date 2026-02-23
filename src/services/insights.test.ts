// ============================================
// Tests for Insight Storage Service
// ============================================

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { ContemplationCategory, ContemplationType } from './contemplation/context';

// ─── localStorage Mock ──────────────────────────────────────────────────────

function createLocalStorageMock() {
  const store = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => { store.set(key, value); }),
    removeItem: vi.fn((key: string) => { store.delete(key); }),
    clear: vi.fn(() => { store.clear(); }),
    get length() { return store.size; },
    key: vi.fn((_: number) => null),
  };
}

// ─── Test Helpers ───────────────────────────────────────────────────────────

function makeInsightInput(overrides: Record<string, unknown> = {}) {
  return {
    content: 'A deep insight about the nature of reality',
    category: 'astrology' as ContemplationCategory,
    contemplationType: 'natalOverview' as ContemplationType,
    tags: ['astrology', 'natal'],
    sessionId: 'session-123',
    focusEntity: 'sun',
    profileId: 'profile-1',
    ...overrides,
  };
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('Insight Storage Service', () => {
  let mockStorage: ReturnType<typeof createLocalStorageMock>;

  beforeEach(async () => {
    vi.resetModules();
    mockStorage = createLocalStorageMock();
    vi.stubGlobal('localStorage', mockStorage);
  });

  async function importInsights() {
    return import('./insights');
  }

  describe('loadInsights', () => {
    it('returns empty array when no insights stored', async () => {
      const { loadInsights } = await importInsights();
      expect(loadInsights()).toEqual([]);
    });

    it('returns stored insights', async () => {
      const existing = [{
        id: 'insight-1',
        content: 'Test insight',
        category: 'astrology',
        contemplationType: 'natalOverview',
        tags: ['test'],
        createdAt: '2024-01-01T00:00:00.000Z',
      }];
      mockStorage.setItem('cosmic-copilot-saved-insights', JSON.stringify(existing));

      const { loadInsights } = await importInsights();
      expect(loadInsights()).toHaveLength(1);
      expect(loadInsights()[0].content).toBe('Test insight');
    });

    it('handles corrupted storage gracefully', async () => {
      mockStorage.setItem('cosmic-copilot-saved-insights', '{bad json');

      const { loadInsights } = await importInsights();
      expect(loadInsights()).toEqual([]);
    });
  });

  describe('saveInsight', () => {
    it('creates insight with generated id and createdAt', async () => {
      const { saveInsight } = await importInsights();
      const input = makeInsightInput();

      const saved = saveInsight(input);

      expect(saved.id).toMatch(/^insight-/);
      expect(saved.createdAt).toBeTruthy();
      expect(saved.content).toBe(input.content);
      expect(saved.category).toBe('astrology');
      expect(saved.contemplationType).toBe('natalOverview');
    });

    it('preserves profileId through save/load cycle', async () => {
      const { saveInsight, loadInsights } = await importInsights();
      const input = makeInsightInput({ profileId: 'my-profile-42' });

      saveInsight(input);

      const loaded = loadInsights();
      expect(loaded).toHaveLength(1);
      expect(loaded[0].profileId).toBe('my-profile-42');
    });

    it('adds new insights at the beginning (newest first)', async () => {
      const { saveInsight, loadInsights } = await importInsights();

      saveInsight(makeInsightInput({ content: 'First' }));
      saveInsight(makeInsightInput({ content: 'Second' }));
      saveInsight(makeInsightInput({ content: 'Third' }));

      const insights = loadInsights();
      expect(insights[0].content).toBe('Third');
      expect(insights[1].content).toBe('Second');
      expect(insights[2].content).toBe('First');
    });

    it('caps at MAX_INSIGHTS (100)', async () => {
      const { saveInsight, loadInsights } = await importInsights();

      // Save 101 insights
      for (let i = 0; i < 101; i++) {
        saveInsight(makeInsightInput({ content: `Insight ${i}` }));
      }

      const insights = loadInsights();
      expect(insights.length).toBeLessThanOrEqual(100);
    });
  });

  describe('deleteInsight', () => {
    it('removes insight by ID', async () => {
      const { saveInsight, deleteInsight, loadInsights } = await importInsights();
      const saved = saveInsight(makeInsightInput({ content: 'To delete' }));
      saveInsight(makeInsightInput({ content: 'To keep' }));

      deleteInsight(saved.id);

      const remaining = loadInsights();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].content).toBe('To keep');
    });

    it('does nothing when deleting non-existent ID', async () => {
      const { saveInsight, deleteInsight, loadInsights } = await importInsights();
      saveInsight(makeInsightInput());

      deleteInsight('nonexistent-id');

      expect(loadInsights()).toHaveLength(1);
    });
  });

  describe('updateInsightTags', () => {
    it('updates tags for an existing insight', async () => {
      const { saveInsight, updateInsightTags, loadInsights } = await importInsights();
      const saved = saveInsight(makeInsightInput({ tags: ['old-tag'] }));

      updateInsightTags(saved.id, ['new-tag', 'another-tag']);

      const insights = loadInsights();
      const updated = insights.find(i => i.id === saved.id);
      expect(updated?.tags).toEqual(['new-tag', 'another-tag']);
    });

    it('does nothing for non-existent insight', async () => {
      const { saveInsight, updateInsightTags, loadInsights } = await importInsights();
      saveInsight(makeInsightInput({ tags: ['original'] }));

      updateInsightTags('nonexistent', ['changed']);

      expect(loadInsights()[0].tags).toEqual(['original']);
    });
  });

  describe('searchInsights', () => {
    it('searches by content (case-insensitive)', async () => {
      const { saveInsight, searchInsights } = await importInsights();
      saveInsight(makeInsightInput({ content: 'The Sun illuminates your path' }));
      saveInsight(makeInsightInput({ content: 'Moon energy flows deep' }));
      saveInsight(makeInsightInput({ content: 'Venus brings love' }));

      const results = searchInsights('moon');

      expect(results).toHaveLength(1);
      expect(results[0].content).toContain('Moon');
    });

    it('filters by tags', async () => {
      const { saveInsight, searchInsights } = await importInsights();
      saveInsight(makeInsightInput({ content: 'A', tags: ['astrology', 'sun'] }));
      saveInsight(makeInsightInput({ content: 'B', tags: ['gene-keys'] }));
      saveInsight(makeInsightInput({ content: 'C', tags: ['astrology', 'moon'] }));

      const results = searchInsights('', ['gene-keys']);

      expect(results).toHaveLength(1);
      expect(results[0].content).toBe('B');
    });

    it('combines content query and tag filter', async () => {
      const { saveInsight, searchInsights } = await importInsights();
      saveInsight(makeInsightInput({ content: 'Shadow work insight', tags: ['gene-keys'] }));
      saveInsight(makeInsightInput({ content: 'Shadow pattern in chart', tags: ['astrology'] }));
      saveInsight(makeInsightInput({ content: 'Gift activation', tags: ['gene-keys'] }));

      const results = searchInsights('shadow', ['gene-keys']);

      expect(results).toHaveLength(1);
      expect(results[0].content).toBe('Shadow work insight');
    });

    it('returns all insights when query is empty and no tag filter', async () => {
      const { saveInsight, searchInsights } = await importInsights();
      saveInsight(makeInsightInput({ content: 'A' }));
      saveInsight(makeInsightInput({ content: 'B' }));

      const results = searchInsights('');

      expect(results).toHaveLength(2);
    });
  });

  describe('getInsightsByCategory', () => {
    it('filters insights by contemplation category', async () => {
      const { saveInsight, getInsightsByCategory } = await importInsights();
      saveInsight(makeInsightInput({ content: 'Astro', category: 'astrology' as ContemplationCategory }));
      saveInsight(makeInsightInput({ content: 'GK', category: 'geneKeys' as ContemplationCategory }));
      saveInsight(makeInsightInput({ content: 'HD', category: 'humanDesign' as ContemplationCategory }));
      saveInsight(makeInsightInput({ content: 'Astro2', category: 'astrology' as ContemplationCategory }));

      const results = getInsightsByCategory('astrology');

      expect(results).toHaveLength(2);
      results.forEach(r => expect(r.category).toBe('astrology'));
    });

    it('returns empty array for category with no insights', async () => {
      const { saveInsight, getInsightsByCategory } = await importInsights();
      saveInsight(makeInsightInput({ category: 'astrology' as ContemplationCategory }));

      const results = getInsightsByCategory('geneKeys');
      expect(results).toEqual([]);
    });
  });
});
