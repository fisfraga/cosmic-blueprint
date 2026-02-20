import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useProfile } from '../../context';
import { LoadingSkeleton, ProfileRequiredState } from '../../components';
import {
  getEntity,
  entityRegistry,
} from '../../services/entities/registry';
import type { ProfileChannelEntity, HDPlacementEntity } from '../../types';

const circuitColors: Record<string, { bg: string; text: string; border: string }> = {
  'individual-circuit': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  'tribal-circuit': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  'collective-circuit': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  'integration-circuit': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
};

export function ProfileHDChannelDetail() {
  const { channelId } = useParams<{ channelId: string }>();
  const { profile, isLoading, hasProfile } = useProfile();

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
        <p className="text-neutral-400 mb-4">This channel could not be found in your profile.</p>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <Link to="/profile/human-design" className="text-neutral-400 hover:text-white text-sm mb-2 inline-block">
          ← Back to Human Design Profile
        </Link>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <span className="text-4xl text-amber-400">{channelData.gate1Number}</span>
            <span className="text-2xl text-neutral-500">—</span>
            <span className="text-4xl text-amber-400">{channelData.gate2Number}</span>
          </div>
          <div>
            <h1 className="font-serif text-3xl text-white">{channelData.displayName}</h1>
            <p className="text-neutral-400 mt-1">{channelData.channelTheme}</p>
          </div>
        </div>
      </div>

      {/* Circuit & Type Badges */}
      <div className="flex flex-wrap gap-3">
        <div className={`${colors.bg} border ${colors.border} px-4 py-2 rounded-lg`}>
          <span className={colors.text}>{channelData.circuitType}</span>
        </div>
        <div className="bg-neutral-900/50 border border-neutral-800 px-4 py-2 rounded-lg">
          <span className="text-neutral-300">{channelData.channelType || 'Energy Channel'}</span>
        </div>
      </div>

      {/* Gate Connection Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Gate 1 */}
        <Link
          to={`/profile/human-design/gates/${channelData.gate1Number}`}
          className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl text-amber-400">{channelData.gate1Number}</span>
              <div>
                <p className="text-white font-medium">
                  {(gate1?.data as { name?: string })?.name || `Gate ${channelData.gate1Number}`}
                </p>
                <p className="text-neutral-400 text-sm">{center1?.name}</p>
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
            <div className="bg-neutral-800/50 rounded-lg p-3 text-sm">
              <p className="text-neutral-300">
                Line {gate1Data.lineNumber}
                {gate1Data.planetId && (
                  <span className="text-neutral-500 ml-2">
                    via {getEntity(gate1Data.planetId)?.name}
                  </span>
                )}
              </p>
            </div>
          )}
        </Link>

        {/* Gate 2 */}
        <Link
          to={`/profile/human-design/gates/${channelData.gate2Number}`}
          className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl text-amber-400">{channelData.gate2Number}</span>
              <div>
                <p className="text-white font-medium">
                  {(gate2?.data as { name?: string })?.name || `Gate ${channelData.gate2Number}`}
                </p>
                <p className="text-neutral-400 text-sm">{center2?.name}</p>
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
            <div className="bg-neutral-800/50 rounded-lg p-3 text-sm">
              <p className="text-neutral-300">
                Line {gate2Data.lineNumber}
                {gate2Data.planetId && (
                  <span className="text-neutral-500 ml-2">
                    via {getEntity(gate2Data.planetId)?.name}
                  </span>
                )}
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Center Connection */}
      <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h2 className="font-serif text-xl text-white mb-4">Centers Connected</h2>
        <div className="flex items-center justify-center gap-8">
          <Link
            to={center1?.routePath || '#'}
            className="text-center hover:opacity-80 transition-opacity"
          >
            <div className="w-16 h-16 bg-amber-500/20 rounded-xl flex items-center justify-center mb-2 mx-auto">
              <span className="text-2xl">⬡</span>
            </div>
            <p className="text-white">{center1?.name}</p>
          </Link>
          <div className="flex-1 h-0.5 bg-gradient-to-r from-amber-500/50 via-amber-400 to-amber-500/50 max-w-32"></div>
          <Link
            to={center2?.routePath || '#'}
            className="text-center hover:opacity-80 transition-opacity"
          >
            <div className="w-16 h-16 bg-amber-500/20 rounded-xl flex items-center justify-center mb-2 mx-auto">
              <span className="text-2xl">⬡</span>
            </div>
            <p className="text-white">{center2?.name}</p>
          </Link>
        </div>
        <p className="text-neutral-400 text-sm text-center mt-4">
          This channel creates a defined connection between these two centers, allowing consistent energy flow.
        </p>
      </div>

      {/* Channel Description */}
      <div className={`${colors.bg} border ${colors.border} rounded-xl p-6`}>
        <h2 className="font-serif text-xl text-white mb-4">Channel Meaning</h2>
        <p className="text-neutral-300 leading-relaxed">
          {universalChannel?.description ||
           `The Channel of ${channelData.channelTheme} connects the ${center1?.name} to the ${center2?.name},
           creating a consistent flow of ${channelData.circuitType} energy in your design.`}
        </p>
      </div>

      {/* Circuit Information */}
      <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h2 className="font-serif text-xl text-white mb-4">Circuit Context</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className={`font-medium ${colors.text} mb-2`}>{channelData.circuitType}</p>
            <p className="text-neutral-400 text-sm">
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
            <p className="text-neutral-400 text-sm mb-2">Stream Type</p>
            <p className="text-white">{channelData.channelType || 'Energy Flow'}</p>
          </div>
        </div>
      </div>

      {/* Gene Key Connections */}
      <div className="bg-gradient-to-br from-genekey-500/10 to-purple-500/10 rounded-xl p-6 border border-genekey-500/20">
        <h2 className="font-serif text-xl text-white mb-4">Gene Key Connections</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to={`/gene-keys/gk-${channelData.gate1Number}`}
            className="bg-neutral-900/50 rounded-lg p-4 hover:bg-neutral-800/50 transition-colors"
          >
            <p className="text-genekey-400 text-xs mb-1">Gene Key {channelData.gate1Number}</p>
            <p className="text-white font-medium">
              {(getEntity(`gk-${channelData.gate1Number}`)?.data as { name?: string })?.name || `Gene Key ${channelData.gate1Number}`}
            </p>
          </Link>
          <Link
            to={`/gene-keys/gk-${channelData.gate2Number}`}
            className="bg-neutral-900/50 rounded-lg p-4 hover:bg-neutral-800/50 transition-colors"
          >
            <p className="text-genekey-400 text-xs mb-1">Gene Key {channelData.gate2Number}</p>
            <p className="text-white font-medium">
              {(getEntity(`gk-${channelData.gate2Number}`)?.data as { name?: string })?.name || `Gene Key ${channelData.gate2Number}`}
            </p>
          </Link>
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
      <div className="flex justify-between pt-4 border-t border-neutral-800">
        <Link to="/profile/human-design" className="text-neutral-400 hover:text-white text-sm">
          ← All Channels
        </Link>
        <Link to={universalChannel?.routePath || '/human-design/channels'} className="text-neutral-400 hover:text-white text-sm">
          Channel {channelData.gate1Number}-{channelData.gate2Number} in Knowledge Base →
        </Link>
      </div>
    </motion.div>
  );
}

export default ProfileHDChannelDetail;
