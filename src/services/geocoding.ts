/**
 * Geocoding service using Nominatim (OpenStreetMap) API.
 *
 * Free, no API key required. Rate-limited to 1 request/second per Nominatim TOS.
 * https://nominatim.org/release-docs/develop/api/Search/
 */

export interface GeocodingResult {
  /** Full formatted address */
  displayName: string;
  /** City or town name */
  city: string;
  /** Country name */
  country: string;
  /** Decimal latitude */
  latitude: number;
  /** Decimal longitude */
  longitude: number;
}

/** Raw response shape from Nominatim /search endpoint */
interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    hamlet?: string;
    municipality?: string;
    state?: string;
    country?: string;
  };
}

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'CosmicBlueprint/1.0';

/**
 * Timestamp of the last request sent to Nominatim, used to enforce the
 * 1-request-per-second rate limit required by the Terms of Service.
 */
let lastRequestTime = 0;

/**
 * Waits if necessary so that at least 1 000 ms have elapsed since the previous
 * Nominatim request. Returns immediately if the interval has already passed.
 */
async function enforceRateLimit(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < 1000) {
    await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
  }
  lastRequestTime = Date.now();
}

/**
 * Extract the best available city-level name from a Nominatim address object.
 */
function extractCity(address?: NominatimResult['address']): string {
  if (!address) return '';
  return (
    address.city ??
    address.town ??
    address.village ??
    address.hamlet ??
    address.municipality ??
    ''
  );
}

/**
 * Search for locations matching the given query string.
 *
 * @param query - Free-form location query (e.g. "São Paulo, Brazil")
 * @returns Array of up to 5 matching results, or an empty array on failure.
 */
export async function searchLocations(query: string): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    await enforceRateLimit();

    const params = new URLSearchParams({
      q: trimmed,
      format: 'json',
      limit: '5',
      addressdetails: '1',
    });

    const response = await fetch(`${NOMINATIM_BASE}?${params.toString()}`, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`Nominatim request failed: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: NominatimResult[] = await response.json();

    return data.map((item) => ({
      displayName: item.display_name,
      city: extractCity(item.address),
      country: item.address?.country ?? '',
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
    }));
  } catch (error) {
    console.error('Geocoding search failed:', error);
    return [];
  }
}
