import { describe, it, expect } from 'vitest';
import type { BirthData } from '../types';
import {
  calculateFullChart,
  calculateProfilesFromBirthData,
  calculateDesignDate,
  calculateGeneKeysProfile,
  calculateHumanDesignProfile,
} from './chartCalculation';
import { getPlanetaryPositions, isRetrograde } from './ephemeris';

// --- Test Fixtures ---
// Two public birth charts with well-documented placements.

// Fixture 1: Known public figure — Freddie Mercury
// Born: Sept 5, 1946, Zanzibar (Stone Town)
// Sun in Virgo, known chart widely documented
const freddieBirthData: BirthData = {
  dateOfBirth: '1946-09-05',
  timeOfBirth: '06:00',
  timezone: 'Africa/Nairobi', // closest IANA for Zanzibar
  latitude: -6.163,
  longitude: 39.189,
  cityOfBirth: 'Stone Town, Zanzibar',
};

// Fixture 2: Known date — Jan 1, 2000, midnight UTC (Y2K baby)
// Sun in Capricorn, well-documented ephemeris reference date
const y2kBirthData: BirthData = {
  dateOfBirth: '2000-01-01',
  timeOfBirth: '00:00',
  timezone: 'UTC',
  latitude: 51.5074,
  longitude: -0.1278,
  cityOfBirth: 'London, UK',
};

// Fixture 3: In-range date for more precise testing
// June 15, 2024 — Sun in Gemini, well within pre-computed range
const gemini2024BirthData: BirthData = {
  dateOfBirth: '2024-06-15',
  timeOfBirth: '12:00',
  timezone: 'UTC',
  latitude: 40.7128,
  longitude: -74.006,
  cityOfBirth: 'New York, NY',
};

// Helper: check longitude is within tolerance
function expectLongitudeNear(actual: number, expected: number, tolerance = 2.0) {
  let diff = Math.abs(actual - expected);
  if (diff > 180) diff = 360 - diff;
  expect(diff).toBeLessThan(tolerance);
}


describe('chartCalculation', () => {
  describe('calculateFullChart', () => {
    it('returns a CalculatedChart with correct version', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      expect(chart.calculationVersion).toBe('1.0.0');
      expect(chart.source).toBe('local');
    });

    it('includes natal and design dates as ISO strings', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      expect(chart.natalDate).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(chart.designDate).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('returns 11 natal positions (10 planets + earth)', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      expect(chart.natalPositions.length).toBe(11);
      const planetIds = chart.natalPositions.map(p => p.planetId);
      expect(planetIds).toContain('sun');
      expect(planetIds).toContain('earth');
      expect(planetIds).toContain('moon');
      expect(planetIds).toContain('mercury');
      expect(planetIds).toContain('venus');
      expect(planetIds).toContain('mars');
      expect(planetIds).toContain('jupiter');
      expect(planetIds).toContain('saturn');
      expect(planetIds).toContain('uranus');
      expect(planetIds).toContain('neptune');
      expect(planetIds).toContain('pluto');
    });

    it('returns 11 design positions', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      expect(chart.designPositions.length).toBe(11);
    });

    it('returns natal and design gate activations', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      expect(chart.natalGates.length).toBeGreaterThan(0);
      expect(chart.designGates.length).toBeGreaterThan(0);
      // Each gate should have valid properties
      for (const gate of chart.natalGates) {
        expect(gate.gateNumber).toBeGreaterThanOrEqual(1);
        expect(gate.gateNumber).toBeLessThanOrEqual(64);
        expect(gate.line).toBeGreaterThanOrEqual(1);
        expect(gate.line).toBeLessThanOrEqual(6);
        expect(gate.isPersonality).toBe(true);
        expect(gate.planet).toBeDefined();
      }
      for (const gate of chart.designGates) {
        expect(gate.isPersonality).toBe(false);
      }
    });
  });

  describe('planetary sign placements', () => {
    it('Gemini 2024 fixture: Sun is in Gemini', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      const sun = chart.natalPositions.find(p => p.planetId === 'sun')!;
      expect(sun.signId).toBe('gemini');
    });

    it('Y2K fixture: Sun is in Capricorn', () => {
      const chart = calculateFullChart(y2kBirthData);
      const sun = chart.natalPositions.find(p => p.planetId === 'sun')!;
      // Jan 1 => Sun in Capricorn (~280°)
      expect(sun.signId).toBe('capricorn');
    });

    it('each position has valid sign, degree, minute', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      for (const pos of chart.natalPositions) {
        expect(pos.signId).toBeTruthy();
        expect(pos.degree).toBeGreaterThanOrEqual(0);
        expect(pos.degree).toBeLessThan(30);
        expect(pos.minute).toBeGreaterThanOrEqual(0);
        expect(pos.minute).toBeLessThan(60);
        expect(pos.longitude).toBeGreaterThanOrEqual(0);
        expect(pos.longitude).toBeLessThan(360);
      }
    });

    it('all 11 planets have valid sign placements', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      const validSigns = [
        'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
        'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
      ];
      for (const pos of chart.natalPositions) {
        expect(validSigns).toContain(pos.signId);
      }
    });
  });

  describe('Earth position (Sun + 180°)', () => {
    it('Earth is opposite Sun', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      const sun = chart.natalPositions.find(p => p.planetId === 'sun')!;
      const earth = chart.natalPositions.find(p => p.planetId === 'earth')!;
      const expectedEarthLon = (sun.longitude + 180) % 360;
      expectLongitudeNear(earth.longitude, expectedEarthLon, 0.01);
    });

    it('Earth sign is opposite Sun sign (Gemini Sun => Sagittarius Earth)', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      const sun = chart.natalPositions.find(p => p.planetId === 'sun')!;
      const earth = chart.natalPositions.find(p => p.planetId === 'earth')!;
      // Gemini (60-90°) => Earth at (240-270°) = Sagittarius
      expect(sun.signId).toBe('gemini');
      expect(earth.signId).toBe('sagittarius');
    });

    it('Earth retrograde is always false', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      const earth = chart.natalPositions.find(p => p.planetId === 'earth')!;
      expect(earth.retrograde).toBe(false);
    });
  });

  describe('HD gate activations', () => {
    it('each planet that maps to a gate produces an activation', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      // Not all planets may map to gates (depends on getGateByDegree coverage)
      expect(chart.natalGates.length).toBeGreaterThan(0);
      expect(chart.natalGates.length).toBeLessThanOrEqual(11);
      // Verify Sun always has a gate
      const sunGate = chart.natalGates.find(g => g.planet === 'Sun');
      expect(sunGate).toBeDefined();
    });

    it('gate numbers are in valid range (1-64)', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      for (const gate of [...chart.natalGates, ...chart.designGates]) {
        expect(gate.gateNumber).toBeGreaterThanOrEqual(1);
        expect(gate.gateNumber).toBeLessThanOrEqual(64);
      }
    });

    it('gate lines are in valid range (1-6)', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      for (const gate of [...chart.natalGates, ...chart.designGates]) {
        expect(gate.line).toBeGreaterThanOrEqual(1);
        expect(gate.line).toBeLessThanOrEqual(6);
      }
    });

    it('gate IDs follow pattern gate-{number}', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      for (const gate of chart.natalGates) {
        expect(gate.gateId).toMatch(/^gate-\d+$/);
        expect(gate.gateId).toBe(`gate-${gate.gateNumber}`);
      }
    });
  });

  describe('calculateDesignDate', () => {
    it('design date is roughly 88 days before birth', () => {
      const birthDate = new Date('2024-06-15T12:00:00Z');
      const sunLon = getPlanetaryPositions(birthDate).sun;
      const designDate = calculateDesignDate(birthDate, sunLon);

      const diffDays = (birthDate.getTime() - designDate.getTime()) / (1000 * 60 * 60 * 24);
      // Should be roughly 80-100 days before birth
      expect(diffDays).toBeGreaterThan(80);
      expect(diffDays).toBeLessThan(100);
    });

    it('design Sun is approximately 88° behind natal Sun', () => {
      const birthDate = new Date('2024-06-15T12:00:00Z');
      const natalPositions = getPlanetaryPositions(birthDate);
      const designDate = calculateDesignDate(birthDate, natalPositions.sun);
      const designPositions = getPlanetaryPositions(designDate);

      let diff = natalPositions.sun - designPositions.sun;
      if (diff < 0) diff += 360;
      // Should be approximately 88°
      expectLongitudeNear(diff, 88, 1);
    });
  });

  describe('Gene Keys profile', () => {
    it('returns all activation sequence spheres', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      const gk = calculateGeneKeysProfile(chart.natalPositions, chart.designPositions);
      expect(gk.lifesWork).toBeDefined();
      expect(gk.evolution).toBeDefined();
      expect(gk.radiance).toBeDefined();
      expect(gk.purpose).toBeDefined();
    });

    it('returns all venus sequence spheres', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      const gk = calculateGeneKeysProfile(chart.natalPositions, chart.designPositions);
      expect(gk.attraction).toBeDefined();
      expect(gk.iq).toBeDefined();
      expect(gk.eq).toBeDefined();
      expect(gk.sq).toBeDefined();
      expect(gk.core).toBeDefined();
    });

    it('returns all pearl sequence spheres', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      const gk = calculateGeneKeysProfile(chart.natalPositions, chart.designPositions);
      expect(gk.vocation).toBeDefined();
      expect(gk.culture).toBeDefined();
      expect(gk.pearl).toBeDefined();
    });

    it('Gene Key numbers match gate numbers (1-64)', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      const gk = calculateGeneKeysProfile(chart.natalPositions, chart.designPositions);
      const spheres = [
        gk.lifesWork, gk.evolution, gk.radiance, gk.purpose,
        gk.attraction, gk.iq, gk.eq, gk.sq, gk.core,
        gk.vocation, gk.culture, gk.pearl,
      ];
      for (const sphere of spheres) {
        expect(sphere.geneKeyNumber).toBeGreaterThanOrEqual(1);
        expect(sphere.geneKeyNumber).toBeLessThanOrEqual(64);
        expect(sphere.geneKeyId).toBe(`gk-${sphere.geneKeyNumber}`);
        expect(sphere.line).toBeGreaterThanOrEqual(1);
        expect(sphere.line).toBeLessThanOrEqual(6);
      }
    });

    it('Life\'s Work comes from natal Sun, Evolution from natal Earth', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      const gk = calculateGeneKeysProfile(chart.natalPositions, chart.designPositions);
      expect(gk.lifesWork.planetarySource).toBe('Natal Sun');
      expect(gk.evolution.planetarySource).toBe('Natal Earth');
    });

    it('Radiance comes from design Sun, Purpose from design Earth', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      const gk = calculateGeneKeysProfile(chart.natalPositions, chart.designPositions);
      expect(gk.radiance.planetarySource).toBe('Pre-Natal / Design Sun');
      expect(gk.purpose.planetarySource).toBe('Pre-Natal / Design Earth');
    });

    it('coreIdentity includes sun, moon, mercury, ascendant', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      const gk = calculateGeneKeysProfile(chart.natalPositions, chart.designPositions);
      expect(gk.coreIdentity).toBeDefined();
      expect(gk.coreIdentity!.sun).toBeDefined();
      expect(gk.coreIdentity!.moon).toBeDefined();
      expect(gk.coreIdentity!.mercury).toBeDefined();
      expect(gk.coreIdentity!.ascendant).toBeDefined();
    });
  });

  describe('Human Design profile', () => {
    it('returns a valid HD type', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      const hd = calculateHumanDesignProfile(chart.natalPositions, chart.designPositions);
      const validTypes = ['Generator', 'Manifesting Generator', 'Projector', 'Manifestor', 'Reflector'];
      expect(validTypes).toContain(hd.type);
    });

    it('strategy matches type', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      const hd = calculateHumanDesignProfile(chart.natalPositions, chart.designPositions);
      const strategyMap: Record<string, string> = {
        'Generator': 'Wait to Respond',
        'Manifesting Generator': 'Wait to Respond',
        'Projector': 'Wait for Invitation',
        'Manifestor': 'Inform then Act',
        'Reflector': 'Wait for Lunar Cycle',
      };
      expect(hd.strategy).toBe(strategyMap[hd.type]);
    });

    it('returns a valid authority', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      const hd = calculateHumanDesignProfile(chart.natalPositions, chart.designPositions);
      const validAuthorities = ['Emotional', 'Sacral', 'Splenic', 'Ego/Heart', 'Self/G', 'Mental/None', 'Lunar'];
      expect(validAuthorities).toContain(hd.authority);
    });

    it('returns a valid profile (X/Y format)', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      const hd = calculateHumanDesignProfile(chart.natalPositions, chart.designPositions);
      const validProfiles = ['1/3', '1/4', '2/4', '2/5', '3/5', '3/6', '4/6', '4/1', '5/1', '5/2', '6/2', '6/3'];
      expect(validProfiles).toContain(hd.profile);
    });

    it('returns a valid definition type', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      const hd = calculateHumanDesignProfile(chart.natalPositions, chart.designPositions);
      const validDefs = ['No Definition', 'Single', 'Split', 'Triple Split', 'Quadruple Split'];
      expect(validDefs).toContain(hd.definition);
    });

    it('personality gates are marked isPersonality=true', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      const hd = calculateHumanDesignProfile(chart.natalPositions, chart.designPositions);
      for (const gate of hd.personalityGates) {
        expect(gate.isPersonality).toBe(true);
      }
    });

    it('design gates are marked isPersonality=false', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      const hd = calculateHumanDesignProfile(chart.natalPositions, chart.designPositions);
      for (const gate of hd.designGates) {
        expect(gate.isPersonality).toBe(false);
      }
    });

    it('incarnation cross is a string starting with "Cross of"', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      const hd = calculateHumanDesignProfile(chart.natalPositions, chart.designPositions);
      expect(hd.incarnationCross).toMatch(/^Cross of /);
    });

    it('defined channels produce defined centers', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      const hd = calculateHumanDesignProfile(chart.natalPositions, chart.designPositions);
      // If there are defined channels, there should be defined centers
      if (hd.definedChannelIds.length > 0) {
        expect(hd.definedCenterIds.length).toBeGreaterThan(0);
      }
    });
  });

  describe('calculateProfilesFromBirthData (full pipeline)', () => {
    it('returns calculatedChart, geneKeysProfile, and humanDesignProfile', () => {
      const result = calculateProfilesFromBirthData(gemini2024BirthData);
      expect(result.calculatedChart).toBeDefined();
      expect(result.geneKeysProfile).toBeDefined();
      expect(result.humanDesignProfile).toBeDefined();
    });

    it('returns numerology profile', () => {
      const result = calculateProfilesFromBirthData(gemini2024BirthData);
      expect(result.numerologyProfile).toBeDefined();
      if (result.numerologyProfile) {
        expect(result.numerologyProfile.lifePathNumber).toBeGreaterThanOrEqual(1);
        expect(result.numerologyProfile.lifePathNumber).toBeLessThanOrEqual(33);
      }
    });

    it('produces consistent results for same birth data', () => {
      const result1 = calculateProfilesFromBirthData(gemini2024BirthData);
      const result2 = calculateProfilesFromBirthData(gemini2024BirthData);
      // Gate numbers should be identical
      expect(result1.calculatedChart.natalGates.map(g => g.gateNumber))
        .toEqual(result2.calculatedChart.natalGates.map(g => g.gateNumber));
      // HD type should match
      expect(result1.humanDesignProfile.type).toBe(result2.humanDesignProfile.type);
      // GK life's work should match
      expect(result1.geneKeysProfile.lifesWork.geneKeyNumber)
        .toBe(result2.geneKeysProfile.lifesWork.geneKeyNumber);
    });

    it('different birth dates produce different charts', () => {
      const result1 = calculateProfilesFromBirthData(gemini2024BirthData);
      const result2 = calculateProfilesFromBirthData(y2kBirthData);
      // Sun positions should differ
      const sun1 = result1.calculatedChart.natalPositions.find(p => p.planetId === 'sun')!;
      const sun2 = result2.calculatedChart.natalPositions.find(p => p.planetId === 'sun')!;
      expect(sun1.signId).not.toBe(sun2.signId);
    });
  });

  describe('edge cases', () => {
    it('handles birth near midnight (day boundary)', () => {
      const midnightBirth: BirthData = {
        dateOfBirth: '2024-06-15',
        timeOfBirth: '23:59',
        timezone: 'UTC',
        latitude: 0,
        longitude: 0,
        cityOfBirth: 'Test',
      };
      const chart = calculateFullChart(midnightBirth);
      expect(chart.natalPositions.length).toBe(11);
      expect(chart.natalGates.length).toBeGreaterThan(0);
    });

    it('handles out-of-range birth date (before 2020, uses fallback)', () => {
      const chart = calculateFullChart(freddieBirthData);
      expect(chart.natalPositions.length).toBe(11);
      // Sun should be in Virgo for Sept 5
      const sun = chart.natalPositions.find(p => p.planetId === 'sun')!;
      expect(sun.signId).toBe('virgo');
    });

    it('handles birth at 0° Aries boundary', () => {
      // Spring equinox date — Sun crosses 0° Aries
      const equinoxBirth: BirthData = {
        dateOfBirth: '2024-03-20',
        timeOfBirth: '03:06', // approximate equinox time
        timezone: 'UTC',
        latitude: 0,
        longitude: 0,
        cityOfBirth: 'Test',
      };
      const chart = calculateFullChart(equinoxBirth);
      const sun = chart.natalPositions.find(p => p.planetId === 'sun')!;
      // Sun should be at/near 0° Aries or 29° Pisces
      expect(['aries', 'pisces']).toContain(sun.signId);
    });

    it('Y2K numerology: life path for 2000-01-01', () => {
      const result = calculateProfilesFromBirthData(y2kBirthData);
      // 2000-01-01 => 2+0+0+0+0+1+0+1 = 4 (or reduced differently)
      expect(result.numerologyProfile).toBeDefined();
      if (result.numerologyProfile) {
        expect(result.numerologyProfile.lifePathNumber).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('retrograde calculation (isRetrograde)', () => {
    it('Sun is never retrograde', () => {
      expect(isRetrograde('sun', new Date('2025-03-20T12:00:00Z'))).toBe(false);
      expect(isRetrograde('sun', new Date('2024-06-15T12:00:00Z'))).toBe(false);
    });

    it('Moon is never retrograde', () => {
      expect(isRetrograde('moon', new Date('2025-03-20T12:00:00Z'))).toBe(false);
      expect(isRetrograde('moon', new Date('2024-06-15T12:00:00Z'))).toBe(false);
    });

    it('Earth is never retrograde', () => {
      expect(isRetrograde('earth', new Date('2025-03-20T12:00:00Z'))).toBe(false);
    });

    it('Mercury is retrograde during known retrograde period (2025-03-15 to 2025-04-07)', () => {
      // Mid-retrograde: should be true
      expect(isRetrograde('mercury', new Date('2025-03-20T12:00:00Z'))).toBe(true);
      expect(isRetrograde('mercury', new Date('2025-03-25T12:00:00Z'))).toBe(true);
    });

    it('Mercury is direct outside retrograde periods', () => {
      // Well after retrograde ends
      expect(isRetrograde('mercury', new Date('2025-04-15T12:00:00Z'))).toBe(false);
    });

    it('natal chart positions include retrograde data', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      // Every position should have a boolean retrograde field
      for (const pos of chart.natalPositions) {
        expect(typeof pos.retrograde).toBe('boolean');
      }
      // Earth should never be retrograde
      const earth = chart.natalPositions.find(p => p.planetId === 'earth')!;
      expect(earth.retrograde).toBe(false);
      // Sun should never be retrograde
      const sun = chart.natalPositions.find(p => p.planetId === 'sun')!;
      expect(sun.retrograde).toBe(false);
    });

    it('design chart positions include retrograde data', () => {
      const chart = calculateFullChart(gemini2024BirthData);
      for (const pos of chart.designPositions) {
        expect(typeof pos.retrograde).toBe('boolean');
      }
    });

    it('returns boolean for all standard planets', () => {
      const date = new Date('2025-06-15T12:00:00Z');
      const planets = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
      for (const planet of planets) {
        const result = isRetrograde(planet, date);
        expect(typeof result).toBe('boolean');
      }
    });
  });
});
