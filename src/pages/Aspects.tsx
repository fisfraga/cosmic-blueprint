import { aspects, getMajorAspects, getAspectsByNature } from '../data';
import { EntityCard, FilterBar, getAspectFilterColor, type FilterOption } from '../components';
import { useState } from 'react';
import type { AspectNature } from '../types';

type FilterMode = 'all' | 'major' | AspectNature;

const filterOptions: FilterOption<FilterMode>[] = [
  { value: 'all', label: 'All Aspects' },
  { value: 'major', label: 'Major Aspects' },
  { value: 'Harmonious', label: 'Harmonious' },
  { value: 'Challenging', label: 'Challenging' },
  { value: 'Neutral', label: 'Neutral' },
];

export function Aspects() {
  const [filter, setFilter] = useState<FilterMode>('all');

  const getFilteredAspects = () => {
    switch (filter) {
      case 'all':
        return Array.from(aspects.values());
      case 'major':
        return getMajorAspects();
      case 'Harmonious':
      case 'Challenging':
      case 'Neutral':
        return getAspectsByNature(filter);
      default:
        return Array.from(aspects.values());
    }
  };

  const filteredAspects = getFilteredAspects();

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">△</span>
          <h1 className="font-serif text-3xl font-medium">Aspects</h1>
        </div>
        <p className="text-neutral-400 max-w-3xl">
          Aspects are the angular relationships between planets in your chart—the sacred geometry
          that describes how different parts of your psyche communicate with each other.
          They reveal the internal dialogues, tensions, and harmonies within your being.
        </p>
      </section>

      {/* Filter */}
      <section>
        <FilterBar
          options={filterOptions}
          value={filter}
          onChange={setFilter}
          getActiveColor={getAspectFilterColor}
        />
      </section>

      {/* Aspects Grid */}
      <section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAspects.map((aspect) => (
            <EntityCard key={aspect.id} entity={aspect} />
          ))}
        </div>
      </section>

      {/* Aspect Nature Guide */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h3 className="font-serif text-lg mb-4">Understanding Aspect Natures</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-water-400 mb-1">Harmonious Aspects</h4>
            <p className="text-neutral-400">
              Trines (120°) and sextiles (60°) create natural flow between planets.
              These represent talents and ease, though they can also indicate areas
              where we coast rather than grow.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-fire-400 mb-1">Challenging Aspects</h4>
            <p className="text-neutral-400">
              Squares (90°) and oppositions (180°) create tension and friction.
              These are the growth engines of your chart—the places where you
              develop strength through challenge.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-neutral-300 mb-1">Neutral Aspects</h4>
            <p className="text-neutral-400">
              Conjunctions (0°) are neither harmonious nor challenging—they represent
              a fusion of energies that must be integrated as one unified force.
            </p>
          </div>
        </div>
      </section>

      {/* Major Aspects Table */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h3 className="font-serif text-lg mb-4">Major Aspects at a Glance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-700 text-left">
                <th className="py-2 px-3 text-neutral-400">Aspect</th>
                <th className="py-2 px-3 text-neutral-400">Angle</th>
                <th className="py-2 px-3 text-neutral-400">Nature</th>
                <th className="py-2 px-3 text-neutral-400">Keyword</th>
              </tr>
            </thead>
            <tbody>
              {getMajorAspects().map((aspect) => (
                <tr key={aspect.id} className="border-b border-neutral-800">
                  <td className="py-2 px-3">
                    <span className="mr-2">{aspect.symbol}</span>
                    {aspect.name}
                  </td>
                  <td className="py-2 px-3 text-neutral-400">{aspect.angle}°</td>
                  <td className="py-2 px-3">
                    <span
                      className={
                        aspect.nature === 'Harmonious'
                          ? 'text-water-400'
                          : aspect.nature === 'Challenging'
                          ? 'text-fire-400'
                          : 'text-neutral-300'
                      }
                    >
                      {aspect.nature}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-neutral-400">{aspect.keyword}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
export default Aspects;
