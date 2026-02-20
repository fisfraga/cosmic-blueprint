# Story TD-L-01: Add `profile_id` FK to Insights and Sessions
**Epic:** EPIC-TD-01 — Technical Debt Resolution
**Sprint:** L
**Status:** Ready
**Points:** 8
**Agent:** @dev (Dex) + @data-engineer (Dara)

---

## Description

**CRITICAL DEBT (DB-SD-06 / DB-DI-02).** The `saved_insights` and `contemplation_sessions` tables have no foreign key to `cosmic_profiles`. When a user has multiple profiles, insights and sessions from all profiles are mixed together in the Insight Library and Session view — no way to distinguish which profile they belong to. This corrupts the coaching use case entirely.

This story adds `profile_id` as a non-nullable FK column to both tables, updates RLS policies to filter by profile, and updates the frontend services to pass the active `profile_id` on every write.

## Acceptance Criteria

### Database
- [ ] Migration `006_add_profile_id_fk.sql` created and documented in `supabase/docs/SCHEMA.md`
- [ ] `saved_insights` table: `profile_id UUID NOT NULL REFERENCES cosmic_profiles(user_id)` column added
- [ ] `contemplation_sessions` table: `profile_id UUID NOT NULL REFERENCES cosmic_profiles(user_id)` column added
- [ ] Both columns have an index: `CREATE INDEX ON saved_insights(profile_id)` and same for sessions
- [ ] RLS policies updated: `SELECT` policies filter `WHERE profile_id = (SELECT id FROM cosmic_profiles WHERE user_id = auth.uid() LIMIT 1)` — or equivalent logic based on active profile context

### Frontend Services
- [ ] `src/services/insights.ts` passes `profile_id` on every `INSERT`
- [ ] `src/services/insights.ts` filters by `profile_id` on every `SELECT`
- [ ] If a sessions service exists: same pattern applied
- [ ] Active profile ID sourced from `ProfileContext` — never hardcoded

### localStorage Compatibility
- [ ] localStorage-based insight storage also stores `profileId` per insight
- [ ] Insight Library filters displayed insights to `profileId === activeProfileId`
- [ ] Existing insights without `profileId` display only when the first/default profile is active (graceful degradation)

### Verification
- [ ] Create two profiles, save an insight under each — verify each profile only shows its own insights
- [ ] Existing functionality (single profile) is unaffected

## Tasks

- [ ] Read `supabase/migrations/001_initial_schema.sql` and `003_contemplation_sessions.sql`
- [ ] Read `src/services/insights.ts`
- [ ] Read `src/context/ProfileContext.tsx` to understand how active profile ID is accessed
- [ ] Write migration `006_add_profile_id_fk.sql`
- [ ] Update `supabase/docs/SCHEMA.md` with new column documentation
- [ ] Update `src/services/insights.ts` to pass and filter by `profile_id`
- [ ] Update localStorage insight schema to include `profileId`
- [ ] Update Insight Library component to filter by active profile
- [ ] Test: multi-profile insight isolation
- [ ] Run `npm run verify`

## Scope

**IN:** `profile_id` FK on insights + sessions, RLS update, frontend service update, localStorage schema update
**OUT:** Full RLS redesign, user-level quotas, subscription gating

## Dependencies

None — independent. This is the highest-priority Sprint L story.

## Technical Notes

- The `cosmic_profiles` table uses `user_id UUID REFERENCES auth.users` as its primary auth link. The FK in `saved_insights` should reference `cosmic_profiles.id` (the profile's own UUID), not `auth.uid()` directly — this enables multi-profile isolation per user.
- RLS must be updated carefully: the `INSERT` policy also needs to allow `profile_id` to be set by the client only if it matches a profile the user owns.
- For localStorage: add `profileId: string` to the `SavedInsight` interface. On migration: existing insights without `profileId` should get the ID of the first profile in the profiles array.

## Definition of Done

Insights and sessions are isolated per profile. Two-profile test passes. Migration documented. `npm run verify` passes. No regressions.
