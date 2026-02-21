# O-03: Nginx Reverse Proxy + SSL/TLS

**Status:** Ready
**Priority:** HIGH
**Points:** 5
**Sprint:** O — Infrastructure
**Depends on:** O-01 (app container must exist)

## Story

As an operator deploying to a VPS, I need an Nginx reverse proxy with automatic SSL certificates, so that the app is served over HTTPS with proper security headers and the internal services are not exposed directly to the internet.

## Problem

The app container (O-01) listens on port 3000 internally. Without a reverse proxy:
- No SSL/TLS — users connect over plain HTTP
- Internal ports (Supabase Studio, PostgREST) may be accidentally exposed
- No centralized security headers, rate limiting, or access control
- No automatic certificate renewal

## Acceptance Criteria

- [ ] Nginx config proxies `yourdomain.com` → app container on port 3000
- [ ] SSL certificates auto-provisioned via Let's Encrypt (certbot)
- [ ] HTTP → HTTPS redirect enforced
- [ ] Security headers applied (HSTS, X-Frame-Options, X-Content-Type-Options, CSP)
- [ ] WebSocket upgrade supported (for Supabase Realtime, if needed)
- [ ] Supabase Studio accessible only from localhost or via SSH tunnel (not publicly exposed)
- [ ] Nginx container defined in `docker-compose.prod.yml`
- [ ] Certificate auto-renewal via certbot cron or timer

## Dev Notes

### docker-compose.prod.yml (extends docker-compose.yml)

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - certbot-etc:/etc/letsencrypt:ro
      - certbot-var:/var/lib/letsencrypt
    depends_on:
      - app
    restart: unless-stopped

  certbot:
    image: certbot/certbot
    volumes:
      - certbot-etc:/etc/letsencrypt
      - certbot-var:/var/lib/letsencrypt
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

volumes:
  certbot-etc:
  certbot-var:
```

### nginx/conf.d/default.conf

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /.well-known/acme-challenge/ {
        root /var/lib/letsencrypt;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://app:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support for streaming
    location /api/claude {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 300s;
    }
}
```

### Initial SSL setup script

```bash
#!/bin/bash
# scripts/init-ssl.sh
# Run once on fresh VPS to obtain initial certificates
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot --webroot-path=/var/lib/letsencrypt \
  -d yourdomain.com --agree-tos --email you@email.com
```

## Testing

- `curl -I http://yourdomain.com` returns 301 → HTTPS
- `curl -I https://yourdomain.com` returns 200 with security headers
- SSL Labs test (ssllabs.com) scores A or A+
- `https://yourdomain.com/health` returns 200
- Supabase Studio port (54323) not accessible from outside VPS

## Scope

**IN:** Nginx config, SSL setup, docker-compose.prod.yml, security headers, init script
**OUT:** CDN setup, DDoS protection, WAF rules, custom domain email

## File List

- `docker-compose.prod.yml` (new)
- `nginx/nginx.conf` (new)
- `nginx/conf.d/default.conf` (new)
- `scripts/init-ssl.sh` (new)
