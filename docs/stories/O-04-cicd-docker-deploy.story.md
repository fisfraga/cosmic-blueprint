# O-04: CI/CD Pipeline — Docker Build → Registry → VPS Deploy

**Status:** Ready
**Priority:** HIGH
**Points:** 8
**Sprint:** O — Infrastructure
**Depends on:** O-01 (Dockerfile), O-03 (docker-compose.prod.yml)

## Story

As a developer, I need an automated pipeline that builds the Docker image, pushes it to a container registry, and deploys it to the VPS on every push to main, so that deployments are consistent, repeatable, and don't require manual SSH.

## Problem

The existing CI (`.github/workflows/ci.yml`) only runs lint + test + build and uploads artifacts. There is no:
- Docker image build step
- Container registry push
- Automated deployment to VPS
- Rollback mechanism
- Deploy notifications

Currently deploying requires manual steps: SSH into VPS, pull code, rebuild, restart.

## Acceptance Criteria

- [ ] GitHub Actions workflow builds Docker image on push to main
- [ ] Image pushed to GitHub Container Registry (ghcr.io)
- [ ] VPS pulls new image and restarts containers via SSH deploy step
- [ ] Deploy only triggers after CI (lint + test + build) passes
- [ ] Failed deploys don't take down the running app (blue-green or rolling)
- [ ] Deploy status visible in GitHub Actions
- [ ] Manual deploy trigger available via `workflow_dispatch`
- [ ] Rollback possible by re-running a previous successful deploy

## Dev Notes

### GitHub Actions: `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  workflow_run:
    workflows: ["CI"]
    branches: [main]
    types: [completed]
  workflow_dispatch:

jobs:
  deploy:
    if: ${{ github.event.workflow_run.conclusion == 'success' || github.event_name == 'workflow_dispatch' }}
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:latest
            ghcr.io/${{ github.repository }}:${{ github.sha }}

      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/cosmic-blueprint
            docker compose -f docker-compose.prod.yml pull app
            docker compose -f docker-compose.prod.yml up -d --no-deps app
            docker image prune -f
```

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `VPS_HOST` | VPS IP address or hostname |
| `VPS_USER` | SSH username (e.g., `deploy`) |
| `VPS_SSH_KEY` | Private SSH key for VPS access |

`GITHUB_TOKEN` is automatically available for ghcr.io push.

### VPS initial setup

```bash
# One-time setup on VPS
mkdir -p /opt/cosmic-blueprint
# Copy docker-compose.prod.yml, nginx config, .env.production
# Login to ghcr.io:
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
```

### Rollback strategy

Each deploy tags the image with the commit SHA. To rollback:
```bash
docker compose -f docker-compose.prod.yml stop app
docker compose -f docker-compose.prod.yml run -d --name app ghcr.io/fisfraga/cosmic-blueprint:PREVIOUS_SHA
```

Or re-run a previous successful deploy workflow in GitHub Actions.

## Testing

- Push to main → CI passes → deploy workflow triggers
- ghcr.io shows new image tag
- VPS pulls and restarts container
- `curl https://yourdomain.com/health` returns 200 after deploy
- `workflow_dispatch` trigger works from Actions tab
- Failed CI → deploy does NOT trigger

## Scope

**IN:** Deploy workflow, ghcr.io push, SSH deploy, rollback docs
**OUT:** Multi-environment (staging/prod), Kubernetes, Terraform, monitoring alerts

## File List

- `.github/workflows/deploy.yml` (new)
- `docs/guides/vps-setup.md` (new — initial VPS configuration steps)
