import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { numerologyNumbers, chakras, planets, geneKeys } from '../data';
import { EntityStack } from '../components/entities/EntityStack';
import type { EntityInfo } from '../services/entities/registry';

export function NumerologyDetail() {
  const { id } = useParams<{ id: string }>();
  const num = id ? numerologyNumbers.get(id) : undefined;

  const [selectedEntities, setSelectedEntities] = useState<EntityInfo[]>([]);
  const handleEntityClick = useCallback((entity: EntityInfo) => {
    setSelectedEntities(prev => {
      const already = prev.findIndex(e => e.id === entity.id);
      if (already !== -1) return prev;
      if (prev.length >= 2) return [prev[1], entity];
      return [...prev, entity];
    });
  }, []);
  const handleCloseEntity = useCallback((entityId: string) => {
    setSelectedEntities(prev => prev.filter(e => e.id !== entityId));
  }, []);

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
    <div className="flex h-full">
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center py-8">
            <div className={`text-6xl mb-4 font-serif ${num.isMasterNumber ? 'text-cyan-300' : 'text-cyan-400'}`}>
              {num.symbol}
            </div>
            <h1 className="font-serif text-4xl font-medium mb-2">{num.name}</h1>
            <p className="text-xl text-theme-text-secondary italic mb-2">{num.harmonicTone}</p>
            <p className="text-theme-text-tertiary mb-4">{num.archetype}</p>

            {/* Spectrum Pills */}
            <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
              <span className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-full">
                {num.lowerExpression.name}
              </span>
              <span className="text-theme-text-tertiary">→</span>
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
                <span
                  className="px-3 py-1 bg-surface-raised text-theme-text-secondary rounded-full hover:bg-surface-interactive hover:text-theme-text-primary transition-colors cursor-pointer"
                  onClick={() => handleEntityClick(planet as unknown as EntityInfo)}
                >
                  {planet.symbol} {planet.name}
                  <Link
                    to={`/planets/${planet.id}`}
                    className="text-xs ml-1 text-theme-text-tertiary hover:text-theme-text-secondary"
                    onClick={e => e.stopPropagation()}
                  >
                    →
                  </Link>
                </span>
              )}
              <span className="px-3 py-1 bg-surface-raised text-theme-text-secondary rounded-full capitalize">
                {num.element}
              </span>
              {num.solfeggioHz && (
                <span className="px-3 py-1 bg-surface-raised text-theme-text-secondary rounded-full">
                  {num.solfeggioHz} Hz
                </span>
              )}
            </div>
          </header>

          {/* Adam Apollo Essence */}
          <section className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 rounded-xl p-6 border border-cyan-500/20">
            <h2 className="font-serif text-lg mb-3 text-cyan-300">Harmonic Essence</h2>
            <p className="text-theme-text-secondary leading-relaxed italic">"{num.adamApolloEssence}"</p>
          </section>

          {/* Lower Expression */}
          <section className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl p-6 border border-red-500/20">
            <h2 className="font-serif text-xl mb-2 text-red-400">Lower Expression: {num.lowerExpression.name}</h2>
            {num.lowerExpressionPattern && (
              <p className="text-theme-text-tertiary text-sm italic mb-3">{num.lowerExpressionPattern}</p>
            )}
            <p className="text-theme-text-secondary leading-relaxed mb-4">{num.lowerExpression.expression}</p>
            {num.lowerExpression.blockingBelief && (
              <div className="bg-surface-base/60 rounded-lg p-4 border border-red-500/10">
                <h4 className="text-red-400/70 text-sm mb-1">Blocking Pattern</h4>
                <p className="text-theme-text-secondary italic text-sm">"{num.lowerExpression.blockingBelief}"</p>
              </div>
            )}
          </section>

          {/* Highest Expression */}
          <section className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-6 border border-purple-500/20">
            <h2 className="font-serif text-xl mb-2 text-purple-400">Highest Expression: {num.highestExpression.name}</h2>
            <p className="text-theme-text-secondary leading-relaxed">{num.highestExpression.expression}</p>
          </section>

          {/* Life Path & Destiny Meanings */}
          <section className="grid md:grid-cols-2 gap-4">
            <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-lg mb-3 text-theme-text-primary">Life Path Meaning</h2>
              <p className="text-theme-text-secondary text-sm leading-relaxed">{num.lifePathMeaning}</p>
            </div>
            <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-lg mb-3 text-theme-text-primary">Destiny Meaning</h2>
              <p className="text-theme-text-secondary text-sm leading-relaxed">{num.destinyMeaning}</p>
            </div>
          </section>

          {/* Life Path Calculation */}
          {num.lifePathCalculation && (
            <section className="bg-surface-base/50 rounded-xl p-5 border border-theme-border-subtle">
              <h3 className="text-theme-text-secondary text-sm mb-2">Calculation Method</h3>
              <p className="text-theme-text-secondary text-sm font-mono">{num.lifePathCalculation}</p>
            </section>
          )}

          {/* Chakra Connection */}
          {chakra && (
            <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-xl mb-4">Chakra Connection</h2>
              <div
                className="flex items-center gap-4 p-4 rounded-lg bg-surface-overlay hover:bg-surface-raised transition-colors border border-theme-border-subtle cursor-pointer"
                onClick={() => handleEntityClick(chakra as unknown as EntityInfo)}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-serif flex-shrink-0"
                  style={{ backgroundColor: chakra.colorHex + '33', border: `2px solid ${chakra.colorHex}55` }}
                >
                  {chakra.symbol}
                </div>
                <div className="flex-1">
                  <p className="text-theme-text-primary font-medium">{chakra.name}</p>
                  <p className="text-theme-text-secondary text-sm">{chakra.sanskritName}</p>
                  <p className="text-theme-text-tertiary text-xs mt-1">{chakra.lifeTheme}</p>
                </div>
                <Link
                  to={`/chakras/${chakra.id}`}
                  className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary"
                  onClick={e => e.stopPropagation()}
                >
                  → Full profile
                </Link>
              </div>
            </section>
          )}

          {/* Related Gene Keys & Gates */}
          {num.relatedGates && num.relatedGates.length > 0 && (() => {
            const relatedGKs = num.relatedGates
              .map((n) => geneKeys.get(`gk-${n}`))
              .filter(Boolean);
            if (relatedGKs.length === 0) return null;
            return (
              <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
                <h2 className="font-serif text-xl mb-4">Related Gene Keys & Gates</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {relatedGKs.map((gk) => gk && (
                    <div
                      key={gk.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-surface-overlay hover:bg-surface-raised transition-colors border border-theme-border-subtle group cursor-pointer"
                      onClick={() => handleEntityClick(gk as unknown as EntityInfo)}
                    >
                      <span className="w-9 h-9 flex-shrink-0 flex items-center justify-center text-sm font-medium bg-genekey-500/20 text-genekey-400 rounded-full border border-genekey-500/30">
                        {gk.keyNumber}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-theme-text-primary text-sm group-hover:text-genekey-300 transition-colors">
                          Gene Key {gk.keyNumber}
                        </p>
                        <p className="text-theme-text-tertiary text-xs truncate">
                          <span className="text-red-400/70">{gk.shadow.name}</span>
                          {' → '}
                          <span className="text-emerald-400/70">{gk.gift.name}</span>
                        </p>
                      </div>
                      <Link
                        to={`/gene-keys/${gk.id}`}
                        className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary"
                        onClick={e => e.stopPropagation()}
                      >
                        →
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            );
          })()}

          {/* Affirmation */}
          <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle text-center">
            <h2 className="font-serif text-lg mb-3 text-cyan-300">Affirmation</h2>
            <p className="text-theme-text-primary italic text-lg">"{num.affirmation}"</p>
          </section>

          {/* Contemplative Question */}
          <section className="bg-gradient-to-br from-neutral-900/80 to-neutral-800/30 rounded-xl p-6 border border-theme-border-subtle">
            <h2 className="font-serif text-lg mb-3 text-theme-text-secondary">For Contemplation</h2>
            <p className="text-theme-text-secondary italic leading-relaxed">{num.contemplativeQuestion}</p>
          </section>

          {/* Keywords */}
          {num.keywords && num.keywords.length > 0 && (
            <section className="flex flex-wrap gap-2">
              {num.keywords.map((kw) => (
                <span key={kw} className="px-3 py-1 bg-surface-raised text-theme-text-secondary rounded-full text-sm">
                  {kw}
                </span>
              ))}
            </section>
          )}

          {/* Back Link */}
          <div className="text-center pt-4">
            <Link to="/numerology" className="text-theme-text-secondary hover:text-theme-text-primary transition-colors">
              ← Back to Numerology
            </Link>
          </div>
        </div>
      </div>
      <EntityStack
        entities={selectedEntities}
        onCloseEntity={handleCloseEntity}
        onEntityClick={handleEntityClick}
      />
    </div>
  );
}

export default NumerologyDetail;
