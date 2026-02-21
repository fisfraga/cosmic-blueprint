/**
 * Pathway Sync Service
 *
 * Bridges localStorage-based pathway progress with Supabase persistence.
 * Mirrors the insightSync.ts pattern exactly.
 *
 * Behavior:
 * - Signed OUT: progress stays in localStorage only (existing behavior)
 * - Signed IN:  progress syncs to Supabase on save
 * - Sign IN:    Supabase progress is merged into localStorage on auth event
 */

import type { User } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import type { PathwayProgress } from './pathways';
import {
  loadAllProgress,
  savePathwayProgress as localSaveProgress,
} from './pathways';

// ─── Remote CRUD ─────────────────────────────────────────────────────────────

/**
 * Upload a single pathway progress record to Supabase.
 * ID is scoped per-user via RLS; composite key is (user_id, pathway_id).
 */
export async function pushProgressToCloud(
  progress: PathwayProgress,
  userId: string
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const { error } = await supabase.from('pathway_progress').upsert({
      id: `${userId}_${progress.pathwayId}`,
      user_id: userId,
      pathway_id: progress.pathwayId,
      current_step_index: progress.currentStepIndex,
      completed_steps: progress.completedSteps,
      journal_entries: progress.journalEntries,
      started_at: progress.startedAt,
      last_activity_at: progress.lastActivityAt,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.error('Failed to push pathway progress to cloud:', error.message);
    }
  } catch (err) {
    console.error('Error pushing pathway progress to cloud:', err);
  }
}

/**
 * Fetch all pathway progress records for a user from Supabase.
 */
export async function fetchProgressFromCloud(userId: string): Promise<PathwayProgress[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('pathway_progress')
    .select('*')
    .eq('user_id', userId)
    .order('last_activity_at', { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    pathwayId: row.pathway_id as string,
    currentStepIndex: row.current_step_index as number,
    completedSteps: (row.completed_steps as string[]) ?? [],
    journalEntries: (row.journal_entries as Record<string, string>) ?? {},
    startedAt: row.started_at as string,
    lastActivityAt: row.last_activity_at as string,
  }));
}

// ─── Merge on sign-in ────────────────────────────────────────────────────────

/**
 * Called after a user signs in.
 * Fetches their Supabase progress and merges with localStorage,
 * then uploads any local-only progress back to Supabase.
 */
export async function syncProgressOnSignIn(user: User): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const [cloudProgress, localProgress] = await Promise.all([
    fetchProgressFromCloud(user.id),
    Promise.resolve(loadAllProgress()),
  ]);

  const cloudIds = new Set(cloudProgress.map((p) => p.pathwayId));
  const localIds = new Set(localProgress.map((p) => p.pathwayId));

  // Merge cloud progress that isn't in localStorage
  const toMergeLocally = cloudProgress.filter((p) => !localIds.has(p.pathwayId));
  for (const progress of toMergeLocally) {
    localSaveProgress(progress);
  }

  // Upload local progress that isn't in Supabase
  const toUpload = localProgress.filter((p) => !cloudIds.has(p.pathwayId));
  await Promise.all(toUpload.map((p) => pushProgressToCloud(p, user.id)));
}
