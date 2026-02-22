import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { hdCenters, hdGates, getGatesByCenter, getChannelsForCenter, geneKeys, chakras } from '../data';
import { EntityStack } from '../components/entities/EntityStack';
import { useProfile } from '../context';
import type { EntityInfo } from '../services/entities/registry';

export function HumanDesignCenterDetail() {
  const { id } = useParams<{ id: string }>();
  const center = id ? hdCenters.get(id) : undefined;

  const { profile } = useProfile();
  const isDefinedForUser = profile?.humanDesignProfile?.definedCenterIds.includes(center?.id ?? '') ?? false;
  const [conditioningExpanded, setConditioningExpanded] = useState(true);

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
    <div className="flex h-full">
      <div className="flex-1 min-w-0 overflow-y-auto">
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
              <div
                className="flex items-center gap-4 p-4 rounded-lg bg-surface-overlay hover:bg-surface-raised transition-colors border border-theme-border-subtle cursor-pointer"
                onClick={() => handleEntityClick(relatedChakra as unknown as EntityInfo)}
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
                <Link
                  to={`/chakras/${relatedChakra.id}`}
                  className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary ml-auto"
                  onClick={e => e.stopPropagation()}
                >
                  Full profile →
                </Link>
              </div>
            </section>
          )}

          {/* Defined vs Undefined — Ra Uru Hu conditioning framework */}
          {isDefinedForUser ? (
            <section className="bg-gradient-to-br from-humandesign-500/10 to-humandesign-600/5 rounded-xl p-6 border border-humandesign-500/20">
              <h2 className="font-serif text-xl mb-3 text-humandesign-300">Your Center Is Defined</h2>
              <p className="text-theme-text-secondary mb-3">{center.definedMeaning}</p>
              <p className="text-sm text-humandesign-400/70">
                Defined centers are consistent and reliable — this is a stable part of who you are.
              </p>
            </section>
          ) : (
            <section className="bg-surface-base/50 rounded-xl border border-theme-border-subtle overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-6 text-left hover:bg-surface-raised transition-colors"
                onClick={() => setConditioningExpanded(v => !v)}
              >
                <h2 className="font-serif text-xl text-theme-text-primary">
                  {profile ? 'If Your Center Is Undefined' : 'Undefined Center — Ra Uru Hu Framework'}
                </h2>
                <span className="text-theme-text-tertiary text-sm ml-4">{conditioningExpanded ? '▲' : '▼'}</span>
              </button>

              {conditioningExpanded && (
                <div className="px-6 pb-6 space-y-6">
                  {!profile && (
                    <p className="text-theme-text-tertiary text-sm">
                      For those with this center undefined — this is what openness here accumulates and what the mind may do with borrowed energy.
                    </p>
                  )}

                  {/* Sub-section 1: Wisdom of Openness */}
                  {center.undefinedWisdom && (
                    <div>
                      <h3 className="font-medium text-humandesign-400 mb-2">Wisdom of Openness</h3>
                      <p className="text-theme-text-secondary leading-relaxed">{center.undefinedWisdom}</p>
                    </div>
                  )}

                  {/* Sub-section 2: Conditioning Pattern */}
                  {center.undefinedConditioning && (
                    <div>
                      <h3 className="font-medium text-neutral-300 mb-2">Conditioning Pattern</h3>
                      <p className="text-theme-text-secondary leading-relaxed">{center.undefinedConditioning}</p>
                    </div>
                  )}

                  {/* Sub-section 3: Diagnostic Question — pull-quote */}
                  {center.conditioningQuestion && (
                    <blockquote className="border-l-4 border-humandesign-500 pl-4 italic text-theme-text-secondary">
                      <p>{center.conditioningQuestion}</p>
                    </blockquote>
                  )}

                  {/* Fallback to basic undefinedMeaning if Ra fields not present */}
                  {!center.undefinedWisdom && (
                    <p className="text-theme-text-secondary">{center.undefinedMeaning}</p>
                  )}

                  {/* CTA */}
                  <div className="pt-2 border-t border-theme-border-subtle">
                    <Link
                      to="/contemplate?type=notSelfDiagnosis"
                      className="inline-flex items-center gap-2 text-sm text-humandesign-400 hover:text-humandesign-300 transition-colors"
                    >
                      Explore Your Not-Self Patterns →
                    </Link>
                  </div>
                </div>
              )}
            </section>
          )}

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
                  <div
                    key={gate.id}
                    className="bg-surface-base/50 rounded-xl p-4 border border-theme-border-subtle hover:border-humandesign-500/50 hover:bg-surface-base transition-all group cursor-pointer"
                    onClick={() => handleEntityClick(gate as unknown as EntityInfo)}
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
                    <Link
                      to={`/human-design/${gate.id}`}
                      className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary mt-2 inline-block"
                      onClick={e => e.stopPropagation()}
                    >
                      Full profile →
                    </Link>
                  </div>
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
                    <div
                      key={channel.id}
                      className="bg-surface-base/50 rounded-xl p-4 border border-theme-border-subtle hover:border-humandesign-500/50 hover:bg-surface-base transition-all group cursor-pointer"
                      onClick={() => handleEntityClick(channel as unknown as EntityInfo)}
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
                      <Link
                        to={`/human-design/channels/${channel.id}`}
                        className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary mt-2 inline-block"
                        onClick={e => e.stopPropagation()}
                      >
                        Full profile →
                      </Link>
                    </div>
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
      </div>
      <EntityStack
        entities={selectedEntities}
        onCloseEntity={handleCloseEntity}
        onEntityClick={handleEntityClick}
      />
    </div>
  );
}
export default HumanDesignCenterDetail;
