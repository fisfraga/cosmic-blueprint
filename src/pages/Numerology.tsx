import { useState } from 'react';
import { Link } from 'react-router-dom';
import { numerologyNumbers, chakras } from '../data';
import type { NumerologyNumber } from '../types';

type FilterType = 'all' | 'element' | 'master';

const ELEMENTS = ['fire', 'earth', 'air', 'water'] as const;

export function Numerology() {
  const allNumbers = Array.from(numerologyNumbers.values()).sort(
    (a, b) => a.number - b.number
  );
  const regularNumbers = allNumbers.filter((n) => !n.isMasterNumber);
  const masterNumbers = allNumbers.filter((n) => n.isMasterNumber);

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [filterValue, setFilterValue] = useState<string>('all');

  const filteredNumbers = (() => {
    if (activeFilter === 'all' || filterValue === 'all') return allNumbers;
    if (activeFilter === 'master') return masterNumbers;
    if (activeFilter === 'element') return allNumbers.filter((n) => n.element === filterValue);
    return allNumbers;
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
          <span className="text-3xl text-cyan-400">∞</span>
          <h1 className="font-serif text-3xl font-medium">Numerology</h1>
        </div>
        <p className="text-theme-text-secondary max-w-3xl">
          The sacred language of numbers as dimensional consciousness. Each number carries a unique
          frequency — a harmonic tone of creation that resonates through your life path, chakra system,
          and evolutionary purpose. Explore the spectrum from Lower Expression to Highest Expression for each number.
        </p>
      </section>

      {/* Filter Tabs */}
      <section className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('all', 'all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-cyan-500 text-white'
                : 'bg-surface-raised text-theme-text-secondary hover:bg-surface-interactive'
            }`}
          >
            All Numbers ({allNumbers.length})
          </button>
          <button
            onClick={() => setActiveFilter('element')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === 'element'
                ? 'bg-cyan-500 text-white'
                : 'bg-surface-raised text-theme-text-secondary hover:bg-surface-interactive'
            }`}
          >
            By Element
          </button>
          <button
            onClick={() => handleFilterChange('master', 'master')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === 'master'
                ? 'bg-cyan-500 text-white'
                : 'bg-surface-raised text-theme-text-secondary hover:bg-surface-interactive'
            }`}
          >
            Master Numbers ({masterNumbers.length})
          </button>
        </div>

        {activeFilter === 'element' && (
          <div className="flex flex-wrap gap-2">
            {ELEMENTS.map((el) => {
              const count = allNumbers.filter((n) => n.element === el).length;
              return (
                <button
                  key={el}
                  onClick={() => handleFilterChange('element', el)}
                  className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                    filterValue === el
                      ? 'bg-cyan-500/80 text-white'
                      : 'bg-surface-raised text-theme-text-secondary hover:bg-surface-interactive'
                  }`}
                >
                  {el} ({count})
                </button>
              );
            })}
          </div>
        )}

        {activeFilter !== 'all' && filterValue !== 'all' && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-theme-text-tertiary">Showing:</span>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full">
              {filteredNumbers.length} numbers
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

      {/* Numbers Grid */}
      <section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredNumbers.map((num) => (
            <NumerologyCard key={num.id} num={num} />
          ))}
        </div>
      </section>

      {/* Adam Apollo System Note */}
      <section className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 rounded-xl p-6 border border-cyan-500/20">
        <h3 className="font-serif text-lg mb-2 text-cyan-300">The Harmonic System of Numbers</h3>
        <p className="text-theme-text-secondary text-sm mb-3">
          This numerology system is rooted in Adam Apollo's teaching that numbers are not mere labels but
          dimensional frequencies — each vibrating at a specific octave of consciousness. The number 5
          resonates with the Root Chakra (the 5 senses, physical reality); 6 with the Sacral (emotion and flow);
          7 with the Solar Plexus (will and identity). As you ascend, numbers map to higher centers of awareness.
        </p>
        <p className="text-theme-text-secondary text-sm">
          Master numbers (11, 22, 33) operate at amplified frequencies and carry heightened evolutionary
          potential — and correspondingly greater shadow challenges. They are not "reduced" in calculation
          when they appear naturally in one's birth date.
        </p>
      </section>

      {/* Chakra Connections Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl text-emerald-400">◎</span>
          <h2 className="font-serif text-2xl font-medium">Chakra Connections</h2>
        </div>
        <p className="text-theme-text-secondary max-w-3xl mb-6">
          Every number resonates with a specific energy center. Numbers are frequencies; chakras are
          receivers. Understanding your life path number's chakra reveals which center is your primary
          developmental arena in this incarnation.
        </p>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
          {regularNumbers.map((num) => {
            const chakra = chakras.get(num.chakraId);
            return (
              <div key={num.id} className="bg-surface-base/50 rounded-lg p-3 border border-theme-border-subtle flex items-center gap-3">
                <span className="text-2xl font-serif text-cyan-400 w-8 text-center">{num.number}</span>
                <div>
                  <p className="text-theme-text-primary text-sm font-medium">{chakra?.name || num.chakraId}</p>
                  <p className="text-theme-text-tertiary text-xs">{chakra?.sanskritName}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function NumerologyCard({ num }: { num: NumerologyNumber }) {
  const isMaster = num.isMasterNumber;
  return (
    <Link
      to={`/numerology/${num.id}`}
      className={`bg-surface-base/50 rounded-xl p-5 border transition-all group ${
        isMaster
          ? 'border-cyan-500/40 hover:border-cyan-400/70 hover:bg-surface-base'
          : 'border-theme-border-subtle hover:border-cyan-500/50 hover:bg-surface-base'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-2xl font-serif ${isMaster ? 'text-cyan-300' : 'text-cyan-400'}`}>
          {num.symbol}
        </span>
        {isMaster && (
          <span className="text-xs text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded-full">Master</span>
        )}
      </div>

      <h3 className="font-serif text-lg text-theme-text-primary group-hover:text-cyan-300 transition-colors mb-1">
        {num.name}
      </h3>
      <p className="text-theme-text-tertiary text-xs mb-3">{num.harmonicTone}</p>

      {/* Lower Expression → Highest Expression */}
      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-16 text-theme-text-tertiary text-xs">Lower:</span>
          <span className="text-red-400">{num.lowerExpression.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-16 text-theme-text-tertiary text-xs">Highest:</span>
          <span className="text-purple-400">{num.highestExpression.name}</span>
        </div>
      </div>
    </Link>
  );
}

export default Numerology;
