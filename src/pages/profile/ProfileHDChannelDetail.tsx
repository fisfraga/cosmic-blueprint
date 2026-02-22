import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useProfile } from '../../context';
import { LoadingSkeleton, ProfileRequiredState } from '../../components';
import {
  getEntity,
  entityRegistry,
} from '../../services/entities/registry';
import type { ProfileChannelEntity, HDPlacementEntity } from '../../types';
import { EntityStack } from '../../components/entities/EntityStack';
import type { EntityInfo } from '../../services/entities/registry';

const circuitColors: Record<string, { bg: string; text: string; border: string }> = {
  'individual-circuit': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  'tribal-circuit': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  'collective-circuit': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  'integration-circuit': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
};

export function ProfileHDChannelDetail() {
  const { channelId } = useParams<{ channelId: string }>();
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
        title="Channel Detail"
        description="Create your profile to explore your Human Design channels."
      />
    );
  }

  // Find the channel in profile entities
  let channelInfo = null;
  const allProfileEntities = entityRegistry.getAllProfileEntities();
  for (const entity of allProfileEntities) {
    if (entity.type === 'profile-channel') {
      if (entity.id.includes(channelId || '')) {
        channelInfo = entity;
        break;
      }
    }
  }

  if (!channelInfo) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Channel Not Found</h1>
        <p className="text-theme-text-secondary mb-4">This channel could not be found in your profile.</p>
        <Link to="/profile/human-design" className="text-amber-400 hover:underline">
          Back to Human Design Profile
        </Link>
      </div>
    );
  }

  const channelData = channelInfo.data as ProfileChannelEntity;
  const universalChannel = getEntity(channelData.channelId);
  const gate1 = getEntity(`gate-${channelData.gate1Number}`);
  const gate2 = getEntity(`gate-${channelData.gate2Number}`);
  const center1 = getEntity(channelData.center1Id);
  const center2 = getEntity(channelData.center2Id);

  // Get gate placements
  const gate1Placement = entityRegistry.getProfileEntity(channelData.gate1PlacementId);
  const gate2Placement = entityRegistry.getProfileEntity(channelData.gate2PlacementId);
  const gate1Data = gate1Placement?.data as HDPlacementEntity | undefined;
  const gate2Data = gate2Placement?.data as HDPlacementEntity | undefined;

  const circuitType = channelData.circuitType.toLowerCase().replace(' ', '-') + '-circuit';
  const colors = circuitColors[circuitType] || circuitColors['individual-circuit'];

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
            <div className="flex items-center gap-2">
              <span className="text-4xl text-amber-400">{channelData.gate1Number}</span>
              <span className="text-2xl text-theme-text-tertiary">—</span>
              <span className="text-4xl text-amber-400">{channelData.gate2Number}</span>
            </div>
            <div>
              <h1 className="font-serif text-3xltext-theme-text-primary">{channelData.displayName}</h1>
              <p className="text-theme-text-secondary mt-1">{channelData.channelTheme}</p>
            </div>
          </div>
        </div>

        {/* Circuit & Type Badges */}
        <div className="flex flex-wrap gap-3">
          <div className={`${colors.bg} border ${colors.border} px-4 py-2 rounded-lg`}>
            <span className={colors.text}>{channelData.circuitType}</span>
          </div>
          <div className="bg-surface-base/50 border border-theme-border-subtle px-4 py-2 rounded-lg">
            <span className="text-theme-text-secondary">{channelData.channelType || 'Energy Channel'}</span>
          </div>
        </div>

        {/* Gate Connection Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Gate 1 */}
          <div
            className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle hover:border-theme-border-subtle transition-colors cursor-pointer"
            onClick={() => gate1 && handleEntityClick(gate1)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl text-amber-400">{channelData.gate1Number}</span>
                <div>
                  <p className="text-theme-text-primary font-medium">
                    {(gate1?.data as { name?: string })?.name || `Gate ${channelData.gate1Number}`}
                  </p>
                  <p className="text-theme-text-secondary text-sm">{center1?.name}</p>
                </div>
              </div>
              {gate1Data && (
                <div className={`px-2 py-1 rounded text-xs ${
                  gate1Data.isPersonality
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {gate1Data.isPersonality ? 'Personality' : 'Design'}
                </div>
              )}
            </div>
            {gate1Data && (
              <div className="bg-surface-overlay rounded-lg p-3 text-sm">
                <p className="text-theme-text-secondary">
                  Line {gate1Data.lineNumber}
                  {gate1Data.planetId && (
                    <span className="text-theme-text-tertiary ml-2">
                      via {getEntity(gate1Data.planetId)?.name}
                    </span>
                  )}
                </p>
              </div>
            )}
            {gate1 && (
              <Link
                to={`/profile/human-design/gates/${channelData.gate1Number}`}
                className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary mt-2 inline-block"
                onClick={e => e.stopPropagation()}
              >
                Full profile →
              </Link>
            )}
          </div>

          {/* Gate 2 */}
          <div
            className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle hover:border-theme-border-subtle transition-colors cursor-pointer"
            onClick={() => gate2 && handleEntityClick(gate2)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl text-amber-400">{channelData.gate2Number}</span>
                <div>
                  <p className="text-theme-text-primary font-medium">
                    {(gate2?.data as { name?: string })?.name || `Gate ${channelData.gate2Number}`}
                  </p>
                  <p className="text-theme-text-secondary text-sm">{center2?.name}</p>
                </div>
              </div>
              {gate2Data && (
                <div className={`px-2 py-1 rounded text-xs ${
                  gate2Data.isPersonality
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {gate2Data.isPersonality ? 'Personality' : 'Design'}
                </div>
              )}
            </div>
            {gate2Data && (
              <div className="bg-surface-overlay rounded-lg p-3 text-sm">
                <p className="text-theme-text-secondary">
                  Line {gate2Data.lineNumber}
                  {gate2Data.planetId && (
                    <span className="text-theme-text-tertiary ml-2">
                      via {getEntity(gate2Data.planetId)?.name}
                    </span>
                  )}
                </p>
              </div>
            )}
            {gate2 && (
              <Link
                to={`/profile/human-design/gates/${channelData.gate2Number}`}
                className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary mt-2 inline-block"
                onClick={e => e.stopPropagation()}
              >
                Full profile →
              </Link>
            )}
          </div>
        </div>

        {/* Center Connection */}
        <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl text-theme-text-primary mb-4">Centers Connected</h2>
          <div className="flex items-center justify-center gap-8">
            <div
              className="text-center hover:opacity-80 transition-opacity cursor-pointer"
              onClick={() => center1 && handleEntityClick(center1)}
            >
              <div className="w-16 h-16 bg-amber-500/20 rounded-xl flex items-center justify-center mb-2 mx-auto">
                <span className="text-2xl">⬡</span>
              </div>
              <p className="text-theme-text-primary">{center1?.name}</p>
              {center1 && (
                <Link
                  to={center1.routePath || '#'}
                  className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary mt-1 inline-block"
                  onClick={e => e.stopPropagation()}
                >
                  Full profile →
                </Link>
              )}
            </div>
            <div className="flex-1 h-0.5 bg-gradient-to-r from-amber-500/50 via-amber-400 to-amber-500/50 max-w-32"></div>
            <div
              className="text-center hover:opacity-80 transition-opacity cursor-pointer"
              onClick={() => center2 && handleEntityClick(center2)}
            >
              <div className="w-16 h-16 bg-amber-500/20 rounded-xl flex items-center justify-center mb-2 mx-auto">
                <span className="text-2xl">⬡</span>
              </div>
              <p className="text-theme-text-primary">{center2?.name}</p>
              {center2 && (
                <Link
                  to={center2.routePath || '#'}
                  className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary mt-1 inline-block"
                  onClick={e => e.stopPropagation()}
                >
                  Full profile →
                </Link>
              )}
            </div>
          </div>
          <p className="text-theme-text-secondary text-sm text-center mt-4">
            This channel creates a defined connection between these two centers, allowing consistent energy flow.
          </p>
        </div>

        {/* Channel Description */}
        <div className={`${colors.bg} border ${colors.border} rounded-xl p-6`}>
          <h2 className="font-serif text-xl text-theme-text-primary mb-4">Channel Meaning</h2>
          <p className="text-theme-text-secondary leading-relaxed">
            {universalChannel?.description ||
             `The Channel of ${channelData.channelTheme} connects the ${center1?.name} to the ${center2?.name},
             creating a consistent flow of ${channelData.circuitType} energy in your design.`}
          </p>
        </div>

        {/* Circuit Information */}
        <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl text-theme-text-primary mb-4">Circuit Context</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className={`font-medium ${colors.text} mb-2`}>{channelData.circuitType}</p>
              <p className="text-theme-text-secondary text-sm">
                {channelData.circuitType.includes('Individual') &&
                  'Individual circuitry carries mutative energy — unique expressions that can transform the collective.'}
                {channelData.circuitType.includes('Tribal') &&
                  'Tribal circuitry is about support, resources, and the bonds of family and community.'}
                {channelData.circuitType.includes('Collective') &&
                  'Collective circuitry processes experiences for the benefit of humanity through sharing and logic.'}
                {channelData.circuitType.includes('Integration') &&
                  'Integration channels are about self-empowerment and personal survival.'}
              </p>
            </div>
            <div>
              <p className="text-theme-text-secondary text-sm mb-2">Stream Type</p>
              <p className="text-theme-text-primary">{channelData.channelType || 'Energy Flow'}</p>
            </div>
          </div>
        </div>

        {/* Gene Key Connections */}
        <div className="bg-gradient-to-br from-genekey-500/10 to-purple-500/10 rounded-xl p-6 border border-genekey-500/20">
          <h2 className="font-serif text-xl text-theme-text-primary mb-4">Gene Key Connections</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {(() => {
              const gk1 = getEntity(`gk-${channelData.gate1Number}`);
              return (
                <div
                  className="bg-surface-base/50 rounded-lg p-4 hover:bg-surface-overlay transition-colors cursor-pointer"
                  onClick={() => gk1 && handleEntityClick(gk1)}
                >
                  <p className="text-genekey-400 text-xs mb-1">Gene Key {channelData.gate1Number}</p>
                  <p className="text-theme-text-primary font-medium">
                    {(gk1?.data as { name?: string })?.name || `Gene Key ${channelData.gate1Number}`}
                  </p>
                  {gk1 && (
                    <Link
                      to={`/gene-keys/gk-${channelData.gate1Number}`}
                      className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary mt-2 inline-block"
                      onClick={e => e.stopPropagation()}
                    >
                      Full profile →
                    </Link>
                  )}
                </div>
              );
            })()}
            {(() => {
              const gk2 = getEntity(`gk-${channelData.gate2Number}`);
              return (
                <div
                  className="bg-surface-base/50 rounded-lg p-4 hover:bg-surface-overlay transition-colors cursor-pointer"
                  onClick={() => gk2 && handleEntityClick(gk2)}
                >
                  <p className="text-genekey-400 text-xs mb-1">Gene Key {channelData.gate2Number}</p>
                  <p className="text-theme-text-primary font-medium">
                    {(gk2?.data as { name?: string })?.name || `Gene Key ${channelData.gate2Number}`}
                  </p>
                  {gk2 && (
                    <Link
                      to={`/gene-keys/gk-${channelData.gate2Number}`}
                      className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary mt-2 inline-block"
                      onClick={e => e.stopPropagation()}
                    >
                      Full profile →
                    </Link>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Contemplation Link */}
        <div className="flex justify-center">
          <Link
            to={`/contemplate?focus=channel&gates=${channelData.gate1Number},${channelData.gate2Number}`}
            className="px-6 py-3 bg-amber-500/20 text-amber-300 rounded-lg hover:bg-amber-500/30 transition-colors"
          >
            Contemplate this Channel
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-theme-border-subtle">
          <Link to="/profile/human-design" className="text-theme-text-secondary hover:text-theme-text-primary text-sm">
            ← All Channels
          </Link>
          <Link to={universalChannel?.routePath || '/human-design/channels'} className="text-theme-text-secondary hover:text-theme-text-primary text-sm">
            Channel {channelData.gate1Number}-{channelData.gate2Number} in Knowledge Base →
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

export default ProfileHDChannelDetail;
