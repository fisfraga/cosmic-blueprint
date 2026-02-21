import type { AstroProfile } from '../../types';
import { signs, planets, houses, points } from '../../data';

export const elementColors = {
  fire: { bg: 'bg-fire-500', text: 'text-fire-400', bar: 'bg-fire-500' },
  earth: { bg: 'bg-earth-500', text: 'text-earth-400', bar: 'bg-earth-500' },
  air: { bg: 'bg-air-500', text: 'text-air-400', bar: 'bg-air-500' },
  water: { bg: 'bg-water-500', text: 'text-water-400', bar: 'bg-water-500' },
};

export const aspectColors: Record<string, { bg: string; text: string }> = {
  conjunction: { bg: 'bg-white/10', text: 'text-white' },
  sextile: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  square: { bg: 'bg-rose-500/10', text: 'text-rose-400' },
  trine: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  opposition: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  quincunx: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
};

// Helper functions used across profile components
export const getSignData = (signId: string) => signs.get(signId);
export const getPlanetData = (planetId: string) => planets.get(planetId) || points.get(planetId);
export const getHouseData = (houseId: string) => houses.get(houseId);

// HD planet name mapping
export const hdPlanetMap: Record<string, string> = {
  sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars',
  jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto',
  'north-node': 'North Node', 'south-node': 'South Node',
};

// Gene Keys sphere key list
export const gkSphereKeyList = ['lifesWork','evolution','radiance','purpose','attraction','iq','eq','sq','core','vocation','culture','brand','pearl'];

// Common props type for all tab components
export interface ProfileTabProps {
  profile: AstroProfile;
}
