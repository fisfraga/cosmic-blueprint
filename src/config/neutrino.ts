/**
 * Neutrino Platform Integration Configuration
 *
 * Configure your Neutrino Platform widget settings here.
 * Get your widget code from: https://neutrinoplatform.com/widgets
 *
 * After creating an account:
 * 1. Go to your Neutrino dashboard
 * 2. Navigate to Widgets section
 * 3. Copy your widget embed code/API key
 * 4. Update the configuration below
 */

export interface NeutrinoConfig {
  // Your Neutrino account ID or API key (from dashboard)
  accountId?: string;

  // Widget embed URL (if using iframe approach)
  chartWidgetUrl?: string;
  transitWidgetUrl?: string;

  // Script-based embed (if using JavaScript widget)
  scriptSrc?: string;

  // Webhook endpoint for receiving chart data
  webhookEndpoint?: string;

  // Default theme for widgets
  defaultTheme: 'light' | 'dark';

  // Default chart customization
  chartOptions: {
    showChannels: boolean;
    showGates: boolean;
    showCenters: boolean;
    curvedChannels: boolean;
    roundCenters: boolean;
  };
}

// Default configuration - UPDATE WITH YOUR NEUTRINO CREDENTIALS
export const neutrinoConfig: NeutrinoConfig = {
  // Your Neutrino API key (from widget embed code)
  accountId: '828a382a8ab3dc5de3e15524a6d602a155d20412',

  // Widget URLs from your Neutrino dashboard
  chartWidgetUrl: 'https://neutrinoplatform.com/widget/chart/new?apiKey=828a382a8ab3dc5de3e15524a6d602a155d20412',
  transitWidgetUrl: undefined,

  // Script source if using JS-based widget
  scriptSrc: undefined,

  // Webhook endpoint (requires backend)
  webhookEndpoint: undefined,

  // Match Cosmic Copilot's dark theme
  defaultTheme: 'dark',

  // Chart display options
  chartOptions: {
    showChannels: true,
    showGates: true,
    showCenters: true,
    curvedChannels: false,
    roundCenters: false,
  },
};

/**
 * Check if Neutrino integration is configured
 */
export function isNeutrinoConfigured(): boolean {
  return !!(
    neutrinoConfig.accountId ||
    neutrinoConfig.chartWidgetUrl ||
    neutrinoConfig.scriptSrc
  );
}

/**
 * Get the appropriate widget URL based on type
 */
export function getWidgetUrl(type: 'chart' | 'transit'): string | undefined {
  if (type === 'chart') {
    return neutrinoConfig.chartWidgetUrl;
  }
  return neutrinoConfig.transitWidgetUrl;
}
