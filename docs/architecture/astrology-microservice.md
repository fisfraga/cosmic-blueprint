# Architecture: Python Astrology Microservice

**Author:** Aria (@architect)
**Date:** 2026-02-22
**Status:** Approved — ready for implementation
**Scope:** Replace FreeAstroAPI dependency with a self-hosted Python microservice using Swiss Ephemeris (Kerykeion)

---

## 1. Context & Problem Statement

The app calculates natal charts from three wisdom traditions (Astrology, HD, Gene Keys) — all derived from the same ecliptic longitudes. Planetary positions are computed client-side via `astronomy-engine` (VSOP87D). However, **house positions and aspects** were delegated to FreeAstroAPI.

**Two critical issues discovered during analysis:**

1. `/api/astrology` does not exist in `server.js` — the FreeAstroAPI proxy route was never implemented for Docker/VPS deployment. The feature is currently gated off (`VITE_ASTROLOGY_API_ENABLED=false`).
2. Even if the route existed, FreeAstroAPI is a single point of failure with no house system flexibility.

**Decision:** Build a self-hosted Python microservice using Kerykeion (Swiss Ephemeris binding) and add the `/api/astrology` proxy to `server.js`.

---

## 2. Target Architecture

```
Browser (React)
    │
    │  POST /api/astrology
    ▼
Express server.js (port 3000)          ← add proxy route here
    │
    │  POST http://astrology-api:8000/chart/natal
    ▼
Python FastAPI (port 8000, internal)   ← new service
    │
    │  Kerykeion / pyswisseph
    ▼
Swiss Ephemeris (ephemeris files)      ← accuracy: ±0.0005°
```

**Network topology:**
- `app` container (Express, port 3000) — exposed via nginx
- `astrology-api` container (FastAPI, port 8000) — **internal only, never exposed to nginx/internet**
- Both share a Docker bridge network (`cosmic-net`)
- Nginx routes only 80/443 → app:3000, not the Python service

---

## 3. Python Service Design

### 3.1 Directory Structure

```
cosmic-blueprint/
└── astrology-service/          ← new directory
    ├── Dockerfile
    ├── requirements.txt
    ├── app/
    │   ├── main.py             ← FastAPI app, routes
    │   ├── calculator.py       ← Kerykeion wrapper
    │   ├── transformer.py      ← Map Kerykeion → API response format
    │   └── models.py           ← Pydantic request/response models
    └── ephemeris/              ← Swiss Ephemeris data files (seas_18.se1, etc.)
```

### 3.2 Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/chart/natal` | Full natal chart: planets, houses, aspects |
| `POST` | `/chart/houses` | Houses only with house system selector |
| `POST` | `/chart/aspects` | Aspects only with configurable orbs |
| `GET` | `/health` | Health check (used by Docker healthcheck) |

### 3.3 Request Model

```python
# app/models.py
class ChartRequest(BaseModel):
    year: int
    month: int       # 1-12
    day: int
    hour: int        # 0-23
    minute: int      # 0-59
    latitude: float  # decimal degrees, negative = south
    longitude: float # decimal degrees, negative = west
    timezone: str    # IANA tz string, e.g. "America/New_York"
    house_system: str = "P"  # P=Placidus, K=Koch, W=Whole Sign, E=Equal, R=Regiomontanus
```

### 3.4 Response Model (TypeScript-compatible JSON)

```python
class PlanetResult(BaseModel):
    name: str           # "Sun", "Moon", etc.
    sign: str           # "Ari", "Tau", etc.  (3-letter Kerykeion format)
    sign_num: int       # 0-11
    position: float     # degree within sign (0-30)
    abs_pos: float      # absolute ecliptic longitude (0-360)
    house: int          # 1-12
    retrograde: bool
    speed: float        # degrees/day (positive = direct, negative = retrograde)

class HouseResult(BaseModel):
    house: int          # 1-12
    sign: str           # 3-letter sign name
    sign_num: int       # 0-11
    position: float     # degree of house cusp within sign (0-30)

class AspectResult(BaseModel):
    p1_name: str        # First planet name
    p2_name: str        # Second planet name
    aspect: str         # "conjunction", "opposition", etc.
    orbit: float        # orb in degrees (positive = separating, negative = applying)
    aspect_degrees: int # Exact aspect angle (0, 60, 90, 120, 180)
    diff: float         # Actual angular difference

class ChartResponse(BaseModel):
    planets: list[PlanetResult]
    houses: list[HouseResult]
    aspects: list[AspectResult]
```

**Why this format?** It intentionally mirrors FreeAstroAPI's field naming (`name`, `sign`, `abs_pos`, `p1_name`, etc.) so `astrologyAPI.ts` requires minimal changes — only the transformer function needs updating, not the internal types.

### 3.5 Core Implementation

```python
# app/calculator.py
from kerykeion import AstrologicalSubject
from zoneinfo import ZoneInfo
from datetime import datetime

HOUSE_SYSTEMS = {
    "P": "Placidus",
    "K": "Koch",
    "W": "Whole Sign",
    "E": "Equal",
    "R": "Regiomontanus",
}

def calculate_natal_chart(request: ChartRequest) -> dict:
    """
    Calculate full natal chart using Swiss Ephemeris via Kerykeion.

    Note: Kerykeion accepts local time + timezone.
    We pass birth time as local (not UTC) — Kerykeion handles the conversion.
    """
    subject = AstrologicalSubject(
        name="chart",
        year=request.year,
        month=request.month,
        day=request.day,
        hour=request.hour,
        minute=request.minute,
        lat=request.latitude,
        lng=request.longitude,
        tz_str=request.timezone,
        zodiac_type="Tropic",  # Tropical zodiac
        houses_system_identifier=request.house_system,
        online=False,          # Use local Swiss Ephemeris files
    )

    return {
        "planets": extract_planets(subject),
        "houses": extract_houses(subject),
        "aspects": extract_aspects(subject),
    }
```

### 3.6 Planets Included

| Planet | Kerykeion Attribute | HD Relevance |
|--------|--------------------|----|
| Sun | `subject.sun` | Personality gate |
| Moon | `subject.moon` | Personality gate |
| Mercury | `subject.mercury` | Personality gate |
| Venus | `subject.venus` | Personality gate |
| Mars | `subject.mars` | Personality gate |
| Jupiter | `subject.jupiter` | Personality gate |
| Saturn | `subject.saturn` | Personality gate |
| Uranus | `subject.uranus` | Personality gate |
| Neptune | `subject.neptune` | Personality gate |
| Pluto | `subject.pluto` | Personality gate |
| North Node | `subject.mean_node` | Design gate |
| Chiron | `subject.chiron` | Optional |

### 3.7 Dockerfile

```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install build deps for pyswisseph
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
```

### 3.8 requirements.txt

```
fastapi==0.115.0
uvicorn[standard]==0.32.0
kerykeion==4.20.0
pydantic==2.9.0
```

> **Note on ephemeris files:** Kerykeion downloads Swiss Ephemeris files on first use by default. For production Docker, bundle the core files (`sepl_18.se1`, `semo_18.se1`, `seas_18.se1` — covers years 1800–2400) in the image under `astrology-service/ephemeris/`. Set `SE_EPHE_PATH` env var to this path.

---

## 4. Express Integration (server.js)

Add a single proxy route to `server.js`. The route:
- Receives `POST /api/astrology` from the React app (same interface as before)
- Transforms the `BirthData` format into the Python service's `ChartRequest` format
- Proxies to the Python service
- Returns the response JSON

```javascript
// Add to server.js after the /api/claude route

const ASTROLOGY_SERVICE_URL = process.env.ASTROLOGY_SERVICE_URL || 'http://astrology-api:8000';

// --- Astrology API proxy ---
app.post('/api/astrology', express.json({ limit: '50kb' }), async (req, res) => {
  const { birthData } = req.body;

  if (!birthData) {
    return res.status(400).json({ error: 'Missing birthData' });
  }

  try {
    const serviceRes = await fetch(`${ASTROLOGY_SERVICE_URL}/chart/natal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        year: parseInt(birthData.dateOfBirth.split('-')[0]),
        month: parseInt(birthData.dateOfBirth.split('-')[1]),
        day: parseInt(birthData.dateOfBirth.split('-')[2]),
        hour: parseInt(birthData.timeOfBirth.split(':')[0]),
        minute: parseInt(birthData.timeOfBirth.split(':')[1]),
        latitude: birthData.latitude,
        longitude: birthData.longitude,
        timezone: birthData.timezone,
        house_system: 'P', // Placidus default, can be made configurable later
      }),
    });

    if (!serviceRes.ok) {
      const err = await serviceRes.json().catch(() => ({}));
      console.error('Astrology service error:', serviceRes.status, err);
      return res.status(serviceRes.status).json({ error: 'Astrology service error' });
    }

    const data = await serviceRes.json();
    return res.json(data);
  } catch (error) {
    console.error('Astrology service unreachable:', error);
    return res.status(503).json({ error: 'Astrology service unavailable' });
  }
});
```

**Dev setup:** In local development, `ASTROLOGY_SERVICE_URL` is set to `http://localhost:8000` so the Python service can be started separately.

---

## 5. TypeScript Adapter Changes (`astrologyAPI.ts`)

The response from the Python service uses the **same field names** as FreeAstroAPI (`name`, `sign`, `abs_pos`, `p1_name`, etc.), so the existing `transformFreeAstroResponse()` function works with **zero changes**.

**Changes required:**
1. Rename `FreeAstroPlanet` → `AstroServicePlanet` (cosmetic only)
2. Remove the provider name from comments/logs
3. Update `src/config/astrology.ts` — change `getAstrologyProviderName()` to return `'Swiss Ephemeris'`
4. The `VITE_ASTROLOGY_API_ENABLED` flag still controls whether the API is called — this is intentional as a feature flag

**No changes to:**
- Internal types (`NatalPlacement`, `HousePosition`, `NatalAspect`, `AstrologyAPIResponse`)
- Any components that consume the API data
- Chart calculation pipeline
- HD/GK gate mapping logic

---

## 6. Docker Deployment (`docker-compose.prod.yml`)

```yaml
services:
  app:
    image: ghcr.io/fisfraga/cosmic-blueprint:latest
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - ASTROLOGY_SERVICE_URL=http://astrology-api:8000
    env_file: .env.production
    expose:
      - "3000"
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
    depends_on:
      astrology-api:
        condition: service_healthy
    networks:
      - cosmic-net

  astrology-api:
    build:
      context: ./astrology-service
      dockerfile: Dockerfile
    image: ghcr.io/fisfraga/cosmic-blueprint-astrology:latest
    restart: unless-stopped
    environment:
      - SE_EPHE_PATH=/app/ephemeris
    expose:
      - "8000"          # Internal only — NOT mapped to host
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:8000/health"]
      interval: 30s
      timeout: 5s
      retries: 3
    networks:
      - cosmic-net

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - nginx-logs:/var/log/nginx
    depends_on:
      app:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - cosmic-net

volumes:
  nginx-logs:

networks:
  cosmic-net:
    driver: bridge
```

**Security note:** The `astrology-api` container is `expose`d (not `ports`), meaning it is only reachable within the Docker network — not from the internet.

---

## 7. Environment Configuration

### `.env.production` additions

```bash
# Astrology microservice
VITE_ASTROLOGY_API_ENABLED=true
ASTROLOGY_SERVICE_URL=http://astrology-api:8000
```

### Local development (`.env`)

```bash
# For local dev: start Python service separately on port 8000
VITE_ASTROLOGY_API_ENABLED=true
ASTROLOGY_SERVICE_URL=http://localhost:8000
```

### Vite dev proxy addition

Add to `vite.config.ts` alongside the existing `claudeApiProxy()` — a simple HTTP proxy for `/api/astrology` → `localhost:8000`:

```typescript
server: {
  proxy: {
    '/api/astrology': {
      target: 'http://localhost:8000',
      rewrite: (path) => path.replace('/api/astrology', '/chart/natal'),
      changeOrigin: true,
    }
  }
}
```

---

## 8. CI/CD Impact

The GitHub Actions workflow (`deploy.yml`) needs additions for the Python service:

1. Build and push `cosmic-blueprint-astrology` Docker image to GHCR
2. On VPS deploy: `docker compose pull && docker compose up -d` picks up both services
3. Separate image tag: `ghcr.io/fisfraga/cosmic-blueprint-astrology:latest`

**Delegation:** CI/CD changes → @devops (Gage)

---

## 9. Error Handling & Fallback Strategy

| Failure Scenario | Behavior |
|-----------------|----------|
| Python service unreachable | Express returns 503 → `astrologyAPI.ts` catches and returns `null` → app renders without house/aspect data (same as current disabled state) |
| Python service slow (>5s) | Express timeout → 503 → graceful null |
| Kerykeion calculation error | Python returns 500 with error detail → logged, null returned |
| Feature flag off | `isAstrologyAPIConfigured()` returns false → `fetchAstrologyChart()` returns null immediately, Python service never called |

The app already handles `null` from `fetchAstrologyChart()` — profiles render without house data when the service is unavailable. No frontend changes needed for error handling.

---

## 10. Accuracy Comparison

| Metric | astronomy-engine (current) | Python / Swiss Ephemeris (target) |
|--------|---------------------------|----------------------------------|
| Sun/Moon precision | ±0.0005° (VSOP87D) | ±0.0005° |
| Outer planets | ±0.01° (VSOP87D) | ±0.0001° |
| House cusps | N/A (external API) | ±0.001° (Placidus) |
| Aspects | Calculated locally (adequate) | Exact to 0.001° |
| Date range | 2000–2100 (sufficient) | ~5400 BCE – 5400 CE |

**Verdict:** Inner planet accuracy is equivalent. Outer planet accuracy improves 100×. Houses now locally computed with full system flexibility.

---

## 11. Migration Strategy

### Phase 1: Build & test locally (Sprint AA-01)
- Build `astrology-service/` with Kerykeion
- Test against known birth charts (compare with astro.com as reference)
- Tolerance: < 0.1° for all planets, < 0.5° for house cusps

### Phase 2: Add Express route (Sprint AA-02)
- Add `/api/astrology` proxy to `server.js`
- Update `astrologyAPI.ts` to clean up FreeAstroAPI references
- Enable `VITE_ASTROLOGY_API_ENABLED=true` in local `.env`

### Phase 3: Docker integration (Sprint AA-03)
- Update `docker-compose.prod.yml`
- Add CI/CD steps via @devops
- Deploy to VPS, run accuracy tests

### Phase 4: Cutover
- Remove `FREEASTRO_API_KEY` from production env
- Remove FreeAstroAPI code comments/references
- Feature permanently on (`VITE_ASTROLOGY_API_ENABLED` can be simplified or removed)

---

## 12. What astronomy-engine Keeps Doing

The Python service replaces FreeAstroAPI only. `astronomy-engine` continues to handle:
- Planetary positions for HD/GK gate activation (`chartCalculation.ts`)
- Design date calculation (88° binary search)
- Retrograde detection
- Pre-computed ephemeris lookup (2020–2035 fast path)
- Client-side transit calculations (`transits.ts`)

There is no conflict — the two systems serve different layers.

---

## 13. Story Scope for @dev

This architecture produces 4 implementation stories:

| Story | Title | Files |
|-------|-------|-------|
| AA-01 | Build Python astrology service | `astrology-service/` (new) |
| AA-02 | Add Express proxy route + update adapter | `server.js`, `astrologyAPI.ts`, `config/astrology.ts` |
| AA-03 | Docker compose + dev proxy | `docker-compose.prod.yml`, `vite.config.ts` |
| AA-04 | CI/CD pipeline for Python image | `.github/workflows/deploy.yml` |

**AA-04 is @devops exclusive** (git push / CI).

---

— Aria, arquitetando o futuro 🏗️
