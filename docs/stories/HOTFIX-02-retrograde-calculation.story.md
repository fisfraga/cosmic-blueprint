# HOTFIX-02: Fix Retrograde Status Calculation

**Status:** Ready
**Priority:** HIGH
**Points:** 3
**Source:** DB-AUDIT HIGH-01

## Story

As a user viewing my transits or natal chart, I need to see which planets are retrograde, so that I can understand the full astrological context of each placement.

## Problem

`chartCalculation.ts` (line 126) always sets `retrograde: false` for every planet position. The retrograde flag is hardcoded and never actually calculated. This means:
- Transit displays never show retrograde symbols
- The Contemplation Chamber AI receives incorrect retrograde data
- Cosmic weather descriptions miss retrograde context

## Acceptance Criteria

- [ ] Given a planet that is astronomically retrograde (apparent backward motion), the system returns `retrograde: true`
- [ ] Given a planet that is direct (normal motion), the system returns `retrograde: false`
- [ ] The calculation works for all planets (Mercury through Pluto; Sun and Moon are never retrograde)
- [ ] Transit positions include correct retrograde status
- [ ] Natal chart positions include correct retrograde status at birth time

## Dev Notes

### Approach: Compare ecliptic longitude on consecutive days

A planet is retrograde when its ecliptic longitude is **decreasing** (moving backward through the zodiac).

```typescript
function isRetrograde(planetId: string, date: Date): boolean {
  // Sun and Moon are never retrograde
  if (planetId === 'sun' || planetId === 'moon') return false;

  const today = calculatePlanetPosition(planetId, date);
  const yesterday = calculatePlanetPosition(planetId, dayBefore(date));

  // Planet is retrograde if longitude decreased
  // Handle wrap-around at 0°/360° (e.g., 1° → 359° is forward, not backward)
  const diff = today - yesterday;
  if (Math.abs(diff) > 180) {
    // Wrap-around case
    return diff > 0; // Large positive diff means it wrapped backward
  }
  return diff < 0;
}
```

The ephemeris service already provides daily positions, so this is essentially a one-line comparison with wrap-around handling.

### Implementation steps

1. Add `isRetrograde(planetId, date)` function to `src/services/ephemeris.ts` or `chartCalculation.ts`
2. Replace `retrograde: false` hardcoding with actual calculation
3. Verify against known retrograde dates (e.g., Mercury retrograde periods)
4. Update transit service if it also hardcodes retrograde

## Testing

- Unit: Mercury retrograde during a known retrograde period (e.g., 2025-03-15 to 2025-04-07)
- Unit: Mercury direct during a known direct period
- Unit: Sun and Moon always return false
- Unit: Wrap-around at 0°/360° boundary
- Unit: All outer planets (Jupiter, Saturn, etc.) during known retrograde windows

## Scope

**IN:** Retrograde calculation for natal + transit positions
**OUT:** Retrograde interpretation text, retrograde symbols in UI (existing UI already handles the flag if present)

## File List

- `src/services/chartCalculation.ts` (modify — retrograde calculation)
- `src/services/transits.ts` (modify — if retrograde is hardcoded here too)
- `src/services/chartCalculation.test.ts` (add retrograde test cases)
