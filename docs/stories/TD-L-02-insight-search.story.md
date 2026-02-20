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

- [ ] A search input is visible at the top of the Insight Library page
- [ ] Typing in the search input filters insights in real time (no debounce needed for <200 items)
- [ ] Search matches against: insight content text, entity name, contemplation type
- [ ] Search is case-insensitive
- [ ] Empty search shows all insights (no filter)
- [ ] "No results" state shown with helpful text when search yields no matches
- [ ] Search is combined with existing filters (by tradition, date range if implemented) using AND logic
- [ ] Search input is cleared by pressing Escape or clicking an X button
- [ ] Search state is NOT persisted (clears on page reload)

## Tasks

- [ ] Read the current Insight Library page component
- [ ] Read `src/services/insights.ts` to understand the insight data shape
- [ ] Add a `SearchInput` component or reuse an existing input component
- [ ] Implement client-side filter function: `filterInsights(insights, query)`
- [ ] Wire up filter to rendered insight list
- [ ] Add "no results" empty state
- [ ] Add Escape key handler to clear search
- [ ] Run `npm run verify`

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
