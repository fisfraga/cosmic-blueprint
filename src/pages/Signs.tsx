import { getSignsInOrder, getSignsByElement } from '../data';
import { EntityCard, FilterBar, getElementFilterColor, type FilterOption } from '../components';
import { useState } from 'react';

type FilterMode = 'all' | 'fire' | 'earth' | 'air' | 'water';

const filterOptions: FilterOption<FilterMode>[] = [
  { value: 'all', label: 'All Signs', icon: '✧' },
  { value: 'fire', label: 'Fire', icon: '🜂' },
  { value: 'earth', label: 'Earth', icon: '🜃' },
  { value: 'air', label: 'Air', icon: '🜁' },
  { value: 'water', label: 'Water', icon: '🜄' },
];

export function Signs() {
  const [filter, setFilter] = useState<FilterMode>('all');

  const allSigns = getSignsInOrder();
  const filteredSigns = filter === 'all'
    ? allSigns
    : getSignsByElement(filter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">♈︎</span>
          <h1 className="font-serif text-3xl font-medium">Zodiac Signs</h1>
        </div>
        <p className="text-neutral-400 max-w-3xl">
          The twelve zodiac signs represent archetypal energies—ways of being and expressing
          in the world. Everyone has all twelve signs in their chart; the signs show
          <em className="text-neutral-300"> how</em> the planetary energies express themselves.
        </p>
      </section>

      {/* Filter */}
      <section>
        <FilterBar
          options={filterOptions}
          value={filter}
          onChange={setFilter}
          getActiveColor={getElementFilterColor}
        />
      </section>

      {/* Signs Grid */}
      <section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSigns.map((sign) => (
            <EntityCard key={sign.id} entity={sign} />
          ))}
        </div>
      </section>

      {/* Modality Guide */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h3 className="font-serif text-lg mb-4">Understanding Modalities</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-neutral-200 mb-1">Cardinal Signs</h4>
            <p className="text-neutral-400">
              Initiators and leaders. Aries, Cancer, Libra, Capricorn begin each season
              and excel at starting new things.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-neutral-200 mb-1">Fixed Signs</h4>
            <p className="text-neutral-400">
              Stabilizers and sustainers. Taurus, Leo, Scorpio, Aquarius hold the middle
              of each season and excel at maintaining.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-neutral-200 mb-1">Mutable Signs</h4>
            <p className="text-neutral-400">
              Adapters and transformers. Gemini, Virgo, Sagittarius, Pisces end each season
              and excel at transitioning.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Signs;
