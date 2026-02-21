// ============================================
// Tests for Profile Validation Service
// ============================================

import { describe, it, expect } from 'vitest';
import {
  calculateDesignDate,
  calculateExactDesignDate,
  calculateEarthPosition,
  calculatePositionsWithGates,
  extractBirthData,
  parseBirthDateTime,
  type BirthData,
} from './profileValidation';
import { getPlanetaryPositions } from './ephemeris';
import type { AstroProfile } from '../types';

// ─── Test Helpers ───────────────────────────────────────────────────────────

function makeBirthData(overrides: Partial<BirthData> = {}): BirthData {
  return {
    dateOfBirth: '1994-10-18',
    timeOfBirth: '08:10',
    timezone: 'America/Sao_Paulo',
    latitude: -23.5505,
    longitude: -46.6333,
    cityOfBirth: 'Sao Paulo',
    ...overrides,
  };
}

function makeMinimalProfile(overrides: Partial<AstroProfile> = {}): AstroProfile {
  return {
    id: 'test-profile',
    name: 'Test User',
    dateOfBirth: '1994-10-18',
    timeOfBirth: '08:10',
    cityOfBirth: 'Sao Paulo',
    coordinates: {
      latitude: -23.5505,
      longitude: -46.6333,
      timezone: 'America/Sao_Paulo',
    },
    placements: [],
    housePositions: [],
    aspects: { planetary: [], other: [] },
    configurations: [],
    elementalAnalysis: {
      id: '',
      profileId: 'test-profile',
      fire: 0,
      earth: 0,
      air: 0,
      water: 0,
      firePlanetIds: [],
      earthPlanetIds: [],
      airPlanetIds: [],
      waterPlanetIds: [],
      dominant: '',
      deficient: '',
    },
    chartRulers: { traditional: '', modern: '' },
    ...overrides,
  };
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('Profile Validation Service', () => {
  describe('extractBirthData', () => {
    it('extracts birth data from a profile', () => {
      const profile = makeMinimalProfile();
      const birthData = extractBirthData(profile);

      expect(birthData.dateOfBirth).toBe('1994-10-18');
      expect(birthData.timeOfBirth).toBe('08:10');
      expect(birthData.timezone).toBe('America/Sao_Paulo');
      expect(birthData.latitude).toBe(-23.5505);
      expect(birthData.longitude).toBe(-46.6333);
      expect(birthData.cityOfBirth).toBe('Sao Paulo');
    });

    it('defaults to UTC when no timezone provided', () => {
      const profile = makeMinimalProfile({ coordinates: undefined });
      const birthData = extractBirthData(profile);

      expect(birthData.timezone).toBe('UTC');
      expect(birthData.latitude).toBe(0);
      expect(birthData.longitude).toBe(0);
    });
  });

  describe('parseBirthDateTime', () => {
    it('parses date and time into UTC Date object', () => {
      const birthData = makeBirthData({
        dateOfBirth: '1994-10-18',
        timeOfBirth: '08:10',
      });

      const date = parseBirthDateTime(birthData);

      expect(date.getUTCFullYear()).toBe(1994);
      expect(date.getUTCMonth()).toBe(9); // 0-indexed
      expect(date.getUTCDate()).toBe(18);
      expect(date.getUTCHours()).toBe(8);
      expect(date.getUTCMinutes()).toBe(10);
    });

    it('handles midnight birth time', () => {
      const birthData = makeBirthData({ timeOfBirth: '00:00' });
      const date = parseBirthDateTime(birthData);

      expect(date.getUTCHours()).toBe(0);
      expect(date.getUTCMinutes()).toBe(0);
    });

    it('handles late evening birth time', () => {
      const birthData = makeBirthData({ timeOfBirth: '23:59' });
      const date = parseBirthDateTime(birthData);

      expect(date.getUTCHours()).toBe(23);
      expect(date.getUTCMinutes()).toBe(59);
    });

    it('handles January 1st dates (month boundary)', () => {
      const birthData = makeBirthData({ dateOfBirth: '2000-01-01' });
      const date = parseBirthDateTime(birthData);

      expect(date.getUTCFullYear()).toBe(2000);
      expect(date.getUTCMonth()).toBe(0);
      expect(date.getUTCDate()).toBe(1);
    });

    it('handles December 31st dates (year boundary)', () => {
      const birthData = makeBirthData({ dateOfBirth: '1999-12-31' });
      const date = parseBirthDateTime(birthData);

      expect(date.getUTCFullYear()).toBe(1999);
      expect(date.getUTCMonth()).toBe(11);
      expect(date.getUTCDate()).toBe(31);
    });
  });

  describe('calculateDesignDate', () => {
    it('returns a date approximately 88 days before birth', () => {
      const birthDate = new Date('1994-10-18T08:10:00Z');
      const designDate = calculateDesignDate(birthDate);

      const diffDays = (birthDate.getTime() - designDate.getTime()) / (1000 * 60 * 60 * 24);
      expect(diffDays).toBeCloseTo(88, 0);
    });

    it('handles year boundary (birth in January)', () => {
      const birthDate = new Date('2000-01-15T12:00:00Z');
      const designDate = calculateDesignDate(birthDate);

      expect(designDate.getUTCFullYear()).toBe(1999);
      expect(designDate.getUTCMonth()).toBe(9); // October 19
    });

    it('preserves time of day', () => {
      const birthDate = new Date('2000-06-15T14:30:00Z');
      const designDate = calculateDesignDate(birthDate);

      expect(designDate.getUTCHours()).toBe(14);
      expect(designDate.getUTCMinutes()).toBe(30);
    });
  });

  describe('calculateExactDesignDate', () => {
    it('returns a date approximately 88 days before birth', () => {
      const birthDate = new Date('1994-10-18T08:10:00Z');
      const birthPositions = getPlanetaryPositions(birthDate);
      const designDate = calculateExactDesignDate(birthDate, birthPositions.sun);

      const diffDays = (birthDate.getTime() - designDate.getTime()) / (1000 * 60 * 60 * 24);
      // Should be close to 88 days but could vary slightly
      expect(diffDays).toBeGreaterThan(80);
      expect(diffDays).toBeLessThan(95);
    });

    it('design Sun is approximately 88 degrees behind birth Sun', () => {
      const birthDate = new Date('1994-10-18T08:10:00Z');
      const birthPositions = getPlanetaryPositions(birthDate);
      const designDate = calculateExactDesignDate(birthDate, birthPositions.sun);
      const designPositions = getPlanetaryPositions(designDate);

      // Angular distance should be close to 88 degrees
      let diff = birthPositions.sun - designPositions.sun;
      if (diff < 0) diff += 360;
      if (diff > 180) diff = 360 - diff;

      // Allow tolerance because binary search has limited precision
      expect(diff).toBeGreaterThan(85);
      expect(diff).toBeLessThan(91);
    });
  });

  describe('calculateEarthPosition', () => {
    it('returns position 180 degrees from Sun', () => {
      expect(calculateEarthPosition(0)).toBe(180);
      expect(calculateEarthPosition(90)).toBe(270);
      expect(calculateEarthPosition(180)).toBe(0);
      expect(calculateEarthPosition(270)).toBe(90);
    });

    it('handles wrap-around correctly', () => {
      expect(calculateEarthPosition(200)).toBe(20);
      expect(calculateEarthPosition(350)).toBe(170);
    });
  });

  describe('calculatePositionsWithGates', () => {
    it('returns positions for all 10 planets plus Earth', () => {
      const date = new Date('2025-03-20T12:00:00Z');
      const positions = getPlanetaryPositions(date);
      const calculated = calculatePositionsWithGates(positions);

      // 10 planets + Earth = 11
      expect(calculated).toHaveLength(11);
    });

    it('includes Earth as 180 degrees from Sun', () => {
      const date = new Date('2025-03-20T12:00:00Z');
      const positions = getPlanetaryPositions(date);
      const calculated = calculatePositionsWithGates(positions);

      const earth = calculated.find(p => p.planetId === 'earth');
      const sun = calculated.find(p => p.planetId === 'sun');

      expect(earth).toBeTruthy();
      expect(sun).toBeTruthy();

      let diff = Math.abs(earth!.longitude - sun!.longitude);
      if (diff > 180) diff = 360 - diff;
      expect(diff).toBeCloseTo(180, 0);
    });

    it('includes gate and gene key information for each position', () => {
      const date = new Date('2025-03-20T12:00:00Z');
      const positions = getPlanetaryPositions(date);
      const calculated = calculatePositionsWithGates(positions);

      for (const pos of calculated) {
        expect(pos.zodiac).toBeTruthy();
        expect(pos.zodiac.sign).toBeTruthy();
        expect(pos.zodiac.degree).toBeGreaterThanOrEqual(0);
        expect(pos.zodiac.degree).toBeLessThan(30);
        // Gate/gene key may be null for edge cases, but should exist for most positions
        if (pos.gate) {
          expect(pos.gate.gateNumber).toBeGreaterThanOrEqual(1);
          expect(pos.gate.gateNumber).toBeLessThanOrEqual(64);
          expect(pos.gate.line).toBeGreaterThanOrEqual(1);
          expect(pos.gate.line).toBeLessThanOrEqual(6);
        }
      }
    });

    it('gene key number matches gate number', () => {
      const date = new Date('2025-03-20T12:00:00Z');
      const positions = getPlanetaryPositions(date);
      const calculated = calculatePositionsWithGates(positions);

      for (const pos of calculated) {
        if (pos.gate && pos.geneKey) {
          expect(pos.geneKey.keyNumber).toBe(pos.gate.gateNumber);
          expect(pos.geneKey.line).toBe(pos.gate.line);
        }
      }
    });
  });

  describe('BirthData edge cases', () => {
    it('handles latitude at upper bound (90)', () => {
      const birthData = makeBirthData({ latitude: 90 });
      const date = parseBirthDateTime(birthData);
      expect(date).toBeInstanceOf(Date);
      expect(isNaN(date.getTime())).toBe(false);
    });

    it('handles latitude at lower bound (-90)', () => {
      const birthData = makeBirthData({ latitude: -90 });
      const date = parseBirthDateTime(birthData);
      expect(date).toBeInstanceOf(Date);
      expect(isNaN(date.getTime())).toBe(false);
    });

    it('handles longitude at upper bound (180)', () => {
      const birthData = makeBirthData({ longitude: 180 });
      const date = parseBirthDateTime(birthData);
      expect(date).toBeInstanceOf(Date);
      expect(isNaN(date.getTime())).toBe(false);
    });

    it('handles longitude at lower bound (-180)', () => {
      const birthData = makeBirthData({ longitude: -180 });
      const date = parseBirthDateTime(birthData);
      expect(date).toBeInstanceOf(Date);
      expect(isNaN(date.getTime())).toBe(false);
    });

    it('handles leap year date (Feb 29)', () => {
      const birthData = makeBirthData({ dateOfBirth: '2000-02-29' });
      const date = parseBirthDateTime(birthData);
      expect(date.getUTCDate()).toBe(29);
      expect(date.getUTCMonth()).toBe(1); // February
    });
  });
});
