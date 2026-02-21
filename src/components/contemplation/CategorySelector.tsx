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
  type ModelOption,
} from '../../hooks/useContemplation';

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
  const focusOptions = needsFocus && category && contemplationType && category !== 'lifeOS'
    ? getFocusOptions(profile, category, contemplationType)
    : [];

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(CATEGORY_INFO) as ContemplationCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`p-6 rounded-xl bg-gradient-to-br ${CATEGORY_INFO[cat].color} border text-left transition-all hover:scale-[1.02] hover:shadow-lg`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{CATEGORY_INFO[cat].icon}</span>
                  <h2 className="font-serif text-xl text-white">{CATEGORY_INFO[cat].name}</h2>
                </div>
                <p className="text-neutral-400 text-sm">
                  {cat === 'astrology' && 'Explore planets, signs, houses, and aspects'}
                  {cat === 'humanDesign' && 'Type, Authority, Gates, and Channels'}
                  {cat === 'geneKeys' && 'Shadow, Gift, and Siddhi contemplations'}
                  {cat === 'crossSystem' && 'Weave all three systems together'}
                  {cat === 'lifeOS' && 'Connect cosmic design to intentional living'}
                  {cat === 'alchemy' && 'Numerology, Chakra Activations & Hermetic Alchemy'}
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
            className="mb-4 text-neutral-400 hover:text-white text-sm flex items-center gap-1"
          >
            ← Back to categories
          </button>

          <div className={`p-4 rounded-xl bg-gradient-to-br ${CATEGORY_INFO[category].color} border mb-6`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{CATEGORY_INFO[category].icon}</span>
              <h2 className="font-serif text-lg text-white">{CATEGORY_INFO[category].name}</h2>
            </div>
          </div>

          <h3 className="text-neutral-300 mb-4">Choose a contemplation type:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CONTEMPLATION_TYPES[category].map((type) => (
              <button
                key={type.id}
                onClick={() => setContemplationType(type.id)}
                className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 text-left transition-all"
              >
                <h4 className="font-medium text-white mb-1">{type.name}</h4>
                <p className="text-neutral-400 text-sm">{type.description}</p>
              </button>
            ))}
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
            className="mb-4 text-neutral-400 hover:text-white text-sm flex items-center gap-1"
          >
            ← Back to types
          </button>

          <div className={`p-4 rounded-xl bg-gradient-to-br ${CATEGORY_INFO[category].color} border mb-6`}>
            <p className="text-neutral-300 text-sm">{CATEGORY_INFO[category].name} · {selectedTypeOption?.name}</p>
          </div>

          {/* Special EntityPicker for Cosmic Embodiment */}
          {contemplationType === 'cosmicEmbodiment' ? (
            <>
              <h3 className="text-neutral-300 mb-4">Which cosmic energy would you like to hear from?</h3>
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
              <h3 className="text-neutral-300 mb-4">Select a focus:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-2">
                {focusOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setFocusEntity(option)}
                    className="p-3 rounded-lg bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 text-left transition-all text-sm"
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
            className="mb-4 text-neutral-400 hover:text-white text-sm flex items-center gap-1 mx-auto"
          >
            ← Change selection
          </button>

          <div className={`p-6 rounded-xl bg-gradient-to-br ${CATEGORY_INFO[category!].color} border mb-6`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">{CATEGORY_INFO[category!].icon}</span>
              <h2 className="font-serif text-xl text-white">{selectedTypeOption?.name}</h2>
            </div>
            {focusEntity && (
              <p className="text-neutral-300">{focusEntity.name}</p>
            )}
          </div>

          {/* Model Selector */}
          <div className="mb-6">
            <p className="text-neutral-500 text-xs uppercase tracking-wider mb-3 text-center">Choose your guide</p>
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
                        : 'bg-neutral-800/50 border-neutral-700 hover:border-neutral-600 text-neutral-400 hover:text-neutral-300'
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
