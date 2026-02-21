// Guided Pathways Service
// Pre-built contemplation journeys for structured self-discovery

import type { ContemplationCategory, ContemplationType } from './contemplation/context';

export interface PathwayStep {
  id: string;
  title: string;
  description: string;
  category: ContemplationCategory;
  contemplationType: ContemplationType;
  focusType?: 'specific' | 'user-choice'; // whether to auto-select focus or let user choose
  focusId?: string; // for 'specific' focus type
  journalPrompt: string; // prompt for post-session reflection
  estimatedMinutes: number;
}

export interface Pathway {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string; // Tailwind gradient classes
  duration: string; // e.g., "7 days", "2 weeks"
  steps: PathwayStep[];
  theme: 'shadow-work' | 'purpose' | 'relationships' | 'integration' | 'exploration';
}

export interface PathwayProgress {
  pathwayId: string;
  currentStepIndex: number;
  completedSteps: string[]; // step IDs
  journalEntries: Record<string, string>; // stepId -> journal entry
  startedAt: string;
  lastActivityAt: string;
}

const PATHWAYS_PROGRESS_KEY = 'cosmic-copilot-pathway-progress';

// ============================================
// PATHWAY DEFINITIONS
// ============================================

export const GUIDED_PATHWAYS: Pathway[] = [
  {
    id: 'shadow-week',
    name: 'Shadow Work Week',
    description: 'A 7-day journey into your shadows, transforming fear into wisdom. Each day focuses on a different sphere of your Gene Keys profile.',
    icon: '🌑',
    color: 'from-surface-raised to-surface-base border-theme-border',
    duration: '7 days',
    theme: 'shadow-work',
    steps: [
      {
        id: 'shadow-1',
        title: 'Day 1: Meeting Your Life\'s Work Shadow',
        description: 'Begin by exploring the shadow pattern of your Sun placement - your Life\'s Work sphere.',
        category: 'geneKeys',
        contemplationType: 'shadowWork',
        focusType: 'specific',
        focusId: 'lifes-work', // will be mapped to user's actual sphere
        journalPrompt: 'What fear or contracted pattern did you recognize today? How does it show up in your daily life?',
        estimatedMinutes: 15,
      },
      {
        id: 'shadow-2',
        title: 'Day 2: The Evolution Shadow',
        description: 'Explore the shadow of your Evolution sphere - your personal growth edge.',
        category: 'geneKeys',
        contemplationType: 'shadowWork',
        focusType: 'specific',
        focusId: 'evolution',
        journalPrompt: 'Where do you resist change or cling to the familiar? What would become possible if you embraced this shadow?',
        estimatedMinutes: 15,
      },
      {
        id: 'shadow-3',
        title: 'Day 3: Radiance Shadow',
        description: 'Discover the shadow blocking your natural light from shining through.',
        category: 'geneKeys',
        contemplationType: 'shadowWork',
        focusType: 'specific',
        focusId: 'radiance',
        journalPrompt: 'How do you dim your light? What would it feel like to let yourself be seen fully?',
        estimatedMinutes: 15,
      },
      {
        id: 'shadow-4',
        title: 'Day 4: Purpose Shadow',
        description: 'The deepest shadow - the core wound that becomes your greatest teaching.',
        category: 'geneKeys',
        contemplationType: 'shadowWork',
        focusType: 'specific',
        focusId: 'purpose',
        journalPrompt: 'What is the wound you\'ve been avoiding? How might it contain your greatest gift to others?',
        estimatedMinutes: 20,
      },
      {
        id: 'shadow-5',
        title: 'Day 5: Attraction Shadow',
        description: 'Explore the shadow pattern that affects what you draw into your life.',
        category: 'geneKeys',
        contemplationType: 'shadowWork',
        focusType: 'specific',
        focusId: 'attraction',
        journalPrompt: 'What patterns do you notice in what you attract? What shadow might be creating these reflections?',
        estimatedMinutes: 15,
      },
      {
        id: 'shadow-6',
        title: 'Day 6: Integration Day',
        description: 'Step back and see how your shadows interconnect as a system.',
        category: 'crossSystem',
        contemplationType: 'holisticReading',
        journalPrompt: 'Looking at the week\'s discoveries, what common thread runs through your shadows? What gift is trying to emerge?',
        estimatedMinutes: 20,
      },
      {
        id: 'shadow-7',
        title: 'Day 7: From Shadow to Gift',
        description: 'Complete the journey by contemplating how your shadows transform into gifts.',
        category: 'geneKeys',
        contemplationType: 'activationSequence',
        journalPrompt: 'What does embracing your shadows with love feel like? What shifts are you noticing in yourself?',
        estimatedMinutes: 20,
      },
    ],
  },
  {
    id: 'purpose-discovery',
    name: 'Purpose Discovery Journey',
    description: 'A comprehensive exploration of your life purpose through the lens of all three wisdom systems. Understand the WHY (Astrology), HOW (Human Design), and TRANSFORMATION (Gene Keys) of your purpose.',
    icon: '✨',
    color: 'from-amber-900/30 to-orange-900/20 border-amber-500/40',
    duration: '5 days',
    theme: 'purpose',
    steps: [
      {
        id: 'purpose-1',
        title: 'Day 1: Your Sun Sign Purpose',
        description: 'Begin with your astrological Sun - the core of your identity and life direction.',
        category: 'astrology',
        contemplationType: 'placementDeepDive',
        focusType: 'specific',
        focusId: 'sun-placement',
        journalPrompt: 'What does your Sun sign reveal about your core purpose? How do you express this energy?',
        estimatedMinutes: 15,
      },
      {
        id: 'purpose-2',
        title: 'Day 2: Your Energy Type & Strategy',
        description: 'Discover how your Human Design Type shows the correct way for you to engage with life.',
        category: 'humanDesign',
        contemplationType: 'typeStrategy',
        journalPrompt: 'How aligned have you been with your Strategy? What would change if you trusted it fully?',
        estimatedMinutes: 15,
      },
      {
        id: 'purpose-3',
        title: 'Day 3: The Activation Sequence',
        description: 'Explore your Gene Keys path of purpose - from Life\'s Work to Purpose.',
        category: 'geneKeys',
        contemplationType: 'activationSequence',
        journalPrompt: 'What resonates most about your Activation Sequence? Which sphere feels most alive right now?',
        estimatedMinutes: 20,
      },
      {
        id: 'purpose-4',
        title: 'Day 4: Your Authority',
        description: 'Connect with your inner decision-making wisdom through Human Design Authority.',
        category: 'humanDesign',
        contemplationType: 'authorityCheckIn',
        journalPrompt: 'What did you learn about your Authority today? How can you trust it more in daily decisions?',
        estimatedMinutes: 15,
      },
      {
        id: 'purpose-5',
        title: 'Day 5: Holistic Integration',
        description: 'Weave together all three systems to see your complete purpose picture.',
        category: 'crossSystem',
        contemplationType: 'holisticReading',
        journalPrompt: 'How do all three systems illuminate different facets of the same purpose? What clarity emerged?',
        estimatedMinutes: 25,
      },
    ],
  },
  {
    id: 'heart-opening',
    name: 'Heart Opening Path',
    description: 'Journey through your Venus Sequence - the path of love, relationships, and opening the heart. Explore how you attract, relate, and ultimately transcend through love.',
    icon: '💜',
    color: 'from-pink-900/30 to-rose-900/20 border-pink-500/40',
    duration: '5 days',
    theme: 'relationships',
    steps: [
      {
        id: 'heart-1',
        title: 'Day 1: Attraction Patterns',
        description: 'Explore what you naturally attract and are attracted to through your Attraction sphere.',
        category: 'geneKeys',
        contemplationType: 'venusSequence',
        journalPrompt: 'What patterns do you notice in your attractions? What might your soul be seeking through them?',
        estimatedMinutes: 15,
      },
      {
        id: 'heart-2',
        title: 'Day 2: Venus in Your Chart',
        description: 'Explore your astrological Venus - how you love, relate, and find beauty.',
        category: 'astrology',
        contemplationType: 'placementDeepDive',
        focusType: 'specific',
        focusId: 'venus-placement',
        journalPrompt: 'How does your Venus placement color your approach to love? What does it need to feel fulfilled?',
        estimatedMinutes: 15,
      },
      {
        id: 'heart-3',
        title: 'Day 3: Mental Intelligence (IQ)',
        description: 'Explore your IQ sphere - how your mind patterns affect your relationships.',
        category: 'geneKeys',
        contemplationType: 'giftActivation',
        focusType: 'user-choice',
        journalPrompt: 'What mental patterns support or hinder your relationships? How can you use your gift more consciously?',
        estimatedMinutes: 15,
      },
      {
        id: 'heart-4',
        title: 'Day 4: Emotional Intelligence (EQ)',
        description: 'The core wound of relationships - your EQ sphere and the path of healing.',
        category: 'geneKeys',
        contemplationType: 'shadowWork',
        focusType: 'user-choice',
        journalPrompt: 'What childhood wound still affects your relationships? What would healing look like?',
        estimatedMinutes: 20,
      },
      {
        id: 'heart-5',
        title: 'Day 5: Spiritual Intelligence (SQ)',
        description: 'The highest octave of love - transcendence through relationship.',
        category: 'geneKeys',
        contemplationType: 'siddhiContemplation',
        focusType: 'user-choice',
        journalPrompt: 'What does unconditional love mean to you? How might your SQ siddhi manifest in your life?',
        estimatedMinutes: 20,
      },
    ],
  },
  {
    id: 'weekly-alignment',
    name: 'Weekly Alignment Practice',
    description: 'A gentle weekly practice covering all three systems. Perfect for maintaining connection with your design.',
    icon: '🌟',
    color: 'from-purple-900/30 to-indigo-900/20 border-purple-500/40',
    duration: 'Weekly (ongoing)',
    theme: 'integration',
    steps: [
      {
        id: 'align-1',
        title: 'Sunday: Big Picture Check-in',
        description: 'Start the week with a holistic view of your cosmic design.',
        category: 'astrology',
        contemplationType: 'natalOverview',
        journalPrompt: 'What theme feels most alive in your chart this week? What planetary energy needs attention?',
        estimatedMinutes: 15,
      },
      {
        id: 'align-2',
        title: 'Monday: Strategy Alignment',
        description: 'Ground into your Human Design Strategy for the week ahead.',
        category: 'humanDesign',
        contemplationType: 'typeStrategy',
        journalPrompt: 'How can you honor your Strategy this week? What decisions are you facing?',
        estimatedMinutes: 10,
      },
      {
        id: 'align-3',
        title: 'Wednesday: Midweek Gift Activation',
        description: 'Pause to consciously activate one of your Gene Key gifts.',
        category: 'geneKeys',
        contemplationType: 'giftActivation',
        focusType: 'user-choice',
        journalPrompt: 'Which gift wants to shine through you today? How can you create space for it?',
        estimatedMinutes: 10,
      },
      {
        id: 'align-4',
        title: 'Friday: Authority Check-in',
        description: 'Connect with your inner Authority as the week winds down.',
        category: 'humanDesign',
        contemplationType: 'authorityCheckIn',
        journalPrompt: 'What decisions arose this week? How well did you trust your Authority?',
        estimatedMinutes: 10,
      },
      {
        id: 'align-5',
        title: 'Saturday: Elemental Balance',
        description: 'Reflect on your elemental needs and how to nourish yourself.',
        category: 'astrology',
        contemplationType: 'elementalBalance',
        journalPrompt: 'Which element needs attention? How can you balance your energy this weekend?',
        estimatedMinutes: 10,
      },
    ],
  },
  {
    id: 'profile-deep-dive',
    name: 'Human Design Profile Deep Dive',
    description: 'Explore your conscious and unconscious Profile lines - the costume you wear and the role you play in life.',
    icon: '🎭',
    color: 'from-humandesign-600/30 to-humandesign-800/20 border-humandesign-500/40',
    duration: '3 days',
    theme: 'exploration',
    steps: [
      {
        id: 'profile-1',
        title: 'Day 1: Your Profile Lines',
        description: 'Explore the interplay between your conscious and unconscious Profile lines.',
        category: 'humanDesign',
        contemplationType: 'profileExploration',
        journalPrompt: 'How do you experience the dance between your two lines? Which feels more natural to express?',
        estimatedMinutes: 15,
      },
      {
        id: 'profile-2',
        title: 'Day 2: Profile in Astrology',
        description: 'See how your Sun and Moon placements mirror your Profile themes.',
        category: 'astrology',
        contemplationType: 'natalOverview',
        journalPrompt: 'How do your Sun (conscious) and Moon (unconscious) reflect your Profile themes?',
        estimatedMinutes: 15,
      },
      {
        id: 'profile-3',
        title: 'Day 3: Profile & Purpose Integration',
        description: 'Connect your Profile to your Gene Keys Life\'s Work for complete understanding.',
        category: 'crossSystem',
        contemplationType: 'holisticReading',
        journalPrompt: 'How does your Profile inform HOW you deliver your purpose? What new insight emerged?',
        estimatedMinutes: 20,
      },
    ],
  },
];

// ============================================
// PROGRESS MANAGEMENT
// ============================================

export function loadAllProgress(): PathwayProgress[] {
  try {
    const stored = localStorage.getItem(PATHWAYS_PROGRESS_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function loadPathwayProgress(pathwayId: string): PathwayProgress | null {
  const allProgress = loadAllProgress();
  return allProgress.find(p => p.pathwayId === pathwayId) || null;
}

export function savePathwayProgress(progress: PathwayProgress): void {
  try {
    const allProgress = loadAllProgress();
    const existingIndex = allProgress.findIndex(p => p.pathwayId === progress.pathwayId);

    if (existingIndex >= 0) {
      allProgress[existingIndex] = progress;
    } else {
      allProgress.push(progress);
    }

    localStorage.setItem(PATHWAYS_PROGRESS_KEY, JSON.stringify(allProgress));
  } catch (e) {
    console.error('Failed to save pathway progress:', e);
  }
}

export function startPathway(pathwayId: string): PathwayProgress {
  const now = new Date().toISOString();
  const progress: PathwayProgress = {
    pathwayId,
    currentStepIndex: 0,
    completedSteps: [],
    journalEntries: {},
    startedAt: now,
    lastActivityAt: now,
  };
  savePathwayProgress(progress);
  return progress;
}

export function completeStep(
  pathwayId: string,
  stepId: string,
  journalEntry?: string
): PathwayProgress | null {
  const progress = loadPathwayProgress(pathwayId);
  if (!progress) return null;

  const pathway = GUIDED_PATHWAYS.find(p => p.id === pathwayId);
  if (!pathway) return null;

  // Mark step as complete
  if (!progress.completedSteps.includes(stepId)) {
    progress.completedSteps.push(stepId);
  }

  // Save journal entry if provided
  if (journalEntry) {
    progress.journalEntries[stepId] = journalEntry;
  }

  // Move to next step if this was the current one
  const currentStepIndex = pathway.steps.findIndex(s => s.id === stepId);
  if (currentStepIndex >= 0 && currentStepIndex < pathway.steps.length - 1) {
    progress.currentStepIndex = currentStepIndex + 1;
  }

  progress.lastActivityAt = new Date().toISOString();
  savePathwayProgress(progress);
  return progress;
}

export function resetPathway(pathwayId: string): void {
  const allProgress = loadAllProgress().filter(p => p.pathwayId !== pathwayId);
  localStorage.setItem(PATHWAYS_PROGRESS_KEY, JSON.stringify(allProgress));
}

export function getPathwayCompletionPercentage(pathwayId: string): number {
  const progress = loadPathwayProgress(pathwayId);
  const pathway = GUIDED_PATHWAYS.find(p => p.id === pathwayId);

  if (!progress || !pathway) return 0;

  return Math.round((progress.completedSteps.length / pathway.steps.length) * 100);
}

export function isPathwayComplete(pathwayId: string): boolean {
  return getPathwayCompletionPercentage(pathwayId) === 100;
}
