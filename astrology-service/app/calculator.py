"""
Kerykeion wrapper for Swiss Ephemeris natal chart calculation.

Returns raw planet/house/aspect data in a format compatible with
the existing astrologyAPI.ts transformer (same field names as FreeAstroAPI).
"""

from kerykeion import AstrologicalSubject
from .models import ChartRequest, ChartResponse, PlanetResult, HouseResult, AspectResult

# Ordered list of planet attributes on AstrologicalSubject
# Kerykeion returns house as a string name — map to integer
HOUSE_NAME_TO_INT: dict[str, int] = {
    "First_House": 1, "Second_House": 2, "Third_House": 3,
    "Fourth_House": 4, "Fifth_House": 5, "Sixth_House": 6,
    "Seventh_House": 7, "Eighth_House": 8, "Ninth_House": 9,
    "Tenth_House": 10, "Eleventh_House": 11, "Twelfth_House": 12,
}


def _house_to_int(raw: object) -> int:
    if isinstance(raw, int):
        return raw
    if isinstance(raw, str):
        return HOUSE_NAME_TO_INT.get(raw, 1)
    try:
        return int(raw)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return 1


PLANET_ATTRS = [
    "sun", "moon", "mercury", "venus", "mars",
    "jupiter", "saturn", "uranus", "neptune", "pluto",
    "mean_node",  # North Node — maps to 'Mean_Node' in name
    "chiron",
]

# Aspect definitions: (name, exact_angle, max_orb)
ASPECT_DEFINITIONS = [
    ("conjunction",     0,   8.0),
    ("opposition",    180,   8.0),
    ("trine",         120,   6.0),
    ("square",         90,   6.0),
    ("sextile",        60,   4.0),
    ("quincunx",      150,   2.5),
    ("semisextile",    30,   1.5),
    ("semisquare",     45,   1.5),
    ("sesquiquadrate", 135,  1.5),
    ("quintile",       72,   1.5),
]


def _angular_distance(a: float, b: float) -> float:
    """Shortest arc between two absolute longitudes (0-360). Always <= 180."""
    diff = abs(a - b) % 360
    return diff if diff <= 180 else 360 - diff


def _extract_planets(subject: AstrologicalSubject) -> list[PlanetResult]:
    planets: list[PlanetResult] = []
    for attr in PLANET_ATTRS:
        point = getattr(subject, attr, None)
        if point is None:
            continue
        planets.append(
            PlanetResult(
                name=point.name,
                sign=point.sign,
                sign_num=point.sign_num,
                position=round(float(point.position), 4),
                abs_pos=round(float(point.abs_pos), 4),
                house=_house_to_int(point.house),
                retrograde=bool(point.retrograde),
                # Kerykeion 4.x does not expose daily speed; retrograde bool is authoritative
                speed=0.0,
            )
        )
    return planets


def _extract_houses(subject: AstrologicalSubject) -> list[HouseResult]:
    houses: list[HouseResult] = []
    house_attrs = [
        "first_house", "second_house", "third_house", "fourth_house",
        "fifth_house", "sixth_house", "seventh_house", "eighth_house",
        "ninth_house", "tenth_house", "eleventh_house", "twelfth_house",
    ]
    for i, attr in enumerate(house_attrs, start=1):
        cusp = getattr(subject, attr, None)
        if cusp is None:
            continue
        houses.append(
            HouseResult(
                house=i,
                sign=cusp.sign,
                sign_num=cusp.sign_num,
                position=round(float(cusp.position), 4),
            )
        )
    return houses


def _extract_aspects(planets: list[PlanetResult]) -> list[AspectResult]:
    aspects: list[AspectResult] = []
    for i, p1 in enumerate(planets):
        for p2 in planets[i + 1 :]:
            diff = _angular_distance(p1.abs_pos, p2.abs_pos)
            for aspect_name, angle, max_orb in ASPECT_DEFINITIONS:
                orbit = diff - angle
                if abs(orbit) <= max_orb:
                    # Positive orbit = separating (diff > exact), negative = applying
                    aspects.append(
                        AspectResult(
                            p1_name=p1.name,
                            p2_name=p2.name,
                            aspect=aspect_name,
                            orbit=round(orbit, 4),
                            aspect_degrees=angle,
                            diff=round(diff, 4),
                        )
                    )
                    break  # report only the closest matching aspect per pair
    return aspects


def calculate_natal_chart(req: ChartRequest) -> ChartResponse:
    """
    Calculate a full natal chart using Swiss Ephemeris via Kerykeion.

    Birth time is passed as local time + IANA timezone.
    Kerykeion converts to UTC internally for the ephemeris lookup.
    """
    subject = AstrologicalSubject(
        name="chart",
        year=req.year,
        month=req.month,
        day=req.day,
        hour=req.hour,
        minute=req.minute,
        lat=req.latitude,
        lng=req.longitude,
        tz_str=req.timezone,
        zodiac_type="Tropic",                       # Tropical zodiac
        houses_system_identifier=req.house_system,  # P, K, W, E, R
        online=False,                               # Use cached/bundled ephemeris
    )

    planets = _extract_planets(subject)
    houses = _extract_houses(subject)
    aspects = _extract_aspects(planets)

    return ChartResponse(planets=planets, houses=houses, aspects=aspects)
