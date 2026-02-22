import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { chakras, signs, hdCenters, numerologyNumbers, getGatesByCenter, geneKeys } from '../data';
import { ChakraBodyViz } from '../components/ChakraBodyViz';
import { EntityStack } from '../components/entities/EntityStack';
import type { EntityInfo } from '../services/entities/registry';

export function ChakraDetail() {
  const { id } = useParams<{ id: string }>();
  const chakra = id ? chakras.get(id) : undefined;

  const [selectedEntities, setSelectedEntities] = useState<EntityInfo[]>([]);
  const handleEntityClick = useCallback((entity: EntityInfo) => {
    setSelectedEntities(prev => {
      const already = prev.findIndex(e => e.id === entity.id);
      if (already !== -1) return prev;
      if (prev.length >= 2) return [prev[1], entity];
      return [...prev, entity];
    });
  }, []);
  const handleCloseEntity = useCallback((id: string) => {
    setSelectedEntities(prev => prev.filter(e => e.id !== id));
  }, []);

  if (!chakra) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Chakra Not Found</h1>
        <Link to="/chakras" className="text-emerald-400 hover:underline">
          Back to Chakras
        </Link>
      </div>
    );
  }

  const relatedSigns = chakra.relatedSigns.map((sid) => signs.get(sid)).filter(Boolean);
  const relatedHDCenters = chakra.relatedHDCenters.map((cid) => hdCenters.get(cid)).filter(Boolean);
  const relatedNums = Array.from(numerologyNumbers.values()).filter(
    (n) => n.chakraId === chakra.id
  );
  // Derive HD Gates via centers (chakra → HD center → gates in that center)
  const hdGatesForChakra = chakra.relatedHDCenters
    .flatMap((cid) => getGatesByCenter(cid))
    .sort((a, b) => a.gateNumber - b.gateNumber);

  // Derive Gene Keys from those gates
  const geneKeysForChakra = hdGatesForChakra
    .map(g => g.geneKeyId ? geneKeys.get(g.geneKeyId) : undefined)
    .filter((gk): gk is NonNullable<typeof gk> => Boolean(gk));

  return (
    <div className="flex h-full">
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center py-8">
            {/* Color bar */}
            <div
              className="h-1.5 rounded-full w-48 mx-auto mb-6"
              style={{ backgroundColor: chakra.colorHex }}
            />

            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
              style={{ backgroundColor: chakra.colorHex + '33', border: `3px solid ${chakra.colorHex}66` }}
            >
              {chakra.symbol}
            </div>

            <h1 className="font-serif text-4xl font-medium mb-1">{chakra.name}</h1>
            <p className="text-xl text-theme-text-secondary italic mb-1">{chakra.sanskritName}</p>
            <p className="text-theme-text-tertiary mb-4">{chakra.location}</p>

            {/* Spectrum Pills */}
            <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
              <span className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-full">
                {chakra.constricted.name}
              </span>
              <span className="text-theme-text-tertiary">→</span>
              <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full">
                {chakra.flowing.name}
              </span>
              <span className="text-theme-text-tertiary">→</span>
              <span className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-full">
                {chakra.radiant.name}
              </span>
            </div>

            {/* Meta badges */}
            <div className="flex items-center justify-center gap-3 mt-4 flex-wrap text-sm">
              <span className="px-3 py-1 bg-surface-raised text-theme-text-secondary rounded-full">
                {chakra.element}
              </span>
              <span className="px-3 py-1 bg-surface-raised text-theme-text-secondary rounded-full">
                {chakra.seed_mantra}
              </span>
              <span className="px-3 py-1 bg-surface-raised text-theme-text-secondary rounded-full">
                {chakra.frequency} Hz
              </span>
              <span className="px-3 py-1 bg-surface-raised text-theme-text-secondary rounded-full">
                {chakra.alchemicalSubstance}
              </span>
            </div>
          </header>

          {/* Position in the Energy Column */}
          <section className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Mini ChakraBodyViz — shows this chakra's position */}
            <div className="hidden lg:block flex-shrink-0">
              <div className="rounded-2xl border border-theme-border-subtle bg-surface-base/40 px-3 pt-2 pb-4">
                <p className="text-[10px] text-theme-text-muted text-center mb-1 uppercase tracking-widest">
                  Column Position
                </p>
                <div className="scale-75 origin-top-left" style={{ width: '240px', height: '420px' }}>
                  <ChakraBodyViz activeChakraId={chakra.id} />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="flex-1 bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <p className="text-theme-text-secondary leading-relaxed">{chakra.description}</p>
            </div>
          </section>

          {/* Stefano's Note */}
          <section
            className="rounded-xl p-6 border"
            style={{ backgroundColor: chakra.colorHex + '0D', borderColor: chakra.colorHex + '33' }}
          >
            <h2 className="font-serif text-lg mb-2" style={{ color: chakra.colorHex }}>
              Astrological Alchemy Note
            </h2>
            <p className="text-theme-text-secondary leading-relaxed italic">{chakra.alchemyNote}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <span className="text-theme-text-tertiary">Related Houses:</span>
              {chakra.relatedHouses.map((h) => (
                <Link
                  key={h}
                  to={`/houses/house-${h}`}
                  className="px-2 py-0.5 bg-surface-raised text-theme-text-secondary rounded hover:text-theme-text-primary transition-colors"
                >
                  House {h}
                </Link>
              ))}
            </div>
          </section>

          {/* Constricted */}
          <section className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl p-6 border border-red-500/20">
            <h2 className="font-serif text-xl mb-2 text-red-400">Constricted: {chakra.constricted.name}</h2>
            <p className="text-theme-text-secondary leading-relaxed mb-4">{chakra.constricted.expression}</p>
            {chakra.constricted.blockingBelief && (
              <div className="bg-surface-base/60 rounded-lg p-4 border border-red-500/10">
                <h4 className="text-red-400/70 text-sm mb-1">Blocking Pattern</h4>
                <p className="text-theme-text-secondary italic text-sm">"{chakra.constricted.blockingBelief}"</p>
              </div>
            )}
          </section>

          {/* Flowing */}
          <section className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl p-6 border border-emerald-500/20">
            <h2 className="font-serif text-xl mb-2 text-emerald-400">Flowing: {chakra.flowing.name}</h2>
            <p className="text-theme-text-secondary leading-relaxed">{chakra.flowing.expression}</p>
          </section>

          {/* Radiant */}
          <section className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-6 border border-purple-500/20">
            <h2 className="font-serif text-xl mb-2 text-purple-400">Radiant: {chakra.radiant.name}</h2>
            <p className="text-theme-text-secondary leading-relaxed">{chakra.radiant.expression}</p>
          </section>

          {/* Cross-system Connections */}
          <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
            <h2 className="font-serif text-xl mb-4">Cross-System Connections</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Zodiac Signs */}
              {relatedSigns.length > 0 && (
                <div>
                  <h3 className="text-theme-text-secondary text-sm mb-2">Zodiac Signs</h3>
                  <div className="space-y-2">
                    {relatedSigns.map((sign) => sign && (
                      <div
                        key={sign.id}
                        className="flex items-center gap-2 p-2 rounded-lg bg-surface-overlay hover:bg-surface-raised transition-colors cursor-pointer"
                        onClick={() => handleEntityClick(sign as unknown as EntityInfo)}
                      >
                        <span className="text-xl">{sign.symbol}</span>
                        <span className="text-theme-text-primary text-sm">{sign.name}</span>
                        <Link
                          to={`/signs/${sign.id}`}
                          className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary ml-auto"
                          onClick={e => e.stopPropagation()}
                        >
                          →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* HD Centers */}
              {relatedHDCenters.length > 0 && (
                <div>
                  <h3 className="text-theme-text-secondary text-sm mb-2">Human Design Centers</h3>
                  <div className="space-y-2">
                    {relatedHDCenters.map((center) => center && (
                      <div
                        key={center.id}
                        className="flex items-center gap-2 p-2 rounded-lg bg-surface-overlay hover:bg-surface-raised transition-colors cursor-pointer"
                        onClick={() => handleEntityClick(center as unknown as EntityInfo)}
                      >
                        <span className="text-humandesign-400 text-lg">{center.symbol}</span>
                        <span className="text-theme-text-primary text-sm">{center.name}</span>
                        <Link
                          to={`/human-design/centers/${center.id}`}
                          className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary ml-auto"
                          onClick={e => e.stopPropagation()}
                        >
                          →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Numerology Numbers */}
              {relatedNums.length > 0 && (
                <div>
                  <h3 className="text-theme-text-secondary text-sm mb-2">Numerology Numbers</h3>
                  <div className="flex flex-wrap gap-2">
                    {relatedNums.map((n) => (
                      <Link
                        key={n.id}
                        to={`/numerology/${n.id}`}
                        className="px-3 py-1.5 bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-colors text-sm"
                      >
                        {n.number} — {n.alignedExpression.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* HD Gates in this Chakra's Centers */}
          {hdGatesForChakra.length > 0 && (
            <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-xl mb-2">Human Design Gates</h2>
              <p className="text-theme-text-tertiary text-sm mb-4">
                These gates live in the HD centers associated with this chakra, expressing their energy through this energetic field.
              </p>
              <div className="flex flex-wrap gap-2">
                {hdGatesForChakra.map((gate) => (
                  <div
                    key={gate.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-humandesign-500/10 hover:bg-humandesign-500/20 text-humandesign-400 rounded-lg transition-colors text-sm cursor-pointer"
                    onClick={() => handleEntityClick(gate as unknown as EntityInfo)}
                  >
                    <span className="font-serif font-medium">{gate.gateNumber}</span>
                    <span className="text-theme-text-secondary">·</span>
                    <span className="text-theme-text-secondary">{gate.name}</span>
                    <Link
                      to={`/human-design/${gate.id}`}
                      className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary"
                      onClick={e => e.stopPropagation()}
                    >
                      →
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Gene Keys */}
          {geneKeysForChakra.length > 0 && (
            <section className="bg-gradient-to-br from-genekey-500/10 to-genekey-600/5 rounded-xl p-6 border border-genekey-500/20">
              <h2 className="font-serif text-xl mb-2 text-genekey-300">Gene Keys</h2>
              <p className="text-theme-text-tertiary text-sm mb-4">
                Through the Human Design centers, this chakra resonates with these Gene Keys and their transformation spectrum.
              </p>
              <div className="flex flex-wrap gap-2">
                {geneKeysForChakra.map(gk => (
                  <div
                    key={gk.id}
                    className="flex items-center gap-2 px-3 py-2 bg-surface-raised/60 hover:bg-surface-raised rounded-lg transition-colors cursor-pointer"
                    onClick={() => handleEntityClick(gk as unknown as EntityInfo)}
                  >
                    <span className="text-genekey-400 font-serif font-medium w-5 text-center">{gk.keyNumber}</span>
                    <div className="text-xs">
                      <span className="text-red-400/70">{gk.shadow.name}</span>
                      <span className="text-theme-text-muted mx-1">→</span>
                      <span className="text-emerald-400/70">{gk.gift.name}</span>
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
          )}

          {/* Body Correlates */}
          <section className="bg-surface-base/50 rounded-xl p-5 border border-theme-border-subtle">
            <h3 className="text-theme-text-secondary text-sm mb-2">Body Correlates</h3>
            <p className="text-theme-text-secondary text-sm">{chakra.bodyCorrelates}</p>
          </section>

          {/* Affirmation */}
          <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle text-center">
            <h2 className="font-serif text-lg mb-3 text-emerald-300">Affirmation</h2>
            <p className="text-theme-text-primary italic text-lg">"{chakra.affirmation}"</p>
          </section>

          {/* Contemplative Question */}
          <section className="bg-gradient-to-br from-neutral-900/80 to-neutral-800/30 rounded-xl p-6 border border-theme-border-subtle">
            <h2 className="font-serif text-lg mb-3 text-theme-text-secondary">For Contemplation</h2>
            <p className="text-theme-text-secondary italic leading-relaxed">{chakra.contemplativeQuestion}</p>
          </section>

          {/* Keywords */}
          {chakra.keywords && chakra.keywords.length > 0 && (
            <section className="flex flex-wrap gap-2">
              {chakra.keywords.map((kw) => (
                <span key={kw} className="px-3 py-1 bg-surface-raised text-theme-text-secondary rounded-full text-sm">
                  {kw}
                </span>
              ))}
            </section>
          )}

          {/* Back Link */}
          <div className="text-center pt-4">
            <Link to="/chakras" className="text-theme-text-secondary hover:text-theme-text-primary transition-colors">
              ← Back to Chakras
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

export default ChakraDetail;
