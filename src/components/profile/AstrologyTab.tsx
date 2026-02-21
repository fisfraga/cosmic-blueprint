import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { aspects, geneKeys, hdGates, gkLines } from '../../data';
import {
  elementColors,
  aspectColors,
  getSignData,
  getPlanetData,
  getHouseData,
  hdPlanetMap,
  type ProfileTabProps,
} from './profileConstants';

export function AstrologyTab({ profile }: ProfileTabProps) {
  const { elementalAnalysis, placements } = profile;
  const totalPlanets = elementalAnalysis.fire + elementalAnalysis.earth + elementalAnalysis.air + elementalAnalysis.water;

  // Rising sign (ASC)
  const ascendant = profile.housePositions.find(h => h.houseId === 'house-1');
  const risingSign = ascendant ? getSignData(ascendant.signId) : null;

  return (
    <>
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

            const hdPlanetName = hdPlanetMap[placement.planetId];

            // Get gate info from HD profile personality gates
            const hdGateData = hdPlanetName && profile.humanDesignProfile?.personalityGates?.find(g => g.planet === hdPlanetName);
            const gk = hdGateData ? geneKeys.get(`gene-key-${hdGateData.gateNumber}`) : null;

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
                      {hdGateData && <span className="text-amber-400 mx-1">• {hdGateData.gateNumber}.{hdGateData.line}</span>}
                      {' '}• {house?.name}
                      {placement.retrograde && ' • ℞'}
                    </p>
                    {hdGateData && gk && (
                      <Link
                        to={`/gene-keys/gk-${hdGateData.gateNumber}`}
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
    </>
  );
}
