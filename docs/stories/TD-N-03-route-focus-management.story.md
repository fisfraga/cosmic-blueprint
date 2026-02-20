# Story TD-N-03: Route Change Focus Management
**Epic:** EPIC-TD-01 — Technical Debt Resolution
**Sprint:** N
**Status:** Ready
**Points:** 3
**Agent:** @dev (Dex)

---

## Description

When a user navigates between routes in a React SPA, the browser does not move focus to the new page content — it stays wherever it was (often a nav link). Screen reader users cannot tell that the page has changed. WCAG 2.4.3 requires focus order that preserves meaning, and focus returning to the top of new content on navigation is the established pattern.

This story adds route-change focus management: on every route transition, focus moves to the main content heading or a designated focus target.

## Acceptance Criteria

- [ ] On every route change, focus is moved to the page's main heading (`<h1>`) or a designated `#main-content` element
- [ ] Focus move happens after the new route renders (not before)
- [ ] A visually hidden `<div tabindex="-1" id="route-focus-target">` serves as the focus target when no `<h1>` is immediately available
- [ ] `aria-live="polite"` region announces the new page title to screen readers: "Navigated to [page title]"
- [ ] Focus ring is visible on the focused element (not suppressed by `outline: none` CSS)
- [ ] Browser back/forward navigation also triggers focus management
- [ ] All existing navigation functionality is preserved (no broken routes)

## Tasks

- [ ] Read `src/App.tsx` — understand route structure and how `<Outlet>` is used
- [ ] Read `src/components/Layout.tsx` — identify where `#main-content` anchor should live
- [ ] Implement `useFocusOnRouteChange()` hook in `src/hooks/useFocusOnRouteChange.ts`
- [ ] Wire hook in `Layout.tsx` using `useLocation()` from React Router
- [ ] Add `aria-live="polite"` announcement region to Layout
- [ ] Verify `#main-content` div is present (from TD-K-06 skip nav) — wire to focus target
- [ ] Test: keyboard-only navigation through 5 different routes
- [ ] Test with VoiceOver: verify page title is announced on navigation
- [ ] Run `npm run verify`

## Scope

**IN:** Route-change focus management, `aria-live` page announcement, focus hook
**OUT:** Page titles per route (separate story), animated page transitions and focus coordination, scroll-to-top on navigation

## Dependencies

TD-K-06 should be done first — it adds the `#main-content` anchor that this story relies on as the focus target.

## Technical Notes

### Focus Hook Pattern

```typescript
// src/hooks/useFocusOnRouteChange.ts
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function useFocusOnRouteChange() {
  const location = useLocation();
  const focusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Wait for render
    requestAnimationFrame(() => {
      // Try: main content area, then h1, then body
      const mainContent = document.getElementById('main-content');
      const h1 = document.querySelector('main h1') as HTMLElement | null;
      const target = mainContent || h1 || document.body;
      target.focus({ preventScroll: false });
    });
  }, [location.pathname]);

  return focusRef;
}
```

### Aria-Live Announcement

```tsx
// In Layout.tsx:
const location = useLocation();
const pageTitle = document.title; // or derive from route config

<div aria-live="polite" aria-atomic="true" className="sr-only">
  {`Navigated to ${pageTitle}`}
</div>
```

### CSS Note

Check that `globals.css` does not contain a global `* { outline: none }` or `*:focus { outline: none }` reset. Replace with `*:focus:not(:focus-visible) { outline: none }` to suppress mouse-click outlines while preserving keyboard focus rings.

## Definition of Done

Focus moves to main content on every route change. Screen reader announces navigation. Keyboard-only navigation is fully functional. `npm run verify` passes.
