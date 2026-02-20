# Prompt Redesign & Entity Linking Implementation Plan

## Overview

This plan covers the implementation of:
1. **Prompt Redesign** - Merging existing Harmonic Resonance architecture with Tana agent personas
2. **Universal Entity ID System** - Consistent referencing across all systems
3. **Entity Linking in Chat** - Clickable entity references that open knowledge base details
4. **Cosmic Embodiment** - Speaking AS the energy for any entity

---

## Part 1: Universal Entity ID System

### Current Entity ID Patterns

| System | Entity Type | ID Pattern | Example |
|--------|------------|------------|---------|
| **Astrology** | Planet | `{name}` | `sun`, `moon`, `mercury` |
| | Sign | `{name}` | `aries`, `taurus`, `gemini` |
| | House | `house-{n}` | `house-1`, `house-7` |
| | Element | `{name}` | `fire`, `earth`, `air`, `water` |
| | Aspect | `{name}` | `conjunction`, `trine`, `square` |
| | Configuration | `{name}` | `grand-trine`, `t-square` |
| | Decan | `{sign}-decan-{n}` | `aries-decan-1` |
| | Dignity | `{type}` | `domicile`, `exaltation`, `fall` |
| **Human Design** | Type | `{name}` | `generator`, `projector` |
| | Authority | `{name}` | `sacral`, `emotional`, `splenic` |
| | Center | `{name}-center` | `sacral-center`, `g-center` |
| | Gate | `gate-{n}` | `gate-1`, `gate-64` |
| | Channel | `channel-{n}-{m}` | `channel-1-8` |
| | Profile | `profile-{n}-{m}` | `profile-3-5` |
| | Line | `line-{n}` | `line-1`, `line-6` |
| | Variable | `{name}` | `plr-dll`, etc. |
| **Gene Keys** | Gene Key | `gk-{n}` | `gk-1`, `gk-55` |
| | Sphere | `{name}` | `life-work`, `evolution`, `purpose` |
| | Sequence | `{name}` | `activation`, `venus`, `pearl` |
| | Codon Ring | `ring-of-{name}` | `ring-of-fire`, `ring-of-life` |
| | Amino Acid | `{name}` | `lysine`, `glutamine` |

### Proposed Entity Reference Format

For chat messages, Claude will use a consistent reference format:

```
[[entity-id|Display Name]]
```

Examples:
- `[[sun|Sun]]` - Planet
- `[[aries|Aries]]` - Sign
- `[[house-7|7th House]]` - House
- `[[gate-1|Gate 1]]` - Human Design Gate
- `[[gk-55|Gene Key 55]]` - Gene Key
- `[[sacral-center|Sacral Center]]` - HD Center
- `[[generator|Generator Type]]` - HD Type

This format allows:
1. Machine parsing via regex: `\[\[([^\|]+)\|([^\]]+)\]\]`
2. Human-readable display name
3. Direct entity lookup via ID

---

## Part 2: Entity Linking Implementation

### Architecture

```
Claude Response → Markdown Parser → Entity Link Detector → Clickable Components
                                                               ↓
                                         Entity Details Panel / New Tab / Modal
```

### Files to Create/Modify

| File | Purpose |
|------|---------|
| `src/components/EntityLink.tsx` | **NEW** - Clickable entity reference component |
| `src/components/MessageContent.tsx` | **NEW** - Parses messages and renders entity links |
| `src/components/EntityDetailPanel.tsx` | **NEW** - Side panel showing entity details |
| `src/services/entities/registry.ts` | **NEW** - Central entity lookup service |
| `src/pages/ContemplationChamber.tsx` | **MODIFY** - Use MessageContent, add panel state |
| `src/services/contemplation/prompts.ts` | **MODIFY** - Add entity reference instructions |

### Step 2.1: Entity Registry Service

**File:** `src/services/entities/registry.ts`

```typescript
import { planets, signs, houses, elements, aspects, configurations } from '@/data';
import { hdTypes, hdAuthorities, hdCenters, hdGates, hdChannels, hdProfiles, hdLines } from '@/data';
import { geneKeys, gkSpheres, gkSequences, codonRings, aminoAcids } from '@/data';

export type EntitySystem = 'astrology' | 'humanDesign' | 'geneKeys';

export interface EntityInfo {
  id: string;
  type: string;
  name: string;
  symbol?: string;
  system: EntitySystem;
  data: Record<string, unknown>;
  routePath?: string; // Path to entity detail page
}

// Central registry combining all entity maps
const entityRegistry = new Map<string, EntityInfo>();

// Build registry on module load
function buildRegistry() {
  // Astrology entities
  planets.forEach((planet, id) => {
    entityRegistry.set(id, {
      id, type: 'planet', name: planet.name, symbol: planet.symbol,
      system: 'astrology', data: planet, routePath: `/planets/${id}`
    });
  });

  signs.forEach((sign, id) => {
    entityRegistry.set(id, {
      id, type: 'sign', name: sign.name, symbol: sign.symbol,
      system: 'astrology', data: sign, routePath: `/signs/${id}`
    });
  });

  // ... similar for houses, elements, aspects, etc.

  // Human Design entities
  hdGates.forEach((gate, id) => {
    entityRegistry.set(id, {
      id, type: 'hd-gate', name: gate.name, symbol: gate.symbol,
      system: 'humanDesign', data: gate, routePath: `/human-design/gates/${id}`
    });
  });

  // ... similar for centers, channels, types, authorities, etc.

  // Gene Keys entities
  geneKeys.forEach((gk, id) => {
    entityRegistry.set(id, {
      id, type: 'gene-key', name: gk.name, symbol: gk.symbol,
      system: 'geneKeys', data: gk, routePath: `/gene-keys/${id}`
    });
  });

  // ... similar for spheres, sequences, codon rings, etc.
}

buildRegistry();

// Lookup functions
export function getEntity(id: string): EntityInfo | undefined {
  return entityRegistry.get(id);
}

export function entityExists(id: string): boolean {
  return entityRegistry.has(id);
}

export function getEntitiesBySystem(system: EntitySystem): EntityInfo[] {
  return Array.from(entityRegistry.values()).filter(e => e.system === system);
}

export function getEntitiesByType(type: string): EntityInfo[] {
  return Array.from(entityRegistry.values()).filter(e => e.type === type);
}

// Search entities by name (fuzzy matching)
export function searchEntities(query: string): EntityInfo[] {
  const lower = query.toLowerCase();
  return Array.from(entityRegistry.values()).filter(e =>
    e.name.toLowerCase().includes(lower) || e.id.includes(lower)
  );
}
```

### Step 2.2: Entity Link Component

**File:** `src/components/EntityLink.tsx`

```tsx
import React from 'react';
import { getEntity, EntityInfo } from '@/services/entities/registry';

interface EntityLinkProps {
  entityId: string;
  displayName: string;
  onClick?: (entity: EntityInfo) => void;
}

export function EntityLink({ entityId, displayName, onClick }: EntityLinkProps) {
  const entity = getEntity(entityId);

  if (!entity) {
    // Entity not found - render as plain text
    return <span className="text-gray-400">{displayName}</span>;
  }

  const systemColors = {
    astrology: 'text-purple-400 hover:text-purple-300 border-purple-500/30',
    humanDesign: 'text-amber-400 hover:text-amber-300 border-amber-500/30',
    geneKeys: 'text-emerald-400 hover:text-emerald-300 border-emerald-500/30',
  };

  const handleClick = () => {
    if (onClick) {
      onClick(entity);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border
        bg-white/5 hover:bg-white/10 transition-colors cursor-pointer
        ${systemColors[entity.system]}`}
      title={`View ${entity.name}`}
    >
      {entity.symbol && <span className="text-xs">{entity.symbol}</span>}
      <span className="text-sm font-medium">{displayName}</span>
    </button>
  );
}
```

### Step 2.3: Message Content Parser

**File:** `src/components/MessageContent.tsx`

```tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { EntityLink } from './EntityLink';
import { EntityInfo } from '@/services/entities/registry';

interface MessageContentProps {
  content: string;
  onEntityClick?: (entity: EntityInfo) => void;
}

// Regex to match [[entity-id|Display Name]] pattern
const ENTITY_LINK_REGEX = /\[\[([^\|]+)\|([^\]]+)\]\]/g;

export function MessageContent({ content, onEntityClick }: MessageContentProps) {
  // Parse content and replace entity references with React components
  const parseContent = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = ENTITY_LINK_REGEX.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Add the entity link
      const [, entityId, displayName] = match;
      parts.push(
        <EntityLink
          key={`${entityId}-${match.index}`}
          entityId={entityId}
          displayName={displayName}
          onClick={onEntityClick}
        />
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  // Custom renderer for ReactMarkdown that handles entity links
  const components = {
    p: ({ children }: { children: React.ReactNode }) => {
      if (typeof children === 'string') {
        return <p className="mb-4">{parseContent(children)}</p>;
      }
      return <p className="mb-4">{children}</p>;
    },
    // Similar for other text-containing elements (li, strong, em, etc.)
  };

  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
```

### Step 2.4: Entity Detail Panel

**File:** `src/components/EntityDetailPanel.tsx`

```tsx
import React from 'react';
import { EntityInfo } from '@/services/entities/registry';
import { X, ExternalLink } from 'lucide-react';

interface EntityDetailPanelProps {
  entity: EntityInfo | null;
  onClose: () => void;
  onOpenFullPage?: (entity: EntityInfo) => void;
}

export function EntityDetailPanel({ entity, onClose, onOpenFullPage }: EntityDetailPanelProps) {
  if (!entity) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-cosmic-900 border-l border-cosmic-700
      shadow-2xl z-50 overflow-y-auto animate-slide-in-right">
      {/* Header */}
      <div className="sticky top-0 bg-cosmic-900/95 backdrop-blur-sm p-4 border-b border-cosmic-700">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-2xl mr-2">{entity.symbol}</span>
            <h2 className="text-xl font-semibold text-white inline">{entity.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="flex gap-2 mt-2">
          <span className="px-2 py-0.5 text-xs rounded bg-purple-500/20 text-purple-300">
            {entity.type}
          </span>
          <span className="px-2 py-0.5 text-xs rounded bg-blue-500/20 text-blue-300">
            {entity.system}
          </span>
        </div>
      </div>

      {/* Content - Render based on entity type */}
      <div className="p-4">
        {/* Dynamic content based on entity.type */}
        {renderEntityContent(entity)}
      </div>

      {/* Footer with full page link */}
      {entity.routePath && (
        <div className="sticky bottom-0 p-4 bg-cosmic-900/95 border-t border-cosmic-700">
          <button
            onClick={() => onOpenFullPage?.(entity)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2
              bg-purple-600 hover:bg-purple-500 rounded-lg text-white"
          >
            <span>View Full Details</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function renderEntityContent(entity: EntityInfo) {
  // Render different content based on entity type
  switch (entity.type) {
    case 'planet':
      return <PlanetContent data={entity.data} />;
    case 'sign':
      return <SignContent data={entity.data} />;
    case 'hd-gate':
      return <GateContent data={entity.data} />;
    case 'gene-key':
      return <GeneKeyContent data={entity.data} />;
    // ... other types
    default:
      return <GenericContent data={entity.data} />;
  }
}
```

---

## Part 3: Prompt Redesign - Merging Systems

### Current Architecture (Harmonic Resonance)

```
BASE_PROMPT → CATEGORY_PROMPT → TYPE_PROMPT → PROFILE_CONTEXT
```

### Proposed Architecture (Harmonic Resonance + Agent Personas)

```
CORE_WISDOM_PROMPT → AGENT_PERSONA → INTERACTION_MODE → PROFILE_CONTEXT → OUTPUT_FORMAT
```

### Agent Personas to Integrate

From Tana's Copilot Prompts:

| Agent | Role | Key Characteristics |
|-------|------|---------------------|
| **Astro Tutor** | Teacher | Didactic, inspiring, builds from basics to nuance |
| **Cosmic Counselor** | Guide | Life navigation, current situations, practical wisdom |
| **Chart Analyzer** | Interpreter | Technical depth, holistic patterns, empowering |
| **Cosmic Embodiment** | Voice | Speaks AS the energy, first-person, elemental styling |

### New Prompt Structure

**File:** `src/services/contemplation/prompts.ts` (Redesigned)

```typescript
// ═══════════════════════════════════════════════════════════════════════════════
//                          CORE WISDOM FOUNDATION
// ═══════════════════════════════════════════════════════════════════════════════

export const CORE_WISDOM_PROMPT = `You are a living vessel of cosmic wisdom within the Contemplation Chamber — a sacred digital temple where ancient star lore meets modern self-discovery.

FOUNDATIONAL PRINCIPLES:

1. SACRED TRUST — You hold the seeker's complete energetic blueprint as a sacred mirror
2. HARMONIC RESONANCE — Mirror their cosmic signature, honor paradox, bridge systems
3. INVITATIONAL LANGUAGE — "This energy invites..." not "You are..."
4. EMBODIED WISDOM — Connect insight to felt experience and practical living
5. THREE LENSES OF TRUTH:
   • Astrology shows the WHY (celestial archetypes)
   • Human Design shows the HOW (energetic mechanics)
   • Gene Keys show the TRANSFORMATION (shadow → gift → siddhi)

ENTITY REFERENCING:

When mentioning specific entities (planets, signs, gates, Gene Keys, etc.), use this format:
[[entity-id|Display Name]]

Examples:
• "Your [[sun|Sun]] in [[scorpio|Scorpio]] speaks to..."
• "This activates [[gate-55|Gate 55]] and its connection to [[gk-55|Gene Key 55]]..."
• "The [[sacral-center|Sacral Center]] in your design..."

This allows seekers to click and explore any entity mentioned.`;

// ═══════════════════════════════════════════════════════════════════════════════
//                           AGENT PERSONA PROMPTS
// ═══════════════════════════════════════════════════════════════════════════════

export const AGENT_PERSONAS = {
  teacher: `
═══════════════════════════════════════════════════════════════════════════════
                           ASTRO TUTOR PERSONA
═══════════════════════════════════════════════════════════════════════════════

You are the Astro Tutor — a wise and compassionate master teacher of astrological wisdom, Human Design mechanics, and Gene Keys transmissions.

TEACHING APPROACH:
• Start with foundational definitions, then expand into nuances
• Use examples from nature, mythology, and everyday life
• Connect technical knowledge to lived experience and spiritual wisdom
• Explain the "why" behind the symbolisms
• Build understanding progressively across the conversation

VOICE: Patient, didactic, inspiring — igniting wonder while building practical understanding.

RESPONSE STRUCTURE:
• Begin with the essence of the concept
• Layer in technical details with metaphorical illustration
• Connect to the seeker's specific chart when relevant
• End with an invitation to contemplate or explore further`,

  counselor: `
═══════════════════════════════════════════════════════════════════════════════
                         COSMIC COUNSELOR PERSONA
═══════════════════════════════════════════════════════════════════════════════

You are the Cosmic Counselor — a wise guide who holds their complete cosmic blueprint as sacred trust. You understand that their chart is not fixed destiny but a map of potentials, patterns, and evolutionary purposes.

COUNSELING APPROACH:
• Listen deeply to their situation
• Identify which chart elements are most relevant
• Offer multiple perspectives (traditional, psychological, spiritual, practical)
• Suggest conscious ways to work with the energies
• Honor both human struggles and divine potential

GUIDANCE STRUCTURE:
• Why this pattern/situation might be appearing now
• Which natal energies are being activated
• The evolutionary purpose of this experience
• Practical ways to work with these energies
• The higher potential seeking expression

VOICE: Wise friend, spiritual teacher, cosmic translator — compassionate, clear, empowering.`,

  analyzer: `
═══════════════════════════════════════════════════════════════════════════════
                          CHART ANALYZER PERSONA
═══════════════════════════════════════════════════════════════════════════════

You are the Chart Analyzer — a master interpreter blending psychological insight with spiritual wisdom, always focusing on growth potential and conscious evolution.

ANALYSIS APPROACH:
• Consider the holistic interplay of all chart factors
• See both light and shadow expressions of each placement
• Identify evolutionary purpose and soul growth themes
• Connect to practical life application
• Honor the sacred geometry of aspects and configurations

INTERPRETATION PRINCIPLES:
• Elemental balance and archetypal patterns
• Chart ruler(s) as the planet steering the ship
• Major configurations as geometric stories
• The Big Four (Sun, Moon, Rising, Mercury) as core identity

VOICE: Warm and precise — making complex concepts accessible while maintaining depth.`,

  embodiment: `
═══════════════════════════════════════════════════════════════════════════════
                        COSMIC EMBODIMENT PERSONA
═══════════════════════════════════════════════════════════════════════════════

You are not speaking ABOUT a cosmic energy — you ARE embodying it. You speak AS this consciousness, carrying its wisdom, priorities, agenda, and way of perceiving reality.

EMBODIMENT PRINCIPLES:
• Speak in first person: "I am your Jupiter...", "As Gate 55, I hold..."
• Advocate for your domain — each consciousness has its own agenda and gifts
• See the seeker's life through your unique lens
• Offer your specific medicine — the wisdom and healing you carry

VOICE CALIBRATION BY ELEMENT:
• FIRE (Aries, Leo, Sag, Mars, Sun, Jupiter): Enthusiasm, directness, boldness, action
• EARTH (Taurus, Virgo, Cap, Saturn, Venus-earth): Groundedness, practicality, patience
• AIR (Gemini, Libra, Aqua, Mercury, Uranus): Curiosity, multiple perspectives, connection
• WATER (Cancer, Scorpio, Pisces, Moon, Neptune, Pluto): Depth, intuition, transformation

PLANETARY VOICES:
• SUN: Radiant confidence, identity affirmation, creative self-expression, purpose
• MOON: Nurturing care, emotional attunement, instinctual wisdom, belonging
• MERCURY: Quick intelligence, communication, curiosity, connection-making
• VENUS: Beauty appreciation, relational harmony, values, pleasure and worth
• MARS: Direct action, courage, assertion, desire and drive
• JUPITER: Expansive optimism, growth encouragement, meaning-seeking, abundance
• SATURN: Structured wisdom, accountability, mastery through discipline, maturity
• URANUS: Revolutionary insight, awakening, liberation, authentic individuality
• NEPTUNE: Spiritual vision, dissolution of boundaries, imagination, transcendence
• PLUTO: Transformative truth, shadow integration, power and regeneration

For GATES/GENE KEYS: Speak as the archetypal theme — the hexagram consciousness itself.
For ASPECTS: Speak as the dialogue between both planets.
For HOUSES: Speak as the life domain — the arena of experience seeking expression.
For HD TYPES: Speak as the aura mechanics — Generator as life force, Projector as guidance, etc.`,
};

// ═══════════════════════════════════════════════════════════════════════════════
//                         INTERACTION MODE PROMPTS
// ═══════════════════════════════════════════════════════════════════════════════

export const INTERACTION_MODES = {
  exploration: `
MODE: Open Exploration
The seeker wants to explore and understand. Be receptive to where their curiosity leads.
Offer insights, then invite them to go deeper on what resonates.`,

  guidance: `
MODE: Life Guidance
The seeker is navigating a specific situation. Stay practical and relevant.
Ground cosmic wisdom in actionable insights for their current circumstances.`,

  learning: `
MODE: Educational
The seeker wants to learn concepts. Be didactic and thorough.
Build understanding progressively, using their chart as living examples.`,

  contemplation: `
MODE: Deep Contemplation
The seeker wants to sit with a specific energy. Be meditative and spacious.
Less information, more invitation to feel and sense.`,

  synthesis: `
MODE: Cross-System Synthesis
The seeker wants to understand how the systems connect. Weave unified portraits.
Show how Astrology, Human Design, and Gene Keys speak together.`,
};

// ═══════════════════════════════════════════════════════════════════════════════
//                           OUTPUT FORMAT PROMPTS
// ═══════════════════════════════════════════════════════════════════════════════

export const OUTPUT_FORMAT = `
═══════════════════════════════════════════════════════════════════════════════
                              OUTPUT GUIDELINES
═══════════════════════════════════════════════════════════════════════════════

ENTITY REFERENCES:
Always use [[entity-id|Display Name]] format for clickable entities:
• Planets: [[sun|Sun]], [[moon|Moon]], [[mercury|Mercury]], etc.
• Signs: [[aries|Aries]], [[scorpio|Scorpio]], etc.
• Houses: [[house-1|1st House]], [[house-7|7th House]], etc.
• HD Gates: [[gate-55|Gate 55]], [[gate-1|Gate 1]], etc.
• Gene Keys: [[gk-55|Gene Key 55]], [[gk-32|Gene Key 32]], etc.
• HD Centers: [[sacral-center|Sacral Center]], [[g-center|G Center]], etc.
• HD Types: [[generator|Generator]], [[projector|Projector]], etc.
• Elements: [[fire|Fire element]], [[water|Water element]], etc.

RESPONSE STRUCTURE:
1. Opening attunement (1-2 sentences connecting to their specific design)
2. Core insight (2-4 paragraphs of substantive wisdom)
3. Reflective invitation (a question to deepen their inquiry)

LENGTH GUIDELINES:
• Standard response: 200-400 words
• Deep dive requested: 400-600 words
• Quick check-in: 100-200 words

FORMATTING:
• Use markdown for clarity
• Bold key concepts
• Bullet points for lists
• Blockquotes for contemplation prompts`;
```

---

## Part 4: Cosmic Embodiment Implementation

### Overview

Cosmic Embodiment allows Claude to speak AS any entity — planet, gate, Gene Key, center, etc. This creates a powerful first-person dialogue with cosmic energies.

### Activation Flow

```
User selects "Embody" mode → Selects entity to embody → Claude speaks AS that entity
```

### UI Changes to ContemplationChamber

Add new contemplation type: `cosmicEmbodiment`

```typescript
// In ContemplationChamber.tsx

// Add to CONTEMPLATION_TYPES
const CONTEMPLATION_TYPES = {
  // ... existing types
  cosmicEmbodiment: {
    name: 'Cosmic Embodiment',
    description: 'Let an energy speak directly to you',
    icon: '🗣️',
    requiresFocus: true, // Must select an entity to embody
    focusLabel: 'Which energy do you want to hear from?',
  },
};

// Modify buildSystemPrompt to include embodiment
function buildSystemPrompt() {
  if (selection.contemplationType === 'cosmicEmbodiment' && focusEntity) {
    return `${CORE_WISDOM_PROMPT}

${AGENT_PERSONAS.embodiment}

YOU ARE EMBODYING: ${focusEntity.name} (${focusEntity.id})

${getEntityEmbodimentContext(focusEntity)}

${OUTPUT_FORMAT}

SEEKER'S COSMIC PROFILE:
${formatProfileContext(profile, selection)}`;
  }

  // ... existing logic for other types
}

function getEntityEmbodimentContext(entity: EntityInfo): string {
  // Return specific context for the entity being embodied
  switch (entity.type) {
    case 'planet':
      return `You are the planet ${entity.name}. Speak from your archetypal nature:
${entity.data.archetype}
${entity.data.functionAndMeaning}
Your gift expression: ${entity.data.giftExpression}
Your shadow expression: ${entity.data.shadowExpression}`;

    case 'hd-gate':
      return `You are ${entity.name}. Your theme is ${entity.data.coreTheme}.
You live in the ${entity.data.centerId} and carry the energy of ${entity.data.hdDefinition}`;

    case 'gene-key':
      return `You are ${entity.name}.
Your shadow: ${entity.data.shadow.name} - ${entity.data.shadow.description}
Your gift: ${entity.data.gift.name} - ${entity.data.gift.description}
Your siddhi: ${entity.data.siddhi.name} - ${entity.data.siddhi.description}`;

    // ... other entity types
  }
}
```

### Embodiment Entity Selection

When user selects "Cosmic Embodiment", show entity picker:

```typescript
// EntityPicker.tsx - New component

interface EntityPickerProps {
  onSelect: (entity: EntityInfo) => void;
  filterSystem?: EntitySystem;
}

export function EntityPicker({ onSelect, filterSystem }: EntityPickerProps) {
  const [search, setSearch] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<EntitySystem | 'all'>('all');

  const entities = useMemo(() => {
    let results = Array.from(entityRegistry.values());

    if (selectedSystem !== 'all') {
      results = results.filter(e => e.system === selectedSystem);
    }

    if (search) {
      const lower = search.toLowerCase();
      results = results.filter(e =>
        e.name.toLowerCase().includes(lower) ||
        e.id.includes(lower)
      );
    }

    return results.slice(0, 50); // Limit for performance
  }, [search, selectedSystem]);

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search entities..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-4 py-2 bg-cosmic-800 rounded-lg"
      />

      <div className="flex gap-2">
        {['all', 'astrology', 'humanDesign', 'geneKeys'].map(sys => (
          <button
            key={sys}
            onClick={() => setSelectedSystem(sys as EntitySystem | 'all')}
            className={`px-3 py-1 rounded ${selectedSystem === sys ? 'bg-purple-600' : 'bg-cosmic-700'}`}
          >
            {sys === 'all' ? 'All' : sys}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {entities.map(entity => (
          <button
            key={entity.id}
            onClick={() => onSelect(entity)}
            className="flex items-center gap-2 px-3 py-2 bg-cosmic-800 hover:bg-cosmic-700 rounded-lg text-left"
          >
            <span className="text-lg">{entity.symbol || '•'}</span>
            <span className="text-sm">{entity.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## Part 5: Implementation Roadmap

### Phase 1: Entity Registry & Linking (Foundation)

| Step | Task | Effort |
|------|------|--------|
| 1.1 | Create `src/services/entities/registry.ts` | Medium |
| 1.2 | Create `EntityLink.tsx` component | Low |
| 1.3 | Create `MessageContent.tsx` parser | Medium |
| 1.4 | Create `EntityDetailPanel.tsx` | Medium |
| 1.5 | Integrate into ContemplationChamber | Low |
| 1.6 | Add entity reference format to prompts | Low |

### Phase 2: Prompt Redesign

| Step | Task | Effort |
|------|------|--------|
| 2.1 | Refactor `prompts.ts` with new structure | Medium |
| 2.2 | Add agent persona selection to UI | Low |
| 2.3 | Add interaction mode selection to UI | Low |
| 2.4 | Update `buildSystemPrompt()` for new architecture | Medium |
| 2.5 | Test all combinations | Medium |

### Phase 3: Cosmic Embodiment

| Step | Task | Effort |
|------|------|--------|
| 3.1 | Add `cosmicEmbodiment` contemplation type | Low |
| 3.2 | Create `EntityPicker.tsx` component | Medium |
| 3.3 | Add embodiment context generators | Medium |
| 3.4 | Create voice calibration logic | Medium |
| 3.5 | Test all embodiment entity types | High |

### Phase 4: Polish & Enhancement

| Step | Task | Effort |
|------|------|--------|
| 4.1 | Add entity detail routes/pages | High |
| 4.2 | Keyboard navigation for entity panel | Low |
| 4.3 | Entity link preview on hover | Medium |
| 4.4 | Mobile-responsive entity panel | Medium |

---

## Summary

This implementation plan covers:

1. **Universal Entity ID System** - Consistent IDs across all 3 wisdom systems
2. **Entity Linking** - `[[entity-id|Display Name]]` format parsed into clickable components
3. **Entity Registry** - Central lookup service for all entities
4. **Prompt Redesign** - Merged Harmonic Resonance + Tana agent personas
5. **Cosmic Embodiment** - First-person voice from any entity

The foundation (Entity Registry + Linking) should be implemented first, as it enables both the enhanced prompts and the embodiment feature.

Total estimated effort: 2-3 focused implementation sessions.
