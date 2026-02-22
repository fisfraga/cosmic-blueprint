# Story TD-K-03: Global React Error Boundary
**Epic:** EPIC-TD-01 — Technical Debt Resolution
**Sprint:** K
**Status:** Done
**Points:** 2
**Agent:** @dev (Dex)

---

## Description

`App.tsx` has no Error Boundary. If any React component throws an unhandled runtime error (e.g., a null reference in a D3 visualization, a malformed profile object, an AI streaming error), the entire app crashes to a blank white screen with no feedback to the user.

This story adds a top-level Error Boundary that catches component errors, displays a user-friendly recovery screen, and preserves the ability to navigate away.

## Acceptance Criteria

- [x] A global `ErrorBoundary` component wraps the `App` content in `App.tsx`
- [x] When a component throws, users see a recovery screen (not a blank page)
- [x] Recovery screen includes: error message summary, "Reload page" button, "Go to Home" link
- [x] Error is logged to console with full stack trace
- [x] Error Boundary does NOT catch: async errors outside render, event handler errors (document these as known limitations)
- [x] Existing app functionality is unaffected (no regressions)

## Tasks

- [x] Create `src/components/ErrorBoundary.tsx` as a class component (React Error Boundaries must be class components)
- [x] Implement `componentDidCatch` for error logging
- [x] Design recovery UI matching the dark theme (neutral-900 bg, white text, brand styling)
- [x] Wrap `<Suspense>` in `App.tsx` with `<ErrorBoundary>`
- [x] Write a test: manually throw inside a test component, verify ErrorBoundary catches it
- [x] Document known limitations (async errors, event handlers)

## Scope

**IN:** Class-based ErrorBoundary component, App.tsx integration, recovery UI
**OUT:** Error reporting service (Sentry etc.) — future story, route-level boundaries (future)

## Dependencies

None — independent.

## Definition of Done

App shows a recovery screen instead of blank page when a component throws. Verified by test.

---

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log
- Created class-based ErrorBoundary with getDerivedStateFromError + componentDidCatch
- Recovery UI: dark theme (neutral-900), centered card with error message, "Reload page" button, "Go to Home" link
- Wrapped outermost level in App.tsx (outside AuthProvider/ProfileProvider/BrowserRouter)
- Known limitations documented as HTML comment in component: async errors and event handler errors not caught
- 3 tests: renders children normally, catches throw with recovery UI, logs to console

### File List
| File | Action |
|------|--------|
| `src/components/ErrorBoundary.tsx` | Created — class-based error boundary |
| `src/components/ErrorBoundary.test.tsx` | Created — 3 tests |
| `src/components/index.ts` | Modified — added ErrorBoundary export |
| `src/App.tsx` | Modified — wrapped app content with ErrorBoundary |

### Change Log
- 2026-02-20: @dev (Dex) — Created ErrorBoundary component, integrated in App.tsx, 3 passing tests
