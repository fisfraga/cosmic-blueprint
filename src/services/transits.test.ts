// ============================================
// Tests for Transit Calculation Service
// ============================================

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  calculatePlanetPosition,
  calculateAspects,
  getMoonPhase,
  getCosmicWeather,
  getTransitInterpretation,
  getAspectInterpretation,
  type TransitPosition,
  type TransitAspect,
} from './transits';

describe('Transit Calculation Service', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Set to a known date within the ephemeris data range: March 20, 2025 noon UTC
    vi.setSystemTime(new Date('2025-03-20T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('calculatePlanetPosition', () => {
    it('returns a position for the Sun', () => {
      const date = new Date('2025-03-20T12:00:00Z');
      const pos = calculatePlanetPosition('sun', date);

      expect(pos).not.toBeNull();
      expect(pos!.planetId).toBe('sun');
      expect(pos!.planetName).toBe('Sun');
      expect(pos!.symbol).toBe('☉');
      expect(pos!.degree).toBeGreaterThanOrEqual(0);
      expect(pos!.degree).toBeLessThan(360);
    });

    it('returns a position for the Moon', () => {
      const date = new Date('2025-03-20T12:00:00Z');
      const pos = calculatePlanetPosition('moon', date);

      expect(pos).not.toBeNull();
      expect(pos!.planetId).toBe('moon');
      expect(pos!.planetName).toBe('Moon');
      expect(pos!.degree).toBeGreaterThanOrEqual(0);
      expect(pos!.degree).toBeLessThan(360);
    });

    it('returns positions for all 10 planets', () => {
      const date = new Date('2025-03-20T12:00:00Z');
      const planetIds = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

      for (const planetId of planetIds) {
        const pos = calculatePlanetPosition(planetId, date);
        expect(pos).not.toBeNull();
        expect(pos!.planetId).toBe(planetId);
        expect(pos!.signId).toBeTruthy();
        expect(pos!.signName).toBeTruthy();
      }
    });

    it('returns null for unknown planet', () => {
      const date = new Date('2025-03-20T12:00:00Z');
      const pos = calculatePlanetPosition('chiron', date);
      expect(pos).toBeNull();
    });

    it('includes formatted degree string', () => {
      const date = new Date('2025-03-20T12:00:00Z');
      const pos = calculatePlanetPosition('sun', date);
      expect(pos).not.toBeNull();
      // Format should be like "29°45'"
      expect(pos!.formattedDegree).toMatch(/^\d+°\d{2}'$/);
    });

    it('includes retrograde status', () => {
      const date = new Date('2025-03-20T12:00:00Z');
      const pos = calculatePlanetPosition('sun', date);
      expect(pos).not.toBeNull();
      // Sun is never retrograde
      expect(pos!.isRetrograde).toBe(false);
    });

    it('assigns correct sign based on degree', () => {
      const date = new Date('2025-06-21T12:00:00Z'); // Summer solstice - Sun near start of Cancer
      const pos = calculatePlanetPosition('sun', date);
      expect(pos).not.toBeNull();
      // Sun should be in Gemini or Cancer around summer solstice
      expect(['gemini', 'cancer']).toContain(pos!.signId);
    });
  });

  describe('calculateAspects', () => {
    it('detects conjunction (0°)', () => {
      const positions: TransitPosition[] = [
        createPosition('sun', 100),
        createPosition('moon', 102),
      ];

      const aspects = calculateAspects(positions);
      const conjunction = aspects.find(a => a.aspectType === 'Conjunction');
      expect(conjunction).toBeTruthy();
      expect(conjunction!.orb).toBeLessThanOrEqual(8);
    });

    it('detects opposition (180°)', () => {
      const positions: TransitPosition[] = [
        createPosition('sun', 0),
        createPosition('moon', 178),
      ];

      const aspects = calculateAspects(positions);
      const opposition = aspects.find(a => a.aspectType === 'Opposition');
      expect(opposition).toBeTruthy();
    });

    it('detects trine (120°)', () => {
      const positions: TransitPosition[] = [
        createPosition('sun', 10),
        createPosition('jupiter', 130),
      ];

      const aspects = calculateAspects(positions);
      const trine = aspects.find(a => a.aspectType === 'Trine');
      expect(trine).toBeTruthy();
    });

    it('detects square (90°)', () => {
      const positions: TransitPosition[] = [
        createPosition('mars', 45),
        createPosition('saturn', 135),
      ];

      const aspects = calculateAspects(positions);
      const square = aspects.find(a => a.aspectType === 'Square');
      expect(square).toBeTruthy();
    });

    it('detects sextile (60°)', () => {
      const positions: TransitPosition[] = [
        createPosition('venus', 100),
        createPosition('mercury', 160),
      ];

      const aspects = calculateAspects(positions);
      const sextile = aspects.find(a => a.aspectType === 'Sextile');
      expect(sextile).toBeTruthy();
    });

    it('only finds one aspect per pair', () => {
      const positions: TransitPosition[] = [
        createPosition('sun', 0),
        createPosition('moon', 3), // Within conjunction orb
      ];

      const aspects = calculateAspects(positions);
      const sunMoon = aspects.filter(
        a => (a.planet1 === 'Sun' && a.planet2 === 'Moon') ||
             (a.planet1 === 'Moon' && a.planet2 === 'Sun')
      );
      expect(sunMoon).toHaveLength(1);
    });

    it('sorts aspects by orb (tightest first)', () => {
      const positions: TransitPosition[] = [
        createPosition('sun', 0),
        createPosition('moon', 5),     // 5° conjunction orb
        createPosition('venus', 120),  // 0° trine to sun
      ];

      const aspects = calculateAspects(positions);
      if (aspects.length >= 2) {
        expect(aspects[0].orb).toBeLessThanOrEqual(aspects[1].orb);
      }
    });

    it('returns empty array when no aspects within orb', () => {
      const positions: TransitPosition[] = [
        createPosition('sun', 0),
        createPosition('moon', 25), // No major aspect at 25°
      ];

      const aspects = calculateAspects(positions);
      expect(aspects).toEqual([]);
    });

    it('includes nature classification', () => {
      const positions: TransitPosition[] = [
        createPosition('sun', 0),
        createPosition('mars', 90), // square - challenging
        createPosition('jupiter', 120), // trine to sun - harmonious
      ];

      const aspects = calculateAspects(positions);
      const square = aspects.find(a => a.aspectType === 'Square');
      const trine = aspects.find(a => a.aspectType === 'Trine');

      if (square) expect(square.nature).toBe('challenging');
      if (trine) expect(trine.nature).toBe('harmonious');
    });
  });

  describe('getMoonPhase', () => {
    it('returns moon phase information', () => {
      const date = new Date('2025-03-20T12:00:00Z');
      const phase = getMoonPhase(date);

      expect(phase.name).toBeTruthy();
      expect(phase.illumination).toBeGreaterThanOrEqual(0);
      expect(phase.illumination).toBeLessThanOrEqual(100);
      expect(phase.emoji).toBeTruthy();
      expect(phase.moonSign).toBeTruthy();
      expect(phase.moonSignSymbol).toBeTruthy();
      expect(phase.moonDegree).toMatch(/^\d+°\d{2}'$/);
    });

    it('returns one of the 8 standard phase names', () => {
      const date = new Date('2025-03-20T12:00:00Z');
      const phase = getMoonPhase(date);

      const validPhases = [
        'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
        'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent',
      ];
      expect(validPhases).toContain(phase.name);
    });

    it('uses current date when no date provided', () => {
      // System time is mocked to 2025-03-20
      const phase = getMoonPhase();
      expect(phase.name).toBeTruthy();
      expect(phase.moonSign).toBeTruthy();
    });
  });

  describe('getCosmicWeather', () => {
    it('returns weather with positions for all 10 planets', () => {
      const date = new Date('2025-03-20T12:00:00Z');
      const weather = getCosmicWeather(date);

      expect(weather.positions).toHaveLength(10);
      expect(weather.date).toEqual(date);
    });

    it('includes moon phase in weather', () => {
      const date = new Date('2025-03-20T12:00:00Z');
      const weather = getCosmicWeather(date);

      expect(weather.moonPhase).toBeTruthy();
      expect(weather.moonPhase.name).toBeTruthy();
      expect(weather.moonPhase.illumination).toBeGreaterThanOrEqual(0);
    });

    it('includes retrograde count', () => {
      const date = new Date('2025-03-20T12:00:00Z');
      const weather = getCosmicWeather(date);

      expect(weather.retrogradeCount).toBeGreaterThanOrEqual(0);
      expect(weather.retrogradeCount).toBeLessThanOrEqual(10);
    });

    it('filters significant aspects to tight orb', () => {
      const date = new Date('2025-03-20T12:00:00Z');
      const weather = getCosmicWeather(date);

      for (const aspect of weather.significantAspects) {
        expect(aspect.orb).toBeLessThan(3);
      }
      expect(weather.significantAspects.length).toBeLessThanOrEqual(5);
    });

    it('uses current date as default', () => {
      const weather = getCosmicWeather();
      expect(weather.date).toBeTruthy();
      expect(weather.positions.length).toBeGreaterThan(0);
    });
  });

  describe('getTransitInterpretation', () => {
    it('returns interpretation for known planet-sign combination', () => {
      const position = createPosition('sun', 5); // Aries
      const interp = getTransitInterpretation(position);
      expect(interp).toBeTruthy();
      expect(interp.length).toBeGreaterThan(10);
    });

    it('returns generic interpretation for unknown combination', () => {
      const position: TransitPosition = {
        planetId: 'unknown',
        planetName: 'Unknown',
        symbol: '?',
        signId: 'unknown-sign',
        signName: 'Unknown Sign',
        signSymbol: '?',
        degree: 0,
        formattedDegree: '0°00\'',
        isRetrograde: false,
      };
      const interp = getTransitInterpretation(position);
      expect(interp).toContain('Unknown');
    });
  });

  describe('getAspectInterpretation', () => {
    it('returns specific interpretation for Sun-Moon conjunction', () => {
      const aspect: TransitAspect = {
        planet1: 'Sun',
        planet2: 'Moon',
        aspectType: 'Conjunction',
        aspectSymbol: '☌',
        orb: 1.5,
        isApplying: true,
        nature: 'neutral',
      };

      const interp = getAspectInterpretation(aspect);
      expect(interp).toContain('New Moon');
    });

    it('returns generic interpretation with nature context', () => {
      const aspect: TransitAspect = {
        planet1: 'Mars',
        planet2: 'Jupiter',
        aspectType: 'Trine',
        aspectSymbol: '△',
        orb: 2.0,
        isApplying: false,
        nature: 'harmonious',
      };

      const interp = getAspectInterpretation(aspect);
      expect(interp).toContain('supportive');
    });
  });
});

// ─── Helper ─────────────────────────────────────────────────────────────────

function createPosition(planetId: string, degree: number): TransitPosition {
  const SIGNS = [
    { id: 'aries', name: 'Aries', symbol: '♈' },
    { id: 'taurus', name: 'Taurus', symbol: '♉' },
    { id: 'gemini', name: 'Gemini', symbol: '♊' },
    { id: 'cancer', name: 'Cancer', symbol: '♋' },
    { id: 'leo', name: 'Leo', symbol: '♌' },
    { id: 'virgo', name: 'Virgo', symbol: '♍' },
    { id: 'libra', name: 'Libra', symbol: '♎' },
    { id: 'scorpio', name: 'Scorpio', symbol: '♏' },
    { id: 'sagittarius', name: 'Sagittarius', symbol: '♐' },
    { id: 'capricorn', name: 'Capricorn', symbol: '♑' },
    { id: 'aquarius', name: 'Aquarius', symbol: '♒' },
    { id: 'pisces', name: 'Pisces', symbol: '♓' },
  ];

  const PLANETS: Record<string, { name: string; symbol: string }> = {
    sun: { name: 'Sun', symbol: '☉' },
    moon: { name: 'Moon', symbol: '☽' },
    mercury: { name: 'Mercury', symbol: '☿' },
    venus: { name: 'Venus', symbol: '♀' },
    mars: { name: 'Mars', symbol: '♂' },
    jupiter: { name: 'Jupiter', symbol: '♃' },
    saturn: { name: 'Saturn', symbol: '♄' },
    uranus: { name: 'Uranus', symbol: '♅' },
    neptune: { name: 'Neptune', symbol: '♆' },
    pluto: { name: 'Pluto', symbol: '♇' },
  };

  const normalizedDeg = ((degree % 360) + 360) % 360;
  const signIdx = Math.floor(normalizedDeg / 30);
  const degInSign = Math.floor(normalizedDeg % 30);
  const sign = SIGNS[signIdx];
  const planet = PLANETS[planetId] ?? { name: planetId, symbol: '?' };

  return {
    planetId,
    planetName: planet.name,
    symbol: planet.symbol,
    signId: sign.id,
    signName: sign.name,
    signSymbol: sign.symbol,
    degree: normalizedDeg,
    formattedDegree: `${degInSign}°00'`,
    isRetrograde: false,
  };
}
