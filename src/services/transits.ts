// Transit Calculation Service
// Uses accurate ephemeris data for planetary positions with simplified astronomical fallbacks

import { getPlanetaryPositions, longitudeToZodiac } from './ephemeris';

export interface TransitPosition {
  planetId: string;
  planetName: string;
  symbol: string;
  signId: string;
  signName: string;
  signSymbol: string;
  degree: number;
  formattedDegree: string;
  isRetrograde: boolean;
  housePosition?: number;
}

export interface TransitAspect {
  planet1: string;
  planet2: string;
  aspectType: string;
  aspectSymbol: string;
  orb: number;
  isApplying: boolean;
  nature: 'harmonious' | 'challenging' | 'neutral';
}

export interface CosmicWeather {
  date: Date;
  moonPhase: {
    name: string;
    illumination: number;
    emoji: string;
    moonSign: string;
    moonSignSymbol: string;
    moonDegree: string;
  };
  positions: TransitPosition[];
  significantAspects: TransitAspect[];
  retrogradeCount: number;
}

// Zodiac sign data
const SIGNS = [
  { id: 'aries', name: 'Aries', symbol: '♈', startDegree: 0 },
  { id: 'taurus', name: 'Taurus', symbol: '♉', startDegree: 30 },
  { id: 'gemini', name: 'Gemini', symbol: '♊', startDegree: 60 },
  { id: 'cancer', name: 'Cancer', symbol: '♋', startDegree: 90 },
  { id: 'leo', name: 'Leo', symbol: '♌', startDegree: 120 },
  { id: 'virgo', name: 'Virgo', symbol: '♍', startDegree: 150 },
  { id: 'libra', name: 'Libra', symbol: '♎', startDegree: 180 },
  { id: 'scorpio', name: 'Scorpio', symbol: '♏', startDegree: 210 },
  { id: 'sagittarius', name: 'Sagittarius', symbol: '♐', startDegree: 240 },
  { id: 'capricorn', name: 'Capricorn', symbol: '♑', startDegree: 270 },
  { id: 'aquarius', name: 'Aquarius', symbol: '♒', startDegree: 300 },
  { id: 'pisces', name: 'Pisces', symbol: '♓', startDegree: 330 },
];

// Planet orbital data (simplified)
const PLANETS = [
  { id: 'sun', name: 'Sun', symbol: '☉', orbitalPeriod: 365.25, basePosition: 280 }, // ~Capricorn at J2000
  { id: 'moon', name: 'Moon', symbol: '☽', orbitalPeriod: 27.32, basePosition: 0 },
  { id: 'mercury', name: 'Mercury', symbol: '☿', orbitalPeriod: 87.97, basePosition: 250 },
  { id: 'venus', name: 'Venus', symbol: '♀', orbitalPeriod: 224.7, basePosition: 180 },
  { id: 'mars', name: 'Mars', symbol: '♂', orbitalPeriod: 686.98, basePosition: 355 },
  { id: 'jupiter', name: 'Jupiter', symbol: '♃', orbitalPeriod: 4332.59, basePosition: 34 },
  { id: 'saturn', name: 'Saturn', symbol: '♄', orbitalPeriod: 10759.22, basePosition: 50 },
  { id: 'uranus', name: 'Uranus', symbol: '♅', orbitalPeriod: 30688.5, basePosition: 316 },
  { id: 'neptune', name: 'Neptune', symbol: '♆', orbitalPeriod: 60182, basePosition: 304 },
  { id: 'pluto', name: 'Pluto', symbol: '♇', orbitalPeriod: 90560, basePosition: 254 },
];

// Reference epoch: January 1, 2000, 12:00 TT (J2000)
const J2000 = new Date('2000-01-01T12:00:00Z').getTime();

// Aspect definitions
const ASPECTS = [
  { name: 'Conjunction', symbol: '☌', angle: 0, orb: 8, nature: 'neutral' as const },
  { name: 'Sextile', symbol: '⚹', angle: 60, orb: 6, nature: 'harmonious' as const },
  { name: 'Square', symbol: '□', angle: 90, orb: 8, nature: 'challenging' as const },
  { name: 'Trine', symbol: '△', angle: 120, orb: 8, nature: 'harmonious' as const },
  { name: 'Opposition', symbol: '☍', angle: 180, orb: 8, nature: 'challenging' as const },
];

function daysSinceJ2000(date: Date): number {
  return (date.getTime() - J2000) / (1000 * 60 * 60 * 24);
}

// Simplified retrograde detection (approximate)
function isRetrograde(planetId: string, date: Date): boolean {
  // Mercury retrograde: ~3 times per year, ~3 weeks each
  // This is a simplified approximation
  if (planetId === 'mercury') {
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    // Approximate retrograde windows (simplified)
    const retroWindows = [
      [10, 31], [105, 126], [200, 221], [295, 316]
    ];
    return retroWindows.some(([start, end]) => dayOfYear >= start && dayOfYear <= end);
  }

  // Venus retrograde: ~every 18 months, ~40 days
  if (planetId === 'venus') {
    const days = daysSinceJ2000(date);
    const venusRetroCycle = 584; // synodic period
    const posInCycle = ((days % venusRetroCycle) + venusRetroCycle) % venusRetroCycle;
    return posInCycle > 540 || posInCycle < 40;
  }

  // Mars retrograde: ~every 26 months, ~2-2.5 months
  if (planetId === 'mars') {
    const days = daysSinceJ2000(date);
    const marsRetroCycle = 780;
    const posInCycle = ((days % marsRetroCycle) + marsRetroCycle) % marsRetroCycle;
    return posInCycle > 700;
  }

  // Outer planets are retrograde roughly half the year
  if (['jupiter', 'saturn', 'uranus', 'neptune', 'pluto'].includes(planetId)) {
    const days = daysSinceJ2000(date);
    // Simplified: use sine wave to approximate
    const period = planetId === 'jupiter' ? 399 :
                   planetId === 'saturn' ? 378 :
                   planetId === 'uranus' ? 370 :
                   planetId === 'neptune' ? 367 : 366;
    const phase = (days / period) * 2 * Math.PI;
    return Math.sin(phase) > 0.3;
  }

  return false;
}

export function calculatePlanetPosition(planetId: string, date: Date = new Date()): TransitPosition | null {
  const planet = PLANETS.find(p => p.id === planetId);
  if (!planet) return null;

  // Get accurate position from ephemeris
  const positions = getPlanetaryPositions(date);
  const longitude = positions[planetId as keyof typeof positions] as number;

  if (typeof longitude !== 'number') return null;

  const zodiacInfo = longitudeToZodiac(longitude);
  const sign = SIGNS.find(s => s.id === zodiacInfo.sign.toLowerCase());
  const retrograde = isRetrograde(planetId, date);

  const formattedDegree = `${zodiacInfo.degree}°${zodiacInfo.minute.toString().padStart(2, '0')}'`;

  return {
    planetId: planet.id,
    planetName: planet.name,
    symbol: planet.symbol,
    signId: sign?.id || zodiacInfo.sign.toLowerCase(),
    signName: sign?.name || zodiacInfo.sign,
    signSymbol: sign?.symbol || '',
    degree: longitude,
    formattedDegree,
    isRetrograde: retrograde,
  };
}

export function calculateAspects(positions: TransitPosition[]): TransitAspect[] {
  const aspects: TransitAspect[] = [];

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const p1 = positions[i];
      const p2 = positions[j];

      let diff = Math.abs(p1.degree - p2.degree);
      if (diff > 180) diff = 360 - diff;

      for (const aspect of ASPECTS) {
        const orb = Math.abs(diff - aspect.angle);
        if (orb <= aspect.orb) {
          aspects.push({
            planet1: p1.planetName,
            planet2: p2.planetName,
            aspectType: aspect.name,
            aspectSymbol: aspect.symbol,
            orb: Math.round(orb * 10) / 10,
            isApplying: p1.degree < p2.degree, // simplified
            nature: aspect.nature,
          });
          break; // Only one aspect per pair
        }
      }
    }
  }

  // Sort by significance (tighter orbs first)
  return aspects.sort((a, b) => a.orb - b.orb);
}

export function getMoonPhase(date: Date = new Date()): {
  name: string;
  illumination: number;
  emoji: string;
  moonSign: string;
  moonSignSymbol: string;
  moonDegree: string;
} {
  // Get actual Sun and Moon positions from ephemeris
  const positions = getPlanetaryPositions(date);
  const sunLong = positions.sun;
  const moonLong = positions.moon;

  // Calculate phase angle (Moon's elongation from Sun)
  // 0° = New Moon, 90° = First Quarter, 180° = Full Moon, 270° = Last Quarter
  let phaseAngle = moonLong - sunLong;
  if (phaseAngle < 0) phaseAngle += 360;

  // Calculate illumination from phase angle
  // Illumination = (1 - cos(phaseAngle)) / 2 * 100
  const illumination = Math.round((1 - Math.cos(phaseAngle * Math.PI / 180)) / 2 * 100);

  // Get Moon's zodiac position
  const moonZodiac = longitudeToZodiac(moonLong);
  const moonSign = moonZodiac.sign;
  const moonSignSymbol = SIGNS.find(s => s.name.toLowerCase() === moonSign.toLowerCase())?.symbol || '';
  const moonDegree = `${moonZodiac.degree}°${moonZodiac.minute.toString().padStart(2, '0')}'`;

  // Determine phase based on angle ranges (8 phases, 45° each)
  const phases = [
    { name: 'New Moon', emoji: '🌑', startAngle: 0 },
    { name: 'Waxing Crescent', emoji: '🌒', startAngle: 45 },
    { name: 'First Quarter', emoji: '🌓', startAngle: 90 },
    { name: 'Waxing Gibbous', emoji: '🌔', startAngle: 135 },
    { name: 'Full Moon', emoji: '🌕', startAngle: 180 },
    { name: 'Waning Gibbous', emoji: '🌖', startAngle: 225 },
    { name: 'Last Quarter', emoji: '🌗', startAngle: 270 },
    { name: 'Waning Crescent', emoji: '🌘', startAngle: 315 },
  ];

  // Find current phase (with ±22.5° tolerance for each phase)
  let currentPhase = phases[0];
  for (let i = phases.length - 1; i >= 0; i--) {
    if (phaseAngle >= phases[i].startAngle - 22.5) {
      currentPhase = phases[i];
      break;
    }
  }
  // Handle wrap-around for New Moon (337.5° to 22.5°)
  if (phaseAngle >= 337.5 || phaseAngle < 22.5) {
    currentPhase = phases[0];
  }

  return {
    name: currentPhase.name,
    illumination,
    emoji: currentPhase.emoji,
    moonSign,
    moonSignSymbol,
    moonDegree,
  };
}

export function getCosmicWeather(date: Date = new Date()): CosmicWeather {
  const positions: TransitPosition[] = [];

  for (const planet of PLANETS) {
    const position = calculatePlanetPosition(planet.id, date);
    if (position) {
      positions.push(position);
    }
  }

  const aspects = calculateAspects(positions);
  const moonPhase = getMoonPhase(date);
  const retrogradeCount = positions.filter(p => p.isRetrograde).length;

  // Filter to significant aspects (tight orb, major planets)
  const significantAspects = aspects
    .filter(a => a.orb < 3)
    .slice(0, 5);

  return {
    date,
    moonPhase,
    positions,
    significantAspects,
    retrogradeCount,
  };
}

/**
 * Get cosmic weather for each day in a month
 */
export function getTransitsForMonth(year: number, month: number): Map<number, CosmicWeather> {
  const result = new Map<number, CosmicWeather>();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day, 12, 0, 0); // Noon to avoid timezone issues
    result.set(day, getCosmicWeather(date));
  }

  return result;
}

/**
 * Get days in a month that have major aspects (tight orb)
 */
export function getMajorAspectDays(year: number, month: number): { day: number; nature: 'harmonious' | 'challenging' | 'mixed'; aspectCount: number }[] {
  const result: { day: number; nature: 'harmonious' | 'challenging' | 'mixed'; aspectCount: number }[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day, 12, 0, 0);
    const weather = getCosmicWeather(date);

    // Only consider tight aspects (orb < 2 degrees)
    const majorAspects = weather.significantAspects.filter(a => a.orb < 2);

    if (majorAspects.length > 0) {
      const harmonious = majorAspects.filter(a => a.nature === 'harmonious').length;
      const challenging = majorAspects.filter(a => a.nature === 'challenging').length;

      let nature: 'harmonious' | 'challenging' | 'mixed';
      if (harmonious > 0 && challenging > 0) {
        nature = 'mixed';
      } else if (harmonious > 0) {
        nature = 'harmonious';
      } else {
        nature = 'challenging';
      }

      result.push({ day, nature, aspectCount: majorAspects.length });
    }
  }

  return result;
}

export function getTransitInterpretation(position: TransitPosition): string {
  const interpretations: Record<string, Record<string, string>> = {
    sun: {
      aries: 'A time of new beginnings and assertive self-expression. Energy is high and initiative comes naturally.',
      taurus: 'Focus on stability, sensual pleasures, and building lasting value. Patience brings rewards.',
      gemini: 'Curiosity peaks and communication flows. Ideas want to be shared and connections made.',
      cancer: 'Emotional depth calls. Home, family, and nurturing needs come to the forefront.',
      leo: 'Creative confidence radiates. Time to shine, lead, and express your authentic heart.',
      virgo: 'Details matter now. Service, health, and practical improvements call for attention.',
      libra: 'Relationships take center stage. Balance, beauty, and harmony are the themes.',
      scorpio: 'Intensity deepens. Transformation, intimacy, and hidden truths emerge.',
      sagittarius: 'Horizons expand. Adventure, philosophy, and meaning-seeking are highlighted.',
      capricorn: 'Structure and ambition focus the energy. Long-term goals demand attention.',
      aquarius: 'Innovation and individuality are activated. Community and future visions call.',
      pisces: 'Intuition and compassion flow. Dreams, creativity, and spiritual connection deepen.',
    },
    moon: {
      aries: 'Emotions run hot and impulsive. Honor your need for independence and action.',
      taurus: 'Seek comfort and stability. Nourish yourself through the senses.',
      gemini: 'Mind and feelings dance together. Talk it out, stay curious.',
      cancer: 'Deep emotional tides. Honor your sensitivity and need for safety.',
      leo: 'Express your feelings dramatically. Creative emotional release helps.',
      virgo: 'Process emotions through analysis and service. Practical care soothes.',
      libra: 'Seek emotional harmony through relationship. Balance giving and receiving.',
      scorpio: 'Emotions run deep and intense. Transformation through feeling.',
      sagittarius: 'Freedom-seeking emotions. Adventure and meaning lift the spirits.',
      capricorn: 'Contain emotions constructively. Emotional maturity and responsibility.',
      aquarius: 'Detached perspective on feelings. Community connection helps.',
      pisces: 'Boundary-dissolving sensitivity. Trust intuition and creative flow.',
    },
    mercury: {
      aries: 'Quick, direct thinking. Words come fast and communication is assertive.',
      taurus: 'Methodical, practical thinking. Ideas need grounding before sharing.',
      gemini: 'Mind is buzzing with ideas. Peak curiosity and versatile communication.',
      cancer: 'Thinking influenced by feelings. Intuitive perception and nostalgic reflections.',
      leo: 'Bold, creative expression. Ideas want dramatic presentation.',
      virgo: 'Analytical precision. Perfect for detailed work and health matters.',
      libra: 'Diplomatic communication. Weighing all sides before deciding.',
      scorpio: 'Penetrating insight. Uncovering hidden truths and deeper meanings.',
      sagittarius: 'Big-picture thinking. Philosophical discussions and learning.',
      capricorn: 'Strategic, structured thinking. Planning and practical communication.',
      aquarius: 'Innovative ideas. Unconventional thinking and group discussions.',
      pisces: 'Intuitive, imaginative thinking. Creative writing and spiritual insights.',
    },
    venus: {
      aries: 'Passionate attractions and direct affection. Bold in love.',
      taurus: 'Sensual pleasures and material comfort. Appreciation for beauty.',
      gemini: 'Flirtatious, playful connections. Love through conversation.',
      cancer: 'Nurturing affection. Security in relationships matters most.',
      leo: 'Romantic drama and generous love. Creative self-expression.',
      virgo: 'Service as love language. Practical care and attention to detail.',
      libra: 'Harmonious relationships. Peak appreciation for art and beauty.',
      scorpio: 'Deep, intense connections. Transformative love experiences.',
      sagittarius: 'Freedom in love. Adventure and philosophical connections.',
      capricorn: 'Committed, serious relationships. Building lasting value.',
      aquarius: 'Unique connections. Friendship-based love and social values.',
      pisces: 'Unconditional love. Compassionate, spiritual connections.',
    },
    mars: {
      aries: 'Peak energy and drive. Initiative and competitive spirit.',
      taurus: 'Steady, persistent action. Building tangible results.',
      gemini: 'Mental energy and verbal sparring. Multitasking.',
      cancer: 'Protective action. Fighting for home and family.',
      leo: 'Creative drive and leadership. Courageous self-expression.',
      virgo: 'Detailed, efficient action. Service-oriented energy.',
      libra: 'Diplomatic action. Fighting for fairness and balance.',
      scorpio: 'Intense, strategic action. Transformative power.',
      sagittarius: 'Adventurous energy. Pursuing truth and expansion.',
      capricorn: 'Ambitious, disciplined action. Climbing toward goals.',
      aquarius: 'Innovative action. Fighting for collective ideals.',
      pisces: 'Inspired action. Compassionate and imaginative drive.',
    },
    jupiter: {
      aries: 'Expansion through initiative and courage.',
      taurus: 'Growth through material abundance and values.',
      gemini: 'Learning and communication opportunities abound.',
      cancer: 'Emotional and domestic expansion.',
      leo: 'Creative and confident growth.',
      virgo: 'Expansion through service and skill development.',
      libra: 'Growth through relationships and partnerships.',
      scorpio: 'Deep transformation and shared resource expansion.',
      sagittarius: 'Peak expansion and philosophical growth.',
      capricorn: 'Structured growth and career expansion.',
      aquarius: 'Innovative expansion and community growth.',
      pisces: 'Spiritual expansion and compassionate growth.',
    },
    saturn: {
      aries: 'Learning discipline in action and leadership.',
      taurus: 'Building lasting material foundations.',
      gemini: 'Structuring communication and learning.',
      cancer: 'Emotional maturity and family responsibilities.',
      leo: 'Disciplined creativity and leadership lessons.',
      virgo: 'Mastering practical skills and service.',
      libra: 'Relationship commitments and social responsibilities.',
      scorpio: 'Deep psychological work and power lessons.',
      sagittarius: 'Structuring beliefs and ethical foundations.',
      capricorn: 'Peak achievement and career mastery.',
      aquarius: 'Community responsibilities and innovation discipline.',
      pisces: 'Spiritual discipline and compassion boundaries.',
    },
    uranus: {
      aries: 'Revolutionary independence and sudden changes.',
      taurus: 'Financial and value system disruptions.',
      gemini: 'Revolutionary ideas and communication changes.',
      cancer: 'Home and family life disruptions.',
      leo: 'Creative breakthroughs and identity shifts.',
      virgo: 'Work and health system changes.',
      libra: 'Relationship revolution and social changes.',
      scorpio: 'Psychological breakthroughs and power shifts.',
      sagittarius: 'Belief system revolution.',
      capricorn: 'Career and structural changes.',
      aquarius: 'Peak innovation and collective awakening.',
      pisces: 'Spiritual awakening and dissolution of boundaries.',
    },
    neptune: {
      aries: 'Idealistic action and inspired initiative.',
      taurus: 'Material idealization and artistic values.',
      gemini: 'Imaginative communication and intuitive learning.',
      cancer: 'Emotional idealization and domestic dreams.',
      leo: 'Creative inspiration and romantic ideals.',
      virgo: 'Service idealism and health intuition.',
      libra: 'Relationship idealization and artistic harmony.',
      scorpio: 'Deep spiritual transformation.',
      sagittarius: 'Spiritual seeking and belief expansion.',
      capricorn: 'Career dreams and institutional idealism.',
      aquarius: 'Collective dreams and social idealism.',
      pisces: 'Peak spirituality and compassionate unity.',
    },
    pluto: {
      aries: 'Transformative power and rebirth of self.',
      taurus: 'Value system transformation and material power.',
      gemini: 'Communication transformation and mental power.',
      cancer: 'Family transformation and emotional rebirth.',
      leo: 'Creative power and identity transformation.',
      virgo: 'Work transformation and service power.',
      libra: 'Relationship transformation and social power.',
      scorpio: 'Peak transformation and deep psychological power.',
      sagittarius: 'Belief transformation and spiritual power.',
      capricorn: 'Structural transformation and institutional power.',
      aquarius: 'Collective transformation and revolutionary power.',
      pisces: 'Spiritual transformation and universal power.',
    },
  };

  const planetInterps = interpretations[position.planetId];
  if (planetInterps && planetInterps[position.signId]) {
    return planetInterps[position.signId];
  }

  return `${position.planetName} in ${position.signName} brings the energy of ${position.signName} to ${position.planetName}'s domain.`;
}

/**
 * Get detailed aspect interpretation
 */
export function getAspectInterpretation(aspect: TransitAspect): string {
  const aspectMeanings: Record<string, string> = {
    'Conjunction': 'merging and intensifying',
    'Sextile': 'harmoniously supporting',
    'Square': 'creating tension and growth through challenge with',
    'Trine': 'flowing easily and creatively with',
    'Opposition': 'creating polarity and awareness with',
  };

  const planetArchetypes: Record<string, string> = {
    'Sun': 'identity and vitality',
    'Moon': 'emotions and instincts',
    'Mercury': 'thinking and communication',
    'Venus': 'love and values',
    'Mars': 'action and desire',
    'Jupiter': 'expansion and opportunity',
    'Saturn': 'structure and responsibility',
    'Uranus': 'change and awakening',
    'Neptune': 'dreams and transcendence',
    'Pluto': 'transformation and power',
  };

  const meaning = aspectMeanings[aspect.aspectType] || 'connecting with';
  const p1Archetype = planetArchetypes[aspect.planet1] || aspect.planet1.toLowerCase();
  const p2Archetype = planetArchetypes[aspect.planet2] || aspect.planet2.toLowerCase();

  let baseInterpretation = `${aspect.planet1}'s ${p1Archetype} is ${meaning} ${aspect.planet2}'s ${p2Archetype}.`;

  // Add specific interpretations for key combinations
  const combo = `${aspect.planet1}-${aspect.planet2}-${aspect.aspectType}`;
  const specificInterpretations: Record<string, string> = {
    'Sun-Moon-Conjunction': 'New Moon energy: powerful time for setting intentions and new beginnings.',
    'Sun-Moon-Opposition': 'Full Moon energy: culmination, illumination, and emotional release.',
    'Mercury-Venus-Conjunction': 'Mind and heart align. Excellent for creative expression and harmonious communication.',
    'Mercury-Mars-Square': 'Mental tension can fuel arguments or motivated thinking. Choose words carefully.',
    'Venus-Mars-Conjunction': 'Passion and attraction intensify. Creative and romantic energy merges.',
    'Venus-Saturn-Square': 'Relationship tests and value reassessments. Growth through commitment challenges.',
    'Mars-Saturn-Square': 'Frustration with obstacles. Disciplined action overcomes resistance.',
    'Jupiter-Saturn-Conjunction': 'Major cycle begins. Balance expansion with structure for lasting success.',
    'Saturn-Uranus-Square': 'Old vs. new tension. Breakthrough requires integrating tradition with innovation.',
    'Neptune-Pluto-Sextile': 'Generational spiritual transformation. Collective unconscious shifts subtly.',
  };

  if (specificInterpretations[combo]) {
    return specificInterpretations[combo];
  }

  // Add nature-specific context
  if (aspect.nature === 'harmonious') {
    baseInterpretation += ' This supportive energy flows naturally.';
  } else if (aspect.nature === 'challenging') {
    baseInterpretation += ' This tension creates growth through conscious integration.';
  } else {
    baseInterpretation += ' This intensification requires awareness and conscious expression.';
  }

  return baseInterpretation;
}
