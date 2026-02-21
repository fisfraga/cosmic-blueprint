// ============================================
// Custom Contemplation Types Loader
// Loads user-authored prompts from custom-prompts.json
// Sprint Q scaffold — types array is empty until Sprint R (Tana export)
// ============================================

import type { ContemplationType } from './context';
import type { ContemplationTypeOption } from '../../hooks/useContemplation';

interface CustomTypeDefinition {
  id: string;
  category: string;
  name: string;
  description: string;
  prompt: string;
  needsFocus?: boolean;
  level?: 'beginner' | 'advanced' | 'master';
}

interface CustomPromptsFile {
  types: CustomTypeDefinition[];
}

// Lazy-loaded at runtime so future JSON changes don't require a rebuild
let _cache: CustomPromptsFile | null = null;

function getCustomPromptsData(): CustomPromptsFile {
  if (!_cache) {
    try {
      // Dynamic import is not possible for JSON in this context at runtime,
      // so we import statically and freeze. Sprint R will swap this for a
      // fetch from a user-controlled URL or Tana export endpoint.
      _cache = require('../../data/ilos/custom-prompts.json') as CustomPromptsFile;
    } catch {
      _cache = { types: [] };
    }
  }
  return _cache;
}

/**
 * Returns a ContemplationTypeOption shape for any custom types defined
 * for the given category, ready to be merged into CONTEMPLATION_TYPES.
 */
export function loadCustomTypes(category: string): ContemplationTypeOption[] {
  const data = getCustomPromptsData();
  return data.types
    .filter((t) => t.category === category)
    .map((t) => ({
      id: t.id as ContemplationType,
      name: t.name,
      description: t.description,
      needsFocus: t.needsFocus,
      level: t.level,
    }));
}

/**
 * Returns the custom prompt string for a given type ID, or null if not found.
 * Called in prompts.ts before falling back to built-in prompts.
 */
export function getCustomPrompt(typeId: string): string | null {
  const data = getCustomPromptsData();
  return data.types.find((t) => t.id === typeId)?.prompt ?? null;
}
