# Cosmic Copilot: Astrology System Plan

> A comprehensive document detailing the current implementation status and future roadmap for the Astrology component of the Cosmic Copilot wisdom platform.

---

## Table of Contents

1. [Vision & Philosophy](#vision--philosophy)
2. [Current Implementation Status](#current-implementation-status)
3. [Data Architecture](#data-architecture)
4. [UI Components & Pages](#ui-components--pages)
5. [Feature Roadmap](#feature-roadmap)
6. [Integration Points](#integration-points)

---

## Vision & Philosophy

The Astrology module serves as the **foundational pillar** of the Cosmic Copilot platform—a "digital temple for self-discovery" bridging ancient wisdom with modern technology. The system embraces several core principles:

### Guiding Principles

1. **Invitational Language**: Use "This energy invites..." rather than deterministic "You ARE..."
2. **Gift/Shadow Duality**: Every placement contains both gift expressions and shadow potentials
3. **Holistic View**: Everyone contains all 12 signs—prominence varies by placement
4. **Structural Clarity**: Houses = WHERE (life areas), Signs = HOW (energy expression)
5. **Hierarchy of Importance**: The "Big Four" (Sun, Moon, Rising, Mercury) are most significant for identity

---

## Current Implementation Status

### COMPLETE: Foundation Phase

#### Entity Data (100% Complete)

| Entity Type | Count | Status | Data Quality |
|-------------|-------|--------|--------------|
| **Planets** | 10 | Complete | Rich (archetype, gift/shadow, contemplations) |
| **Zodiac Signs** | 12 | Complete | Rich (modality, element, opposing sign, decans) |
| **Houses** | 12 | Complete | Rich (archetypal names, life areas, questions) |
| **Elements** | 7 | Complete | Rich (4 classical + 3 alchemical + aether) |
| **Aspects** | 10 | Complete | Rich (angle, orb, nature, integration) |
| **Configurations** | 8 | Complete | Rich (pattern geometry, required aspects) |
| **Decans** | 36 | Complete | Rich (rulers, keywords, gift/shadow) |
| **Dignities** | 60+ | Complete | Complete dignity matrix |
| **Astro Points** | 9 | Complete | Rich (nodes, Lilith, Chiron, angles) |
| **Fixed Stars** | 2+ | Partial | Royal stars documented |

#### Type System (100% Complete)

- `EntityType` discriminated union covering all 9+ entity types
- `AstroEntity` base interface with comprehensive fields
- Entity-specific interfaces (Planet, ZodiacSign, House, etc.)
- Personal chart types (AstroProfile, NatalPlacement, NatalAspect)
- Relationship type definitions (19 relationship categories)

#### Data Access Layer (100% Complete)

- Type-safe Maps for all entity collections
- Universal `getEntityById()` lookup
- Dignity lookup utilities
- Decan retrieval by sign/degree
- Relationship traversal utilities
- Sign/Element grouping functions

#### UI Foundation (100% Complete)

- Element-based color theming (Fire/Earth/Air/Water scales)
- Responsive navigation structure
- EntityCard component with dynamic styling
- Layout shell with comparison tray
- Page transitions and animations

---

### COMPLETE: Visual Navigation Phase

| Feature | Status | Implementation |
|---------|--------|----------------|
| **Celestial Mandala** | Complete | D3.js wheel visualization |
| **Search/Filter** | Complete | Global search across entities |
| **Element Realms** | Complete | Element-themed exploration |
| **Breadcrumb Navigation** | Complete | Trail navigation |

---

### COMPLETE: Knowledge Library Phase

| Page | Status | Features |
|------|--------|----------|
| **Planets Browser** | Complete | Grid view, importance indicators |
| **Planet Detail** | Complete | Full archetype, gift/shadow, questions |
| **Signs Browser** | Complete | Grid with element coloring |
| **Sign Detail** | Complete | Modality, element, decans, oppositions |
| **Houses Browser** | Complete | List with archetypal names |
| **House Detail** | Complete | Life areas, ruling planets/signs |
| **Elements Browser** | Complete | Classical + alchemical elements |
| **Element Detail** | Complete | Modality expressions, balancing practices |
| **Aspects Browser** | Complete | Geometric patterns, nature types |
| **Aspect Detail** | Complete | Integration practices |
| **Decan Dive** | Complete | 36 decans with filters |
| **Dignity Matrix** | Complete | Planet-sign strength grid |
| **Configuration Gallery** | Complete | 8 aspect patterns |

---

### PARTIAL: Relationships Phase

| Feature | Status | Notes |
|---------|--------|-------|
| **Constellation Graph** | Complete | Force-directed D3.js visualization |
| **Connection Highlighting** | Partial | Basic highlighting implemented |
| **Relationship Traversal** | Partial | Data layer ready, UI needs work |

---

### PARTIAL: Deep Exploration Phase

| Feature | Status | Notes |
|---------|--------|-------|
| **Aspect Weaver** | Complete | Geometric visualization |
| **Contemplation Chamber** | Complete | Guided reflection UI |
| **Compare View** | Complete | Side-by-side entity comparison |

---

### IN PROGRESS: Personal Profile Phase

| Feature | Status | Notes |
|---------|--------|-------|
| **Profile Context** | Complete | State management ready |
| **Birth Data Entry** | Partial | Basic form, needs location/time |
| **Chart Display** | Partial | Placements shown, wheel incomplete |
| **Elemental Analysis** | Complete | Fire/Earth/Air/Water balance |
| **Aspect Calculation** | Partial | Data structure ready |

---

### PLANNED: AI Integration Phase

| Feature | Status | Notes |
|---------|--------|-------|
| **Contemplation AI** | Planned | Claude API integration |
| **Cosmic Counselor** | Planned | Interactive AI guidance |
| **Dynamic Interpretations** | Planned | AI-generated insights |

---

## Data Architecture

### Directory Structure

```
src/data/universal/
├── planets.json         # 10 entities (~2,600 lines)
├── signs.json           # 12 entities (~900 lines)
├── houses.json          # 12 entities (~400 lines)
├── elements.json        # 7 entities (~600 lines)
├── aspects.json         # 10 entities (~500 lines)
├── configurations.json  # 8 entities (~400 lines)
├── points.json          # 9 astro points (~500 lines)
├── dignities.json       # 60+ dignity relationships
├── decans.json          # 36 decans with rulers
├── fixed-stars.json     # Royal stars + others
└── relationships.json   # 84+ graph edges
```

### Entity Schema Pattern

Each entity follows a consistent pattern:

```typescript
interface AstroEntity {
  id: string;           // Unique identifier (e.g., "sun", "aries")
  type: EntityType;     // Discriminated type
  name: string;         // Display name
  symbol: string;       // Astrological glyph
  image?: string;       // Visual asset path
  description: string;  // Core description
}
```

Extended fields vary by entity type (see `src/types/index.ts`).

### Relationship Graph

The `relationships.json` file defines graph edges:

```typescript
interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  relationshipType: RelationshipType;
  description?: string;
}
```

**Relationship Types (19 total):**
- RULES, HAS_ELEMENT, HAS_ALCHEMICAL_ELEMENT
- OPPOSES, HOUSE_RULED_BY_SIGN, HOUSE_RULED_BY_PLANET
- ENERGIZES, FLOWS_WITH, CHALLENGES
- CONTAINS_DECAN, HAS_DIGNITY, ASPECTS
- And more...

---

## UI Components & Pages

### Core Components

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| `Layout.tsx` | App shell | Navigation, comparison tray |
| `EntityCard.tsx` | Entity display | Element-based coloring |
| `SearchBar.tsx` | Global search | Cross-entity search |
| `CelestialMandala.tsx` | Wheel viz | D3.js interactive |
| `ConstellationGraph.tsx` | Network viz | Force-directed graph |
| `ComparisonTray.tsx` | Compare entities | Side-by-side view |

### Route Structure

```
/                       # Home - Feature categories
/profile                # Personal natal chart
/wheel                  # Celestial mandala
/graph                  # Constellation network

/explore/aspect-weaver  # Aspect geometry
/explore/elements       # Element realms
/explore/contemplation  # Guided reflection
/explore/compare        # Entity comparison

/library/planets        # Planet browser
/library/planets/:id    # Planet detail
/library/signs          # Sign browser
/library/signs/:id      # Sign detail
/library/houses         # House browser
/library/houses/:id     # House detail
/library/elements       # Element browser
/library/elements/:id   # Element detail
/library/aspects        # Aspect browser
/library/aspects/:id    # Aspect detail
/library/dignities      # Dignity matrix
/library/decans         # Decan dive
/library/configurations # Configuration gallery
```

---

## Feature Roadmap

### Phase 5: Personal Profile Enhancement

**Objective**: Complete the personal chart experience

- [ ] Birth time/location input with timezone handling
- [ ] Ephemeris integration for accurate calculations
- [ ] Full natal wheel rendering with house cusps
- [ ] Aspect grid visualization
- [ ] Configuration detection in personal chart
- [ ] Decan placement display
- [ ] Dignity indicators for each placement

### Phase 6: Advanced Chart Features

**Objective**: Expand chart capabilities

- [ ] Transits overlay (current sky vs. natal)
- [ ] Progressions (secondary, solar arc)
- [ ] Solar/lunar return charts
- [ ] Synastry (relationship chart comparison)
- [ ] Composite charts
- [ ] Chart rectification tools

### Phase 7: AI Integration

**Objective**: Bring Claude-powered wisdom to the experience

- [ ] Contemplation Chamber AI responses
- [ ] Placement interpretation generation
- [ ] Aspect synthesis narratives
- [ ] Cosmic Counselor chat interface
- [ ] Personal growth recommendations
- [ ] Transit interpretation assistance

### Phase 8: Export & Sharing

**Objective**: Enable users to save and share

- [ ] PDF chart generation
- [ ] Image export (wheel, aspects)
- [ ] Shareable chart links
- [ ] User accounts and persistence
- [ ] Chart history/comparison

---

## Integration Points

### With Human Design

The Astrology module connects to Human Design through:

1. **Zodiac Position Mapping**: Each HD Gate corresponds to specific zodiac degrees
2. **Planetary Placements**: Birth chart planets activate specific gates
3. **Incarnation Cross**: Derived from Sun/Earth positions at birth and 88° prior

### With Gene Keys

The Astrology module connects to Gene Keys through:

1. **64 Gene Keys = 64 I Ching Hexagrams = Zodiac Arc Segments**
2. **Each 5.625° of zodiac = One Gene Key**
3. **Planetary positions activate specific Gene Keys**
4. **Golden Path derived from natal positions**

### Data Flow

```
Birth Data (Date/Time/Location)
    ↓
Ephemeris Calculation
    ↓
┌─────────────────┬─────────────────┬─────────────────┐
│   Astrology     │  Human Design   │    Gene Keys    │
│   Placements    │   Body Graph    │   Activations   │
└─────────────────┴─────────────────┴─────────────────┘
    ↓                   ↓                   ↓
              Integrated Profile View
                        ↓
              AI-Powered Insights
```

---

## Technical Considerations

### Chart Calculation Options

1. **Swiss Ephemeris (swisseph)**: Industry standard, high accuracy
2. **Astronomia**: JavaScript astronomy library
3. **External API**: AstroSeek, Astro.com APIs
4. **Pre-calculated Tables**: For basic accuracy

### Recommended Approach

Use a combination:
- Swiss Ephemeris via WASM for core calculations
- Pre-calculated data for quick lookups
- API fallback for edge cases

---

## Metrics & Success Criteria

### Data Completeness
- [x] All 10 planets with full metadata
- [x] All 12 signs with full metadata
- [x] All 12 houses with full metadata
- [x] All 36 decans documented
- [x] All essential dignities mapped
- [x] All 10 aspect types defined
- [x] All 8 configurations defined
- [ ] All fixed stars catalogued
- [ ] Historical/cultural variations

### User Experience
- [x] Intuitive navigation structure
- [x] Element-based visual theming
- [x] Mobile-responsive design
- [ ] Accessibility audit (WCAG)
- [ ] Performance optimization
- [ ] Offline capability

### Integration Readiness
- [x] Type-safe data layer
- [x] Relationship graph structure
- [x] Profile context management
- [ ] API abstraction layer
- [ ] Cross-system entity mapping

---

## Appendix: Entity Counts

| Category | Count | Notes |
|----------|-------|-------|
| Planets | 10 | Traditional + Modern |
| Astro Points | 9 | Nodes, Lilith, Chiron, angles |
| Signs | 12 | Complete zodiac |
| Houses | 12 | Whole sign system |
| Elements | 7 | 4 classical + 3 alchemical |
| Decans | 36 | 3 per sign |
| Aspects | 10 | Major + minor |
| Configurations | 8 | Multi-planet patterns |
| Dignities | 60+ | Essential dignities |
| Relationships | 84+ | Graph edges |

**Total Entities**: ~230+ unique data points

---

*Document Version: 1.0*
*Last Updated: January 2026*
*Part of Cosmic Copilot Planning Documentation*
