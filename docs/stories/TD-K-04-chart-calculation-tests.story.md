# Story TD-K-04: Test Suite for `chartCalculation.ts`
**Epic:** EPIC-TD-01 — Technical Debt Resolution
**Sprint:** K
**Status:** Ready
**Points:** 8
**Agent:** @dev (Dex)

---

## Description

`chartCalculation.ts` (641 lines) is the core business logic of Cosmic Blueprint — it takes birth data and produces astrology placements, Human Design gate activations, Gene Key sphere placements, and numerology values. Currently it has zero test coverage. Any regression in this file affects every user's profile.

This story adds a comprehensive test suite using known birth data with pre-verified expected outputs.

## Acceptance Criteria

- [ ] Test file: `src/services/chartCalculation.test.ts` exists
- [ ] Uses at least 2 known birth profiles as test fixtures (with independently verified outputs)
- [ ] Tests cover:
  - [ ] Planetary sign placement for each of the 11 planets
  - [ ] Earth position calculation (Sun + 180°)
  - [ ] HD gate activation for each planet
  - [ ] GK sphere assignment for each planet
  - [ ] HD type derivation from defined channels
  - [ ] Numerology life path calculation
- [ ] Edge cases tested:
  - [ ] Birth near midnight (day boundary)
  - [ ] Birth at 0° Aries (sign boundary)
  - [ ] Retrograde planet handling
- [ ] All tests pass: `npm run test:run`
- [ ] Test coverage for `chartCalculation.ts` reaches ≥80%

## Tasks

- [ ] Research and document 2 public birth charts with known verified outputs (use historical/public figures with known birth data)
- [ ] Create `src/services/chartCalculation.test.ts`
- [ ] Import test fixtures as typed constants
- [ ] Write planet placement tests
- [ ] Write HD gate activation tests
- [ ] Write GK sphere tests
- [ ] Write numerology tests
- [ ] Write edge case tests
- [ ] Run `npm run test:coverage` to verify coverage target

## Scope

**IN:** `chartCalculation.ts` unit tests, test fixtures with verified outputs
**OUT:** `ephemeris.ts` tests (separate story TD-K-05), integration tests

## Dependencies

None — independent. Should ideally precede any refactoring of chartCalculation.ts.

## Technical Notes

Use birth data for well-documented public figures where the chart has been independently verified by multiple astrologers. Avoid using the developer profile (felipe.json) as the sole test fixture — use at least one additional independent chart.

The `CALCULATION_VERSION = '1.0.0'` constant in chartCalculation.ts should be included in test assertions so version bumps are explicit and intentional.

## Definition of Done

`chartCalculation.test.ts` exists with ≥80% coverage of `chartCalculation.ts`. All tests pass in CI.
