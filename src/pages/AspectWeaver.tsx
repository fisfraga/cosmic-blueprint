import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProfile } from '../context';
import { planets, signs, aspects, getSignsInOrder } from '../data';
import { LoadingSkeleton, ProfileRequiredState } from '../components';
import { EntityStack, EntityLink } from '../components/entities';
import { getEntity } from '../services/entities';
import type { EntityInfo } from '../services/entities';
import {
  sortAspectsByPriority,
  getAspectPriorityTier,
  MAJOR_ASPECT_IDS,
} from '../services/aspects';
import type { NatalAspect } from '../types';

const aspectColors: Record<string, { stroke: string; bg: string; text: string }> = {
  conjunction: { stroke: '#FFFFFF', bg: 'bg-white/20', text: 'text-white' },
  sextile: { stroke: '#4ADE80', bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  square: { stroke: '#F87171', bg: 'bg-rose-500/20', text: 'text-rose-400' },
  trine: { stroke: '#60A5FA', bg: 'bg-blue-500/20', text: 'text-blue-400' },
  opposition: { stroke: '#A78BFA', bg: 'bg-purple-500/20', text: 'text-purple-400' },
  quincunx: { stroke: '#FBBF24', bg: 'bg-amber-500/20', text: 'text-amber-400' },
  'semi-sextile': { stroke: '#34D399', bg: 'bg-emerald-400/20', text: 'text-emerald-300' },
  'semi-square': { stroke: '#FB923C', bg: 'bg-orange-500/20', text: 'text-orange-400' },
  'sesqui-square': { stroke: '#E879F9', bg: 'bg-fuchsia-500/20', text: 'text-fuchsia-400' },
  quintile: { stroke: '#22D3EE', bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  biquintile: { stroke: '#14B8A6', bg: 'bg-teal-500/20', text: 'text-teal-400' },
};

// Priority tier colors
const priorityTierColors = {
  high: 'border-l-yellow-400',
  medium: 'border-l-blue-400',
  low: 'border-l-neutral-500',
};

// Main planets for the wheel
const wheelPlanets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

export function AspectWeaver() {
  const { profile, isLoading, hasProfile } = useProfile();
  const [selectedEntities, setSelectedEntities] = useState<EntityInfo[]>([]);

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

  const [selectedAspect, setSelectedAspect] = useState<NatalAspect | null>(null);
  const [hoveredAspect, setHoveredAspect] = useState<string | null>(null);
  const [filterAspectType, setFilterAspectType] = useState<string | null>(null);
  const [showMajorOnly, setShowMajorOnly] = useState(false);
  const [showAllAspects, setShowAllAspects] = useState(false);

  // Get personal aspects from profile, sorted by priority
  const personalAspects = useMemo(() => {
    if (!profile?.aspects?.planetary) return [];
    return sortAspectsByPriority(profile.aspects.planetary);
  }, [profile]);

  // Filter aspects based on selection
  const filteredAspects = useMemo(() => {
    let filtered = personalAspects;
    if (filterAspectType) {
      filtered = filtered.filter(a => a.aspectId === filterAspectType);
    }
    if (showMajorOnly) {
      filtered = filtered.filter(a => MAJOR_ASPECT_IDS.includes(a.aspectId));
    }
    // By default show top 15 aspects unless showAllAspects is enabled
    if (!showAllAspects && !filterAspectType) {
      filtered = filtered.slice(0, 15);
    }
    return filtered;
  }, [personalAspects, filterAspectType, showMajorOnly, showAllAspects]);

  // Calculate planet positions on wheel
  const planetPositions = useMemo(() => {
    if (!profile?.placements) return new Map<string, number>();

    const positions = new Map<string, number>();
    const orderedSigns = getSignsInOrder();
    const signStartAngles = new Map<string, number>();

    // Each sign takes 30 degrees, starting from Aries at top (270 degrees or -90)
    orderedSigns.forEach((sign, index) => {
      signStartAngles.set(sign.id, -90 + (index * 30));
    });

    profile.placements.forEach(placement => {
      const signStart = signStartAngles.get(placement.signId) || 0;
      const degreeWithinSign = placement.degree + (placement.minute / 60);
      const totalAngle = signStart + degreeWithinSign;
      positions.set(placement.planetId, totalAngle);
    });

    return positions;
  }, [profile]);

  if (isLoading) {
    return <LoadingSkeleton variant="detail" />;
  }

  if (!hasProfile || !profile) {
    return (
      <ProfileRequiredState
        title="Aspect Weaver"
        description="Create your cosmic profile to visualize the geometric relationships between planets in your chart."
      />
    );
  }

  const wheelRadius = 180;
  const planetRadius = 150;

  // Convert angle to coordinates
  const angleToCoord = (angle: number, radius: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: 200 + radius * Math.cos(rad),
      y: 200 + radius * Math.sin(rad),
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full"
    >
      <div className="flex-1 min-w-0 overflow-y-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-serif text-4xl font-medium text-theme-text-primary mb-3">
          Aspect Weaver
        </h1>
        <p className="text-theme-text-secondary max-w-2xl mx-auto">
          Visualize the geometric relationships between planets in your chart.
          Aspects reveal how different parts of your psyche communicate and interact.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <button
          onClick={() => setShowMajorOnly(!showMajorOnly)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showMajorOnly
              ? 'bg-white text-neutral-900'
              : 'bg-surface-raised text-theme-text-secondary hover:bg-surface-interactive'
          }`}
        >
          Major Aspects Only
        </button>
        <button
          onClick={() => setShowAllAspects(!showAllAspects)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showAllAspects
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
              : 'bg-surface-raised text-theme-text-secondary hover:bg-surface-interactive'
          }`}
        >
          {showAllAspects ? 'Showing All' : `Show All (${personalAspects.length})`}
        </button>
        <div className="flex gap-2 flex-wrap justify-center">
          {Array.from(aspects.values()).map((aspect) => (
            <button
              key={aspect.id}
              onClick={() => setFilterAspectType(filterAspectType === aspect.id ? null : aspect.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                filterAspectType === aspect.id
                  ? `${aspectColors[aspect.id]?.bg || 'bg-surface-interactive'} ${aspectColors[aspect.id]?.text || 'text-white'} border border-current`
                  : 'bg-surface-raised text-theme-text-secondary hover:bg-surface-interactive'
              }`}
            >
              <span>{aspect.symbol}</span>
              <span className="hidden sm:inline">{aspect.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Aspect Wheel */}
        <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl text-theme-text-primary mb-4 text-center">Your Aspect Wheel</h2>

          <svg viewBox="0 0 400 400" className="w-full max-w-md mx-auto">
            {/* Zodiac wheel background */}
            <circle cx="200" cy="200" r={wheelRadius} fill="none" stroke="#374151" strokeWidth="1" />
            <circle cx="200" cy="200" r={wheelRadius - 30} fill="none" stroke="#1f2937" strokeWidth="1" />

            {/* Sign markers */}
            {getSignsInOrder().map((sign, index) => {
              const angle = -90 + (index * 30) + 15;
              const coord = angleToCoord(angle, wheelRadius - 15);
              return (
                <text
                  key={sign.id}
                  x={coord.x}
                  y={coord.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-neutral-500 text-xs"
                >
                  {sign.symbol}
                </text>
              );
            })}

            {/* Aspect lines */}
            {filteredAspects.map((aspect) => {
              const angle1 = planetPositions.get(aspect.planet1Id);
              const angle2 = planetPositions.get(aspect.planet2Id);
              if (angle1 === undefined || angle2 === undefined) return null;

              const coord1 = angleToCoord(angle1, planetRadius);
              const coord2 = angleToCoord(angle2, planetRadius);
              const color = aspectColors[aspect.aspectId]?.stroke || '#888';
              const isHovered = hoveredAspect === aspect.id;
              const isSelected = selectedAspect?.id === aspect.id;

              return (
                <line
                  key={aspect.id}
                  x1={coord1.x}
                  y1={coord1.y}
                  x2={coord2.x}
                  y2={coord2.y}
                  stroke={color}
                  strokeWidth={isHovered || isSelected ? 3 : 1.5}
                  strokeOpacity={isHovered || isSelected ? 1 : 0.6}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredAspect(aspect.id)}
                  onMouseLeave={() => setHoveredAspect(null)}
                  onClick={() => setSelectedAspect(aspect)}
                />
              );
            })}

            {/* Planet markers */}
            {wheelPlanets.map((planetId) => {
              const planet = planets.get(planetId);
              const angle = planetPositions.get(planetId);
              if (!planet || angle === undefined) return null;

              const coord = angleToCoord(angle, planetRadius);
              const placement = profile.placements.find(p => p.planetId === planetId);
              const sign = placement ? signs.get(placement.signId) : null;

              return (
                <g key={planetId}>
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r="16"
                    fill="#1f2937"
                    stroke="#A67C52"
                    strokeWidth="2"
                  />
                  <text
                    x={coord.x}
                    y={coord.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white text-sm"
                  >
                    {planet.symbol}
                  </text>
                  {sign && (
                    <text
                      x={coord.x}
                      y={coord.y + 24}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-neutral-400 text-xs"
                    >
                      {sign.symbol}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Aspect List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xltext-theme-text-primary">
              Your Aspects ({filteredAspects.length}{!showAllAspects && !filterAspectType && personalAspects.length > 15 ? ` of ${personalAspects.length}` : ''})
            </h2>
            <div className="flex items-center gap-3 text-xs text-theme-text-secondary">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span> High
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span> Medium
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-neutral-500 rounded-full"></span> Low
              </span>
            </div>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {filteredAspects.map((aspect) => {
              const aspectType = aspects.get(aspect.aspectId);
              const planet1 = planets.get(aspect.planet1Id);
              const planet2 = planets.get(aspect.planet2Id);
              const colors = aspectColors[aspect.aspectId] || { bg: 'bg-surface-interactive', text: 'text-theme-text-primary' };
              const isSelected = selectedAspect?.id === aspect.id;
              const priorityTier = getAspectPriorityTier(aspect);

              if (!aspectType || !planet1 || !planet2) return null;

              return (
                <motion.div
                  key={aspect.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg border-l-4 border cursor-pointer transition-all ${priorityTierColors[priorityTier]} ${
                    isSelected
                      ? `${colors.bg} border-y border-r border-current ${colors.text}`
                      : 'bg-surface-overlay border-y border-r border-theme-border-subtle hover:border-theme-border'
                  }`}
                  onMouseEnter={() => setHoveredAspect(aspect.id)}
                  onMouseLeave={() => setHoveredAspect(null)}
                  onClick={() => setSelectedAspect(isSelected ? null : aspect)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{planet1.symbol}</span>
                      <span className={`text-lg ${colors.text}`}>{aspectType.symbol}</span>
                      <span className="text-xl">{planet2.symbol}</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm ${colors.text}`}>{aspectType.name}</div>
                      <div className="text-xs text-theme-text-secondary">
                        Orb: {aspect.orbDegree}°{aspect.orbMinute}' • {aspect.direction}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-theme-text-secondary">
                    {planet1.name} {aspectType.name.toLowerCase()} {planet2.name}
                  </div>
                </motion.div>
              );
            })}

            {filteredAspects.length === 0 && (
              <p className="text-theme-text-secondary text-center py-4">
                {personalAspects.length === 0
                  ? 'No aspects in profile'
                  : 'No aspects match the current filter'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Selected Aspect Detail */}
      <AnimatePresence>
        {selectedAspect && (() => {
          const aspectType = aspects.get(selectedAspect.aspectId);
          const planet1 = planets.get(selectedAspect.planet1Id);
          const planet2 = planets.get(selectedAspect.planet2Id);
          const colors = aspectColors[selectedAspect.aspectId] || { bg: 'bg-surface-interactive', text: 'text-theme-text-primary' };

          if (!aspectType || !planet1 || !planet2) return null;

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`${colors.bg} border ${colors.text.replace('text-', 'border-')} rounded-xl p-6`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-3xl">
                    <span>{planet1.symbol}</span>
                    <span className={colors.text}>{aspectType.symbol}</span>
                    <span>{planet2.symbol}</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xltext-theme-text-primary">
                      {planet1.name} {aspectType.name} {planet2.name}
                    </h3>
                    <p className="text-sm text-theme-text-secondary">
                      Orb: {selectedAspect.orbDegree}°{selectedAspect.orbMinute}' • {selectedAspect.direction}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAspect(null)}
                  className="text-theme-text-secondary hover:text-theme-text-primary transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className={`font-medium ${colors.text} mb-2`}>About {aspectType.name}s</h4>
                  <p className="text-theme-text-secondary text-sm">{aspectType.explanation}</p>
                </div>
                <div>
                  <h4 className={`font-medium ${colors.text} mb-2`}>Integration Practice</h4>
                  <p className="text-theme-text-secondary text-sm">{aspectType.integrationPractice}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4 flex-wrap items-center">
                {(() => {
                  const p1Entity = getEntity(planet1.id);
                  const p2Entity = getEntity(planet2.id);
                  const aspectEntity = getEntity(aspectType.id);
                  return (
                    <>
                      {p1Entity ? (
                        <EntityLink
                          entityId={planet1.id}
                          displayName={`View ${planet1.name}`}
                          onClick={handleEntityClick}
                        />
                      ) : (
                        <Link to={`/planets/${planet1.id}`} className="px-3 py-1.5 bg-surface-raised hover:bg-surface-interactive text-theme-text-primary text-sm rounded transition-colors">
                          View {planet1.name}
                        </Link>
                      )}
                      {p2Entity ? (
                        <EntityLink
                          entityId={planet2.id}
                          displayName={`View ${planet2.name}`}
                          onClick={handleEntityClick}
                        />
                      ) : (
                        <Link to={`/planets/${planet2.id}`} className="px-3 py-1.5 bg-surface-raised hover:bg-surface-interactive text-theme-text-primary text-sm rounded transition-colors">
                          View {planet2.name}
                        </Link>
                      )}
                      {aspectEntity ? (
                        <EntityLink
                          entityId={aspectType.id}
                          displayName={`View ${aspectType.name}`}
                          onClick={handleEntityClick}
                        />
                      ) : (
                        <Link to={`/aspects/${aspectType.id}`} className="px-3 py-1.5 bg-surface-raised hover:bg-surface-interactive text-theme-text-primary text-sm rounded transition-colors">
                          View {aspectType.name}
                        </Link>
                      )}
                    </>
                  );
                })()}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Aspect Reference */}
      <div className="mt-8">
        <h2 className="font-serif text-2xl text-theme-text-primary mb-4">Aspect Reference</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from(aspects.values()).map((aspect) => {
            const colors = aspectColors[aspect.id] || { bg: 'bg-surface-interactive', text: 'text-theme-text-primary' };
            const isMajor = MAJOR_ASPECT_IDS.includes(aspect.id);
            return (
              <Link
                key={aspect.id}
                to={`/aspects/${aspect.id}`}
                className={`${colors.bg} p-4 rounded-lg border border-theme-border-subtle hover:border-theme-border transition-colors ${
                  isMajor ? 'ring-1 ring-white/10' : ''
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-2xl ${colors.text}`}>{aspect.symbol}</span>
                  <div>
                    <h3 className="font-mediumtext-theme-text-primary">{aspect.name}</h3>
                    <p className="text-xs text-theme-text-secondary">
                      {aspect.angle}° • {aspect.nature}
                      {isMajor && <span className="ml-1 text-white/50">• Major</span>}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-theme-text-secondary">{aspect.keyword}</p>
              </Link>
            );
          })}
        </div>
      </div>
      </div>

      {/* Entity Stack — side panels for entity details */}
      <EntityStack
        entities={selectedEntities}
        onCloseEntity={handleCloseEntity}
        onEntityClick={handleEntityClick}
      />
    </motion.div>
  );
}
export default AspectWeaver;
