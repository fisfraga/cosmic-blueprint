from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .models import ChartRequest, ChartResponse
from .calculator import calculate_natal_chart

app = FastAPI(
    title="Cosmic Blueprint Astrology Service",
    description="Swiss Ephemeris natal chart calculations via Kerykeion",
    version="1.0.0",
)

# Internal service — CORS is restricted; only Express (server.js) calls this
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://app:3000"],
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chart/natal", response_model=ChartResponse)
def natal_chart(req: ChartRequest):
    """
    Calculate a full natal chart.

    Returns planets, houses (in the requested house system), and aspects.
    Response field names match FreeAstroAPI format for drop-in compatibility
    with the existing astrologyAPI.ts transformer.
    """
    try:
        return calculate_natal_chart(req)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Chart calculation failed: {exc}") from exc
