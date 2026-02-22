import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useProfile } from '../context';
import { sendContemplationStream, type Message } from '../services/claude';
import {
  BASE_PROMPT,
  CATEGORY_PROMPTS,
  CONTEMPLATION_TYPE_PROMPTS,
  buildFullPrompt,
  getDefaultPersonaForType,
  getEmbodimentContext,
  getModelForType,
  getModelId,
} from '../services/contemplation/prompts';
import { getCustomPrompt } from '../services/contemplation/customTypes';
import {
  formatProfileContext,
  appendILOSContext,
  appendKnowledgeExcerpts,
  type ContemplationCategory,
  type ContemplationType,
  type FocusEntity,
  type ContemplationSelection,
} from '../services/contemplation/context';
import {
  GUIDED_PATHWAYS,
  completeStep as completePathwayStep,
  loadPathwayProgress,
  type PathwayStep,
} from '../services/pathways';
import type { EntityInfo } from '../services/entities';
import { registerPersonalContextEntities } from '../services/entities';
import {
  type SavedSession,
  loadSessions,
  generateSessionId,
  upsertSession,
  deleteSession as deleteSessionFromStorage,
} from '../services/sessions';

// ─── Session Migration (Sprint Q) ─────────────────────────────────────────────
// Migrate old sessions whose category changed when types were reorganized.
// Safe to run on every resume — no-op for already-migrated sessions.

const TYPE_CATEGORY_REMAP: Partial<Record<string, ContemplationCategory>> = {
  numerologyReading: 'numerology',
  numerologyOverview: 'numerology',
  cosmicEmbodiment: 'cosmicEmbodiment',
};

export function migrateSessionCategory(session: SavedSession): SavedSession {
  const remappedCategory = TYPE_CATEGORY_REMAP[session.contemplationType];
  if (remappedCategory && session.category !== remappedCategory) {
    return { ...session, category: remappedCategory };
  }
  return session;
}

// ─── Pathway context from navigation ──────────────────────────────────────────
export interface PathwayContext {
  pathwayId: string;
  stepId: string;
  category: ContemplationCategory;
  contemplationType: ContemplationType;
}

// Generic seed for pre-filling a session (Transit Oracle, profile deep links)
export interface ContemplationSeed {
  category: ContemplationCategory;
  contemplationType: ContemplationType;
  focusEntity?: FocusEntity | null;
}

// Derive display name from a kebab-case ID (e.g. "north-node" → "North Node")
function nameFromId(id: string): string {
  return id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Parse a ContemplationSeed from URL search params (used by profile detail page deep links)
function parseSeedFromParams(searchParams: URLSearchParams): ContemplationSeed | null {
  const focus = searchParams.get('focus');
  if (!focus) return null;

  switch (focus) {
    case 'placement': {
      const planet = searchParams.get('planet');
      if (!planet) return null;
      return {
        category: 'astrology',
        contemplationType: 'placementDeepDive',
        focusEntity: { type: 'placement', id: planet, name: nameFromId(planet), entitySystem: 'astrology' },
      };
    }
    case 'transit':
      return { category: 'astrology', contemplationType: 'transitOverview' };
    case 'gate': {
      const gate = searchParams.get('gate');
      if (!gate) return null;
      return {
        category: 'humanDesign',
        contemplationType: 'gateContemplation',
        focusEntity: { type: 'gate', id: `gate-${gate}`, name: `Gate ${gate}`, entitySystem: 'humanDesign' },
      };
    }
    case 'channel': {
      const gates = searchParams.get('gates');
      if (!gates) return null;
      const [g1, g2] = gates.split(',');
      return {
        category: 'humanDesign',
        contemplationType: 'channelExploration',
        focusEntity: { type: 'channel', id: `channel-${g1}-${g2}`, name: `Channel ${g1}–${g2}`, entitySystem: 'humanDesign' },
      };
    }
    case 'center': {
      const center = searchParams.get('center');
      if (!center) return null;
      return {
        category: 'humanDesign',
        contemplationType: 'centerAwareness',
        focusEntity: { type: 'center', id: `${center}-center`, name: nameFromId(center) + ' Center', entitySystem: 'humanDesign' },
      };
    }
    case 'shadow': {
      const gk = searchParams.get('gk');
      if (!gk) return null;
      return {
        category: 'geneKeys',
        contemplationType: 'shadowWork',
        focusEntity: { type: 'geneKey', id: `gk-${gk}`, name: `Gene Key ${gk}`, entitySystem: 'geneKeys' },
      };
    }
    case 'gift': {
      const gk = searchParams.get('gk');
      if (!gk) return null;
      return {
        category: 'geneKeys',
        contemplationType: 'giftActivation',
        focusEntity: { type: 'geneKey', id: `gk-${gk}`, name: `Gene Key ${gk}`, entitySystem: 'geneKeys' },
      };
    }
    case 'siddhi': {
      const gk = searchParams.get('gk');
      if (!gk) return null;
      return {
        category: 'geneKeys',
        contemplationType: 'siddhiContemplation',
        focusEntity: { type: 'geneKey', id: `gk-${gk}`, name: `Gene Key ${gk}`, entitySystem: 'geneKeys' },
      };
    }
    case 'aspect': {
      const planets = searchParams.get('planets');
      if (!planets) return null;
      const [p1, p2] = planets.split(',');
      return {
        category: 'astrology',
        contemplationType: 'aspectExploration',
        focusEntity: { type: 'aspect', id: `${p1}-${p2}`, name: `${nameFromId(p1)}–${nameFromId(p2)}`, entitySystem: 'astrology' },
      };
    }
    case 'configuration': {
      const type = searchParams.get('type');
      if (!type) return null;
      return {
        category: 'astrology',
        contemplationType: 'configurationReading',
        focusEntity: { type: 'configuration', id: type, name: nameFromId(type), entitySystem: 'astrology' },
      };
    }
    default:
      return null;
  }
}


export type ContemplationLevel = 'beginner' | 'advanced' | 'master';

export interface ContemplationTypeOption {
  id: ContemplationType;
  name: string;
  description: string;
  needsFocus?: boolean;
  level?: ContemplationLevel;
}

export const CONTEMPLATION_TYPES: Record<ContemplationCategory, ContemplationTypeOption[]> = {
  astrology: [
    { id: 'natalOverview',        name: 'Natal Overview',         description: 'Big picture of your cosmic blueprint',                              level: 'beginner' },
    { id: 'transitOverview',      name: 'Transit Overview',       description: 'General overview of current cosmic weather',                        level: 'beginner' },
    { id: 'placementOverview',    name: 'All Placements',         description: 'Explore all your planetary placements',                             level: 'beginner' },
    { id: 'aspectOverview',       name: 'All Aspects',            description: 'Explore all your planetary aspects',                                level: 'beginner' },
    { id: 'profileExploration',   name: 'Profile Lines',          description: 'Your conscious/unconscious roles',                                  level: 'beginner' },
    { id: 'placementDeepDive',    name: 'Placement Deep Dive',    description: 'Explore a specific planet placement',      needsFocus: true,         level: 'advanced' },
    { id: 'transitReading',       name: 'Focused Transit',        description: 'Explore a specific transit in depth',       needsFocus: true,         level: 'advanced' },
    { id: 'aspectExploration',    name: 'Aspect Exploration',     description: 'Understand planetary dialogues',            needsFocus: true,         level: 'advanced' },
    { id: 'elementalBalance',     name: 'Elemental Balance',      description: 'Explore your element distribution',                                 level: 'advanced' },
    { id: 'configurationReading', name: 'Configuration Reading',  description: 'Interpret aspect patterns',                 needsFocus: true,         level: 'advanced' },
  ],
  humanDesign: [
    { id: 'typeStrategy',       name: 'Type & Strategy',    description: 'Your energy type and decision-making',                           level: 'beginner' },
    { id: 'authorityCheckIn',   name: 'Authority Check-in', description: 'Connect with inner authority',                                  level: 'beginner' },
    { id: 'gateOverview',       name: 'All Gates',          description: 'Explore all your defined gates',                                level: 'beginner' },
    { id: 'channelOverview',    name: 'All Channels',       description: 'Explore all your defined channels',                             level: 'beginner' },
    { id: 'centerOverview',     name: 'All Centers',        description: 'Explore your defined and undefined centers',                    level: 'beginner' },
    { id: 'gateContemplation',  name: 'Gate Contemplation', description: 'Explore a specific gate',         needsFocus: true,             level: 'advanced' },
    { id: 'channelExploration', name: 'Channel Exploration',description: 'Explore a specific channel',      needsFocus: true,             level: 'advanced' },
    { id: 'centerAwareness',    name: 'Center Awareness',   description: 'Explore a specific center',       needsFocus: true,             level: 'advanced' },
    { id: 'profileExploration', name: 'Profile Lines',      description: 'Your conscious/unconscious roles',                              level: 'beginner' },
  ],
  geneKeys: [
    { id: 'shadowOverview',      name: 'All Shadows',          description: 'Explore all your shadow patterns',                    level: 'beginner' },
    { id: 'giftOverview',        name: 'All Gifts',            description: 'Explore all your gift frequencies',                   level: 'beginner' },
    { id: 'siddhiOverview',      name: 'All Siddhis',          description: 'Contemplate all your siddhi potentials',             level: 'beginner' },
    { id: 'shadowWork',          name: 'Shadow Work',          description: 'Gentle shadow illumination',   needsFocus: true,      level: 'advanced' },
    { id: 'giftActivation',      name: 'Gift Activation',      description: 'Embodying your gifts',         needsFocus: true,      level: 'advanced' },
    { id: 'siddhiContemplation', name: 'Siddhi Meditation',    description: 'Highest potential',            needsFocus: true,      level: 'advanced' },
    { id: 'activationSequence',  name: 'Activation Sequence',  description: 'The path of Purpose',                                level: 'master' },
    { id: 'venusSequence',       name: 'Venus Sequence',       description: 'The path of the Heart',                              level: 'master' },
    { id: 'pearlSequence',       name: 'Pearl Sequence',       description: 'The path of Prosperity',                             level: 'master' },
  ],
  crossSystem: [
    { id: 'gateKeyOverview',         name: 'All Gate-Key Bridges',      description: 'Explore how all your gates connect to Gene Keys',                                                           level: 'beginner' },
    { id: 'gateKeyBridge',           name: 'Gate-Key Bridge',           description: 'HD meets Gene Keys',                                                        needsFocus: true, level: 'advanced' },
    { id: 'planetSphereSynthesis',   name: 'Planet-Sphere Synthesis',   description: 'Astrology meets Gene Keys',                                                                level: 'advanced' },
    { id: 'elementalSystemBridge',   name: 'Elemental System Bridge',   description: 'How your dominant element expresses across all three systems simultaneously',               level: 'advanced' },
    { id: 'holisticReading',         name: 'Holistic Reading',          description: 'All three systems woven together',                                                         level: 'master' },
    { id: 'lifePathSynthesis',       name: 'Life Path Synthesis',       description: 'Numerology Life Path + Gene Keys purpose + Astrology purpose indicators as one life reading', level: 'master' },
  ],
  lifeOS: [
    { id: 'lifeAreaAlignment',    name: 'Life Area Alignment',    description: 'Explore how cosmic design aligns with intentional living in a specific life area',                              level: 'master' },
    { id: 'goalCosmicContext',    name: 'Goal Cosmic Context',    description: 'Understand your active goals through cosmic blueprint context',                                                  level: 'master' },
    { id: 'purposeReview',        name: 'Purpose Review',         description: 'Connect Gene Keys Activation Sequence to your Life OS purpose architecture',                                    level: 'master' },
    { id: 'lifePurposeReading',   name: 'Life Purpose Reading',   description: 'Sun, Moon, ASC, MC, NN, and purpose asteroids synthesized into your QUANTUM self-knowledge layer',              level: 'advanced' },
    { id: 'idealSelfBlueprint',   name: 'Ideal Self Blueprint',   description: 'Your Gain document — who you already are at highest expression, measured from how far you have traveled',       level: 'advanced' },
    { id: 'shadowToLightReading', name: 'Shadow to Light',        description: 'Saturn, Chiron, South Node, and 12th house — the Review/Water phase work of integration and reclamation',       level: 'advanced' },
    { id: 'careerPathReading',    name: 'Career Path Reading',    description: 'MC and NN as Vision/Fire direction; Saturn and 6th house as Execute/Earth structure — your career blueprint',   level: 'advanced' },
    { id: 'transitPlanningMap',   name: 'Transit Planning Map',   description: 'Current slow-planet transits mapped to VPER phases and ILOS Key Areas — your temporal activation landscape',   level: 'advanced' },
    { id: 'soulCallingIntegration', name: 'Soul Calling',         description: 'Chiron wound → NN direction → Part of Fortune joy convergence — your QUANTUM essence synthesis',                level: 'master' },
    { id: 'vperPhaseReading',         name: 'VPER Phase Reading',           description: 'Which VPER phase (Vision/Plan/Execute/Review) is activated by current transit element dominance',                                                          level: 'advanced' },
    { id: 'elementalProfileReading',  name: 'Elemental Profile Reading',    description: 'Calculates natal element balance (Fire/Air/Earth/Water) and reveals your VPER strengths, growth edge, and one development practice.',                             level: 'beginner' },
    { id: 'oppositePolePractice',     name: 'Opposite Pole Growth Practice', description: 'Identifies your weakest element across ILOS, Gene Keys, and Julia Balaz frameworks — generates 3 specific weekly practices and detects transit power windows.', level: 'advanced' },
  ],
  alchemy: [
    { id: 'chakraAwareness',   name: 'Chakra Activations', description: 'Explore which chakras are activated by your planetary placements',                        level: 'advanced' },
    { id: 'alchemicalMapping', name: 'Alchemical Pattern', description: 'Understand your dominant alchemical substance — Sulphur, Sal, or Mercurius',             level: 'master' },
  ],
  numerology: [
    { id: 'numerologyOverview', name: 'Numerology Overview',  description: 'Quick numerological snapshot connecting life path to Gene Keys and chakras',              level: 'beginner' },
    { id: 'numerologyReading',  name: 'Life Path Reading',    description: "Deep contemplation of your life path number's shadow, gift, and siddhi arc",             level: 'advanced' },
  ],
  cosmicEmbodiment: [
    { id: 'cosmicEmbodiment',    name: 'Cosmic Embodiment',    description: 'Let any cosmic energy speak directly to you — planets, gates, signs, elements, and more', needsFocus: true, level: 'master' },
    { id: 'elementalEmbodiment', name: 'Elemental Embodiment', description: 'Let a classical element (Fire, Earth, Air, Water) speak to you in first person',             needsFocus: true, level: 'master' },
    { id: 'sequenceEmbodiment',  name: 'Sequence Embodiment',  description: 'Let a Gene Key from your Activation Sequence speak as itself — from shadow through siddhi',   needsFocus: true, level: 'master' },
  ],
  fixedStars: [
    { id: 'fixedStarProfile',     name: 'Fixed Star Profile',  description: 'Your natal fixed star conjunctions and their archetypal gifts',              level: 'master' },
    { id: 'fixedStarConjunction', name: 'Star Conjunction',    description: 'Deep dive into a specific fixed star conjunction in your chart', needsFocus: true, level: 'advanced' },
    { id: 'fixedStarTransit',     name: 'Fixed Star Transits', description: 'Current planetary activations of your natal star positions',                 level: 'master' },
  ],
  galacticAstrology: [
    { id: 'galacticProfile',      name: 'Galactic Profile',        description: 'Your natal conjunctions to the Galactic Center, Great Attractor, and other major galactic points', level: 'master' },
    { id: 'galacticPointReading', name: 'Galactic Point Reading',  description: 'Deep dive into a specific galactic point conjunction in your chart', needsFocus: true, level: 'master' },
    { id: 'galacticAlignment',    name: 'Galactic Alignments',     description: 'Current planetary transits activating the galactic axis',                level: 'advanced' },
  ],
};

export const CATEGORY_INFO: Record<ContemplationCategory, { name: string; icon: string; color: string }> = {
  astrology:        { name: 'Astrology',     icon: '☉',  color: 'from-amber-500/40 to-orange-500/25 border-amber-500/50' },
  humanDesign:      { name: 'Human Design',  icon: '⬡',  color: 'from-humandesign-500/40 to-humandesign-600/25 border-humandesign-500/50' },
  geneKeys:         { name: 'Gene Keys',     icon: '🔑', color: 'from-genekey-500/40 to-genekey-600/25 border-genekey-500/50' },
  crossSystem:      { name: 'Cross-System',  icon: '∞',  color: 'from-purple-500/40 to-blue-500/25 border-purple-500/50' },
  lifeOS:           { name: 'Life OS',       icon: '◈',  color: 'from-emerald-500/40 to-teal-500/25 border-emerald-500/50' },
  alchemy:          { name: 'Alchemy',       icon: '⚗️', color: 'from-rose-500/40 to-amber-500/25 border-rose-500/50' },
  numerology:       { name: 'Numerology',    icon: '∑',  color: 'from-cyan-500/40 to-blue-500/25 border-cyan-500/50' },
  cosmicEmbodiment: { name: 'Embodiment',    icon: '✦',  color: 'from-pink-500/40 to-rose-500/25 border-pink-500/50' },
  fixedStars:       { name: 'Fixed Stars',   icon: '★',  color: 'from-indigo-500/40 to-purple-500/25 border-indigo-500/50' },
  galacticAstrology:{ name: 'Galactic',      icon: '🌌', color: 'from-violet-500/40 to-blue-900/25 border-violet-500/50' },
};

export interface ModelOption {
  value: string | null;
  icon: string;
  label: string;
  desc: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  { value: null, icon: '◯', label: 'Auto', desc: 'Matched to type' },
  { value: 'anthropic/claude-haiku-4-5', icon: '⚡', label: 'Haiku', desc: 'Fast & focused' },
  { value: 'anthropic/claude-sonnet-4-6', icon: '✨', label: 'Sonnet', desc: 'Balanced depth' },
  { value: 'anthropic/claude-opus-4-6', icon: '🌟', label: 'Opus', desc: 'Profound insight' },
];

export function useContemplation() {
  const { profile, cosmicProfile, isLoading, hasProfile } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for pathway context from navigation
  const pathwayContext = location.state as PathwayContext | null;

  const [category, setCategory] = useState<ContemplationCategory | null>(null);
  const [contemplationType, setContemplationType] = useState<ContemplationType | null>(null);
  const [focusEntity, setFocusEntity] = useState<FocusEntity | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canRetry, setCanRetry] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryFn, setRetryFn] = useState<(() => void) | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const [showSavedSessions, setShowSavedSessions] = useState(false);
  const [activePathwayStep, setActivePathwayStep] = useState<PathwayStep | null>(null);
  const [stepCompleted, setStepCompleted] = useState(false);
  const [selectedEntities, setSelectedEntities] = useState<EntityInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Handle entity click — supports up to 2 simultaneous entities
  const handleEntityClick = useCallback((entity: EntityInfo) => {
    setSelectedEntities(prev => {
      // Already showing this entity — no-op
      if (prev.some(e => e.id === entity.id)) return prev;
      // Less than 2 open — push
      if (prev.length < 2) return [...prev, entity];
      // 2 open — replace oldest (index 0)
      return [prev[1], entity];
    });
  }, []);

  const handleCloseEntity = useCallback((entityId: string) => {
    setSelectedEntities(prev => prev.filter(e => e.id !== entityId));
  }, []);

  const handleCloseAllEntities = useCallback(() => {
    setSelectedEntities([]);
  }, []);

  // Initialize from pathway context if present
  useEffect(() => {
    if (pathwayContext && !category) {
      const pathway = GUIDED_PATHWAYS.find(p => p.id === pathwayContext.pathwayId);
      const step = pathway?.steps.find(s => s.id === pathwayContext.stepId);

      if (pathway && step) {
        setCategory(pathwayContext.category);
        setContemplationType(pathwayContext.contemplationType);
        setActivePathwayStep(step);

        // Check if already completed
        const progress = loadPathwayProgress(pathwayContext.pathwayId);
        if (progress?.completedSteps.includes(pathwayContext.stepId)) {
          setStepCompleted(true);
        }
      }

      // Clear location state to prevent re-initialization
      window.history.replaceState({}, document.title);
    }
  }, [pathwayContext, category]);

  // Initialize from navigation state seed or URL params (Transit Oracle, profile deep links)
  useEffect(() => {
    if (category || pathwayContext?.pathwayId) return; // already seeded by pathway or user

    // Check navigation state for a seed object (e.g. from Transit Oracle)
    const stateSeed = (location.state as { seed?: ContemplationSeed } | null)?.seed;
    if (stateSeed?.category && stateSeed?.contemplationType) {
      setCategory(stateSeed.category);
      setContemplationType(stateSeed.contemplationType);
      if (stateSeed.focusEntity) setFocusEntity(stateSeed.focusEntity);
      window.history.replaceState({}, document.title);
      return;
    }

    // Fall back to URL search params (profile detail page deep links)
    const paramSeed = parseSeedFromParams(searchParams);
    if (paramSeed) {
      setCategory(paramSeed.category);
      setContemplationType(paramSeed.contemplationType);
      if (paramSeed.focusEntity) setFocusEntity(paramSeed.focusEntity);
    }
  }, [category, pathwayContext, location.state, searchParams]);

  const activeProfileId = cosmicProfile?.meta.id;

  // Keep personal context entities (PC-04) fresh in the entity registry
  useEffect(() => {
    registerPersonalContextEntities(cosmicProfile?.personalContext ?? undefined);
  }, [cosmicProfile]);

  // Load saved sessions on mount; auto-resume if navigated here from SessionsLibrary
  useEffect(() => {
    const all = loadSessions();
    setSavedSessions(all);

    const resumeId = (location.state as { resumeSessionId?: string } | null)?.resumeSessionId;
    if (resumeId) {
      const target = all.find((s) => s.id === resumeId);
      if (target) {
        setCategory(target.category);
        setContemplationType(target.contemplationType);
        setFocusEntity(target.focusEntity);
        setMessages(target.messages);
        setCurrentSessionId(target.id);
      }
      window.history.replaceState({}, document.title);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save session when messages change
  const saveCurrentSession = useCallback(() => {
    if (!currentSessionId || !category || !contemplationType || messages.length === 0) return;

    const existing = loadSessions().find((s) => s.id === currentSessionId);
    const now = new Date().toISOString();

    upsertSession({
      id: currentSessionId,
      category,
      contemplationType,
      focusEntity,
      messages,
      profileId: activeProfileId,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    });
    setSavedSessions(loadSessions());
  }, [currentSessionId, category, contemplationType, focusEntity, messages]);

  useEffect(() => {
    if (messages.length > 0) {
      saveCurrentSession();
    }
  }, [messages, saveCurrentSession]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat starts
  useEffect(() => {
    if (messages.length > 0) {
      inputRef.current?.focus();
    }
  }, [messages.length]);

  const selectedTypeOption: ContemplationTypeOption | null = (contemplationType && category
    ? CONTEMPLATION_TYPES[category]?.find(t => t.id === contemplationType)
    : null) ?? null;
  const needsFocus = !!(selectedTypeOption?.needsFocus && category && contemplationType);
  const canStartChat = !!(category && contemplationType && (!needsFocus || focusEntity));

  const buildSystemPrompt = (): string => {
    if (!category || !contemplationType || !profile) return BASE_PROMPT;

    const selection: ContemplationSelection = {
      category,
      type: contemplationType,
      focus: focusEntity || undefined,
    };

    const rawContext = formatProfileContext(profile, selection);
    const contextWithILOS = appendILOSContext(rawContext, category, cosmicProfile?.personalContext);
    const context = appendKnowledgeExcerpts(contextWithILOS, selection);
    const categoryPrompt = CATEGORY_PROMPTS[category] || CATEGORY_PROMPTS['crossSystem'];
    const typePrompt = getCustomPrompt(contemplationType) ?? CONTEMPLATION_TYPE_PROMPTS[contemplationType] ?? '';

    // Get appropriate persona for this contemplation type
    const persona = getDefaultPersonaForType(contemplationType);

    // For embodiment types, add the entity-specific embodiment context
    let embodimentContext: string | undefined;
    if (focusEntity && (contemplationType === 'cosmicEmbodiment' || contemplationType === 'elementalEmbodiment' || contemplationType === 'sequenceEmbodiment')) {
      let entityType: string;

      if (contemplationType === 'elementalEmbodiment') {
        entityType = 'element';
      } else if (contemplationType === 'sequenceEmbodiment') {
        entityType = 'sphere';
      } else {
        // cosmicEmbodiment — derive type from entity id/system heuristics
        entityType = focusEntity.id.includes('gate-') ? 'hd-gate' :
                     focusEntity.id.includes('gk-') ? 'gene-key' :
                     focusEntity.id.includes('-center') ? 'hd-center' :
                     focusEntity.id.includes('house-') ? 'house' :
                     focusEntity.id.includes('hd-type-') ? 'hd-type' :
                     focusEntity.id.includes('hd-authority-') ? 'hd-authority' :
                     focusEntity.id.includes('profile-') ? 'hd-profile' :
                     focusEntity.id.includes('ring-') ? 'codon-ring' :
                     focusEntity.entitySystem === 'astrology' ?
                       (['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'chiron', 'north-node', 'south-node', 'ascendant', 'midheaven'].includes(focusEntity.id) ? 'planet' :
                        ['fire', 'earth', 'air', 'water'].includes(focusEntity.id) ? 'element' :
                        ['conjunction', 'sextile', 'square', 'trine', 'opposition', 'quincunx', 'semi-sextile', 'semi-square', 'sesquiquadrate', 'quintile'].includes(focusEntity.id) ? 'aspect' : 'sign') :
                       'sign'; // Default fallback
      }

      embodimentContext = getEmbodimentContext(entityType, focusEntity.id, focusEntity.name);
    }

    // Build prompt with persona layer, embodiment context, and format guidelines
    const baseWithPersona = buildFullPrompt(categoryPrompt, typePrompt, persona, embodimentContext, contemplationType);

    return `${baseWithPersona}

---

${context}`;
  };

  const startContemplation = async () => {
    if (!canStartChat) return;

    setError(null);
    setCanRetry(false);
    setRetryFn(null);
    setIsSending(true);
    setIsRetrying(false);

    // Create new session
    const newSessionId = generateSessionId();
    setCurrentSessionId(newSessionId);

    // Build the system prompt
    const systemPrompt = buildSystemPrompt();

    // Initialize with empty assistant message that will be populated by streaming
    setMessages([{ role: 'assistant', content: '' }]);

    // Create retry function
    const doRequest = async () => {
      setError(null);
      setCanRetry(false);
      setIsSending(true);
      setMessages([{ role: 'assistant', content: '' }]);

      await sendContemplationStream(
        systemPrompt,
        [{ role: 'user', content: 'Begin the contemplation session.' }],
        // onChunk - append text progressively
        (text) => {
          setMessages(prev => {
            const updated = [...prev];
            if (updated.length > 0) {
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: updated[updated.length - 1].content + text
              };
            }
            return updated;
          });
        },
        // onComplete
        () => {
          setIsSending(false);
          setIsRetrying(false);
        },
        // onError
        (errorMsg, canRetryNow) => {
          setError(errorMsg);
          setIsSending(false);
          setIsRetrying(false);
          setCanRetry(canRetryNow);
          // Remove empty message on error
          setMessages([]);
          // Store retry function if retryable
          if (canRetryNow) {
            setRetryFn(() => doRequest);
          }
        },
        // options
        {
          onRetry: (attempt) => {
            setIsRetrying(true);
            setError(`Connection issue. Retrying (attempt ${attempt}/3)...`);
          },
          model: selectedModel ?? (contemplationType ? getModelId(getModelForType(contemplationType)) : undefined),
        }
      );
    };

    await doRequest();
  };

  const resumeSession = (session: SavedSession) => {
    const migrated = migrateSessionCategory(session);
    setCategory(migrated.category);
    setContemplationType(migrated.contemplationType);
    setFocusEntity(migrated.focusEntity);
    setMessages(migrated.messages);
    setCurrentSessionId(migrated.id);
    setShowSavedSessions(false);
  };

  const handleDeleteSession = (sessionId: string) => {
    deleteSessionFromStorage(sessionId);
    setSavedSessions(loadSessions());
    if (currentSessionId === sessionId) {
      resetSession();
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isSending) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setError(null);
    setCanRetry(false);
    setRetryFn(null);
    setIsRetrying(false);

    // Store current messages before adding new ones (for retry)
    const previousMessages = [...messages];

    // Add user message and empty assistant message for streaming
    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userMessage },
      { role: 'assistant', content: '' }
    ];
    setMessages(newMessages);
    setIsSending(true);

    const systemPrompt = buildSystemPrompt();
    const messagesToSend = [...previousMessages, { role: 'user' as const, content: userMessage }];

    // Create retry function
    const doRequest = async () => {
      setError(null);
      setCanRetry(false);
      setIsSending(true);
      // Reset to user message + empty assistant
      setMessages([
        ...previousMessages,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: '' }
      ]);

      await sendContemplationStream(
        systemPrompt,
        messagesToSend,
        // onChunk - append text progressively
        (text) => {
          setMessages(prev => {
            const updated = [...prev];
            if (updated.length > 0) {
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: updated[updated.length - 1].content + text
              };
            }
            return updated;
          });
        },
        // onComplete
        () => {
          setIsSending(false);
          setIsRetrying(false);
        },
        // onError
        (errorMsg, canRetryNow) => {
          setError(errorMsg);
          setIsSending(false);
          setIsRetrying(false);
          setCanRetry(canRetryNow);
          // Keep the user message, remove empty assistant message
          setMessages([...previousMessages, { role: 'user', content: userMessage }]);
          // Store retry function if retryable
          if (canRetryNow) {
            setRetryFn(() => doRequest);
          }
        },
        // options
        {
          onRetry: (attempt) => {
            setIsRetrying(true);
            setError(`Connection issue. Retrying (attempt ${attempt}/3)...`);
          },
          model: selectedModel ?? (contemplationType ? getModelId(getModelForType(contemplationType)) : undefined),
        }
      );
    };

    await doRequest();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetSession = () => {
    setCategory(null);
    setContemplationType(null);
    setFocusEntity(null);
    setMessages([]);
    setError(null);
    setCurrentSessionId(null);
    setActivePathwayStep(null);
    setStepCompleted(false);
    setSelectedModel(null);
  };

  const handleCompletePathwayStep = () => {
    if (pathwayContext && activePathwayStep) {
      completePathwayStep(pathwayContext.pathwayId, activePathwayStep.id);
      setStepCompleted(true);
    }
  };

  const handleReturnToPathway = () => {
    if (pathwayContext) {
      navigate('/pathways');
    }
  };

  const buildMarkdownContent = (): string => {
    if (!category || !contemplationType || messages.length === 0) return '';

    const selectedType = CONTEMPLATION_TYPES[category]?.find(t => t.id === contemplationType);
    const categoryInfo = CATEGORY_INFO[category];
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

    let md = `# Contemplation: ${selectedType?.name || contemplationType} (${categoryInfo.name})\n\n`;
    md += `**Date:** ${date}\n`;
    md += `**Model:** ${getModelForType(contemplationType)}\n`;
    if (focusEntity) {
      md += `**Focus:** ${focusEntity.name}\n`;
    }
    md += `\n---\n\n`;

    for (const msg of messages) {
      const label = msg.role === 'assistant' ? '**Assistant:**' : '**You:**';
      md += `${label} ${msg.content}\n\n`;
    }

    return md;
  };

  const exportAsJson = () => {
    if (!category || !contemplationType || messages.length === 0) return;

    const exportData = {
      id: currentSessionId || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      exportedAt: new Date().toISOString(),
      category,
      contemplationType,
      focusEntity: focusEntity || null,
      model: getModelForType(contemplationType),
      messageCount: messages.length,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contemplation-${category}-${contemplationType}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAsMarkdown = () => {
    const md = buildMarkdownContent();
    if (!md) return;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contemplation-${category}-${contemplationType}-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyAsMarkdown = async () => {
    const md = buildMarkdownContent();
    if (!md) return;

    try {
      await navigator.clipboard.writeText(md);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = md;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const goBack = () => {
    if (messages.length > 0) {
      setMessages([]);
    } else if (focusEntity) {
      setFocusEntity(null);
    } else if (contemplationType) {
      setContemplationType(null);
    } else {
      setCategory(null);
    }
  };

  return {
    // Profile state
    profile,
    isLoading,
    hasProfile,

    // Selection state
    category,
    setCategory,
    contemplationType,
    setContemplationType,
    focusEntity,
    setFocusEntity,
    selectedTypeOption,
    needsFocus,
    canStartChat,

    // Messages & chat state
    messages,
    inputValue,
    setInputValue,
    isSending,
    error,
    canRetry,
    isRetrying,
    retryFn,

    // Session state
    currentSessionId,
    savedSessions,
    showSavedSessions,
    setShowSavedSessions,

    // Pathway state
    pathwayContext,
    activePathwayStep,
    stepCompleted,

    // Entity panel state
    selectedEntities,
    showEntityPanel: selectedEntities.length > 0,
    handleEntityClick,
    handleCloseEntity,
    handleCloseAllEntities,

    // Model selection
    selectedModel,
    setSelectedModel,

    // Export state
    copySuccess,

    // Refs
    messagesEndRef,
    inputRef,

    // Actions
    startContemplation,
    sendMessage,
    handleKeyDown,
    resetSession,
    resumeSession,
    handleDeleteSession,
    goBack,
    handleCompletePathwayStep,
    handleReturnToPathway,
    exportAsJson,
    exportAsMarkdown,
    copyAsMarkdown,
  };
}
