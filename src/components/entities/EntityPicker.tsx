// ============================================
// Entity Picker Component
// ============================================
// Allows users to search and select any entity for Cosmic Embodiment
// Supports filtering by system and searching by name

import React, { useState, useMemo } from 'react';
import {
  searchEntities,
  getEntitiesBySystem,
  type EntityInfo,
  type EntitySystem,
} from '../../services/entities';

interface EntityPickerProps {
  onSelect: (entity: EntityInfo) => void;
  selectedId?: string;
}

// System filter options with colors
const SYSTEM_OPTIONS: Array<{ value: EntitySystem | 'all'; label: string; color: string }> = [
  { value: 'all', label: 'All Systems', color: 'bg-purple-500' },
  { value: 'astrology', label: 'Astrology', color: 'bg-purple-500' },
  { value: 'humanDesign', label: 'Human Design', color: 'bg-amber-500' },
  { value: 'geneKeys', label: 'Gene Keys', color: 'bg-emerald-500' },
];

// Entity type groups for better organization
const ENTITY_TYPE_GROUPS: Record<EntitySystem, string[]> = {
  astrology: ['planet', 'sign', 'house', 'element', 'aspect'],
  humanDesign: ['hd-type', 'hd-authority', 'hd-center', 'hd-gate', 'hd-channel', 'hd-profile', 'hd-line'],
  geneKeys: ['gene-key', 'gk-sphere', 'gk-sequence', 'codon-ring'],
  shared: [],
};

// Friendly names for entity types
const TYPE_LABELS: Record<string, string> = {
  planet: 'Planets',
  sign: 'Zodiac Signs',
  house: 'Houses',
  element: 'Elements',
  aspect: 'Aspects',
  'hd-type': 'Types',
  'hd-authority': 'Authorities',
  'hd-center': 'Centers',
  'hd-gate': 'Gates',
  'hd-channel': 'Channels',
  'hd-profile': 'Profiles',
  'hd-line': 'Lines',
  'gene-key': 'Gene Keys',
  'gk-sphere': 'Spheres',
  'gk-sequence': 'Sequences',
  'codon-ring': 'Codon Rings',
};

export function EntityPicker({ onSelect, selectedId }: EntityPickerProps): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<EntitySystem | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string | 'all'>('all');

  // Get filtered entities
  const entities = useMemo(() => {
    let results: EntityInfo[];

    if (searchQuery.trim()) {
      // Search mode
      results = searchEntities(searchQuery, {
        system: selectedSystem !== 'all' ? selectedSystem : undefined,
        limit: 50,
      });
    } else {
      // Browse mode
      if (selectedSystem === 'all') {
        // Get popular entities from each system
        results = [
          ...getEntitiesBySystem('astrology').filter(e => e.type === 'planet' || e.type === 'sign').slice(0, 20),
          ...getEntitiesBySystem('humanDesign').filter(e => e.type === 'hd-type' || e.type === 'hd-center').slice(0, 15),
          ...getEntitiesBySystem('geneKeys').filter(e => e.type === 'gene-key').slice(0, 15),
        ];
      } else {
        results = getEntitiesBySystem(selectedSystem);
      }
    }

    // Filter by type if selected
    if (selectedType !== 'all') {
      results = results.filter(e => e.type === selectedType);
    }

    return results.slice(0, 60); // Limit for performance
  }, [searchQuery, selectedSystem, selectedType]);

  // Get available types for selected system
  const availableTypes = useMemo(() => {
    if (selectedSystem === 'all') {
      return Object.values(ENTITY_TYPE_GROUPS).flat();
    }
    return ENTITY_TYPE_GROUPS[selectedSystem] || [];
  }, [selectedSystem]);

  // Reset type when system changes
  const handleSystemChange = (system: EntitySystem | 'all') => {
    setSelectedSystem(system);
    setSelectedType('all');
  };

  // Group entities by type for display
  const groupedEntities = useMemo(() => {
    const groups: Record<string, EntityInfo[]> = {};
    for (const entity of entities) {
      if (!groups[entity.type]) {
        groups[entity.type] = [];
      }
      groups[entity.type].push(entity);
    }
    return groups;
  }, [entities]);

  const systemColor = (system: EntitySystem) => {
    switch (system) {
      case 'astrology': return 'text-purple-400 bg-purple-500/20';
      case 'humanDesign': return 'text-amber-400 bg-amber-500/20';
      case 'geneKeys': return 'text-emerald-400 bg-emerald-500/20';
      default: return 'text-blue-400 bg-blue-500/20';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search for any cosmic energy..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl
            text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* System Filters */}
      <div className="flex flex-wrap gap-2">
        {SYSTEM_OPTIONS.map(({ value, label, color }) => (
          <button
            key={value}
            onClick={() => handleSystemChange(value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${selectedSystem === value
                ? `${color} text-white`
                : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Type Filters (when not in search mode and system is selected) */}
      {!searchQuery && selectedSystem !== 'all' && availableTypes.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-2 py-1 rounded text-xs transition-colors
              ${selectedType === 'all'
                ? 'bg-neutral-600 text-white'
                : 'bg-neutral-800 text-neutral-500 hover:text-white'
              }`}
          >
            All
          </button>
          {availableTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2 py-1 rounded text-xs transition-colors
                ${selectedType === type
                  ? 'bg-neutral-600 text-white'
                  : 'bg-neutral-800 text-neutral-500 hover:text-white'
                }`}
            >
              {TYPE_LABELS[type] || type}
            </button>
          ))}
        </div>
      )}

      {/* Entity Grid */}
      <div className="max-h-80 overflow-y-auto pr-2 space-y-4">
        {Object.entries(groupedEntities).map(([type, typeEntities]) => (
          <div key={type}>
            <h4 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
              {TYPE_LABELS[type] || type}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {typeEntities.map(entity => (
                <button
                  key={entity.id}
                  onClick={() => onSelect(entity)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all
                    ${selectedId === entity.id
                      ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white'
                    }`}
                >
                  {entity.symbol && (
                    <span className="text-lg opacity-80">{entity.symbol}</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium block truncate">{entity.name}</span>
                    <span className={`text-xs ${systemColor(entity.system)} px-1 rounded`}>
                      {entity.system === 'astrology' ? 'Astro' :
                       entity.system === 'humanDesign' ? 'HD' : 'GK'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {entities.length === 0 && (
          <div className="text-center py-8 text-neutral-500">
            {searchQuery ? 'No entities found' : 'Select a system to browse entities'}
          </div>
        )}
      </div>

      {/* Selection Hint */}
      <p className="text-xs text-neutral-500 text-center">
        Select an energy to hear it speak directly to you
      </p>
    </div>
  );
}

export default EntityPicker;
