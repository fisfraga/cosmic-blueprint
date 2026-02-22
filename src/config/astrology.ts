/**
 * Astrology API Configuration
 *
 * Provider: Swiss Ephemeris (self-hosted via astrology-service/)
 *
 * Configuration via environment variables:
 * - VITE_ASTROLOGY_API_ENABLED: 'true' to enable API calls
 *
 * The service is proxied via Express /api/astrology → astrology-service:8000
 */

/**
 * Check if astrology API is enabled
 */
export function isAstrologyAPIConfigured(): boolean {
  const enabled = import.meta.env.VITE_ASTROLOGY_API_ENABLED;
  return enabled === 'true' || enabled === true;
}

/**
 * Get provider name for display
 */
export function getAstrologyProviderName(): string {
  return isAstrologyAPIConfigured() ? 'Swiss Ephemeris' : 'Not configured';
}
