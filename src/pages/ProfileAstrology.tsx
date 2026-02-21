import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProfile } from '../context';
import { signs, planets, houses, aspects, points, dignities, geneKeys, chakras, getGateByDegree, signPositionToAbsoluteDegree } from '../data';
import { LoadingSkeleton, ProfileRequiredState } from '../components';

const elementColors = {
  fire: { bg: 'bg-fire-500', text: 'text-fire-400', bar: 'bg-fire-500' },
  earth: { bg: 'bg-earth-500', text: 'text-earth-400', bar: 'bg-earth-500' },
  air: { bg: 'bg-air-500', text: 'text-air-400', bar: 'bg-air-500' },
  water: { bg: 'bg-water-500', text: 'text-water-400', bar: 'bg-water-500' },
};

const aspectColors: Record<string, { bg: string; text: string }> = {
  conjunction: { bg: 'bg-white/10', text: 'text-white' },
  sextile: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  square: { bg: 'bg-rose-500/10', text: 'text-rose-400' },
  trine: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  opposition: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  quincunx: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  semisextile: { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  quintile: { bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
  sesquiquadrate: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
  semisquare: { bg: 'bg-red-500/10', text: 'text-red-400' },
};

export function ProfileAstrology() {
  const { profile, isLoading, hasProfile } = useProfile();

  if (isLoading) {
    return <LoadingSkeleton variant="profile" />;
  }

  if (!hasProfile || !profile) {
    return (
      <ProfileRequiredState
        title="Astrology Profile"
        description="Create your profile to explore your complete natal chart and astrological placements."
      />
    );
  }

  const { elementalAnalysis, placements, chartRulers } = profile;
  const totalPlanets = elementalAnalysis.fire + elementalAnalysis.earth + elementalAnalysis.air + elementalAnalysis.water;

  const getSignData = (signId: string) => signs.get(signId);
  const getPlanetData = (planetId: string) => planets.get(planetId) || points.get(planetId);
  const getHouseData = (houseId: string) => houses.get(houseId);

  const ascendant = profile.housePositions.find(h => h.houseId === 'house-1');
  const risingSign = ascendant ? getSignData(ascendant.signId) : null;

  // Group placements by house
  const placementsByHouse: Record<string, typeof placements> = {};
  placements.forEach(p => {
    if (!placementsByHouse[p.houseId]) {
      placementsByHouse[p.houseId] = [];
    }
    placementsByHouse[p.houseId].push(p);
  });

  // Count aspects by type
  const aspectCounts: Record<string, number> = {};
  profile.aspects?.planetary?.forEach(a => {
    aspectCounts[a.aspectId] = (aspectCounts[a.aspectId] || 0) + 1;
  });

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
            <span className="text-amber-400">☉</span>
            Astrology Profile
          </h1>
          <p className="text-theme-text-secondary mt-1">{profile.name}'s complete natal chart</p>
        </div>
        <Link
          to="/contemplate"
          className="px-4 py-2 bg-amber-500/20 text-amber-300 rounded-lg hover:bg-amber-500/30 transition-colors text-sm"
        >
          Contemplate Astrology
        </Link>
      </div>

      {/* Natal Chart Image */}
      <div className="flex justify-center">
        <div className="bg-surface-base/50 rounded-xl p-4 border border-theme-border-subtle max-w-lg">
          <h3 className="font-serif text-lg text-theme-text-primary mb-3 text-center">Natal Chart</h3>
          <img
            src="/images/astrology/Natal-Chart-Felipe-Fraga.png"
            alt="Natal Chart"
            className="w-full rounded-lg"
          />
        </div>
      </div>

      {/* Key Signatures */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {risingSign && (
          <div className="bg-surface-base/50 rounded-xl p-4 border border-theme-border-subtle">
            <p className="text-theme-text-tertiary text-xs mb-1">Rising Sign</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{risingSign.symbol}</span>
              <span className="text-theme-text-primary font-medium">{risingSign.name}</span>
            </div>
          </div>
        )}
        {chartRulers.traditional && (
          <div className="bg-surface-base/50 rounded-xl p-4 border border-theme-border-subtle">
            <p className="text-theme-text-tertiary text-xs mb-1">Chart Ruler</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getPlanetData(chartRulers.traditional)?.symbol}</span>
              <span className="text-theme-text-primary font-medium">{getPlanetData(chartRulers.traditional)?.name}</span>
            </div>
          </div>
        )}
        <div className="bg-surface-base/50 rounded-xl p-4 border border-theme-border-subtle">
          <p className="text-theme-text-tertiary text-xs mb-1">Dominant Element</p>
          <div className="flex items-center gap-2">
            <span className={`text-lg ${elementColors[elementalAnalysis.dominant as keyof typeof elementColors]?.text}`}>
              {elementalAnalysis.dominant === 'fire' && '🜂'}
              {elementalAnalysis.dominant === 'earth' && '🜃'}
              {elementalAnalysis.dominant === 'air' && '🜁'}
              {elementalAnalysis.dominant === 'water' && '🜄'}
            </span>
            <span className="text-theme-text-primary font-medium capitalize">{elementalAnalysis.dominant}</span>
          </div>
        </div>
        <div className="bg-surface-base/50 rounded-xl p-4 border border-theme-border-subtle">
          <p className="text-theme-text-tertiary text-xs mb-1">Total Placements</p>
          <span className="text-theme-text-primary font-medium text-xl">{placements.length}</span>
        </div>
      </div>

      {/* Elemental Balance */}
      <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h2 className="font-serif text-xl text-theme-text-primary mb-4">Elemental Balance</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {(['fire', 'earth', 'air', 'water'] as const).map((element) => {
            const count = elementalAnalysis[element];
            const percentage = (count / totalPlanets) * 100;
            const colors = elementColors[element];
            const planetIds = elementalAnalysis[`${element}PlanetIds` as keyof typeof elementalAnalysis] as string[];

            return (
              <div key={element}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium capitalize ${colors.text}`}>{element}</span>
                  <span className="text-theme-text-secondary">{count} ({Math.round(percentage)}%)</span>
                </div>
                <div className="h-3 bg-surface-raised rounded-full overflow-hidden mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-full ${colors.bar} rounded-full`}
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {planetIds?.map((id) => {
                    const planet = getPlanetData(id);
                    return planet ? (
                      <span key={id} className="text-lg" title={planet.name}>
                        {planet.symbol}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 pt-4 border-t border-theme-border-subtle">
          <p className="text-theme-text-secondary text-sm">
            <span className="text-theme-text-primary font-medium">Your elemental signature:</span>{' '}
            Strong in <span className={elementColors[elementalAnalysis.dominant as keyof typeof elementColors]?.text}>{elementalAnalysis.dominant}</span>,
            {' '}inviting growth through <span className={elementColors[elementalAnalysis.deficient as keyof typeof elementColors]?.text}>{elementalAnalysis.deficient}</span>.
          </p>
        </div>
      </div>

      {/* All Placements Table */}
      <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h2 className="font-serif text-xl text-theme-text-primary mb-4">All Placements</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-theme-text-tertiary text-left border-b border-theme-border-subtle">
                <th className="pb-3 font-medium">Planet</th>
                <th className="pb-3 font-medium">Sign</th>
                <th className="pb-3 font-medium">Degree</th>
                <th className="pb-3 font-medium">House</th>
                <th className="pb-3 font-medium">HD · GK</th>
                <th className="pb-3 font-medium">Dignity</th>
                <th className="pb-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {placements.map((placement) => {
                const planet = getPlanetData(placement.planetId);
                const sign = getSignData(placement.signId);
                const house = getHouseData(placement.houseId);
                const signColors = elementColors[sign?.elementId as keyof typeof elementColors];
                const dignity = placement.dignityId ? dignities.find(d => d.id === placement.dignityId) : null;
                const absDecimal = signPositionToAbsoluteDegree(placement.signId, placement.degree + placement.minute / 60);
                const gateResult = getGateByDegree(absDecimal);
                const hdGate = gateResult?.gate;
                const gk = hdGate?.geneKeyId ? geneKeys.get(hdGate.geneKeyId) : undefined;

                return (
                  <tr key={placement.id} className="hover:bg-surface-raised/30 cursor-pointer" onClick={() => window.location.href = `/profile/astrology/placements/${placement.planetId}`}>
                    <td className="py-3">
                      <Link to={`/profile/astrology/placements/${placement.planetId}`} className="flex items-center gap-2 hover:text-amber-300">
                        <span className="text-lg">{planet?.symbol}</span>
                        <span className="text-theme-text-primary">{planet?.name}</span>
                      </Link>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <span className={signColors?.text}>{sign?.symbol}</span>
                        <span className="text-theme-text-secondary">{sign?.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-theme-text-secondary">
                      {placement.degree}°{placement.minute}'
                    </td>
                    <td className="py-3 text-theme-text-secondary">
                      {house?.name}
                    </td>
                    <td className="py-3">
                      {hdGate ? (
                        <div className="flex items-center gap-1.5">
                          <Link
                            to={`/human-design/${hdGate.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs font-serif text-humandesign-400 hover:text-humandesign-300 transition-colors"
                            title={hdGate.name}
                          >
                            {hdGate.gateNumber}
                          </Link>
                          {gk && (
                            <>
                              <span className="text-theme-text-muted">·</span>
                              <Link
                                to={`/gene-keys/${gk.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-xs font-serif text-genekey-400 hover:text-genekey-300 transition-colors"
                                title={gk.name}
                              >
                                {gk.keyNumber}
                              </Link>
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="text-theme-text-muted text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3">
                      {dignity ? (
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          ['Domicile', 'Exaltation'].includes(dignity.dignityType) ? 'bg-emerald-500/20 text-emerald-400' :
                          ['Detriment', 'Fall'].includes(dignity.dignityType) ? 'bg-rose-500/20 text-rose-400' :
                          'bg-surface-interactive text-theme-text-secondary'
                        }`}>
                          {dignity.dignityType}
                        </span>
                      ) : (
                        <span className="text-theme-text-muted">—</span>
                      )}
                    </td>
                    <td className="py-3 text-theme-text-tertiary text-xs">
                      {placement.retrograde && <span className="text-amber-400">℞ Retrograde</span>}
                      {placement.isChartRuler && <span className="text-yellow-400 ml-2">Chart Ruler</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* House Placements */}
      <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h2 className="font-serif text-xl text-theme-text-primary mb-4">Planets by House</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((houseNum) => {
            const houseId = `house-${houseNum}`;
            const house = getHouseData(houseId);
            const housePlacements = placementsByHouse[houseId] || [];
            const housePosition = profile.housePositions.find(h => h.houseId === houseId);
            const houseSign = housePosition ? getSignData(housePosition.signId) : null;
            const houseChakra = Array.from(chakras.values()).find(c => c.relatedHouses.includes(houseNum));

            return (
              <div key={houseId} className="bg-surface-raised/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <Link to={`/houses/${houseId}`} className="text-theme-text-secondary hover:text-theme-text-primary text-sm font-medium">
                    {house?.name}
                  </Link>
                  <div className="flex items-center gap-1.5">
                    {houseChakra && (
                      <Link
                        to={`/chakras/${houseChakra.id}`}
                        title={houseChakra.name}
                        className="text-sm"
                        style={{ color: houseChakra.colorHex }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {houseChakra.symbol}
                      </Link>
                    )}
                    {houseSign && (
                      <span className={`text-sm ${elementColors[houseSign.elementId as keyof typeof elementColors]?.text}`}>
                        {houseSign.symbol}
                      </span>
                    )}
                  </div>
                </div>
                {housePlacements.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {housePlacements.map((p) => {
                      const planet = getPlanetData(p.planetId);
                      return planet ? (
                        <span key={p.id} className="text-lg" title={planet.name}>
                          {planet.symbol}
                        </span>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <span className="text-theme-text-muted text-xs">Empty</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* All Aspects */}
      {profile.aspects?.planetary && profile.aspects.planetary.length > 0 && (
        <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xltext-theme-text-primary">All Aspects ({profile.aspects.planetary.length})</h2>
            <Link to="/weaver" className="text-theme-text-secondary hover:text-theme-text-primary text-sm">
              View in Aspect Weaver →
            </Link>
          </div>

          {/* Aspect Summary */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(aspectCounts).map(([aspectId, count]) => {
              const aspectType = aspects.get(aspectId);
              const colors = aspectColors[aspectId] || { bg: 'bg-surface-raised', text: 'text-theme-text-secondary' };
              return aspectType ? (
                <span key={aspectId} className={`px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-sm`}>
                  {aspectType.symbol} {aspectType.name}: {count}
                </span>
              ) : null;
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {profile.aspects.planetary.map((personalAspect) => {
              const aspectType = aspects.get(personalAspect.aspectId);
              const planet1 = getPlanetData(personalAspect.planet1Id);
              const planet2 = getPlanetData(personalAspect.planet2Id);
              const colors = aspectColors[personalAspect.aspectId] || { bg: 'bg-surface-raised', text: 'text-theme-text-secondary' };

              if (!aspectType || !planet1 || !planet2) return null;

              return (
                <Link
                  key={personalAspect.id}
                  to={`/profile/astrology/aspects/${personalAspect.planet1Id}-${personalAspect.planet2Id}`}
                  className={`block p-3 ${colors.bg} rounded-lg border border-theme-border-subtle/50 hover:opacity-80 transition-opacity`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{planet1.symbol}</span>
                      <span className={`text-sm ${colors.text}`}>{aspectType.symbol}</span>
                      <span className="text-lg">{planet2.symbol}</span>
                    </div>
                    <span className="text-theme-text-tertiary text-xs">
                      {personalAspect.orbDegree}°{personalAspect.orbMinute}'
                    </span>
                  </div>
                  <p className="text-theme-text-secondary text-xs mt-1">
                    {planet1.name} {aspectType.name.toLowerCase()} {planet2.name}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Configurations */}
      {profile.configurations.length > 0 && (
        <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl text-theme-text-primary mb-4">Aspect Configurations</h2>
          <div className="space-y-4">
            {profile.configurations.map((config) => (
              <Link
                key={config.id}
                to={`/profile/astrology/configurations/${config.configurationId}`}
                className="block p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-colors"
              >
                <h3 className="font-medium text-purple-300 mb-2">{config.fullName}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {config.placementIds.map((placementId) => {
                    const placement = placements.find(p => p.id === placementId);
                    const planet = placement ? getPlanetData(placement.planetId) : null;
                    const sign = placement ? getSignData(placement.signId) : null;
                    return planet ? (
                      <span key={placementId} className="px-2 py-1 bg-purple-500/20 text-purple-200 text-sm rounded flex items-center gap-1">
                        {planet.symbol} {planet.name}
                        {sign && <span className="text-purple-400/60">in {sign.name}</span>}
                      </span>
                    ) : null;
                  })}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Dignities Analysis */}
      <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xltext-theme-text-primary">Essential Dignities</h2>
          <Link to="/dignities" className="text-theme-text-secondary hover:text-theme-text-primary text-sm">
            View Dignity Matrix →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div>
            <h3 className="text-emerald-400 text-sm font-medium mb-3">Planetary Strengths</h3>
            <div className="space-y-2">
              {placements.filter(p => p.dignityId && ['domicile', 'exaltation'].includes(p.dignityId)).map((p) => {
                const planet = getPlanetData(p.planetId);
                const sign = getSignData(p.signId);
                const dignity = p.dignityId ? dignities.find(d => d.id === p.dignityId) : null;
                return planet && sign && dignity ? (
                  <div key={p.id} className="flex items-center gap-2 p-2 bg-emerald-500/10 rounded">
                    <span className="text-lg">{planet.symbol}</span>
                    <span className="text-theme-text-primary">{planet.name} in {sign.name}</span>
                    <span className="text-emerald-400 text-xs ml-auto">{dignity.dignityType}</span>
                  </div>
                ) : null;
              })}
              {placements.filter(p => p.dignityId && ['domicile', 'exaltation'].includes(p.dignityId)).length === 0 && (
                <p className="text-theme-text-tertiary text-sm">No planets in domicile or exaltation</p>
              )}
            </div>
          </div>
          {/* Challenges */}
          <div>
            <h3 className="text-rose-400 text-sm font-medium mb-3">Planetary Challenges</h3>
            <div className="space-y-2">
              {placements.filter(p => p.dignityId && ['detriment', 'fall'].includes(p.dignityId)).map((p) => {
                const planet = getPlanetData(p.planetId);
                const sign = getSignData(p.signId);
                const dignity = p.dignityId ? dignities.find(d => d.id === p.dignityId) : null;
                return planet && sign && dignity ? (
                  <div key={p.id} className="flex items-center gap-2 p-2 bg-rose-500/10 rounded">
                    <span className="text-lg">{planet.symbol}</span>
                    <span className="text-theme-text-primary">{planet.name} in {sign.name}</span>
                    <span className="text-rose-400 text-xs ml-auto">{dignity.dignityType}</span>
                  </div>
                ) : null;
              })}
              {placements.filter(p => p.dignityId && ['detriment', 'fall'].includes(p.dignityId)).length === 0 && (
                <p className="text-theme-text-tertiary text-sm">No planets in detriment or fall</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link to="/planets" className="p-4 bg-surface-base/50 rounded-lg border border-theme-border-subtle hover:border-theme-border-subtle text-center">
          <span className="text-2xl block mb-1">☿</span>
          <span className="text-theme-text-secondary text-sm">Planets</span>
        </Link>
        <Link to="/signs" className="p-4 bg-surface-base/50 rounded-lg border border-theme-border-subtle hover:border-theme-border-subtle text-center">
          <span className="text-2xl block mb-1">♈︎</span>
          <span className="text-theme-text-secondary text-sm">Signs</span>
        </Link>
        <Link to="/houses" className="p-4 bg-surface-base/50 rounded-lg border border-theme-border-subtle hover:border-theme-border-subtle text-center">
          <span className="text-2xl block mb-1">⌂</span>
          <span className="text-theme-text-secondary text-sm">Houses</span>
        </Link>
        <Link to="/aspects" className="p-4 bg-surface-base/50 rounded-lg border border-theme-border-subtle hover:border-theme-border-subtle text-center">
          <span className="text-2xl block mb-1">△</span>
          <span className="text-theme-text-secondary text-sm">Aspects</span>
        </Link>
      </div>
    </motion.div>
  );
}

export default ProfileAstrology;
