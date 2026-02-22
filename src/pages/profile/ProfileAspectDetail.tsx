import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useProfile } from '../../context';
import { LoadingSkeleton, ProfileRequiredState } from '../../components';
import {
  getEntity,
  getProfileEntity,
  getCurrentProfileId,
  entityRegistry,
} from '../../services/entities/registry';
import type { ProfileAspectEntity, AstrologyPlacementEntity } from '../../types';
import { EntityStack } from '../../components/entities/EntityStack';
import type { EntityInfo } from '../../services/entities/registry';

const aspectColors: Record<string, { bg: string; text: string; border: string }> = {
  conjunction: { bg: 'bg-white/10', text: 'text-white', border: 'border-white/20' },
  trine: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  sextile: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  square: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
  opposition: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  quincunx: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  semisextile: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  quintile: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  sesquiquadrate: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  semisquare: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
};

export function ProfileAspectDetail() {
  const { aspectId } = useParams<{ aspectId: string }>();
  const { profile, isLoading, hasProfile } = useProfile();
  const [selectedEntities, setSelectedEntities] = useState<EntityInfo[]>([]);
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

  if (isLoading) {
    return <LoadingSkeleton variant="profile" />;
  }

  if (!hasProfile || !profile) {
    return (
      <ProfileRequiredState
        title="Aspect Detail"
        description="Create your profile to explore your personal aspects."
      />
    );
  }

  // Parse aspectId format: "planet1Id-planet2Id"
  const [planet1Id, planet2Id] = (aspectId || '').split('-');
  // Use the registered profile ID to ensure consistency with entity registry
  const profileId = getCurrentProfileId() || profile.id || 'default-profile';

  // Find the matching aspect
  let aspectInfo = null;
  const allProfileEntities = entityRegistry.getAllProfileEntities();
  for (const entity of allProfileEntities) {
    if (entity.type === 'profile-aspect') {
      const data = entity.data as ProfileAspectEntity;
      if (
        (data.planet1Id === planet1Id && data.planet2Id === planet2Id) ||
        (data.planet1Id === planet2Id && data.planet2Id === planet1Id)
      ) {
        aspectInfo = entity;
        break;
      }
    }
  }

  if (!aspectInfo) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Aspect Not Found</h1>
        <p className="text-theme-text-secondary mb-4">This aspect could not be found in your profile.</p>
        <Link to="/profile/astrology" className="text-amber-400 hover:underline">
          Back to Astrology Profile
        </Link>
      </div>
    );
  }

  const aspect = aspectInfo.data as ProfileAspectEntity;
  const aspectType = getEntity(aspect.aspectId);
  const planet1 = getEntity(aspect.planet1Id);
  const planet2 = getEntity(aspect.planet2Id);

  // Get placements for both planets
  const placement1Info = getProfileEntity(`${profileId}:placement:${aspect.planet1Id}`);
  const placement2Info = getProfileEntity(`${profileId}:placement:${aspect.planet2Id}`);
  const placement1 = placement1Info?.data as AstrologyPlacementEntity | undefined;
  const placement2 = placement2Info?.data as AstrologyPlacementEntity | undefined;

  const colors = aspectColors[aspect.aspectId] || aspectColors.conjunction;

  const natureLabels: Record<string, { text: string; class: string }> = {
    harmonious: { text: 'Harmonious Flow', class: 'text-emerald-400' },
    challenging: { text: 'Dynamic Tension', class: 'text-rose-400' },
    neutral: { text: 'Fusion Point', class: 'text-amber-400' },
  };
  const natureInfo = natureLabels[aspect.nature] || natureLabels.neutral;

  return (
    <div className="flex h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 min-w-0 overflow-y-auto space-y-8"
      >
        {/* Header */}
        <div>
          <Link to="/profile/astrology" className="text-theme-text-secondary hover:text-theme-text-primary text-sm mb-2 inline-block">
            ← Back to Astrology Profile
          </Link>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-5xl">{planet1?.symbol}</span>
              <span className={`text-3xl ${colors.text}`}>{aspectType?.symbol}</span>
              <span className="text-5xl">{planet2?.symbol}</span>
            </div>
            <div>
              <h1 className="font-serif text-3xltext-theme-text-primary">{aspect.displayName}</h1>
              <p className="text-theme-text-secondary mt-1">
                Orb: {aspect.orbDegree}°{aspect.orbMinute}' • {aspect.direction}
              </p>
            </div>
          </div>
        </div>

        {/* Nature Banner */}
        <div className={`${colors.bg} border ${colors.border} rounded-xl p-4 flex items-center justify-between`}>
          <div>
            <p className={`font-medium ${colors.text}`}>{aspectType?.name}</p>
            <p className="text-theme-text-secondary text-sm">
              {(aspectType?.data as { angle?: number })?.angle}° angle
            </p>
          </div>
          <div className="text-right">
            <p className={`font-medium ${natureInfo.class}`}>{natureInfo.text}</p>
            <p className="text-theme-text-secondary text-sm">{aspect.direction}</p>
          </div>
        </div>

        {/* Planet Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Planet 1 */}
          <div
            className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle hover:border-theme-border-subtle transition-colors cursor-pointer"
            onClick={() => planet1 && handleEntityClick(planet1)}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{planet1?.symbol}</span>
              <div>
                <p className="text-theme-text-primary font-medium text-lg">{planet1?.name}</p>
                <p className="text-theme-text-secondary text-sm">
                  {(planet1?.data as { archetype?: string })?.archetype}
                </p>
              </div>
            </div>
            {placement1 && (
              <div className="bg-surface-overlay rounded-lg p-3 text-sm">
                <p className="text-theme-text-secondary">
                  {placement1.degree}°{placement1.minute}' in{' '}
                  {getEntity(placement1.signId)?.name} ({getEntity(placement1.houseId)?.name})
                </p>
              </div>
            )}
            {planet1 && (
              <Link
                to={`/profile/astrology/placements/${aspect.planet1Id}`}
                className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary mt-2 inline-block"
                onClick={e => e.stopPropagation()}
              >
                Full profile →
              </Link>
            )}
          </div>

          {/* Planet 2 */}
          <div
            className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle hover:border-theme-border-subtle transition-colors cursor-pointer"
            onClick={() => planet2 && handleEntityClick(planet2)}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{planet2?.symbol}</span>
              <div>
                <p className="text-theme-text-primary font-medium text-lg">{planet2?.name}</p>
                <p className="text-theme-text-secondary text-sm">
                  {(planet2?.data as { archetype?: string })?.archetype}
                </p>
              </div>
            </div>
            {placement2 && (
              <div className="bg-surface-overlay rounded-lg p-3 text-sm">
                <p className="text-theme-text-secondary">
                  {placement2.degree}°{placement2.minute}' in{' '}
                  {getEntity(placement2.signId)?.name} ({getEntity(placement2.houseId)?.name})
                </p>
              </div>
            )}
            {planet2 && (
              <Link
                to={`/profile/astrology/placements/${aspect.planet2Id}`}
                className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary mt-2 inline-block"
                onClick={e => e.stopPropagation()}
              >
                Full profile →
              </Link>
            )}
          </div>
        </div>

        {/* Aspect Description */}
        <div className={`${colors.bg} border ${colors.border} rounded-xl p-6`}>
          <h2 className="font-serif text-xl text-theme-text-primary mb-4">Archetypal Dynamics</h2>
          <p className="text-theme-text-secondary leading-relaxed mb-4">
            The {aspectType?.name?.toLowerCase()} between <span className="text-theme-text-primary">{planet1?.name}</span> and{' '}
            <span className="text-theme-text-primary">{planet2?.name}</span> creates a{' '}
            {aspect.nature === 'harmonious' && 'flowing, supportive connection'}
            {aspect.nature === 'challenging' && 'dynamic tension that invites growth'}
            {aspect.nature === 'neutral' && 'fusion of energies'}
            {' '}in your chart.
          </p>
          <p className="text-theme-text-secondary text-sm">
            {aspectType?.description}
          </p>
        </div>

        {/* Aspect Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-base/50 rounded-lg p-4 border border-theme-border-subtle">
            <p className="text-theme-text-tertiary text-xs mb-1">Orb</p>
            <p className="text-theme-text-primary font-medium">{aspect.orbDegree}°{aspect.orbMinute}'</p>
          </div>
          <div className="bg-surface-base/50 rounded-lg p-4 border border-theme-border-subtle">
            <p className="text-theme-text-tertiary text-xs mb-1">Direction</p>
            <p className="text-theme-text-primary font-medium">{aspect.direction}</p>
          </div>
          <div className="bg-surface-base/50 rounded-lg p-4 border border-theme-border-subtle">
            <p className="text-theme-text-tertiary text-xs mb-1">Angle</p>
            <p className="text-theme-text-primary font-medium">{(aspectType?.data as { angle?: number })?.angle}°</p>
          </div>
          <div className="bg-surface-base/50 rounded-lg p-4 border border-theme-border-subtle">
            <p className="text-theme-text-tertiary text-xs mb-1">Nature</p>
            <p className={`font-medium ${natureInfo.class}`}>{aspect.nature}</p>
          </div>
        </div>

        {/* Universal Aspect Link */}
        <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl text-theme-text-primary mb-4">Learn More</h2>
          <Link
            to={aspectType?.routePath || '#'}
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300"
          >
            <span className="text-xl">{aspectType?.symbol}</span>
            <span>Explore {aspectType?.name} in the Knowledge Base →</span>
          </Link>
        </div>

        {/* Contemplation Link */}
        <div className="flex justify-center">
          <Link
            to={`/contemplate?focus=aspect&planets=${aspect.planet1Id},${aspect.planet2Id}`}
            className="px-6 py-3 bg-amber-500/20 text-amber-300 rounded-lg hover:bg-amber-500/30 transition-colors"
          >
            Contemplate this Aspect
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-theme-border-subtle">
          <Link to="/profile/astrology" className="text-theme-text-secondary hover:text-theme-text-primary text-sm">
            ← All Aspects
          </Link>
          <Link to="/weaver" className="text-theme-text-secondary hover:text-theme-text-primary text-sm">
            Open in Aspect Weaver →
          </Link>
        </div>
      </motion.div>
      <EntityStack
        entities={selectedEntities}
        onCloseEntity={handleCloseEntity}
        onEntityClick={handleEntityClick}
      />
    </div>
  );
}

export default ProfileAspectDetail;
