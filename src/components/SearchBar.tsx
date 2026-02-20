import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEntities } from '../data';
import type { UniversalEntity } from '../types';

interface SearchResult {
  entity: UniversalEntity;
  matchType: 'name' | 'description' | 'keyword';
}

function getEntityPath(entity: UniversalEntity): string {
  switch (entity.type) {
    case 'planet':
      return `/planets/${entity.id}`;
    case 'sign':
      return `/signs/${entity.id}`;
    case 'house':
      return `/houses/${entity.id}`;
    case 'element':
      return `/elements/${entity.id}`;
    case 'aspect':
      return `/aspects/${entity.id}`;
    case 'configuration':
      return `/aspects`; // No individual page yet
    case 'point':
      return `/planets`; // Points are grouped with planets
    default:
      return '/';
  }
}

function getEntityTypeLabel(type: string): string {
  switch (type) {
    case 'planet':
      return 'Planet';
    case 'sign':
      return 'Sign';
    case 'house':
      return 'House';
    case 'element':
      return 'Element';
    case 'aspect':
      return 'Aspect';
    case 'configuration':
      return 'Pattern';
    case 'point':
      return 'Point';
    default:
      return type;
  }
}

const typeColors: Record<string, string> = {
  planet: 'text-fire-400 bg-fire-500/10',
  sign: 'text-air-400 bg-air-500/10',
  house: 'text-earth-400 bg-earth-500/10',
  element: 'text-water-400 bg-water-500/10',
  aspect: 'text-fire-400 bg-fire-500/10',
  configuration: 'text-air-400 bg-air-500/10',
  point: 'text-neutral-400 bg-neutral-500/10',
};

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Get all entities once
  const allEntities = getAllEntities();

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    const searchTerm = query.toLowerCase();
    const matches: SearchResult[] = [];

    for (const entity of allEntities) {
      // Name match (highest priority)
      if (entity.name.toLowerCase().includes(searchTerm)) {
        matches.push({ entity, matchType: 'name' });
        continue;
      }

      // Symbol match
      if (entity.symbol?.toLowerCase().includes(searchTerm)) {
        matches.push({ entity, matchType: 'name' });
        continue;
      }

      // Description match
      if (entity.description?.toLowerCase().includes(searchTerm)) {
        matches.push({ entity, matchType: 'description' });
      }
    }

    // Sort: name matches first, then by type
    matches.sort((a, b) => {
      if (a.matchType !== b.matchType) {
        return a.matchType === 'name' ? -1 : 1;
      }
      return a.entity.name.localeCompare(b.entity.name);
    });

    setResults(matches.slice(0, 10)); // Limit to 10 results
    setSelectedIndex(0);
  }, [query, allEntities]);

  // Handle keyboard navigation in results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      navigateToResult(results[selectedIndex]);
    }
  };

  const navigateToResult = (result: SearchResult) => {
    navigate(getEntityPath(result.entity));
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm text-neutral-400 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 bg-neutral-700 rounded text-xs">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Search Panel */}
          <div className="relative w-full max-w-lg bg-neutral-900 rounded-xl border border-neutral-700 shadow-2xl overflow-hidden">
            {/* Input */}
            <div className="flex items-center gap-3 p-4 border-b border-neutral-800">
              <svg
                className="w-5 h-5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search planets, signs, houses..."
                className="flex-1 bg-transparent text-white placeholder-neutral-500 outline-none"
                autoFocus
              />
              <kbd className="px-2 py-1 bg-neutral-800 rounded text-xs text-neutral-400">
                ESC
              </kbd>
            </div>

            {/* Results */}
            {results.length > 0 ? (
              <div className="max-h-80 overflow-y-auto py-2">
                {results.map((result, index) => (
                  <button
                    key={result.entity.id}
                    onClick={() => navigateToResult(result)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                      index === selectedIndex
                        ? 'bg-neutral-800'
                        : 'hover:bg-neutral-800/50'
                    }`}
                  >
                    <span className="text-xl w-8 text-center">
                      {result.entity.symbol || '✧'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{result.entity.name}</div>
                      {result.entity.description && (
                        <div className="text-sm text-neutral-400 truncate">
                          {result.entity.description}
                        </div>
                      )}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        typeColors[result.entity.type] || 'text-neutral-400 bg-neutral-700'
                      }`}
                    >
                      {getEntityTypeLabel(result.entity.type)}
                    </span>
                  </button>
                ))}
              </div>
            ) : query.trim() ? (
              <div className="px-4 py-8 text-center text-neutral-400">
                No results found for "{query}"
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-neutral-500 text-sm">
                <p>Start typing to search across all entities</p>
                <p className="mt-2 text-xs">
                  Try: "Sun", "Aries", "Fire", "Trine"
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-neutral-800 text-xs text-neutral-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-neutral-800 rounded">↑</kbd>
                  <kbd className="px-1 py-0.5 bg-neutral-800 rounded">↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-neutral-800 rounded">↵</kbd>
                  select
                </span>
              </div>
              <span>{results.length} results</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
