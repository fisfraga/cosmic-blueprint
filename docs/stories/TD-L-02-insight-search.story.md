# Story TD-L-02: Full-Text Search for Insight Library
**Epic:** EPIC-TD-01 — Technical Debt Resolution
**Sprint:** L
**Status:** Ready
**Points:** 5
**Agent:** @dev (Dex)

---

## Description

The Insight Library has no search capability. Users who have been on their contemplation journey for months accumulate dozens or hundreds of insights — finding a specific one requires scrolling through the entire list. This story adds a search bar that filters insights by content, entity name, and contemplation type in real time.

This is a pure frontend feature: localStorage is the primary store, so search is client-side filtering. Supabase-side full-text search is documented as a future enhancement.

## Acceptance Criteria

- [x] A search input is visible at the top of the Insight Library page
- [x] Typing in the search input filters insights in real time (no debounce needed for <200 items)
- [x] Search matches against: insight content text, entity name, contemplation type
- [x] Search is case-insensitive
- [x] Empty search shows all insights (no filter)
- [x] "No results" state shown with helpful text when search yields no matches
- [x] Search is combined with existing filters (by tradition, date range if implemented) using AND logic
- [x] Search input is cleared by pressing Escape or clicking an X button
- [x] Search state is NOT persisted (clears on page reload)

## Tasks

- [x] Read the current Insight Library page component
- [x] Read `src/services/insights.ts` to understand the insight data shape
- [x] Add a `SearchInput` component or reuse an existing input component
- [x] Implement client-side filter function: `filterInsights(insights, query)`
- [x] Wire up filter to rendered insight list
- [x] Add "no results" empty state
- [x] Add Escape key handler to clear search
- [x] Run `npm run verify`

## Scope

**IN:** Client-side search on Insight Library page, search UI, no-results state
**OUT:** Supabase full-text search (tsvector indexing), search on Session Library (separate story), URL-persisted search state

## Dependencies

TD-L-01 recommended first (profile isolation ensures search operates within correct profile scope).

## Technical Notes

- The filter function should be a pure utility: `(insights: SavedInsight[], query: string) => SavedInsight[]`
- `useMemo` the filtered list to avoid recalculating on every render
- The search input should have `aria-label="Search insights"` and `role="search"` on the containing element
- Match logic: `insight.content.toLowerCase().includes(query.toLowerCase())` OR entity/type match

## Definition of Done

Search input on Insight Library filters insights in real time. No-results state present. `npm run verify` passes.

---

## Dev Agent Record

**Agent:** @dev (Dex)
**Completed:** 2026-02-22

### Implementation Summary

All search logic was implemented directly in `src/pages/InsightLibrary.tsx` — no new files created.

**Changes made to `src/pages/InsightLibrary.tsx`:**

- `searchQuery` state (`useState<string>('')`) and `searchInputRef` (`useRef<HTMLInputElement>`) added at the top of the component
- `filtered` useMemo combines category filter AND search: trims + lowercases query, matches against `content`, `focusEntity` (the `SavedInsight` field corresponding to entity name), and `contemplationType`; returns all insights when query is empty
- `counts` useMemo recalculates per-tab counts against the search-filtered subset so filter pill numbers stay accurate while the user types
- Search input UI placed above the FilterBar inside the `insights.length > 0` branch: `role="search"` wrapper, SVG magnifier icon (pointer-events-none), `aria-label="Search insights"`, Escape key handler that clears and blurs, and a conditional X button (SVG × icon with `aria-label="Clear search"`) that restores focus to the input
- No-results state: when `filtered.length === 0` and `insights.length > 0`, shows a contextual message — includes the active category name when a category filter is also active (e.g. "No insights matching "sun" in Astrology.")
- The original `EmptyState` ("No insights saved yet") is shown only when `insights.length === 0`, preserving the correct distinction between zero insights vs zero results

**Key decisions:**
- Matched against `focusEntity` (not `entityName`) — this is the actual field on `SavedInsight`; the story spec used "entityName" as a conceptual label
- No debounce added per spec ("no debounce needed for <200 items")
- Search state is session-only (`useState`) — not persisted to localStorage or URL

### Verify Result

`npm run verify` — 337 tests passed, clean TypeScript build.
