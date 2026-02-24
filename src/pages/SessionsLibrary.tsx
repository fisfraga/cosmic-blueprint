import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { loadSessions, deleteSession } from '../services/sessions';
import type { SavedSession } from '../services/sessions';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import type { ContemplationCategory } from '../services/contemplation/context';
import { formatSessionAsTanaPaste, copyToClipboard } from '../services/tanaSync';
import { EmptyState } from '../components';

// ─── Types ───────────────────────────────────────────────────────────────────

type FilterCategory = 'all' | ContemplationCategory;

interface FilterOption {
  value: FilterCategory;
  label: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FILTER_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All' },
  { value: 'astrology', label: 'Astrology' },
  { value: 'humanDesign', label: 'Human Design' },
  { value: 'geneKeys', label: 'Gene Keys' },
  { value: 'crossSystem', label: 'Cross-System' },
  { value: 'lifeOS', label: 'Life OS' },
  { value: 'alchemy', label: 'Alchemy' },
  { value: 'numerology', label: 'Numerology' },
  { value: 'cosmicEmbodiment', label: 'Embodiment' },
  { value: 'fixedStars', label: 'Fixed Stars' },
  { value: 'galacticAstrology', label: 'Galactic' },
  { value: 'yearAhead', label: 'Year Ahead' },
  { value: 'vocation', label: 'Vocation' },
];

const CATEGORY_STYLES: Record<
  ContemplationCategory,
  { borderTop: string; text: string; label: string; icon: string }
> = {
  astrology: {
    borderTop: 'border-t-blue-500',
    text: 'text-blue-400',
    label: 'Astrology',
    icon: '☉',
  },
  humanDesign: {
    borderTop: 'border-t-amber-500',
    text: 'text-amber-400',
    label: 'Human Design',
    icon: '⬡',
  },
  geneKeys: {
    borderTop: 'border-t-purple-500',
    text: 'text-purple-400',
    label: 'Gene Keys',
    icon: '✧',
  },
  crossSystem: {
    borderTop: 'border-t-cyan-500',
    text: 'text-cyan-400',
    label: 'Cross-System',
    icon: '✦',
  },
  lifeOS: {
    borderTop: 'border-t-neutral-700',
    text: 'text-theme-text-secondary',
    label: 'Life OS',
    icon: '⚙',
  },
  alchemy: {
    borderTop: 'border-t-rose-500',
    text: 'text-rose-400',
    label: 'Alchemy',
    icon: '⚗️',
  },
  numerology: {
    borderTop: 'border-t-cyan-400',
    text: 'text-cyan-300',
    label: 'Numerology',
    icon: '∑',
  },
  cosmicEmbodiment: {
    borderTop: 'border-t-pink-500',
    text: 'text-pink-400',
    label: 'Embodiment',
    icon: '✦',
  },
  fixedStars: {
    borderTop: 'border-t-indigo-500',
    text: 'text-indigo-400',
    label: 'Fixed Stars',
    icon: '★',
  },
  galacticAstrology: {
    borderTop: 'border-t-violet-500',
    text: 'text-violet-400',
    label: 'Galactic',
    icon: '🌌',
  },
  yearAhead: {
    borderTop: 'border-t-amber-500',
    text: 'text-amber-400',
    label: 'Year Ahead',
    icon: '☀',
  },
  vocation: {
    borderTop: 'border-t-teal-500',
    text: 'text-teal-400',
    label: 'Vocation',
    icon: '⛰',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return 'just now';

  const diffSeconds = Math.floor(diffMs / 1000);
  if (diffSeconds < 60) return 'just now';

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`;
  }

  const diffYears = Math.floor(diffMonths / 12);
  return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
}

function formatContemplationType(type: string): string {
  return type
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function getCategoryStyles(category: ContemplationCategory) {
  return (
    CATEGORY_STYLES[category] ?? {
      borderTop: 'border-t-neutral-700',
      text: 'text-theme-text-secondary',
      label: category,
      icon: '✦',
    }
  );
}

// ─── Session Card ─────────────────────────────────────────────────────────────

interface SessionCardProps {
  session: SavedSession;
  onDelete: (id: string) => void;
}

function SessionCard({ session, onDelete }: SessionCardProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const styles = getCategoryStyles(session.category);

  const lastAssistantMessage = [...session.messages]
    .reverse()
    .find((m) => m.role === 'assistant');

  const previewText = lastAssistantMessage?.content
    ? lastAssistantMessage.content.slice(0, 180) +
      (lastAssistantMessage.content.length > 180 ? '…' : '')
    : null;

  const handleDeleteClick = () => {
    const confirmed = window.confirm(
      'Delete this session? This action cannot be undone.'
    );
    if (confirmed) {
      onDelete(session.id);
    }
  };

  const handleResume = () => {
    navigate('/contemplate', { state: { resumeSessionId: session.id } });
  };

  const handleCopyTana = async () => {
    const paste = formatSessionAsTanaPaste(session);
    const ok = await copyToClipboard(paste);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formattedType = formatContemplationType(session.contemplationType);
  const userMessageCount = session.messages.filter((m) => m.role === 'user').length;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.22 }}
      className={[
        'relative flex flex-col gap-3 rounded-lg border border-theme-border-subtle',
        'bg-surface-base/50 p-5 border-t-2',
        styles.borderTop,
      ].join(' ')}
    >
      {/* Top row: icon + category label + delete */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-base" aria-hidden="true">{styles.icon}</span>
          <span className={`text-xs font-semibold uppercase tracking-wide ${styles.text}`}>
            {styles.label}
          </span>
        </div>

        <button
          onClick={handleDeleteClick}
          aria-label="Delete session"
          className="flex items-center gap-1 rounded px-2 py-0.5 text-xs transition-colors text-theme-text-tertiary hover:text-red-400 hover:bg-surface-raised"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-3.5 w-3.5 shrink-0"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
              clipRule="evenodd"
            />
          </svg>
          Delete
        </button>
      </div>

      {/* Type + focus entity */}
      <div>
        <p className="text-sm font-medium text-theme-text-primary">{formattedType}</p>
        {session.focusEntity && (
          <p className="text-xs text-theme-text-secondary mt-0.5">{session.focusEntity.name}</p>
        )}
      </div>

      {/* Message preview */}
      {previewText && (
        <p className="text-sm leading-relaxed text-theme-text-secondary line-clamp-3">
          {previewText}
        </p>
      )}

      {/* Footer: stats + action buttons */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-theme-border-subtle/60">
        <div className="flex items-center gap-3 text-xs text-theme-text-tertiary">
          <span>{userMessageCount} {userMessageCount === 1 ? 'exchange' : 'exchanges'}</span>
          <span>·</span>
          <span>{formatRelativeTime(session.updatedAt)}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyTana}
            aria-label="Copy as Tana Paste"
            title="Copy Tana Paste format"
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              copied
                ? 'border-emerald-700/50 bg-emerald-900/30 text-emerald-400'
                : 'border-theme-border-subtle bg-surface-overlay text-theme-text-secondary hover:text-purple-400 hover:border-theme-border'
            }`}
          >
            {copied ? '✓ Copied' : '⟐ Tana'}
          </button>

          <button
            onClick={handleResume}
            className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-medium text-amber-300 transition-all hover:bg-amber-500/20 hover:border-amber-400/50"
          >
            Resume →
          </button>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────

interface FilterBarProps {
  active: FilterCategory;
  counts: Record<FilterCategory, number>;
  onChange: (value: FilterCategory) => void;
}

function FilterBar({ active, counts, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
      {FILTER_OPTIONS.map((opt) => {
        const isActive = active === opt.value;
        const count = counts[opt.value] ?? 0;

        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.value)}
            className={[
              'flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all',
              isActive
                ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                : 'border-theme-border-subtle bg-surface-overlay text-theme-text-secondary hover:border-theme-border hover:text-theme-text-primary',
            ].join(' ')}
          >
            {opt.label}
            {count > 0 && (
              <span
                className={[
                  'rounded-full px-1.5 py-px text-[10px] font-semibold',
                  isActive ? 'bg-amber-500/20 text-amber-300' : 'bg-surface-interactive text-theme-text-secondary',
                ].join(' ')}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function SessionsLibrary() {
  const { user } = useAuth();
  const { cosmicProfile, allProfiles } = useProfile();
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  const activeProfileId = cosmicProfile?.meta.id;
  const firstProfileId = allProfiles.length > 0 ? allProfiles[0].id : undefined;

  // Load sessions filtered by active profile
  useEffect(() => {
    const all = loadSessions();
    const profileFiltered = all.filter((s) => {
      if (s.profileId === activeProfileId) return true;
      if (!s.profileId && activeProfileId === firstProfileId) return true;
      return false;
    });
    setSessions(profileFiltered);
  }, [activeProfileId, firstProfileId]);

  const handleDelete = (id: string) => {
    deleteSession(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const filtered =
    activeFilter === 'all'
      ? sessions
      : sessions.filter((s) => s.category === activeFilter);

  const counts = FILTER_OPTIONS.reduce<Record<FilterCategory, number>>(
    (acc, opt) => {
      acc[opt.value] =
        opt.value === 'all'
          ? sessions.length
          : sessions.filter((s) => s.category === opt.value).length;
      return acc;
    },
    {} as Record<FilterCategory, number>
  );

  return (
    <div className="min-h-screen bg-surface-base px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {/* ── Page Header ── */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 flex flex-col gap-1"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-amber-500 text-xl shadow-lg">
                🌀
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-theme-text-primary">
                  Contemplation Sessions
                </h1>
                <p className="text-sm text-theme-text-secondary">
                  Your saved conversations from the Contemplation Chamber
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <span className="text-sm text-theme-text-secondary">
                {sessions.length}{' '}
                {sessions.length === 1 ? 'session' : 'sessions'}
              </span>
              {user && (
                <span className="flex items-center gap-1 rounded-full border border-emerald-700/50 bg-emerald-900/30 px-2.5 py-0.5 text-[11px] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Sync enabled
                </span>
              )}
            </div>
          </div>
        </motion.header>

        {/* ── Content ── */}
        {sessions.length === 0 ? (
          <EmptyState
            icon={<span role="img" aria-label="Spiral">&#x1F300;</span>}
            title="No sessions yet"
            description="Start a contemplation to begin your journey of self-discovery"
            action={{ label: 'Enter Contemplation Chamber', to: '/contemplate' }}
          />
        ) : (
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.25 }}
            >
              <FilterBar
                active={activeFilter}
                counts={counts}
                onChange={setActiveFilter}
              />
            </motion.div>

            {filtered.length === 0 ? (
              <motion.p
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center text-sm text-theme-text-tertiary"
              >
                No sessions in this category yet.
              </motion.p>
            ) : (
              <motion.div layout className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                  {filtered.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onDelete={handleDelete}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SessionsLibrary;
