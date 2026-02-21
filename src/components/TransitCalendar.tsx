// ============================================
// Transit Calendar Component
// ============================================
// Month view showing days with significant cosmic aspects

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMajorAspectDays, getCosmicWeather, type CosmicWeather } from '../services/transits';

interface TransitCalendarProps {
  onDaySelect: (date: Date) => void;
  selectedDate?: Date;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function TransitCalendar({ onDaySelect, selectedDate }: TransitCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [dayPreview, setDayPreview] = useState<CosmicWeather | null>(null);

  // Calculate aspect days for the current month
  const aspectDays = useMemo(() => {
    const days = getMajorAspectDays(currentMonth.year, currentMonth.month);
    return new Map(days.map(d => [d.day, d]));
  }, [currentMonth.year, currentMonth.month]);

  // Load preview when hovering over a day
  useEffect(() => {
    if (hoveredDay !== null) {
      const date = new Date(currentMonth.year, currentMonth.month, hoveredDay, 12, 0, 0);
      setDayPreview(getCosmicWeather(date));
    } else {
      setDayPreview(null);
    }
  }, [hoveredDay, currentMonth.year, currentMonth.month]);

  // Calculate calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentMonth.year, currentMonth.month, 1);
    const lastDay = new Date(currentMonth.year, currentMonth.month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [currentMonth.year, currentMonth.month]);

  const navigateMonth = (direction: -1 | 1) => {
    setCurrentMonth(prev => {
      let newMonth = prev.month + direction;
      let newYear = prev.year;

      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }

      return { year: newYear, month: newMonth };
    });
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentMonth({ year: now.getFullYear(), month: now.getMonth() });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.month === today.getMonth() &&
      currentMonth.year === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth.month === selectedDate.getMonth() &&
      currentMonth.year === selectedDate.getFullYear()
    );
  };

  const getNatureColor = (nature: 'harmonious' | 'challenging' | 'mixed') => {
    switch (nature) {
      case 'harmonious':
        return 'bg-emerald-500';
      case 'challenging':
        return 'bg-red-500';
      case 'mixed':
        return 'bg-purple-500';
    }
  };

  const getNatureBorderColor = (nature: 'harmonious' | 'challenging' | 'mixed') => {
    switch (nature) {
      case 'harmonious':
        return 'border-emerald-500/50 hover:border-emerald-400';
      case 'challenging':
        return 'border-red-500/50 hover:border-red-400';
      case 'mixed':
        return 'border-purple-500/50 hover:border-purple-400';
    }
  };

  return (
    <div className="bg-surface-raised/50 border border-theme-border-subtle rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-theme-border-subtle/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1.5 rounded-lg text-theme-text-secondary hover:text-theme-text-primary hover:bg-surface-interactive/50 transition-colors"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-white font-medium min-w-[140px] text-center">
            {MONTH_NAMES[currentMonth.month]} {currentMonth.year}
          </h3>
          <button
            onClick={() => navigateMonth(1)}
            className="p-1.5 rounded-lg text-theme-text-secondary hover:text-theme-text-primary hover:bg-surface-interactive/50 transition-colors"
            aria-label="Next month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <button
          onClick={goToToday}
          className="px-3 py-1 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded transition-colors"
        >
          Today
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map(day => (
            <div key={day} className="text-center text-xs text-theme-text-tertiary font-medium py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const aspectInfo = aspectDays.get(day);
            const today = isToday(day);
            const selected = isSelected(day);

            return (
              <motion.button
                key={day}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDaySelect(new Date(currentMonth.year, currentMonth.month, day, 12, 0, 0))}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                className={`
                  relative aspect-square flex items-center justify-center rounded-lg text-sm
                  transition-colors duration-150
                  ${today ? 'font-bold' : ''}
                  ${selected
                    ? 'bg-purple-500 text-white'
                    : aspectInfo
                      ? `border ${getNatureBorderColor(aspectInfo.nature)} bg-surface-raised/50 text-white`
                      : 'text-theme-text-secondary hover:bg-surface-interactive/50 hover:text-theme-text-primary'
                  }
                `}
              >
                {day}
                {/* Aspect indicator dot */}
                {aspectInfo && !selected && (
                  <span
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${getNatureColor(aspectInfo.nature)}`}
                  />
                )}
                {/* Today ring */}
                {today && !selected && (
                  <span className="absolute inset-0 border-2 border-purple-400 rounded-lg pointer-events-none" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-theme-border-subtle/50">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-theme-text-tertiary">Harmonious</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs text-theme-text-tertiary">Challenging</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-xs text-theme-text-tertiary">Mixed</span>
          </div>
        </div>
      </div>

      {/* Hover Preview */}
      <AnimatePresence>
        {dayPreview && hoveredDay !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-4 pb-4"
          >
            <div className="bg-surface-base/80 border border-theme-border-subtle rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white font-medium">
                  {MONTH_NAMES[currentMonth.month]} {hoveredDay}
                </span>
                <span className="text-lg">{dayPreview.moonPhase.emoji}</span>
              </div>
              <p className="text-xs text-theme-text-secondary mb-2">{dayPreview.moonPhase.name}</p>
              {dayPreview.significantAspects.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {dayPreview.significantAspects.slice(0, 3).map((aspect, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                        aspect.nature === 'harmonious'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : aspect.nature === 'challenging'
                          ? 'bg-red-500/10 text-red-400'
                          : 'bg-purple-500/10 text-purple-400'
                      }`}
                    >
                      {aspect.planet1} {aspect.aspectSymbol} {aspect.planet2}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-theme-text-tertiary">No major aspects</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TransitCalendar;
