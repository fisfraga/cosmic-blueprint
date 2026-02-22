import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useProfile } from '../context';
import { EmptyState, LoadingSkeleton, ProfileRequiredState } from '../components';
import { EntityStack } from '../components/entities/EntityStack';
import { EntityLink } from '../components/entities/EntityLink';
import { getEntity } from '../services/entities/registry';
import { geneKeys, chakras, getGateByDegree } from '../data';
import { getCosmicWeather, type TransitPosition } from '../services/transits';
import {
  GUIDED_PATHWAYS,
  loadPathwayProgress,
  loadAllProgress,
  startPathway,
  completeStep,
  resetPathway,
  getPathwayCompletionPercentage,
  isPathwayComplete,
  type Pathway,
  type PathwayProgress,
  type PathwayStep,
} from '../services/pathways';
import type { EntityInfo } from '../services/entities/registry';

type CosmicActivation = {
  pos: TransitPosition;
  gate: { id: string; gateNumber: number; centerId: string };
  line: number;
  gk?: { name: string; gift: { name: string } };
  chakra?: { id: string; colorHex: string; symbol?: string; name: string };
};

function PathwayCard({
  pathway,
  progress,
  onStart,
  onContinue,
  onReset,
  activationCount = 0,
}: {
  pathway: Pathway;
  progress: PathwayProgress | null;
  onStart: () => void;
  onContinue: () => void;
  onReset: () => void;
  activationCount?: number;
}) {
  const completionPercent = progress ? getPathwayCompletionPercentage(pathway.id) : 0;
  const isComplete = completionPercent === 100;
  const hasStarted = !!progress;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl bg-gradient-to-br ${pathway.color} border transition-all`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{pathway.icon}</span>
          <div>
            <h3 className="font-serif text-xltext-theme-text-primary">{pathway.name}</h3>
            <p className="text-theme-text-secondary text-sm">{pathway.duration} · {pathway.steps.length} steps</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activationCount > 0 && !isComplete && (
            <span className="text-purple-300 text-xs bg-purple-500/15 border border-purple-500/20 px-2 py-1 rounded-full">
              ✦ {activationCount} active
            </span>
          )}
          {isComplete && (
            <span className="text-green-400 text-sm bg-green-500/10 px-2 py-1 rounded">
              Complete
            </span>
          )}
        </div>
      </div>

      <p className="text-theme-text-secondary text-sm mb-4 leading-relaxed">
        {pathway.description}
      </p>

      {/* Progress Bar */}
      {hasStarted && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-theme-text-secondary">Progress</span>
            <span className="text-white">{completionPercent}%</span>
          </div>
          <div className="h-2 bg-surface-raised rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercent}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        {!hasStarted ? (
          <button
            onClick={onStart}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-theme-text-primary rounded-lg transition-colors"
          >
            Begin Journey
          </button>
        ) : isComplete ? (
          <>
            <button
              onClick={onReset}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-theme-text-primary rounded-lg transition-colors"
            >
              Start Over
            </button>
            <button
              onClick={onContinue}
              className="px-4 py-2 text-theme-text-secondary hover:text-theme-text-primary transition-colors"
            >
              Review Journal
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onContinue}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-theme-text-primary rounded-lg transition-colors"
            >
              Continue
            </button>
            <button
              onClick={onReset}
              className="px-4 py-2 text-theme-text-tertiary hover:text-red-400 transition-colors text-sm"
            >
              Reset
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

function PathwayDetail({
  pathway,
  progress,
  onClose,
  onStepComplete,
  onReset,
  todayActivations = [],
  onEntityClick,
}: {
  pathway: Pathway;
  progress: PathwayProgress;
  onClose: () => void;
  onStepComplete: (stepId: string, journalEntry?: string) => void;
  onReset: () => void;
  todayActivations?: CosmicActivation[];
  onEntityClick: (entity: EntityInfo) => void;
}) {
  const [selectedStep, setSelectedStep] = useState<PathwayStep | null>(null);
  const [journalEntry, setJournalEntry] = useState('');
  const [showJournal, setShowJournal] = useState(false);
  const navigate = useNavigate();

  const handleStartContemplation = (step: PathwayStep) => {
    // Navigate to contemplation with pathway context
    navigate('/contemplate', {
      state: {
        pathwayId: pathway.id,
        stepId: step.id,
        category: step.category,
        contemplationType: step.contemplationType,
      },
    });
  };

  const handleSaveJournal = () => {
    if (selectedStep) {
      onStepComplete(selectedStep.id, journalEntry);
      setJournalEntry('');
      setShowJournal(false);
      setSelectedStep(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-surface-base border border-theme-border-subtle rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 border-b border-theme-border-subtle bg-gradient-to-r ${pathway.color}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{pathway.icon}</span>
              <div>
                <h2 className="font-serif text-2xltext-theme-text-primary">{pathway.name}</h2>
                <p className="text-theme-text-secondary text-sm">{pathway.duration}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-theme-text-secondary hover:text-theme-text-primary p-2"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="p-6 space-y-4">
          {pathway.steps.map((step, index) => {
            const isCompleted = progress.completedSteps.includes(step.id);
            const isCurrent = index === progress.currentStepIndex;
            const isLocked = index > progress.currentStepIndex && !isCompleted;
            const hasJournal = !!progress.journalEntries[step.id];

            return (
              <div
                key={step.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-green-500/10 border-green-500/30'
                    : isCurrent
                    ? 'bg-purple-500/10 border-purple-500/30'
                    : isLocked
                    ? 'bg-surface-overlay border-theme-border-subtle opacity-50'
                    : 'bg-surface-overlay border-theme-border-subtle'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {isCompleted ? (
                        <span className="text-green-400">✓</span>
                      ) : (
                        <span className="text-theme-text-tertiary">{index + 1}</span>
                      )}
                      <h4 className="font-mediumtext-theme-text-primary">{step.title}</h4>
                    </div>
                    <p className="text-theme-text-secondary text-sm ml-6">{step.description}</p>
                    <p className="text-theme-text-tertiary text-xs ml-6 mt-1">
                      ~{step.estimatedMinutes} minutes
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasJournal && (
                      <button
                        onClick={() => {
                          setSelectedStep(step);
                          setJournalEntry(progress.journalEntries[step.id] || '');
                          setShowJournal(true);
                        }}
                        className="text-purple-400 hover:text-purple-300 text-sm"
                      >
                        View Journal
                      </button>
                    )}

                    {!isLocked && !isCompleted && (
                      <button
                        onClick={() => handleStartContemplation(step)}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-theme-text-primary text-sm rounded-lg transition-colors"
                      >
                        Start
                      </button>
                    )}

                    {isCompleted && !hasJournal && (
                      <button
                        onClick={() => {
                          setSelectedStep(step);
                          setShowJournal(true);
                        }}
                        className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-sm rounded-lg transition-colors"
                      >
                        Add Journal
                      </button>
                    )}
                  </div>
                </div>

                {/* Cosmic Context — current step only */}
                {isCurrent && todayActivations.length > 0 && (
                  <div className="mt-3 ml-6 p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                    <p className="text-purple-400/80 text-xs uppercase tracking-wider mb-2">Cosmic Context Today</p>
                    <div className="flex flex-wrap gap-1.5">
                      {todayActivations.slice(0, 3).map((activation) => (
                        <EntityLink
                          key={activation.pos.planetId}
                          entityId={activation.gate.id}
                          displayName={`${activation.pos.symbol} Gate ${activation.gate.gateNumber}.${activation.line}${activation.gk ? ` · ${activation.gk.gift.name}` : ''}`}
                          onClick={onEntityClick}
                          showPreview={false}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Journal Prompt */}
                {(isCurrent || isCompleted) && (
                  <div className="mt-3 ml-6 p-3 bg-surface-base/50 rounded-lg border border-theme-border-subtle">
                    <p className="text-theme-text-tertiary text-xs uppercase tracking-wider mb-1">Reflection Prompt</p>
                    <p className="text-theme-text-secondary text-sm italic">{step.journalPrompt}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-theme-border-subtle flex justify-between">
          <button
            onClick={onReset}
            className="text-theme-text-tertiary hover:text-red-400 text-sm transition-colors"
          >
            Reset Pathway
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-surface-raised hover:bg-surface-interactive text-theme-text-primary rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>

      {/* Journal Modal */}
      <AnimatePresence>
        {showJournal && selectedStep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowJournal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-surface-base border border-theme-border-subtle rounded-xl p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif text-xl text-theme-text-primary mb-2">{selectedStep.title}</h3>
              <p className="text-theme-text-secondary text-sm mb-4 italic">{selectedStep.journalPrompt}</p>

              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Write your reflection here..."
                className="w-full h-48 bg-surface-raised border border-theme-border-subtle rounded-lg p-4 text-theme-text-primary placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 resize-none"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowJournal(false)}
                  className="px-4 py-2 text-theme-text-secondary hover:text-theme-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveJournal}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                  Save Entry
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Pathways() {
  const { profile, isLoading, hasProfile } = useProfile();
  const [allProgress, setAllProgress] = useState<PathwayProgress[]>([]);
  const [selectedPathway, setSelectedPathway] = useState<Pathway | null>(null);
  const [selectedProgress, setSelectedProgress] = useState<PathwayProgress | null>(null);
  const [selectedEntities, setSelectedEntities] = useState<EntityInfo[]>([]);

  useEffect(() => {
    setAllProgress(loadAllProgress());
  }, []);

  const handleEntityClick = useCallback((entity: EntityInfo) => {
    setSelectedEntities(prev => {
      const already = prev.findIndex(e => e.id === entity.id);
      if (already !== -1) return prev;
      if (prev.length >= 2) return [prev[1], entity];
      return [...prev, entity];
    });
  }, []);

  const handleCloseEntity = useCallback((id: string) => {
    setSelectedEntities(prev => prev.filter(e => e.id !== id));
  }, []);

  const refreshProgress = () => {
    setAllProgress(loadAllProgress());
  };

  if (isLoading) {
    return <LoadingSkeleton variant="page" />;
  }

  if (!hasProfile || !profile) {
    return (
      <ProfileRequiredState
        title="Guided Pathways"
        description="Create your cosmic profile to access structured contemplation journeys for self-discovery."
      />
    );
  }

  // Sprint B2: cosmic activations for today
  const allGateNumbers = new Set<number>([
    ...(profile.humanDesignProfile?.personalityGates?.map(g => g.gateNumber) ?? []),
    ...(profile.humanDesignProfile?.designGates?.map(g => g.gateNumber) ?? []),
  ]);
  const todayWeather = getCosmicWeather(new Date());
  const todayActivations: CosmicActivation[] = todayWeather.positions
    .map(pos => {
      const gr = getGateByDegree(pos.degree);
      if (!gr || !allGateNumbers.has(gr.gate.gateNumber)) return null;
      const chakra = Array.from(chakras.values()).find(c => c.relatedHDCenters.includes(gr.gate.centerId));
      const gk = gr.gate.geneKeyId ? geneKeys.get(gr.gate.geneKeyId) : undefined;
      return {
        pos,
        gate: { id: gr.gate.id, gateNumber: gr.gate.gateNumber, centerId: gr.gate.centerId },
        line: gr.line,
        gk: gk ? { name: gk.name, gift: { name: gk.gift.name } } : undefined,
        chakra: chakra ? { id: chakra.id, colorHex: chakra.colorHex, symbol: chakra.symbol, name: chakra.name } : undefined,
      };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const handleStart = (pathway: Pathway) => {
    const progress = startPathway(pathway.id);
    refreshProgress();
    setSelectedPathway(pathway);
    setSelectedProgress(progress);
  };

  const handleContinue = (pathway: Pathway) => {
    const progress = loadPathwayProgress(pathway.id);
    if (progress) {
      setSelectedPathway(pathway);
      setSelectedProgress(progress);
    }
  };

  const handleReset = (pathwayId: string) => {
    resetPathway(pathwayId);
    refreshProgress();
    if (selectedPathway?.id === pathwayId) {
      setSelectedPathway(null);
      setSelectedProgress(null);
    }
  };

  const handleStepComplete = (stepId: string, journalEntry?: string) => {
    if (selectedPathway) {
      const updatedProgress = completeStep(selectedPathway.id, stepId, journalEntry);
      if (updatedProgress) {
        setSelectedProgress(updatedProgress);
        refreshProgress();
      }
    }
  };

  // Group pathways by theme
  const activePathways = GUIDED_PATHWAYS.filter(p =>
    allProgress.some(pr => pr.pathwayId === p.id && !isPathwayComplete(p.id))
  );
  const completedPathways = GUIDED_PATHWAYS.filter(p => isPathwayComplete(p.id));
  const availablePathways = GUIDED_PATHWAYS.filter(p =>
    !allProgress.some(pr => pr.pathwayId === p.id)
  );

  return (
    <div className="flex h-full">
      <div className="flex-1 min-w-0 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl font-medium text-theme-text-primary mb-3">
              Guided Pathways
            </h1>
            <p className="text-theme-text-secondary max-w-2xl mx-auto">
              Structured contemplation journeys for deep self-discovery. Each pathway guides you through a series of themed contemplations with journaling prompts.
            </p>
          </div>

          {/* Today's Cosmic Tide */}
          {todayActivations.length > 0 && (
            <section className="mb-8 p-5 rounded-xl bg-gradient-to-r from-purple-500/10 to-humandesign-500/10 border border-purple-500/20">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-serif text-lg text-theme-text-primary flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse inline-block"></span>
                  Today's Cosmic Tide
                </h2>
                <Link to="/transits" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  Full forecast →
                </Link>
              </div>
              <p className="text-theme-text-secondary text-sm mb-3">
                {todayActivations.length} planet{todayActivations.length !== 1 ? 's are' : ' is'} transiting your natal gates — this energy deepens your contemplation work.
              </p>
              <div className="flex flex-wrap gap-2">
                {todayActivations.map((activation) => {
                  const entity = getEntity(activation.gate.id);
                  return entity ? (
                    <EntityLink
                      key={activation.pos.planetId}
                      entityId={activation.gate.id}
                      displayName={`${activation.pos.symbol} Gate ${activation.gate.gateNumber}.${activation.line}${activation.gk ? ` · ${activation.gk.gift.name}` : ''}`}
                      onClick={handleEntityClick}
                    />
                  ) : (
                    <Link
                      key={activation.pos.planetId}
                      to={`/human-design/${activation.gate.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-raised/80 hover:bg-surface-raised border border-humandesign-500/30 rounded-full text-sm transition-colors"
                    >
                      <span className="text-xl leading-none">{activation.pos.symbol}</span>
                      <span className="text-humandesign-300 font-medium">Gate {activation.gate.gateNumber}.{activation.line}</span>
                      {activation.gk && (
                        <span className="text-emerald-400/80 text-xs">· {activation.gk.gift.name}</span>
                      )}
                      {activation.chakra && (
                        <span style={{ color: activation.chakra.colorHex }} title={activation.chakra.name}>{activation.chakra.symbol}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Active Pathways — or empty state when none in progress */}
          {activePathways.length > 0 ? (
            <section className="mb-12">
              <h2 className="font-serif text-2xl text-theme-text-primary mb-4">Continue Your Journey</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activePathways.map((pathway) => (
                  <PathwayCard
                    key={pathway.id}
                    pathway={pathway}
                    progress={allProgress.find(p => p.pathwayId === pathway.id) || null}
                    onStart={() => handleStart(pathway)}
                    onContinue={() => handleContinue(pathway)}
                    onReset={() => handleReset(pathway.id)}
                    activationCount={todayActivations.length}
                  />
                ))}
              </div>
            </section>
          ) : (
            <section className="mb-12">
              <EmptyState
                icon={<span role="img" aria-label="Star">&#x1F31F;</span>}
                title="Your journey hasn't started yet"
                description="Explore guided pathways to deepen your self-understanding."
                action={{ label: 'Explore Pathways', to: '/pathways' }}
              />
            </section>
          )}

          {/* Available Pathways */}
          {availablePathways.length > 0 && (
            <section className="mb-12">
              <h2 className="font-serif text-2xl text-theme-text-primary mb-4">
                {activePathways.length > 0 ? 'Explore More Pathways' : 'Choose Your Path'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availablePathways.map((pathway) => (
                  <PathwayCard
                    key={pathway.id}
                    pathway={pathway}
                    progress={null}
                    onStart={() => handleStart(pathway)}
                    onContinue={() => {}}
                    onReset={() => {}}
                    activationCount={todayActivations.length}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Completed Pathways */}
          {completedPathways.length > 0 && (
            <section>
              <h2 className="font-serif text-2xl text-theme-text-primary mb-4">Completed Journeys</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedPathways.map((pathway) => (
                  <PathwayCard
                    key={pathway.id}
                    pathway={pathway}
                    progress={allProgress.find(p => p.pathwayId === pathway.id) || null}
                    onStart={() => {}}
                    onContinue={() => handleContinue(pathway)}
                    onReset={() => handleReset(pathway.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Pathway Detail Modal */}
          <AnimatePresence>
            {selectedPathway && selectedProgress && (
              <PathwayDetail
                pathway={selectedPathway}
                progress={selectedProgress}
                onClose={() => {
                  setSelectedPathway(null);
                  setSelectedProgress(null);
                }}
                onStepComplete={handleStepComplete}
                onReset={() => handleReset(selectedPathway.id)}
                todayActivations={todayActivations}
                onEntityClick={handleEntityClick}
              />
            )}
          </AnimatePresence>

          {/* How Pathways Work */}
          <section className="mt-12 bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
            <h3 className="font-serif text-lg text-theme-text-primary mb-4">How Guided Pathways Work</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-purple-400 font-medium mb-1">1. Choose a Path</p>
                <p className="text-theme-text-secondary">
                  Select a pathway that resonates with your current journey and needs.
                </p>
              </div>
              <div>
                <p className="text-purple-400 font-medium mb-1">2. Contemplate Daily</p>
                <p className="text-theme-text-secondary">
                  Each step guides you to a themed contemplation in the chamber.
                </p>
              </div>
              <div>
                <p className="text-purple-400 font-medium mb-1">3. Journal Your Insights</p>
                <p className="text-theme-text-secondary">
                  Reflection prompts help you integrate what you discover.
                </p>
              </div>
              <div>
                <p className="text-purple-400 font-medium mb-1">4. Track Progress</p>
                <p className="text-theme-text-secondary">
                  Your journey is saved so you can continue anytime.
                </p>
              </div>
            </div>
          </section>

          {/* Quick Link to Contemplation */}
          <div className="mt-8 text-center">
            <Link
              to="/contemplate"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Or explore freely in the Contemplation Chamber →
            </Link>
          </div>
        </motion.div>
      </div>

      <EntityStack
        entities={selectedEntities}
        onCloseEntity={handleCloseEntity}
        onEntityClick={handleEntityClick}
      />
    </div>
  );
}

export default Pathways;
