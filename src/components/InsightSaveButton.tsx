// ============================================
// Insight Save Button Component
// ============================================
// Allows users to save insights from contemplation messages

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveInsight, getAllTags } from '../services/insights';
import type { ContemplationCategory, ContemplationType } from '../services/contemplation/context';
import { useProfile } from '../context/ProfileContext';

interface InsightSaveButtonProps {
  content: string;
  category: ContemplationCategory;
  contemplationType: ContemplationType;
  sessionId?: string;
  focusEntity?: string;
  onSaved?: () => void;
}

export function InsightSaveButton({
  content,
  category,
  contemplationType,
  sessionId,
  focusEntity,
  onSaved,
}: InsightSaveButtonProps) {
  const { cosmicProfile } = useProfile();
  const [showModal, setShowModal] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showModal) {
      setExistingTags(getAllTags());
      inputRef.current?.focus();
    }
  }, [showModal]);

  const handleAddTag = () => {
    const newTag = tagInput.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const handleSave = () => {
    saveInsight({
      content,
      category,
      contemplationType,
      tags,
      sessionId,
      focusEntity,
      profileId: cosmicProfile?.meta.id,
    });
    setSaved(true);
    setShowModal(false);
    setTags([]);
    setTagInput('');
    onSaved?.();

    // Reset saved state after animation
    setTimeout(() => setSaved(false), 2000);
  };

  const suggestedTags = existingTags
    .filter(t => !tags.includes(t) && t.includes(tagInput.toLowerCase()))
    .slice(0, 5);

  return (
    <>
      {/* Save Button */}
      <button
        onClick={() => setShowModal(true)}
        className={`
          p-1.5 rounded transition-all duration-200
          ${saved
            ? 'text-emerald-400 bg-emerald-500/20'
            : 'text-theme-text-tertiary hover:text-amber-400 hover:bg-amber-500/10'
          }
        `}
        title={saved ? 'Saved!' : 'Save this insight'}
        aria-label="Save insight"
      >
        {saved ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        )}
      </button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowModal(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-50"
            >
              <div className="bg-surface-base border border-theme-border-subtle rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-theme-border-subtle flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Save Insight
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1 text-theme-text-secondary hover:text-theme-text-primary transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content Preview */}
                <div className="px-6 py-4">
                  <div className="bg-surface-raised/50 rounded-lg p-4 max-h-40 overflow-y-auto">
                    <p className="text-sm text-theme-text-secondary whitespace-pre-wrap line-clamp-6">
                      {content.slice(0, 500)}{content.length > 500 ? '...' : ''}
                    </p>
                  </div>
                </div>

                {/* Tags Section */}
                <div className="px-6 pb-4">
                  <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                    Add Tags (optional)
                  </label>

                  {/* Tag Input */}
                  <div className="flex flex-wrap gap-2 p-2 bg-surface-raised rounded-lg border border-theme-border-subtle focus-within:border-purple-500/50">
                    {tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm"
                      >
                        #{tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-purple-100"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                    <input
                      ref={inputRef}
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={tags.length === 0 ? 'Type a tag and press Enter...' : ''}
                      className="flex-1 min-w-[120px] bg-transparent text-white text-sm outline-none placeholder:text-gray-500"
                    />
                  </div>

                  {/* Suggested Tags */}
                  {suggestedTags.length > 0 && tagInput && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="text-xs text-theme-text-tertiary mr-1">Suggestions:</span>
                      {suggestedTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => {
                            setTags([...tags, tag]);
                            setTagInput('');
                          }}
                          className="px-2 py-0.5 text-xs bg-surface-interactive text-theme-text-secondary rounded hover:bg-surface-interactive-hover hover:text-theme-text-primary transition-colors"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Existing Tags (if no input) */}
                  {!tagInput && existingTags.length > 0 && tags.length === 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="text-xs text-theme-text-tertiary mr-1">Recent tags:</span>
                      {existingTags.slice(0, 8).map(tag => (
                        <button
                          key={tag}
                          onClick={() => setTags([...tags, tag])}
                          className="px-2 py-0.5 text-xs bg-surface-interactive text-theme-text-secondary rounded hover:bg-surface-interactive-hover hover:text-theme-text-primary transition-colors"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-theme-border-subtle flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm text-theme-text-secondary hover:text-theme-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-400 hover:to-orange-400 transition-all"
                  >
                    Save Insight
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default InsightSaveButton;
