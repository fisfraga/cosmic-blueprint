-- ============================================================
-- Cosmic Blueprint — Pathway Progress Table
-- Run this in Supabase SQL Editor after 001_initial_schema.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pathway_progress (
  id               TEXT        PRIMARY KEY,
  user_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pathway_id       TEXT        NOT NULL,
  current_step_index INTEGER   NOT NULL DEFAULT 0,
  completed_steps  TEXT[]      NOT NULL DEFAULT '{}',
  journal_entries  JSONB       NOT NULL DEFAULT '{}',
  started_at       TIMESTAMPTZ NOT NULL,
  last_activity_at TIMESTAMPTZ NOT NULL,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast user queries
CREATE INDEX IF NOT EXISTS idx_pathway_progress_user_id
  ON public.pathway_progress(user_id);

-- One progress record per user+pathway combination
CREATE UNIQUE INDEX IF NOT EXISTS idx_pathway_progress_user_pathway
  ON public.pathway_progress(user_id, pathway_id);

-- Row Level Security: users can only see their own progress
ALTER TABLE public.pathway_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pathway progress"
  ON public.pathway_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pathway progress"
  ON public.pathway_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pathway progress"
  ON public.pathway_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pathway progress"
  ON public.pathway_progress
  FOR DELETE USING (auth.uid() = user_id);

-- Auto-update updated_at on change
CREATE TRIGGER handle_pathway_progress_updated_at
  BEFORE UPDATE ON public.pathway_progress
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
