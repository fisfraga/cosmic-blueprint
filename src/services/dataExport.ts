/**
 * Data Export Service
 *
 * Collects all user data from localStorage and triggers a JSON download.
 * Supports GDPR-style data portability by exporting profiles, insights,
 * sessions, and pathway progress in a single structured file.
 */

import type { CosmicProfile } from '../types';
import type { SavedInsight } from './insights';
import type { SavedSession } from './sessions';
import type { PathwayProgress } from './pathways';
import { loadAllProfiles } from './profiles';
import { loadInsights } from './insights';
import { loadSessions } from './sessions';
import { loadAllProgress } from './pathways';

export interface ExportData {
  version: '1.0';
  exportedAt: string;
  profiles: CosmicProfile[];
  insights: SavedInsight[];
  sessions: SavedSession[];
  pathwayProgress: PathwayProgress[];
}

/**
 * Collect all user data from localStorage, build a JSON blob,
 * and trigger a browser download.
 *
 * Filename format: cosmic-blueprint-export-YYYY-MM-DD.json
 */
export function exportUserData(): void {
  const data: ExportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    profiles: loadAllProfiles(),
    insights: loadInsights(),
    sessions: loadSessions(),
    pathwayProgress: loadAllProgress(),
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const filename = `cosmic-blueprint-export-${today}.json`;

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();

  // Clean up
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
