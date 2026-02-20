import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useProfile } from '../context';
import { LoadingSkeleton, ProfileRequiredState } from '../components';
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
import {
  formatProfileContext,
  appendILOSContext,
  appendKnowledgeExcerpts,
  getFocusOptions,
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
import { MessageContent, EntityDetailPanel, EntityPicker } from '../components/entities';
import { InsightSaveButton } from '../components/InsightSaveButton';
import type { EntityInfo } from '../services/entities';
import {
  type SavedSession,
  loadSessions,
  generateSessionId,
  upsertSession,
  deleteSession as deleteSessionFromStorage,
} from '../services/sessions';

// Pathway context from navigation
interface PathwayContext {
  pathwayId: string;
  stepId: string;
  category: ContemplationCategory;
  contemplationType: ContemplationType;
}

// Generic seed for pre-filling a session (Transit Oracle, profile deep links)
interface ContemplationSeed {
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


interface ContemplationTypeOption {
  id: ContemplationType;
  name: string;
  description: string;
  needsFocus?: boolean;
}

const CONTEMPLATION_TYPES: Record<ContemplationCategory, ContemplationTypeOption[]> = {
  astrology: [
    { id: 'natalOverview', name: 'Natal Overview', description: 'Big picture of your cosmic blueprint' },
    { id: 'transitOverview', name: 'Transit Overview', description: 'General overview of current cosmic weather' },
    { id: 'transitReading', name: 'Focused Transit', description: 'Explore a specific transit in depth', needsFocus: true },
    { id: 'placementDeepDive', name: 'Placement Deep Dive', description: 'Explore a specific planet placement', needsFocus: true },
    { id: 'placementOverview', name: 'All Placements', description: 'Explore all your planetary placements' },
    { id: 'aspectExploration', name: 'Aspect Exploration', description: 'Understand planetary dialogues', needsFocus: true },
    { id: 'aspectOverview', name: 'All Aspects', description: 'Explore all your planetary aspects' },
    { id: 'configurationReading', name: 'Configuration Reading', description: 'Interpret aspect patterns', needsFocus: true },
    { id: 'elementalBalance', name: 'Elemental Balance', description: 'Explore your element distribution' },
  ],
  humanDesign: [
    { id: 'typeStrategy', name: 'Type & Strategy', description: 'Your energy type and decision-making' },
    { id: 'authorityCheckIn', name: 'Authority Check-in', description: 'Connect with inner authority' },
    { id: 'gateContemplation', name: 'Gate Contemplation', description: 'Explore a specific gate', needsFocus: true },
    { id: 'gateOverview', name: 'All Gates', description: 'Explore all your defined gates' },
    { id: 'channelExploration', name: 'Channel Exploration', description: 'Explore a specific channel', needsFocus: true },
    { id: 'channelOverview', name: 'All Channels', description: 'Explore all your defined channels' },
    { id: 'centerAwareness', name: 'Center Awareness', description: 'Explore a specific center', needsFocus: true },
    { id: 'centerOverview', name: 'All Centers', description: 'Explore your defined and undefined centers' },
    { id: 'profileExploration', name: 'Profile Lines', description: 'Your conscious/unconscious roles' },
  ],
  geneKeys: [
    { id: 'activationSequence', name: 'Activation Sequence', description: 'The path of Purpose' },
    { id: 'venusSequence', name: 'Venus Sequence', description: 'The path of the Heart' },
    { id: 'pearlSequence', name: 'Pearl Sequence', description: 'The path of Prosperity' },
    { id: 'shadowWork', name: 'Shadow Work', description: 'Gentle shadow illumination', needsFocus: true },
    { id: 'shadowOverview', name: 'All Shadows', description: 'Explore all your shadow patterns' },
    { id: 'giftActivation', name: 'Gift Activation', description: 'Embodying your gifts', needsFocus: true },
    { id: 'giftOverview', name: 'All Gifts', description: 'Explore all your gift frequencies' },
    { id: 'siddhiContemplation', name: 'Siddhi Meditation', description: 'Highest potential', needsFocus: true },
    { id: 'siddhiOverview', name: 'All Siddhis', description: 'Contemplate all your siddhi potentials' },
  ],
  crossSystem: [
    { id: 'gateKeyBridge', name: 'Gate-Key Bridge', description: 'HD meets Gene Keys', needsFocus: true },
    { id: 'gateKeyOverview', name: 'All Gate-Key Bridges', description: 'Explore how all your gates connect to Gene Keys' },
    { id: 'planetSphereSynthesis', name: 'Planet-Sphere Synthesis', description: 'Astrology meets Gene Keys' },
    { id: 'holisticReading', name: 'Holistic Reading', description: 'All three systems woven together' },
    { id: 'cosmicEmbodiment', name: 'Cosmic Embodiment', description: 'Let an energy speak directly to you', needsFocus: true },
  ],
  lifeOS: [
    { id: 'lifeAreaAlignment', name: 'Life Area Alignment', description: 'Explore how cosmic design aligns with intentional living in a specific life area' },
    { id: 'goalCosmicContext', name: 'Goal Cosmic Context', description: 'Understand your active goals through cosmic blueprint context' },
    { id: 'purposeReview', name: 'Purpose Review', description: 'Connect Gene Keys Activation Sequence to your Life OS purpose architecture' },
  ],
  alchemy: [
    { id: 'numerologyReading' as ContemplationType, name: 'Life Path Reading', description: "Deep contemplation of your life path number's shadow, gift, and siddhi arc" },
    { id: 'numerologyOverview' as ContemplationType, name: 'Numerology Overview', description: 'Quick numerological snapshot connecting life path to Gene Keys and chakras' },
    { id: 'chakraAwareness' as ContemplationType, name: 'Chakra Activations', description: 'Explore which chakras are activated by your planetary placements' },
    { id: 'alchemicalMapping' as ContemplationType, name: 'Alchemical Pattern', description: 'Understand your dominant alchemical substance — Sulphur, Sal, or Mercurius' },
  ],
};

const CATEGORY_INFO: Record<ContemplationCategory, { name: string; icon: string; color: string }> = {
  astrology: { name: 'Astrology', icon: '☉', color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30' },
  humanDesign: { name: 'Human Design', icon: '⬡', color: 'from-humandesign-500/20 to-humandesign-600/10 border-humandesign-500/30' },
  geneKeys: { name: 'Gene Keys', icon: '🔑', color: 'from-genekeys-500/20 to-genekeys-600/10 border-genekeys-500/30' },
  crossSystem: { name: 'Cross-System', icon: '∞', color: 'from-purple-500/20 to-blue-500/10 border-purple-500/30' },
  lifeOS: { name: 'Life OS', icon: '◈', color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30' },
  alchemy: { name: 'Alchemy & Numbers', icon: '⚗️', color: 'from-rose-500/20 to-amber-500/10 border-rose-500/30' },
};

interface ModelOption {
  value: string | null;
  icon: string;
  label: string;
  desc: string;
}

const MODEL_OPTIONS: ModelOption[] = [
  { value: null, icon: '◯', label: 'Auto', desc: 'Matched to type' },
  { value: 'anthropic/claude-haiku-4-5', icon: '⚡', label: 'Haiku', desc: 'Fast & focused' },
  { value: 'anthropic/claude-sonnet-4-6', icon: '✨', label: 'Sonnet', desc: 'Balanced depth' },
  { value: 'anthropic/claude-opus-4-6', icon: '🌟', label: 'Opus', desc: 'Profound insight' },
];

export function ContemplationChamber() {
  const { profile, isLoading, hasProfile } = useProfile();
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
  const [selectedEntity, setSelectedEntity] = useState<EntityInfo | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Handle entity click from chat messages
  const handleEntityClick = useCallback((entity: EntityInfo) => {
    setSelectedEntity(entity);
  }, []);

  const handleCloseEntityPanel = useCallback(() => {
    setSelectedEntity(null);
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

  if (isLoading) {
    return <LoadingSkeleton variant="page" />;
  }

  if (!hasProfile || !profile) {
    return (
      <ProfileRequiredState
        title="Contemplation Chamber"
        description="Create your cosmic profile to access AI-guided contemplation sessions for deeper self-reflection."
      />
    );
  }

  const selectedTypeOption = contemplationType && category
    ? CONTEMPLATION_TYPES[category]?.find(t => t.id === contemplationType)
    : null;
  const needsFocus = selectedTypeOption?.needsFocus && category && contemplationType;
  const focusOptions = needsFocus && category !== 'lifeOS'
    ? getFocusOptions(profile, category, contemplationType)
    : [];
  const canStartChat = category && contemplationType && (!needsFocus || focusEntity);

  const buildSystemPrompt = (): string => {
    if (!category || !contemplationType) return BASE_PROMPT;

    const selection: ContemplationSelection = {
      category,
      type: contemplationType,
      focus: focusEntity || undefined,
    };

    const rawContext = formatProfileContext(profile, selection);
    const contextWithILOS = appendILOSContext(rawContext, category);
    const context = appendKnowledgeExcerpts(contextWithILOS, selection);
    const categoryPrompt = CATEGORY_PROMPTS[category] || CATEGORY_PROMPTS['crossSystem'];
    const typePrompt = CONTEMPLATION_TYPE_PROMPTS[contemplationType] || '';

    // Get appropriate persona for this contemplation type
    const persona = getDefaultPersonaForType(contemplationType);

    // For cosmic embodiment, add the entity-specific embodiment context
    let embodimentContext: string | undefined;
    if (contemplationType === 'cosmicEmbodiment' && focusEntity) {
      // Get the entity type from the focus entity
      // The focusEntity.type for embodiment is 'embodiment', but we need the actual entity type
      // We store it in the id which should be the entity's actual id
      const entityType = focusEntity.id.includes('gate-') ? 'hd-gate' :
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
    setCategory(session.category);
    setContemplationType(session.contemplationType);
    setFocusEntity(session.focusEntity);
    setMessages(session.messages);
    setCurrentSessionId(session.id);
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

  // Determine if we're showing the entity panel (for layout adjustment)
  const showEntityPanel = selectedEntity !== null;

  // Determine if we're in chat mode (affects layout)
  const isInChatMode = messages.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`w-full ${isInChatMode ? 'h-[calc(100vh-140px)] overflow-hidden' : ''}`}
    >
      {/* Main container with flex layout for side-by-side on desktop */}
      <div className={`flex gap-6 transition-all duration-300 ${
        showEntityPanel ? 'lg:max-w-6xl' : 'max-w-4xl'
      } mx-auto ${isInChatMode ? 'h-full' : ''}`}>
        {/* Main Content Area */}
        <div className={`flex-1 min-w-0 transition-all duration-300 ${
          showEntityPanel ? 'lg:flex-[2]' : ''
        } ${isInChatMode ? 'flex flex-col h-full overflow-hidden' : ''}`}>
          {/* Header */}
          <div className={`text-center ${isInChatMode ? 'mb-4 flex-shrink-0' : 'mb-8'}`}>
            <div className="flex items-center justify-center gap-3">
              <h1 className={`font-serif font-medium text-white ${isInChatMode ? 'text-2xl mb-1' : 'text-4xl mb-3'}`}>
                Contemplation Chamber
              </h1>
              <span className={`px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded border border-emerald-500/30 ${isInChatMode ? 'mb-1' : 'mb-3'}`}>
                ILOS
              </span>
            </div>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              {messages.length === 0
                ? 'A sacred space for AI-guided reflection on your cosmic blueprint. Choose a wisdom system to begin.'
                : `${CATEGORY_INFO[category!].name} · ${selectedTypeOption?.name}`}
            </p>
          </div>

      {/* Pathway Context Banner */}
      {activePathwayStep && pathwayContext && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-xs uppercase tracking-wider mb-1">Guided Pathway</p>
              <p className="text-white font-medium">{activePathwayStep.title}</p>
              <p className="text-neutral-400 text-sm">{activePathwayStep.description}</p>
            </div>
            <div className="flex items-center gap-3">
              {!stepCompleted && messages.length > 0 && (
                <button
                  onClick={handleCompletePathwayStep}
                  className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-colors"
                >
                  Mark Complete
                </button>
              )}
              {stepCompleted && (
                <span className="text-green-400 text-sm flex items-center gap-1">
                  ✓ Completed
                </span>
              )}
              <button
                onClick={handleReturnToPathway}
                className="text-neutral-400 hover:text-white text-sm transition-colors"
              >
                Back to Pathway
              </button>
            </div>
          </div>
          {activePathwayStep.journalPrompt && messages.length > 0 && (
            <div className="mt-3 p-3 bg-neutral-900/50 rounded-lg border border-neutral-700">
              <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Reflection Prompt</p>
              <p className="text-neutral-300 text-sm italic">{activePathwayStep.journalPrompt}</p>
            </div>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Phase 1: Category Selection */}
        {!category && !showSavedSessions && (
          <motion.div
            key="category"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Saved Sessions Toggle */}
            {savedSessions.length > 0 && (
              <div className="mb-6 flex justify-center">
                <button
                  onClick={() => setShowSavedSessions(true)}
                  className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 transition-colors"
                >
                  <span>📜</span>
                  View {savedSessions.length} saved session{savedSessions.length !== 1 ? 's' : ''}
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.keys(CATEGORY_INFO) as ContemplationCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`p-6 rounded-xl bg-gradient-to-br ${CATEGORY_INFO[cat].color} border text-left transition-all hover:scale-[1.02] hover:shadow-lg`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{CATEGORY_INFO[cat].icon}</span>
                    <h2 className="font-serif text-xl text-white">{CATEGORY_INFO[cat].name}</h2>
                  </div>
                  <p className="text-neutral-400 text-sm">
                    {cat === 'astrology' && 'Explore planets, signs, houses, and aspects'}
                    {cat === 'humanDesign' && 'Type, Authority, Gates, and Channels'}
                    {cat === 'geneKeys' && 'Shadow, Gift, and Siddhi contemplations'}
                    {cat === 'crossSystem' && 'Weave all three systems together'}
                    {cat === 'lifeOS' && 'Connect cosmic design to intentional living'}
                    {cat === 'alchemy' && 'Numerology, Chakra Activations & Hermetic Alchemy'}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Saved Sessions View */}
        {!category && showSavedSessions && (
          <motion.div
            key="saved-sessions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <button
              onClick={() => setShowSavedSessions(false)}
              className="mb-4 text-neutral-400 hover:text-white text-sm flex items-center gap-1"
            >
              ← Start new session
            </button>

            <h3 className="font-serif text-xl text-white mb-4">Saved Sessions</h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {savedSessions.map((session) => {
                const typeOption = CONTEMPLATION_TYPES[session.category]?.find(
                  t => t.id === session.contemplationType
                );
                const categoryInfo = CATEGORY_INFO[session.category];
                const lastMessage = session.messages[session.messages.length - 1];
                const previewText = lastMessage?.content.slice(0, 100) + (lastMessage?.content.length > 100 ? '...' : '');
                const updatedDate = new Date(session.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={session.id}
                    className={`p-4 rounded-xl bg-gradient-to-br ${categoryInfo.color} border transition-all`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span>{categoryInfo.icon}</span>
                          <span className="font-medium text-white">{typeOption?.name || session.contemplationType}</span>
                        </div>
                        {session.focusEntity && (
                          <p className="text-neutral-300 text-sm mb-1">{session.focusEntity.name}</p>
                        )}
                        <p className="text-neutral-500 text-xs mb-2">{updatedDate} · {session.messages.length} messages</p>
                        {previewText && (
                          <p className="text-neutral-400 text-sm line-clamp-2">{previewText}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => resumeSession(session)}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
                        >
                          Resume
                        </button>
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="px-3 py-1.5 text-neutral-500 hover:text-red-400 text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {savedSessions.length === 0 && (
              <p className="text-neutral-500 text-center py-8">No saved sessions yet</p>
            )}
          </motion.div>
        )}

        {/* Phase 2: Type Selection */}
        {category && !contemplationType && (
          <motion.div
            key="type"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <button
              onClick={goBack}
              className="mb-4 text-neutral-400 hover:text-white text-sm flex items-center gap-1"
            >
              ← Back to categories
            </button>

            <div className={`p-4 rounded-xl bg-gradient-to-br ${CATEGORY_INFO[category].color} border mb-6`}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{CATEGORY_INFO[category].icon}</span>
                <h2 className="font-serif text-lg text-white">{CATEGORY_INFO[category].name}</h2>
              </div>
            </div>

            <h3 className="text-neutral-300 mb-4">Choose a contemplation type:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CONTEMPLATION_TYPES[category].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setContemplationType(type.id)}
                  className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 text-left transition-all"
                >
                  <h4 className="font-medium text-white mb-1">{type.name}</h4>
                  <p className="text-neutral-400 text-sm">{type.description}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Phase 3: Focus Selection (if needed) */}
        {category && contemplationType && needsFocus && !focusEntity && (
          <motion.div
            key="focus"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <button
              onClick={goBack}
              className="mb-4 text-neutral-400 hover:text-white text-sm flex items-center gap-1"
            >
              ← Back to types
            </button>

            <div className={`p-4 rounded-xl bg-gradient-to-br ${CATEGORY_INFO[category].color} border mb-6`}>
              <p className="text-neutral-300 text-sm">{CATEGORY_INFO[category].name} · {selectedTypeOption?.name}</p>
            </div>

            {/* Special EntityPicker for Cosmic Embodiment */}
            {contemplationType === 'cosmicEmbodiment' ? (
              <>
                <h3 className="text-neutral-300 mb-4">Which cosmic energy would you like to hear from?</h3>
                <EntityPicker
                  onSelect={(entity) => setFocusEntity({
                    type: 'embodiment',
                    id: entity.id,
                    name: entity.name,
                    entitySystem: entity.system === 'shared' ? undefined : entity.system,
                  })}
                />
              </>
            ) : (
              <>
                <h3 className="text-neutral-300 mb-4">Select a focus:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-2">
                  {focusOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setFocusEntity(option)}
                      className="p-3 rounded-lg bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 text-left transition-all text-sm"
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Phase 4: Chat or Start Button */}
        {canStartChat && messages.length === 0 && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <button
              onClick={goBack}
              className="mb-4 text-neutral-400 hover:text-white text-sm flex items-center gap-1 mx-auto"
            >
              ← Change selection
            </button>

            <div className={`p-6 rounded-xl bg-gradient-to-br ${CATEGORY_INFO[category!].color} border mb-6`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">{CATEGORY_INFO[category!].icon}</span>
                <h2 className="font-serif text-xl text-white">{selectedTypeOption?.name}</h2>
              </div>
              {focusEntity && (
                <p className="text-neutral-300">{focusEntity.name}</p>
              )}
            </div>

            {/* Model Selector */}
            <div className="mb-6">
              <p className="text-neutral-500 text-xs uppercase tracking-wider mb-3 text-center">Choose your guide</p>
              <div className="flex gap-2 justify-center">
                {MODEL_OPTIONS.map((opt) => {
                  const isSelected = selectedModel === opt.value;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => setSelectedModel(opt.value)}
                      className={`flex flex-col items-center p-3 rounded-xl border transition-all flex-1 max-w-[90px] ${
                        isSelected
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                          : 'bg-neutral-800/50 border-neutral-700 hover:border-neutral-600 text-neutral-400 hover:text-neutral-300'
                      }`}
                    >
                      <span className="text-xl mb-1">{opt.icon}</span>
                      <span className="text-sm font-medium">{opt.label}</span>
                      <span className="text-xs opacity-70 text-center leading-tight mt-0.5">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={startContemplation}
              disabled={isSending}
              className="px-8 py-4 bg-white text-neutral-900 rounded-xl font-medium text-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? 'Opening the chamber...' : 'Begin Contemplation'}
            </button>

            {/* Error display for initial API call */}
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
                {canRetry && retryFn && !isRetrying && (
                  <button
                    onClick={retryFn}
                    className="mt-2 px-4 py-1.5 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                )}
                {isRetrying && (
                  <p className="mt-2 text-yellow-400 text-xs animate-pulse">Retrying...</p>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Phase 5: Chat Interface */}
        {messages.length > 0 && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col flex-1 min-h-0"
          >
            {/* Messages */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-4 mb-4 pr-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-xl relative group ${
                      msg.role === 'user'
                        ? 'bg-purple-500/20 border border-purple-500/30 text-white'
                        : 'bg-neutral-800/50 border border-neutral-700 text-neutral-200'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    ) : (
                      <>
                        <MessageContent
                          content={msg.content}
                          onEntityClick={handleEntityClick}
                          className="text-sm"
                        />
                        {/* Save Insight Button - show on hover for completed assistant messages */}
                        {msg.content && !isSending && category && contemplationType && (
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <InsightSaveButton
                              content={msg.content}
                              category={category}
                              contemplationType={contemplationType}
                              sessionId={currentSessionId || undefined}
                              focusEntity={focusEntity?.name}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex justify-start">
                  <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <div className="animate-pulse">Contemplating</div>
                      <div className="flex gap-1">
                        <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                        <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                        <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-red-400 text-sm">{error}</p>
                  {isRetrying && (
                    <p className="text-yellow-400 text-xs animate-pulse mt-1">Auto-retrying...</p>
                  )}
                </div>
                {canRetry && retryFn && !isRetrying && (
                  <button
                    onClick={retryFn}
                    className="ml-3 px-4 py-1.5 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Try Again
                  </button>
                )}
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share your thoughts or ask a question..."
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl p-4 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 resize-none"
                rows={2}
                disabled={isSending}
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isSending}
                className="px-6 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>

            {/* Session Controls */}
            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                onClick={exportAsMarkdown}
                className="text-neutral-500 hover:text-white text-sm transition-colors flex items-center gap-1"
                title="Export as Markdown file"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Markdown
              </button>
              <button
                onClick={exportAsJson}
                className="text-neutral-500 hover:text-white text-sm transition-colors flex items-center gap-1"
                title="Export as JSON"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export JSON
              </button>
              <button
                onClick={copyAsMarkdown}
                className={`text-sm transition-colors flex items-center gap-1 ${
                  copySuccess ? 'text-green-400' : 'text-neutral-500 hover:text-white'
                }`}
                title="Copy as Markdown"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                {copySuccess ? 'Copied!' : 'Copy Markdown'}
              </button>
              <span className="text-neutral-700">|</span>
              <button
                onClick={resetSession}
                className="text-neutral-500 hover:text-white text-sm transition-colors"
              >
                End Session & Start New
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guidance Section */}
      {!category && !showSavedSessions && (
        <section className="mt-12 bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h3 className="font-serif text-lg text-white mb-4">Contemplation Guidance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-purple-400 font-medium mb-1">Create Space</p>
              <p className="text-neutral-400">
                Find a quiet moment. Take three deep breaths before beginning.
              </p>
            </div>
            <div>
              <p className="text-purple-400 font-medium mb-1">Be Present</p>
              <p className="text-neutral-400">
                Engage with curiosity. There are no wrong answers here.
              </p>
            </div>
            <div>
              <p className="text-purple-400 font-medium mb-1">Trust the Process</p>
              <p className="text-neutral-400">
                Let insights arise naturally. This is your journey of discovery.
              </p>
            </div>
          </div>
        </section>
      )}

        </div>

        {/* Entity Detail Sidebar - visible on desktop when entity selected */}
        {showEntityPanel && (
          <div className={`hidden lg:block lg:flex-1 lg:min-w-[320px] lg:max-w-[400px] ${isInChatMode ? 'h-full overflow-y-auto' : ''}`}>
            <EntityDetailPanel
              entity={selectedEntity}
              onClose={handleCloseEntityPanel}
              onEntityClick={handleEntityClick}
              mode="sidebar"
            />
          </div>
        )}
      </div>

      {/* Entity Detail Panel - overlay mode for mobile/tablet */}
      <div className="lg:hidden">
        <EntityDetailPanel
          entity={selectedEntity}
          onClose={handleCloseEntityPanel}
          onEntityClick={handleEntityClick}
          mode="overlay"
        />
      </div>
    </motion.div>
  );
}

export default ContemplationChamber;
