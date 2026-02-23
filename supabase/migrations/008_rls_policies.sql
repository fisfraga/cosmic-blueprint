-- 008_rls_policies.sql
-- Row Level Security for cosmic_profiles
-- Users may only read/write their own profile rows
--
-- Idempotent: safe to re-apply. Each policy is wrapped in a DO block that
-- checks pg_policies before creating, so this can be run against a database
-- that already has the policies without error.

ALTER TABLE cosmic_profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'cosmic_profiles' AND policyname = 'Users can read own profiles'
  ) THEN
    CREATE POLICY "Users can read own profiles"
      ON cosmic_profiles FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'cosmic_profiles' AND policyname = 'Users can insert own profiles'
  ) THEN
    CREATE POLICY "Users can insert own profiles"
      ON cosmic_profiles FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'cosmic_profiles' AND policyname = 'Users can update own profiles'
  ) THEN
    CREATE POLICY "Users can update own profiles"
      ON cosmic_profiles FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'cosmic_profiles' AND policyname = 'Users can delete own profiles'
  ) THEN
    CREATE POLICY "Users can delete own profiles"
      ON cosmic_profiles FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;
