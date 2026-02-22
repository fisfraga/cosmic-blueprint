/**
 * Chart Calculation Service
 *
 * Core calculation pipeline for deriving Gene Keys and Human Design profiles
 * from birth data using planetary positions.
 *
 * Design Philosophy:
 * - Birth data is immutable input
 * - All profiles are derived from planetary positions
 * - Supports both local calculation and future API integration
 */

import type {
  BirthData,
  CalculatedChart,
  PlanetaryPosition,
  GeneKeysProfile,
  GeneKeySphere,
  HumanDesignProfile,
  HDGateActivation,
  HDType,
  HDAuthority,
  HDDefinition,
  HDProfile,
  NumerologyProfile,
} from '../types';
import { getPlanetaryPositions, isRetrograde, type PlanetaryPositions } from './ephemeris';
import { getGateByDegree, hdChannels } from '../data';
import { enrichProfile } from './profileEnrichment';

// Calculation version for tracking
const CALCULATION_VERSION = '1.0.0';

// Planet IDs in standard order (13-planet Human Design model)
const PLANET_IDS = [
  'sun',
  'earth',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
  'true-node',
  'chiron',
] as const;

// Zodiac signs for position mapping
const ZODIAC_SIGNS = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
];

/**
 * Calculate Earth position from Sun (opposite point)
 */
function calculateEarthLongitude(sunLongitude: number): number {
  return (sunLongitude + 180) % 360;
}

/**
 * Get sign ID from ecliptic longitude
 */
function getSignFromLongitude(longitude: number): string {
  const normalizedLon = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLon / 30);
  return ZODIAC_SIGNS[signIndex];
}

/**
 * Get degree within sign from ecliptic longitude
 */
function getDegreeInSign(longitude: number): { degree: number; minute: number } {
  const normalizedLon = ((longitude % 360) + 360) % 360;
  const degreeInSign = normalizedLon % 30;
  const degree = Math.floor(degreeInSign);
  const minute = Math.floor((degreeInSign - degree) * 60);
  return { degree, minute };
}

/**
 * Convert ephemeris positions to PlanetaryPosition array
 */
function toPlanetaryPositions(
  ephemerisPositions: PlanetaryPositions
): PlanetaryPosition[] {
  const positions: PlanetaryPosition[] = [];
  const date = ephemerisPositions.date;

  // Add all planets
  for (const planetId of PLANET_IDS) {
    if (planetId === 'earth') {
      // Calculate Earth from Sun
      const sunLon = ephemerisPositions.sun;
      const earthLon = calculateEarthLongitude(sunLon);
      const { degree, minute } = getDegreeInSign(earthLon);
      positions.push({
        planetId: 'earth',
        longitude: earthLon,
        signId: getSignFromLongitude(earthLon),
        degree,
        minute,
        retrograde: false, // Earth never retrograde from our perspective
      });
    } else {
      const longitude =
        ephemerisPositions[planetId as keyof PlanetaryPositions];
      if (typeof longitude === 'number') {
        const { degree, minute } = getDegreeInSign(longitude);
        positions.push({
          planetId,
          longitude,
          signId: getSignFromLongitude(longitude),
          degree,
          minute,
          retrograde: isRetrograde(planetId, date),
        });
      }
    }
  }

  return positions;
}

/**
 * Calculate the Design Date (approximately 88 solar degrees before birth)
 *
 * The Design in Human Design represents the unconscious aspects,
 * calculated from the moment when the Sun was 88 degrees earlier
 * in its apparent path around the Earth.
 *
 * This is approximately 88 days before birth, but varies because
 * the Sun's apparent speed varies throughout the year.
 */
export function calculateDesignDate(
  birthDate: Date,
  birthSunLongitude: number
): Date {
  // Target: Sun at 88 degrees earlier than birth position
  const targetSunLongitude = ((birthSunLongitude - 88) % 360 + 360) % 360;

  // Binary search to find the exact date
  // Start with estimate of ~91 days before (average)
  let lowDate = new Date(birthDate.getTime() - 100 * 24 * 60 * 60 * 1000);
  let highDate = new Date(birthDate.getTime() - 80 * 24 * 60 * 60 * 1000);

  // Binary search for 20 iterations for high precision
  for (let i = 0; i < 20; i++) {
    const midTime = (lowDate.getTime() + highDate.getTime()) / 2;
    const midDate = new Date(midTime);
    const positions = getPlanetaryPositions(midDate);
    const sunLon = positions.sun;

    // Calculate angular difference (accounting for wraparound)
    let diff = targetSunLongitude - sunLon;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    if (Math.abs(diff) < 0.001) {
      // Close enough (within ~3.6 arc seconds)
      return midDate;
    }

    // Sun moves forward in zodiac, so earlier date = earlier in zodiac
    if (diff > 0) {
      // Target is ahead, need later date
      lowDate = midDate;
    } else {
      // Target is behind, need earlier date
      highDate = midDate;
    }
  }

  // Return best estimate
  return new Date((lowDate.getTime() + highDate.getTime()) / 2);
}

/**
 * Get Gate and Line from ecliptic longitude
 */
function getGateAndLine(longitude: number): { gateNumber: number; line: number } | null {
  const result = getGateByDegree(longitude);
  if (!result) return null;

  // getGateByDegree returns { gate: HDGate, line: number }
  return {
    gateNumber: result.gate.gateNumber,
    line: result.line,
  };
}

/**
 * Convert planetary positions to HD Gate activations.
 * Exported so that scripts (e.g. calculate-profiles.ts) can recompute gate
 * activations after injecting accurate positions from an external source.
 */
export function toGateActivations(
  positions: PlanetaryPosition[],
  isPersonality: boolean
): HDGateActivation[] {
  const activations: HDGateActivation[] = [];
  // 13-planet HD model: Sun, Earth, Moon, 8 traditional planets + True Node + Chiron
  const planetOrder = [
    'sun',
    'earth',
    'moon',
    'mercury',
    'venus',
    'mars',
    'jupiter',
    'saturn',
    'uranus',
    'neptune',
    'pluto',
    'true-node',
    'chiron',
  ];

  // Map planet IDs to display names used in gate activations
  const planetNameMap: Record<string, string> = {
    sun: 'Sun',
    earth: 'Earth',
    moon: 'Moon',
    mercury: 'Mercury',
    venus: 'Venus',
    mars: 'Mars',
    jupiter: 'Jupiter',
    saturn: 'Saturn',
    uranus: 'Uranus',
    neptune: 'Neptune',
    pluto: 'Pluto',
    'true-node': 'True Node',
    chiron: 'Chiron',
  };

  for (const planetId of planetOrder) {
    const position = positions.find((p) => p.planetId === planetId);
    if (!position) continue;

    const gateInfo = getGateAndLine(position.longitude);
    if (!gateInfo) continue;

    activations.push({
      gateId: `gate-${gateInfo.gateNumber}`,
      gateNumber: gateInfo.gateNumber,
      line: gateInfo.line,
      isPersonality,
      planet: planetNameMap[planetId],
    });
  }

  return activations;
}

/**
 * Create a Gene Key sphere from a planetary position
 * Note: Gene Key numbers correspond 1:1 with HD Gate numbers
 */
function createGeneKeySphere(
  sphereName: string,
  planetarySource: string,
  longitude: number
): GeneKeySphere {
  const gateInfo = getGateAndLine(longitude);

  const geneKeyNumber = gateInfo?.gateNumber || 1;
  const line = gateInfo?.line || 1;

  return {
    sphereName,
    geneKeyId: `gk-${geneKeyNumber}`,
    geneKeyNumber,
    line,
    planetarySource,
  };
}

/**
 * Calculate Gene Keys profile from natal and design positions
 */
export function calculateGeneKeysProfile(
  natalPositions: PlanetaryPosition[],
  designPositions: PlanetaryPosition[]
): GeneKeysProfile {
  // Helper to get position by planet ID
  const getNatal = (planetId: string) =>
    natalPositions.find((p) => p.planetId === planetId)?.longitude || 0;
  const getDesign = (planetId: string) =>
    designPositions.find((p) => p.planetId === planetId)?.longitude || 0;

  return {
    // Activation Sequence
    lifesWork: createGeneKeySphere("Life's Work", 'Natal Sun', getNatal('sun')),
    evolution: createGeneKeySphere('Evolution', 'Natal Earth', getNatal('earth')),
    radiance: createGeneKeySphere('Radiance', 'Pre-Natal / Design Sun', getDesign('sun')),
    purpose: createGeneKeySphere('Purpose', 'Pre-Natal / Design Earth', getDesign('earth')),

    // Venus Sequence
    attraction: createGeneKeySphere('Attraction', 'Pre-Natal / Design Moon', getDesign('moon')),
    iq: createGeneKeySphere('IQ', 'Natal Venus', getNatal('venus')),
    eq: createGeneKeySphere('EQ', 'Natal Mars', getNatal('mars')),
    sq: createGeneKeySphere('SQ', 'Pre-Natal / Design Venus', getDesign('venus')),
    core: createGeneKeySphere('Core', 'Pre-Natal / Design Mars', getDesign('mars')),

    // Pearl Sequence
    vocation: createGeneKeySphere('Vocation', 'Pre-Natal / Design Mars', getDesign('mars')),
    culture: createGeneKeySphere('Culture', 'Pre-Natal / Design Jupiter', getDesign('jupiter')),
    pearl: createGeneKeySphere('Pearl', 'Natal Jupiter', getNatal('jupiter')),

    // Additional spheres
    brand: createGeneKeySphere('Brand', 'Natal Sun', getNatal('sun')),
    relating: createGeneKeySphere('Relating', 'Natal Mercury', getNatal('mercury')),
    creativity: createGeneKeySphere('Creativity', 'Pre-Natal / Design Uranus', getDesign('uranus')),
    stability: createGeneKeySphere('Stability', 'Pre-Natal / Design Saturn', getDesign('saturn')),

    // Core Identity
    coreIdentity: {
      sun: {
        geneKeyId: `gk-${getGateAndLine(getNatal('sun'))?.gateNumber || 1}`,
        geneKeyNumber: getGateAndLine(getNatal('sun'))?.gateNumber || 1,
        line: getGateAndLine(getNatal('sun'))?.line || 1,
        sphereName: "Life's Work",
      },
      moon: {
        geneKeyId: `gk-${getGateAndLine(getNatal('moon'))?.gateNumber || 1}`,
        geneKeyNumber: getGateAndLine(getNatal('moon'))?.gateNumber || 1,
        line: getGateAndLine(getNatal('moon'))?.line || 1,
        sphereName: 'Emotional Core',
      },
      mercury: {
        geneKeyId: `gk-${getGateAndLine(getNatal('mercury'))?.gateNumber || 1}`,
        geneKeyNumber: getGateAndLine(getNatal('mercury'))?.gateNumber || 1,
        line: getGateAndLine(getNatal('mercury'))?.line || 1,
        sphereName: 'Relating',
      },
      ascendant: {
        geneKeyId: 'gk-44', // Ascendant typically needs house calculation
        geneKeyNumber: 44,
        line: 4,
        sphereName: 'Aura',
      },
    },
  };
}

/**
 * Calculate defined centers and channels from gate activations
 * A center becomes defined when BOTH gates of a channel are activated
 */
function calculateDefinedCenters(
  personalityGates: HDGateActivation[],
  designGates: HDGateActivation[]
): { definedCenterIds: string[]; definedChannelIds: string[] } {
  const allGateNumbers = new Set([
    ...personalityGates.map((g) => g.gateNumber),
    ...designGates.map((g) => g.gateNumber),
  ]);

  const definedChannelIds: string[] = [];
  const definedCentersSet = new Set<string>();

  // Check each channel - both gates must be active for channel to be defined
  hdChannels.forEach((channel, channelId) => {
    if (
      channel.gate1Number &&
      channel.gate2Number &&
      allGateNumbers.has(channel.gate1Number) &&
      allGateNumbers.has(channel.gate2Number)
    ) {
      definedChannelIds.push(channelId);
      if (channel.center1Id) definedCentersSet.add(channel.center1Id);
      if (channel.center2Id) definedCentersSet.add(channel.center2Id);
    }
  });

  return {
    definedCenterIds: Array.from(definedCentersSet),
    definedChannelIds,
  };
}

/**
 * Motor-to-Throat channel IDs in the Human Design system.
 * A motor center (Heart, Solar Plexus, Sacral, Root) must be connected to Throat
 * via a defined channel for Manifestor or Manifesting Generator status.
 */
const MOTOR_TO_THROAT_CHANNEL_IDS = new Set([
  'channel-12-22', // Solar Plexus <-> Throat
  'channel-20-34', // Sacral <-> Throat
  'channel-21-45', // Heart <-> Throat
  'channel-35-36', // Solar Plexus <-> Throat
]);

/**
 * Determine HD Type from defined centers and channels.
 *
 * HD Type rules:
 * - Reflector: No defined centers (all 9 undefined) — ~1% of population
 * - Generator: Sacral defined, no motor-to-throat connection
 * - Manifesting Generator: Sacral defined + motor connected to Throat via channel
 * - Manifestor: No Sacral, but a motor center is connected to Throat via channel
 * - Projector: No Sacral, no motor-to-throat connection (may have other centers defined)
 */
function determineHDType(definedCenterIds: string[], definedChannelIds: string[]): HDType {
  const hasSacral = definedCenterIds.includes('sacral-center');
  const hasMotorToThroat = definedChannelIds.some((id) =>
    MOTOR_TO_THROAT_CHANNEL_IDS.has(id)
  );

  if (definedCenterIds.length === 0) {
    return 'Reflector';
  }
  if (hasSacral && hasMotorToThroat) {
    return 'Manifesting Generator';
  }
  if (hasSacral) {
    return 'Generator';
  }
  if (hasMotorToThroat) {
    return 'Manifestor';
  }
  return 'Projector';
}

/**
 * Determine HD Authority from defined centers
 */
function determineHDAuthority(definedCenterIds: string[]): HDAuthority {
  if (definedCenterIds.includes('solar-plexus-center')) {
    return 'Emotional';
  }
  if (definedCenterIds.includes('sacral-center')) {
    return 'Sacral';
  }
  if (definedCenterIds.includes('spleen-center')) {
    return 'Splenic';
  }
  if (definedCenterIds.includes('heart-center')) {
    return 'Ego/Heart';
  }
  if (definedCenterIds.includes('g-center')) {
    return 'Self/G';
  }
  if (
    definedCenterIds.includes('head-center') ||
    definedCenterIds.includes('ajna-center')
  ) {
    return 'Mental/None';
  }
  return 'Lunar';
}

/**
 * Get HD Profile from personality and design Sun lines
 */
function getHDProfile(
  personalitySunLine: number,
  designSunLine: number
): HDProfile {
  const profileKey = `${personalitySunLine}/${designSunLine}`;
  const validProfiles: HDProfile[] = [
    '1/3',
    '1/4',
    '2/4',
    '2/5',
    '3/5',
    '3/6',
    '4/6',
    '4/1',
    '5/1',
    '5/2',
    '6/2',
    '6/3',
  ];
  return validProfiles.includes(profileKey as HDProfile)
    ? (profileKey as HDProfile)
    : '5/1';
}

/**
 * Calculate Human Design profile from positions
 * Note: This is a simplified calculation. Full HD requires:
 * - Complete channel mapping
 * - Center definition logic
 * - Detailed type/authority determination
 */
export function calculateHumanDesignProfile(
  natalPositions: PlanetaryPosition[],
  designPositions: PlanetaryPosition[]
): HumanDesignProfile {
  const personalityGates = toGateActivations(natalPositions, true);
  const designGates = toGateActivations(designPositions, false);

  // Get Sun lines for profile
  const personalitySun = personalityGates.find((g) => g.planet === 'Sun');
  const designSun = designGates.find((g) => g.planet === 'Sun');

  // Build incarnation cross from Sun/Earth gates
  const natalSunGate = personalityGates.find((g) => g.planet === 'Sun')?.gateNumber;
  const natalEarthGate = personalityGates.find((g) => g.planet === 'Earth')?.gateNumber;
  const designSunGate = designGates.find((g) => g.planet === 'Sun')?.gateNumber;
  const designEarthGate = designGates.find((g) => g.planet === 'Earth')?.gateNumber;

  const incarnationCross = `Cross of ${natalSunGate}/${natalEarthGate} | ${designSunGate}/${designEarthGate}`;

  // Calculate defined centers and channels from gate activations
  const { definedCenterIds, definedChannelIds } = calculateDefinedCenters(
    personalityGates,
    designGates
  );

  const hdType = determineHDType(definedCenterIds, definedChannelIds);
  const authority = determineHDAuthority(definedCenterIds);
  const profile = getHDProfile(
    personalitySun?.line || 5,
    designSun?.line || 1
  );

  // Determine definition type based on how centers connect
  const definitionType = definedCenterIds.length === 0
    ? 'No Definition'
    : definedChannelIds.length <= 2
      ? 'Single'
      : definedChannelIds.length <= 4
        ? 'Split'
        : definedChannelIds.length <= 6
          ? 'Triple Split'
          : 'Quadruple Split';

  return {
    type: hdType,
    strategy: hdType === 'Generator' || hdType === 'Manifesting Generator'
      ? 'Wait to Respond'
      : hdType === 'Projector'
        ? 'Wait for Invitation'
        : hdType === 'Manifestor'
          ? 'Inform then Act'
          : 'Wait for Lunar Cycle',
    authority,
    profile,
    definition: definitionType as HDDefinition,
    incarnationCross,
    personalityGates,
    designGates,
    definedCenterIds,
    definedChannelIds,

    coreIdentity: {
      sun: {
        gateId: `gate-${personalitySun?.gateNumber || 32}`,
        gateNumber: personalitySun?.gateNumber || 32,
        line: personalitySun?.line || 5,
        centerName: 'Spleen', // Would need gate-to-center mapping
      },
      moon: {
        gateId: `gate-${personalityGates.find((g) => g.planet === 'Moon')?.gateNumber || 21}`,
        gateNumber: personalityGates.find((g) => g.planet === 'Moon')?.gateNumber || 21,
        line: personalityGates.find((g) => g.planet === 'Moon')?.line || 4,
        centerName: 'Heart',
      },
      mercury: {
        gateId: `gate-${personalityGates.find((g) => g.planet === 'Mercury')?.gateNumber || 50}`,
        gateNumber: personalityGates.find((g) => g.planet === 'Mercury')?.gateNumber || 50,
        line: personalityGates.find((g) => g.planet === 'Mercury')?.line || 5,
        centerName: 'Spleen',
      },
      ascendant: {
        gateId: 'gate-44',
        gateNumber: 44,
        line: 4,
        centerName: 'Spleen',
      },
    },
  };
}

/**
 * Parse birth data to UTC Date using the birth location's timezone.
 *
 * Constructs a Date that represents the exact UTC moment of birth by
 * resolving the IANA timezone offset at the given local date/time.
 */
function parseBirthToUTC(birthData: BirthData): Date {
  const { dateOfBirth, timeOfBirth, timezone } = birthData;
  const [year, month, day] = dateOfBirth.split('-').map(Number);
  const [hour, minute] = timeOfBirth.split(':').map(Number);

  // Use Intl to derive the UTC offset for the target timezone at the given moment.
  //
  // Step 1: Create a UTC date for the given calendar values.
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));

  // Step 2: Format that UTC instant in the target timezone to see what
  // local clock values it would produce.
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(utcGuess);

  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);

  const tzYear = get('year');
  const tzMonth = get('month');
  const tzDay = get('day');
  const tzHour = get('hour') === 24 ? 0 : get('hour');
  const tzMinute = get('minute');

  // Step 3: The offset is the difference between the UTC guess and
  // the timezone-local representation of that same instant.
  const localFromTz = new Date(
    Date.UTC(tzYear, tzMonth - 1, tzDay, tzHour, tzMinute, 0)
  );
  const offsetMs = localFromTz.getTime() - utcGuess.getTime();

  // Step 4: The real UTC moment is the desired local time minus the offset.
  return new Date(utcGuess.getTime() - offsetMs);
}

/**
 * Master calculation function
 * Takes birth data and returns a complete calculated chart
 */
export function calculateFullChart(birthData: BirthData): CalculatedChart {
  // Parse birth date to UTC
  const natalDate = parseBirthToUTC(birthData);

  // Get natal planetary positions
  const natalEphemeris = getPlanetaryPositions(natalDate);
  const natalPositions = toPlanetaryPositions(natalEphemeris);

  // Calculate design date (88 solar degrees before)
  const designDate = calculateDesignDate(natalDate, natalEphemeris.sun);

  // Get design planetary positions
  const designEphemeris = getPlanetaryPositions(designDate);
  const designPositions = toPlanetaryPositions(designEphemeris);

  // Convert to gate activations
  const natalGates = toGateActivations(natalPositions, true);
  const designGates = toGateActivations(designPositions, false);

  return {
    calculatedAt: new Date().toISOString(),
    calculationVersion: CALCULATION_VERSION,
    source: 'local',
    natalDate: natalDate.toISOString(),
    designDate: designDate.toISOString(),
    natalPositions,
    designPositions,
    natalGates,
    designGates,
  };
}

/**
 * Calculate complete profiles from birth data
 */
export function calculateProfilesFromBirthData(birthData: BirthData): {
  calculatedChart: CalculatedChart;
  geneKeysProfile: GeneKeysProfile;
  humanDesignProfile: HumanDesignProfile;
  numerologyProfile?: NumerologyProfile;
} {
  const calculatedChart = calculateFullChart(birthData);

  const geneKeysProfile = calculateGeneKeysProfile(
    calculatedChart.natalPositions,
    calculatedChart.designPositions
  );

  const humanDesignProfile = calculateHumanDesignProfile(
    calculatedChart.natalPositions,
    calculatedChart.designPositions
  );

  // Enrich with numerology (chakra + alchemy require NatalPlacements, added later)
  const enrichment = enrichProfile(birthData);

  return {
    calculatedChart,
    geneKeysProfile,
    humanDesignProfile,
    ...enrichment,
  };
}
