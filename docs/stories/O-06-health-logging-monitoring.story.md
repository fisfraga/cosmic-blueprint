# O-06: Health Checks, Logging & Monitoring Baseline

**Status:** Ready
**Priority:** MEDIUM
**Points:** 3
**Sprint:** O — Infrastructure
**Depends on:** O-01 (server.js must exist)

## Story

As an operator running the app on a VPS, I need health checks, structured logging, and basic monitoring, so that I know when something breaks and can debug issues from logs without SSH-ing into the server.

## Problem

The production server (from O-01) will have a basic `/health` endpoint, but:
- No structured logging (JSON format for log aggregation)
- No request logging (which endpoints are hit, response times)
- No Docker health check configuration for auto-restart
- No log rotation (logs can fill disk)
- No uptime monitoring

## Acceptance Criteria

- [ ] `GET /health` returns JSON: `{ status: "ok", version: "...", uptime: N }`
- [ ] `GET /health` checks database connectivity (Supabase ping) and returns degraded status if DB is unreachable
- [ ] All HTTP requests logged in structured JSON format (timestamp, method, path, status, duration_ms)
- [ ] API errors logged with stack traces in production
- [ ] Docker Compose configures log rotation (`max-size`, `max-file`)
- [ ] Docker health check auto-restarts unhealthy containers
- [ ] `scripts/check-health.sh` — simple curl-based health check for external monitoring (cron/uptime services)

## Dev Notes

### Health endpoint (enhance from O-01)

```typescript
app.get('/health', async (req, res) => {
  const uptime = process.uptime();
  const version = process.env.npm_package_version || 'unknown';

  let dbStatus = 'ok';
  try {
    // Quick Supabase connectivity check
    const { error } = await supabase.from('cosmic_profiles').select('id').limit(1);
    if (error) dbStatus = 'degraded';
  } catch {
    dbStatus = 'unreachable';
  }

  const status = dbStatus === 'ok' ? 'ok' : 'degraded';
  res.status(status === 'ok' ? 200 : 503).json({ status, version, uptime, db: dbStatus });
});
```

### Structured logging

Use `pino` (fast, JSON-native logger) or simple `console.log(JSON.stringify(...))`:

```typescript
// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration_ms: Date.now() - start,
    }));
  });
  next();
});
```

### Docker log rotation

```yaml
# In docker-compose.prod.yml
services:
  app:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

### External health check script

```bash
#!/bin/bash
# scripts/check-health.sh
HEALTH_URL="${1:-http://localhost:3000/health}"
RESPONSE=$(curl -sf "$HEALTH_URL")
if [ $? -ne 0 ]; then
  echo "CRITICAL: Health check failed"
  exit 2
fi
STATUS=$(echo "$RESPONSE" | jq -r '.status')
if [ "$STATUS" != "ok" ]; then
  echo "WARNING: Status is $STATUS"
  exit 1
fi
echo "OK: $RESPONSE"
exit 0
```

## Testing

- `curl localhost:3000/health` returns JSON with status, version, uptime, db
- Stop Supabase → health returns `{ status: "degraded", db: "unreachable" }`
- Docker logs show structured JSON per request
- After 3 failed health checks, Docker restarts the container
- Log files don't exceed 30MB total (3 x 10MB rotation)

## Scope

**IN:** Health endpoint, request logging, Docker log rotation, health check script
**OUT:** Prometheus/Grafana, log aggregation (ELK/Loki), alerting (PagerDuty/Slack), APM

## File List

- `server.js` (modify — enhance health endpoint, add request logging)
- `docker-compose.prod.yml` (modify — add logging config)
- `scripts/check-health.sh` (new)
- `package.json` (modify — if adding pino dependency)
