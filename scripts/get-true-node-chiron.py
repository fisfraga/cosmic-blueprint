"""
Helper script: get True Node and Chiron positions via Kerykeion/Swiss Ephemeris.

Usage:
  python get-true-node-chiron.py YEAR MONTH DAY HOUR MINUTE LAT LNG TZ

Output: JSON with true_node and chiron absolute ecliptic longitudes.
"""
import sys
import json
from kerykeion import AstrologicalSubject

def main():
    year, month, day, hour, minute = int(sys.argv[1]), int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
    lat, lng, tz = float(sys.argv[6]), float(sys.argv[7]), sys.argv[8]

    s = AstrologicalSubject(
        name="calc",
        year=year, month=month, day=day,
        hour=hour, minute=minute,
        lat=lat, lng=lng,
        tz_str=tz,
        zodiac_type="Tropic",
        houses_system_identifier="P",
        online=False,
    )

    result = {
        "true_node": round(float(s.true_node.abs_pos), 6),
        "chiron": round(float(s.chiron.abs_pos), 6),
        "true_node_retrograde": bool(s.true_node.retrograde),
        "chiron_retrograde": bool(s.chiron.retrograde),
    }
    print(json.dumps(result))

if __name__ == "__main__":
    main()
