// ============================================
// Custom Contemplation Types Loader
// Loads user-authored prompts from custom-prompts.json
// Sprint Q scaffold — types array is empty until Sprint R (Tana export)
// Sprint R will replace this static import with a fetch() from a
// user-controlled URL or Tana export endpoint for true runtime loading.
// ============================================

import type { ContemplationType } from './context';
import type { ContemplationTypeOption } from '../../hooks/useContemplation';
import customPromptsData from '../../data/ilos/custom-prompts.json';

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

// Static import is a module singleton — no caching needed.
const _data = customPromptsData as CustomPromptsFile;

/**
 * Returns a ContemplationTypeOption shape for any custom types defined
 * for the given category, ready to be merged into CONTEMPLATION_TYPES.
 */
export function loadCustomTypes(category: string): ContemplationTypeOption[] {
  return _data.types
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
  return _data.types.find((t) => t.id === typeId)?.prompt ?? null;
}
