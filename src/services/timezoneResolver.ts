/**
 * Timezone Resolver Service
 *
 * Resolves IANA timezone strings from geographic coordinates using tz-lookup.
 * Used to determine the correct birth timezone from birth location lat/lng.
 */

import tzlookup from 'tz-lookup';

/**
 * Get the IANA timezone for a geographic location.
 *
 * @param lat - Latitude (-90 to 90)
 * @param lng - Longitude (-180 to 180)
 * @returns IANA timezone string (e.g., 'America/New_York')
 */
export function getTimezoneForLocation(lat: number, lng: number): string {
  try {
    return tzlookup(lat, lng);
  } catch {
    // tz-lookup throws for coordinates in the ocean or invalid input
    return 'UTC';
  }
}
