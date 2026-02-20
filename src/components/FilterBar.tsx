import { motion } from 'framer-motion';

export interface FilterOption<T extends string> {
  value: T;
  label: string;
  icon?: string;
  count?: number;
}

export interface FilterBarProps<T extends string> {
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /**
   * Function to get active style classes based on the selected value.
   * If not provided, uses default neutral styling.
   */
  getActiveColor?: (value: T) => string;
  /**
   * Variant styling
   * - 'pills': Rounded pill buttons (default)
   * - 'buttons': Square-ish buttons
   */
  variant?: 'pills' | 'buttons';
}

const defaultActiveColor = 'bg-neutral-800 text-white border-neutral-700';
const inactiveColor = 'border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-600';

export function FilterBar<T extends string>({
  options,
  value,
  onChange,
  getActiveColor,
  variant = 'pills',
}: FilterBarProps<T>) {
  const baseClasses = variant === 'pills'
    ? 'px-4 py-2 rounded-lg border text-sm font-medium transition-all'
    : 'px-4 py-2 rounded-md border text-sm font-medium transition-all';

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = value === option.value;
        const activeColor = getActiveColor
          ? getActiveColor(option.value)
          : defaultActiveColor;

        return (
          <motion.button
            key={option.value}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(option.value)}
            className={`${baseClasses} ${isActive ? activeColor : inactiveColor}`}
            aria-pressed={isActive}
          >
            {option.icon && <span className="mr-2">{option.icon}</span>}
            {option.label}
            {option.count !== undefined && (
              <span className="ml-2 text-xs opacity-70">({option.count})</span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// Pre-defined color getters for common use cases
/* eslint-disable react-refresh/only-export-components */

export const elementFilterColors: Record<string, string> = {
  all: 'bg-neutral-800 text-white border-neutral-700',
  fire: 'bg-fire-500/20 text-fire-400 border-fire-500/30',
  earth: 'bg-earth-500/20 text-earth-400 border-earth-500/30',
  air: 'bg-air-500/20 text-air-400 border-air-500/30',
  water: 'bg-water-500/20 text-water-400 border-water-500/30',
};

export function getElementFilterColor(value: string): string {
  return elementFilterColors[value] || elementFilterColors.all;
}

export const aspectNatureColors: Record<string, string> = {
  Harmonious: 'bg-water-500/20 text-water-400 border-water-500/30',
  Challenging: 'bg-fire-500/20 text-fire-400 border-fire-500/30',
  Neutral: 'bg-air-500/20 text-air-400 border-air-500/30',
};

export function getAspectFilterColor(value: string): string {
  return aspectNatureColors[value] || 'bg-neutral-800 text-white border-neutral-700';
}
