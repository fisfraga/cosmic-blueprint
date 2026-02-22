// ============================================
// Cosmic Weather Widget
// ============================================
// Dashboard widget showing today's cosmic weather
// Shows moon phase (from ephemeris) and sky positions with natal aspect badges

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfile } from '../context';
import { getCosmicWeather, type CosmicWeather, type TransitPosition } from '../services/transits';
import { calculateTransitNatalAspects, type TransitNatalAspect } from '../services/transitAspects';

// Aspect badge colors and symbols
const ASPECT_BADGES: Record<string, { color: string; symbol: string; bg: string }> = {
  Conjunction: { color: 'text-purple-400', symbol: '☌', bg: 'bg-purple-500/20' },
  Sextile: { color: 'text-emerald-400', symbol: '⚹', bg: 'bg-emerald-500/20' },
  Square: { color: 'text-red-400', symbol: '□', bg: 'bg-red-500/20' },
  Trine: { color: 'text-emerald-400', symbol: '△', bg: 'bg-emerald-500/20' },
  Opposition: { color: 'text-red-400', symbol: '☍', bg: 'bg-red-500/20' },
};

// Group transits by transit planet
function groupTransitsByPlanet(aspects: TransitNatalAspect[]): Map<string, TransitNatalAspect[]> {
  const grouped = new Map<string, TransitNatalAspect[]>();
  for (const aspect of aspects) {
    const existing = grouped.get(aspect.transitPlanetId) || [];
    existing.push(aspect);
    grouped.set(aspect.transitPlanetId, existing);
  }
  return grouped;
}

// Planet card showing position and natal aspect badges
function PlanetCard({
  position,
  natalAspects,
}: {
  position: TransitPosition;
  natalAspects: TransitNatalAspect[];
}) {
  const hasAspects = natalAspects.length > 0;

  return (
    <div
      className={`
        relative flex items-center gap-2 px-3 py-2 rounded-lg
        ${hasAspects ? 'bg-surface-raised border border-theme-border' : 'bg-surface-raised/60'}
        transition-all
      `}
      aria-label={`${position.planetName} in ${position.signName} at ${position.formattedDegree}${position.isRetrograde ? ', retrograde' : ''}${hasAspects ? `, ${natalAspects.length} natal aspect${natalAspects.length !== 1 ? 's' : ''}` : ''}`}
    >
      {/* Planet symbol and sign */}
      <div className="flex items-center gap-1.5">
        <span className="text-lg" title={position.planetName}>
          {position.symbol}
        </span>
        <span className="text-theme-text-secondary text-sm" title={position.signName}>
          {position.signSymbol}
        </span>
      </div>

      {/* Degree */}
      <span className="text-xs text-theme-text-tertiary">
        {position.formattedDegree}
      </span>

      {/* Retrograde indicator */}
      {position.isRetrograde && (
        <span className="text-amber-400 text-xs" title="Retrograde">℞</span>
      )}

      {/* Natal aspect badges */}
      {hasAspects && (
        <div className="flex items-center gap-0.5 ml-auto">
          {natalAspects.slice(0, 3).map((aspect, i) => {
            const badge = ASPECT_BADGES[aspect.aspectType] || ASPECT_BADGES.Conjunction;
            return (
              <span
                key={i}
                className={`
                  inline-flex items-center justify-center w-5 h-5 rounded-full text-xs
                  ${badge.bg} ${badge.color}
                `}
                title={`${aspect.aspectType} to natal ${aspect.natalPlanet} (${aspect.orb.toFixed(1)}° orb)`}
              >
                {aspect.natalSymbol}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function CosmicWeatherWidget() {
  const { profile, hasProfile } = useProfile();
  const [weather, setWeather] = useState<CosmicWeather | null>(null);
  const [transitsByPlanet, setTransitsByPlanet] = useState<Map<string, TransitNatalAspect[]>>(new Map());

  useEffect(() => {
    const now = new Date();
    setWeather(getCosmicWeather(now));

    if (hasProfile && profile) {
      const natalPlacements = profile.placements.map(p => ({
        planetId: p.planetId,
        signId: p.signId,
        degree: p.degree,
        minute: p.minute,
        retrograde: p.retrograde,
      }));
      const aspects = calculateTransitNatalAspects(now, natalPlacements);
      setTransitsByPlanet(groupTransitsByPlanet(aspects));
    }
  }, [profile, hasProfile]);

  if (!weather) {
    return (
      <div className="bg-surface-overlay border border-theme-border-subtle rounded-xl p-6 animate-pulse">
        <div className="h-6 w-32 bg-surface-interactive rounded mb-4" />
        <div className="h-20 bg-surface-interactive rounded" />
      </div>
    );
  }

  // Separate Moon from other planets (Moon shown in featured section with ephemeris data)
  const otherPositions = weather.positions.filter(p => p.planetId !== 'moon');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-surface-raised to-surface-base border border-theme-border-subtle rounded-xl overflow-hidden"
      role="region"
      aria-label="Current cosmic weather"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-theme-border-subtle/50 flex items-center justify-between">
        <h3 className="text-sm font-medium text-theme-text-primary flex items-center gap-2">
          <span className="text-xl">{weather.moonPhase.emoji}</span>
          Today's Sky
        </h3>
        <span className="text-xs text-theme-text-tertiary">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Moon Section - Featured */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{weather.moonPhase.emoji}</span>
            <div>
              <p className="text-theme-text-primary font-medium">{weather.moonPhase.name}</p>
              <p className="text-sm text-theme-text-secondary">
                Moon in {weather.moonPhase.moonSignSymbol} {weather.moonPhase.moonSign}
                <span className="text-theme-text-tertiary ml-1">{weather.moonPhase.moonDegree}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-light text-indigo-300">{weather.moonPhase.illumination}%</p>
            <p className="text-xs text-theme-text-tertiary">illuminated</p>
          </div>
        </div>

        {/* Retrogrades Alert (if any) */}
        {weather.retrogradeCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <span className="text-amber-400 text-sm">℞</span>
            <span className="text-sm text-amber-300">
              {weather.retrogradeCount} planet{weather.retrogradeCount !== 1 ? 's' : ''} retrograde
            </span>
            <span className="text-xs text-amber-400/70 ml-auto">
              {weather.positions.filter(p => p.isRetrograde).map(p => p.symbol).join(' ')}
            </span>
          </div>
        )}

        {/* Current Sky Positions */}
        <div>
          <p className="text-xs text-theme-text-tertiary uppercase tracking-wide mb-2">
            Planets in the Sky
            {hasProfile && <span className="text-purple-400 ml-1">• badges show natal aspects</span>}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {otherPositions.map(position => (
              <PlanetCard
                key={position.planetId}
                position={position}
                natalAspects={transitsByPlanet.get(position.planetId) || []}
              />
            ))}
          </div>
        </div>

        {/* Active Transit Summary (if profile) */}
        {hasProfile && transitsByPlanet.size > 0 && (
          <div className="pt-2 border-t border-theme-border-subtle/50">
            <p className="text-xs text-theme-text-tertiary mb-2">
              {Array.from(transitsByPlanet.values()).flat().length} active transit-natal aspects
            </p>
            <div className="flex flex-wrap gap-1">
              {Array.from(transitsByPlanet.values())
                .flat()
                .slice(0, 6)
                .map((aspect, i) => {
                  const badge = ASPECT_BADGES[aspect.aspectType] || ASPECT_BADGES.Conjunction;
                  return (
                    <span
                      key={i}
                      className={`
                        inline-flex items-center gap-1 px-2 py-1 rounded text-xs
                        ${badge.bg} ${badge.color}
                      `}
                      title={`${aspect.orb.toFixed(1)}° orb`}
                    >
                      {aspect.transitSymbol}
                      <span className="opacity-60">{badge.symbol}</span>
                      {aspect.natalSymbol}
                    </span>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Link */}
      <Link
        to="/transits"
        className="block px-5 py-3 border-t border-theme-border-subtle/50 text-sm text-purple-400 hover:text-purple-300 hover:bg-surface-overlay transition-colors text-center"
      >
        View Full Transit Report →
      </Link>
    </motion.div>
  );
}

export default CosmicWeatherWidget;
