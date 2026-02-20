import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../services/authService';
import { AuthModal } from './AuthModal';

export function UserMenu() {
  const { user, loading, isConfigured } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Hidden when Supabase isn't configured or still loading
  if (!isConfigured || loading) return null;

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowSignIn(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-colors border border-neutral-700 hover:border-neutral-600"
        >
          Sign In
        </button>
        <AuthModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
      </>
    );
  }

  const initials = user.email
    ? user.email.slice(0, 2).toUpperCase()
    : '✦';

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
      >
        <span className="w-7 h-7 rounded-full bg-cyan-600 flex items-center justify-center text-xs font-bold text-white">
          {initials}
        </span>
        <span className="text-sm text-neutral-300 hidden sm:block max-w-[120px] truncate">
          {user.email}
        </span>
        <svg
          className={`w-3 h-3 text-neutral-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Backdrop */}
      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
      )}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1 w-52 py-2 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl z-50"
          >
            <div className="px-4 py-2 border-b border-neutral-800 mb-1">
              <p className="text-xs text-neutral-500">Signed in as</p>
              <p className="text-sm text-white truncate">{user.email}</p>
            </div>

            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-colors"
            >
              <span>✦</span>
              My Blueprint
            </Link>

            <Link
              to="/insights"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-colors"
            >
              <span>✧</span>
              Contemplation Journal
            </Link>

            <div className="my-1 border-t border-neutral-800" />

            <button
              onClick={async () => {
                setMenuOpen(false);
                await signOut();
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-colors text-left"
            >
              <span>↩</span>
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
