// ============================================
// Profile Selector Component
// ============================================
// Dropdown for switching between saved profiles

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProfile } from '../context';
import type { ProfileMeta } from '../types';

interface ProfileSelectorProps {
  compact?: boolean;
}

export function ProfileSelector({ compact = false }: ProfileSelectorProps) {
  const { profile, allProfiles, switchProfile, removeProfile, canAddMore } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ProfileMeta | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setPendingDelete(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!profile) {
    return (
      <Link
        to="/profile"
        className="px-3 py-1.5 text-sm bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
      >
        Create Profile
      </Link>
    );
  }

  const getRelationshipBadge = (relationship: string) => {
    const badges: Record<string, string> = {
      'Me': 'bg-purple-500/20 text-purple-400',
      'Partner': 'bg-pink-500/20 text-pink-400',
      'Child': 'bg-blue-500/20 text-blue-400',
      'Parent': 'bg-emerald-500/20 text-emerald-400',
      'Friend': 'bg-amber-500/20 text-amber-400',
      'Sibling': 'bg-cyan-500/20 text-cyan-400',
    };
    return badges[relationship] || 'bg-neutral-500/20 text-neutral-400';
  };

  const handleDeleteConfirm = () => {
    if (pendingDelete) {
      removeProfile(pendingDelete.id);
      setPendingDelete(null);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-lg transition-colors ${
          compact
            ? 'px-2 py-1 text-sm bg-neutral-800 hover:bg-neutral-700'
            : 'px-3 py-2 bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700'
        }`}
      >
        <span className="text-white font-medium truncate max-w-[120px]">
          {profile.name}
        </span>
        {!compact && allProfiles.length > 1 && (
          <span className={`text-xs px-1.5 py-0.5 rounded ${getRelationshipBadge(profile.relationship || 'Me')}`}>
            {profile.relationship || 'Me'}
          </span>
        )}
        <svg
          className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-64 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-neutral-800">
              <p className="text-xs text-neutral-500 uppercase tracking-wider">Switch Profile</p>
            </div>

            {/* Profile List */}
            <div className="max-h-64 overflow-y-auto">
              {allProfiles.map((p) => (
                <div
                  key={p.id}
                  className={`group w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-800 transition-colors ${
                    p.id === profile.id ? 'bg-neutral-800/50' : ''
                  }`}
                >
                  <button
                    onClick={() => {
                      switchProfile(p.id);
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-white font-medium text-sm truncate">{p.name}</p>
                      <p className="text-neutral-500 text-xs">{p.relationship || 'Unknown'}</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-1">
                    {p.id === profile.id && (
                      <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPendingDelete(p);
                      }}
                      className="p-1 rounded text-neutral-600 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-neutral-700 transition-all"
                      aria-label={`Delete ${p.name}'s profile`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="border-t border-neutral-800 p-2">
              {canAddMore && (
                <Link
                  to="/profile?new=true"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Profile
                </Link>
              )}
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-400 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Manage Profiles
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {pendingDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[60]"
              onClick={() => setPendingDelete(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl z-[70] p-6"
            >
              <h3 className="text-white font-medium mb-2">Delete Profile</h3>
              <p className="text-neutral-400 text-sm mb-6">
                Delete {pendingDelete.name}&apos;s profile? This cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setPendingDelete(null)}
                  className="px-4 py-2 text-sm text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
                >
                  Delete Profile
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProfileSelector;
