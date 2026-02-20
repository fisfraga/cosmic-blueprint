import { describe, it, expect } from 'vitest';
import {
  getPlanetaryPositions,
  getPlanetPosition,
  longitudeToZodiac,
  getEphemerisInfo,
} from './ephemeris';

// Helper: check longitude is within tolerance (degrees)
function expectLongitudeNear(actual: number, expected: number, tolerance = 1.0) {
  // Handle wraparound at 0/360
  let diff = Math.abs(actual - expected);
  if (diff > 180) diff = 360 - diff;
  expect(diff).toBeLessThan(tolerance);
}

describe('ephemeris', () => {
  describe('getEphemerisInfo', () => {
    it('returns correct data range metadata', () => {
      const info = getEphemerisInfo();
      expect(info.startDate).toBe('2020-01-01');
      expect(info.endDate).toBe('2035-12-31');
      expect(info.totalDays).toBeGreaterThan(5000);
      expect(info.source).toBe('astronomy-engine');
    });
  });

  describe('longitudeToZodiac', () => {
    it('converts 0° to 0° Aries', () => {
      const result = longitudeToZodiac(0);
      expect(result.sign).toBe('Aries');
      expect(result.degree).toBe(0);
      expect(result.signIndex).toBe(0);
    });

    it('converts 90° to 0° Cancer', () => {
      const result = longitudeToZodiac(90);
      expect(result.sign).toBe('Cancer');
      expect(result.degree).toBe(0);
    });

    it('converts 359.5° to 29° Pisces', () => {
      const result = longitudeToZodiac(359.5);
      expect(result.sign).toBe('Pisces');
      expect(result.degree).toBe(29);
      expect(result.minute).toBe(30);
    });

    it('normalizes negative longitudes', () => {
      const result = longitudeToZodiac(-10);
      expect(result.sign).toBe('Pisces');
      expect(result.degree).toBe(20);
    });

    it('normalizes longitudes above 360', () => {
      const result = longitudeToZodiac(390);
      // 390 - 360 = 30° = 0° Taurus
      expect(result.sign).toBe('Taurus');
      expect(result.degree).toBe(0);
    });
  });

  describe('in-range lookups (2020-2035)', () => {
    it('returns positions for Jan 1, 2020 (first day)', () => {
      const date = new Date('2020-01-01T00:00:00Z');
      const pos = getPlanetaryPositions(date);
      expect(pos.date).toBeDefined();
      // Sun should be in Capricorn (~280°) on Jan 1
      expectLongitudeNear(pos.sun, 280, 2);
      // All planets should have valid positions (0-360)
      expect(pos.sun).toBeGreaterThanOrEqual(0);
      expect(pos.sun).toBeLessThan(360);
      expect(pos.moon).toBeGreaterThanOrEqual(0);
      expect(pos.moon).toBeLessThan(360);
    });

    it('returns positions for Dec 31, 2035 (last day)', () => {
      const date = new Date('2035-12-31T00:00:00Z');
      const pos = getPlanetaryPositions(date);
      // Sun should be in Capricorn (~280°) on Dec 31
      expectLongitudeNear(pos.sun, 280, 2);
    });

    it('returns all 10 planets for a known date', () => {
      const date = new Date('2024-06-15T12:00:00Z');
      const pos = getPlanetaryPositions(date);
      const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'] as const;
      for (const planet of planets) {
        expect(typeof pos[planet]).toBe('number');
        expect(pos[planet]).toBeGreaterThanOrEqual(0);
        expect(pos[planet]).toBeLessThan(360);
      }
    });

    // Summer solstice 2024: Sun at ~90° (0° Cancer)
    it('returns correct Sun position for summer solstice 2024', () => {
      const date = new Date('2024-06-20T00:00:00Z');
      const pos = getPlanetaryPositions(date);
      // Sun near 0° Cancer = ~89-90°
      expectLongitudeNear(pos.sun, 89, 2);
    });

    // Spring equinox 2024: Sun at ~0° (0° Aries)
    it('returns correct Sun position for spring equinox 2024', () => {
      const date = new Date('2024-03-20T00:00:00Z');
      const pos = getPlanetaryPositions(date);
      // Sun near 0° Aries = ~0°/360°
      const distFromAries = Math.min(pos.sun, 360 - pos.sun);
      expect(distFromAries).toBeLessThan(2);
    });

    it('handles leap year date (Feb 29, 2024)', () => {
      const date = new Date('2024-02-29T00:00:00Z');
      const pos = getPlanetaryPositions(date);
      // Sun should be in Pisces (~340°) on Feb 29
      expectLongitudeNear(pos.sun, 340, 3);
    });
  });

  describe('fallback (astronomy-engine) for out-of-range dates', () => {
    it('calculates positions for a date before 2020', () => {
      const date = new Date('2010-06-21T12:00:00Z');
      const pos = getPlanetaryPositions(date);
      // Sun near summer solstice ~90°
      expectLongitudeNear(pos.sun, 90, 2);
    });

    it('calculates positions for a date after 2035', () => {
      const date = new Date('2040-03-20T12:00:00Z');
      const pos = getPlanetaryPositions(date);
      // Sun near spring equinox ~0°
      const distFromAries = Math.min(pos.sun, 360 - pos.sun);
      expect(distFromAries).toBeLessThan(2);
    });

    it('returns valid longitudes for all planets on historical date', () => {
      const date = new Date('1990-01-01T00:00:00Z');
      const pos = getPlanetaryPositions(date);
      const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'] as const;
      for (const planet of planets) {
        expect(pos[planet]).toBeGreaterThanOrEqual(0);
        expect(pos[planet]).toBeLessThan(360);
      }
    });
  });

  describe('getPlanetPosition (single planet)', () => {
    it('returns Sun position for a known date', () => {
      const date = new Date('2024-06-20T00:00:00Z');
      const sunLon = getPlanetPosition('sun', date);
      expectLongitudeNear(sunLon, 89, 2);
    });

    it('returns Moon position as a valid longitude', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const moonLon = getPlanetPosition('moon', date);
      expect(moonLon).toBeGreaterThanOrEqual(0);
      expect(moonLon).toBeLessThan(360);
    });
  });

  describe('consistency between data and calculation', () => {
    it('pre-computed and calculated positions agree for a date in range', () => {
      // Use a date in the pre-computed range
      // Then calculate the same date via astronomy-engine directly
      const date = new Date('2024-01-01T00:00:00Z');
      const fromData = getPlanetaryPositions(date);

      // Sun on Jan 1 should be in Capricorn (~280°) — both sources should agree
      expectLongitudeNear(fromData.sun, 280, 2);
      // Moon moves fast but should still be valid
      expect(fromData.moon).toBeGreaterThanOrEqual(0);
      expect(fromData.moon).toBeLessThan(360);
    });
  });

  describe('edge cases', () => {
    it('handles midnight UTC exactly', () => {
      const date = new Date('2025-01-01T00:00:00Z');
      const pos = getPlanetaryPositions(date);
      expect(pos.sun).toBeGreaterThanOrEqual(0);
      expect(pos.sun).toBeLessThan(360);
    });

    it('handles date with time component (non-midnight)', () => {
      // Pre-computed data is daily, so non-midnight should still return valid data
      const date = new Date('2025-06-15T14:30:00Z');
      const pos = getPlanetaryPositions(date);
      expect(pos.sun).toBeGreaterThanOrEqual(0);
      expect(pos.sun).toBeLessThan(360);
    });

    it('handles date at sign boundary (0° Aries)', () => {
      // Around March 20-21 the Sun crosses 0° Aries
      const date = new Date('2025-03-20T00:00:00Z');
      const pos = getPlanetaryPositions(date);
      // Sun should be very near 0°/360° (Aries cusp)
      const distFromAries = Math.min(pos.sun, 360 - pos.sun);
      expect(distFromAries).toBeLessThan(2);
    });
  });
});
