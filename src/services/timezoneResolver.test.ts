import { describe, it, expect } from 'vitest';
import { getTimezoneForLocation } from './timezoneResolver';
import { calculateFullChart } from './chartCalculation';
import type { BirthData } from '../types';

describe('timezoneResolver', () => {
  describe('getTimezoneForLocation', () => {
    it('Tokyo → Asia/Tokyo', () => {
      expect(getTimezoneForLocation(35.6762, 139.6503)).toBe('Asia/Tokyo');
    });

    it('New York → America/New_York', () => {
      expect(getTimezoneForLocation(40.7128, -74.0060)).toBe('America/New_York');
    });

    it('London → Europe/London', () => {
      expect(getTimezoneForLocation(51.5074, -0.1278)).toBe('Europe/London');
    });

    it('Sao Paulo → America/Sao_Paulo', () => {
      expect(getTimezoneForLocation(-23.5505, -46.6333)).toBe('America/Sao_Paulo');
    });

    it('Sydney → Australia/Sydney', () => {
      expect(getTimezoneForLocation(-33.8688, 151.2093)).toBe('Australia/Sydney');
    });

    it('Mumbai → Asia/Kolkata', () => {
      expect(getTimezoneForLocation(19.0760, 72.8777)).toBe('Asia/Kolkata');
    });

    it('returns a valid IANA timezone for ocean coordinates (nearest zone)', () => {
      const tz = getTimezoneForLocation(0, -160);
      expect(typeof tz).toBe('string');
      expect(tz.length).toBeGreaterThan(0);
    });
  });

  describe('birth timezone UTC conversion (integration)', () => {
    it('same time in different timezones produces different natal dates', () => {
      // Born at 14:00 in Tokyo (UTC+9) vs 14:00 in NYC (UTC-4 summer)
      const tokyoBirth: BirthData = {
        dateOfBirth: '2024-06-15',
        timeOfBirth: '14:00',
        timezone: 'Asia/Tokyo',
        latitude: 35.6762,
        longitude: 139.6503,
        cityOfBirth: 'Tokyo',
      };
      const nycBirth: BirthData = {
        dateOfBirth: '2024-06-15',
        timeOfBirth: '14:00',
        timezone: 'America/New_York',
        latitude: 40.7128,
        longitude: -74.006,
        cityOfBirth: 'New York',
      };

      const tokyoChart = calculateFullChart(tokyoBirth);
      const nycChart = calculateFullChart(nycBirth);

      // The UTC natal dates must differ
      expect(tokyoChart.natalDate).not.toBe(nycChart.natalDate);

      const tokyoUTC = new Date(tokyoChart.natalDate).getTime();
      const nycUTC = new Date(nycChart.natalDate).getTime();
      const diffHours = Math.abs(nycUTC - tokyoUTC) / (1000 * 60 * 60);

      // Tokyo is UTC+9, NYC is UTC-4 (June = EDT), so diff ~13 hours
      expect(diffHours).toBeGreaterThan(12);
      expect(diffHours).toBeLessThan(15);
    });

    it('UTC timezone produces natalDate matching the input time', () => {
      const utcBirth: BirthData = {
        dateOfBirth: '2024-06-15',
        timeOfBirth: '12:00',
        timezone: 'UTC',
        latitude: 0,
        longitude: 0,
        cityOfBirth: 'Null Island',
      };

      const chart = calculateFullChart(utcBirth);
      const natalDate = new Date(chart.natalDate);

      expect(natalDate.getUTCHours()).toBe(12);
      expect(natalDate.getUTCMinutes()).toBe(0);
      expect(natalDate.getUTCDate()).toBe(15);
    });

    it('DST: summer birth in NYC uses EDT (UTC-4), not EST (UTC-5)', () => {
      const summerNYC: BirthData = {
        dateOfBirth: '2024-06-15',
        timeOfBirth: '12:00',
        timezone: 'America/New_York',
        latitude: 40.7128,
        longitude: -74.006,
        cityOfBirth: 'New York',
      };

      const chart = calculateFullChart(summerNYC);
      const natalDate = new Date(chart.natalDate);

      // 12:00 EDT = 16:00 UTC (offset -4)
      expect(natalDate.getUTCHours()).toBe(16);
    });

    it('DST: winter birth in NYC uses EST (UTC-5)', () => {
      const winterNYC: BirthData = {
        dateOfBirth: '2024-01-15',
        timeOfBirth: '12:00',
        timezone: 'America/New_York',
        latitude: 40.7128,
        longitude: -74.006,
        cityOfBirth: 'New York',
      };

      const chart = calculateFullChart(winterNYC);
      const natalDate = new Date(chart.natalDate);

      // 12:00 EST = 17:00 UTC (offset -5)
      expect(natalDate.getUTCHours()).toBe(17);
    });

    it('India (UTC+5:30) half-hour offset is handled correctly', () => {
      const mumbaiBirth: BirthData = {
        dateOfBirth: '2024-06-15',
        timeOfBirth: '12:00',
        timezone: 'Asia/Kolkata',
        latitude: 19.076,
        longitude: 72.8777,
        cityOfBirth: 'Mumbai',
      };

      const chart = calculateFullChart(mumbaiBirth);
      const natalDate = new Date(chart.natalDate);

      // 12:00 IST = 06:30 UTC
      expect(natalDate.getUTCHours()).toBe(6);
      expect(natalDate.getUTCMinutes()).toBe(30);
    });
  });
});
