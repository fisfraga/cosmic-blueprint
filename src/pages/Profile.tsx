import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useProfile } from '../context';
import { signs, planets, houses, aspects, points, geneKeys, hdCenters, hdGates, hdChannels, chakras, codonRings, gkLines, getGateByDegree } from '../data';
import { getCosmicWeather } from '../services/transits';
import { exportUserData } from '../services/dataExport';
import { LoadingSkeleton } from '../components';

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
};

export function Profile() {
  const { profile, isLoading, hasProfile } = useProfile();
  const navigate = useNavigate();
  const [exportSuccess, setExportSuccess] = useState(false);

  if (isLoading) {
    return <LoadingSkeleton variant="profile" />;
  }

  if (!hasProfile || !profile) {
    return null;
  }

  const { elementalAnalysis, placements, chartRulers } = profile;
  const totalPlanets = elementalAnalysis.fire + elementalAnalysis.earth + elementalAnalysis.air + elementalAnalysis.water;

  // Get sign and planet data for display
  const getSignData = (signId: string) => signs.get(signId);
  const getPlanetData = (planetId: string) => planets.get(planetId) || points.get(planetId);
  const getHouseData = (houseId: string) => houses.get(houseId);

  // Rising sign (ASC)
  const ascendant = profile.housePositions.find(h => h.houseId === 'house-1');
  const risingSign = ascendant ? getSignData(ascendant.signId) : null;

  // Sprint A9: Cross-system synthesis data
  const allGateNumbers = new Set<number>([
    ...(profile.humanDesignProfile?.personalityGates?.map(g => g.gateNumber) ?? []),
    ...(profile.humanDesignProfile?.designGates?.map(g => g.gateNumber) ?? []),
  ]);

  const activeChannels = Array.from(hdChannels.values()).filter(
    ch => allGateNumbers.has(ch.gate1Number) && allGateNumbers.has(ch.gate2Number)
  );

  const definedCenterChakras = (profile.humanDesignProfile?.definedCenterIds ?? [])
    .map(cId => Array.from(chakras.values()).find(c => c.relatedHDCenters.includes(cId)))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .filter((c, i, arr) => arr.findIndex(x => x.id === c.id) === i);

  const todayWeather = getCosmicWeather(new Date());
  const todayActivations = todayWeather.positions
    .map(pos => {
      const gr = getGateByDegree(pos.degree);
      if (!gr || !allGateNumbers.has(gr.gate.gateNumber)) return null;
      const chakra = Array.from(chakras.values()).find(c => c.relatedHDCenters.includes(gr.gate.centerId));
      return { pos, gate: gr.gate, line: gr.line, gk: gr.gate.geneKeyId ? geneKeys.get(gr.gate.geneKeyId) : undefined, chakra };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const gkSphereKeyList = ['lifesWork','evolution','radiance','purpose','attraction','iq','eq','sq','core','vocation','culture','brand','pearl'];
  const chartCodonRings = gkSphereKeyList
    .map(key => {
      const s = profile.geneKeysProfile?.[key as keyof typeof profile.geneKeysProfile];
      if (!s || typeof s !== 'object' || !('geneKeyId' in s)) return null;
      const gk = geneKeys.get((s as { geneKeyId: string }).geneKeyId);
      return gk?.codonRingId ? codonRings.get(gk.codonRingId) : null;
    })
    .filter((r): r is NonNullable<typeof r> => Boolean(r))
    .filter((r, i, arr) => arr.findIndex(x => x.id === r.id) === i);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h1 className="font-serif text-4xl font-medium text-white">
            {profile.name}
          </h1>
          {profile.relationship && profile.relationship !== 'Me' && (
            <span className="px-2 py-1 bg-neutral-800 text-neutral-400 text-sm rounded">
              {profile.relationship}
            </span>
          )}
        </div>
        <p className="text-neutral-400">
          {new Date(profile.dateOfBirth).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          {profile.timeOfBirth && ` at ${profile.timeOfBirth}`}
        </p>
        <p className="text-neutral-500 text-sm mt-1">{profile.cityOfBirth}</p>
      </div>

      {/* Natal Chart */}
      <div className="flex justify-center">
        <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800 max-w-md">
          <h3 className="font-serif text-lg text-white mb-3 text-center">Natal Chart</h3>
          <img
            src="/images/astrology/Natal-Chart-Felipe-Fraga.png"
            alt="Natal Chart"
            className="w-full rounded-lg"
          />
        </div>
      </div>

      {/* Today in Your Chart */}
      {allGateNumbers.size > 0 && (
        <div className="bg-gradient-to-r from-purple-500/10 to-humandesign-500/10 rounded-xl p-5 border border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-lg text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse inline-block"></span>
              Today in Your Chart
            </h2>
            <Link to="/transits" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
              All transits →
            </Link>
          </div>
          {todayActivations.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2">
                {todayActivations.map(({ pos, gate, line, gk, chakra }) => (
                  <Link
                    key={pos.planetId}
                    to={`/human-design/${gate.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800/80 hover:bg-neutral-800 border border-humandesign-500/30 rounded-full text-sm transition-colors"
                  >
                    <span className="text-xl leading-none">{pos.symbol}</span>
                    <span className="text-neutral-300">{pos.planetName}</span>
                    <span className="text-neutral-600">→</span>
                    <span className="text-humandesign-300 font-medium">Gate {gate.gateNumber}.{line}</span>
                    {gk && (
                      <span className="text-emerald-400/80 text-xs">· {gk.gift.name}</span>
                    )}
                    {chakra && (
                      <span style={{ color: chakra.colorHex }} className="text-sm ml-0.5" title={chakra.name}>{chakra.symbol}</span>
                    )}
                  </Link>
                ))}
              </div>
              <button
                onClick={() => navigate('/contemplate', {
                  state: {
                    seed: {
                      category: 'astrology',
                      contemplationType: 'transitOverview',
                    },
                  },
                })}
                className="mt-3 flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>✦</span>
                <span>Ask Oracle about today's activations →</span>
              </button>
            </>
          ) : (
            <p className="text-neutral-400 text-sm">
              No planets transiting your natal gates today.{' '}
              <Link to="/transits" className="text-purple-400 hover:text-purple-300 transition-colors">Explore all transits →</Link>
            </p>
          )}
        </div>
      )}

      {/* Key Signatures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rising Sign */}
        {risingSign && (
          <div className="bg-neutral-900/50 rounded-xl p-5 border border-neutral-800">
            <p className="text-neutral-400 text-sm mb-2">Rising Sign</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{risingSign.symbol}</span>
              <div>
                <p className="font-serif text-xl text-white">{risingSign.name}</p>
                <p className="text-neutral-500 text-sm">Ascendant</p>
              </div>
            </div>
          </div>
        )}

        {/* Chart Rulers */}
        <div className="bg-neutral-900/50 rounded-xl p-5 border border-neutral-800">
          <p className="text-neutral-400 text-sm mb-2">Chart Rulers</p>
          <div className="flex items-center gap-4">
            {chartRulers.traditional && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getPlanetData(chartRulers.traditional)?.symbol}</span>
                <div>
                  <p className="font-medium text-white">{getPlanetData(chartRulers.traditional)?.name}</p>
                  <p className="text-neutral-500 text-xs">Traditional</p>
                </div>
              </div>
            )}
            {chartRulers.modern && chartRulers.modern !== chartRulers.traditional && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getPlanetData(chartRulers.modern)?.symbol}</span>
                <div>
                  <p className="font-medium text-white">{getPlanetData(chartRulers.modern)?.name}</p>
                  <p className="text-neutral-500 text-xs">Modern</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dominant Element */}
        <div className="bg-neutral-900/50 rounded-xl p-5 border border-neutral-800">
          <p className="text-neutral-400 text-sm mb-2">Dominant Element</p>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${elementColors[elementalAnalysis.dominant as keyof typeof elementColors]?.bg || 'bg-neutral-700'} flex items-center justify-center`}>
              <span className="text-white text-lg">
                {elementalAnalysis.dominant === 'fire' && '🜂'}
                {elementalAnalysis.dominant === 'earth' && '🜃'}
                {elementalAnalysis.dominant === 'air' && '🜁'}
                {elementalAnalysis.dominant === 'water' && '🜄'}
              </span>
            </div>
            <div>
              <p className="font-serif text-xl text-white capitalize">{elementalAnalysis.dominant}</p>
              <p className="text-neutral-500 text-sm">{elementalAnalysis[elementalAnalysis.dominant as keyof typeof elementalAnalysis]} planets</p>
            </div>
          </div>
        </div>
      </div>

      {/* Elemental Balance */}
      <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h2 className="font-serif text-xl text-white mb-4">Elemental Balance</h2>
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
                  <span className="text-neutral-400">{count} planets</span>
                </div>
                <div className="h-3 bg-neutral-800 rounded-full overflow-hidden mb-3">
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

        {/* Balance Insight */}
        <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
          <p className="text-neutral-300 text-sm">
            <span className="text-white font-medium">Your elemental signature:</span>{' '}
            Strong in <span className={elementColors[elementalAnalysis.dominant as keyof typeof elementColors]?.text}>{elementalAnalysis.dominant}</span>,
            {' '}inviting growth through <span className={elementColors[elementalAnalysis.deficient as keyof typeof elementColors]?.text}>{elementalAnalysis.deficient}</span>.
          </p>
          <Link
            to="/profile/astrology"
            className="px-4 py-2 bg-amber-500/20 text-amber-300 rounded-lg hover:bg-amber-500/30 transition-colors text-sm whitespace-nowrap ml-4"
          >
            View Full Astrology Chart →
          </Link>
        </div>
      </div>

      {/* Cosmic Identity - The Big Four with HD & GK */}
      <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h2 className="font-serif text-xl text-white mb-2">Cosmic Identity</h2>
        <p className="text-neutral-400 text-sm mb-4">Your Sun, Moon, Mercury, and Ascendant across all three wisdom systems</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sun */}
          {(() => {
            const sunPlacement = placements.find(p => p.planetId === 'sun');
            const sign = sunPlacement ? getSignData(sunPlacement.signId) : null;
            const house = sunPlacement ? getHouseData(sunPlacement.houseId) : null;
            const signColors = sign ? elementColors[sign.elementId as keyof typeof elementColors] : null;
            const hdCore = profile.humanDesignProfile?.coreIdentity?.sun;
            const gkCore = profile.geneKeysProfile?.coreIdentity?.sun;
            const hdGate = hdCore ? hdGates.get(hdCore.gateId) : null;
            const gk = gkCore ? geneKeys.get(gkCore.geneKeyId) : null;
            const line = gkCore ? gkLines.get(`gk-line-${gkCore.line}`) : null;

            return sunPlacement ? (
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">☉</span>
                  <div>
                    <h3 className="font-medium text-white text-lg">Sun</h3>
                    <p className="text-amber-300 text-sm">Core Identity & Purpose</p>
                  </div>
                </div>

                {/* Astrology */}
                <div className="mb-3 pb-3 border-b border-neutral-800/50">
                  <p className="text-xs text-neutral-500 mb-1">Astrology</p>
                  <div className="flex items-center gap-2">
                    <span className={signColors?.text}>{sign?.symbol}</span>
                    <span className="text-white">{sign?.name}</span>
                    <span className="text-neutral-500">• {house?.name}</span>
                  </div>
                  <p className="text-neutral-500 text-xs mt-1">
                    {sunPlacement.degree}°{sunPlacement.minute}'{sunPlacement.retrograde && ' ℞'}
                    {sunPlacement.dignityId && ` • ${sunPlacement.dignityId}`}
                  </p>
                </div>

                {/* Human Design */}
                {hdCore && (
                  <div className="mb-3 pb-3 border-b border-neutral-800/50">
                    <p className="text-xs text-neutral-500 mb-1">Human Design</p>
                    <Link to={`/profile/human-design/gates/${hdCore.gateNumber}`} className="flex items-center gap-2 hover:text-amber-300 transition-colors">
                      <span className="text-amber-400 font-medium">Gate {hdCore.gateNumber}.{hdCore.line}</span>
                      {hdGate && <span className="text-neutral-300">— {hdGate.name}</span>}
                    </Link>
                    <p className="text-neutral-500 text-xs mt-1">{hdCore.centerName} Center</p>
                  </div>
                )}

                {/* Gene Keys */}
                {gkCore && (
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Gene Keys</p>
                    <Link to={`/profile/gene-keys/lifesWork`} className="flex items-center gap-2 hover:text-purple-300 transition-colors">
                      <span className="text-purple-400 font-medium">Key {gkCore.geneKeyNumber}.{gkCore.line}</span>
                      {gk && <span className="text-neutral-300">— {gk.name}</span>}
                    </Link>
                    <p className="text-neutral-500 text-xs mt-1">
                      {gkCore.sphereName} • Line {gkCore.line} {line?.archetype}
                    </p>
                    {gk && (
                      <p className="text-neutral-400 text-xs mt-1 italic">
                        {gk.shadow?.name} → {gk.gift?.name} → {gk.siddhi?.name}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : null;
          })()}

          {/* Moon */}
          {(() => {
            const moonPlacement = placements.find(p => p.planetId === 'moon');
            const sign = moonPlacement ? getSignData(moonPlacement.signId) : null;
            const house = moonPlacement ? getHouseData(moonPlacement.houseId) : null;
            const signColors = sign ? elementColors[sign.elementId as keyof typeof elementColors] : null;
            const hdCore = profile.humanDesignProfile?.coreIdentity?.moon;
            const gkCore = profile.geneKeysProfile?.coreIdentity?.moon;
            const hdGate = hdCore ? hdGates.get(hdCore.gateId) : null;
            const gk = gkCore ? geneKeys.get(gkCore.geneKeyId) : null;
            const line = gkCore ? gkLines.get(`gk-line-${gkCore.line}`) : null;

            return moonPlacement ? (
              <div className="p-4 rounded-xl border border-water-500/30 bg-water-500/5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">☽</span>
                  <div>
                    <h3 className="font-medium text-white text-lg">Moon</h3>
                    <p className="text-water-300 text-sm">Emotions & Inner Self</p>
                  </div>
                </div>

                {/* Astrology */}
                <div className="mb-3 pb-3 border-b border-neutral-800/50">
                  <p className="text-xs text-neutral-500 mb-1">Astrology</p>
                  <div className="flex items-center gap-2">
                    <span className={signColors?.text}>{sign?.symbol}</span>
                    <span className="text-white">{sign?.name}</span>
                    <span className="text-neutral-500">• {house?.name}</span>
                  </div>
                  <p className="text-neutral-500 text-xs mt-1">
                    {moonPlacement.degree}°{moonPlacement.minute}'{moonPlacement.retrograde && ' ℞'}
                    {moonPlacement.dignityId && ` • ${moonPlacement.dignityId}`}
                  </p>
                </div>

                {/* Human Design */}
                {hdCore && (
                  <div className="mb-3 pb-3 border-b border-neutral-800/50">
                    <p className="text-xs text-neutral-500 mb-1">Human Design</p>
                    <Link to={`/profile/human-design/gates/${hdCore.gateNumber}`} className="flex items-center gap-2 hover:text-amber-300 transition-colors">
                      <span className="text-amber-400 font-medium">Gate {hdCore.gateNumber}.{hdCore.line}</span>
                      {hdGate && <span className="text-neutral-300">— {hdGate.name}</span>}
                    </Link>
                    <p className="text-neutral-500 text-xs mt-1">{hdCore.centerName} Center</p>
                  </div>
                )}

                {/* Gene Keys */}
                {gkCore && (
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Gene Keys</p>
                    <Link to={`/profile/gene-keys/evolution`} className="flex items-center gap-2 hover:text-purple-300 transition-colors">
                      <span className="text-purple-400 font-medium">Key {gkCore.geneKeyNumber}.{gkCore.line}</span>
                      {gk && <span className="text-neutral-300">— {gk.name}</span>}
                    </Link>
                    <p className="text-neutral-500 text-xs mt-1">
                      {gkCore.sphereName} • Line {gkCore.line} {line?.archetype}
                    </p>
                    {gk && (
                      <p className="text-neutral-400 text-xs mt-1 italic">
                        {gk.shadow?.name} → {gk.gift?.name} → {gk.siddhi?.name}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : null;
          })()}

          {/* Mercury */}
          {(() => {
            const mercuryPlacement = placements.find(p => p.planetId === 'mercury');
            const sign = mercuryPlacement ? getSignData(mercuryPlacement.signId) : null;
            const house = mercuryPlacement ? getHouseData(mercuryPlacement.houseId) : null;
            const signColors = sign ? elementColors[sign.elementId as keyof typeof elementColors] : null;
            const hdCore = profile.humanDesignProfile?.coreIdentity?.mercury;
            const gkCore = profile.geneKeysProfile?.coreIdentity?.mercury;
            const hdGate = hdCore ? hdGates.get(hdCore.gateId) : null;
            const gk = gkCore ? geneKeys.get(gkCore.geneKeyId) : null;
            const line = gkCore ? gkLines.get(`gk-line-${gkCore.line}`) : null;

            return mercuryPlacement ? (
              <div className="p-4 rounded-xl border border-air-500/30 bg-air-500/5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">☿</span>
                  <div>
                    <h3 className="font-medium text-white text-lg">Mercury</h3>
                    <p className="text-air-300 text-sm">Mind & Communication</p>
                  </div>
                </div>

                {/* Astrology */}
                <div className="mb-3 pb-3 border-b border-neutral-800/50">
                  <p className="text-xs text-neutral-500 mb-1">Astrology</p>
                  <div className="flex items-center gap-2">
                    <span className={signColors?.text}>{sign?.symbol}</span>
                    <span className="text-white">{sign?.name}</span>
                    <span className="text-neutral-500">• {house?.name}</span>
                  </div>
                  <p className="text-neutral-500 text-xs mt-1">
                    {mercuryPlacement.degree}°{mercuryPlacement.minute}'{mercuryPlacement.retrograde && ' ℞'}
                    {mercuryPlacement.dignityId && ` • ${mercuryPlacement.dignityId}`}
                  </p>
                </div>

                {/* Human Design */}
                {hdCore && (
                  <div className="mb-3 pb-3 border-b border-neutral-800/50">
                    <p className="text-xs text-neutral-500 mb-1">Human Design</p>
                    <Link to={`/profile/human-design/gates/${hdCore.gateNumber}`} className="flex items-center gap-2 hover:text-amber-300 transition-colors">
                      <span className="text-amber-400 font-medium">Gate {hdCore.gateNumber}.{hdCore.line}</span>
                      {hdGate && <span className="text-neutral-300">— {hdGate.name}</span>}
                    </Link>
                    <p className="text-neutral-500 text-xs mt-1">{hdCore.centerName} Center</p>
                  </div>
                )}

                {/* Gene Keys */}
                {gkCore && (
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Gene Keys</p>
                    <Link to={`/profile/gene-keys/radiance`} className="flex items-center gap-2 hover:text-purple-300 transition-colors">
                      <span className="text-purple-400 font-medium">Key {gkCore.geneKeyNumber}.{gkCore.line}</span>
                      {gk && <span className="text-neutral-300">— {gk.name}</span>}
                    </Link>
                    <p className="text-neutral-500 text-xs mt-1">
                      {gkCore.sphereName} • Line {gkCore.line} {line?.archetype}
                    </p>
                    {gk && (
                      <p className="text-neutral-400 text-xs mt-1 italic">
                        {gk.shadow?.name} → {gk.gift?.name} → {gk.siddhi?.name}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : null;
          })()}

          {/* Ascendant */}
          {(() => {
            const ascPlacement = placements.find(p => p.planetId === 'ascendant');
            const sign = ascPlacement ? getSignData(ascPlacement.signId) : risingSign;
            const signColors = sign ? elementColors[sign.elementId as keyof typeof elementColors] : null;
            const hdCore = profile.humanDesignProfile?.coreIdentity?.ascendant;
            const gkCore = profile.geneKeysProfile?.coreIdentity?.ascendant;
            const hdGate = hdCore ? hdGates.get(hdCore.gateId) : null;
            const gk = gkCore ? geneKeys.get(gkCore.geneKeyId) : null;
            const line = gkCore ? gkLines.get(`gk-line-${gkCore.line}`) : null;

            return sign ? (
              <div className="p-4 rounded-xl border border-fire-500/30 bg-fire-500/5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">↑</span>
                  <div>
                    <h3 className="font-medium text-white text-lg">Ascendant</h3>
                    <p className="text-fire-300 text-sm">Persona & Life Path</p>
                  </div>
                </div>

                {/* Astrology */}
                <div className="mb-3 pb-3 border-b border-neutral-800/50">
                  <p className="text-xs text-neutral-500 mb-1">Astrology</p>
                  <div className="flex items-center gap-2">
                    <span className={signColors?.text}>{sign?.symbol}</span>
                    <span className="text-white">{sign?.name} Rising</span>
                  </div>
                  {ascPlacement && (
                    <p className="text-neutral-500 text-xs mt-1">
                      {ascPlacement.degree}°{ascPlacement.minute}'
                    </p>
                  )}
                </div>

                {/* Human Design */}
                {hdCore && (
                  <div className="mb-3 pb-3 border-b border-neutral-800/50">
                    <p className="text-xs text-neutral-500 mb-1">Human Design</p>
                    <Link to={`/profile/human-design/gates/${hdCore.gateNumber}`} className="flex items-center gap-2 hover:text-amber-300 transition-colors">
                      <span className="text-amber-400 font-medium">Gate {hdCore.gateNumber}.{hdCore.line}</span>
                      {hdGate && <span className="text-neutral-300">— {hdGate.name}</span>}
                    </Link>
                    <p className="text-neutral-500 text-xs mt-1">{hdCore.centerName} Center</p>
                  </div>
                )}

                {/* Gene Keys */}
                {gkCore && (
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Gene Keys</p>
                    <Link to={`/profile/gene-keys/purpose`} className="flex items-center gap-2 hover:text-purple-300 transition-colors">
                      <span className="text-purple-400 font-medium">Key {gkCore.geneKeyNumber}.{gkCore.line}</span>
                      {gk && <span className="text-neutral-300">— {gk.name}</span>}
                    </Link>
                    <p className="text-neutral-500 text-xs mt-1">
                      {gkCore.sphereName} • Line {gkCore.line} {line?.archetype}
                    </p>
                    {gk && (
                      <p className="text-neutral-400 text-xs mt-1 italic">
                        {gk.shadow?.name} → {gk.gift?.name} → {gk.siddhi?.name}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : null;
          })()}
        </div>
      </div>

      {/* All Placements */}
      <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl text-white">All Placements</h2>
          <span className="text-neutral-400 text-sm">{placements.length} placements</span>
        </div>
        <div className="space-y-2">
          {placements.map((placement) => {
            const planet = getPlanetData(placement.planetId);
            const sign = getSignData(placement.signId);
            const house = getHouseData(placement.houseId);
            const signColors = elementColors[sign?.elementId as keyof typeof elementColors];

            // Map placement planet IDs to HD planet names
            const hdPlanetMap: Record<string, string> = {
              sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars',
              jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto',
              'north-node': 'North Node', 'south-node': 'South Node',
            };
            const hdPlanetName = hdPlanetMap[placement.planetId];

            // Get gate info from HD profile personality gates
            const hdGate = hdPlanetName && profile.humanDesignProfile?.personalityGates?.find(g => g.planet === hdPlanetName);
            const gk = hdGate ? geneKeys.get(`gene-key-${hdGate.gateNumber}`) : null;

            return (
              <div
                key={placement.id}
                className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl w-8">{planet?.symbol}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{planet?.name}</span>
                      <span className={`text-sm ${signColors?.text}`}>
                        {sign?.symbol} {sign?.name}
                      </span>
                    </div>
                    <p className="text-neutral-500 text-xs">
                      {placement.degree}°{placement.minute}'
                      {hdGate && <span className="text-amber-400 mx-1">• {hdGate.gateNumber}.{hdGate.line}</span>}
                      {' '}• {house?.name}
                      {placement.retrograde && ' • ℞'}
                    </p>
                    {hdGate && gk && (
                      <Link
                        to={`/gene-keys/gk-${hdGate.gateNumber}`}
                        className="text-genekey-400 text-xs hover:text-genekey-300 transition-colors"
                      >
                        {gk.siddhi?.name} – {gk.gift?.name} – {gk.shadow?.name}
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {placement.isChartRuler && (
                    <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded">
                      Chart Ruler
                    </span>
                  )}
                  {placement.dignityId && (
                    <span className="px-2 py-0.5 text-xs bg-neutral-700 text-neutral-300 rounded capitalize">
                      {placement.dignityId}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Aspects */}
      {profile.aspects?.planetary && profile.aspects.planetary.length > 0 && (
        <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-white">Your Aspects</h2>
            <Link
              to="/weaver"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              View in Aspect Weaver →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {profile.aspects.planetary.map((personalAspect) => {
              const aspectType = aspects.get(personalAspect.aspectId);
              const planet1 = getPlanetData(personalAspect.planet1Id);
              const planet2 = getPlanetData(personalAspect.planet2Id);
              const colors = aspectColors[personalAspect.aspectId] || { bg: 'bg-neutral-800', text: 'text-neutral-300' };

              if (!aspectType || !planet1 || !planet2) return null;

              return (
                <div
                  key={personalAspect.id}
                  className={`p-3 ${colors.bg} rounded-lg border border-neutral-700/50`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{planet1.symbol}</span>
                      <span className={`text-sm ${colors.text}`}>{aspectType.symbol}</span>
                      <span className="text-lg">{planet2.symbol}</span>
                    </div>
                    <span className={`text-xs ${colors.text}`}>{aspectType.name}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-neutral-400 text-xs">
                      {planet1.name} {aspectType.name.toLowerCase()} {planet2.name}
                    </span>
                    <span className="text-neutral-500 text-xs">
                      {personalAspect.orbDegree}°{personalAspect.orbMinute}' {personalAspect.direction}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Configurations */}
      {profile.configurations.length > 0 && (
        <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-white">Configurations</h2>
            <Link
              to="/configurations"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              View Gallery →
            </Link>
          </div>
          <div className="space-y-3">
            {profile.configurations.map((config) => (
              <div
                key={config.id}
                className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg"
              >
                <h3 className="font-medium text-purple-300 mb-2">{config.fullName}</h3>
                <div className="flex flex-wrap gap-2">
                  {config.placementIds.map((placementId) => {
                    const placement = placements.find(p => p.id === placementId);
                    const planet = placement ? getPlanetData(placement.planetId) : null;
                    return planet ? (
                      <span key={placementId} className="px-2 py-1 bg-purple-500/20 text-purple-200 text-sm rounded">
                        {planet.symbol} {planet.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Human Design Profile */}
      {profile.humanDesignProfile && (
        <div className="bg-gradient-to-br from-amber-500/5 to-amber-600/5 rounded-xl p-6 border border-amber-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl text-white flex items-center gap-2">
              <span>⬡</span> Human Design Profile
            </h2>
            <Link
              to="/profile/human-design"
              className="px-4 py-2 bg-amber-500/20 text-amber-300 rounded-lg hover:bg-amber-500/30 transition-colors text-sm"
            >
              View Full HD Chart →
            </Link>
          </div>

          {/* HD Key Signature */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Link to="/human-design/types" className="bg-neutral-900/50 rounded-lg p-4 hover:bg-neutral-800/50 transition-colors group">
              <p className="text-neutral-400 text-xs mb-1">Type</p>
              <p className="text-amber-300 font-medium text-lg group-hover:text-amber-200">{profile.humanDesignProfile.type}</p>
              <p className="text-neutral-500 text-xs mt-1">Energy blueprint</p>
            </Link>
            <div className="bg-neutral-900/50 rounded-lg p-4">
              <p className="text-neutral-400 text-xs mb-1">Strategy</p>
              <p className="text-amber-300 font-medium">{profile.humanDesignProfile.strategy}</p>
              <p className="text-neutral-500 text-xs mt-1">How to engage life</p>
            </div>
            <Link to="/human-design/authorities" className="bg-neutral-900/50 rounded-lg p-4 hover:bg-neutral-800/50 transition-colors group">
              <p className="text-neutral-400 text-xs mb-1">Authority</p>
              <p className="text-amber-300 font-medium group-hover:text-amber-200">{profile.humanDesignProfile.authority}</p>
              <p className="text-neutral-500 text-xs mt-1">Decision-making</p>
            </Link>
            <Link to="/human-design/profiles" className="bg-neutral-900/50 rounded-lg p-4 hover:bg-neutral-800/50 transition-colors group">
              <p className="text-neutral-400 text-xs mb-1">Profile</p>
              <p className="text-amber-300 font-medium text-lg group-hover:text-amber-200">{profile.humanDesignProfile.profile}</p>
              <p className="text-neutral-500 text-xs mt-1">Life archetype</p>
            </Link>
          </div>

          {/* Incarnation Cross & Definition */}
          <div className="grid md:grid-cols-2 gap-4 mb-6 p-4 bg-neutral-900/30 rounded-lg">
            <div>
              <p className="text-neutral-400 text-xs mb-1">Incarnation Cross</p>
              <p className="text-white font-medium">{profile.humanDesignProfile.incarnationCross}</p>
              <p className="text-neutral-500 text-xs mt-1">Your life purpose theme</p>
            </div>
            <div>
              <p className="text-neutral-400 text-xs mb-1">Definition</p>
              <p className="text-white font-medium">{profile.humanDesignProfile.definition}</p>
              <p className="text-neutral-500 text-xs mt-1">How your energy connects</p>
            </div>
          </div>

          {/* Gates with Gene Key sphere connections */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-neutral-300 text-sm mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
                Personality Gates (Conscious)
              </p>
              <div className="space-y-2">
                {profile.humanDesignProfile.personalityGates?.map((gate, index) => {
                  const gateData = hdGates.get(gate.gateId);
                  const gk = geneKeys.get(`gene-key-${gate.gateNumber}`);
                  // Find matching sphere in profile
                  const gkProfile = profile.geneKeysProfile;
                  const matchingSphere = gkProfile ? Object.entries(gkProfile).find(([key, value]) => {
                    if (key === 'coreIdentity' || !value || typeof value !== 'object' || !('geneKeyNumber' in value)) return false;
                    return value.geneKeyNumber === gate.gateNumber && value.line === gate.line;
                  }) : null;
                  const sphereName = matchingSphere ? (matchingSphere[1] as { sphereName: string }).sphereName : null;

                  return (
                    <Link
                      key={`${gate.gateId}-${index}`}
                      to={`/profile/human-design/gates/${gate.gateNumber}`}
                      className="block p-2 bg-neutral-800/50 hover:bg-neutral-700/50 rounded-lg text-sm transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500 text-xs w-20">{gate.planet}</span>
                        <span className="text-amber-400 font-medium">{gate.gateNumber}.{gate.line}</span>
                        {gateData && <span className="text-neutral-300">{gateData.name}</span>}
                      </div>
                      {gk && (
                        <p className="text-genekey-400 text-xs mt-1 ml-20">
                          {sphereName && <span className="text-genekey-300">{sphereName}: </span>}
                          {gk.siddhi?.name} – {gk.gift?.name} – {gk.shadow?.name}
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="text-neutral-300 text-sm mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                Design Gates (Unconscious)
              </p>
              <div className="space-y-2">
                {profile.humanDesignProfile.designGates?.map((gate, index) => {
                  const gateData = hdGates.get(gate.gateId);
                  const gk = geneKeys.get(`gene-key-${gate.gateNumber}`);
                  // Find matching sphere in profile
                  const gkProfile = profile.geneKeysProfile;
                  const matchingSphere = gkProfile ? Object.entries(gkProfile).find(([key, value]) => {
                    if (key === 'coreIdentity' || !value || typeof value !== 'object' || !('geneKeyNumber' in value)) return false;
                    return value.geneKeyNumber === gate.gateNumber && value.line === gate.line;
                  }) : null;
                  const sphereName = matchingSphere ? (matchingSphere[1] as { sphereName: string }).sphereName : null;

                  return (
                    <Link
                      key={`${gate.gateId}-${index}`}
                      to={`/profile/human-design/gates/${gate.gateNumber}`}
                      className="block p-2 bg-neutral-800/50 hover:bg-neutral-700/50 rounded-lg text-sm transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500 text-xs w-20">{gate.planet}</span>
                        <span className="text-red-400 font-medium">{gate.gateNumber}.{gate.line}</span>
                        {gateData && <span className="text-neutral-300">{gateData.name}</span>}
                      </div>
                      {gk && (
                        <p className="text-genekey-400 text-xs mt-1 ml-20">
                          {sphereName && <span className="text-genekey-300">{sphereName}: </span>}
                          {gk.siddhi?.name} – {gk.gift?.name} – {gk.shadow?.name}
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Defined Centers */}
          {profile.humanDesignProfile.definedCenterIds && (
            <div className="pt-4 border-t border-neutral-800/50">
              <p className="text-neutral-400 text-sm mb-3">Defined Centers ({profile.humanDesignProfile.definedCenterIds.length} of 9)</p>
              <div className="flex flex-wrap gap-2">
                {profile.humanDesignProfile.definedCenterIds.map((centerId) => {
                  const center = hdCenters.get(centerId);
                  return center ? (
                    <Link
                      key={centerId}
                      to={`/human-design/centers/${centerId}`}
                      className="px-3 py-2 bg-amber-500/10 text-amber-300 rounded-lg text-sm hover:bg-amber-500/20 transition-colors"
                    >
                      <span className="font-medium">{center.name}</span>
                    </Link>
                  ) : null;
                })}
              </div>
              <p className="text-neutral-500 text-xs mt-3">
                Defined centers represent consistent, reliable energy. Open centers are where you learn and experience the world.
              </p>
            </div>
          )}

          {/* Active Channels */}
          {activeChannels.length > 0 && (
            <div className="pt-4 border-t border-neutral-800/50">
              <p className="text-neutral-400 text-sm mb-3">
                Active Channels ({activeChannels.length}) — circuits defined by your gates
              </p>
              <div className="grid md:grid-cols-2 gap-2">
                {activeChannels.map(ch => (
                  <Link
                    key={ch.id}
                    to={`/human-design/channels/${ch.id}`}
                    className="flex items-center justify-between p-2 bg-neutral-800/50 hover:bg-neutral-700/50 rounded-lg text-sm transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-humandesign-400 font-serif font-medium">{ch.gate1Number}–{ch.gate2Number}</span>
                      <span className="text-neutral-300 group-hover:text-white transition-colors">{ch.name}</span>
                    </div>
                    <span className="text-xs text-neutral-500 bg-neutral-700 px-1.5 py-0.5 rounded">{ch.circuitType}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Chakra Resonance */}
          {definedCenterChakras.length > 0 && (
            <div className="pt-4 border-t border-neutral-800/50">
              <p className="text-neutral-400 text-sm mb-3">Chakra Resonance — your defined centers in the Hindu-Brahman system</p>
              <div className="flex flex-wrap gap-2">
                {definedCenterChakras.map(chakra => (
                  <Link
                    key={chakra.id}
                    to={`/chakras/${chakra.id}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:opacity-80 transition-opacity border"
                    style={{
                      backgroundColor: chakra.colorHex + '15',
                      borderColor: chakra.colorHex + '40',
                      color: chakra.colorHex,
                    }}
                  >
                    <span className="text-lg">{chakra.symbol}</span>
                    <span className="text-sm font-medium">{chakra.name.replace(' Chakra', '')}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="mt-6 pt-4 border-t border-neutral-800/50 flex flex-wrap gap-3">
            <Link to="/human-design/types" className="text-amber-400 hover:text-amber-300 text-sm">Types →</Link>
            <Link to="/human-design/authorities" className="text-amber-400 hover:text-amber-300 text-sm">Authorities →</Link>
            <Link to="/human-design/profiles" className="text-amber-400 hover:text-amber-300 text-sm">Profiles →</Link>
            <Link to="/human-design/centers" className="text-amber-400 hover:text-amber-300 text-sm">Centers →</Link>
            <Link to="/human-design/channels" className="text-amber-400 hover:text-amber-300 text-sm">Channels →</Link>
          </div>
        </div>
      )}

      {/* Gene Keys Profile */}
      {profile.geneKeysProfile && (
        <div className="bg-gradient-to-br from-purple-500/5 to-purple-600/5 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl text-white flex items-center gap-2">
              <span>✧</span> Gene Keys Profile
            </h2>
            <Link
              to="/profile/gene-keys"
              className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors text-sm"
            >
              View Full Gene Keys Journey →
            </Link>
          </div>

          {/* The Golden Path intro */}
          <div className="mb-6 p-4 bg-neutral-900/30 rounded-lg">
            <p className="text-neutral-300 text-sm">
              Your <span className="text-purple-300">Golden Path</span> is a journey through three sequences that progressively
              unlock your purpose, open your heart, and release your prosperity. Each Gene Key has a Shadow, Gift, and Siddhi frequency.
            </p>
          </div>

          {/* Activation Sequence */}
          <div className="mb-6">
            <Link to="/gene-keys/sequences" className="group">
              <h3 className="text-emerald-300 text-sm font-medium mb-1 flex items-center gap-2 group-hover:text-emerald-200">
                <span>△</span> Activation Sequence
              </h3>
              <p className="text-neutral-500 text-xs mb-3">Your Purpose — How you express your gifts in the world</p>
            </Link>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['lifesWork', 'evolution', 'radiance', 'purpose'].map((sphere) => {
                const sphereData = profile.geneKeysProfile?.[sphere as keyof typeof profile.geneKeysProfile];
                if (!sphereData || typeof sphereData !== 'object' || !('geneKeyId' in sphereData)) return null;
                const gk = geneKeys.get(sphereData.geneKeyId);
                const line = gkLines.get(`gk-line-${sphereData.line}`);
                return (
                  <Link
                    key={sphere}
                    to={`/profile/gene-keys/${sphere}`}
                    className="bg-neutral-900/50 rounded-lg p-3 hover:bg-neutral-800/50 transition-colors group"
                  >
                    <p className="text-emerald-400/80 text-xs mb-1">{sphereData.sphereName}</p>
                    <p className="text-genekey-300 font-medium group-hover:text-genekey-200">
                      Key {sphereData.geneKeyNumber}.{sphereData.line}
                    </p>
                    {gk && (
                      <p className="text-white text-sm mt-1">{gk.name}</p>
                    )}
                    {gk && (
                      <p className="text-neutral-400 text-xs mt-1">
                        {gk.shadow?.name} → {gk.gift?.name} → {gk.siddhi?.name}
                      </p>
                    )}
                    {line && (
                      <p className="text-neutral-500 text-xs mt-1">
                        Line {sphereData.line}: {line.archetype}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Venus Sequence */}
          <div className="mb-6">
            <Link to="/gene-keys/sequences" className="group">
              <h3 className="text-rose-300 text-sm font-medium mb-1 flex items-center gap-2 group-hover:text-rose-200">
                <span>♀</span> Venus Sequence
              </h3>
              <p className="text-neutral-500 text-xs mb-3">Your Relationships — Opening your heart through emotional healing</p>
            </Link>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {['attraction', 'iq', 'eq', 'sq', 'core'].map((sphere) => {
                const sphereData = profile.geneKeysProfile?.[sphere as keyof typeof profile.geneKeysProfile];
                if (!sphereData || typeof sphereData !== 'object' || !('geneKeyId' in sphereData)) return null;
                const gk = geneKeys.get(sphereData.geneKeyId);
                const line = gkLines.get(`gk-line-${sphereData.line}`);
                return (
                  <Link
                    key={sphere}
                    to={`/profile/gene-keys/${sphere}`}
                    className="bg-neutral-900/50 rounded-lg p-3 hover:bg-neutral-800/50 transition-colors group"
                  >
                    <p className="text-rose-400/80 text-xs mb-1">{sphereData.sphereName}</p>
                    <p className="text-genekey-300 font-medium group-hover:text-genekey-200">
                      Key {sphereData.geneKeyNumber}.{sphereData.line}
                    </p>
                    {gk && (
                      <p className="text-white text-sm mt-1">{gk.name}</p>
                    )}
                    {gk && (
                      <p className="text-neutral-400 text-xs mt-1">
                        {gk.shadow?.name} → {gk.gift?.name} → {gk.siddhi?.name}
                      </p>
                    )}
                    {line && (
                      <p className="text-neutral-500 text-xs mt-1">
                        Line {sphereData.line}: {line.archetype}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Pearl Sequence */}
          <div className="mb-6">
            <Link to="/gene-keys/sequences" className="group">
              <h3 className="text-blue-300 text-sm font-medium mb-1 flex items-center gap-2 group-hover:text-blue-200">
                <span>○</span> Pearl Sequence
              </h3>
              <p className="text-neutral-500 text-xs mb-3">Your Prosperity — Aligning your gifts with service to the whole</p>
            </Link>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['vocation', 'culture', 'brand', 'pearl'].map((sphere) => {
                const sphereData = profile.geneKeysProfile?.[sphere as keyof typeof profile.geneKeysProfile];
                if (!sphereData || typeof sphereData !== 'object' || !('geneKeyId' in sphereData)) return null;
                const gk = geneKeys.get(sphereData.geneKeyId);
                const line = gkLines.get(`gk-line-${sphereData.line}`);
                return (
                  <Link
                    key={sphere}
                    to={`/profile/gene-keys/${sphere}`}
                    className="bg-neutral-900/50 rounded-lg p-3 hover:bg-neutral-800/50 transition-colors group"
                  >
                    <p className="text-blue-400/80 text-xs mb-1">{sphereData.sphereName}</p>
                    <p className="text-genekey-300 font-medium group-hover:text-genekey-200">
                      Key {sphereData.geneKeyNumber}.{sphereData.line}
                    </p>
                    {gk && (
                      <p className="text-white text-sm mt-1">{gk.name}</p>
                    )}
                    {gk && (
                      <p className="text-neutral-400 text-xs mt-1">
                        {gk.shadow?.name} → {gk.gift?.name} → {gk.siddhi?.name}
                      </p>
                    )}
                    {line && (
                      <p className="text-neutral-500 text-xs mt-1">
                        Line {sphereData.line}: {line.archetype}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Codon Rings Present in Chart */}
          {chartCodonRings.length > 0 && (
            <div className="mb-6">
              <h3 className="text-neutral-300 text-sm font-medium mb-2 flex items-center gap-2">
                <span className="text-genekey-500">⬡</span> Codon Rings in Your Chart
              </h3>
              <p className="text-neutral-500 text-xs mb-3">
                The biological codons activated by your Gene Keys profile
              </p>
              <div className="flex flex-wrap gap-2">
                {chartCodonRings.map(ring => (
                  <Link
                    key={ring.id}
                    to={`/gene-keys/codon-rings/${ring.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-genekey-500/10 text-genekey-300 border border-genekey-500/20 rounded-lg text-sm hover:bg-genekey-500/20 transition-colors"
                  >
                    <span className="text-genekey-500 text-xs">⬡</span>
                    {ring.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="mt-6 pt-4 border-t border-neutral-800/50 flex flex-wrap gap-3">
            <Link to="/gene-keys/sequences" className="text-purple-400 hover:text-purple-300 text-sm">Sequences →</Link>
            <Link to="/gene-keys/spheres" className="text-purple-400 hover:text-purple-300 text-sm">Spheres →</Link>
            <Link to="/gene-keys/lines" className="text-purple-400 hover:text-purple-300 text-sm">Lines →</Link>
            <Link to="/gene-keys/codon-rings" className="text-purple-400 hover:text-purple-300 text-sm">Codon Rings →</Link>
            <Link to="/gene-keys/amino-acids" className="text-purple-400 hover:text-purple-300 text-sm">Amino Acids →</Link>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/contemplate', {
            state: {
              seed: {
                category: 'astrology',
                contemplationType: 'natalOverview',
              },
            },
          })}
          className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-colors text-left w-full"
        >
          <span className="text-2xl">✦</span>
          <div>
            <p className="font-medium text-white">Contemplate Your Chart</p>
            <p className="text-neutral-500 text-sm">Explore with AI wisdom guide</p>
          </div>
        </button>
        <Link
          to="/wheel"
          className="flex items-center gap-3 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <span className="text-2xl">☉</span>
          <div>
            <p className="font-medium text-white">View Chart Wheel</p>
            <p className="text-neutral-500 text-sm">See your placements on the mandala</p>
          </div>
        </Link>
        <Link
          to="/graph"
          className="flex items-center gap-3 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <span className="text-2xl">⚭</span>
          <div>
            <p className="font-medium text-white">Explore Relationships</p>
            <p className="text-neutral-500 text-sm">Discover cosmic connections</p>
          </div>
        </Link>
        <Link
          to="/elements"
          className="flex items-center gap-3 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          <span className="text-2xl">🜂</span>
          <div>
            <p className="font-medium text-white">Learn About Elements</p>
            <p className="text-neutral-500 text-sm">Deepen your elemental understanding</p>
          </div>
        </Link>
      </div>

      {/* Data Management */}
      <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h2 className="font-serif text-xl text-white mb-4">Data Management</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              exportUserData();
              setExportSuccess(true);
              setTimeout(() => setExportSuccess(false), 2000);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-neutral-200 rounded-lg hover:bg-neutral-700 transition-colors text-sm"
          >
            {exportSuccess ? (
              <>
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-400">Exported!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export My Data</span>
              </>
            )}
          </button>
          <p className="text-neutral-500 text-sm">
            Download all your profiles, insights, sessions, and pathway progress as JSON.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
export default Profile;
