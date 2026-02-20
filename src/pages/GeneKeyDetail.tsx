import { useParams, Link } from 'react-router-dom';
import { geneKeys, codonRings, signs, aminoAcids, getProgrammingPartner, getGateByGeneKey } from '../data';

export function GeneKeyDetail() {
  const { id } = useParams<{ id: string }>();
  const geneKey = id ? geneKeys.get(id) : undefined;

  if (!geneKey) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Gene Key Not Found</h1>
        <Link to="/gene-keys" className="text-genekey-400 hover:underline">
          Back to Gene Keys
        </Link>
      </div>
    );
  }

  const correspondingGate = getGateByGeneKey(geneKey.id);
  const programmingPartner = getProgrammingPartner(geneKey.id);
  const codonRing = geneKey.codonRingId ? codonRings.get(geneKey.codonRingId) : undefined;
  const zodiacSign = geneKey.tropicalSignId ? signs.get(geneKey.tropicalSignId) : undefined;
  const aminoAcid = geneKey.aminoAcidId ? aminoAcids.get(geneKey.aminoAcidId) : undefined;

  // Prev/next navigation by keyNumber (1–64)
  const sortedKeys = Array.from(geneKeys.values()).sort((a, b) => a.keyNumber - b.keyNumber);
  const currentIndex = sortedKeys.findIndex(k => k.id === geneKey.id);
  const prevKey = currentIndex > 0 ? sortedKeys[currentIndex - 1] : undefined;
  const nextKey = currentIndex < sortedKeys.length - 1 ? sortedKeys[currentIndex + 1] : undefined;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="text-center py-8">
        <div className="text-6xl mb-4 font-serif text-genekey-400">{geneKey.keyNumber}</div>
        <h1 className="font-serif text-4xl font-medium mb-2">{geneKey.name}</h1>
        <p className="text-xl text-neutral-300 italic mb-4">Gene Key {geneKey.keyNumber}</p>

        {/* Spectrum Pills */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-full">
            {geneKey.shadow.name}
          </span>
          <span className="text-neutral-500">&#8594;</span>
          <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full">
            {geneKey.gift.name}
          </span>
          <span className="text-neutral-500">&#8594;</span>
          <span className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-full">
            {geneKey.siddhi.name}
          </span>
        </div>
      </header>

      {/* Description */}
      {geneKey.description && (
        <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <p className="text-neutral-300 leading-relaxed">{geneKey.description}</p>
        </section>
      )}

      {/* Shadow Section */}
      <section className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl p-6 border border-red-500/20">
        <h2 className="font-serif text-xl mb-2 text-red-400">Shadow: {geneKey.shadow.name}</h2>
        {geneKey.shadow.keyExpression && (
          <p className="text-neutral-400 italic mb-4">{geneKey.shadow.keyExpression}</p>
        )}
        {geneKey.shadow.description && (
          <p className="text-neutral-300 leading-relaxed mb-4">{geneKey.shadow.description}</p>
        )}
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          {geneKey.shadow.repressiveNature && (
            <div className="bg-neutral-900/50 rounded-lg p-4">
              <h4 className="text-neutral-400 mb-1">Repressive Nature</h4>
              <p className="text-neutral-300">{geneKey.shadow.repressiveNature}</p>
            </div>
          )}
          {geneKey.shadow.reactiveNature && (
            <div className="bg-neutral-900/50 rounded-lg p-4">
              <h4 className="text-neutral-400 mb-1">Reactive Nature</h4>
              <p className="text-neutral-300">{geneKey.shadow.reactiveNature}</p>
            </div>
          )}
        </div>
      </section>

      {/* Gift Section */}
      <section className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl p-6 border border-emerald-500/20">
        <h2 className="font-serif text-xl mb-2 text-emerald-400">Gift: {geneKey.gift.name}</h2>
        {geneKey.gift.keyExpression && (
          <p className="text-neutral-400 italic mb-4">{geneKey.gift.keyExpression}</p>
        )}
        {geneKey.gift.description && (
          <p className="text-neutral-300 leading-relaxed">{geneKey.gift.description}</p>
        )}
      </section>

      {/* Siddhi Section */}
      <section className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-6 border border-purple-500/20">
        <h2 className="font-serif text-xl mb-2 text-purple-400">Siddhi: {geneKey.siddhi.name}</h2>
        {geneKey.siddhi.keyExpression && (
          <p className="text-neutral-400 italic mb-4">{geneKey.siddhi.keyExpression}</p>
        )}
        {geneKey.siddhi.description && (
          <p className="text-neutral-300 leading-relaxed">{geneKey.siddhi.description}</p>
        )}
      </section>

      {/* Connections */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h2 className="font-serif text-xl mb-4">Connections</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Programming Partner */}
          {programmingPartner && (
            <Link
              to={`/gene-keys/${programmingPartner.id}`}
              className="p-4 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors border border-neutral-700"
            >
              <h4 className="text-neutral-400 text-sm mb-1">Programming Partner</h4>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-serif text-genekey-400">{programmingPartner.keyNumber}</span>
                <div>
                  <p className="text-white font-medium">{programmingPartner.name}</p>
                  <p className="text-neutral-500 text-sm">
                    {programmingPartner.shadow.name} &#8594; {programmingPartner.gift.name}
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* Corresponding HD Gate */}
          {correspondingGate && (
            <Link
              to={`/human-design/${correspondingGate.id}`}
              className="p-4 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors border border-neutral-700"
            >
              <h4 className="text-neutral-400 text-sm mb-1">Human Design Gate</h4>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-serif text-humandesign-400">{correspondingGate.gateNumber}</span>
                <div>
                  <p className="text-white font-medium">{correspondingGate.name}</p>
                  <p className="text-neutral-500 text-sm">{correspondingGate.iChingName}</p>
                </div>
              </div>
            </Link>
          )}

          {/* Codon Ring */}
          {codonRing && (
            <Link
              to={`/gene-keys/codon-rings/${codonRing.id}`}
              className="p-4 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors border border-neutral-700"
            >
              <h4 className="text-neutral-400 text-sm mb-1">Codon Ring</h4>
              <div>
                <p className="text-white font-medium">{codonRing.name}</p>
                <p className="text-genekey-400 text-sm">{codonRing.theme}</p>
              </div>
            </Link>
          )}

          {/* Zodiac Sign */}
          {zodiacSign && (
            <Link
              to={`/signs/${zodiacSign.id}`}
              className="p-4 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors border border-neutral-700"
            >
              <h4 className="text-neutral-400 text-sm mb-1">Zodiac Position</h4>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{zodiacSign.symbol}</span>
                <div>
                  <p className="text-white font-medium">{zodiacSign.name}</p>
                  <p className="text-neutral-500 text-sm">
                    {geneKey.degreeStart}° - {geneKey.degreeEnd}°
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* Amino Acid */}
          {aminoAcid && (
            <Link
              to={`/gene-keys/amino-acids/${aminoAcid.id}`}
              className="p-4 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors border border-neutral-700"
            >
              <h4 className="text-neutral-400 text-sm mb-1">Amino Acid</h4>
              <div className="flex items-start gap-3">
                <span className="text-lg font-mono text-genekey-400 w-10 flex-shrink-0">{aminoAcid.symbol}</span>
                <div>
                  <p className="text-white font-medium">{aminoAcid.name}</p>
                  <p className="text-neutral-500 text-xs mt-1 leading-snug line-clamp-2">
                    {aminoAcid.consciousnessQuality}
                  </p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Physiology */}
      {geneKey.physiology && (
        <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h2 className="font-serif text-xl mb-3">Physiology</h2>
          <p className="text-neutral-300">{geneKey.physiology}</p>
        </section>
      )}

      {/* External Link */}
      {geneKey.url && (
        <section className="text-center">
          <a
            href={geneKey.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-genekey-500/20 hover:bg-genekey-500/30 text-genekey-300 rounded-lg transition-colors"
          >
            Read more at genekeys.com
            <span>&#8599;</span>
          </a>
        </section>
      )}

      {/* Navigation */}
      <nav className="flex items-center justify-between pt-6 border-t border-neutral-800">
        {prevKey ? (
          <Link
            to={`/gene-keys/${prevKey.id}`}
            className="flex items-center gap-2 text-neutral-400 hover:text-genekey-300 transition-colors group"
          >
            <span className="text-lg">&#8592;</span>
            <div className="text-left">
              <p className="text-xs text-neutral-600">Previous</p>
              <p className="text-sm group-hover:text-genekey-300">
                <span className="font-serif text-genekey-400 mr-1">{prevKey.keyNumber}</span>
                {prevKey.name}
              </p>
            </div>
          </Link>
        ) : <span />}

        <Link to="/gene-keys" className="text-neutral-500 hover:text-white transition-colors text-sm">
          All Keys
        </Link>

        {nextKey ? (
          <Link
            to={`/gene-keys/${nextKey.id}`}
            className="flex items-center gap-2 text-neutral-400 hover:text-genekey-300 transition-colors group text-right"
          >
            <div className="text-right">
              <p className="text-xs text-neutral-600">Next</p>
              <p className="text-sm group-hover:text-genekey-300">
                {nextKey.name}
                <span className="font-serif text-genekey-400 ml-1">{nextKey.keyNumber}</span>
              </p>
            </div>
            <span className="text-lg">&#8594;</span>
          </Link>
        ) : <span />}
      </nav>
    </div>
  );
}
export default GeneKeyDetail;
