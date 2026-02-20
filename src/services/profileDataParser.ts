/**
 * Profile Data Parser
 *
 * Parses pasted astrology data (from astro-seek.com) and Human Design data
 * into the app's internal format.
 */

import type {
  NatalPlacement,
  HousePosition,
  NatalAspect,
  ElementalAnalysis,
  HumanDesignProfile,
  HDGateActivation,
  HDType,
  HDStrategy,
  HDAuthority,
  HDProfile,
  HDDefinition,
} from '../types';

// ============================================================================
// Astrology Parser (astro-seek.com format)
// ============================================================================

/**
 * Sign name variations to ID mapping
 */
const SIGN_MAP: Record<string, string> = {
  'aries': 'aries', 'ari': 'aries',
  'taurus': 'taurus', 'tau': 'taurus',
  'gemini': 'gemini', 'gem': 'gemini',
  'cancer': 'cancer', 'can': 'cancer',
  'leo': 'leo',
  'virgo': 'virgo', 'vir': 'virgo',
  'libra': 'libra', 'lib': 'libra',
  'scorpio': 'scorpio', 'sco': 'scorpio',
  'sagittarius': 'sagittarius', 'sag': 'sagittarius',
  'capricorn': 'capricorn', 'cap': 'capricorn',
  'aquarius': 'aquarius', 'aqu': 'aquarius',
  'pisces': 'pisces', 'pis': 'pisces',
};

/**
 * Planet name variations to ID mapping
 */
const PLANET_MAP: Record<string, string> = {
  'sun': 'sun',
  'moon': 'moon',
  'mercury': 'mercury',
  'venus': 'venus',
  'mars': 'mars',
  'jupiter': 'jupiter',
  'saturn': 'saturn',
  'uranus': 'uranus',
  'neptune': 'neptune',
  'pluto': 'pluto',
  'north node': 'north-node',
  'south node': 'south-node',
  'chiron': 'chiron',
  'lilith': 'lilith',
  'true node': 'north-node',
  'mean node': 'north-node',
  'asc': 'ascendant',
  'ascendant': 'ascendant',
  'mc': 'midheaven',
  'midheaven': 'midheaven',
  'fortune': 'part-of-fortune',
  'vertex': 'vertex',
};

/**
 * Aspect name to ID mapping
 */
const ASPECT_MAP: Record<string, string> = {
  'conjunction': 'conjunction',
  'opposition': 'opposition',
  'trine': 'trine',
  'square': 'square',
  'sextile': 'sextile',
  'quincunx': 'quincunx',
  'semisextile': 'semi-sextile',
  'semisquare': 'semi-square',
  'sesquiquadrate': 'sesqui-square', // Fixed: maps to hyphenated ID in aspects.json
  'quintile': 'quintile',
  'biquintile': 'biquintile',
};

/**
 * Element for each sign
 */
const SIGN_ELEMENTS: Record<string, 'fire' | 'earth' | 'air' | 'water'> = {
  aries: 'fire', leo: 'fire', sagittarius: 'fire',
  taurus: 'earth', virgo: 'earth', capricorn: 'earth',
  gemini: 'air', libra: 'air', aquarius: 'air',
  cancer: 'water', scorpio: 'water', pisces: 'water',
};

/**
 * Parse degree string like "24°48'" into degree and minute
 */
function parseDegree(degStr: string): { degree: number; minute: number } {
  // Match patterns like "24°48'" or "24°48" or "24.48"
  const match = degStr.match(/(\d+)[°.](\d+)/);
  if (match) {
    return {
      degree: parseInt(match[1], 10),
      minute: parseInt(match[2], 10),
    };
  }
  // Just degree
  const degOnly = degStr.match(/(\d+)/);
  if (degOnly) {
    return { degree: parseInt(degOnly[1], 10), minute: 0 };
  }
  return { degree: 0, minute: 0 };
}

/**
 * Parse planet positions from astro-seek format
 * Example: "Sun in Libra 24°48', in 12th House"
 */
export function parseAstroSeekPlanetPositions(
  text: string,
  profileId: string
): NatalPlacement[] {
  const placements: NatalPlacement[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Pattern: "Planet in Sign Degree°Minute', in Nth House"
    // Also handles: "ASC in Scorpio 26°52'" (no house)
    const planetMatch = trimmed.match(
      /^(\w+(?:\s+\w+)?)\s+in\s+(\w+)\s+(\d+[°.]\d+)'?,?\s*(?:(?:Retrograde),?\s*)?(?:in\s+(\d+)(?:st|nd|rd|th)\s+House)?/i
    );

    if (planetMatch) {
      const [, planetName, signName, degreeStr, houseNum] = planetMatch;
      const planetId = PLANET_MAP[planetName.toLowerCase()];
      const signId = SIGN_MAP[signName.toLowerCase()];

      if (planetId && signId) {
        const { degree, minute } = parseDegree(degreeStr);
        const isRetrograde = /retrograde/i.test(trimmed);
        const house = houseNum ? parseInt(houseNum, 10) : undefined;

        placements.push({
          id: `${profileId}-${planetId}`,
          profileId,
          planetId,
          signId,
          houseId: house ? `house-${house}` : '',  // Empty string if house not specified
          degree,
          minute,
          retrograde: isRetrograde,
          fullName: `${planetName} in ${signName}`,
          shortName: `${planetName.substring(0, 3)} ${signName.substring(0, 3)}`,
        });
      }
    }
  }

  return placements;
}

/**
 * Parse house positions from astro-seek format
 * Example: "1st House in Scorpio 26°52'"
 */
export function parseAstroSeekHousePositions(
  text: string,
  profileId: string
): HousePosition[] {
  const positions: HousePosition[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Pattern: "Nth House in Sign Degree°Minute'"
    const houseMatch = trimmed.match(
      /^(\d+)(?:st|nd|rd|th)\s+House\s+in\s+(\w+)\s+(\d+[°.]\d+)/i
    );

    if (houseMatch) {
      const [, houseNum, signName, degreeStr] = houseMatch;
      const signId = SIGN_MAP[signName.toLowerCase()];

      if (signId) {
        const { degree, minute } = parseDegree(degreeStr);
        const houseNumber = parseInt(houseNum, 10);

        positions.push({
          id: `${profileId}-house-${houseNumber}`,
          profileId,
          houseId: `house-${houseNumber}`,
          signId,
          degree,
          minute,
        });
      }
    }
  }

  return positions;
}

/**
 * Parse aspects from astro-seek format
 * Example: "Sun Conjunction Mercury (Orb: 6°11', Applying)"
 */
export function parseAstroSeekAspects(
  text: string,
  profileId: string
): { planetary: NatalAspect[]; other: NatalAspect[] } {
  const planetary: NatalAspect[] = [];
  const other: NatalAspect[] = [];
  const lines = text.split('\n');
  let index = 0;

  // Main planets for categorization
  const mainPlanets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Pattern: "Planet1 Aspect Planet2 (Orb: X°Y', Direction)"
    const aspectMatch = trimmed.match(
      /^(\w+(?:\s+\w+)?)\s+(\w+)\s+(\w+(?:\s+\w+)?)\s*\(Orb:\s*(\d+)[°.](\d+)'?,?\s*(\w+)\)/i
    );

    if (aspectMatch) {
      const [, planet1Name, aspectName, planet2Name, orbDeg, orbMin, direction] = aspectMatch;

      const planet1Id = PLANET_MAP[planet1Name.toLowerCase()];
      const planet2Id = PLANET_MAP[planet2Name.toLowerCase()];
      const aspectId = ASPECT_MAP[aspectName.toLowerCase()];

      if (planet1Id && planet2Id && aspectId) {
        const aspect: NatalAspect = {
          id: `${profileId}-aspect-${index++}`,
          profileId,
          aspectId,
          planet1Id,
          placement1Id: `${profileId}-${planet1Id}`,
          planet2Id,
          placement2Id: `${profileId}-${planet2Id}`,
          orbDegree: parseInt(orbDeg, 10),
          orbMinute: parseInt(orbMin, 10),
          direction: direction.toLowerCase() === 'applying' ? 'Applying' : 'Separating',
          fullName: `${planet1Name} ${aspectName} ${planet2Name}`,
        };

        // Categorize as planetary or other
        if (mainPlanets.includes(planet1Id) && mainPlanets.includes(planet2Id)) {
          planetary.push(aspect);
        } else {
          other.push(aspect);
        }
      }
    }
  }

  return { planetary, other };
}

/**
 * Calculate elemental analysis from placements
 */
export function calculateElementalAnalysis(
  placements: NatalPlacement[],
  profileId: string
): ElementalAnalysis {
  const counts = { fire: 0, earth: 0, air: 0, water: 0 };
  const planetLists: Record<string, string[]> = {
    fire: [], earth: [], air: [], water: [],
  };

  // Only count main planets for elemental balance
  const mainPlanets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

  for (const placement of placements) {
    if (!mainPlanets.includes(placement.planetId)) continue;

    const element = SIGN_ELEMENTS[placement.signId];
    if (element) {
      counts[element]++;
      planetLists[element].push(placement.planetId);
    }
  }

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0][0];
  const deficient = sorted[sorted.length - 1][0];

  return {
    id: `${profileId}-elemental`,
    profileId,
    fire: counts.fire,
    earth: counts.earth,
    air: counts.air,
    water: counts.water,
    firePlanetIds: planetLists.fire,
    earthPlanetIds: planetLists.earth,
    airPlanetIds: planetLists.air,
    waterPlanetIds: planetLists.water,
    dominant,
    deficient,
  };
}

/**
 * Parse complete astrology data from astro-seek paste
 */
export interface ParsedAstrologyData {
  placements: NatalPlacement[];
  housePositions: HousePosition[];
  aspects: { planetary: NatalAspect[]; other: NatalAspect[] };
  elementalAnalysis: ElementalAnalysis;
  chartRulers: { traditional: string; modern: string };
}

export function parseAstroSeekData(
  planetPositionsText: string,
  housePositionsText: string,
  aspectsText: string,
  otherAspectsText: string,
  profileId: string
): ParsedAstrologyData {
  const placements = parseAstroSeekPlanetPositions(planetPositionsText, profileId);
  const housePositions = parseAstroSeekHousePositions(housePositionsText, profileId);

  const planetaryAspects = parseAstroSeekAspects(aspectsText, profileId);
  const otherAspects = parseAstroSeekAspects(otherAspectsText, profileId);

  const aspects = {
    planetary: planetaryAspects.planetary,
    other: [...planetaryAspects.other, ...otherAspects.planetary, ...otherAspects.other],
  };

  const elementalAnalysis = calculateElementalAnalysis(placements, profileId);

  // Determine chart rulers from ASC sign
  const ascPlacement = placements.find(p => p.planetId === 'ascendant');
  let chartRulers = { traditional: '', modern: '' };

  if (ascPlacement) {
    const SIGN_RULERS: Record<string, { traditional: string; modern: string }> = {
      aries: { traditional: 'mars', modern: 'mars' },
      taurus: { traditional: 'venus', modern: 'venus' },
      gemini: { traditional: 'mercury', modern: 'mercury' },
      cancer: { traditional: 'moon', modern: 'moon' },
      leo: { traditional: 'sun', modern: 'sun' },
      virgo: { traditional: 'mercury', modern: 'mercury' },
      libra: { traditional: 'venus', modern: 'venus' },
      scorpio: { traditional: 'mars', modern: 'pluto' },
      sagittarius: { traditional: 'jupiter', modern: 'jupiter' },
      capricorn: { traditional: 'saturn', modern: 'saturn' },
      aquarius: { traditional: 'saturn', modern: 'uranus' },
      pisces: { traditional: 'jupiter', modern: 'neptune' },
    };
    chartRulers = SIGN_RULERS[ascPlacement.signId] || chartRulers;
  }

  return {
    placements,
    housePositions,
    aspects,
    elementalAnalysis,
    chartRulers,
  };
}

// ============================================================================
// Human Design Parser
// ============================================================================

/**
 * Parse Human Design gate.line format (e.g., "32.5")
 */
function parseGateLine(str: string): { gate: number; line: number } | null {
  const match = str.trim().match(/^(\d+)\.(\d+)$/);
  if (match) {
    return {
      gate: parseInt(match[1], 10),
      line: parseInt(match[2], 10),
    };
  }
  return null;
}

/**
 * Human Design type mapping
 */
const HD_TYPE_MAP: Record<string, string> = {
  'generator': 'generator',
  'manifesting generator': 'manifesting-generator',
  'manifestor': 'manifestor',
  'projector': 'projector',
  'reflector': 'reflector',
};

/**
 * Human Design authority mapping
 */
const HD_AUTHORITY_MAP: Record<string, string> = {
  'emotional': 'emotional',
  'emotional - solar plexus': 'emotional',
  'solar plexus': 'emotional',
  'sacral': 'sacral',
  'splenic': 'splenic',
  'ego manifested': 'ego-manifested',
  'ego projected': 'ego-projected',
  'self-projected': 'self-projected',
  'self projected': 'self-projected',
  'mental': 'mental',
  'none': 'none',
  'lunar': 'lunar',
  'outer authority': 'outer',
};

/**
 * Human Design definition mapping
 */
const HD_DEFINITION_MAP: Record<string, string> = {
  'single definition': 'single',
  'single': 'single',
  'split definition': 'split',
  'split': 'split',
  'triple split definition': 'triple-split',
  'triple split': 'triple-split',
  'quadruple split definition': 'quadruple-split',
  'quadruple split': 'quadruple-split',
  'no definition': 'none',
};

/**
 * Center name to ID mapping
 */
const CENTER_MAP: Record<string, string> = {
  'head': 'head-center',
  'ajna': 'ajna-center',
  'throat': 'throat-center',
  'g': 'g-center',
  'g center': 'g-center',
  'identity': 'g-center',
  'heart': 'heart-center',
  'ego': 'heart-center',
  'will': 'heart-center',
  'solar plexus': 'solar-plexus-center',
  'emotional': 'solar-plexus-center',
  'sacral': 'sacral-center',
  'spleen': 'spleen-center',
  'splenic': 'spleen-center',
  'root': 'root-center',
};

/**
 * Parse Human Design data from pasted text
 */
export interface ParsedHumanDesignData {
  type: string;
  typeId: string;
  strategy: string;
  authority: string;
  authorityId: string;
  definition: string;
  definitionId: string;
  profile: string;
  profileLine1: number;
  profileLine2: number;
  incarnationCross: string;
  signature: string;
  notSelfTheme: string;
  personalityGates: HDGateActivation[];
  designGates: HDGateActivation[];
  definedCenterIds: string[];
  undefinedCenterIds: string[];
  definedChannelIds: string[];
  variables?: {
    digestion?: string;
    environment?: string;
    perspective?: string;
    motivation?: string;
    designSense?: string;
  };
}

/**
 * Planet order for gate activations
 */
const PLANET_ORDER = [
  'sun', 'earth', 'north-node', 'south-node', 'moon',
  'mercury', 'venus', 'mars', 'jupiter', 'saturn',
  'uranus', 'neptune', 'pluto'
];

export function parseHumanDesignData(text: string): ParsedHumanDesignData | null {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Initialize result
  const result: ParsedHumanDesignData = {
    type: '',
    typeId: '',
    strategy: '',
    authority: '',
    authorityId: '',
    definition: '',
    definitionId: '',
    profile: '',
    profileLine1: 0,
    profileLine2: 0,
    incarnationCross: '',
    signature: '',
    notSelfTheme: '',
    personalityGates: [],
    designGates: [],
    definedCenterIds: [],
    undefinedCenterIds: [],
    definedChannelIds: [],
    variables: {},
  };

  let currentSection: 'personality' | 'design' | null = null;
  let gateIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    // Section markers
    if (lowerLine === 'personality') {
      currentSection = 'personality';
      gateIndex = 0;
      continue;
    }
    if (lowerLine === 'design') {
      currentSection = 'design';
      gateIndex = 0;
      continue;
    }

    // Gate/Line entries (e.g., "- 32.5" or "32.5")
    const gateLineMatch = line.match(/^-?\s*(\d+\.\d+)\s*$/);
    if (gateLineMatch && currentSection) {
      const parsed = parseGateLine(gateLineMatch[1]);
      if (parsed && gateIndex < PLANET_ORDER.length) {
        const activation: HDGateActivation = {
          gateId: `gate-${parsed.gate}`,
          gateNumber: parsed.gate,
          line: parsed.line,
          isPersonality: currentSection === 'personality',
          planet: PLANET_ORDER[gateIndex],
        };

        if (currentSection === 'personality') {
          result.personalityGates.push(activation);
        } else {
          result.designGates.push(activation);
        }
        gateIndex++;
      }
      continue;
    }

    // Key-value pairs (e.g., "Type:" followed by value or "- Type:")
    if (line.includes(':')) {
      const [key, ...valueParts] = line.replace(/^-\s*/, '').split(':');
      const value = valueParts.join(':').trim();
      const keyLower = key.toLowerCase().trim();

      // Handle "Key: Value" on same line
      if (value) {
        if (keyLower === 'type') {
          result.type = value;
          result.typeId = HD_TYPE_MAP[value.toLowerCase()] || value.toLowerCase().replace(/\s+/g, '-');
        } else if (keyLower === 'strategy') {
          result.strategy = value;
        } else if (keyLower === 'inner authority' || keyLower === 'authority') {
          result.authority = value;
          result.authorityId = HD_AUTHORITY_MAP[value.toLowerCase()] || value.toLowerCase().replace(/\s+/g, '-');
        } else if (keyLower === 'definition') {
          result.definition = value;
          result.definitionId = HD_DEFINITION_MAP[value.toLowerCase()] || value.toLowerCase().replace(/\s+/g, '-');
        } else if (keyLower === 'profile') {
          result.profile = value;
          const profileMatch = value.match(/(\d+)\s*\/\s*(\d+)/);
          if (profileMatch) {
            result.profileLine1 = parseInt(profileMatch[1], 10);
            result.profileLine2 = parseInt(profileMatch[2], 10);
          }
        } else if (keyLower === 'incarnation cross') {
          result.incarnationCross = value;
        } else if (keyLower === 'signature') {
          result.signature = value;
        } else if (keyLower === 'not-self theme' || keyLower === 'not self theme') {
          result.notSelfTheme = value;
        } else if (keyLower === 'digestion') {
          result.variables = result.variables || {};
          result.variables.digestion = value;
        } else if (keyLower === 'environment') {
          result.variables = result.variables || {};
          result.variables.environment = value;
        } else if (keyLower === 'perspective') {
          result.variables = result.variables || {};
          result.variables.perspective = value;
        } else if (keyLower === 'motivation') {
          result.variables = result.variables || {};
          result.variables.motivation = value;
        } else if (keyLower === 'design sense') {
          result.variables = result.variables || {};
          result.variables.designSense = value;
        }
      } else {
        // Handle "Key:" followed by value on next line
        const nextLine = lines[i + 1]?.replace(/^-\s*/, '').trim();
        if (nextLine) {
          if (keyLower === 'type') {
            result.type = nextLine;
            result.typeId = HD_TYPE_MAP[nextLine.toLowerCase()] || nextLine.toLowerCase().replace(/\s+/g, '-');
            i++;
          } else if (keyLower === 'strategy') {
            result.strategy = nextLine;
            i++;
          } else if (keyLower === 'inner authority' || keyLower === 'authority') {
            result.authority = nextLine;
            result.authorityId = HD_AUTHORITY_MAP[nextLine.toLowerCase()] || nextLine.toLowerCase().replace(/\s+/g, '-');
            i++;
          }
          // ... similar for other fields
        }
      }
      continue;
    }

    // Defined Centers section
    if (lowerLine === 'defined centers:' || lowerLine.startsWith('- defined centers')) {
      // Read subsequent lines starting with space or dash
      for (let j = i + 1; j < lines.length; j++) {
        const centerLine = lines[j].replace(/^-\s*/, '').trim().toLowerCase();
        if (!centerLine || centerLine.includes(':')) break;
        const centerId = CENTER_MAP[centerLine];
        if (centerId) {
          result.definedCenterIds.push(centerId);
        }
        i = j;
      }
      continue;
    }

    // Undefined Centers section
    if (lowerLine === 'undefined centers:' || lowerLine.startsWith('- undefined centers')) {
      for (let j = i + 1; j < lines.length; j++) {
        const centerLine = lines[j].replace(/^-\s*/, '').trim().toLowerCase();
        if (!centerLine || centerLine.includes(':')) break;
        const centerId = CENTER_MAP[centerLine];
        if (centerId) {
          result.undefinedCenterIds.push(centerId);
        }
        i = j;
      }
      continue;
    }

    // Channels section (e.g., "- 43 - 23")
    if (lowerLine === 'channels:' || lowerLine.startsWith('- channels')) {
      for (let j = i + 1; j < lines.length; j++) {
        const channelLine = lines[j].replace(/^-\s*/, '').trim();
        const channelMatch = channelLine.match(/^(\d+)\s*-\s*(\d+)$/);
        if (channelMatch) {
          const gate1 = parseInt(channelMatch[1], 10);
          const gate2 = parseInt(channelMatch[2], 10);
          // Store as "gate1-gate2" with lower number first
          const channelId = `channel-${Math.min(gate1, gate2)}-${Math.max(gate1, gate2)}`;
          result.definedChannelIds.push(channelId);
        } else if (!channelLine || channelLine.includes(':')) {
          break;
        }
        i = j;
      }
      continue;
    }

    // Gates list (e.g., "Gates: 1, 2, 5, 14...")
    // Skip - we already have gates from personality/design sections
    if (lowerLine.startsWith('gates:')) {
      continue;
    }
  }

  // Validate we got essential data
  if (!result.type || result.personalityGates.length === 0) {
    return null;
  }

  return result;
}

/**
 * Convert parsed HD data to HumanDesignProfile format
 */
export function toHumanDesignProfile(
  parsed: ParsedHumanDesignData
): HumanDesignProfile {
  // Map type strings to HDType values
  const typeMap: Record<string, HDType> = {
    'generator': 'Generator',
    'manifesting-generator': 'Manifesting Generator',
    'manifesting generator': 'Manifesting Generator',
    'projector': 'Projector',
    'manifestor': 'Manifestor',
    'reflector': 'Reflector',
  };

  // Map strategy strings to HDStrategy values
  const strategyMap: Record<string, HDStrategy> = {
    'to respond': 'Wait to Respond',
    'wait to respond': 'Wait to Respond',
    'inform then act': 'Inform then Act',
    'inform': 'Inform then Act',
    'wait for invitation': 'Wait for Invitation',
    'wait for the invitation': 'Wait for Invitation',
    'wait for lunar cycle': 'Wait for Lunar Cycle',
  };

  // Map authority strings to HDAuthority values
  const authorityMap: Record<string, HDAuthority> = {
    'emotional': 'Emotional',
    'sacral': 'Sacral',
    'splenic': 'Splenic',
    'ego-manifested': 'Ego/Heart',
    'ego-projected': 'Ego/Heart',
    'ego/heart': 'Ego/Heart',
    'self-projected': 'Self/G',
    'self/g': 'Self/G',
    'mental': 'Mental/None',
    'none': 'Mental/None',
    'lunar': 'Lunar',
  };

  // Map definition strings to HDDefinition values
  const definitionMap: Record<string, HDDefinition> = {
    'single': 'Single',
    'split': 'Split',
    'triple-split': 'Triple Split',
    'quadruple-split': 'Quadruple Split',
    'none': 'No Definition',
  };

  // Create profile string like "5/1"
  const profileStr = `${parsed.profileLine1}/${parsed.profileLine2}` as HDProfile;

  return {
    type: typeMap[parsed.typeId] || typeMap[parsed.type.toLowerCase()] || 'Generator',
    strategy: strategyMap[parsed.strategy.toLowerCase()] || 'Wait to Respond',
    authority: authorityMap[parsed.authorityId] || authorityMap[parsed.authority.toLowerCase()] || 'Emotional',
    profile: profileStr,
    definition: definitionMap[parsed.definitionId] || definitionMap[parsed.definition.toLowerCase()] || 'Single',
    incarnationCross: parsed.incarnationCross || undefined,
    personalityGates: parsed.personalityGates,
    designGates: parsed.designGates,
    definedCenterIds: parsed.definedCenterIds,
    definedChannelIds: parsed.definedChannelIds,
  };
}
