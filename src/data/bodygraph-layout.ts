/**
 * Body Graph Layout Data
 * SVG coordinates for centers, channels, and gates in the Human Design body graph.
 * Coordinates are normalized 0-100 scale.
 */

// Center positions in the Body Graph (normalized coordinates 0-100)
export const CENTER_POSITIONS: Record<string, { x: number; y: number; shape: 'triangle' | 'square' | 'diamond' }> = {
  'head-center': { x: 50, y: 8, shape: 'triangle' },
  'ajna-center': { x: 50, y: 22, shape: 'triangle' },
  'throat-center': { x: 50, y: 38, shape: 'square' },
  'g-center': { x: 50, y: 54, shape: 'diamond' },
  'heart-center': { x: 30, y: 48, shape: 'triangle' },
  'spleen-center': { x: 25, y: 62, shape: 'triangle' },
  'sacral-center': { x: 50, y: 72, shape: 'square' },
  'solar-plexus-center': { x: 75, y: 62, shape: 'triangle' },
  'root-center': { x: 50, y: 90, shape: 'square' },
};

// Traditional Human Design center colors
export const CENTER_COLORS: Record<string, { defined: string; undefined: string }> = {
  'head-center': { defined: '#F9E264', undefined: 'transparent' },        // Yellow
  'ajna-center': { defined: '#9FC951', undefined: 'transparent' },        // Green
  'throat-center': { defined: '#8B6914', undefined: 'transparent' },      // Brown/Ochre
  'g-center': { defined: '#F9E264', undefined: 'transparent' },           // Yellow
  'heart-center': { defined: '#E54646', undefined: 'transparent' },       // Red
  'spleen-center': { defined: '#8B6914', undefined: 'transparent' },      // Brown
  'sacral-center': { defined: '#E07744', undefined: 'transparent' },      // Red/Orange
  'solar-plexus-center': { defined: '#8B6914', undefined: 'transparent' },// Brown
  'root-center': { defined: '#8B6914', undefined: 'transparent' },        // Brown
};

// Channel paths between centers
// Format: SVG path string connecting center coordinates
// Multiple channels between same centers are offset slightly
export interface ChannelPath {
  path: string;
  center1Id: string;
  center2Id: string;
  gate1: number;
  gate2: number;
}

export const CHANNEL_PATHS: Record<string, ChannelPath> = {
  // Head ↔ Ajna (3 channels - vertical stack)
  'channel-64-47': {
    path: 'M47,12 L47,18',
    center1Id: 'head-center',
    center2Id: 'ajna-center',
    gate1: 64, gate2: 47
  },
  'channel-61-24': {
    path: 'M50,12 L50,18',
    center1Id: 'head-center',
    center2Id: 'ajna-center',
    gate1: 61, gate2: 24
  },
  'channel-63-4': {
    path: 'M53,12 L53,18',
    center1Id: 'head-center',
    center2Id: 'ajna-center',
    gate1: 63, gate2: 4
  },

  // Ajna ↔ Throat (3 channels)
  'channel-47-64': {
    path: 'M47,26 L47,34',
    center1Id: 'ajna-center',
    center2Id: 'throat-center',
    gate1: 47, gate2: 64
  },
  'channel-17-62': {
    path: 'M50,26 L50,34',
    center1Id: 'ajna-center',
    center2Id: 'throat-center',
    gate1: 17, gate2: 62
  },
  'channel-11-56': {
    path: 'M53,26 L53,34',
    center1Id: 'ajna-center',
    center2Id: 'throat-center',
    gate1: 11, gate2: 56
  },
  'channel-43-23': {
    path: 'M56,26 L56,34',
    center1Id: 'ajna-center',
    center2Id: 'throat-center',
    gate1: 43, gate2: 23
  },

  // G-Center ↔ Throat (4 channels)
  'channel-1-8': {
    path: 'M47,50 L47,42',
    center1Id: 'g-center',
    center2Id: 'throat-center',
    gate1: 1, gate2: 8
  },
  'channel-7-31': {
    path: 'M50,50 L50,42',
    center1Id: 'g-center',
    center2Id: 'throat-center',
    gate1: 7, gate2: 31
  },
  'channel-13-33': {
    path: 'M53,50 L53,42',
    center1Id: 'g-center',
    center2Id: 'throat-center',
    gate1: 13, gate2: 33
  },
  'channel-10-20': {
    path: 'M56,50 L56,42',
    center1Id: 'g-center',
    center2Id: 'throat-center',
    gate1: 10, gate2: 20
  },

  // G-Center ↔ Sacral (3 channels)
  'channel-2-14': {
    path: 'M47,58 L47,68',
    center1Id: 'g-center',
    center2Id: 'sacral-center',
    gate1: 2, gate2: 14
  },
  'channel-5-15': {
    path: 'M50,58 L50,68',
    center1Id: 'g-center',
    center2Id: 'sacral-center',
    gate1: 5, gate2: 15
  },
  'channel-29-46': {
    path: 'M53,58 L53,68',
    center1Id: 'g-center',
    center2Id: 'sacral-center',
    gate1: 29, gate2: 46
  },
  'channel-10-34': {
    path: 'M56,58 L56,68',
    center1Id: 'g-center',
    center2Id: 'sacral-center',
    gate1: 10, gate2: 34
  },

  // Sacral ↔ Root (4 channels)
  'channel-3-60': {
    path: 'M44,76 L44,86',
    center1Id: 'sacral-center',
    center2Id: 'root-center',
    gate1: 3, gate2: 60
  },
  'channel-9-52': {
    path: 'M48,76 L48,86',
    center1Id: 'sacral-center',
    center2Id: 'root-center',
    gate1: 9, gate2: 52
  },
  'channel-42-53': {
    path: 'M52,76 L52,86',
    center1Id: 'sacral-center',
    center2Id: 'root-center',
    gate1: 42, gate2: 53
  },

  // Heart ↔ Throat
  'channel-21-45': {
    path: 'M34,46 L46,40',
    center1Id: 'heart-center',
    center2Id: 'throat-center',
    gate1: 21, gate2: 45
  },

  // Heart ↔ G-Center
  'channel-25-51': {
    path: 'M34,50 L46,54',
    center1Id: 'heart-center',
    center2Id: 'g-center',
    gate1: 25, gate2: 51
  },

  // Heart ↔ Spleen
  'channel-26-44': {
    path: 'M28,52 L26,58',
    center1Id: 'heart-center',
    center2Id: 'spleen-center',
    gate1: 26, gate2: 44
  },

  // Heart ↔ Solar Plexus
  'channel-37-40': {
    path: 'M34,52 Q50,55 71,60',
    center1Id: 'heart-center',
    center2Id: 'solar-plexus-center',
    gate1: 37, gate2: 40
  },

  // Spleen ↔ Throat (2 channels)
  'channel-16-48': {
    path: 'M29,58 Q35,48 46,40',
    center1Id: 'spleen-center',
    center2Id: 'throat-center',
    gate1: 16, gate2: 48
  },
  'channel-20-57': {
    path: 'M29,60 Q38,50 48,42',
    center1Id: 'spleen-center',
    center2Id: 'throat-center',
    gate1: 20, gate2: 57
  },

  // Spleen ↔ G-Center
  'channel-10-57': {
    path: 'M29,60 Q38,58 46,54',
    center1Id: 'spleen-center',
    center2Id: 'g-center',
    gate1: 10, gate2: 57
  },

  // Spleen ↔ Sacral (2 channels)
  'channel-27-50': {
    path: 'M29,64 L46,70',
    center1Id: 'spleen-center',
    center2Id: 'sacral-center',
    gate1: 27, gate2: 50
  },
  'channel-34-57': {
    path: 'M29,66 L46,72',
    center1Id: 'spleen-center',
    center2Id: 'sacral-center',
    gate1: 34, gate2: 57
  },

  // Spleen ↔ Root (3 channels)
  'channel-18-58': {
    path: 'M27,66 Q30,78 46,88',
    center1Id: 'spleen-center',
    center2Id: 'root-center',
    gate1: 18, gate2: 58
  },
  'channel-28-38': {
    path: 'M25,66 Q28,80 44,88',
    center1Id: 'spleen-center',
    center2Id: 'root-center',
    gate1: 28, gate2: 38
  },
  'channel-32-54': {
    path: 'M23,66 Q26,82 42,88',
    center1Id: 'spleen-center',
    center2Id: 'root-center',
    gate1: 32, gate2: 54
  },

  // Solar Plexus ↔ Throat (2 channels)
  'channel-12-22': {
    path: 'M71,58 Q65,48 54,40',
    center1Id: 'solar-plexus-center',
    center2Id: 'throat-center',
    gate1: 12, gate2: 22
  },
  'channel-35-36': {
    path: 'M73,58 Q62,50 56,42',
    center1Id: 'solar-plexus-center',
    center2Id: 'throat-center',
    gate1: 35, gate2: 36
  },

  // Solar Plexus ↔ Sacral (1 channel)
  'channel-6-59': {
    path: 'M71,64 L54,70',
    center1Id: 'solar-plexus-center',
    center2Id: 'sacral-center',
    gate1: 6, gate2: 59
  },

  // Solar Plexus ↔ Root (2 channels)
  'channel-19-49': {
    path: 'M73,66 Q70,78 54,88',
    center1Id: 'solar-plexus-center',
    center2Id: 'root-center',
    gate1: 19, gate2: 49
  },
  'channel-30-41': {
    path: 'M75,66 Q72,80 56,88',
    center1Id: 'solar-plexus-center',
    center2Id: 'root-center',
    gate1: 30, gate2: 41
  },
  'channel-39-55': {
    path: 'M77,66 Q74,82 58,88',
    center1Id: 'solar-plexus-center',
    center2Id: 'root-center',
    gate1: 39, gate2: 55
  },

  // Throat ↔ Sacral
  'channel-20-34': {
    path: 'M58,42 Q60,55 56,68',
    center1Id: 'throat-center',
    center2Id: 'sacral-center',
    gate1: 20, gate2: 34
  },
};

// Gate positions for display on the body graph
// Each gate is positioned near its center with slight offsets for visual clarity
export interface GatePosition {
  x: number;
  y: number;
  centerId: string;
}

export const GATE_POSITIONS: Record<number, GatePosition> = {
  // Head Center gates
  64: { x: 45, y: 5, centerId: 'head-center' },
  61: { x: 50, y: 3, centerId: 'head-center' },
  63: { x: 55, y: 5, centerId: 'head-center' },

  // Ajna Center gates
  47: { x: 42, y: 19, centerId: 'ajna-center' },
  24: { x: 47, y: 17, centerId: 'ajna-center' },
  4: { x: 53, y: 17, centerId: 'ajna-center' },
  17: { x: 45, y: 25, centerId: 'ajna-center' },
  43: { x: 55, y: 25, centerId: 'ajna-center' },
  11: { x: 58, y: 22, centerId: 'ajna-center' },

  // Throat Center gates
  62: { x: 42, y: 33, centerId: 'throat-center' },
  23: { x: 42, y: 38, centerId: 'throat-center' },
  56: { x: 42, y: 43, centerId: 'throat-center' },
  16: { x: 36, y: 36, centerId: 'throat-center' },
  35: { x: 64, y: 36, centerId: 'throat-center' },
  12: { x: 58, y: 33, centerId: 'throat-center' },
  45: { x: 38, y: 41, centerId: 'throat-center' },
  20: { x: 58, y: 43, centerId: 'throat-center' },
  31: { x: 50, y: 33, centerId: 'throat-center' },
  8: { x: 45, y: 35, centerId: 'throat-center' },
  33: { x: 55, y: 35, centerId: 'throat-center' },

  // G-Center gates
  1: { x: 44, y: 50, centerId: 'g-center' },
  7: { x: 47, y: 52, centerId: 'g-center' },
  13: { x: 53, y: 52, centerId: 'g-center' },
  10: { x: 56, y: 50, centerId: 'g-center' },
  2: { x: 44, y: 58, centerId: 'g-center' },
  15: { x: 50, y: 59, centerId: 'g-center' },
  46: { x: 56, y: 58, centerId: 'g-center' },
  25: { x: 38, y: 52, centerId: 'g-center' },

  // Heart/Ego Center gates
  21: { x: 32, y: 44, centerId: 'heart-center' },
  26: { x: 26, y: 50, centerId: 'heart-center' },
  51: { x: 34, y: 52, centerId: 'heart-center' },
  40: { x: 28, y: 46, centerId: 'heart-center' },

  // Spleen Center gates
  48: { x: 20, y: 58, centerId: 'spleen-center' },
  57: { x: 22, y: 61, centerId: 'spleen-center' },
  44: { x: 24, y: 58, centerId: 'spleen-center' },
  50: { x: 28, y: 64, centerId: 'spleen-center' },
  32: { x: 20, y: 66, centerId: 'spleen-center' },
  28: { x: 22, y: 68, centerId: 'spleen-center' },
  18: { x: 26, y: 66, centerId: 'spleen-center' },

  // Sacral Center gates - spread around center at y=72
  5: { x: 40, y: 68, centerId: 'sacral-center' },
  14: { x: 45, y: 66, centerId: 'sacral-center' },
  29: { x: 55, y: 66, centerId: 'sacral-center' },
  34: { x: 60, y: 68, centerId: 'sacral-center' },
  27: { x: 38, y: 74, centerId: 'sacral-center' },
  59: { x: 62, y: 74, centerId: 'sacral-center' },
  3: { x: 40, y: 78, centerId: 'sacral-center' },
  9: { x: 50, y: 80, centerId: 'sacral-center' },
  42: { x: 60, y: 78, centerId: 'sacral-center' },

  // Solar Plexus Center gates
  22: { x: 70, y: 58, centerId: 'solar-plexus-center' },
  36: { x: 72, y: 60, centerId: 'solar-plexus-center' },
  37: { x: 70, y: 64, centerId: 'solar-plexus-center' },
  6: { x: 74, y: 62, centerId: 'solar-plexus-center' },
  49: { x: 76, y: 66, centerId: 'solar-plexus-center' },
  55: { x: 80, y: 64, centerId: 'solar-plexus-center' },
  30: { x: 78, y: 60, centerId: 'solar-plexus-center' },
  19: { x: 72, y: 68, centerId: 'solar-plexus-center' },

  // Root Center gates
  60: { x: 42, y: 88, centerId: 'root-center' },
  52: { x: 46, y: 86, centerId: 'root-center' },
  53: { x: 50, y: 84, centerId: 'root-center' },
  54: { x: 38, y: 90, centerId: 'root-center' },
  38: { x: 40, y: 92, centerId: 'root-center' },
  58: { x: 44, y: 94, centerId: 'root-center' },
  41: { x: 56, y: 86, centerId: 'root-center' },
  39: { x: 62, y: 90, centerId: 'root-center' },
};

// Circuit color mapping for channels
export const CIRCUIT_COLORS: Record<string, string> = {
  'Individual': '#9333EA',    // Purple
  'Collective': '#3B82F6',    // Blue
  'Tribal': '#EF4444',        // Red
  'Integration': '#10B981',   // Green/Teal
};

// Get channel path by gate numbers (either order)
export function getChannelByGates(gate1: number, gate2: number): ChannelPath | undefined {
  const key1 = `channel-${gate1}-${gate2}`;
  const key2 = `channel-${gate2}-${gate1}`;
  return CHANNEL_PATHS[key1] || CHANNEL_PATHS[key2];
}

// Get all channels between two centers
export function getChannelsBetweenCenters(center1Id: string, center2Id: string): ChannelPath[] {
  return Object.values(CHANNEL_PATHS).filter(
    channel =>
      (channel.center1Id === center1Id && channel.center2Id === center2Id) ||
      (channel.center1Id === center2Id && channel.center2Id === center1Id)
  );
}

// Get all gates for a specific center
export function getGatesForCenter(centerId: string): number[] {
  return Object.entries(GATE_POSITIONS)
    .filter(([, pos]) => pos.centerId === centerId)
    .map(([gate]) => parseInt(gate));
}
