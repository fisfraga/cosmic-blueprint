/**
 * Insight Sync Service
 *
 * Bridges localStorage-based insight storage with Supabase persistence.
 * Works additively — the existing insights.ts service is unchanged and
 * always writes to localStorage. This service adds Supabase sync on top.
 *
 * Behavior:
 * - Signed OUT: insights stay in localStorage only (existing behavior)
 * - Signed IN:  insights sync to Supabase on save/delete
 * - Sign IN:    Supabase insights are merged into localStorage on auth event
 */

import type { User } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import type { SavedInsight } from './insights';
import { loadInsights, saveInsight as localSaveInsight } from './insights';

// ----------------------------------------------------------------
// Remote CRUD
// ----------------------------------------------------------------

/**
 * Upload a single insight to Supabase for the given user.
 */
export async function pushInsightToCloud(insight: SavedInsight, userId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const { error } = await supabase.from('saved_insights').upsert({
      id: insight.id,
      user_id: userId,
      content: insight.content,
      category: insight.category,
      contemplation_type: insight.contemplationType,
      tags: insight.tags,
      session_id: insight.sessionId ?? null,
      focus_entity: insight.focusEntity ?? null,
      profile_id: insight.profileId ?? null,
      created_at: insight.createdAt,
    });
    if (error) {
      console.error('Failed to push insight to cloud:', error.message);
    }
  } catch (err) {
    console.error('Error pushing insight to cloud:', err);
  }
}

/**
 * Delete an insight from Supabase.
 */
export async function deleteInsightFromCloud(insightId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const { error } = await supabase.from('saved_insights').delete().eq('id', insightId);
    if (error) {
      console.error('Failed to delete insight from cloud:', error.message);
    }
  } catch (err) {
    console.error('Error deleting insight from cloud:', err);
  }
}

/**
 * Fetch all insights for a user from Supabase.
 */
export async function fetchInsightsFromCloud(userId: string): Promise<SavedInsight[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('saved_insights')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id as string,
    content: row.content as string,
    category: row.category as SavedInsight['category'],
    contemplationType: row.contemplation_type as SavedInsight['contemplationType'],
    tags: (row.tags as string[]) ?? [],
    sessionId: (row.session_id as string | null) ?? undefined,
    focusEntity: (row.focus_entity as string | null) ?? undefined,
    profileId: (row.profile_id as string | null) ?? undefined,
    createdAt: row.created_at as string,
  }));
}

// ----------------------------------------------------------------
// Merge on sign-in
// ----------------------------------------------------------------

/**
 * Called after a user signs in.
 * Fetches their Supabase insights and merges them with localStorage,
 * then uploads any local-only insights back to Supabase.
 */
export async function syncInsightsOnSignIn(user: User): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const [cloudInsights, localInsights] = await Promise.all([
    fetchInsightsFromCloud(user.id),
    Promise.resolve(loadInsights()),
  ]);

  const cloudIds = new Set(cloudInsights.map((i) => i.id));
  const localIds = new Set(localInsights.map((i) => i.id));

  // Merge cloud insights that aren't in localStorage
  const toMergeLocally = cloudInsights.filter((i) => !localIds.has(i.id));
  for (const insight of toMergeLocally) {
    localSaveInsight(insight);
  }

  // Upload local insights that aren't in Supabase
  const toUpload = localInsights.filter((i) => !cloudIds.has(i.id));
  await Promise.all(toUpload.map((i) => pushInsightToCloud(i, user.id)));
}
