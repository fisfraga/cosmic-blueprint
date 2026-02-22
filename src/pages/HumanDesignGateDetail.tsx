import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { hdGates, hdCenters, signs, getGeneKeyByGate } from '../data';
import { EntityStack } from '../components/entities/EntityStack';
import type { EntityInfo } from '../services/entities/registry';

export function HumanDesignGateDetail() {
  const { id } = useParams<{ id: string }>();
  const gate = id ? hdGates.get(id) : undefined;

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

  if (!gate) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">Gate Not Found</h1>
        <Link to="/human-design" className="text-humandesign-400 hover:underline">
          Back to Human Design
        </Link>
      </div>
    );
  }

  const center = gate.centerId ? hdCenters.get(gate.centerId) : undefined;
  const correspondingGeneKey = getGeneKeyByGate(gate.id);
  const zodiacSign = gate.tropicalSignId ? signs.get(gate.tropicalSignId) : undefined;

  // Prev/next navigation by gateNumber (1–64)
  const sortedGates = Array.from(hdGates.values()).sort((a, b) => a.gateNumber - b.gateNumber);
  const currentIndex = sortedGates.findIndex(g => g.id === gate.id);
  const prevGate = currentIndex > 0 ? sortedGates[currentIndex - 1] : undefined;
  const nextGate = currentIndex < sortedGates.length - 1 ? sortedGates[currentIndex + 1] : undefined;

  return (
    <div className="flex h-full">
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center py-8">
            <div className="text-6xl mb-4 font-serif text-humandesign-400">{gate.gateNumber}</div>
            <h1 className="font-serif text-4xl font-medium mb-2">{gate.name}</h1>
            <p className="text-xl text-theme-text-secondary italic mb-4">{gate.iChingName}</p>

            {/* Meta Info */}
            <div className="flex items-center justify-center gap-3 text-sm flex-wrap">
              {center && (
                <span className="px-3 py-1.5 bg-humandesign-500/20 text-humandesign-400 rounded-full">
                  {center.name} Center
                </span>
              )}
              {gate.circuitType && (
                <span className="px-3 py-1.5 bg-surface-raised text-theme-text-secondary rounded-full">
                  {gate.circuitType} Circuit
                </span>
              )}
              {zodiacSign && (
                <span className="px-3 py-1.5 bg-surface-raised text-theme-text-secondary rounded-full">
                  {zodiacSign.symbol} {zodiacSign.name}
                </span>
              )}
              <span className="px-3 py-1.5 bg-surface-raised text-theme-text-secondary rounded-full">
                I Ching #{gate.iChingHexagram}
              </span>
            </div>
          </header>

          {/* Core Theme */}
          {gate.coreTheme && (
            <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-xl mb-3">Core Theme</h2>
              <p className="text-theme-text-secondary leading-relaxed text-lg">{gate.coreTheme}</p>
            </section>
          )}

          {/* Keywords */}
          {gate.keywords && gate.keywords.length > 0 && (
            <section className="flex flex-wrap gap-2">
              {gate.keywords.map((keyword, i) => (
                <span key={i} className="px-3 py-1.5 bg-humandesign-500/10 text-humandesign-400 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
            </section>
          )}

          {/* HD Definition */}
          {gate.hdDefinition && (
            <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-xl mb-3">Human Design Definition</h2>
              <p className="text-theme-text-secondary leading-relaxed">{gate.hdDefinition}</p>
            </section>
          )}

          {/* Circuit Description */}
          {gate.description && (
            <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-xl mb-3">How It Manifests</h2>
              <p className="text-theme-text-secondary leading-relaxed">{gate.description}</p>
            </section>
          )}

          {/* High & Low Expression */}
          <div className="grid md:grid-cols-2 gap-6">
            {gate.highExpression && (
              <section className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl p-6 border border-emerald-500/20">
                <h2 className="font-serif text-xl mb-3 text-emerald-400">High Expression</h2>
                <p className="text-theme-text-secondary leading-relaxed">{gate.highExpression}</p>
              </section>
            )}
            {gate.lowExpression && (
              <section className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl p-6 border border-red-500/20">
                <h2 className="font-serif text-xl mb-3 text-red-400">Low Expression</h2>
                <p className="text-theme-text-secondary leading-relaxed">{gate.lowExpression}</p>
              </section>
            )}
          </div>

          {/* Affirmations */}
          {gate.affirmations && gate.affirmations.length > 0 && (
            <section className="bg-gradient-to-br from-humandesign-500/10 to-humandesign-600/5 rounded-xl p-6 border border-humandesign-500/20">
              <h2 className="font-serif text-xl mb-4 text-humandesign-300">Affirmations</h2>
              <ul className="space-y-3">
                {gate.affirmations.map((affirmation, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-humandesign-400 mt-1">&#10003;</span>
                    <p className="text-theme-text-secondary italic">{affirmation}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Connections */}
          <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
            <h2 className="font-serif text-xl mb-4">Connections</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Center — no entity panel (not a typical KB entity) */}
              {center && (
                <div
                  className="p-4 rounded-lg bg-surface-overlay hover:bg-surface-raised transition-colors border border-theme-border-subtle cursor-pointer"
                  onClick={() => handleEntityClick(center as unknown as EntityInfo)}
                >
                  <h4 className="text-theme-text-secondary text-sm mb-1">Energy Center</h4>
                  <div>
                    <p className="text-theme-text-primary font-medium">{center.name}</p>
                    <p className="text-humandesign-400 text-sm">{center.centerType} Center</p>
                    <p className="text-theme-text-tertiary text-sm mt-1">{center.biologicalCorrelate}</p>
                  </div>
                  <Link
                    to={`/human-design/centers/${center.id}`}
                    className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary mt-1 inline-block"
                    onClick={e => e.stopPropagation()}
                  >
                    Full profile →
                  </Link>
                </div>
              )}

              {/* Corresponding Gene Key */}
              {correspondingGeneKey && (
                <div
                  className="p-4 rounded-lg bg-surface-overlay hover:bg-surface-raised transition-colors border border-theme-border-subtle cursor-pointer"
                  onClick={() => handleEntityClick(correspondingGeneKey as unknown as EntityInfo)}
                >
                  <h4 className="text-theme-text-secondary text-sm mb-1">Gene Key</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-serif text-genekey-400">{correspondingGeneKey.keyNumber}</span>
                    <div>
                      <p className="text-theme-text-primary font-medium">{correspondingGeneKey.name}</p>
                      <p className="text-theme-text-tertiary text-sm">
                        {correspondingGeneKey.shadow.name} &#8594; {correspondingGeneKey.gift.name} &#8594; {correspondingGeneKey.siddhi.name}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/gene-keys/${correspondingGeneKey.id}`}
                    className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary mt-1 inline-block"
                    onClick={e => e.stopPropagation()}
                  >
                    Full profile →
                  </Link>
                </div>
              )}

              {/* Zodiac Sign */}
              {zodiacSign && (
                <div
                  className="p-4 rounded-lg bg-surface-overlay hover:bg-surface-raised transition-colors border border-theme-border-subtle cursor-pointer"
                  onClick={() => handleEntityClick(zodiacSign as unknown as EntityInfo)}
                >
                  <h4 className="text-theme-text-secondary text-sm mb-1">Zodiac Position</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{zodiacSign.symbol}</span>
                    <div>
                      <p className="text-theme-text-primary font-medium">{zodiacSign.name}</p>
                      <p className="text-theme-text-tertiary text-sm">
                        {gate.degreeStart}° - {gate.degreeEnd}°
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/signs/${zodiacSign.id}`}
                    className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary mt-1 inline-block"
                    onClick={e => e.stopPropagation()}
                  >
                    Full profile →
                  </Link>
                </div>
              )}

              {/* Channel Partner */}
              {gate.channelGateId && (
                (() => {
                  const partnerGate = hdGates.get(gate.channelGateId);
                  if (!partnerGate) return null;
                  return (
                    <div
                      className="p-4 rounded-lg bg-surface-overlay hover:bg-surface-raised transition-colors border border-theme-border-subtle cursor-pointer"
                      onClick={() => handleEntityClick(partnerGate as unknown as EntityInfo)}
                    >
                      <h4 className="text-theme-text-secondary text-sm mb-1">Channel Partner</h4>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-serif text-humandesign-400">{partnerGate.gateNumber}</span>
                        <div>
                          <p className="text-theme-text-primary font-medium">{partnerGate.name}</p>
                          <p className="text-theme-text-tertiary text-sm">{partnerGate.iChingName}</p>
                        </div>
                      </div>
                      <Link
                        to={`/human-design/${partnerGate.id}`}
                        className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary mt-1 inline-block"
                        onClick={e => e.stopPropagation()}
                      >
                        Full profile →
                      </Link>
                    </div>
                  );
                })()
              )}
            </div>
          </section>

          {/* Line Descriptions */}
          {gate.lineDescriptions && gate.lineDescriptions.length > 0 && (
            <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-xl mb-4">The Six Lines</h2>
              <div className="space-y-4">
                {gate.lineDescriptions.map((line, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-humandesign-400 font-serif text-lg w-8">{i + 1}</span>
                    <p className="text-theme-text-secondary">{line}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Navigation */}
          <nav className="flex items-center justify-between pt-6 border-t border-theme-border-subtle">
            {prevGate ? (
              <Link
                to={`/human-design/${prevGate.id}`}
                className="flex items-center gap-2 text-theme-text-secondary hover:text-humandesign-300 transition-colors group"
              >
                <span className="text-lg">&#8592;</span>
                <div className="text-left">
                  <p className="text-xs text-theme-text-muted">Previous</p>
                  <p className="text-sm group-hover:text-humandesign-300">
                    <span className="font-serif text-humandesign-400 mr-1">{prevGate.gateNumber}</span>
                    {prevGate.name}
                  </p>
                </div>
              </Link>
            ) : <span />}

            <Link to="/human-design" className="text-theme-text-tertiary hover:text-theme-text-primary transition-colors text-sm">
              All Gates
            </Link>

            {nextGate ? (
              <Link
                to={`/human-design/${nextGate.id}`}
                className="flex items-center gap-2 text-theme-text-secondary hover:text-humandesign-300 transition-colors group text-right"
              >
                <div className="text-right">
                  <p className="text-xs text-theme-text-muted">Next</p>
                  <p className="text-sm group-hover:text-humandesign-300">
                    {nextGate.name}
                    <span className="font-serif text-humandesign-400 ml-1">{nextGate.gateNumber}</span>
                  </p>
                </div>
                <span className="text-lg">&#8594;</span>
              </Link>
            ) : <span />}
          </nav>
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
export default HumanDesignGateDetail;
