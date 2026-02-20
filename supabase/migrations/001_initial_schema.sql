-- ============================================================
-- Cosmic Blueprint — Initial Supabase Schema
-- Run this in your Supabase SQL Editor to set up the database
-- ============================================================

-- ============================================================
-- 1. SAVED INSIGHTS
-- Stores contemplation insights synced from the app
-- ============================================================
CREATE TABLE IF NOT EXISTS public.saved_insights (
  id            TEXT        PRIMARY KEY,
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content       TEXT        NOT NULL,
  category      TEXT        NOT NULL,
  contemplation_type TEXT   NOT NULL,
  tags          TEXT[]      NOT NULL DEFAULT '{}',
  session_id    TEXT,
  focus_entity  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast user queries
CREATE INDEX IF NOT EXISTS idx_saved_insights_user_id
  ON public.saved_insights(user_id);

-- Index for chronological ordering
CREATE INDEX IF NOT EXISTS idx_saved_insights_created_at
  ON public.saved_insights(user_id, created_at DESC);

-- Row Level Security: users can only see their own insights
ALTER TABLE public.saved_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own insights"
  ON public.saved_insights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own insights"
  ON public.saved_insights
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own insights"
  ON public.saved_insights
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own insights"
  ON public.saved_insights
  FOR UPDATE USING (auth.uid() = user_id);


-- ============================================================
-- 2. COSMIC PROFILES
-- Stores user-created cosmic profiles (birth data + calculated charts)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cosmic_profiles (
  id            TEXT        PRIMARY KEY,
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT        NOT NULL,
  profile_data  JSONB       NOT NULL,
  is_active     BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast user queries
CREATE INDEX IF NOT EXISTS idx_cosmic_profiles_user_id
  ON public.cosmic_profiles(user_id);

-- Only one active profile per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_cosmic_profiles_active_user
  ON public.cosmic_profiles(user_id)
  WHERE is_active = TRUE;

-- Row Level Security: users can only see their own profiles
ALTER TABLE public.cosmic_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profiles"
  ON public.cosmic_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profiles"
  ON public.cosmic_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profiles"
  ON public.cosmic_profiles
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profiles"
  ON public.cosmic_profiles
  FOR UPDATE USING (auth.uid() = user_id);


-- ============================================================
-- Helper function: automatically update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_saved_insights_updated_at
  BEFORE UPDATE ON public.saved_insights
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_cosmic_profiles_updated_at
  BEFORE UPDATE ON public.cosmic_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
