-- Migration 003: Contemplation Sessions
-- Stores full AI conversation history with the seeker's contemplation context.
-- Messages and focus_entity stored as JSONB for schema flexibility.

CREATE TABLE IF NOT EXISTS contemplation_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  contemplation_type TEXT NOT NULL,
  focus_entity JSONB,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contemplation_sessions_user_id
  ON contemplation_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_contemplation_sessions_updated_at
  ON contemplation_sessions(user_id, updated_at DESC);

-- Row Level Security
ALTER TABLE contemplation_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own sessions"
  ON contemplation_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
  ON contemplation_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON contemplation_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
  ON contemplation_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update updated_at timestamp (reuses handle_updated_at from migration 001)
CREATE TRIGGER handle_contemplation_sessions_updated_at
  BEFORE UPDATE ON contemplation_sessions
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
