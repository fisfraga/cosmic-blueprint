/**
 * Neutrino Platform Widget Integration
 *
 * This component embeds Neutrino Platform widgets for Human Design chart generation.
 * Get your widget embed code from: https://neutrinoplatform.com/widgets
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { isNeutrinoConfigured, getWidgetUrl } from '../config/neutrino';

interface BirthDataProps {
  date?: string;      // YYYY-MM-DD format
  time?: string;      // HH:MM format
  latitude?: number;
  longitude?: number;
  timezone?: string;  // IANA timezone
  city?: string;
}

interface NeutrinoWidgetProps {
  type?: 'chart' | 'transit';
  width?: number | string;
  height?: number | string;
  className?: string;
  birthData?: BirthDataProps;
}

/**
 * Neutrino Platform Widget Embed Component
 *
 * Embeds Neutrino's iframe widget with dynamic height adjustment.
 * Can pre-fill birth data via URL parameters if supported by Neutrino.
 */
export function NeutrinoWidget({
  type = 'chart',
  width = '100%',
  height = 450,
  className = '',
  birthData,
}: NeutrinoWidgetProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dynamicHeight, setDynamicHeight] = useState<number>(typeof height === 'number' ? height : 450);

  // Check if Neutrino is configured
  const configured = isNeutrinoConfigured();
  const baseWidgetUrl = getWidgetUrl(type);

  // Build widget URL with birth data parameters (if provided)
  const widgetUrl = useMemo(() => {
    if (!baseWidgetUrl) return null;

    // If no birth data, return base URL
    if (!birthData?.date) return baseWidgetUrl;

    try {
      const url = new URL(baseWidgetUrl);

      // Try various parameter formats that widget platforms commonly use
      if (birthData.date) {
        url.searchParams.set('date', birthData.date);
        url.searchParams.set('birthdate', birthData.date);
      }
      if (birthData.time) {
        url.searchParams.set('time', birthData.time);
        url.searchParams.set('birthtime', birthData.time);
      }
      if (birthData.latitude !== undefined) {
        url.searchParams.set('lat', birthData.latitude.toString());
        url.searchParams.set('latitude', birthData.latitude.toString());
      }
      if (birthData.longitude !== undefined) {
        url.searchParams.set('lng', birthData.longitude.toString());
        url.searchParams.set('lon', birthData.longitude.toString());
        url.searchParams.set('longitude', birthData.longitude.toString());
      }
      if (birthData.timezone) {
        url.searchParams.set('tz', birthData.timezone);
        url.searchParams.set('timezone', birthData.timezone);
      }
      if (birthData.city) {
        url.searchParams.set('city', birthData.city);
        url.searchParams.set('place', birthData.city);
      }

      return url.toString();
    } catch {
      return baseWidgetUrl;
    }
  }, [baseWidgetUrl, birthData]);

  // Handle postMessage events for dynamic height adjustment (as per Neutrino's embed code)
  const handleMessage = useCallback((event: MessageEvent) => {
    if (iframeRef.current && event.data) {
      const heightDelta = parseInt(event.data, 10);
      if (!isNaN(heightDelta)) {
        const baseHeight = typeof height === 'number' ? height : 450;
        setDynamicHeight(baseHeight + heightDelta);
      }
    }
  }, [height]);

  useEffect(() => {
    window.addEventListener('message', handleMessage, false);
    return () => {
      window.removeEventListener('message', handleMessage, false);
    };
  }, [handleMessage]);

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setError('Failed to load Neutrino widget');
    setIsLoading(false);
  };

  // Not configured - show setup instructions
  if (!configured || !widgetUrl) {
    return (
      <div className={`bg-surface-base/50 rounded-xl border border-theme-border-subtle p-6 ${className}`}>
        <div className="text-center space-y-4">
          <div className="text-4xl">⚙️</div>
          <h3 className="font-serif text-lg text-theme-text-primary">Neutrino Platform Setup Required</h3>
          <p className="text-sm text-theme-text-secondary max-w-md mx-auto">
            To display your Human Design chart from Neutrino Platform, please configure your widget settings.
          </p>
          <div className="bg-surface-raised/50 rounded-lg p-4 text-left text-sm">
            <p className="text-theme-text-secondary font-medium mb-2">Setup Steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-theme-text-secondary">
              <li>Create an account at <a href="https://neutrinoplatform.com" target="_blank" rel="noopener noreferrer" className="text-humandesign-400 hover:underline">neutrinoplatform.com</a></li>
              <li>Go to your dashboard and navigate to Widgets</li>
              <li>Copy your widget embed code</li>
              <li>Update <code className="text-xs bg-surface-interactive px-1 rounded">src/config/neutrino.ts</code></li>
            </ol>
          </div>
          <p className="text-xs text-theme-text-tertiary">
            In the meantime, we're displaying our built-in body graph visualization.
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`bg-red-900/20 rounded-xl border border-red-800 p-6 ${className}`}>
        <div className="text-center space-y-2">
          <div className="text-3xl">⚠️</div>
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
            }}
            className="text-sm text-theme-text-secondary hover:text-theme-text-primary underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-base/50 rounded-xl z-10">
          <div className="text-center space-y-2">
            <div className="animate-spin w-8 h-8 border-2 border-humandesign-400 border-t-transparent rounded-full mx-auto" />
            <p className="text-sm text-theme-text-secondary">Loading Neutrino chart...</p>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        id="neutrinoChartWidget"
        src={widgetUrl}
        style={{ width: '100%', height: `${dynamicHeight}px` }}
        frameBorder="0"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        className="rounded-xl bg-surface-base"
        title={`Neutrino ${type === 'chart' ? 'Body Graph' : 'Transit'} Widget`}
        allow="fullscreen"
      />
    </div>
  );
}

/**
 * Neutrino Chart Card - Full card with header and Neutrino widget
 */
export function NeutrinoChartCard({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div className={`bg-surface-base/50 rounded-xl border border-theme-border-subtle ${className}`}>
      <div className="p-4 border-b border-theme-border-subtle">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg">Human Design Chart</h3>
          <a
            href="https://neutrinoplatform.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary"
          >
            Powered by Neutrino
          </a>
        </div>
      </div>
      <div className="p-4">
        <NeutrinoWidget type="chart" height={500} />
      </div>
    </div>
  );
}

/**
 * Neutrino Transit Widget - Shows current transits
 */
export function NeutrinoTransitWidget({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div className={`bg-surface-base/50 rounded-xl border border-theme-border-subtle ${className}`}>
      <div className="p-4 border-b border-theme-border-subtle">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg">Current Transits</h3>
          <span className="text-xs text-theme-text-tertiary">Live</span>
        </div>
      </div>
      <div className="p-4">
        <NeutrinoWidget type="transit" height={400} />
      </div>
    </div>
  );
}

export default NeutrinoWidget;
