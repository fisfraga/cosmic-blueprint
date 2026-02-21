import { describe, it, expect } from 'vitest';
import { getTimezoneForLocation } from './timezoneResolver';

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

    it('returns a valid IANA timezone for ocean coordinates (nearest zone)', () => {
      // tz-lookup maps ocean coordinates to the nearest timezone zone
      const tz = getTimezoneForLocation(0, -160);
      expect(typeof tz).toBe('string');
      expect(tz.length).toBeGreaterThan(0);
    });
  });
});
