FROM python:3.12-slim

WORKDIR /app

# Build deps for pyswisseph (C extension)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    libc-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-warm ephemeris files during image build (downloads ~15MB from astro.com)
# This avoids a cold-start delay on first request in production.
RUN python -c "\
from kerykeion import AstrologicalSubject; \
s = AstrologicalSubject('warmup', 2000, 1, 1, 12, 0, lat=51.5074, lng=-0.1278, tz_str='Europe/London', online=False); \
print('Ephemeris files cached:', s.sun.abs_pos) \
"

COPY . .

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
