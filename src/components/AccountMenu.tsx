// ============================================
// Account Menu Component
// ============================================
// Unified dropdown merging profile switching and user account controls

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProfile } from '../context';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../services/authService';
import { AuthModal } from './AuthModal';
import type { ProfileMeta } from '../types';

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

export function AccountMenu() {
  const { profile, allProfiles, switchProfile, removeProfile, canAddMore } = useProfile();
  const { user, loading, isConfigured } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ProfileMeta | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);
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

  const handleDeleteConfirm = () => {
    if (pendingDelete) {
      removeProfile(pendingDelete.id);
      setPendingDelete(null);
    }
  };

  // --- Unauthenticated: Supabase configured but no user ---
  if (isConfigured && !loading && !user) {
    return (
      <div ref={dropdownRef} className="flex items-center gap-3">
        {/* Still show profile selector portion */}
        {profile && (
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 rounded-lg transition-colors"
            >
              <span className="text-white font-medium truncate max-w-[120px]">
                {profile.name}
              </span>
              {allProfiles.length > 1 && (
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

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-64 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  {renderProfileList()}
                  {renderProfileActions()}
                </motion.div>
              )}
            </AnimatePresence>

            {renderDeleteModal()}
          </div>
        )}
        {!profile && (
          <Link
            to="/profile"
            className="px-3 py-1.5 text-sm bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
          >
            Create Profile
          </Link>
        )}
        <button
          onClick={() => setShowSignIn(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-colors border border-neutral-700 hover:border-neutral-600"
        >
          Sign In
        </button>
        <AuthModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
      </div>
    );
  }

  // --- Supabase not configured or still loading: show profile selector only ---
  if (!isConfigured || loading) {
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

    return (
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 rounded-lg transition-colors"
        >
          <span className="text-white font-medium truncate max-w-[120px]">
            {profile.name}
          </span>
          {allProfiles.length > 1 && (
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

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-64 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              {renderProfileList()}
              {renderProfileActions()}
            </motion.div>
          )}
        </AnimatePresence>

        {renderDeleteModal()}
      </div>
    );
  }

  // --- Authenticated: full unified menu ---
  const initials = user!.email
    ? user!.email.slice(0, 2).toUpperCase()
    : '?';

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger: avatar + profile name + chevron */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
      >
        <span className="w-7 h-7 rounded-full bg-cyan-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
          {initials}
        </span>
        {profile && (
          <span className="text-sm text-white font-medium truncate max-w-[120px] hidden sm:block">
            {profile.name}
          </span>
        )}
        <svg
          className={`w-3 h-3 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {/* User info header */}
            <div className="px-4 py-3 border-b border-neutral-800">
              <p className="text-xs text-neutral-500">Signed in as</p>
              <p className="text-sm text-white truncate">{user!.email}</p>
            </div>

            {/* Profile section */}
            {profile && renderProfileList()}

            {/* Navigation links */}
            <div className="border-t border-neutral-800 p-2">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors"
              >
                <span aria-hidden="true">&#10022;</span>
                My Blueprint
              </Link>
              <Link
                to="/insights"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors"
              >
                <span aria-hidden="true">&#10023;</span>
                Contemplation Journal
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Manage Profiles
              </Link>
            </div>

            {/* Sign out */}
            <div className="border-t border-neutral-800 p-2">
              <button
                onClick={async () => {
                  setIsOpen(false);
                  await signOut();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors text-left"
              >
                <span aria-hidden="true">&#8617;</span>
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {renderDeleteModal()}
    </div>
  );

  // --- Shared render helpers ---

  function renderProfileList() {
    if (!profile) return null;

    return (
      <>
        {/* Header */}
        <div className="px-4 py-2 border-b border-neutral-800">
          <p className="text-xs text-neutral-500 uppercase tracking-wider">Switch Profile</p>
        </div>

        {/* Profile list */}
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

        {/* Add new profile */}
        {canAddMore && (
          <div className="border-t border-neutral-800 p-2">
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
          </div>
        )}
      </>
    );
  }

  function renderProfileActions() {
    return (
      <div className="border-t border-neutral-800 p-2">
        {canAddMore && !profile && (
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
    );
  }

  function renderDeleteModal() {
    return (
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
    );
  }
}

export default AccountMenu;
