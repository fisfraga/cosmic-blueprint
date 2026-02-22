import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { hdAuthorities, hdCenters, chakras } from '../data';
import { NotFoundState } from '../components';
import { EntityStack } from '../components/entities/EntityStack';
import type { EntityInfo } from '../services/entities/registry';

export function HumanDesignAuthorityDetail() {
  const { id } = useParams<{ id: string }>();
  const authority = id ? hdAuthorities.get(id) : undefined;

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

  if (!authority) {
    return (
      <NotFoundState
        title="Authority Not Found"
        description="The Human Design Authority you're looking for doesn't exist."
        backLink="/human-design/authorities"
        backLabel="Back to Authorities"
      />
    );
  }

  const center = authority.centerId ? hdCenters.get(authority.centerId) : null;
  const relatedChakra = center
    ? Array.from(chakras.values()).find((c) => c.relatedHDCenters.includes(center.id))
    : undefined;

  return (
    <div className="flex h-full">
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center py-8">
            <div className="text-6xl mb-4">{authority.symbol}</div>
            <h1 className="font-serif text-4xl font-medium mb-2">{authority.name}</h1>
            <p className="text-xl text-humandesign-400 mb-2">{authority.percentage} of the population</p>
            {authority.alternativeNames.length > 0 && (
              <p className="text-theme-text-tertiary">
                Also known as: {authority.alternativeNames.join(', ')}
              </p>
            )}
          </header>

          {/* Description */}
          <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
            <p className="text-theme-text-secondary leading-relaxed">{authority.description}</p>
          </section>

          {/* Core Info Grid */}
          <section className="grid md:grid-cols-2 gap-4">
            {/* Decision Process */}
            <div className="bg-gradient-to-br from-humandesign-500/10 to-humandesign-600/5 rounded-xl p-6 border border-humandesign-500/20">
              <h2 className="font-serif text-xl mb-3 text-humandesign-300">Decision Process</h2>
              <p className="text-theme-text-secondary">{authority.decisionProcess}</p>
            </div>

            {/* Timeframe */}
            <div className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-xl mb-3">Timeframe</h2>
              <p className="text-xl font-medium text-theme-text-primary mb-2">{authority.timeframe}</p>
              <p className="text-theme-text-secondary text-sm">
                The typical time needed for clarity with this authority.
              </p>
            </div>
          </section>

          {/* Signs of Correct/Incorrect Use */}
          <section className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl p-6 border border-green-500/20">
              <h2 className="font-serif text-xl mb-3 text-green-300">Signs of Correct Use</h2>
              <p className="text-theme-text-secondary">{authority.signs.correct}</p>
            </div>
            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl p-6 border border-red-500/20">
              <h2 className="font-serif text-xl mb-3 text-red-300">Signs of Incorrect Use</h2>
              <p className="text-theme-text-secondary">{authority.signs.incorrect}</p>
            </div>
          </section>

          {/* Keywords */}
          <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
            <h2 className="font-serif text-xl mb-4">Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {authority.keywords.map((keyword, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-humandesign-500/10 text-humandesign-300 rounded-lg text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </section>

          {/* Practical Guidance */}
          <section className="bg-gradient-to-br from-humandesign-500/10 to-humandesign-600/5 rounded-xl p-6 border border-humandesign-500/20">
            <h2 className="font-serif text-xl mb-4 text-humandesign-300">Practical Guidance</h2>
            <p className="text-theme-text-secondary leading-relaxed">{authority.practicalGuidance}</p>
          </section>

          {/* Associated Center */}
          {center && (
            <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-xl mb-4">Associated Center</h2>
              <p className="text-theme-text-secondary mb-4">
                This authority is based on the defined {center.name}.
              </p>
              <div
                className="flex items-center gap-4 p-4 bg-humandesign-500/10 rounded-lg hover:bg-humandesign-500/20 transition-colors cursor-pointer"
                onClick={() => handleEntityClick(center as unknown as EntityInfo)}
              >
                <span className="text-3xl">{center.symbol}</span>
                <div className="flex-1">
                  <h3 className="font-medium text-humandesign-300">{center.name}</h3>
                  <p className="text-theme-text-secondary text-sm">{center.centerType} Center</p>
                </div>
                <Link
                  to={`/human-design/centers/${center.id}`}
                  className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary"
                  onClick={e => e.stopPropagation()}
                >
                  → Full profile
                </Link>
              </div>
            </section>
          )}

          {/* No Center Note */}
          {!center && authority.centerId === null && (
            <section className="bg-gradient-to-br from-neutral-500/10 to-neutral-600/5 rounded-xl p-6 border border-neutral-500/20">
              <h2 className="font-serif text-xl mb-3 text-theme-text-secondary">No Specific Center</h2>
              <p className="text-theme-text-secondary">
                This authority is not based on a single defined center. Instead, it relies on
                {authority.id === 'hd-authority-lunar'
                  ? ' the complete lunar cycle and all centers being undefined.'
                  : ' outer sources of clarity like environment and trusted sounding boards.'}
              </p>
            </section>
          )}

          {/* Chakra Resonance */}
          {relatedChakra && (
            <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
              <h2 className="font-serif text-xl mb-2">Chakra Resonance</h2>
              <p className="text-theme-text-tertiary text-sm mb-4">
                The center governing this authority resonates with the following chakra in the Hindu-Brahman tradition.
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
                <div className="flex-1">
                  <p className="text-theme-text-primary font-medium">{relatedChakra.name}</p>
                  <p className="text-theme-text-secondary text-sm italic">{relatedChakra.sanskritName}</p>
                  <p className="text-theme-text-tertiary text-xs mt-0.5">{relatedChakra.lifeTheme}</p>
                </div>
                <Link
                  to={`/chakras/${relatedChakra.id}`}
                  className="text-xs text-theme-text-tertiary hover:text-theme-text-secondary"
                  onClick={e => e.stopPropagation()}
                >
                  → Full profile
                </Link>
              </div>
            </section>
          )}

          {/* Related Links */}
          <section className="flex gap-4">
            <Link
              to="/human-design/types"
              className="flex-1 p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-theme-border-subtle transition-colors"
            >
              <span className="text-lg">◉</span>
              <h4 className="font-medium mt-2">Types</h4>
              <p className="text-sm text-theme-text-secondary mt-1">Learn about the five HD types</p>
            </Link>
            <Link
              to="/human-design/centers"
              className="flex-1 p-4 bg-surface-base/50 rounded-xl border border-theme-border-subtle hover:border-theme-border-subtle transition-colors"
            >
              <span className="text-lg">⚬</span>
              <h4 className="font-medium mt-2">Centers</h4>
              <p className="text-sm text-theme-text-secondary mt-1">Explore the nine energy centers</p>
            </Link>
          </section>

          {/* Back Link */}
          <div className="text-center pt-4">
            <Link to="/human-design/authorities" className="text-theme-text-secondary hover:text-theme-text-primary transition-colors">
              &#8592; Back to Authorities
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
export default HumanDesignAuthorityDetail;
