import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ConstellationGraph } from '../components';
import type { RelationshipType, EntityType } from '../types';

const relationshipTypeGroups = [
  {
    label: 'Rulership',
    types: ['RULES', 'RULED_BY', 'HOUSE_RULED_BY_SIGN', 'HOUSE_RULED_BY_PLANET'] as RelationshipType[],
  },
  {
    label: 'Elements',
    types: ['HAS_ELEMENT', 'HAS_ALCHEMICAL_ELEMENT', 'ENERGIZES', 'CHALLENGES', 'FLOWS_WITH'] as RelationshipType[],
  },
  {
    label: 'Oppositions',
    types: ['OPPOSES'] as RelationshipType[],
  },
];

const entityTypeOptions: { label: string; value: EntityType }[] = [
  { label: 'Planets', value: 'planet' },
  { label: 'Signs', value: 'sign' },
  { label: 'Houses', value: 'house' },
  { label: 'Elements', value: 'element' },
];

export function Graph() {
  const [selectedRelationshipTypes, setSelectedRelationshipTypes] = useState<RelationshipType[]>([]);
  const [selectedEntityTypes, setSelectedEntityTypes] = useState<EntityType[]>([
    'planet',
    'sign',
    'house',
    'element',
  ]);
  const [graphSize, setGraphSize] = useState({ width: 900, height: 600 });

  // Calculate graph size based on window
  useEffect(() => {
    function updateSize() {
      const width = Math.min(window.innerWidth - 48, 1200);
      const height = Math.min(window.innerHeight - 300, 700);
      setGraphSize({ width, height });
    }

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const toggleRelationshipGroup = (types: RelationshipType[]) => {
    const allSelected = types.every((t) => selectedRelationshipTypes.includes(t));
    if (allSelected) {
      setSelectedRelationshipTypes((prev) => prev.filter((t) => !types.includes(t)));
    } else {
      setSelectedRelationshipTypes((prev) => [...new Set([...prev, ...types])]);
    }
  };

  const toggleEntityType = (type: EntityType) => {
    setSelectedEntityTypes((prev) => {
      if (prev.includes(type)) {
        // Don't allow deselecting all
        if (prev.length <= 1) return prev;
        return prev.filter((t) => t !== type);
      }
      return [...prev, type];
    });
  };

  const clearFilters = () => {
    setSelectedRelationshipTypes([]);
    setSelectedEntityTypes(['planet', 'sign', 'house', 'element']);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-serif text-4xl font-medium text-white mb-3">
          Constellation Pathways
        </h1>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          Explore the web of astrological relationships. Each node represents an entity,
          and the lines show how they connect through rulership, elements, and cosmic patterns.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <h3 className="text-sm font-semibold text-white">Filters:</h3>

          {/* Entity Type Filters */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">Entities:</span>
            {entityTypeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleEntityType(option.value)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  selectedEntityTypes.includes(option.value)
                    ? 'bg-white text-neutral-900'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-neutral-700" />

          {/* Relationship Type Filters */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">Relationships:</span>
            {relationshipTypeGroups.map((group) => {
              const allSelected = group.types.every((t) =>
                selectedRelationshipTypes.includes(t)
              );
              const someSelected =
                !allSelected &&
                group.types.some((t) => selectedRelationshipTypes.includes(t));

              return (
                <button
                  key={group.label}
                  onClick={() => toggleRelationshipGroup(group.types)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    allSelected
                      ? 'bg-white text-neutral-900'
                      : someSelected
                      ? 'bg-neutral-700 text-white'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  {group.label}
                </button>
              );
            })}
          </div>

          {(selectedRelationshipTypes.length > 0 ||
            selectedEntityTypes.length < 4) && (
            <>
              <div className="h-4 w-px bg-neutral-700" />
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-xs rounded-full bg-neutral-800 text-neutral-400 hover:bg-neutral-700 transition-colors"
              >
                Clear Filters
              </button>
            </>
          )}
        </div>

        {selectedRelationshipTypes.length > 0 && (
          <p className="text-xs text-neutral-500">
            Showing only: {selectedRelationshipTypes.join(', ')}
          </p>
        )}
      </div>

      {/* Graph */}
      <div className="flex justify-center">
        <ConstellationGraph
          width={graphSize.width}
          height={graphSize.height}
          filterRelationshipTypes={
            selectedRelationshipTypes.length > 0
              ? selectedRelationshipTypes
              : undefined
          }
          filterEntityTypes={selectedEntityTypes}
        />
      </div>

      {/* Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-neutral-900/30 rounded-lg p-4 border border-neutral-800">
          <div className="text-3xl mb-2">☉</div>
          <h4 className="font-serif text-lg text-white mb-1">Planetary Rulership</h4>
          <p className="text-neutral-400 text-sm">
            Golden lines connect planets to the signs they rule, showing the cosmic hierarchy.
          </p>
        </div>
        <div className="bg-neutral-900/30 rounded-lg p-4 border border-neutral-800">
          <div className="text-3xl mb-2">🜂</div>
          <h4 className="font-serif text-lg text-white mb-1">Elemental Bonds</h4>
          <p className="text-neutral-400 text-sm">
            Signs cluster around their elements, revealing temperamental kinship.
          </p>
        </div>
        <div className="bg-neutral-900/30 rounded-lg p-4 border border-neutral-800">
          <div className="text-3xl mb-2">☍</div>
          <h4 className="font-serif text-lg text-white mb-1">Polarity Axes</h4>
          <p className="text-neutral-400 text-sm">
            Opposing signs form balancing pairs across the cosmic wheel.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
export default Graph;
