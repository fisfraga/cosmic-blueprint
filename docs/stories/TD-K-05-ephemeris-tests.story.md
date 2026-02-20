# Story TD-K-05: Test Suite for `ephemeris.ts`
**Epic:** EPIC-TD-01 — Technical Debt Resolution
**Sprint:** K
**Status:** Ready
**Points:** 5
**Agent:** @dev (Dex)

---

## Description

`ephemeris.ts` is the positional foundation of Cosmic Blueprint. It resolves planetary longitudes from a pre-computed JSON ephemeris (`positions-2020-2035.json`) and falls back to `astronomy-engine` for out-of-range dates. Every natal chart, transit, and aspect calculation depends on its accuracy. Currently it has zero test coverage. A silent regression here corrupts every user's chart.

## Acceptance Criteria

- [ ] Test file: `src/services/ephemeris.test.ts` exists
- [ ] Tests cover:
  - [ ] Position lookup for a known date within pre-computed range (2020–2035)
  - [ ] Position lookup falls back to `astronomy-engine` for date before 2020
  - [ ] Position lookup falls back to `astronomy-engine` for date after 2035
  - [ ] All 10 standard planets return positions for a known date
  - [ ] Earth position is derived from Sun (Sun + 180°)
  - [ ] Retrograde status correctly reported for a known retrograde period
  - [ ] Boundary date: Dec 31 2035 — last day in pre-computed range
  - [ ] Boundary date: Jan 1 2020 — first day in pre-computed range
- [ ] Edge cases:
  - [ ] Leap year date (Feb 29 2024)
  - [ ] Date exactly at midnight UTC
  - [ ] Date with time component (non-midnight)
- [ ] All tests pass: `npm run test:run`
- [ ] Coverage for `ephemeris.ts` reaches ≥75%

## Tasks

- [ ] Read `src/services/ephemeris.ts` fully before writing tests
- [ ] Inspect `src/data/ephemeris/positions-2020-2035.json` structure
- [ ] Identify 2–3 known planetary positions with independently verified values (e.g., a well-documented historical date)
- [ ] Create `src/services/ephemeris.test.ts`
- [ ] Write in-range lookup tests
- [ ] Write fallback (astronomy-engine) tests
- [ ] Write boundary tests
- [ ] Write retrograde tests using a known retrograde period
- [ ] Run `npm run test:coverage` to verify coverage target

## Scope

**IN:** `ephemeris.ts` unit tests, boundary and fallback tests
**OUT:** `chartCalculation.ts` tests (TD-K-04), integration tests with external ephemeris APIs

## Dependencies

None — independent. Can run concurrently with TD-K-04.

## Technical Notes

- The pre-computed ephemeris stores daily positions. For intra-day precision, interpolation may be applied — test this if it exists.
- `astronomy-engine` fallback must return a geocentric ecliptic longitude in degrees 0–360.
- Retrograde is indicated when the longitude moves backward between consecutive days. Use a well-documented Mercury retrograde period as the test case (e.g., Mercury retrograde Oct–Nov 2023).
- Positions should be within ±0.1° of independently verified values.

## Definition of Done

`ephemeris.test.ts` exists with ≥75% coverage of `ephemeris.ts`. All tests pass. In-range and fallback paths are both exercised.
