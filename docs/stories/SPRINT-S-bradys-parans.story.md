# Sprint S: Brady's Parans — Heliacal Rising/Setting

**Status:** Done
**Priority:** Medium
**Points:** 5

## Story

As a user exploring my fixed star connections, I want to see which fixed stars were on the angles of my chart (Rising, Setting, Culminating, Anti-Culminating) at birth, so I can understand my "parans" — the deeper mundane connections between stars and planets at my birth location.

## What are Brady's Parans?

Brady's Parans (from Bernadette Brady's work) identify fixed stars that share an angle with natal planets on the birth date. Unlike ecliptic conjunctions (which measure proximity along the zodiac), parans are based on the observer's local horizon:

- A star "parans" a planet if, on the birth date at the birth location, the star was **Rising/Setting/Culminating/Anti-Culminating** while the planet was **also on one of these angles**
- This is a mundane sphere technique — latitude-sensitive, not ecliptic-based

## Acceptance Criteria

- [x] Given birth lat/lng and date, compute for each fixed star when it rises, sets, culminates, and anti-culminates on the birth date
- [x] For each star angle event, check if any natal planet was also on an angle at that time
- [x] Display paran results grouped by star in ProfileFixedStars page
- [x] If a star makes no parans, it is not shown in the parans section
- [x] Parans are computed using the existing `astronomy-engine` library

## Dev Notes

### Approach

Use `astronomy-engine`'s `DefineStar()` to register fixed stars by converting their ecliptic longitude to RA/Dec (using obliquity of the ecliptic, assuming 0 ecliptic latitude). Then use `SearchRiseSet()` and `SearchHourAngle()` to find rise/set/culmination/anti-culmination times for each star on the birth date.

For each star angle event time, compute each planet's altitude via `Horizon()` to check if that planet is within orb of an angle (altitude near 0 for rising/setting, or hour angle near 0/12 for culminating/anti-culminating).

### Key astronomy-engine Functions
- `DefineStar(body, ra, dec, distanceLightYears)` — register star (8 slots: Star1..Star8)
- `SearchRiseSet(body, observer, direction, startTime, limitDays)` — rise (+1) / set (-1)
- `SearchHourAngle(body, observer, hourAngle, startTime)` — culmination (HA=0) and anti-culmination (HA=12)
- `Horizon(date, observer, ra, dec)` — get altitude/azimuth for RA/Dec coordinates
- `Equator(body, date, observer, ofdate, aberration)` — get planet RA/Dec at a time

### Limitation: Ecliptic-to-Equatorial Approximation

Fixed stars in `fixed-stars.json` only have `eclipticLongitude` (no RA/Dec). The conversion assumes ecliptic latitude = 0, which is approximate. Stars far from the ecliptic will have less accurate paran times. This is documented in the UI.

### Files to Create/Modify
- `src/services/bradysParans.ts` (new)
- `src/pages/profile/ProfileFixedStars.tsx` (add parans section)
- `src/services/bradysParans.test.ts` (new)

## Scope
**IN:** Paran computation for all 15 fixed stars in fixed-stars.json, display in ProfileFixedStars
**OUT:** Interpretation text for parans, paran search for transiting planets (natal only), per-star RA/Dec data enrichment

---

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4.6

### Debug Log
- Story audit: confirmed fully implemented via codebase inspection
- No code changes required

### Change Log
| Date | Author | Change |
|------|--------|--------|
| 2026-02-22 | @dev (Dex) | Confirmed already implemented; Status → Done |
