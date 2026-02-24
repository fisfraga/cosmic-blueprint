// ============================================
// COSMIC COPILOT — Type Definitions
// ============================================

// ------------------------------------
// Core Entity Types
// ------------------------------------

export type EntityType =
  | 'planet'
  | 'sign'
  | 'house'
  | 'element'
  | 'decan'
  | 'aspect'
  | 'configuration'
  | 'dignity'
  | 'point'
  | 'fixed-star'
  | 'galactic-point'
  // Human Design & Gene Keys
  | 'hd-gate'
  | 'hd-channel'
  | 'hd-center'
  | 'hd-type'
  | 'hd-strategy'
  | 'hd-authority'
  | 'hd-line'
  | 'hd-profile'
  | 'hd-variable'
  | 'gene-key'
  | 'gk-sphere'
  | 'gk-line'
  | 'gk-sequence'
  | 'codon-ring'
  | 'amino-acid'
  | 'trigram'
  // Unified entities (combining GK + HD perspectives)
  | 'line'
  // Lost Octave (Robert Comber 72-gate extended system)
  | 'lo-gate'
  // Wisdom Traditions (cross-system bridge entities)
  | 'numerology-number'
  | 'chakra'
  | 'hermetic-principle'
  // Profile-specific entity types (personal placements)
  | 'profile-placement'      // Astrology: planet-in-sign-in-house
  | 'profile-gk-placement'   // Gene Keys: sphere with gene key + line
  | 'profile-hd-placement'   // Human Design: gate activation with line
  | 'profile-aspect'         // Astrology: aspect between two placements
  | 'profile-channel'        // Human Design: defined channel
  | 'profile-configuration'; // Astrology: aspect pattern

export interface AstroEntity {
  id: string;
  type: EntityType;
  name: string;
  symbol?: string;
  image?: string;
  description?: string;
}

// ------------------------------------
// Planet Types
// ------------------------------------

export type PlanetType = 'Traditional Planet' | 'Modern Planet' | 'Key Astro Point';

export interface Planet extends AstroEntity {
  type: 'planet';
  symbol: string;
  cycleDuration: string;
  archetype: string;
  functionAndMeaning: string;
  contemplationQuestions: string[];
  personalNotes?: string;
  planetType: PlanetType;
  planetImportance: number; // 1-4 scale
  signsRuled: string[];
  giftExpression: string;
  shadowExpression: string;
  // Debra Silverman psychological astrology (Sprint AA)
  debraRoleMetaphor?: string;
}

// ------------------------------------
// Zodiac Sign Types
// ------------------------------------

export type Modality = 'Cardinal' | 'Fixed' | 'Mutable';

export type VperPhase = 'vision' | 'plan' | 'execute' | 'review';

export interface ZodiacSign extends AstroEntity {
  type: 'sign';
  symbol: string;
  orderInZodiac: number; // 1-12
  dateRange: string;
  keyPhrase: string;
  signModality: Modality;
  elementId: string;
  alchemicalElementId: string;
  substancePolarity: 'yang' | 'bridge' | 'yin';
  rulingPlanetIds: string[];
  houseRuled: string;
  opposingSignId: string;
  characteristicsAndQualities: string;
  traits: string;
  bodyPart: string;
  decanIds: string[];
  // Julia Balaz Shadow-to-Light framework + ILOS VPER phase
  shadowExpression?: string;
  lightExpression?: string;
  managementGuidance?: string;
  vperPhase?: VperPhase;
  // Debra Silverman psychological astrology (Sprint AA / DS-12)
  debraSignMedicine?: string;
  debraGremlinTheme?: string;
  debraBodyPart?: string;
}

// ------------------------------------
// House Types
// ------------------------------------

export type HouseType = 'Angular' | 'Succedent' | 'Cadent';

export interface House extends AstroEntity {
  type: 'house';
  houseNumber: number; // 1-12
  houseType: HouseType;
  worldHalf: 'inner' | 'outer';
  worldHalfTheme: string;
  rulingSignId: string;
  rulingPlanetId: string;
  lifeAreaFocus: string[];
  meaningAndRepresentation: string;
  contemplationQuestions: string[];
  // ILOS + Julia Balaz enrichment (Sprint U)
  ilosKeyArea?: string;       // e.g. "Health & Vitality" — ILOS 12 Key Area name
  vperPhase?: VperPhase;      // 'vision' | 'plan' | 'execute' | 'review'
  careerRelevance?: string;   // Julia Balaz: career/vocation framing for this house
  purposeRole?: string;       // Julia Balaz: soul purpose role framing for this house
}

// ------------------------------------
// Element Types
// ------------------------------------

export type ElementCategory = 'Classical' | 'Alchemical';

export interface Element extends AstroEntity {
  type: 'element';
  symbol: string;
  elementCategory: ElementCategory;
  coreQuality: string;
  corePrinciple: string;
  zodiacSignIds: string[];
  modalityExpression: {
    cardinal?: string;
    fixed?: string;
    mutable?: string;
  };
  keyTraits: string[];
  recognitionPattern: string[];
  shadowSide: string;
  elementDynamics: string;
  balancingPractice: {
    toIncrease: string;
    toDecrease: string;
  };
}

// ------------------------------------
// Decan Types
// ------------------------------------

export interface Decan extends AstroEntity {
  type: 'decan';
  decanNumber: number; // 1-36
  decanName: string;
  archetype: string;
  degreeRange: string;
  dateRange: string;
  zodiacSignId: string;
  elementId: string;
  rulingPlanetId: string;
  rulingSignId: string;
  modernRulingPlanetId: string;
  complementaryDecanId: string;
  description: string;
}

// ------------------------------------
// Aspect Types
// ------------------------------------

export type AspectNature = 'Harmonious' | 'Challenging' | 'Neutral';

export interface Aspect extends AstroEntity {
  type: 'aspect';
  symbol: string;
  angle: number;
  orbRange: string;
  nature: AspectNature;
  keyword: string;
  elementalPattern: string;
  explanation: string;
  impact: string;
  integrationPractice: string;
}

// ------------------------------------
// Aspect Configuration Types
// ------------------------------------

export interface AspectConfiguration extends AstroEntity {
  type: 'configuration';
  shape: string;
  requiredAspectIds: string[];
  requiredAspectCount: number;
  orbRange: string;
  nature: AspectNature;
  keyword: string;
  elementalPattern: string;
  explanation: string;
  impact: string;
  integrationPractice: string;
}

// ------------------------------------
// Dignity Types
// ------------------------------------

export type DignityType = 'Domicile' | 'Exaltation' | 'Detriment' | 'Fall';

export interface Dignity extends AstroEntity {
  type: 'dignity';
  dignityName: DignityType;
  planetId: string;
  signId: string;
  description: string;
}

// ------------------------------------
// Fixed Star Types
// ------------------------------------

export interface FixedStarZodiacPosition {
  sign: string;
  degree: number;
  minute: number;
  note?: string;
}

export interface FixedStar extends AstroEntity {
  type: 'fixed-star';
  alternateNames: string[];
  constellation: string;
  magnitude: number;
  zodiacPosition: FixedStarZodiacPosition;
  nature: string[];
  isBehenian: boolean;
  isRoyalStar: boolean;
  royalStarTitle?: string;
  archetype: string;
  keywords: string[];
  giftExpression: string;
  shadowExpression: string;
  traditionalMeaning: string;
  bodyAssociation: string;
  eclipticLongitude: number;  // Decimal degrees 0–360° — used for conjunction calculations
  orb: number;                // Stellara-validated orb in degrees
  astrologyKingUrl: string;
  galacticConnections: string[]; // Future Sprint Q placeholder
  contemplationQuestions: string[];
}

// ------------------------------------
// Galactic Point Types
// ------------------------------------

export interface GalacticPoint extends AstroEntity {
  type: 'galactic-point';
  eclipticLongitude: number;  // 0–360°, J2000 tropical
  orb: number;                // conjunction orb in degrees
  zodiacSign: string;         // Current tropical zodiac sign
  zodiacDegree: number;
  zodiacMinute: number;
  archetype: string;
  keywords: string[];
  gift: string;
  challenge: string;
  description: string;
  contemplationTheme: string;
}

// ------------------------------------
// Point Types (ASC, MC, Nodes, etc.)
// ------------------------------------

export interface AstroPoint extends AstroEntity {
  type: 'point';
  symbol: string;
  archetype: string;
  functionAndMeaning: string;
  contemplationQuestions: string[];
}

// ------------------------------------
// Human Design Types
// ------------------------------------

export type HDCenterType = 'Awareness' | 'Motor' | 'Pressure' | 'Identity' | 'Communication';

export type HDCircuitType = 'Individual' | 'Collective' | 'Tribal' | 'Integration';

export interface HDCenter extends AstroEntity {
  type: 'hd-center';
  centerType: HDCenterType;
  biologicalCorrelate: string;
  definedMeaning: string;
  undefinedMeaning: string;
  gateIds: string[];
  colorScheme: string;
  // Ra Uru Hu conditioning layer
  undefinedWisdom?: string;
  undefinedConditioning?: string;
  conditioningQuestion?: string;
  // ILOS elemental bridge
  element?: string;
}

export interface HDGate extends AstroEntity {
  type: 'hd-gate';
  gateNumber: number; // 1-64
  iChingHexagram: number;
  iChingName: string;
  centerId: string;
  circuitType?: HDCircuitType;
  channelGateId?: string; // Gate it connects to via channel
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
  lineDescriptions?: string[];
}

/**
 * Lost Octave 72-gate system (Robert James Comber).
 * Each gate = 5.000° exactly. Same wheel origin as the 64-gate system (358.25°).
 * gateNumber and name are null for segments 1–60 (source not yet available).
 * The 12 master gates (gateNumbers 61–72) are fully populated from the Comber source.
 */
export interface HDGate72 {
  id: string;                      // "lost-octave-{segmentNumber}"
  type: 'lo-gate';
  segmentNumber: number;           // 1–72
  tropicalSignId: string;          // e.g. "aries", "pisces/aries"
  degreeStart: number;             // absolute ecliptic longitude (0-360), wheel start = 358.25°
  degreeEnd: number;               // degreeStart + 5.0 (may wrap: start > end means crosses 0°)
  startSign: string;               // IANA sign ID of the start degree
  startDegree: number;             // degree within the start sign (0-30)
  overlapping64GateSegment: number; // which 64-gate segment this 72-gate segment most overlaps
  gateNumber: number | null;       // Comber's gate number (1–72); null for unpopulated segments
  name: string | null;             // gate name from Comber book; null for unpopulated segments
  description: string | null;      // gate description; null for unpopulated segments
  isMasterGate: boolean;           // true if gateNumber is 61–72 (one per zodiac sign, fully populated)
  decanNumber: number;             // 1–36; two segments per decan: ceil(segmentNumber / 2)
}

export type HDStreamType = 'Knowing' | 'Centering' | 'Logic' | 'Abstract' | 'Sensing' | 'Defense' | 'Ego' | 'Community' | 'Integration';

export interface HDChannel extends AstroEntity {
  type: 'hd-channel';
  channelNumber: number; // 1-36
  gate1Id: string;
  gate2Id: string;
  gate1Number: number;
  gate2Number: number;
  center1Id: string;
  center2Id: string;
  circuitType: HDCircuitType;
  streamType?: HDStreamType;
  keywords: string[];
  theme: string;
  giftExpression: string;
  challengeExpression: string;
}

export interface HDTypeEntity extends AstroEntity {
  type: 'hd-type';
  percentage: string;
  auraType: string;
  auraDescription: string;
  strategyId: string;
  signatureEmotion: string;
  notSelfEmotion: string;
  role: string;
  definedCenters: string[];
  keywords: string[];
  gifts: string[];
  challenges: string[];
  notSelfBehavior: string;
  signatureBehavior: string;
  practicalGuidance: string;
  famousExamples: string[];
  // Ra Uru Hu depth layer
  deconditioningJourney?: string;
  auraMechanism?: string;
  enteringCorrectlyGuidance?: string;
  raQuote?: string;
  experimentInstruction?: string;
  vperPhase?: string;
}

export interface HDStrategyEntity extends AstroEntity {
  type: 'hd-strategy';
  hdTypeIds: string[];
  practicalGuidance: string;
  signOfCorrectness: string;
  signOfIncorrectness: string;
  keywords: string[];
  examples: string[];
  commonMisunderstandings: string[];
}

export interface HDAuthorityEntity extends AstroEntity {
  type: 'hd-authority';
  alternativeNames: string[];
  centerId: string | null;
  decisionProcess: string;
  percentage: string;
  keywords: string[];
  practicalGuidance: string;
  timeframe: string;
  signs: {
    correct: string;
    incorrect: string;
  };
  // Ra Uru Hu somatic depth layer (Sprint W)
  waveMechanic?: string | null;
  somaticCue?: string;
  commonOverride?: string;
}

export interface HDLineEntity extends AstroEntity {
  type: 'hd-line';
  lineNumber: number;
  archetype: string;
  trigram: 'Lower' | 'Upper';
  trigramPosition: 'Bottom' | 'Middle' | 'Top';
  theme: string;
  keywords: string[];
  gifts: string[];
  challenges: string[];
  inPersonality: string;
  inDesign: string;
  healthyExpression: string;
  unhealthyExpression: string;
  practicalGuidance: string;
  lifePhases?: {
    phase1: { name: string; ageRange: string; description: string };
    phase2: { name: string; ageRange: string; description: string };
    phase3: { name: string; ageRange: string; description: string };
  };
}

export interface HDProfileEntity extends AstroEntity {
  type: 'hd-profile';
  personalityLine: number;
  designLine: number;
  personalityLineId: string;
  designLineId: string;
  lifeTheme: string;
  keywords: string[];
  gifts: string[];
  challenges: string[];
  relationshipStyle: string;
  careerGuidance: string;
  practicalGuidance: string;
  // Ra Uru Hu destiny classification (Sprint W)
  destinyType?: 'Right Angle' | 'Left Angle' | 'Juxtaposition';
  crossActivationAge?: string;
  costumeMeaning?: string;
}

export type HDVariableCategory = 'Determination' | 'Cognition' | 'Environment' | 'Motivation';
export type HDVariableArrow = 'Left' | 'Right';

export interface HDVariableEntity extends AstroEntity {
  type: 'hd-variable';
  category: HDVariableCategory;
  categoryDescription: string;
  tone: number;
  color: number;
  colorName: string;
  arrow: HDVariableArrow;
  arrowPosition: string;
  keywords: string[];
  challenges: string[];
  practicalGuidance: string;
  // Category-specific fields
  physicalApplication?: string; // Determination & Environment
  mentalApplication?: string; // Cognition & Motivation
  environmentalSupport?: string; // Determination & Environment
  idealCharacteristics?: string[]; // Environment
  perceptionStrength?: string; // Cognition
  healthyExpression?: string; // Motivation
  unhealthyExpression?: string; // Motivation
}

// ------------------------------------
// Gene Keys Types
// ------------------------------------

export interface FrequencyExpression {
  name: string;
  keyExpression: string;
  description: string;
  repressiveNature?: string; // Shadow only
  reactiveNature?: string; // Shadow only
}

export interface GeneKey extends AstroEntity {
  type: 'gene-key';
  keyNumber: number; // 1-64
  // Sprint Y — Archetype chapter title from Gene Keys book (e.g., "From Entropy to Syntropy")
  keyTitle?: string;
  shadow: FrequencyExpression;
  gift: FrequencyExpression;
  siddhi: FrequencyExpression;
  programmingPartnerId: string;
  codonRingId: string;
  codonGroupTheme?: string;
  aminoAcidId?: string;
  physiology: string;
  hdGateId: string;
  iChingHexagram: number;
  tropicalSignId: string;
  degreeStart: number;
  degreeEnd: number;
  url?: string;
}

export type GKSequence = 'Activation' | 'Venus' | 'Pearl';

export interface GKSphereEntity extends AstroEntity {
  type: 'gk-sphere';
  sequence: GKSequence;
  sequenceOrder: number;
  planetarySource: string;
  question: string;
  keywords: string[];
  theme: string;
  practicalGuidance: string;
  partnerSphere: string | null;
  relationship: string;
}

export interface CodonRing extends AstroEntity {
  type: 'codon-ring';
  geneKeyIds: string[];
  aminoAcidId?: string;
  aminoAcid?: string; // Direct name (e.g., "Arginine")
  // Richard Rudd biological completeness layer (Sprint Y)
  aminoAcids?: string[];        // Array of amino acid names this ring codes for (replaces singular for multi-acid rings)
  transformationTheme?: string; // Single-sentence collective transformation arc for AI context use
  theme: string;
  collectivePurpose: string;
  primaryThemes?: string[];
  connectedRing?: string; // ID of polarity ring (Water/Fire)
  connectionType?: string; // Description of connection
}

export interface AminoAcid extends AstroEntity {
  type: 'amino-acid';
  abbreviation: string;
  aminoAcidType: string;
  chemicalNature: string;
  physiologicalRole: string;
  consciousnessQuality: string;
  codonRingId: string;
  geneKeyIds: string[];
}

export interface GKLineEntity extends AstroEntity {
  type: 'gk-line';
  lineNumber: number;
  archetype: string;
  trigram: 'Lower' | 'Upper';
  trigramPosition: 'Bottom' | 'Middle' | 'Top';
  theme: string;
  keywords: string[];
  gift: string;
  shadow: string;
  inGeneKeys: string;
  contemplationTheme: string;
  practicalGuidance: string;
  lifePhases?: {
    phase1: { name: string; ageRange: string; description: string };
    phase2: { name: string; ageRange: string; description: string };
    phase3: { name: string; ageRange: string; description: string };
  };
}

export interface GKSequenceEntity extends AstroEntity {
  type: 'gk-sequence';
  sequenceOrder: number;
  theme: string;
  primaryQuestion: string;
  spheres: string[];
  pathways: string[];
  keywords: string[];
  contemplationFocus: string;
  transformation: string;
  practicalGuidance: string;
  primeGifts?: Array<{
    sphere: string;
    planet: string;
    description: string;
  }>;
  coreSpheres?: Array<{
    sphere: string;
    planet: string;
    description: string;
  }>;
}

export interface Trigram extends AstroEntity {
  type: 'trigram';
  chineseName: string;
  trigramNumber: number;
  lines: Array<'yin' | 'yang'>;
  nature: string;
  attribute: string;
  image: string;
  direction: string;
  season: string;
  element: string;
  bodyPart: string;
  familyMember: string;
  animal: string;
  keywords: string[];
  geneKeyCorrelation: string;
  upperTrigram: string;
  lowerTrigram: string;
}

// ------------------------------------
// Unified Line Entity (combines GK + HD perspectives)
// ------------------------------------

export interface LineGeneKeysData {
  theme: string;
  description: string;
  gift: string;
  shadow: string;
  contemplationTheme: string;
  practicalGuidance: string;
}

export interface LineHumanDesignData {
  theme: string;
  description: string;
  gifts: string[];
  challenges: string[];
  inPersonality: string;
  inDesign: string;
  healthyExpression: string;
  unhealthyExpression: string;
}

export interface LineLifePhases {
  phase1: { name: string; ageRange: string; description: string };
  phase2: { name: string; ageRange: string; description: string };
  phase3: { name: string; ageRange: string; description: string };
}

export interface Line extends AstroEntity {
  type: 'line';
  lineNumber: number; // 1-6
  archetype: string;
  trigram: 'Lower' | 'Upper';
  trigramPosition: 'Bottom' | 'Middle' | 'Top';
  keywords: string[];
  summary: string;
  geneKeys: LineGeneKeysData;
  humanDesign: LineHumanDesignData;
  profiles: string[]; // HD profile IDs that include this line (e.g., ["1/3", "1/4"])
  relatedLineId?: string; // Harmony partner line
  harmonyDescription?: string;
  lifePhases?: LineLifePhases; // Only for Line 6
  // Sprint BB — Isadora Synthesis cross-system resonance layer
  chakraResonance?: string;
  elementalExpression?: string;
  signPair?: { active: string; receptive: string };
  evolutionaryProcess?: { shadow: string; gift: string; theme: string };
  ancestralIntegration?: { wound: string; remedy: string };
  emotionalImprint?: { defensePattern: string; loveLanguage: string };
  innerGrounding?: { coreNeed: string; whenDenied: string };
  communicationGuardian?: string;
  expansionDriving?: string;
}

// ------------------------------------
// Wisdom Tradition Entities (cross-system bridge)
// ------------------------------------

export interface NumerologyNumber extends AstroEntity {
  type: 'numerology-number';
  number: number;
  harmonicTone: string;
  archetype: string;
  planet: string;
  element: string;
  chakraId: string;
  solfeggioHz: number;
  lowerExpressionPattern?: string;
  lowerExpression: { name: string; expression: string; blockingBelief?: string };
  alignedExpression: { name: string; expression: string };
  highestExpression: { name: string; expression: string };
  adamApolloEssence: string;
  lifePathMeaning: string;
  destinyMeaning: string;
  lifePathCalculation?: string;
  keywords: string[];
  relatedGates: number[];
  relatedChakras: string[];
  relatedNumerology: number[];
  affirmation: string;
  contemplativeQuestion: string;
  isMasterNumber?: boolean;
}

export interface Chakra extends AstroEntity {
  type: 'chakra';
  number: number;
  sanskritName: string;
  location: string;
  color: string;
  colorHex: string;
  element: string;
  frequency: number;
  seed_mantra: string;
  alchemicalSubstance: string;
  relatedHouses: number[];
  relatedSigns: string[];
  relatedHDCenters: string[];
  relatedGates: number[];
  relatedNumerology: number[];
  archetype: string;
  lifeTheme: string;
  alchemyNote: string;
  constricted: { name: string; expression: string; blockingBelief?: string };
  flowing: { name: string; expression: string };
  radiant: { name: string; expression: string };
  bodyCorrelates: string;
  affirmation: string;
  contemplativeQuestion: string;
  keywords: string[];
}

export interface HermeticPrinciple extends AstroEntity {
  type: 'hermetic-principle';
  number: number;
  latinName: string;
  statement: string;
  essence: string;
  element: string;
  planet: string;
  alchemicalSubstance: string;
  relatedChakras: string[];
  relatedGeneKeys: number[];
  shadow: { expression: string };
  gift: { expression: string };
  siddhi: { expression: string };
  practice: string;
  astrologyApplication: string;
  geneKeysApplication: string;
  contemplativeQuestion: string;
  keywords: string[];
}

// ------------------------------------
// Enrichment Profile Types (Numerology, Chakra, Alchemy)
// ------------------------------------

export interface NumerologyProfile {
  lifePathNumber: number;       // 1-9 or 11, 22, 33 (master numbers)
  birthdayNumber: number;       // birth day reduced to single digit or master
  lifePathBase?: number;        // base digit of master number (33→6, 22→4, 11→2) — undefined for non-master
  birthdayBase?: number;        // base digit if birthday is a master number — undefined otherwise
  lifePathEntityId: string;     // e.g. "num-33" — references numerology.json
  birthdayEntityId: string;     // e.g. "num-9"
}

export interface ChakraActivation {
  chakraId: string;             // e.g. "chakra-4-heart"
  activatingPlanetIds: string[]; // e.g. ["venus", "moon"]
  primarySignId: string;         // first matching sign
  alchemicalSubstance: string;   // from chakra entity (e.g. "Sal")
}

export interface AlchemicalProfile {
  dominantSubstance: 'sulphur' | 'mercury' | 'salt';
  sulphurCount: number;
  mercuryCount: number;
  saltCount: number;
  activatingPlanetIds: string[];
}

// ------------------------------------
// Personal Context (ILOS QUANTUM layer)
// ------------------------------------

export interface PersonalContextProject {
  id: string;              // e.g. "project-cosmic-blueprint"
  name: string;
  description?: string;
  status?: 'planning' | 'active' | 'review' | 'paused';
  linkedKeyArea?: string;  // house ID e.g. "house-10"
}

export interface PersonalContextRelationship {
  id: string;              // e.g. "rel-partner-maria"
  name: string;
  role: string;            // "business partner", "mentor", "life partner"
}

export interface PersonalContext {
  lastUpdated?: string;    // ISO date

  // Professional Context
  occupations: string[];
  workStyle?: 'solo' | 'collaborative' | 'hybrid';
  specializations: string[];
  professionalGoals?: string;
  incomeStreams?: string[];

  // Current Focus
  activeProjects: PersonalContextProject[];
  recentWins: string[];
  activeKeyAreas?: string[];  // e.g. ["house-10", "house-7"]

  // Values & Life
  coreValues: string[];
  nonNegotiables: string[];
  lifeStage?: string;
  primaryLocation?: string;
  lifeManifesto?: string;

  // Energy & Relationships
  chronotype?: 'morning' | 'evening' | 'bimodal' | 'flexible';
  energyPeakTimes?: string[];
  depletionFactors?: string[];
  recoveryNeeds?: string[];
  keyRelationships: PersonalContextRelationship[];
  spiritualPractices?: string[];

  // Self-Assessed Elemental Profile (from /elements/survey)
  elementalSurveyScores?: {
    fire: number;   // 0–6
    air: number;    // 0–6
    earth: number;  // 0–6
    water: number;  // 0–6
    savedAt: string; // ISO date
  };
}

// ------------------------------------
// Relationship Types
// ------------------------------------

export type RelationshipType =
  // Planet relationships
  | 'RULES'
  | 'RULES_HOUSE'
  | 'HAS_DIGNITY'
  // Sign relationships
  | 'HAS_ELEMENT'
  | 'HAS_ALCHEMICAL_ELEMENT'
  | 'HAS_MODALITY'
  | 'OPPOSES'
  | 'CONTAINS_DECAN'
  | 'RULED_BY'
  // Decan relationships
  | 'BELONGS_TO'
  | 'DECAN_RULED_BY'
  | 'COMPLEMENTS'
  // House relationships
  | 'HOUSE_RULED_BY_SIGN'
  | 'HOUSE_RULED_BY_PLANET'
  // Element relationships
  | 'ELEMENT_CONTAINS'
  | 'ENERGIZES'
  | 'CHALLENGES'
  | 'FLOWS_WITH'
  // Personal chart relationships
  | 'PLACED_IN_SIGN'
  | 'PLACED_IN_HOUSE'
  | 'ASPECTS'
  | 'PART_OF_CONFIGURATION'
  // Human Design relationships
  | 'GATE_IN_CENTER'
  | 'GATE_CONNECTS_TO'
  | 'GATE_IN_SIGN'
  | 'GATE_CORRESPONDS_TO_GK'
  // Gene Keys relationships
  | 'GK_PROGRAMMING_PARTNER'
  | 'GK_IN_CODON_RING'
  | 'GK_ENCODES_AMINO_ACID'
  | 'GK_CORRESPONDS_TO_GATE';

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  relationshipType: RelationshipType;
  strength?: number; // 1-10 for weighted relationships
  metadata?: Record<string, unknown>;
}

// ------------------------------------
// Gene Keys Profile Types
// ------------------------------------

export interface GeneKeySphere {
  sphereName: string;
  geneKeyId: string;
  geneKeyNumber: number;
  line: number; // 1-6
  planetarySource: string; // e.g., "Natal Sun", "Design Mars"
}

export interface GeneKeyCoreSphere {
  geneKeyId: string;
  geneKeyNumber: number;
  line: number;
  sphereName: string;
}

export interface GeneKeysCoreIdentity {
  sun: GeneKeyCoreSphere;
  moon: GeneKeyCoreSphere;
  mercury: GeneKeyCoreSphere;
  ascendant: GeneKeyCoreSphere;
}

export interface GeneKeysProfile {
  // Primary Profile (Activation Sequence)
  lifesWork: GeneKeySphere;
  evolution: GeneKeySphere;
  radiance: GeneKeySphere;
  purpose: GeneKeySphere;

  // Venus Sequence (Relationships)
  attraction: GeneKeySphere;
  iq: GeneKeySphere;
  eq: GeneKeySphere;
  sq: GeneKeySphere;
  core: GeneKeySphere; // The Core Wound - center of the Venus Sequence

  // Pearl Sequence (Prosperity)
  vocation: GeneKeySphere;
  culture: GeneKeySphere;
  pearl: GeneKeySphere;

  // Optional additional spheres
  brand?: GeneKeySphere; // Same as Life's Work
  creativity?: GeneKeySphere;
  relating?: GeneKeySphere;
  stability?: GeneKeySphere;

  // Core Identity - matching Big Four astrological placements
  coreIdentity?: GeneKeysCoreIdentity;
}

// ------------------------------------
// Human Design Profile Types
// ------------------------------------

export type HDType = 'Generator' | 'Manifesting Generator' | 'Projector' | 'Manifestor' | 'Reflector';
export type HDStrategy = 'Wait to Respond' | 'Inform then Act' | 'Wait for Invitation' | 'Wait for Lunar Cycle';
export type HDAuthority = 'Sacral' | 'Emotional' | 'Splenic' | 'Ego/Heart' | 'Self/G' | 'Mental/None' | 'Lunar';
export type HDProfile = '1/3' | '1/4' | '2/4' | '2/5' | '3/5' | '3/6' | '4/6' | '4/1' | '5/1' | '5/2' | '6/2' | '6/3';
export type HDDefinition = 'Single' | 'Split' | 'Triple Split' | 'Quadruple Split' | 'No Definition';

export interface HDGateActivation {
  gateId: string;
  gateNumber: number;
  line: number;
  isPersonality: boolean; // true = natal/conscious, false = design/unconscious
  planet?: string; // Sun, Earth, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, North Node, South Node
}

export interface HDCoreGate {
  gateId: string;
  gateNumber: number;
  line: number;
  centerName: string;
}

export interface HDCoreIdentity {
  sun: HDCoreGate;
  moon: HDCoreGate;
  mercury: HDCoreGate;
  ascendant: HDCoreGate;
}

export interface HumanDesignProfile {
  type: HDType;
  strategy: HDStrategy;
  authority: HDAuthority;
  profile: HDProfile;
  definition: HDDefinition;
  incarnationCross?: string;

  // Gate activations
  personalityGates: HDGateActivation[]; // Natal/conscious (black)
  designGates: HDGateActivation[]; // Design/unconscious (red)

  // Defined centers (derived from channels)
  definedCenterIds: string[];

  // Defined channels
  definedChannelIds: string[];

  // Core Identity - matching Big Four astrological placements
  coreIdentity?: HDCoreIdentity;
}

// ------------------------------------
// Birth Data & Calculation Types (Hybrid Architecture)
// ------------------------------------

/**
 * BirthData - Immutable input data
 * The core input that all calculations derive from
 */
export interface BirthData {
  dateOfBirth: string; // ISO date format: "1994-10-18"
  timeOfBirth: string; // 24h format: "08:10"
  timezone: string; // IANA timezone: "America/Sao_Paulo"
  latitude: number;
  longitude: number;
  cityOfBirth: string;
}

/**
 * Planetary position at a specific moment
 */
export interface PlanetaryPosition {
  planetId: string;
  longitude: number; // Ecliptic longitude 0-360
  latitude?: number; // Ecliptic latitude
  signId: string;
  degree: number; // Degree within sign (0-29)
  minute: number;
  retrograde: boolean;
}

/**
 * CalculatedChart - Derived from BirthData, can be recalculated
 */
export interface CalculatedChart {
  calculatedAt: string; // ISO timestamp
  calculationVersion: string; // Version of calculation engine
  source: 'local' | 'astro-api'; // Where calculation came from

  // Core dates
  natalDate: string; // UTC timestamp of birth
  designDate: string; // UTC timestamp of design (88° solar arc before)

  // Planetary positions
  natalPositions: PlanetaryPosition[];
  designPositions: PlanetaryPosition[];

  // Gate activations (derived from positions)
  natalGates: HDGateActivation[];
  designGates: HDGateActivation[];
}

/**
 * ProfileMeta - Metadata about a profile
 */
export interface ProfileMeta {
  id: string;
  name: string;
  relationship: string;
  dateOfBirth: string;
  createdAt: string;
  lastViewedAt: string;
  natalChartImagePath?: string; // optional path to a pre-made natal chart image
}

/**
 * CosmicProfile - New hybrid storage format
 * Separates immutable birth data from calculated/cached values
 */
export interface CosmicProfile {
  // Version for migration support
  profileVersion: 2;

  // Metadata
  meta: ProfileMeta;

  // Immutable birth data
  birthData: BirthData;

  // Cached calculations (can be recalculated)
  calculatedChart?: CalculatedChart;

  // Derived profiles
  geneKeysProfile?: GeneKeysProfile;
  humanDesignProfile?: HumanDesignProfile;

  // Enrichment profiles (numerology, chakra, alchemy)
  numerologyProfile?: NumerologyProfile;
  chakraActivations?: ChakraActivation[];
  alchemicalProfile?: AlchemicalProfile;

  // Personal context (ILOS QUANTUM layer — per-user, editable)
  personalContext?: PersonalContext;

  // Astrology placements (from existing AstroProfile)
  placements?: NatalPlacement[];
  housePositions?: HousePosition[];
  aspects?: {
    planetary: NatalAspect[];
    other: NatalAspect[];
  };
  configurations?: NatalConfiguration[];
  elementalAnalysis?: ElementalAnalysis;
  chartRulers?: {
    traditional: string;
    modern: string;
  };
}

// ------------------------------------
// Personal Profile Types
// ------------------------------------

export interface AstroProfile {
  id: string;
  name: string;
  relationship?: string; // "Me", "Partner", "Child", etc.

  // Birth Data
  dateOfBirth: string; // ISO date
  timeOfBirth: string; // "HH:MM"
  cityOfBirth: string;
  coordinates?: {
    latitude: number;
    longitude: number;
    timezone: string;
  };

  chartImage?: string;

  // Calculated Data
  placements: NatalPlacement[];
  housePositions: HousePosition[];
  aspects: {
    planetary: NatalAspect[];
    other: NatalAspect[];
  };
  configurations: NatalConfiguration[];
  elementalAnalysis: ElementalAnalysis;

  // Derived
  chartRulers: {
    traditional: string;
    modern: string;
  };

  // Gene Keys & Human Design profiles
  geneKeysProfile?: GeneKeysProfile;
  humanDesignProfile?: HumanDesignProfile;

  // Version for cache invalidation
  profileVersion?: number;
}

export interface NatalPlacement {
  id: string;
  profileId: string;
  planetId: string;
  signId: string;
  houseId: string;
  decanId?: string;
  degree: number;
  minute: number;
  retrograde: boolean;
  dignityId?: string;
  isChartRuler?: 'traditional' | 'modern';
  fullName: string;
  shortName: string;
}

export interface HousePosition {
  id: string;
  profileId: string;
  houseId: string;
  signId: string;
  degree: number;
  minute: number;
}

export interface NatalAspect {
  id: string;
  profileId: string;
  aspectId: string;
  planet1Id: string;
  placement1Id: string;
  planet2Id: string;
  placement2Id: string;
  orbDegree: number;
  orbMinute: number;
  direction: 'Applying' | 'Separating';
  fullName: string;
}

export interface NatalConfiguration {
  id: string;
  profileId: string;
  configurationId: string;
  placementIds: string[];
  fullName: string;
}

export interface ElementalAnalysis {
  id: string;
  profileId: string;
  fire: number;
  earth: number;
  air: number;
  water: number;
  firePlanetIds: string[];
  earthPlanetIds: string[];
  airPlanetIds: string[];
  waterPlanetIds: string[];
  dominant: string;
  deficient: string;
}

// ------------------------------------
// Union Types for All Entities
// ------------------------------------

export type UniversalEntity =
  | Planet
  | ZodiacSign
  | House
  | Element
  | Decan
  | Aspect
  | AspectConfiguration
  | Dignity
  | FixedStar
  | GalacticPoint
  | AstroPoint
  // Human Design & Gene Keys
  | HDCenter
  | HDGate
  | HDChannel
  | HDTypeEntity
  | HDStrategyEntity
  | HDAuthorityEntity
  | HDLineEntity
  | HDProfileEntity
  | HDVariableEntity
  | GeneKey
  | GKSphereEntity
  | GKLineEntity
  | GKSequenceEntity
  | CodonRing
  | AminoAcid
  | Trigram
  // Unified entities
  | Line
  // Wisdom Traditions
  | NumerologyNumber
  | Chakra
  | HermeticPrinciple;

// ------------------------------------
// Profile Entity Types (Re-export)
// ------------------------------------
export * from './profileEntities';
