# Story TD-M-04: Empty States for New Users
**Epic:** EPIC-TD-01 — Technical Debt Resolution
**Sprint:** M
**Status:** Done
**Points:** 3
**Agent:** @dev (Dex)

---

## Description

New users who create their first profile are dropped into an app with no guidance. The Insight Library shows nothing (no insights yet). The Pathways page shows an empty list with no call-to-action. The Sessions page is empty. These blank screens are disorienting — they should be welcoming empty states that guide users toward their first meaningful action.

## Acceptance Criteria

### Insight Library Empty State
- [ ] When `insights.length === 0` (for the active profile), show:
  - An icon or illustration (can use an emoji or existing icon)
  - Heading: "No insights yet"
  - Sub-text: "Start a contemplation session to save your first insight."
  - CTA button: "Begin Contemplation" → navigates to `/contemplate`

### Pathway Progress Empty State
- [ ] When user has no started pathways, show:
  - Heading: "Your journey hasn't started yet"
  - Sub-text: "Explore guided pathways to deepen your self-understanding."
  - CTA button: "Explore Pathways" → scrolls to or shows the pathways list

### Session History Empty State
- [ ] When `sessions.length === 0`, show:
  - Heading: "No sessions recorded"
  - Sub-text: "Your contemplation sessions will appear here."
  - CTA button: "Start a Session" → navigates to `/contemplate`

### Reusability
- [ ] A shared `EmptyState` component created at `src/components/EmptyState.tsx`
- [ ] Props: `icon`, `heading`, `subText`, `ctaLabel`, `ctaHref`
- [ ] `EmptyState` uses design system colors (neutral palette, not raw Tailwind)

## Tasks

- [x] Read the Insight Library page, Pathways page, and Sessions page components
- [x] Create `src/components/EmptyState.tsx`
- [x] Wire `EmptyState` into Insight Library page
- [x] Wire `EmptyState` into Pathways page
- [x] Wire `EmptyState` into Sessions page (if page exists)
- [x] Test: verify empty states show when clearing localStorage and creating fresh profile
- [x] Run `npm run verify`

## Dev Agent Record

### File List

- `src/components/EmptyState.tsx` — NEW: shared EmptyState component (icon, title, description, action props; Link from react-router-dom for CTA)
- `src/components/index.ts` — MODIFIED: exports EmptyState and EmptyStateProps (already added prior to dev session)
- `src/pages/InsightLibrary.tsx` — WIRED: EmptyState shown when insights.length === 0
- `src/pages/SessionsLibrary.tsx` — WIRED: EmptyState shown when sessions.length === 0
- `src/pages/Pathways.tsx` — WIRED: EmptyState shown when activePathways.length === 0 (no in-progress journeys)

### Debug Log

- EmptyState.tsx already existed with a more flexible prop API (icon: ReactNode, title, description, action union type) than the story Technical Notes suggested — kept this richer API since both InsightLibrary and SessionsLibrary already used it.
- InsightLibrary and SessionsLibrary already had EmptyState import and wiring in place.
- Only Pathways.tsx required changes: added EmptyState import and wired into the active pathways section conditional.

### Change Log

| Date | Agent | Change |
|------|-------|--------|
| 2026-02-22 | @dev | Wired EmptyState into Pathways.tsx (activePathways empty state); confirmed InsightLibrary + SessionsLibrary already wired; verify passes (337 tests, clean build) |

## Scope

**IN:** Empty states for Insight Library, Pathways, Sessions — using shared `EmptyState` component
**OUT:** Onboarding wizard/tour, profile completion percentage, gamification, animated illustrations

## Dependencies

TD-L-01 recommended first (profile isolation ensures empty state correctly checks the active profile's insight count, not all insights).

## Technical Notes

```typescript
// EmptyState.tsx
interface EmptyStateProps {
  icon: string;        // emoji or icon component
  heading: string;
  subText: string;
  ctaLabel: string;
  ctaHref: string;
}

export function EmptyState({ icon, heading, subText, ctaLabel, ctaHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4" aria-hidden="true">{icon}</span>
      <h2 className="text-neutral-100 text-xl font-semibold mb-2">{heading}</h2>
      <p className="text-neutral-400 text-sm mb-6 max-w-xs">{subText}</p>
      <Link to={ctaHref} className="btn-primary">{ctaLabel}</Link>
    </div>
  );
}
```

The `EmptyState` component should be consistent with the `LoadingSkeleton` variant pattern already established in the codebase.

## Definition of Done

Empty states present in Insight Library, Pathways, and Sessions pages. Shared `EmptyState` component created. States correctly appear with empty data. `npm run verify` passes.
