# COSMIC CARTOGRAPHER — Data Schema Specification
## TypeScript Interfaces & JSON Structure

---

## I. UNIVERSAL KNOWLEDGE BASE TYPES

### 1.1 Core Entity Interface

```typescript
// Base interface for all astrological entities
interface AstroEntity {
  id: string;           // Unique identifier
  type: EntityType;     // Discriminator
  name: string;         // Display name
  symbol?: string;      // Unicode symbol if applicable
  image?: string;       // URL to image asset
  description?: string; // Rich text description
}

type EntityType = 
  | 'planet' 
  | 'sign' 
  | 'house' 
  | 'element' 
  | 'decan' 
  | 'aspect' 
  | 'configuration' 
  | 'dignity'
  | 'point';  // For ASC, MC, Nodes, etc.
```

### 1.2 Planet Interface

```typescript
interface Planet extends AstroEntity {
  type: 'planet';
  symbol: string;                    // ☉, ☽, ☿, etc.
  cycleDuration: string;             // "1 year through zodiac"
  archetype: string;                 // "The Sovereign, Core Identity"
  functionAndMeaning: string;        // Full description
  contemplationQuestions: string[];  // 3 questions
  personalNotes?: string;            // User-editable
  
  planetType: PlanetType;
  planetImportance: number;          // 1-4 scale
  signsRuled: string[];              // References to sign IDs
  
  giftExpression: string;
  shadowExpression: string;
}

type PlanetType = 
  | 'Traditional Planet'    // Sun through Saturn
  | 'Modern Planet'         // Uranus, Neptune, Pluto
  | 'Key Astro Point';      // Nodes, Lilith, Chiron, etc.
```

**Example JSON:**
```json
{
  "id": "sun",
  "type": "planet",
  "name": "Sun",
  "symbol": "☉",
  "image": "https://firebase.../sun.png",
  "cycleDuration": "1 year through zodiac",
  "archetype": "The Sovereign, Core Identity, Divine Self",
  "functionAndMeaning": "Your essential nature and life force. The Sun represents your soul's purpose, creative vitality, and authentic self-expression...",
  "contemplationQuestions": [
    "What makes me feel most alive and authentic?",
    "How do I shine my unique light in the world?",
    "What is my soul calling me to become?"
  ],
  "planetType": "Traditional Planet",
  "planetImportance": 4,
  "signsRuled": ["leo"],
  "giftExpression": "Authentic leadership, creative radiance, generous heart, inspiring presence, clear sense of purpose, confident self-expression, vital life force",
  "shadowExpression": "Ego inflation, narcissism, need for constant attention, arrogance, inability to see others' perspectives, domineering behavior, pride that blocks growth"
}
```

### 1.3 Zodiac Sign Interface

```typescript
interface ZodiacSign extends AstroEntity {
  type: 'sign';
  symbol: string;                    // ♈︎, ♉︎, etc.
  orderInZodiac: number;             // 1-12
  dateRange: string;                 // "March 21 - April 19"
  keyPhrase: string;                 // "I AM"
  
  signModality: Modality;
  elementId: string;                 // Reference to element
  alchemicalElementId: string;       // Reference to Sulphur/Mercury/Salt
  
  rulingPlanetIds: string[];         // Can have multiple (traditional + modern)
  houseRuled: string;                // Reference to house ID
  opposingSignId: string;            // Reference to opposite sign
  
  characteristicsAndQualities: string;
  traits: string;                    // "The Warrior, Initiator, Confrontational"
  bodyPart: string;                  // "Head"
  
  decanIds: string[];                // 3 decans per sign
}

type Modality = 'Cardinal' | 'Fixed' | 'Mutable';
```

**Example JSON:**
```json
{
  "id": "aries",
  "type": "sign",
  "name": "Aries",
  "symbol": "♈︎",
  "image": "https://firebase.../aries.png",
  "orderInZodiac": 1,
  "dateRange": "March 21 - April 19",
  "keyPhrase": "I AM",
  "signModality": "Cardinal",
  "elementId": "fire",
  "alchemicalElementId": "sulphur",
  "rulingPlanetIds": ["mars"],
  "houseRuled": "house-1",
  "opposingSignId": "libra",
  "characteristicsAndQualities": "The Warrior Pioneer. Pure initiating fire energy that says 'I AM.' Aries embodies courage, spontaneity, and the raw life force of new beginnings...",
  "traits": "The Warrior, Initiator, Confrontational",
  "bodyPart": "Head",
  "decanIds": ["aries-1-cassiopeia", "aries-2-cetus", "aries-3-perseus"]
}
```

### 1.4 House Interface

```typescript
interface House extends AstroEntity {
  type: 'house';
  houseNumber: number;               // 1-12
  houseType: HouseType;
  
  rulingSignId: string;              // Natural sign ruler
  rulingPlanetId: string;            // Natural planet ruler
  
  lifeAreaFocus: string[];           // Array of keywords
  meaningAndRepresentation: string;  // Full description
  contemplationQuestions: string[];
}

type HouseType = 'Angular' | 'Succedent' | 'Cadent';
```

**Example JSON:**
```json
{
  "id": "house-12",
  "type": "house",
  "name": "12th House",
  "houseNumber": 12,
  "houseType": "Cadent",
  "rulingSignId": "pisces",
  "rulingPlanetId": "neptune",
  "lifeAreaFocus": [
    "Spirituality",
    "Subconscious",
    "Dreams",
    "Karma",
    "Surrender",
    "Compassion",
    "Hidden Strengths",
    "Service"
  ],
  "meaningAndRepresentation": "The Ocean of Divine Compassion. This is where you dissolve the boundaries of ego and merge with universal love, accessing your hidden spiritual gifts...",
  "contemplationQuestions": [
    "What is my soul's relationship with the Divine?",
    "How do I serve from ego-less compassion?",
    "What patterns am I releasing from this and past lifetimes?"
  ]
}
```

### 1.5 Element Interface

```typescript
interface Element extends AstroEntity {
  type: 'element';
  symbol: string;                    // 🜂, 🜃, 🜁, 🜄, etc.
  elementCategory: ElementCategory;
  
  coreQuality: string;               // Full description
  corePrinciple: string;             // "I Act", "I Think", etc.
  
  zodiacSignIds: string[];           // Signs of this element
  modalityExpression: {
    cardinal?: string;
    fixed?: string;
    mutable?: string;
  };
  
  keyTraits: string[];
  recognitionPattern: string[];      // Questions to identify
  shadowSide: string;
  elementDynamics: string;           // How it interacts with others
  
  balancingPractice: {
    toIncrease: string;
    toDecrease: string;
  };
}

type ElementCategory = 'Classical' | 'Alchemical';
```

**Example JSON:**
```json
{
  "id": "fire",
  "type": "element",
  "name": "Fire",
  "symbol": "🜂",
  "elementCategory": "Classical",
  "coreQuality": "Action-oriented, passionate, inspiring energy. The spark of life and will. Represents enthusiasm, courage, leadership, and creative force...",
  "corePrinciple": "I Act: The force of will and inspiration",
  "zodiacSignIds": ["aries", "leo", "sagittarius"],
  "modalityExpression": {
    "cardinal": "Cardinal Fire (initiating)",
    "fixed": "Fixed Fire (sustaining)",
    "mutable": "Mutable Fire (adapting)"
  },
  "keyTraits": ["Passionate", "Impulsive", "Blunt", "Inspiring", "Leadership", "Dramatic"],
  "recognitionPattern": [
    "Do you like to take risks?",
    "Are you an action-oriented person?",
    "Do people say you're intense or dramatic?",
    "Do you get angry easily but forgive quickly?"
  ],
  "shadowSide": "Can become ego-driven, aggressive, impatient, or burnt out...",
  "elementDynamics": "Energizes Air (dynamic duo). Can overwhelm Water. Transforms Earth.",
  "balancingPractice": {
    "toIncrease": "Move your body for 15 minutes daily. Take one spontaneous action each day. Speak up in one situation where you'd normally stay quiet.",
    "toDecrease": "Practice pausing for 3 breaths before acting. Meditate for 10 minutes daily focusing on stillness. Ask someone's opinion before sharing yours."
  }
}
```

### 1.6 Decan Interface

```typescript
interface Decan extends AstroEntity {
  type: 'decan';
  decanNumber: number;               // 1-36
  decanName: string;                 // "Cassiopeia"
  archetype: string;                 // "Queen of The Heavens"
  
  degreeRange: string;               // "0º - 10º Aries"
  dateRange: string;                 // "March 21 - March 30"
  
  zodiacSignId: string;              // Parent sign
  elementId: string;                 // Inherited from sign
  
  rulingPlanetId: string;            // Traditional decan ruler
  rulingSignId: string;              // Sign that sub-rules
  modernRulingPlanetId: string;      // Calculated from ruling sign
  
  complementaryDecanId: string;      // Opposite on wheel
  
  description: string;               // Full interpretation
}
```

**Example JSON:**
```json
{
  "id": "aries-1-cassiopeia",
  "type": "decan",
  "name": "Aries I",
  "decanNumber": 1,
  "decanName": "Cassiopeia",
  "archetype": "Queen of The Heavens - Enthroned Queen",
  "degreeRange": "0º - 10º Aries",
  "dateRange": "March 21 - March 30",
  "zodiacSignId": "aries",
  "elementId": "fire",
  "rulingPlanetId": "mars",
  "rulingSignId": "aries",
  "modernRulingPlanetId": "mars",
  "complementaryDecanId": "libra-1-crux",
  "description": "The pure warrior archetype, combining Aries fire with Mars rulership creates the most direct and pioneering energy in the zodiac..."
}
```

### 1.7 Aspect Interface

```typescript
interface Aspect extends AstroEntity {
  type: 'aspect';
  symbol: string;                    // ☌, ☍, △, □, ⚹
  angle: number;                     // 0, 60, 90, 120, 180
  orbRange: string;                  // "6-10°"
  
  nature: AspectNature;
  keyword: string;                   // "Act as One", "Tension", etc.
  elementalPattern: string;          // "Same element", "Same modality"
  
  explanation: string;
  impact: string;
  integrationPractice: string;
}

type AspectNature = 'Harmonious' | 'Challenging' | 'Neutral';
```

**Example JSON:**
```json
{
  "id": "square",
  "type": "aspect",
  "name": "Square",
  "symbol": "□",
  "angle": 90,
  "orbRange": "6-8°",
  "nature": "Challenging",
  "keyword": "Tension",
  "elementalPattern": "Same modality (Cardinal, Fixed, or Mutable)",
  "explanation": "The Sacred Friction of Growth. This powerful geometry creates tension that demands action...",
  "impact": "Creates internal friction and external challenges that force growth and development...",
  "integrationPractice": "Embrace the creative tension rather than avoiding it. Find the higher synthesis that honors both planetary needs..."
}
```

### 1.8 Aspect Configuration Interface

```typescript
interface AspectConfiguration extends AstroEntity {
  type: 'configuration';
  shape: string;                     // "Triangle", "Cross", etc.
  requiredAspectIds: string[];       // Aspect types needed
  requiredAspectCount: number;       // How many of each
  orbRange: string;
  
  nature: AspectNature;
  keyword: string;
  elementalPattern: string;
  
  explanation: string;
  impact: string;
  integrationPractice: string;
}
```

**Example JSON:**
```json
{
  "id": "grand-trine",
  "type": "configuration",
  "name": "Grand Trine",
  "shape": "Perfect triangle",
  "requiredAspectIds": ["trine"],
  "requiredAspectCount": 3,
  "orbRange": "6-8°",
  "nature": "Harmonious",
  "keyword": "Grace",
  "elementalPattern": "Three planets in same element (all Fire, Earth, Air, or Water)",
  "explanation": "The Sacred Triangle of Natural Flow...",
  "impact": "Creates natural ease and talent in combining planetary energies...",
  "integrationPractice": "Cultivate conscious appreciation for your natural gifts while avoiding complacency..."
}
```

### 1.9 Dignity Interface

```typescript
interface Dignity extends AstroEntity {
  type: 'dignity';
  dignityName: DignityType;
  
  planetId: string;
  signId: string;
  
  description: string;               // Full interpretation
}

type DignityType = 'Domicile' | 'Exaltation' | 'Detriment' | 'Fall';
```

**Example JSON:**
```json
{
  "id": "sun-in-leo-domicile",
  "type": "dignity",
  "name": "Sun in Domicile in Leo",
  "dignityName": "Domicile",
  "planetId": "sun",
  "signId": "leo",
  "description": "The Sun reaches its most powerful and natural expression in Leo, its home sign..."
}
```

---

## II. PERSONAL PROFILE TYPES

### 2.1 Profile Interface

```typescript
interface AstroProfile {
  id: string;
  name: string;
  relationship?: string;             // "Me", "Partner", "Child", etc.
  
  // Birth Data
  dateOfBirth: string;               // ISO date
  timeOfBirth: string;               // "HH:MM"
  cityOfBirth: string;
  coordinates?: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
  
  chartImage?: string;
  
  // Calculated Data
  placements: NatalPlacement[];
  housePositions: HousePosition[];
  aspects: {
    planetary: NatalAspect[];
    other: NatalAspect[];
  };
  configurations: NatalConfiguration[];
  elementalAnalysis: ElementalAnalysis;
  
  // Derived
  chartRulers: {
    traditional: string;             // Planet ID
    modern: string;                  // Planet ID
  };
}
```

### 2.2 Natal Placement Interface

```typescript
interface NatalPlacement {
  id: string;                        // e.g., "felipe-sun-libra-12"
  profileId: string;
  
  planetId: string;
  signId: string;
  houseId: string;
  decanId: string;
  
  degree: number;
  minute: number;
  retrograde: boolean;
  
  dignityId?: string;                // If planet has dignity in this sign
  isChartRuler?: 'traditional' | 'modern';
  
  // Display helpers
  fullName: string;                  // "Sun (☉) in Libra (♎︎) 24°48', in 12th House"
  shortName: string;                 // "☉ in ♎︎ (12th)"
}
```

**Example JSON:**
```json
{
  "id": "felipe-sun-libra-12",
  "profileId": "felipe-fraga",
  "planetId": "sun",
  "signId": "libra",
  "houseId": "house-12",
  "decanId": "libra-3-corona-borealis",
  "degree": 24,
  "minute": 48,
  "retrograde": false,
  "dignityId": "sun-in-libra-fall",
  "isChartRuler": null,
  "fullName": "Sun (☉) in Fall in Libra (♎︎) 24°48', in 12th House",
  "shortName": "☉ in ♎︎ (12th) Fall"
}
```

### 2.3 House Position Interface

```typescript
interface HousePosition {
  id: string;
  profileId: string;
  
  houseId: string;                   // Reference to universal house
  signId: string;                    // Sign on cusp
  
  degree: number;
  minute: number;
}
```

**Example JSON:**
```json
{
  "id": "felipe-house-1",
  "profileId": "felipe-fraga",
  "houseId": "house-1",
  "signId": "scorpio",
  "degree": 26,
  "minute": 52
}
```

### 2.4 Natal Aspect Interface

```typescript
interface NatalAspect {
  id: string;
  profileId: string;
  
  aspectId: string;                  // Reference to aspect type
  
  planet1Id: string;
  placement1Id: string;              // Reference to placement
  
  planet2Id: string;
  placement2Id: string;
  
  orbDegree: number;
  orbMinute: number;
  direction: 'Applying' | 'Separating';
  
  // Display helper
  fullName: string;                  // "☌ Conjunction: Libra Sun with Scorpio Mercury"
}
```

**Example JSON:**
```json
{
  "id": "felipe-sun-conj-mercury",
  "profileId": "felipe-fraga",
  "aspectId": "conjunction",
  "planet1Id": "sun",
  "placement1Id": "felipe-sun-libra-12",
  "planet2Id": "mercury",
  "placement2Id": "felipe-mercury-scorpio-12",
  "orbDegree": 6,
  "orbMinute": 11,
  "direction": "Applying",
  "fullName": "☌ Conjunction: Libra Sun (☉) with Scorpio Mercury (☿) (Orb: 6°11', Applying)"
}
```

### 2.5 Natal Configuration Interface

```typescript
interface NatalConfiguration {
  id: string;
  profileId: string;
  
  configurationId: string;           // Reference to configuration type
  
  placementIds: string[];            // Involved placements
  
  // Display helper
  fullName: string;                  // "Stellium in Scorpio (12th House)"
}
```

**Example JSON:**
```json
{
  "id": "felipe-stellium-scorpio-12",
  "profileId": "felipe-fraga",
  "configurationId": "stellium",
  "placementIds": [
    "felipe-mercury-scorpio-12",
    "felipe-venus-scorpio-12",
    "felipe-jupiter-scorpio-12",
    "felipe-pluto-scorpio-12"
  ],
  "fullName": "Stellium in Scorpio (12th House)"
}
```

### 2.6 Elemental Analysis Interface

```typescript
interface ElementalAnalysis {
  id: string;
  profileId: string;
  
  fire: number;
  earth: number;
  air: number;
  water: number;
  
  firePlanetIds: string[];
  earthPlanetIds: string[];
  airPlanetIds: string[];
  waterPlanetIds: string[];
  
  dominant: string;                  // Element ID
  deficient: string;                 // Element ID
}
```

**Example JSON:**
```json
{
  "id": "felipe-elemental",
  "profileId": "felipe-fraga",
  "fire": 2,
  "earth": 2,
  "air": 1,
  "water": 6,
  "firePlanetIds": ["moon", "mars"],
  "earthPlanetIds": ["uranus", "neptune"],
  "airPlanetIds": ["sun"],
  "waterPlanetIds": ["mercury", "venus", "jupiter", "saturn", "pluto", "north-node"],
  "dominant": "water",
  "deficient": "air"
}
```

---

## III. RELATIONSHIP TYPES

```typescript
interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  relationshipType: RelationshipType;
  strength?: number;                 // 1-10 for weighted relationships
  metadata?: Record<string, any>;    // Dignity name, orb, etc.
}

type RelationshipType = 
  // Planet relationships
  | 'RULES'                          // Planet → Sign
  | 'RULES_HOUSE'                    // Planet → House (natural)
  | 'HAS_DIGNITY'                    // Planet → Sign (with dignity type)
  
  // Sign relationships
  | 'HAS_ELEMENT'                    // Sign → Element
  | 'HAS_MODALITY'                   // Sign → Modality
  | 'OPPOSES'                        // Sign → Sign
  | 'CONTAINS_DECAN'                 // Sign → Decan
  | 'RULED_BY'                       // Sign → Planet
  
  // Decan relationships
  | 'BELONGS_TO'                     // Decan → Sign
  | 'DECAN_RULED_BY'                 // Decan → Planet
  | 'COMPLEMENTS'                    // Decan → Decan (opposite)
  
  // House relationships
  | 'HOUSE_RULED_BY_SIGN'            // House → Sign (natural)
  | 'HOUSE_RULED_BY_PLANET'          // House → Planet (natural)
  
  // Element relationships
  | 'ELEMENT_CONTAINS'               // Element → Sign
  | 'ENERGIZES'                      // Element → Element
  | 'CHALLENGES'                     // Element → Element
  | 'FLOWS_WITH'                     // Element → Element
  
  // Personal chart relationships
  | 'PLACED_IN_SIGN'                 // Placement → Sign
  | 'PLACED_IN_HOUSE'                // Placement → House
  | 'ASPECTS'                        // Placement → Placement
  | 'PART_OF_CONFIGURATION';         // Placement → Configuration
```

**Example Relationships JSON:**
```json
[
  {
    "id": "sun-rules-leo",
    "sourceId": "sun",
    "targetId": "leo",
    "relationshipType": "RULES",
    "strength": 10
  },
  {
    "id": "sun-domicile-leo",
    "sourceId": "sun",
    "targetId": "leo",
    "relationshipType": "HAS_DIGNITY",
    "metadata": { "dignityType": "Domicile" }
  },
  {
    "id": "aries-has-element-fire",
    "sourceId": "aries",
    "targetId": "fire",
    "relationshipType": "HAS_ELEMENT"
  },
  {
    "id": "aries-opposes-libra",
    "sourceId": "aries",
    "targetId": "libra",
    "relationshipType": "OPPOSES"
  },
  {
    "id": "fire-energizes-air",
    "sourceId": "fire",
    "targetId": "air",
    "relationshipType": "ENERGIZES"
  }
]
```

---

## IV. FILE STRUCTURE

```
src/data/
├── universal/
│   ├── planets.json           # 10 planets + 6 points
│   ├── signs.json             # 12 zodiac signs
│   ├── houses.json            # 12 houses
│   ├── elements.json          # 7 elements
│   ├── decans.json            # 36 decans
│   ├── aspects.json           # 10 aspects
│   ├── configurations.json    # 8 configurations
│   ├── dignities.json         # 40+ dignities
│   └── relationships.json     # All edges
├── personal/
│   └── felipe-fraga.json      # Example profile
└── index.ts                   # Export utilities
```

---

## V. DATA LOADING UTILITIES

```typescript
// src/data/index.ts

import planetsData from './universal/planets.json';
import signsData from './universal/signs.json';
// ... etc

// Type-safe data maps
export const planets = new Map<string, Planet>(
  planetsData.map(p => [p.id, p as Planet])
);

export const signs = new Map<string, ZodiacSign>(
  signsData.map(s => [s.id, s as ZodiacSign])
);

// Utility functions
export function getEntityById(id: string): AstroEntity | undefined {
  return planets.get(id) 
    || signs.get(id) 
    || houses.get(id)
    || elements.get(id)
    || decans.get(id)
    || aspects.get(id)
    || configurations.get(id)
    || dignities.get(id);
}

export function getRelationshipsFor(entityId: string): Relationship[] {
  return relationships.filter(
    r => r.sourceId === entityId || r.targetId === entityId
  );
}

export function getPlanetsByImportance(): Planet[] {
  return Array.from(planets.values())
    .sort((a, b) => b.planetImportance - a.planetImportance);
}

export function getSignsByElement(elementId: string): ZodiacSign[] {
  return Array.from(signs.values())
    .filter(s => s.elementId === elementId)
    .sort((a, b) => a.orderInZodiac - b.orderInZodiac);
}

export function getDecansForSign(signId: string): Decan[] {
  return Array.from(decans.values())
    .filter(d => d.zodiacSignId === signId)
    .sort((a, b) => a.decanNumber - b.decanNumber);
}

export function getDignityForPlacement(
  planetId: string, 
  signId: string
): Dignity | undefined {
  return Array.from(dignities.values())
    .find(d => d.planetId === planetId && d.signId === signId);
}
```

---

*This schema specification should be used alongside the main architecture document when implementing the Cosmic Cartographer data layer.*
