import { useParams, Link } from 'react-router-dom';
import { hdChannels, hdGates, hdCenters, geneKeys, chakras, aminoAcids } from '../data';

export function HumanDesignChannelDetail() {
  const { id } = useParams<{ id: string }>();
  const channel = id ? hdChannels.get(id) : undefined;

  if (!channel) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Channel Not Found</h1>
        <Link to="/human-design/channels" className="text-humandesign-400 hover:underline">
          Back to Channels
        </Link>
      </div>
    );
  }

  const gate1 = hdGates.get(channel.gate1Id);
  const gate2 = hdGates.get(channel.gate2Id);
  const center1 = hdCenters.get(channel.center1Id);
  const center2 = hdCenters.get(channel.center2Id);
  const geneKey1 = gate1?.geneKeyId ? geneKeys.get(gate1.geneKeyId) : undefined;
  const geneKey2 = gate2?.geneKeyId ? geneKeys.get(gate2.geneKeyId) : undefined;
  const amino1 = geneKey1?.aminoAcidId ? aminoAcids.get(geneKey1.aminoAcidId) : undefined;
  const amino2 = geneKey2?.aminoAcidId ? aminoAcids.get(geneKey2.aminoAcidId) : undefined;

  // Chakras resonating with this channel's two centers
  const allChakras = Array.from(chakras.values());
  const chakra1 = center1 ? allChakras.find((c) => c.relatedHDCenters.includes(center1.id)) : undefined;
  const chakra2 = center2 && center2.id !== center1?.id
    ? allChakras.find((c) => c.relatedHDCenters.includes(center2.id))
    : undefined;
  const uniqueChakras = [chakra1, chakra2].filter(Boolean).filter(
    (c, i, arr) => arr.findIndex((x) => x?.id === c?.id) === i
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="text-center py-8">
        <div className="text-5xl font-serif mb-4 text-humandesign-400">
          {channel.gate1Number}-{channel.gate2Number}
        </div>
        <h1 className="font-serif text-4xl font-medium mb-2">{channel.name}</h1>
        <p className="text-xl text-humandesign-400 mb-2">{channel.theme}</p>

        {/* Type Pills */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="px-3 py-1.5 bg-humandesign-500/20 text-humandesign-400 rounded-full">
            {channel.circuitType} Circuit
          </span>
          {channel.streamType && (
            <span className="px-3 py-1.5 bg-neutral-800 text-neutral-400 rounded-full">
              {channel.streamType} Stream
            </span>
          )}
        </div>
      </header>

      {/* Centers Connection */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800 text-center">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to={`/human-design/centers/${center1?.id}`}
            className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <p className="text-neutral-400 text-xs">Center</p>
            <p className="text-white font-medium">{center1?.name}</p>
          </Link>
          <span className="text-humandesign-400 text-2xl">&#8644;</span>
          <Link
            to={`/human-design/centers/${center2?.id}`}
            className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <p className="text-neutral-400 text-xs">Center</p>
            <p className="text-white font-medium">{center2?.name}</p>
          </Link>
        </div>
      </section>

      {/* Description */}
      {channel.description && (
        <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <p className="text-neutral-300 leading-relaxed">{channel.description}</p>
        </section>
      )}

      {/* Gift & Challenge */}
      <section className="grid md:grid-cols-2 gap-4">
        {channel.giftExpression && (
          <div className="bg-gradient-to-br from-humandesign-500/10 to-humandesign-600/5 rounded-xl p-6 border border-humandesign-500/20">
            <h2 className="font-serif text-xl mb-3 text-humandesign-300">Gift Expression</h2>
            <p className="text-neutral-300">{channel.giftExpression}</p>
          </div>
        )}
        {channel.challengeExpression && (
          <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
            <h2 className="font-serif text-xl mb-3 text-neutral-400">Challenge Expression</h2>
            <p className="text-neutral-300">{channel.challengeExpression}</p>
          </div>
        )}
      </section>

      {/* Keywords */}
      {channel.keywords && channel.keywords.length > 0 && (
        <section className="text-center">
          <div className="flex flex-wrap justify-center gap-2">
            {channel.keywords.map((kw, i) => (
              <span key={i} className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg text-sm">
                {kw}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* The Two Gates */}
      <section>
        <h2 className="font-serif text-2xl mb-4">The Gates</h2>
        <p className="text-neutral-400 mb-6">
          This channel is formed when both Gate {channel.gate1Number} and Gate {channel.gate2Number} are
          activated in your chart, creating a defined energy flow between the {center1?.name} and {center2?.name}.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Gate 1 */}
          {gate1 && (
            <Link
              to={`/human-design/${gate1.id}`}
              className="bg-neutral-900/50 rounded-xl p-5 border border-neutral-800 hover:border-humandesign-500/50 hover:bg-neutral-900 transition-all group"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl font-serif text-humandesign-400">{gate1.gateNumber}</span>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-white group-hover:text-humandesign-300 transition-colors mb-1">
                    {gate1.name}
                  </h3>
                  <p className="text-neutral-500 text-sm mb-2">{gate1.iChingName}</p>
                  {gate1.coreTheme && (
                    <p className="text-humandesign-400/80 text-sm line-clamp-2">{gate1.coreTheme}</p>
                  )}
                </div>
              </div>
            </Link>
          )}

          {/* Gate 2 */}
          {gate2 && (
            <Link
              to={`/human-design/${gate2.id}`}
              className="bg-neutral-900/50 rounded-xl p-5 border border-neutral-800 hover:border-humandesign-500/50 hover:bg-neutral-900 transition-all group"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl font-serif text-humandesign-400">{gate2.gateNumber}</span>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-white group-hover:text-humandesign-300 transition-colors mb-1">
                    {gate2.name}
                  </h3>
                  <p className="text-neutral-500 text-sm mb-2">{gate2.iChingName}</p>
                  {gate2.coreTheme && (
                    <p className="text-humandesign-400/80 text-sm line-clamp-2">{gate2.coreTheme}</p>
                  )}
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Corresponding Gene Keys */}
      {(geneKey1 || geneKey2) && (
        <section>
          <h2 className="font-serif text-2xl mb-4">Corresponding Gene Keys</h2>
          <p className="text-neutral-400 mb-6">
            Each HD Gate corresponds to a Gene Key that shares the same number and archetypal energy.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {geneKey1 && (
              <Link
                to={`/gene-keys/${geneKey1.id}`}
                className="bg-neutral-900/50 rounded-xl p-5 border border-neutral-800 hover:border-genekey-500/50 hover:bg-neutral-900 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl font-serif text-genekey-400">{geneKey1.keyNumber}</span>
                  <div className="flex-1">
                    <h3 className="font-serif text-lg text-white group-hover:text-genekey-300 transition-colors mb-1">
                      {geneKey1.name}
                    </h3>
                    <div className="text-sm space-y-0.5">
                      <p className="text-red-400/80">{geneKey1.shadow.name}</p>
                      <p className="text-genekey-400">{geneKey1.gift.name}</p>
                      <p className="text-yellow-400/80">{geneKey1.siddhi.name}</p>
                    </div>
                    {amino1 && (
                      <div className="mt-2 pt-2 border-t border-neutral-800 flex items-center gap-2">
                        <span className="text-genekey-500 font-mono text-xs">{amino1.symbol}</span>
                        <span className="text-neutral-500 text-xs">{amino1.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )}

            {geneKey2 && (
              <Link
                to={`/gene-keys/${geneKey2.id}`}
                className="bg-neutral-900/50 rounded-xl p-5 border border-neutral-800 hover:border-genekey-500/50 hover:bg-neutral-900 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl font-serif text-genekey-400">{geneKey2.keyNumber}</span>
                  <div className="flex-1">
                    <h3 className="font-serif text-lg text-white group-hover:text-genekey-300 transition-colors mb-1">
                      {geneKey2.name}
                    </h3>
                    <div className="text-sm space-y-0.5">
                      <p className="text-red-400/80">{geneKey2.shadow.name}</p>
                      <p className="text-genekey-400">{geneKey2.gift.name}</p>
                      <p className="text-yellow-400/80">{geneKey2.siddhi.name}</p>
                    </div>
                    {amino2 && (
                      <div className="mt-2 pt-2 border-t border-neutral-800 flex items-center gap-2">
                        <span className="text-genekey-500 font-mono text-xs">{amino2.symbol}</span>
                        <span className="text-neutral-500 text-xs">{amino2.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Chakra Resonance */}
      {uniqueChakras.length > 0 && (
        <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h2 className="font-serif text-xl mb-2">Chakra Resonance</h2>
          <p className="text-neutral-500 text-sm mb-4">
            The energy centers bridged by this channel resonate with the following chakras in the Hindu-Brahman tradition.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {uniqueChakras.map((chakra) => chakra && (
              <Link
                key={chakra.id}
                to={`/chakras/${chakra.id}`}
                className="flex items-center gap-4 p-4 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors border border-neutral-700"
              >
                <div
                  className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-xl"
                  style={{ backgroundColor: chakra.colorHex + '33', border: `2px solid ${chakra.colorHex}66` }}
                >
                  {chakra.symbol}
                </div>
                <div>
                  <p className="text-white font-medium">{chakra.name}</p>
                  <p className="text-neutral-400 text-sm italic">{chakra.sanskritName}</p>
                  <p className="text-neutral-500 text-xs mt-0.5">{chakra.lifeTheme}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back Link */}
      <div className="text-center pt-4">
        <Link to="/human-design/channels" className="text-neutral-400 hover:text-white transition-colors">
          &#8592; Back to Channels
        </Link>
      </div>
    </div>
  );
}
export default HumanDesignChannelDetail;
