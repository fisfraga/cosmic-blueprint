// ============================================
// Insight Storage Service
// ============================================
// Allows users to save and manage insights from contemplation sessions

import type { ContemplationCategory, ContemplationType } from './contemplation/context';

export interface SavedInsight {
  id: string;
  content: string;
  category: ContemplationCategory;
  contemplationType: ContemplationType;
  tags: string[];
  sessionId?: string;
  focusEntity?: string;
  createdAt: string;
}

const STORAGE_KEY = 'cosmic-copilot-saved-insights';
const MAX_INSIGHTS = 100;

/**
 * Load all saved insights from localStorage
 */
export function loadInsights(): SavedInsight[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save a new insight
 */
export function saveInsight(
  insight: Omit<SavedInsight, 'id' | 'createdAt'>
): SavedInsight {
  const insights = loadInsights();
  const newInsight: SavedInsight = {
    ...insight,
    id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  insights.unshift(newInsight);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(insights.slice(0, MAX_INSIGHTS)));
  return newInsight;
}

/**
 * Delete an insight by ID
 */
export function deleteInsight(id: string): void {
  const insights = loadInsights().filter(i => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(insights));
}

/**
 * Update an insight's tags
 */
export function updateInsightTags(id: string, tags: string[]): void {
  const insights = loadInsights();
  const index = insights.findIndex(i => i.id === id);
  if (index !== -1) {
    insights[index].tags = tags;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(insights));
  }
}

/**
 * Search insights by content or tags
 */
export function searchInsights(query: string, filterTags?: string[]): SavedInsight[] {
  const insights = loadInsights();
  const lowerQuery = query.toLowerCase();

  return insights.filter(insight => {
    // Match content
    const matchesContent = insight.content.toLowerCase().includes(lowerQuery);

    // Match tags
    const matchesTags = filterTags
      ? filterTags.some(tag => insight.tags.includes(tag))
      : true;

    return (query ? matchesContent : true) && matchesTags;
  });
}

/**
 * Get insights by category
 */
export function getInsightsByCategory(category: ContemplationCategory): SavedInsight[] {
  return loadInsights().filter(i => i.category === category);
}

/**
 * Get all unique tags used across insights
 */
export function getAllTags(): string[] {
  const insights = loadInsights();
  const tagSet = new Set<string>();
  insights.forEach(i => i.tags.forEach(t => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

/**
 * Get insights count
 */
export function getInsightsCount(): number {
  return loadInsights().length;
}
