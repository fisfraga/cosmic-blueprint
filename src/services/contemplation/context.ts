// Context builder for Contemplation Chamber AI
// Full Chart Context Architecture - Harmonic Resonance
import type { AstroProfile, NatalPlacement, NatalAspect, NumerologyProfile, ChakraActivation, AlchemicalProfile, Element, PersonalContext } from '../../types';
import { planets, signs, houses, aspects, elements, geneKeys, hdGates, hdCenters, hdChannels, hdProfiles, lines, chakras, codonRings, aminoAcids, numerologyNumbers, getGateByDegree } from '../../data';
import { getFixedStarConjunctions } from '../fixedStars';
import { getGalacticConjunctions, getGalacticTransitActivations, type GalacticConjunction } from '../galacticAstrology';
import { calculateTransitNatalAspects, type TransitNatalAspect } from '../transitAspects';
import { getPlanetaryPositions, longitudeToZodiac } from '../ephemeris';
import { getCosmicWeather } from '../transits';
import { formatILOSContextForCategory } from './ilos';
import { getRelevantExcerpts, formatExcerptsForContext } from '../../data/knowledge';

export type ContemplationCategory =
  | 'astrology' | 'humanDesign' | 'geneKeys' | 'crossSystem' | 'lifeOS'
  | 'alchemy'             // Refocused: chakras + hermetic alchemy only
  | 'numerology'          // Split from alchemy: Life Path + Numerology Overview
  | 'cosmicEmbodiment'    // Promoted from crossSystem: any energy speaks directly
  | 'fixedStars'          // Exposed from service layer
  | 'galacticAstrology';  // Sprint R: galactic center, great attractor, SGC, GAC

export type ContemplationType =
  // Astrology
  | 'natalOverview'
  | 'placementDeepDive'
  | 'placementOverview'
  | 'aspectExploration'
  | 'aspectOverview'
  | 'configurationReading'
  | 'elementalBalance'
  | 'transitOverview'
  | 'transitReading'
  // Human Design
  | 'typeStrategy'
  | 'authorityCheckIn'
  | 'gateContemplation'
  | 'gateOverview'
  | 'channelExploration'
  | 'channelOverview'
  | 'centerAwareness'
  | 'centerOverview'
  | 'profileExploration'
  // Gene Keys
  | 'activationSequence'
  | 'venusSequence'
  | 'pearlSequence'
  | 'shadowWork'
  | 'shadowOverview'
  | 'giftActivation'
  | 'giftOverview'
  | 'siddhiContemplation'
  | 'siddhiOverview'
  // Cross-system
  | 'gateKeyBridge'
  | 'gateKeyOverview'
  | 'planetSphereSynthesis'
  | 'holisticReading'
  | 'cosmicEmbodiment'
  | 'elementalSystemBridge'
  | 'lifePathSynthesis'
  // Life OS
  | 'lifeAreaAlignment'
  | 'goalCosmicContext'
  | 'purposeReview'
  // Life OS — Julia Balaz + ILOS expansion (Sprint T)
  | 'lifePurposeReading'
  | 'idealSelfBlueprint'
  | 'shadowToLightReading'
  | 'careerPathReading'
  | 'transitPlanningMap'
  | 'soulCallingIntegration'
  | 'vperPhaseReading'
  // Life OS — ILOS Elemental VPER expansion (Sprint U)
  | 'elementalProfileReading'
  | 'oppositePolePractice'
  // Alchemy & Numbers
  | 'numerologyReading'
  | 'numerologyOverview'
  | 'chakraAwareness'
  | 'alchemicalMapping'
  // Fixed Stars
  | 'fixedStarProfile'
  | 'fixedStarConjunction'
  | 'fixedStarTransit'
  // Galactic Astrology
  | 'galacticProfile'
  | 'galacticPointReading'
  | 'galacticAlignment'
  // Cosmic Embodiment — Sprint R expansion
  | 'elementalEmbodiment'
  | 'sequenceEmbodiment';

export interface FocusEntity {
  type: 'placement' | 'aspect' | 'configuration' | 'gate' | 'channel' | 'center' | 'sphere' | 'geneKey' | 'transitAspect' | 'embodiment' | 'fixed-star' | 'galactic-point' | 'element';
  id: string;
  name: string;
  transitData?: TransitNatalAspect; // For transit aspects
  entitySystem?: 'astrology' | 'humanDesign' | 'geneKeys'; // For embodiment mode
}

export interface ContemplationSelection {
  category: ContemplationCategory;
  type: ContemplationType;
  focus?: FocusEntity;
}

// Determine which systems to include based on category
// IMPORTANT: Astrology (natal placements) is ALWAYS included as it's the foundation
// for both Human Design gates and Gene Keys spheres
function getIncludedSystems(category: ContemplationCategory): {
  astrology: boolean;
  humanDesign: boolean;
  geneKeys: boolean;
  bridges: boolean;
} {
  // Astrology placements are always the foundation - they define where planets are,
  // which determines HD gates (via degree) and GK spheres (via planet positions)
  const base = { astrology: true };

  switch (category) {
    case 'astrology':
      // Astrology needs its own data, plus Gene Keys for gate connections
      return { ...base, humanDesign: false, geneKeys: true, bridges: false };
    case 'humanDesign':
      // Human Design needs astrology foundation + Gene Keys for shadow/gift/siddhi
      return { ...base, humanDesign: true, geneKeys: true, bridges: false };
    case 'geneKeys':
      // Gene Keys needs astrology foundation (spheres derive from planetary positions)
      return { ...base, humanDesign: false, geneKeys: true, bridges: false };
    case 'crossSystem':
      // Cross-system needs everything
      return { ...base, humanDesign: true, geneKeys: true, bridges: true };
    case 'lifeOS':
      // Life OS needs everything — bridges cosmic to intentional living
      return { ...base, humanDesign: true, geneKeys: true, bridges: true };
    case 'alchemy':
      // Alchemy (chakras + hermetic): bridges all systems
      return { ...base, humanDesign: true, geneKeys: true, bridges: true };
    case 'numerology':
      // Numerology: Life Path connects to Gene Keys + astrology purpose
      return { ...base, humanDesign: false, geneKeys: true, bridges: false };
    case 'cosmicEmbodiment':
      // Embodiment: any entity across all systems
      return { ...base, humanDesign: true, geneKeys: true, bridges: true };
    case 'fixedStars':
      // Fixed stars are an astrological layer; include astrology context only
      return { ...base, humanDesign: false, geneKeys: false, bridges: false };
    case 'galacticAstrology':
      // Galactic points are an astrological layer; include astrology context only
      return { ...base, humanDesign: false, geneKeys: false, bridges: false };
    default:
      return { astrology: true, humanDesign: true, geneKeys: true, bridges: true };
  }
}

// Format options for profile context
interface FormatOptions {
  compact?: boolean; // Use abbreviated format to reduce tokens (saves ~40%)
}

// Format profile context for AI - selectively includes systems based on category
export function formatProfileContext(
  profile: AstroProfile,
  selection: ContemplationSelection,
  options: FormatOptions = { compact: true } // Default to compact mode
): string {
  const sections: string[] = [];
  const include = getIncludedSystems(selection.category);
  const { compact = true } = options;

  // Header with identity
  sections.push(compact ? formatCompactHeader(profile) : formatProfileHeader(profile));

  // Include transit context if this is a transit reading or transit overview
  if (selection.type === 'transitReading' || selection.type === 'transitOverview') {
    sections.push(formatTransitContext(profile));
  }

  // Conditionally include Astrology context
  if (include.astrology) {
    sections.push(compact ? formatCompactAstrology(profile) : formatFullAstrologyContext(profile));
  }

  // Conditionally include Human Design context
  if (include.humanDesign) {
    sections.push(compact ? formatCompactHumanDesign(profile) : formatFullHumanDesignContext(profile));
  }

  // Conditionally include Gene Keys context
  if (include.geneKeys) {
    sections.push(compact ? formatCompactGeneKeys(profile) : formatFullGeneKeysContext(profile));
  }

  // Add cross-system bridges (only for crossSystem category)
  if (include.bridges) {
    sections.push(compact ? formatCompactBridges(profile) : formatSystemBridges(profile));
    // Add pre-computed insights for cross-system synthesis
    sections.push(formatPreComputedInsights(profile));
    // Add today's transit gate activations (transiting planets hitting natal gates)
    sections.push(formatTodayGateActivations(profile));
  }

  // Include Fixed Stars context for fixed-star category or types
  if (
    selection.category === 'fixedStars' ||
    selection.type === 'fixedStarProfile' ||
    selection.type === 'fixedStarConjunction' ||
    selection.type === 'fixedStarTransit'
  ) {
    sections.push(formatFixedStarContext(profile));
  }

  // Include Galactic Astrology context for galactic category or types
  if (
    selection.category === 'galacticAstrology' ||
    selection.type === 'galacticProfile' ||
    selection.type === 'galacticPointReading' ||
    selection.type === 'galacticAlignment'
  ) {
    sections.push(formatGalacticContext(profile));
  }

  // Conditionally include Enrichment context (Numerology, Chakra, Alchemy)
  // These are compact (~5-8 lines) so include for all categories when data is available
  const enrichment = getEnrichmentData(profile);
  if (enrichment.numerologyProfile) {
    sections.push(formatCompactNumerology(profile));
  }
  if (enrichment.chakraActivations?.length) {
    sections.push(formatCompactChakraActivations(profile));
    if (enrichment.alchemicalProfile) {
      sections.push(formatCompactAlchemical(profile));
    }
  }

  // Add focused element highlight if applicable
  if (selection.focus) {
    sections.push(formatFocusHighlight(profile, selection));
  }

  // Add profile entity ID hint for the AI to use in profile entity links
  // Handle both AstroProfile (profile.id) and CosmicProfile (profile.meta.id) formats
  const profileId = profile.id || (profile as unknown as { meta?: { id?: string } }).meta?.id || 'default-profile';
  sections.push(`
═══════════════════════════════════════════════════════════════════════════════
                         PROFILE ENTITY LINKING
═══════════════════════════════════════════════════════════════════════════════
[PROFILE_ENTITY_ID] "${profileId}"

When linking to personal placements, replace {profileId} in entity IDs with: ${profileId}

Examples with this profile:
• Astrology: [[${profileId}:placement:sun|Your Sun in Libra]]
• Gene Keys: [[${profileId}:gk:lifesWork|Your Life's Work]]
• Human Design: [[${profileId}:hd:44.3:personality|Your Gate 44.3]]
`);

  return sections.filter(Boolean).join('\n\n');
}

function formatProfileHeader(profile: AstroProfile): string {
  return `
╔═══════════════════════════════════════════════════════════════════════════════╗
║                        COMPLETE COSMIC PROFILE                                ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║  Name: ${profile.name.padEnd(67)}║
║  Born: ${profile.dateOfBirth} at ${profile.timeOfBirth}${' '.repeat(51 - profile.dateOfBirth.length - profile.timeOfBirth.length)}║
║  Location: ${profile.cityOfBirth.substring(0, 63).padEnd(63)}║
╚═══════════════════════════════════════════════════════════════════════════════╝`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPACT FORMATTERS - Token-optimized versions (~40% reduction)
// ═══════════════════════════════════════════════════════════════════════════════

// Abbreviation maps for compact mode
const SIGN_ABBREV: Record<string, string> = {
  aries: 'Ari', taurus: 'Tau', gemini: 'Gem', cancer: 'Can',
  leo: 'Leo', virgo: 'Vir', libra: 'Lib', scorpio: 'Sco',
  sagittarius: 'Sag', capricorn: 'Cap', aquarius: 'Aqu', pisces: 'Pis'
};

const DIGNITY_ABBREV: Record<string, string> = {
  domicile: 'D', exaltation: 'Ex', detriment: 'Det', fall: 'F'
};

function formatCompactHeader(profile: AstroProfile): string {
  return `[PROFILE] ${profile.name} | ${profile.dateOfBirth} ${profile.timeOfBirth} | ${profile.cityOfBirth}`;
}

function formatCompactAstrology(profile: AstroProfile): string {
  const outputLines: string[] = [];
  outputLines.push('\n[ASTROLOGY]');

  // Big Four in one line each
  outputLines.push('Big4:');
  const bigFour = ['sun', 'moon', 'ascendant', 'mercury'];
  bigFour.forEach(id => {
    const p = profile.placements.find(pl => pl.planetId === id);
    if (p) {
      const planet = planets.get(p.planetId);
      const signAbbr = SIGN_ABBREV[p.signId] || p.signId.slice(0, 3);
      const house = houses.get(p.houseId);
      const houseNum = house?.id.replace('house-', 'H') || '';
      const retro = p.retrograde ? 'R' : '';
      const dignity = p.dignityId ? `[${DIGNITY_ABBREV[p.dignityId] || p.dignityId[0]}]` : '';
      const ruler = p.isChartRuler ? '*' : '';
      outputLines.push(`${planet?.symbol} ${signAbbr} ${houseNum} ${p.degree}°${retro}${dignity}${ruler}`);
    }
  });

  // All placements - ultra compact
  outputLines.push('\nPlacements:');
  const orderedPlanets = ['sun', 'moon', 'ascendant', 'midheaven', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'north-node', 'chiron'];
  const placementLine = orderedPlanets.map(id => {
    const p = profile.placements.find(pl => pl.planetId === id);
    if (p) {
      const planet = planets.get(p.planetId);
      const signAbbr = SIGN_ABBREV[p.signId] || p.signId.slice(0, 3);
      const houseNum = p.houseId.replace('house-', '');
      const retro = p.retrograde ? 'R' : '';
      const dignity = p.dignityId ? DIGNITY_ABBREV[p.dignityId] || '' : '';
      return `${planet?.symbol}${signAbbr}${houseNum}${retro}${dignity}`;
    }
    return null;
  }).filter(Boolean).join(' ');
  outputLines.push(placementLine);

  // Elemental balance - single line
  const ea = profile.elementalAnalysis;
  outputLines.push(`\nElements: 🜂${ea.fire} 🜃${ea.earth} 🜁${ea.air} 🜄${ea.water} | Dom:${ea.dominant?.toUpperCase()} Def:${ea.deficient?.toUpperCase()}`);

  // Chart rulers - single line
  const tradRuler = planets.get(profile.chartRulers.traditional);
  const modRuler = planets.get(profile.chartRulers.modern);
  outputLines.push(`Rulers: ${tradRuler?.symbol}(trad) ${modRuler?.symbol}(mod)`);

  // Aspects - very compact
  if (profile.aspects?.planetary && profile.aspects.planetary.length > 0) {
    outputLines.push('\nAspects:');
    const aspectLine = profile.aspects.planetary.map(a => {
      const aspectType = aspects.get(a.aspectId);
      const p1 = planets.get(a.planet1Id);
      const p2 = planets.get(a.planet2Id);
      return `${p1?.symbol}${aspectType?.symbol}${p2?.symbol}`;
    }).join(' ');
    outputLines.push(aspectLine);
  }

  // Configurations - one line
  if (profile.configurations && profile.configurations.length > 0) {
    outputLines.push(`\nConfigs: ${profile.configurations.map(c => c.fullName).join(', ')}`);
  }

  return outputLines.join('\n');
}

function formatCompactHumanDesign(profile: AstroProfile): string {
  const hd = profile.humanDesignProfile;
  if (!hd) return '';

  const outputLines: string[] = [];
  outputLines.push('\n[HUMAN DESIGN]');

  // Core design - single line
  outputLines.push(`${hd.type} | ${hd.strategy} | ${hd.authority} | ${hd.profile} | ${hd.definition}`);
  outputLines.push(`Cross: ${hd.incarnationCross}`);

  // Profile detail - include life theme and constituent lines
  const profileId = `hd-profile-${hd.profile.replace('/', '-')}`;
  const profileData = hdProfiles.get(profileId);
  if (profileData) {
    outputLines.push(`Profile: ${profileData.name} - ${profileData.lifeTheme}`);
    // Include line archetypes for personality and design
    const persLine = lines.get(`line-${profileData.personalityLine}`);
    const desLine = lines.get(`line-${profileData.designLine}`);
    if (persLine && desLine) {
      outputLines.push(`  Personality Line ${persLine.lineNumber}: ${persLine.archetype} (conscious)`);
      outputLines.push(`  Design Line ${desLine.lineNumber}: ${desLine.archetype} (unconscious)`);
    }
  }

  // Centers - single line
  const definedCenters = hd.definedCenterIds.map(id => {
    const abbrev: Record<string, string> = {
      'head-center': 'Hd', 'ajna-center': 'Aj', 'throat-center': 'Th',
      'g-center': 'G', 'heart-center': 'Ht', 'spleen-center': 'Sp',
      'solar-plexus-center': 'SP', 'sacral-center': 'Sa', 'root-center': 'Rt'
    };
    return abbrev[id] || id.slice(0, 2);
  }).join(',');
  outputLines.push(`Defined: [${definedCenters}]`);

  // Chakra resonance from defined centers
  const definedChakraList = hd.definedCenterIds
    .map(cId => Array.from(chakras.values()).find(c => c.relatedHDCenters.includes(cId)))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .filter((c, i, arr) => arr.findIndex(x => x.id === c.id) === i);
  if (definedChakraList.length > 0) {
    outputLines.push(`Chakras: ${definedChakraList.map(c => `${c.seed_mantra || c.name.split(' ')[0]}`).join(' ')}`);
  }

  // Channels - with themes
  if (hd.definedChannelIds.length > 0) {
    outputLines.push('\nChannels:');
    hd.definedChannelIds.forEach(id => {
      const ch = hdChannels.get(id);
      if (ch) {
        outputLines.push(`  ${ch.gate1Number}-${ch.gate2Number}: ${ch.name} (${ch.circuitType}) - ${ch.theme}`);
      }
    });
  }

  // Gates - with line archetypes
  outputLines.push('\nPersonality Gates (Conscious):');
  hd.personalityGates.forEach(g => {
    const lineData = lines.get(`line-${g.line}`);
    const lineArchetype = lineData?.archetype || `Line ${g.line}`;
    outputLines.push(`  ${g.gateNumber}.${g.line} (${g.planet || ''}) - ${lineArchetype}`);
  });

  outputLines.push('\nDesign Gates (Unconscious):');
  hd.designGates.forEach(g => {
    const lineData = lines.get(`line-${g.line}`);
    const lineArchetype = lineData?.archetype || `Line ${g.line}`;
    outputLines.push(`  ${g.gateNumber}.${g.line} (${g.planet || ''}) - ${lineArchetype}`);
  });

  return outputLines.join('\n');
}

function formatCompactGeneKeys(profile: AstroProfile): string {
  const gk = profile.geneKeysProfile;
  if (!gk) return '';

  const outputLines: string[] = [];
  outputLines.push('\n[GENE KEYS]');

  // Helper for sphere format with line details, codon ring, and amino acid
  const fmtSphere = (s: { sphereName: string; geneKeyNumber: number; line: number }) => {
    const key = geneKeys.get(`gk-${s.geneKeyNumber}`);
    const lineData = lines.get(`line-${s.line}`);
    const lineArchetype = lineData?.archetype || `Line ${s.line}`;
    const lineTheme = lineData?.geneKeys?.theme || '';
    const codonRing = key?.codonRingId ? codonRings.get(key.codonRingId) : undefined;
    const aa = key?.aminoAcidId ? aminoAcids.get(key.aminoAcidId) : undefined;
    const codonStr = codonRing ? ` [${codonRing.name.replace('Ring of ', '')}${aa ? '/' + aa.abbreviation : ''}]` : '';

    if (!key) return `${s.sphereName}: Key ${s.geneKeyNumber}.${s.line} (${lineArchetype})`;
    return `${s.sphereName}: Key ${s.geneKeyNumber}.${s.line} - ${lineArchetype}${codonStr}
      Shadow: ${key.shadow.name} → Gift: ${key.gift.name} → Siddhi: ${key.siddhi.name}
      Line Theme: ${lineTheme}`;
  };

  // Activation Sequence
  outputLines.push('\nActivation Sequence (Purpose):');
  outputLines.push(`  ${fmtSphere(gk.lifesWork)}`);
  outputLines.push(`  ${fmtSphere(gk.evolution)}`);
  outputLines.push(`  ${fmtSphere(gk.radiance)}`);
  outputLines.push(`  ${fmtSphere(gk.purpose)}`);

  // Venus Sequence
  outputLines.push('\nVenus Sequence (Heart):');
  outputLines.push(`  ${fmtSphere(gk.attraction)}`);
  outputLines.push(`  ${fmtSphere(gk.iq)}`);
  outputLines.push(`  ${fmtSphere(gk.eq)}`);
  outputLines.push(`  ${fmtSphere(gk.sq)}`);

  // Pearl Sequence
  outputLines.push('\nPearl Sequence (Prosperity):');
  outputLines.push(`  ${fmtSphere(gk.vocation)}`);
  outputLines.push(`  ${fmtSphere(gk.culture)}`);
  outputLines.push(`  ${fmtSphere(gk.pearl)}`);

  return outputLines.join('\n');
}

function formatCompactBridges(profile: AstroProfile): string {
  const gk = profile.geneKeysProfile;
  const hd = profile.humanDesignProfile;
  if (!gk || !hd) return '';

  const outputLines: string[] = [];
  outputLines.push('\n[BRIDGES]');

  // Planet → Sphere → Gate → Chakra → AminoAcid connections (6 key planets)
  const bridgeMap = [
    { planetId: 'sun',     sphere: gk.lifesWork,  sym: '☉' },
    { planetId: 'moon',    sphere: gk.attraction, sym: '☽' },
    { planetId: 'venus',   sphere: gk.iq,         sym: '♀' },
    { planetId: 'mars',    sphere: gk.eq,         sym: '♂' },
    { planetId: 'jupiter', sphere: gk.vocation,   sym: '♃' },
    { planetId: 'saturn',  sphere: gk.pearl,      sym: '♄' },
  ] as const;

  bridgeMap.forEach(({ planetId, sphere, sym }) => {
    const placement = profile.placements.find(p => p.planetId === planetId);
    const signAbbr = SIGN_ABBREV[placement?.signId || ''] || '';
    const key = geneKeys.get(`gk-${sphere.geneKeyNumber}`);
    const gate = hdGates.get(`gate-${sphere.geneKeyNumber}`);
    const chakra = gate ? Array.from(chakras.values()).find(c => c.relatedHDCenters.includes(gate.centerId)) : undefined;
    const aa = key?.aminoAcidId ? aminoAcids.get(key.aminoAcidId) : undefined;
    const chakraStr = chakra ? `|${chakra.seed_mantra || chakra.name.split(' ')[0]}` : '';
    const aaStr = aa ? `|${aa.abbreviation}` : '';
    outputLines.push(`${sym}${signAbbr}→${sphere.sphereName}→G${sphere.geneKeyNumber}${chakraStr}${aaStr}: ${key?.shadow.name || '?'}→${key?.gift.name || '?'}`);
  });

  // Summary
  outputLines.push(`\nSummary: ${hd.type}|${hd.authority}|${hd.profile}|${profile.elementalAnalysis.dominant?.toUpperCase()}dom`);

  return outputLines.join('\n');
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENRICHMENT FORMATTERS - Numerology, Chakra, Alchemy (compact)
// ═══════════════════════════════════════════════════════════════════════════════

// Helper type to access enrichment fields that live on CosmicProfile but not AstroProfile
interface EnrichmentFields {
  numerologyProfile?: NumerologyProfile;
  chakraActivations?: ChakraActivation[];
  alchemicalProfile?: AlchemicalProfile;
}

function getEnrichmentData(profile: AstroProfile): EnrichmentFields {
  return profile as unknown as EnrichmentFields;
}

function formatCompactNumerology(profile: AstroProfile): string {
  const enrichment = getEnrichmentData(profile);
  const numProfile = enrichment.numerologyProfile;
  if (!numProfile) return '';

  const outputLines: string[] = [];
  outputLines.push('\n[NUMEROLOGY]');

  // Life Path
  const lifePathEntity = numerologyNumbers.get(numProfile.lifePathEntityId);
  if (lifePathEntity) {
    // Master numbers displayed as "33/6" — master first, base as grounded expression
    const lifePathDisplay = numProfile.lifePathBase !== undefined
      ? `${numProfile.lifePathNumber}/${numProfile.lifePathBase} (Master)`
      : `${numProfile.lifePathNumber}`;
    const chakraEntity = lifePathEntity.chakraId ? chakras.get(lifePathEntity.chakraId) : undefined;
    const chakraStr = chakraEntity ? ` | Chakra: ${chakraEntity.name}` : '';
    outputLines.push(`Life Path: ${lifePathDisplay} — ${lifePathEntity.archetype} | Gift: ${lifePathEntity.alignedExpression.name} | Shadow: ${lifePathEntity.lowerExpression.name}`);
    outputLines.push(`  Solfeggio: ${lifePathEntity.solfeggioHz}Hz${chakraStr}`);
  } else {
    outputLines.push(`Life Path: ${numProfile.lifePathNumber}`);
  }

  // Birthday Number
  const birthdayEntity = numerologyNumbers.get(numProfile.birthdayEntityId);
  if (birthdayEntity) {
    // Master birthday numbers also displayed as "22/4" format
    const birthdayDisplay = numProfile.birthdayBase !== undefined
      ? `${numProfile.birthdayNumber}/${numProfile.birthdayBase} (Master)`
      : `${numProfile.birthdayNumber}`;
    outputLines.push(`Birthday: ${birthdayDisplay} — ${birthdayEntity.archetype} | Solfeggio: ${birthdayEntity.solfeggioHz}Hz`);
  } else {
    outputLines.push(`Birthday: ${numProfile.birthdayNumber}`);
  }

  return outputLines.join('\n');
}

function formatCompactChakraActivations(profile: AstroProfile): string {
  const enrichment = getEnrichmentData(profile);
  const activations = enrichment.chakraActivations;
  if (!activations || activations.length === 0) return '';

  const outputLines: string[] = [];
  outputLines.push('\n[CHAKRA ACTIVATIONS]');

  activations.forEach(activation => {
    const chakra = chakras.get(activation.chakraId);
    if (!chakra) return;
    const planetNames = activation.activatingPlanetIds
      .map(pid => planets.get(pid)?.name || pid)
      .join(', ');
    const substanceStr = activation.alchemicalSubstance ? ` (${activation.alchemicalSubstance})` : '';
    outputLines.push(`${chakra.seed_mantra || chakra.symbol || ''} ${chakra.name}${substanceStr} — ${planetNames}`);
  });

  return outputLines.join('\n');
}

function formatCompactAlchemical(profile: AstroProfile): string {
  const enrichment = getEnrichmentData(profile);
  const alch = enrichment.alchemicalProfile;
  if (!alch) return '';

  const outputLines: string[] = [];
  outputLines.push('\n[ALCHEMICAL PROFILE]');

  const substanceTitle = alch.dominantSubstance.charAt(0).toUpperCase() + alch.dominantSubstance.slice(1);
  outputLines.push(`Dominant: ${substanceTitle} | Sulphur: ${alch.sulphurCount} | Sal: ${alch.saltCount} | Mercurius: ${alch.mercuryCount}`);

  return outputLines.join('\n');
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRE-COMPUTED INSIGHTS - Cross-system synthesis patterns
// ═══════════════════════════════════════════════════════════════════════════════

export function formatPreComputedInsights(profile: AstroProfile): string {
  const gk = profile.geneKeysProfile;
  const hd = profile.humanDesignProfile;
  if (!gk || !hd) return '';

  const outputLines: string[] = [];
  outputLines.push('\n[PRE-COMPUTED INSIGHTS]');

  // 1. Core Theme: Based on Sun sign + Life's Work Gene Key + HD Type
  const sunPlacement = profile.placements.find(p => p.planetId === 'sun');
  const sunSign = signs.get(sunPlacement?.signId || '');
  const lifesWorkKey = geneKeys.get(`gk-${gk.lifesWork.geneKeyNumber}`);

  if (sunSign && lifesWorkKey) {
    const coreTheme = computeCoreTheme(sunSign.name, lifesWorkKey.gift.name, hd.type);
    outputLines.push(`• Core Theme: ${coreTheme}`);
  }

  // 2. Key Tension: Based on challenging aspects + Shadow patterns
  const keyTension = computeKeyTension(profile, gk);
  if (keyTension) {
    outputLines.push(`• Key Tension: ${keyTension}`);
  }

  // 3. Gift Focus: Based on Life's Work gift + dominant element
  const giftFocus = computeGiftFocus(profile, gk);
  if (giftFocus) {
    outputLines.push(`• Gift Focus: ${giftFocus}`);
  }

  // 4. Authority Alignment: HD Authority + Mercury placement
  const authorityAlign = computeAuthorityAlignment(profile, hd);
  if (authorityAlign) {
    outputLines.push(`• Authority Path: ${authorityAlign}`);
  }

  // 5. Incarnation Theme: Cross + Purpose sphere
  const incarnationTheme = computeIncarnationTheme(gk, hd);
  if (incarnationTheme) {
    outputLines.push(`• Life Purpose: ${incarnationTheme}`);
  }

  return outputLines.join('\n');
}

function computeCoreTheme(sunSignName: string, giftName: string, hdType: string): string {
  // Map HD types to their core energy
  const typeEnergy: Record<string, string> = {
    'Generator': 'sustainable creation',
    'Manifesting Generator': 'efficient multi-passionate action',
    'Projector': 'wise guidance',
    'Manifestor': 'initiating impact',
    'Reflector': 'environmental wisdom'
  };

  const energy = typeEnergy[hdType] || hdType.toLowerCase();
  return `${giftName} expressed through ${sunSignName} energy for ${energy}`;
}

function computeKeyTension(profile: AstroProfile, gk: NonNullable<AstroProfile['geneKeysProfile']>): string | null {
  // Find squares and oppositions (challenging aspects)
  const challengingAspects = profile.aspects?.planetary?.filter(
    a => a.aspectId === 'square' || a.aspectId === 'opposition'
  );

  if (!challengingAspects || challengingAspects.length === 0) return null;

  // Get the most significant challenging aspect
  const mainChallenge = challengingAspects[0];
  const p1 = planets.get(mainChallenge.planet1Id);
  const p2 = planets.get(mainChallenge.planet2Id);
  const aspectType = aspects.get(mainChallenge.aspectId);

  // Get shadow from Life's Work
  const lifesWorkKey = geneKeys.get(`gk-${gk.lifesWork.geneKeyNumber}`);
  const shadowName = lifesWorkKey?.shadow.name || '';

  if (p1 && p2 && aspectType) {
    return `${p1.name}-${p2.name} ${aspectType.name} (watch for ${shadowName} pattern)`;
  }

  return null;
}

function computeGiftFocus(profile: AstroProfile, gk: NonNullable<AstroProfile['geneKeysProfile']>): string | null {
  const lifesWorkKey = geneKeys.get(`gk-${gk.lifesWork.geneKeyNumber}`);
  const dominantElement = profile.elementalAnalysis.dominant;

  if (!lifesWorkKey || !dominantElement) return null;

  // Element keywords
  const elementQualities: Record<string, string> = {
    fire: 'passionate action and inspiration',
    earth: 'practical grounding and manifestation',
    air: 'intellectual expression and communication',
    water: 'emotional depth and intuition'
  };

  const quality = elementQualities[dominantElement] || dominantElement;
  return `${lifesWorkKey.gift.name} through ${quality}`;
}

function computeAuthorityAlignment(profile: AstroProfile, hd: NonNullable<AstroProfile['humanDesignProfile']>): string | null {
  const mercuryPlacement = profile.placements.find(p => p.planetId === 'mercury');
  const mercurySign = mercuryPlacement ? signs.get(mercuryPlacement.signId) : null;

  // Authority descriptions
  const authorityPath: Record<string, string> = {
    'Emotional (Solar Plexus)': 'riding the emotional wave before decisions',
    'Sacral': 'gut response in the moment',
    'Splenic': 'spontaneous instinctual knowing',
    'Ego (Heart)': 'willpower and commitment alignment',
    'Self-Projected': 'speaking truth to hear your direction',
    'Mental (Environmental)': 'bouncing ideas off others in the right environment',
    'Lunar': 'waiting a full moon cycle for clarity'
  };

  const authorityDesc = authorityPath[hd.authority] || hd.authority;

  if (mercurySign) {
    return `${authorityDesc} (Mercury in ${mercurySign.name} shapes communication)`;
  }

  return authorityDesc;
}

function computeIncarnationTheme(gk: NonNullable<AstroProfile['geneKeysProfile']>, hd: NonNullable<AstroProfile['humanDesignProfile']>): string | null {
  const purposeKey = geneKeys.get(`gk-${gk.purpose.geneKeyNumber}`);

  if (!purposeKey || !hd.incarnationCross) return null;

  // Extract the cross name (e.g., "Right Angle Cross of Planning")
  const crossParts = hd.incarnationCross.split(' of ');
  const crossTheme = crossParts.length > 1 ? crossParts[1] : hd.incarnationCross;

  return `${crossTheme} realized through ${purposeKey.siddhi.name}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TODAY'S GATE ACTIVATIONS - Cross-system: transiting planets hitting natal gates
// ─────────────────────────────────────────────────────────────────────────────

function formatTodayGateActivations(profile: AstroProfile): string {
  const hd = profile.humanDesignProfile;
  if (!hd) return '';

  const allGateNumbers = new Set<number>([
    ...(hd.personalityGates || []).map((g: { gateNumber: number }) => g.gateNumber),
    ...(hd.designGates || []).map((g: { gateNumber: number }) => g.gateNumber),
  ]);

  const weather = getCosmicWeather(new Date());
  const activationLines: string[] = [];

  weather.positions.forEach(pos => {
    const gr = getGateByDegree(pos.degree);
    if (!gr || !allGateNumbers.has(gr.gate.gateNumber)) return;
    const key = gr.gate.geneKeyId ? geneKeys.get(gr.gate.geneKeyId) : undefined;
    const chakra = Array.from(chakras.values()).find(c => c.relatedHDCenters.includes(gr.gate.centerId));
    const center = hdCenters.get(gr.gate.centerId);
    const retro = pos.isRetrograde ? '℞' : '';
    const location = chakra?.seed_mantra || center?.name.split(' ')[0] || '';
    const gkStr = key ? ` →${key.gift.name}` : '';
    activationLines.push(`  ${pos.symbol}${retro} G${gr.gate.gateNumber}.${gr.line}[${location}]${gkStr}`);
  });

  if (activationLines.length === 0) return '';

  const outputLines: string[] = [];
  outputLines.push('\n[TODAY\'S GATE ACTIVATIONS]');
  outputLines.push('Transiting planets activating natal gates now:');
  activationLines.forEach(a => outputLines.push(a));
  return outputLines.join('\n');
}

function formatTransitContext(profile: AstroProfile): string {
  const now = new Date();
  const outputLines: string[] = [];

  // Get current cosmic weather
  const weather = getCosmicWeather(now);
  const positions = getPlanetaryPositions(now);

  outputLines.push(`
═══════════════════════════════════════════════════════════════════════════════
                         CURRENT COSMIC WEATHER
═══════════════════════════════════════════════════════════════════════════════`);

  // Date and time
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  outputLines.push(`\nDate: ${dateStr}`);
  outputLines.push(`Moon Phase: ${weather.moonPhase.emoji} ${weather.moonPhase.name} (${weather.moonPhase.illumination}% illuminated)`);
  outputLines.push(`Retrogrades: ${weather.retrogradeCount} planet${weather.retrogradeCount !== 1 ? 's' : ''} retrograde`);

  // Current planetary positions
  outputLines.push('\n┌─────────────────────────────────────┐');
  outputLines.push('│    CURRENT PLANETARY POSITIONS      │');
  outputLines.push('└─────────────────────────────────────┘');

  const planetSymbols: Record<string, string> = {
    sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
    jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇'
  };

  const planetList = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'] as const;

  planetList.forEach(planetId => {
    const longitude = positions[planetId];
    const zodiac = longitudeToZodiac(longitude);
    const symbol = planetSymbols[planetId];
    const retroPosition = weather.positions.find(p => p.planetId === planetId);
    const retro = retroPosition?.isRetrograde ? ' ℞' : '';
    outputLines.push(`${symbol} ${planetId.charAt(0).toUpperCase() + planetId.slice(1).padEnd(9)} ${zodiac.sign.padEnd(12)} ${zodiac.degree}°${zodiac.minute.toString().padStart(2, '0')}'${retro}`);
  });

  // Calculate transit-to-natal aspects
  const natalPlacements = profile.placements.map(p => ({
    planetId: p.planetId,
    signId: p.signId,
    degree: p.degree,
    minute: p.minute,
    retrograde: p.retrograde,
  }));

  const transitAspects = calculateTransitNatalAspects(now, natalPlacements);

  // Group by nature
  const challenging = transitAspects.filter(a => a.nature === 'challenging');
  const harmonious = transitAspects.filter(a => a.nature === 'harmonious');
  const conjunctions = transitAspects.filter(a => a.nature === 'neutral');

  outputLines.push('\n┌─────────────────────────────────────┐');
  outputLines.push('│   ACTIVE TRANSITS TO YOUR CHART    │');
  outputLines.push('└─────────────────────────────────────┘');
  outputLines.push(`\nTotal: ${transitAspects.length} active aspects`);
  outputLines.push(`  Challenging: ${challenging.length} | Harmonious: ${harmonious.length} | Conjunctions: ${conjunctions.length}`);

  // Format aspect helper
  const formatAspect = (a: TransitNatalAspect) => {
    const applying = a.isApplying ? '→ applying' : '← separating';
    return `${a.transitSymbol} ${a.transitPlanet} ${a.aspectSymbol} natal ${a.natalSymbol} ${a.natalPlanet} (${a.orb}° orb, ${applying})`;
  };

  // Challenging aspects (most important for awareness)
  if (challenging.length > 0) {
    outputLines.push('\n🔴 CHALLENGING TRANSITS:');
    challenging.slice(0, 8).forEach(a => {
      outputLines.push(`   ${formatAspect(a)}`);
    });
    if (challenging.length > 8) {
      outputLines.push(`   ... and ${challenging.length - 8} more`);
    }
  }

  // Harmonious aspects (opportunities)
  if (harmonious.length > 0) {
    outputLines.push('\n🟢 HARMONIOUS TRANSITS:');
    harmonious.slice(0, 8).forEach(a => {
      outputLines.push(`   ${formatAspect(a)}`);
    });
    if (harmonious.length > 8) {
      outputLines.push(`   ... and ${harmonious.length - 8} more`);
    }
  }

  // Conjunctions (intensification)
  if (conjunctions.length > 0) {
    outputLines.push('\n🟣 CONJUNCTIONS:');
    conjunctions.slice(0, 5).forEach(a => {
      outputLines.push(`   ${formatAspect(a)}`);
    });
    if (conjunctions.length > 5) {
      outputLines.push(`   ... and ${conjunctions.length - 5} more`);
    }
  }

  // Highlight most significant transits
  const topTransits = transitAspects.slice(0, 3);
  if (topTransits.length > 0) {
    outputLines.push('\n┌─────────────────────────────────────┐');
    outputLines.push('│     MOST SIGNIFICANT TRANSITS       │');
    outputLines.push('└─────────────────────────────────────┘');

    topTransits.forEach((a, i) => {
      const natalPlacement = profile.placements.find(p => p.planetId === a.natalPlanetId);
      const natalSign = signs.get(natalPlacement?.signId || '');
      const natalHouse = houses.get(natalPlacement?.houseId || '');

      outputLines.push(`\n${i + 1}. ${a.transitPlanet} ${a.aspectSymbol} natal ${a.natalPlanet}`);
      outputLines.push(`   Transit: ${a.transitPlanet} at ${longitudeToZodiac(a.transitDegree).degree}° ${a.transitSign.charAt(0).toUpperCase() + a.transitSign.slice(1)}`);
      outputLines.push(`   Natal: ${a.natalPlanet} in ${natalSign?.name || ''} in ${natalHouse?.name || ''}`);
      outputLines.push(`   Aspect: ${a.aspectType} (${a.orb}° orb, ${a.isApplying ? 'applying' : 'separating'})`);
      outputLines.push(`   Nature: ${a.nature.charAt(0).toUpperCase() + a.nature.slice(1)}`);
    });
  }

  return outputLines.join('\n');
}

function formatFullAstrologyContext(profile: AstroProfile): string {
  const outputLines: string[] = [];

  outputLines.push(`
═══════════════════════════════════════════════════════════════════════════════
                              ASTROLOGICAL CHART
═══════════════════════════════════════════════════════════════════════════════`);

  // The Big Four
  outputLines.push('\n┌─────────────────────────────────────┐');
  outputLines.push('│          THE BIG FOUR               │');
  outputLines.push('└─────────────────────────────────────┘');

  const bigFour = ['sun', 'moon', 'ascendant', 'mercury'];
  bigFour.forEach(id => {
    const p = profile.placements.find(pl => pl.planetId === id);
    if (p) {
      const planet = planets.get(p.planetId);
      const sign = signs.get(p.signId);
      const house = houses.get(p.houseId);
      const retro = p.retrograde ? ' ℞' : '';
      const dignity = p.dignityId ? ` [${p.dignityId}]` : '';
      const ruler = p.isChartRuler ? ` ★${p.isChartRuler} chart ruler` : '';
      outputLines.push(`${planet?.symbol} ${planet?.name}: ${sign?.name} in ${house?.name} (${p.degree}°${p.minute}'${retro})${dignity}${ruler}`);
    }
  });

  // All Placements
  outputLines.push('\n┌─────────────────────────────────────┐');
  outputLines.push('│         ALL PLACEMENTS              │');
  outputLines.push('└─────────────────────────────────────┘');

  const orderedPlanets = ['sun', 'moon', 'ascendant', 'midheaven', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'north-node', 'south-node', 'chiron', 'lilith', 'part-of-fortune', 'vertex'];

  orderedPlanets.forEach(id => {
    const p = profile.placements.find(pl => pl.planetId === id);
    if (p) {
      const planet = planets.get(p.planetId);
      const sign = signs.get(p.signId);
      const house = houses.get(p.houseId);
      const retro = p.retrograde ? ' ℞' : '';
      const dignity = p.dignityId ? ` [${p.dignityId}]` : '';
      outputLines.push(`${planet?.symbol || '•'} ${(planet?.name || id).padEnd(14)} ${(sign?.name || '').padEnd(12)} ${house?.name || ''} ${p.degree}°${p.minute}'${retro}${dignity}`);
    }
  });

  // Elemental Balance
  outputLines.push('\n┌─────────────────────────────────────┐');
  outputLines.push('│        ELEMENTAL BALANCE            │');
  outputLines.push('└─────────────────────────────────────┘');

  const ea = profile.elementalAnalysis;
  outputLines.push(`🜂 Fire:  ${ea.fire} planets (${ea.firePlanetIds.map(id => planets.get(id)?.symbol || id).join(', ')})`);
  outputLines.push(`🜃 Earth: ${ea.earth} planets (${ea.earthPlanetIds.map(id => planets.get(id)?.symbol || id).join(', ')})`);
  outputLines.push(`🜁 Air:   ${ea.air} planets (${ea.airPlanetIds.map(id => planets.get(id)?.symbol || id).join(', ')})`);
  outputLines.push(`🜄 Water: ${ea.water} planets (${ea.waterPlanetIds.map(id => planets.get(id)?.symbol || id).join(', ')})`);
  outputLines.push(`\nDominant: ${ea.dominant?.toUpperCase()} | Deficient: ${ea.deficient?.toUpperCase()}`);

  // Chart Rulers
  outputLines.push('\n┌─────────────────────────────────────┐');
  outputLines.push('│          CHART RULERS               │');
  outputLines.push('└─────────────────────────────────────┘');

  const tradRuler = planets.get(profile.chartRulers.traditional);
  const modRuler = planets.get(profile.chartRulers.modern);
  const tradPlacement = profile.placements.find(p => p.planetId === profile.chartRulers.traditional);
  const modPlacement = profile.placements.find(p => p.planetId === profile.chartRulers.modern);

  outputLines.push(`Traditional: ${tradRuler?.symbol} ${tradRuler?.name} in ${signs.get(tradPlacement?.signId || '')?.name}`);
  outputLines.push(`Modern: ${modRuler?.symbol} ${modRuler?.name} in ${signs.get(modPlacement?.signId || '')?.name}`);

  // Aspects
  outputLines.push('\n┌─────────────────────────────────────┐');
  outputLines.push('│            ASPECTS                  │');
  outputLines.push('└─────────────────────────────────────┘');

  if (profile.aspects?.planetary) {
    profile.aspects.planetary.forEach(a => {
      const aspectType = aspects.get(a.aspectId);
      const p1 = planets.get(a.planet1Id);
      const p2 = planets.get(a.planet2Id);
      outputLines.push(`${p1?.symbol} ${aspectType?.symbol} ${p2?.symbol}  ${p1?.name} ${aspectType?.name} ${p2?.name} (${a.orbDegree}°${a.orbMinute}' ${a.direction})`);
    });
  }

  // Configurations
  if (profile.configurations && profile.configurations.length > 0) {
    outputLines.push('\n┌─────────────────────────────────────┐');
    outputLines.push('│        CONFIGURATIONS               │');
    outputLines.push('└─────────────────────────────────────┘');

    profile.configurations.forEach(c => {
      outputLines.push(`◈ ${c.fullName}`);
    });
  }

  return outputLines.join('\n');
}

function formatFullHumanDesignContext(profile: AstroProfile): string {
  const hd = profile.humanDesignProfile;
  if (!hd) return '';

  const outputLines: string[] = [];

  outputLines.push(`
═══════════════════════════════════════════════════════════════════════════════
                             HUMAN DESIGN CHART
═══════════════════════════════════════════════════════════════════════════════`);

  // Core Design
  outputLines.push('\n┌─────────────────────────────────────┐');
  outputLines.push('│          CORE DESIGN                │');
  outputLines.push('└─────────────────────────────────────┘');

  outputLines.push(`Type: ${hd.type}`);
  outputLines.push(`Strategy: ${hd.strategy}`);
  outputLines.push(`Authority: ${hd.authority}`);
  outputLines.push(`Profile: ${hd.profile}`);
  outputLines.push(`Definition: ${hd.definition}`);
  outputLines.push(`Incarnation Cross: ${hd.incarnationCross}`);

  // Centers
  outputLines.push('\n┌─────────────────────────────────────┐');
  outputLines.push('│            CENTERS                  │');
  outputLines.push('└─────────────────────────────────────┘');

  const allCenterIds = ['head-center', 'ajna-center', 'throat-center', 'g-center', 'heart-center', 'spleen-center', 'solar-plexus-center', 'sacral-center', 'root-center'];

  allCenterIds.forEach(id => {
    const center = hdCenters.get(id);
    const isDefined = hd.definedCenterIds.includes(id);
    const status = isDefined ? '■ DEFINED' : '□ Undefined';
    outputLines.push(`${status.padEnd(14)} ${center?.name}`);
  });

  // Defined Channels
  outputLines.push('\n┌─────────────────────────────────────┐');
  outputLines.push('│        DEFINED CHANNELS             │');
  outputLines.push('└─────────────────────────────────────┘');

  hd.definedChannelIds.forEach(id => {
    const channel = hdChannels.get(id);
    if (channel) {
      outputLines.push(`${channel.gate1Number}-${channel.gate2Number}: ${channel.name} (${channel.circuitType})`);
    }
  });

  // Personality Gates (Conscious)
  outputLines.push('\n┌─────────────────────────────────────┐');
  outputLines.push('│   PERSONALITY GATES (Conscious)     │');
  outputLines.push('└─────────────────────────────────────┘');

  hd.personalityGates.forEach(g => {
    const gate = hdGates.get(`gate-${g.gateNumber}`);
    const center = hdCenters.get(gate?.centerId || '');
    outputLines.push(`Gate ${g.gateNumber}.${g.line} (${(g.planet || '').padEnd(10)}) - ${gate?.name || ''} [${center?.name || ''}]`);
  });

  // Design Gates (Unconscious)
  outputLines.push('\n┌─────────────────────────────────────┐');
  outputLines.push('│     DESIGN GATES (Unconscious)      │');
  outputLines.push('└─────────────────────────────────────┘');

  hd.designGates.forEach(g => {
    const gate = hdGates.get(`gate-${g.gateNumber}`);
    const center = hdCenters.get(gate?.centerId || '');
    outputLines.push(`Gate ${g.gateNumber}.${g.line} (${(g.planet || '').padEnd(10)}) - ${gate?.name || ''} [${center?.name || ''}]`);
  });

  return outputLines.join('\n');
}

function formatFullGeneKeysContext(profile: AstroProfile): string {
  const gk = profile.geneKeysProfile;
  if (!gk) return '';

  const outputLines: string[] = [];

  outputLines.push(`
═══════════════════════════════════════════════════════════════════════════════
                             GENE KEYS PROFILE
═══════════════════════════════════════════════════════════════════════════════`);

  const formatSphere = (sphere: { sphereName: string; geneKeyNumber: number; line: number; planetarySource: string }) => {
    const key = geneKeys.get(`gk-${sphere.geneKeyNumber}`);
    if (!key) return `${sphere.sphereName}: Key ${sphere.geneKeyNumber}.${sphere.line}`;

    return `${sphere.sphereName.padEnd(12)} Key ${sphere.geneKeyNumber}.${sphere.line}
               Shadow: ${key.shadow.name} → Gift: ${key.gift.name} → Siddhi: ${key.siddhi.name}
               Source: ${sphere.planetarySource}`;
  };

  // Activation Sequence
  outputLines.push('\n┌─────────────────────────────────────┐');
  outputLines.push('│  ACTIVATION SEQUENCE (Purpose)      │');
  outputLines.push('└─────────────────────────────────────┘');
  outputLines.push(formatSphere(gk.lifesWork));
  outputLines.push(formatSphere(gk.evolution));
  outputLines.push(formatSphere(gk.radiance));
  outputLines.push(formatSphere(gk.purpose));

  // Venus Sequence
  outputLines.push('\n┌─────────────────────────────────────┐');
  outputLines.push('│     VENUS SEQUENCE (Heart)          │');
  outputLines.push('└─────────────────────────────────────┘');
  outputLines.push(formatSphere(gk.attraction));
  outputLines.push(formatSphere(gk.iq));
  outputLines.push(formatSphere(gk.eq));
  outputLines.push(formatSphere(gk.sq));

  // Pearl Sequence
  outputLines.push('\n┌─────────────────────────────────────┐');
  outputLines.push('│    PEARL SEQUENCE (Prosperity)      │');
  outputLines.push('└─────────────────────────────────────┘');
  outputLines.push(formatSphere(gk.vocation));
  outputLines.push(formatSphere(gk.culture));
  outputLines.push(formatSphere(gk.pearl));

  // Additional Spheres
  outputLines.push('\n┌─────────────────────────────────────┐');
  outputLines.push('│       ADDITIONAL SPHERES            │');
  outputLines.push('└─────────────────────────────────────┘');
  if (gk.brand) outputLines.push(formatSphere(gk.brand));
  if (gk.relating) outputLines.push(formatSphere(gk.relating));
  if (gk.creativity) outputLines.push(formatSphere(gk.creativity));
  if (gk.stability) outputLines.push(formatSphere(gk.stability));

  return outputLines.join('\n');
}

function formatSystemBridges(profile: AstroProfile): string {
  const gk = profile.geneKeysProfile;
  const hd = profile.humanDesignProfile;

  if (!gk || !hd) return '';

  const outputLines: string[] = [];

  outputLines.push(`
═══════════════════════════════════════════════════════════════════════════════
                           CROSS-SYSTEM BRIDGES
═══════════════════════════════════════════════════════════════════════════════`);

  outputLines.push('\n┌─────────────────────────────────────┐');
  outputLines.push('│    PLANET → SPHERE → GATE MAP       │');
  outputLines.push('└─────────────────────────────────────┘');

  // Sun connection
  const sunPlacement = profile.placements.find(p => p.planetId === 'sun');
  const sunSign = signs.get(sunPlacement?.signId || '');
  outputLines.push(`☉ Sun in ${sunSign?.name} → Life's Work Sphere → Gate ${gk.lifesWork.geneKeyNumber}`);
  outputLines.push(`   Gene Key ${gk.lifesWork.geneKeyNumber}: ${geneKeys.get(`gk-${gk.lifesWork.geneKeyNumber}`)?.shadow.name} → ${geneKeys.get(`gk-${gk.lifesWork.geneKeyNumber}`)?.gift.name} → ${geneKeys.get(`gk-${gk.lifesWork.geneKeyNumber}`)?.siddhi.name}`);

  // Moon connection
  const moonPlacement = profile.placements.find(p => p.planetId === 'moon');
  const moonSign = signs.get(moonPlacement?.signId || '');
  outputLines.push(`\n☽ Moon in ${moonSign?.name} → Attraction Sphere → Gate ${gk.attraction.geneKeyNumber}`);
  outputLines.push(`   Gene Key ${gk.attraction.geneKeyNumber}: ${geneKeys.get(`gk-${gk.attraction.geneKeyNumber}`)?.shadow.name} → ${geneKeys.get(`gk-${gk.attraction.geneKeyNumber}`)?.gift.name} → ${geneKeys.get(`gk-${gk.attraction.geneKeyNumber}`)?.siddhi.name}`);

  // Venus connection
  const venusPlacement = profile.placements.find(p => p.planetId === 'venus');
  const venusSign = signs.get(venusPlacement?.signId || '');
  outputLines.push(`\n♀ Venus in ${venusSign?.name} → IQ Sphere → Gate ${gk.iq.geneKeyNumber}`);
  outputLines.push(`   Gene Key ${gk.iq.geneKeyNumber}: ${geneKeys.get(`gk-${gk.iq.geneKeyNumber}`)?.shadow.name} → ${geneKeys.get(`gk-${gk.iq.geneKeyNumber}`)?.gift.name} → ${geneKeys.get(`gk-${gk.iq.geneKeyNumber}`)?.siddhi.name}`);

  // Mars connection
  const marsPlacement = profile.placements.find(p => p.planetId === 'mars');
  const marsSign = signs.get(marsPlacement?.signId || '');
  outputLines.push(`\n♂ Mars in ${marsSign?.name} → EQ Sphere → Gate ${gk.eq.geneKeyNumber}`);
  outputLines.push(`   Gene Key ${gk.eq.geneKeyNumber}: ${geneKeys.get(`gk-${gk.eq.geneKeyNumber}`)?.shadow.name} → ${geneKeys.get(`gk-${gk.eq.geneKeyNumber}`)?.gift.name} → ${geneKeys.get(`gk-${gk.eq.geneKeyNumber}`)?.siddhi.name}`);

  outputLines.push('\n┌─────────────────────────────────────┐');
  outputLines.push('│        UNIFIED SUMMARY              │');
  outputLines.push('└─────────────────────────────────────┘');

  outputLines.push(`HD Type: ${hd.type} | Strategy: ${hd.strategy} | Authority: ${hd.authority}`);
  outputLines.push(`Profile: ${hd.profile} | Definition: ${hd.definition}`);
  outputLines.push(`Incarnation Cross: ${hd.incarnationCross}`);
  outputLines.push(`\nDominant Element: ${profile.elementalAnalysis.dominant?.toUpperCase()}`);
  outputLines.push(`Chart Ruler: ${planets.get(profile.chartRulers.modern)?.name} (modern)`);

  return outputLines.join('\n');
}

function formatFocusHighlight(profile: AstroProfile, selection: ContemplationSelection): string {
  if (!selection.focus) return '';

  const outputLines: string[] = [];

  outputLines.push(`
═══════════════════════════════════════════════════════════════════════════════
                        ★ CURRENT FOCUS: ${selection.focus.name.toUpperCase()}
═══════════════════════════════════════════════════════════════════════════════`);

  // Add specific detail based on focus type
  switch (selection.focus.type) {
    case 'placement': {
      const placement = profile.placements.find(p => p.planetId === selection.focus?.id);
      if (placement) {
        outputLines.push(formatPlacementFocus(placement, profile));
      }
      break;
    }
    case 'aspect': {
      const aspect = profile.aspects?.planetary?.find(a => a.id === selection.focus?.id);
      if (aspect) {
        outputLines.push(formatAspectFocus(aspect));
      }
      break;
    }
    case 'gate':
    case 'geneKey': {
      const keyNumber = parseInt(selection.focus.id.replace(/^(gate-|gk-)/, ''));
      outputLines.push(formatGateKeyFocus(keyNumber, profile));
      break;
    }
    case 'channel': {
      const channel = hdChannels.get(selection.focus.id);
      if (channel) {
        outputLines.push(formatChannelFocus(channel));
      }
      break;
    }
    case 'transitAspect': {
      if (selection.focus?.transitData) {
        outputLines.push(formatTransitAspectFocus(selection.focus.transitData, profile));
      }
      break;
    }
    case 'fixed-star': {
      const conjunctions = getFixedStarConjunctions(profile.placements);
      const conj = conjunctions.find((c) => c.star.id === selection.focus?.id);
      if (conj) {
        outputLines.push(formatFixedStarFocus(conj));
      }
      break;
    }
    case 'element': {
      const el = elements.get(selection.focus.id);
      if (el) {
        outputLines.push(formatElementFocus(el as Element, profile));
      }
      break;
    }
    case 'sphere': {
      // id format: "seq-{sphereSlug}-{gkNum}" — extract the trailing number
      const match = selection.focus.id.match(/(\d+)$/);
      const keyNumber = match ? parseInt(match[1]) : NaN;
      if (!isNaN(keyNumber)) {
        outputLines.push(formatGateKeyFocus(keyNumber, profile));
      }
      break;
    }
  }

  return outputLines.join('\n');
}

function formatPlacementFocus(placement: NatalPlacement, profile: AstroProfile): string {
  const planet = planets.get(placement.planetId);
  const sign = signs.get(placement.signId);
  const house = houses.get(placement.houseId);
  const element = sign?.elementId ? elements.get(sign.elementId) : undefined;

  const outputLines: string[] = [];
  outputLines.push(`\n${planet?.symbol} ${planet?.name} in ${sign?.name}`);
  outputLines.push(`Position: ${placement.degree}°${placement.minute}' ${sign?.name}`);
  outputLines.push(`House: ${house?.name}`);
  outputLines.push(`Element: ${element?.name}`);
  if (placement.retrograde) outputLines.push('Status: Retrograde ℞');
  if (placement.dignityId) outputLines.push(`Dignity: ${placement.dignityId}`);
  if (placement.isChartRuler) outputLines.push(`Chart Ruler: ${placement.isChartRuler}`);

  // Related aspects
  const relatedAspects = profile.aspects?.planetary?.filter(
    a => a.planet1Id === placement.planetId || a.planet2Id === placement.planetId
  );
  if (relatedAspects && relatedAspects.length > 0) {
    outputLines.push('\nAspects to this planet:');
    relatedAspects.forEach(a => {
      const aspectType = aspects.get(a.aspectId);
      const other = a.planet1Id === placement.planetId ? a.planet2Id : a.planet1Id;
      const otherPlanet = planets.get(other);
      outputLines.push(`  ${aspectType?.symbol} ${aspectType?.name} ${otherPlanet?.name} (${a.orbDegree}°${a.orbMinute}')`);
    });
  }

  return outputLines.join('\n');
}

function formatAspectFocus(aspect: NatalAspect): string {
  const aspectType = aspects.get(aspect.aspectId);
  const planet1 = planets.get(aspect.planet1Id);
  const planet2 = planets.get(aspect.planet2Id);

  return `
${planet1?.symbol} ${planet1?.name} ${aspectType?.symbol} ${aspectType?.name} ${planet2?.symbol} ${planet2?.name}
Orb: ${aspect.orbDegree}°${aspect.orbMinute}'
Direction: ${aspect.direction}
Nature: ${aspectType?.nature}`;
}

function formatElementFocus(element: Element, profile: AstroProfile): string {
  const outputLines: string[] = [];
  outputLines.push(`\n${element.symbol} ${element.name} — Elemental Embodiment`);
  outputLines.push(`Core Principle: ${element.corePrinciple}`);
  outputLines.push(`Core Quality: ${element.coreQuality}`);
  outputLines.push(`Key Traits: ${element.keyTraits.join(', ')}`);
  outputLines.push(`Shadow Side: ${element.shadowSide}`);
  outputLines.push(`Element Dynamics: ${element.elementDynamics}`);

  // Planets in this element from natal chart
  const planetsInElement = profile.placements.filter(p => {
    const sign = signs.get(p.signId);
    return sign?.elementId === element.id;
  });

  if (planetsInElement.length > 0) {
    outputLines.push(`\nPlanets expressing through ${element.name} in this chart:`);
    planetsInElement.forEach(p => {
      const planet = planets.get(p.planetId);
      const sign = signs.get(p.signId);
      const house = houses.get(p.houseId);
      outputLines.push(`  ${planet?.symbol ?? ''} ${planet?.name} in ${sign?.name} (${house?.name})`);
    });
  } else {
    outputLines.push(`\nNote: No natal planets are placed in ${element.name} signs.`);
    outputLines.push(`This elemental voice speaks to the integration and learning edge.`);
  }

  return outputLines.join('\n');
}

function formatGateKeyFocus(keyNumber: number, profile: AstroProfile): string {
  const gate = hdGates.get(`gate-${keyNumber}`);
  const key = geneKeys.get(`gk-${keyNumber}`);
  const center = hdCenters.get(gate?.centerId || '');

  const outputLines: string[] = [];
  outputLines.push(`\nGate/Key ${keyNumber}: ${gate?.name || key?.name}`);
  outputLines.push(`I Ching: ${gate?.iChingName || ''}`);
  outputLines.push(`Center: ${center?.name || ''}`);

  if (key) {
    outputLines.push(`\nGene Key Spectrum:`);
    outputLines.push(`  Shadow: ${key.shadow.name} - ${key.shadow.description}`);
    outputLines.push(`  Gift: ${key.gift.name} - ${key.gift.description}`);
    outputLines.push(`  Siddhi: ${key.siddhi.name} - ${key.siddhi.description}`);
  }

  // Find which activations have this gate
  const hd = profile.humanDesignProfile;
  if (hd) {
    const personalityActivation = hd.personalityGates.find(g => g.gateNumber === keyNumber);
    const designActivation = hd.designGates.find(g => g.gateNumber === keyNumber);

    if (personalityActivation) {
      outputLines.push(`\nPersonality (Conscious): Line ${personalityActivation.line} via ${personalityActivation.planet}`);
    }
    if (designActivation) {
      outputLines.push(`Design (Unconscious): Line ${designActivation.line} via ${designActivation.planet}`);
    }
  }

  return outputLines.join('\n');
}

function formatChannelFocus(channel: { gate1Number: number; gate2Number: number; name: string; circuitType: string; theme: string; center1Id: string; center2Id: string }): string {
  const gate1 = hdGates.get(`gate-${channel.gate1Number}`);
  const gate2 = hdGates.get(`gate-${channel.gate2Number}`);
  const center1 = hdCenters.get(channel.center1Id);
  const center2 = hdCenters.get(channel.center2Id);

  return `
Channel ${channel.gate1Number}-${channel.gate2Number}: ${channel.name}
Circuit: ${channel.circuitType}
Theme: ${channel.theme}
Connects: ${center1?.name} ↔ ${center2?.name}

Gate ${channel.gate1Number}: ${gate1?.name}
Gate ${channel.gate2Number}: ${gate2?.name}`;
}

function formatTransitAspectFocus(transit: TransitNatalAspect, profile: AstroProfile): string {
  const natalPlacement = profile.placements.find(p => p.planetId === transit.natalPlanetId);
  const natalSign = signs.get(natalPlacement?.signId || '');
  const natalHouse = houses.get(natalPlacement?.houseId || '');
  const transitZodiac = longitudeToZodiac(transit.transitDegree);

  const outputLines: string[] = [];

  outputLines.push(`\n${transit.transitSymbol} ${transit.transitPlanet} ${transit.aspectSymbol} natal ${transit.natalSymbol} ${transit.natalPlanet}`);
  outputLines.push(`\nTRANSIT DETAILS:`);
  outputLines.push(`  ${transit.transitPlanet} currently at ${transitZodiac.degree}°${transitZodiac.minute}' ${transit.transitSign.charAt(0).toUpperCase() + transit.transitSign.slice(1)}`);
  outputLines.push(`  ${transit.isApplying ? 'Applying' : 'Separating'} aspect (orb: ${transit.orb}°)`);

  outputLines.push(`\nNATAL PLACEMENT BEING ACTIVATED:`);
  outputLines.push(`  ${transit.natalPlanet} in ${natalSign?.name || ''} (${natalPlacement?.degree}°${natalPlacement?.minute}')`);
  outputLines.push(`  House: ${natalHouse?.name || ''}`);
  if (natalPlacement?.dignityId) {
    outputLines.push(`  Dignity: ${natalPlacement.dignityId}`);
  }

  outputLines.push(`\nASPECT NATURE:`);
  outputLines.push(`  Type: ${transit.aspectType} (${transit.aspectAngle}°)`);
  outputLines.push(`  Nature: ${transit.nature.charAt(0).toUpperCase() + transit.nature.slice(1)}`);

  // Find natal aspects to the planet being transited
  const natalAspects = profile.aspects?.planetary?.filter(
    a => a.planet1Id === transit.natalPlanetId || a.planet2Id === transit.natalPlanetId
  );
  if (natalAspects && natalAspects.length > 0) {
    outputLines.push(`\nNATAL ASPECTS TO ${transit.natalPlanet.toUpperCase()}:`);
    natalAspects.slice(0, 5).forEach(a => {
      const aspectType = aspects.get(a.aspectId);
      const other = a.planet1Id === transit.natalPlanetId ? a.planet2Id : a.planet1Id;
      const otherPlanet = planets.get(other);
      outputLines.push(`  ${aspectType?.symbol} ${aspectType?.name} ${otherPlanet?.name}`);
    });
  }

  return outputLines.join('\n');
}

// Get available focus options based on category and type
export function getFocusOptions(
  profile: AstroProfile,
  _category: ContemplationCategory,
  type: ContemplationType
): FocusEntity[] {
  switch (type) {
    case 'placementDeepDive':
      return profile.placements.map(p => ({
        type: 'placement' as const,
        id: p.planetId,
        name: `${planets.get(p.planetId)?.name} in ${signs.get(p.signId)?.name}`,
      }));

    case 'aspectExploration':
      return (profile.aspects?.planetary || []).map(a => ({
        type: 'aspect' as const,
        id: a.id,
        name: `${planets.get(a.planet1Id)?.name} ${aspects.get(a.aspectId)?.symbol} ${planets.get(a.planet2Id)?.name}`,
      }));

    case 'configurationReading':
      return (profile.configurations || []).map(c => ({
        type: 'configuration' as const,
        id: c.id,
        name: c.fullName,
      }));

    case 'gateContemplation': {
      const allGates = [
        ...(profile.humanDesignProfile?.personalityGates || []),
        ...(profile.humanDesignProfile?.designGates || []),
      ];
      const uniqueGates = [...new Map(allGates.map(g => [g.gateNumber, g])).values()];
      return uniqueGates.map(g => ({
        type: 'gate' as const,
        id: `gate-${g.gateNumber}`,
        name: `Gate ${g.gateNumber}: ${hdGates.get(`gate-${g.gateNumber}`)?.name || ''}`,
      }));
    }

    case 'channelExploration':
      return (profile.humanDesignProfile?.definedChannelIds || []).map(id => {
        const channel = hdChannels.get(id);
        return {
          type: 'channel' as const,
          id,
          name: channel ? `${channel.gate1Number}-${channel.gate2Number}: ${channel.name}` : id,
        };
      });

    case 'centerAwareness':
      return Array.from(hdCenters.values()).map(c => ({
        type: 'center' as const,
        id: c.id,
        name: c.name,
      }));

    case 'shadowWork':
    case 'giftActivation':
    case 'siddhiContemplation':
    case 'gateKeyBridge': {
      const gk = profile.geneKeysProfile;
      if (!gk) return [];
      const spheres = [gk.lifesWork, gk.evolution, gk.radiance, gk.purpose, gk.attraction, gk.iq, gk.eq, gk.sq, gk.vocation, gk.culture, gk.pearl];
      const uniqueKeys = [...new Map(spheres.map(s => [s.geneKeyNumber, s])).values()];
      return uniqueKeys.map(s => {
        const key = geneKeys.get(`gk-${s.geneKeyNumber}`);
        return {
          type: 'geneKey' as const,
          id: `gk-${s.geneKeyNumber}`,
          name: `Key ${s.geneKeyNumber}: ${key?.name || ''} (${s.sphereName})`,
        };
      });
    }

    case 'galacticPointReading': {
      const galConj = getGalacticConjunctions(profile.placements);
      if (galConj.length === 0) return [];
      return galConj.map((c) => ({
        type: 'galactic-point' as const,
        id: c.point.id,
        name: `${c.point.name} (${planets.get(c.planetId)?.name ?? c.planetId}, ${c.orbDegree.toFixed(2)}° orb)`,
      }));
    }

    case 'elementalEmbodiment': {
      return ['fire', 'earth', 'air', 'water'].map(id => {
        const el = elements.get(id);
        return {
          type: 'element' as const,
          id,
          name: el ? `${el.symbol} ${el.name}` : id,
        };
      });
    }

    case 'sequenceEmbodiment': {
      const gk = profile.geneKeysProfile;
      if (!gk) return [];
      const sequenceSpheres: Array<{ sphere: typeof gk.lifesWork; sphereName: string }> = [
        { sphere: gk.lifesWork, sphereName: "Life's Work" },
        { sphere: gk.evolution,  sphereName: 'Evolution' },
        { sphere: gk.radiance,   sphereName: 'Radiance' },
        { sphere: gk.purpose,    sphereName: 'Purpose' },
      ];
      return sequenceSpheres.map(({ sphere, sphereName }) => {
        const key = geneKeys.get(`gk-${sphere.geneKeyNumber}`);
        // Use unique id: "seq-{sphereSlug}-{gkNum}" so same GK in two spheres stays distinct
        const sphereSlug = sphereName.toLowerCase().replace(/[' ]/g, '');
        return {
          type: 'sphere' as const,
          id: `seq-${sphereSlug}-${sphere.geneKeyNumber}`,
          name: `${sphereName}: Gene Key ${sphere.geneKeyNumber}${key ? ` — ${key.name}` : ''}`,
        };
      });
    }

    case 'fixedStarConjunction': {
      const conjunctions = getFixedStarConjunctions(profile.placements);
      return conjunctions.map((c) => ({
        type: 'fixed-star' as const,
        id: c.star.id,
        name: `${c.star.name} (${planets.get(c.planetId)?.name ?? c.planetId}, ${c.orbDegree.toFixed(2)}° orb)`,
      }));
    }

    case 'transitReading': {
      // Calculate current transit aspects to natal chart
      const natalPlacements = profile.placements.map(p => ({
        planetId: p.planetId,
        signId: p.signId,
        degree: p.degree,
        minute: p.minute,
        retrograde: p.retrograde,
      }));
      const transitAspects = calculateTransitNatalAspects(new Date(), natalPlacements);
      // Return top 10 most significant aspects as focus options
      return transitAspects.slice(0, 10).map(ta => ({
        type: 'transitAspect' as const,
        id: `${ta.transitPlanetId}-${ta.natalPlanetId}-${ta.aspectType}`,
        name: `${ta.transitPlanet} ${ta.aspectSymbol} ${ta.natalPlanet} (${ta.orb}°)`,
        transitData: ta,
      }));
    }

    default:
      return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FIXED STAR CONTEXT FORMATTERS
// ═══════════════════════════════════════════════════════════════════════════════

function formatFixedStarContext(profile: AstroProfile): string {
  const conjunctions = getFixedStarConjunctions(profile.placements);
  if (conjunctions.length === 0) return '';

  const outputLines: string[] = [];
  outputLines.push('\n[FIXED STARS — NATAL ACTIVATIONS]');
  outputLines.push('Stars woven into the natal chart by ecliptic conjunction:');

  conjunctions.forEach((c) => {
    const planet = planets.get(c.planetId);
    const tier = c.isExact ? 'exact' : c.orbDegree <= 1.0 ? 'close' : 'wide';
    outputLines.push(
      `  ★ ${c.star.name} (${c.star.constellation}) conjunct ${planet?.name ?? c.planetId} — ${c.orbDegree.toFixed(2)}° orb [${tier}]`
    );
    outputLines.push(`    Archetype: ${c.star.archetype}`);
    outputLines.push(`    Gift: ${c.star.giftExpression}`);
    outputLines.push(`    Shadow: ${c.star.shadowExpression}`);
    outputLines.push(`    Body: ${c.star.bodyAssociation}`);
  });

  return outputLines.join('\n');
}

function formatFixedStarFocus(conj: import('../fixedStars').FixedStarConjunction): string {
  const planet = planets.get(conj.planetId);
  const signName =
    conj.star.zodiacPosition.sign.charAt(0).toUpperCase() +
    conj.star.zodiacPosition.sign.slice(1);
  const outputLines: string[] = [];

  outputLines.push(`\n★ ${conj.star.name} conjunct ${planet?.name ?? conj.planetId}`);
  outputLines.push(`Constellation: ${conj.star.constellation}`);
  outputLines.push(`Zodiac: ${signName} ${conj.star.zodiacPosition.degree}°${String(conj.star.zodiacPosition.minute).padStart(2, '0')}'`);
  outputLines.push(`Orb: ${conj.orbDegree.toFixed(2)}°${conj.isExact ? ' (exact)' : ''}`);
  outputLines.push(`Body Association: ${conj.star.bodyAssociation}`);
  outputLines.push(`Nature: ${conj.star.nature.join(', ')}`);
  if (conj.star.isRoyalStar) outputLines.push(`Royal Star: ${conj.star.royalStarTitle ?? 'Royal Star'}`);
  if (conj.star.isBehenian) outputLines.push('Behenian: Yes');

  outputLines.push('\nARCHETYPE:');
  outputLines.push(conj.star.archetype);

  outputLines.push('\nGIFT EXPRESSION:');
  outputLines.push(conj.star.giftExpression);

  outputLines.push('\nSHADOW EXPRESSION:');
  outputLines.push(conj.star.shadowExpression);

  outputLines.push('\nTRADITIONAL MEANING:');
  outputLines.push(conj.star.traditionalMeaning);

  outputLines.push('\nCONTEMPLATION QUESTIONS:');
  conj.star.contemplationQuestions.forEach((q, i) => {
    outputLines.push(`${i + 1}. ${q}`);
  });

  return outputLines.join('\n');
}

// ═══════════════════════════════════════════════════════════════════════════════
// GALACTIC ASTROLOGY CONTEXT FORMATTERS
// ═══════════════════════════════════════════════════════════════════════════════

function formatGalacticContext(profile: AstroProfile): string {
  const conjunctions = getGalacticConjunctions(profile.placements);
  const outputLines: string[] = [];
  outputLines.push('\n[GALACTIC ASTROLOGY — NATAL ACTIVATIONS]');
  outputLines.push('The major galactic points woven into this natal chart:');

  if (conjunctions.length === 0) {
    outputLines.push('  No natal planets fall within orb of the major galactic points.');
    outputLines.push('  Note: Even without direct conjunctions, transits to galactic points activate collective themes.');
  } else {
    conjunctions.forEach((c) => {
      const planet = planets.get(c.planetId);
      const tier = c.isExact ? 'exact' : c.orbDegree <= 1.0 ? 'close' : 'wide';
      outputLines.push(
        `  ✦ ${c.point.name} conjunct ${planet?.name ?? c.planetId} — ${c.orbDegree.toFixed(2)}° orb [${tier}]`
      );
      outputLines.push(`    Archetype: ${c.point.archetype}`);
      outputLines.push(`    Theme: ${c.point.contemplationTheme}`);
      outputLines.push(`    Gift: ${c.point.gift}`);
      outputLines.push(`    Challenge: ${c.point.challenge}`);
    });
  }

  // Add current transit activations
  const transitActivations = getGalacticTransitActivationsForContext(profile, conjunctions);
  if (transitActivations) {
    outputLines.push('\n[CURRENT GALACTIC TRANSIT ACTIVATIONS]');
    outputLines.push(transitActivations);
  }

  return outputLines.join('\n');
}

function getGalacticTransitActivationsForContext(
  _profile: AstroProfile,
  natalConjunctions: GalacticConjunction[],
): string {
  try {
    const weather = getCosmicWeather(new Date());
    const activations = getGalacticTransitActivations(weather.positions, natalConjunctions);
    if (activations.length === 0) return '';
    return activations
      .map((a) => {
        const personal = a.isPersonal ? ' [personal — natal planet here]' : '';
        return `  • ${a.transitPlanetName} activating ${a.point.name} — ${a.orbDegree.toFixed(2)}° orb${personal}`;
      })
      .join('\n');
  } catch {
    return '';
  }
}

function formatGalacticPointFocus(conj: GalacticConjunction): string {
  const planet = planets.get(conj.planetId);
  const signName =
    conj.point.zodiacSign.charAt(0).toUpperCase() + conj.point.zodiacSign.slice(1);
  const outputLines: string[] = [];

  outputLines.push(`\n✦ ${conj.point.name} conjunct ${planet?.name ?? conj.planetId}`);
  outputLines.push(`Zodiac: ${signName} ${conj.point.zodiacDegree}°${String(conj.point.zodiacMinute).padStart(2, '0')}'`);
  outputLines.push(`Ecliptic Longitude: ${conj.point.eclipticLongitude}°`);
  outputLines.push(`Orb: ${conj.orbDegree.toFixed(2)}°${conj.isExact ? ' (exact)' : ''}`);

  outputLines.push('\nARCHETYPE:');
  outputLines.push(conj.point.archetype);

  outputLines.push('\nDESCRIPTION:');
  outputLines.push(conj.point.description);

  outputLines.push('\nGIFT:');
  outputLines.push(conj.point.gift);

  outputLines.push('\nCHALLENGE:');
  outputLines.push(conj.point.challenge);

  outputLines.push('\nCONTEMPLATION THEME:');
  outputLines.push(conj.point.contemplationTheme);

  return outputLines.join('\n');
}

// Export for use in focus context building
export { formatGalacticPointFocus };

// ═══════════════════════════════════════════════════════════════════════════════
// ILOS CONTEXT INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Append ILOS context to profile context based on contemplation category.
 * Integrates Intentional Life OS data (goals, wins, methodology) into the
 * context sent to the AI.
 */
export function appendILOSContext(
  profileContext: string,
  category: ContemplationCategory,
  personalCtx?: PersonalContext,
): string {
  const ilosSection = formatILOSContextForCategory(category, personalCtx);
  if (ilosSection) {
    return profileContext + '\n\n' + ilosSection;
  }
  return profileContext;
}

/**
 * Append curated knowledge excerpts to profile context.
 * Injects Stefano's astrological alchemy, Kybalion hermetic principles,
 * and cross-tradition synthesis bridges — selected by relevance to the
 * current contemplation type.
 *
 * Token budget: 2000 tokens default (fits within Claude's context alongside
 * the full profile context without exceeding practical limits).
 * Set to 0 to disable knowledge injection.
 */
export function appendKnowledgeExcerpts(
  profileContext: string,
  selection: ContemplationSelection,
  tokenBudget: number = 2000
): string {
  if (tokenBudget <= 0) return profileContext;

  const excerpts = getRelevantExcerpts(
    selection.category,
    selection.type,
    tokenBudget
  );

  const knowledgeSection = formatExcerptsForContext(excerpts);
  if (knowledgeSection) {
    return profileContext + '\n\n' + knowledgeSection;
  }
  return profileContext;
}
