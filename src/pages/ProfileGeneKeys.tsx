import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProfile } from '../context';
import { geneKeys, gkLines, codonRings, signs } from '../data';
import { LoadingSkeleton, ProfileRequiredState } from '../components';
import type { GeneKeySphere } from '../types';

function parsePlanetarySource(source: string): { isDesign: boolean; planetId: string } {
  const isDesign = /design|pre-natal/i.test(source);
  const match = source.match(/(?:Natal|Pre-Natal \/ Design|Design)\s+(.+)$/i);
  const raw = (match?.[1] ?? '').toLowerCase();
  const planetId = raw === 'north node' ? 'north-node'
    : raw === 'south node' ? 'south-node'
    : raw;
  return { isDesign, planetId };
}

export function ProfileGeneKeys() {
  const { profile, isLoading, hasProfile } = useProfile();

  // Analyze repeated Gene Keys and Lines
  const analysis = useMemo(() => {
    if (!profile?.geneKeysProfile) return null;

    const gkProfile = profile.geneKeysProfile;
    const allSpheres: { sphere: string; data: GeneKeySphere }[] = [];
    const sphereKeys = ['lifesWork', 'evolution', 'radiance', 'purpose', 'attraction', 'iq', 'eq', 'sq', 'core', 'vocation', 'culture', 'brand', 'pearl'] as const;

    sphereKeys.forEach(key => {
      const data = gkProfile[key];
      if (data && typeof data === 'object' && 'geneKeyNumber' in data) {
        allSpheres.push({ sphere: key, data: data as GeneKeySphere });
      }
    });

    // Find repeated Gene Keys
    const gkCounts: Record<number, { count: number; spheres: string[] }> = {};
    allSpheres.forEach(({ data }) => {
      if (!gkCounts[data.geneKeyNumber]) {
        gkCounts[data.geneKeyNumber] = { count: 0, spheres: [] };
      }
      gkCounts[data.geneKeyNumber].count++;
      gkCounts[data.geneKeyNumber].spheres.push(data.sphereName);
    });
    const repeatedKeys = Object.entries(gkCounts)
      .filter(([, info]) => info.count > 1)
      .map(([keyNum, info]) => ({ keyNumber: parseInt(keyNum), ...info }));

    // Find line patterns
    const lineCounts: Record<number, { count: number; spheres: string[] }> = {};
    allSpheres.forEach(({ data }) => {
      if (!lineCounts[data.line]) {
        lineCounts[data.line] = { count: 0, spheres: [] };
      }
      lineCounts[data.line].count++;
      lineCounts[data.line].spheres.push(data.sphereName);
    });

    // Get unique codon rings
    const uniqueRings = new Set<string>();
    allSpheres.forEach(({ data }) => {
      const gk = geneKeys.get(data.geneKeyId);
      if (gk?.codonRingId) {
        uniqueRings.add(gk.codonRingId);
      }
    });

    return {
      allSpheres,
      repeatedKeys,
      lineCounts,
      activeRings: Array.from(uniqueRings),
    };
  }, [profile]);

  if (isLoading) {
    return <LoadingSkeleton variant="profile" />;
  }

  if (!hasProfile || !profile) {
    return (
      <ProfileRequiredState
        title="Gene Keys Profile"
        description="Create your profile to explore your Golden Path and Gene Keys journey."
      />
    );
  }

  const gkProfile = profile.geneKeysProfile;
  if (!gkProfile) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Gene Keys Profile Not Available</h1>
        <p className="text-neutral-400 mb-4">Gene Keys data is not yet calculated for this profile.</p>
        <Link to="/profile" className="text-purple-400 hover:underline">Back to Profile</Link>
      </div>
    );
  }

  // Determine profile from Sun lines
  // Life's Work = Natal/Personality Sun, Radiance = Design Sun
  const personalitySunLine = gkProfile.lifesWork?.line || 5;
  const designSunLine = gkProfile.radiance?.line || 1;
  const hdProfile = `${personalitySunLine}/${designSunLine}`;

  const renderSphereCard = (sphereKey: string, data: GeneKeySphere | undefined, colorClass: string) => {
    if (!data) return null;
    const gk = geneKeys.get(data.geneKeyId);
    const line = gkLines.get(`gk-line-${data.line}`);

    const { isDesign, planetId } = parsePlanetarySource(data.planetarySource);
    const placement = !isDesign
      ? profile?.placements?.find(p => p.planetId === planetId)
      : undefined;
    const sign = placement ? signs.get(placement.signId) : undefined;
    const houseNum = placement ? parseInt(placement.houseId.replace('house-', ''), 10) : null;

    return (
      <Link
        to={`/profile/gene-keys/${sphereKey}`}
        className="bg-neutral-900/50 rounded-lg p-4 hover:bg-neutral-800/50 transition-colors group border border-neutral-800 hover:border-neutral-700"
      >
        <div className="flex items-center justify-between mb-2">
          <p className={`${colorClass} text-xs font-medium`}>{data.sphereName}</p>
          <div className="text-right">
            {data.planetarySource && (
              <span className="text-neutral-600 text-xs block">{data.planetarySource}</span>
            )}
            {placement && sign && houseNum && (
              <span className="text-neutral-500 text-xs block">
                {placement.degree}° {sign.symbol} · H{houseNum}
              </span>
            )}
          </div>
        </div>
        <p className="text-genekey-300 font-medium text-lg group-hover:text-genekey-200">
          Key {data.geneKeyNumber}.{data.line}
        </p>
        {gk && (
          <p className="text-white text-sm mt-1">{gk.name}</p>
        )}
        {gk && (
          <div className="mt-2 text-xs space-y-0.5">
            <p><span className="text-red-400">{gk.shadow?.name}</span></p>
            <p><span className="text-emerald-400">{gk.gift?.name}</span></p>
            <p><span className="text-purple-400">{gk.siddhi?.name}</span></p>
          </div>
        )}
        {line && (
          <p className="text-neutral-500 text-xs mt-2">
            Line {data.line}: {line.archetype}
          </p>
        )}
      </Link>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/profile" className="text-neutral-400 hover:text-white text-sm mb-2 inline-block">
            ← Back to Overview
          </Link>
          <h1 className="font-serif text-3xl text-white flex items-center gap-3">
            <span className="text-purple-400">✧</span>
            Gene Keys Profile
          </h1>
          <p className="text-neutral-400 mt-1">{profile.name}'s Golden Path Journey</p>
        </div>
        <Link
          to="/contemplate"
          className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors text-sm"
        >
          Contemplate Gene Keys
        </Link>
      </div>

      {/* Profile & Lines */}
      <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-6 border border-purple-500/20">
        <h2 className="font-serif text-xl text-white mb-4">Profile & Lines</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-neutral-900/50 rounded-lg p-4">
            <p className="text-neutral-400 text-sm mb-1">Your Profile</p>
            <p className="text-3xl font-serif text-purple-300">{hdProfile}</p>
            <p className="text-neutral-500 text-sm mt-2">
              {gkLines.get(`gk-line-${personalitySunLine}`)?.archetype || `Line ${personalitySunLine}`} / {gkLines.get(`gk-line-${designSunLine}`)?.archetype || `Line ${designSunLine}`}
            </p>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            {/* Personality Line */}
            <div className="bg-neutral-900/50 rounded-lg p-4">
              <p className="text-amber-400 text-xs mb-1">Personality (Conscious)</p>
              <p className="text-white font-medium">Line {personalitySunLine}</p>
              {gkLines.get(`gk-line-${personalitySunLine}`) && (
                <p className="text-neutral-400 text-sm mt-1">
                  {gkLines.get(`gk-line-${personalitySunLine}`)?.archetype}
                </p>
              )}
            </div>
            {/* Design Line */}
            <div className="bg-neutral-900/50 rounded-lg p-4">
              <p className="text-red-400 text-xs mb-1">Design (Unconscious)</p>
              <p className="text-white font-medium">Line {designSunLine}</p>
              {gkLines.get(`gk-line-${designSunLine}`) && (
                <p className="text-neutral-400 text-sm mt-1">
                  {gkLines.get(`gk-line-${designSunLine}`)?.archetype}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activation Sequence */}
      <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <Link to="/gene-keys/sequences" className="group inline-block mb-4">
          <h2 className="font-serif text-xl text-white flex items-center gap-2 group-hover:text-emerald-300">
            <span className="text-emerald-400">△</span>
            Activation Sequence
          </h2>
        </Link>
        <p className="text-neutral-400 text-sm mb-4">
          Your Purpose — Discovering your genius and living your highest potential in the world.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {renderSphereCard('lifesWork', gkProfile.lifesWork, 'text-emerald-400')}
          {renderSphereCard('evolution', gkProfile.evolution, 'text-emerald-400')}
          {renderSphereCard('radiance', gkProfile.radiance, 'text-emerald-400')}
          {renderSphereCard('purpose', gkProfile.purpose, 'text-emerald-400')}
        </div>
        <div className="mt-4 pt-4 border-t border-neutral-800">
          <Link
            to="/contemplate?sequence=activation"
            className="text-emerald-400 hover:text-emerald-300 text-sm"
          >
            Contemplate Activation Sequence →
          </Link>
        </div>
      </div>

      {/* Venus Sequence */}
      <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <Link to="/gene-keys/sequences" className="group inline-block mb-4">
          <h2 className="font-serif text-xl text-white flex items-center gap-2 group-hover:text-rose-300">
            <span className="text-rose-400">♀</span>
            Venus Sequence
          </h2>
        </Link>
        <p className="text-neutral-400 text-sm mb-4">
          Your Relationships — Opening your heart through emotional healing and deep intimacy.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {renderSphereCard('attraction', gkProfile.attraction, 'text-rose-400')}
          {renderSphereCard('iq', gkProfile.iq, 'text-rose-400')}
          {renderSphereCard('eq', gkProfile.eq, 'text-rose-400')}
          {renderSphereCard('sq', gkProfile.sq, 'text-rose-400')}
          {renderSphereCard('core', gkProfile.core, 'text-rose-400')}
        </div>
        <div className="mt-4 pt-4 border-t border-neutral-800">
          <Link
            to="/contemplate?sequence=venus"
            className="text-rose-400 hover:text-rose-300 text-sm"
          >
            Contemplate Venus Sequence →
          </Link>
        </div>
      </div>

      {/* Pearl Sequence */}
      <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <Link to="/gene-keys/sequences" className="group inline-block mb-4">
          <h2 className="font-serif text-xl text-white flex items-center gap-2 group-hover:text-blue-300">
            <span className="text-blue-400">○</span>
            Pearl Sequence
          </h2>
        </Link>
        <p className="text-neutral-400 text-sm mb-4">
          Your Prosperity — Unlocking your natural abundance through service and contribution.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {renderSphereCard('vocation', gkProfile.vocation, 'text-blue-400')}
          {renderSphereCard('culture', gkProfile.culture, 'text-blue-400')}
          {renderSphereCard('brand', gkProfile.brand, 'text-blue-400')}
          {renderSphereCard('pearl', gkProfile.pearl, 'text-blue-400')}
        </div>
        <div className="mt-4 pt-4 border-t border-neutral-800">
          <Link
            to="/contemplate?sequence=pearl"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Contemplate Pearl Sequence →
          </Link>
        </div>
      </div>

      {/* Core Identity Keys */}
      {gkProfile.coreIdentity && (
        <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h2 className="font-serif text-xl text-white mb-4">Core Identity Keys</h2>
          <p className="text-neutral-400 text-sm mb-4">
            Your Sun, Moon, Mercury, and Ascendant Gene Keys form the foundation of your cosmic identity.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['sun', 'moon', 'mercury', 'ascendant'] as const).map(planet => {
              const data = gkProfile.coreIdentity?.[planet];
              if (!data) return null;
              const gk = geneKeys.get(data.geneKeyId);
              return (
                <Link
                  key={planet}
                  to={`/gene-keys/${data.geneKeyId}`}
                  className="bg-neutral-800/50 rounded-lg p-4 hover:bg-neutral-700/50 transition-colors"
                >
                  <p className="text-amber-400 text-xs capitalize mb-1">{planet}</p>
                  <p className="text-genekey-300 font-medium">Key {data.geneKeyNumber}.{data.line}</p>
                  {gk && <p className="text-white text-sm mt-1">{gk.name}</p>}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Repeated Gene Keys */}
      {analysis && analysis.repeatedKeys.length > 0 && (
        <div className="bg-gradient-to-br from-genekey-500/10 to-genekey-600/5 rounded-xl p-6 border border-genekey-500/20">
          <h2 className="font-serif text-xl text-white mb-2">Repeated Gene Keys</h2>
          <p className="text-neutral-400 text-sm mb-4">
            These keys appear multiple times in your profile, indicating areas of deep significance and amplified potential.
          </p>
          <div className="space-y-4">
            {analysis.repeatedKeys.map(({ keyNumber, count, spheres }) => {
              const gk = geneKeys.get(`gene-key-${keyNumber}`);
              return gk ? (
                <Link
                  key={keyNumber}
                  to={`/gene-keys/gene-key-${keyNumber}`}
                  className="block p-4 bg-neutral-900/50 rounded-lg hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-genekey-300 font-medium text-lg">Key {keyNumber}: {gk.name}</p>
                      <p className="text-neutral-400 text-sm mt-1">
                        Appears in: {spheres.join(', ')}
                      </p>
                      <p className="text-neutral-500 text-xs mt-2">
                        <span className="text-red-400">{gk.shadow?.name}</span> → {' '}
                        <span className="text-emerald-400">{gk.gift?.name}</span> → {' '}
                        <span className="text-purple-400">{gk.siddhi?.name}</span>
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-genekey-500/20 text-genekey-300 rounded text-sm">
                      ×{count}
                    </span>
                  </div>
                </Link>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Line Distribution */}
      {analysis && (
        <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h2 className="font-serif text-xl text-white mb-4">Line Distribution</h2>
          <p className="text-neutral-400 text-sm mb-4">
            How the 6 lines are distributed across your profile spheres.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map(lineNum => {
              const lineData = gkLines.get(`gk-line-${lineNum}`);
              const info = analysis.lineCounts[lineNum] || { count: 0, spheres: [] };
              const percentage = (info.count / 13) * 100;

              return (
                <Link
                  key={lineNum}
                  to={`/gene-keys/lines`}
                  className="bg-neutral-800/50 rounded-lg p-4 hover:bg-neutral-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Line {lineNum}</span>
                    <span className="text-genekey-400 text-sm">{info.count}</span>
                  </div>
                  <div className="h-2 bg-neutral-700 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-genekey-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  {lineData && (
                    <p className="text-neutral-500 text-xs">{lineData.archetype}</p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Codon Rings */}
      {analysis && analysis.activeRings.length > 0 && (
        <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h2 className="font-serif text-xl text-white mb-4">Your Codon Rings</h2>
          <p className="text-neutral-400 text-sm mb-4">
            These chemical families are active in your profile, connecting your Gene Keys at a genetic level.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysis.activeRings.map(ringId => {
              const ring = codonRings.get(ringId);
              if (!ring) return null;
              const profileKeys = analysis.allSpheres
                .filter(s => {
                  const gk = geneKeys.get(s.data.geneKeyId);
                  return gk?.codonRingId === ringId;
                })
                .map(s => s.data.geneKeyNumber);

              return (
                <Link
                  key={ringId}
                  to={`/gene-keys/codon-rings/${ringId}`}
                  className="bg-neutral-800/50 rounded-lg p-4 hover:bg-neutral-700/50 transition-colors"
                >
                  <p className="text-genekey-300 font-medium">{ring.name}</p>
                  <p className="text-neutral-400 text-sm mt-1">{ring.theme}</p>
                  <p className="text-neutral-500 text-xs mt-2">
                    Your keys in this ring: {profileKeys.join(', ')}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link to="/gene-keys" className="p-4 bg-neutral-900/50 rounded-lg border border-neutral-800 hover:border-neutral-700 text-center">
          <span className="text-2xl block mb-1">✧</span>
          <span className="text-neutral-300 text-sm">64 Keys</span>
        </Link>
        <Link to="/gene-keys/sequences" className="p-4 bg-neutral-900/50 rounded-lg border border-neutral-800 hover:border-neutral-700 text-center">
          <span className="text-2xl block mb-1">◇</span>
          <span className="text-neutral-300 text-sm">Sequences</span>
        </Link>
        <Link to="/gene-keys/lines" className="p-4 bg-neutral-900/50 rounded-lg border border-neutral-800 hover:border-neutral-700 text-center">
          <span className="text-2xl block mb-1">---</span>
          <span className="text-neutral-300 text-sm">Lines</span>
        </Link>
        <Link to="/gene-keys/codon-rings" className="p-4 bg-neutral-900/50 rounded-lg border border-neutral-800 hover:border-neutral-700 text-center">
          <span className="text-2xl block mb-1">⬡</span>
          <span className="text-neutral-300 text-sm">Codon Rings</span>
        </Link>
      </div>
    </motion.div>
  );
}

export default ProfileGeneKeys;
