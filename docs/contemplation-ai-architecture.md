# Contemplation Chamber AI Integration Architecture

## Overview

The Contemplation Chamber will be transformed into an AI-powered reflection space that draws from all three wisdom systems (Astrology, Human Design, Gene Keys) to provide personalized contemplative guidance.

---

## 1. Contemplation Types

### A. Personal Chart Explorations
| Type | Focus | Data Sources |
|------|-------|--------------|
| **Natal Overview** | Big picture of your design | All 3 systems combined |
| **Placement Deep Dive** | Single planet/sign/house | AstroProfile.placements |
| **Aspect Exploration** | Specific aspect between planets | AstroProfile.aspects |
| **Configuration Reading** | Grand patterns in chart | AstroProfile.configurations |
| **Elemental Balance** | Fire/Earth/Air/Water distribution | AstroProfile.elementalAnalysis |

### B. Human Design Explorations
| Type | Focus | Data Sources |
|------|-------|--------------|
| **Type & Strategy** | Your energy type and decision-making | HDProfile.type, strategy |
| **Authority Check-in** | Connecting with inner authority | HDProfile.authority |
| **Gate Contemplation** | Specific gate energy | HDProfile.gates |
| **Channel Exploration** | Defined channels and their gifts | HDProfile.channels |
| **Center Awareness** | Defined vs undefined centers | HDProfile.definedCenters |
| **Profile Lines** | Your conscious/unconscious roles | HDProfile.profile |

### C. Gene Keys Journeys
| Type | Focus | Data Sources |
|------|-------|--------------|
| **Activation Sequence** | Purpose and core wounds | GKProfile.activationSequence |
| **Venus Sequence** | Relationships and attraction | GKProfile.venusSequence |
| **Pearl Sequence** | Prosperity and vocation | GKProfile.pearlSequence |
| **Shadow Work** | Transforming specific shadows | Individual sphere shadows |
| **Gift Activation** | Embodying specific gifts | Individual sphere gifts |
| **Siddhi Contemplation** | Highest potential meditation | Individual sphere siddhis |

### D. Cross-System Synthesis
| Type | Focus | Data Sources |
|------|-------|--------------|
| **Gate-Key Bridge** | Same hexagram, two perspectives | HD Gate + Gene Key data |
| **Planet-Sphere Connection** | Planet archetype meets sphere | Planet + mapped sphere |
| **Holistic Reading** | Complete integration | All available data |

---

## 2. Context Building Strategy

### Profile Context Object
```typescript
interface ContemplationContext {
  // User's complete profile data
  astrology: {
    placements: NatalPlacement[];
    aspects: ChartAspect[];
    configurations: ConfigurationInstance[];
    elementalAnalysis: ElementalAnalysis;
    chartRulers: { traditional: string; modern: string };
  };
  humanDesign: {
    type: string;
    strategy: string;
    authority: string;
    profile: string;
    gates: HDGatePlacement[];
    channels: string[];
    definedCenters: string[];
  };
  geneKeys: {
    activationSequence: SequenceSphere[];
    venusSequence: SequenceSphere[];
    pearlSequence: SequenceSphere[];
  };

  // Current contemplation focus
  focus: {
    type: ContemplationType;
    entity?: AstroEntity | HDGate | GeneKey;
    placement?: NatalPlacement | HDGatePlacement | SequenceSphere;
    aspect?: ChartAspect;
  };
}
```

### Context Pruning
For each contemplation type, we only send relevant data:

| Contemplation | Included Context |
|--------------|------------------|
| Placement Deep Dive | Single placement + related aspects + cross-system links |
| Gate Contemplation | HD gate + Gene Key equivalent + planetary activations |
| Activation Sequence | All 4 spheres + their shadows/gifts/siddhis |
| Holistic Reading | Full profile (token-optimized summary) |

---

## 3. System Prompts

### Base System Prompt
```
You are a wise guide in the Contemplation Chamber, a sacred digital space for
self-discovery. You draw from three interconnected wisdom systems:

1. ASTROLOGY - The cosmic blueprint through planets, signs, houses, and aspects
2. HUMAN DESIGN - The energetic mechanics of type, authority, gates, and channels
3. GENE KEYS - The transformational journey from shadow to gift to siddhi

Your role is to:
- Offer reflective questions rather than definitive answers
- Use invitational language ("This energy invites..." not "You are...")
- Honor both gift and shadow expressions of every placement
- Bridge connections between systems when relevant
- Encourage embodied exploration and personal discovery

You have access to the user's complete cosmic profile and will tailor
contemplations to their specific design.
```

### Type-Specific Prompts
Each contemplation type has additional context:

**Placement Deep Dive:**
```
Focus on the {planet} in {sign} in the {house} house.
Explore: archetype, sign expression, house domain, aspects it makes,
and any Gene Key/HD connections through this planet's sphere mapping.
```

**Shadow Work:**
```
Guide a gentle exploration of the {shadow} shadow at Gate {number}.
This is the {sphere} sphere in the {sequence} Sequence.
Help them recognize the shadow's gifts and invitation for transformation.
```

**Cross-System Synthesis:**
```
Bridge the connection between the astrological {planet} and its
Gene Keys sphere ({sphere}). Show how the planetary archetype
manifests through the Key's shadow-gift-siddhi spectrum.
```

---

## 4. API Integration

### Service Layer (`src/services/claude.ts`)
```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
});

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendContemplation(
  systemPrompt: string,
  messages: Message[],
  context: ContemplationContext
): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: buildSystemPrompt(systemPrompt, context),
    messages: messages,
  });

  return response.content[0].text;
}

function buildSystemPrompt(base: string, context: ContemplationContext): string {
  return `${base}\n\n## User's Cosmic Profile\n${formatContext(context)}`;
}
```

### Environment Variable
```env
VITE_CLAUDE_API_KEY=your-api-key-here
```

---

## 5. UI Components

### Contemplation Flow
```
┌─────────────────────────────────────────────────────────────────┐
│  CONTEMPLATION CHAMBER                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  SELECT CONTEMPLATION TYPE                               │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │   │
│  │  │ Personal │ │  Human   │ │   Gene   │ │  Cross   │   │   │
│  │  │  Chart   │ │  Design  │ │   Keys   │ │  System  │   │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  FOCUS SELECTION (based on type)                         │   │
│  │  [Dropdown: Placements / Gates / Spheres / etc.]        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  CHAT INTERFACE                                          │   │
│  │  ┌───────────────────────────────────────────────────┐  │   │
│  │  │ Assistant: Welcome to your contemplation space... │  │   │
│  │  │                                                   │  │   │
│  │  │ User: I'd like to explore my Sun placement...    │  │   │
│  │  │                                                   │  │   │
│  │  │ Assistant: Your Sun in Scorpio in the 12th...    │  │   │
│  │  └───────────────────────────────────────────────────┘  │   │
│  │                                                          │   │
│  │  ┌───────────────────────────────────┐  ┌────────────┐  │   │
│  │  │ Type your reflection...           │  │   Send     │  │   │
│  │  └───────────────────────────────────┘  └────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Component Structure
```
ContemplationChamber/
├── ContemplationChamber.tsx      # Main container
├── ContemplationTypeSelector.tsx  # Category tabs
├── FocusSelector.tsx             # Entity/placement picker
├── ChatInterface.tsx             # Message display + input
├── ContemplationContext.tsx      # React context for state
└── prompts/
    ├── basePrompt.ts
    ├── astrologyPrompts.ts
    ├── humanDesignPrompts.ts
    └── geneKeysPrompts.ts
```

---

## 6. State Management

### ContemplationState
```typescript
interface ContemplationState {
  // Selection state
  category: 'astrology' | 'humanDesign' | 'geneKeys' | 'crossSystem' | null;
  contemplationType: ContemplationType | null;
  focusEntity: FocusEntity | null;

  // Chat state
  messages: Message[];
  isLoading: boolean;
  error: string | null;

  // Session
  sessionStarted: Date | null;
  journalNotes: string;
}
```

### Actions
- `selectCategory(category)` - Choose wisdom system
- `selectContemplationType(type)` - Choose specific exploration
- `selectFocus(entity)` - Pick placement/gate/sphere
- `sendMessage(text)` - User sends message
- `receiveMessage(text)` - AI response arrives
- `saveJournalNote(text)` - Save reflection
- `resetSession()` - Start fresh

---

## 7. Token Optimization

### Context Compression
To stay within token limits while providing rich context:

1. **Summary Mode**: For holistic readings, summarize each system in 200 words
2. **Relevant Only**: For focused contemplations, include only related data
3. **Progressive Disclosure**: Start with overview, add detail on follow-up questions

### Estimated Tokens per Contemplation Type
| Type | System Prompt | Context | Available for Chat |
|------|---------------|---------|-------------------|
| Placement Dive | ~400 | ~300 | ~3,300 |
| Gate Contemplation | ~400 | ~400 | ~3,200 |
| Activation Sequence | ~400 | ~600 | ~3,000 |
| Holistic Reading | ~400 | ~1,200 | ~2,400 |

---

## 8. Implementation Phases

### Phase 1: Core Infrastructure
- [ ] Create Claude service layer
- [ ] Set up environment variables
- [ ] Build context formatting utilities

### Phase 2: Type Selection UI
- [ ] Category selector component
- [ ] Contemplation type cards
- [ ] Focus entity picker

### Phase 3: Chat Interface
- [ ] Message display component
- [ ] Input with send button
- [ ] Loading states
- [ ] Error handling

### Phase 4: System Prompts
- [ ] Base contemplation prompt
- [ ] Type-specific prompts
- [ ] Context injection

### Phase 5: Polish
- [ ] Journal integration
- [ ] Session persistence
- [ ] Suggested follow-up questions

---

## 9. Security Considerations

1. **API Key**: Store in environment variable, never commit
2. **Rate Limiting**: Implement client-side throttling
3. **Content Filtering**: Claude's built-in safety
4. **Data Privacy**: Profile data sent only to Claude API

---

## Required: Claude API Key

To implement this architecture, we need a Claude API key to be added to `.env`:

```env
VITE_CLAUDE_API_KEY=sk-ant-...
```

The key should have access to Claude claude-sonnet-4-20250514 or claude-3-5-haiku-20241022 models.
