import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useProfile } from '../../context';
import { LoadingSkeleton, ProfileRequiredState } from '../../components';
import {
  getEntity,
  getGKPlacementBySphere,
} from '../../services/entities/registry';
import type { GeneKeysPlacementEntity } from '../../types';

const sequenceColors: Record<string, { bg: string; text: string; border: string }> = {
  'activation-sequence': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  'venus-sequence': { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
  'pearl-sequence': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
};

export function ProfileGKPlacementDetail() {
  const { sphereId } = useParams<{ sphereId: string }>();
  const { profile, isLoading, hasProfile } = useProfile();

  if (isLoading) {
    return <LoadingSkeleton variant="profile" />;
  }

  if (!hasProfile || !profile) {
    return (
      <ProfileRequiredState
        title="Gene Key Sphere Detail"
        description="Create your profile to explore your Gene Keys placements."
      />
    );
  }

  const placementInfo = getGKPlacementBySphere(sphereId || '');

  if (!placementInfo) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Sphere Not Found</h1>
        <p className="text-neutral-400 mb-4">This Gene Key sphere could not be found in your profile.</p>
        <Link to="/profile/gene-keys" className="text-purple-400 hover:underline">
          Back to Gene Keys Profile
        </Link>
      </div>
    );
  }

  const placement = placementInfo.data as GeneKeysPlacementEntity;
  const geneKey = getEntity(placement.geneKeyId);
  const line = getEntity(placement.lineId);
  const sequence = getEntity(placement.sequenceId);
  const sphere = getEntity(placement.sphereId);

  const colors = sequenceColors[placement.sequenceId] || sequenceColors['activation-sequence'];

  // Frequency spectrum stages
  const frequencyStages = [
    { name: 'Shadow', data: placement.shadow, color: 'text-red-400', bg: 'bg-red-500/10' },
    { name: 'Gift', data: placement.gift, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { name: 'Siddhi', data: placement.siddhi, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <Link to="/profile/gene-keys" className="text-neutral-400 hover:text-white text-sm mb-2 inline-block">
          ← Back to Gene Keys Profile
        </Link>
        <div className="flex items-center gap-4 mt-2">
          <div className={`w-16 h-16 ${colors.bg} border ${colors.border} rounded-xl flex items-center justify-center`}>
            <span className="text-3xl text-genekey-300">{placement.geneKeyNumber}</span>
          </div>
          <div>
            <h1 className="font-serif text-3xl text-white">{placement.sphereName}</h1>
            <p className="text-neutral-400 mt-1">
              Gene Key {placement.geneKeyNumber}.{placement.lineNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Sequence Context */}
      <div className={`${colors.bg} border ${colors.border} rounded-xl p-4`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`font-medium ${colors.text}`}>{sequence?.name || 'Unknown Sequence'}</p>
            <p className="text-neutral-400 text-sm mt-1">
              {sequence?.description?.slice(0, 100)}...
            </p>
          </div>
          <Link
            to={sequence?.routePath || '/gene-keys/sequences'}
            className={`${colors.text} hover:opacity-80 text-sm`}
          >
            View Sequence →
          </Link>
        </div>
      </div>

      {/* Core Relationship Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gene Key Card */}
        <Link
          to={geneKey?.routePath || '#'}
          className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 hover:bg-neutral-800/50 transition-colors"
        >
          <p className="text-neutral-500 text-xs mb-2 uppercase tracking-wider">Gene Key</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl text-genekey-400">{placement.geneKeyNumber}</span>
            <div>
              <p className="text-white font-medium">
                {(geneKey?.data as { name?: string })?.name || `Gene Key ${placement.geneKeyNumber}`}
              </p>
              <p className="text-neutral-400 text-sm">
                {placement.shadow.name} → {placement.gift.name}
              </p>
            </div>
          </div>
        </Link>

        {/* Line Card */}
        <Link
          to={line?.routePath || '#'}
          className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 hover:bg-neutral-800/50 transition-colors"
        >
          <p className="text-neutral-500 text-xs mb-2 uppercase tracking-wider">Line</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl text-amber-400">{placement.lineNumber}</span>
            <div>
              <p className="text-white font-medium">Line {placement.lineNumber}</p>
              <p className="text-neutral-400 text-sm">
                {(line?.data as { archetype?: string })?.archetype}
              </p>
            </div>
          </div>
        </Link>

        {/* Sphere Card */}
        <Link
          to={sphere?.routePath || '#'}
          className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 hover:bg-neutral-800/50 transition-colors"
        >
          <p className="text-neutral-500 text-xs mb-2 uppercase tracking-wider">Sphere</p>
          <div className="flex items-center gap-3">
            <span className={`text-3xl ${colors.text}`}>◇</span>
            <div>
              <p className="text-white font-medium">{placement.sphereName}</p>
              <p className="text-neutral-400 text-sm">
                {(sphere?.data as { lifeArea?: string })?.lifeArea}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Planetary Source */}
      <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h2 className="font-serif text-xl text-white mb-4">Planetary Source</h2>
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-full text-sm ${
            placement.isPersonality
              ? 'bg-amber-500/20 text-amber-300'
              : 'bg-red-500/20 text-red-300'
          }`}>
            {placement.isPersonality ? 'Personality (Conscious)' : 'Design (Unconscious)'}
          </div>
          <p className="text-neutral-300">{placement.planetarySource}</p>
        </div>
        {placement.sourcePlanetId && (
          <Link
            to={`/profile/astrology/placements/${placement.sourcePlanetId}`}
            className="inline-block mt-3 text-amber-400 hover:text-amber-300 text-sm"
          >
            View {placement.planetarySource} Placement →
          </Link>
        )}
      </div>

      {/* Frequency Spectrum */}
      <div className="bg-gradient-to-br from-genekey-500/10 to-genekey-600/5 rounded-xl p-6 border border-genekey-500/20">
        <h2 className="font-serif text-xl text-white mb-6">Frequency Spectrum</h2>
        <div className="space-y-4">
          {frequencyStages.map((stage) => (
            <div key={stage.name} className={`${stage.bg} rounded-lg p-4`}>
              <div className="flex items-center gap-3 mb-2">
                <span className={`font-medium ${stage.color}`}>{stage.name}</span>
                <span className="text-white">{stage.data.name}</span>
              </div>
              <p className="text-neutral-400 text-sm">
                {stage.data.description || 'Explore this frequency through contemplation.'}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-genekey-500/20 text-center">
          <p className="text-neutral-500 text-sm">
            The journey from Shadow to Gift to Siddhi represents your evolutionary path.
          </p>
        </div>
      </div>

      {/* Line Theme */}
      <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h2 className="font-serif text-xl text-white mb-4">Line {placement.lineNumber} Theme</h2>
        <div className="mb-4">
          <p className="text-amber-300 font-medium mb-2">
            {(line?.data as { archetype?: string })?.archetype}
          </p>
          <p className="text-neutral-300 leading-relaxed">
            {line?.description || 'This line brings a unique nuance to how the Gene Key expresses in this sphere of your life.'}
          </p>
        </div>
        <Link
          to={line?.routePath || '/gene-keys/lines'}
          className="text-genekey-400 hover:text-genekey-300 text-sm"
        >
          Learn more about Line {placement.lineNumber} →
        </Link>
      </div>

      {/* Cross-System Connection */}
      <div className="bg-gradient-to-br from-amber-500/10 to-purple-500/10 rounded-xl p-6 border border-amber-500/20">
        <h2 className="font-serif text-xl text-white mb-4">Cross-System Connection</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to={`/human-design/gate-${placement.geneKeyNumber}`}
            className="bg-neutral-900/50 rounded-lg p-4 hover:bg-neutral-800/50 transition-colors"
          >
            <p className="text-amber-400 text-xs mb-1">Human Design Gate</p>
            <p className="text-white font-medium">Gate {placement.geneKeyNumber}</p>
            <p className="text-neutral-400 text-xs mt-1">Same archetypal energy in HD system</p>
          </Link>
          <Link
            to={geneKey?.routePath || '#'}
            className="bg-neutral-900/50 rounded-lg p-4 hover:bg-neutral-800/50 transition-colors"
          >
            <p className="text-genekey-400 text-xs mb-1">Gene Key</p>
            <p className="text-white font-medium">
              {(geneKey?.data as { name?: string })?.name}
            </p>
            <p className="text-neutral-400 text-xs mt-1">Full Gene Key exploration</p>
          </Link>
        </div>
      </div>

      {/* Contemplation Actions */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to={`/contemplate?focus=shadow&gk=${placement.geneKeyNumber}`}
          className="px-5 py-2.5 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          Shadow Work
        </Link>
        <Link
          to={`/contemplate?focus=gift&gk=${placement.geneKeyNumber}`}
          className="px-5 py-2.5 bg-emerald-500/20 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-colors"
        >
          Gift Activation
        </Link>
        <Link
          to={`/contemplate?focus=siddhi&gk=${placement.geneKeyNumber}`}
          className="px-5 py-2.5 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
        >
          Siddhi Meditation
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-neutral-800">
        <Link to="/profile/gene-keys" className="text-neutral-400 hover:text-white text-sm">
          ← All Spheres
        </Link>
        <Link to={geneKey?.routePath || '#'} className="text-neutral-400 hover:text-white text-sm">
          Gene Key {placement.geneKeyNumber} →
        </Link>
      </div>
    </motion.div>
  );
}

export default ProfileGKPlacementDetail;
