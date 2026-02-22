# Astrology Service

Swiss Ephemeris natal chart calculations via FastAPI + Kerykeion.

## Local development

```bash
cd astrology-service
python -m venv .venv
source .venv/bin/activate      # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Service runs at `http://localhost:8000`. The Vite dev server proxies `/api/astrology` to it automatically.

## Endpoints

- `GET  /health` — health check
- `POST /chart/natal` — full natal chart (planets, houses, aspects)

## House systems

Pass `house_system` in the request body:

| Code | System |
|------|--------|
| `P` | Placidus (default) |
| `K` | Koch |
| `W` | Whole Sign |
| `E` | Equal House |
| `R` | Regiomontanus |

## Example request

```bash
curl -X POST http://localhost:8000/chart/natal \
  -H "Content-Type: application/json" \
  -d '{
    "year": 1994, "month": 10, "day": 18,
    "hour": 8, "minute": 10,
    "latitude": -23.5505, "longitude": -46.6333,
    "timezone": "America/Sao_Paulo",
    "house_system": "P"
  }'
```
