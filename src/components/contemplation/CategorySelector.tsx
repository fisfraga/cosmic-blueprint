import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { AstroProfile } from '../../types';
import type { ContemplationCategory, ContemplationType, FocusEntity } from '../../services/contemplation/context';
import { getFocusOptions } from '../../services/contemplation/context';
import { EntityPicker } from '../entities';
import {
  CONTEMPLATION_TYPES,
  CATEGORY_INFO,
  MODEL_OPTIONS,
  type ContemplationTypeOption,
  type ContemplationLevel,
  type ModelOption,
} from '../../hooks/useContemplation';
import { loadCustomTypes } from '../../services/contemplation/customTypes';

const LEVEL_OPTIONS: { value: ContemplationLevel | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'master', label: 'Master' },
];

const LEVEL_COLORS: Record<ContemplationLevel, string> = {
  beginner: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
  advanced: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
  master: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
};

const LEVEL_FILTER_KEY = 'contemplation-level-filter';

// Sub-section dividers for crossSystem — shown only in "All" level view
const CROSSSYSTEM_SECTION_STARTS: Partial<Record<string, string>> = {
  gateKeyOverview:      '⬡ Gate ↔ Key',
  planetSphereSynthesis: '⟳ Multi-System Synthesis',
  holisticReading:      '◈ Holistic Integration',
};

export interface CategorySelectorProps {
  profile: AstroProfile;
  category: ContemplationCategory | null;
  setCategory: (cat: ContemplationCategory) => void;
  contemplationType: ContemplationType | null;
  setContemplationType: (type: ContemplationType) => void;
  focusEntity: FocusEntity | null;
  setFocusEntity: (entity: FocusEntity | null) => void;
  selectedTypeOption: ContemplationTypeOption | null;
  needsFocus: boolean;
  canStartChat: boolean;
  selectedModel: string | null;
  setSelectedModel: (model: string | null) => void;
  isSending: boolean;
  error: string | null;
  canRetry: boolean;
  isRetrying: boolean;
  retryFn: (() => void) | null;
  savedSessions: { length: number };
  showSavedSessions: boolean;
  setShowSavedSessions: (show: boolean) => void;
  goBack: () => void;
  startContemplation: () => void;
}

export function CategorySelector({
  profile,
  category,
  setCategory,
  contemplationType,
  setContemplationType,
  focusEntity,
  setFocusEntity,
  selectedTypeOption,
  needsFocus,
  canStartChat,
  selectedModel,
  setSelectedModel,
  isSending,
  error,
  canRetry,
  isRetrying,
  retryFn,
  savedSessions,
  showSavedSessions,
  setShowSavedSessions,
  goBack,
  startContemplation,
}: CategorySelectorProps) {
  const [levelFilter, setLevelFilter] = useState<ContemplationLevel | 'all'>(() => {
    try {
      const stored = localStorage.getItem(LEVEL_FILTER_KEY);
      const valid: (ContemplationLevel | 'all')[] = ['all', 'beginner', 'advanced', 'master'];
      return valid.includes(stored as ContemplationLevel | 'all')
        ? (stored as ContemplationLevel | 'all')
        : 'all';
    } catch {
      return 'all';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LEVEL_FILTER_KEY, levelFilter);
    } catch { /* ignore */ }
  }, [levelFilter]);

  const focusOptions = needsFocus && category && contemplationType && category !== 'lifeOS'
    ? getFocusOptions(profile, category, contemplationType)
    : [];

  const allTypesForCategory: ContemplationTypeOption[] = category
    ? [...CONTEMPLATION_TYPES[category], ...loadCustomTypes(category)]
    : [];

  const filteredTypes = allTypesForCategory.filter(
    (t) => levelFilter === 'all' || t.level === levelFilter
  );

  return (
    <>
      {/* Phase 1: Category Selection */}
      {!category && !showSavedSessions && (
        <motion.div
          key="category"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {/* Saved Sessions Toggle */}
          {savedSessions.length > 0 && (
            <div className="mb-6 flex justify-center">
              <button
                onClick={() => setShowSavedSessions(true)}
                className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 transition-colors"
              >
                <span>📜</span>
                View {savedSessions.length} saved session{savedSessions.length !== 1 ? 's' : ''}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.keys(CATEGORY_INFO) as ContemplationCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`p-6 rounded-xl bg-gradient-to-br ${CATEGORY_INFO[cat].color} border text-left transition-all hover:scale-[1.02] hover:shadow-lg`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{CATEGORY_INFO[cat].icon}</span>
                  <h2 className="font-serif text-xl text-theme-text-primary">{CATEGORY_INFO[cat].name}</h2>
                </div>
                <p className="text-theme-text-secondary text-sm">
                  {cat === 'astrology' && 'Explore planets, signs, houses, and aspects'}
                  {cat === 'humanDesign' && 'Type, Authority, Gates, and Channels'}
                  {cat === 'geneKeys' && 'Shadow, Gift, and Siddhi contemplations'}
                  {cat === 'crossSystem' && 'Weave all three systems together'}
                  {cat === 'lifeOS' && 'Connect cosmic design to intentional living'}
                  {cat === 'alchemy' && 'Chakra Activations & Hermetic Alchemy'}
                  {cat === 'numerology' && 'Life Path and Birthday Number as living archetypes'}
                  {cat === 'cosmicEmbodiment' && 'Let any cosmic energy speak directly to you'}
                  {cat === 'fixedStars' && 'The ancient stellar gatekeepers in your chart'}
                  {cat === 'galacticAstrology' && 'Galactic Center, Great Attractor, and cosmic portals'}
                </p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Phase 2: Type Selection */}
      {category && !contemplationType && (
        <motion.div
          key="type"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <button
            onClick={goBack}
            className="mb-4 text-theme-text-secondary hover:text-theme-text-primary text-sm flex items-center gap-1"
          >
            ← Back to categories
          </button>

          <div className={`p-4 rounded-xl bg-gradient-to-br ${CATEGORY_INFO[category].color} border mb-6`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{CATEGORY_INFO[category].icon}</span>
              <h2 className="font-serif text-lg text-theme-text-primary">{CATEGORY_INFO[category].name}</h2>
            </div>
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-theme-text-tertiary text-xs uppercase tracking-wider">Level:</span>
            <div className="flex gap-1">
              {LEVEL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setLevelFilter(opt.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    levelFilter === opt.value
                      ? 'bg-theme-border text-theme-text-primary border-theme-border'
                      : 'text-theme-text-tertiary border-theme-border-subtle hover:border-theme-border hover:text-theme-text-secondary'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredTypes.length > 0 ? filteredTypes.flatMap((type) => {
              const elements: React.ReactNode[] = [];
              // Insert sub-section header for crossSystem at "All" level view
              if (category === 'crossSystem' && levelFilter === 'all' && CROSSSYSTEM_SECTION_STARTS[type.id]) {
                elements.push(
                  <p key={`section-${type.id}`} className="col-span-full text-xs text-theme-text-tertiary uppercase tracking-widest pt-3 pb-1 border-t border-theme-border-subtle">
                    {CROSSSYSTEM_SECTION_STARTS[type.id]}
                  </p>
                );
              }
              elements.push(
                <button
                  key={type.id}
                  onClick={() => setContemplationType(type.id)}
                  className="p-4 rounded-xl bg-surface-overlay border border-theme-border-subtle hover:border-theme-border text-left transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-medium text-theme-text-primary">{type.name}</h4>
                    {type.level && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${LEVEL_COLORS[type.level]}`}>
                        {type.level}
                      </span>
                    )}
                  </div>
                  <p className="text-theme-text-secondary text-sm">{type.description}</p>
                </button>
              );
              return elements;
            }) : (
              <p className="text-theme-text-tertiary text-sm col-span-2 py-4 text-center">
                No {levelFilter} types in this category.{' '}
                <button onClick={() => setLevelFilter('all')} className="text-theme-text-secondary hover:text-theme-text-primary underline">
                  Show all
                </button>
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Phase 3: Focus Selection (if needed) */}
      {category && contemplationType && needsFocus && !focusEntity && (
        <motion.div
          key="focus"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <button
            onClick={goBack}
            className="mb-4 text-theme-text-secondary hover:text-theme-text-primary text-sm flex items-center gap-1"
          >
            ← Back to types
          </button>

          <div className={`p-4 rounded-xl bg-gradient-to-br ${CATEGORY_INFO[category].color} border mb-6`}>
            <p className="text-theme-text-secondary text-sm">{CATEGORY_INFO[category].name} · {selectedTypeOption?.name}</p>
          </div>

          {/* Special EntityPicker for Cosmic Embodiment */}
          {contemplationType === 'cosmicEmbodiment' ? (
            <>
              <h3 className="text-theme-text-secondary mb-4">Which cosmic energy would you like to hear from?</h3>
              <EntityPicker
                onSelect={(entity) => setFocusEntity({
                  type: 'embodiment',
                  id: entity.id,
                  name: entity.name,
                  entitySystem: entity.system === 'shared' ? undefined : entity.system,
                })}
              />
            </>
          ) : (
            <>
              <h3 className="text-theme-text-secondary mb-4">Select a focus:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-2">
                {focusOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setFocusEntity(option)}
                    className="p-3 rounded-lg bg-surface-overlay border border-theme-border-subtle hover:border-theme-border text-left transition-all text-sm"
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Phase 4: Start Button */}
      {canStartChat && (
        <motion.div
          key="start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center"
        >
          <button
            onClick={goBack}
            className="mb-4 text-theme-text-secondary hover:text-theme-text-primary text-sm flex items-center gap-1 mx-auto"
          >
            ← Change selection
          </button>

          <div className={`p-6 rounded-xl bg-gradient-to-br ${CATEGORY_INFO[category!].color} border mb-6`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">{CATEGORY_INFO[category!].icon}</span>
              <h2 className="font-serif text-xl text-theme-text-primary">{selectedTypeOption?.name}</h2>
            </div>
            {focusEntity && (
              <p className="text-theme-text-secondary">{focusEntity.name}</p>
            )}
          </div>

          {/* Model Selector */}
          <div className="mb-6">
            <p className="text-theme-text-tertiary text-xs uppercase tracking-wider mb-3 text-center">Choose your guide</p>
            <div className="flex gap-2 justify-center">
              {MODEL_OPTIONS.map((opt: ModelOption) => {
                const isSelected = selectedModel === opt.value;
                return (
                  <button
                    key={opt.label}
                    onClick={() => setSelectedModel(opt.value)}
                    className={`flex flex-col items-center p-3 rounded-xl border transition-all flex-1 max-w-[90px] ${
                      isSelected
                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                        : 'bg-surface-overlay border-theme-border-subtle hover:border-theme-border text-theme-text-secondary hover:text-theme-text-secondary'
                    }`}
                  >
                    <span className="text-xl mb-1">{opt.icon}</span>
                    <span className="text-sm font-medium">{opt.label}</span>
                    <span className="text-xs opacity-70 text-center leading-tight mt-0.5">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={startContemplation}
            disabled={isSending}
            className="px-8 py-4 bg-white text-neutral-900 rounded-xl font-medium text-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? 'Opening the chamber...' : 'Begin Contemplation'}
          </button>

          {/* Error display for initial API call */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
              {canRetry && retryFn && !isRetrying && (
                <button
                  onClick={retryFn}
                  className="mt-2 px-4 py-1.5 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              )}
              {isRetrying && (
                <p className="mt-2 text-yellow-400 text-xs animate-pulse">Retrying...</p>
              )}
            </div>
          )}
        </motion.div>
      )}
    </>
  );
}
