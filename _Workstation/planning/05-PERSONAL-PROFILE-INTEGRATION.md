# Cosmic Copilot: Personal Profile Integration

> A comprehensive document detailing how personal birth data flows through all three wisdom systems (Astrology, Human Design, Gene Keys) to create an integrated self-discovery dashboard.

---

## Table of Contents

1. [Vision & Philosophy](#vision--philosophy)
2. [The Unified Personal Profile](#the-unified-personal-profile)
3. [Birth Data Requirements](#birth-data-requirements)
4. [Calculation Pipeline](#calculation-pipeline)
5. [Astrology Profile Layer](#astrology-profile-layer)
6. [Human Design Profile Layer](#human-design-profile-layer)
7. [Gene Keys Profile Layer](#gene-keys-profile-layer)
8. [Cross-System Synthesis](#cross-system-synthesis)
9. [Interactive Dashboard Design](#interactive-dashboard-design)
10. [AI Integration Features](#ai-integration-features)
11. [Implementation Roadmap](#implementation-roadmap)

---

## Vision & Philosophy

### The Central Premise

A single birth moment—the exact date, time, and location when you took your first breath—contains the seed of your unique cosmic blueprint. Three ancient-modern wisdom traditions offer complementary lenses to read this blueprint:

| Tradition | Primary Focus | Metaphor |
|-----------|--------------|----------|
| **Astrology** | Psychological dynamics, life cycles | The celestial weather |
| **Human Design** | Energy mechanics, decision strategy | The vehicle manual |
| **Gene Keys** | Consciousness evolution, purpose | The soul's journey |

### Integration Philosophy

```
                        BIRTH MOMENT
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ASTROLOGY │  │ HUMAN    │  │ GENE     │
        │          │  │ DESIGN   │  │ KEYS     │
        │ WHO you  │  │ HOW you  │  │ WHY you  │
        │ are      │  │ operate  │  │ are here │
        │          │  │          │  │          │
        │ Signs    │  │ Type     │  │ Sequences│
        │ Houses   │  │ Authority│  │ Shadows  │
        │ Aspects  │  │ Centers  │  │ Gifts    │
        │ Planets  │  │ Channels │  │ Siddhis  │
        └──────────┘  └──────────┘  └──────────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │   INTEGRATED   │
                    │    PROFILE     │
                    │                │
                    │ A unified view │
                    │ of your cosmic │
                    │ blueprint      │
                    └────────────────┘
```

### Guiding Principles

1. **Single Entry Point**: Enter birth data once, see it reflected across all systems
2. **Complementary Views**: Each system reveals different facets of the same truth
3. **Invitational Language**: "This suggests..." not "You are..."
4. **Empowerment Focus**: Tools for self-discovery, not deterministic labels
5. **Progressive Disclosure**: Start simple, go deeper as interest grows

---

## The Unified Personal Profile

### Master Profile Schema

```typescript
interface CosmicProfile {
  // Core Identity
  id: string;                           // Unique profile ID
  name: string;                         // User's name
  createdAt: Date;
  updatedAt: Date;

  // Birth Data
  birthData: BirthData;

  // Calculated Layers
  astrology: AstrologyProfile;
  humanDesign: HumanDesignProfile;
  geneKeys: GeneKeysProfile;

  // Cross-System Synthesis
  synthesis: ProfileSynthesis;

  // User Preferences
  preferences: ProfilePreferences;
}

interface BirthData {
  // Required
  dateTime: Date;                       // Full datetime with timezone
  location: {
    name: string;                       // "São Paulo, Brazil"
    latitude: number;
    longitude: number;
    timezone: string;                   // "America/Sao_Paulo"
  };

  // Optional refinements
  birthTimeAccuracy: 'exact' | 'approximate' | 'unknown';
  birthTimeSource: 'certificate' | 'parent' | 'estimate';

  // Derived
  julianDay: number;                    // For ephemeris calculations
  localSiderealTime: number;            // For house calculations
}
```

### Profile Completeness Levels

| Level | Requirements | Features Unlocked |
|-------|--------------|-------------------|
| **Basic** | Date only | Sun sign, approximate Gene Keys |
| **Standard** | Date + approximate time | Rising sign, HD Type, most activations |
| **Complete** | Date + exact time + location | Full chart, all houses, precise lines |

---

## Birth Data Requirements

### Input Form Design

```
┌─────────────────────────────────────────────────────────────────┐
│                    ENTER YOUR BIRTH DATA                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Birth Date *                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Month ▼] [Day ▼] [Year ▼]                             │   │
│  │  March      15      1985                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Birth Time                                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [14] : [30]  [●AM ○PM]                                 │   │
│  │                                                          │   │
│  │  ○ I know my exact birth time                            │   │
│  │  ○ I have an approximate time (±1 hour)                  │   │
│  │  ○ I don't know my birth time                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Birth Location *                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🔍 São Paulo, Brazil                                    │   │
│  │     -23.5505° S, -46.6333° W                            │   │
│  │     Timezone: America/Sao_Paulo (UTC-3)                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           [Generate My Cosmic Profile]                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ℹ️  Your data is stored locally and never shared.             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Location Handling

```typescript
interface LocationService {
  // Search by name
  searchLocation(query: string): Promise<Location[]>;

  // Reverse geocode
  getLocationFromCoords(lat: number, lng: number): Promise<Location>;

  // Timezone lookup
  getTimezone(lat: number, lng: number, date: Date): Promise<string>;
}

interface Location {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utcOffset: number;
}
```

### Time Uncertainty Handling

When birth time is unknown:

| Approach | Impact |
|----------|--------|
| **Noon Chart** | Use 12:00 PM local; note uncertainty |
| **Sunrise Chart** | Use local sunrise; symbolic meaning |
| **Solar House** | Place Sun at Ascendant; no time needed |
| **Range Display** | Show possible positions across 24 hours |

For Human Design and Gene Keys:
- Gates remain the same throughout the day (slow planets)
- Lines may vary (fast planets, especially Moon)
- Design calculation (88° prior) is affected

---

## Calculation Pipeline

### Overview

```
Birth Data Input
       │
       ▼
┌─────────────────────────────┐
│     EPHEMERIS ENGINE        │
│                             │
│  Calculate planetary        │
│  positions for:             │
│  • Birth moment (Pers.)     │
│  • 88° prior (Design)       │
└──────────────┬──────────────┘
               │
       ┌───────┴───────┐
       │               │
       ▼               ▼
┌─────────────┐ ┌─────────────┐
│  ASTROLOGY  │ │  HD + GK    │
│  CALCULATOR │ │  CALCULATOR │
│             │ │             │
│ • Houses    │ │ • Gates     │
│ • Aspects   │ │ • Lines     │
│ • Dignities │ │ • Centers   │
│ • Configs   │ │ • Channels  │
└──────┬──────┘ └──────┬──────┘
       │               │
       └───────┬───────┘
               │
               ▼
┌─────────────────────────────┐
│      PROFILE SYNTHESIS      │
│                             │
│  • Merge calculations       │
│  • Generate insights        │
│  • Create visualizations    │
└─────────────────────────────┘
```

### Ephemeris Integration

**Options:**

1. **Swiss Ephemeris (WASM)**
   - Most accurate (sub-arcsecond)
   - Works offline
   - Larger bundle size (~2MB)

2. **Astronomia.js**
   - JavaScript-native
   - Good accuracy for our needs
   - Lighter weight

3. **External API**
   - No bundle impact
   - Requires internet
   - Rate limits

**Recommended**: Swiss Ephemeris via WASM for accuracy, with API fallback.

### Planetary Positions Needed

| Planet | Astrology | Human Design | Gene Keys |
|--------|-----------|--------------|-----------|
| Sun | ✓ | ✓ (Pers + Design) | ✓ (Life's Work) |
| Moon | ✓ | ✓ (Pers + Design) | ✓ |
| Mercury | ✓ | ✓ (Pers + Design) | ✓ |
| Venus | ✓ | ✓ (Pers + Design) | ✓ (Venus Seq) |
| Mars | ✓ | ✓ (Pers + Design) | ✓ (Venus Seq) |
| Jupiter | ✓ | ✓ (Pers + Design) | ✓ (Pearl Seq) |
| Saturn | ✓ | ✓ (Pers + Design) | ✓ |
| Uranus | ✓ | ✓ (Pers + Design) | ✓ |
| Neptune | ✓ | ✓ (Pers + Design) | ✓ |
| Pluto | ✓ | ✓ (Pers + Design) | ✓ |
| North Node | ✓ | ✓ (Pers + Design) | ✓ (Pearl Seq) |
| South Node | ✓ | ✓ (Pers + Design) | ✓ (Pearl Seq) |
| Earth | — | ✓ (Pers + Design) | ✓ (Activation) |

**Total positions**: 13 planets × 2 (Pers/Design) = 26 positions

---

## Astrology Profile Layer

### Profile Structure

```typescript
interface AstrologyProfile {
  // Core Placements
  placements: NatalPlacement[];        // 10 planets + points

  // House System
  houses: HousePosition[];             // 12 houses with cusps
  ascendant: number;                   // Exact degree
  midheaven: number;                   // Exact degree

  // Aspects
  aspects: NatalAspect[];              // Planet-to-planet
  configurations: NatalConfiguration[]; // Patterns (T-Square, etc.)

  // Analysis
  elementalBalance: ElementalAnalysis;
  modalityBalance: ModalityAnalysis;
  hemisphereEmphasis: HemisphereAnalysis;

  // Dignities
  dignities: PlacementDignity[];
}

interface NatalPlacement {
  planetId: string;
  signId: string;
  houseId: string;
  degree: number;                      // Absolute (0-360)
  signDegree: number;                  // Within sign (0-30)
  minute: number;
  retrograde: boolean;

  // Derived
  decanId: string;
  dignityType: DignityType | null;
}
```

### Key Interpretive Elements

| Element | Significance |
|---------|--------------|
| **Sun Sign** | Core identity, ego, life force |
| **Moon Sign** | Emotional nature, instincts, needs |
| **Rising Sign** | Persona, approach to life, physical appearance |
| **Mercury Sign** | Communication, thinking style |
| **Venus Sign** | Love language, values, aesthetics |
| **Mars Sign** | Drive, assertion, sexuality |
| **House Positions** | Life area emphasis for each planet |
| **Aspects** | How planetary energies interact |
| **Elemental Balance** | Fire/Earth/Air/Water distribution |

---

## Human Design Profile Layer

### Profile Structure

```typescript
interface HumanDesignProfile {
  // Core Identity
  type: HumanDesignType;               // Generator, Projector, etc.
  strategy: string;                    // "Wait to respond"
  authority: Authority;                // Sacral, Emotional, etc.
  profile: Profile;                    // 3/5, 4/6, etc.
  definition: Definition;              // Single, Split, etc.

  // The Cross
  incarnationCross: IncarnationCross;

  // Activations
  personalityActivations: GateActivation[];  // 13 conscious
  designActivations: GateActivation[];       // 13 unconscious

  // Body Graph State
  centers: CenterState[];              // 9 centers (defined/undefined)
  channels: ChannelActivation[];       // Active channels
  hangingGates: number[];              // Gates without channel partners

  // Advanced (optional)
  variables?: Variables;               // Four arrows
}

interface GateActivation {
  gateNumber: number;
  line: number;
  planet: string;                      // "sun", "moon", etc.
  conscious: boolean;                  // Personality vs Design
  color?: number;                      // Advanced: 1-6
  tone?: number;                       // Advanced: 1-6
  base?: number;                       // Advanced: 1-5
}

interface CenterState {
  centerId: string;
  defined: boolean;
  gates: number[];                     // Which gates are active
  consistency: string;                 // Description of defined/undefined meaning
}
```

### Body Graph Generation

```typescript
function generateBodyGraph(
  personalityPositions: PlanetaryPosition[],
  designPositions: PlanetaryPosition[]
): HumanDesignProfile {

  // 1. Convert positions to gate activations
  const persActivations = personalityPositions.map(pos =>
    getGateActivation(pos, true)
  );
  const designActivations = designPositions.map(pos =>
    getGateActivation(pos, false)
  );

  // 2. Determine defined centers
  const allGates = [...persActivations, ...designActivations].map(a => a.gateNumber);
  const centers = calculateCenterDefinitions(allGates);

  // 3. Find active channels
  const channels = findActiveChannels(allGates);

  // 4. Derive type from center definitions
  const type = deriveType(centers);

  // 5. Derive authority from center definitions
  const authority = deriveAuthority(centers, type);

  // 6. Derive profile from Sun gates
  const profile = deriveProfile(persActivations, designActivations);

  // 7. Calculate incarnation cross
  const cross = calculateIncarnationCross(persActivations, designActivations);

  return {
    type,
    strategy: getStrategy(type),
    authority,
    profile,
    definition: calculateDefinition(centers),
    incarnationCross: cross,
    personalityActivations: persActivations,
    designActivations,
    centers,
    channels,
    hangingGates: findHangingGates(allGates)
  };
}
```

### Type Determination Logic

```typescript
function deriveType(centers: CenterState[]): HumanDesignType {
  const sacralDefined = centers.find(c => c.centerId === 'sacral')?.defined;
  const throatDefined = centers.find(c => c.centerId === 'throat')?.defined;

  // Check for motor-throat connections
  const motorToThroat = hasMotorToThroatConnection(centers);

  if (!sacralDefined && motorToThroat) {
    return 'Manifestor';
  }

  if (sacralDefined) {
    if (motorToThroat) {
      return 'Manifesting Generator';
    }
    return 'Generator';
  }

  // No sacral defined
  if (centers.some(c => c.defined)) {
    return 'Projector';
  }

  return 'Reflector';  // No centers defined
}
```

---

## Gene Keys Profile Layer

### Profile Structure

```typescript
interface GeneKeysProfile {
  // Activation Sequence
  activationSequence: {
    lifesWork: GeneKeyActivation;      // Conscious Sun
    evolution: GeneKeyActivation;      // Conscious Earth
    radiance: GeneKeyActivation;       // Conscious Sun Line
    purpose: GeneKeyActivation;        // Conscious Earth Line
  };

  // Venus Sequence
  venusSequence: {
    attraction: GeneKeyActivation;     // Conscious Venus
    iq: GeneKeyActivation;             // Design Venus
    eq: GeneKeyActivation;             // Conscious Mars
    sq: GeneKeyActivation;             // Design Mars
    coreWound?: CoreWound;             // Derived from above
  };

  // Pearl Sequence
  pearlSequence: {
    vocation: GeneKeyActivation;       // North Node
    culture: GeneKeyActivation;        // South Node
    brand: GeneKeyActivation;          // Conscious Jupiter
    pearl: GeneKeyActivation;          // Design Jupiter
  };

  // All Activations (for reference)
  allActivations: GeneKeyActivation[];

  // Shadow Work Focus
  primaryShadows: GeneKey[];           // Most significant shadows

  // Programming Partner Pairs
  programmingPairs: ProgrammingPair[];
}

interface GeneKeyActivation {
  geneKeyNumber: number;
  line: number;
  planet: string;
  conscious: boolean;
  sphere: string;                      // Which Golden Path sphere

  // Content references
  shadow: string;
  gift: string;
  siddhi: string;
}

interface ProgrammingPair {
  key1: number;
  key2: number;
  relationship: string;
  integrationTheme: string;
}
```

### Golden Path Calculation

```typescript
function calculateGoldenPath(
  personalityPositions: PlanetaryPosition[],
  designPositions: PlanetaryPosition[]
): GeneKeysProfile {

  const findActivation = (planet: string, conscious: boolean): GeneKeyActivation => {
    const positions = conscious ? personalityPositions : designPositions;
    const pos = positions.find(p => p.planet === planet);
    if (!pos) throw new Error(`Missing ${planet} position`);

    const { key, line } = getGeneKeyForDegree(pos.absoluteDegree);
    const gk = geneKeysData[key];

    return {
      geneKeyNumber: key,
      line,
      planet,
      conscious,
      sphere: getSphereForPlanet(planet, conscious),
      shadow: gk.shadow.name,
      gift: gk.gift.name,
      siddhi: gk.siddhi.name
    };
  };

  return {
    activationSequence: {
      lifesWork: findActivation('sun', true),
      evolution: findActivation('earth', true),
      radiance: findActivation('sun', true),  // Same key, line focus
      purpose: findActivation('earth', true)   // Same key, line focus
    },
    venusSequence: {
      attraction: findActivation('venus', true),
      iq: findActivation('venus', false),
      eq: findActivation('mars', true),
      sq: findActivation('mars', false)
    },
    pearlSequence: {
      vocation: findActivation('northNode', true),
      culture: findActivation('southNode', true),
      brand: findActivation('jupiter', true),
      pearl: findActivation('jupiter', false)
    },
    allActivations: [...],
    primaryShadows: [...],
    programmingPairs: [...]
  };
}
```

---

## Cross-System Synthesis

### Unified View Opportunities

| Synthesis Point | Systems | Insight |
|-----------------|---------|---------|
| **Sun Gate/Key** | All three | Core creative identity |
| **Earth Gate/Key** | HD + GK | Grounding/evolution |
| **Type + Rising** | HD + Astro | Energy + approach |
| **Authority + Moon** | HD + Astro | Decision + emotion |
| **Life's Work + MC** | GK + Astro | Purpose + calling |
| **Nodal Keys + Nodes** | GK + Astro | Destiny direction |

### Synthesis Schema

```typescript
interface ProfileSynthesis {
  // Core Identity Theme
  coreIdentity: {
    summary: string;
    astroSun: string;
    hdType: string;
    gkLifesWork: string;
    unifiedMessage: string;
  };

  // Decision Making
  decisionMaking: {
    hdAuthority: string;
    astroMoon: string;
    gkEQ: string;
    guidance: string;
  };

  // Life Purpose
  lifePurpose: {
    astroMC: string;
    hdCross: string;
    gkPearl: string;
    synthesis: string;
  };

  // Relationships
  relationships: {
    astroVenus: string;
    hdDefinition: string;
    gkVenusSeq: string;
    synthesis: string;
  };

  // Shadow Work Priorities
  shadowWork: {
    primaryPatterns: string[];
    integrationPath: string;
  };

  // Key Themes
  keyThemes: string[];

  // AI-Generated Narrative (optional)
  aiNarrative?: string;
}
```

### Cross-Reference Display

```typescript
interface CrossReference {
  position: string;              // "Sun at 15° Pisces"

  astrology: {
    sign: string;               // "Pisces"
    house: string;              // "10th House"
    aspects: string[];          // ["Trine Moon", "Square Mars"]
    interpretation: string;
  };

  humanDesign: {
    gate: number;               // 36
    line: number;               // 4
    center: string;             // "Solar Plexus"
    circuit: string;            // "Collective Abstract"
    interpretation: string;
  };

  geneKeys: {
    key: number;                // 36
    line: number;               // 4
    shadow: string;             // "Turbulence"
    gift: string;               // "Humanity"
    siddhi: string;             // "Compassion"
    sphere: string;             // "Life's Work" (if applicable)
    interpretation: string;
  };

  synthesis: string;            // Unified interpretation
}
```

---

## Interactive Dashboard Design

### Main Profile Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  MY COSMIC PROFILE                              [Edit] [Share]  │
│  Born: March 15, 1985 at 14:30 in São Paulo, Brazil            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    CORE IDENTITY                         │   │
│  │                                                          │   │
│  │  "You are a creative visionary with the power to        │   │
│  │   transmute emotional turbulence into compassionate     │   │
│  │   service for humanity..."                               │   │
│  │                                                          │   │
│  │  ☉ Pisces Sun • Generator • Gene Key 36 (Humanity)      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │  ASTROLOGY  │ │HUMAN DESIGN │ │  GENE KEYS  │              │
│  │  [View →]   │ │  [View →]   │ │  [View →]   │              │
│  │             │ │             │ │             │              │
│  │ ♓ Pisces   │ │ Generator   │ │ Key 36.4    │              │
│  │  Rising    │ │  Sacral     │ │ Turbulence  │              │
│  │ ♏ Scorpio  │ │  Authority  │ │    ↓        │              │
│  │  Moon      │ │             │ │ Humanity    │              │
│  │             │ │ 3/5 Profile │ │    ↓        │              │
│  │             │ │             │ │ Compassion  │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                        DEEP DIVES                               │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐     │
│  │ Natal Wheel    │ │ Body Graph     │ │ Golden Path    │     │
│  │ [Interactive]  │ │ [Interactive]  │ │ [Interactive]  │     │
│  │                │ │                │ │                │     │
│  │    [wheel]     │ │   [bodygraph]  │ │   [sequence]   │     │
│  │                │ │                │ │                │     │
│  └────────────────┘ └────────────────┘ └────────────────┘     │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                     EXPLORE PLACEMENTS                          │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ☉ Sun in Pisces (10th) • Gate 36.4 • Gene Key 36      │   │
│  │     "Emotional depth finding expression through work"   │   │
│  │     [Explore Full Interpretation →]                      │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  ☽ Moon in Scorpio (6th) • Gate 50.2 • Gene Key 50     │   │
│  │     "Deep emotional intelligence in service"            │   │
│  │     [Explore Full Interpretation →]                      │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  ASC Pisces Rising • Gate 55.1 • Gene Key 55           │   │
│  │     "Approaching life through emotional freedom"        │   │
│  │     [Explore Full Interpretation →]                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   AI CONTEMPLATION                       │   │
│  │                                                          │   │
│  │  "Based on your Gene Key 36 in your Life's Work         │   │
│  │   position, you may be contemplating how emotional      │   │
│  │   experiences become the raw material for your          │   │
│  │   contribution to humanity..."                           │   │
│  │                                                          │   │
│  │  [Begin Guided Contemplation →]                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Placement Detail View

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back to Profile                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│          ☉ SUN PLACEMENT                                        │
│          15° Pisces • 10th House                                │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  TABS: [Astrology] [Human Design] [Gene Keys] [Unified] │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ╔═══════════════════════════════════════════════════════════╗ │
│  ║  ASTROLOGY VIEW                                            ║ │
│  ╠═══════════════════════════════════════════════════════════╣ │
│  ║                                                            ║ │
│  ║  Sign: Pisces ♓                                           ║ │
│  ║  "The dreamer, mystic, and compassionate soul"            ║ │
│  ║                                                            ║ │
│  ║  House: 10th House (Career, Public Life, Calling)         ║ │
│  ║  "Your creative essence seeks expression through          ║ │
│  ║   your public role and life's work..."                    ║ │
│  ║                                                            ║ │
│  ║  Decan: Pisces II (ruled by Moon)                         ║ │
│  ║  "Heightened emotional sensitivity and intuition"         ║ │
│  ║                                                            ║ │
│  ║  Aspects:                                                  ║ │
│  ║  • Trine Moon (120°) - Emotional harmony                  ║ │
│  ║  • Square Mars (90°) - Creative tension                   ║ │
│  ║  • Sextile Neptune (60°) - Spiritual attunement          ║ │
│  ║                                                            ║ │
│  ╚═══════════════════════════════════════════════════════════╝ │
│                                                                 │
│  ╔═══════════════════════════════════════════════════════════╗ │
│  ║  HUMAN DESIGN VIEW                                         ║ │
│  ╠═══════════════════════════════════════════════════════════╣ │
│  ║                                                            ║ │
│  ║  Gate 36 - The Gate of Crisis                             ║ │
│  ║  Line 4 - The Agent                                        ║ │
│  ║                                                            ║ │
│  ║  Center: Solar Plexus (Emotional Awareness)               ║ │
│  ║  Circuit: Collective Abstract (Experience/Feeling)        ║ │
│  ║                                                            ║ │
│  ║  "This is the gate of emotional depth and the             ║ │
│  ║   capacity to move through crisis with grace..."          ║ │
│  ║                                                            ║ │
│  ║  Channel Connection: 36-35 (Channel of Transitoriness)   ║ │
│  ║  [Status: Hanging Gate - waiting for 35]                  ║ │
│  ║                                                            ║ │
│  ╚═══════════════════════════════════════════════════════════╝ │
│                                                                 │
│  ╔═══════════════════════════════════════════════════════════╗ │
│  ║  GENE KEYS VIEW                                            ║ │
│  ╠═══════════════════════════════════════════════════════════╣ │
│  ║                                                            ║ │
│  ║  Gene Key 36 - The Key of Humanity                        ║ │
│  ║  Line 4 - The Network                                      ║ │
│  ║                                                            ║ │
│  ║  ┌─────────────────────────────────────────────────────┐  ║ │
│  ║  │  SHADOW          GIFT            SIDDHI             │  ║ │
│  ║  │  Turbulence  →   Humanity    →   Compassion         │  ║ │
│  ║  │                                                      │  ║ │
│  ║  │  Emotional       The capacity    Universal love     │  ║ │
│  ║  │  upheaval and    to embrace      that embraces      │  ║ │
│  ║  │  crisis          all human       all suffering      │  ║ │
│  ║  │                  experience                          │  ║ │
│  ║  └─────────────────────────────────────────────────────┘  ║ │
│  ║                                                            ║ │
│  ║  Golden Path Position: LIFE'S WORK                        ║ │
│  ║  "This key defines how you express your genius            ║ │
│  ║   through your work in the world..."                      ║ │
│  ║                                                            ║ │
│  ║  Codon Ring: Ring of Divinity                             ║ │
│  ║  Programming Partner: Gene Key 6                          ║ │
│  ║                                                            ║ │
│  ╚═══════════════════════════════════════════════════════════╝ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Interactive Navigation

| Interaction | Result |
|-------------|--------|
| Click planet in wheel | Opens placement detail with all three views |
| Click gate in body graph | Opens gate detail with Gene Key |
| Click sphere in Golden Path | Opens Gene Key contemplation |
| Hover relationship line | Shows connection interpretation |
| Toggle view mode | Switch between Astro/HD/GK focus |

---

## AI Integration Features

### Personalized Contemplations

```typescript
interface AIContemplation {
  // Context
  focusEntity: string;                 // "gene-key-36"
  profileContext: CosmicProfile;       // Full profile for context

  // Generated content
  contemplationPrompt: string;         // Opening question
  journalPrompts: string[];            // Writing prompts
  meditationGuidance: string;          // Brief meditation
  affirmation: string;                 // Daily affirmation
  practicalApplication: string;        // How to apply today

  // Timing
  generatedAt: Date;
  validUntil: Date;                    // Regenerate after
}
```

### AI Synthesis Narrative

```typescript
async function generateProfileNarrative(profile: CosmicProfile): Promise<string> {
  const prompt = `
    Based on this cosmic profile, generate a 2-3 paragraph narrative
    that weaves together insights from astrology, Human Design, and
    Gene Keys. Use invitational language and focus on:

    1. Core identity and creative expression
    2. Decision-making guidance
    3. Life purpose themes

    Profile data:
    - Sun: ${profile.astrology.placements.sun} | Gate ${profile.humanDesign.personalityActivations.sun.gate} | GK ${profile.geneKeys.activationSequence.lifesWork.geneKeyNumber}
    - Type: ${profile.humanDesign.type}
    - Authority: ${profile.humanDesign.authority}
    - Profile: ${profile.humanDesign.profile}
    - Golden Path themes: ${summarizeGoldenPath(profile.geneKeys)}

    Write in second person, warm but not effusive.
  `;

  return await claude.generate(prompt);
}
```

### Contemplation Chamber Integration

```
┌─────────────────────────────────────────────────────────────────┐
│  CONTEMPLATION CHAMBER                            [Gene Key 36] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  TODAY'S CONTEMPLATION                                   │   │
│  │                                                          │   │
│  │  "Gene Key 36 sits in your Life's Work position,        │   │
│  │   suggesting that your vocation involves transforming   │   │
│  │   the turbulence of human emotional experience into     │   │
│  │   something that serves humanity."                       │   │
│  │                                                          │   │
│  │  ─────────────────────────────────────────────────────   │   │
│  │                                                          │   │
│  │  CONTEMPLATION QUESTION:                                 │   │
│  │                                                          │   │
│  │  "Where in your life are you currently experiencing     │   │
│  │   emotional turbulence? How might this turbulence be    │   │
│  │   preparing you to offer something meaningful to        │   │
│  │   others who face similar challenges?"                   │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  JOURNAL SPACE                                           │   │
│  │                                                          │   │
│  │  [                                                   ]   │   │
│  │  [                                                   ]   │   │
│  │  [                                                   ]   │   │
│  │                                                          │   │
│  │  [Save Entry]  [Generate Follow-Up]  [Share Insight]    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  RELATED PRACTICES                                       │   │
│  │                                                          │   │
│  │  • Shadow Work: Exploring Turbulence patterns           │   │
│  │  • Gift Activation: Cultivating Humanity                │   │
│  │  • Meditation: Compassion visualization                  │   │
│  │  • Daily Practice: Notice one moment of turbulence      │   │
│  │                    and consciously choose humanity       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Roadmap

### Phase 1: Birth Data Infrastructure

- [ ] Birth data input form with validation
- [ ] Location search/geocoding integration
- [ ] Timezone handling
- [ ] Local storage for profile persistence
- [ ] Export/import profile data (JSON)

### Phase 2: Ephemeris Integration

- [ ] Swiss Ephemeris WASM setup
- [ ] Planetary position calculation
- [ ] Design calculation (88° prior)
- [ ] House cusp calculation
- [ ] Aspect calculation

### Phase 3: Astrology Profile

- [ ] Generate natal placements
- [ ] Calculate aspects and orbs
- [ ] Detect configurations
- [ ] Elemental/modality analysis
- [ ] Dignity assignment
- [ ] Profile display component

### Phase 4: Human Design Profile

- [ ] Gate/line derivation from degrees
- [ ] Center definition calculation
- [ ] Channel activation detection
- [ ] Type/Authority/Profile derivation
- [ ] Body graph SVG rendering
- [ ] Interactive body graph component

### Phase 5: Gene Keys Profile

- [ ] Gene Key/line derivation from degrees
- [ ] Golden Path sphere assignment
- [ ] Activation sequence compilation
- [ ] Venus sequence compilation
- [ ] Pearl sequence compilation
- [ ] Golden Path visualization

### Phase 6: Integration Layer

- [ ] Unified profile data structure
- [ ] Cross-reference generation
- [ ] Synthesis narratives
- [ ] Placement detail pages
- [ ] Navigation between systems

### Phase 7: AI Features

- [ ] Claude API integration
- [ ] Profile narrative generation
- [ ] Contemplation prompt generation
- [ ] Journal integration
- [ ] Follow-up conversation

### Phase 8: Polish & Extras

- [ ] Transit overlay
- [ ] Comparison (synastry)
- [ ] PDF export
- [ ] Sharing features
- [ ] Mobile optimization

---

## Technical Considerations

### Performance

- **Ephemeris**: Calculate once, cache in profile
- **Rendering**: Lazy load detail views
- **AI**: Stream responses for long narratives
- **Storage**: IndexedDB for local persistence

### Privacy

- **Local-first**: All data stored on device
- **No account required**: Anonymous by default
- **Export control**: User owns their data
- **AI opt-in**: AI features require consent

### Accessibility

- **Color contrast**: Ensure readability
- **Screen readers**: Describe visualizations
- **Keyboard nav**: Full keyboard support
- **Reduced motion**: Respect preferences

---

## Appendix: Data Flow Diagram

```
                              USER INPUT
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
            ┌──────────────┐           ┌──────────────┐
            │  Birth Date  │           │  Birth Time  │
            │  & Location  │           │  (optional)  │
            └──────┬───────┘           └──────┬───────┘
                   │                          │
                   └──────────┬───────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   EPHEMERIS     │
                    │   CALCULATION   │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
      ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
      │ ASTROLOGY   │ │ HUMAN       │ │ GENE KEYS   │
      │ CALCULATOR  │ │ DESIGN CALC │ │ CALCULATOR  │
      └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
             │               │               │
             ▼               ▼               ▼
      ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
      │ Placements  │ │ Body Graph  │ │ Golden Path │
      │ Aspects     │ │ Type        │ │ Sequences   │
      │ Houses      │ │ Authority   │ │ Activations │
      └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
             │               │               │
             └───────────────┼───────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    SYNTHESIS    │
                    │    ENGINE       │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
      ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
      │ Cross-Refs  │ │ Narratives  │ │ Contempl.   │
      │ & Links     │ │ & Insights  │ │ Prompts     │
      └─────────────┘ └─────────────┘ └─────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   USER PROFILE  │
                    │   DASHBOARD     │
                    └─────────────────┘
```

---

*Document Version: 1.0*
*Last Updated: January 2026*
*Part of Cosmic Copilot Planning Documentation*
