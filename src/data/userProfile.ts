// ============================================
// USER NATAL PROFILE — Felipe Fraga
// ============================================

export type PlacementType = 'planet' | 'point';

export interface NatalPlacement {
  planetId: string;
  planetSymbol: string;
  planetName: string;
  signId: string;
  degree: string;
  houseNumber: number;
  isRetrograde: boolean;
  dignity?: string;
  placementType: PlacementType;
  importance: number; // For sorting: 4=luminaries, 3=angles, 2=personal planets, 1=outer planets, 0.5=points
}

export interface UserProfile {
  name: string;
  dateOfBirth: string;
  cityOfBirth: string;
  placements: NatalPlacement[];
}

export const userProfile: UserProfile = {
  name: 'Felipe Fraga',
  dateOfBirth: 'Oct 18, 1994, 8:10 AM',
  cityOfBirth: 'Rio de Janeiro, Brazil',
  placements: [
    // Luminaries (importance 4)
    { planetId: 'sun', planetSymbol: '☉', planetName: 'Sun', signId: 'libra', degree: '24°48\'', houseNumber: 12, isRetrograde: false, dignity: 'Fall', placementType: 'planet', importance: 4 },
    { planetId: 'moon', planetSymbol: '☽', planetName: 'Moon', signId: 'aries', degree: '12°47\'', houseNumber: 5, isRetrograde: false, placementType: 'planet', importance: 4 },

    // Angles (importance 3)
    { planetId: 'ascendant', planetSymbol: 'ASC', planetName: 'Ascendant', signId: 'scorpio', degree: '26°52\'', houseNumber: 1, isRetrograde: false, placementType: 'point', importance: 3 },
    { planetId: 'midheaven', planetSymbol: 'MC', planetName: 'Midheaven', signId: 'leo', degree: '13°31\'', houseNumber: 10, isRetrograde: false, placementType: 'point', importance: 3 },

    // Personal Planets (importance 2)
    { planetId: 'mercury', planetSymbol: '☿', planetName: 'Mercury', signId: 'scorpio', degree: '0°59\'', houseNumber: 12, isRetrograde: true, placementType: 'planet', importance: 2 },
    { planetId: 'venus', planetSymbol: '♀', planetName: 'Venus', signId: 'scorpio', degree: '17°28\'', houseNumber: 12, isRetrograde: true, dignity: 'Detriment', placementType: 'planet', importance: 2 },
    { planetId: 'mars', planetSymbol: '♂', planetName: 'Mars', signId: 'leo', degree: '7°32\'', houseNumber: 9, isRetrograde: false, placementType: 'planet', importance: 2 },

    // Social Planets (importance 1.5)
    { planetId: 'jupiter', planetSymbol: '♃', planetName: 'Jupiter', signId: 'scorpio', degree: '18°36\'', houseNumber: 12, isRetrograde: false, placementType: 'planet', importance: 1.5 },
    { planetId: 'saturn', planetSymbol: '♄', planetName: 'Saturn', signId: 'pisces', degree: '6°05\'', houseNumber: 4, isRetrograde: true, placementType: 'planet', importance: 1.5 },

    // Outer Planets (importance 1)
    { planetId: 'uranus', planetSymbol: '♅', planetName: 'Uranus', signId: 'capricorn', degree: '22°30\'', houseNumber: 3, isRetrograde: false, placementType: 'planet', importance: 1 },
    { planetId: 'neptune', planetSymbol: '♆', planetName: 'Neptune', signId: 'capricorn', degree: '20°38\'', houseNumber: 3, isRetrograde: false, placementType: 'planet', importance: 1 },
    { planetId: 'pluto', planetSymbol: '♇', planetName: 'Pluto', signId: 'scorpio', degree: '26°42\'', houseNumber: 12, isRetrograde: false, dignity: 'Domicile', placementType: 'planet', importance: 1 },

    // Key Points (importance 2 for nodes)
    { planetId: 'north-node', planetSymbol: '☊', planetName: 'North Node', signId: 'scorpio', degree: '15°43\'', houseNumber: 12, isRetrograde: true, placementType: 'point', importance: 2 },
    { planetId: 'south-node', planetSymbol: '☋', planetName: 'South Node', signId: 'taurus', degree: '15°43\'', houseNumber: 6, isRetrograde: true, placementType: 'point', importance: 2 },

    // Other Points (importance 0.5)
    { planetId: 'chiron', planetSymbol: '⚷', planetName: 'Chiron', signId: 'virgo', degree: '20°18\'', houseNumber: 11, isRetrograde: false, placementType: 'point', importance: 0.5 },
    { planetId: 'lilith', planetSymbol: '⚸', planetName: 'Lilith', signId: 'taurus', degree: '21°32\'', houseNumber: 6, isRetrograde: false, placementType: 'point', importance: 0.5 },
    { planetId: 'part-of-fortune', planetSymbol: '⊕', planetName: 'Part of Fortune', signId: 'taurus', degree: '14°51\'', houseNumber: 6, isRetrograde: false, placementType: 'point', importance: 0.5 },
    { planetId: 'vertex', planetSymbol: 'Vx', planetName: 'Vertex', signId: 'aries', degree: '24°29\'', houseNumber: 6, isRetrograde: false, placementType: 'point', importance: 0.5 },
  ],
};

/**
 * Get all placements for a specific sign, sorted by importance
 */
export function getPlacementsInSign(signId: string): NatalPlacement[] {
  return userProfile.placements
    .filter(p => p.signId === signId)
    .sort((a, b) => b.importance - a.importance);
}

/**
 * Get only planet placements for a specific sign
 */
export function getPlanetPlacementsInSign(signId: string): NatalPlacement[] {
  return userProfile.placements
    .filter(p => p.signId === signId && p.placementType === 'planet')
    .sort((a, b) => b.importance - a.importance);
}

/**
 * Get only point placements for a specific sign
 */
export function getPointPlacementsInSign(signId: string): NatalPlacement[] {
  return userProfile.placements
    .filter(p => p.signId === signId && p.placementType === 'point')
    .sort((a, b) => b.importance - a.importance);
}

/**
 * Get all placements sorted by importance
 */
export function getAllPlacementsSorted(): NatalPlacement[] {
  return [...userProfile.placements].sort((a, b) => b.importance - a.importance);
}

/**
 * Get placement for a specific planet/point
 */
export function getPlacementByPlanetId(planetId: string): NatalPlacement | undefined {
  return userProfile.placements.find(p => p.planetId === planetId);
}

/**
 * Get all placements in a specific house
 */
export function getPlacementsInHouse(houseNumber: number): NatalPlacement[] {
  return userProfile.placements
    .filter(p => p.houseNumber === houseNumber)
    .sort((a, b) => b.importance - a.importance);
}

/**
 * Get placement count per sign for the wheel visualization
 */
export function getPlacementCountBySign(): Map<string, number> {
  const counts = new Map<string, number>();
  for (const placement of userProfile.placements) {
    const current = counts.get(placement.signId) || 0;
    counts.set(placement.signId, current + 1);
  }
  return counts;
}
