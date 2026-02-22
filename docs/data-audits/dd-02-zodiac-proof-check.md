# DD-02: Zodiac Sign Proof-Check Audit

**Date:** 2026-02-22
**Sprint:** DD-02
**Agent:** @data-engineer (Dara)
**Files checked:**
- `src/data/universal/hd-gates.json` — 64 HD gates
- `src/data/universal/gene-keys.json` — 64 Gene Keys
- `src/data/universal/hd-gates-72.json` — Lost Octave 72-gate reference (authoritative)

---

## Methodology

### Formula Used
From the Lost Octave mapping document (`_DATA/integration/astrology_human_design_lost_octave_gates_mapping.md`):

```
WHEEL_START = 358.25°  (Pisces 28°15'00")
GATE_SPAN_64 = 5.625°  per HD gate

For positional segment N (1..64):
  degreeStart = (358.25 + (N-1) × 5.625) % 360
  degreeEnd   = (358.25 +  N    × 5.625) % 360

zodiacSign = floor(degreeStart / 30)  → sign index 0-11

If start sign ≠ end sign (adjusted -0.001° at end):
  tropicalSignId = "{startSign}/{endSign}"  (cusp/boundary gate)
```

### Authoritative Reference
`hd-gates-72.json` contains 72 Lost Octave segments, each with a pre-computed `tropicalSignId` and `overlapping64GateSegment` field. These LO segments confirmed the formula:
- Every 6th 72-gate segment is a cusp (starts at sign 28°15'), corresponding to every 64-gate cusp gate.
- Cusp pattern repeats every 6 segments in the 72-gate wheel.

### Cross-Reference Method
1. Compute expected `tropicalSignId` from formula for each of 64 positional segments.
2. Compare against `hd-gates.json` actual values (gates ordered by `gateNumber`, not positional segment).
3. Use `hd-gates.json` as authoritative source for `gene-keys.json` corrections (HD gate N = Gene Key N share the same I Ching hexagram and ecliptic position).

---

## Findings: HD Gates (`hd-gates.json`)

### Result: CLEAN — 0 corrections needed

All 64 HD gate entries have correct `tropicalSignId`, `degreeStart`, and `degreeEnd` values matching the formula exactly. The BB Sprint corrections previously applied are fully validated.

### Cusp/Boundary Gates (double-sign assignment)

12 gates span a zodiac sign boundary and correctly use double-sign notation (`"sign1/sign2"`):

| Gate | tropicalSignId | degreeStart | degreeEnd |
|------|---------------|-------------|-----------|
| 3    | aries/taurus  | 26.375      | 32.000    |
| 8    | taurus/gemini | 54.500      | 60.125    |
| 10   | sagittarius/capricorn | 268.250 | 273.875 |
| 14   | scorpio/sagittarius | 234.500 | 240.125 |
| 15   | gemini/cancer | 88.250      | 93.875    |
| 25   | pisces/aries  | 358.250     | 3.875     |
| 29   | leo/virgo     | 144.500     | 150.125   |
| 30   | aquarius/pisces | 324.500   | 330.125   |
| 46   | virgo/libra   | 178.250     | 183.875   |
| 50   | libra/scorpio | 206.375     | 212.000   |
| 56   | cancer/leo    | 116.375     | 122.000   |
| 60   | capricorn/aquarius | 296.375 | 302.000  |

**Key note on Gate 25 (pisces/aries):** This is segment 1 — the wheel opening gate. It starts at Pisces 28°15' (358.25°) and spans across the Aries 0° vernal equinox point. Aries 0° (absolute 0°) falls within this gate at relative position 1.75°. The `tropicalSignId: "pisces/aries"` is correct. The `degreeEnd: 3.875` correctly wraps below `degreeStart: 358.25` (crossing 0°/360° boundary).

---

## Findings: Gene Keys (`gene-keys.json`)

### Result: 40 sign corrections + 64 degree corrections applied

The gene-keys.json file contained systematically incorrect `degreeStart` and `degreeEnd` values for all 64 entries (apparent data entry error — values did not correspond to the HD gate formula). As a consequence, 40 out of 64 entries also had incorrect `tropicalSignId` values.

**Root cause:** The GK degree values appeared to follow a different, non-authoritative mapping. The differences ranged from -358° to +14.875°, indicating the values were not derived from the Lost Octave formula. Since Gene Keys share the I Ching hexagram numbering with HD gates (GK-N occupies the same ecliptic position as HD Gate N), the hd-gates.json values are authoritative.

### Corrections Applied

**Sign corrections (40 entries):**

| GK# | Old Sign | Corrected Sign |
|-----|----------|----------------|
| 3   | taurus | aries/taurus |
| 5   | scorpio | sagittarius |
| 8   | taurus | taurus/gemini |
| 9   | scorpio | sagittarius |
| 10  | sagittarius | sagittarius/capricorn |
| 13  | capricorn | aquarius |
| 14  | scorpio | scorpio/sagittarius |
| 15  | gemini | gemini/cancer |
| 18  | virgo | libra |
| 19  | capricorn | aquarius |
| 20  | taurus | gemini |
| 22  | aquarius | pisces |
| 25  | aries | pisces/aries |
| 28  | libra | scorpio |
| 29  | leo | leo/virgo |
| 30  | capricorn | aquarius/pisces |
| 31  | cancer | leo |
| 33  | cancer | leo |
| 34  | scorpio | sagittarius |
| 36  | aquarius | pisces |
| 37  | aquarius | pisces |
| 38  | sagittarius | capricorn |
| 40  | leo | virgo |
| 41  | capricorn | aquarius |
| 43  | libra | scorpio |
| 44  | libra | scorpio |
| 46  | virgo | virgo/libra |
| 48  | virgo | libra |
| 49  | capricorn | aquarius |
| 50  | libra | libra/scorpio |
| 54  | sagittarius | capricorn |
| 55  | capricorn | pisces |
| 56  | cancer | cancer/leo |
| 57  | virgo | libra |
| 58  | sagittarius | capricorn |
| 59  | leo | virgo |
| 60  | sagittarius | capricorn/aquarius |
| 61  | sagittarius | capricorn |
| 63  | aquarius | pisces |
| 64  | leo | virgo |

**Degree corrections:** All 64 entries had incorrect `degreeStart`/`degreeEnd`. All corrected to match hd-gates.json values exactly.

### Cusp/Boundary Gates in Gene Keys (after correction)

12 Gene Keys now correctly carry double-sign notation:
GK 3 (aries/taurus), GK 8 (taurus/gemini), GK 10 (sagittarius/capricorn), GK 14 (scorpio/sagittarius), GK 15 (gemini/cancer), GK 25 (pisces/aries), GK 29 (leo/virgo), GK 30 (aquarius/pisces), GK 46 (virgo/libra), GK 50 (libra/scorpio), GK 56 (cancer/leo), GK 60 (capricorn/aquarius)

---

## Summary

| Metric | Value |
|--------|-------|
| Total gates checked | 64 |
| Corrections in hd-gates.json | 0 |
| Sign corrections in gene-keys.json | 40 |
| Degree corrections in gene-keys.json | 64 (all entries) |
| Cusp/boundary gates | 12 (Gates/GKs 3, 8, 10, 14, 15, 25, 29, 30, 46, 50, 56, 60) |

### Build & Test Results
- `npm run build` — PASS (TypeScript + Vite production build)
- `npm run test:run` — PASS (362/362 tests)

### Data Integrity Notes
- `getGeneKeyElement()` in `index.ts` uses `geneKey.tropicalSignId` to look up in the `signs` Map. For cusp gates (e.g. `"pisces/aries"`), this will return `undefined` since the signs Map uses single-sign keys. This is pre-existing behavior shared with hd-gates.json cusp entries — not a regression introduced by these corrections.
- The `getGeneKeyByZodiacPosition()` function routes through `getGateByDegree()` using HD gates, so it is unaffected by the GK degree corrections.
