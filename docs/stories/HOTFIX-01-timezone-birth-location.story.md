# HOTFIX-01: Birth Location Timezone Resolution

**Status:** Ready
**Priority:** CRITICAL
**Points:** 8
**Source:** DB-AUDIT CRIT-01

## Story

As a user who was born in a different timezone than where I currently live, I need the app to calculate my natal chart using my **birth location's timezone** (not my browser's timezone), so that my planetary positions, house cusps, and HD gate activations are accurate.

## Problem

`chartCalculation.ts` (lines 563-572) currently uses `Intl.DateTimeFormat().resolvedOptions().timeZone` (the browser's local timezone) when converting birth date/time to UTC for ephemeris calculations. This produces incorrect charts for anyone whose birth timezone differs from their current location.

**Example:** A user born in Tokyo (UTC+9) at 14:00, now living in New York (UTC-5), gets a chart calculated as if they were born at 14:00 UTC-5 instead of 14:00 UTC+9 — a 14-hour error that shifts every placement.

## Acceptance Criteria

- [ ] Given a birth location with lat/lng coordinates, the system determines the correct IANA timezone for that location
- [ ] Given birth date + time + resolved timezone, the UTC conversion uses the birth timezone (not browser TZ)
- [ ] Given an existing profile with coordinates, recalculating produces the same or corrected chart
- [ ] Given a location near a timezone boundary, the resolution uses the precise lat/lng (not city-level approximation)
- [ ] The timezone resolution works offline (no external API call at chart calculation time)

## Dev Notes

### Approach: Offline timezone lookup from coordinates

Use a library that maps lat/lng to IANA timezone without network calls:

1. **`geo-tz`** (npm) — ~3MB, uses OpenStreetMap timezone boundaries. `find(lat, lng)` returns IANA timezone string array.
2. **`tz-lookup`** (npm) — ~800KB, simpler but less accurate at boundaries.
3. **`timezone-lookup`** — Another option, evaluate size/accuracy tradeoff.

### Implementation steps

1. Install chosen library (`geo-tz` recommended for accuracy)
2. Create `src/services/timezoneResolver.ts`:
   ```typescript
   export function getTimezoneForLocation(lat: number, lng: number): string
   ```
3. Modify `chartCalculation.ts`:
   - In the birth-to-UTC conversion, resolve timezone from birth coordinates
   - Replace `Intl.DateTimeFormat()` usage with resolved timezone
   - Use the resolved timezone with `date-fns-tz` or manual UTC offset calculation
4. Update `ProfileCreationForm.tsx` — auto-select timezone from coordinates (the geocoding service from TD-N-01 already provides lat/lng)
5. Add tests for timezone edge cases (DST transitions, international date line, equatorial zones)

### Risk

- **Bundle size**: `geo-tz` adds ~3MB. Consider lazy-loading or a lighter alternative.
- **Historical timezones**: Some locations changed timezone rules over decades. Libraries handle this via the IANA database, but verify for dates before 1970.
- **Existing profiles**: Charts calculated with the wrong timezone need a migration path or recalculation prompt.

## Testing

- Unit: timezone resolution for known cities (Tokyo, New York, London, São Paulo, Sydney, Mumbai)
- Unit: UTC conversion with birth timezone vs browser timezone produces different results
- Unit: DST edge cases (born during spring-forward / fall-back hour)
- Integration: Full chart calculation with timezone-corrected birth time

## Scope

**IN:** Timezone resolution from coordinates, chart calculation fix, form auto-detection
**OUT:** Historical timezone migration for existing profiles (separate story), timezone display in UI

## File List

- `src/services/timezoneResolver.ts` (new)
- `src/services/chartCalculation.ts` (modify — UTC conversion)
- `src/components/ProfileCreationForm.tsx` (modify — auto-select TZ)
- `src/services/timezoneResolver.test.ts` (new)
- `package.json` (new dependency)
