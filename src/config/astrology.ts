/**
 * Astrology API Configuration
 *
 * Provider: FreeAstroAPI
 * Docs: https://freeastroapi.com/docs/western/natal
 *
 * Configuration via environment variables:
 * - VITE_ASTROLOGY_API_ENABLED: 'true' to enable API calls
 *
 * Server-side (in Vercel):
 * - FREEASTRO_API_KEY: Your API key from FreeAstroAPI
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
  return isAstrologyAPIConfigured() ? 'FreeAstroAPI' : 'Not configured';
}
