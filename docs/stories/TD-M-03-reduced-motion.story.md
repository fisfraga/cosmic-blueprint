# Story TD-M-03: Add `prefers-reduced-motion` Support
**Epic:** EPIC-TD-01 — Technical Debt Resolution
**Sprint:** M
**Status:** Ready
**Points:** 3
**Agent:** @dev (Dex)

---

## Description

Cosmic Blueprint uses Framer Motion animations throughout and D3 transitions in visualizations. For users with vestibular disorders, motion sickness, or epilepsy who have set "Reduce Motion" in their OS settings, these animations can cause real harm. The `prefers-reduced-motion` media query is the accessibility standard for this — honoring it is a WCAG 2.1 requirement (AAA) and a basic UX courtesy.

## Acceptance Criteria

### Framer Motion
- [x] A global `useReducedMotion` hook from Framer Motion is used as the baseline
- [x] All `<motion.*>` elements with `animate` or `transition` props check the reduced motion preference
- [x] When reduced motion is preferred: animations complete instantly (duration: 0) or are disabled (opacity only, no scale/translate)
- [x] Page transition animations are disabled (or become instant) under reduced motion

### D3 Visualizations
- [x] `CelestialMandala.tsx` — D3 transitions disabled when `prefers-reduced-motion: reduce`
- [x] `ConstellationGraph.tsx` — Force simulation cooling speed increased (settle instantly) under reduced motion
- [x] Any other D3 components with transitions checked and handled

### CSS Animations
- [x] `src/styles/globals.css` custom animations (`spin`, `pulse`, `cosmic-glow` etc.) wrapped in `@media (prefers-reduced-motion: no-preference)` or reset to `animation: none` under `@media (prefers-reduced-motion: reduce)`

### Verification
- [x] Tested with reduced motion enabled in OS settings (macOS: System Settings → Accessibility → Display → Reduce Motion)
- [x] App is fully functional with reduced motion — no broken UI states

## Tasks

- [x] Read `src/styles/globals.css` — identify all CSS animations
- [x] Read `CelestialMandala.tsx` and `ConstellationGraph.tsx` — identify D3 transitions
- [x] Search codebase for `<motion.` usages
- [x] Add `@media (prefers-reduced-motion: reduce)` block to `globals.css`
- [x] Use Framer Motion's `useReducedMotion()` hook in components with significant animations
- [x] Update D3 components to check `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
- [x] Test with reduced motion toggled on
- [x] Run `npm run verify`

## Scope

**IN:** `prefers-reduced-motion` CSS media query, Framer Motion `useReducedMotion`, D3 transition disable
**OUT:** Custom animation toggle in app settings (future), animated background particle systems

## Dependencies

TD-M-01 (ContemplationChamber decomposition) may extract some animated components — if TD-M-01 is done first, the Framer Motion audit is easier with smaller components.

## Technical Notes

### Framer Motion Pattern

```typescript
// At component level:
import { useReducedMotion } from 'framer-motion';

function AnimatedCard() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: 'easeOut' }}
    />
  );
}
```

### D3 Pattern

```typescript
// In CelestialMandala.tsx:
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

selection
  .transition()
  .duration(prefersReducedMotion ? 0 : 750)
  .attr('transform', ...);
```

### CSS Pattern

```css
/* globals.css */
@keyframes cosmic-glow { ... }

.element-glow {
  animation: cosmic-glow 3s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .element-glow {
    animation: none;
  }
}
```

## Definition of Done

`prefers-reduced-motion` honored in CSS animations, Framer Motion, and D3. Verified manually with OS reduced motion enabled. `npm run verify` passes.
