import { getHousesInOrder, getHousesByType } from '../data';
import { EntityCard, FilterBar, type FilterOption } from '../components';
import { HouseSubstanceWheel } from '../components/HouseSubstanceWheel';
import { useState } from 'react';
import type { HouseType } from '../types';

type FilterMode = 'all' | HouseType;

const filterOptions: FilterOption<FilterMode>[] = [
  { value: 'all', label: 'All Houses' },
  { value: 'Angular', label: 'Angular' },
  { value: 'Succedent', label: 'Succedent' },
  { value: 'Cadent', label: 'Cadent' },
];

export function Houses() {
  const [filter, setFilter] = useState<FilterMode>('all');

  const allHouses = getHousesInOrder();
  const filteredHouses = filter === 'all'
    ? allHouses
    : getHousesByType(filter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">⌂</span>
          <h1 className="font-serif text-3xl font-medium">Houses</h1>
        </div>
        <p className="text-theme-text-secondary max-w-3xl">
          The twelve houses represent different arenas of life experience—where planetary
          energies play out in your daily existence. While signs show <em className="text-theme-text-secondary">how</em> you
          express, houses show <em className="text-theme-text-secondary">where</em> in life that expression manifests.
        </p>
        <p className="text-theme-text-tertiary text-sm mt-2 italic">
          "Houses are where you live. Signs are how you live there."
        </p>
      </section>

      {/* House Substance Wheel */}
      <section className="flex flex-col items-center">
        <HouseSubstanceWheel size={440} />

        {/* Substance legend */}
        <div className="mb-8 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-center">
            <div className="text-lg mb-0.5">🜍</div>
            <div className="text-xs font-semibold text-amber-400">Sulphur (Yang)</div>
            <div className="text-[10px] text-theme-text-tertiary mt-0.5">Action · Impulse · Houses 1–4</div>
          </div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
            <div className="text-lg mb-0.5">🜔</div>
            <div className="text-xs font-semibold text-emerald-400">Sal (Bridge)</div>
            <div className="text-[10px] text-theme-text-tertiary mt-0.5">Integration · Feeling · Houses 5–8</div>
          </div>
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3 text-center">
            <div className="text-lg mb-0.5">☿</div>
            <div className="text-xs font-semibold text-indigo-400">Mercurius (Yin)</div>
            <div className="text-[10px] text-theme-text-tertiary mt-0.5">Expansion · Vision · Houses 9–12</div>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section>
        <FilterBar
          options={filterOptions}
          value={filter}
          onChange={setFilter}
          getActiveColor={() => 'bg-earth-500/20 text-earth-400 border-earth-500/30'}
        />
      </section>

      {/* Houses Grid */}
      <section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHouses.map((house) => (
            <EntityCard key={house.id} entity={house} />
          ))}
        </div>
      </section>

      {/* House Types Guide */}
      <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
        <h3 className="font-serif text-lg mb-4">Understanding House Types</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-theme-text-primary mb-1">Angular Houses (1, 4, 7, 10)</h4>
            <p className="text-theme-text-secondary">
              The most powerful houses, marking the cardinal points of the chart.
              Planets here have the strongest expression in your life.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-theme-text-primary mb-1">Succedent Houses (2, 5, 8, 11)</h4>
            <p className="text-theme-text-secondary">
              Following angular houses, these deal with resources, values, and
              what we develop from our angular house initiatives.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-theme-text-primary mb-1">Cadent Houses (3, 6, 9, 12)</h4>
            <p className="text-theme-text-secondary">
              Houses of learning, service, and adaptation. They prepare us for
              the next angular house through mental and spiritual development.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Houses;
