# Story TD-K-06: Quick Wins Batch
**Epic:** EPIC-TD-01 — Technical Debt Resolution
**Sprint:** K
**Status:** InProgress
**Points:** 5
**Agent:** @dev (Dex)

---

## Description

10 high-value, low-effort improvements identified in the Brownfield Discovery. None requires more than 2 hours individually. Bundled into a single story for efficient execution.

## Acceptance Criteria

### UX-04: Skip Navigation Link
- [x] A visually hidden "Skip to main content" link is the first focusable element in `Layout.tsx`
- [x] It becomes visible on keyboard focus
- [x] It links to `#main-content` anchor on the page content area

### UX-ADD-01: Profile Deletion Confirmation
- [x] Deleting a profile shows a confirmation modal before deletion
- [x] Modal text: "Delete [name]'s profile? This cannot be undone."
- [x] Modal has "Cancel" and "Delete Profile" (destructive, red) buttons

### UX-08: Route Suspense Skeleton
- [x] `<PageLoader>` in `App.tsx` replaced with `<LoadingSkeleton variant="page" />`
- [x] Lazy route loading shows skeleton instead of plain "Loading..."

### UX-15: Remove Dead Nav Items
- [x] 4 "Coming Soon" nav items in `Layout.tsx` removed or replaced with proper placeholders
- [x] No nav links point to `href="#"`

### UX-12: Home.tsx Design System Fix
- [x] Astrology tradition card in `Home.tsx` uses `air-*` colors instead of raw `blue-500`
- [x] No raw Tailwind color classes used where design system equivalents exist

### UX-17: Emoji Icons aria-hidden
- [x] All emoji used as decorative nav icons in `Layout.tsx` have `aria-hidden="true"`
- [x] Screen readers skip decorative icons

### DB-DI-03: Pathway Timestamp Defaults
- [x] Migration `004_pathway_timestamp_defaults.sql` created:
  ```sql
  ALTER TABLE public.pathway_progress
    ALTER COLUMN started_at SET DEFAULT NOW(),
    ALTER COLUMN last_activity_at SET DEFAULT NOW();
  ```
- [ ] Migration instructions documented in `supabase/docs/SCHEMA.md` — no SCHEMA.md exists yet, documented in migration file header

### DB-IDX-01: Insight Category/Type Indexes
- [x] Migration `005_insight_indexes.sql` created with category and type indexes on `saved_insights`
- [ ] Migration documented — documented in migration file header

### SYS-01: Remove Dead Zustand Dependency
- [x] Verify Zustand is not imported anywhere: `grep -r "zustand" src/`
- [x] Remove from `package.json` dependencies
- [x] Run `npm install` and verify build passes

### SYS-06: Add `.env.example`
- [x] `.env.example` created at project root with all documented variables:
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
- [x] `.env.example` added to git (not `.env`) — already existed, updated with missing app variables

## Tasks

- [x] Read `Layout.tsx` before editing
- [x] Read `Home.tsx` before editing
- [x] Read `App.tsx` before editing
- [x] Implement all 10 items above
- [x] Run `npm run verify` — all tests pass, build succeeds
- [x] Run `npm run lint` — no errors

## Scope

**IN:** All 10 items listed above
**OUT:** Any items requiring >2h or deeper architectural changes

## Dependencies

None — all items are independent.

## Definition of Done

All 10 quick wins implemented. `npm run verify` passes. No regressions.

---

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log
- 10 quick wins implemented in one batch
- `.env.example` already existed (AIOS-level) — added missing Cosmic Blueprint app variables (VITE_ASTROLOGY_API_ENABLED, FREEASTRO_API_KEY, VITE_APP_URL, RATE_LIMIT_MAX)
- Zustand confirmed unused in src/ — only in package.json. Removed cleanly.
- `supabase/docs/SCHEMA.md` does not exist — migration documentation placed in SQL file headers instead
- ProfileSelector refactored: each profile row now a div with switch button + delete button, delete triggers confirmation modal overlay
- aria-hidden applied to all emoji icon spans in Layout.tsx (NavDropdown, LibraryDropdown, mobile nav, mobile menu)
- learnItems array + Learn dropdown + Learn mobile section fully removed (4 dead `#` links eliminated)

### File List
| File | Action |
|------|--------|
| `src/components/Layout.tsx` | Modified — skip nav, id="main-content", removed Learn section, aria-hidden on icons |
| `src/pages/Home.tsx` | Modified — blue-* → air-* design system colors for astrology |
| `src/App.tsx` | Modified — PageLoader → LoadingSkeleton |
| `src/components/ProfileSelector.tsx` | Modified — delete button + confirmation modal |
| `package.json` | Modified — removed zustand dependency |
| `.env.example` | Modified — added VITE_ASTROLOGY_API_ENABLED, FREEASTRO_API_KEY, VITE_APP_URL, RATE_LIMIT_MAX |
| `supabase/migrations/004_pathway_timestamp_defaults.sql` | Created |
| `supabase/migrations/005_insight_indexes.sql` | Created |

### Change Log
- 2026-02-20: @dev (Dex) — Implemented all 10 quick wins in batch: skip nav, profile delete modal, skeleton loader, dead nav removal, design system colors, aria-hidden, DB migrations, zustand removal, env example update
