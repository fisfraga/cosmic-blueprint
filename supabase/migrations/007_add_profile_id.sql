-- Migration: 007_add_profile_id
-- TD-L-01: Add profile_id to saved_insights and contemplation_sessions
-- for multi-profile isolation. Nullable for backwards compatibility
-- with existing data (existing rows get NULL profile_id).

ALTER TABLE public.saved_insights
  ADD COLUMN IF NOT EXISTS profile_id TEXT;

ALTER TABLE public.contemplation_sessions
  ADD COLUMN IF NOT EXISTS profile_id TEXT;

-- Indexes for fast per-profile queries
CREATE INDEX IF NOT EXISTS idx_saved_insights_profile_id
  ON public.saved_insights (profile_id);

CREATE INDEX IF NOT EXISTS idx_contemplation_sessions_profile_id
  ON public.contemplation_sessions (profile_id);
