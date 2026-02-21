import { useState, useRef, useEffect, useCallback } from 'react';
import type { GeocodingResult } from '../services/geocoding';
import { searchLocations } from '../services/geocoding';

export interface LocationAutocompleteProps {
  onSelect: (result: GeocodingResult) => void;
  initialValue?: string;
  placeholder?: string;
}

/**
 * Autocomplete input for location search powered by Nominatim (OpenStreetMap).
 *
 * Features:
 * - 300 ms debounce, minimum 3 characters before searching
 * - Keyboard navigation (Arrow Up/Down, Enter, Escape)
 * - Full ARIA combobox accessibility attributes
 * - Dark-theme styling to match the app
 */
export function LocationAutocomplete({
  onSelect,
  initialValue = '',
  placeholder = 'Search for a city...',
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Unique IDs for accessibility
  const listboxId = 'location-autocomplete-listbox';
  const getOptionId = (index: number) => `location-option-${index}`;

  // ------------------------------------------------------------------
  // Debounced search
  // ------------------------------------------------------------------
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await searchLocations(searchQuery);
      setResults(data);
      setIsOpen(data.length > 0);
      setActiveIndex(-1);
    } catch {
      setResults([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // ------------------------------------------------------------------
  // Selection
  // ------------------------------------------------------------------
  const selectResult = useCallback(
    (result: GeocodingResult) => {
      const label = result.city
        ? `${result.city}, ${result.country}`
        : result.displayName;
      setQuery(label);
      setIsOpen(false);
      setResults([]);
      setActiveIndex(-1);
      onSelect(result);
    },
    [onSelect],
  );

  // ------------------------------------------------------------------
  // Keyboard navigation
  // ------------------------------------------------------------------
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      // Open dropdown on arrow down even if closed, if we have a query
      if (e.key === 'ArrowDown' && query.trim().length >= 3) {
        performSearch(query);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < results.length) {
          selectResult(results[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  // Scroll active option into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const option = listRef.current.children[activeIndex] as HTMLElement | undefined;
      option?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        inputRef.current &&
        !inputRef.current.contains(target) &&
        listRef.current &&
        !listRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ------------------------------------------------------------------
  // Format display name for dropdown items
  // ------------------------------------------------------------------
  const formatResult = (result: GeocodingResult) => {
    const city = result.city || result.displayName.split(',')[0];
    const parts = result.displayName.split(',').map((p) => p.trim());
    // Show city prominently, with extra context below
    const context = parts.length > 2
      ? parts.slice(1, 3).join(', ')
      : result.country;
    return { city, context };
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          role="combobox"
          aria-label="Search for birth city"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? getOptionId(activeIndex) : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-colors text-sm pr-10"
        />

        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
          </div>
        )}

        {/* Search icon (when not loading) */}
        {!isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="h-4 w-4 text-neutral-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Dropdown list */}
      {isOpen && results.length > 0 && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label="Location search results"
          className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-neutral-700 bg-neutral-800 shadow-xl"
        >
          {results.map((result, index) => {
            const { city, context } = formatResult(result);
            const isActive = index === activeIndex;

            return (
              <li
                key={`${result.latitude}-${result.longitude}-${index}`}
                id={getOptionId(index)}
                role="option"
                aria-selected={isActive}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(e) => {
                  // Use mousedown (not click) to fire before the input's blur
                  e.preventDefault();
                  selectResult(result);
                }}
                className={[
                  'cursor-pointer px-4 py-2.5 transition-colors text-sm',
                  isActive
                    ? 'bg-purple-600/30 text-white'
                    : 'text-neutral-300 hover:bg-neutral-700/60',
                ].join(' ')}
              >
                <div className="font-medium leading-tight">{city}</div>
                <div className="text-xs text-neutral-500 leading-tight mt-0.5 truncate">
                  {context}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* "No results" message */}
      {isOpen && results.length === 0 && !isLoading && query.trim().length >= 3 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm text-neutral-500 shadow-xl">
          No locations found
        </div>
      )}
    </div>
  );
}

export default LocationAutocomplete;
