import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '../context';

// ─── Survey Questions ─────────────────────────────────────────────────────────
// 3 questions per element (12 total), distilled from Debra Silverman's methodology.
// Each captures the behavioral/cognitive essence of the element.

type ElementKey = 'fire' | 'air' | 'earth' | 'water';
type Answer = 2 | 1 | 0 | null; // Yes=2, Sometimes=1, No=0, unanswered=null

interface Question {
  id: number;
  element: ElementKey;
  text: string;
}

const QUESTIONS: Question[] = [
  // Fire
  { id: 1,  element: 'fire',  text: 'I naturally generate inspiration for myself and others, and feel most alive when I\'m creating something new.' },
  { id: 2,  element: 'fire',  text: 'I find it easy to begin new things, even without a complete plan — the vision is enough to get me moving.' },
  { id: 3,  element: 'fire',  text: 'I get bored with routine and am energized by challenge, possibility, and big-picture thinking.' },
  // Air
  { id: 4,  element: 'air',   text: 'I think quickly, love exploring ideas, and feel at home in stimulating conversations.' },
  { id: 5,  element: 'air',   text: 'I tend to observe situations from a distance before deciding how I feel — logic comes first.' },
  { id: 6,  element: 'air',   text: 'Explaining complex concepts clearly comes naturally to me, and I enjoy teaching or writing.' },
  // Earth
  { id: 7,  element: 'earth', text: 'I feel most at ease with a clear plan, steady rhythm, and knowing what to expect.' },
  { id: 8,  element: 'earth', text: 'I notice practical details others overlook, and I enjoy seeing things through to real completion.' },
  { id: 9,  element: 'earth', text: 'I\'m known for being patient, dependable, and thorough — I do things once and do them well.' },
  // Water
  { id: 10, element: 'water', text: 'I absorb the emotional atmosphere of any room I enter — I sense what people feel before they speak.' },
  { id: 11, element: 'water', text: 'I trust gut feelings as much as — or more than — logical reasoning when making decisions.' },
  { id: 12, element: 'water', text: 'I find it natural to support others emotionally and to sit with difficult feelings without fixing them.' },
];

// ─── Element Metadata ─────────────────────────────────────────────────────────

interface ElementMeta {
  name: string;
  symbol: string;
  color: string;           // Tailwind gradient bg
  borderColor: string;
  textColor: string;
  barColor: string;
  gift: string;
  shadow: string;
  medicine: string;
  vperPhase: string;
  recommendedTypes: string[];
}

const ELEMENT_META: Record<ElementKey, ElementMeta> = {
  fire: {
    name: 'Fire',
    symbol: '🔥',
    color: 'from-fire-500/20 to-fire-600/10',
    borderColor: 'border-fire-500/30',
    textColor: 'text-fire-400',
    barColor: 'bg-fire-500',
    gift: 'Inspiration, leadership, vision, creative spark',
    shadow: 'Impulsiveness, restlessness, burnout',
    medicine: 'Move, create, act. Give yourself permission to begin before you feel fully ready.',
    vperPhase: 'Vision (V)',
    recommendedTypes: ['elementalHungerVocation', 'vperPhaseReading'],
  },
  air: {
    name: 'Air',
    symbol: '🌬️',
    color: 'from-air-500/20 to-air-600/10',
    borderColor: 'border-air-500/30',
    textColor: 'text-air-400',
    barColor: 'bg-air-500',
    gift: 'Clarity, communication, perspective, connection',
    shadow: 'Overthinking, detachment, difficulty landing',
    medicine: 'Write, connect, teach. Let your mind roam freely — then share what you find.',
    vperPhase: 'Plan (P)',
    recommendedTypes: ['elementalBalance', 'elementalSystemBridge'],
  },
  earth: {
    name: 'Earth',
    symbol: '🌍',
    color: 'from-earth-500/20 to-earth-600/10',
    borderColor: 'border-earth-500/30',
    textColor: 'text-earth-400',
    barColor: 'bg-earth-500',
    gift: 'Groundedness, reliability, patience, mastery',
    shadow: 'Rigidity, over-caution, resistance to change',
    medicine: 'Ground, build, complete. Choose one thing and follow it all the way through.',
    vperPhase: 'Execute (E)',
    recommendedTypes: ['careerPathReading', 'elementalProfileReading'],
  },
  water: {
    name: 'Water',
    symbol: '💧',
    color: 'from-water-500/20 to-water-600/10',
    borderColor: 'border-water-500/30',
    textColor: 'text-water-400',
    barColor: 'bg-water-500',
    gift: 'Empathy, intuition, depth, healing presence',
    shadow: 'Overwhelm, boundary loss, emotional flooding',
    medicine: 'Feel, rest, receive. Give your emotional world space — it holds wisdom logic cannot reach.',
    vperPhase: 'Review (R)',
    recommendedTypes: ['shadowToLightReading', 'venusSequence'],
  },
};

const ELEMENT_ORDER: ElementKey[] = ['fire', 'air', 'earth', 'water'];

// ─── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'cosmic-elemental-profile';

interface StoredProfile {
  scores: Record<ElementKey, number>;
  savedAt: string;
}

function saveProfile(scores: Record<ElementKey, number>): void {
  try {
    const data: StoredProfile = { scores, savedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

function loadProfile(): StoredProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredProfile;
  } catch { return null; }
}

// ─── Score Interpretation ─────────────────────────────────────────────────────

function interpretScore(score: number): { label: string; description: string; color: string } {
  if (score >= 5) return {
    label: 'Dominant',
    description: 'Your primary energy language — comes naturally and effortlessly',
    color: 'text-emerald-400',
  };
  if (score >= 3) return {
    label: 'Strong',
    description: 'Well-developed — you access this element with ease when needed',
    color: 'text-amber-400',
  };
  if (score >= 1) return {
    label: 'Developing',
    description: 'Growing edge — this element holds your next layer of expansion',
    color: 'text-orange-400',
  };
  return {
    label: 'Hunger',
    description: 'The soul\'s deepest calling — what you had to earn becomes your greatest gift',
    color: 'text-rose-400',
  };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ElementalSurvey() {
  const navigate = useNavigate();
  const { cosmicProfile, saveCosmicProfile } = useProfile();
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [phase, setPhase] = useState<'intro' | 'survey' | 'results'>(() => {
    return loadProfile() ? 'results' : 'intro';
  });
  const [savedScores, setSavedScores] = useState<Record<ElementKey, number> | null>(() => {
    const p = loadProfile();
    return p?.scores ?? null;
  });

  const answeredCount = Object.values(answers).filter(v => v !== null && v !== undefined).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  const handleAnswer = useCallback((questionId: number, value: Answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const computeScores = useCallback((): Record<ElementKey, number> => {
    const scores: Record<ElementKey, number> = { fire: 0, air: 0, earth: 0, water: 0 };
    for (const q of QUESTIONS) {
      const ans = answers[q.id];
      if (ans !== null && ans !== undefined) {
        scores[q.element] += ans;
      }
    }
    return scores;
  }, [answers]);

  const handleSubmit = useCallback(() => {
    const scores = computeScores();
    // Persist to localStorage (backward compat + fast reads)
    saveProfile(scores);
    // Persist to active CosmicProfile.personalContext (per-profile, portable)
    if (cosmicProfile) {
      const updated = {
        ...cosmicProfile,
        personalContext: {
          ...cosmicProfile.personalContext,
          elementalSurveyScores: {
            ...scores,
            savedAt: new Date().toISOString(),
          },
        },
      };
      saveCosmicProfile(updated as typeof cosmicProfile);
    }
    setSavedScores(scores);
    setPhase('results');
  }, [computeScores, cosmicProfile, saveCosmicProfile]);

  const handleRetake = useCallback(() => {
    setAnswers({});
    setSavedScores(null);
    localStorage.removeItem(STORAGE_KEY);
    // Clear from profile too
    if (cosmicProfile?.personalContext?.elementalSurveyScores) {
      const { elementalSurveyScores: _, ...restCtx } = cosmicProfile.personalContext;
      void _;
      saveCosmicProfile({
        ...cosmicProfile,
        personalContext: restCtx as typeof cosmicProfile.personalContext,
      });
    }
    setPhase('survey');
  }, [cosmicProfile, saveCosmicProfile]);

  if (phase === 'intro') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto py-8"
      >
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🜂</div>
          <h1 className="font-serif text-3xl mb-3 text-theme-text-primary">Elemental Profile Survey</h1>
          <p className="text-theme-text-secondary leading-relaxed">
            Discover which of the four classical elements — Fire, Air, Earth, Water — flows most
            naturally through you, and which is calling for development.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {ELEMENT_ORDER.map(key => {
            const meta = ELEMENT_META[key];
            return (
              <div
                key={key}
                className={`rounded-xl p-4 bg-gradient-to-br ${meta.color} border ${meta.borderColor}`}
              >
                <div className="text-2xl mb-1">{meta.symbol}</div>
                <h3 className={`font-serif font-medium mb-1 ${meta.textColor}`}>{meta.name}</h3>
                <p className="text-xs text-theme-text-tertiary">{meta.gift}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-surface-raised rounded-xl p-5 border border-theme-border-subtle mb-8 text-sm text-theme-text-secondary space-y-2">
          <p>• <strong className="text-theme-text-primary">12 questions</strong> — 3 per element</p>
          <p>• Answer <strong className="text-theme-text-primary">Yes / Sometimes / No</strong> — go with your first instinct</p>
          <p>• Takes about <strong className="text-theme-text-primary">3–5 minutes</strong></p>
          <p>• Results are <strong className="text-theme-text-primary">saved locally</strong> — no account needed</p>
        </div>

        <button
          onClick={() => setPhase('survey')}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500/30 to-fire-500/20 border border-amber-500/40 text-amber-300 font-medium text-lg hover:from-amber-500/40 hover:to-fire-500/30 transition-all"
        >
          Begin Survey →
        </button>

        <div className="mt-4 text-center">
          <Link to="/elements" className="text-sm text-theme-text-tertiary hover:text-theme-text-secondary">
            ← Back to Elements
          </Link>
        </div>
      </motion.div>
    );
  }

  if (phase === 'survey') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto py-8"
      >
        <header className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-serif text-2xl text-theme-text-primary">Elemental Survey</h1>
            <span className="text-sm text-theme-text-tertiary">{answeredCount} / {QUESTIONS.length}</span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-surface-raised rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-amber-500 rounded-full"
              animate={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            />
          </div>
        </header>

        <div className="space-y-8">
          {ELEMENT_ORDER.map(elementKey => {
            const meta = ELEMENT_META[elementKey];
            const elementQuestions = QUESTIONS.filter(q => q.element === elementKey);

            return (
              <div key={elementKey}>
                <div className={`flex items-center gap-2 mb-3 pb-2 border-b ${meta.borderColor}`}>
                  <span className="text-lg">{meta.symbol}</span>
                  <h2 className={`font-serif font-medium ${meta.textColor}`}>{meta.name}</h2>
                </div>
                <div className="space-y-4">
                  {elementQuestions.map(q => (
                    <QuestionRow
                      key={q.id}
                      question={q}
                      answer={answers[q.id] ?? null}
                      onAnswer={handleAnswer}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 space-y-4">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`w-full py-4 rounded-xl font-medium text-lg transition-all ${
              allAnswered
                ? 'bg-gradient-to-r from-amber-500/30 to-emerald-500/20 border border-amber-500/40 text-amber-300 hover:from-amber-500/40 hover:to-emerald-500/30'
                : 'bg-surface-raised border border-theme-border-subtle text-theme-text-muted cursor-not-allowed opacity-50'
            }`}
          >
            {allAnswered ? 'See My Elemental Profile →' : `Answer all questions (${QUESTIONS.length - answeredCount} remaining)`}
          </button>
          <div className="text-center">
            <button
              onClick={() => setPhase('intro')}
              className="text-sm text-theme-text-tertiary hover:text-theme-text-secondary"
            >
              ← Back
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Results phase
  const scores = savedScores ?? computeScores();
  const sortedElements = [...ELEMENT_ORDER].sort((a, b) => scores[b] - scores[a]);
  const dominantElement = sortedElements[0];
  const weakestElement = sortedElements[sortedElements.length - 1];
  const weakestMeta = ELEMENT_META[weakestElement];
  const dominantMeta = ELEMENT_META[dominantElement];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="results"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto py-8"
      >
        <header className="text-center mb-8">
          <div className="text-4xl mb-2">{dominantMeta.symbol}</div>
          <h1 className="font-serif text-3xl mb-2 text-theme-text-primary">Your Elemental Profile</h1>
          <p className={`text-lg font-medium ${dominantMeta.textColor}`}>
            Dominant: {dominantMeta.name}
          </p>
        </header>

        {/* Score bars */}
        <section className="bg-surface-raised rounded-xl p-6 border border-theme-border-subtle mb-6">
          <h2 className="font-serif text-lg mb-5 text-theme-text-primary">Elemental Balance</h2>
          <div className="space-y-4">
            {ELEMENT_ORDER.map(key => {
              const meta = ELEMENT_META[key];
              const score = scores[key];
              const interp = interpretScore(score);
              const pct = (score / 6) * 100;

              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span>{meta.symbol}</span>
                      <span className={`font-medium ${meta.textColor}`}>{meta.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-surface-overlay ${interp.color}`}>
                        {interp.label}
                      </span>
                    </div>
                    <span className="text-theme-text-secondary text-sm font-mono">{score}/6</span>
                  </div>
                  <div className="h-2.5 bg-surface-overlay rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${meta.barColor} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: ELEMENT_ORDER.indexOf(key) * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-xs text-theme-text-tertiary mt-1">{interp.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Dominant element gift */}
        <section className={`rounded-xl p-5 border ${dominantMeta.borderColor} bg-gradient-to-br ${dominantMeta.color} mb-6`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{dominantMeta.symbol}</span>
            <h2 className={`font-serif text-lg ${dominantMeta.textColor}`}>Your Natural Language: {dominantMeta.name}</h2>
          </div>
          <p className="text-theme-text-secondary text-sm mb-2">
            <strong className="text-theme-text-primary">Gift:</strong> {dominantMeta.gift}
          </p>
          <p className="text-theme-text-secondary text-sm">
            <strong className="text-theme-text-primary">Watch for:</strong> {dominantMeta.shadow}
          </p>
          <p className="text-xs text-theme-text-tertiary mt-2">VPER Phase: {dominantMeta.vperPhase}</p>
        </section>

        {/* Weakest element — the hunger */}
        {scores[weakestElement] < 4 && (
          <section className={`rounded-xl p-5 border ${weakestMeta.borderColor} bg-surface-base/50 mb-6`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{weakestMeta.symbol}</span>
              <h2 className={`font-serif text-lg ${weakestMeta.textColor}`}>
                {scores[weakestElement] === 0 ? 'The Hunger: ' : 'Growing Edge: '}{weakestMeta.name}
              </h2>
            </div>
            <p className="text-theme-text-secondary text-sm mb-3">
              {scores[weakestElement] === 0
                ? `${weakestMeta.name} is your soul's hunger — the energy you had to consciously develop. What is earned through effort becomes the deepest gift to offer others.`
                : `${weakestMeta.name} is your growing edge — developing this element expands your range and brings your dominant energies into greater balance.`
              }
            </p>
            <div className={`p-3 rounded-lg bg-surface-raised/60 border ${weakestMeta.borderColor}`}>
              <p className="text-xs text-theme-text-tertiary mb-1 uppercase tracking-wider">Medicine</p>
              <p className="text-sm text-theme-text-secondary italic">{weakestMeta.medicine}</p>
            </div>
          </section>
        )}

        {/* Recommended contemplation types */}
        <section className="bg-surface-raised rounded-xl p-5 border border-theme-border-subtle mb-6">
          <h2 className="font-serif text-lg mb-3 text-theme-text-primary">Contemplation Invitations</h2>
          <p className="text-xs text-theme-text-tertiary mb-4">
            Based on your elemental profile, these contemplation types offer the deepest resonance right now:
          </p>
          <div className="space-y-2">
            {/* Types for dominant element awareness */}
            {dominantMeta.recommendedTypes.map(typeId => (
              <ContemplationTypePill key={typeId} typeId={typeId} label={getTypeName(typeId)} />
            ))}
            {/* Types for weakest element development */}
            {weakestElement !== dominantElement && weakestMeta.recommendedTypes.map(typeId => (
              <ContemplationTypePill key={typeId} typeId={typeId} label={getTypeName(typeId)} />
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => navigate('/contemplate')}
            className="flex-1 py-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/10 border border-purple-500/30 text-purple-300 font-medium hover:from-purple-500/30 hover:to-blue-500/20 transition-all"
          >
            Open Contemplation Chamber
          </button>
          <button
            onClick={handleRetake}
            className="py-3 px-4 rounded-lg border border-theme-border-subtle text-theme-text-secondary hover:text-theme-text-primary hover:border-theme-border transition-colors text-sm"
          >
            Retake Survey
          </button>
        </div>

        <div className="text-center">
          <Link to="/elements" className="text-sm text-theme-text-tertiary hover:text-theme-text-secondary">
            ← Back to Elements
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function QuestionRow({
  question,
  answer,
  onAnswer,
}: {
  question: Question;
  answer: Answer;
  onAnswer: (id: number, value: Answer) => void;
}) {
  return (
    <div className="rounded-lg p-4 bg-surface-base/50 border border-theme-border-subtle">
      <p className="text-theme-text-secondary text-sm leading-relaxed mb-3">{question.text}</p>
      <div className="flex gap-2">
        {([
          { label: 'Yes', value: 2 as Answer, activeClass: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' },
          { label: 'Sometimes', value: 1 as Answer, activeClass: 'bg-amber-500/20 border-amber-500/50 text-amber-300' },
          { label: 'No', value: 0 as Answer, activeClass: 'bg-rose-500/20 border-rose-500/50 text-rose-300' },
        ] as const).map(option => (
          <button
            key={option.label}
            onClick={() => onAnswer(question.id, option.value)}
            className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
              answer === option.value
                ? option.activeClass
                : 'border-theme-border-subtle text-theme-text-tertiary hover:border-theme-border hover:text-theme-text-secondary'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ContemplationTypePill({ label }: { typeId: string; label: string }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/contemplate')}
      className="w-full text-left px-4 py-2.5 rounded-lg bg-surface-overlay border border-theme-border-subtle hover:bg-surface-raised transition-colors flex items-center justify-between group"
    >
      <span className="text-sm text-theme-text-secondary">{label}</span>
      <span className="text-xs text-theme-text-tertiary group-hover:text-theme-text-secondary">Contemplate →</span>
    </button>
  );
}

function getTypeName(typeId: string): string {
  const names: Record<string, string> = {
    elementalHungerVocation: 'Elemental Hunger (Vocational)',
    vperPhaseReading: 'VPER Phase Reading',
    elementalBalance: 'Elemental Balance',
    elementalSystemBridge: 'Elemental System Bridge',
    careerPathReading: 'Career Path Reading',
    elementalProfileReading: 'Elemental Profile Reading',
    shadowToLightReading: 'Shadow to Light',
    venusSequence: 'Venus Sequence (Gene Keys)',
  };
  return names[typeId] ?? typeId;
}
