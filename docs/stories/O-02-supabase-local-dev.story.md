# O-02: Supabase Local Development Setup

**Status:** Ready
**Priority:** HIGH
**Points:** 5
**Sprint:** O — Infrastructure
**Depends on:** None (can run parallel with O-01)

## Story

As a developer, I need a local Supabase instance running via Docker, so that I can develop and test database features without depending on the hosted Supabase project and without risking production data.

## Problem

The project has 7 SQL migrations in `supabase/migrations/` and uses Supabase client in the app, but:
- No `supabase/config.toml` exists (required by Supabase CLI)
- No local Supabase setup — all development hits the hosted instance (`ykuhdxrttxzualqysgtr.supabase.co`)
- Migrations can't be tested locally before applying to production
- No seed data for local development

## Acceptance Criteria

- [ ] `supabase/config.toml` configured for the project (project name, ports, auth settings)
- [ ] `supabase start` launches local Supabase stack (Postgres, PostgREST, GoTrue, Studio)
- [ ] All 7 existing migrations apply cleanly to a fresh local database
- [ ] `supabase/seed.sql` creates a minimal dev dataset (1 user, 2 profiles, sample insights/sessions)
- [ ] `.env.local` template includes local Supabase URLs and keys for development
- [ ] `supabase db reset` wipes and re-applies all migrations + seed data
- [ ] Documentation in `docs/guides/local-development.md` covers setup steps

## Dev Notes

### supabase/config.toml

```toml
[project]
id = "cosmic-blueprint"

[api]
port = 54321
schemas = ["public"]
extra_search_path = ["public"]

[db]
port = 54322
major_version = 15

[studio]
port = 54323

[auth]
site_url = "http://localhost:5173"
additional_redirect_urls = ["http://localhost:3000"]
```

### Seed data (`supabase/seed.sql`)

Create realistic test data:
- 1 auth user (test@example.com)
- 2 cosmic profiles (one tropical, one sidereal — to test multi-profile)
- 3 saved insights across both profiles
- 2 contemplation sessions
- 1 pathway progress entry

### Local dev flow

```bash
supabase start              # Start local stack
supabase db reset           # Apply migrations + seed
npm run dev                 # Vite points to local Supabase
supabase stop               # Shut down
```

### Integration with docker-compose

For the full self-hosted deployment (O-01 + O-02 combined), the docker-compose from O-01 will be extended in O-05 to optionally include Supabase services. For local dev, `supabase start` (Supabase CLI) manages its own Docker containers separately.

## Testing

- `supabase start` completes without errors
- `supabase db reset` applies all 7 migrations + seed
- Studio accessible at `http://localhost:54323`
- App connects to local Supabase when using `.env.local` values
- `supabase migration list` shows all migrations as applied

## Scope

**IN:** config.toml, seed.sql, local dev documentation, .env.local template
**OUT:** Production Supabase Docker setup (O-05), Supabase Edge Functions, auth provider config

## File List

- `supabase/config.toml` (new)
- `supabase/seed.sql` (new)
- `.env.local.example` (new — local dev env template)
- `docs/guides/local-development.md` (new)
