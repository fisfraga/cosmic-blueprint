import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useProfile } from '../../context';
import { LoadingSkeleton, ProfileRequiredState } from '../../components';
import {
  getEntity,
  getProfileEntity,
  getProfileAspects,
  getCurrentProfileId,
} from '../../services/entities/registry';
import type { AstrologyPlacementEntity, ProfileAspectEntity } from '../../types';

const elementColors: Record<string, { bg: string; text: string; border: string }> = {
  fire: { bg: 'bg-fire-500/10', text: 'text-fire-400', border: 'border-fire-500/30' },
  earth: { bg: 'bg-earth-500/10', text: 'text-earth-400', border: 'border-earth-500/30' },
  air: { bg: 'bg-air-500/10', text: 'text-air-400', border: 'border-air-500/30' },
  water: { bg: 'bg-water-500/10', text: 'text-water-400', border: 'border-water-500/30' },
};

export function ProfilePlacementDetail() {
  const { planetId } = useParams<{ planetId: string }>();
  const { profile, isLoading, hasProfile } = useProfile();

  if (isLoading) {
    return <LoadingSkeleton variant="profile" />;
  }

  if (!hasProfile || !profile) {
    return (
      <ProfileRequiredState
        title="Placement Detail"
        description="Create your profile to explore your personal placements."
      />
    );
  }

  // Use the registered profile ID to ensure consistency with entity registry
  const profileId = getCurrentProfileId() || profile.id || 'default-profile';
  const placementEntityId = `${profileId}:placement:${planetId}`;
  const placementInfo = getProfileEntity(placementEntityId);

  if (!placementInfo) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Placement Not Found</h1>
        <p className="text-neutral-400 mb-4">This placement could not be found in your profile.</p>
        <Link to="/profile/astrology" className="text-amber-400 hover:underline">
          Back to Astrology Profile
        </Link>
      </div>
    );
  }

  const placement = placementInfo.data as AstrologyPlacementEntity;
  const planet = getEntity(placement.planetId);
  const sign = getEntity(placement.signId);
  const house = getEntity(placement.houseId);
  const dignity = placement.dignityId ? getEntity(placement.dignityId) : null;
  const decan = placement.decanId ? getEntity(placement.decanId) : null;

  // Get sign's element for theming
  const signData = sign?.data as { elementId?: string } | undefined;
  const elementId = signData?.elementId || 'fire';
  const colors = elementColors[elementId] || elementColors.fire;

  // Get aspects involving this planet
  const allAspects = getProfileAspects();
  const aspectsInvolving = allAspects.filter((a) => {
    const aspectData = a.data as ProfileAspectEntity;
    return aspectData.planet1Id === planetId || aspectData.planet2Id === planetId;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <Link to="/profile/astrology" className="text-neutral-400 hover:text-white text-sm mb-2 inline-block">
          ← Back to Astrology Profile
        </Link>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-5xl">{planet?.symbol}</span>
          <div>
            <h1 className="font-serif text-3xl text-white">{placement.displayName}</h1>
            <p className="text-neutral-400 mt-1">
              {placement.degree}°{placement.minute}' {sign?.name}
              {placement.retrograde && <span className="text-amber-400 ml-2">℞ Retrograde</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Core Relationship Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Planet Card */}
        <Link
          to={planet?.routePath || '#'}
          className={`${colors.bg} border ${colors.border} rounded-xl p-5 hover:bg-neutral-800/50 transition-colors`}
        >
          <p className="text-neutral-500 text-xs mb-2 uppercase tracking-wider">Planet</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{planet?.symbol}</span>
            <div>
              <p className="text-white font-medium">{planet?.name}</p>
              <p className="text-neutral-400 text-sm">
                {(planet?.data as { archetype?: string })?.archetype}
              </p>
            </div>
          </div>
        </Link>

        {/* Sign Card */}
        <Link
          to={sign?.routePath || '#'}
          className={`${colors.bg} border ${colors.border} rounded-xl p-5 hover:bg-neutral-800/50 transition-colors`}
        >
          <p className="text-neutral-500 text-xs mb-2 uppercase tracking-wider">Sign</p>
          <div className="flex items-center gap-3">
            <span className={`text-3xl ${colors.text}`}>{sign?.symbol}</span>
            <div>
              <p className="text-white font-medium">{sign?.name}</p>
              <p className="text-neutral-400 text-sm capitalize">{elementId} Sign</p>
            </div>
          </div>
        </Link>

        {/* House Card */}
        <Link
          to={house?.routePath || '#'}
          className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 hover:bg-neutral-800/50 transition-colors"
        >
          <p className="text-neutral-500 text-xs mb-2 uppercase tracking-wider">House</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl text-amber-400">{house?.symbol}</span>
            <div>
              <p className="text-white font-medium">{house?.name}</p>
              <p className="text-neutral-400 text-sm">
                {(house?.data as { houseType?: string })?.houseType}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Additional Details Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Degree */}
        <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
          <p className="text-neutral-500 text-xs mb-1">Position</p>
          <p className="text-white font-medium">{placement.degree}°{placement.minute}'</p>
          <p className="text-neutral-400 text-xs mt-1">{sign?.name}</p>
        </div>

        {/* Dignity */}
        <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
          <p className="text-neutral-500 text-xs mb-1">Dignity</p>
          {dignity ? (
            <>
              <p className={`font-medium ${
                ['domicile', 'exaltation'].includes(placement.dignityId || '')
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }`}>
                {(dignity.data as { dignityType?: string })?.dignityType}
              </p>
              <p className="text-neutral-400 text-xs mt-1">Essential Dignity</p>
            </>
          ) : (
            <p className="text-neutral-600">Peregrine</p>
          )}
        </div>

        {/* Decan */}
        <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
          <p className="text-neutral-500 text-xs mb-1">Decan</p>
          {decan ? (
            <p className="text-white font-medium">{decan.name}</p>
          ) : (
            <p className="text-neutral-600">—</p>
          )}
        </div>

        {/* Chart Ruler */}
        <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
          <p className="text-neutral-500 text-xs mb-1">Chart Status</p>
          {placement.isChartRuler ? (
            <p className="text-yellow-400 font-medium">
              Chart Ruler ({placement.isChartRuler})
            </p>
          ) : (
            <p className="text-neutral-600">—</p>
          )}
        </div>
      </div>

      {/* Archetypal Expression */}
      <div className={`${colors.bg} border ${colors.border} rounded-xl p-6`}>
        <h2 className="font-serif text-xl text-white mb-4">Archetypal Expression</h2>
        <p className="text-neutral-300 leading-relaxed">
          <span className="text-white font-medium">{planet?.name}</span> represents{' '}
          {(planet?.data as { functionAndMeaning?: string })?.functionAndMeaning?.split('.')[0] || 'a core archetype'}.
          In <span className={colors.text}>{sign?.name}</span>, this energy expresses through{' '}
          {signData?.elementId} qualities, finding its arena of expression in the{' '}
          <span className="text-amber-300">{house?.name}</span> — the realm of{' '}
          {(house?.data as { lifeAreaFocus?: string[] })?.lifeAreaFocus?.join(', ') || 'specific life areas'}.
        </p>
      </div>

      {/* Cross-System Connections */}
      {(placement.geneKeyNumber || placement.hdGateNumber) && (
        <div className="bg-gradient-to-br from-purple-500/10 to-amber-500/10 rounded-xl p-6 border border-purple-500/20">
          <h2 className="font-serif text-xl text-white mb-4">Cross-System Connections</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {placement.geneKeyNumber && (
              <Link
                to={`/gene-keys/gk-${placement.geneKeyNumber}`}
                className="bg-neutral-900/50 rounded-lg p-4 hover:bg-neutral-800/50 transition-colors"
              >
                <p className="text-genekey-400 text-xs mb-1">Gene Key</p>
                <p className="text-white font-medium">Gene Key {placement.geneKeyNumber}</p>
                <p className="text-neutral-400 text-xs mt-1">Same zodiacal degree</p>
              </Link>
            )}
            {placement.hdGateNumber && (
              <Link
                to={`/human-design/gate-${placement.hdGateNumber}`}
                className="bg-neutral-900/50 rounded-lg p-4 hover:bg-neutral-800/50 transition-colors"
              >
                <p className="text-amber-400 text-xs mb-1">Human Design Gate</p>
                <p className="text-white font-medium">Gate {placement.hdGateNumber}</p>
                <p className="text-neutral-400 text-xs mt-1">Same zodiacal degree</p>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Aspects Involving This Planet */}
      {aspectsInvolving.length > 0 && (
        <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h2 className="font-serif text-xl text-white mb-4">
            Aspects ({aspectsInvolving.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {aspectsInvolving.map((aspectInfo) => {
              const aspectData = aspectInfo.data as ProfileAspectEntity;
              const aspectType = getEntity(aspectData.aspectId);
              const otherPlanetId = aspectData.planet1Id === planetId
                ? aspectData.planet2Id
                : aspectData.planet1Id;
              const otherPlanet = getEntity(otherPlanetId);

              const aspectColors: Record<string, string> = {
                conjunction: 'bg-white/10 text-white',
                trine: 'bg-blue-500/10 text-blue-400',
                sextile: 'bg-emerald-500/10 text-emerald-400',
                square: 'bg-rose-500/10 text-rose-400',
                opposition: 'bg-purple-500/10 text-purple-400',
                quincunx: 'bg-amber-500/10 text-amber-400',
              };
              const colorClass = aspectColors[aspectData.aspectId] || 'bg-neutral-800 text-neutral-300';

              return (
                <Link
                  key={aspectInfo.id}
                  to={`/profile/astrology/aspects/${aspectData.planet1Id}-${aspectData.planet2Id}`}
                  className={`p-3 ${colorClass} rounded-lg hover:opacity-80 transition-opacity`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{planet?.symbol}</span>
                    <span className="text-sm">{aspectType?.symbol}</span>
                    <span className="text-lg">{otherPlanet?.symbol}</span>
                  </div>
                  <p className="text-neutral-400 text-xs mt-1">
                    {aspectType?.name} {otherPlanet?.name} ({aspectData.orbDegree}°{aspectData.orbMinute}')
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Contemplation Link */}
      <div className="flex justify-center">
        <Link
          to={`/contemplate?focus=placement&planet=${planetId}`}
          className="px-6 py-3 bg-amber-500/20 text-amber-300 rounded-lg hover:bg-amber-500/30 transition-colors"
        >
          Contemplate this Placement
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex justify-between pt-4 border-t border-neutral-800">
        <Link to="/profile/astrology" className="text-neutral-400 hover:text-white text-sm">
          ← All Placements
        </Link>
        <Link to={planet?.routePath || '#'} className="text-neutral-400 hover:text-white text-sm">
          {planet?.name} in Astrology →
        </Link>
      </div>
    </motion.div>
  );
}

export default ProfilePlacementDetail;
