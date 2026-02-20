# Story TD-K-03: Global React Error Boundary
**Epic:** EPIC-TD-01 — Technical Debt Resolution
**Sprint:** K
**Status:** Ready
**Points:** 2
**Agent:** @dev (Dex)

---

## Description

`App.tsx` has no Error Boundary. If any React component throws an unhandled runtime error (e.g., a null reference in a D3 visualization, a malformed profile object, an AI streaming error), the entire app crashes to a blank white screen with no feedback to the user.

This story adds a top-level Error Boundary that catches component errors, displays a user-friendly recovery screen, and preserves the ability to navigate away.

## Acceptance Criteria

- [ ] A global `ErrorBoundary` component wraps the `App` content in `App.tsx`
- [ ] When a component throws, users see a recovery screen (not a blank page)
- [ ] Recovery screen includes: error message summary, "Reload page" button, "Go to Home" link
- [ ] Error is logged to console with full stack trace
- [ ] Error Boundary does NOT catch: async errors outside render, event handler errors (document these as known limitations)
- [ ] Existing app functionality is unaffected (no regressions)

## Tasks

- [ ] Create `src/components/ErrorBoundary.tsx` as a class component (React Error Boundaries must be class components)
- [ ] Implement `componentDidCatch` for error logging
- [ ] Design recovery UI matching the dark theme (neutral-900 bg, white text, brand styling)
- [ ] Wrap `<Suspense>` in `App.tsx` with `<ErrorBoundary>`
- [ ] Write a test: manually throw inside a test component, verify ErrorBoundary catches it
- [ ] Document known limitations (async errors, event handlers)

## Scope

**IN:** Class-based ErrorBoundary component, App.tsx integration, recovery UI
**OUT:** Error reporting service (Sentry etc.) — future story, route-level boundaries (future)

## Dependencies

None — independent.

## Definition of Done

App shows a recovery screen instead of blank page when a component throws. Verified by test.
