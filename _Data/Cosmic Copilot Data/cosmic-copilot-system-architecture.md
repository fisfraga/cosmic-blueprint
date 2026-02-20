# 🌟 THE COSMIC CARTOGRAPHER
## Complete System Architecture & Implementation Guide
### Version 2.0 — Enhanced with Personal Chart Integration

---

**Document Purpose:** This comprehensive guide serves as the foundational blueprint for building the Cosmic Cartographer, an interactive Astrology Knowledge Graph Explorer. It integrates ancient wisdom principles, modern UX best practices, and a dependency-aware implementation strategy designed for Claude Code development.

**Created:** January 2025  
**Author:** Fis (Felipe Fraga) in collaboration with Claude  
**Project Type:** Web Application (React + D3.js)

---

## TABLE OF CONTENTS

1. [Foundational Astrological Principles](#i-foundational-astrological-principles)
2. [System Vision & Philosophy](#ii-system-vision--philosophy)
3. [Complete Data Architecture](#iii-complete-data-architecture)
4. [Feature Hierarchy & Dependencies](#iv-feature-hierarchy--dependencies)
5. [User Experience Design](#v-user-experience-design)
6. [Technical Implementation Plan](#vi-technical-implementation-plan)
7. [Advanced Features (Veteran Astrologer Perspective)](#vii-advanced-features)
8. [Personal Profile Integration](#viii-personal-profile-integration)
9. [AI Integration Strategy](#ix-ai-integration-strategy)
10. [File Structure & Code Organization](#x-file-structure--code-organization)

---

## I. FOUNDATIONAL ASTROLOGICAL PRINCIPLES

These principles must guide every design decision, ensuring the tool serves authentic self-discovery rather than mere information consumption.

### 1.1 The Natal Chart as Cosmic Mirror

> *"Your birth chart is a symbolic map of the heavens at the exact moment and place of your birth. It reflects your potential, challenges, and life themes."*

**Design Implication:** The tool must treat the chart as a living document of possibilities, not a fixed destiny. Every feature should empower the user's agency and conscious engagement with their cosmic blueprint.

**UX Translation:**
- Never use deterministic language ("You ARE this")
- Always frame as potential and invitation ("This energy invites you to...")
- Provide growth-oriented interpretations alongside descriptions

### 1.2 The Wholeness Principle

> *"You contain all 12 zodiac signs within you, not just your Sun sign."*

**Design Implication:** The interface must reveal the FULL mandala at all times, emphasizing completeness over fragmentation. Even when exploring a single sign, the user should sense its place in the whole.

**UX Translation:**
- The zodiac wheel should always be visible or accessible
- Highlight connections to the whole when exploring parts
- "You have THIS sign in THIS house" language rather than "You are THIS sign"

### 1.3 Planets as Living Archetypes

> *"You are not your Sun Sign. Each planet influences you in a different way."*

**Design Implication:** Planets must be portrayed as dynamic psychological forces, each with its domain of influence. The Big Four (Sun, Moon, Rising, Mercury) deserve special prominence.

**UX Translation:**
- Planet hierarchy in navigation (Big Four → Personal → Social → Transpersonal)
- Rich archetypal imagery and storytelling for each planet
- Clear differentiation between Gift Expression and Shadow Expression

### 1.4 Houses as Life Arenas

> *"The 12 houses represent specific life areas... In some esoteric systems, houses are even more important than signs for real-life manifestation."*

**Design Implication:** Houses must be given equal prominence to signs—perhaps more in the personal chart view. They ground abstract energies into tangible life experiences.

**UX Translation:**
- Dual navigation: "Explore by Energy (Signs)" vs "Explore by Life Area (Houses)"
- House-first view option for practical life application
- Clear mapping between Houses and your existing 12 Areas framework

### 1.5 Elements & Modalities as Temperament

> *"Fire, Earth, Air, Water describe temperament. Cardinal, Fixed, Mutable describe how we initiate, stabilize, or adapt."*

**Design Implication:** Elements are not just categories—they are experiential qualities. The interface should FEEL different when exploring Fire vs Water content.

**UX Translation:**
- Element-specific color palettes, animations, and ambient design
- Elemental balance calculator prominently featured
- Recognition patterns (from Debra Silverman's work) integrated

### 1.6 The Alchemical View

> *"Alchemical astrology integrates four elements with three principles (Sulphur, Mercury, Salt). The chart is a work of inner transformation."*

**Design Implication:** This is your unique contribution—the seven-element system. It should be available as an advanced layer for those ready to go deeper.

**UX Translation:**
- Toggle between "Classical 4 Elements" and "Alchemical 7 Elements" view
- Sulphur/Mercury/Salt as lens for understanding zodiacal quadrants
- Transformation-oriented language throughout

### 1.7 Cycles & Timing

> *"Life unfolds in cycles—transits, progressions, returns—which awaken or challenge certain parts of the chart."*

**Design Implication:** The system should acknowledge temporal dimension, even if transit features come later. Every placement exists in TIME, not just space.

**UX Translation:**
- "Current Transit" awareness (future feature)
- Planetary cycle durations visible on planet cards
- Solar Return integration (your existing system supports this)

---

## II. SYSTEM VISION & PHILOSOPHY

### 2.1 The Bridge Builder's Mission

This tool embodies the mission of bridging ancient wisdom with modern technology. It serves three populations:

| User Type | Primary Need | Experience Goal |
|-----------|-------------|-----------------|
| **Curious Seeker** | Understand basic astrology | Discover → Learn → Apply |
| **Astrology Student** | Deepen systematic knowledge | Explore → Connect → Integrate |
| **Self-Knowledge Practitioner** | Personal chart insight | Reflect → Contemplate → Transform |

### 2.2 Design Philosophy

**From the Master Astrologer's Perspective:**
- Accuracy and respect for tradition (proper terminology, correct attributions)
- Psychological depth (moving beyond sun-sign superficiality)
- Evolutionary orientation (astrology as consciousness technology)
- Integration with other wisdom systems (alchemy, PKM, consciousness work)

**From the UX Master's Perspective:**
- Progressive disclosure (complexity revealed in layers)
- Intuitive navigation (multiple paths to same information)
- Visual hierarchy (most important information most prominent)
- Responsive feedback (every interaction confirms user's choice)
- Accessibility (works for beginners, scales for experts)

### 2.3 The Sacred Technology Principle

This is not just a database viewer—it's a **digital temple for self-discovery**. Every interaction should feel:
- **Intentional** — No accidental clicks, every tap opens something meaningful
- **Reverent** — The design honors the sacredness of self-knowledge
- **Supportive** — The system guides without prescribing
- **Beautiful** — Aesthetic quality reflects the cosmic order being explored

---

## III. COMPLETE DATA ARCHITECTURE

### 3.1 Entity Types (Nodes)

Based on analysis of the Complete Astrology Wisdom Base, the system contains these primary entities:

#### Universal Knowledge Base (Static, Shared)

| Entity Type | Count | Supertag | Key Fields |
|-------------|-------|----------|------------|
| **Planets** | 10 | `#planet` | Symbol, Archetype, Function, Gift/Shadow Expression, Contemplation Questions, Cycle Duration, Signs Ruled, Planet Type, Importance |
| **Astrological Points** | 6 | `#planet` (shared) | Symbol, Archetype, Function, Gift/Shadow Expression |
| **Zodiac Signs** | 12 | `#zodiac sign` | Symbol, Order, Date Range, Modality, Element, Ruling Planet, House Ruled, Opposing Sign, Key Phrase, Characteristics |
| **Houses** | 12 | `#house` | Number, Ruling Sign, Ruling Planet, Type (Angular/Succedent/Cadent), Life Area Focus, Meaning, Contemplation Questions |
| **Elements** | 7 | `#element` | Symbol, Core Quality, Core Principle, Zodiac Signs, Modality Expressions, Key Traits, Recognition Pattern, Shadow Side, Balancing Practices |
| **Decans** | 36 | `#decan` | Degree Range, Date Range, Zodiac Sign, Element, Ruling Planet/Sign, Description, Archetype Name, Complementary Decan |
| **Aspects** | 10 | `#aspect` | Angle, Orb Range, Symbol, Nature (Harmonious/Challenging), Explanation, Integration Practice, Keyword, Elemental Pattern |
| **Aspect Configurations** | 8 | `#aspect configuration` | Shape, Required Aspects, Orb Range, Keyword, Elemental Pattern, Nature, Explanation, Integration Practice |
| **Dignities** | 40+ | `#dignity` | Planet, Zodiac Sign, Dignity Name (Domicile/Exaltation/Detriment/Fall), Description |

#### Personal Profile System (Dynamic, Per-User)

| Entity Type | Supertag | Key Fields |
|-------------|----------|------------|
| **Profile** | `#my profile` | Date of Birth, City of Birth, Chart Image, House Positions, Planet Positions, Planet Aspects, Other Aspects |
| **Natal Placement** | `#natal placement` | Planet, Zodiac Sign, Degree, Retrograde, House, Decan, Dignity, Chart Ruler status |
| **House Position** | `#house position` | House, Zodiac Sign, Degree |
| **Natal Aspect** | `#natal aspect` | Aspect Type, Planet 1, Placement 1, Planet 2, Placement 2, Orb Degree, Aspect Direction |
| **Natal Configuration** | `#natal aspect configuration` | Configuration Type, Configuration Placements |
| **Elemental Analysis** | `#natal elemental analysis` | Fire/Earth/Air/Water planet counts |

### 3.2 Relationship Types (Edges)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     UNIVERSAL KNOWLEDGE GRAPH                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PLANET ──RULES──> SIGN                                                 │
│  PLANET ──RULES──> HOUSE (natural rulership)                           │
│  PLANET ──HAS_DIGNITY_IN──> SIGN (with type: Domicile/Exaltation/etc)  │
│                                                                         │
│  SIGN ──HAS_ELEMENT──> ELEMENT                                         │
│  SIGN ──HAS_MODALITY──> MODALITY (Cardinal/Fixed/Mutable)              │
│  SIGN ──OPPOSES──> SIGN (polarity axis)                                │
│  SIGN ──CONTAINS──> DECAN (3 per sign)                                 │
│  SIGN ──RULED_BY──> PLANET (traditional + modern)                      │
│                                                                         │
│  DECAN ──BELONGS_TO──> SIGN                                            │
│  DECAN ──HAS_ELEMENT──> ELEMENT                                        │
│  DECAN ──RULED_BY──> PLANET (decan ruler)                              │
│  DECAN ──COMPLEMENTS──> DECAN (opposite wheel position)                │
│                                                                         │
│  HOUSE ──RULED_BY──> SIGN (natural sign)                               │
│  HOUSE ──RULED_BY──> PLANET (natural planetary ruler)                  │
│  HOUSE ──HAS_TYPE──> HOUSE_TYPE (Angular/Succedent/Cadent)             │
│                                                                         │
│  ELEMENT ──CONTAINS──> SIGN (3 per element)                            │
│  ELEMENT ──ENERGIZES/CHALLENGES/FLOWS_WITH──> ELEMENT (dynamics)       │
│                                                                         │
│  ASPECT ──FORMS_PATTERN──> ASPECT_CONFIGURATION                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                     PERSONAL CHART GRAPH                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PROFILE ──HAS──> PLACEMENT (many)                                     │
│  PROFILE ──HAS──> HOUSE_POSITION (12)                                  │
│  PROFILE ──HAS──> NATAL_ASPECT (many)                                  │
│  PROFILE ──HAS──> NATAL_CONFIGURATION (if applicable)                  │
│  PROFILE ──HAS──> ELEMENTAL_ANALYSIS (1)                               │
│                                                                         │
│  PLACEMENT ──LINKS_TO──> PLANET (universal)                            │
│  PLACEMENT ──LINKS_TO──> SIGN (universal)                              │
│  PLACEMENT ──LINKS_TO──> HOUSE (universal)                             │
│  PLACEMENT ──LINKS_TO──> DECAN (universal)                             │
│  PLACEMENT ──HAS_DIGNITY──> DIGNITY (if applicable)                    │
│                                                                         │
│  HOUSE_POSITION ──LINKS_TO──> HOUSE (universal)                        │
│  HOUSE_POSITION ──LINKS_TO──> SIGN (on cusp)                           │
│                                                                         │
│  NATAL_ASPECT ──CONNECTS──> PLACEMENT (2)                              │
│  NATAL_ASPECT ──LINKS_TO──> ASPECT (universal)                         │
│                                                                         │
│  NATAL_CONFIGURATION ──CONTAINS──> PLACEMENT (3-4+)                    │
│  NATAL_CONFIGURATION ──LINKS_TO──> CONFIGURATION (universal)           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Data Transformation Strategy

The Complete_Astrology_Wisdom_Base.md will be transformed into structured JSON files:

```
data/
├── universal/
│   ├── planets.json         # 10 planets + 6 points
│   ├── signs.json           # 12 zodiac signs
│   ├── houses.json          # 12 houses
│   ├── elements.json        # 7 elements (4 classical + 3 alchemical)
│   ├── decans.json          # 36 decans
│   ├── aspects.json         # 10 aspects
│   ├── configurations.json  # 8 aspect configurations
│   ├── dignities.json       # 40+ dignity relationships
│   └── relationships.json   # Edge list for graph visualization
├── personal/
│   └── example-profile.json # Felipe's chart as working example
└── schema/
    └── types.ts             # TypeScript interfaces for all entities
```

---

## IV. FEATURE HIERARCHY & DEPENDENCIES

### 4.1 Feature Dependency Graph

Understanding which features depend on others is crucial for phased implementation:

```
                           ┌─────────────────────┐
                           │   DATA FOUNDATION   │
                           │  (JSON + Types)     │
                           └──────────┬──────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
           ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
           │  ENTITY CARDS │ │ ELEMENT THEME │ │ SEARCH/FILTER │
           │   (Detail UI) │ │   (Styling)   │ │  (Navigation) │
           └───────┬───────┘ └───────┬───────┘ └───────┬───────┘
                   │                 │                 │
                   └────────────┬────┴─────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
           ┌───────────────┐       ┌───────────────┐
           │ CELESTIAL     │       │ RELATIONSHIP  │
           │ MANDALA       │       │ EXPLORER      │
           │ (Wheel View)  │       │ (Graph View)  │
           └───────┬───────┘       └───────┬───────┘
                   │                       │
                   └───────────┬───────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
           ┌───────────────┐     ┌───────────────┐
           │ DECAN         │     │ DIGNITY       │
           │ DEEP DIVE     │     │ MATRIX        │
           └───────┬───────┘     └───────┬───────┘
                   │                     │
                   └──────────┬──────────┘
                              │
               ┌──────────────┼──────────────┐
               │              │              │
               ▼              ▼              ▼
      ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
      │ ASPECT      │ │ PROFILE     │ │ AI          │
      │ WEAVER      │ │ INTEGRATION │ │ CONTEMPLATION│
      └─────────────┘ └──────┬──────┘ └──────┬──────┘
                             │              │
                             └──────┬───────┘
                                    │
                                    ▼
                           ┌───────────────┐
                           │ COSMIC        │
                           │ COUNSELOR     │
                           │ (AI Chat)     │
                           └───────────────┘
```

### 4.2 Complete Feature Inventory

#### TIER 1: Foundation (Required for Everything)

| Feature | Description | Dependencies | Complexity |
|---------|-------------|--------------|------------|
| **F1.1 Data Parser** | Transform markdown to JSON | None | Medium |
| **F1.2 TypeScript Schema** | Type definitions for all entities | F1.1 | Low |
| **F1.3 Core Layout** | App shell, navigation, routing | None | Low |
| **F1.4 Entity Card Component** | Reusable detail view for any entity | F1.2 | Medium |
| **F1.5 Element Theme System** | Colors, animations per element | None | Medium |

#### TIER 2: Navigation & Discovery

| Feature | Description | Dependencies | Complexity |
|---------|-------------|--------------|------------|
| **F2.1 Celestial Mandala** | Interactive zodiac wheel | F1.3, F1.4 | High |
| **F2.2 Element Realms** | Grouped view by element | F1.4, F1.5 | Medium |
| **F2.3 Global Search** | Find any entity by name/keyword | F1.2 | Medium |
| **F2.4 Filter System** | Filter by type, element, modality | F1.2 | Medium |
| **F2.5 Breadcrumb Navigation** | Context-aware path display | F1.3 | Low |

#### TIER 3: Relationship Visualization

| Feature | Description | Dependencies | Complexity |
|---------|-------------|--------------|------------|
| **F3.1 Constellation Pathways** | Force-directed relationship graph | F1.2, F2.1 | High |
| **F3.2 Connection Highlighter** | Show all links from selected node | F3.1 | Medium |
| **F3.3 Relationship Filters** | Show only specific relationship types | F3.1, F2.4 | Medium |
| **F3.4 Compare Mode** | Side-by-side entity comparison | F1.4 | Medium |

#### TIER 4: Deep Exploration

| Feature | Description | Dependencies | Complexity |
|---------|-------------|--------------|------------|
| **F4.1 Decan Deep Dive** | 36 decans with constellation stories | F2.1, F1.4 | Medium |
| **F4.2 Dignity Matrix** | 10×12 grid showing all dignities | F1.2, F1.4 | Medium |
| **F4.3 Aspect Weaver** | Interactive aspect visualization | F2.1 | High |
| **F4.4 Configuration Gallery** | Grand Trine, T-Square, etc. patterns | F4.3 | Medium |

#### TIER 5: Personal Profile

| Feature | Description | Dependencies | Complexity |
|---------|-------------|--------------|------------|
| **F5.1 Profile Data Entry** | Birth data input form | F1.3 | Medium |
| **F5.2 Profile Storage** | Local storage / optional backend | F5.1 | Medium |
| **F5.3 Chart Overlay** | Show personal placements on mandala | F2.1, F5.1 | High |
| **F5.4 My Placements List** | All personal placements with details | F1.4, F5.1 | Medium |
| **F5.5 My Aspects View** | Personal aspect list and wheel | F4.3, F5.1 | High |
| **F5.6 Elemental Balance** | Personal element distribution | F5.1, F2.2 | Medium |
| **F5.7 House Positions** | Cusps with sign interpretations | F5.1, F1.4 | Medium |
| **F5.8 Configuration Detector** | Auto-detect stelliums, T-squares, etc. | F5.5, F4.4 | High |

#### TIER 6: AI Integration

| Feature | Description | Dependencies | Complexity |
|---------|-------------|--------------|------------|
| **F6.1 Contemplation Chamber** | AI-guided reflection on any entity | F1.4 | Medium |
| **F6.2 Entity Deep Dive** | AI expands on any selected entity | F6.1 | Low |
| **F6.3 Personal Insight Generator** | AI interprets personal placements | F6.1, F5.4 | Medium |
| **F6.4 Cosmic Counselor Chat** | Full conversational AI with chart context | F6.3, F5.1 | High |
| **F6.5 Transit Oracle** | AI guidance on current transits | F6.4 | High |

#### TIER 7: Advanced Features

| Feature | Description | Dependencies | Complexity |
|---------|-------------|--------------|------------|
| **F7.1 Alchemical View Toggle** | Switch between 4 and 7 element systems | F2.2 | Medium |
| **F7.2 Tana Sync** | Export/import to Tana workspace | F5.1 | High |
| **F7.3 Solar Return Calculator** | Annual chart generation | F5.1 | High |
| **F7.4 Multi-Profile Comparison** | Synastry and relationship analysis | F5.1 | Very High |
| **F7.5 Learning Paths** | Guided curriculum through the system | F2.1 | Medium |

### 4.3 Feature Synergies

Certain features amplify each other when built together:

| Synergy Group | Features | Combined Benefit |
|---------------|----------|------------------|
| **Visual Exploration** | F2.1 + F3.1 + F4.1 | Seamless zoom from wheel → graph → decan |
| **Personal Discovery** | F5.3 + F5.6 + F6.3 | See yourself in the cosmos with AI guidance |
| **Deep Learning** | F4.2 + F4.3 + F4.4 | Understand traditional rulership system fully |
| **Contemplative Practice** | F6.1 + F1.4 + F1.5 | Immersive, element-themed reflection space |

---

## V. USER EXPERIENCE DESIGN

### 5.1 Progressive Disclosure Strategy

The system should reveal complexity gradually, respecting users' varying levels of expertise.

**Layer 0: First Glance (< 3 seconds)**
- Beautiful animated mandala draws the eye
- Clear entry points: "Explore the Cosmos" / "Discover Your Chart"
- Sense of wonder and possibility

**Layer 1: Quick Orientation (30 seconds)**
- Click any sign → See its card with key information
- Element colors guide intuition (Fire = warm, Water = cool)
- Obvious navigation: back, home, search

**Layer 2: Guided Exploration (5 minutes)**
- Follow connections: Sign → Element → Other Signs in Element
- Discover the wheel structure naturally
- Optional tooltips explain astrological concepts

**Layer 3: Deep Dive (15+ minutes)**
- Access decans, dignities, configurations
- Enter personal birth data
- Engage with AI contemplation

**Layer 4: Mastery (Ongoing)**
- Compare charts, explore transits
- Export to Tana for integration
- Contribute personal insights

### 5.2 Navigation Patterns

**Primary Navigation (Always Visible)**
```
┌─────────────────────────────────────────────────────────────────┐
│  🌟 COSMIC CARTOGRAPHER         [Search...]        [My Chart]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   [ Wheel ]  [ Elements ]  [ Planets ]  [ Houses ]  [ More ▼ ] │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Context Navigation (Within Each View)**
- Breadcrumbs: Home > Elements > Fire > Aries > Aries II (Cetus)
- Related entities sidebar
- "See also" suggestions

**Quick Actions (Floating)**
- Compare (add current entity to comparison)
- Contemplate (open AI reflection)
- Add to My Notes (if profile exists)

### 5.3 Visual Hierarchy

**Typography Scale:**
```
TITLE       — Cinzel 32px   — Entity names, section headers
HEADING     — Inter 24px    — Card headers, navigation
SUBHEADING  — Inter 18px    — Categories, labels
BODY        — Inter 16px    — Descriptions, content
CAPTION     — Inter 14px    — Degrees, orbs, metadata
SYMBOL      — Glyphs 24-48px — Astrological symbols
```

**Color System:**

| Purpose | Fire | Earth | Air | Water | Neutral |
|---------|------|-------|-----|-------|---------|
| Primary | #FF6B35 | #2D5016 | #4A90D9 | #1A5F7A | #1A1A2E |
| Secondary | #FFE66D | #8B7355 | #87CEEB | #57C5B6 | #2D2D44 |
| Background | #FFF5F0 | #F5F2ED | #F0F7FF | #F0FAFA | #0D0D15 |
| Text | #1A0000 | #1A1A00 | #00001A | #001A1A | #FFFFFF |

**Interactive States:**
- Hover: Glow effect + slight scale (1.02)
- Selected: Border highlight + elevation shadow
- Disabled: 50% opacity

### 5.4 Mobile-First Responsive Design

**Breakpoints:**
- Mobile: < 640px — Single column, swipe navigation
- Tablet: 640-1024px — Two columns, side panel
- Desktop: > 1024px — Full layout with persistent navigation

**Mobile Adaptations:**
- Mandala becomes swipeable card carousel
- Graph collapses to list view with expandable connections
- Bottom navigation bar replaces top nav

### 5.5 Accessibility Considerations

- All colors maintain WCAG AA contrast ratios
- Keyboard navigation for all interactive elements
- Screen reader labels for symbolic content
- Reduced motion option for animations
- Text zoom support up to 200%

---

## VI. TECHNICAL IMPLEMENTATION PLAN

### 6.1 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | React 18 | Component architecture, hooks, concurrent features |
| **Language** | TypeScript | Type safety for complex data relationships |
| **Styling** | Tailwind CSS + CSS Modules | Rapid development + custom theming |
| **Visualization** | D3.js | Force-directed graphs, custom SVG |
| **Animation** | Framer Motion | Fluid transitions, gesture support |
| **State** | Zustand | Lightweight, intuitive state management |
| **Routing** | React Router v6 | URL-based navigation |
| **AI Integration** | Anthropic Claude API | Contemplation and chat features |
| **Build** | Vite | Fast development, optimized production builds |
| **Deployment** | Vercel | Edge functions, preview deployments |

### 6.2 Phased Implementation

#### PHASE 1: Foundation (Week 1-2)
**Goal:** Working prototype with basic navigation

**Tasks:**
1. [ ] Initialize Vite + React + TypeScript project
2. [ ] Parse Complete_Astrology_Wisdom_Base.md into JSON
3. [ ] Create TypeScript interfaces for all entity types
4. [ ] Build Entity Card component (generic, type-aware)
5. [ ] Implement Element theme system (CSS variables)
6. [ ] Create basic routing structure
7. [ ] Build simple list views for each entity type
8. [ ] Implement global search functionality

**Deliverable:** Browse all entities, search, view details

---

#### PHASE 2: Visual Navigation (Week 3-4)
**Goal:** Interactive wheel and element views

**Tasks:**
1. [ ] Build Celestial Mandala component (D3.js + React)
   - Static wheel with 12 segments
   - Click to select sign
   - Hover highlights
2. [ ] Create Element Realms view
   - 4 (or 7) elemental zones
   - Signs grouped within elements
3. [ ] Implement breadcrumb navigation
4. [ ] Add visual transitions between views
5. [ ] Connect Mandala selections to Entity Cards

**Deliverable:** Navigate cosmos through wheel, explore by element

---

#### PHASE 3: Relationships (Week 5-6)
**Goal:** Visualize the web of connections

**Tasks:**
1. [ ] Build Constellation Pathways (force-directed graph)
   - D3 force simulation
   - Node = Entity
   - Edge = Relationship (typed, colored)
2. [ ] Implement Connection Highlighter
   - Select node → all connected nodes glow
3. [ ] Add relationship type filters
4. [ ] Create Compare Mode
   - Add entities to comparison tray
   - Side-by-side card view
5. [ ] Optimize graph performance (virtualization)

**Deliverable:** Explore relationships, compare entities

---

#### PHASE 4: Deep Features (Week 7-8)
**Goal:** Advanced exploration tools

**Tasks:**
1. [ ] Build Decan Deep Dive
   - Zoom from sign to decan level on wheel
   - Constellation imagery and stories
2. [ ] Create Dignity Matrix
   - 10×12 interactive grid
   - Click cell → full dignity description
3. [ ] Build Aspect Weaver (basic)
   - Planets on wheel
   - Aspect lines between them
   - Click aspect → interpretation
4. [ ] Implement Configuration Gallery
   - Visual patterns (Grand Trine, T-Square, etc.)

**Deliverable:** Expert-level exploration tools

---

#### PHASE 5: Personal Profile (Week 9-10)
**Goal:** Individual chart integration

**Tasks:**
1. [ ] Build Profile Entry form
   - Date/time/location input
   - Manual planet position entry (advanced)
2. [ ] Implement local storage for profile
3. [ ] Create Chart Overlay on Mandala
   - Personal planets appear on wheel
   - Different visual treatment (filled vs outlined)
4. [ ] Build My Placements list view
5. [ ] Create My Aspects view
   - Personal aspect list
   - Aspect lines on wheel
6. [ ] Build Elemental Balance visualizer
7. [ ] Implement Configuration Detector

**Deliverable:** Full personal chart exploration

---

#### PHASE 6: AI Integration (Week 11-12)
**Goal:** Intelligent guidance and reflection

**Tasks:**
1. [ ] Set up Anthropic API integration
2. [ ] Build Contemplation Chamber component
   - Select entity → AI generates reflection prompts
   - Streaming response display
3. [ ] Create Entity Deep Dive AI feature
4. [ ] Build Personal Insight Generator
   - AI interprets user's placements
5. [ ] Implement Cosmic Counselor chat interface
   - Full conversational AI
   - Profile context injected

**Deliverable:** AI-powered self-discovery

---

#### PHASE 7: Polish & Launch (Week 13-14)
**Goal:** Production-ready application

**Tasks:**
1. [ ] Performance optimization
2. [ ] Error handling and edge cases
3. [ ] Loading states and skeleton UI
4. [ ] Final responsive design pass
5. [ ] Accessibility audit and fixes
6. [ ] SEO and meta tags
7. [ ] Analytics integration
8. [ ] Documentation and help content

**Deliverable:** Launch-ready Cosmic Cartographer

---

### 6.3 Critical Path

The minimum viable product requires:

```
F1.1 Data Parser
    ↓
F1.2 TypeScript Schema
    ↓
F1.4 Entity Card
    ↓
F2.1 Celestial Mandala
    ↓
MVP: Browse wheel, view entity details
```

Everything else builds on this foundation.

---

## VII. ADVANCED FEATURES (Veteran Astrologer Perspective)

As a veteran astrologer contemplating this system, I see opportunities for depth that most astrology apps miss entirely.

### 7.1 Dispositorship Chains

**What:** Trace the chain of planetary rulership through a chart. If Moon is in Aries, Mars "disposes" of it. If Mars is in Leo, Sun disposes Mars. Follow until a planet disposes itself (in domicile) or creates a loop.

**Why:** Reveals the hidden hierarchy of planetary influence in any chart. Essential for traditional astrology.

**Implementation:** Graph traversal algorithm, visual chain display.

### 7.2 Sect Consideration

**What:** Day charts (Sun above horizon) vs Night charts (Sun below). Affects benefic/malefic status of planets.

**Why:** Ancient technique that adds nuance to planetary interpretation.

**Implementation:** Calculate based on Sun position, adjust planet cards accordingly.

### 7.3 Whole Sign vs Placidus Houses

**What:** Toggle between house systems. Whole Sign (ancient) vs Placidus (modern popular).

**Why:** Different traditions, different insights.

**Implementation:** Recalculate house positions, update all house-related displays.

### 7.4 Planetary Hours

**What:** Each hour of each day is ruled by a planet (Chaldean order).

**Why:** Timing tool for elections and daily practice.

**Implementation:** Real-time calculator, optional integration with contemplation prompts.

### 7.5 Fixed Star Conjunctions

**What:** When planets align with major fixed stars (Regulus, Algol, Spica, etc.).

**Why:** Adds layer of meaning for degrees that conjunct powerful stars.

**Implementation:** Degree-based lookup, flag on placements near fixed stars.

### 7.6 Antiscia and Contra-Antiscia

**What:** Mirror points across the solstice axis (Cancer/Capricorn 0°).

**Why:** Hidden connections between chart points.

**Implementation:** Calculate mirror degrees, add as relationship type.

### 7.7 Profection Wheels

**What:** Annual timing technique—each year activates a different house (Age 0 = 1st house, Age 12 = 1st again, etc.).

**Why:** Simple but powerful timing tool.

**Implementation:** Year input → highlight profected house, ruler planet.

### 7.8 Zodiacal Releasing

**What:** Time-lord technique from Hellenistic astrology based on Spirit or Fortune.

**Why:** Long-term life period analysis.

**Implementation:** Complex—requires accurate birth time, multi-level period calculation.

---

## VIII. PERSONAL PROFILE INTEGRATION

### 8.1 Felipe Fraga Profile Analysis (Working Example)

Your chart provides the perfect example for designing the personal profile system.

#### Key Signatures:

**The 12th House Stellium:**
- Mercury ☿ in Scorpio (0°59' Rx)
- Venus ♀ in Scorpio (17°28' Rx, Detriment)
- Jupiter ♃ in Scorpio (18°36')
- Pluto ♇ in Scorpio (26°42', Domicile, Chart Ruler)
- North Node ☊ in Scorpio (15°43' Rx)

**This concentration demands special UI treatment:**
- Stellium indicator badge on profile
- Grouped display of 12th house contents
- Deep interpretation available via AI

**Elemental Balance:**
- Fire: 2 (Moon, Mars)
- Earth: 2 (Uranus, Neptune + Chiron, Lilith, Fortune)
- Air: 1 (Sun)
- Water: 6 (Mercury, Venus, Jupiter, Saturn, Pluto, North Node)

**Visual representation needed:**
- Elemental balance bar chart
- Water dominance highlighted
- Air deficiency noted with growth suggestion

**Dignity Highlights:**
- Sun in Fall (Libra) — Growth edge around identity
- Venus in Detriment (Scorpio) — Deep relational transformation
- Pluto in Domicile (Scorpio) — Power placement

**Chart Ruler:**
- Mars (traditional ruler of Scorpio Ascendant)
- Pluto (modern ruler) — In domicile, extremely strong

**Major Configurations:**
- Stellium in Scorpio/12th
- Venus-Jupiter conjunction (tight 1°08' orb)
- Mercury-Saturn trine (Water trine)
- Sun square Uranus-Neptune (generational tension)
- MC trine Moon (public role aligned with emotional nature)

### 8.2 Profile Data Schema

```typescript
interface AstroProfile {
  id: string;
  name: string;
  dateOfBirth: Date;
  timeOfBirth: string; // HH:MM
  cityOfBirth: string;
  coordinates: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
  chartImage?: string; // URL to chart graphic
  
  // Calculated Data
  placements: NatalPlacement[];
  housePositions: HousePosition[];
  aspects: {
    planetary: NatalAspect[];
    other: NatalAspect[];
  };
  configurations: NatalConfiguration[];
  elementalAnalysis: ElementalAnalysis;
  
  // Derived Insights
  chartRulers: {
    traditional: Planet;
    modern: Planet;
  };
  dominantElement: Element;
  dominantModality: Modality;
  significantDignities: Dignity[];
}

interface NatalPlacement {
  planet: Planet;
  sign: ZodiacSign;
  degree: number;
  minute: number;
  retrograde: boolean;
  house: House;
  decan: Decan;
  dignity?: Dignity;
  isChartRuler?: 'traditional' | 'modern';
}

interface NatalAspect {
  type: Aspect;
  planet1: Planet;
  placement1: NatalPlacement;
  planet2: Planet;
  placement2: NatalPlacement;
  orbDegree: number;
  orbMinute: number;
  direction: 'Applying' | 'Separating';
  exactDate?: Date; // When aspect perfects (for transits)
}

interface ElementalAnalysis {
  fire: number;
  earth: number;
  air: number;
  water: number;
  dominant: Element;
  deficient: Element;
  fireNames: string[];   // Planet names
  earthNames: string[];
  airNames: string[];
  waterNames: string[];
}
```

### 8.3 Profile Views

**Overview Dashboard:**
```
┌─────────────────────────────────────────────────────────────────┐
│  FELIPE FRAGA — Cosmic Blueprint                                │
│  Oct 18, 1994 · 8:10 AM · Rio de Janeiro                        │
├──────────────────────┬──────────────────────────────────────────┤
│                      │                                          │
│   [Chart Image]      │  ☉ Sun in Libra (12th) — Fall           │
│                      │  ☽ Moon in Aries (5th)                   │
│   Scorpio Rising     │  ☿ Mercury in Scorpio (12th) ℞          │
│   Pluto Dominant     │  ♀ Venus in Scorpio (12th) ℞ — Detriment│
│                      │  ♂ Mars in Leo (9th) — Chart Ruler      │
│  [Elemental Balance] │  ... more placements ...                 │
│  ████████░░ Water    │                                          │
│  ██░░░░░░░░ Fire     │  CONFIGURATIONS                          │
│  ██░░░░░░░░ Earth    │  ★ Stellium in Scorpio (12th House)      │
│  █░░░░░░░░░ Air      │  ★ Venus-Jupiter Conjunction             │
│                      │                                          │
└──────────────────────┴──────────────────────────────────────────┘
```

**Placement Detail View:**
- Click any placement → See full interpretation
- Link to universal sign/house/planet information
- AI-generated personal meaning

**Aspect Web View:**
- Personal mandala with aspect lines
- Click any aspect → Interpretation
- Highlight harmonious vs challenging

---

## IX. AI INTEGRATION STRATEGY

### 9.1 Context Design for Claude

The AI features require carefully crafted context to provide accurate, personalized guidance.

**Universal Context (Always Included):**
```markdown
You are the Cosmic Cartographer's wisdom guide, speaking from the perspective 
of a compassionate, psychologically-informed astrologer.

Core Principles:
- The chart shows potential, not fate
- Every placement has gift and shadow expressions
- Growth comes from conscious engagement with challenges
- All 12 archetypes live within every person
- Houses ground abstract energies into life areas

Tone: Warm, wise, inviting, never deterministic
Avoid: "You are..." statements; instead use "This energy invites..." or "This placement suggests..."
```

**Entity Context (When Exploring Specific Entity):**
```markdown
The user is contemplating: [ENTITY_NAME]

Entity Data:
[Full entity JSON]

Related Entities:
[List of connected entities with relationships]

Guide the user's contemplation with:
1. An opening reflection on this archetype
2. 2-3 contemplation questions specific to this entity
3. A practice or invitation for integration
```

**Personal Context (When Profile Exists):**
```markdown
This person's cosmic blueprint:

Birth: [Date, Time, Location]

Key Placements:
- Sun: [Sign, House, Degree, Dignity if any]
- Moon: [Sign, House, Degree]
- Rising: [Sign]
- Mercury: [Sign, House, Degree]
- Chart Ruler: [Planet in Sign, House]

Elemental Balance: Fire [X], Earth [X], Air [X], Water [X]
Dominant Element: [Element]
Deficient Element: [Element]

Notable Configurations:
[List configurations]

When responding, honor:
1. Their elemental nature (speak to dominant element's style)
2. Their Mercury sign (communication preference)
3. Their growth edges (deficient element, challenging aspects)
4. Their gifts (trines, domicile placements)
```

### 9.2 AI Feature Specifications

**Contemplation Chamber:**
```typescript
interface ContemplationRequest {
  entity: Entity;  // What they're contemplating
  profile?: AstroProfile;  // Personal context if available
  previousReflections?: string[];  // Continuity
  mode: 'guided' | 'freeform';
}

interface ContemplationResponse {
  opening: string;  // Poetic reflection
  questions: string[];  // 2-3 contemplation prompts
  practice: string;  // Integration suggestion
  connections: Entity[];  // Related entities to explore
}
```

**Cosmic Counselor Chat:**
```typescript
interface CounselorMessage {
  role: 'user' | 'counselor';
  content: string;
  timestamp: Date;
  referencedEntities?: Entity[];
}

interface CounselorSession {
  profile: AstroProfile;
  topic?: string;  // "career", "relationships", "purpose"
  messages: CounselorMessage[];
  suggestedTopics: string[];  // AI suggests next areas to explore
}
```

### 9.3 Prompt Templates

**Entity Contemplation:**
```
You are guiding a seeker who is contemplating {entity_name} ({entity_type}).

{entity_data}

{personal_context if available}

Offer a contemplation that:
1. Opens with an evocative image or metaphor for this archetype
2. Invites self-inquiry through 2-3 questions
3. Suggests a small practice for integration
4. Connects to their life (if personal context available)

Speak as a wise friend, not a fortune-teller. 
Keep the response under 300 words.
Honor the mystery while offering practical insight.
```

**Personal Placement Interpretation:**
```
Interpret this natal placement for {user_name}:

{placement_data}

Consider:
- The planet's archetypal function
- The sign's mode of expression
- The house's life area
- The decan's specific flavor
- Any dignity involved
- Retrograde status if applicable

Provide:
1. Core meaning (2-3 sentences)
2. Gift expression potential
3. Shadow expression to be aware of
4. Growth invitation
5. One practical application for daily life

{connect to other placements if provided}

Write in second person ("Your..."). 
Be encouraging but honest.
Keep under 400 words.
```

---

## X. FILE STRUCTURE & CODE ORGANIZATION

### 10.1 Complete Directory Structure

```
cosmic-cartographer/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Vercel deployment
├── public/
│   ├── symbols/                    # SVG astrological glyphs
│   │   ├── planets/
│   │   │   ├── sun.svg
│   │   │   ├── moon.svg
│   │   │   └── ...
│   │   ├── signs/
│   │   │   ├── aries.svg
│   │   │   └── ...
│   │   └── aspects/
│   │       ├── conjunction.svg
│   │       └── ...
│   ├── images/
│   │   ├── elements/               # Element realm backgrounds
│   │   └── decans/                 # Constellation imagery
│   ├── audio/                      # Ambient soundscapes (optional)
│   │   ├── fire-realm.mp3
│   │   └── ...
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/                 # Shared UI components
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   ├── Search/
│   │   │   ├── Tooltip/
│   │   │   └── index.ts
│   │   ├── layout/                 # App shell components
│   │   │   ├── Header/
│   │   │   ├── Navigation/
│   │   │   ├── Sidebar/
│   │   │   ├── Footer/
│   │   │   └── index.ts
│   │   ├── mandala/                # Celestial wheel components
│   │   │   ├── CelestialMandala/
│   │   │   ├── ZodiacRing/
│   │   │   ├── DecanRing/
│   │   │   ├── HouseOverlay/
│   │   │   ├── PlanetMarkers/
│   │   │   ├── AspectLines/
│   │   │   └── index.ts
│   │   ├── cards/                  # Entity detail components
│   │   │   ├── EntityCard/
│   │   │   ├── PlanetCard/
│   │   │   ├── SignCard/
│   │   │   ├── HouseCard/
│   │   │   ├── DecanCard/
│   │   │   ├── AspectCard/
│   │   │   ├── DignityCard/
│   │   │   └── index.ts
│   │   ├── graph/                  # Relationship visualization
│   │   │   ├── ConstellationGraph/
│   │   │   ├── GraphNode/
│   │   │   ├── GraphEdge/
│   │   │   ├── GraphControls/
│   │   │   └── index.ts
│   │   ├── elements/               # Element realm components
│   │   │   ├── ElementRealm/
│   │   │   ├── ElementBalance/
│   │   │   ├── ElementThemeProvider/
│   │   │   └── index.ts
│   │   ├── profile/                # Personal chart components
│   │   │   ├── ProfileForm/
│   │   │   ├── ProfileDashboard/
│   │   │   ├── PlacementList/
│   │   │   ├── AspectList/
│   │   │   ├── ConfigurationList/
│   │   │   └── index.ts
│   │   ├── matrix/                 # Matrix visualizations
│   │   │   ├── DignityMatrix/
│   │   │   └── index.ts
│   │   ├── ai/                     # AI integration components
│   │   │   ├── ContemplationChamber/
│   │   │   ├── CosmicCounselor/
│   │   │   ├── AIMessage/
│   │   │   ├── AIInput/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── data/
│   │   ├── universal/              # Universal knowledge base
│   │   │   ├── planets.json
│   │   │   ├── signs.json
│   │   │   ├── houses.json
│   │   │   ├── elements.json
│   │   │   ├── decans.json
│   │   │   ├── aspects.json
│   │   │   ├── configurations.json
│   │   │   ├── dignities.json
│   │   │   └── relationships.json
│   │   ├── personal/               # Example profiles
│   │   │   └── felipe-fraga.json
│   │   └── index.ts                # Data loading utilities
│   ├── hooks/                      # Custom React hooks
│   │   ├── useEntity.ts
│   │   ├── useRelationships.ts
│   │   ├── useProfile.ts
│   │   ├── useElementTheme.ts
│   │   ├── useContemplation.ts
│   │   └── index.ts
│   ├── stores/                     # Zustand stores
│   │   ├── appStore.ts             # Global app state
│   │   ├── profileStore.ts         # Personal profile state
│   │   ├── navigationStore.ts      # Navigation history
│   │   └── index.ts
│   ├── utils/                      # Helper functions
│   │   ├── astroCalculations.ts    # Degree math, aspect detection
│   │   ├── dataTransformers.ts     # JSON parsing utilities
│   │   ├── graphHelpers.ts         # D3 graph utilities
│   │   ├── formatters.ts           # Display formatting
│   │   └── index.ts
│   ├── services/                   # External integrations
│   │   ├── anthropic.ts            # Claude API client
│   │   ├── storage.ts              # Local storage helpers
│   │   └── index.ts
│   ├── styles/                     # Global styles
│   │   ├── globals.css             # Base styles, resets
│   │   ├── themes/                 # Element theme definitions
│   │   │   ├── fire.css
│   │   │   ├── earth.css
│   │   │   ├── air.css
│   │   │   ├── water.css
│   │   │   └── ether.css
│   │   └── animations.css          # Shared animations
│   ├── types/                      # TypeScript definitions
│   │   ├── entities.ts             # Entity interfaces
│   │   ├── profile.ts              # Profile interfaces
│   │   ├── relationships.ts        # Graph types
│   │   ├── ai.ts                   # AI integration types
│   │   └── index.ts
│   ├── pages/                      # Route pages
│   │   ├── Home/
│   │   ├── Explore/
│   │   │   ├── Wheel/
│   │   │   ├── Elements/
│   │   │   ├── Planets/
│   │   │   ├── Signs/
│   │   │   ├── Houses/
│   │   │   └── Graph/
│   │   ├── Entity/
│   │   │   └── [type]/[id]/
│   │   ├── Profile/
│   │   │   ├── Setup/
│   │   │   ├── Dashboard/
│   │   │   └── Placements/
│   │   ├── Contemplate/
│   │   └── Counselor/
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── api/                            # Serverless functions
│   └── contemplate.ts              # Claude API proxy
├── scripts/                        # Build/data scripts
│   ├── parseWisdomBase.ts          # Markdown → JSON
│   └── generateTypes.ts            # Auto-generate types
├── tests/                          # Test files
│   └── ...
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

### 10.2 Key Component Interfaces

**EntityCard Component:**
```typescript
// src/components/cards/EntityCard/EntityCard.tsx

interface EntityCardProps {
  entity: Entity;
  variant?: 'full' | 'compact' | 'mini';
  showConnections?: boolean;
  showContemplation?: boolean;
  isPersonal?: boolean;
  personalPlacement?: NatalPlacement;
  onCompare?: (entity: Entity) => void;
  onContemplate?: (entity: Entity) => void;
}
```

**CelestialMandala Component:**
```typescript
// src/components/mandala/CelestialMandala/CelestialMandala.tsx

interface CelestialMandalaProps {
  showSigns?: boolean;
  showDecans?: boolean;
  showHouses?: boolean;
  showPlanets?: boolean;  // Personal placements
  showAspects?: boolean;
  profile?: AstroProfile;
  selectedEntity?: Entity;
  onSelectEntity?: (entity: Entity) => void;
  zoomLevel?: 'wheel' | 'quadrant' | 'sign' | 'decan';
}
```

**ConstellationGraph Component:**
```typescript
// src/components/graph/ConstellationGraph/ConstellationGraph.tsx

interface ConstellationGraphProps {
  entities: Entity[];
  relationships: Relationship[];
  focusedEntity?: Entity;
  highlightTypes?: RelationshipType[];
  onSelectEntity?: (entity: Entity) => void;
  layoutAlgorithm?: 'force' | 'radial' | 'hierarchical';
}
```

### 10.3 State Management

**App Store:**
```typescript
// src/stores/appStore.ts

interface AppState {
  // Navigation
  selectedEntity: Entity | null;
  comparisonTray: Entity[];
  navigationHistory: Entity[];
  
  // Display
  elementTheme: ElementType;
  viewMode: 'wheel' | 'graph' | 'list';
  showAlchemical: boolean;
  
  // Actions
  selectEntity: (entity: Entity) => void;
  addToComparison: (entity: Entity) => void;
  removeFromComparison: (id: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setElementTheme: (element: ElementType) => void;
}
```

**Profile Store:**
```typescript
// src/stores/profileStore.ts

interface ProfileState {
  // Data
  profile: AstroProfile | null;
  isLoading: boolean;
  
  // Actions
  createProfile: (data: ProfileInput) => void;
  loadProfile: (id: string) => void;
  updateProfile: (updates: Partial<AstroProfile>) => void;
  clearProfile: () => void;
  
  // Computed
  getPlacementForPlanet: (planetId: string) => NatalPlacement | null;
  getAspectsForPlanet: (planetId: string) => NatalAspect[];
}
```

---

## XI. APPENDICES

### Appendix A: Astrological Symbol Reference

| Entity | Unicode | Name |
|--------|---------|------|
| Sun | ☉ | U+2609 |
| Moon | ☽ | U+263D |
| Mercury | ☿ | U+263F |
| Venus | ♀ | U+2640 |
| Mars | ♂ | U+2642 |
| Jupiter | ♃ | U+2643 |
| Saturn | ♄ | U+2644 |
| Uranus | ♅ | U+2645 |
| Neptune | ♆ | U+2646 |
| Pluto | ♇ | U+2647 |
| North Node | ☊ | U+260A |
| South Node | ☋ | U+260B |
| Chiron | ⚷ | U+26B7 |
| Lilith | ⚸ | U+26B8 |
| Fortune | 🜨 | U+1F728 |
| Vertex | Vx | (text) |
| Aries | ♈︎ | U+2648 |
| Taurus | ♉︎ | U+2649 |
| Gemini | ♊︎ | U+264A |
| Cancer | ♋︎ | U+264B |
| Leo | ♌︎ | U+264C |
| Virgo | ♍︎ | U+264D |
| Libra | ♎︎ | U+264E |
| Scorpio | ♏︎ | U+264F |
| Sagittarius | ♐︎ | U+2650 |
| Capricorn | ♑︎ | U+2651 |
| Aquarius | ♒︎ | U+2652 |
| Pisces | ♓︎ | U+2653 |
| Conjunction | ☌ | U+260C |
| Opposition | ☍ | U+260D |
| Trine | △ | U+25B3 |
| Square | □ | U+25A1 |
| Sextile | ⚹ | U+26B9 |
| Fire | 🜂 | U+1F702 |
| Earth | 🜃 | U+1F703 |
| Air | 🜁 | U+1F701 |
| Water | 🜄 | U+1F704 |
| Sulphur | 🜍 | U+1F70D |
| Mercury (Alch) | ☿ | U+263F |
| Salt | 🜔 | U+1F714 |

### Appendix B: Element Color Palettes (Hex)

**Fire Palette:**
- Primary: #FF6B35
- Secondary: #FFE66D
- Tertiary: #F7C548
- Background: #FFF5F0
- Text: #1A0A00

**Earth Palette:**
- Primary: #2D5016
- Secondary: #8B7355
- Tertiary: #C4A77D
- Background: #F5F2ED
- Text: #1A1A0A

**Air Palette:**
- Primary: #4A90D9
- Secondary: #87CEEB
- Tertiary: #B8D4E3
- Background: #F0F7FF
- Text: #0A0A1A

**Water Palette:**
- Primary: #1A5F7A
- Secondary: #57C5B6
- Tertiary: #159895
- Background: #F0FAFA
- Text: #0A1A1A

**Ether Palette:**
- Primary: #9B59B6
- Secondary: #E8D5E8
- Tertiary: #F5E6FF
- Background: #FAF0FF
- Text: #1A0A1A

### Appendix C: API Rate Limits & Costs

**Anthropic Claude API:**
- Model: claude-3-opus (for quality) or claude-3-sonnet (for cost)
- Rate limit: Adjust based on tier
- Estimated cost per contemplation: ~$0.02-0.05
- Recommendation: Implement caching for common requests

---

## DOCUMENT VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2025 | Initial architecture document |
| 2.0 | Jan 2025 | Added personal profile integration, astrological principles, advanced features, complete implementation plan |

---

*This document serves as the foundational blueprint for the Cosmic Cartographer. It should be provided to Claude Code as context when beginning development.*

---

**End of Document**
