# Story TD-M-02: Decompose `Profile.tsx`
**Epic:** EPIC-TD-01 — Technical Debt Resolution
**Sprint:** M
**Status:** Ready
**Points:** 8
**Agent:** @dev (Dex)

---

## Description

`Profile.tsx` is 1,202 lines — the second God component in Cosmic Blueprint. It renders the entire profile hub: profile switcher, astrology summary, Human Design summary, Gene Keys summary, and profile management (edit, delete). A component this large makes it impossible to add profile features without risk of breaking unrelated sections.

This story decomposes it into focused sub-components organized by tradition tab.

## Acceptance Criteria

### Component Architecture
- [ ] `Profile.tsx` reduced to ≤300 lines — acts as layout/tab orchestrator
- [ ] Extracted components:
  - [ ] `src/components/profile/ProfileHeader.tsx` — Active profile name, switch button, points/edit controls
  - [ ] `src/components/profile/AstrologyTab.tsx` — Big 4, planetary table, house summary
  - [ ] `src/components/profile/HumanDesignTab.tsx` — Type, strategy, authority, defined centers, profile line
  - [ ] `src/components/profile/GeneKeysTab.tsx` — Activation sequence spheres, shadow/gift/siddhi summary
  - [ ] `src/components/profile/NumerologyTab.tsx` — Life path, expression, soul urge cards
- [ ] Profile data flows down via props from `Profile.tsx` — no direct `useProfile()` calls inside sub-components
- [ ] Existing `/profile/astrology`, `/profile/human-design`, `/profile/gene-keys` routes remain functional

### Functional Parity
- [ ] Profile switching still works
- [ ] Profile editing still works
- [ ] Profile deletion (with TD-K-06 confirmation modal) still works
- [ ] All sub-page routes (`/profile/astrology/placements/:planetId` etc.) still resolve

### Tests
- [ ] Render test for `ProfileHeader` — verify profile name displayed
- [ ] Render test for `AstrologyTab` — verify planet table renders

## Tasks

- [ ] Read `src/components/Profile.tsx` completely
- [ ] Read `src/App.tsx` to understand profile sub-routes
- [ ] Map all state and props in Profile.tsx
- [ ] Identify tab boundaries — what JSX belongs to which section
- [ ] Extract `ProfileHeader` component
- [ ] Extract `AstrologyTab` component
- [ ] Extract `HumanDesignTab` component
- [ ] Extract `GeneKeysTab` component
- [ ] Extract `NumerologyTab` component if present
- [ ] Wire tabs back in `Profile.tsx` as orchestrator
- [ ] Test all sub-routes in dev mode
- [ ] Write render tests for Header and AstrologyTab
- [ ] Run `npm run verify`

## Scope

**IN:** `Profile.tsx` decomposition into 5 sub-components, render tests
**OUT:** Profile UI redesign, new profile fields, social sharing, print view

## Dependencies

TD-K-06 (profile deletion confirmation modal) — that modal should live in `ProfileHeader.tsx` after decomposition, so TD-K-06 should be done first.

TD-M-01 recommended first (demonstrates the decomposition pattern).

## Technical Notes

### Tab Architecture Pattern

```typescript
// Profile.tsx (orchestrator)
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>...</TabsList>
  <TabsContent value="astrology">
    <AstrologyTab profile={cosmicProfile} />
  </TabsContent>
  <TabsContent value="human-design">
    <HumanDesignTab profile={cosmicProfile} />
  </TabsContent>
  {/* etc. */}
</Tabs>
```

### Props Contract

Each tab component should receive `profile: CosmicProfile` (or the relevant tradition slice) as its only required prop. This makes them testable in isolation.

### Route Preservation

Sub-routes like `/profile/astrology/placements/:planetId` are defined in `App.tsx` as children of the `/profile` route — they should not be affected by this decomposition as long as `Profile.tsx` still renders `<Outlet>` or the sub-routes point to their own page components.

## Definition of Done

`Profile.tsx` ≤300 lines. 5 sub-components extracted. All profile routes functional. Render tests pass. `npm run verify` passes.
