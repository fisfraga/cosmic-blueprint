/**
 * Profile Sync Service
 *
 * Bridges localStorage-based profile storage with Supabase persistence.
 * Mirrors the insightSync.ts pattern exactly.
 *
 * Behavior:
 * - Signed OUT: profiles stay in localStorage only (existing behavior)
 * - Signed IN:  profiles sync to Supabase on save/delete
 * - Sign IN:    Supabase profiles are merged into localStorage on auth event
 */

import type { User } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import type { CosmicProfile } from '../types';
import {
  loadAllProfiles,
  saveCosmicProfile as localSaveCosmicProfile,
  getActiveProfileId,
} from './profiles';

// ─── Remote CRUD ─────────────────────────────────────────────────────────────

/**
 * Upload a single profile to Supabase for the given user.
 */
export async function pushProfileToCloud(
  profile: CosmicProfile,
  userId: string
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  const activeId = getActiveProfileId();

  await supabase.from('cosmic_profiles').upsert({
    id: profile.meta.id,
    user_id: userId,
    name: profile.meta.name,
    profile_data: profile,
    is_active: profile.meta.id === activeId,
    updated_at: new Date().toISOString(),
  });
}

/**
 * Delete a profile from Supabase.
 */
export async function deleteProfileFromCloud(profileId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  await supabase.from('cosmic_profiles').delete().eq('id', profileId);
}

/**
 * Fetch all profiles for a user from Supabase.
 */
export async function fetchProfilesFromCloud(userId: string): Promise<CosmicProfile[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('cosmic_profiles')
    .select('profile_data, is_active')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error || !data) return [];

  return data
    .map((row) => row.profile_data as CosmicProfile)
    .filter(Boolean);
}

// ─── Merge on sign-in ────────────────────────────────────────────────────────

/**
 * Called after a user signs in.
 * Fetches their Supabase profiles and merges them with localStorage,
 * then uploads any local-only profiles back to Supabase.
 */
export async function syncProfilesOnSignIn(user: User): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const [cloudProfiles, localProfiles] = await Promise.all([
    fetchProfilesFromCloud(user.id),
    Promise.resolve(loadAllProfiles()),
  ]);

  const cloudIds = new Set(cloudProfiles.map((p) => p.meta.id));
  const localIds = new Set(localProfiles.map((p) => p.meta.id));

  // Merge cloud profiles that aren't in localStorage
  const toMergeLocally = cloudProfiles.filter((p) => !localIds.has(p.meta.id));
  for (const profile of toMergeLocally) {
    localSaveCosmicProfile(profile);
  }

  // Upload local profiles that aren't in Supabase
  const toUpload = localProfiles.filter((p) => !cloudIds.has(p.meta.id));
  await Promise.all(toUpload.map((p) => pushProfileToCloud(p, user.id)));
}
