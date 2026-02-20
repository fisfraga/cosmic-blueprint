# Lovable Prompt: Cosmic Blueprint Journey - Multi-Page Website with Deep Wisdom Architecture

## Project Overview

Create a sophisticated, multi-page website for **Cosmic Blueprint Journey** that allows for deep exploration of wisdom traditions, progressive learning journeys, and detailed content about the offering. This is a content-rich skeleton structure where each page provides space for substantial information to be added later.

**Purpose:** This is a skeleton/template multi-page website establishing navigation, page structure, and content architecture. Content placeholders will be filled later in Cursor/Claude Code with material from the complete knowledge base and old website HTML.

---

## Design Philosophy & Visual Identity

### Color Palette - "Cosmic Twilight Awakening"

**Primary Colors:**
- **Deep Cosmic Indigo:** `#1a1a3e` - Main backgrounds, navigation
- **Ethereal Purple:** `#6B46C1` - Primary CTAs, active states
- **Sacred Gold:** `#D4AF37` - Highlights, wisdom accents
- **Celestial Blue:** `#4A90E2` - Links, secondary elements

**Secondary Colors:**
- **Mystic Violet:** `#8B5CF6` - Hover states, cards
- **Soft Lavender:** `#E9D5FF` - Light backgrounds, sections
- **Pearl White:** `#F9FAFB` - Text on dark backgrounds
- **Shadow Navy:** `#0F0F23` - Footer, depth layers

**Page-Specific Accent Colors (for variety):**
- **Astrology Page:** Golden yellow `#FCD34D`
- **Human Design Page:** Warm terra cotta `#F87171`
- **Gene Keys Page:** Deep purple `#A78BFA`
- **Numerology Page:** Emerald green `#34D399`
- **Chakras Page:** Rainbow gradient (all 7 chakra colors)
- **Alchemy Page:** Alchemical gold `#D4AF37`

### Typography

**Font Families:**
- **Headings:** `'Playfair Display', serif` - Elegant, spiritual
- **Body Text:** `'Inter', sans-serif` - Clean, readable
- **Accents:** `'Cormorant Garamond', serif` - Sacred quotes

**Font Scales:**
- Page Hero H1: `clamp(2.5rem, 5vw, 4rem)` / 700 weight
- Section H2: `clamp(2rem, 4vw, 3rem)` / 600 weight
- Subsection H3: `clamp(1.5rem, 3vw, 2rem)` / 600 weight
- Body: `1.125rem` (18px) / 400 weight / line-height: 1.7

### Visual Themes

**Sacred Geometry Elements:**
- Page-specific sacred geometry backgrounds
- Subtle patterns unique to each tradition
- Golden ratio layouts

**Cosmic/Celestial Imagery:**
- Deep space backgrounds (subtle)
- Constellation connections between concepts
- Planetary symbols as section dividers

---

## Technical Stack

### Core Framework
```
- Next.js 14+ (App Router with dynamic routes)
- React 18+
- TypeScript
- Tailwind CSS 3+
```

### UI Components & Animation
```
- shadcn/ui (base components)
- Framer Motion (page transitions, animations)
- Radix UI (accessible primitives)
- React Intersection Observer
```

### Navigation & Routing
```
- Next.js App Router
- Active route highlighting
- Breadcrumb navigation
- Smooth page transitions
```

---

## Site Architecture - Multi-Page Structure

### Navigation Flow & Information Architecture

```
┌─────────────────────────────────────────────────┐
│                    HOME                         │
│           (Overview & Gateway)                  │
└─────────────────┬───────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼────────┐  ┌──────▼──────────┐
│  THE OFFERING  │  │  THE JOURNEY    │
│   (What/How)   │  │  (Process/Steps)│
└───────┬────────┘  └──────┬──────────┘
        │                  │
        │         ┌────────┴─────────┐
        │         │                  │
┌───────▼─────────▼──────────────────▼──────────┐
│           WISDOM TRADITIONS                    │
│  (6 Individual Tradition Deep-Dive Pages)     │
├────────────────────────────────────────────────┤
│ Astrology │ Human Design │ Gene Keys          │
│ Numerology │ Chakras │ Alchemy                │
└───────┬────────────────────────────────────────┘
        │
┌───────▼────────────────────────────────────────┐
│  INTEGRATION (How Traditions Connect)          │
└───────┬────────────────────────────────────────┘
        │
┌───────▼────────────────────────────────────────┐
│  YOUR GUIDE (About Felipe)                     │
└───────┬────────────────────────────────────────┘
        │
┌───────▼────────────────────────────────────────┐
│  GET STARTED (Pathways & Application)          │
└────────────────────────────────────────────────┘
```

---

## Global Navigation Component

### Main Navigation Bar

**Structure:**
```
┌─────────────────────────────────────────────────────────┐
│  [LOGO]  Home  |  The Offering  |  The Journey  |       │
│  Wisdom Traditions ▼  |  Integration  |  About  |       │
│  [Get Started - CTA Button]                             │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Sticky navigation (appears/disappears on scroll)
- Blur background when scrolled
- Active page highlighting
- Dropdown for "Wisdom Traditions" (mega menu or simple dropdown)
- Mobile: Hamburger menu with full-screen overlay
- "Get Started" CTA always prominent

**Dropdown/Mega Menu for Wisdom Traditions:**
```
Wisdom Traditions ▼
├── 🌟 Astrology
├── 🧬 Human Design
├── 🔑 Gene Keys
├── 🔢 Numerology
├── 🌈 Chakras
├── 🜃 Alchemy
└── → View Integration (link to Integration page)
```

**Mobile Navigation:**
- Hamburger icon (top right)
- Full-screen overlay menu
- Animated entrance
- Close X button
- Stacked navigation items with icons

---

## Page-by-Page Structure

---

## PAGE 1: HOME (Index/Landing)

**URL:** `/`

**Purpose:** Gateway and overview - inspire, orient, provide clear paths forward

### Sections:

#### 1. Hero Section
```
- Full-height viewport
- Cosmic gradient background with animated stars
- Center content:
  - Overline: "Where Ancient Wisdom Meets Digital Consciousness"
  - H1: "Discover Your Cosmic Blueprint"
  - Subtitle: "Build a Living Digital Temple for Self-Knowledge"
  - Description paragraph (2-3 sentences)
  - Primary CTA: "Explore the Offering"
  - Secondary CTA: "See the Journey"
- Floating Tana workspace preview (subtle)
- Sacred geometry watermark
```

#### 2. The Convergence (Quick Overview)
```
- Two-column: Ancient Wisdom | Modern Technology
- Brief descriptions (3-4 bullets each)
- Synthesis statement
- Visual: Connecting line/Venn diagram
```

#### 3. What This Is
```
- 4-card grid:
  1. Personalized Wisdom Profiles
  2. Digital Temple in Tana
  3. AI Cosmic Copilots
  4. Expert Guidance
- Each card: icon, title, 2-sentence description
- Link to "The Offering" page for details
```

#### 4. Six Wisdom Traditions Preview
```
- 6-card grid (3x2)
- Each card: emoji, name, one-line essence
- Hover: Preview of what it reveals
- Click: Navigate to individual tradition page
- Bottom link: "Explore How They Integrate →"
```

#### 5. The Journey Overview
```
- Visual timeline (simplified, 7 steps)
- Step names only (not full descriptions)
- CTA: "Learn the Complete Process →" (to Journey page)
```

#### 6. Who This Serves
```
- 4 profile cards: Spiritual Seeker, Life Navigator, Conscious Explorer, Knowledge Enthusiast
- Brief descriptions
- Visual icons
```

#### 7. Featured Testimonial
```
- Single large testimonial card
- Quote, name, photo placeholder
- Link: "Read More Stories →"
```

#### 8. Clear Next Steps
```
- Three prominent CTAs:
  1. "Explore the Complete Offering →"
  2. "Understand the Journey →"
  3. "Get Started Now →"
- Trust indicators below
```

#### 9. Footer (Global Component)
```
- Full footer with all links
- Social media
- Quick links to all pages
- Legal links
```

---

## PAGE 2: THE OFFERING

**URL:** `/offering`

**Purpose:** Comprehensive explanation of what participants receive, pricing, pathways

### Sections:

#### 1. Page Hero
```
- H1: "The Complete Cosmic Blueprint Experience"
- Subtitle: "Transform scattered spiritual insights into an integrated system"
- Background: Cosmic theme (consistent but unique)
- Breadcrumb: Home > The Offering
```

#### 2. The Convergence (Detailed)
```
- Expanded version from home page
- Hermetic principles explanation
- McLuhan insight
- Why this matters now
- Visual diagrams/illustrations
```

#### 3. What You'll Receive (Detailed)
```
Four major sections, each expandable or in-depth:

A. Personalized Wisdom Profiles
   - Detailed list of what's included per tradition
   - Sample chart previews (placeholders)
   - How profiles are generated
   - Accuracy and depth explanation

B. Tana Self-Knowledge Hub
   - Architecture overview
   - Dual base structure (Spiritual + Self Wisdom)
   - Fractal navigation explanation
   - Dashboard examples (screenshots/mockups)
   - Semantic structure benefits

C. AI Cosmic Copilots (15+ Agents)
   - Agent types: Tutors, Analyzers, Counselors, Synthesizers
   - How they're personalized
   - Example conversations (placeholder)
   - Configuration details
   - Privacy and consciousness approach

D. Expert Guidance & Support
   - Session structure
   - What happens in coaching
   - Support between sessions
   - Resources included
   - Community access (cohort)
```

#### 4. Two Pathways (Detailed Comparison)
```
Side-by-side detailed cards:

Individual Coaching:
- Investment: $963
- Format details (4x60min or 3x90min)
- What's included (comprehensive list)
- Session-by-session breakdown
- Best for (expanded)
- Add-ons available
- CTA: "Apply for Individual Journey"

Cohort Experience:
- Investment: $497-$1,497 (3 tiers)
- Format (6 weeks, weekly live sessions)
- What's included per tier
- Tier comparison table:
  * Standard ($497)
  * Premium ($997)
  * VIP ($1,497)
- Best for (expanded)
- CTA: "Join the Next Cohort"

Comparison Table (detailed)
- Feature-by-feature comparison
- Checkmarks/X marks
- Highlight differences
```

#### 5. What Makes This Revolutionary
```
4 pillars (expanded from home):
1. Sacred Technology Integration
2. Multi-System Synthesis
3. Practical Mysticism
4. Living Architecture

Each with:
- Icon/visual
- Title
- Expanded description (2-3 paragraphs)
- Real-world examples
- Benefits
```

#### 6. Investment & Value
```
- Value breakdown
- What you're really investing in
- Lifetime access to system
- Cost per session breakdown
- Comparison to individual readings (value prop)
- Payment options (if applicable)
- Refund/satisfaction policy
```

#### 7. Social Proof
```
- 3-6 testimonial cards
- Results stats (participants, satisfaction, etc.)
- Before/after transformation stories
- Video testimonials (placeholders)
```

#### 8. FAQ (Offering-Specific)
```
- Accordion with 10-15 questions
- Questions about:
  * Requirements (birth time, etc.)
  * Tana experience needed
  * Tradition selection
  * Timeline
  * Technical requirements
  * Customization options
  * Adding traditions later
  * Refund policy
```

#### 9. Next Steps CTA
```
- Clear pathway forward
- Three options:
  1. "Apply for Individual Coaching"
  2. "Join Cohort Waitlist"
  3. "Schedule Discovery Call"
- Calendar integration placeholders
```

---

## PAGE 3: THE JOURNEY

**URL:** `/journey`

**Purpose:** Deep dive into the 7-step transformation process, what happens at each stage

### Sections:

#### 1. Page Hero
```
- H1: "Your Seven-Step Transformation Journey"
- Subtitle: "From scattered insights to embodied wisdom"
- Quote: "As Above, So Below" Meets "We Shape Our Tools"
- Breadcrumb: Home > The Journey
```

#### 2. Journey Overview
```
- Visual journey map (large, prominent)
- Three levels of transformation:
  * Technical Mastery (Tana, AI, PKM)
  * Spiritual Understanding (Cosmic blueprint)
  * Embodied Wisdom (Living your design)
- Timeline estimate
- Core promise
```

#### 3. The Seven Steps (Detailed Sections)

**Each step gets its own major section with:**

```
Step Number Badge + Icon
H2: Step Name
Quote: Mindset Shift

Subsections:
- Core Insight (2-3 paragraphs explaining the step)
- What Happens (detailed description)
- Key Deliverables (bulleted list)
- Skills Developed (bulleted list)
- Example Scenarios (real-world applications)
- Common Challenges & How to Navigate
- Success Indicators

Visual Elements:
- Illustrations/diagrams
- Process flow
- Before/after representations
- Connection to next step
```

**Step 1: Cosmic Design Recognition**
- Receiving your blueprint
- Initial profile generation
- Understanding encoded information
- Awakening to design

**Step 2: Digital Temple Foundation**
- Building Tana architecture
- Spiritual + Self Wisdom bases
- Semantic structure
- Sacred container creation

**Step 3: Cosmic Copilot Activation**
- AI agent configuration
- Context loading
- Learning to collaborate with AI
- Contemplation partners

**Step 4: Deep Pattern Integration**
- Understanding placements
- Cross-system validation
- Fractal depth navigation
- Recognition of core truths

**Step 5: Practical Application**
- Decision frameworks
- Daily practices
- Experiment tracking
- From insight to action

**Step 6: Multi-Tradition Synthesis**
- Weaving wisdom web
- Advanced integration
- Pattern clusters
- Unified understanding

**Step 7: Alchemical Evolution (Solve et Coagula)**
- Transcending structure
- Embodied wisdom
- Living your design
- Continuous evolution

#### 4. Integration Practices Section
```
- Exercises for each step
- Journaling prompts
- Contemplation practices
- Shadow work approaches
- Gift activation strategies
```

#### 5. Journey Pathways Comparison
```
- How the journey differs between Individual and Cohort
- Pacing differences
- Support structures
- Customization levels
```

#### 6. What Comes After
```
- Continuous refinement
- Expansion possibilities
- Community contribution
- Becoming a guide for others
```

#### 7. CTA: Choose Your Journey
```
- Link to offering page
- Calendar booking
- Discovery call option
```

---

## PAGE 4: WISDOM TRADITIONS - OVERVIEW/HUB

**URL:** `/wisdom-traditions`

**Purpose:** Hub page explaining integration and linking to individual tradition pages

### Sections:

#### 1. Page Hero
```
- H1: "Six Lenses on Your Soul's Truth"
- Subtitle: "Ancient wisdom systems revealing your cosmic design"
- Visual: 6 tradition symbols interconnected
- Breadcrumb: Home > Wisdom Traditions
```

#### 2. Why Multiple Traditions
```
- Philosophy of integration
- "The diamond facet" metaphor
- Benefits of multi-system approach:
  * Depth through redundancy
  * Nuanced understanding
  * Pattern recognition
  * Holistic perspective
  * Cross-validation
```

#### 3. The Six Traditions (Overview Cards)
```
6 large cards in grid:

Each card:
- Large emoji/icon
- Tradition name
- Essence statement (1 sentence)
- "What it reveals" (5-7 key insights)
- "Explore deeper" link to individual page
- Visual preview (chart/diagram placeholder)

🌟 Astrology - Mapping the Cosmos Within
🧬 Human Design - Your Energetic Operating System
🔑 Gene Keys - The Journey of Transformation
🔢 Numerology - Sacred Mathematics of Self
🌈 Chakras - Energy Centers and Consciousness
🜃 Alchemy - The Art of Transformation
```

#### 4. How They Work Together
```
- Introduction to integration
- Three levels of connection:
  1. Direct Correspondences (with examples)
  2. Thematic Resonance (with examples)
  3. Pattern Clusters (with examples)
- Visual: Integration diagram showing connections
- Link: "Explore Integration in Depth →" (to Integration page)
```

#### 5. Choose Your Focus
```
- Guidance on which traditions to start with
- Personality type recommendations
- Current life situation recommendations
- All traditions vs. focused approach
```

#### 6. CTA: Explore Individual Traditions
```
- 6 buttons linking to each tradition page
- Or "Learn How to Integrate →" link
```

---

## PAGES 5-10: INDIVIDUAL WISDOM TRADITION PAGES

**URLs:**
- `/wisdom-traditions/astrology`
- `/wisdom-traditions/human-design`
- `/wisdom-traditions/gene-keys`
- `/wisdom-traditions/numerology`
- `/wisdom-traditions/chakras`
- `/wisdom-traditions/alchemy`

**Purpose:** Deep dive into each tradition with space for extensive educational content

### Shared Structure for All Tradition Pages:

#### 1. Page Hero
```
- Large emoji/icon for tradition
- H1: [Tradition Name] - [Tagline]
  Example: "Astrology - Mapping the Cosmos Within"
- Subtitle: Essence statement
- Background: Tradition-specific accent color
- Breadcrumb: Home > Wisdom Traditions > [Tradition Name]
```

#### 2. Side Navigation (Sticky)
```
On-page navigation for sections:
- Overview
- Core Concepts
- What You'll Discover
- Key Components
- Integration with Other Traditions
- In Your Blueprint
- Learning Resources
- Get Started
```

#### 3. Overview Section
```
- What this tradition is
- Historical context (brief)
- Why it matters for self-knowledge
- How we use it in the Journey
- Visual: Tradition symbol/diagram
```

#### 4. Core Concepts
```
Major concepts specific to each tradition:

ASTROLOGY:
- Planets (what they represent)
- Signs (how energy expresses)
- Houses (where energy manifests)
- Aspects (how energies relate)
- Timing (transits, progressions)

HUMAN DESIGN:
- Types & Strategy
- Authority
- Centers (defined/open)
- Gates & Channels
- Profiles
- Variables

GENE KEYS:
- Shadow/Gift/Siddhi spectrum
- 64 Keys overview
- Hologenetic Profile
- Sequences (Life's Work, Evolution, Radiance, Purpose)
- Contemplation practice

NUMEROLOGY:
- Life Path
- Destiny/Expression
- Soul Urge
- Personality
- Personal Year/Cycles
- Master Numbers

CHAKRAS:
- 7 Main Chakras (each detailed)
- Energy flow
- Blockages & balance
- Activation practices
- Subtle body

ALCHEMY:
- 7 Stages of transformation
- Planetary correspondences
- Elements (Fire, Water, Air, Earth)
- Solve et Coagula principle
- Integration with astrology

Each concept:
- H3 title
- Explanation (2-3 paragraphs)
- Visual aid (diagram, chart, illustration)
- Example application
```

#### 5. What You'll Discover in Your [Tradition] Profile
```
- Specific insights this tradition provides
- Sample questions it answers
- Personal vs. universal knowledge
- Depth levels available
- Example readings/interpretations (placeholder)
```

#### 6. Key Components Deep Dive
```
Expandable sections or tabs for major components:

Example for Astrology:
- The 10 Planets (each with description)
- The 12 Signs (each with description)
- The 12 Houses (each with description)
- Major Aspects (conjunction, trine, square, etc.)

(Each component gets substantial content space)

Format:
- Component name
- Symbol/glyph
- Description (3-5 paragraphs of content space)
- Keywords
- Themes
- Integration notes
```

#### 7. Integration with Other Traditions
```
- How this tradition connects to others
- Direct correspondences
- Thematic resonances
- Example integrations

For Astrology:
- Planets ↔ Chakras
- Houses ↔ Life Areas (across systems)
- Signs ↔ Elemental qualities

For Human Design:
- Gates ↔ Gene Keys (1:1)
- Centers ↔ Chakras
- Type ↔ Numerology themes
```

#### 8. In Your Cosmic Blueprint Journey
```
- How we work with this tradition in the offering
- Tana structure for this tradition
- AI agents specific to this tradition
- Practices and contemplations
- How you'll explore it in sessions
```

#### 9. Learning Resources (Content Placeholders)
```
- Recommended books
- Teachers/lineages
- Online resources
- Our proprietary materials
- Further exploration paths
```

#### 10. Sample Interpretations
```
- Example chart/profile sections (placeholders)
- Before: Generic interpretation
- After: Integrated, personalized interpretation
- Shows value of multi-system + AI approach
```

#### 11. Navigation to Other Traditions
```
- "Explore another tradition" section
- Cards linking to other 5 traditions
- "View Integration page" link
```

#### 12. CTA: Include This in Your Journey
```
- Button: "Get Started with [Tradition]"
- Link to offering page
- Mention of tradition selection in packages
```

---

## PAGE 11: INTEGRATION

**URL:** `/integration`

**Purpose:** Explain and demonstrate how traditions weave together

### Sections:

#### 1. Page Hero
```
- H1: "The Magic of Integration"
- Subtitle: "When wisdom systems illuminate each other"
- Visual: All 6 traditions interconnected (web/network)
- Breadcrumb: Home > Integration
```

#### 2. Philosophy of Integration
```
- Why one system isn't enough
- The diamond facet metaphor expanded
- Unity through diversity
- Pattern validation vs. nuance addition
- The Solve et Coagula principle
```

#### 3. Three Levels of Integration

**Level 1: Direct Correspondences**
```
- Explanation of direct mappings
- Visual: Correspondence tables

Examples (expandable):
- Planets ↔ Chakras (with detailed table)
- HD Gates ↔ Gene Keys (1:1 mapping)
- Numbers ↔ Astrological themes
- Elements across all systems

Each correspondence:
- Visual diagram
- Explanation of connection
- Why it matters
- How to use in practice
```

**Level 2: Thematic Resonance**
```
- Explanation of thematic connections
- How themes express across traditions

Examples (expandable):
- Fire Element Across All Systems
  * Astrology: Aries, Leo, Sagittarius
  * Chakras: Solar Plexus, Root aspects
  * HD: Manifestor energy, Ego center
  * Alchemy: Calcination stage
  * Gene Keys: Active, yang gifts
  * Numerology: 1, 3, 5 energies

- Water Element Across All Systems
  [Similar structure]

- Communication Theme
  [Similar structure]

- Transformation Theme
  [Similar structure]
```

**Level 3: Pattern Clusters & Archetypes**
```
- Explanation of archetypal patterns
- How to recognize your archetype(s)

Example Archetypes (each expandable):

The Seeker:
- Astrology indicators
- HD indicators
- Gene Keys themes
- Numerology numbers
- Chakra emphasis
- Alchemical stage
- Integrated interpretation

The Healer:
[Similar structure]

The Creator:
[Similar structure]

The Leader:
[Similar structure]

The Mystic:
[Similar structure]

The Teacher:
[Similar structure]
```

#### 4. Integration in Practice
```
- Real examples of integrated readings
- Case studies (placeholder)
- Before: Separate system readings
- After: Integrated synthesis
- The "aha" moments of integration
```

#### 5. How We Integrate in Tana
```
- Technical architecture for integration
- Synthesis dashboards explained
- Examples of unified views:
  * Core Identity Dashboard
  * Decision-Making Framework
  * Life Purpose Synthesis
  * Shadow Work Integration Map
  * Gift Activation Plan
  * Current Cycle Focus

Each with:
- Screenshot/mockup
- Explanation
- What insights emerge
```

#### 6. AI-Powered Synthesis
```
- How AI agents facilitate integration
- Cross-system interpretation commands
- Pattern recognition AI
- Synthesis analysis examples
- The role of AI in seeing connections
```

#### 7. Fractal Depth Navigation
```
- Explanation of 4 levels:
  1. Overview (10,000 ft)
  2. Component (1,000 ft)
  3. Relationship (100 ft)
  4. Synthesis (Ground level)
- How to navigate between levels
- When to zoom in/out
- Visual: Zoom metaphor diagram
```

#### 8. Integration Exercises
```
- Step-by-step practices:
  * Cross-System Core Identity
  * Decision-Making Synthesis
  * Life Purpose Weaving
  * Current Cycle Integration
- Journaling prompts
- Contemplation practices
```

#### 9. The Ultimate Goal: Solve et Coagula
```
- Using structure to transcend structure
- From organized knowledge to direct knowing
- Living AS your design, not FROM your chart
- The boat across the river metaphor
- When the system becomes transparent
```

#### 10. CTA: Experience Integration
```
- "Begin Your Integrated Journey"
- Link to offering page
- Discovery call option
```

---

## PAGE 12: YOUR GUIDE (About Felipe)

**URL:** `/about`

**Purpose:** Build trust, establish credibility, share story

### Sections:

#### 1. Page Hero
```
- Large professional photo (left or center)
- H1: "Felipe 'Fis' Fraga"
- Subtitle: "The Bridge-Builder Between Worlds"
- Tagline: "Millennial Mystic with Technical Credentials"
- Breadcrumb: Home > About
```

#### 2. The Story (Personal Narrative)
```
- How Felipe came to this work
- The bridge between tech and spirituality
- Personal journey with wisdom traditions
- Why this matters to him
- The vision for the work

Written in first person or narrative style
Space for 800-1000 word story
```

#### 3. Two Worlds, One Vision

**Technical Mastery Section:**
```
- MSc in Computer Science (AI specialization)
- Official Tana Ambassador
- 6+ years teaching knowledge management
- AI systems expertise
- Semantic structure design
- Digital consciousness research

Each credential:
- Icon/badge
- Title/degree/role
- Institution/context
- Relevance to this work
```

**Spiritual Depth Section:**
```
- 7+ years consciousness studies
- Wisdom traditions training
- Quantum physics & unified field theory
- Specific tradition certifications/studies
- Teachers and lineages
- Personal practice depth

Each element:
- Icon/symbol
- Area of study
- Teachers/schools
- How it informs the work
```

#### 4. The Unique Position
```
- Why both tech AND spirituality matter
- The millennial perspective
- Speaking both languages
- Creating bridges for others
- The sacred technology vision

Quote callout:
"I don't just teach Tana and AI. I don't just share spiritual wisdom. I help you build living systems where technology becomes a mirror for your soul, and ancient knowledge becomes actionable wisdom for modern life."
```

#### 5. Teaching Philosophy
```
- How Felipe approaches coaching
- Values in the work:
  * Authenticity over performance
  * Integration over accumulation
  * Embodiment over information
  * Sacred technology over soulless tools
  * Community over isolation
- What makes his approach different
```

#### 6. Tana Ambassador Work
```
- Role as official ambassador
- Community contributions
- Templates created
- Teachings shared
- Impact on Tana community
- Links to Tana resources
```

#### 7. Student Testimonials
```
- 5-6 detailed testimonials
- Video testimonials (placeholders)
- Transformation stories
- What students say about working with Felipe
- Before/after insights
```

#### 8. Media & Features
```
- Podcast appearances (placeholders)
- Articles written/featured in
- Workshops taught
- Cohorts run
- Community recognition
```

#### 9. Personal Touch
```
- Beyond the credentials
- Interests and inspirations
- Life philosophy
- Current explorations
- What brings joy
- How Felipe lives the work

Humanizing section - photos, personal shares
```

#### 10. CTA: Work with Felipe
```
- "Begin Your Journey with Felipe"
- Application/discovery call
- Choose pathway (individual/cohort)
```

---

## PAGE 13: GET STARTED

**URL:** `/get-started`

**Purpose:** Application/booking hub, clear next steps, pathway selection

### Sections:

#### 1. Page Hero
```
- H1: "Ready to Discover Your Cosmic Blueprint?"
- Subtitle: "Choose your pathway to transformation"
- Visual: Cosmic gateway/portal imagery
- Breadcrumb: Home > Get Started
```

#### 2. Two Pathways Overview
```
Quick comparison:
- Individual Coaching ($963) - Deep, personalized
- Cohort Experience ($497-$1,497) - Community learning
- Visual comparison graphic
- Link: "See detailed comparison" (to Offering page)
```

#### 3. Individual Coaching Application

**Section Layout:**
```
Left side: Details card
- Investment: $963
- Format: 4x60 or 3x90 sessions
- What's included (comprehensive list)
- Who it's for
- Next cohort/availability

Right side: Application form
- Name, email, phone
- Birth information (date, time, location)
- Which traditions interested in
- Current life situation (text area)
- What you hope to gain (text area)
- How you found us
- Preferred start timeframe
- Additional questions

Submit button: "Submit Application"

Below form:
- What happens next
- Response time
- Discovery call mention
```

#### 4. Cohort Experience Registration

**Section Layout:**
```
Cohort Information:
- Next cohort start date
- 6-week format
- Live session schedule
- What's included

Three Tier Cards (side-by-side):

Standard ($497):
- Features list
- Button: "Register for Standard"

Premium ($997):
- Features list
- Badge: "Most Popular"
- Button: "Register for Premium"

VIP ($1,497):
- Features list
- Badge: "Full Experience"
- Button: "Register for VIP"

Early Bird Pricing (if applicable):
- Countdown timer
- Discount information

Waitlist Option:
- If cohort full or between cohorts
- "Join waitlist" form (name, email)
```

#### 5. Not Sure Which Pathway?

**Section Layout:**
```
Help Me Decide:
- Quiz/Questionnaire to recommend pathway
  * 5-7 questions
  * Results: "Based on your answers, we recommend..."

OR

Discovery Call Option:
- Free 30-minute call with Felipe
- Calendar integration (Calendly embed placeholder)
- What we'll discuss
- No obligation
- CTA: "Schedule Your Discovery Call"
```

#### 6. Investment & Payment

**Section Layout:**
```
Understanding Your Investment:
- What you're really investing in
- Payment options
  * Full payment
  * Payment plans (if available)
  * Accepted methods

Financial Support:
- Scholarships (if available)
- Sliding scale (if offered)
- Application process for support

Refund Policy:
- Satisfaction guarantee details
- Timeline
- Process
```

#### 7. What Happens After You Apply

**Timeline Section:**
```
Step-by-step process:

For Individual Coaching:
1. Submit application → Receive confirmation email
2. Review within 48 hours
3. Discovery call scheduled (if needed)
4. Pathway confirmation
5. Pre-work sent
6. First session scheduled
7. Journey begins!

For Cohort:
1. Register → Confirmation email
2. Cohort prep materials sent
3. Community access granted
4. Pre-cohort welcome call
5. Week 1 begins on [date]

Visual: Timeline or checklist
```

#### 8. Preparation & Requirements

**Section Layout:**
```
What You'll Need:
- Birth information accuracy
- Tana account (free/paid)
- Time commitment
- Open mind and heart
- Willingness for self-reflection
- Technical requirements (computer, internet)

Pre-Journey Preparation:
- Gathering birth data
- Tana familiarization (optional)
- Reflection questions
- Intention setting
```

#### 9. FAQ (Get Started Specific)
```
Questions about:
- Application review process
- Start date flexibility
- Payment plans
- Cancellation policy
- Technical issues
- Preparation time
- Between-session support
- After journey support
```

#### 10. Still Have Questions?

**Contact Section:**
```
Contact Options:
- Email: [placeholder]
- WhatsApp: [placeholder] (if applicable)
- Contact form
- Social media links

Office Hours / Response Time:
- When to expect response
- Best way to reach

Alternative Resources:
- Full FAQ page link
- Offering details page link
- Schedule discovery call (again)
```

---

## Global Footer Component (All Pages)

### Footer Structure

```
┌─────────────────────────────────────────────────────────┐
│  COSMIC BLUEPRINT JOURNEY                               │
│  Where ancient wisdom meets digital consciousness       │
│                                                          │
│  ┌──────────────┬──────────────┬──────────────┐        │
│  │   Explore    │   Wisdom     │   Connect    │        │
│  ├──────────────┼──────────────┼──────────────┤        │
│  │ Home         │ Astrology    │ About Felipe │        │
│  │ The Offering │ Human Design │ Get Started  │        │
│  │ The Journey  │ Gene Keys    │ Contact      │        │
│  │ Integration  │ Numerology   │ [Socials]    │        │
│  │              │ Chakras      │              │        │
│  │              │ Alchemy      │              │        │
│  └──────────────┴──────────────┴──────────────┘        │
│                                                          │
│  Trust Badges:                                          │
│  🏅 Tana Ambassador | 💻 MSc Computer Science |         │
│  🌟 7+ Years Wisdom Study | 👥 1000+ Students           │
│                                                          │
│  Legal: Privacy Policy | Terms | Refund Policy          │
│                                                          │
│  © 2025 Felipe Fraga. Built with ❤️ and Claude Code    │
└─────────────────────────────────────────────────────────┘
```

---

## Additional Utility Pages (Optional but Recommended)

### PAGE: 404 Error
```
- Custom 404 page
- "Lost in the cosmos?"
- Helpful links back to main pages
- Search function (if implemented)
- Cosmic/playful design
```

### PAGE: Thank You (Post-Application)
```
- Confirmation message
- What happens next
- Timeline expectations
- Meanwhile: resources to explore
- Social media follow encouragement
```

### PAGE: Privacy Policy
```
- Standard privacy policy
- Data collection practices
- AI/Tana data handling
- Email list management
- Cookie policy
```

### PAGE: Terms of Service
```
- Service agreement
- Intellectual property
- User responsibilities
- Limitation of liability
```

---

## Design System & Shared Components

### Reusable Components Across All Pages

#### 1. Page Hero Component
```typescript
Props:
- title (H1)
- subtitle (string)
- breadcrumb (array)
- background (variant: cosmic, gradient, tradition-specific)
- image (optional)
- cta (optional button)
```

#### 2. Content Section Container
```typescript
Props:
- maxWidth (default 1280px)
- padding (responsive)
- background (color/gradient/none)
- animate (fade-in on scroll)
- id (for anchor links)
```

#### 3. Card Component
```typescript
Variants:
- default (subtle shadow)
- glass (glass-morphism)
- elevated (hover lift)
- tradition (with accent color)

Props:
- variant
- padding
- hover
- clickable (link)
- icon
```

#### 4. Accordion Component
```typescript
- Single or multiple open
- Smooth animations
- Icon rotation
- Accessible
```

#### 5. Tabs Component
```typescript
- Horizontal or vertical
- Smooth content switching
- Active state highlighting
- Accessible
```

#### 6. Modal/Dialog
```typescript
- Backdrop blur
- Accessible
- Smooth animations
- Close on ESC/outside click
```

#### 7. Breadcrumb Component
```typescript
- Auto-generated from route
- Separator customizable
- Current page not linked
- Responsive (collapse on mobile)
```

#### 8. CTA Button Component
```typescript
Variants:
- primary (gradient, bold)
- secondary (outline)
- ghost (text only)

Sizes: sm, md, lg
States: hover, active, loading, disabled
```

#### 9. Testimonial Card
```typescript
Props:
- quote (text)
- author (name + title)
- photo (optional)
- rating/stars (optional)
- variant (small, large, featured)
```

#### 10. Form Components
```typescript
- Input (text, email, tel, date, time)
- Textarea
- Select/Dropdown
- Radio group
- Checkbox
- Date picker
- Validation states
- Error messages
```

---

## Navigation Best Practices

### Mega Menu for Wisdom Traditions
```
When hovering/clicking "Wisdom Traditions" in nav:

┌─────────────────────────────────────────────┐
│  Wisdom Traditions                          │
├─────────────────────────────────────────────┤
│  🌟 Astrology                               │
│     Mapping the Cosmos Within               │
│                                             │
│  🧬 Human Design                            │
│     Your Energetic Operating System         │
│                                             │
│  🔑 Gene Keys                               │
│     The Journey of Transformation           │
│                                             │
│  🔢 Numerology                              │
│     Sacred Mathematics of Self              │
│                                             │
│  🌈 Chakras                                 │
│     Energy Centers and Consciousness        │
│                                             │
│  🜃 Alchemy                                 │
│     The Art of Transformation               │
│                                             │
│  ──────────────────────────────────────    │
│  → View How They Integrate                  │
└─────────────────────────────────────────────┘
```

### Mobile Navigation
```
Full-screen overlay with animated entrance:

┌─────────────────────────────────┐
│  [X Close]                      │
│                                 │
│  Home                           │
│  The Offering                   │
│  The Journey                    │
│  Wisdom Traditions ▼            │
│    🌟 Astrology                 │
│    🧬 Human Design              │
│    🔑 Gene Keys                 │
│    🔢 Numerology                │
│    🌈 Chakras                   │
│    🜃 Alchemy                   │
│    → Integration                │
│  About                          │
│                                 │
│  [Get Started Button]           │
│                                 │
│  [Social Icons]                 │
└─────────────────────────────────┘
```

### Breadcrumb Navigation
```
Appears at top of each page below hero:

Home > Wisdom Traditions > Astrology

- Links to parent pages
- Current page not linked
- Separator: >
- Responsive: Collapse middle on mobile (Home > ... > Current)
```

### In-Page Navigation (Sidebar/Sticky)
```
For long pages (Tradition pages, Journey page):

Sticky sidebar (desktop) or sticky top bar (mobile)

Links to major sections within page:
- Overview
- Core Concepts
- Key Components
- Integration
- Resources
- Get Started

Highlights current section on scroll
Smooth scroll to section on click
```

---

## Animation Strategy

### Page Transitions
```
- Fade between routes
- Smooth, not jarring
- Quick (300-400ms)
```

### Scroll Animations
```
- Fade-in-up for sections (stagger if multiple elements)
- Trigger: When 20% visible
- Once only (not every scroll)
- Respects prefers-reduced-motion
```

### Hover States
```
- Cards: Subtle lift (8px) + shadow increase
- Buttons: Slight scale (1.02) + brightness increase
- Links: Underline appear, color shift
- Images: Slight zoom (1.05)
```

### Loading States
```
- Skeleton screens for content
- Spinner for forms
- Progress bar for multi-step forms
```

---

## Responsive Strategy

### Breakpoints
```
Mobile: 320px - 639px (single column)
Tablet: 640px - 1023px (2 columns mostly)
Desktop: 1024px - 1279px (3-4 columns)
Large: 1280px+ (max-width contained)
```

### Mobile-First Approach
```
- Design for mobile first
- Add complexity for larger screens
- Touch-friendly targets (44px min)
- Readable text without zoom
- Simplified navigation
```

### Desktop Enhancements
```
- Multi-column layouts
- Hover states (not on touch)
- Mega menus
- Sidebar navigation
- Larger imagery
- Parallax effects (subtle)
```

---

## SEO & Metadata Strategy

### Per-Page Metadata
```typescript
Each page should have:
- Unique title: "[Page Name] | Cosmic Blueprint Journey"
- Meta description (150-160 chars)
- Open Graph tags (for social sharing)
- Twitter Card tags
- Canonical URL
- Structured data (JSON-LD)
```

### Example Metadata Structure
```typescript
// For Astrology page:
title: "Astrology - Mapping the Cosmos Within | Cosmic Blueprint Journey"
description: "Discover how astrology reveals your cosmic blueprint through planets, signs, houses, and aspects. Integrate astrology with Human Design, Gene Keys, and more in your personalized wisdom system."
keywords: "astrology, natal chart, birth chart, cosmic blueprint, self-knowledge, wisdom traditions"
og:image: "[astrology page preview image]"
```

---

## Accessibility Requirements

- Semantic HTML5 throughout
- ARIA labels where needed
- Keyboard navigation (focus visible, logical tab order)
- Skip to content link
- Color contrast WCAG AA minimum (AAA where possible)
- Alt text for all images
- Form labels and error states
- Screen reader friendly
- Respects prefers-reduced-motion
- Respects prefers-color-scheme (if dark mode)

---

## Content Management Strategy

### Content Placeholders
```
Use clear placeholder markers:

<ContentBlock
  id="astrology-planets-overview"
  type="rich-text"
  minHeight="400px"
>
  [Placeholder: Detailed explanation of planets in astrology...]
</ContentBlock>

<ImagePlaceholder
  id="astrology-chart-example"
  dimensions="800x600"
  alt="Example natal chart visualization"
/>
```

### Content Types to Accommodate
```
- Long-form text (2000+ words per page section)
- Rich text (bold, italic, links, lists)
- Images (charts, diagrams, photos)
- Videos (embedded YouTube/Vimeo)
- Audio (podcast embeds if applicable)
- Downloadable PDFs (resources)
- External links
- Internal cross-references
```

---

## Performance Optimization

- Image optimization (next/image)
- Lazy loading (images, components)
- Code splitting (per route)
- Font optimization (next/font)
- Minimize JavaScript bundle
- Server-side rendering (Next.js)
- Static generation where possible
- Fast page transitions

---

## File Structure

```
/app
  /(pages)
    /page.tsx                                    # Home
    /offering
      /page.tsx                                  # The Offering
    /journey
      /page.tsx                                  # The Journey
    /wisdom-traditions
      /page.tsx                                  # Wisdom Hub
      /astrology
        /page.tsx                                # Astrology page
      /human-design
        /page.tsx                                # Human Design page
      /gene-keys
        /page.tsx                                # Gene Keys page
      /numerology
        /page.tsx                                # Numerology page
      /chakras
        /page.tsx                                # Chakras page
      /alchemy
        /page.tsx                                # Alchemy page
    /integration
      /page.tsx                                  # Integration page
    /about
      /page.tsx                                  # About Felipe
    /get-started
      /page.tsx                                  # Get Started
  /layout.tsx                                    # Root layout
  /globals.css                                   # Global styles
  /not-found.tsx                                 # 404 page

/components
  /layout
    /Navigation.tsx                              # Global nav
    /Footer.tsx                                  # Global footer
    /Breadcrumb.tsx                              # Breadcrumb component
    /MegaMenu.tsx                                # Wisdom traditions menu

  /ui                                            # shadcn/ui components
    /button.tsx
    /card.tsx
    /accordion.tsx
    /tabs.tsx
    /dialog.tsx
    /form.tsx
    /input.tsx
    /select.tsx

  /sections                                      # Reusable page sections
    /PageHero.tsx
    /CTASection.tsx
    /TestimonialCard.tsx
    /TraditionCard.tsx
    /PricingCard.tsx

  /animations
    /variants.ts                                 # Framer Motion variants

  /icons
    /TraditionIcons.tsx                          # Custom tradition icons
    /SacredGeometry.tsx                          # Sacred geometry SVGs

/lib
  /utils.ts                                      # Utility functions
  /constants.ts                                  # Colors, breakpoints, etc.
  /metadata.ts                                   # SEO metadata helpers

/public
  /images
    /traditions                                  # Tradition-specific images
    /placeholders                                # Placeholder images
  /fonts                                         # Custom fonts if needed

/styles
  /tailwind.css                                  # Tailwind imports
```

---

## Testing Checklist

### Functionality
- [ ] All pages render correctly
- [ ] Navigation works (desktop + mobile)
- [ ] Breadcrumbs accurate on all pages
- [ ] All internal links functional
- [ ] Accordions expand/collapse
- [ ] Tabs switch content
- [ ] Forms validate
- [ ] CTAs link to correct destinations
- [ ] Smooth scroll works

### Responsive
- [ ] Mobile (320px, 375px, 414px)
- [ ] Tablet (768px, 834px)
- [ ] Desktop (1024px, 1280px, 1440px)
- [ ] Large (1920px+)
- [ ] All breakpoints look good
- [ ] No horizontal scroll
- [ ] Touch targets adequate (mobile)

### Performance
- [ ] Lighthouse score > 90 (all metrics)
- [ ] Images optimized
- [ ] No console errors
- [ ] Fast page transitions
- [ ] Smooth animations (60fps)

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus visible states
- [ ] ARIA labels present
- [ ] Color contrast passes
- [ ] Screen reader friendly
- [ ] Alt text on images
- [ ] Form labels present
- [ ] Error states accessible

### SEO
- [ ] Unique titles per page
- [ ] Meta descriptions present
- [ ] Open Graph tags
- [ ] Canonical URLs
- [ ] Structured data
- [ ] Semantic HTML

---

## Initial Prompt for Lovable

**Copy this into Lovable:**

---

Create a sophisticated multi-page website for "Cosmic Blueprint Journey" - a transformative offering bridging ancient wisdom traditions with modern AI and knowledge management.

**Design Identity:**
- Colors: Deep cosmic indigo (#1a1a3e), ethereal purple (#6B46C1), sacred gold (#D4AF37), celestial blue (#4A90E2)
- Fonts: 'Playfair Display' (headings), 'Inter' (body)
- Style: Glass-morphism, cosmic gradients, sacred geometry, spiritual sophistication
- Vibe: Mystical yet modern, spiritual yet professional, warm and inviting

**Core Architecture:**

**Global Navigation** (sticky header):
- Logo/Brand
- Links: Home | The Offering | The Journey | Wisdom Traditions (dropdown) | Integration | About | Get Started (CTA button)
- Wisdom Traditions dropdown: 🌟 Astrology, 🧬 Human Design, 🔑 Gene Keys, 🔢 Numerology, 🌈 Chakras, 🜃 Alchemy, → View Integration
- Mobile: Hamburger menu, full-screen overlay
- Active page highlighting

**Global Footer:**
- 3 columns: Explore (page links) | Wisdom Traditions (all 6) | Connect (about, contact, socials)
- Trust badges (Tana Ambassador, credentials)
- Legal links
- Copyright

**PAGES TO BUILD:**

**1. HOME (/)** - Gateway page
- Hero: Full-height, "Discover Your Cosmic Blueprint", cosmic gradient background, two CTAs
- The Convergence: Two columns (Ancient Wisdom | Modern Technology)
- What This Is: 4-card grid (Profiles, Digital Temple, AI Copilots, Guidance)
- Six Traditions Preview: 3x2 grid, clickable cards linking to individual pages
- Journey Overview: Simplified 7-step timeline
- Who This Serves: 4 profile cards
- Featured Testimonial
- Clear Next Steps: Three prominent CTAs

**2. THE OFFERING (/offering)** - Complete offering details
- Page hero with breadcrumb
- The Convergence (detailed)
- What You'll Receive (4 major sections, each detailed)
- Two Pathways (Individual $963 vs Cohort $497-$1,497, detailed comparison)
- What Makes This Revolutionary (4 pillars expanded)
- Investment & Value
- Social Proof (6 testimonials)
- FAQ (accordion, 15 questions)
- Next Steps CTA

**3. THE JOURNEY (/journey)** - 7-step process deep dive
- Page hero
- Journey Overview (3 levels of transformation)
- 7 Detailed Step Sections (each step gets major section with: core insight, what happens, deliverables, skills, examples, challenges, success indicators)
- Integration Practices
- Journey Pathways Comparison
- What Comes After
- CTA: Choose Your Journey

**4. WISDOM TRADITIONS HUB (/wisdom-traditions)** - Overview and hub
- Page hero with 6 symbols interconnected
- Why Multiple Traditions (philosophy)
- The Six Traditions (6 large cards, each links to detail page)
- How They Work Together (integration overview)
- Choose Your Focus
- CTA: Explore individual traditions

**5-10. INDIVIDUAL TRADITION PAGES** (6 pages)
- URLs: /wisdom-traditions/[tradition-name]
- Each page: Hero with tradition icon/color, Sticky side-nav, Overview, Core Concepts (detailed), What You'll Discover, Key Components Deep Dive (extensive content sections), Integration with Others, In Your Journey, Learning Resources, Sample Interpretations, Navigation to other traditions, CTA

Pages: Astrology, Human Design, Gene Keys, Numerology, Chakras, Alchemy

**11. INTEGRATION (/integration)** - How traditions connect
- Page hero
- Philosophy of Integration
- Three Levels: Direct Correspondences (tables/diagrams), Thematic Resonance (examples), Pattern Clusters (archetypes)
- Integration in Practice (case studies)
- How We Integrate in Tana (dashboards)
- AI-Powered Synthesis
- Fractal Depth Navigation
- Integration Exercises
- Solve et Coagula principle
- CTA: Experience Integration

**12. ABOUT (/about)** - About Felipe
- Hero with photo
- The Story (personal narrative, 800-1000 word space)
- Two Worlds: Technical Mastery + Spiritual Depth (side by side)
- The Unique Position
- Teaching Philosophy
- Tana Ambassador Work
- Student Testimonials (6)
- Media & Features
- Personal Touch
- CTA: Work with Felipe

**13. GET STARTED (/get-started)** - Application hub
- Page hero
- Two Pathways Overview
- Individual Coaching Application (form: name, email, birth info, interests, situation, goals)
- Cohort Registration (3 tier cards with pricing, registration buttons)
- Not Sure? (quiz or discovery call calendar)
- Investment & Payment (details, options)
- What Happens After (timeline)
- Preparation & Requirements
- FAQ (get started specific)
- Contact options

**Additional Pages:**
- 404 error page (custom, cosmic themed)
- Thank you page (post-application confirmation)

**Technical Requirements:**
- Next.js 14+ App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Framer Motion (page transitions, scroll animations, hover effects)
- Fully responsive (mobile-first: 320px, tablet: 768px, desktop: 1024px+)
- Accessible (WCAG AA, keyboard navigation, ARIA)
- SEO optimized (unique titles, meta descriptions, Open Graph tags per page)
- Breadcrumb navigation on all subpages
- Smooth scroll to sections
- Glass-morphism effects

**Reusable Components to Build:**
- PageHero (with breadcrumb)
- Card (multiple variants)
- Button (primary, secondary, ghost)
- Accordion
- Tabs
- Modal/Dialog
- Form components (Input, Textarea, Select, validation)
- TestimonialCard
- TraditionCard (with tradition-specific accent colors)
- CTASection

**Animation Style:**
- Subtle page transitions (fade, 300ms)
- Scroll animations (fade-in-up, stagger children)
- Hover lifts on cards (8px)
- Smooth accordions/tabs
- Respects prefers-reduced-motion

**Content Strategy:**
- Use placeholder content clearly marked
- Keep actual headings and structure
- Accommodate long-form content (2000+ words per page)
- Content injection points for later
- Image placeholders with dimensions
- Form placeholders (actual forms can be refined later)

**Implementation Approach:**
1. Build navigation and global layout
2. Build reusable component library
3. Build Home page
4. Build Offering, Journey, About, Get Started pages
5. Build Wisdom Traditions hub
6. Build 6 individual tradition pages (use template approach)
7. Build Integration page
8. Polish animations, accessibility, responsiveness
9. SEO metadata for all pages

Start with: Navigation component, Footer component, PageHero component, Button, Card, and Home page structure.

Focus on creating a clean, well-organized skeleton that accommodates substantial content to be added later. Ensure navigation flows logically between pages, and each page has clear purpose and next steps.

---

## Iteration Guidance for Lovable

**If Lovable asks for clarification:**

**Navigation structure:** "Sticky nav with dropdown for Wisdom Traditions. Mobile: hamburger menu with full-screen overlay. Footer on every page with comprehensive links."

**Page depth:** "Each tradition page needs substantial content sections - plan for 2000+ words of content per page. Use expandable sections or tabs for organization."

**Content placeholders:** "Clearly mark content areas for later injection. Keep structure and headings real, body text can be placeholder with minimum height constraints."

**Color usage:** "Each tradition gets accent color variant: Astrology (gold), Human Design (terra cotta), Gene Keys (purple), Numerology (green), Chakras (rainbow), Alchemy (gold). Base palette stays consistent."

**Form functionality:** "Forms need validation states, error messages, loading states. Actual submission can be placeholder (console.log for now), will integrate with backend later."

**Responsive priorities:** "Navigation must work perfectly on mobile. Long tradition pages need good mobile reading experience. Forms mobile-friendly."

**Iteration strategy:** "Start with global layout and navigation, then build pages in order of importance: Home, Offering, tradition pages (template approach), then others."

---

## Success Criteria

**The multi-page website is successful if:**

1. **Complete navigation** - All pages accessible, navigation intuitive, breadcrumbs accurate
2. **Clear information architecture** - Logical flow between pages, clear purpose per page
3. **Substantial content structure** - Each page accommodates deep content (especially tradition pages)
4. **Beautiful design** - Cosmic aesthetic consistent, glass-morphism working, tradition-specific accents
5. **Fully responsive** - Works beautifully 320px to 1920px+
6. **Accessible** - Keyboard navigable, semantic HTML, WCAG AA compliant
7. **Performant** - Fast page loads, smooth transitions, optimized
8. **SEO-ready** - Unique metadata per page, structured data, semantic HTML
9. **Form functional** - Application and registration forms with validation
10. **Ready for content** - Clear placeholders for extensive content injection in next phase

---

*This multi-page architecture creates a comprehensive website structure allowing for deep exploration of wisdom traditions, clear offering details, and natural progressive disclosure of information. After building in Lovable, export to Cursor/Claude Code for content injection from the knowledge base, form backend integration, and final deployment.*

**Last Updated:** 2025-10-01
**Created by:** Claude Code for Felipe Fraga
**Next Phase:** Content population in Cursor with full knowledge base access
