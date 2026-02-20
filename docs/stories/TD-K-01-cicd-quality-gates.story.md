# Story TD-K-01: Add CI/CD Quality Gates
**Epic:** EPIC-TD-01 — Technical Debt Resolution
**Sprint:** K
**Status:** Ready
**Points:** 3
**Agent:** @devops (Gage) + @dev (Dex)

---

## Description

The CI/CD pipeline (`.github/workflows/`) currently runs on every push, but its quality gates have not been audited. Core protections (lint, typecheck, test) may not be enforced automatically. This story audits and fixes the pipeline to ensure all quality gates run on every push and PR.

## Acceptance Criteria

- [ ] `npm run lint` runs in CI on every push and PR — fails the build on any lint error
- [ ] `npm run build` (includes `tsc`) runs in CI — fails on TypeScript errors
- [ ] `npm run test:run` runs in CI — fails on any test failure
- [ ] CI results are visible in GitHub PR checks
- [ ] Failing CI blocks merge to `main`
- [ ] CI completes in ≤5 minutes for typical push

## Tasks

- [ ] Audit existing `.github/workflows/` files — identify what currently runs
- [ ] Add or update workflow to run: `npm ci && npm run lint && npm run test:run && npm run build`
- [ ] Ensure workflow triggers on: `push` (all branches) and `pull_request` (to main)
- [ ] Verify Vercel deployment only proceeds after CI passes
- [ ] Document CI setup in README

## Scope

**IN:** GitHub Actions workflow audit and update, test/lint/build steps
**OUT:** Performance testing, security scanning, Lighthouse checks (future sprint)

## Dependencies

None — independent, can start immediately.

## Definition of Done

CI pipeline enforces lint + test + build on every push. A PR with a failing test or lint error cannot be merged.
