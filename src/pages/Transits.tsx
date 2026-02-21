import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  getCosmicWeather,
  getTransitInterpretation,
  getAspectInterpretation,
  type CosmicWeather,
  type TransitPosition,
  type TransitAspect,
} from '../services/transits';
import {
  calculateTransitNatalAspects,
  getTransitInterpretation as getTransitNatalInterpretation,
  type TransitNatalAspect,
  type NatalPlacement,
} from '../services/transitAspects';
import { useProfile } from '../context';
import { TransitCalendar } from '../components/TransitCalendar';
import { geneKeys, chakras, getGateByDegree } from '../data';
import {
  getTransitStarActivations,
  getFixedStarConjunctions,
  getPersonalTransitActivations,
  type TransitStarActivation,
} from '../services/fixedStars';

type ViewMode = 'day' | 'calendar';

function TransitCard({
  position,
  index,
  natalGateNumbers,
}: {
  position: TransitPosition;
  index: number;
  natalGateNumbers?: Set<number>;
}) {
  const interpretation = getTransitInterpretation(position);

  // Cross-system bridge: degree → HD gate → Gene Key → Chakra
  const gateResult = getGateByDegree(position.degree);
  const gate = gateResult?.gate;
  const line = gateResult?.line;
  const gk = gate?.geneKeyId ? geneKeys.get(gate.geneKeyId) : undefined;
  const chakra = gate
    ? Array.from(chakras.values()).find(c => c.relatedHDCenters.includes(gate.centerId))
    : undefined;
  const isInNatalChart = gate && natalGateNumbers?.has(gate.gateNumber);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-surface-base/50 border rounded-xl p-4 hover:border-theme-border-subtle transition-colors ${
        isInNatalChart ? 'border-humandesign-500/40' : 'border-theme-border-subtle'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{position.symbol}</span>
          <div>
            <Link
              to={`/planets/${position.planetId}`}
              className="font-medium text-lg text-theme-text-primary hover:text-purple-400 transition-colors"
            >
              {position.planetName}
            </Link>
            {position.isRetrograde && (
              <span className="ml-2 text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
                ℞ Retrograde
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <Link
            to={`/signs/${position.signId}`}
            className="flex items-center gap-1 text-theme-text-secondary hover:text-theme-text-primary transition-colors text-lg"
          >
            <span className="text-xl">{position.signSymbol}</span>
            <span>{position.signName}</span>
          </Link>
          <span className="text-theme-text-tertiary text-sm">{position.formattedDegree}</span>
        </div>
      </div>

      {/* Cross-system bridge strip: Gate · Gene Key · Chakra */}
      {gate && (
        <div className="flex items-center gap-1.5 flex-wrap mb-3 pb-3 border-b border-theme-border-subtle text-xs">
          <Link
            to={`/human-design/${gate.id}`}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              isInNatalChart
                ? 'bg-humandesign-500/20 text-humandesign-300 ring-1 ring-humandesign-500/40 hover:bg-humandesign-500/30'
                : 'bg-humandesign-500/10 text-humandesign-400 hover:bg-humandesign-500/20'
            }`}
          >
            <span className="font-serif font-medium">Gate {gate.gateNumber}.{line}</span>
            {isInNatalChart && <span className="ml-0.5 text-humandesign-300">●</span>}
          </Link>

          {gk && (
            <Link
              to={`/gene-keys/${gk.id}`}
              className="flex items-center gap-1 px-2 py-1 bg-genekey-500/10 text-genekey-400 rounded hover:bg-genekey-500/20 transition-colors"
            >
              <span className="font-serif">{gk.keyNumber}</span>
              <span className="text-theme-text-muted">·</span>
              <span className="text-red-400/70">{gk.shadow.name}</span>
              <span className="text-theme-text-muted">→</span>
              <span className="text-emerald-400/70">{gk.gift.name}</span>
            </Link>
          )}

          {chakra && (
            <Link
              to={`/chakras/${chakra.id}`}
              className="flex items-center gap-1 px-2 py-1 bg-surface-raised rounded hover:bg-surface-interactive transition-colors"
              style={{ color: chakra.colorHex }}
            >
              <span>{chakra.symbol}</span>
              <span className="text-theme-text-secondary">{chakra.name.replace(' Chakra', '')}</span>
            </Link>
          )}

          {isInNatalChart && (
            <span className="ml-auto text-humandesign-400/70 italic">in your chart</span>
          )}
        </div>
      )}

      {/* Interpretation shown by default */}
      <p className="text-theme-text-secondary text-sm leading-relaxed">
        {interpretation}
      </p>
    </motion.div>
  );
}

function AspectCard({
  aspect,
  index,
}: {
  aspect: TransitAspect;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const interpretation = getAspectInterpretation(aspect);

  const natureColors = {
    harmonious: 'text-green-400 bg-green-500/10 border-green-500/30',
    challenging: 'text-red-400 bg-red-500/10 border-red-500/30',
    neutral: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  };

  const natureLabels = {
    harmonious: 'Flowing',
    challenging: 'Dynamic',
    neutral: 'Intensifying',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-4 rounded-xl border ${natureColors[aspect.nature]} cursor-pointer`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-lg">{aspect.planet1}</span>
          <span className="text-2xl">{aspect.aspectSymbol}</span>
          <span className="font-medium text-lg">{aspect.planet2}</span>
        </div>
        <div className="text-right text-sm">
          <span className="opacity-90 font-medium">{aspect.aspectType}</span>
          <span className="ml-2 opacity-60">({aspect.orb}° orb)</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs opacity-70 mb-2">
        <span className={`px-2 py-0.5 rounded ${
          aspect.nature === 'harmonious' ? 'bg-green-500/20' :
          aspect.nature === 'challenging' ? 'bg-red-500/20' : 'bg-purple-500/20'
        }`}>
          {natureLabels[aspect.nature]}
        </span>
        {aspect.isApplying && (
          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Applying</span>
        )}
        <span className="ml-auto">{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-sm leading-relaxed border-t border-current/20 pt-3 mt-2 opacity-90"
        >
          {interpretation}
        </motion.p>
      )}
    </motion.div>
  );
}

function TransitNatalAspectCard({
  aspect,
  index,
  onOracle,
}: {
  aspect: TransitNatalAspect;
  index: number;
  onOracle?: () => void;
}) {
  const [showInterpretation, setShowInterpretation] = useState(false);

  const natureColors = {
    harmonious: 'border-green-500/40 bg-green-500/10',
    challenging: 'border-red-500/40 bg-red-500/10',
    neutral: 'border-purple-500/40 bg-purple-500/10',
  };

  const natureIcons = {
    harmonious: '🟢',
    challenging: '🔴',
    neutral: '🟣',
  };

  const signSymbols: Record<string, string> = {
    aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
    leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
    sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-4 rounded-xl border ${natureColors[aspect.nature]}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span>{natureIcons[aspect.nature]}</span>
          <span className="text-lg">{aspect.transitSymbol}</span>
          <span className="font-mediumtext-theme-text-primary">{aspect.transitPlanet}</span>
          <span className="text-xl text-theme-text-secondary">{aspect.aspectSymbol}</span>
          <span className="text-sm text-theme-text-tertiary">natal</span>
          <span className="text-lg">{aspect.natalSymbol}</span>
          <span className="font-mediumtext-theme-text-primary">{aspect.natalPlanet}</span>
        </div>
        <div className="text-sm text-theme-text-secondary">
          <span className="opacity-70">{aspect.aspectType}</span>
          <span className="ml-2 opacity-50">({aspect.orb}°)</span>
        </div>
      </div>

      <div className="text-sm text-theme-text-tertiary mb-2">
        <span className="inline-flex items-center gap-1">
          {aspect.transitSymbol} in {signSymbols[aspect.transitSign]}
        </span>
        <span className="mx-2">→</span>
        <span className="inline-flex items-center gap-1">
          {aspect.natalSymbol} in {signSymbols[aspect.natalSign]}
        </span>
        {aspect.isApplying && (
          <span className="ml-3 text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
            Applying
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 mt-1">
        <button
          onClick={() => setShowInterpretation(!showInterpretation)}
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          {showInterpretation ? 'Hide meaning' : 'Show meaning'}
        </button>
        {onOracle && (
          <button
            onClick={onOracle}
            className="text-sm text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
          >
            <span>✦</span>
            <span>Ask Oracle</span>
          </button>
        )}
      </div>

      {showInterpretation && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 text-theme-text-secondary text-sm leading-relaxed border-t border-theme-border-subtle/50 pt-3"
        >
          {getTransitNatalInterpretation(aspect)}
        </motion.p>
      )}
    </motion.div>
  );
}

export function Transits() {
  const [weather, setWeather] = useState<CosmicWeather | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAllNatalAspects, setShowAllNatalAspects] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const { profile } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    setWeather(getCosmicWeather(selectedDate));
  }, [selectedDate]);

  // Calculate transit-to-natal aspects when profile is available
  const transitNatalAspects = useMemo(() => {
    if (!profile?.placements || profile.placements.length === 0) {
      return [];
    }

    // Convert profile placements to format expected by transit service
    const natalPlacements: NatalPlacement[] = profile.placements.map(p => ({
      planetId: p.planetId,
      signId: p.signId,
      degree: p.degree,
      minute: p.minute,
      retrograde: p.retrograde,
    }));

    return calculateTransitNatalAspects(selectedDate, natalPlacements);
  }, [selectedDate, profile]);

  // Natal HD gate numbers — used to highlight "in your chart" on transit cards
  const natalGateNumbers = useMemo(() => {
    if (!profile?.humanDesignProfile) return new Set<number>();
    const allGates = [
      ...(profile.humanDesignProfile.personalityGates || []),
      ...(profile.humanDesignProfile.designGates || []),
    ];
    return new Set(allGates.map((g: { gateNumber: number }) => g.gateNumber));
  }, [profile]);

  const displayedNatalAspects = showAllNatalAspects
    ? transitNatalAspects
    : transitNatalAspects.slice(0, 5);

  // Fixed Star Activations — sky-wide (no profile needed)
  const skyStarActivations = useMemo<TransitStarActivation[]>(() => {
    if (!weather) return [];
    return getTransitStarActivations(weather.positions);
  }, [weather]);

  // Personal Fixed Star Activations — transits hitting natal star conjunctions
  const personalStarActivations = useMemo<TransitStarActivation[]>(() => {
    if (!weather || !profile?.placements?.length) return [];
    const natalConjunctions = getFixedStarConjunctions(profile.placements);
    if (natalConjunctions.length === 0) return [];
    return getPersonalTransitActivations(weather.positions, natalConjunctions);
  }, [weather, profile]);

  if (!weather) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-theme-text-tertiary">Loading cosmic weather...</div>
      </div>
    );
  }

  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-serif text-4xl font-medium text-theme-text-primary mb-3">
          Cosmic Weather
        </h1>
        <p className="text-theme-text-secondary">
          Current planetary positions and transits
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-surface-base/50 border border-theme-border-subtle rounded-lg p-1 flex gap-1">
          <button
            onClick={() => setViewMode('day')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'day'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                : 'text-theme-text-secondary hover:text-theme-text-primary'
            }`}
          >
            Day View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'calendar'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                : 'text-theme-text-secondary hover:text-theme-text-primary'
            }`}
          >
            Calendar View
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="mb-8 max-w-md mx-auto">
          <TransitCalendar
            onDaySelect={(date) => {
              setSelectedDate(date);
              setViewMode('day');
            }}
            selectedDate={selectedDate}
          />
        </div>
      )}

      {/* Date Selector */}
      {viewMode === 'day' && <div className="flex justify-center mb-8">
        <div className="bg-surface-base/50 border border-theme-border-subtle rounded-xl p-4 flex items-center gap-4">
          <button
            onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 86400000))}
            className="p-2 hover:bg-surface-raised rounded-lg transition-colors text-theme-text-secondary hover:text-theme-text-primary"
          >
            ← Previous Day
          </button>
          <div className="text-center">
            <p className="text-theme-text-primary font-medium">{formattedDate}</p>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
            >
              Return to Today
            </button>
          </div>
          <button
            onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 86400000))}
            className="p-2 hover:bg-surface-raised rounded-lg transition-colors text-theme-text-secondary hover:text-theme-text-primary"
          >
            Next Day →
          </button>
        </div>
      </div>}

      {/* Moon Phase & Overview - shown in both views */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-theme-border-subtle rounded-xl p-6 text-center"
        >
          <span className="text-5xl mb-3 block">{weather.moonPhase.emoji}</span>
          <h3 className="font-serif text-xl text-theme-text-primary mb-1">{weather.moonPhase.name}</h3>
          <p className="text-theme-text-secondary text-sm">{weather.moonPhase.illumination}% illuminated</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-amber-900/20 to-neutral-900 border border-amber-500/30 rounded-xl p-6 text-center"
        >
          <span className="text-5xl mb-3 block">℞</span>
          <h3 className="font-serif text-xl text-theme-text-primary mb-1">
            {weather.retrogradeCount} Planet{weather.retrogradeCount !== 1 ? 's' : ''} Retrograde
          </h3>
          <p className="text-theme-text-secondary text-sm">
            {weather.retrogradeCount === 0
              ? 'Clear skies for forward motion'
              : 'Time for review and reflection'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-900/20 to-neutral-900 border border-purple-500/30 rounded-xl p-6 text-center"
        >
          <span className="text-5xl mb-3 block">⚭</span>
          <h3 className="font-serif text-xl text-theme-text-primary mb-1">
            {weather.significantAspects.length} Major Aspect{weather.significantAspects.length !== 1 ? 's' : ''}
          </h3>
          <p className="text-theme-text-secondary text-sm">
            Tight orb configurations active now
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Planetary Positions */}
        <section>
          <h2 className="font-serif text-2xl text-theme-text-primary mb-4">Planetary Positions</h2>
          <div className="space-y-3">
            {weather.positions.map((position, index) => (
              <TransitCard key={position.planetId} position={position} index={index} natalGateNumbers={natalGateNumbers} />
            ))}
          </div>
        </section>

        {/* Significant Aspects */}
        <section>
          <h2 className="font-serif text-2xl text-theme-text-primary mb-4">Current Aspects</h2>
          {weather.significantAspects.length > 0 ? (
            <div className="space-y-3">
              {weather.significantAspects.map((aspect, index) => (
                <AspectCard key={`${aspect.planet1}-${aspect.planet2}`} aspect={aspect} index={index} />
              ))}
            </div>
          ) : (
            <div className="bg-surface-base/50 border border-theme-border-subtle rounded-xl p-8 text-center">
              <p className="text-theme-text-tertiary">No major aspects within tight orb today</p>
            </div>
          )}

          {/* Cosmic Guidance */}
          <div className="mt-8 bg-surface-base/50 border border-theme-border-subtle rounded-xl p-6">
            <h3 className="font-serif text-lg text-theme-text-primary mb-3">Today's Cosmic Theme</h3>
            <p className="text-theme-text-secondary text-sm leading-relaxed">
              {weather.moonPhase.name === 'New Moon' && (
                "New Moon energy supports fresh starts and setting intentions. Plant seeds for what you wish to grow."
              )}
              {weather.moonPhase.name === 'Full Moon' && (
                "Full Moon illumination brings things to completion and reveals what's been hidden. Release what no longer serves."
              )}
              {weather.moonPhase.name === 'First Quarter' && (
                "Action energy builds. Take decisive steps toward your New Moon intentions."
              )}
              {weather.moonPhase.name === 'Last Quarter' && (
                "Time for reflection and release. Review lessons learned this lunar cycle."
              )}
              {weather.moonPhase.name.includes('Waxing') && (
                "Growing light supports building, creating, and manifesting. Energy is expanding."
              )}
              {weather.moonPhase.name.includes('Waning') && (
                "Decreasing light supports releasing, completing, and going inward. Let go with grace."
              )}
            </p>
          </div>

          {/* Link to Contemplation */}
          <div className="mt-6">
            <button
              onClick={() => navigate('/contemplate', {
                state: {
                  seed: {
                    category: 'astrology',
                    contemplationType: 'transitOverview',
                  },
                },
              })}
              className="block w-full p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl text-center hover:border-purple-500/50 transition-colors"
            >
              <span className="text-purple-400 font-medium">
                Contemplate Today's Transits →
              </span>
            </button>
          </div>
        </section>
      </div>

      {/* Transits to Your Chart - Only shown when profile is loaded */}
      {profile && (
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xltext-theme-text-primary">
              Transits to Your Chart
            </h2>
            {transitNatalAspects.length > 0 && (
              <span className="text-sm text-theme-text-secondary">
                {transitNatalAspects.length} active aspect{transitNatalAspects.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <p className="text-theme-text-secondary text-sm mb-6">
            How today's sky is activating {profile.name}'s natal chart
          </p>

          {transitNatalAspects.length > 0 ? (
            <>
              <div className="space-y-3">
                {displayedNatalAspects.map((aspect, index) => (
                  <TransitNatalAspectCard
                    key={`${aspect.transitPlanetId}-${aspect.natalPlanetId}-${aspect.aspectType}`}
                    aspect={aspect}
                    index={index}
                    onOracle={() => navigate('/contemplate', {
                      state: {
                        seed: {
                          category: 'astrology',
                          contemplationType: 'transitReading',
                          focusEntity: {
                            type: 'placement',
                            id: aspect.transitPlanetId,
                            name: aspect.transitPlanet,
                            entitySystem: 'astrology',
                          },
                        },
                      },
                    })}
                  />
                ))}
              </div>

              {transitNatalAspects.length > 5 && (
                <button
                  onClick={() => setShowAllNatalAspects(!showAllNatalAspects)}
                  className="mt-4 w-full p-3 bg-surface-base/50 border border-theme-border-subtle rounded-xl text-theme-text-secondary hover:text-theme-text-primary hover:border-theme-border-subtle transition-colors"
                >
                  {showAllNatalAspects
                    ? 'Show less'
                    : `View all ${transitNatalAspects.length} aspects`}
                </button>
              )}

              {/* Summary by nature */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                  <span className="text-2xl block mb-1">
                    {transitNatalAspects.filter(a => a.nature === 'harmonious').length}
                  </span>
                  <span className="text-green-400 text-sm">Harmonious</span>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                  <span className="text-2xl block mb-1">
                    {transitNatalAspects.filter(a => a.nature === 'challenging').length}
                  </span>
                  <span className="text-red-400 text-sm">Challenging</span>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
                  <span className="text-2xl block mb-1">
                    {transitNatalAspects.filter(a => a.nature === 'neutral').length}
                  </span>
                  <span className="text-purple-400 text-sm">Conjunctions</span>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-surface-base/50 border border-theme-border-subtle rounded-xl p-8 text-center">
              <p className="text-theme-text-tertiary">No significant transits to your natal planets today</p>
            </div>
          )}
        </section>
      )}

      {/* Prompt to load profile if not loaded */}
      {!profile && (
        <section className="mt-12">
          <div className="bg-gradient-to-br from-purple-900/20 to-neutral-900 border border-purple-500/30 rounded-xl p-8 text-center">
            <span className="text-4xl block mb-4">✨</span>
            <h3 className="font-serif text-xl text-theme-text-primary mb-2">
              See How Today Affects Your Chart
            </h3>
            <p className="text-theme-text-secondary mb-4">
              Load your profile to see which transits are activating your natal planets
            </p>
            <Link
              to="/profile"
              className="inline-block px-6 py-2 bg-purple-500/20 border border-purple-500/40 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-colors"
            >
              Go to Profile
            </Link>
          </div>
        </section>
      )}

      {/* Fixed Star Activations */}
      <section className="mt-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-amber-400 text-2xl">★</span>
          <h2 className="font-serif text-2xl text-theme-text-primary">Fixed Star Activations</h2>
        </div>
        <p className="text-theme-text-secondary text-sm mb-6">
          Transiting planets currently conjunct fixed stars — ancient archetypal thresholds activated in the sky
        </p>

        {/* Personal activations (profile-gated) */}
        {profile && personalStarActivations.length > 0 && (
          <div className="mb-6">
            <h3 className="font-serif text-lg text-amber-300 mb-3 flex items-center gap-2">
              <span>✦</span> Personal Activations — Your Natal Star Degrees
            </h3>
            <div className="space-y-3">
              {personalStarActivations.map((act, i) => (
                <motion.div
                  key={`${act.star.id}-${act.transitPlanetId}-personal`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/8"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl text-amber-400">★</span>
                      <span className="text-lg">{act.transitPlanetSymbol}</span>
                      <span className="font-medium text-theme-text-primary">{act.transitPlanetName}</span>
                      <span className="text-theme-text-tertiary text-sm">activating</span>
                      <Link
                        to={`/fixed-stars/${act.star.id}`}
                        className="font-serif font-medium text-amber-300 hover:text-amber-200 transition-colors"
                      >
                        {act.star.name}
                      </Link>
                    </div>
                    <span className="text-xs font-mono text-amber-400/70 shrink-0">
                      {act.orbDegree.toFixed(2)}° orb
                    </span>
                  </div>
                  <p className="text-sm text-amber-300/70 italic ml-8">{act.star.archetype}</p>
                  <p className="text-xs text-theme-text-muted ml-8 mt-1">{act.star.giftExpression}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Sky-wide activations */}
        {skyStarActivations.length > 0 ? (
          <div>
            <h3 className="font-serif text-base text-theme-text-tertiary mb-3">
              Sky-Wide Star Weather
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {skyStarActivations.map((act, i) => (
                <motion.div
                  key={`${act.star.id}-${act.transitPlanetId}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`p-3 rounded-xl border bg-surface-raised/30 ${
                    act.isPersonal
                      ? 'border-amber-500/40'
                      : 'border-theme-border-subtle'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-amber-400">★</span>
                      <Link
                        to={`/fixed-stars/${act.star.id}`}
                        className="text-sm font-medium text-theme-text-primary hover:text-amber-300 transition-colors"
                      >
                        {act.star.name}
                      </Link>
                      {act.star.isRoyalStar && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/25">Royal</span>
                      )}
                      {act.isPersonal && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">In your chart</span>
                      )}
                    </div>
                    <span className="text-xs text-theme-text-muted font-mono">{act.orbDegree.toFixed(2)}°</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-theme-text-secondary">
                    <span>{act.transitPlanetSymbol}</span>
                    <span>{act.transitPlanetName}</span>
                    <span className="text-theme-text-muted">·</span>
                    <span className="italic text-theme-text-muted">{act.star.archetype}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-surface-base/50 border border-theme-border-subtle rounded-xl p-8 text-center">
            <span className="text-3xl mb-2 block text-theme-text-muted">★</span>
            <p className="text-theme-text-tertiary text-sm">
              No transiting planets are currently within orb of a tracked fixed star
            </p>
          </div>
        )}

        <div className="mt-4 text-right">
          <Link
            to="/fixed-stars"
            className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
          >
            Explore All Fixed Stars →
          </Link>
        </div>
      </section>

      {/* How Transits Work */}
      <section className="mt-12 bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h3 className="font-serif text-lg text-theme-text-primary mb-4">Understanding Transits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-purple-400 font-medium mb-1">What Are Transits?</p>
            <p className="text-theme-text-secondary">
              Transits are the current positions of planets as they move through the zodiac, creating aspects to your natal chart.
            </p>
          </div>
          <div>
            <p className="text-purple-400 font-medium mb-1">Retrograde Motion</p>
            <p className="text-theme-text-secondary">
              When planets appear to move backward (℞), their energy turns inward—time for review, revision, and reflection.
            </p>
          </div>
          <div>
            <p className="text-purple-400 font-medium mb-1">Moon Phases</p>
            <p className="text-theme-text-secondary">
              The lunar cycle sets the rhythm for action (waxing) and release (waning), with New and Full Moons as pivot points.
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default Transits;
