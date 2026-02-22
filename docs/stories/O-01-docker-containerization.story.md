# O-01: Docker Containerization (App + API)

**Status:** Done
**Priority:** HIGH
**Points:** 8
**Sprint:** O — Infrastructure
**Depends on:** None (first story)

## Story

As a developer or operator, I need the Cosmic Blueprint app packaged as a Docker container with a production-ready server, so that I can deploy it anywhere Docker runs — locally, on a VPS, or in any cloud provider.

## Problem

Currently the app has two deployment modes:
1. `npm run dev` — Vite dev server with `claudeApiProxy()` middleware (development only)
2. Vercel — Static files + serverless `/api/claude.ts` function (vendor-locked)

There is no generic production server, no Dockerfile, no docker-compose, and no `.dockerignore`. Self-hosting requires manually setting up a Node.js process to serve the built files and proxy API calls.

## Acceptance Criteria

- [x] A `Dockerfile` builds the app into a production container (~100-200MB)
- [x] The container runs a Node.js server that serves `dist/` static files and proxies `/api/claude` to OpenRouter/Anthropic
- [x] The container accepts configuration via environment variables (API keys, Supabase URL, etc.)
- [x] A `docker-compose.yml` runs the app container with proper env vars
- [x] A `.dockerignore` excludes `node_modules`, `.env`, `.git`, and other dev artifacts
- [x] `docker compose up` starts the app accessible on `http://localhost:3000`
- [x] The production server handles SPA routing (all non-API routes return `index.html`)
- [x] Health check endpoint at `GET /health` returns `200 OK`

## Dev Notes

### Production Server (`server.js` or `server.ts`)

A minimal Express/Fastify server that:
1. Serves `dist/` as static files
2. Proxies `POST /api/claude` to OpenRouter (port existing `claudeApiProxy` logic from `vite.config.ts`)
3. Handles SPA fallback: `GET *` → `dist/index.html`
4. Exposes `GET /health` for container health checks
5. Reads config from `process.env`

### Dockerfile (multi-stage)

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
EXPOSE 3000
HEALTHCHECK CMD wget -q --spider http://localhost:3000/health || exit 1
CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
    restart: unless-stopped
```

### Key decisions

- Use `node:20-alpine` for small image size
- Multi-stage build keeps `node_modules` dev deps out of production
- The API proxy in `server.js` replaces both the Vite middleware and Vercel function
- Rate limiting from `api/claude.ts` should be preserved in the server

## Testing

- Build: `docker build -t cosmic-blueprint .` succeeds
- Run: `docker compose up` → app serves at localhost:3000
- API: `curl -X POST localhost:3000/api/claude` with valid payload streams response
- SPA: `curl localhost:3000/profile` returns `index.html` (not 404)
- Health: `curl localhost:3000/health` returns 200

## Scope

**IN:** Dockerfile, docker-compose.yml, .dockerignore, production server, health check
**OUT:** SSL/TLS (O-03), CI/CD automation (O-04), Supabase containers (O-02)

## File List

- `Dockerfile` (new)
- `docker-compose.yml` (new)
- `.dockerignore` (new)
- `server.js` (new — production server)
- `package.json` (modify — add express/fastify dependency + start script)

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
