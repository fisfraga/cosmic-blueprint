/**
 * Session Sync Service
 *
 * Bridges localStorage-based session storage with Supabase persistence.
 * Works additively — sessions.ts always writes to localStorage first.
 * This service adds Supabase sync on top.
 *
 * Behavior:
 * - Signed OUT: sessions stay in localStorage only
 * - Signed IN:  sessions sync to Supabase on save/delete
 * - Sign IN:    Supabase sessions are merged into localStorage on auth event
 */

import type { User } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import type { SavedSession } from './sessions';
import { loadSessions, upsertSession } from './sessions';

// ----------------------------------------------------------------
// Remote CRUD
// ----------------------------------------------------------------

/**
 * Upload a single session to Supabase for the given user.
 */
export async function pushSessionToCloud(session: SavedSession, userId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const { error } = await supabase.from('contemplation_sessions').upsert({
      id: session.id,
      user_id: userId,
      category: session.category,
      contemplation_type: session.contemplationType,
      focus_entity: session.focusEntity ?? null,
      messages: session.messages,
      profile_id: session.profileId ?? null,
      created_at: session.createdAt,
      updated_at: session.updatedAt,
    });
    if (error) {
      console.error('Failed to push session to cloud:', error.message);
    }
  } catch (err) {
    console.error('Error pushing session to cloud:', err);
  }
}

/**
 * Delete a session from Supabase.
 */
export async function deleteSessionFromCloud(sessionId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const { error } = await supabase.from('contemplation_sessions').delete().eq('id', sessionId);
    if (error) {
      console.error('Failed to delete session from cloud:', error.message);
    }
  } catch (err) {
    console.error('Error deleting session from cloud:', err);
  }
}

/**
 * Fetch all sessions for a user from Supabase, ordered by most recently updated.
 */
export async function fetchSessionsFromCloud(userId: string): Promise<SavedSession[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('contemplation_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id as string,
    category: row.category as SavedSession['category'],
    contemplationType: row.contemplation_type as SavedSession['contemplationType'],
    focusEntity: (row.focus_entity as SavedSession['focusEntity']) ?? null,
    messages: (row.messages as SavedSession['messages']) ?? [],
    profileId: (row.profile_id as string | null) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }));
}

// ----------------------------------------------------------------
// Merge on sign-in
// ----------------------------------------------------------------

/**
 * Called after a user signs in.
 * Fetches their Supabase sessions and merges them with localStorage,
 * then uploads any local-only sessions back to Supabase.
 */
export async function syncSessionsOnSignIn(user: User): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const [cloudSessions, localSessions] = await Promise.all([
    fetchSessionsFromCloud(user.id),
    Promise.resolve(loadSessions()),
  ]);

  const cloudIds = new Set(cloudSessions.map((s) => s.id));
  const localIds = new Set(localSessions.map((s) => s.id));

  // Merge cloud sessions that aren't in localStorage
  const toMergeLocally = cloudSessions.filter((s) => !localIds.has(s.id));
  for (const session of toMergeLocally) {
    upsertSession(session);
  }

  // Upload local sessions that aren't in Supabase
  const toUpload = localSessions.filter((s) => !cloudIds.has(s.id));
  await Promise.all(toUpload.map((s) => pushSessionToCloud(s, user.id)));
}
