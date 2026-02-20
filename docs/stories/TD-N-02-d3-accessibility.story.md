# Story TD-N-02: D3 Visualizations — ARIA + Keyboard Navigation
**Epic:** EPIC-TD-01 — Technical Debt Resolution
**Sprint:** N
**Status:** Ready
**Points:** 13
**Agent:** @dev (Dex)

---

## Description

**CRITICAL ACCESSIBILITY DEBT (UX-02).** Cosmic Blueprint's four D3 visualizations — CelestialMandala (zodiac wheel), ConstellationGraph (relationship graph), ProfileBodyGraph (HD body graph), and CosmicWeatherWidget — are completely inaccessible to keyboard users and screen reader users. WCAG 2.1 Level AA requires non-text content to have text alternatives (1.1.1) and all functionality to be keyboard-accessible (2.1.1).

This story adds meaningful ARIA labels, keyboard navigation, and screen reader descriptions to all D3 visualizations.

## Acceptance Criteria

### CelestialMandala (Zodiac Wheel)
- [ ] SVG has `role="img"` and `aria-label="Zodiac wheel showing [name]'s planetary positions"`
- [ ] A `<title>` element inside the SVG provides a brief description
- [ ] A hidden `<desc>` lists all planetary positions as text: "Sun in Aries at 15°..."
- [ ] Each planet marker has `aria-label="[Planet] in [Sign] at [degree]°"`
- [ ] Keyboard: planets focusable via Tab key; focused planet shows tooltip/detail

### ConstellationGraph (Force Graph)
- [ ] SVG has `role="img"` and `aria-label="Relationship graph showing connections between [name]'s placements"`
- [ ] A visible "Skip visualization" link allows keyboard users to jump past it
- [ ] Hidden `<desc>` element describes the top 5 strongest connections
- [ ] Node keyboard focus: Tab navigates between nodes; Enter/Space activates (opens detail)
- [ ] `aria-live="polite"` announces which node is currently focused

### ProfileBodyGraph (HD Body Graph)
- [ ] SVG has `role="img"` and `aria-label="Human Design body graph for [name] — [Type], [Authority]"`
- [ ] Defined centers have `aria-label="[Center name] — Defined"` (filled)
- [ ] Undefined centers have `aria-label="[Center name] — Undefined"` (open)
- [ ] Active channels have `aria-label="Channel [Gate1]-[Gate2] active"`
- [ ] A hidden description block lists all defined centers and active channels as plain text

### CosmicWeatherWidget
- [ ] Container has `role="region"` and `aria-label="Current cosmic weather"`
- [ ] Each transit entry has `aria-label="[Planet] in [Sign] — [description]"`
- [ ] Moon phase has `aria-label="Moon: [phase name], [X]% illuminated"`

### General
- [ ] No visualization fails WCAG 1.1.1 (non-text content) or 2.1.1 (keyboard) at Level AA
- [ ] Tested with macOS VoiceOver: screen reader can comprehend each visualization

## Tasks

- [ ] Read `src/components/CelestialMandala.tsx`
- [ ] Read `src/components/ConstellationGraph.tsx`
- [ ] Read `src/components/ProfileBodyGraph.tsx`
- [ ] Read `src/components/CosmicWeatherWidget.tsx`
- [ ] Add ARIA roles, labels, and descriptions to CelestialMandala
- [ ] Add keyboard focus and Tab navigation to CelestialMandala planet markers
- [ ] Add ARIA roles and descriptions to ConstellationGraph
- [ ] Add keyboard navigation to ConstellationGraph nodes
- [ ] Add ARIA roles and labels to ProfileBodyGraph centers and channels
- [ ] Add ARIA roles and labels to CosmicWeatherWidget
- [ ] Test each visualization with keyboard only (Tab, Enter, Space, Arrow keys)
- [ ] Test with macOS VoiceOver (Cmd+F5 to enable)
- [ ] Run `npm run verify`

## Scope

**IN:** ARIA labels, keyboard navigation, screen reader descriptions for all 4 D3 visualizations
**OUT:** Mobile touch gestures, full WCAG AAA compliance, internationalization of ARIA text, animated ARIA announcements

## Dependencies

TD-M-03 (`prefers-reduced-motion`) recommended first — D3 transitions should already be motion-aware before adding focus/keyboard events to avoid animation interrupting focus.

## Technical Notes

### D3 Keyboard Focus Pattern

```typescript
// In D3 render function:
selection
  .attr('tabindex', 0)
  .attr('role', 'button')
  .attr('aria-label', d => `${d.planet} in ${d.sign} at ${d.degree}°`)
  .on('keydown', (event, d) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handlePlanetClick(d);
    }
  })
  .on('focus', (event, d) => {
    showTooltip(d);
  })
  .on('blur', () => {
    hideTooltip();
  });
```

### SVG Title + Desc Pattern

```typescript
// Inside SVG element:
svg.append('title').text(`Zodiac wheel — ${profile.name}'s natal chart`);
svg.append('desc').text(
  placements.map(p => `${p.planet} in ${p.sign} at ${p.degree}°`).join(', ')
);
```

### Skip Link Pattern

```tsx
// Above each heavy visualization:
<a href="#after-graph" className="sr-only focus:not-sr-only">
  Skip to content after visualization
</a>
<ConstellationGraph ... />
<div id="after-graph" />
```

The `.sr-only` class should be in globals.css (standard: `position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0)`).

## Definition of Done

All 4 D3 visualizations have ARIA roles and labels. CelestialMandala and ConstellationGraph are keyboard-navigable. Screen reader announces planet positions and HD definitions. No WCAG AA failures. `npm run verify` passes.
