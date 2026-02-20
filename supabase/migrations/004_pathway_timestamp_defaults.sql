-- Migration: 004_pathway_timestamp_defaults
-- Set default timestamp values for pathway_progress columns
-- so new rows automatically get the current timestamp.

ALTER TABLE public.pathway_progress
  ALTER COLUMN started_at SET DEFAULT NOW(),
  ALTER COLUMN last_activity_at SET DEFAULT NOW();
