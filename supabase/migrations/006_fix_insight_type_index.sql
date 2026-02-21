-- Migration: 006_fix_insight_type_index
-- Fix CRIT-03: Migration 005 created index on non-existent column 'type'.
-- The actual column name is 'contemplation_type'.

DROP INDEX IF EXISTS idx_saved_insights_type;

CREATE INDEX IF NOT EXISTS idx_saved_insights_contemplation_type
  ON public.saved_insights (contemplation_type);
