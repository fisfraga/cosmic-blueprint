from pydantic import BaseModel, Field


class ChartRequest(BaseModel):
    year: int = Field(..., ge=1, le=9999)
    month: int = Field(..., ge=1, le=12)
    day: int = Field(..., ge=1, le=31)
    hour: int = Field(..., ge=0, le=23)
    minute: int = Field(..., ge=0, le=59)
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    timezone: str = Field(..., description="IANA timezone string, e.g. 'America/New_York'")
    house_system: str = Field(
        default="P",
        description="P=Placidus, K=Koch, W=Whole Sign, E=Equal, R=Regiomontanus",
    )


class PlanetResult(BaseModel):
    name: str
    sign: str
    sign_num: int
    position: float   # degree within sign (0-30)
    abs_pos: float    # absolute ecliptic longitude (0-360)
    house: int        # 1-12
    retrograde: bool
    speed: float = 0.0  # degrees/day — not provided by Kerykeion, kept for interface compat


class HouseResult(BaseModel):
    house: int        # 1-12
    sign: str
    sign_num: int
    position: float   # degree of cusp within sign (0-30)


class AspectResult(BaseModel):
    p1_name: str
    p2_name: str
    aspect: str
    orbit: float          # orb in degrees (positive = separating, negative = applying)
    aspect_degrees: int   # exact aspect angle
    diff: float           # actual angular difference


class ChartResponse(BaseModel):
    planets: list[PlanetResult]
    houses: list[HouseResult]
    aspects: list[AspectResult]
