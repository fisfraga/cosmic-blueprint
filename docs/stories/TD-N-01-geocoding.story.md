# Story TD-N-01: Add Geocoding to ProfileCreationForm
**Epic:** EPIC-TD-01 — Technical Debt Resolution
**Sprint:** N
**Status:** Ready
**Points:** 13
**Agent:** @dev (Dex)

---

## Description

**CRITICAL UX DEBT (UX-11).** The `ProfileCreationForm` requires users to manually enter birth city, timezone, and latitude/longitude coordinates. Knowing your birth coordinates to 4 decimal places is not something most people know. This creates an immediate barrier to entry and results in inaccurate charts when users guess coordinates.

This story replaces manual coordinate fields with a city name search (geocoding) that automatically resolves coordinates and timezone from the birth city name.

## Acceptance Criteria

### Geocoding UX
- [ ] Birth location field accepts a city name (free text input)
- [ ] As the user types, a dropdown of matching city suggestions appears (autocomplete)
- [ ] Selecting a city auto-populates: `birthCity`, `latitude`, `longitude`, `timezone`
- [ ] Auto-populated fields are displayed as read-only confirmations (user can see what was resolved)
- [ ] User can manually override auto-populated fields if needed
- [ ] Debounce: suggestions appear after 300ms of typing pause, not on every keystroke
- [ ] Minimum 3 characters before suggestions are fetched

### API Integration
- [ ] Geocoding API used: Nominatim (OpenStreetMap) — free, no API key required for low volume
  - Endpoint: `https://nominatim.openstreetmap.org/search?q={city}&format=json&limit=5`
  - Usage policy: include `User-Agent: CosmicBlueprint/1.0` header; max 1 req/sec
- [ ] Timezone resolved from coordinates using a browser-compatible method:
  - Option A: Use the timezone returned by Nominatim (if available)
  - Option B: Use a timezone lookup library (e.g., `@vvo/tzdb` or `geotz`) with the coordinates
- [ ] API errors (network down, no results) show a graceful message: "City not found. Please enter coordinates manually."
- [ ] Fallback: if geocoding fails, manual lat/lon/timezone fields remain available

### Validation
- [ ] Form cannot be submitted without resolved coordinates
- [ ] If user selects a city from autocomplete, coordinates are considered valid
- [ ] If user enters manual coordinates, they are validated as numbers in valid ranges (lat: -90 to 90, lon: -180 to 180)

### Performance
- [ ] Results cached in `sessionStorage` to avoid re-fetching for same query
- [ ] No more than 1 request per second to Nominatim (debounce + rate limiting)

## Tasks

- [ ] Read `src/components/ProfileCreationForm.tsx` fully
- [ ] Read `src/types/index.ts` — confirm `BirthData` shape (lat, lon, timezone fields)
- [ ] Research Nominatim API response format and usage policy
- [ ] Research timezone resolution: `Intl.DateTimeFormat` approach vs. library
- [ ] Create `src/services/geocoding.ts` — `searchCities(query)` and `getTimezone(lat, lon)` functions
- [ ] Add city search autocomplete to `ProfileCreationForm`
- [ ] Add debouncing (300ms) to the search input
- [ ] Auto-populate lat/lon/timezone on city selection
- [ ] Show read-only confirmation of resolved values
- [ ] Add manual override toggle
- [ ] Add error state for API failures
- [ ] Add sessionStorage caching
- [ ] Test: search for "São Paulo" — verify correct coords and timezone (America/Sao_Paulo)
- [ ] Test: search for "London" — verify GMT/BST
- [ ] Test: network offline — verify graceful fallback
- [ ] Run `npm run verify`

## Scope

**IN:** City autocomplete, Nominatim geocoding, timezone resolution, sessionStorage caching, fallback to manual entry
**OUT:** Paid geocoding APIs (Google Places, Mapbox), IP-based geolocation, birth time validation, astrocartography

## Dependencies

None — independent. TD-M-02 (Profile.tsx decomposition) may affect where ProfileCreationForm is used — but the form itself is a standalone component.

## Technical Notes

### Nominatim Usage

```typescript
// geocoding.ts
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

async function searchCities(query: string): Promise<CityResult[]> {
  const cached = sessionStorage.getItem(`geocode:${query}`);
  if (cached) return JSON.parse(cached);

  const params = new URLSearchParams({ q: query, format: 'json', limit: '5', addressdetails: '1' });
  const res = await fetch(`${NOMINATIM_URL}?${params}`, {
    headers: { 'User-Agent': 'CosmicBlueprint/1.0' }
  });
  const data = await res.json();
  const results = data.map(normalizeNominatimResult);
  sessionStorage.setItem(`geocode:${query}`, JSON.stringify(results));
  return results;
}
```

### Timezone Resolution

```typescript
// From coordinates — use tzdb package or Intl-based lookup
// Simplest approach: if Nominatim returns timezone in display_name, parse it
// Better approach: use a static timezone boundary dataset (geotz is 2MB)
// MVP approach: derive timezone from longitude offset (±12h in 15° increments)
//   — imprecise but works for most use cases without a library
```

For MVP, the longitude-offset approach is acceptable. A follow-up story can implement precise timezone resolution.

### Rate Limiting

Nominatim's policy: 1 request per second from the same IP. With 300ms debounce, the user typing normally will stay within limits. Add a `lastRequestTime` check in `geocoding.ts` to enforce 1 req/sec.

## Definition of Done

City name autocomplete works in ProfileCreationForm. Lat/lon/timezone auto-populated on selection. Manual fallback available. Nominatim usage policy respected. `npm run verify` passes.
