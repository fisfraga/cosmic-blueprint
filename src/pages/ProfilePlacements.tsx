import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProfile } from '../context';
import { signs, planets, houses, points, geneKeys, hdGates, gkLines } from '../data';
import { LoadingSkeleton, ProfileRequiredState } from '../components';

const elementColors = {
  fire: { bg: 'bg-fire-500', text: 'text-fire-400' },
  earth: { bg: 'bg-earth-500', text: 'text-earth-400' },
  air: { bg: 'bg-air-500', text: 'text-air-400' },
  water: { bg: 'bg-water-500', text: 'text-water-400' },
};

export function ProfilePlacements() {
  const { profile, isLoading, hasProfile } = useProfile();

  if (isLoading) {
    return <LoadingSkeleton variant="profile" />;
  }

  if (!hasProfile || !profile) {
    return (
      <ProfileRequiredState
        title="My Placements"
        description="Create your profile to explore all your personal placements across Astrology, Gene Keys, and Human Design."
      />
    );
  }

  const { placements } = profile;

  const getSignData = (signId: string) => signs.get(signId);
  const getPlanetData = (planetId: string) => planets.get(planetId) || points.get(planetId);
  const getHouseData = (houseId: string) => houses.get(houseId);

  // Gene Keys spheres
  const gkSpheres = [
    { key: 'lifesWork', sequence: 'Activation' },
    { key: 'evolution', sequence: 'Activation' },
    { key: 'radiance', sequence: 'Activation' },
    { key: 'purpose', sequence: 'Activation' },
    { key: 'attraction', sequence: 'Venus' },
    { key: 'iq', sequence: 'Venus' },
    { key: 'eq', sequence: 'Venus' },
    { key: 'sq', sequence: 'Venus' },
    { key: 'core', sequence: 'Venus' },
    { key: 'vocation', sequence: 'Pearl' },
    { key: 'culture', sequence: 'Pearl' },
    { key: 'brand', sequence: 'Pearl' },
    { key: 'pearl', sequence: 'Pearl' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/profile" className="text-theme-text-secondary hover:text-theme-text-primary text-sm mb-2 inline-block">
            ← Back to Overview
          </Link>
          <h1 className="font-serif text-3xl text-theme-text-primary flex items-center gap-3">
            <span className="text-purple-400">⚝</span>
            My Placements
          </h1>
          <p className="text-theme-text-secondary mt-1">
            All your personal placements across three wisdom systems
          </p>
        </div>
      </div>

      {/* Astrology Placements */}
      <div className="bg-gradient-to-br from-amber-500/5 to-amber-600/5 rounded-xl p-6 border border-amber-500/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl text-theme-text-primary flex items-center gap-2">
            <span className="text-amber-400">☉</span>
            Astrology Placements
          </h2>
          <Link
            to="/profile/astrology"
            className="text-amber-400 hover:text-amber-300 text-sm"
          >
            View Full Chart →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {placements.map((placement) => {
            const planet = getPlanetData(placement.planetId);
            const sign = getSignData(placement.signId);
            const house = getHouseData(placement.houseId);
            const signColors = elementColors[sign?.elementId as keyof typeof elementColors];

            return (
              <Link
                key={placement.id}
                to={`/profile/astrology/placements/${placement.planetId}`}
                className="flex items-center gap-3 p-3 bg-surface-base/50 rounded-lg hover:bg-surface-overlay transition-colors"
              >
                <span className="text-2xl">{planet?.symbol}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mediumtext-theme-text-primary">{planet?.name}</span>
                    <span className={`text-sm ${signColors?.text}`}>
                      {sign?.symbol} {sign?.name}
                    </span>
                  </div>
                  <p className="text-theme-text-tertiary text-xs">
                    {placement.degree}°{placement.minute}' • {house?.name}
                    {placement.retrograde && ' • ℞'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Gene Keys Placements */}
      {profile.geneKeysProfile && (
        <div className="bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 rounded-xl p-6 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-theme-text-primary flex items-center gap-2">
              <span className="text-emerald-400">✧</span>
              Gene Keys Placements
            </h2>
            <Link
              to="/profile/gene-keys"
              className="text-emerald-400 hover:text-emerald-300 text-sm"
            >
              View Full Journey →
            </Link>
          </div>

          {/* Group by sequence */}
          {['Activation', 'Venus', 'Pearl'].map((sequence) => {
            const spheresInSequence = gkSpheres.filter(s => s.sequence === sequence);
            const sequenceColors = {
              Activation: { text: 'text-emerald-300', label: '△ Activation Sequence' },
              Venus: { text: 'text-rose-300', label: '♀ Venus Sequence' },
              Pearl: { text: 'text-blue-300', label: '○ Pearl Sequence' },
            };

            return (
              <div key={sequence} className="mb-4 last:mb-0">
                <h3 className={`text-sm font-medium mb-2 ${sequenceColors[sequence as keyof typeof sequenceColors]?.text}`}>
                  {sequenceColors[sequence as keyof typeof sequenceColors]?.label}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {spheresInSequence.map(({ key }) => {
                    const sphereData = profile.geneKeysProfile?.[key as keyof typeof profile.geneKeysProfile];
                    if (!sphereData || typeof sphereData !== 'object' || !('geneKeyId' in sphereData)) return null;
                    const gk = geneKeys.get(sphereData.geneKeyId);
                    const line = gkLines.get(`gk-line-${sphereData.line}`);

                    return (
                      <Link
                        key={key}
                        to={`/profile/gene-keys/${key}`}
                        className="p-3 bg-surface-base/50 rounded-lg hover:bg-surface-overlay transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-emerald-400/80 text-xs">{sphereData.sphereName}</span>
                          <span className="text-genekey-300 font-medium text-sm">
                            {sphereData.geneKeyNumber}.{sphereData.line}
                          </span>
                        </div>
                        {gk && (
                          <>
                            <p className="text-theme-text-primary text-sm">{gk.name}</p>
                            <p className="text-theme-text-tertiary text-xs mt-1">
                              {gk.shadow?.name} → {gk.gift?.name} → {gk.siddhi?.name}
                            </p>
                          </>
                        )}
                        {line && (
                          <p className="text-theme-text-muted text-xs mt-1">
                            Line {sphereData.line}: {line.archetype}
                          </p>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Human Design Placements */}
      {profile.humanDesignProfile && (
        <div className="bg-gradient-to-br from-amber-500/5 to-orange-600/5 rounded-xl p-6 border border-amber-500/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-theme-text-primary flex items-center gap-2">
              <span className="text-amber-400">⬡</span>
              Human Design Gates
            </h2>
            <Link
              to="/profile/human-design"
              className="text-amber-400 hover:text-amber-300 text-sm"
            >
              View Full Chart →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Personality Gates */}
            <div>
              <h3 className="text-sm font-medium mb-3 text-amber-300 flex items-center gap-2">
                <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
                Personality Gates (Conscious)
              </h3>
              <div className="space-y-2">
                {profile.humanDesignProfile.personalityGates?.map((gate, index) => {
                  const gateData = hdGates.get(gate.gateId);
                  const gk = geneKeys.get(`gk-${gate.gateNumber}`);

                  return (
                    <Link
                      key={`personality-${index}`}
                      to={`/profile/human-design/gates/${gate.gateNumber}`}
                      className="block p-2 bg-surface-base/50 rounded-lg hover:bg-surface-overlay transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-theme-text-tertiary text-xs w-16">{gate.planet}</span>
                        <span className="text-amber-400 font-medium">{gate.gateNumber}.{gate.line}</span>
                        {gateData && <span className="text-theme-text-secondary text-sm">{gateData.name}</span>}
                      </div>
                      {gk && (
                        <p className="text-genekey-400 text-xs mt-1 ml-16">
                          {gk.shadow?.name} → {gk.gift?.name} → {gk.siddhi?.name}
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Design Gates */}
            <div>
              <h3 className="text-sm font-medium mb-3 text-red-300 flex items-center gap-2">
                <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                Design Gates (Unconscious)
              </h3>
              <div className="space-y-2">
                {profile.humanDesignProfile.designGates?.map((gate, index) => {
                  const gateData = hdGates.get(gate.gateId);
                  const gk = geneKeys.get(`gk-${gate.gateNumber}`);

                  return (
                    <Link
                      key={`design-${index}`}
                      to={`/profile/human-design/gates/${gate.gateNumber}`}
                      className="block p-2 bg-surface-base/50 rounded-lg hover:bg-surface-overlay transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-theme-text-tertiary text-xs w-16">{gate.planet}</span>
                        <span className="text-red-400 font-medium">{gate.gateNumber}.{gate.line}</span>
                        {gateData && <span className="text-theme-text-secondary text-sm">{gateData.name}</span>}
                      </div>
                      {gk && (
                        <p className="text-genekey-400 text-xs mt-1 ml-16">
                          {gk.shadow?.name} → {gk.gift?.name} → {gk.siddhi?.name}
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Defined Channels */}
          {profile.humanDesignProfile.definedChannelIds && profile.humanDesignProfile.definedChannelIds.length > 0 && (
            <div className="mt-6 pt-4 border-t border-theme-border-subtle/50">
              <h3 className="text-sm font-medium mb-3 text-purple-300">Defined Channels</h3>
              <div className="flex flex-wrap gap-2">
                {profile.humanDesignProfile.definedChannelIds.map((channelId) => {
                  // Extract gate numbers from channel ID (e.g., "channel-1-8" -> gates 1 and 8)
                  const match = channelId.match(/channel-(\d+)-(\d+)/);
                  if (!match) return null;
                  const [, gate1, gate2] = match;

                  return (
                    <Link
                      key={channelId}
                      to={`/profile/human-design/channels/${gate1}-${gate2}`}
                      className="px-3 py-2 bg-purple-500/10 text-purple-300 rounded-lg hover:bg-purple-500/20 transition-colors text-sm"
                    >
                      {gate1}-{gate2}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/contemplate"
          className="flex items-center gap-3 p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-theme-border-subtle transition-colors"
        >
          <span className="text-2xl">🕯</span>
          <div>
            <p className="font-mediumtext-theme-text-primary">Contemplate</p>
            <p className="text-theme-text-tertiary text-sm">Explore your placements with AI</p>
          </div>
        </Link>
        <Link
          to="/wheel"
          className="flex items-center gap-3 p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-theme-border-subtle transition-colors"
        >
          <span className="text-2xl">☉</span>
          <div>
            <p className="font-mediumtext-theme-text-primary">Celestial Wheel</p>
            <p className="text-theme-text-tertiary text-sm">See placements on the mandala</p>
          </div>
        </Link>
        <Link
          to="/graph"
          className="flex items-center gap-3 p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-theme-border-subtle transition-colors"
        >
          <span className="text-2xl">⚭</span>
          <div>
            <p className="font-mediumtext-theme-text-primary">Cosmic Graph</p>
            <p className="text-theme-text-tertiary text-sm">Explore relationships</p>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

export default ProfilePlacements;
