// ============================================
// Tests for Guided Pathways Service
// ============================================

import { describe, it, expect, beforeEach, vi } from 'vitest';

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

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('Guided Pathways Service', () => {
  let mockStorage: ReturnType<typeof createLocalStorageMock>;

  beforeEach(async () => {
    vi.resetModules();
    mockStorage = createLocalStorageMock();
    vi.stubGlobal('localStorage', mockStorage);
  });

  async function importPathways() {
    return import('./pathways');
  }

  describe('GUIDED_PATHWAYS', () => {
    it('exports a non-empty array of pathway definitions', async () => {
      const { GUIDED_PATHWAYS } = await importPathways();
      expect(GUIDED_PATHWAYS.length).toBeGreaterThan(0);
    });

    it('each pathway has required fields', async () => {
      const { GUIDED_PATHWAYS } = await importPathways();
      for (const p of GUIDED_PATHWAYS) {
        expect(p.id).toBeTruthy();
        expect(p.name).toBeTruthy();
        expect(p.description).toBeTruthy();
        expect(p.steps.length).toBeGreaterThan(0);
        expect(p.theme).toBeTruthy();
      }
    });

    it('each step has required fields', async () => {
      const { GUIDED_PATHWAYS } = await importPathways();
      for (const p of GUIDED_PATHWAYS) {
        for (const step of p.steps) {
          expect(step.id).toBeTruthy();
          expect(step.title).toBeTruthy();
          expect(step.category).toBeTruthy();
          expect(step.contemplationType).toBeTruthy();
          expect(step.journalPrompt).toBeTruthy();
          expect(step.estimatedMinutes).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('loadAllProgress', () => {
    it('returns empty array when no progress stored', async () => {
      const { loadAllProgress } = await importPathways();
      expect(loadAllProgress()).toEqual([]);
    });

    it('returns stored progress data', async () => {
      const existing = [{
        pathwayId: 'shadow-week',
        currentStepIndex: 2,
        completedSteps: ['shadow-1', 'shadow-2'],
        journalEntries: {},
        startedAt: '2024-01-01T00:00:00.000Z',
        lastActivityAt: '2024-01-03T00:00:00.000Z',
      }];
      mockStorage.setItem('cosmic-copilot-pathway-progress', JSON.stringify(existing));

      const { loadAllProgress } = await importPathways();
      const progress = loadAllProgress();
      expect(progress).toHaveLength(1);
      expect(progress[0].pathwayId).toBe('shadow-week');
      expect(progress[0].completedSteps).toHaveLength(2);
    });

    it('handles corrupted storage gracefully', async () => {
      mockStorage.setItem('cosmic-copilot-pathway-progress', 'broken json');

      const { loadAllProgress } = await importPathways();
      expect(loadAllProgress()).toEqual([]);
    });
  });

  describe('savePathwayProgress', () => {
    it('saves new progress entry', async () => {
      const { savePathwayProgress, loadAllProgress } = await importPathways();
      const progress = {
        pathwayId: 'shadow-week',
        currentStepIndex: 0,
        completedSteps: [] as string[],
        journalEntries: {} as Record<string, string>,
        startedAt: '2024-01-01T00:00:00.000Z',
        lastActivityAt: '2024-01-01T00:00:00.000Z',
      };

      savePathwayProgress(progress);

      const loaded = loadAllProgress();
      expect(loaded).toHaveLength(1);
      expect(loaded[0].pathwayId).toBe('shadow-week');
    });

    it('updates existing progress for same pathway', async () => {
      const { savePathwayProgress, loadAllProgress } = await importPathways();
      const initial = {
        pathwayId: 'shadow-week',
        currentStepIndex: 0,
        completedSteps: [] as string[],
        journalEntries: {} as Record<string, string>,
        startedAt: '2024-01-01T00:00:00.000Z',
        lastActivityAt: '2024-01-01T00:00:00.000Z',
      };
      savePathwayProgress(initial);

      const updated = {
        ...initial,
        currentStepIndex: 2,
        completedSteps: ['shadow-1', 'shadow-2'],
        lastActivityAt: '2024-01-03T00:00:00.000Z',
      };
      savePathwayProgress(updated);

      const loaded = loadAllProgress();
      expect(loaded).toHaveLength(1);
      expect(loaded[0].currentStepIndex).toBe(2);
      expect(loaded[0].completedSteps).toHaveLength(2);
    });

    it('stores progress for multiple pathways independently', async () => {
      const { savePathwayProgress, loadAllProgress } = await importPathways();

      savePathwayProgress({
        pathwayId: 'shadow-week',
        currentStepIndex: 1,
        completedSteps: ['shadow-1'],
        journalEntries: {},
        startedAt: '2024-01-01T00:00:00.000Z',
        lastActivityAt: '2024-01-01T00:00:00.000Z',
      });

      savePathwayProgress({
        pathwayId: 'purpose-discovery',
        currentStepIndex: 0,
        completedSteps: [],
        journalEntries: {},
        startedAt: '2024-01-02T00:00:00.000Z',
        lastActivityAt: '2024-01-02T00:00:00.000Z',
      });

      const loaded = loadAllProgress();
      expect(loaded).toHaveLength(2);
    });
  });

  describe('startPathway', () => {
    it('creates initial progress with step index 0', async () => {
      const { startPathway, loadPathwayProgress } = await importPathways();

      const progress = startPathway('shadow-week');

      expect(progress.pathwayId).toBe('shadow-week');
      expect(progress.currentStepIndex).toBe(0);
      expect(progress.completedSteps).toEqual([]);
      expect(progress.journalEntries).toEqual({});
      expect(progress.startedAt).toBeTruthy();
      expect(progress.lastActivityAt).toBeTruthy();

      // Verify it was saved
      const loaded = loadPathwayProgress('shadow-week');
      expect(loaded).not.toBeNull();
      expect(loaded!.pathwayId).toBe('shadow-week');
    });
  });

  describe('completeStep', () => {
    it('marks step as completed and advances index', async () => {
      const { startPathway, completeStep } = await importPathways();
      startPathway('shadow-week');

      const result = completeStep('shadow-week', 'shadow-1');

      expect(result).not.toBeNull();
      expect(result!.completedSteps).toContain('shadow-1');
      expect(result!.currentStepIndex).toBe(1);
    });

    it('saves journal entry when provided', async () => {
      const { startPathway, completeStep } = await importPathways();
      startPathway('shadow-week');

      const result = completeStep('shadow-week', 'shadow-1', 'My deep reflection on shadows');

      expect(result).not.toBeNull();
      expect(result!.journalEntries['shadow-1']).toBe('My deep reflection on shadows');
    });

    it('does not duplicate completed steps on re-completion', async () => {
      const { startPathway, completeStep } = await importPathways();
      startPathway('shadow-week');

      completeStep('shadow-week', 'shadow-1');
      const result = completeStep('shadow-week', 'shadow-1', 'Updated reflection');

      expect(result).not.toBeNull();
      const count = result!.completedSteps.filter(s => s === 'shadow-1').length;
      expect(count).toBe(1);
    });

    it('returns null for non-started pathway', async () => {
      const { completeStep } = await importPathways();
      const result = completeStep('nonexistent', 'step-1');
      expect(result).toBeNull();
    });

    it('returns null for non-existent pathway definition', async () => {
      const { savePathwayProgress, completeStep } = await importPathways();
      // Save progress for a pathway that does not exist in GUIDED_PATHWAYS
      savePathwayProgress({
        pathwayId: 'fake-pathway',
        currentStepIndex: 0,
        completedSteps: [],
        journalEntries: {},
        startedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
      });

      const result = completeStep('fake-pathway', 'fake-step');
      expect(result).toBeNull();
    });

    it('updates lastActivityAt timestamp', async () => {
      const { startPathway, completeStep } = await importPathways();
      startPathway('shadow-week');

      const result = completeStep('shadow-week', 'shadow-1');

      // The lastActivityAt should be a valid ISO string
      expect(result).not.toBeNull();
      expect(result!.lastActivityAt).toBeTruthy();
      expect(typeof result!.lastActivityAt).toBe('string');
      // It should be a valid date
      expect(new Date(result!.lastActivityAt).getTime()).not.toBeNaN();
    });
  });

  describe('resetPathway', () => {
    it('removes progress for a pathway', async () => {
      const { startPathway, resetPathway, loadPathwayProgress } = await importPathways();
      startPathway('shadow-week');

      resetPathway('shadow-week');

      expect(loadPathwayProgress('shadow-week')).toBeNull();
    });

    it('does not affect other pathways', async () => {
      const { startPathway, resetPathway, loadPathwayProgress } = await importPathways();
      startPathway('shadow-week');
      startPathway('purpose-discovery');

      resetPathway('shadow-week');

      expect(loadPathwayProgress('shadow-week')).toBeNull();
      expect(loadPathwayProgress('purpose-discovery')).not.toBeNull();
    });
  });

  describe('getPathwayCompletionPercentage', () => {
    it('returns 0 for unstarted pathway', async () => {
      const { getPathwayCompletionPercentage } = await importPathways();
      expect(getPathwayCompletionPercentage('shadow-week')).toBe(0);
    });

    it('returns correct percentage for partially completed pathway', async () => {
      const { startPathway, completeStep, getPathwayCompletionPercentage, GUIDED_PATHWAYS } = await importPathways();
      startPathway('shadow-week');
      completeStep('shadow-week', 'shadow-1');

      const totalSteps = GUIDED_PATHWAYS.find(p => p.id === 'shadow-week')!.steps.length;
      const expectedPercentage = Math.round((1 / totalSteps) * 100);

      expect(getPathwayCompletionPercentage('shadow-week')).toBe(expectedPercentage);
    });

    it('returns 100 when all steps completed', async () => {
      const { startPathway, completeStep, getPathwayCompletionPercentage, GUIDED_PATHWAYS } = await importPathways();
      const pathway = GUIDED_PATHWAYS.find(p => p.id === 'shadow-week')!;
      startPathway('shadow-week');

      for (const step of pathway.steps) {
        completeStep('shadow-week', step.id);
      }

      expect(getPathwayCompletionPercentage('shadow-week')).toBe(100);
    });
  });

  describe('isPathwayComplete', () => {
    it('returns false for incomplete pathway', async () => {
      const { startPathway, isPathwayComplete } = await importPathways();
      startPathway('shadow-week');
      expect(isPathwayComplete('shadow-week')).toBe(false);
    });

    it('returns true when all steps are completed', async () => {
      const { startPathway, completeStep, isPathwayComplete, GUIDED_PATHWAYS } = await importPathways();
      const pathway = GUIDED_PATHWAYS.find(p => p.id === 'shadow-week')!;
      startPathway('shadow-week');

      for (const step of pathway.steps) {
        completeStep('shadow-week', step.id);
      }

      expect(isPathwayComplete('shadow-week')).toBe(true);
    });
  });

  describe('loadPathwayProgress', () => {
    it('returns null for non-started pathway', async () => {
      const { loadPathwayProgress } = await importPathways();
      expect(loadPathwayProgress('nonexistent')).toBeNull();
    });

    it('returns progress for started pathway', async () => {
      const { startPathway, loadPathwayProgress } = await importPathways();
      startPathway('purpose-discovery');

      const progress = loadPathwayProgress('purpose-discovery');
      expect(progress).not.toBeNull();
      expect(progress!.pathwayId).toBe('purpose-discovery');
    });
  });
});
