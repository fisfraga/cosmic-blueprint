/**
 * Contemplation Sessions Service
 *
 * localStorage CRUD for contemplation sessions.
 * Mirrors the insights.ts pattern so sessionSync.ts can bridge to Supabase.
 *
 * Behavior:
 * - Signed OUT: sessions stay in localStorage only
 * - Signed IN:  sessions sync to Supabase via sessionSync.ts
 * - Sign IN:    Supabase sessions are merged into localStorage on auth event
 */

import type { ContemplationCategory, ContemplationType, FocusEntity } from './contemplation/context';
import type { Message } from './claude';

export type { ContemplationCategory, ContemplationType, FocusEntity, Message };

export interface SavedSession {
  id: string;
  category: ContemplationCategory;
  contemplationType: ContemplationType;
  focusEntity: FocusEntity | null;
  messages: Message[];
  profileId?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'cosmic-copilot-contemplation-sessions';
const MAX_SESSIONS = 20;

export function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function loadSessions(): SavedSession[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveSessions(sessions: SavedSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, MAX_SESSIONS)));
  } catch (e) {
    console.error('Failed to save sessions:', e);
  }
}

/**
 * Insert or update a session in localStorage (newest-first ordering).
 */
export function upsertSession(session: SavedSession): void {
  const sessions = loadSessions();
  const index = sessions.findIndex((s) => s.id === session.id);
  if (index >= 0) {
    sessions[index] = session;
  } else {
    sessions.unshift(session);
  }
  saveSessions(sessions);
}

/**
 * Remove a session from localStorage by ID.
 */
export function deleteSession(id: string): void {
  const sessions = loadSessions().filter((s) => s.id !== id);
  saveSessions(sessions);
}
