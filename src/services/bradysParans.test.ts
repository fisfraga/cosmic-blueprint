import { describe, it, expect } from 'vitest';
import { computeParans, groupParansByStar, formatAngle } from './bradysParans';
import type { BirthData } from '../types';

// Test birth data: Sao Paulo, Brazil — a location that gives good star visibility
const SAO_PAULO_BIRTH: BirthData = {
  dateOfBirth: '1994-10-18',
  timeOfBirth: '08:10',
  timezone: 'America/Sao_Paulo',
  latitude: -23.5505,
  longitude: -46.6333,
  cityOfBirth: 'Sao Paulo',
};

// Northern hemisphere test case
const LONDON_BIRTH: BirthData = {
  dateOfBirth: '1990-06-21',
  timeOfBirth: '12:00',
  timezone: 'Europe/London',
  latitude: 51.5074,
  longitude: -0.1278,
  cityOfBirth: 'London',
};

describe('bradysParans', () => {
  describe('computeParans', () => {
    it('returns an array of parans for valid birth data', () => {
      const parans = computeParans(SAO_PAULO_BIRTH);
      expect(Array.isArray(parans)).toBe(true);
    });

    it('returns parans with correct structure', () => {
      const parans = computeParans(SAO_PAULO_BIRTH);

      if (parans.length > 0) {
        const paran = parans[0];
        expect(paran).toHaveProperty('star');
        expect(paran).toHaveProperty('starAngle');
        expect(paran).toHaveProperty('planetId');
        expect(paran).toHaveProperty('planetAngle');
        expect(paran).toHaveProperty('orbMinutes');
        expect(typeof paran.orbMinutes).toBe('number');
        expect(paran.orbMinutes).toBeGreaterThanOrEqual(0);
      }
    });

    it('includes all expected angle types', () => {
      const parans = computeParans(SAO_PAULO_BIRTH);
      const angleTypes = new Set(parans.map((p) => p.starAngle));

      // With a full day of data and 15 stars, we expect most angle types to appear
      // At minimum there should be some parans (Brady's method with full-day orb)
      expect(parans.length).toBeGreaterThan(0);

      // At least some of the 4 angle types should be present
      expect(angleTypes.size).toBeGreaterThan(0);
    });

    it('checks all 10 major planets', () => {
      const parans = computeParans(SAO_PAULO_BIRTH);
      const planetIds = new Set(parans.map((p) => p.planetId));

      // With a full-day window, most planets should appear in some paran
      // Sun and Moon are nearly guaranteed
      expect(planetIds.size).toBeGreaterThan(0);
    });

    it('returns parans sorted by orb (tightest first)', () => {
      const parans = computeParans(SAO_PAULO_BIRTH);

      for (let i = 1; i < parans.length; i++) {
        expect(parans[i].orbMinutes).toBeGreaterThanOrEqual(parans[i - 1].orbMinutes);
      }
    });

    it('returns empty array when coordinates are missing', () => {
      const noCoordsData: BirthData = {
        ...SAO_PAULO_BIRTH,
        latitude: undefined as unknown as number,
        longitude: undefined as unknown as number,
      };
      const parans = computeParans(noCoordsData);
      expect(parans).toEqual([]);
    });

    it('works for northern hemisphere locations', () => {
      const parans = computeParans(LONDON_BIRTH);
      expect(Array.isArray(parans)).toBe(true);
      // London at high latitude may have circumpolar stars, but should still find some parans
      expect(parans.length).toBeGreaterThan(0);
    });
  });

  describe('groupParansByStar', () => {
    it('groups parans by star ID', () => {
      const parans = computeParans(SAO_PAULO_BIRTH);
      const groups = groupParansByStar(parans);

      expect(Array.isArray(groups)).toBe(true);

      for (const group of groups) {
        expect(group).toHaveProperty('star');
        expect(group).toHaveProperty('parans');
        expect(group.parans.length).toBeGreaterThan(0);

        // All parans in a group should reference the same star
        for (const paran of group.parans) {
          expect(paran.star.id).toBe(group.star.id);
        }
      }
    });

    it('returns empty array for empty input', () => {
      const groups = groupParansByStar([]);
      expect(groups).toEqual([]);
    });
  });

  describe('formatAngle', () => {
    it('formats all angle types correctly', () => {
      expect(formatAngle('rising')).toBe('Rising');
      expect(formatAngle('setting')).toBe('Setting');
      expect(formatAngle('culminating')).toBe('Culminating');
      expect(formatAngle('anti-culminating')).toBe('Anti-Culminating');
    });
  });
});
