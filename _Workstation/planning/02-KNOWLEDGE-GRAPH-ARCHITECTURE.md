# Cosmic Copilot: Knowledge Graph Architecture

> A comprehensive document defining the data structure and architecture for the unified wisdom knowledge graph spanning Astrology, Human Design, and Gene Keys.

---

## Table of Contents

1. [Vision & Requirements](#vision--requirements)
2. [Knowledge Graph Fundamentals](#knowledge-graph-fundamentals)
3. [Unified Entity Schema](#unified-entity-schema)
4. [Relationship Taxonomy](#relationship-taxonomy)
5. [Storage Options Analysis](#storage-options-analysis)
6. [Recommended Architecture](#recommended-architecture)
7. [Implementation Strategy](#implementation-strategy)
8. [Frontend Considerations](#frontend-considerations)

---

## Vision & Requirements

### Core Challenge

Three ancient wisdom traditions—Astrology, Human Design, and Gene Keys—share deep interconnections through the I Ching, zodiac, and planetary positions. The challenge is to create a unified data structure that:

1. **Preserves tradition-specific richness** without flattening unique concepts
2. **Exposes cross-system relationships** naturally and navigably
3. **Supports personal profile overlays** (birth chart → body graph → golden path)
4. **Enables AI-powered synthesis** and interpretation
5. **Scales gracefully** as content expands

### Key Connections

```
┌─────────────────────────────────────────────────────────────────┐
│                        I CHING (64 Hexagrams)                   │
└─────────────────────────────────────────────────────────────────┘
         ↓                        ↓                        ↓
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    ASTROLOGY    │    │  HUMAN DESIGN   │    │    GENE KEYS    │
│                 │    │                 │    │                 │
│ • 12 Signs      │    │ • 64 Gates      │    │ • 64 Keys       │
│ • 360° Zodiac   │    │ • 36 Channels   │    │ • 21 Codon Rings│
│ • 10 Planets    │    │ • 9 Centers     │    │ • Amino Acids   │
│ • 12 Houses     │    │ • 6 Circuits    │    │ • Shadow/Gift/  │
│ • 36 Decans     │    │ • 5 Types       │    │   Siddhi        │
│                 │    │ • 12 Profiles   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ↓                        ↓                        ↓
         └────────────────────────┼────────────────────────┘
                                  ↓
                    ┌─────────────────────────┐
                    │    ZODIAC ARC MAPPING   │
                    │                         │
                    │  Each 5.625° segment =  │
                    │  1 Gate = 1 Gene Key    │
                    │                         │
                    │  Planets at degrees →   │
                    │  Activate specific      │
                    │  Gates/Keys             │
                    └─────────────────────────┘
```

---

## Knowledge Graph Fundamentals

### Why a Knowledge Graph?

A knowledge graph is ideal for this domain because:

1. **Natural Relationship Modeling**: Wisdom traditions are inherently relational
2. **Flexible Schema**: Can accommodate varying entity structures
3. **Traversal Queries**: "Find all concepts connected to Gate 1"
4. **Pattern Discovery**: Uncover implicit connections
5. **AI Enhancement**: LLMs excel at graph-structured knowledge

### Graph Components

```
NODES (Entities)          EDGES (Relationships)        PROPERTIES
├── Planet               ├── RULES                    ├── name
├── Sign                 ├── HAS_ELEMENT              ├── symbol
├── House                ├── OPPOSES                  ├── description
├── Element              ├── CORRESPONDS_TO           ├── shadow
├── Aspect               ├── ACTIVATES                ├── gift
├── Decan                ├── CONTAINS                 ├── siddhi
├── Gate                 ├── CONNECTS_TO              ├── keywords
├── Channel              ├── BELONGS_TO_CIRCUIT       ├── archetype
├── Center               ├── PART_OF_RING             ├── etc.
├── GeneKey              ├── ENCODES_AMINO_ACID       │
├── CodonRing            ├── PROGRAMS                 │
├── AminoAcid            ├── FLOWS_TO                 │
└── Profile              └── HARMONIZES_WITH          │
```

---

## Unified Entity Schema

### Base Entity Interface

```typescript
/**
 * Universal base for all wisdom entities across traditions
 */
interface WisdomEntity {
  // Core Identity
  id: string;                    // Unique identifier
  tradition: Tradition;          // 'astrology' | 'human-design' | 'gene-keys' | 'universal'
  entityType: EntityType;        // Specific type within tradition

  // Display
  name: string;
  symbol?: string;               // Glyph or icon reference
  keywords: string[];

  // Content
  description: string;
  archetype?: string;

  // Gift/Shadow Duality (universal pattern)
  giftExpression?: string;
  shadowExpression?: string;

  // Contemplation
  contemplationQuestions?: string[];
  affirmations?: string[];

  // Cross-references
  correspondences?: Correspondence[];

  // Metadata
  sourceReferences?: string[];
  lastUpdated?: string;
}

type Tradition = 'astrology' | 'human-design' | 'gene-keys' | 'harmonics' | 'universal';
```

### Tradition-Specific Extensions

#### Astrology Entities

```typescript
interface AstrologyPlanet extends WisdomEntity {
  tradition: 'astrology';
  entityType: 'planet';

  planetType: 'traditional' | 'modern' | 'key-point';
  importance: 1 | 2 | 3 | 4;
  cycleDuration: string;
  signsRuled: string[];
  functionAndMeaning: string;
}

interface AstrologySign extends WisdomEntity {
  tradition: 'astrology';
  entityType: 'sign';

  orderInZodiac: number;        // 1-12
  dateRange: string;
  modality: 'cardinal' | 'fixed' | 'mutable';
  elementId: string;
  rulingPlanetIds: string[];
  opposingSignId: string;
  decanIds: string[];
  degreeStart: number;          // 0, 30, 60, etc.
  degreeEnd: number;
}

interface AstrologyDecan extends WisdomEntity {
  tradition: 'astrology';
  entityType: 'decan';

  signId: string;
  decanNumber: 1 | 2 | 3;
  degreeStart: number;
  degreeEnd: number;
  rulerPlanetId: string;

  // Cross-system mapping
  gateIds: string[];            // Which HD gates fall in this decan
  geneKeyIds: string[];         // Which Gene Keys fall in this decan
}
```

#### Human Design Entities

```typescript
interface HumanDesignGate extends WisdomEntity {
  tradition: 'human-design';
  entityType: 'gate';

  number: number;               // 1-64
  centerId: string;
  circuitId: string;
  channelIds: string[];         // Gates this connects to via channels

  // I Ching correspondence
  hexagram: string;
  hexagramName: string;

  // Zodiac mapping
  zodiacSign: string;
  degreeStart: number;
  degreeEnd: number;

  // Lines
  lines: GateLine[];

  // Cross-system
  geneKeyId: string;            // Always matches gate number
  programmingPartner: number;   // Opposite gate (n ± 32)
}

interface HumanDesignChannel extends WisdomEntity {
  tradition: 'human-design';
  entityType: 'channel';

  gateIds: [string, string];    // The two gates that form this channel
  centerIds: [string, string];  // The two centers connected
  circuitId: string;

  type: 'generated' | 'projected' | 'manifested';
}

interface HumanDesignCenter extends WisdomEntity {
  tradition: 'human-design';
  entityType: 'center';

  centerType: 'motor' | 'awareness' | 'pressure' | 'identity' | 'communication';
  gateIds: string[];

  definedMeaning: string;
  undefinedMeaning: string;
  notSelfTheme: string;
}

interface HumanDesignCircuit extends WisdomEntity {
  tradition: 'human-design';
  entityType: 'circuit';

  circuitGroup: 'individual' | 'collective' | 'tribal';
  theme: string;
  gateIds: string[];
  channelIds: string[];
}
```

#### Gene Keys Entities

```typescript
interface GeneKey extends WisdomEntity {
  tradition: 'gene-keys';
  entityType: 'gene-key';

  number: number;               // 1-64

  // Core framework
  shadow: {
    name: string;
    description: string;
    repressivePattern?: string;
    reactivePattern?: string;
  };
  gift: {
    name: string;
    description: string;
  };
  siddhi: {
    name: string;
    description: string;
  };

  // I Ching correspondence
  hexagram: string;
  hexagramName: string;

  // Lines (Gene Keys perspective)
  lines: GeneKeyLine[];

  // Rings and groupings
  codonRingId: string;
  aminoAcidId: string;
  physiology: string;

  // Cross-system
  hdGateId: string;             // Always matches key number
  programmingPartner: number;

  // Zodiac mapping
  zodiacSign: string;
  degreeStart: number;
  degreeEnd: number;
}

interface CodonRing extends WisdomEntity {
  tradition: 'gene-keys';
  entityType: 'codon-ring';

  geneKeyIds: string[];
  aminoAcidId: string;
  theme: string;
  collectivePurpose: string;
}

interface AminoAcid extends WisdomEntity {
  tradition: 'gene-keys';
  entityType: 'amino-acid';

  abbreviation: string;
  geneKeyIds: string[];
  codonRingId: string;
  biologicalFunction: string;
  consciousnessCorrelate: string;
}
```

---

## Relationship Taxonomy

### Cross-Tradition Relationships

```typescript
type RelationshipType =
  // Astrology internal
  | 'RULES'                     // Planet → Sign
  | 'HAS_ELEMENT'               // Sign → Element
  | 'OPPOSES'                   // Sign ↔ Sign
  | 'CONTAINS_DECAN'            // Sign → Decan
  | 'HAS_DIGNITY'               // Planet + Sign → Dignity

  // Human Design internal
  | 'LOCATED_IN_CENTER'         // Gate → Center
  | 'FORMS_CHANNEL'             // Gate + Gate → Channel
  | 'BELONGS_TO_CIRCUIT'        // Gate/Channel → Circuit
  | 'CONNECTS_CENTERS'          // Channel → Center + Center

  // Gene Keys internal
  | 'PART_OF_RING'              // GeneKey → CodonRing
  | 'ENCODES_AMINO_ACID'        // GeneKey → AminoAcid
  | 'PROGRAMS'                  // GeneKey ↔ GeneKey (programming partners)

  // Cross-tradition (the magic!)
  | 'CORRESPONDS_TO_GATE'       // GeneKey ↔ Gate (1:1 by number)
  | 'MAPS_TO_ZODIAC'            // Gate/GeneKey → Sign (by degree)
  | 'FALLS_IN_DECAN'            // Gate/GeneKey → Decan
  | 'SHARES_HEXAGRAM'           // Gate ↔ GeneKey ↔ I Ching

  // Activation (for personal charts)
  | 'ACTIVATES'                 // Planet position → Gate/GeneKey
  | 'DEFINES'                   // Activated Gates → Center
  | 'CREATES_CHANNEL'           // Two defined gates → Channel

  // Universal
  | 'HARMONIZES_WITH'           // General affinity
  | 'CHALLENGES'                // Tension relationship
  | 'SYNTHESIZES_WITH';         // Integration relationship
```

### Relationship Schema

```typescript
interface Relationship {
  id: string;
  type: RelationshipType;
  sourceId: string;
  targetId: string;

  // Optional metadata
  description?: string;
  strength?: number;            // 0-1 for weighted graphs
  bidirectional?: boolean;

  // For degree-based relationships
  degreeRange?: {
    start: number;
    end: number;
  };
}
```

---

## Storage Options Analysis

### Option 1: JSON Files (Current Approach)

**Structure:**
```
src/data/
├── astrology/
│   ├── planets.json
│   ├── signs.json
│   └── relationships.json
├── human-design/
│   ├── gates.json
│   ├── channels.json
│   └── relationships.json
├── gene-keys/
│   ├── keys.json
│   ├── codon-rings.json
│   └── relationships.json
└── cross-system/
    └── correspondences.json
```

**Pros:**
- Simple, no database needed
- Version control friendly
- Works with static site generation
- Currently implemented for astrology

**Cons:**
- No query language
- Manual relationship traversal
- Duplication risk
- Memory loading for large graphs

**Verdict:** Good for MVP, limited for complex queries

---

### Option 2: Graph Database (Neo4j/Dgraph)

**Pros:**
- Native graph queries (Cypher/GraphQL)
- Efficient relationship traversal
- Pattern matching built-in
- Scales to millions of nodes

**Cons:**
- Infrastructure complexity
- Hosting costs
- Overkill for ~500 entities
- Learning curve

**Verdict:** Powerful but over-engineered for current scale

---

### Option 3: SQLite with JSON Columns

**Pros:**
- Single file database
- SQL + JSON queries
- No server needed
- Works offline

**Cons:**
- Relationship joins less elegant
- Not truly graph-native

**Verdict:** Practical middle ground

---

### Option 4: Markdown + YAML Frontmatter

**Structure:**
```
content/
├── astrology/
│   ├── planets/
│   │   ├── sun.md
│   │   └── moon.md
│   └── signs/
│       ├── aries.md
│       └── taurus.md
├── human-design/
│   ├── gates/
│   │   ├── gate-1.md
│   │   └── gate-2.md
│   └── centers/
│       └── sacral.md
└── gene-keys/
    ├── keys/
    │   ├── key-1.md
    │   └── key-2.md
    └── codon-rings/
        └── ring-of-fire.md
```

**Frontmatter Example:**
```yaml
---
id: gate-1
tradition: human-design
type: gate
name: The Gate of Self-Expression
number: 1
center: g-center
circuit: individual-knowing
gene_key: key-1
zodiac_position:
  sign: scorpio
  degree_start: 13.625
  degree_end: 19.25
programming_partner: gate-2
keywords:
  - creativity
  - self-expression
  - individuality
---

# Gate 1: The Creative

The Gate of Self-Expression represents...
```

**Pros:**
- Human readable/editable
- Git-friendly versioning
- AI can read/write directly
- Natural content authoring
- Static site generators (Astro, Next) support natively
- Obsidian/Notion compatible

**Cons:**
- Query requires parsing
- Relationship management manual
- Build step needed for graph construction

**Verdict:** Excellent for content-heavy wisdom data

---

### Option 5: Hybrid Approach (Recommended)

**Architecture:**

```
┌──────────────────────────────────────────────────────────────┐
│                    SOURCE OF TRUTH                           │
│                                                              │
│   content/                     # Markdown + YAML frontmatter │
│   ├── astrology/               # Human-readable content      │
│   ├── human-design/            # Easy to edit/review         │
│   └── gene-keys/               # Version controlled          │
└──────────────────────────────────────────────────────────────┘
                              ↓
                        Build Process
                              ↓
┌──────────────────────────────────────────────────────────────┐
│                    COMPILED DATA                             │
│                                                              │
│   src/data/                    # Generated JSON              │
│   ├── entities.json            # All entities indexed        │
│   ├── relationships.json       # All edges                   │
│   └── search-index.json        # Full-text search index      │
└──────────────────────────────────────────────────────────────┘
                              ↓
                        Runtime
                              ↓
┌──────────────────────────────────────────────────────────────┐
│                    IN-MEMORY GRAPH                           │
│                                                              │
│   GraphService                 # Loaded at app init          │
│   ├── entities: Map            # O(1) entity lookup          │
│   ├── adjacencyList: Map       # Relationship traversal      │
│   └── indices: Map             # Type, tradition indices     │
└──────────────────────────────────────────────────────────────┘
```

---

## Recommended Architecture

### Data Layer Design

```typescript
// src/services/WisdomGraph.ts

class WisdomGraph {
  private entities: Map<string, WisdomEntity>;
  private relationships: Map<string, Relationship>;
  private adjacency: Map<string, Set<string>>;  // entity -> related entity IDs

  // Indices for fast queries
  private byTradition: Map<Tradition, Set<string>>;
  private byType: Map<EntityType, Set<string>>;
  private byDegree: IntervalTree<string>;  // For zodiac degree lookups

  constructor(data: CompiledGraphData) {
    this.loadEntities(data.entities);
    this.loadRelationships(data.relationships);
    this.buildIndices();
  }

  // Core queries
  getEntity(id: string): WisdomEntity | undefined;
  getRelated(id: string, type?: RelationshipType): WisdomEntity[];
  getByTradition(tradition: Tradition): WisdomEntity[];
  getByType(type: EntityType): WisdomEntity[];

  // Cross-system queries
  getCorrespondences(id: string): WisdomEntity[];
  getGateForDegree(sign: string, degree: number): HumanDesignGate;
  getGeneKeyForDegree(sign: string, degree: number): GeneKey;

  // Traversal
  findPath(sourceId: string, targetId: string): WisdomEntity[];
  getNeighborhood(id: string, depth: number): SubGraph;

  // Pattern queries
  findByKeywords(keywords: string[]): WisdomEntity[];
  findSimilar(id: string): WisdomEntity[];
}
```

### Content File Structure

```
content/
├── _schemas/                    # JSON Schema definitions
│   ├── astrology.schema.json
│   ├── human-design.schema.json
│   └── gene-keys.schema.json
│
├── astrology/
│   ├── planets/
│   │   ├── _index.yaml          # Collection metadata
│   │   ├── sun.md
│   │   ├── moon.md
│   │   └── ...
│   ├── signs/
│   ├── houses/
│   ├── elements/
│   ├── aspects/
│   ├── decans/
│   └── dignities/
│
├── human-design/
│   ├── gates/
│   │   ├── _index.yaml
│   │   ├── gate-01.md
│   │   ├── gate-02.md
│   │   └── ... (64 total)
│   ├── channels/
│   │   └── ... (36 total)
│   ├── centers/
│   │   └── ... (9 total)
│   ├── circuits/
│   │   └── ... (6 total)
│   ├── types/
│   │   └── ... (5 total)
│   └── profiles/
│       └── ... (12 total)
│
├── gene-keys/
│   ├── keys/
│   │   ├── _index.yaml
│   │   ├── key-01.md
│   │   ├── key-02.md
│   │   └── ... (64 total)
│   ├── codon-rings/
│   │   └── ... (21 total)
│   └── amino-acids/
│       └── ... (20 total)
│
└── cross-system/
    ├── zodiac-gate-mapping.yaml
    ├── hexagram-correspondences.yaml
    └── integration-principles.md
```

---

## Implementation Strategy

### Phase 1: Schema Definition

1. Define TypeScript interfaces for all entity types
2. Create JSON Schema for content validation
3. Build frontmatter parser with validation

### Phase 2: Content Migration

1. Convert existing astrology JSON to markdown files
2. Import Human Design data from `human_design_gates.json`
3. Import Gene Keys data from text files
4. Validate all content against schemas

### Phase 3: Build Pipeline

1. Create content compiler (markdown → JSON)
2. Generate relationship edges from frontmatter references
3. Build search index
4. Output compiled graph data

### Phase 4: Runtime Service

1. Implement WisdomGraph class
2. Create React context provider
3. Build query hooks (useEntity, useRelated, etc.)
4. Integrate with existing UI components

### Phase 5: Cross-System Features

1. Zodiac degree → Gate/GeneKey lookup
2. Personal chart → HD Body Graph generation
3. Personal chart → Golden Path mapping
4. Unified entity detail pages

---

## Frontend Considerations

### Component Architecture

```tsx
// Unified entity display
<EntityViewer
  entityId="gate-1"
  showCorrespondences={true}
  highlightTradition="gene-keys"
/>

// Cross-system navigation
<CorrespondenceNav
  currentEntity={geneKey1}
  traditions={['astrology', 'human-design']}
/>

// Knowledge graph visualization
<KnowledgeGraph
  centerEntity={selectedEntity}
  depth={2}
  filterTraditions={['all']}
  highlightPath={pathToShow}
/>

// Personal integration view
<IntegratedProfile
  birthData={userData}
  showLayers={['astrology', 'human-design', 'gene-keys']}
/>
```

### Navigation Patterns

```
Entity Detail Page
├── Core Information (name, symbol, keywords)
├── Tradition-Specific Content
│   ├── [Astrology tab]
│   ├── [Human Design tab]
│   └── [Gene Keys tab]
├── Correspondences Panel
│   ├── Same-number correspondences
│   ├── Zodiac-position correspondences
│   └── Thematic correspondences
├── Relationship Graph (mini)
└── Personal Activation (if profile exists)
```

### URL Structure

```
/explore/astrology/planet/sun
/explore/astrology/sign/aries
/explore/human-design/gate/1
/explore/human-design/channel/1-8
/explore/gene-keys/key/1
/explore/gene-keys/codon-ring/fire

/correspondence/gate-1          # Shows Gate 1 + Gene Key 1 + Zodiac position
/my-chart/astrology
/my-chart/human-design
/my-chart/gene-keys
/my-chart/integrated            # All three overlaid
```

---

## AI Integration Points

### Knowledge Graph as Context

The graph structure enables powerful AI features:

```typescript
// Build context for AI prompt
function buildAIContext(entityId: string): string {
  const entity = graph.getEntity(entityId);
  const related = graph.getRelated(entityId);
  const correspondences = graph.getCorrespondences(entityId);

  return `
    Current Entity: ${entity.name} (${entity.tradition})
    ${entity.description}

    Related Concepts:
    ${related.map(r => `- ${r.name}: ${r.keywords.join(', ')}`).join('\n')}

    Cross-Tradition Correspondences:
    ${correspondences.map(c => `- ${c.tradition}: ${c.name}`).join('\n')}
  `;
}
```

### Query Examples

```typescript
// "What does it mean to have Gate 1 in my chart?"
const gate1Context = buildAIContext('gate-1');
const geneKey1Context = buildAIContext('gene-key-1');
const zodiacContext = buildAIContext('scorpio'); // Gate 1's zodiac position

// AI receives unified context from all three traditions
```

---

## Summary

The recommended architecture uses a **hybrid approach**:

1. **Markdown + YAML** as source of truth for human editing
2. **Build-time compilation** to optimized JSON
3. **In-memory graph** for runtime queries
4. **Type-safe service layer** for frontend access

This balances:
- Content authoring ease (markdown)
- Query performance (compiled graph)
- Type safety (TypeScript)
- AI readability (structured data)
- Version control (git-friendly)

The unified schema with cross-tradition correspondences enables the "knowledge graph" vision while remaining practical to implement incrementally.

---

*Document Version: 1.0*
*Last Updated: January 2026*
*Part of Cosmic Copilot Planning Documentation*
