import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadInsights, deleteInsight } from '../services/insights';
import type { SavedInsight } from '../services/insights';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import type { ContemplationCategory } from '../services/contemplation/context';
import { formatInsightAsTanaPaste, copyToClipboard } from '../services/tanaSync';
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
  { borderTop: string; text: string; label: string }
> = {
  astrology: {
    borderTop: 'border-t-blue-500',
    text: 'text-blue-400',
    label: 'Astrology',
  },
  humanDesign: {
    borderTop: 'border-t-amber-500',
    text: 'text-amber-400',
    label: 'Human Design',
  },
  geneKeys: {
    borderTop: 'border-t-purple-500',
    text: 'text-purple-400',
    label: 'Gene Keys',
  },
  crossSystem: {
    borderTop: 'border-t-cyan-500',
    text: 'text-cyan-400',
    label: 'Cross-System',
  },
  lifeOS: {
    borderTop: 'border-t-neutral-700',
    text: 'text-theme-text-secondary',
    label: 'Life OS',
  },
  alchemy: {
    borderTop: 'border-t-rose-500',
    text: 'text-rose-400',
    label: 'Alchemy',
  },
  numerology: {
    borderTop: 'border-t-cyan-400',
    text: 'text-cyan-300',
    label: 'Numerology',
  },
  cosmicEmbodiment: {
    borderTop: 'border-t-pink-500',
    text: 'text-pink-400',
    label: 'Embodiment',
  },
  fixedStars: {
    borderTop: 'border-t-indigo-500',
    text: 'text-indigo-400',
    label: 'Fixed Stars',
  },
  galacticAstrology: {
    borderTop: 'border-t-violet-500',
    text: 'text-violet-400',
    label: 'Galactic',
  },
  yearAhead: {
    borderTop: 'border-t-amber-500',
    text: 'text-amber-400',
    label: 'Year Ahead',
  },
  vocation: {
    borderTop: 'border-t-teal-500',
    text: 'text-teal-400',
    label: 'Vocation',
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

function getCategoryStyles(category: ContemplationCategory) {
  return (
    CATEGORY_STYLES[category] ?? {
      borderTop: 'border-t-neutral-700',
      text: 'text-theme-text-secondary',
      label: category,
    }
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface InsightCardProps {
  insight: SavedInsight;
  onDelete: (id: string) => void;
}

function InsightCard({ insight, onDelete }: InsightCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const styles = getCategoryStyles(insight.category);

  const handleDeleteClick = () => {
    const confirmed = window.confirm(
      'Delete this insight? This action cannot be undone.'
    );
    if (confirmed) {
      onDelete(insight.id);
    }
  };

  const handleCopyTana = async () => {
    const paste = formatInsightAsTanaPaste(insight);
    const ok = await copyToClipboard(paste);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Format contemplationType for display: camelCase → Title Case with spaces
  const formattedType = insight.contemplationType
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();

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
      {/* Top row: category label + action buttons */}
      <div className="flex items-start justify-between gap-2">
        <span className={`text-xs font-semibold uppercase tracking-wide ${styles.text}`}>
          {styles.label}
        </span>

        <div className="flex items-center gap-1">
          {/* Copy Tana Paste button */}
          <button
            onClick={handleCopyTana}
            aria-label="Copy as Tana Paste"
            title="Copy Tana Paste format"
            className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs transition-colors ${
              copied
                ? 'text-emerald-400 bg-emerald-900/30'
                : 'text-theme-text-tertiary hover:text-purple-400 hover:bg-surface-raised'
            }`}
          >
            {copied ? '✓ Copied' : '⟐ Tana'}
          </button>

        <button
          onClick={handleDeleteClick}
          aria-label="Delete insight"
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
      </div>

      {/* Content */}
      <div className="relative">
        <p
          className={[
            'text-sm leading-relaxed text-theme-text-primary whitespace-pre-wrap',
            !expanded ? 'line-clamp-4' : '',
          ].join(' ')}
        >
          {insight.content}
        </p>

        {/* Expand / collapse toggle — only render if text is long enough to clamp */}
        {insight.content.length > 280 && (
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="mt-1 text-xs text-amber-400 hover:text-amber-300 transition-colors"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Footer row: type badge, tags, timestamp */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-theme-border-subtle/60">
        {/* Contemplation type badge */}
        <span className="rounded-full bg-surface-raised px-2.5 py-0.5 text-xs text-theme-text-secondary">
          {formattedType}
        </span>

        {/* Tags */}
        {insight.tags.length > 0 &&
          insight.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-amber-950/50 border border-amber-900/40 px-2.5 py-0.5 text-xs text-amber-300"
            >
              {tag}
            </span>
          ))}

        {/* Spacer */}
        <span className="ml-auto text-xs text-theme-text-tertiary shrink-0">
          {formatRelativeTime(insight.createdAt)}
        </span>
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

export function InsightLibrary() {
  const { user } = useAuth();
  const { cosmicProfile, allProfiles } = useProfile();
  const [insights, setInsights] = useState<SavedInsight[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeProfileId = cosmicProfile?.meta.id;
  // First profile ID for graceful degradation of legacy insights
  const firstProfileId = allProfiles.length > 0 ? allProfiles[0].id : undefined;

  // Load insights from localStorage on mount, filtered by active profile
  useEffect(() => {
    const all = loadInsights();
    const profileFiltered = all.filter((i) => {
      // Insights with matching profileId always show
      if (i.profileId === activeProfileId) return true;
      // Legacy insights (no profileId) show only when first/default profile is active
      if (!i.profileId && activeProfileId === firstProfileId) return true;
      return false;
    });
    setInsights(profileFiltered);
  }, [activeProfileId, firstProfileId]);

  // Handle delete: remove from service then update local state
  const handleDelete = (id: string) => {
    deleteInsight(id);
    setInsights((prev) => prev.filter((i) => i.id !== id));
  };

  // Search + category filtered insights
  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return insights.filter((i) => {
      // Category filter
      if (activeFilter !== 'all' && i.category !== activeFilter) return false;

      // Search filter (AND with category)
      if (query) {
        const matchesContent = i.content.toLowerCase().includes(query);
        const matchesFocus = i.focusEntity
          ? i.focusEntity.toLowerCase().includes(query)
          : false;
        const matchesType = i.contemplationType.toLowerCase().includes(query);
        if (!matchesContent && !matchesFocus && !matchesType) return false;
      }

      return true;
    });
  }, [insights, activeFilter, searchQuery]);

  // Counts per filter tab (based on search-filtered insights so counts stay accurate)
  const counts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const searchFiltered = query
      ? insights.filter((i) => {
          const matchesContent = i.content.toLowerCase().includes(query);
          const matchesFocus = i.focusEntity
            ? i.focusEntity.toLowerCase().includes(query)
            : false;
          const matchesType = i.contemplationType.toLowerCase().includes(query);
          return matchesContent || matchesFocus || matchesType;
        })
      : insights;

    return FILTER_OPTIONS.reduce<Record<FilterCategory, number>>(
      (acc, opt) => {
        acc[opt.value] =
          opt.value === 'all'
            ? searchFiltered.length
            : searchFiltered.filter((i) => i.category === opt.value).length;
        return acc;
      },
      {} as Record<FilterCategory, number>,
    );
  }, [insights, searchQuery]);

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
              {/* Gradient icon badge */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-purple-600 text-xl shadow-lg">
                ✧
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-theme-text-primary">
                  Contemplation Journal
                </h1>
                <p className="text-sm text-theme-text-secondary">
                  Your saved insights from the Contemplation Chamber
                </p>
              </div>
            </div>

            {/* Insight count + sync badge */}
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <span className="text-sm text-theme-text-secondary">
                {insights.length}{' '}
                {insights.length === 1 ? 'insight' : 'insights'}
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
        {insights.length === 0 ? (
          <EmptyState
            icon={<span role="img" aria-label="Candle">&#x1F56F;</span>}
            title="No insights saved yet"
            description="Save insights from your contemplation sessions to build your personal wisdom library"
            action={{ label: 'Begin a Contemplation', to: '/contemplate' }}
          />
        ) : (
          <div className="flex flex-col gap-6">
            {/* Search input */}
            <div role="search">
              <div className="relative">
                {/* Search icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-text-tertiary"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSearchQuery('');
                      searchInputRef.current?.blur();
                    }
                  }}
                  placeholder="Search insights..."
                  aria-label="Search insights"
                  className="w-full rounded-lg border border-theme-border-subtle bg-surface-base/70 py-2.5 pl-10 pr-9 text-sm text-theme-text-primary placeholder:text-theme-text-tertiary transition-colors focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                />
                {/* Clear (X) button */}
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-theme-text-tertiary transition-colors hover:text-theme-text-secondary"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Filter bar */}
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

            {/* No results for search + filter */}
            {filtered.length === 0 ? (
              <motion.p
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center text-sm text-theme-text-tertiary"
              >
                {searchQuery.trim()
                  ? `No insights matching "${searchQuery.trim()}"${activeFilter !== 'all' ? ` in ${FILTER_OPTIONS.find((o) => o.value === activeFilter)?.label ?? activeFilter}` : ''}.`
                  : 'No insights in this category yet.'}
              </motion.p>
            ) : (
              /* Insight cards */
              <motion.div
                layout
                className="flex flex-col gap-4"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((insight) => (
                    <InsightCard
                      key={insight.id}
                      insight={insight}
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

export default InsightLibrary;
