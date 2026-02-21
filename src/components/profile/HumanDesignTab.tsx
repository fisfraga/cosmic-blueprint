import { Link } from 'react-router-dom';
import { geneKeys, hdGates, hdCenters, hdChannels, chakras } from '../../data';
import { type ProfileTabProps } from './profileConstants';

export function HumanDesignTab({ profile }: ProfileTabProps) {
  if (!profile.humanDesignProfile) return null;

  // Compute all gate numbers and active channels
  const allGateNumbers = new Set<number>([
    ...(profile.humanDesignProfile.personalityGates?.map(g => g.gateNumber) ?? []),
    ...(profile.humanDesignProfile.designGates?.map(g => g.gateNumber) ?? []),
  ]);

  const activeChannels = Array.from(hdChannels.values()).filter(
    ch => allGateNumbers.has(ch.gate1Number) && allGateNumbers.has(ch.gate2Number)
  );

  const definedCenterChakras = (profile.humanDesignProfile.definedCenterIds ?? [])
    .map(cId => Array.from(chakras.values()).find(c => c.relatedHDCenters.includes(cId)))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .filter((c, i, arr) => arr.findIndex(x => x.id === c.id) === i);

  return (
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
  );
}
