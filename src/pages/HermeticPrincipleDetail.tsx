import { useParams, Link } from 'react-router-dom';
import { hermeticPrinciples, chakras, geneKeys } from '../data';

export function HermeticPrincipleDetail() {
  const { id } = useParams<{ id: string }>();
  const principle = id ? hermeticPrinciples.get(id) : undefined;

  if (!principle) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Principle Not Found</h1>
        <Link to="/hermetic" className="text-amber-400 hover:underline">
          Back to Hermetic Principles
        </Link>
      </div>
    );
  }

  const relatedChakras = principle.relatedChakras
    .map((cid) => chakras.get(cid))
    .filter(Boolean);

  // Get previous and next for navigation
  const allPrinciples = Array.from(hermeticPrinciples.values()).sort((a, b) => a.number - b.number);
  const currentIndex = allPrinciples.findIndex((p) => p.id === principle.id);
  const prevPrinciple = currentIndex > 0 ? allPrinciples[currentIndex - 1] : undefined;
  const nextPrinciple = currentIndex < allPrinciples.length - 1 ? allPrinciples[currentIndex + 1] : undefined;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="text-center py-8">
        <div className="text-6xl mb-4 text-amber-400">{principle.symbol}</div>
        <div className="text-theme-text-tertiary text-sm mb-2">Principle {principle.number} of 7 · {principle.latinName}</div>
        <h1 className="font-serif text-4xl font-medium mb-4">{principle.name}</h1>

        {/* Statement */}
        <blockquote className="text-xl text-amber-300 italic max-w-2xl mx-auto leading-relaxed">
          "{principle.statement}"
        </blockquote>

        {/* Meta badges */}
        <div className="flex items-center justify-center gap-3 mt-5 flex-wrap text-sm">
          <span className="px-3 py-1 bg-surface-raised text-theme-text-secondary rounded-full">
            {principle.element}
          </span>
          <span className="px-3 py-1 bg-surface-raised text-theme-text-secondary rounded-full">
            {principle.planet}
          </span>
          <span className="px-3 py-1 bg-surface-raised text-theme-text-secondary rounded-full">
            {principle.alchemicalSubstance}
          </span>
        </div>
      </header>

      {/* Essence */}
      <section className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-xl p-6 border border-amber-500/20">
        <h2 className="font-serif text-lg mb-3 text-amber-300">Essence</h2>
        <p className="text-theme-text-secondary leading-relaxed">{principle.essence}</p>
      </section>

      {/* Description */}
      {principle.description && (
        <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <p className="text-theme-text-secondary leading-relaxed">{principle.description}</p>
        </section>
      )}

      {/* Shadow */}
      <section className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl p-6 border border-red-500/20">
        <h2 className="font-serif text-xl mb-2 text-red-400">Shadow Expression</h2>
        <p className="text-theme-text-secondary leading-relaxed">{principle.shadow.expression}</p>
      </section>

      {/* Gift */}
      <section className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl p-6 border border-emerald-500/20">
        <h2 className="font-serif text-xl mb-2 text-emerald-400">Gift Expression</h2>
        <p className="text-theme-text-secondary leading-relaxed">{principle.gift.expression}</p>
      </section>

      {/* Siddhi */}
      <section className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-6 border border-purple-500/20">
        <h2 className="font-serif text-xl mb-2 text-purple-400">Siddhi Expression</h2>
        <p className="text-theme-text-secondary leading-relaxed">{principle.siddhi.expression}</p>
      </section>

      {/* Applications */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-lg mb-3 text-theme-text-primary">In Astrology</h2>
          <p className="text-theme-text-secondary text-sm leading-relaxed">{principle.astrologyApplication}</p>
        </div>
        <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-lg mb-3 text-theme-text-primary">In Gene Keys</h2>
          <p className="text-theme-text-secondary text-sm leading-relaxed">{principle.geneKeysApplication}</p>
        </div>
      </section>

      {/* Practice */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-amber-500/10">
        <h2 className="font-serif text-lg mb-3 text-amber-300/80">Practice</h2>
        <p className="text-theme-text-secondary leading-relaxed">{principle.practice}</p>
      </section>

      {/* Chakra Connections */}
      {relatedChakras.length > 0 && (
        <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
          <h2 className="font-serif text-xl mb-4">Chakra Resonance</h2>
          <div className="flex flex-wrap gap-3">
            {relatedChakras.map((chakra) => chakra && (
              <Link
                key={chakra.id}
                to={`/chakras/${chakra.id}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-surface-overlay hover:bg-surface-raised transition-colors border border-theme-border-subtle"
              >
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: chakra.colorHex + '33', border: `2px solid ${chakra.colorHex}66` }}
                >
                  {chakra.symbol}
                </div>
                <div>
                  <p className="text-theme-text-primary text-sm">{chakra.name}</p>
                  <p className="text-theme-text-tertiary text-xs italic">{chakra.sanskritName}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related Gene Keys */}
      {principle.relatedGeneKeys && principle.relatedGeneKeys.length > 0 && (() => {
        const relatedGKs = principle.relatedGeneKeys
          .map((n) => geneKeys.get(`gk-${n}`))
          .filter(Boolean);
        if (relatedGKs.length === 0) return null;
        return (
          <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
            <h2 className="font-serif text-xl mb-4">Resonant Gene Keys</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {relatedGKs.map((gk) => gk && (
                <Link
                  key={gk.id}
                  to={`/gene-keys/${gk.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-surface-overlay hover:bg-surface-raised transition-colors border border-theme-border-subtle group"
                >
                  <span className="w-9 h-9 flex-shrink-0 flex items-center justify-center text-sm font-medium bg-genekey-500/20 text-genekey-400 rounded-full border border-genekey-500/30">
                    {gk.keyNumber}
                  </span>
                  <div className="min-w-0">
                    <p className="text-theme-text-primary text-sm group-hover:text-genekey-300 transition-colors">
                      Gene Key {gk.keyNumber}
                    </p>
                    <p className="text-theme-text-tertiary text-xs truncate">
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

      {/* Contemplative Question */}
      <section className="bg-gradient-to-br from-neutral-900/80 to-neutral-800/30 rounded-xl p-6 border border-theme-border-subtle">
        <h2 className="font-serif text-lg mb-3 text-theme-text-secondary">For Contemplation</h2>
        <p className="text-theme-text-secondary italic leading-relaxed">{principle.contemplativeQuestion}</p>
      </section>

      {/* Keywords */}
      {principle.keywords && principle.keywords.length > 0 && (
        <section className="flex flex-wrap gap-2">
          {principle.keywords.map((kw) => (
            <span key={kw} className="px-3 py-1 bg-surface-raised text-theme-text-secondary rounded-full text-sm">
              {kw}
            </span>
          ))}
        </section>
      )}

      {/* Prev / Next navigation */}
      <section className="flex items-center justify-between pt-4 border-t border-theme-border-subtle">
        {prevPrinciple ? (
          <Link
            to={`/hermetic/${prevPrinciple.id}`}
            className="flex items-center gap-2 text-theme-text-secondary hover:text-amber-300 transition-colors"
          >
            <span>←</span>
            <span className="text-sm">{prevPrinciple.name}</span>
          </Link>
        ) : <div />}
        <Link to="/hermetic" className="text-theme-text-tertiary hover:text-theme-text-primary transition-colors text-sm">
          All Principles
        </Link>
        {nextPrinciple ? (
          <Link
            to={`/hermetic/${nextPrinciple.id}`}
            className="flex items-center gap-2 text-theme-text-secondary hover:text-amber-300 transition-colors"
          >
            <span className="text-sm">{nextPrinciple.name}</span>
            <span>→</span>
          </Link>
        ) : <div />}
      </section>
    </div>
  );
}

export default HermeticPrincipleDetail;
