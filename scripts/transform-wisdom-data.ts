/**
 * Transform Wisdom Data
 *
 * This script parses the source data from wisdom-app-data and generates
 * structured JSON files for the Cosmic Copilot application.
 *
 * Run with: npx ts-node scripts/transform-wisdom-data.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// Types
// ============================================

interface HDGateSource {
  Gate: number;
  Title: string;
  Content: string;
}

interface HDGateOutput {
  id: string;
  type: 'hd-gate';
  name: string;
  symbol: string;
  gateNumber: number;
  iChingHexagram: number;
  iChingName: string;
  centerId: string;
  circuitType?: string;
  channelGateId?: string;
  tropicalSignId: string;
  degreeStart: number;
  degreeEnd: number;
  geneKeyId: string;
  keywords: string[];
  coreTheme: string;
  hdDefinition: string;
  highExpression: string;
  lowExpression: string;
  affirmations: string[];
  description: string;
}

interface FrequencyExpression {
  name: string;
  keyExpression: string;
  description: string;
  repressiveNature?: string;
  reactiveNature?: string;
}

interface GeneKeyOutput {
  id: string;
  type: 'gene-key';
  name: string;
  symbol: string;
  keyNumber: number;
  shadow: FrequencyExpression;
  gift: FrequencyExpression;
  siddhi: FrequencyExpression;
  programmingPartnerId: string;
  codonRingId: string;
  aminoAcidId?: string;
  physiology: string;
  hdGateId: string;
  iChingHexagram: number;
  tropicalSignId: string;
  degreeStart: number;
  degreeEnd: number;
  url?: string;
  description: string;
}

interface CodonRingOutput {
  id: string;
  type: 'codon-ring';
  name: string;
  symbol: string;
  geneKeyIds: string[];
  aminoAcidId?: string;
  theme: string;
  collectivePurpose: string;
  description: string;
}

// ============================================
// Constants
// ============================================

const SOURCE_DIR = path.join(__dirname, '../_Data/wisdom-app-data');
const OUTPUT_DIR = path.join(__dirname, '../src/data/universal');

// Sign name to ID mapping
const SIGN_MAP: Record<string, string> = {
  'aries': 'aries',
  'taurus': 'taurus',
  'gemini': 'gemini',
  'cancer': 'cancer',
  'leo': 'leo',
  'virgo': 'virgo',
  'libra': 'libra',
  'scorpio': 'scorpio',
  'sagittarius': 'sagittarius',
  'capricorn': 'capricorn',
  'aquarius': 'aquarius',
  'pisces': 'pisces',
};

// Center name to ID mapping
const CENTER_MAP: Record<string, string> = {
  'g center': 'g-center',
  'g': 'g-center',
  'throat': 'throat-center',
  'throat center': 'throat-center',
  'sacral': 'sacral-center',
  'sacral center': 'sacral-center',
  'spleen': 'spleen-center',
  'spleen center': 'spleen-center',
  'splenic': 'spleen-center',
  'splenic center': 'spleen-center',
  'solar plexus': 'solar-plexus-center',
  'solar plexus center': 'solar-plexus-center',
  'emotional': 'solar-plexus-center',
  'emotional center': 'solar-plexus-center',
  'heart': 'heart-center',
  'heart center': 'heart-center',
  'ego': 'heart-center',
  'ego center': 'heart-center',
  'will': 'heart-center',
  'will center': 'heart-center',
  'root': 'root-center',
  'root center': 'root-center',
  'head': 'head-center',
  'head center': 'head-center',
  'ajna': 'ajna-center',
  'ajna center': 'ajna-center',
  'mind': 'ajna-center',
  'mind center': 'ajna-center',
};

// Codon ring name to ID mapping
const CODON_RING_MAP: Record<string, string> = {
  'the ring of fire': 'ring-of-fire',
  'ring of fire': 'ring-of-fire',
  'the ring of water': 'ring-of-water',
  'ring of water': 'ring-of-water',
  'the ring of life and death': 'ring-of-life-and-death',
  'ring of life and death': 'ring-of-life-and-death',
  'the ring of union': 'ring-of-union',
  'ring of union': 'ring-of-union',
  'the ring of light': 'ring-of-light',
  'ring of light': 'ring-of-light',
  'the ring of alchemy': 'ring-of-alchemy',
  'ring of alchemy': 'ring-of-alchemy',
  'the ring of purification': 'ring-of-purification',
  'ring of purification': 'ring-of-purification',
  'the ring of humanity': 'ring-of-humanity',
  'ring of humanity': 'ring-of-humanity',
  'the ring of secrets': 'ring-of-secrets',
  'ring of secrets': 'ring-of-secrets',
  'the ring of seeking': 'ring-of-seeking',
  'ring of seeking': 'ring-of-seeking',
  'the ring of prosperity': 'ring-of-prosperity',
  'ring of prosperity': 'ring-of-prosperity',
  'the ring of matter': 'ring-of-matter',
  'ring of matter': 'ring-of-matter',
  'the ring of divinity': 'ring-of-divinity',
  'ring of divinity': 'ring-of-divinity',
  'the ring of trials': 'ring-of-trials',
  'ring of trials': 'ring-of-trials',
  'the ring of miracles': 'ring-of-miracles',
  'ring of miracles': 'ring-of-miracles',
  'the ring of gaia': 'ring-of-gaia',
  'ring of gaia': 'ring-of-gaia',
  'the ring of origin': 'ring-of-origin',
  'ring of origin': 'ring-of-origin',
  'the ring of illusion': 'ring-of-illusion',
  'ring of illusion': 'ring-of-illusion',
  'the ring of whirlwind': 'ring-of-whirlwind',
  'ring of whirlwind': 'ring-of-whirlwind',
  'the ring of no return': 'ring-of-no-return',
  'ring of no return': 'ring-of-no-return',
  'the ring of destiny': 'ring-of-destiny',
  'ring of destiny': 'ring-of-destiny',
};

// Amino acid name to ID mapping
const AMINO_ACID_MAP: Record<string, string> = {
  'alanine': 'alanine',
  'arginine': 'arginine',
  'asparagine': 'asparagine',
  'aspartic acid': 'aspartic-acid',
  'cysteine': 'cysteine',
  'glutamic acid': 'glutamic-acid',
  'glutamine': 'glutamine',
  'glycine': 'glycine',
  'histidine': 'histidine',
  'isoleucine': 'isoleucine',
  'leucine': 'leucine',
  'lysine': 'lysine',
  'methionine': 'methionine',
  'phenylalanine': 'phenylalanine',
  'proline': 'proline',
  'serine': 'serine',
  'threonine': 'threonine',
  'tryptophan': 'tryptophan',
  'tyrosine': 'tyrosine',
  'valine': 'valine',
  'stop codon': 'stop-codon',
};

// Gate to zodiac degree mapping (approximate - degrees in absolute terms 0-360)
// This is a simplified mapping based on the HD wheel
const GATE_ZODIAC_MAP: Record<number, { sign: string; start: number; end: number }> = {
  1: { sign: 'scorpio', start: 223.625, end: 229.25 },
  2: { sign: 'taurus', start: 58.125, end: 63.75 },
  3: { sign: 'taurus', start: 30, end: 35.625 },
  4: { sign: 'leo', start: 123.875, end: 129.5 },
  5: { sign: 'scorpio', start: 235, end: 240.625 },
  6: { sign: 'virgo', start: 153.875, end: 159.5 },
  7: { sign: 'leo', start: 129.5, end: 135.125 },
  8: { sign: 'taurus', start: 45, end: 50.625 },
  9: { sign: 'scorpio', start: 229.25, end: 234.875 },
  10: { sign: 'sagittarius', start: 240, end: 245.625 },
  11: { sign: 'sagittarius', start: 240.625, end: 246.25 },
  12: { sign: 'gemini', start: 75.125, end: 80.75 },
  13: { sign: 'capricorn', start: 279.5, end: 285.125 },
  14: { sign: 'scorpio', start: 210, end: 215.625 },
  15: { sign: 'gemini', start: 80.75, end: 86.375 },
  16: { sign: 'gemini', start: 60, end: 65.625 },
  17: { sign: 'aries', start: 5.625, end: 11.25 },
  18: { sign: 'virgo', start: 165.125, end: 170.75 },
  19: { sign: 'capricorn', start: 273.875, end: 279.5 },
  20: { sign: 'taurus', start: 50.625, end: 56.25 },
  21: { sign: 'aries', start: 11.25, end: 16.875 },
  22: { sign: 'aquarius', start: 309.5, end: 315.125 },
  23: { sign: 'taurus', start: 39.5, end: 45.125 },
  24: { sign: 'taurus', start: 35.625, end: 41.25 },
  25: { sign: 'aries', start: 0, end: 5.625 },
  26: { sign: 'sagittarius', start: 240.625, end: 246.25 },
  27: { sign: 'taurus', start: 30, end: 35.625 },
  28: { sign: 'libra', start: 195.125, end: 200.75 },
  29: { sign: 'leo', start: 135.125, end: 140.75 },
  30: { sign: 'capricorn', start: 290.75, end: 296.375 },
  31: { sign: 'cancer', start: 110.75, end: 116.375 },
  32: { sign: 'libra', start: 183.875, end: 189.5 },
  33: { sign: 'cancer', start: 116.375, end: 122 },
  34: { sign: 'scorpio', start: 215.625, end: 221.25 },
  35: { sign: 'gemini', start: 65.625, end: 71.25 },
  36: { sign: 'aquarius', start: 315.125, end: 320.75 },
  37: { sign: 'aquarius', start: 300, end: 305.625 },
  38: { sign: 'sagittarius', start: 251.25, end: 256.875 },
  39: { sign: 'cancer', start: 90, end: 95.625 },
  40: { sign: 'leo', start: 140.75, end: 146.375 },
  41: { sign: 'capricorn', start: 270, end: 275.625 },
  42: { sign: 'aries', start: 22.5, end: 28.125 },
  43: { sign: 'libra', start: 200.75, end: 206.375 },
  44: { sign: 'libra', start: 206.375, end: 212 },
  45: { sign: 'gemini', start: 71.25, end: 76.875 },
  46: { sign: 'virgo', start: 159.5, end: 165.125 },
  47: { sign: 'virgo', start: 150, end: 155.625 },
  48: { sign: 'virgo', start: 170.75, end: 176.375 },
  49: { sign: 'capricorn', start: 285.125, end: 290.75 },
  50: { sign: 'libra', start: 189.5, end: 195.125 },
  51: { sign: 'aries', start: 16.875, end: 22.5 },
  52: { sign: 'cancer', start: 95.625, end: 101.25 },
  53: { sign: 'cancer', start: 101.25, end: 106.875 },
  54: { sign: 'sagittarius', start: 256.875, end: 262.5 },
  55: { sign: 'capricorn', start: 296.375, end: 302 },
  56: { sign: 'cancer', start: 106.875, end: 112.5 },
  57: { sign: 'virgo', start: 176.375, end: 182 },
  58: { sign: 'sagittarius', start: 245.625, end: 251.25 },
  59: { sign: 'leo', start: 146.375, end: 152 },
  60: { sign: 'sagittarius', start: 262.5, end: 268.125 },
  61: { sign: 'sagittarius', start: 262.5, end: 268.125 },
  62: { sign: 'cancer', start: 106.875, end: 112.5 },
  63: { sign: 'aquarius', start: 303.875, end: 309.5 },
  64: { sign: 'leo', start: 146.375, end: 152 },
};

// ============================================
// Parsing Functions
// ============================================

function extractFromContent(content: string, field: string): string {
  // Try multiple patterns for extracting fields from markdown content
  const patterns = [
    new RegExp(`${field}:\\s*(.+?)(?:\\n|$)`, 'i'),
    new RegExp(`\\*\\*${field}\\*\\*:\\s*(.+?)(?:\\n|$)`, 'i'),
    new RegExp(`${field}:(.+?)(?:\\n|$)`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return '';
}

function normalizeSignName(sign: string): string {
  const normalized = sign.toLowerCase().trim();
  return SIGN_MAP[normalized] || normalized;
}

function normalizeCenterName(center: string): string {
  const normalized = center.toLowerCase().trim();
  return CENTER_MAP[normalized] || `${normalized}-center`;
}

function normalizeCodonRing(ring: string): string {
  const normalized = ring.toLowerCase().trim().replace(/[#[\]]/g, '');
  return CODON_RING_MAP[normalized] || normalized.replace(/\s+/g, '-');
}

function normalizeAminoAcid(acid: string): string {
  const normalized = acid.toLowerCase().trim().replace(/[#[\]]/g, '');
  return AMINO_ACID_MAP[normalized] || normalized.replace(/\s+/g, '-');
}

// ============================================
// HD Gates Parsing
// ============================================

function parseHDGates(): HDGateOutput[] {
  const sourcePath = path.join(SOURCE_DIR, 'human-design/human_design_gates.json');

  if (!fs.existsSync(sourcePath)) {
    console.error(`HD Gates source file not found: ${sourcePath}`);
    return [];
  }

  const rawData = fs.readFileSync(sourcePath, 'utf-8');
  const sourceGates: HDGateSource[] = JSON.parse(rawData);

  const gates: HDGateOutput[] = [];

  for (const source of sourceGates) {
    const gateNum = source.Gate;
    const content = source.Content;

    // Extract archetype name from title (after the second dash)
    const titleParts = source.Title.split('–').map(s => s.trim());
    const archetypeName = titleParts[2] || `Gate ${gateNum}`;

    // Extract fields from content
    const officialName = extractFromContent(content, 'Official Gate Name') ||
                         extractFromContent(content, 'Official Name');
    const hdDefinition = extractFromContent(content, 'Human Design Definition') ||
                         extractFromContent(content, 'Definition');
    const coreTheme = extractFromContent(content, 'Core Theme');
    const tropicalSign = extractFromContent(content, 'Tropical Sign');
    const bodygraphCenter = extractFromContent(content, 'Bodygraph Center');
    const geneKeysShadow = extractFromContent(content, 'Gene Keys Shadow');
    const geneKeysGift = extractFromContent(content, 'Gene Keys Gift');
    const geneKeysSiddhi = extractFromContent(content, 'Gene Keys Siddhi');

    // Parse center - often in format "G center and connects to..."
    let centerId = 'unknown-center';
    const centerMatch = bodygraphCenter.match(/^([A-Za-z\s]+?)(?:\s+and|\s+center)/i);
    if (centerMatch) {
      centerId = normalizeCenterName(centerMatch[1]);
    } else if (bodygraphCenter) {
      centerId = normalizeCenterName(bodygraphCenter.split(' ')[0]);
    }

    // Parse connected gate
    let channelGateId: string | undefined;
    const connectMatch = bodygraphCenter.match(/gate\s*(\d+)/i);
    if (connectMatch) {
      channelGateId = `gate-${connectMatch[1]}`;
    }

    // Get zodiac info
    const zodiacInfo = GATE_ZODIAC_MAP[gateNum] || { sign: 'unknown', start: 0, end: 0 };

    // Extract keywords
    const keywordsMatch = content.match(/Keywords?:\s*(.+?)(?:\n|Download)/i);
    const keywords = keywordsMatch
      ? keywordsMatch[1].split(',').map(k => k.trim().toLowerCase())
      : [];

    // Extract high/low expressions (look for positive/negative sides section)
    let highExpression = '';
    let lowExpression = '';
    const positiveMatch = content.match(/On one end of the spectrum[^.]+is the energy for\s*(.+?)\.?(?:\n|It)/i);
    const negativeMatch = content.match(/On the other end of the spectrum[^.]+is the energy for\s*(.+?)\.?(?:\n|It)/i);
    if (positiveMatch) highExpression = positiveMatch[1].trim();
    if (negativeMatch) lowExpression = negativeMatch[1].trim();

    const gate: HDGateOutput = {
      id: `gate-${gateNum}`,
      type: 'hd-gate',
      name: `Gate ${gateNum}: ${archetypeName}`,
      symbol: `${gateNum}`,
      gateNumber: gateNum,
      iChingHexagram: gateNum,
      iChingName: officialName || archetypeName,
      centerId,
      channelGateId,
      tropicalSignId: normalizeSignName(tropicalSign),
      degreeStart: zodiacInfo.start,
      degreeEnd: zodiacInfo.end,
      geneKeyId: `gk-${gateNum}`,
      keywords,
      coreTheme: coreTheme || `The energy of Gate ${gateNum}`,
      hdDefinition: hdDefinition || '',
      highExpression: highExpression || `Living in alignment with Gate ${gateNum} energy`,
      lowExpression: lowExpression || `Shadow patterns of Gate ${gateNum}`,
      affirmations: [],
      description: `Human Design Gate ${gateNum} connects to Gene Key ${gateNum}. Shadow: ${geneKeysShadow}, Gift: ${geneKeysGift}, Siddhi: ${geneKeysSiddhi}.`,
    };

    gates.push(gate);
  }

  return gates.sort((a, b) => a.gateNumber - b.gateNumber);
}

// ============================================
// Gene Keys Parsing
// ============================================

function parseGeneKeysFile(filePath: string): GeneKeyOutput[] {
  if (!fs.existsSync(filePath)) {
    console.error(`Gene Keys file not found: ${filePath}`);
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const keys: GeneKeyOutput[] = [];

  // Split into individual Gene Key sections
  const sections = content.split(/(?=^- Gene Key \d+)/m);

  for (const section of sections) {
    if (!section.trim()) continue;

    // Extract Gene Key number
    const numMatch = section.match(/Gene Key (\d+)/);
    if (!numMatch) continue;

    const keyNum = parseInt(numMatch[1], 10);

    // Extract Shadow
    const shadowNameMatch = section.match(/- Shadow::\s*\n\s*- ([A-Za-z]+)\s*#shadow/);
    const shadowName = shadowNameMatch ? shadowNameMatch[1] : '';
    const shadowKeyExpr = section.match(/Shadow[\s\S]*?Key Expression::\s*(.+?)(?:\n|$)/)?.[1] || '';
    const shadowRepressive = section.match(/Repressive Nature::\s*(.+?)(?:\n|$)/)?.[1] || '';
    const shadowReactive = section.match(/Reactive Nature::\s*(.+?)(?:\n|$)/)?.[1] || '';

    // Extract Gift
    const giftNameMatch = section.match(/- Gift::\s*\n\s*- ([A-Za-z]+)\s*#gift/);
    const giftName = giftNameMatch ? giftNameMatch[1] : '';
    const giftKeyExpr = section.match(/Gift[\s\S]*?Key Expression::\s*(.+?)(?:\n|$)/)?.[1] || '';

    // Extract Siddhi
    const siddhiNameMatch = section.match(/- Siddhi::\s*\n\s*- ([A-Za-z]+)\s*#siddhi/);
    const siddhiName = siddhiNameMatch ? siddhiNameMatch[1] : '';
    const siddhiKeyExpr = section.match(/Siddhi[\s\S]*?Key Expression::\s*(.+?)(?:\n|$)/)?.[1] || '';

    // Extract other fields
    const programmingPartnerMatch = section.match(/Programming Partner::\s*\[\[Gene Key (\d+)/);
    const programmingPartner = programmingPartnerMatch ? parseInt(programmingPartnerMatch[1], 10) : (keyNum <= 32 ? keyNum + 32 : keyNum - 32);

    const codonRingMatch = section.match(/Codon Ring::\s*\[\[([^\]#]+)/);
    const codonRing = codonRingMatch ? normalizeCodonRing(codonRingMatch[1]) : 'unknown';

    const aminoAcidMatch = section.match(/Amino Acid::\s*\[\[([^\]#]+)/);
    const aminoAcid = aminoAcidMatch ? normalizeAminoAcid(aminoAcidMatch[1]) : undefined;

    const physiologyMatch = section.match(/Physiology::\s*\[\[([^\]#]+)/);
    const physiology = physiologyMatch ? physiologyMatch[1].trim() : '';

    const urlMatch = section.match(/URL::\s*(https?:\/\/[^\s\n]+)/);
    const url = urlMatch ? urlMatch[1] : undefined;

    // Get zodiac info from gate mapping
    const zodiacInfo = GATE_ZODIAC_MAP[keyNum] || { sign: 'unknown', start: 0, end: 0 };

    const geneKey: GeneKeyOutput = {
      id: `gk-${keyNum}`,
      type: 'gene-key',
      name: `Gene Key ${keyNum}: ${siddhiName || `Key ${keyNum}`}`,
      symbol: `${keyNum}`,
      keyNumber: keyNum,
      shadow: {
        name: shadowName,
        keyExpression: shadowKeyExpr,
        description: `The shadow of ${shadowName} represents the fear-based frequency of Gene Key ${keyNum}.`,
        repressiveNature: shadowRepressive,
        reactiveNature: shadowReactive,
      },
      gift: {
        name: giftName,
        keyExpression: giftKeyExpr,
        description: `The gift of ${giftName} represents the love-based frequency of Gene Key ${keyNum}.`,
      },
      siddhi: {
        name: siddhiName,
        keyExpression: siddhiKeyExpr,
        description: `The siddhi of ${siddhiName} represents the unity frequency of Gene Key ${keyNum}.`,
      },
      programmingPartnerId: `gk-${programmingPartner}`,
      codonRingId: codonRing,
      aminoAcidId: aminoAcid,
      physiology,
      hdGateId: `gate-${keyNum}`,
      iChingHexagram: keyNum,
      tropicalSignId: zodiacInfo.sign,
      degreeStart: zodiacInfo.start,
      degreeEnd: zodiacInfo.end,
      url,
      description: `Gene Key ${keyNum}: ${shadowName} → ${giftName} → ${siddhiName}. This key invites contemplation on the transformation from ${shadowName} to ${siddhiName} through the gift of ${giftName}.`,
    };

    keys.push(geneKey);
  }

  return keys;
}

function parseAllGeneKeys(): GeneKeyOutput[] {
  const geneKeysDir = path.join(SOURCE_DIR, 'gene-keys');
  const files = [
    'gene-keys-1-5.txt',
    'gene-keys-6-15.txt',
    'gene-keys-16-25.txt',
    'gene-keys-26-35.txt',
    'gene-keys-36-45.txt',
    'gene-keys-46-64.txt',
    'gene-keys-51-53-61-63.txt', // Additional file with missing keys
  ];

  const allKeys: GeneKeyOutput[] = [];

  for (const file of files) {
    const filePath = path.join(geneKeysDir, file);
    if (fs.existsSync(filePath)) {
      const keys = parseGeneKeysFile(filePath);
      allKeys.push(...keys);
    }
  }

  // Sort by key number
  return allKeys.sort((a, b) => a.keyNumber - b.keyNumber);
}

// ============================================
// Codon Rings Generation
// ============================================

function generateCodonRings(geneKeys: GeneKeyOutput[]): CodonRingOutput[] {
  // Group Gene Keys by codon ring
  const ringGroups: Record<string, GeneKeyOutput[]> = {};

  for (const gk of geneKeys) {
    if (!ringGroups[gk.codonRingId]) {
      ringGroups[gk.codonRingId] = [];
    }
    ringGroups[gk.codonRingId].push(gk);
  }

  // Codon ring themes
  const ringThemes: Record<string, { theme: string; purpose: string }> = {
    'ring-of-fire': { theme: 'Creative Power', purpose: 'To ignite the creative fire of consciousness' },
    'ring-of-water': { theme: 'Receptive Flow', purpose: 'To embody the feminine principle of receptivity' },
    'ring-of-life-and-death': { theme: 'Transformation', purpose: 'To embrace the cycles of change and renewal' },
    'ring-of-union': { theme: 'Coming Together', purpose: 'To create unity and bonding between beings' },
    'ring-of-light': { theme: 'Illumination', purpose: 'To bring light and clarity to consciousness' },
    'ring-of-alchemy': { theme: 'Transmutation', purpose: 'To transform base experiences into wisdom' },
    'ring-of-purification': { theme: 'Cleansing', purpose: 'To purify and refine consciousness' },
    'ring-of-humanity': { theme: 'Human Experience', purpose: 'To embrace the full spectrum of human emotion' },
    'ring-of-secrets': { theme: 'Hidden Wisdom', purpose: 'To uncover and share deep truths' },
    'ring-of-seeking': { theme: 'The Quest', purpose: 'To seek and find meaning and resources' },
    'ring-of-prosperity': { theme: 'Abundance', purpose: 'To manifest sustainable prosperity' },
    'ring-of-matter': { theme: 'Physical Reality', purpose: 'To ground spirit into material form' },
    'ring-of-divinity': { theme: 'Sacred Connection', purpose: 'To remember our divine origin' },
    'ring-of-trials': { theme: 'Testing', purpose: 'To grow through challenges and tests' },
    'ring-of-miracles': { theme: 'Wonder', purpose: 'To recognize and manifest the miraculous' },
    'ring-of-gaia': { theme: 'Earth Connection', purpose: 'To attune to the wisdom of the planet' },
    'ring-of-origin': { theme: 'Source', purpose: 'To return to the source of all being' },
    'ring-of-illusion': { theme: 'Maya', purpose: 'To see through the veil of illusion' },
    'ring-of-whirlwind': { theme: 'Intensity', purpose: 'To ride the currents of intense energy' },
    'ring-of-destiny': { theme: 'Life Purpose', purpose: 'To fulfill ones unique destiny' },
    'ring-of-no-return': { theme: 'Transcendence', purpose: 'To transcend all limitation' },
  };

  const rings: CodonRingOutput[] = [];

  for (const [ringId, keys] of Object.entries(ringGroups)) {
    if (ringId === 'unknown') continue;

    const themeInfo = ringThemes[ringId] || { theme: 'Unknown', purpose: 'Unknown purpose' };
    const displayName = ringId
      .replace('ring-of-', 'Ring of ')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

    rings.push({
      id: ringId,
      type: 'codon-ring',
      name: displayName,
      symbol: '⬡',
      geneKeyIds: keys.map(k => k.id).sort((a, b) => {
        const numA = parseInt(a.replace('gk-', ''));
        const numB = parseInt(b.replace('gk-', ''));
        return numA - numB;
      }),
      theme: themeInfo.theme,
      collectivePurpose: themeInfo.purpose,
      description: `The ${displayName} contains Gene Keys ${keys.map(k => k.keyNumber).sort((a, b) => a - b).join(', ')}. Theme: ${themeInfo.theme}.`,
    });
  }

  return rings.sort((a, b) => a.name.localeCompare(b.name));
}

// ============================================
// HD Centers Generation
// ============================================

function generateHDCenters(): object[] {
  return [
    {
      id: 'head-center',
      type: 'hd-center',
      name: 'Head Center',
      symbol: '△',
      centerType: 'Pressure',
      biologicalCorrelate: 'Pineal Gland',
      definedMeaning: 'Consistent access to inspiration and mental pressure to think',
      undefinedMeaning: 'Wisdom about what questions are worth pursuing',
      gateIds: ['gate-64', 'gate-61', 'gate-63'],
      colorScheme: 'yellow',
      description: 'The Head Center is a pressure center that creates mental pressure to understand and make sense of life.',
    },
    {
      id: 'ajna-center',
      type: 'hd-center',
      name: 'Ajna Center',
      symbol: '△',
      centerType: 'Awareness',
      biologicalCorrelate: 'Pituitary Gland',
      definedMeaning: 'Consistent way of conceptualizing and processing information',
      undefinedMeaning: 'Wisdom about different ways of thinking and mental flexibility',
      gateIds: ['gate-47', 'gate-24', 'gate-4', 'gate-17', 'gate-43', 'gate-11'],
      colorScheme: 'green',
      description: 'The Ajna Center is the center of conceptualization, processing, and mental awareness.',
    },
    {
      id: 'throat-center',
      type: 'hd-center',
      name: 'Throat Center',
      symbol: '□',
      centerType: 'Communication',
      biologicalCorrelate: 'Thyroid and Parathyroid',
      definedMeaning: 'Consistent way of expressing and manifesting',
      undefinedMeaning: 'Wisdom about when and how to speak',
      gateIds: ['gate-62', 'gate-23', 'gate-56', 'gate-35', 'gate-12', 'gate-45', 'gate-33', 'gate-8', 'gate-31', 'gate-20', 'gate-16'],
      colorScheme: 'brown',
      description: 'The Throat Center is the center of communication, expression, and manifestation.',
    },
    {
      id: 'g-center',
      type: 'hd-center',
      name: 'G Center',
      symbol: '◇',
      centerType: 'Identity',
      biologicalCorrelate: 'Liver and Blood',
      definedMeaning: 'Consistent sense of identity, direction, and love',
      undefinedMeaning: 'Wisdom about identity and direction, able to sample many paths',
      gateIds: ['gate-1', 'gate-2', 'gate-7', 'gate-10', 'gate-13', 'gate-15', 'gate-25', 'gate-46'],
      colorScheme: 'amber',
      description: 'The G Center is the center of identity, love, and direction in life.',
    },
    {
      id: 'heart-center',
      type: 'hd-center',
      name: 'Heart Center',
      symbol: '△',
      centerType: 'Motor',
      biologicalCorrelate: 'Heart, Stomach, Gallbladder, Thymus',
      definedMeaning: 'Consistent access to willpower and self-worth',
      undefinedMeaning: 'Wisdom about what is truly worth commitment',
      gateIds: ['gate-21', 'gate-51', 'gate-26', 'gate-40'],
      colorScheme: 'red',
      description: 'The Heart Center is a motor center associated with willpower, ego, and self-worth.',
    },
    {
      id: 'sacral-center',
      type: 'hd-center',
      name: 'Sacral Center',
      symbol: '□',
      centerType: 'Motor',
      biologicalCorrelate: 'Ovaries and Testes',
      definedMeaning: 'Consistent access to life force, work energy, and sexuality',
      undefinedMeaning: 'Wisdom about when enough is enough',
      gateIds: ['gate-5', 'gate-14', 'gate-29', 'gate-59', 'gate-9', 'gate-3', 'gate-42', 'gate-27', 'gate-34'],
      colorScheme: 'orange',
      description: 'The Sacral Center is the powerful motor that provides life force energy for Generators.',
    },
    {
      id: 'solar-plexus-center',
      type: 'hd-center',
      name: 'Solar Plexus Center',
      symbol: '△',
      centerType: 'Motor',
      biologicalCorrelate: 'Lungs, Kidneys, Pancreas, Nervous System',
      definedMeaning: 'Consistent emotional wave; clarity comes over time',
      undefinedMeaning: 'Wisdom about emotions; can sense emotional field of others',
      gateIds: ['gate-6', 'gate-37', 'gate-22', 'gate-36', 'gate-30', 'gate-55', 'gate-49'],
      colorScheme: 'gold',
      description: 'The Solar Plexus is both a motor and awareness center, governing emotions and feelings.',
    },
    {
      id: 'spleen-center',
      type: 'hd-center',
      name: 'Spleen Center',
      symbol: '△',
      centerType: 'Awareness',
      biologicalCorrelate: 'Spleen, Lymphatic System, T-cells',
      definedMeaning: 'Consistent access to intuition and survival instincts',
      undefinedMeaning: 'Wisdom about health and safety; can sense others fears',
      gateIds: ['gate-48', 'gate-57', 'gate-44', 'gate-50', 'gate-32', 'gate-28', 'gate-18'],
      colorScheme: 'brown',
      description: 'The Spleen Center is the oldest awareness center, governing intuition, health, and survival.',
    },
    {
      id: 'root-center',
      type: 'hd-center',
      name: 'Root Center',
      symbol: '□',
      centerType: 'Pressure',
      biologicalCorrelate: 'Adrenal Glands',
      definedMeaning: 'Consistent way of handling stress and pressure',
      undefinedMeaning: 'Wisdom about pressure; can amplify stress from environment',
      gateIds: ['gate-58', 'gate-38', 'gate-54', 'gate-53', 'gate-60', 'gate-52', 'gate-19', 'gate-39', 'gate-41'],
      colorScheme: 'brown',
      description: 'The Root Center is a motor and pressure center, providing adrenaline fuel and drive.',
    },
  ];
}

// ============================================
// Relationships Generation
// ============================================

interface RelationshipOutput {
  id: string;
  sourceId: string;
  targetId: string;
  relationshipType: string;
}

function generateRelationships(gates: HDGateOutput[], geneKeys: GeneKeyOutput[]): RelationshipOutput[] {
  const relationships: RelationshipOutput[] = [];

  // Gate corresponds to Gene Key
  for (const gate of gates) {
    relationships.push({
      id: `${gate.id}-corresponds-${gate.geneKeyId}`,
      sourceId: gate.id,
      targetId: gate.geneKeyId,
      relationshipType: 'GATE_CORRESPONDS_TO_GK',
    });

    // Gate in center
    relationships.push({
      id: `${gate.id}-in-${gate.centerId}`,
      sourceId: gate.id,
      targetId: gate.centerId,
      relationshipType: 'GATE_IN_CENTER',
    });

    // Gate in sign
    if (gate.tropicalSignId && gate.tropicalSignId !== 'unknown') {
      relationships.push({
        id: `${gate.id}-in-${gate.tropicalSignId}`,
        sourceId: gate.id,
        targetId: gate.tropicalSignId,
        relationshipType: 'GATE_IN_SIGN',
      });
    }

    // Gate connects to gate (channel)
    if (gate.channelGateId) {
      relationships.push({
        id: `${gate.id}-connects-${gate.channelGateId}`,
        sourceId: gate.id,
        targetId: gate.channelGateId,
        relationshipType: 'GATE_CONNECTS_TO',
      });
    }
  }

  // Gene Key relationships
  for (const gk of geneKeys) {
    // Programming partner
    relationships.push({
      id: `${gk.id}-partner-${gk.programmingPartnerId}`,
      sourceId: gk.id,
      targetId: gk.programmingPartnerId,
      relationshipType: 'GK_PROGRAMMING_PARTNER',
    });

    // In codon ring
    if (gk.codonRingId && gk.codonRingId !== 'unknown') {
      relationships.push({
        id: `${gk.id}-in-${gk.codonRingId}`,
        sourceId: gk.id,
        targetId: gk.codonRingId,
        relationshipType: 'GK_IN_CODON_RING',
      });
    }

    // Encodes amino acid
    if (gk.aminoAcidId) {
      relationships.push({
        id: `${gk.id}-encodes-${gk.aminoAcidId}`,
        sourceId: gk.id,
        targetId: gk.aminoAcidId,
        relationshipType: 'GK_ENCODES_AMINO_ACID',
      });
    }

    // Corresponds to gate
    relationships.push({
      id: `${gk.id}-corresponds-${gk.hdGateId}`,
      sourceId: gk.id,
      targetId: gk.hdGateId,
      relationshipType: 'GK_CORRESPONDS_TO_GATE',
    });
  }

  return relationships;
}

// ============================================
// Main Execution
// ============================================

function main() {
  console.log('🌟 Transforming Wisdom Data...\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Parse HD Gates
  console.log('📖 Parsing Human Design Gates...');
  const hdGates = parseHDGates();
  console.log(`   Found ${hdGates.length} gates`);

  // Parse Gene Keys
  console.log('🧬 Parsing Gene Keys...');
  const geneKeys = parseAllGeneKeys();
  console.log(`   Found ${geneKeys.length} Gene Keys`);

  // Generate Codon Rings
  console.log('⬡ Generating Codon Rings...');
  const codonRings = generateCodonRings(geneKeys);
  console.log(`   Generated ${codonRings.length} Codon Rings`);

  // Generate HD Centers
  console.log('◇ Generating HD Centers...');
  const hdCenters = generateHDCenters();
  console.log(`   Generated ${hdCenters.length} Centers`);

  // Generate Relationships
  console.log('🔗 Generating Relationships...');
  const relationships = generateRelationships(hdGates, geneKeys);
  console.log(`   Generated ${relationships.length} relationships`);

  // Write output files
  console.log('\n📝 Writing output files...');

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'hd-gates.json'),
    JSON.stringify(hdGates, null, 2)
  );
  console.log('   ✓ hd-gates.json');

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'hd-centers.json'),
    JSON.stringify(hdCenters, null, 2)
  );
  console.log('   ✓ hd-centers.json');

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'gene-keys.json'),
    JSON.stringify(geneKeys, null, 2)
  );
  console.log('   ✓ gene-keys.json');

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'codon-rings.json'),
    JSON.stringify(codonRings, null, 2)
  );
  console.log('   ✓ codon-rings.json');

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'hd-gk-relationships.json'),
    JSON.stringify(relationships, null, 2)
  );
  console.log('   ✓ hd-gk-relationships.json');

  console.log('\n✅ Transformation complete!');
  console.log(`\nSummary:`);
  console.log(`  - ${hdGates.length} HD Gates`);
  console.log(`  - ${hdCenters.length} HD Centers`);
  console.log(`  - ${geneKeys.length} Gene Keys`);
  console.log(`  - ${codonRings.length} Codon Rings`);
  console.log(`  - ${relationships.length} Relationships`);
}

main();
