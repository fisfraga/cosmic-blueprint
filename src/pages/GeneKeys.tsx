import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getGeneKeysInOrder,
  getCodonRingsInOrder,
  getClassicalElements,
  getSignsInOrder,
  getCentersInOrder,
  geneKeys,
  hdGates,
  aminoAcids,
  getGeneKeyElement,
  getGeneKeyHDCenter,
} from '../data';
import type { GeneKey } from '../types';

type FilterType = 'all' | 'ring' | 'element' | 'sign' | 'center';

export function GeneKeys() {
  const allGeneKeys = getGeneKeysInOrder();
  const codonRings = getCodonRingsInOrder().filter(r => r.theme !== 'Unknown');
  const elements = getClassicalElements();
  const signs = getSignsInOrder();
  const centers = getCentersInOrder();

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [filterValue, setFilterValue] = useState<string>('all');

  // Apply filter based on active filter type
  const filteredKeys = (() => {
    if (activeFilter === 'all' || filterValue === 'all') {
      return allGeneKeys;
    }
    switch (activeFilter) {
      case 'ring':
        return allGeneKeys.filter(gk => gk.codonRingId === filterValue);
      case 'element':
        return allGeneKeys.filter(gk => {
          const element = getGeneKeyElement(gk);
          return element?.id === filterValue;
        });
      case 'sign':
        return allGeneKeys.filter(gk => gk.tropicalSignId === filterValue);
      case 'center':
        return allGeneKeys.filter(gk => {
          const center = getGeneKeyHDCenter(gk);
          return center?.id === filterValue;
        });
      default:
        return allGeneKeys;
    }
  })();

  const handleFilterChange = (type: FilterType, value: string) => {
    setActiveFilter(type);
    setFilterValue(value);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl text-genekey-400">&#10022;</span>
          <h1 className="font-serif text-3xl font-medium">Gene Keys</h1>
        </div>
        <p className="text-theme-text-secondary max-w-3xl">
          The Gene Keys are a contemplative transmission revealing the spectrum of human consciousness.
          Each of the 64 keys contains a Shadow (fear-based pattern), Gift (creative potential),
          and Siddhi (highest expression)—a pathway from suffering to liberation encoded in your DNA.
        </p>
      </section>

      {/* Filter Options */}
      <section className="space-y-4">
        {/* Filter Type Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('all', 'all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-genekey-500 text-white'
                : 'bg-surface-raised text-theme-text-secondary hover:bg-surface-interactive'
            }`}
          >
            All Keys ({allGeneKeys.length})
          </button>
          <button
            onClick={() => setActiveFilter('ring')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === 'ring'
                ? 'bg-genekey-500 text-white'
                : 'bg-surface-raised text-theme-text-secondary hover:bg-surface-interactive'
            }`}
          >
            By Ring
          </button>
          <button
            onClick={() => setActiveFilter('element')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === 'element'
                ? 'bg-genekey-500 text-white'
                : 'bg-surface-raised text-theme-text-secondary hover:bg-surface-interactive'
            }`}
          >
            By Element
          </button>
          <button
            onClick={() => setActiveFilter('sign')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === 'sign'
                ? 'bg-genekey-500 text-white'
                : 'bg-surface-raised text-theme-text-secondary hover:bg-surface-interactive'
            }`}
          >
            By Sign
          </button>
          <button
            onClick={() => setActiveFilter('center')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === 'center'
                ? 'bg-genekey-500 text-white'
                : 'bg-surface-raised text-theme-text-secondary hover:bg-surface-interactive'
            }`}
          >
            By HD Center
          </button>
        </div>

        {/* Filter Values */}
        {activeFilter === 'ring' && (
          <div className="flex flex-wrap gap-2">
            {codonRings.map(ring => {
              const keyCount = allGeneKeys.filter(gk => gk.codonRingId === ring.id).length;
              return (
                <button
                  key={ring.id}
                  onClick={() => handleFilterChange('ring', ring.id)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    filterValue === ring.id
                      ? 'bg-genekey-500/80 text-white'
                      : 'bg-surface-raised text-theme-text-secondary hover:bg-surface-interactive'
                  }`}
                >
                  {ring.name.replace('Ring Of ', '')} ({keyCount})
                </button>
              );
            })}
          </div>
        )}

        {activeFilter === 'element' && (
          <div className="flex flex-wrap gap-2">
            {elements.map(element => {
              const keyCount = allGeneKeys.filter(gk => getGeneKeyElement(gk)?.id === element.id).length;
              return (
                <button
                  key={element.id}
                  onClick={() => handleFilterChange('element', element.id)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    filterValue === element.id
                      ? 'bg-genekey-500/80 text-white'
                      : 'bg-surface-raised text-theme-text-secondary hover:bg-surface-interactive'
                  }`}
                >
                  <span className="text-lg">{element.symbol}</span>
                  {element.name} ({keyCount})
                </button>
              );
            })}
          </div>
        )}

        {activeFilter === 'sign' && (
          <div className="flex flex-wrap gap-2">
            {signs.map(sign => {
              const keyCount = allGeneKeys.filter(gk => gk.tropicalSignId === sign.id).length;
              return (
                <button
                  key={sign.id}
                  onClick={() => handleFilterChange('sign', sign.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1.5 ${
                    filterValue === sign.id
                      ? 'bg-genekey-500/80 text-white'
                      : 'bg-surface-raised text-theme-text-secondary hover:bg-surface-interactive'
                  }`}
                >
                  <span>{sign.symbol}</span>
                  {sign.name} ({keyCount})
                </button>
              );
            })}
          </div>
        )}

        {activeFilter === 'center' && (
          <div className="flex flex-wrap gap-2">
            {centers.map(center => {
              const keyCount = allGeneKeys.filter(gk => getGeneKeyHDCenter(gk)?.id === center.id).length;
              return (
                <button
                  key={center.id}
                  onClick={() => handleFilterChange('center', center.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    filterValue === center.id
                      ? 'bg-humandesign-500/80 text-white'
                      : 'bg-surface-raised text-theme-text-secondary hover:bg-surface-interactive'
                  }`}
                >
                  {center.name.replace(' Center', '')} ({keyCount})
                </button>
              );
            })}
          </div>
        )}

        {/* Active Filter Badge */}
        {activeFilter !== 'all' && filterValue !== 'all' && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-theme-text-tertiary">Showing:</span>
            <span className="px-3 py-1 bg-genekey-500/20 text-genekey-300 rounded-full">
              {filteredKeys.length} keys
            </span>
            <button
              onClick={() => handleFilterChange('all', 'all')}
              className="text-theme-text-secondary hover:text-theme-text-primary"
            >
              Clear filter
            </button>
          </div>
        )}
      </section>

      {/* Gene Keys Grid */}
      <section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredKeys.map((gk) => (
            <GeneKeyCard key={gk.id} geneKey={gk} />
          ))}
        </div>
      </section>

      {/* Understanding Note */}
      <section className="bg-gradient-to-br from-genekey-500/10 to-genekey-600/5 rounded-xl p-6 border border-genekey-500/20">
        <h3 className="font-serif text-lg mb-2 text-genekey-300">The Spectrum of Consciousness</h3>
        <p className="text-theme-text-secondary text-sm mb-4">
          Each Gene Key represents a holographic fractal of your potential. The <strong className="text-genekey-300">Shadow</strong> is
          not something to eliminate but to embrace—it contains the raw material for transformation.
          As awareness penetrates the Shadow, the <strong className="text-genekey-300">Gift</strong> naturally emerges.
          The <strong className="text-genekey-300">Siddhi</strong> represents the flowering of consciousness itself,
          available to all yet rarely fully embodied.
        </p>
        <p className="text-theme-text-secondary text-sm">
          The Gene Keys connect deeply with Human Design (sharing the same 64 hexagrams) and Astrology
          (each key corresponds to specific zodiac degrees). Together they form a unified map of human potential.
        </p>
      </section>

      {/* Codon Rings Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl text-genekey-400">&#9678;</span>
          <h2 className="font-serif text-2xl font-medium">Codon Rings</h2>
        </div>
        <p className="text-theme-text-secondary max-w-3xl mb-6">
          The 21 Codon Rings are chemical families that group Gene Keys by their amino acid expression.
          Keys within the same ring share a deep genetic resonance and collective purpose.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {codonRings.slice(0, 9).map(ring => (
            <Link
              key={ring.id}
              to={`/gene-keys/codon-rings/${ring.id}`}
              className="bg-surface-base/50 rounded-xl p-4 border border-theme-border-subtle hover:border-genekey-500/50 transition-all group"
            >
              <h4 className="font-serif text-lg text-theme-text-primary group-hover:text-genekey-300 transition-colors mb-1">
                {ring.name}
              </h4>
              <p className="text-genekey-400 text-sm mb-2">{ring.theme}</p>
              <p className="text-theme-text-tertiary text-xs">
                Keys: {ring.geneKeyIds.map(id => {
                  const gk = geneKeys.get(id);
                  return gk ? gk.keyNumber : '';
                }).filter(Boolean).join(', ')}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function GeneKeyCard({ geneKey }: { geneKey: GeneKey }) {
  const gate = geneKey.hdGateId ? hdGates.get(geneKey.hdGateId) : undefined;
  const amino = geneKey.aminoAcidId ? aminoAcids.get(geneKey.aminoAcidId) : undefined;

  return (
    <Link
      to={`/gene-keys/${geneKey.id}`}
      className="bg-surface-base/50 rounded-xl p-5 border border-theme-border-subtle hover:border-genekey-500/50 hover:bg-surface-base transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl font-serif text-genekey-400">{geneKey.keyNumber}</span>
        <span className="text-xs text-theme-text-tertiary bg-surface-raised px-2 py-1 rounded">
          {geneKey.tropicalSignId?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
        </span>
      </div>

      <h3 className="font-serif text-lg text-theme-text-primary group-hover:text-genekey-300 transition-colors mb-1">
        {geneKey.name}
      </h3>
      {geneKey.keyTitle && (
        <p className="text-xs text-theme-text-tertiary italic mb-2">{geneKey.keyTitle}</p>
      )}

      {/* Shadow → Gift → Siddhi */}
      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-16 text-theme-text-tertiary">Shadow:</span>
          <span className="text-red-400">{geneKey.shadow.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-16 text-theme-text-tertiary">Gift:</span>
          <span className="text-emerald-400">{geneKey.gift.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-16 text-theme-text-tertiary">Siddhi:</span>
          <span className="text-purple-400">{geneKey.siddhi.name}</span>
        </div>
      </div>

      {/* HD Gate + Amino Acid bridge */}
      {(gate || amino) && (
        <div className="mt-3 pt-3 border-t border-theme-border-subtle flex items-center gap-2">
          {gate && (
            <>
              <span className="text-xs text-humandesign-500">HD</span>
              <span className="text-xs font-serif text-humandesign-400">{gate.gateNumber}</span>
            </>
          )}
          {gate && amino && <span className="text-theme-text-muted">·</span>}
          {amino && (
            <>
              <span className="text-xs font-mono text-genekey-500">{amino.symbol}</span>
              <span className="text-xs text-theme-text-tertiary">{amino.name}</span>
            </>
          )}
        </div>
      )}
    </Link>
  );
}
export default GeneKeys;
