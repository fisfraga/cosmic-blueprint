// ============================================
// COSMIC COPILOT — Data Loading Utilities
// ============================================

import type {
  Planet,
  ZodiacSign,
  House,
  Element,
  Aspect,
  AspectConfiguration,
  Relationship,
  AstroPoint,
  UniversalEntity,
  FixedStar,
  // Human Design & Gene Keys
  HDGate,
  HDChannel,
  HDCenter,
  HDCircuitType,
  HDTypeEntity,
  HDStrategyEntity,
  HDAuthorityEntity,
  HDLineEntity,
  HDProfileEntity,
  HDVariableEntity,
  HDVariableCategory,
  GeneKey,
  GKSphereEntity,
  GKSequence,
  GKLineEntity,
  GKSequenceEntity,
  CodonRing,
  AminoAcid,
  Trigram,
  // Unified entities
  Line,
  // Wisdom Traditions
  NumerologyNumber,
  Chakra,
  HermeticPrinciple,
} from '../types';

// Raw JSON imports - Astrology
import planetsData from './universal/planets.json';
import signsData from './universal/signs.json';
import housesData from './universal/houses.json';
import elementsData from './universal/elements.json';
import aspectsData from './universal/aspects.json';
import configurationsData from './universal/configurations.json';
import relationshipsData from './universal/relationships.json';
import pointsData from './universal/points.json';
import fixedStarsData from './universal/fixed-stars.json';
import dignitiesData from './universal/dignities.json';
import decansData from './universal/decans.json';

// Raw JSON imports - Human Design & Gene Keys
import hdGatesData from './universal/hd-gates.json';
import hdChannelsData from './universal/hd-channels.json';
import hdCentersData from './universal/hd-centers.json';
import hdTypesData from './universal/hd-types.json';
import hdStrategiesData from './universal/hd-strategies.json';
import hdAuthoritiesData from './universal/hd-authorities.json';
import hdLinesData from './universal/hd-lines.json';
import hdProfilesData from './universal/hd-profiles.json';
import hdVariablesData from './universal/hd-variables.json';
import geneKeysData from './universal/gene-keys.json';
import gkSpheresData from './universal/gk-spheres.json';
import gkLinesData from './universal/gk-lines.json';
import gkSequencesData from './universal/gk-sequences.json';
import codonRingsData from './universal/codon-rings.json';
import aminoAcidsData from './universal/amino-acids.json';
import trigramsData from './universal/trigrams.json';
import hdGkRelationshipsData from './universal/hd-gk-relationships.json';

// Unified entities (combining GK + HD perspectives)
import linesData from './universal/lines.json';

// Wisdom Traditions (cross-system bridge entities)
import numerologyData from './universal/numerology.json';
import chakrasData from './universal/chakras.json';
import hermeticPrinciplesData from './universal/hermetic-principles.json';

// ------------------------------------
// Type-Safe Data Maps
// ------------------------------------

export const planets = new Map<string, Planet>(
  (planetsData as Planet[]).map((p) => [p.id, p])
);

export const signs = new Map<string, ZodiacSign>(
  (signsData as ZodiacSign[]).map((s) => [s.id, s])
);

export const houses = new Map<string, House>(
  (housesData as House[]).map((h) => [h.id, h])
);

export const elements = new Map<string, Element>(
  (elementsData as Element[]).map((e) => [e.id, e])
);

export const aspects = new Map<string, Aspect>(
  (aspectsData as Aspect[]).map((a) => [a.id, a])
);

export const configurations = new Map<string, AspectConfiguration>(
  (configurationsData as AspectConfiguration[]).map((c) => [c.id, c])
);

export const points = new Map<string, AstroPoint>(
  (pointsData as AstroPoint[]).map((p) => [p.id, p])
);

// ------------------------------------
// Human Design & Gene Keys Maps
// ------------------------------------

export const hdGates = new Map<string, HDGate>(
  (hdGatesData as HDGate[]).map((g) => [g.id, g])
);

export const hdChannels = new Map<string, HDChannel>(
  (hdChannelsData as HDChannel[]).map((c) => [c.id, c])
);

export const hdCenters = new Map<string, HDCenter>(
  (hdCentersData as HDCenter[]).map((c) => [c.id, c])
);

export const hdTypes = new Map<string, HDTypeEntity>(
  (hdTypesData as HDTypeEntity[]).map((t) => [t.id, t])
);

export const hdStrategies = new Map<string, HDStrategyEntity>(
  (hdStrategiesData as HDStrategyEntity[]).map((s) => [s.id, s])
);

export const hdAuthorities = new Map<string, HDAuthorityEntity>(
  (hdAuthoritiesData as HDAuthorityEntity[]).map((a) => [a.id, a])
);

export const hdLines = new Map<string, HDLineEntity>(
  (hdLinesData as HDLineEntity[]).map((l) => [l.id, l])
);

export const hdProfiles = new Map<string, HDProfileEntity>(
  (hdProfilesData as HDProfileEntity[]).map((p) => [p.id, p])
);

export const hdVariables = new Map<string, HDVariableEntity>(
  (hdVariablesData as HDVariableEntity[]).map((v) => [v.id, v])
);

export const geneKeys = new Map<string, GeneKey>(
  (geneKeysData as GeneKey[]).map((k) => [k.id, k])
);

export const gkSpheres = new Map<string, GKSphereEntity>(
  (gkSpheresData as GKSphereEntity[]).map((s) => [s.id, s])
);

export const codonRings = new Map<string, CodonRing>(
  (codonRingsData as CodonRing[]).map((r) => [r.id, r])
);

export const gkLines = new Map<string, GKLineEntity>(
  (gkLinesData as GKLineEntity[]).map((l) => [l.id, l])
);

export const gkSequences = new Map<string, GKSequenceEntity>(
  (gkSequencesData as GKSequenceEntity[]).map((s) => [s.id, s])
);

export const aminoAcids = new Map<string, AminoAcid>(
  (aminoAcidsData as AminoAcid[]).map((a) => [a.id, a])
);

export const trigrams = new Map<string, Trigram>(
  (trigramsData as Trigram[]).map((t) => [t.id, t])
);

// ------------------------------------
// Unified Entity Maps
// ------------------------------------

export const lines = new Map<string, Line>(
  (linesData as Line[]).map((l) => [l.id, l])
);

// ------------------------------------
// Wisdom Tradition Maps
// ------------------------------------

export const numerologyNumbers = new Map<string, NumerologyNumber>(
  (numerologyData as NumerologyNumber[]).map((n) => [n.id, n])
);

export const chakras = new Map<string, Chakra>(
  (chakrasData as Chakra[]).map((c) => [c.id, c])
);

export const hermeticPrinciples = new Map<string, HermeticPrinciple>(
  (hermeticPrinciplesData as HermeticPrinciple[]).map((h) => [h.id, h])
);

export const hdGkRelationships = hdGkRelationshipsData as Relationship[];

export const relationships = relationshipsData as Relationship[];

export const fixedStars = new Map<string, FixedStar>(
  (fixedStarsData as FixedStar[]).map((s) => [s.id, s])
);

// Dignity type for the matrix
export interface DignityEntry {
  id: string;
  planetId: string;
  signId: string;
  dignityType: 'Domicile' | 'Exaltation' | 'Detriment' | 'Fall';
  description: string;
}

export const dignities = dignitiesData as DignityEntry[];

// Decan type for the decan dive
export interface DecanEntry {
  id: string;
  signId: string;
  decanNumber: 1 | 2 | 3;
  degrees: string;
  rulerPlanetId: string;
  subrulerSignId: string;
  keyword: string;
  description: string;
  giftExpression: string;
  shadowExpression: string;
}

export const decans = decansData as DecanEntry[];

/**
 * Get dignity for a planet in a specific sign
 */
export function getDignity(planetId: string, signId: string): DignityEntry | undefined {
  return dignities.find(d => d.planetId === planetId && d.signId === signId);
}

/**
 * Get all decans for a sign
 */
export function getSignDecans(signId: string): DecanEntry[] {
  return decans.filter(d => d.signId === signId).sort((a, b) => a.decanNumber - b.decanNumber);
}

/**
 * Get a specific decan
 */
export function getDecan(signId: string, decanNumber: 1 | 2 | 3): DecanEntry | undefined {
  return decans.find(d => d.signId === signId && d.decanNumber === decanNumber);
}

/**
 * Get decan for a specific degree in a sign
 */
export function getDecanByDegree(signId: string, degree: number): DecanEntry | undefined {
  const decanNumber = degree < 10 ? 1 : degree < 20 ? 2 : 3;
  return getDecan(signId, decanNumber as 1 | 2 | 3);
}

/**
 * Get all dignities for a planet
 */
export function getPlanetDignities(planetId: string): DignityEntry[] {
  return dignities.filter(d => d.planetId === planetId);
}

/**
 * Get all dignities in a sign
 */
export function getSignDignities(signId: string): DignityEntry[] {
  return dignities.filter(d => d.signId === signId);
}

// ------------------------------------
// Entity Retrieval Utilities
// ------------------------------------

/**
 * Get any entity by its ID across all entity types
 */
export function getEntityById(id: string): UniversalEntity | undefined {
  return (
    planets.get(id) ||
    signs.get(id) ||
    houses.get(id) ||
    elements.get(id) ||
    aspects.get(id) ||
    configurations.get(id) ||
    points.get(id) ||
    fixedStars.get(id) ||
    // Human Design & Gene Keys
    hdGates.get(id) ||
    hdChannels.get(id) ||
    hdCenters.get(id) ||
    hdTypes.get(id) ||
    hdStrategies.get(id) ||
    hdAuthorities.get(id) ||
    hdLines.get(id) ||
    hdProfiles.get(id) ||
    hdVariables.get(id) ||
    geneKeys.get(id) ||
    gkSpheres.get(id) ||
    gkLines.get(id) ||
    gkSequences.get(id) ||
    codonRings.get(id) ||
    aminoAcids.get(id) ||
    trigrams.get(id) ||
    // Unified entities
    lines.get(id) ||
    // Wisdom Traditions
    numerologyNumbers.get(id) ||
    chakras.get(id) ||
    hermeticPrinciples.get(id) ||
    undefined
  );
}

/**
 * Get all relationships for a given entity (as source or target)
 */
export function getRelationshipsFor(entityId: string): Relationship[] {
  return relationships.filter(
    (r) => r.sourceId === entityId || r.targetId === entityId
  );
}

/**
 * Get relationships where the entity is the source
 */
export function getOutgoingRelationships(entityId: string): Relationship[] {
  return relationships.filter((r) => r.sourceId === entityId);
}

/**
 * Get relationships where the entity is the target
 */
export function getIncomingRelationships(entityId: string): Relationship[] {
  return relationships.filter((r) => r.targetId === entityId);
}

// ------------------------------------
// Planet Utilities
// ------------------------------------

/**
 * Get planets sorted by importance (4 = highest, 1 = lowest)
 */
export function getPlanetsByImportance(): Planet[] {
  return Array.from(planets.values()).sort(
    (a, b) => b.planetImportance - a.planetImportance
  );
}

/**
 * Get the traditional planets (Sun through Saturn)
 */
export function getTraditionalPlanets(): Planet[] {
  return Array.from(planets.values()).filter(
    (p) => p.planetType === 'Traditional Planet'
  );
}

/**
 * Get the modern planets (Uranus, Neptune, Pluto)
 */
export function getModernPlanets(): Planet[] {
  return Array.from(planets.values()).filter(
    (p) => p.planetType === 'Modern Planet'
  );
}

/**
 * Get the planet that rules a given sign
 */
export function getRulingPlanet(signId: string): Planet | undefined {
  const sign = signs.get(signId);
  if (!sign || sign.rulingPlanetIds.length === 0) return undefined;
  return planets.get(sign.rulingPlanetIds[0]);
}

// ------------------------------------
// Sign Utilities
// ------------------------------------

/**
 * Get signs sorted by zodiac order (1-12)
 */
export function getSignsInOrder(): ZodiacSign[] {
  return Array.from(signs.values()).sort(
    (a, b) => a.orderInZodiac - b.orderInZodiac
  );
}

/**
 * Get signs by element
 */
export function getSignsByElement(elementId: string): ZodiacSign[] {
  return Array.from(signs.values())
    .filter((s) => s.elementId === elementId)
    .sort((a, b) => a.orderInZodiac - b.orderInZodiac);
}

/**
 * Get signs by modality
 */
export function getSignsByModality(modality: ZodiacSign['signModality']): ZodiacSign[] {
  return Array.from(signs.values())
    .filter((s) => s.signModality === modality)
    .sort((a, b) => a.orderInZodiac - b.orderInZodiac);
}

/**
 * Get the opposite sign
 */
export function getOppositeSign(signId: string): ZodiacSign | undefined {
  const sign = signs.get(signId);
  if (!sign) return undefined;
  return signs.get(sign.opposingSignId);
}

// ------------------------------------
// House Utilities
// ------------------------------------

/**
 * Get houses sorted by number (1-12)
 */
export function getHousesInOrder(): House[] {
  return Array.from(houses.values()).sort(
    (a, b) => a.houseNumber - b.houseNumber
  );
}

/**
 * Get houses by type (Angular, Succedent, Cadent)
 */
export function getHousesByType(houseType: House['houseType']): House[] {
  return Array.from(houses.values())
    .filter((h) => h.houseType === houseType)
    .sort((a, b) => a.houseNumber - b.houseNumber);
}

/**
 * Get the natural sign ruler of a house
 */
export function getHouseSign(houseId: string): ZodiacSign | undefined {
  const house = houses.get(houseId);
  if (!house) return undefined;
  return signs.get(house.rulingSignId);
}

// ------------------------------------
// Element Utilities
// ------------------------------------

/**
 * Get classical elements (Fire, Earth, Air, Water)
 */
export function getClassicalElements(): Element[] {
  return Array.from(elements.values()).filter(
    (e) => e.elementCategory === 'Classical'
  );
}

/**
 * Get alchemical elements (Sulphur, Mercury, Salt)
 */
export function getAlchemicalElements(): Element[] {
  return Array.from(elements.values()).filter(
    (e) => e.elementCategory === 'Alchemical'
  );
}

/**
 * Get the element for a sign
 */
export function getSignElement(signId: string): Element | undefined {
  const sign = signs.get(signId);
  if (!sign) return undefined;
  return elements.get(sign.elementId);
}

// ------------------------------------
// Aspect Utilities
// ------------------------------------

/**
 * Get aspects by nature (Harmonious, Challenging, Neutral)
 */
export function getAspectsByNature(nature: Aspect['nature']): Aspect[] {
  return Array.from(aspects.values()).filter((a) => a.nature === nature);
}

/**
 * Get major aspects (Conjunction, Opposition, Trine, Square, Sextile)
 */
export function getMajorAspects(): Aspect[] {
  const majorAspectIds = ['conjunction', 'opposition', 'trine', 'square', 'sextile'];
  return Array.from(aspects.values()).filter((a) =>
    majorAspectIds.includes(a.id)
  );
}

// ------------------------------------
// Fixed Stars Utilities
// ------------------------------------

/**
 * Get all fixed stars sorted by ecliptic longitude (0–360°)
 */
export function getFixedStarsInOrder(): FixedStar[] {
  return Array.from(fixedStars.values()).sort(
    (a, b) => a.eclipticLongitude - b.eclipticLongitude
  );
}

/**
 * Get the 4 Royal Stars (Regulus, Aldebaran, Antares, Fomalhaut)
 */
export function getRoyalStars(): FixedStar[] {
  return Array.from(fixedStars.values()).filter((s) => s.isRoyalStar);
}

/**
 * Get all 15 Behenian fixed stars
 */
export function getBehenianStars(): FixedStar[] {
  return Array.from(fixedStars.values()).filter((s) => s.isBehenian);
}

/**
 * Get fixed stars by constellation name
 */
export function getFixedStarsByConstellation(constellation: string): FixedStar[] {
  const lower = constellation.toLowerCase();
  return Array.from(fixedStars.values()).filter(
    (s) => s.constellation.toLowerCase() === lower
  );
}

/**
 * Get fixed stars by planetary nature (e.g. 'Mars', 'Jupiter', 'Venus')
 */
export function getFixedStarsByNature(nature: string): FixedStar[] {
  return Array.from(fixedStars.values()).filter((s) =>
    s.nature.includes(nature)
  );
}

// ------------------------------------
// Statistics & Aggregations
// ------------------------------------

/**
 * Get counts of all entity types
 */
export function getEntityCounts(): Record<string, number> {
  return {
    planets: planets.size,
    signs: signs.size,
    houses: houses.size,
    elements: elements.size,
    aspects: aspects.size,
    configurations: configurations.size,
    points: points.size,
    fixedStars: fixedStars.size,
    relationships: relationships.length,
    // Human Design & Gene Keys
    hdGates: hdGates.size,
    hdChannels: hdChannels.size,
    hdCenters: hdCenters.size,
    hdTypes: hdTypes.size,
    hdStrategies: hdStrategies.size,
    hdAuthorities: hdAuthorities.size,
    hdLines: hdLines.size,
    hdProfiles: hdProfiles.size,
    hdVariables: hdVariables.size,
    geneKeys: geneKeys.size,
    gkSpheres: gkSpheres.size,
    gkLines: gkLines.size,
    gkSequences: gkSequences.size,
    codonRings: codonRings.size,
    aminoAcids: aminoAcids.size,
    trigrams: trigrams.size,
    hdGkRelationships: hdGkRelationships.length,
    // Unified entities
    lines: lines.size,
    // Wisdom Traditions
    numerologyNumbers: numerologyNumbers.size,
    chakras: chakras.size,
    hermeticPrinciples: hermeticPrinciples.size,
  };
}

/**
 * Get all entities as a flat array
 */
export function getAllEntities(): UniversalEntity[] {
  return [
    ...Array.from(planets.values()),
    ...Array.from(signs.values()),
    ...Array.from(houses.values()),
    ...Array.from(elements.values()),
    ...Array.from(aspects.values()),
    ...Array.from(configurations.values()),
    ...Array.from(points.values()),
    ...Array.from(fixedStars.values()),
    // Human Design & Gene Keys
    ...Array.from(hdGates.values()),
    ...Array.from(hdChannels.values()),
    ...Array.from(hdCenters.values()),
    ...Array.from(hdTypes.values()),
    ...Array.from(hdStrategies.values()),
    ...Array.from(hdAuthorities.values()),
    ...Array.from(hdLines.values()),
    ...Array.from(hdProfiles.values()),
    ...Array.from(hdVariables.values()),
    ...Array.from(geneKeys.values()),
    ...Array.from(gkSpheres.values()),
    ...Array.from(gkLines.values()),
    ...Array.from(gkSequences.values()),
    ...Array.from(codonRings.values()),
    ...Array.from(aminoAcids.values()),
    ...Array.from(trigrams.values()),
    // Unified entities
    ...Array.from(lines.values()),
    // Wisdom Traditions
    ...Array.from(numerologyNumbers.values()),
    ...Array.from(chakras.values()),
    ...Array.from(hermeticPrinciples.values()),
  ];
}

// ------------------------------------
// Human Design Utilities
// ------------------------------------

/**
 * Get all HD Gates sorted by gate number
 */
export function getGatesInOrder(): HDGate[] {
  return Array.from(hdGates.values()).sort(
    (a, b) => a.gateNumber - b.gateNumber
  );
}

/**
 * Get HD Gates by center
 */
export function getGatesByCenter(centerId: string): HDGate[] {
  return Array.from(hdGates.values())
    .filter((g) => g.centerId === centerId)
    .sort((a, b) => a.gateNumber - b.gateNumber);
}

/**
 * Get HD Gates by zodiac sign
 */
export function getGatesBySign(signId: string): HDGate[] {
  return Array.from(hdGates.values())
    .filter((g) => g.tropicalSignId === signId)
    .sort((a, b) => a.gateNumber - b.gateNumber);
}

/**
 * Get HD Gate by gate number
 */
export function getGateByNumber(gateNumber: number): HDGate | undefined {
  return Array.from(hdGates.values()).find((g) => g.gateNumber === gateNumber);
}

// Center order from north (top) to south (bottom) on the Body Graph
const CENTER_NORTH_TO_SOUTH_ORDER = [
  'head-center',
  'ajna-center',
  'throat-center',
  'g-center',
  'heart-center',
  'spleen-center',
  'solar-plexus-center',
  'sacral-center',
  'root-center',
];

/**
 * Get all HD Centers sorted from north to south (top to bottom on Body Graph)
 */
export function getCentersInOrder(): HDCenter[] {
  return CENTER_NORTH_TO_SOUTH_ORDER
    .map(id => hdCenters.get(id))
    .filter((c): c is HDCenter => c !== undefined);
}

// ------------------------------------
// HD Channel Utilities
// ------------------------------------

/**
 * Get all HD Channels sorted by channel number
 */
export function getChannelsInOrder(): HDChannel[] {
  return Array.from(hdChannels.values()).sort(
    (a, b) => a.channelNumber - b.channelNumber
  );
}

/**
 * Get HD Channels by circuit type
 */
export function getChannelsByCircuit(circuitType: HDCircuitType): HDChannel[] {
  return Array.from(hdChannels.values())
    .filter((c) => c.circuitType === circuitType)
    .sort((a, b) => a.channelNumber - b.channelNumber);
}

/**
 * Get the channel connecting two gates (by gate IDs)
 */
export function getChannelByGates(gate1Id: string, gate2Id: string): HDChannel | undefined {
  return Array.from(hdChannels.values()).find(
    (c) =>
      (c.gate1Id === gate1Id && c.gate2Id === gate2Id) ||
      (c.gate1Id === gate2Id && c.gate2Id === gate1Id)
  );
}

/**
 * Get the channel connecting two gates (by gate numbers)
 */
export function getChannelByGateNumbers(gate1: number, gate2: number): HDChannel | undefined {
  return Array.from(hdChannels.values()).find(
    (c) =>
      (c.gate1Number === gate1 && c.gate2Number === gate2) ||
      (c.gate1Number === gate2 && c.gate2Number === gate1)
  );
}

/**
 * Get all channels that include a specific gate
 */
export function getChannelsForGate(gateId: string): HDChannel[] {
  return Array.from(hdChannels.values())
    .filter((c) => c.gate1Id === gateId || c.gate2Id === gateId)
    .sort((a, b) => a.channelNumber - b.channelNumber);
}

/**
 * Get all channels connected to a specific center
 */
export function getChannelsForCenter(centerId: string): HDChannel[] {
  return Array.from(hdChannels.values())
    .filter((c) => c.center1Id === centerId || c.center2Id === centerId)
    .sort((a, b) => a.channelNumber - b.channelNumber);
}

/**
 * Get channels connecting two specific centers
 */
export function getChannelsBetweenCenters(center1Id: string, center2Id: string): HDChannel[] {
  return Array.from(hdChannels.values())
    .filter(
      (c) =>
        (c.center1Id === center1Id && c.center2Id === center2Id) ||
        (c.center1Id === center2Id && c.center2Id === center1Id)
    )
    .sort((a, b) => a.channelNumber - b.channelNumber);
}

// ------------------------------------
// Gene Keys Utilities
// ------------------------------------

/**
 * Get all Gene Keys sorted by key number
 */
export function getGeneKeysInOrder(): GeneKey[] {
  return Array.from(geneKeys.values()).sort(
    (a, b) => a.keyNumber - b.keyNumber
  );
}

/**
 * Get Gene Key by key number
 */
export function getGeneKeyByNumber(keyNumber: number): GeneKey | undefined {
  return Array.from(geneKeys.values()).find((k) => k.keyNumber === keyNumber);
}

/**
 * Get Gene Key corresponding to an HD Gate
 */
export function getGeneKeyByGate(gateId: string): GeneKey | undefined {
  const gate = hdGates.get(gateId);
  if (!gate) return undefined;
  return geneKeys.get(gate.geneKeyId);
}

/**
 * Get HD Gate corresponding to a Gene Key
 */
export function getGateByGeneKey(geneKeyId: string): HDGate | undefined {
  const geneKey = geneKeys.get(geneKeyId);
  if (!geneKey) return undefined;
  return hdGates.get(geneKey.hdGateId);
}

/**
 * Get programming partner Gene Key
 */
export function getProgrammingPartner(geneKeyId: string): GeneKey | undefined {
  const geneKey = geneKeys.get(geneKeyId);
  if (!geneKey) return undefined;
  return geneKeys.get(geneKey.programmingPartnerId);
}

/**
 * Get Gene Keys by zodiac sign
 */
export function getGeneKeysBySign(signId: string): GeneKey[] {
  return Array.from(geneKeys.values())
    .filter((k) => k.tropicalSignId === signId)
    .sort((a, b) => a.keyNumber - b.keyNumber);
}

/**
 * Get Gene Keys by codon ring
 */
export function getGeneKeysByCodonRing(codonRingId: string): GeneKey[] {
  return Array.from(geneKeys.values())
    .filter((k) => k.codonRingId === codonRingId)
    .sort((a, b) => a.keyNumber - b.keyNumber);
}

/**
 * Get all Codon Rings sorted by name
 */
export function getCodonRingsInOrder(): CodonRing[] {
  return Array.from(codonRings.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

// ------------------------------------
// Gene Keys Spheres Utilities
// ------------------------------------

/**
 * Get all GK Spheres
 */
export function getGKSpheres(): GKSphereEntity[] {
  return Array.from(gkSpheres.values());
}

/**
 * Get GK Sphere by ID
 */
export function getGKSphereById(sphereId: string): GKSphereEntity | undefined {
  return gkSpheres.get(sphereId);
}

/**
 * Get GK Spheres by sequence (Activation, Venus, Pearl)
 */
export function getGKSpheresBySequence(sequence: GKSequence): GKSphereEntity[] {
  return Array.from(gkSpheres.values())
    .filter((s) => s.sequence === sequence)
    .sort((a, b) => a.sequenceOrder - b.sequenceOrder);
}

/**
 * Get the partner sphere for a given sphere
 */
export function getPartnerSphere(sphereId: string): GKSphereEntity | undefined {
  const sphere = gkSpheres.get(sphereId);
  if (!sphere || !sphere.partnerSphere) return undefined;
  return gkSpheres.get(sphere.partnerSphere);
}

/**
 * Get HD Centers by center type
 */
export function getCentersByType(centerType: HDCenter['centerType']): HDCenter[] {
  return Array.from(hdCenters.values())
    .filter((c) => c.centerType === centerType)
    .sort((a, b) => a.name.localeCompare(b.name));
}

// ------------------------------------
// HD Types, Strategies & Authorities Utilities
// ------------------------------------

/**
 * Get all HD Types
 */
export function getHDTypes(): HDTypeEntity[] {
  return Array.from(hdTypes.values());
}

/**
 * Get HD Type by ID
 */
export function getHDTypeById(typeId: string): HDTypeEntity | undefined {
  return hdTypes.get(typeId);
}

/**
 * Get the strategy for an HD Type
 */
export function getStrategyForType(typeId: string): HDStrategyEntity | undefined {
  const hdType = hdTypes.get(typeId);
  if (!hdType) return undefined;
  return hdStrategies.get(hdType.strategyId);
}

/**
 * Get all HD Strategies
 */
export function getHDStrategies(): HDStrategyEntity[] {
  return Array.from(hdStrategies.values());
}

/**
 * Get HD Strategy by ID
 */
export function getHDStrategyById(strategyId: string): HDStrategyEntity | undefined {
  return hdStrategies.get(strategyId);
}

/**
 * Get HD Types for a given strategy
 */
export function getTypesForStrategy(strategyId: string): HDTypeEntity[] {
  const strategy = hdStrategies.get(strategyId);
  if (!strategy) return [];
  return strategy.hdTypeIds
    .map((id) => hdTypes.get(id))
    .filter((t): t is HDTypeEntity => t !== undefined);
}

/**
 * Get all HD Authorities
 */
export function getHDAuthorities(): HDAuthorityEntity[] {
  return Array.from(hdAuthorities.values());
}

/**
 * Get HD Authority by ID
 */
export function getHDAuthorityById(authorityId: string): HDAuthorityEntity | undefined {
  return hdAuthorities.get(authorityId);
}

/**
 * Get HD Authorities by center
 */
export function getAuthoritiesByCenter(centerId: string): HDAuthorityEntity[] {
  return Array.from(hdAuthorities.values())
    .filter((a) => a.centerId === centerId);
}

// ------------------------------------
// HD Lines & Profiles Utilities
// ------------------------------------

/**
 * Get all HD Lines sorted by line number
 */
export function getHDLines(): HDLineEntity[] {
  return Array.from(hdLines.values()).sort((a, b) => a.lineNumber - b.lineNumber);
}

/**
 * Get HD Line by ID
 */
export function getHDLineById(lineId: string): HDLineEntity | undefined {
  return hdLines.get(lineId);
}

/**
 * Get HD Line by line number (1-6)
 */
export function getHDLineByNumber(lineNumber: number): HDLineEntity | undefined {
  return Array.from(hdLines.values()).find((l) => l.lineNumber === lineNumber);
}

/**
 * Get all HD Profiles
 */
export function getHDProfiles(): HDProfileEntity[] {
  return Array.from(hdProfiles.values());
}

/**
 * Get HD Profile by ID
 */
export function getHDProfileById(profileId: string): HDProfileEntity | undefined {
  return hdProfiles.get(profileId);
}

/**
 * Get profiles that contain a specific line (in either position)
 */
export function getProfilesByLine(lineNumber: number): HDProfileEntity[] {
  return Array.from(hdProfiles.values()).filter(
    (p) => p.personalityLine === lineNumber || p.designLine === lineNumber
  );
}

/**
 * Get the two lines that make up a profile
 */
export function getProfileLines(profileId: string): { personality: HDLineEntity | undefined; design: HDLineEntity | undefined } {
  const profile = hdProfiles.get(profileId);
  if (!profile) return { personality: undefined, design: undefined };
  return {
    personality: hdLines.get(profile.personalityLineId),
    design: hdLines.get(profile.designLineId),
  };
}

// ------------------------------------
// HD Variables Utilities
// ------------------------------------

/**
 * Get all HD Variables
 */
export function getHDVariables(): HDVariableEntity[] {
  return Array.from(hdVariables.values());
}

/**
 * Get HD Variable by ID
 */
export function getHDVariableById(variableId: string): HDVariableEntity | undefined {
  return hdVariables.get(variableId);
}

/**
 * Get HD Variables by category (Determination, Cognition, Environment, Motivation)
 */
export function getHDVariablesByCategory(category: HDVariableCategory): HDVariableEntity[] {
  return Array.from(hdVariables.values())
    .filter((v) => v.category === category)
    .sort((a, b) => a.tone - b.tone || a.color - b.color);
}

/**
 * Get HD Variables by arrow direction (Left/Right)
 */
export function getHDVariablesByArrow(arrow: 'Left' | 'Right'): HDVariableEntity[] {
  return Array.from(hdVariables.values())
    .filter((v) => v.arrow === arrow);
}

/**
 * Get HD Variable categories
 */
export function getHDVariableCategories(): { id: HDVariableCategory; description: string }[] {
  const categories: HDVariableCategory[] = ['Determination', 'Cognition', 'Environment', 'Motivation'];
  return categories.map((category) => {
    const firstVar = Array.from(hdVariables.values()).find((v) => v.category === category);
    return {
      id: category,
      description: firstVar?.categoryDescription || '',
    };
  });
}

// ------------------------------------
// Gene Keys Extended Filtering
// ------------------------------------

/**
 * Get the element for a Gene Key (via its zodiac sign)
 */
export function getGeneKeyElement(geneKey: GeneKey): Element | undefined {
  if (!geneKey.tropicalSignId) return undefined;
  const sign = signs.get(geneKey.tropicalSignId);
  if (!sign) return undefined;
  return elements.get(sign.elementId);
}

/**
 * Get the HD Center for a Gene Key (via its HD Gate)
 */
export function getGeneKeyHDCenter(geneKey: GeneKey): HDCenter | undefined {
  if (!geneKey.hdGateId) return undefined;
  const gate = hdGates.get(geneKey.hdGateId);
  if (!gate || !gate.centerId) return undefined;
  return hdCenters.get(gate.centerId);
}

/**
 * Get Gene Keys by element (via their zodiac sign)
 */
export function getGeneKeysByElement(elementId: string): GeneKey[] {
  return Array.from(geneKeys.values())
    .filter((k) => {
      if (!k.tropicalSignId) return false;
      const sign = signs.get(k.tropicalSignId);
      return sign?.elementId === elementId;
    })
    .sort((a, b) => a.keyNumber - b.keyNumber);
}

/**
 * Get Gene Keys by HD Center (via their HD Gate)
 */
export function getGeneKeysByHDCenter(centerId: string): GeneKey[] {
  return Array.from(geneKeys.values())
    .filter((k) => {
      if (!k.hdGateId) return false;
      const gate = hdGates.get(k.hdGateId);
      return gate?.centerId === centerId;
    })
    .sort((a, b) => a.keyNumber - b.keyNumber);
}

// ------------------------------------
// Degree to Gate/Gene Key Conversion
// ------------------------------------

/**
 * Convert a zodiac degree (0-360) to the corresponding HD Gate and line
 * @param absoluteDegree - Degree in absolute terms (0-360), where 0° = 0° Aries
 * @returns Object with gate and line, or undefined if not found
 */
export function getGateByDegree(absoluteDegree: number): { gate: HDGate; line: number } | undefined {
  // Normalize degree to 0-360
  const normalizedDegree = ((absoluteDegree % 360) + 360) % 360;

  // Find the gate that contains this degree
  for (const gate of hdGates.values()) {
    const start = gate.degreeStart;
    const end = gate.degreeEnd;

    // Handle gates that cross 0° (e.g., 358° to 3°)
    if (start > end) {
      if (normalizedDegree >= start || normalizedDegree < end) {
        const gateSpan = (360 - start) + end;
        let positionInGate: number;
        if (normalizedDegree >= start) {
          positionInGate = normalizedDegree - start;
        } else {
          positionInGate = (360 - start) + normalizedDegree;
        }
        const line = Math.floor((positionInGate / gateSpan) * 6) + 1;
        return { gate, line: Math.min(Math.max(line, 1), 6) };
      }
    } else {
      if (normalizedDegree >= start && normalizedDegree < end) {
        const gateSpan = end - start;
        const positionInGate = normalizedDegree - start;
        const line = Math.floor((positionInGate / gateSpan) * 6) + 1;
        return { gate, line: Math.min(Math.max(line, 1), 6) };
      }
    }
  }

  return undefined;
}

/**
 * Convert sign position (sign + degree) to absolute degree
 * @param signId - The zodiac sign ID
 * @param degree - Degree within the sign (0-30)
 * @param minute - Minute within the degree (0-60)
 * @returns Absolute degree (0-360)
 */
export function signPositionToAbsoluteDegree(signId: string, degree: number, minute: number = 0): number {
  const signOrder: Record<string, number> = {
    'aries': 0,
    'taurus': 1,
    'gemini': 2,
    'cancer': 3,
    'leo': 4,
    'virgo': 5,
    'libra': 6,
    'scorpio': 7,
    'sagittarius': 8,
    'capricorn': 9,
    'aquarius': 10,
    'pisces': 11,
  };

  const signStart = (signOrder[signId] || 0) * 30;
  return signStart + degree + (minute / 60);
}

/**
 * Get the Gene Key and line for a given zodiac position
 * @param signId - The zodiac sign ID
 * @param degree - Degree within the sign (0-30)
 * @param minute - Minute within the degree (0-60)
 * @returns Object with geneKey and line, or undefined if not found
 */
export function getGeneKeyByZodiacPosition(
  signId: string,
  degree: number,
  minute: number = 0
): { geneKey: GeneKey; line: number } | undefined {
  const absoluteDegree = signPositionToAbsoluteDegree(signId, degree, minute);
  const gateResult = getGateByDegree(absoluteDegree);

  if (!gateResult) return undefined;

  const geneKey = geneKeys.get(gateResult.gate.geneKeyId);
  if (!geneKey) return undefined;

  return { geneKey, line: gateResult.line };
}

/**
 * Calculate the Earth position (opposite the Sun)
 * @param sunSignId - Sun's sign ID
 * @param sunDegree - Sun's degree in the sign
 * @param sunMinute - Sun's minute
 * @returns Object with signId, degree, minute for Earth position
 */
export function getEarthPosition(
  sunSignId: string,
  sunDegree: number,
  sunMinute: number = 0
): { signId: string; degree: number; minute: number } {
  const signOrder = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
                      'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

  const sunSignIndex = signOrder.indexOf(sunSignId);
  const earthSignIndex = (sunSignIndex + 6) % 12;
  const earthSignId = signOrder[earthSignIndex];

  return {
    signId: earthSignId,
    degree: sunDegree,
    minute: sunMinute,
  };
}

// ------------------------------------
// Gene Keys Lines & Sequences Utilities
// ------------------------------------

/**
 * Get all GK Lines sorted by line number
 */
export function getGKLines(): GKLineEntity[] {
  return Array.from(gkLines.values()).sort((a, b) => a.lineNumber - b.lineNumber);
}

/**
 * Get GK Line by ID
 */
export function getGKLineById(lineId: string): GKLineEntity | undefined {
  return gkLines.get(lineId);
}

/**
 * Get GK Line by line number (1-6)
 */
export function getGKLineByNumber(lineNumber: number): GKLineEntity | undefined {
  return Array.from(gkLines.values()).find((l) => l.lineNumber === lineNumber);
}

/**
 * Get all GK Sequences sorted by order
 */
export function getGKSequencesInOrder(): GKSequenceEntity[] {
  return Array.from(gkSequences.values()).sort((a, b) => a.sequenceOrder - b.sequenceOrder);
}

/**
 * Get GK Sequence by ID
 */
export function getGKSequenceById(sequenceId: string): GKSequenceEntity | undefined {
  return gkSequences.get(sequenceId);
}

// ------------------------------------
// Amino Acids & Trigrams Utilities
// ------------------------------------

/**
 * Get all Amino Acids
 */
export function getAminoAcids(): AminoAcid[] {
  return Array.from(aminoAcids.values());
}

/**
 * Get Amino Acid by ID
 */
export function getAminoAcidById(acidId: string): AminoAcid | undefined {
  return aminoAcids.get(acidId);
}

/**
 * Get Amino Acid by codon ring
 */
export function getAminoAcidByCodonRing(codonRingId: string): AminoAcid | undefined {
  return Array.from(aminoAcids.values()).find((a) => a.codonRingId === codonRingId);
}

/**
 * Get all Trigrams sorted by number
 */
export function getTrigrams(): Trigram[] {
  return Array.from(trigrams.values()).sort((a, b) => a.trigramNumber - b.trigramNumber);
}

/**
 * Get Trigram by ID
 */
export function getTrigramById(trigramId: string): Trigram | undefined {
  return trigrams.get(trigramId);
}

/**
 * Get Trigram by element
 */
export function getTrigramsByElement(element: string): Trigram[] {
  return Array.from(trigrams.values()).filter((t) => t.element === element);
}

// ------------------------------------
// Unified Line Utilities
// ------------------------------------

/**
 * Get all unified Lines sorted by line number
 */
export function getLines(): Line[] {
  return Array.from(lines.values()).sort((a, b) => a.lineNumber - b.lineNumber);
}

/**
 * Get unified Line by ID
 */
export function getLineById(lineId: string): Line | undefined {
  return lines.get(lineId);
}

/**
 * Get unified Line by line number (1-6)
 */
export function getLineByNumber(lineNumber: number): Line | undefined {
  return Array.from(lines.values()).find((l) => l.lineNumber === lineNumber);
}

/**
 * Get unified Lines by trigram position (Lower or Upper)
 */
export function getLinesByTrigram(trigram: 'Lower' | 'Upper'): Line[] {
  return Array.from(lines.values())
    .filter((l) => l.trigram === trigram)
    .sort((a, b) => a.lineNumber - b.lineNumber);
}

/**
 * Get HD profiles that include a specific line
 */
export function getHDProfilesForLine(lineNumber: number): HDProfileEntity[] {
  return Array.from(hdProfiles.values()).filter(
    (p) => p.personalityLine === lineNumber || p.designLine === lineNumber
  );
}

/**
 * Get the harmony partner line for a given line
 */
export function getHarmonyPartnerLine(lineId: string): Line | undefined {
  const line = lines.get(lineId);
  if (!line || !line.relatedLineId) return undefined;
  return lines.get(line.relatedLineId);
}

// Re-export raw data for direct access if needed
export {
  planetsData,
  signsData,
  housesData,
  elementsData,
  aspectsData,
  configurationsData,
  relationshipsData,
  pointsData,
  fixedStarsData,
  dignitiesData,
  decansData,
  // Human Design & Gene Keys
  hdGatesData,
  hdChannelsData,
  hdCentersData,
  hdTypesData,
  hdStrategiesData,
  hdAuthoritiesData,
  hdLinesData,
  hdProfilesData,
  hdVariablesData,
  geneKeysData,
  gkSpheresData,
  gkLinesData,
  gkSequencesData,
  codonRingsData,
  aminoAcidsData,
  trigramsData,
  hdGkRelationshipsData,
  // Unified entities
  linesData,
};
