// ============================================
// COSMIC COPILOT — Entity Registry Service
// ============================================
// Central registry for all entities across Astrology, Human Design, and Gene Keys
// Enables entity linking in chat and entity lookup by ID

import {
  planets,
  signs,
  houses,
  elements,
  aspects,
  configurations,
  points,
  decans,
  dignities,
  fixedStars,
  // Human Design
  hdGates,
  hdGates72,
  hdChannels,
  hdCenters,
  hdTypes,
  hdStrategies,
  hdAuthorities,
  hdLines,
  hdProfiles,
  hdVariables,
  // Gene Keys
  geneKeys,
  gkSpheres,
  gkLines,
  gkSequences,
  codonRings,
  aminoAcids,
  trigrams,
  // Unified entities
  lines,
  // Wisdom Traditions
  numerologyNumbers,
  chakras,
  hermeticPrinciples,
} from '../../data';

import type {
  Planet,
  ZodiacSign,
  House,
  Element,
  Aspect,
  AspectConfiguration,
  AstroPoint,
  HDGate,
  HDGate72,
  HDChannel,
  HDCenter,
  HDTypeEntity,
  HDStrategyEntity,
  HDAuthorityEntity,
  HDLineEntity,
  HDProfileEntity,
  HDVariableEntity,
  HumanDesignProfile,
  HDGateActivation,
  GeneKey,
  GKSphereEntity,
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
  // Profile entities
  NatalPlacement,
  NatalAspect,
  NatalConfiguration,
  CosmicProfile,
  // Personal context
  PersonalContext,
  // Profile entity types
  AstrologyPlacementEntity,
  GeneKeysPlacementEntity,
  HDPlacementEntity,
  ProfileAspectEntity,
  ProfileChannelEntity,
  ProfileConfigurationEntity,
} from '../../types';

import type { DecanEntry, DignityEntry } from '../../data';

// ------------------------------------
// Type Definitions
// ------------------------------------

export type EntitySystem = 'astrology' | 'humanDesign' | 'geneKeys' | 'shared';

export type EntityCategory =
  // Astrology
  | 'planet'
  | 'sign'
  | 'house'
  | 'element'
  | 'aspect'
  | 'configuration'
  | 'point'
  | 'decan'
  | 'dignity'
  | 'fixed-star'
  | 'galactic-point'
  // Human Design
  | 'hd-type'
  | 'hd-strategy'
  | 'hd-authority'
  | 'hd-center'
  | 'hd-gate'
  | 'hd-channel'
  | 'hd-profile'
  | 'hd-line'
  | 'hd-variable'
  | 'incarnation-cross'
  // Lost Octave (Robert Comber 72-gate extended system)
  | 'lo-gate'
  // Gene Keys
  | 'gene-key'
  | 'gk-sphere'
  | 'gk-line'
  | 'gk-sequence'
  | 'codon-ring'
  | 'amino-acid'
  | 'trigram'
  // Unified entities (spanning GK + HD)
  | 'line'
  // Wisdom Traditions (cross-system bridge)
  | 'numerology-number'
  | 'chakra'
  | 'hermetic-principle'
  // Profile-specific entities (personal cosmic blueprint)
  | 'profile-placement'      // Astrology: planet-in-sign-in-house
  | 'profile-gk-placement'   // Gene Keys: sphere with gene key + line
  | 'profile-hd-placement'   // Human Design: gate activation with line
  | 'profile-aspect'         // Astrology: aspect between two placements
  | 'profile-channel'        // Human Design: defined channel
  | 'profile-configuration'  // Astrology: aspect pattern
  // Personal context entities (PC-04)
  | 'personal-project'       // An active project from personalContext
  | 'occupation'             // Occupation/role from personalContext
  // Legacy aliases (kept for backwards compatibility)
  | 'natal-placement'
  | 'natal-aspect';

export interface EntityInfo {
  id: string;
  type: EntityCategory;
  name: string;
  symbol?: string;
  system: EntitySystem;
  description?: string;
  image?: string;
  routePath?: string;
  // The original data object - typed as unknown for flexibility
  data: unknown;
  // Additional metadata for display
  keywords?: string[];
  // Cross-system references
  relatedIds?: string[];
}

// ------------------------------------
// Entity Registry
// ------------------------------------

class EntityRegistryService {
  private registry = new Map<string, EntityInfo>();
  private bySystem = new Map<EntitySystem, Set<string>>();
  private byCategory = new Map<EntityCategory, Set<string>>();
  private searchIndex = new Map<string, Set<string>>(); // lowercase term -> entity IDs

  // Profile entities (personal natal data)
  private profileEntities = new Map<string, EntityInfo>();
  private currentProfileId: string | null = null;

  constructor() {
    this.initializeRegistry();
  }

  private initializeRegistry(): void {
    // Initialize system and category indexes
    (['astrology', 'humanDesign', 'geneKeys', 'shared'] as EntitySystem[]).forEach(system => {
      this.bySystem.set(system, new Set());
    });

    // Register all entity types
    this.registerAstrologyEntities();
    this.registerHumanDesignEntities();
    this.registerGeneKeysEntities();
    this.registerSharedEntities();
    this.registerWisdomTraditionEntities();
    this.registerLostOctaveEntities();

    console.log(`[EntityRegistry] Initialized with ${this.registry.size} entities`);
  }

  // ------------------------------------
  // Astrology Entities
  // ------------------------------------

  private registerAstrologyEntities(): void {
    // Planets
    planets.forEach((planet: Planet, id: string) => {
      this.register({
        id,
        type: 'planet',
        name: planet.name,
        symbol: planet.symbol,
        system: 'astrology',
        description: planet.functionAndMeaning,
        image: planet.image,
        routePath: `/planets/${id}`,
        data: planet,
        keywords: [planet.archetype, planet.planetType, ...planet.signsRuled],
      });
    });

    // Zodiac Signs
    signs.forEach((sign: ZodiacSign, id: string) => {
      this.register({
        id,
        type: 'sign',
        name: sign.name,
        symbol: sign.symbol,
        system: 'astrology',
        description: sign.characteristicsAndQualities,
        image: sign.image,
        routePath: `/signs/${id}`,
        data: sign,
        keywords: [sign.elementId, sign.signModality, sign.keyPhrase],
        relatedIds: [sign.elementId, ...sign.rulingPlanetIds, sign.houseRuled],
      });
    });

    // Houses
    houses.forEach((house: House, id: string) => {
      this.register({
        id,
        type: 'house',
        name: house.name,
        symbol: house.symbol,
        system: 'astrology',
        description: house.description,
        image: house.image,
        routePath: `/houses/${id}`,
        data: house,
        keywords: [house.houseType, ...house.lifeAreaFocus],
        relatedIds: [house.rulingSignId, house.rulingPlanetId],
      });
    });

    // Elements (Classical + Alchemical)
    elements.forEach((element: Element, id: string) => {
      this.register({
        id,
        type: 'element',
        name: element.name,
        symbol: element.symbol,
        system: 'astrology',
        description: element.description,
        image: element.image,
        routePath: `/elements/${id}`,
        data: element,
        keywords: [element.elementCategory, element.coreQuality],
      });
    });

    // Aspects
    aspects.forEach((aspect: Aspect, id: string) => {
      this.register({
        id,
        type: 'aspect',
        name: aspect.name,
        symbol: aspect.symbol,
        system: 'astrology',
        description: aspect.description,
        image: aspect.image,
        routePath: `/aspects/${id}`,
        data: aspect,
        keywords: [aspect.nature, `${aspect.angle}°`],
      });
    });

    // Configurations
    configurations.forEach((config: AspectConfiguration, id: string) => {
      this.register({
        id,
        type: 'configuration',
        name: config.name,
        symbol: config.symbol,
        system: 'astrology',
        description: config.description,
        image: config.image,
        routePath: `/configurations/${id}`,
        data: config,
        keywords: [config.nature, config.keyword, ...config.requiredAspectIds],
      });
    });

    // Points (North Node, South Node, etc.)
    points.forEach((point: AstroPoint, id: string) => {
      this.register({
        id,
        type: 'point',
        name: point.name,
        symbol: point.symbol,
        system: 'astrology',
        description: point.functionAndMeaning,
        image: point.image,
        routePath: `/points/${id}`,
        data: point,
        keywords: [point.archetype],
      });
    });

    // Decans
    decans.forEach((decan: DecanEntry) => {
      const sign = signs.get(decan.signId);
      this.register({
        id: decan.id,
        type: 'decan',
        name: `${sign?.name || decan.signId} ${this.ordinal(decan.decanNumber)} Decan`,
        symbol: sign?.symbol,
        system: 'astrology',
        description: decan.description,
        routePath: `/signs/${decan.signId}#decan-${decan.decanNumber}`,
        data: decan,
        keywords: [decan.keyword, decan.degrees],
        relatedIds: [decan.signId, decan.rulerPlanetId, decan.subrulerSignId],
      });
    });

    // Dignities (Domicile, Exaltation, Detriment, Fall)
    dignities.forEach((dignity: DignityEntry) => {
      const planet = planets.get(dignity.planetId);
      const sign = signs.get(dignity.signId);
      this.register({
        id: dignity.id,
        type: 'dignity',
        name: `${planet?.name || dignity.planetId} in ${sign?.name || dignity.signId} (${dignity.dignityType})`,
        symbol: `${planet?.symbol || ''}${sign?.symbol || ''}`,
        system: 'astrology',
        description: dignity.description,
        routePath: `/dignities/${dignity.id}`,
        data: dignity,
        keywords: [dignity.dignityType],
        relatedIds: [dignity.planetId, dignity.signId],
      });
    });

    // Fixed Stars
    Array.from(fixedStars.values()).forEach((star) => {
      this.register({
        id: star.id,
        type: 'fixed-star',
        name: star.name,
        symbol: '✦',
        system: 'astrology',
        description: star.giftExpression || `A fixed star in ${star.constellation}`,
        routePath: `/fixed-stars/${star.id}`,
        data: star,
        keywords: [
          star.constellation,
          star.archetype || '',
          ...(star.keywords || []),
        ].filter(Boolean),
        relatedIds: star.zodiacPosition?.sign ? [star.zodiacPosition.sign] : [],
      });
    });
  }

  // ------------------------------------
  // Human Design Entities
  // ------------------------------------

  private registerHumanDesignEntities(): void {
    // HD Types
    hdTypes.forEach((hdType: HDTypeEntity, id: string) => {
      this.register({
        id,
        type: 'hd-type',
        name: hdType.name,
        symbol: hdType.symbol,
        system: 'humanDesign',
        description: hdType.description,
        image: hdType.image,
        routePath: `/human-design/types/${id}`,
        data: hdType,
        keywords: hdType.keywords,
        relatedIds: [hdType.strategyId, ...hdType.definedCenters],
      });
    });

    // HD Strategies
    hdStrategies.forEach((strategy: HDStrategyEntity, id: string) => {
      this.register({
        id,
        type: 'hd-strategy',
        name: strategy.name,
        symbol: strategy.symbol,
        system: 'humanDesign',
        description: strategy.description,
        image: strategy.image,
        routePath: `/human-design/strategies/${id}`,
        data: strategy,
        keywords: strategy.keywords,
        relatedIds: strategy.hdTypeIds,
      });
    });

    // HD Authorities
    hdAuthorities.forEach((authority: HDAuthorityEntity, id: string) => {
      this.register({
        id,
        type: 'hd-authority',
        name: authority.name,
        symbol: authority.symbol,
        system: 'humanDesign',
        description: authority.description,
        image: authority.image,
        routePath: `/human-design/authorities/${id}`,
        data: authority,
        keywords: authority.keywords,
        relatedIds: authority.centerId ? [authority.centerId] : [],
      });
    });

    // HD Centers
    hdCenters.forEach((center: HDCenter, id: string) => {
      this.register({
        id,
        type: 'hd-center',
        name: center.name,
        symbol: center.symbol,
        system: 'humanDesign',
        description: center.description,
        image: center.image,
        routePath: `/human-design/centers/${id}`,
        data: center,
        keywords: [center.centerType, center.biologicalCorrelate],
        relatedIds: center.gateIds,
      });
    });

    // HD Gates
    hdGates.forEach((gate: HDGate, id: string) => {
      this.register({
        id,
        type: 'hd-gate',
        name: gate.name,
        symbol: gate.symbol,
        system: 'humanDesign',
        description: gate.hdDefinition,
        image: gate.image,
        routePath: `/human-design/gates/${id}`,
        data: gate,
        keywords: gate.keywords,
        relatedIds: [gate.centerId, gate.geneKeyId, gate.channelGateId, gate.tropicalSignId].filter(Boolean) as string[],
      });
    });

    // HD Channels
    hdChannels.forEach((channel: HDChannel, id: string) => {
      this.register({
        id,
        type: 'hd-channel',
        name: channel.name,
        symbol: channel.symbol,
        system: 'humanDesign',
        description: channel.description,
        image: channel.image,
        routePath: `/human-design/channels/${id}`,
        data: channel,
        keywords: channel.keywords,
        relatedIds: [channel.gate1Id, channel.gate2Id, channel.center1Id, channel.center2Id],
      });
    });

    // HD Profiles
    hdProfiles.forEach((profile: HDProfileEntity, id: string) => {
      this.register({
        id,
        type: 'hd-profile',
        name: profile.name,
        symbol: profile.symbol,
        system: 'humanDesign',
        description: profile.description,
        image: profile.image,
        routePath: `/human-design/profiles/${id}`,
        data: profile,
        keywords: profile.keywords,
        relatedIds: [profile.personalityLineId, profile.designLineId],
      });
    });

    // HD Lines
    hdLines.forEach((line: HDLineEntity, id: string) => {
      this.register({
        id,
        type: 'hd-line',
        name: line.name,
        symbol: line.symbol,
        system: 'humanDesign',
        description: line.description,
        image: line.image,
        routePath: `/human-design/lines/${id}`,
        data: line,
        keywords: line.keywords,
      });
    });

    // HD Variables
    hdVariables.forEach((variable: HDVariableEntity, id: string) => {
      this.register({
        id,
        type: 'hd-variable',
        name: variable.name,
        symbol: variable.symbol,
        system: 'humanDesign',
        description: variable.description,
        image: variable.image,
        routePath: `/human-design/variables/${id}`,
        data: variable,
        keywords: [variable.category, variable.arrow],
      });
    });

    // Incarnation Crosses (manually registered)
    this.register({
      id: 'left-angle-cross-of-limitation',
      type: 'incarnation-cross',
      name: 'Left Angle Cross of Limitation',
      symbol: '✚',
      system: 'humanDesign',
      description: 'The Left Angle Cross of Limitation (Gates 32/42 | 56/60) carries the transpersonal karma of working with limits, structure, and the transformation of constraints into enduring foundations. It combines the energy of continuity and preservation (32), growth through completion (42), stimulation through storytelling (56), and acceptance of limitation as a gateway to transcendence (60).',
      data: {
        id: 'left-angle-cross-of-limitation',
        type: 'incarnation-cross',
        angle: 'Left Angle',
        name: 'Cross of Limitation',
        gates: [32, 42, 56, 60],
      },
      keywords: ['Limitation', 'Structure', 'Endurance', 'Transcendence', 'Transpersonal karma'],
      relatedIds: ['gate-32', 'gate-42', 'gate-56', 'gate-60'],
    });
  }

  // ------------------------------------
  // Gene Keys Entities
  // ------------------------------------

  private registerGeneKeysEntities(): void {
    // Gene Keys
    geneKeys.forEach((geneKey: GeneKey, id: string) => {
      this.register({
        id,
        type: 'gene-key',
        name: geneKey.name,
        symbol: geneKey.symbol,
        system: 'geneKeys',
        description: geneKey.description,
        image: geneKey.image,
        routePath: `/gene-keys/${id}`,
        data: geneKey,
        keywords: [
          geneKey.shadow.name,
          geneKey.gift.name,
          geneKey.siddhi.name,
        ],
        relatedIds: [
          geneKey.hdGateId,
          geneKey.programmingPartnerId,
          geneKey.codonRingId,
          geneKey.aminoAcidId,
          geneKey.tropicalSignId,
        ].filter(Boolean) as string[],
      });
    });

    // GK Spheres
    gkSpheres.forEach((sphere: GKSphereEntity, id: string) => {
      this.register({
        id,
        type: 'gk-sphere',
        name: sphere.name,
        symbol: sphere.symbol,
        system: 'geneKeys',
        description: sphere.description,
        image: sphere.image,
        routePath: `/gene-keys/spheres/${id}`,
        data: sphere,
        keywords: sphere.keywords,
        relatedIds: sphere.partnerSphere ? [sphere.partnerSphere] : [],
      });
    });

    // GK Lines
    gkLines.forEach((line: GKLineEntity, id: string) => {
      this.register({
        id,
        type: 'gk-line',
        name: line.name,
        symbol: line.symbol,
        system: 'geneKeys',
        description: line.description,
        image: line.image,
        routePath: `/gene-keys/lines/${id}`,
        data: line,
        keywords: line.keywords,
      });
    });

    // GK Sequences
    gkSequences.forEach((sequence: GKSequenceEntity, id: string) => {
      this.register({
        id,
        type: 'gk-sequence',
        name: sequence.name,
        symbol: sequence.symbol,
        system: 'geneKeys',
        description: sequence.description,
        image: sequence.image,
        routePath: `/gene-keys/sequences/${id}`,
        data: sequence,
        keywords: sequence.keywords,
        relatedIds: sequence.spheres,
      });
    });

    // Codon Rings
    codonRings.forEach((ring: CodonRing, id: string) => {
      this.register({
        id,
        type: 'codon-ring',
        name: ring.name,
        symbol: ring.symbol,
        system: 'geneKeys',
        description: ring.description,
        image: ring.image,
        routePath: `/gene-keys/codon-rings/${id}`,
        data: ring,
        keywords: ring.primaryThemes,
        relatedIds: ring.geneKeyIds,
      });
    });

    // Amino Acids
    aminoAcids.forEach((acid: AminoAcid, id: string) => {
      this.register({
        id,
        type: 'amino-acid',
        name: acid.name,
        symbol: acid.symbol,
        system: 'geneKeys',
        description: acid.description,
        image: acid.image,
        routePath: `/gene-keys/amino-acids/${id}`,
        data: acid,
        keywords: [acid.abbreviation],
        relatedIds: acid.codonRingId ? [acid.codonRingId] : [],
      });
    });
  }

  // ------------------------------------
  // Shared Entities (span multiple systems)
  // ------------------------------------

  private registerSharedEntities(): void {
    // Trigrams (used in I Ching, HD, and GK)
    trigrams.forEach((trigram: Trigram, id: string) => {
      this.register({
        id,
        type: 'trigram',
        name: trigram.name,
        symbol: trigram.symbol,
        system: 'shared',
        description: trigram.description,
        image: trigram.image,
        routePath: `/reference/trigrams/${id}`,
        data: trigram,
        keywords: [trigram.element, trigram.attribute],
      });
    });

    // Unified Lines (combining Gene Keys and Human Design perspectives)
    lines.forEach((line: Line, id: string) => {
      this.register({
        id,
        type: 'line',
        name: line.name,
        symbol: line.symbol,
        system: 'shared',
        description: line.summary,
        image: line.image,
        routePath: `/lines/${id}`,
        data: line,
        keywords: line.keywords,
        relatedIds: line.relatedLineId ? [line.relatedLineId] : [],
      });
    });
  }

  // ------------------------------------
  // Lost Octave Entities (Robert Comber 72-gate extended system)
  // ------------------------------------

  private registerLostOctaveEntities(): void {
    hdGates72.forEach((gate: HDGate72, id: string) => {
      const displayName = gate.name ?? `Segment ${gate.segmentNumber}`;
      this.register({
        id,
        type: 'lo-gate',
        name: displayName,
        system: 'humanDesign',
        description: gate.description ?? undefined,
        routePath: `/library/lost-octave/${id}`,
        data: gate,
        keywords: [
          gate.startSign,
          `segment-${gate.segmentNumber}`,
          gate.tropicalSignId,
        ],
        relatedIds: [`gate-${gate.overlapping64GateSegment}`],
      });
    });
  }

  // ------------------------------------
  // Wisdom Tradition Entities (cross-system)
  // ------------------------------------

  private registerWisdomTraditionEntities(): void {
    // Numerology Numbers (Adam Apollo harmonic system + Pythagorean life path)
    numerologyNumbers.forEach((num: NumerologyNumber, id: string) => {
      this.register({
        id,
        type: 'numerology-number',
        name: num.name,
        symbol: num.symbol,
        system: 'shared',
        description: num.harmonicTone,
        routePath: `/numerology/${id}`,
        data: num,
        keywords: [num.archetype, num.harmonicTone, ...num.keywords],
        relatedIds: [num.chakraId, num.planet].filter(Boolean) as string[],
      });
    });

    // Chakras (house-chakra correspondences via astrological alchemy)
    chakras.forEach((chakra: Chakra, id: string) => {
      this.register({
        id,
        type: 'chakra',
        name: chakra.name,
        symbol: chakra.symbol,
        system: 'shared',
        description: chakra.lifeTheme,
        routePath: `/chakras/${id}`,
        data: chakra,
        keywords: [chakra.sanskritName, chakra.archetype, chakra.element, ...chakra.keywords],
        relatedIds: [
          ...chakra.relatedSigns,
          ...chakra.relatedHDCenters,
        ],
      });
    });

    // Hermetic Principles (Kybalion)
    hermeticPrinciples.forEach((principle: HermeticPrinciple, id: string) => {
      this.register({
        id,
        type: 'hermetic-principle',
        name: principle.name,
        symbol: principle.symbol,
        system: 'shared',
        description: principle.essence,
        routePath: `/hermetic/${id}`,
        data: principle,
        keywords: [principle.latinName, principle.statement, ...principle.keywords],
        relatedIds: principle.relatedChakras,
      });
    });
  }

  // ------------------------------------
  // Registration Helper
  // ------------------------------------

  private register(entity: EntityInfo): void {
    // Store in main registry
    this.registry.set(entity.id, entity);

    // Index by system
    const systemSet = this.bySystem.get(entity.system);
    if (systemSet) {
      systemSet.add(entity.id);
    }

    // Index by category
    if (!this.byCategory.has(entity.type)) {
      this.byCategory.set(entity.type, new Set());
    }
    this.byCategory.get(entity.type)!.add(entity.id);

    // Build search index
    this.indexForSearch(entity);
  }

  private indexForSearch(entity: EntityInfo): void {
    const terms: string[] = [
      entity.id.toLowerCase(),
      entity.name.toLowerCase(),
    ];

    // Add symbol if present
    if (entity.symbol) {
      terms.push(entity.symbol.toLowerCase());
    }

    // Add keywords
    if (entity.keywords) {
      entity.keywords.forEach(kw => terms.push(kw.toLowerCase()));
    }

    // Index all terms
    terms.forEach(term => {
      // Index full term
      if (!this.searchIndex.has(term)) {
        this.searchIndex.set(term, new Set());
      }
      this.searchIndex.get(term)!.add(entity.id);

      // Index word fragments (for partial matching)
      term.split(/[\s\-_]+/).forEach(word => {
        if (word.length >= 2) {
          if (!this.searchIndex.has(word)) {
            this.searchIndex.set(word, new Set());
          }
          this.searchIndex.get(word)!.add(entity.id);
        }
      });
    });
  }

  // ------------------------------------
  // Ordinal Helper
  // ------------------------------------

  private ordinal(n: number): string {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  // ------------------------------------
  // Public API
  // ------------------------------------

  /**
   * Get an entity by its ID
   */
  get(id: string): EntityInfo | undefined {
    return this.registry.get(id);
  }

  /**
   * Check if an entity exists
   */
  has(id: string): boolean {
    return this.registry.has(id);
  }

  /**
   * Get all entities
   */
  getAll(): EntityInfo[] {
    return Array.from(this.registry.values());
  }

  /**
   * Get all entities for a specific system
   */
  getBySystem(system: EntitySystem): EntityInfo[] {
    const ids = this.bySystem.get(system);
    if (!ids) return [];
    return Array.from(ids).map(id => this.registry.get(id)!);
  }

  /**
   * Get all entities of a specific category/type
   */
  getByCategory(category: EntityCategory): EntityInfo[] {
    const ids = this.byCategory.get(category);
    if (!ids) return [];
    return Array.from(ids).map(id => this.registry.get(id)!);
  }

  /**
   * Search entities by query string
   * Returns entities matching the query in name, symbol, or keywords
   */
  search(query: string, options?: {
    system?: EntitySystem;
    category?: EntityCategory;
    limit?: number;
  }): EntityInfo[] {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return [];

    // Collect matching entity IDs
    const matchingIds = new Set<string>();

    // Direct search index lookup
    this.searchIndex.forEach((entityIds, term) => {
      if (term.includes(normalizedQuery) || normalizedQuery.includes(term)) {
        entityIds.forEach(id => matchingIds.add(id));
      }
    });

    // Also do fuzzy matching on entity names
    this.registry.forEach((entity, id) => {
      if (entity.name.toLowerCase().includes(normalizedQuery)) {
        matchingIds.add(id);
      }
    });

    // Convert to entities and filter
    let results = Array.from(matchingIds)
      .map(id => this.registry.get(id)!)
      .filter(Boolean);

    // Apply filters
    if (options?.system) {
      results = results.filter(e => e.system === options.system);
    }
    if (options?.category) {
      results = results.filter(e => e.type === options.category);
    }

    // Sort by relevance (exact matches first, then by name length)
    results.sort((a, b) => {
      const aExact = a.name.toLowerCase() === normalizedQuery || a.id === normalizedQuery;
      const bExact = b.name.toLowerCase() === normalizedQuery || b.id === normalizedQuery;
      if (aExact && !bExact) return -1;
      if (bExact && !aExact) return 1;

      const aStartsWith = a.name.toLowerCase().startsWith(normalizedQuery);
      const bStartsWith = b.name.toLowerCase().startsWith(normalizedQuery);
      if (aStartsWith && !bStartsWith) return -1;
      if (bStartsWith && !aStartsWith) return 1;

      return a.name.length - b.name.length;
    });

    // Apply limit
    if (options?.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  /**
   * Get related entities for a given entity
   */
  getRelated(id: string): EntityInfo[] {
    const entity = this.registry.get(id);
    if (!entity?.relatedIds) return [];

    return entity.relatedIds
      .map(relId => this.registry.get(relId))
      .filter((e): e is EntityInfo => e !== undefined);
  }

  /**
   * Get statistics about the registry
   */
  getStats(): {
    total: number;
    bySystem: Record<EntitySystem, number>;
    byCategory: Record<string, number>;
  } {
    const bySystem: Record<EntitySystem, number> = {
      astrology: 0,
      humanDesign: 0,
      geneKeys: 0,
      shared: 0,
    };

    const byCategory: Record<string, number> = {};

    this.registry.forEach(entity => {
      bySystem[entity.system]++;
      byCategory[entity.type] = (byCategory[entity.type] || 0) + 1;
    });

    return {
      total: this.registry.size,
      bySystem,
      byCategory,
    };
  }

  /**
   * Get all entity IDs (for validation/autocomplete)
   */
  getAllIds(): string[] {
    return Array.from(this.registry.keys());
  }

  /**
   * Get entities by multiple IDs
   */
  getMany(ids: string[]): EntityInfo[] {
    return ids
      .map(id => this.registry.get(id))
      .filter((e): e is EntityInfo => e !== undefined);
  }

  // ------------------------------------
  // Profile Entity Management
  // ------------------------------------

  /**
   * Register a cosmic profile's natal placements and aspects as entities
   * This enables bidirectional navigation between universal entities and personal data
   */
  registerProfile(profile: CosmicProfile): void {
    // Clear any existing profile entities
    if (this.currentProfileId) {
      this.unregisterProfile();
    }

    this.currentProfileId = profile.meta?.id || 'default-profile';

    // Register all profile entity types
    this.registerAstrologyPlacements(profile);
    this.registerAstrologyAspects(profile);
    this.registerAstrologyConfigurations(profile);
    this.registerGeneKeysPlacements(profile);
    this.registerHDPlacements(profile);
    this.registerHDChannels(profile);

    console.log(`[EntityRegistry] Registered profile "${this.currentProfileId}" with ${this.profileEntities.size} entities`);
  }

  // ------------------------------------
  // Profile Entity Registration Methods
  // ------------------------------------

  private registerAstrologyPlacements(profile: CosmicProfile): void {
    if (!profile.placements) return;
    const profileId = this.currentProfileId!;

    for (const placement of profile.placements) {
      const planet = this.registry.get(placement.planetId);
      const sign = this.registry.get(placement.signId);
      const house = this.registry.get(placement.houseId);

      // Determine cross-system connections (GK number = HD gate number for same degree range)
      const geneKeyNumber = this.getGeneKeyNumberForDegree(placement.signId, placement.degree);

      const entityId = `${profileId}:placement:${placement.planetId}`;
      const relatedIds = [
        placement.planetId,
        placement.signId,
        placement.houseId,
        placement.decanId,
        placement.dignityId,
      ].filter(Boolean) as string[];

      const placementEntity: AstrologyPlacementEntity = {
        id: entityId,
        profileId,
        entityType: 'profile-placement',
        displayName: `${planet?.name || placement.planetId} in ${sign?.name || placement.signId} in ${house?.name || placement.houseId}`,
        shortName: placement.fullName || `${planet?.name || placement.planetId} in ${sign?.name || placement.signId}`,
        relatedEntityIds: relatedIds,
        planetId: placement.planetId,
        signId: placement.signId,
        houseId: placement.houseId,
        degree: placement.degree,
        minute: placement.minute,
        retrograde: placement.retrograde,
        dignityId: placement.dignityId,
        decanId: placement.decanId,
        isChartRuler: placement.isChartRuler,
        geneKeyNumber,
        hdGateNumber: geneKeyNumber, // Same as GK number
      };

      const entity: EntityInfo = {
        id: entityId,
        type: 'profile-placement',
        name: placementEntity.shortName,
        symbol: planet?.symbol,
        system: 'astrology',
        description: `${planet?.name || placement.planetId} at ${placement.degree}°${placement.minute}' ${sign?.name || placement.signId} in the ${house?.name || placement.houseId}`,
        routePath: `/profile/astrology/placements/${placement.planetId}`,
        data: placementEntity,
        keywords: [placement.signId, placement.houseId, placement.planetId],
        relatedIds,
      };

      this.profileEntities.set(entityId, entity);
    }
  }

  private registerAstrologyAspects(profile: CosmicProfile): void {
    if (!profile.aspects?.planetary) return;
    const profileId = this.currentProfileId!;

    for (const aspect of profile.aspects.planetary) {
      const aspectType = this.registry.get(aspect.aspectId);
      const planet1 = this.registry.get(aspect.planet1Id);
      const planet2 = this.registry.get(aspect.planet2Id);

      const entityId = `${profileId}:aspect:${aspect.planet1Id}-${aspect.aspectId}-${aspect.planet2Id}`;
      const relatedIds = [
        aspect.aspectId,
        aspect.planet1Id,
        aspect.planet2Id,
        `${profileId}:placement:${aspect.planet1Id}`,
        `${profileId}:placement:${aspect.planet2Id}`,
      ];

      const aspectEntity: ProfileAspectEntity = {
        id: entityId,
        profileId,
        entityType: 'profile-aspect',
        displayName: `${planet1?.name || aspect.planet1Id} ${aspectType?.name || aspect.aspectId} ${planet2?.name || aspect.planet2Id}`,
        shortName: `${planet1?.symbol || aspect.planet1Id} ${aspectType?.symbol || ''} ${planet2?.symbol || aspect.planet2Id}`,
        relatedEntityIds: relatedIds,
        aspectId: aspect.aspectId,
        placement1Id: `${profileId}:placement:${aspect.planet1Id}`,
        placement2Id: `${profileId}:placement:${aspect.planet2Id}`,
        planet1Id: aspect.planet1Id,
        planet2Id: aspect.planet2Id,
        orbDegree: aspect.orbDegree,
        orbMinute: aspect.orbMinute,
        direction: aspect.direction,
        nature: this.getAspectNature(aspect.aspectId),
      };

      const entity: EntityInfo = {
        id: entityId,
        type: 'profile-aspect',
        name: aspectEntity.displayName,
        symbol: aspectType?.symbol,
        system: 'astrology',
        description: `${aspectType?.name || aspect.aspectId} with orb ${aspect.orbDegree}°${aspect.orbMinute}'`,
        routePath: `/profile/astrology/aspects/${aspect.planet1Id}-${aspect.planet2Id}`,
        data: aspectEntity,
        keywords: [aspect.aspectId, aspect.planet1Id, aspect.planet2Id],
        relatedIds,
      };

      this.profileEntities.set(entityId, entity);
    }
  }

  private registerAstrologyConfigurations(profile: CosmicProfile): void {
    if (!profile.configurations) return;
    const profileId = this.currentProfileId!;

    profile.configurations.forEach((config: NatalConfiguration, index: number) => {
      const configType = this.registry.get(config.configurationId);

      // Derive planet IDs from placement IDs
      const planetIds: string[] = [];
      const signIds: string[] = [];

      for (const placementId of config.placementIds) {
        const placement = profile.placements?.find(p => p.id === placementId);
        if (placement) {
          planetIds.push(placement.planetId);
          signIds.push(placement.signId);
        }
      }

      const involvedPlanets = planetIds.map(id => this.registry.get(id)).filter(Boolean);

      const entityId = `${profileId}:config:${config.configurationId}:${index}`;
      const relatedIds = [
        config.configurationId,
        ...planetIds,
        ...signIds,
        ...config.placementIds.map((id: string) => `${profileId}:placement:${id.split(':').pop()}`),
      ];

      const configEntity: ProfileConfigurationEntity = {
        id: entityId,
        profileId,
        entityType: 'profile-configuration',
        displayName: config.fullName || `${configType?.name || config.configurationId}`,
        shortName: config.fullName || `${configType?.name || config.configurationId}`,
        relatedEntityIds: relatedIds,
        configurationId: config.configurationId,
        configurationType: config.configurationId,
        configurationName: config.fullName || configType?.name || config.configurationId,
        placementIds: config.placementIds.map((id: string) => `${profileId}:placement:${id.split(':').pop()}`),
        planetIds,
        signIds,
      };

      const entity: EntityInfo = {
        id: entityId,
        type: 'profile-configuration',
        name: configEntity.displayName,
        symbol: configType?.symbol,
        system: 'astrology',
        description: `${configType?.name || config.configurationId} involving ${involvedPlanets.map(p => p?.name).join(', ')}`,
        routePath: `/profile/astrology/configurations/${config.configurationId}`,
        data: configEntity,
        keywords: [config.configurationId, ...planetIds],
        relatedIds,
      };

      this.profileEntities.set(entityId, entity);
    });
  }

  private registerGeneKeysPlacements(profile: CosmicProfile): void {
    const gkProfile = profile.geneKeysProfile;
    if (!gkProfile) return;
    const profileId = this.currentProfileId!;

    // Sphere definitions with their sequence
    const sphereDefinitions = [
      // Activation Sequence
      { key: 'lifesWork', sphere: gkProfile.lifesWork, sequence: 'activation-sequence' },
      { key: 'evolution', sphere: gkProfile.evolution, sequence: 'activation-sequence' },
      { key: 'radiance', sphere: gkProfile.radiance, sequence: 'activation-sequence' },
      { key: 'purpose', sphere: gkProfile.purpose, sequence: 'activation-sequence' },
      // Venus Sequence
      { key: 'attraction', sphere: gkProfile.attraction, sequence: 'venus-sequence' },
      { key: 'iq', sphere: gkProfile.iq, sequence: 'venus-sequence' },
      { key: 'eq', sphere: gkProfile.eq, sequence: 'venus-sequence' },
      { key: 'sq', sphere: gkProfile.sq, sequence: 'venus-sequence' },
      { key: 'core', sphere: gkProfile.core, sequence: 'venus-sequence' },
      // Pearl Sequence
      { key: 'vocation', sphere: gkProfile.vocation, sequence: 'pearl-sequence' },
      { key: 'culture', sphere: gkProfile.culture, sequence: 'pearl-sequence' },
      { key: 'pearl', sphere: gkProfile.pearl, sequence: 'pearl-sequence' },
      // Optional spheres
      { key: 'brand', sphere: gkProfile.brand, sequence: 'activation-sequence' },
      { key: 'creativity', sphere: gkProfile.creativity, sequence: 'pearl-sequence' },
      { key: 'relating', sphere: gkProfile.relating, sequence: 'venus-sequence' },
      { key: 'stability', sphere: gkProfile.stability, sequence: 'pearl-sequence' },
    ];

    for (const { key, sphere, sequence } of sphereDefinitions) {
      if (!sphere) continue;

      const geneKey = geneKeys.get(`gk-${sphere.geneKeyNumber}`);

      // Determine planetary source info
      const isPersonality = sphere.planetarySource?.startsWith('Natal') || false;
      const sourcePlanetName = sphere.planetarySource?.replace(/^(Natal|Design)\s+/, '').toLowerCase();

      const entityId = `${profileId}:gk:${key}`;
      const relatedIds = [
        `gk-${sphere.geneKeyNumber}`,
        `line-${sphere.line}`,
        `gk-sphere-${key}`,
        sequence,
        sourcePlanetName,
      ].filter(Boolean) as string[];

      const gkPlacement: GeneKeysPlacementEntity = {
        id: entityId,
        profileId,
        entityType: 'profile-gk-placement',
        displayName: `${sphere.sphereName}: Gene Key ${sphere.geneKeyNumber}.${sphere.line}`,
        shortName: `GK ${sphere.geneKeyNumber}.${sphere.line}`,
        relatedEntityIds: relatedIds,
        sphereId: `gk-sphere-${key}`,
        sphereKey: key,
        sphereName: sphere.sphereName,
        sequenceId: sequence,
        geneKeyId: `gk-${sphere.geneKeyNumber}`,
        geneKeyNumber: sphere.geneKeyNumber,
        lineNumber: sphere.line,
        lineId: `line-${sphere.line}`,
        planetarySource: sphere.planetarySource,
        isPersonality,
        shadow: geneKey?.shadow || { name: '', description: '' },
        gift: geneKey?.gift || { name: '', description: '' },
        siddhi: geneKey?.siddhi || { name: '', description: '' },
        sourcePlanetId: sourcePlanetName,
      };

      const entity: EntityInfo = {
        id: entityId,
        type: 'profile-gk-placement',
        name: gkPlacement.displayName,
        symbol: geneKey?.symbol,
        system: 'geneKeys',
        description: `${sphere.sphereName} sphere with ${geneKey?.name || 'Gene Key ' + sphere.geneKeyNumber} (${geneKey?.shadow.name} → ${geneKey?.gift.name} → ${geneKey?.siddhi.name})`,
        routePath: `/profile/gene-keys/${key}`,
        data: gkPlacement,
        keywords: [
          sphere.sphereName,
          `gk${sphere.geneKeyNumber}`,
          geneKey?.shadow.name,
          geneKey?.gift.name,
          geneKey?.siddhi.name,
        ].filter(Boolean) as string[],
        relatedIds,
      };

      this.profileEntities.set(entityId, entity);
    }
  }

  private registerHDPlacements(profile: CosmicProfile): void {
    const hdProfile = profile.humanDesignProfile;
    if (!hdProfile) return;
    const profileId = this.currentProfileId!;

    // Register Personality Gates (conscious)
    if (hdProfile.personalityGates) {
      for (const gate of hdProfile.personalityGates) {
        this.registerSingleHDPlacement(gate, true, hdProfile, profileId);
      }
    }

    // Register Design Gates (unconscious)
    if (hdProfile.designGates) {
      for (const gate of hdProfile.designGates) {
        this.registerSingleHDPlacement(gate, false, hdProfile, profileId);
      }
    }
  }

  private registerSingleHDPlacement(
    gate: HDGateActivation,
    isPersonality: boolean,
    hdProfile: HumanDesignProfile,
    profileId: string
  ): void {
    const gateData = hdGates.get(`gate-${gate.gateNumber}`);
    const lineData = lines.get(`line-${gate.line}`);
    const centerData = gateData?.centerId ? hdCenters.get(gateData.centerId) : undefined;

    // Check if this gate completes a channel
    const channelInfo = this.findChannelForGate(gate.gateNumber, hdProfile);

    const entityId = `${profileId}:hd:${gate.gateNumber}.${gate.line}:${isPersonality ? 'personality' : 'design'}`;
    const relatedIds = [
      `gate-${gate.gateNumber}`,
      `line-${gate.line}`,
      gateData?.centerId,
      gate.planet?.toLowerCase(),
      `gk-${gate.gateNumber}`, // Cross-system: Gene Key with same number
    ].filter(Boolean) as string[];

    const hdPlacement: HDPlacementEntity = {
      id: entityId,
      profileId,
      entityType: 'profile-hd-placement',
      displayName: `Gate ${gate.gateNumber}.${gate.line} (${isPersonality ? 'Personality' : 'Design'})`,
      shortName: `${gate.gateNumber}.${gate.line}`,
      relatedEntityIds: relatedIds,
      gateId: `gate-${gate.gateNumber}`,
      gateNumber: gate.gateNumber,
      lineNumber: gate.line,
      lineId: `line-${gate.line}`,
      centerId: gateData?.centerId || '',
      planetId: gate.planet?.toLowerCase(),
      isPersonality,
      isChannelComplete: channelInfo.isComplete,
      channelId: channelInfo.channelId,
      partnerGateId: channelInfo.partnerGateId,
      geneKeyId: `gk-${gate.gateNumber}`,
    };

    const entity: EntityInfo = {
      id: entityId,
      type: 'profile-hd-placement',
      name: hdPlacement.displayName,
      symbol: gateData?.symbol,
      system: 'humanDesign',
      description: `${gateData?.name || 'Gate ' + gate.gateNumber} - Line ${gate.line} (${lineData?.archetype || ''})`,
      routePath: `/profile/human-design/gates/${gate.gateNumber}`,
      data: hdPlacement,
      keywords: [
        `gate${gate.gateNumber}`,
        lineData?.archetype,
        centerData?.name,
        isPersonality ? 'conscious' : 'unconscious',
        gate.planet,
      ].filter(Boolean) as string[],
      relatedIds,
    };

    this.profileEntities.set(entityId, entity);
  }

  private registerHDChannels(profile: CosmicProfile): void {
    const hdProfile = profile.humanDesignProfile;
    if (!hdProfile?.definedChannelIds) return;
    const profileId = this.currentProfileId!;

    for (const channelId of hdProfile.definedChannelIds) {
      const channel = hdChannels.get(channelId);
      if (!channel) continue;

      // Find the gate placements that form this channel
      const gate1Num = parseInt(channel.gate1Id.replace('gate-', ''));
      const gate2Num = parseInt(channel.gate2Id.replace('gate-', ''));

      const entityId = `${profileId}:channel:${gate1Num}-${gate2Num}`;
      const relatedIds = [
        channelId,
        channel.gate1Id,
        channel.gate2Id,
        channel.center1Id,
        channel.center2Id,
      ];

      const channelEntity: ProfileChannelEntity = {
        id: entityId,
        profileId,
        entityType: 'profile-channel',
        displayName: channel.name,
        shortName: `${gate1Num}-${gate2Num}`,
        relatedEntityIds: relatedIds,
        channelId,
        gate1Number: gate1Num,
        gate2Number: gate2Num,
        gate1PlacementId: this.findHDPlacementForGate(gate1Num, profileId) || '',
        gate2PlacementId: this.findHDPlacementForGate(gate2Num, profileId) || '',
        center1Id: channel.center1Id,
        center2Id: channel.center2Id,
        circuitType: channel.circuitType || '',
        channelType: channel.streamType || '',
        channelTheme: channel.theme || channel.name,
      };

      const entity: EntityInfo = {
        id: entityId,
        type: 'profile-channel',
        name: channelEntity.displayName,
        symbol: channel.symbol,
        system: 'humanDesign',
        description: channel.description,
        routePath: `/profile/human-design/channels/${gate1Num}-${gate2Num}`,
        data: channelEntity,
        keywords: [channel.circuitType, channel.streamType].filter(Boolean) as string[],
        relatedIds,
      };

      this.profileEntities.set(entityId, entity);
    }
  }

  // ------------------------------------
  // Profile Entity Helper Methods
  // ------------------------------------

  private findChannelForGate(gateNumber: number, hdProfile: HumanDesignProfile): {
    isComplete: boolean;
    channelId?: string;
    partnerGateId?: string;
  } {
    // Get the gate data to find its channel partner
    const gateData = hdGates.get(`gate-${gateNumber}`);
    if (!gateData?.channelGateId) return { isComplete: false };

    const partnerGateNumber = parseInt(gateData.channelGateId.replace('gate-', ''));

    // Check if partner gate is activated (in either personality or design)
    const allGates = [
      ...(hdProfile.personalityGates || []),
      ...(hdProfile.designGates || []),
    ];

    const partnerActivated = allGates.some(g => g.gateNumber === partnerGateNumber);

    if (partnerActivated) {
      // Find the channel ID
      const channelId = hdProfile.definedChannelIds?.find(id => {
        const channel = hdChannels.get(id);
        if (!channel) return false;
        const g1 = parseInt(channel.gate1Id.replace('gate-', ''));
        const g2 = parseInt(channel.gate2Id.replace('gate-', ''));
        return (g1 === gateNumber && g2 === partnerGateNumber) ||
               (g2 === gateNumber && g1 === partnerGateNumber);
      });

      return {
        isComplete: true,
        channelId,
        partnerGateId: `gate-${partnerGateNumber}`,
      };
    }

    return {
      isComplete: false,
      partnerGateId: `gate-${partnerGateNumber}`,
    };
  }

  private findHDPlacementForGate(gateNumber: number, profileId: string): string | undefined {
    // Check personality first, then design
    const personalityId = `${profileId}:hd:${gateNumber}.`;
    const designId = `${profileId}:hd:${gateNumber}.`;

    for (const [id] of this.profileEntities) {
      if (id.startsWith(personalityId) && id.includes(':personality')) {
        return id;
      }
      if (id.startsWith(designId) && id.includes(':design')) {
        return id;
      }
    }
    return undefined;
  }

  private getGeneKeyNumberForDegree(signId: string, degree: number): number | undefined {
    // Each Gene Key spans ~5.625° of the zodiac
    // This is a simplified calculation - in reality you'd look up the actual wheel
    const signOrder: Record<string, number> = {
      aries: 0, taurus: 1, gemini: 2, cancer: 3,
      leo: 4, virgo: 5, libra: 6, scorpio: 7,
      sagittarius: 8, capricorn: 9, aquarius: 10, pisces: 11,
    };

    const signIndex = signOrder[signId] || 0;
    const totalDegrees = signIndex * 30 + degree;
    const gateIndex = Math.floor(totalDegrees / 5.625);

    // Gene Keys 1-64 (adjusted for wheel starting point)
    return ((gateIndex + 41) % 64) + 1; // Wheel starts at Gate 41
  }

  private getAspectNature(aspectId: string): 'harmonious' | 'challenging' | 'neutral' {
    const harmonious = ['trine', 'sextile'];
    const challenging = ['square', 'opposition', 'quincunx'];

    if (harmonious.includes(aspectId)) return 'harmonious';
    if (challenging.includes(aspectId)) return 'challenging';
    return 'neutral';
  }

  // ------------------------------------
  // Personal Context Entity Management
  // ------------------------------------

  /**
   * Register occupation and active projects from PersonalContext as clickable entities.
   * Clears any previously registered pc-* entities first so this is idempotent.
   */
  registerPersonalContextEntities(ctx: PersonalContext | undefined): void {
    // Remove any previously registered personal context entities
    for (const id of Array.from(this.profileEntities.keys())) {
      if (id.startsWith('pc-')) {
        this.profileEntities.delete(id);
      }
    }

    if (!ctx) return;

    // Occupation entity
    if (ctx.occupations && ctx.occupations.length > 0) {
      const occEntity: EntityInfo = {
        id: 'pc-occupation',
        type: 'occupation',
        name: ctx.occupations.join(', '),
        system: 'shared',
        description: ctx.professionalGoals || ctx.occupations.join(', '),
        routePath: '/profile/personal-context',
        data: ctx,
        keywords: [...ctx.occupations, ...(ctx.specializations || [])],
      };
      this.profileEntities.set('pc-occupation', occEntity);
    }

    // Project entities
    for (const project of ctx.activeProjects || []) {
      const projEntity: EntityInfo = {
        id: `pc-project-${project.id}`,
        type: 'personal-project',
        name: project.name,
        system: 'shared',
        description: project.description || project.name,
        routePath: '/profile/personal-context',
        data: project,
        keywords: [project.status || '', project.linkedKeyArea || ''].filter(Boolean),
      };
      this.profileEntities.set(`pc-project-${project.id}`, projEntity);
    }
  }

  /**
   * Unregister the current profile's entities
   */
  unregisterProfile(): void {
    if (this.currentProfileId) {
      console.log(`[EntityRegistry] Unregistering profile "${this.currentProfileId}"`);
      this.profileEntities.clear();
      this.currentProfileId = null;
    }
  }

  /**
   * Get the current registered profile ID
   */
  getCurrentProfileId(): string | null {
    return this.currentProfileId;
  }

  /**
   * Get a profile entity by ID
   */
  getProfileEntity(entityId: string): EntityInfo | undefined {
    const entity = this.profileEntities.get(entityId);
    if (!entity) {
      console.log(`[EntityRegistry] Profile entity lookup FAILED for: "${entityId}"`);
      console.log(`[EntityRegistry] Current profile ID: "${this.currentProfileId}"`);
      console.log(`[EntityRegistry] Available profile entities:`, Array.from(this.profileEntities.keys()).slice(0, 10));
    }
    return entity;
  }

  /**
   * Get all profile entities
   */
  getAllProfileEntities(): EntityInfo[] {
    return Array.from(this.profileEntities.values());
  }

  /**
   * Get all astrology placements for the current profile
   */
  getProfilePlacements(): EntityInfo[] {
    return Array.from(this.profileEntities.values())
      .filter(e => e.type === 'profile-placement' || e.type === 'natal-placement');
  }

  /**
   * Get all natal aspects for the current profile
   */
  getProfileAspects(): EntityInfo[] {
    return Array.from(this.profileEntities.values())
      .filter(e => e.type === 'profile-aspect' || e.type === 'natal-aspect');
  }

  /**
   * Get all Gene Keys placements for the current profile
   */
  getProfileGKPlacements(): EntityInfo[] {
    return Array.from(this.profileEntities.values())
      .filter(e => e.type === 'profile-gk-placement');
  }

  /**
   * Get all Human Design placements for the current profile
   */
  getProfileHDPlacements(): EntityInfo[] {
    return Array.from(this.profileEntities.values())
      .filter(e => e.type === 'profile-hd-placement');
  }

  /**
   * Get all defined channels for the current profile
   */
  getProfileChannels(): EntityInfo[] {
    return Array.from(this.profileEntities.values())
      .filter(e => e.type === 'profile-channel');
  }

  /**
   * Get all configurations for the current profile
   */
  getProfileConfigurations(): EntityInfo[] {
    return Array.from(this.profileEntities.values())
      .filter(e => e.type === 'profile-configuration');
  }

  /**
   * Get a Gene Keys placement by sphere key
   */
  getGKPlacementBySphere(sphereKey: string): EntityInfo | undefined {
    const profileId = this.currentProfileId;
    if (!profileId) return undefined;
    return this.profileEntities.get(`${profileId}:gk:${sphereKey}`);
  }

  /**
   * Get an HD placement by gate number and type
   */
  getHDPlacementByGate(gateNumber: number, type: 'personality' | 'design'): EntityInfo | undefined {
    const profileId = this.currentProfileId;
    if (!profileId) return undefined;

    // Need to find by prefix since line number varies
    for (const [id, entity] of this.profileEntities) {
      if (id.startsWith(`${profileId}:hd:${gateNumber}.`) && id.endsWith(`:${type}`)) {
        return entity;
      }
    }
    return undefined;
  }

  /**
   * Get placements in a specific sign
   * Enables "Your Placements in Scorpio" type queries
   */
  getPlacementsInSign(signId: string): EntityInfo[] {
    return Array.from(this.profileEntities.values())
      .filter(e => e.type === 'profile-placement')
      .filter(e => {
        const placement = e.data as NatalPlacement;
        return placement.signId === signId;
      });
  }

  /**
   * Get placements in a specific house
   */
  getPlacementsInHouse(houseId: string): EntityInfo[] {
    return Array.from(this.profileEntities.values())
      .filter(e => e.type === 'profile-placement')
      .filter(e => {
        const placement = e.data as NatalPlacement;
        return placement.houseId === houseId;
      });
  }

  /**
   * Get aspects involving a specific planet
   */
  getAspectsInvolving(planetId: string): EntityInfo[] {
    return Array.from(this.profileEntities.values())
      .filter(e => e.type === 'profile-aspect')
      .filter(e => {
        const aspect = e.data as NatalAspect;
        return aspect.planet1Id === planetId || aspect.planet2Id === planetId;
      });
  }

  /**
   * Get aspects of a specific type (e.g., all conjunctions)
   */
  getAspectsByType(aspectId: string): EntityInfo[] {
    return Array.from(this.profileEntities.values())
      .filter(e => e.type === 'profile-aspect')
      .filter(e => {
        const aspect = e.data as NatalAspect;
        return aspect.aspectId === aspectId;
      });
  }

  /**
   * Enhanced get that also checks profile entities
   */
  getWithProfile(id: string): EntityInfo | undefined {
    // First check universal entities
    const universal = this.registry.get(id);
    if (universal) return universal;

    // Then check profile entities
    return this.profileEntities.get(id);
  }
}

// ------------------------------------
// Singleton Export
// ------------------------------------

export const entityRegistry = new EntityRegistryService();

// Convenience exports
// Use getWithProfile to check both static registry and profile entities
export const getEntity = (id: string) => entityRegistry.getWithProfile(id);
export const hasEntity = (id: string) => entityRegistry.has(id);
export const searchEntities = (query: string, options?: Parameters<typeof entityRegistry.search>[1]) =>
  entityRegistry.search(query, options);
export const getEntitiesBySystem = (system: EntitySystem) => entityRegistry.getBySystem(system);
export const getEntitiesByCategory = (category: EntityCategory) => entityRegistry.getByCategory(category);
export const getRelatedEntities = (id: string) => entityRegistry.getRelated(id);
export const getEntityStats = () => entityRegistry.getStats();

// Profile entity convenience exports
export const registerProfile = (profile: CosmicProfile) => entityRegistry.registerProfile(profile);
export const unregisterProfile = () => entityRegistry.unregisterProfile();
export const getProfileEntity = (id: string) => entityRegistry.getProfileEntity(id);
export const getCurrentProfileId = () => entityRegistry.getCurrentProfileId();
export const getAllProfileEntities = () => entityRegistry.getAllProfileEntities();
export const getProfilePlacements = () => entityRegistry.getProfilePlacements();
export const getProfileAspects = () => entityRegistry.getProfileAspects();
export const getProfileGKPlacements = () => entityRegistry.getProfileGKPlacements();
export const getProfileHDPlacements = () => entityRegistry.getProfileHDPlacements();
export const getProfileChannels = () => entityRegistry.getProfileChannels();
export const getProfileConfigurations = () => entityRegistry.getProfileConfigurations();
export const getGKPlacementBySphere = (sphereKey: string) => entityRegistry.getGKPlacementBySphere(sphereKey);
export const getHDPlacementByGate = (gateNumber: number, type: 'personality' | 'design') =>
  entityRegistry.getHDPlacementByGate(gateNumber, type);
export const getPlacementsInSign = (signId: string) => entityRegistry.getPlacementsInSign(signId);
export const getPlacementsInHouse = (houseId: string) => entityRegistry.getPlacementsInHouse(houseId);
export const getAspectsInvolving = (planetId: string) => entityRegistry.getAspectsInvolving(planetId);
export const getAspectsByType = (aspectId: string) => entityRegistry.getAspectsByType(aspectId);
export const getEntityWithProfile = (id: string) => entityRegistry.getWithProfile(id);
export const registerPersonalContextEntities = (ctx: PersonalContext | undefined) =>
  entityRegistry.registerPersonalContextEntities(ctx);
