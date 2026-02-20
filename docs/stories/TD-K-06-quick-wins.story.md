# Story TD-K-06: Quick Wins Batch
**Epic:** EPIC-TD-01 — Technical Debt Resolution
**Sprint:** K
**Status:** Ready
**Points:** 5
**Agent:** @dev (Dex)

---

## Description

10 high-value, low-effort improvements identified in the Brownfield Discovery. None requires more than 2 hours individually. Bundled into a single story for efficient execution.

## Acceptance Criteria

### UX-04: Skip Navigation Link
- [ ] A visually hidden "Skip to main content" link is the first focusable element in `Layout.tsx`
- [ ] It becomes visible on keyboard focus
- [ ] It links to `#main-content` anchor on the page content area

### UX-ADD-01: Profile Deletion Confirmation
- [ ] Deleting a profile shows a confirmation modal before deletion
- [ ] Modal text: "Delete [name]'s profile? This cannot be undone."
- [ ] Modal has "Cancel" and "Delete Profile" (destructive, red) buttons

### UX-08: Route Suspense Skeleton
- [ ] `<PageLoader>` in `App.tsx` replaced with `<LoadingSkeleton variant="page" />`
- [ ] Lazy route loading shows skeleton instead of plain "Loading..."

### UX-15: Remove Dead Nav Items
- [ ] 4 "Coming Soon" nav items in `Layout.tsx` removed or replaced with proper placeholders
- [ ] No nav links point to `href="#"`

### UX-12: Home.tsx Design System Fix
- [ ] Astrology tradition card in `Home.tsx` uses `air-*` colors instead of raw `blue-500`
- [ ] No raw Tailwind color classes used where design system equivalents exist

### UX-17: Emoji Icons aria-hidden
- [ ] All emoji used as decorative nav icons in `Layout.tsx` have `aria-hidden="true"`
- [ ] Screen readers skip decorative icons

### DB-DI-03: Pathway Timestamp Defaults
- [ ] Migration `004_pathway_timestamp_defaults.sql` created:
  ```sql
  ALTER TABLE public.pathway_progress
    ALTER COLUMN started_at SET DEFAULT NOW(),
    ALTER COLUMN last_activity_at SET DEFAULT NOW();
  ```
- [ ] Migration instructions documented in `supabase/docs/SCHEMA.md`

### DB-IDX-01: Insight Category/Type Indexes
- [ ] Migration `005_insight_indexes.sql` created with category and type indexes on `saved_insights`
- [ ] Migration documented

### SYS-01: Remove Dead Zustand Dependency
- [ ] Verify Zustand is not imported anywhere: `grep -r "zustand" src/`
- [ ] Remove from `package.json` dependencies
- [ ] Run `npm install` and verify build passes

### SYS-06: Add `.env.example`
- [ ] `.env.example` created at project root with all documented variables:
  ```
  # Required for AI contemplation (dev only — never use VITE_ prefix for ANTHROPIC_API_KEY)
  OPENROUTER_API_KEY=your_key_here

  # Optional — Supabase cloud sync
  VITE_SUPABASE_URL=
  VITE_SUPABASE_ANON_KEY=

  # Optional — FreeAstroAPI for natal chart data
  VITE_ASTROLOGY_API_ENABLED=false
  FREEASTRO_API_KEY=
  ```
- [ ] `.env.example` added to git (not `.env`)

## Tasks

- [ ] Read `Layout.tsx` before editing
- [ ] Read `Home.tsx` before editing
- [ ] Read `App.tsx` before editing
- [ ] Implement all 10 items above
- [ ] Run `npm run verify` — all tests pass, build succeeds
- [ ] Run `npm run lint` — no errors

## Scope

**IN:** All 10 items listed above
**OUT:** Any items requiring >2h or deeper architectural changes

## Dependencies

None — all items are independent.

## Definition of Done

All 10 quick wins implemented. `npm run verify` passes. No regressions.
