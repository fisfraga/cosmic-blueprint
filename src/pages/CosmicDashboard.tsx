import { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signs } from '../data';
import { getCosmicWeather } from '../services/transits';
import {
  VPER_CONFIG,
  getKeyArea,
  getCosmicVperSummary,
} from '../services/ilos';
import type { VperPhase } from '../types';
import { EntityStack, EntityLink } from '../components/entities';
import type { EntityInfo } from '../services/entities';
import { useProfile } from '../context';

// Slow planets that define the collective cycle
const SLOW_PLANET_IDS = ['jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

// Quick-action links per VPER phase
const PHASE_QUICK_LINKS: Record<VperPhase, { label: string; path: string; description: string }[]> = {
  vision: [
    { label: 'Life Purpose', path: '/profile/life-purpose', description: 'Explore your soul calling' },
    { label: 'Cosmic Weather', path: '/transits', description: 'Current activations' },
    { label: 'Guided Pathways', path: '/pathways', description: 'Journey into purpose' },
  ],
  plan: [
    { label: 'Contemplation', path: '/contemplate', description: 'Strategic reflection' },
    { label: 'Astrology Profile', path: '/profile/astrology', description: 'Chart patterns & timing' },
    { label: 'Life Areas', path: '/life-areas', description: 'House activations' },
  ],
  execute: [
    { label: 'Life Areas', path: '/life-areas', description: 'What each house asks of you' },
    { label: 'Cosmic Weather', path: '/transits', description: 'Grounding transits' },
    { label: 'Astrology Profile', path: '/profile/astrology', description: 'Earth sector analysis' },
  ],
  review: [
    { label: 'Sessions', path: '/sessions', description: 'Revisit past insights' },
    { label: 'Gene Keys', path: '/profile/gene-keys', description: 'Shadow integration' },
    { label: 'Life Purpose', path: '/profile/life-purpose', description: 'Growth edges' },
  ],
};

// ─── Sub-components ──────────────────────────────────────────────────────────────

function VperPhaseBadge({ phase }: { phase: VperPhase }) {
  const cfg = VPER_CONFIG[phase];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${cfg.color} ${cfg.textColor} ${cfg.borderColor}`}
    >
      <span>{cfg.icon}</span>
      <span>{cfg.label}</span>
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────────

const ELEMENT_SYMBOLS: Record<string, string> = { fire: '🜂', earth: '🜃', air: '🜁', water: '🜄' };

export function CosmicDashboard() {
  const cosmicWeather = useMemo(() => getCosmicWeather(), []);
  const [selectedEntities, setSelectedEntities] = useState<EntityInfo[]>([]);
  const { cosmicProfile } = useProfile();
  const surveyScores = cosmicProfile?.personalContext?.elementalSurveyScores ?? null;

  const handleEntityClick = useCallback((entity: EntityInfo) => {
    setSelectedEntities(prev => {
      if (prev.some(e => e.id === entity.id)) return prev;
      if (prev.length < 2) return [...prev, entity];
      return [prev[1], entity];
    });
  }, []);

  const handleCloseEntity = useCallback((entityId: string) => {
    setSelectedEntities(prev => prev.filter(e => e.id !== entityId));
  }, []);

  const slowPositions = useMemo(
    () => cosmicWeather.positions.filter(p => SLOW_PLANET_IDS.includes(p.planetId)),
    [cosmicWeather],
  );

  const { dominantPhase, phaseCounts, activeArenas } = useMemo(
    () => getCosmicVperSummary(slowPositions),
    [slowPositions],
  );

  const oppositePole = dominantPhase ? VPER_CONFIG[dominantPhase].oppositePole : null;

  // Format today's date
  const today = new Date();
  const dateLabel = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="flex h-full">
    <div className="flex-1 min-w-0 overflow-y-auto">
    <div className="space-y-10 max-w-2xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl text-theme-text-primary flex items-center gap-3">
          <span className="text-amber-400">✦</span>
          Cosmic Dashboard
        </h1>
        <p className="text-theme-text-secondary mt-1">{dateLabel}</p>
      </div>

      {/* Current Cosmic Phase — dominant VPER phase */}
      {dominantPhase && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-6 border ${VPER_CONFIG[dominantPhase].color} ${VPER_CONFIG[dominantPhase].borderColor}`}
        >
          <div className="flex items-start gap-4">
            <span className="text-5xl">{VPER_CONFIG[dominantPhase].icon}</span>
            <div>
              <div className={`text-xs font-medium uppercase tracking-wider ${VPER_CONFIG[dominantPhase].textColor}`}>
                Current Cosmic Phase
              </div>
              <div className={`font-serif text-2xl font-medium mt-1 ${VPER_CONFIG[dominantPhase].textColor}`}>
                {VPER_CONFIG[dominantPhase].label}
              </div>
              <p className="text-theme-text-secondary mt-2 leading-relaxed">
                {VPER_CONFIG[dominantPhase].description}
              </p>

              {/* Phase vote breakdown */}
              {Object.keys(phaseCounts).length > 1 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {(Object.entries(phaseCounts) as [VperPhase, number][])
                    .sort((a, b) => b[1] - a[1])
                    .map(([phase, count]) => (
                      <span
                        key={phase}
                        className={`text-xs px-2 py-0.5 rounded-full border ${VPER_CONFIG[phase].color} ${VPER_CONFIG[phase].textColor} ${VPER_CONFIG[phase].borderColor}`}
                      >
                        {VPER_CONFIG[phase].icon} {count}
                      </span>
                    ))}
                </div>
              )}

              {/* Growth Edge — opposite pole */}
              {oppositePole && (
                <div className="mt-3 text-sm text-theme-text-tertiary">
                  <span className="font-medium">Growth Edge:</span>{' '}
                  {VPER_CONFIG[oppositePole].icon} {VPER_CONFIG[oppositePole].label} — the balancing opposite
                </div>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* Active Cosmic Arenas */}
      {activeArenas.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle"
        >
          <h2 className="font-serif text-xl text-theme-text-primary mb-1">Active Cosmic Arenas</h2>
          <p className="text-sm text-theme-text-tertiary mb-5">
            Where the slow-moving planets are focusing their energy in the collective sky.
          </p>

          <div className="space-y-3">
            {slowPositions.map(pos => {
              const sign = signs.get(pos.signId);
              const vperPhase = sign?.vperPhase;
              const { houseNum, areaName } = getKeyArea(pos.signId, pos.housePosition);
              return (
                <div
                  key={pos.planetId}
                  className="flex items-center justify-between gap-4 p-4 bg-surface-raised/30 rounded-xl border border-theme-border-subtle"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl text-theme-text-secondary shrink-0">{pos.symbol}</span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <EntityLink
                          entityId={pos.planetId}
                          displayName={pos.planetName}
                          onClick={handleEntityClick}
                          className="font-medium"
                        />
                        {pos.isRetrograde && (
                          <span className="text-xs px-1.5 py-0.5 bg-surface-raised rounded border border-theme-border text-theme-text-tertiary">
                            ℞
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-theme-text-secondary flex items-center gap-1 flex-wrap">
                        <span>{pos.signSymbol}</span>
                        <EntityLink
                          entityId={pos.signId}
                          displayName={pos.signName}
                          onClick={handleEntityClick}
                        />
                        <span>{pos.formattedDegree}</span>
                        {' · '}
                        <span className="text-theme-text-tertiary">H{houseNum} / {areaName}</span>
                      </div>
                    </div>
                  </div>
                  {vperPhase && <VperPhaseBadge phase={vperPhase} />}
                </div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* Quick Actions — phase-specific links */}
      {dominantPhase && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle"
        >
          <h2 className="font-serif text-xl text-theme-text-primary mb-1">Suggested Paths</h2>
          <p className="text-sm text-theme-text-tertiary mb-5">
            What the {VPER_CONFIG[dominantPhase].label} phase invites you to explore.
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            {PHASE_QUICK_LINKS[dominantPhase].map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="flex flex-col gap-1 p-4 bg-surface-raised/30 rounded-xl border border-theme-border-subtle hover:border-theme-accent/30 hover:bg-surface-raised/50 transition-all"
              >
                <span className="font-medium text-theme-text-primary text-sm">{link.label}</span>
                <span className="text-xs text-theme-text-tertiary leading-relaxed">{link.description}</span>
              </Link>
            ))}
          </div>

          {/* Contemplate CTA */}
          <div className="mt-4 flex justify-center">
            <Link
              to="/contemplate"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500/20 text-amber-300 rounded-lg hover:bg-amber-500/30 transition-colors border border-amber-500/30 text-sm font-medium"
            >
              <span>🕯</span>
              Generate Your VPER Phase Storyline
            </Link>
          </div>
        </motion.section>
      )}

      {/* Moon Phase widget */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-surface-base/50 rounded-xl p-5 border border-theme-border-subtle"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{cosmicWeather.moonPhase.emoji}</span>
            <div>
              <div className="font-medium text-theme-text-primary">{cosmicWeather.moonPhase.name}</div>
              <div className="text-sm text-theme-text-secondary">
                {cosmicWeather.moonPhase.moonSign} {cosmicWeather.moonPhase.moonDegree}
                {' · '}
                <span className="text-theme-text-tertiary">
                  {Math.round(cosmicWeather.moonPhase.illumination * 100)}% illuminated
                </span>
              </div>
            </div>
          </div>
          <Link
            to="/transits"
            className="text-xs text-theme-text-muted hover:text-theme-text-secondary transition-colors"
          >
            Full Cosmic Weather →
          </Link>
        </div>
      </motion.section>

      {/* Elemental Profile — survey CTA or mini badge */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface-base/50 rounded-xl p-5 border border-theme-border-subtle"
      >
        {surveyScores ? (
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl text-amber-400">🜂</span>
              <div>
                <div className="font-medium text-theme-text-primary text-sm">Elemental Profile</div>
                <div className="flex items-center gap-2 mt-0.5">
                  {(['fire', 'air', 'earth', 'water'] as const).map(el => (
                    <span key={el} className="text-xs text-theme-text-secondary">
                      {ELEMENT_SYMBOLS[el]} {surveyScores[el]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <Link
              to="/elements/survey"
              className="text-xs text-theme-text-muted hover:text-theme-text-secondary transition-colors"
            >
              View Full Profile →
            </Link>
          </div>
        ) : (
          <Link to="/elements/survey" className="flex items-center gap-3 group">
            <span className="text-2xl text-amber-400/60 group-hover:text-amber-400 transition-colors">🜂</span>
            <div>
              <div className="font-medium text-theme-text-primary text-sm group-hover:text-amber-300 transition-colors">
                Discover Your Elemental Profile
              </div>
              <div className="text-xs text-theme-text-tertiary">
                A 12-question self-assessment of your Fire, Air, Earth & Water balance
              </div>
            </div>
          </Link>
        )}
      </motion.section>

    </div>
    </div>

      {/* Entity Stack — side panels for entity details */}
      <EntityStack
        entities={selectedEntities}
        onCloseEntity={handleCloseEntity}
        onEntityClick={handleEntityClick}
      />
    </div>
  );
}

export default CosmicDashboard;
