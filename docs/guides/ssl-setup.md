# SSL Certificate Setup

SSL termination is handled by the nginx reverse proxy. Certificates must be placed in `nginx/ssl/` before starting the production stack.

## Option 1: Let's Encrypt with Certbot

### Install Certbot

```bash
# Ubuntu/Debian
sudo apt install certbot

# macOS
brew install certbot
```

### Obtain Certificate

```bash
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

### Copy to Project

```bash
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/fullchain.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/privkey.pem
chmod 600 nginx/ssl/privkey.pem
```

### Auto-Renewal

Add a cron job for automatic renewal:

```bash
# Edit crontab
crontab -e

# Add renewal + copy (runs twice daily)
0 0,12 * * * certbot renew --quiet && cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /path/to/project/nginx/ssl/fullchain.pem && cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /path/to/project/nginx/ssl/privkey.pem && docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

## Option 2: Self-Signed (Development Only)

Generate a self-signed certificate for local HTTPS testing:

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/privkey.pem \
  -out nginx/ssl/fullchain.pem \
  -subj "/CN=localhost"
```

Browsers will show a security warning with self-signed certs.

## File Locations

```
nginx/ssl/
  fullchain.pem   # Certificate chain (public)
  privkey.pem     # Private key (secret)
```

Both files are excluded from git via `.gitignore` (`*.pem` pattern).

## Verifying

After placing certs and starting the stack:

```bash
docker compose -f docker-compose.prod.yml up -d
curl -k https://localhost  # -k to allow self-signed
```

Check nginx logs if there are issues:

```bash
docker compose -f docker-compose.prod.yml logs nginx
```
