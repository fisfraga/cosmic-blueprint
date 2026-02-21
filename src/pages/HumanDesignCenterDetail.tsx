import { useParams, Link } from 'react-router-dom';
import { hdCenters, hdGates, getGatesByCenter, getChannelsForCenter, geneKeys, chakras } from '../data';

export function HumanDesignCenterDetail() {
  const { id } = useParams<{ id: string }>();
  const center = id ? hdCenters.get(id) : undefined;

  if (!center) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Center Not Found</h1>
        <Link to="/human-design/centers" className="text-humandesign-400 hover:underline">
          Back to Centers
        </Link>
      </div>
    );
  }

  const gates = getGatesByCenter(center.id);
  const channels = getChannelsForCenter(center.id);
  const relatedChakra = Array.from(chakras.values()).find(c => c.relatedHDCenters.includes(center.id));

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="text-center py-8">
        <div className="text-5xl mb-4">{center.symbol}</div>
        <h1 className="font-serif text-4xl font-medium mb-2">{center.name}</h1>
        <p className="text-xl text-humandesign-400 mb-2">{center.centerType} Center</p>
        <p className="text-theme-text-secondary">{center.biologicalCorrelate}</p>
      </header>

      {/* Description */}
      {center.description && (
        <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <p className="text-theme-text-secondary leading-relaxed">{center.description}</p>
        </section>
      )}

      {/* Chakra Resonance */}
      {relatedChakra && (
        <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl mb-4">Chakra Resonance</h2>
          <p className="text-theme-text-tertiary text-sm mb-4">
            In the Hindu-Brahman tradition underlying Human Design, this center resonates with a corresponding chakra energy center.
          </p>
          <Link
            to={`/chakras/${relatedChakra.id}`}
            className="flex items-center gap-4 p-4 rounded-lg bg-surface-overlay hover:bg-surface-raised transition-colors border border-theme-border-subtle"
          >
            <div
              className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-xl"
              style={{ backgroundColor: relatedChakra.colorHex + '33', border: `2px solid ${relatedChakra.colorHex}66` }}
            >
              {relatedChakra.symbol}
            </div>
            <div>
              <p className="text-theme-text-primary font-medium">{relatedChakra.name}</p>
              <p className="text-theme-text-secondary text-sm italic">{relatedChakra.sanskritName}</p>
              <p className="text-theme-text-tertiary text-xs mt-1">{relatedChakra.lifeTheme}</p>
            </div>
          </Link>
        </section>
      )}

      {/* Defined vs Undefined */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-humandesign-500/10 to-humandesign-600/5 rounded-xl p-6 border border-humandesign-500/20">
          <h2 className="font-serif text-xl mb-3 text-humandesign-300">Defined</h2>
          <p className="text-theme-text-secondary">{center.definedMeaning}</p>
        </div>
        <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl mb-3 text-theme-text-secondary">Undefined</h2>
          <p className="text-theme-text-secondary">{center.undefinedMeaning}</p>
        </div>
      </section>

      {/* Gates in this Center */}
      <section>
        <h2 className="font-serif text-2xl mb-4">Gates ({gates.length})</h2>
        <p className="text-theme-text-secondary mb-4">
          These gates are located in the {center.name} and express their energy through this center's qualities.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gates.map(gate => {
            const gk = gate.geneKeyId ? geneKeys.get(gate.geneKeyId) : undefined;
            return (
              <Link
                key={gate.id}
                to={`/human-design/${gate.id}`}
                className="bg-surface-base/50 rounded-xl p-4 border border-theme-border-subtle hover:border-humandesign-500/50 hover:bg-surface-base transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl font-serif text-humandesign-400">{gate.gateNumber}</span>
                  {gk && (
                    <div className="text-right">
                      <span className="text-xs text-genekey-400 block">GK {gk.keyNumber}</span>
                      <span className="text-xs text-red-400/60 block leading-tight">{gk.shadow.name}</span>
                      <span className="text-xs text-emerald-400/60 block leading-tight">{gk.gift.name}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-theme-text-primary group-hover:text-humandesign-300 transition-colors mb-1">
                  {gate.name}
                </h3>
                <p className="text-theme-text-tertiary text-sm">{gate.iChingName}</p>
                {gate.keywords && gate.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {gate.keywords.slice(0, 2).map((kw, i) => (
                      <span key={i} className="text-xs text-theme-text-secondary bg-surface-raised px-2 py-0.5 rounded">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Channels connecting to this Center */}
      {channels.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl mb-4">Connected Channels ({channels.length})</h2>
          <p className="text-theme-text-secondary mb-4">
            These channels connect the {center.name} to other centers in the body graph.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {channels.map(channel => {
              const gate1 = hdGates.get(channel.gate1Id);
              const gate2 = hdGates.get(channel.gate2Id);
              const otherCenterId = channel.center1Id === center.id ? channel.center2Id : channel.center1Id;
              const otherCenter = hdCenters.get(otherCenterId);

              return (
                <Link
                  key={channel.id}
                  to={`/human-design/channels/${channel.id}`}
                  className="bg-surface-base/50 rounded-xl p-4 border border-theme-border-subtle hover:border-humandesign-500/50 hover:bg-surface-base transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-serif text-humandesign-400">
                        {channel.gate1Number}-{channel.gate2Number}
                      </span>
                    </div>
                    <span className="text-xs text-theme-text-tertiary bg-surface-raised px-2 py-0.5 rounded">
                      {channel.circuitType}
                    </span>
                  </div>
                  <h3 className="font-medium text-theme-text-primary group-hover:text-humandesign-300 transition-colors mb-1">
                    {channel.name}
                  </h3>
                  <p className="text-theme-text-tertiary text-sm">
                    {gate1?.name || `Gate ${channel.gate1Number}`} &#8594; {gate2?.name || `Gate ${channel.gate2Number}`}
                  </p>
                  {otherCenter && (
                    <p className="text-humandesign-400 text-xs mt-2">
                      Connects to: {otherCenter.name}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Back Link */}
      <div className="text-center pt-4">
        <Link to="/human-design/centers" className="text-theme-text-secondary hover:text-theme-text-primary transition-colors">
          &#8592; Back to Centers
        </Link>
      </div>
    </div>
  );
}
export default HumanDesignCenterDetail;
