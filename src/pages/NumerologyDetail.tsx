import { useParams, Link } from 'react-router-dom';
import { numerologyNumbers, chakras, planets, geneKeys } from '../data';

export function NumerologyDetail() {
  const { id } = useParams<{ id: string }>();
  const num = id ? numerologyNumbers.get(id) : undefined;

  if (!num) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Number Not Found</h1>
        <Link to="/numerology" className="text-cyan-400 hover:underline">
          Back to Numerology
        </Link>
      </div>
    );
  }

  const chakra = chakras.get(num.chakraId);
  const planet = planets.get(num.planet);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="text-center py-8">
        <div className={`text-6xl mb-4 font-serif ${num.isMasterNumber ? 'text-cyan-300' : 'text-cyan-400'}`}>
          {num.symbol}
        </div>
        <h1 className="font-serif text-4xl font-medium mb-2">{num.name}</h1>
        <p className="text-xl text-neutral-300 italic mb-2">{num.harmonicTone}</p>
        <p className="text-neutral-500 mb-4">{num.archetype}</p>

        {/* Spectrum Pills */}
        <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
          <span className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-full">
            {num.lowerExpression.name}
          </span>
          <span className="text-neutral-500">→</span>
          <span className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-full">
            {num.highestExpression.name}
          </span>
        </div>

        {/* Meta badges */}
        <div className="flex items-center justify-center gap-3 mt-4 flex-wrap text-sm">
          {num.isMasterNumber && (
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
              Master Number
            </span>
          )}
          {planet && (
            <Link
              to={`/planets/${planet.id}`}
              className="px-3 py-1 bg-neutral-800 text-neutral-300 rounded-full hover:bg-neutral-700 hover:text-white transition-colors"
            >
              {planet.symbol} {planet.name}
            </Link>
          )}
          <span className="px-3 py-1 bg-neutral-800 text-neutral-300 rounded-full capitalize">
            {num.element}
          </span>
          {num.solfeggioHz && (
            <span className="px-3 py-1 bg-neutral-800 text-neutral-400 rounded-full">
              {num.solfeggioHz} Hz
            </span>
          )}
        </div>
      </header>

      {/* Adam Apollo Essence */}
      <section className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 rounded-xl p-6 border border-cyan-500/20">
        <h2 className="font-serif text-lg mb-3 text-cyan-300">Harmonic Essence</h2>
        <p className="text-neutral-300 leading-relaxed italic">"{num.adamApolloEssence}"</p>
      </section>

      {/* Lower Expression */}
      <section className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl p-6 border border-red-500/20">
        <h2 className="font-serif text-xl mb-2 text-red-400">Lower Expression: {num.lowerExpression.name}</h2>
        {num.lowerExpressionPattern && (
          <p className="text-neutral-500 text-sm italic mb-3">{num.lowerExpressionPattern}</p>
        )}
        <p className="text-neutral-300 leading-relaxed mb-4">{num.lowerExpression.expression}</p>
        {num.lowerExpression.blockingBelief && (
          <div className="bg-neutral-900/60 rounded-lg p-4 border border-red-500/10">
            <h4 className="text-red-400/70 text-sm mb-1">Blocking Pattern</h4>
            <p className="text-neutral-400 italic text-sm">"{num.lowerExpression.blockingBelief}"</p>
          </div>
        )}
      </section>

      {/* Highest Expression */}
      <section className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-6 border border-purple-500/20">
        <h2 className="font-serif text-xl mb-2 text-purple-400">Highest Expression: {num.highestExpression.name}</h2>
        <p className="text-neutral-300 leading-relaxed">{num.highestExpression.expression}</p>
      </section>

      {/* Life Path & Destiny Meanings */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h2 className="font-serif text-lg mb-3 text-neutral-200">Life Path Meaning</h2>
          <p className="text-neutral-300 text-sm leading-relaxed">{num.lifePathMeaning}</p>
        </div>
        <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h2 className="font-serif text-lg mb-3 text-neutral-200">Destiny Meaning</h2>
          <p className="text-neutral-300 text-sm leading-relaxed">{num.destinyMeaning}</p>
        </div>
      </section>

      {/* Life Path Calculation */}
      {num.lifePathCalculation && (
        <section className="bg-neutral-900/50 rounded-xl p-5 border border-neutral-800">
          <h3 className="text-neutral-400 text-sm mb-2">Calculation Method</h3>
          <p className="text-neutral-400 text-sm font-mono">{num.lifePathCalculation}</p>
        </section>
      )}

      {/* Chakra Connection */}
      {chakra && (
        <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h2 className="font-serif text-xl mb-4">Chakra Connection</h2>
          <Link
            to={`/chakras/${chakra.id}`}
            className="flex items-center gap-4 p-4 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors border border-neutral-700"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-serif flex-shrink-0"
              style={{ backgroundColor: chakra.colorHex + '33', border: `2px solid ${chakra.colorHex}55` }}
            >
              {chakra.symbol}
            </div>
            <div>
              <p className="text-white font-medium">{chakra.name}</p>
              <p className="text-neutral-400 text-sm">{chakra.sanskritName}</p>
              <p className="text-neutral-500 text-xs mt-1">{chakra.lifeTheme}</p>
            </div>
          </Link>
        </section>
      )}

      {/* Related Gene Keys & Gates */}
      {num.relatedGates && num.relatedGates.length > 0 && (() => {
        const relatedGKs = num.relatedGates
          .map((n) => geneKeys.get(`gk-${n}`))
          .filter(Boolean);
        if (relatedGKs.length === 0) return null;
        return (
          <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
            <h2 className="font-serif text-xl mb-4">Related Gene Keys & Gates</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {relatedGKs.map((gk) => gk && (
                <Link
                  key={gk.id}
                  to={`/gene-keys/${gk.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors border border-neutral-700 group"
                >
                  <span className="w-9 h-9 flex-shrink-0 flex items-center justify-center text-sm font-medium bg-genekey-500/20 text-genekey-400 rounded-full border border-genekey-500/30">
                    {gk.keyNumber}
                  </span>
                  <div className="min-w-0">
                    <p className="text-white text-sm group-hover:text-genekey-300 transition-colors">
                      Gene Key {gk.keyNumber}
                    </p>
                    <p className="text-neutral-500 text-xs truncate">
                      <span className="text-red-400/70">{gk.shadow.name}</span>
                      {' → '}
                      <span className="text-emerald-400/70">{gk.gift.name}</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })()}

      {/* Affirmation */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800 text-center">
        <h2 className="font-serif text-lg mb-3 text-cyan-300">Affirmation</h2>
        <p className="text-neutral-200 italic text-lg">"{num.affirmation}"</p>
      </section>

      {/* Contemplative Question */}
      <section className="bg-gradient-to-br from-neutral-900/80 to-neutral-800/30 rounded-xl p-6 border border-neutral-700">
        <h2 className="font-serif text-lg mb-3 text-neutral-300">For Contemplation</h2>
        <p className="text-neutral-300 italic leading-relaxed">{num.contemplativeQuestion}</p>
      </section>

      {/* Keywords */}
      {num.keywords && num.keywords.length > 0 && (
        <section className="flex flex-wrap gap-2">
          {num.keywords.map((kw) => (
            <span key={kw} className="px-3 py-1 bg-neutral-800 text-neutral-400 rounded-full text-sm">
              {kw}
            </span>
          ))}
        </section>
      )}

      {/* Back Link */}
      <div className="text-center pt-4">
        <Link to="/numerology" className="text-neutral-400 hover:text-white transition-colors">
          ← Back to Numerology
        </Link>
      </div>
    </div>
  );
}

export default NumerologyDetail;
