# Story TD-L-04: Expand Service Test Coverage to 60%
**Epic:** EPIC-TD-01 — Technical Debt Resolution
**Sprint:** L
**Status:** Ready
**Points:** 13
**Agent:** @dev (Dex)

---

## Description

Cosmic Blueprint has 25 service files and currently 1 test file (`aspects.test.ts`), giving roughly 4% service coverage. After TD-K-04 (chartCalculation) and TD-K-05 (ephemeris) are done, coverage will increase but remain well below the 60% target. This story adds test suites for the remaining high-value, high-risk services.

## Acceptance Criteria

- [ ] Service coverage reaches ≥60% as reported by `npm run test:coverage`
- [ ] New test files created for:
  - [ ] `src/services/aspects.ts` — if not already at 80%+ (existing test, may be partial)
  - [ ] `src/services/profiles.ts` — profile CRUD, MAX_PROFILES enforcement, migration triggers
  - [ ] `src/services/insights.ts` — save, load, delete, filter by profile
  - [ ] `src/services/transits.ts` — transit detection, cosmic weather generation
  - [ ] `src/services/pathways.ts` — step tracking, completion detection
  - [ ] `src/services/profileValidation.ts` — validation rules for birth data
  - [ ] `src/services/profileMigration.ts` — v1→v2 migration produces correct output
- [ ] All new tests pass: `npm run test:run`
- [ ] No existing tests broken

## Tasks

- [ ] Run `npm run test:coverage` to get current baseline per file
- [ ] Prioritize files by: risk (core business logic) × current coverage (lowest first)
- [ ] Read each service file before writing its tests
- [ ] Create `src/services/profiles.test.ts`
- [ ] Create `src/services/insights.test.ts`
- [ ] Create `src/services/transits.test.ts`
- [ ] Create `src/services/pathways.test.ts`
- [ ] Create `src/services/profileValidation.test.ts`
- [ ] Create `src/services/profileMigration.test.ts`
- [ ] Review `src/services/aspects.test.ts` — extend if below 80%
- [ ] Run `npm run test:coverage` — verify ≥60% overall service coverage
- [ ] Run `npm run verify`

## Scope

**IN:** Service-layer unit tests for the 7 services above, coverage target
**OUT:** Component tests, integration tests, E2E tests (separate initiative), `contemplation/` services (complex async AI services — separate story)

## Dependencies

TD-K-04 and TD-K-05 should be completed first (they contribute to the 60% target). TD-L-01 should precede `insights.test.ts` so the test can validate profile isolation.

## Technical Notes

### Testing Priorities by Risk

| Service | Risk | Reason |
|---------|------|--------|
| `profiles.ts` | High | MAX_PROFILES=10 enforcement, localStorage corruption risk |
| `profileMigration.ts` | High | Silent migration failures corrupt all user data |
| `insights.ts` | High | After TD-L-01, profile isolation must be verified |
| `profileValidation.ts` | Medium | Prevents invalid birth data from entering calculation pipeline |
| `transits.ts` | Medium | Transit accuracy affects daily UX |
| `pathways.ts` | Low-Medium | Step tracking, no complex calculations |

### Mocking Strategy

- Mock `localStorage` with `vi.stubGlobal('localStorage', localStorageMock)` pattern
- Mock Supabase client: `vi.mock('../lib/supabase', () => ({ supabase: mockSupabaseClient }))`
- Mock time-dependent transits: `vi.useFakeTimers()` for transit tests

### Coverage Command

```bash
npm run test:coverage
# Or for a single file:
vitest run --coverage src/services/profiles.ts
```

## Definition of Done

Service coverage ≥60% per `test:coverage` report. All new tests pass. No regressions.
