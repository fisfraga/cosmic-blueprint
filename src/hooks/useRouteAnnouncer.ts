import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Maps known route pathnames to human-readable page titles
 * for screen reader announcements on route change.
 */
const ROUTE_TITLES: Record<string, string> = {
  '/': 'Home',
  '/profile': 'Profile',
  '/profile/placements': 'My Placements',
  '/profile/astrology': 'Astrology Profile',
  '/profile/gene-keys': 'Gene Keys Profile',
  '/profile/human-design': 'Human Design Profile',
  '/wheel': 'Celestial Wheel',
  '/graph': 'Cosmic Graph',
  '/weaver': 'Aspect Weaver',
  '/realms': 'Element Realms',
  '/contemplate': 'Contemplation Chamber',
  '/transits': 'Cosmic Transits',
  '/pathways': 'Guided Pathways',
  '/insights': 'Insight Library',
  '/sessions': 'Sessions Library',
  '/life-areas': 'Life Areas',
  '/onboarding': 'Onboarding',
  '/planets': 'Planets',
  '/signs': 'Zodiac Signs',
  '/houses': 'Houses',
  '/elements': 'Elements',
  '/aspects': 'Aspects',
  '/dignities': 'Dignity Matrix',
  '/configurations': 'Aspect Configurations',
  '/decans': 'Decans',
  '/gene-keys': 'Gene Keys',
  '/gene-keys/codon-rings': 'Codon Rings',
  '/gene-keys/spheres': 'Spheres',
  '/gene-keys/lines': 'Gene Key Lines',
  '/gene-keys/sequences': 'Sequences',
  '/gene-keys/amino-acids': 'Amino Acids',
  '/gene-keys/trigrams': 'Trigrams',
  '/human-design': 'Human Design Gates',
  '/human-design/centers': 'Human Design Centers',
  '/human-design/channels': 'Human Design Channels',
  '/human-design/types': 'Human Design Types',
  '/human-design/authorities': 'Human Design Authorities',
  '/human-design/lines': 'Human Design Lines',
  '/human-design/profiles': 'Human Design Profiles',
  '/human-design/variables': 'Human Design Variables',
  '/human-design/strategies': 'Human Design Strategies',
  '/lines': 'Lines',
  '/numerology': 'Numerology',
  '/chakras': 'Chakras',
  '/hermetic': 'Hermetic Principles',
};

/**
 * Derives a human-readable page title from a pathname.
 * Returns the mapped title for known routes, or capitalizes
 * the last path segment as a fallback for dynamic routes.
 */
function getPageTitle(pathname: string): string {
  // Exact match first
  if (ROUTE_TITLES[pathname]) {
    return ROUTE_TITLES[pathname];
  }

  // For dynamic routes like /planets/:id, check the parent path
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length >= 2) {
    const parentPath = '/' + segments.slice(0, -1).join('/');
    const parentTitle = ROUTE_TITLES[parentPath];
    if (parentTitle) {
      // Return something like "Planets Detail" for /planets/mars
      return `${parentTitle} Detail`;
    }
  }

  // Fallback: capitalize the last segment
  const lastSegment = segments[segments.length - 1] || 'Page';
  return lastSegment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Announces route changes to screen readers and manages focus.
 *
 * On each route change this hook:
 * 1. Updates a visually hidden live region (#route-announcer) with the page title
 * 2. Moves focus to the main content area so keyboard users start at the top
 *
 * Must be called inside a component that is a descendant of <BrowserRouter>.
 */
export function useRouteAnnouncer(): void {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip announcement on initial page load — the page itself is sufficient context
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const title = getPageTitle(location.pathname);

    // Update the live region so screen readers announce the navigation
    const announcer = document.getElementById('route-announcer');
    if (announcer) {
      announcer.textContent = '';
      // Use a microtask delay so the screen reader detects the content change
      requestAnimationFrame(() => {
        announcer.textContent = `Navigated to ${title}`;
      });
    }

    // Move focus to main content area
    const main = document.getElementById('main-content');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus({ preventScroll: true });
    }
  }, [location.pathname]);
}
