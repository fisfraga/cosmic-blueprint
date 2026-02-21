# Supabase Local Development

Local Supabase stack for development without depending on the hosted project.

## Quick Start

```bash
docker compose -f docker-compose.supabase.yml up -d
```

## Services

| Service | URL | Description |
|---------|-----|-------------|
| Studio | http://localhost:54323 | Database admin UI |
| API (Kong) | http://localhost:54321 | REST/GraphQL gateway |
| Database | localhost:54322 | PostgreSQL 15 |
| Meta | localhost:54325 | Postgres metadata API |

## Connection String

```
postgresql://postgres:postgres@localhost:54322/postgres
```

## Environment Variables for Local Dev

Add to `.env` to point the app at local Supabase:

```bash
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<your-local-anon-key>
```

The local anon key is generated during `supabase start`. If using the docker-compose stack directly, you will need to configure Kong with JWT secrets to generate valid keys.

## Migrations

SQL migrations in `supabase/migrations/` are automatically applied on first start via the `docker-entrypoint-initdb.d` mount.

To apply new migrations after the database is already running:

```bash
docker compose -f docker-compose.supabase.yml exec db \
  psql -U postgres -f /docker-entrypoint-initdb.d/<migration-file>.sql
```

## Reset

Remove all data and start fresh:

```bash
docker compose -f docker-compose.supabase.yml down -v
docker compose -f docker-compose.supabase.yml up -d
```

## Using Supabase CLI Instead

If you have the Supabase CLI installed, you can use it with the `supabase/config.toml`:

```bash
supabase start    # Starts local stack using config.toml
supabase stop     # Stops local stack
supabase db reset # Resets database and re-applies migrations
```

The CLI approach is simpler and manages Kong/JWT configuration automatically.
