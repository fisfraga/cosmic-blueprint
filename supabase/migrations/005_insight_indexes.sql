-- Migration: 005_insight_indexes
-- Add indexes on saved_insights for faster filtering by category and type.

CREATE INDEX IF NOT EXISTS idx_saved_insights_category
  ON public.saved_insights (category);

CREATE INDEX IF NOT EXISTS idx_saved_insights_type
  ON public.saved_insights (type);
