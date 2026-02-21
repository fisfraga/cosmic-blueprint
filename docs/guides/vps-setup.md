# VPS Production Setup Guide

Complete guide for deploying Cosmic Blueprint to a VPS with Docker and GitHub Actions CI/CD.

## Server Requirements

- Ubuntu 22.04 LTS (or Debian 12)
- 1 GB+ RAM, 1 vCPU minimum (2 GB / 2 vCPU recommended)
- 20 GB disk
- Docker Engine 24+ and Docker Compose v2
- Public IP with ports 22, 80, 443 open

## 1. Initial Server Setup

### Create a deploy user

```bash
# On VPS as root
adduser deploy
usermod -aG sudo deploy
usermod -aG docker deploy
```

### SSH key authentication

```bash
# On your local machine
ssh-keygen -t ed25519 -C "cosmic-blueprint-deploy" -f ~/.ssh/cosmic_deploy

# Copy public key to VPS
ssh-copy-id -i ~/.ssh/cosmic_deploy.pub deploy@YOUR_VPS_IP
```

### Disable password auth (recommended)

```bash
# On VPS
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd
```

### Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 2. Install Docker

```bash
# Official Docker install
curl -fsSL https://get.docker.com | sh

# Verify
docker --version
docker compose version
```

## 3. App Directory Setup

```bash
sudo mkdir -p /opt/cosmic-blueprint
sudo chown deploy:deploy /opt/cosmic-blueprint
cd /opt/cosmic-blueprint
```

### Create production compose file

Create `/opt/cosmic-blueprint/docker-compose.prod.yml`:

```yaml
services:
  app:
    image: ghcr.io/fisfraga/cosmic-blueprint:latest
    container_name: cosmic-blueprint
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    healthcheck:
      test: ["CMD", "curl", "-sf", "http://localhost:3000/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
```

### Create production env file

Create `/opt/cosmic-blueprint/.env.production` with actual values:

```bash
NODE_ENV=production
PORT=3000
ANTHROPIC_API_KEY=sk-ant-...
OPENROUTER_API_KEY=sk-or-...
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ASTROLOGY_API_ENABLED=false
```

Secure the file:

```bash
chmod 600 /opt/cosmic-blueprint/.env.production
```

## 4. GitHub Secrets Configuration

In your GitHub repository, go to **Settings > Secrets and variables > Actions** and add:

| Secret | Value | Required |
|--------|-------|----------|
| `VPS_HOST` | Your VPS IP or hostname | Yes |
| `VPS_USER` | `deploy` | Yes |
| `VPS_SSH_KEY` | Contents of `~/.ssh/cosmic_deploy` (private key) | Yes |
| `VPS_PORT` | SSH port (default: `22`) | Yes |

The `GITHUB_TOKEN` is automatically available to workflows for GHCR authentication.

## 5. Authenticate Docker with GHCR on VPS

The VPS needs to pull images from GitHub Container Registry:

```bash
# On VPS as deploy user
# Create a GitHub PAT with read:packages scope
echo "YOUR_GITHUB_PAT" | docker login ghcr.io -u fisfraga --password-stdin
```

## 6. First Deploy

Manual first run to verify everything works:

```bash
cd /opt/cosmic-blueprint
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml logs -f app
```

Verify the health endpoint:

```bash
curl http://localhost:3000/health
# Expected: {"status":"ok"}
```

After this, the GitHub Actions deploy workflow handles all subsequent deployments automatically.

## 7. SSL / HTTPS Setup

See `ssl-setup.md` for full Certbot + nginx configuration.

Quick overview: nginx listens on 80/443, terminates TLS, proxies to `localhost:3000`.

## 8. Rollback

### Roll back to a specific image tag

Every deploy tags images with `sha-<commit>`. To rollback:

```bash
cd /opt/cosmic-blueprint

# Find available tags
docker images ghcr.io/fisfraga/cosmic-blueprint

# Stop current and run previous
docker compose -f docker-compose.prod.yml stop app
docker compose -f docker-compose.prod.yml run -d --name cosmic-blueprint \
  ghcr.io/fisfraga/cosmic-blueprint:sha-PREVIOUS_SHA
```

### Roll back via re-deploy

Alternatively, revert the commit on `main` and let CI/CD redeploy:

```bash
git revert HEAD
git push origin main
```

## 9. Monitoring

### Logs

```bash
# Follow app logs
docker compose -f docker-compose.prod.yml logs -f app

# Last 100 lines
docker compose -f docker-compose.prod.yml logs --tail 100 app
```

### Resource usage

```bash
docker stats cosmic-blueprint
```

### Container health

```bash
docker compose -f docker-compose.prod.yml ps
docker inspect --format='{{.State.Health.Status}}' cosmic-blueprint
```

### Disk usage

```bash
docker system df
# Clean up if needed
docker image prune -f
docker system prune -f
```

## 10. Maintenance

### Update Docker images manually

```bash
cd /opt/cosmic-blueprint
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d --remove-orphans
docker image prune -f
```

### Restart the app

```bash
docker compose -f docker-compose.prod.yml restart app
```

### Stop everything

```bash
docker compose -f docker-compose.prod.yml down
```
