# Cosmic Copilot: Human Design System Plan

> A comprehensive document detailing the data structure, categories, features, and implementation roadmap for the Human Design component of the Cosmic Copilot wisdom platform.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Core Components](#core-components)
3. [Data Categories & Tags](#data-categories--tags)
4. [Available Source Data](#available-source-data)
5. [Entity Specifications](#entity-specifications)
6. [Zodiac & Astrology Connections](#zodiac--astrology-connections)
7. [Gene Keys Connections](#gene-keys-connections)
8. [Personal Body Graph Features](#personal-body-graph-features)
9. [UI/Dashboard Design](#uidashboard-design)
10. [Implementation Roadmap](#implementation-roadmap)

---

## System Overview

Human Design is a synthesis system combining:
- **Astrology** (planetary positions)
- **I Ching** (64 hexagrams)
- **Kabbalah** (Tree of Life)
- **Hindu Chakra System** (energy centers)
- **Quantum Physics** (neutrino stream theory)

The system maps natal planetary positions to specific "gates" (I Ching hexagrams) arranged within 9 energy centers, creating a unique "Body Graph" for each individual.

### Key Principles

1. **Type**: Your energy blueprint (Manifestor, Generator, Manifesting Generator, Projector, Reflector)
2. **Strategy**: How to make correct decisions for your type
3. **Authority**: Your internal decision-making compass
4. **Profile**: Your life theme and purpose archetype
5. **Definition**: How your centers connect and energy flows
6. **Incarnation Cross**: Your life purpose (derived from Sun/Earth gates)

---

## Core Components

### The 9 Centers

| Center | Function | Biological | Motor? | Awareness? |
|--------|----------|------------|--------|------------|
| **Head** | Inspiration & mental pressure | Pineal gland | No | No |
| **Ajna** | Conceptualization & mental processing | Pituitary | No | Yes |
| **Throat** | Communication & manifestation | Thyroid | No | No |
| **G Center** | Identity, love & direction | Liver | No | No |
| **Heart/Ego** | Willpower & self-worth | Heart/Stomach | Yes | No |
| **Sacral** | Life force & response | Ovaries/Testes | Yes | No |
| **Solar Plexus** | Emotions & clarity | Kidneys/Lungs | Yes | Yes |
| **Spleen** | Intuition & immune system | Spleen/Lymph | No | Yes |
| **Root** | Adrenaline & drive | Adrenal glands | Yes | No |

### The 64 Gates

Each gate corresponds to:
- One I Ching hexagram (1-64)
- One Gene Key (1-64)
- A specific zodiac degree range (~5.625° each)
- One of the 9 centers
- One of 6 circuits
- Potential channel connections

### The 36 Channels

Channels form when two gates connect, linking two centers. Each channel has:
- A name and theme
- Two component gates
- A circuit membership
- A type (Generated, Projected, or Manifested)

### The 6 Circuits

| Circuit | Group | Theme | Key Characteristics |
|---------|-------|-------|---------------------|
| **Individual Knowing** | Individual | Mutation, empowerment | Acoustic, melancholic |
| **Individual Centering** | Individual | Self-empowerment | Individuation process |
| **Collective Understanding** | Collective | Logic, patterns | Future-focused, sharing |
| **Sensing/Abstract** | Collective | Experience, reflection | Past-focused, feeling |
| **Tribal Defense** | Tribal | Support, resources | Loyalty, survival |
| **Integration** | Integration | Self-sufficiency | Personal empowerment |

### The 5 Types

| Type | Population | Strategy | Signature | Not-Self |
|------|------------|----------|-----------|----------|
| **Manifestor** | ~9% | Inform before acting | Peace | Anger |
| **Generator** | ~37% | Wait to respond | Satisfaction | Frustration |
| **Manifesting Generator** | ~33% | Wait to respond, then inform | Satisfaction | Frustration/Anger |
| **Projector** | ~20% | Wait for invitation | Success | Bitterness |
| **Reflector** | ~1% | Wait a lunar cycle | Surprise | Disappointment |

### The 7 Authorities

| Authority | Center | Decision Process |
|-----------|--------|------------------|
| **Emotional** | Solar Plexus | Wait for emotional clarity |
| **Sacral** | Sacral | Gut response (uh-huh/un-un) |
| **Splenic** | Spleen | Instant intuitive knowing |
| **Ego Manifested** | Heart → Throat | Willpower declaration |
| **Ego Projected** | Heart → G | Self-worth recognition |
| **Self-Projected** | G → Throat | Talking it out |
| **Mental/None** | No inner authority | Environmental reflection |

### The 12 Profiles

Derived from the lines (1-6) of the Conscious Sun and Unconscious Sun gates:

| Profile | Archetype | Theme |
|---------|-----------|-------|
| 1/3 | Investigator/Martyr | Foundation through trial |
| 1/4 | Investigator/Opportunist | Foundation through network |
| 2/4 | Hermit/Opportunist | Natural gifts, relationships |
| 2/5 | Hermit/Heretic | Natural gifts, universalization |
| 3/5 | Martyr/Heretic | Trial and error, projection |
| 3/6 | Martyr/Role Model | Experimentation, wisdom |
| 4/6 | Opportunist/Role Model | Network, maturation |
| 4/1 | Opportunist/Investigator | Fixed network, foundation |
| 5/1 | Heretic/Investigator | Projection, research |
| 5/2 | Heretic/Hermit | Universal solutions, retreat |
| 6/2 | Role Model/Hermit | Three life phases, natural gifts |
| 6/3 | Role Model/Martyr | Wisdom through experience |

---

## Data Categories & Tags

### Primary Supertags (from TANA system)

```yaml
# Human Design System Supertags

#bodygraph-chart          # Personal chart instance
#type                     # Manifestor, Generator, etc.
#inner-authority          # Decision-making authority
#profile                  # 1/3, 2/4, etc.
#center                   # One of 9 centers
#gate                     # One of 64 gates
#channel                  # One of 36 channels
#circuit                  # One of 6 circuits
#hd-planet                # Planet in HD context
#planet-placement         # Specific placement (conscious/unconscious)
#arrow                    # The four arrows (variables)
#phs                      # Primary Health System
#environment              # Correct environment type
#motivation               # One of 6 motivations
#perspective              # One of 6 perspectives
#incarnation-cross        # Life purpose cross
#line                     # Line 1-6 interpretation
#definition               # Single, split, triple, quadruple, none
```

### Secondary Categories

```yaml
# Gate Organization
gate_by_center:
  - head_gates: [64, 61, 63]
  - ajna_gates: [47, 24, 4, 17, 43, 11]
  - throat_gates: [62, 23, 56, 35, 12, 45, 33, 8, 31, 20, 16]
  - g_gates: [7, 1, 13, 25, 46, 2, 15, 10]
  - heart_gates: [21, 51, 26, 40]
  - sacral_gates: [5, 14, 29, 59, 9, 3, 42, 27, 34]
  - solar_plexus_gates: [6, 37, 22, 36, 30, 55, 49]
  - spleen_gates: [48, 57, 44, 50, 32, 28, 18]
  - root_gates: [58, 38, 54, 53, 60, 52, 19, 39, 41]

# Circuit Organization
circuit_membership:
  individual_knowing:
    gates: [1, 2, 3, 14, 20, 23, 24, 28, 38, 39, 43, 51, 55, 57, 61]
    channels: [1-8, 2-14, 3-60, 20-34, 23-43, 24-61, 28-38, 39-55, 51-25, 57-20]

  collective_understanding:
    gates: [4, 7, 17, 29, 31, 46, 59, 62, 63, 64]
    channels: [4-63, 7-31, 17-62, 29-46, 59-6]

  # ... etc for other circuits
```

---

## Available Source Data

### From wisdom-app-data Repository

| File | Content | Records | Format |
|------|---------|---------|--------|
| `human_design_gates.json` | All 64 gates | 64 | JSON |
| `human_design_gates.csv` | Gate data | 8,575 lines | CSV |
| `gates_individual_knowing_circuit_FINAL.md` | 18 gates | Detailed | Markdown |
| `gates_collective_understanding_circuit_FINAL.md` | Gates | Detailed | Markdown |
| `gates_tribal_defense_circuit_FINAL.md` | Gates | Detailed | Markdown |
| `gates_sensing_abstract_circuit_FINAL.md` | Gates | Detailed | Markdown |
| `gates_integration_circuit_FINAL.md` | Gates | Detailed | Markdown |
| `gates_individual_centering_circuit_FINAL.md` | Gates | Detailed | Markdown |
| `supertags_key.md` | Schema definitions | All tags | Markdown |
| `human_design_planets_tana_paste.md` | Planet meanings | 10 | Markdown |

### Data Quality Assessment

| Component | Completeness | Quality | Notes |
|-----------|--------------|---------|-------|
| Gates (64) | 100% | Excellent | Full descriptions, lines, circuits |
| Channels (36) | Partial | Good | Need to compile from gate connections |
| Centers (9) | Partial | Medium | Need defined/undefined meanings |
| Circuits (6) | 100% | Excellent | Well-organized in markdown files |
| Types (5) | Partial | Medium | Need full strategy/signature content |
| Profiles (12) | Partial | Medium | Need detailed interpretations |
| Authorities (7) | Partial | Medium | Need decision-making guidance |

---

## Entity Specifications

### Gate Entity Schema

```typescript
interface HumanDesignGate {
  id: string;                    // "gate-1"
  tradition: 'human-design';
  entityType: 'gate';

  // Core identity
  number: number;                // 1-64
  name: string;                  // "The Creative"
  keywords: string[];            // ["creativity", "self-expression"]

  // Location
  centerId: string;              // "g-center"
  circuitId: string;             // "individual-knowing"

  // I Ching correspondence
  hexagram: {
    number: number;
    name: string;
    trigrams: [string, string];  // ["heaven", "heaven"]
  };

  // Zodiac mapping
  zodiacPosition: {
    sign: string;                // "scorpio"
    degreeStart: number;         // 13.625
    degreeEnd: number;           // 19.25
  };

  // Lines
  lines: GateLine[];             // 6 lines with interpretations

  // Connections
  channelConnections: {
    gateId: string;              // Gate it can connect to
    channelId: string;           // Channel formed
  }[];

  // Cross-system
  geneKeyId: string;             // "gene-key-1" (always same number)
  programmingPartner: number;    // 2 (gate + 32 mod 64)

  // Content
  description: string;
  giftExpression: string;
  shadowExpression: string;
  notSelfBehavior: string;

  // Contemplation
  contemplationQuestions: string[];
  affirmations: string[];
}

interface GateLine {
  lineNumber: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  theme: string;
  description: string;
  exaltedExpression?: string;
  detrimentExpression?: string;
}
```

### Channel Entity Schema

```typescript
interface HumanDesignChannel {
  id: string;                    // "channel-1-8"
  tradition: 'human-design';
  entityType: 'channel';

  // Core identity
  name: string;                  // "The Channel of Inspiration"
  keywords: string[];

  // Component gates
  gates: [string, string];       // ["gate-1", "gate-8"]
  gateNumbers: [number, number]; // [1, 8]

  // Location
  centers: [string, string];     // ["g-center", "throat-center"]
  circuitId: string;

  // Type
  channelType: 'generated' | 'projected' | 'manifested';

  // Content
  description: string;
  giftExpression: string;
  integrationChallenge: string;

  // Personal chart context
  definedMeaning: string;        // When you have this defined
  halfDefinedMeaning: string;    // When you have one gate
}
```

### Center Entity Schema

```typescript
interface HumanDesignCenter {
  id: string;                    // "sacral-center"
  tradition: 'human-design';
  entityType: 'center';

  // Core identity
  name: string;                  // "Sacral Center"
  keywords: string[];
  biologicalCorrelate: string;   // "Ovaries/Testes"

  // Classification
  centerType: 'motor' | 'awareness' | 'pressure' | 'identity' | 'communication';
  isMotor: boolean;
  isAwareness: boolean;

  // Component gates
  gateIds: string[];             // All gates in this center

  // Content
  theme: string;                 // "Life Force & Sexuality"
  definedMeaning: string;        // Consistent access to this energy
  undefinedMeaning: string;      // Wisdom potential, conditioning
  openMeaning: string;           // No gates activated
  notSelfQuestion: string;       // "Am I trying to know when enough is enough?"

  // Visual
  shape: 'square' | 'triangle' | 'diamond';
  position: { x: number; y: number };  // For body graph rendering
}
```

---

## Zodiac & Astrology Connections

### Gate-to-Zodiac Mapping

Each of the 64 gates occupies ~5.625° of the zodiac (360° ÷ 64 = 5.625°).

**Mapping Structure:**

```
Zodiac Wheel (360°)
├── Aries (0° - 30°)
│   ├── Gate 25: 0.000° - 5.625°
│   ├── Gate 17: 5.625° - 11.250°
│   ├── Gate 21: 11.250° - 16.875°
│   ├── Gate 51: 16.875° - 22.500°
│   └── Gate 42: 22.500° - 28.125° (partial)
│
├── Taurus (30° - 60°)
│   └── ... (continues pattern)
│
... (all 12 signs)
```

### Planet Activation

When a planet is at a specific zodiac degree, it "activates" the corresponding gate:

```typescript
interface PlanetaryActivation {
  planet: string;           // "sun"
  zodiacSign: string;       // "scorpio"
  degree: number;           // 15.5
  minute: number;           // 30

  // Derived
  activatedGate: number;    // 1
  activatedLine: number;    // 3 (derived from degree within gate)

  // Context
  conscious: boolean;       // Birth moment (Personality)
  unconscious: boolean;     // 88° before birth (Design)
}
```

### Astrology Integration Points

| Astrology Concept | Human Design Equivalent |
|-------------------|-------------------------|
| Sun position | Conscious Sun Gate (primary identity) |
| Earth position | Conscious Earth Gate (grounding) |
| Moon position | Conscious Moon Gate (drive) |
| Nodes | Nodal gates (life direction) |
| All planets | 13 activations (personality + design) |
| Houses | Not directly used; gates replace |
| Aspects | Channels replace traditional aspects |

---

## Gene Keys Connections

### Direct Correspondence

**Gate Number = Gene Key Number** (1:1 mapping)

| Gate | Gene Key | Shadow | Gift | Siddhi |
|------|----------|--------|------|--------|
| 1 | 1 | Entropy | Freshness | Beauty |
| 2 | 2 | Dislocation | Orientation | Unity |
| 3 | 3 | Chaos | Innovation | Innocence |
| ... | ... | ... | ... | ... |
| 64 | 64 | Confusion | Imagination | Illumination |

### Integrated Content Model

```typescript
interface IntegratedGateKey {
  number: number;

  // Human Design perspective
  hdGate: {
    name: string;
    center: string;
    circuit: string;
    lines: GateLine[];
  };

  // Gene Keys perspective
  geneKey: {
    shadow: { name: string; description: string };
    gift: { name: string; description: string };
    siddhi: { name: string; description: string };
    codonRing: string;
    aminoAcid: string;
  };

  // Shared
  hexagram: IChingHexagram;
  zodiacPosition: ZodiacRange;
  keywords: string[];
  archetype: string;
}
```

### Contemplation Bridge

The Gene Keys Shadow → Gift → Siddhi spectrum maps to Human Design's:
- **Not-Self** (living from conditioning) → Shadow
- **Self** (aligned with design) → Gift
- **Transcendence** (spiritual mastery) → Siddhi

---

## Personal Body Graph Features

### Body Graph Components

```typescript
interface PersonalBodyGraph {
  // Birth data
  birthData: {
    dateTime: Date;
    location: GeoLocation;
    timezone: string;
  };

  // Calculations
  personality: {              // Conscious (birth moment)
    sun: PlanetaryActivation;
    earth: PlanetaryActivation;
    moon: PlanetaryActivation;
    northNode: PlanetaryActivation;
    southNode: PlanetaryActivation;
    mercury: PlanetaryActivation;
    venus: PlanetaryActivation;
    mars: PlanetaryActivation;
    jupiter: PlanetaryActivation;
    saturn: PlanetaryActivation;
    uranus: PlanetaryActivation;
    neptune: PlanetaryActivation;
    pluto: PlanetaryActivation;
  };

  design: {                   // Unconscious (88° before)
    // Same structure as personality
  };

  // Derived properties
  type: HumanDesignType;
  authority: Authority;
  profile: Profile;
  definition: Definition;
  incarnationCross: IncarnationCross;

  // Centers
  centers: {
    [centerId: string]: {
      defined: boolean;
      gates: number[];        // Active gate numbers
    };
  };

  // Channels
  activeChannels: Channel[];

  // Variables (advanced)
  variables?: {
    determination: Arrow;
    environment: Arrow;
    motivation: Arrow;
    perspective: Arrow;
  };
}
```

### Body Graph Visualization

```
                    ┌─────┐
                    │HEAD │  64, 61, 63
                    └──┬──┘
                       │
                    ┌──┴──┐
                    │AJNA │  47, 24, 4, 17, 43, 11
                    └──┬──┘
                       │
          ┌────────────┼────────────┐
          │         ┌──┴──┐         │
          │         │THRT │  (11 gates)
          │         └──┬──┘         │
          │            │            │
       ┌──┴──┐      ┌──┴──┐      ┌──┴──┐
       │SPLC │      │  G  │      │WILL │
       └──┬──┘      └──┬──┘      └──┬──┘
          │            │            │
          │         ┌──┴──┐         │
          │         │SACR │         │
          │         └──┬──┘         │
          │            │            │
       ┌──┴──┐      ┌──┴──┐         │
       │SOLR │      │ROOT │ ────────┘
       └─────┘      └─────┘
```

### Interactive Features

1. **Center Highlighting**: Click center to see all gates
2. **Channel Animation**: Show energy flow when defined
3. **Gate Deep Dive**: Click gate for full interpretation
4. **Type Overlay**: Color-code by type characteristics
5. **Transit Layer**: Show current planetary positions
6. **Comparison Mode**: Two charts side-by-side

---

## UI/Dashboard Design

### Main Human Design Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  HUMAN DESIGN                                        [Search]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   MY CHART  │  │   LIBRARY   │  │   EXPLORE   │             │
│  │             │  │             │  │             │             │
│  │ [Body Graph]│  │ • Gates     │  │ • Circuits  │             │
│  │             │  │ • Channels  │  │ • Centers   │             │
│  │ Type: Gen.  │  │ • Centers   │  │ • Compare   │             │
│  │ Auth: Sacr. │  │ • Circuits  │  │ • Transits  │             │
│  │ Profile: 3/5│  │ • Types     │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Gate Library Page

```
┌─────────────────────────────────────────────────────────────────┐
│  GATES                                    [Filter] [Sort]       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  View: [Grid] [List] [By Center] [By Circuit]                   │
│                                                                 │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
│  │ Gate 1 │ │ Gate 2 │ │ Gate 3 │ │ Gate 4 │ │ Gate 5 │       │
│  │Creative│ │Receptvv│ │Ordering│ │Youthful│ │Waiting │       │
│  │   ☰    │ │   ☷    │ │   ☳    │ │   ☵    │ │   ☲    │       │
│  │ G Cntr │ │ G Cntr │ │ Sacral │ │  Ajna  │ │ Sacral │       │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘       │
│                                                                 │
│  ... (64 gates total)                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Gate Detail Page

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back to Gates                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ═══════════════════════════════════════════════════════════    │
│       GATE 1: THE CREATIVE                    ☰                 │
│       Self-Expression • Creativity • Individuality              │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────────────────────────┐  │
│  │  [Mini Body     │  │  LOCATION                           │  │
│  │   Graph with    │  │  Center: G Center (Identity)        │  │
│  │   Gate 1        │  │  Circuit: Individual Knowing        │  │
│  │   highlighted]  │  │  Channel: 1-8 (Inspiration)         │  │
│  │                 │  │                                     │  │
│  │                 │  │  ZODIAC                             │  │
│  │                 │  │  ♏ Scorpio 13°37' - 19°15'          │  │
│  │                 │  │                                     │  │
│  │                 │  │  HEXAGRAM                           │  │
│  │                 │  │  ䷀ Ch'ien - The Creative            │  │
│  └─────────────────┘  └─────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  DESCRIPTION                                             │   │
│  │                                                          │   │
│  │  Gate 1 is the Gate of Self-Expression, representing    │   │
│  │  the creative force that seeks unique individual        │   │
│  │  expression...                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐       │
│  │  LINES        │  │  GENE KEY     │  │  IN MY CHART  │       │
│  │  [Accordion]  │  │  Shadow: ...  │  │  [If active]  │       │
│  │  Line 1: ...  │  │  Gift: ...    │  │  Personality  │       │
│  │  Line 2: ...  │  │  Siddhi: ...  │  │  Sun - Line 3 │       │
│  │  ...          │  │  [Link →]     │  │               │       │
│  └───────────────┘  └───────────────┘  └───────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Personal Body Graph Page

```
┌─────────────────────────────────────────────────────────────────┐
│  MY HUMAN DESIGN                              [Edit Birth Data] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────┐  ┌────────────────────────┐  │
│  │                              │  │  SUMMARY               │  │
│  │     [Interactive Body       │  │                        │  │
│  │      Graph SVG]             │  │  Type: Generator       │  │
│  │                              │  │  Strategy: Wait to    │  │
│  │     • Click centers         │  │            Respond     │  │
│  │     • Hover gates           │  │  Authority: Sacral     │  │
│  │     • Defined = colored     │  │  Profile: 3/5          │  │
│  │     • Undefined = white     │  │  Definition: Single    │  │
│  │                              │  │                        │  │
│  │                              │  │  Incarnation Cross:   │  │
│  │                              │  │  Right Angle Cross    │  │
│  │                              │  │  of the Sphinx        │  │
│  └──────────────────────────────┘  └────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ACTIVATIONS                                             │   │
│  │                                                          │   │
│  │  PERSONALITY (Conscious)      DESIGN (Unconscious)       │   │
│  │  ──────────────────────────   ──────────────────────     │   │
│  │  ☉ Sun      Gate 1.3         ☉ Sun      Gate 25.1       │   │
│  │  ⊕ Earth    Gate 2.3         ⊕ Earth    Gate 46.1       │   │
│  │  ☽ Moon     Gate 55.2        ☽ Moon     Gate 30.5       │   │
│  │  ☊ N.Node   Gate 13.4        ☊ N.Node   Gate 7.4        │   │
│  │  ...                          ...                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  DEFINED CHANNELS                                        │   │
│  │                                                          │   │
│  │  [1-8] Channel of Inspiration (Individual Knowing)       │   │
│  │  [3-60] Channel of Mutation (Individual Knowing)         │   │
│  │  ...                                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Roadmap

### Phase 1: Foundation Data

**Objective**: Import and structure all Human Design knowledge

- [ ] Create TypeScript interfaces for all HD entities
- [ ] Import 64 gates from `human_design_gates.json`
- [ ] Compile 36 channels from gate connection data
- [ ] Document 9 centers with defined/undefined meanings
- [ ] Document 6 circuits with themes and gate lists
- [ ] Document 5 types with strategy/signature/not-self
- [ ] Document 7 authorities with decision guidance
- [ ] Document 12 profiles with archetypes

### Phase 2: Static Library

**Objective**: Build browsable knowledge base

- [ ] Gates library page with filtering
- [ ] Gate detail page with full interpretation
- [ ] Channels library page
- [ ] Channel detail page
- [ ] Centers overview page
- [ ] Center detail with gates
- [ ] Circuits visualization
- [ ] Types overview with comparison

### Phase 3: Personal Chart

**Objective**: Calculate and display individual body graphs

- [ ] Birth data input form (date, time, location)
- [ ] Ephemeris calculation for 26 planetary positions
- [ ] Gate/line derivation from zodiac degrees
- [ ] Type, authority, profile derivation
- [ ] Definition calculation (center connections)
- [ ] Incarnation cross determination
- [ ] Body graph SVG rendering
- [ ] Interactive chart exploration

### Phase 4: Integration

**Objective**: Connect HD with Astrology and Gene Keys

- [ ] Gate ↔ Gene Key linking
- [ ] Zodiac degree visualization
- [ ] Astrology placement → HD activation mapping
- [ ] Unified entity detail pages
- [ ] Cross-system navigation

### Phase 5: Advanced Features

**Objective**: Deep exploration tools

- [ ] Transit overlay (current gates)
- [ ] Composite charts (relationship)
- [ ] Variables/arrows (advanced differentiation)
- [ ] Incarnation cross deep dives
- [ ] Circuit journey exploration
- [ ] AI-powered interpretations

---

## Technical Notes

### Body Graph Rendering

Options for SVG body graph:
1. **Static SVG with CSS**: Pre-made SVG, toggle classes
2. **D3.js Dynamic**: Generate from data
3. **Canvas/WebGL**: For complex animations
4. **React-SVG Library**: Declarative components

**Recommended**: Static SVG template with dynamic class/fill changes

### Ephemeris Calculation

For accurate gate calculations, need:
- Swiss Ephemeris (most accurate)
- 88° solar arc for Design calculation
- Timezone handling (birth location)
- Line derivation (6 lines per gate = ~0.9375° each)

### Data Transformation Pipeline

```
Raw TANA Data
    ↓
Parse & Validate
    ↓
Normalize to TypeScript interfaces
    ↓
Generate relationship edges
    ↓
Compile to JSON bundles
    ↓
Load into WisdomGraph service
```

---

## Appendix: Entity Counts

| Entity | Count | Notes |
|--------|-------|-------|
| Gates | 64 | Each with 6 lines = 384 line interpretations |
| Channels | 36 | Connecting 2 gates each |
| Centers | 9 | With defined/undefined meanings |
| Circuits | 6 | Grouped by Individual/Collective/Tribal |
| Types | 5 | With strategies and signatures |
| Authorities | 7 | Decision-making systems |
| Profiles | 12 | Life archetypes |
| Incarnation Crosses | 192 | (64 gates × 4 quarters ÷ ... complex!) |

**Total Primary Entities**: ~340+ unique data points
**Total with Lines**: ~700+ interpretive units

---

*Document Version: 1.0*
*Last Updated: January 2026*
*Part of Cosmic Copilot Planning Documentation*
