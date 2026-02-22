import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfile } from '../../context';
import { signs, planets, points } from '../../data';

import { LoadingSkeleton, ProfileRequiredState } from '../../components';
import { getCosmicWeather } from '../../services/transits';
import {
  ILOS_KEY_AREAS,
  VPER_CONFIG,
  houseNumFromId,
  getKeyArea,
  getCosmicVperSummary,
} from '../../services/ilos';
import type { VperPhase } from '../../types';

// Indicators for each section
const PURPOSE_CONSTELLATION_IDS = ['north-node', 'part-of-fortune', 'chiron', 'vertex'];
const IDEAL_SELF_IDS = ['sun', 'moon'];
const GROWTH_EDGE_IDS = ['saturn', 'chiron', 'south-node'];
const TEMPORAL_PLANET_IDS = ['jupiter', 'saturn', 'uranus'];

// ─── Sub-components ──────────────────────────────────────────────────────────────

function VperBadge({ phase }: { phase: VperPhase }) {
  const cfg = VPER_CONFIG[phase];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${cfg.color} ${cfg.textColor} ${cfg.borderColor}`}>
      <span>{cfg.icon}</span>
      <span>{cfg.label}</span>
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────────

export function ProfileLifePurpose() {
  const { profile, isLoading, hasProfile } = useProfile();

  const cosmicWeather = useMemo(() => getCosmicWeather(), []);
  const temporalPositions = useMemo(
    () => cosmicWeather.positions.filter(p => TEMPORAL_PLANET_IDS.includes(p.planetId)),
    [cosmicWeather],
  );
  const dominantPhase = useMemo(
    () => getCosmicVperSummary(temporalPositions).dominantPhase,
    [temporalPositions],
  );

  if (isLoading) return <LoadingSkeleton variant="profile" />;

  if (!hasProfile || !profile) {
    return (
      <ProfileRequiredState
        title="Life Purpose"
        description="Create your profile to explore your life purpose, soul calling, and current cosmic phase."
      />
    );
  }

  // Section 1 — Purpose Constellation
  const purposePlacements = profile.placements.filter(p => PURPOSE_CONSTELLATION_IDS.includes(p.planetId));

  // Section 2 — Ideal Self Blueprint (Sun, Moon + ASC/MC from housePositions)
  const idealSelfPlacements = profile.placements.filter(p => IDEAL_SELF_IDS.includes(p.planetId));
  const ascPlacement = profile.housePositions.find(h => h.houseId === 'house-1');
  const mcPlacement = profile.housePositions.find(h => h.houseId === 'house-10');

  // Section 3 — Growth Edges
  const growthEdgePlacements = profile.placements.filter(p => GROWTH_EDGE_IDS.includes(p.planetId));
  const twelfthHousePlacements = profile.placements.filter(
    p => p.houseId === 'house-12' && !GROWTH_EDGE_IDS.includes(p.planetId),
  );

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Link
            to="/profile"
            className="text-theme-text-secondary hover:text-theme-text-primary text-sm mb-2 inline-block"
          >
            ← Back to Overview
          </Link>
          <h1 className="font-serif text-3xl text-theme-text-primary flex items-center gap-3">
            <span className="text-amber-400">◈</span>
            Life Purpose
          </h1>
          <p className="text-theme-text-secondary mt-1">{profile.name}'s purpose constellation & ILOS activation</p>
        </div>
        <Link
          to="/contemplate"
          className="px-4 py-2 bg-amber-500/20 text-amber-300 rounded-lg hover:bg-amber-500/30 transition-colors text-sm border border-amber-500/30"
        >
          Contemplate Life Purpose →
        </Link>
      </div>

      {/* Section 1: Purpose Constellation */}
      {purposePlacements.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle"
        >
          <h2 className="font-serif text-xl text-theme-text-primary mb-1">Purpose Constellation</h2>
          <p className="text-sm text-theme-text-tertiary mb-5">
            North Node, Part of Fortune, Chiron, and Vertex — the QUANTUM self-knowledge layer.
            Where soul direction, joy, wisdom wound, and destiny converge.
          </p>
          <div>
            {purposePlacements.map(p => {
              const entity = planets.get(p.planetId) ?? points.get(p.planetId);
              const sign = signs.get(p.signId);
              if (!entity || !sign) return null;
              const houseNum = houseNumFromId(p.houseId);
              const keyArea = houseNum ? ILOS_KEY_AREAS[houseNum] : null;
              return (
                <div
                  key={p.planetId}
                  className="flex items-start justify-between gap-4 py-3 border-b border-theme-border-subtle/40 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl text-theme-text-secondary w-8 text-center shrink-0">
                      {entity.symbol ?? '◈'}
                    </span>
                    <div>
                      <span className="font-medium text-theme-text-primary">{entity.name}</span>
                      <div className="text-sm text-theme-text-secondary mt-0.5">
                        {sign.symbol} {sign.name}
                        {houseNum && (
                          <>
                            {' · '}
                            <span className="text-theme-text-tertiary">
                              H{houseNum}{keyArea ? ` / ${keyArea}` : ''}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {sign.vperPhase && <VperBadge phase={sign.vperPhase} />}
                </div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* Section 2: Ideal Self Blueprint */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle"
      >
        <div className="flex items-start justify-between flex-wrap gap-3 mb-1">
          <h2 className="font-serif text-xl text-theme-text-primary">Ideal Self Blueprint</h2>
          <Link
            to="/contemplate"
            className="text-xs text-amber-400/70 hover:text-amber-400 transition-colors"
          >
            Contemplate idealSelfBlueprint →
          </Link>
        </div>
        <p className="text-sm text-theme-text-tertiary mb-5">
          This is not who you are becoming — this is who you already ARE, measured from how far you have traveled.
          Sun, Moon, ASC, and MC at highest expression form your Gap-to-Gain document.
        </p>

        <div>
          {/* ASC (Rising) from housePositions */}
          {ascPlacement && (() => {
            const sign = signs.get(ascPlacement.signId);
            if (!sign) return null;
            return (
              <div className="flex items-start justify-between gap-4 py-3 border-b border-theme-border-subtle/40">
                <div className="flex items-center gap-3">
                  <span className="text-xl text-theme-text-secondary w-8 text-center shrink-0 font-serif">↑</span>
                  <div>
                    <span className="font-medium text-theme-text-primary">Rising (ASC)</span>
                    <div className="text-sm text-theme-text-secondary mt-0.5">
                      {sign.symbol} {sign.name}
                      {' · '}
                      <span className="text-theme-text-tertiary">H1 / {ILOS_KEY_AREAS[1]}</span>
                    </div>
                    {sign.lightExpression && (
                      <p className="text-xs text-emerald-400/80 italic mt-1 leading-relaxed">{sign.lightExpression}</p>
                    )}
                  </div>
                </div>
                {sign.vperPhase && <VperBadge phase={sign.vperPhase} />}
              </div>
            );
          })()}

          {/* MC from housePositions */}
          {mcPlacement && (() => {
            const sign = signs.get(mcPlacement.signId);
            if (!sign) return null;
            return (
              <div className="flex items-start justify-between gap-4 py-3 border-b border-theme-border-subtle/40">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-theme-text-secondary w-8 text-center shrink-0 font-mono font-bold">MC</span>
                  <div>
                    <span className="font-medium text-theme-text-primary">Midheaven (MC)</span>
                    <div className="text-sm text-theme-text-secondary mt-0.5">
                      {sign.symbol} {sign.name}
                      {' · '}
                      <span className="text-theme-text-tertiary">H10 / {ILOS_KEY_AREAS[10]}</span>
                    </div>
                    {sign.lightExpression && (
                      <p className="text-xs text-emerald-400/80 italic mt-1 leading-relaxed">{sign.lightExpression}</p>
                    )}
                  </div>
                </div>
                {sign.vperPhase && <VperBadge phase={sign.vperPhase} />}
              </div>
            );
          })()}

          {/* Sun and Moon from placements */}
          {idealSelfPlacements.map(p => {
            const entity = planets.get(p.planetId) ?? points.get(p.planetId);
            const sign = signs.get(p.signId);
            if (!entity || !sign) return null;
            const houseNum = houseNumFromId(p.houseId);
            const keyArea = houseNum ? ILOS_KEY_AREAS[houseNum] : null;
            return (
              <div
                key={p.planetId}
                className="flex items-start justify-between gap-4 py-3 border-b border-theme-border-subtle/40 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-theme-text-secondary w-8 text-center shrink-0">
                    {entity.symbol ?? '◈'}
                  </span>
                  <div>
                    <span className="font-medium text-theme-text-primary">{entity.name}</span>
                    <div className="text-sm text-theme-text-secondary mt-0.5">
                      {sign.symbol} {sign.name}
                      {houseNum && (
                        <>
                          {' · '}
                          <span className="text-theme-text-tertiary">
                            H{houseNum}{keyArea ? ` / ${keyArea}` : ''}
                          </span>
                        </>
                      )}
                    </div>
                    {sign.lightExpression && (
                      <p className="text-xs text-emerald-400/80 italic mt-1 leading-relaxed">{sign.lightExpression}</p>
                    )}
                  </div>
                </div>
                {sign.vperPhase && <VperBadge phase={sign.vperPhase} />}
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Section 3: Growth Edges */}
      {(growthEdgePlacements.length > 0 || twelfthHousePlacements.length > 0) && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle"
        >
          <div className="flex items-start justify-between flex-wrap gap-3 mb-1">
            <h2 className="font-serif text-xl text-theme-text-primary">Growth Edges</h2>
            <Link
              to="/contemplate"
              className="text-xs text-amber-400/70 hover:text-amber-400 transition-colors"
            >
              Contemplate shadowToLightReading →
            </Link>
          </div>
          <p className="text-sm text-theme-text-tertiary mb-5">
            Saturn, Chiron, South Node, and 12th house planets — the Review/Water phase work.
            Shadow material invites integration into wisdom. Every shadow contains its gift.
          </p>

          <div>
            {[...growthEdgePlacements, ...twelfthHousePlacements].map(p => {
              const entity = planets.get(p.planetId) ?? points.get(p.planetId);
              const sign = signs.get(p.signId);
              if (!entity || !sign) return null;
              const houseNum = houseNumFromId(p.houseId);
              const keyArea = houseNum ? ILOS_KEY_AREAS[houseNum] : null;
              return (
                <div
                  key={p.planetId}
                  className="flex items-start gap-4 py-3 border-b border-theme-border-subtle/40 last:border-0"
                >
                  <span className="text-2xl text-theme-text-secondary w-8 text-center shrink-0 mt-1">
                    {entity.symbol ?? '◈'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <span className="font-medium text-theme-text-primary">{entity.name}</span>
                      {sign.vperPhase && <VperBadge phase={sign.vperPhase} />}
                    </div>
                    <div className="text-sm text-theme-text-secondary mt-0.5">
                      {sign.symbol} {sign.name}
                      {houseNum && (
                        <>
                          {' · '}
                          <span className="text-theme-text-tertiary">
                            H{houseNum}{keyArea ? ` / ${keyArea}` : ''}
                          </span>
                        </>
                      )}
                    </div>
                    {sign.shadowExpression && (
                      <div className="mt-2 p-3 bg-rose-500/5 border border-rose-500/15 rounded-lg">
                        <p className="text-xs uppercase tracking-wider text-rose-400 mb-1">Shadow → Integration</p>
                        <p className="text-sm text-theme-text-secondary italic leading-relaxed">
                          {sign.shadowExpression}
                        </p>
                      </div>
                    )}
                    {sign.managementGuidance && (
                      <p className="text-xs text-theme-text-muted mt-2 leading-relaxed">{sign.managementGuidance}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* Section 4: Current Temporal Activation */}
      {temporalPositions.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle"
        >
          <div className="flex items-start justify-between flex-wrap gap-3 mb-1">
            <h2 className="font-serif text-xl text-theme-text-primary">Current Temporal Activation</h2>
            <Link
              to="/contemplate"
              className="text-xs text-amber-400/70 hover:text-amber-400 transition-colors"
            >
              Contemplate transitPlanningMap →
            </Link>
          </div>
          <p className="text-sm text-theme-text-tertiary mb-4">
            Jupiter, Saturn, and Uranus mapped to VPER phases and ILOS Key Areas — your TIME-layer activation landscape.
          </p>

          {/* Dominant VPER phase headline */}
          {dominantPhase && (
            <div
              className={`flex items-center gap-4 p-4 rounded-xl border mb-5 ${VPER_CONFIG[dominantPhase].color} ${VPER_CONFIG[dominantPhase].borderColor}`}
            >
              <span className="text-4xl">{VPER_CONFIG[dominantPhase].icon}</span>
              <div>
                <div className={`text-xs font-medium uppercase tracking-wider ${VPER_CONFIG[dominantPhase].textColor}`}>
                  Current Cosmic Phase
                </div>
                <div className={`font-serif text-lg font-medium mt-0.5 ${VPER_CONFIG[dominantPhase].textColor}`}>
                  {VPER_CONFIG[dominantPhase].label}
                </div>
                <p className="text-sm text-theme-text-secondary mt-1">
                  {VPER_CONFIG[dominantPhase].description}
                </p>
              </div>
            </div>
          )}

          {/* Transit breakdown */}
          <div className="space-y-3">
            {temporalPositions.map(pos => {
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
                        <span className="font-medium text-theme-text-primary">{pos.planetName}</span>
                        {pos.isRetrograde && (
                          <span className="text-xs px-1.5 py-0.5 bg-surface-raised rounded border border-theme-border text-theme-text-tertiary">
                            ℞
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-theme-text-secondary">
                        {pos.signSymbol} {pos.signName} {pos.formattedDegree}
                        {' · '}
                        <span className="text-theme-text-tertiary">H{houseNum} / {areaName}</span>
                      </div>
                    </div>
                  </div>
                  {vperPhase && <VperBadge phase={vperPhase} />}
                </div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* Footer note */}
      <section className="bg-surface-raised/20 rounded-xl p-5 border border-theme-border-subtle">
        <h3 className="font-serif text-base text-theme-text-tertiary mb-2">About This Reading</h3>
        <p className="text-sm text-theme-text-muted leading-relaxed">
          Life Purpose synthesizes Julia Balaz's four-phase methodology (Know Thyself → Identify Challenges →
          Integrate → Plan) with ILOS QUANTUM/SPACE/TIME architecture. The Purpose Constellation maps your
          QUANTUM layer (soul-level indicators), Growth Edges surface the Review/Water integration work, and
          Current Temporal Activation shows which VPER phase the collective sky is activating right now.
        </p>
      </section>

    </div>
  );
}

export default ProfileLifePurpose;
