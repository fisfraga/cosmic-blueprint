# O-05: Production Environment & Secrets Management

**Status:** Ready
**Priority:** MEDIUM
**Points:** 5
**Sprint:** O — Infrastructure
**Depends on:** O-01, O-02

## Story

As an operator, I need a clear separation between development, local, and production environment configurations, with secrets securely managed and never committed to git, so that the system is safe to deploy and credentials are not leaked.

## Problem

Currently:
- `.env.example` exists but mixes AIOS framework vars with app-specific vars
- No `.env.production` template for VPS deployment
- No documentation on which vars are required vs optional per environment
- Supabase service role key handling not documented for self-hosted setup
- Docker Compose needs env vars but no secure injection method defined

## Acceptance Criteria

- [ ] `.env.production.example` documents all required production environment variables
- [ ] Clear separation: which vars are build-time (`VITE_*`) vs runtime (server-side)
- [ ] `docker-compose.prod.yml` references env vars without embedding secrets in files
- [ ] Supabase self-hosted keys (JWT secret, anon key, service role key) documented
- [ ] Guide covers generating Supabase JWT keys for self-hosted deployment
- [ ] `.env.production` is in `.gitignore` (verify)
- [ ] `docs/guides/environment-variables.md` maps every variable to its purpose and required context

## Dev Notes

### Environment variable matrix

| Variable | Dev (local) | Production (VPS) | Build-time? |
|----------|-------------|-------------------|-------------|
| `VITE_SUPABASE_URL` | `http://localhost:54321` | `https://yourdomain.com/supabase` or hosted URL | Yes (baked into JS) |
| `VITE_SUPABASE_ANON_KEY` | Local anon key | Production anon key | Yes |
| `OPENROUTER_API_KEY` | Your key | Your key | No (server-side only) |
| `ANTHROPIC_API_KEY` | Optional | Optional | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Local service key | Production service key | No |
| `NODE_ENV` | `development` | `production` | No |

### Self-hosted Supabase keys

For self-hosted Supabase, you generate your own JWT secret and derive anon/service keys:

```bash
# Generate JWT secret (32+ chars)
openssl rand -base64 32

# Generate anon key (using supabase CLI or jwt.io)
# Role: anon, iss: supabase, exp: far future

# Generate service role key
# Role: service_role, same pattern
```

Document this in the environment guide.

### docker-compose.prod.yml env strategy

```yaml
services:
  app:
    image: ghcr.io/fisfraga/cosmic-blueprint:latest
    env_file: .env.production
    environment:
      - NODE_ENV=production
```

The `.env.production` file lives on the VPS at `/opt/cosmic-blueprint/.env.production` and is never in git.

## Testing

- `.env.production.example` contains all required vars with descriptions
- Docker compose starts with `.env.production` containing valid values
- App connects to Supabase with self-hosted keys
- No secrets in git history or Docker image layers
- Guide is complete and followable

## Scope

**IN:** Env templates, secrets documentation, Supabase key generation guide, gitignore verification
**OUT:** Vault/Secrets Manager integration, key rotation automation, backup encryption

## File List

- `.env.production.example` (new)
- `docs/guides/environment-variables.md` (new)
- `.gitignore` (verify — ensure .env.production is excluded)
- `docker-compose.prod.yml` (modify — env_file reference)
