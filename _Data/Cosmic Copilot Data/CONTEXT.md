# COSMIC CARTOGRAPHER - Project Context for Claude Code

## Project Creator: Felipe "Fis" Fraga

---

## THE BRIDGE-BUILDER VISION

Felipe Fraga is a **bridge-builder between ancient wisdom and modern technology**. His work operates at the intersection of:

- **Personal Knowledge Management (PKM)** — Systems for organizing life, knowledge, and consciousness
- **Astrology & Consciousness Systems** — Including Western Astrology, Human Design, and Gene Keys
- **Artificial Intelligence** — AI systems as consciousness expansion tools

The core insight: **AI becomes exponentially more helpful when it actually knows who you are**. Astrology, Human Design, and Gene Keys provide millennia-old frameworks for encoding individual differences in ways AI can understand and apply.

### The Philosophy

> "The elements are not what you are made of—they are how you are becoming."

This is not fortune-telling or determinism. These are **self-knowledge frameworks** that reveal:
- Natural cognitive patterns and learning styles
- Strengths to leverage and growth edges to develop
- Individual differences in how we process information and make decisions
- The architecture of consciousness itself

When we translate cosmic blueprints into AI context, we create a bridge between ancient wisdom and modern technology. AI stops giving generic advice and starts giving **personalized guidance** aligned with your unique design.

---

## WHAT WE ARE BUILDING

### The Cosmic Cartographer

A **visual knowledge graph application** for exploring astrological wisdom and personal cosmic blueprints. Think of it as an interactive celestial atlas where:

1. **Universal Wisdom** — All astrological entities (planets, signs, houses, elements, aspects, configurations, fixed stars, decans, dignities) exist as interconnected nodes
2. **Personal Profiles** — Users can input their birth data to see how the universal archetypes express through their individual chart
3. **AI-Guided Contemplation** — Claude API integration for personalized reflection and insight

### Why Build This?

Currently, there exists a **Tana version** of this system — the Astrology Wisdom Base — built within Tana's knowledge graph architecture. It works beautifully for Tana users, but:

- It's locked within the Tana ecosystem
- It requires Tana expertise to use effectively
- The visual exploration experience is limited by Tana's interface

The Cosmic Cartographer is the **web-native evolution** — a standalone application that:
- Makes the wisdom accessible to anyone with a browser
- Provides immersive visual navigation through the Celestial Mandala
- Enables progressive disclosure from curious beginner to advanced practitioner
- Integrates AI contemplation natively

---

## THE THREE WISDOM SYSTEMS

### 1. Western Astrology

The primary system for Cosmic Cartographer v1. A millennia-old framework mapping celestial patterns to human experience.

**Core Components:**
- **Planets** (10) — Archetypal drives and functions (Sun=Identity, Moon=Emotions, Mercury=Mind, etc.)
- **Zodiac Signs** (12) — Archetypal energies that color expression
- **Houses** (12) — Territories of life experience (1st=Self, 7th=Partnership, 10th=Career, etc.)
- **Elements** (4 Classical + 3 Alchemical + Aether) — Fundamental energy patterns
- **Aspects** (10+) — Geometric relationships between planets
- **Configurations** (8) — Patterns formed by multiple aspects (Grand Trine, T-Square, Stellium, etc.)
- **Decans** (36) — 10° subdivisions of signs with constellation associations
- **Dignities** (40+) — Planet-sign relationships (domicile, exaltation, detriment, fall)
- **Fixed Stars** (15+ major) — Including the 4 Royal Stars and Behenian stars

**Key Distinction:**
- **Houses are territories** — WHERE life happens (fixed domains everyone navigates)
- **Signs are energies** — HOW energy expresses (coloring influences)

This maps directly to PKM: Houses = Areas of life to maintain; Signs = Approaches/modes of engagement.

### 2. Human Design

A synthesis system combining Astrology, I Ching, Kabbalah, Hindu Chakra system, and Quantum Physics. Provides a detailed "bodygraph" of energy centers and channels.

**Core Components:**
- **Types** (5) — Generator, Manifesting Generator, Projector, Manifestor, Reflector
- **Strategy** — How each type should make decisions
- **Authority** — Inner guidance system (Emotional, Sacral, Splenic, etc.)
- **Centers** (9) — Energy hubs (defined vs. undefined)
- **Channels** (36) — Connections between centers
- **Gates** (64) — Individual energetic qualities (mapped to I Ching hexagrams)
- **Profile** — Line combinations showing life theme
- **Variables** — Deeper personality specifications

**Future Integration:** Human Design will be a separate data layer that can overlay on the astrological foundation.

### 3. Gene Keys

A contemplative system by Richard Rudd that expands on Human Design's 64 gates into a journey of transformation.

**Core Components:**
- **64 Gene Keys** — Each containing a Shadow, Gift, and Siddhi (enlightened) frequency
- **Activation Sequence** — Life's Work, Evolution, Radiance, Purpose
- **Venus Sequence** — Relationship and emotional healing path
- **Pearl Sequence** — Prosperity and service path
- **Codon Rings** — Groupings of Gene Keys that work together

**Future Integration:** Gene Keys provide the transformation pathway—how to evolve from Shadow to Gift to Siddhi.

---

## ASTROLOGICAL PRINCIPLES EMBEDDED IN DESIGN

These seven principles guide every design decision:

### 1. Natal Chart as Cosmic Mirror
The chart shows potential, not fate. Never use deterministic language ("You ARE"). Use invitational language ("This energy invites..."). Every feature empowers conscious engagement with cosmic energies.

### 2. Wholeness Principle
Every person contains all 12 signs, all 12 houses, all planetary archetypes. The mandala should always be visible/accessible. When exploring any part, highlight its connection to the whole. Language: "You have THIS sign in THIS house" not "You are THIS sign."

### 3. Planets as Living Archetypes
These are psychological forces, not just celestial bodies. Each has a domain, function, gift expression, and shadow expression. The "Big Four" (Sun, Moon, Rising, Mercury) deserve prominence as the core of identity.

### 4. Houses as Life Arenas
Houses deserve equal prominence to signs—perhaps more, for practical life application. Design dual navigation: "Explore by Energy (Signs)" AND "Explore by Life Area (Houses)."

### 5. Elements & Modalities as Temperament
The interface should FEEL different for each element:
- Fire: Warm colors, dynamic animations, energizing
- Earth: Grounded colors, stable transitions, practical
- Air: Cool colors, light/floating motion, intellectual
- Water: Fluid colors, flowing transitions, emotional depth

Elemental balance calculation should be prominent—it's the fastest path to self-insight.

### 6. Alchemical View
The unique 7-element system (Fire, Earth, Air, Water + Sulphur, Salt, Mercury) provides a transformation lens:
- **Sulphur** (Aries-Cancer): Contraction, manifestation, will
- **Salt** (Leo-Scorpio): Integration, balance, crystallization
- **Mercury** (Sagittarius-Pisces): Expansion, consciousness, vision

Toggle between Classical (4) and Alchemical (7) elemental views.

### 7. Cycles & Timing
Astrology is inherently temporal. Acknowledge planetary cycle durations. Future features: transits, progressions, Solar Returns.

---

## DATA ARCHITECTURE

### Universal Knowledge Base (Static, Shared)
JSON files containing the complete astrological wisdom:

```
/universal/
├── planets.json (10 planets with full archetype data)
├── points.json (8 astrological points: Nodes, Lilith, Chiron, etc.)
├── signs.json (12 zodiac signs)
├── houses.json (12 houses as life territories)
├── elements.json (8 elements: 4 classical + 3 alchemical + aether)
├── aspects.json (10 aspect types)
├── configurations.json (8 aspect patterns)
├── fixed-stars.json (15+ major fixed stars)
├── decans.json (36 decan subdivisions) [TO CREATE]
├── dignities.json (40+ dignity relationships) [TO CREATE]
└── relationships.json (77+ graph edges connecting entities)
```

### Personal Profile System (Dynamic, Per-User)
Structure for individual natal charts:

```typescript
interface AstroProfile {
  id: string;
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  placements: NatalPlacement[];      // Planet in Sign in House
  housePositions: HousePosition[];   // Sign on each house cusp
  aspects: {
    planetary: NatalAspect[];        // Planet-to-planet aspects
    other: NatalAspect[];            // Aspects involving points
  };
  configurations: NatalConfiguration[];  // Detected patterns
  elementalAnalysis: ElementalAnalysis;  // Balance calculation
  chartRulers: {
    traditional: string;
    modern: string;
  };
}
```

### Relationship Types
The knowledge graph connects entities through:
- RULES / RULES_HOUSE — Planetary rulerships
- HAS_ELEMENT / HAS_ALCHEMICAL_ELEMENT — Elemental associations
- HAS_MODALITY — Cardinal/Fixed/Mutable
- OPPOSES — Sign oppositions
- CONTAINS_DECAN — Sign-to-decan relationships
- HOUSE_RULED_BY_SIGN / HOUSE_RULED_BY_PLANET
- ENERGIZES / CHALLENGES / FLOWS_WITH — Element dynamics
- PLACED_IN_SIGN / PLACED_IN_HOUSE — Personal placements
- ASPECTS — Planetary relationships
- PART_OF_CONFIGURATION — Pattern membership

---

## TECHNOLOGY DECISIONS

### Stack
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS + CSS Modules for element theming
- **Visualization:** D3.js for the Celestial Mandala and Constellation Pathways
- **Animation:** Framer Motion
- **State:** Zustand (simple, effective)
- **Routing:** React Router v6
- **AI:** Anthropic Claude API
- **Build:** Vite
- **Deployment:** Vercel

### Key UI Patterns
- **Progressive Disclosure:** Layer complexity from first glance to deep mastery
- **Element Theming:** Visual identity shifts based on elemental context
- **Mobile-First:** Touch-friendly mandala navigation, responsive layouts
- **Accessibility:** WCAG AA compliance, keyboard navigation, reduced motion option

---

## FEATURE TIERS (Development Phases)

### Tier 1: Foundation
- Data parser (Markdown → JSON)
- TypeScript schema definitions
- Core layout and routing
- Entity Card component (reusable detail view)
- Element theme system

### Tier 2: Navigation & Discovery
- Celestial Mandala (interactive zodiac wheel)
- Element Realms (grouped by element)
- Global search
- Filter system
- Breadcrumb navigation

### Tier 3: Relationship Visualization
- Constellation Pathways (force-directed graph)
- Connection highlighter
- Relationship filters
- Compare mode

### Tier 4: Deep Exploration
- Decan deep dive
- Dignity Matrix (10×12 grid)
- Aspect Weaver
- Configuration Gallery

### Tier 5: Personal Profile
- Profile data entry
- Profile storage (local)
- Chart overlay on Mandala
- My Placements list
- My Aspects view
- Elemental Balance calculator
- Configuration detector

### Tier 6: AI Integration
- Contemplation Chamber
- Entity Deep Dive (AI expands on any entity)
- Personal Insight Generator
- Cosmic Counselor (full conversational AI with chart context)

### Tier 7: Advanced
- Alchemical view toggle
- Tana sync
- Solar Return calculator
- Multi-profile comparison (synastry)
- Learning paths

---

## THE CREATOR'S CONTEXT

### About Felipe (Fis) Fraga

- MSc in Computer Science
- Digital entrepreneur and PKM coach
- Tana Ambassador
- Brought Building a Second Brain (BASB) to Brazil through collaboration with Tiago Forte
- Creates educational content bridging ancient wisdom with modern AI

### Key Products
- **Intentional Plan & Review (IPR) System** — Elemental planning framework
- **Astrology Wisdom Copilot** — AI-powered astrological guidance
- **Voice Notes System** — Capture-to-wisdom workflow
- **Cosmic PKM Workshop** — Training on astrology-powered AI in Tana

### Felipe's Natal Chart (Working Example)
Key signatures that informed the design:

- **Scorpio Rising** — Intense, transformative approach
- **12th House Stellium** — Mercury Rx, Venus Rx, Jupiter, Pluto, North Node all in Scorpio
- **Water Dominant** (6 planets) — Deep emotional and intuitive processing
- **Air Deficient** (1 planet) — Growth edge in communication and intellectual detachment
- **Chart Rulers:** Mars (traditional), Pluto in domicile (modern, extremely strong)
- **Sun in Fall (Libra)** — Learning to develop authentic self-expression
- **Venus-Jupiter conjunction** (1°08') — Powerful artistic and expansive energy

This chart demonstrates why we need:
- Stellium detection and highlighting
- Grouped display for house concentrations
- Dignity badges on placements
- Elemental balance visualization with dominance/deficiency

---

## AI CONTEXT DESIGN

When Claude assists users in the Contemplation Chamber or Cosmic Counselor, it should embody:

### Universal Context (Always)
```
You are a compassionate, psychologically-informed astrologer. 
The chart shows potential, not fate.
Every placement has both gift and shadow expressions.
Growth comes through conscious engagement, not passive acceptance.
All 12 archetypes live within every person.
Tone: Warm, wise, inviting—never deterministic or fear-based.
```

### Entity Context (When exploring specific entity)
Include: Full entity JSON, related entities, opening reflection, 2-3 contemplation questions, integration practice suggestion.

### Personal Context (When profile exists)
Include: Birth data, key placements, elemental balance, configurations. Honor: Dominant element's communication style, Mercury sign's information processing, growth edges alongside gifts.

---

## FUTURE VISION

### Phase 2: Human Design Integration
- Bodygraph visualization
- Type/Strategy/Authority system
- Center definitions
- Channel/Gate exploration
- Cross-reference with astrological placements

### Phase 3: Gene Keys Integration
- 64 Gene Key profiles
- Shadow → Gift → Siddhi transformation paths
- Activation Sequence journey
- Contemplation practices

### Phase 4: Synthesis
- Multi-system profile view
- Cross-system correlations (Gate 1 = Scorpio connection, etc.)
- Unified consciousness map
- AI that synthesizes insights across all three systems

---

## KEY FILES REFERENCE

### In Project Knowledge
- `cosmic-pkm-ai-ultimate-guide.md` — Core framework for PKM + Astrology + AI
- `seven_elements_guide.md` — Complete elemental system (classical + alchemical)
- `12-areas-houses-framework.md` — Houses as life areas for PKM
- `astrology_wisdom_base_overview.md` — Tana system architecture
- `Workshop_Description_-_Cosmic_PKM_Astrology_Powered_AI_in_Tana.md` — Workshop context

### Generated Data Files
All in `/cosmic-cartographer-data/universal/`:
- planets.json, points.json, signs.json, houses.json
- elements.json, aspects.json, configurations.json
- fixed-stars.json, relationships.json

### Architecture Documents
- `cosmic-cartographer-system-architecture.md` — Complete system design
- `cosmic-cartographer-data-schema.md` — TypeScript interfaces and JSON structure

---

## GUIDING MANTRAS

> "Houses are where you live. Signs are how you live there."

> "The elements are not what you are made of—they are how you are becoming."

> "The stars don't determine our destiny—they illuminate the path."

> "AI becomes exponentially more helpful when it actually knows who you are."

> "Ancient wisdom + Modern technology = Conscious evolution."

---

*This context file serves as the foundation for Claude Code to understand and assist in building the Cosmic Cartographer. The vision is clear: a living temple where ancient stellar wisdom meets conscious technology, serving authentic self-discovery and spiritual evolution.*
