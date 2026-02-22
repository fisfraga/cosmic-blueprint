import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useProfile } from '../../context';
import { LoadingSkeleton, ProfileRequiredState } from '../../components';
import {
  getEntity,
  getHDPlacementByGate,
} from '../../services/entities/registry';
import type { HDPlacementEntity } from '../../types';
import { EntityStack } from '../../components/entities/EntityStack';
import type { EntityInfo } from '../../services/entities/registry';

export function ProfileHDPlacementDetail() {
  const { gateId } = useParams<{ gateId: string }>();
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
        title="Gate Detail"
        description="Create your profile to explore your Human Design gates."
      />
    );
  }

  const gateNumber = parseInt(gateId || '0');

  // Try to find personality first, then design
  let placementInfo = getHDPlacementByGate(gateNumber, 'personality');
  let isPersonality = true;
  if (!placementInfo) {
    placementInfo = getHDPlacementByGate(gateNumber, 'design');
    isPersonality = false;
  }

  if (!placementInfo) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Gate Not Found</h1>
        <p className="text-theme-text-secondary mb-4">This gate could not be found in your profile.</p>
        <Link to="/profile/human-design" className="text-amber-400 hover:underline">
          Back to Human Design Profile
        </Link>
      </div>
    );
  }

  const placement = placementInfo.data as HDPlacementEntity;
  const gate = getEntity(placement.gateId);
  const line = getEntity(placement.lineId);
  const center = getEntity(placement.centerId);
  const planet = placement.planetId ? getEntity(placement.planetId) : null;
  const geneKey = placement.geneKeyId ? getEntity(placement.geneKeyId) : null;
  const channel = placement.channelId ? getEntity(placement.channelId) : null;
  const partnerGate = placement.partnerGateId ? getEntity(placement.partnerGateId) : null;

  return (
    <div className="flex h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 min-w-0 overflow-y-auto space-y-8"
      >
        {/* Header */}
        <div>
          <Link to="/profile/human-design" className="text-theme-text-secondary hover:text-theme-text-primary text-sm mb-2 inline-block">
            ← Back to Human Design Profile
          </Link>
          <div className="flex items-center gap-4 mt-2">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
              isPersonality ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-red-500/20 border border-red-500/30'
            }`}>
              <span className={`text-3xl ${isPersonality ? 'text-amber-300' : 'text-red-300'}`}>
                {placement.gateNumber}
              </span>
            </div>
            <div>
              <h1 className="font-serif text-3xltext-theme-text-primary">{placement.displayName}</h1>
              <p className="text-theme-text-secondary mt-1">
                {(gate?.data as { name?: string })?.name || `Gate ${placement.gateNumber}`}
              </p>
            </div>
          </div>
        </div>

        {/* Consciousness Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
          placement.isPersonality
            ? 'bg-amber-500/20 text-amber-300'
            : 'bg-red-500/20 text-red-300'
        }`}>
          <span className={`w-3 h-3 rounded-full ${
            placement.isPersonality ? 'bg-amber-400' : 'bg-red-400'
          }`}></span>
          {placement.isPersonality ? 'Personality (Conscious)' : 'Design (Unconscious)'}
          {planet && <span className="text-theme-text-secondary ml-2">via {planet.name}</span>}
        </div>

        {/* Core Relationship Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Gate Card */}
          <div
            className="bg-surface-base/50 border border-theme-border-subtle rounded-xl p-5 hover:bg-surface-overlay transition-colors cursor-pointer"
            onClick={() => gate && handleEntityClick(gate)}
          >
            <p className="text-theme-text-tertiary text-xs mb-2 uppercase tracking-wider">Gate</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl text-amber-400">{placement.gateNumber}</span>
              <div>
                <p className="text-theme-text-primary font-medium">
                  {(gate?.data as { name?: string })?.name || `Gate ${placement.gateNumber}`}
                </p>
                <p className="text-theme-text-secondary text-sm">
                  {(gate?.data as { hdDefinition?: string })?.hdDefinition?.slice(0, 40)}...
                </p>
              </div>
            </div>
            {gate && (
              <Link
                to={gate.routePath || '#'}
                className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary mt-2 inline-block"
                onClick={e => e.stopPropagation()}
              >
                Full profile →
              </Link>
            )}
          </div>

          {/* Line Card */}
          <div
            className="bg-surface-base/50 border border-theme-border-subtle rounded-xl p-5 hover:bg-surface-overlay transition-colors cursor-pointer"
            onClick={() => line && handleEntityClick(line)}
          >
            <p className="text-theme-text-tertiary text-xs mb-2 uppercase tracking-wider">Line</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl text-purple-400">{placement.lineNumber}</span>
              <div>
                <p className="text-theme-text-primary font-medium">Line {placement.lineNumber}</p>
                <p className="text-theme-text-secondary text-sm">
                  {(line?.data as { archetype?: string })?.archetype}
                </p>
              </div>
            </div>
            {line && (
              <Link
                to={line.routePath || '#'}
                className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary mt-2 inline-block"
                onClick={e => e.stopPropagation()}
              >
                Full profile →
              </Link>
            )}
          </div>

          {/* Center Card */}
          <div
            className="bg-surface-base/50 border border-theme-border-subtle rounded-xl p-5 hover:bg-surface-overlay transition-colors cursor-pointer"
            onClick={() => center && handleEntityClick(center)}
          >
            <p className="text-theme-text-tertiary text-xs mb-2 uppercase tracking-wider">Center</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl text-cyan-400">⬡</span>
              <div>
                <p className="text-theme-text-primary font-medium">{center?.name}</p>
                <p className="text-theme-text-secondary text-sm">
                  {(center?.data as { centerType?: string })?.centerType}
                </p>
              </div>
            </div>
            {center && (
              <Link
                to={center.routePath || '#'}
                className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary mt-2 inline-block"
                onClick={e => e.stopPropagation()}
              >
                Full profile →
              </Link>
            )}
          </div>
        </div>

        {/* Channel Status */}
        <div className={`rounded-xl p-6 border ${
          placement.isChannelComplete
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : 'bg-surface-base/50 border-theme-border-subtle'
        }`}>
          <h2 className="font-serif text-xl text-theme-text-primary mb-4">Channel Connection</h2>
          {placement.isChannelComplete && channel ? (
            <div>
              <Link
                to={`/profile/human-design/channels/${placement.gateNumber}-${partnerGate?.id?.replace('gate-', '')}`}
                className="flex items-center gap-4 hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl text-amber-400">{placement.gateNumber}</span>
                  <span className="text-theme-text-tertiary">—</span>
                  <span className="text-2xl text-amber-400">
                    {partnerGate?.id?.replace('gate-', '')}
                  </span>
                </div>
                <div>
                  <p className="text-emerald-400 font-medium">Channel Complete</p>
                  <p className="text-theme-text-primary">{channel.name}</p>
                </div>
              </Link>
              <p className="text-theme-text-secondary text-sm mt-3">{channel.description}</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl text-amber-400">{placement.gateNumber}</span>
                  <span className="text-theme-text-tertiary">—</span>
                  <span className="text-2xl text-theme-text-muted">
                    {partnerGate?.id?.replace('gate-', '') || '?'}
                  </span>
                </div>
                <div>
                  <p className="text-theme-text-secondary">Hanging Gate</p>
                  <p className="text-theme-text-tertiary text-sm">
                    Partner gate {partnerGate?.id?.replace('gate-', '')} not activated
                  </p>
                </div>
              </div>
              <p className="text-theme-text-tertiary text-sm">
                Hanging gates seek completion through others. You may be naturally drawn to people who carry Gate {partnerGate?.id?.replace('gate-', '')}.
              </p>
              {partnerGate && (
                <Link
                  to={partnerGate.routePath || '#'}
                  className="inline-block mt-3 text-amber-400 hover:text-amber-300 text-sm"
                >
                  Learn about Gate {partnerGate.id?.replace('gate-', '')} →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Gate Details */}
        <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl text-theme-text-primary mb-4">Gate {placement.gateNumber} Overview</h2>
          <p className="text-theme-text-secondary leading-relaxed mb-4">
            {gate?.description || (gate?.data as { hdDefinition?: string })?.hdDefinition}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {planet && (
              <div className="bg-surface-overlay rounded-lg p-3">
                <p className="text-theme-text-tertiary text-xs mb-1">Activating Planet</p>
                <p className="text-theme-text-primary flex items-center gap-2">
                  <span>{planet.symbol}</span>
                  {planet.name}
                </p>
              </div>
            )}
            <div className="bg-surface-overlay rounded-lg p-3">
              <p className="text-theme-text-tertiary text-xs mb-1">Line Theme</p>
              <p className="text-theme-text-primary">
                {(line?.data as { archetype?: string })?.archetype}
              </p>
            </div>
            <div className="bg-surface-overlay rounded-lg p-3">
              <p className="text-theme-text-tertiary text-xs mb-1">Center</p>
              <p className="text-theme-text-primary">{center?.name}</p>
            </div>
          </div>
        </div>

        {/* Cross-System Connection */}
        {geneKey && (
          <div className="bg-gradient-to-br from-genekey-500/10 to-purple-500/10 rounded-xl p-6 border border-genekey-500/20">
            <h2 className="font-serif text-xl text-theme-text-primary mb-4">Gene Key Connection</h2>
            <div
              className="block bg-surface-base/50 rounded-lg p-4 hover:bg-surface-overlay transition-colors cursor-pointer"
              onClick={() => geneKey && handleEntityClick(geneKey)}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl text-genekey-400">{placement.gateNumber}</span>
                <div>
                  <p className="text-theme-text-primary font-medium">
                    Gene Key {placement.gateNumber}: {(geneKey.data as { name?: string })?.name}
                  </p>
                  <p className="text-theme-text-secondary text-sm mt-1">
                    <span className="text-red-400">
                      {(geneKey.data as { shadow?: { name: string } })?.shadow?.name}
                    </span>
                    {' → '}
                    <span className="text-emerald-400">
                      {(geneKey.data as { gift?: { name: string } })?.gift?.name}
                    </span>
                    {' → '}
                    <span className="text-purple-400">
                      {(geneKey.data as { siddhi?: { name: string } })?.siddhi?.name}
                    </span>
                  </p>
                </div>
              </div>
              <Link
                to={geneKey.routePath || '#'}
                className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary mt-2 inline-block"
                onClick={e => e.stopPropagation()}
              >
                Full profile →
              </Link>
            </div>
          </div>
        )}

        {/* Contemplation Link */}
        <div className="flex justify-center">
          <Link
            to={`/contemplate?focus=gate&gate=${placement.gateNumber}`}
            className="px-6 py-3 bg-amber-500/20 text-amber-300 rounded-lg hover:bg-amber-500/30 transition-colors"
          >
            Contemplate Gate {placement.gateNumber}
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-theme-border-subtle">
          <Link to="/profile/human-design" className="text-theme-text-secondary hover:text-theme-text-primary text-sm">
            ← All Gates
          </Link>
          <Link to={gate?.routePath || '#'} className="text-theme-text-secondary hover:text-theme-text-primary text-sm">
            Gate {placement.gateNumber} in Knowledge Base →
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

export default ProfileHDPlacementDetail;
