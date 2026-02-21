# Phase 4 Handoff — Technical Debt Draft
**For:** @architect (Aria)
**From:** @data-engineer (Dara) + @ux-design-expert (Uma)
**Date:** 2026-02-20
**Workflow:** Brownfield Discovery — Phase 4 of 10

---

## Instructions

Activate the architect agent (`/AIOS:agents:architect`) and issue this command:

```
Continue the Brownfield Discovery workflow. Execute Phase 4: create the technical-debt-DRAFT.md document.

Read the handoff at: docs/architecture/PHASE4-HANDOFF.md
```

The architect should then read the three specialist reports listed below and synthesize them into `docs/architecture/technical-debt-DRAFT.md`.

---

## Brownfield Discovery Status

| Phase | Agent | Deliverable | Status |
|-------|-------|-------------|--------|
| 1 | @architect (Aria) | `docs/architecture/system-architecture.md` | **Done** |
| 2 | @data-engineer (Dara) | `docs/architecture/SCHEMA.md` + `docs/architecture/DB-AUDIT.md` | **Done** |
| 3 | @ux-design-expert (Uma) | `docs/architecture/frontend-spec.md` | **Done** |
| **4** | **@architect (Aria)** | **`docs/architecture/technical-debt-DRAFT.md`** | **← START HERE** |
| 5 | @data-engineer | `db-specialist-review.md` | Pending |
| 6 | @ux-design-expert | `ux-specialist-review.md` | Pending |
| 7 | @qa | `qa-review.md` (QA Gate) | Pending |
| 8 | @architect | `technical-debt-assessment.md` (final) | Pending |
| 9 | @analyst | `TECHNICAL-DEBT-REPORT.md` (executive) | Pending |
| 10 | @pm | Epic + stories | Pending |

---

## Input Documents (Read All Before Writing)

### 1. `docs/architecture/system-architecture.md` (Phase 1 — @architect)
- Project overview, tech stack, architecture diagram
- 13 sections covering: dependencies, routing (79 routes), state management, services, AI integration, deployment
- Version drift observations (TypeScript 5.2→5.7, Framer Motion 10→11, ESLint 8→9)
- Zustand listed but **NOT USED** — tech debt item
- All specialist questions now answered (Sections 14)
- **Version: 1.2**

### 2. `docs/architecture/SCHEMA.md` (Phase 2 — @data-engineer)
- Four-layer data architecture: Static KB (29 JSON, 700+ entities) → Ephemeris → localStorage (4 keys) → Supabase (4 tables)
- Full DDL for all 4 tables with indexes, triggers, RLS
- Sync architecture: additive-only merge, local-first, optional cloud
- Entity registry: ~700 universal + ~150 per-profile
- Cross-tradition bridges via ecliptic degree (0-360°)
- Core calculation pipeline: birth data → ephemeris → chart → enrichment

### 3. `docs/architecture/DB-AUDIT.md` (Phase 2 — @data-engineer)
- **3 CRITICAL findings:**
  - CRIT-01: Timezone handling ignores birth location (uses browser TZ)
  - CRIT-02: Zero error handling on Supabase write operations
  - CRIT-03: Migration 005 column name mismatch (`type` vs `contemplation_type`)
- **5 HIGH findings:**
  - HIGH-01: Retrograde always returns false (hardcoded)
  - HIGH-02: Silent sync failures on cloud read
  - HIGH-03: Deleted data reappears after sign-in (additive merge)
  - HIGH-04: No conflict resolution for multi-device edits
  - HIGH-05: focusEntity type inconsistency (string vs object)
- **5 MEDIUM, 4 LOW** — schema prefix, missing FK, no retry, no caching, etc.
- Estimated remediation: P1=8-15h, P2=10-20h, P3=3-5h

### 4. `docs/architecture/frontend-spec.md` (Phase 3 — @ux-design-expert)
- 17 sections, 912 lines — comprehensive UX/UI & Design Systems audit
- **Key findings:**
  - 366 ad-hoc button instances, no shared Button component
  - 2 god components: ContemplationChamber (1,345L, 19 useState) + EntityDetailPanel (1,215L)
  - ~45% WCAG AA compliance
  - 5 D3 components with zero ARIA support (critical accessibility gap)
  - Excellent Tailwind discipline (0 inline styles, centralized color system)
  - Birth data form duplicated (Onboarding.tsx vs ProfileCreationForm.tsx)
  - Element-based theming is the strongest design aspect (761 consistent instances)
- 5-phase design system roadmap proposed

---

## What Phase 4 Produces

**Output file:** `docs/architecture/technical-debt-DRAFT.md`

Per the brownfield workflow (`/.claude/rules/workflow-execution.md`), this document should:

1. **Consolidate all findings** from Phases 1-3 into a unified technical debt inventory
2. **Categorize debts** by type: Architecture, Data, Frontend/UX, Security, Performance, DX
3. **Assign severity** to each item (CRITICAL / HIGH / MEDIUM / LOW)
4. **Map dependencies** between items (e.g., timezone fix blocks accurate chart display)
5. **Estimate effort** per item (T-shirt sizing or hours)
6. **Propose priority order** considering dependencies and impact
7. **Identify quick wins** (< 1h fixes with high impact)

### Key Debt Categories to Address

| Category | Source | Key Items |
|----------|--------|-----------|
| **Calculation Correctness** | DB-AUDIT | Timezone handling (CRIT), retrograde (HIGH) |
| **Sync Reliability** | DB-AUDIT | Write errors (CRIT), silent failures (HIGH), conflict resolution (HIGH), delete reappearance (HIGH) |
| **Schema Issues** | DB-AUDIT | Migration 005 bug (CRIT), missing FK, type inconsistencies |
| **Component Architecture** | frontend-spec | God components (1,345L + 1,215L), 366 ad-hoc buttons, duplicated birth form |
| **Accessibility** | frontend-spec | ~45% WCAG, D3 zero ARIA, no live regions |
| **Design System** | frontend-spec | No atomic components, no shared Button/Input/Card |
| **Dependency Drift** | system-architecture | TypeScript 5.2→5.7, ESLint 8→9, Framer Motion 10→11 |
| **Dead Code** | system-architecture | Zustand installed but never used |
| **DX** | frontend-spec | No Storybook, no component documentation |

---

## Cross-References

- Brownfield workflow definition: `/.claude/rules/workflow-execution.md` (Phases 4-10)
- All specialist questions answered in: `system-architecture.md` Section 14
- Project root: `/Users/fisfraga/Code/cosmic-blueprint-dev/cosmic-blueprint/`
- Git root: same as project root
- Supabase project: `ykuhdxrttxzualqysgtr.supabase.co`

---

*Handoff prepared by @data-engineer (Dara) — 2026-02-20*
