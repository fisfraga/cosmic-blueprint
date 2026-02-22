# Sprint O: Infrastructure — Docker, Supabase & VPS Deployment

**Status:** Done
**Priority:** HIGH
**Total Points:** 34
**Source:** Post-Sprint N infrastructure gap analysis

## Overview

The Cosmic Blueprint app currently deploys only to Vercel (frontend + serverless API proxy). There is no containerized setup, no local Supabase dev environment, and no self-hosted deployment path. This sprint adds the full infrastructure stack needed for a working self-hosted system on a VPS.

## Stories

| ID | Title | Points | Priority |
|----|-------|--------|----------|
| O-01 | Docker containerization (app + API) | 8 | HIGH |
| O-02 | Supabase local development setup | 5 | HIGH |
| O-03 | Nginx reverse proxy + SSL/TLS | 5 | HIGH |
| O-04 | CI/CD pipeline: Docker build → registry → VPS deploy | 8 | HIGH |
| O-05 | Production environment & secrets management | 5 | MEDIUM |
| O-06 | Health checks, logging & monitoring baseline | 3 | MEDIUM |

## Dependencies

- All app code from Sprints K-N must be stable (completed)
- VPS access with SSH key configured
- Domain name pointed to VPS IP (or use IP directly for initial setup)
- Docker + Docker Compose installed on VPS

## Architecture Decision

```
VPS (your server)
├── nginx (reverse proxy, SSL termination)
│   ├── :443 → cosmic-blueprint-app (frontend + API)
│   └── :443/supabase → supabase services
├── cosmic-blueprint-app (Docker container)
│   ├── Node.js server (serves static + proxies /api/claude)
│   └── Built React app (dist/)
├── supabase (Docker Compose stack)
│   ├── PostgreSQL 15
│   ├── PostgREST (auto-generated REST API)
│   ├── GoTrue (auth)
│   ├── Realtime
│   ├── Storage
│   └── Studio (admin UI)
└── watchtower (optional: auto-update containers)
```

The app container uses a lightweight Node.js server (Express or Fastify) that serves the Vite production build and handles the `/api/claude` proxy — replacing the Vercel serverless function.

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
