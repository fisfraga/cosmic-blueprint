# Story TD-N-04: WCAG Contrast Audit and Fixes
**Epic:** EPIC-TD-01 — Technical Debt Resolution
**Sprint:** N
**Status:** Ready
**Points:** 5
**Agent:** @dev (Dex)

---

## Description

Cosmic Blueprint uses a rich, dark-themed design system with 11 color scales. Dark themes are particularly susceptible to contrast failures between similar dark shades (e.g., `neutral-700` text on `neutral-800` backgrounds). WCAG 2.1 Level AA requires 4.5:1 contrast ratio for normal text and 3:1 for large text and UI components.

This story audits all color combinations used in the app and fixes any that fail WCAG AA.

## Acceptance Criteria

### Audit
- [ ] All text/background combinations in `tailwind.config.js` color scales documented with contrast ratios
- [ ] Every combination in active use across the app checked against WCAG AA (4.5:1 for text, 3:1 for UI)
- [ ] Audit report: `docs/qa/wcag-contrast-audit.md` listing pass/fail for each combination

### Fixes
- [ ] All failing text/background combinations fixed by adjusting the lighter or darker shade
- [ ] Minimum: fix all text at 16px and smaller (normal weight) — these require 4.5:1
- [ ] Fix: element color scales (fire, earth, air, water, humandesign, genekey) — ensure text variants are accessible on their respective backgrounds
- [ ] Placeholder text (inputs) meets at least 3:1 (WCAG 1.4.3 exception applies)
- [ ] No raw color overrides introduced — all fixes through the design token system (tailwind.config.js)
- [ ] `EntityCard` component passes contrast check across all 4 tradition color schemes

### Verification
- [ ] Run axe DevTools browser extension on 5 key pages after fixes
- [ ] Zero WCAG AA contrast failures on: Home, Profile, Contemplation, Insight Library, Entity detail pages

## Tasks

- [ ] Read `tailwind.config.js` fully — extract all color values
- [ ] Read `src/styles/colors.ts` — understand the semantic token layer
- [ ] List all text/background pairings in current use (can use grep for `text-` + `bg-` class combinations)
- [ ] Calculate contrast ratios for each pairing (use online tool: webaim.org/resources/contrastchecker/)
- [ ] Create `docs/qa/wcag-contrast-audit.md` with results
- [ ] Fix failing pairings by adjusting shade values in `tailwind.config.js`
- [ ] Visually verify design still looks correct after fixes (dark theme should not become too light)
- [ ] Run axe DevTools on key pages
- [ ] Run `npm run verify`

## Scope

**IN:** Text contrast audit, element color scale contrast fixes, axe validation
**OUT:** Color blindness simulation, Windows High Contrast mode, forced-colors media query, icon-only button labels (TD-K-06 handles aria-hidden for decorative icons)

## Dependencies

TD-K-06 recommended first (removes dead nav items, cleaning up the UI before auditing). TD-N-02 (D3 accessibility) adds ARIA text that also needs contrast checking.

## Technical Notes

### Contrast Calculation Reference

For dark backgrounds (Hex `#0a0a0a` ~ neutral-950):
- White `#ffffff` on neutral-950: 21:1 ✓
- neutral-100 `#f5f5f5` on neutral-900: ~17:1 ✓
- neutral-400 `#a3a3a3` on neutral-900 `#171717`: ~5.3:1 ✓
- neutral-500 `#737373` on neutral-900: ~2.8:1 ✗ — FAILS

Common failure pattern in dark themes: `*-500` text on `*-900` background falls below 4.5:1.

### Fix Strategy

If `fire-500` fails on `fire-950` background: either darken text → `fire-400`, or lighten background → `fire-900`. Prefer darkening the text (moving to a lighter shade number) to maintain the dark atmosphere.

### Axe DevTools

Install: Chrome extension "axe DevTools" (Deque Systems). Run on a page → all contrast failures are listed with exact element selectors and the required vs. actual ratio.

### Priority Pages to Audit

1. Home page (tradition cards)
2. Entity detail page (EntityCard component)
3. Contemplation Chamber (chat bubbles, persona cards)
4. Profile page (placement tables)
5. Nav/Layout (sidebar and header)

## Definition of Done

WCAG contrast audit document created. All text/background failures fixed in design token system. Zero axe contrast errors on 5 priority pages. `npm run verify` passes.
