# Lovable Prompt: Cosmic Blueprint Journey Website Template

## Project Overview

Create a sophisticated, spiritually-aligned website template for **Cosmic Blueprint Journey** - a transformative offering that bridges ancient wisdom traditions (Astrology, Human Design, Gene Keys, Numerology, Chakras, Alchemy) with modern AI and knowledge management technology.

**Purpose:** This is a skeleton/template website that establishes the structure, layout, and design system. Content placeholders will be used initially, with actual writing, images, and materials added later in Cursor/Claude Code using the complete knowledge base.

---

## Design Philosophy & Visual Identity

### Color Palette - "Cosmic Twilight Awakening"

**Primary Colors:**
- **Deep Cosmic Indigo:** `#1a1a3e` - Main background, headers
- **Ethereal Purple:** `#6B46C1` - Primary CTAs, accents
- **Sacred Gold:** `#D4AF37` - Highlights, success states, sacred geometry accents
- **Celestial Blue:** `#4A90E2` - Links, secondary CTAs

**Secondary Colors:**
- **Mystic Violet:** `#8B5CF6` - Hover states, cards
- **Soft Lavender:** `#E9D5FF` - Light backgrounds, subtle sections
- **Pearl White:** `#F9FAFB` - Text on dark, clean sections
- **Shadow Navy:** `#0F0F23` - Footer, deep sections

**Semantic Colors:**
- **Wisdom Green:** `#10B981` - Success, activation states
- **Sacred Rose:** `#EC4899` - Love/Heart chakra elements
- **Fire Orange:** `#F59E0B` - Energy, transformation elements

**Gradients:**
- Primary Hero: `linear-gradient(135deg, #1a1a3e 0%, #2d1b4e 50%, #4a2c6d 100%)`
- Card Hover: `linear-gradient(135deg, #6B46C1 0%, #8B5CF6 100%)`
- CTA Button: `linear-gradient(90deg, #6B46C1 0%, #8B5CF6 100%)`

### Typography

**Font Families:**
- **Headings:** `'Playfair Display', serif` - Elegant, spiritual, authoritative
- **Body Text:** `'Inter', sans-serif` - Clean, readable, modern
- **Accents/Special:** `'Cormorant Garamond', serif` - Sacred quotes, special emphasis

**Font Scales:**
- Hero H1: `clamp(2.5rem, 5vw, 4rem)` / 700 weight
- Section H2: `clamp(2rem, 4vw, 3rem)` / 600 weight
- Subsection H3: `clamp(1.5rem, 3vw, 2rem)` / 600 weight
- Body: `1.125rem` (18px) / 400 weight / line-height: 1.7
- Small: `0.875rem` (14px) / 400 weight

### Visual Themes & Motifs

**Sacred Geometry Elements:**
- Subtle flower of life patterns in backgrounds
- Metatron's cube as decorative accents
- Vesica piscis shapes for containers
- Golden ratio proportions in layouts

**Cosmic/Celestial Imagery:**
- Deep space backgrounds with nebulae (subtle, not overwhelming)
- Constellation patterns connecting concepts
- Planetary symbols integrated into section dividers
- Starfield particles (animated, subtle)

**Texture & Depth:**
- Soft gaussian blur for depth layers
- Subtle gradient noise for organic feel
- Glass-morphism for cards (frosted glass effect)
- Parallax scrolling for hero sections

---

## Technical Stack Recommendations

### Core Framework
```
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS 3+
```

### UI Components & Animation
```
- shadcn/ui (for base components)
- Framer Motion (for animations)
- Radix UI (for accessible primitives)
- React Intersection Observer (scroll triggers)
```

### Icons & Graphics
```
- Lucide React (modern icon set)
- Custom SVG sacred geometry
- React Icons (for tradition symbols)
```

### Forms & Validation
```
- React Hook Form
- Zod (schema validation)
```

---

## Site Architecture & Page Structure

### Page: Landing Page (Single Long-form)

**URL:** `/`

#### Section 1: HERO - Above the Fold
```
Components:
- Full-height viewport section (min-height: 100vh)
- Background: Cosmic gradient with subtle animated stars
- Center-aligned content with fade-in animation

Elements:
- Overline text: "Where Ancient Wisdom Meets Digital Consciousness"
- H1: "Discover Your Cosmic Blueprint"
- Subtitle: "Build a Living Digital Temple for Self-Knowledge"
- Subheading paragraph (2-3 sentences about the convergence)
- CTA Primary Button: "Begin Your Journey" (prominent, gradient)
- CTA Secondary Button: "Explore the Experience" (smooth scroll)
- Trust badge: "Created by Tana Ambassador Felipe Fraga"
- Visual: Tana workspace preview overlay (subtle, floating)
- Sacred geometry watermark (background decoration)
```

#### Section 2: THE CONVERGENCE
```
Layout: Two-column (desktop) / Stacked (mobile)

Left Column - "Ancient Wisdom":
- Icon/Symbol (celestial/historical)
- Heading: "The Memory of the Stars"
- 4-5 bullet points
- Decorative border (sacred geometry pattern)

Right Column - "Modern Technology":
- Icon/Symbol (digital/AI)
- Heading: "Digital Consciousness"
- 4-5 bullet points
- Decorative border (tech pattern)

Full-width Synthesis:
- Quote box (special styling)
- "As Above, So Below" Meets "We Shape Our Tools"
- Integration paragraph
- Subtle connecting line animation between columns
```

#### Section 3: WHAT YOU'LL RECEIVE
```
Layout: 4-column grid (desktop) / 2-column (tablet) / 1-column (mobile)

Card Components (x4):
- Glass-morphism card effect
- Icon/Symbol at top
- H3 Card Title
- Short description paragraph
- "Includes:" bulleted list
- Hover: Lift animation + glow effect

Cards:
1. Personalized Wisdom Profiles
2. Tana Self-Knowledge Hub
3. AI Cosmic Copilots
4. Expert Guidance & Support

Visual Elements:
- Screenshot mockups (placeholder images)
- Icon illustrations
- Connecting dots/lines between cards (optional)
```

#### Section 4: SIX WISDOM TRADITIONS
```
Layout: 3x2 Grid (desktop) / 2x3 (tablet) / 1 column (mobile)

Tradition Card Components (x6):
- Circular icon with tradition symbol
- Emoji + Tradition name
- One-line essence statement
- Expandable/collapsible detail section
  - "What it reveals" (3-5 bullets)
  - "How it integrates" note
- Accordion or modal on click

Traditions:
🌟 Astrology
🧬 Human Design
🔑 Gene Keys
🔢 Numerology
🌈 Chakras
🜃 Alchemy

Interaction:
- Hover: Card elevation + color accent
- Click: Expand in place or modal overlay
- Smooth transitions (Framer Motion)
```

#### Section 5: THE JOURNEY (7 Steps)
```
Layout: Vertical timeline / Horizontal scroll (mobile)

Timeline Component:
- Vertical line with nodes for each step
- Alternating left/right content cards (desktop)
- Step number circles on timeline
- Connecting lines with subtle animation

Step Cards (x7):
- Step number + icon
- H3: Step name
- Description paragraph
- Mindset shift quote (italic, highlighted)
- Subtle stagger animation on scroll

Visual:
- Progress indicator
- Journey metaphor illustrations
- Transformation arrows between steps
```

#### Section 6: WHY THIS WORKS
```
Layout: 2x2 Grid or vertical stack

Feature Blocks (x4):
- Icon representation
- H3: Differentiator title
- Description paragraph
- Visual metaphor (Venn diagram, prism, etc.)

Topics:
1. Pattern Validation
2. Nuanced Understanding
3. Fractal Depth
4. Living Evolution

Styling:
- Larger cards than other sections
- Visual diagrams/illustrations
- Background color variation per card
```

#### Section 7: TWO PATHWAYS
```
Layout: Side-by-side comparison cards (desktop) / Stacked (mobile)

Pathway Card Components (x2):

Left Card - Individual Coaching:
- Badge: "Deep Personal Transformation"
- H3: Individual Coaching
- Price: $963 (prominent)
- Format details
- "Includes:" bulleted list (checkmarks)
- "Best For:" bulleted list (checkmarks)
- CTA Button: "Apply Now" (primary style)

Right Card - Cohort Experience:
- Badge: "Community Learning"
- H3: Cohort Experience
- Price range: $497-$1,497
- Tier badges (Standard/Premium/VIP)
- Format details
- "Includes:" bulleted list
- "Best For:" bulleted list
- CTA Button: "Join Waitlist" (secondary style)

Below Cards:
- Comparison table (collapsible/expandable)
- "Not sure?" → Discovery call CTA
```

#### Section 8: WHO THIS IS FOR
```
Layout: 4-column grid (desktop) / 2x2 (tablet) / 1 column (mobile)

Profile Cards (x4):
- Large emoji/icon
- Profile title with icon
- 4-5 characteristic bullets
- Relatable description

Profiles:
🔮 The Spiritual Seeker
🦋 The Life Navigator
🌌 The Conscious Explorer
💻 The Knowledge Enthusiast

Below Cards:
- "Not For You If..." transparency section
- Bordered box with X marks
- Builds trust through honesty
```

#### Section 9: YOUR GUIDE
```
Layout: Split layout - Image left, Bio right (desktop) / Stacked (mobile)

Components:
- Professional photo (placeholder)
- Name + Title/Tagline
- "The Bridge-Builder Between Worlds"
- Bio sections:
  - Technical Mastery (with icons)
  - Spiritual Depth (with icons)
  - Unique Position
- Pull quote (highlighted)
- Credentials badges/icons
- CTA: "Book a Discovery Call"

Styling:
- Warm, personal feel
- Credibility without coldness
- Trust-building layout
```

#### Section 10: WHAT MAKES THIS DIFFERENT
```
Layout: 4-column grid or 2x2

Pillar Cards (x4):
- Icon/symbol
- H3: Pillar title
- Subtitle
- 3-4 supporting bullets
- Distinctive color accent per card

Pillars:
1. Sacred Technology Integration
2. Multi-System Synthesis
3. Practical Mysticism
4. Living Architecture
```

#### Section 11: TESTIMONIALS / SOCIAL PROOF
```
Layout: 3-column grid or carousel

Testimonial Card Components:
- Quote text (larger font)
- Client name + title
- Optional photo (circular)
- Star rating or spiritual symbol
- Card with soft shadow

Optional: Carousel/slider for mobile
Animation: Fade in on scroll

Stats Section (below testimonials):
- 4 stat boxes (participants, traditions, hours, satisfaction)
- Large numbers with labels
- Icon for each stat
```

#### Section 12: FAQ
```
Layout: Single column, center-aligned, max-width container

Component: Accordion
- Question as heading (click to expand)
- Answer paragraph (smooth expand/collapse)
- Icon indicator (chevron/plus)

Questions: 8-10 common FAQs
- Birth time requirements
- Tana experience
- Customization options
- Timeline
- Adding traditions
- Religious compatibility
- AI personalization
- Skepticism welcome

Styling:
- Clean, scannable
- Adequate spacing
- Smooth transitions
```

#### Section 13: FINAL CTA
```
Layout: Full-width, centered content, prominent section

Components:
- H2: "Ready to Discover Your Cosmic Blueprint?"
- Supporting paragraph (2-3 sentences)
- Three CTA options (side-by-side cards):

  Card 1: Individual Transformation
  - Icon + Title
  - One-line description
  - Button: "Apply Now"

  Card 2: Community Experience
  - Icon + Title
  - One-line description
  - Button: "Join Waitlist"

  Card 3: Not Sure?
  - Icon + Title
  - One-line description
  - Button: "Schedule Discovery Call"

Below:
- Trust badges (checkmarks)
- Urgency note (limited spaces)
- Social proof reminder

Background:
- Gradient similar to hero
- Elevated from page
```

#### Section 14: FOOTER
```
Layout: Multi-column footer (4 columns desktop / 2 tablet / 1 mobile)

Columns:
1. Brand Column:
   - Logo/Brand name
   - Tagline
   - Brief description
   - Social media icons

2. Quick Links:
   - About Felipe
   - Individual Coaching
   - Cohort Experience
   - Wisdom Traditions
   - Resources

3. Resources:
   - Sample Dashboards
   - Free Resources
   - Blog/Articles (future)
   - Contact

4. Trust & Legal:
   - Tana Ambassador badge
   - Years of experience
   - Student count
   - Privacy Policy
   - Terms of Service
   - Refund Policy

Bottom Bar:
- Copyright notice
- Built with [tech stack] + Claude Code
- Last updated
```

---

## Component Library to Build

### 1. Reusable Components

#### Button Component
```typescript
Variants:
- primary (gradient, bold)
- secondary (outline, ghost)
- ghost (text only)

Sizes:
- sm, md, lg

States:
- default, hover, active, disabled

Props:
- variant, size, fullWidth, icon, loading
```

#### Card Component
```typescript
Variants:
- default (subtle shadow)
- glass (glass-morphism)
- elevated (strong shadow + hover lift)
- gradient (background gradient)

Props:
- variant, padding, hover effect, border
```

#### Section Container
```typescript
Features:
- Max-width constraint (1280px)
- Responsive padding
- Optional background color/gradient
- Scroll animation trigger

Props:
- maxWidth, padding, background, animate
```

#### Accordion Component
```typescript
Features:
- Smooth expand/collapse
- Single or multiple open
- Icon rotation animation
- Accessible (ARIA)

Props:
- items array, allowMultiple, variant
```

#### Modal/Dialog Component
```typescript
Features:
- Backdrop blur
- Center-aligned
- Close on outside click
- Accessible (ARIA, focus trap)
- Smooth animations

Props:
- open, onClose, title, size
```

#### Timeline Component
```typescript
Features:
- Vertical/horizontal orientation
- Animated progress line
- Step indicators
- Alternating content (optional)

Props:
- steps array, orientation, animated
```

### 2. Animation Presets (Framer Motion)

```typescript
// Fade in from bottom
fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

// Stagger children
staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Scale on hover
scaleOnHover = {
  whileHover: { scale: 1.05 },
  transition: { duration: 0.3 }
}

// Glass card hover
glassHover = {
  whileHover: {
    boxShadow: "0 20px 60px rgba(107, 70, 193, 0.3)",
    y: -8
  }
}
```

### 3. Layout Components

#### Navigation Bar (if needed for future pages)
```typescript
Features:
- Sticky on scroll
- Blur background when scrolled
- Mobile hamburger menu
- Smooth scroll to sections
- CTA button always visible

Optional: Hidden for single-page, or minimal version
```

#### Page Wrapper
```typescript
Features:
- Common layout structure
- SEO meta tags
- Analytics setup (placeholder)
- Font loading
```

---

## Responsive Breakpoints

```css
Mobile: 320px - 639px
Tablet: 640px - 1023px
Desktop: 1024px - 1279px
Large Desktop: 1280px+

Tailwind Breakpoints:
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

## Accessibility Requirements

- Semantic HTML5 elements
- ARIA labels where needed
- Keyboard navigation support
- Focus visible states
- Color contrast WCAG AA minimum
- Alt text placeholders for images
- Screen reader friendly
- Reduced motion preference support

---

## Content Placeholders Strategy

Since this is a skeleton/template, use:

**Headings:** Keep actual headings from content structure
**Body Text:** Lorem ipsum or meaningful placeholder text
**Images:**
- Use placeholder image services (e.g., unsplash.com/placeholder)
- Or SVG placeholders with dimensions
- Label placeholders clearly for later replacement

**Lists:** Keep bullet structure with placeholder items
**CTAs:** Keep actual CTA text (it's short and final)

**Mark sections for content injection:**
```typescript
// Example:
<ContentPlaceholder
  id="hero-subheadline"
  type="paragraph"
  lines={3}
/>
```

---

## Best Practices for Lovable Development

### 1. Start with Structure First
- Build HTML structure and layout before styling
- Ensure responsive skeleton works at all breakpoints
- Use semantic HTML elements

### 2. Component-First Approach
- Build reusable components early
- Start with Button, Card, Section container
- Then compose sections from components

### 3. Design System Early
- Define color variables first (CSS custom properties or Tailwind config)
- Set up typography scale
- Create spacing system
- Define shadow/elevation scale

### 4. Mobile-First Responsive
- Design mobile layout first
- Progressively enhance for larger screens
- Test at each breakpoint

### 5. Performance Considerations
- Lazy load images
- Code split sections (if applicable)
- Optimize animations (use transform/opacity)
- Minimize re-renders

### 6. Iteration Strategy for Lovable
Since Lovable works in iterations:

**Iteration 1: Structure + Basic Styling**
- HTML structure for all sections
- Basic layout (grid, flexbox)
- Core components (Button, Card, Container)
- Basic responsive behavior

**Iteration 2: Design System + Advanced Styling**
- Full color palette applied
- Typography system
- Glass-morphism effects
- Gradients and backgrounds

**Iteration 3: Interactivity + Animations**
- Hover states
- Scroll animations
- Accordions, modals
- Smooth scrolling

**Iteration 4: Polish + Refinement**
- Micro-interactions
- Accessibility audit
- Performance optimization
- Cross-browser testing

---

## File Structure Recommendation

```
/app
  /page.tsx                 (Landing page)
  /layout.tsx               (Root layout)
  /globals.css              (Global styles)

/components
  /ui                       (shadcn/ui components)
    /button.tsx
    /card.tsx
    /accordion.tsx
    /dialog.tsx

  /sections                 (Page sections)
    /Hero.tsx
    /Convergence.tsx
    /WhatYouReceive.tsx
    /SixTraditions.tsx
    /Journey.tsx
    /TwoPathways.tsx
    /WhoThisIsFor.tsx
    /Guide.tsx
    /Testimonials.tsx
    /FAQ.tsx
    /FinalCTA.tsx
    /Footer.tsx

  /animations               (Framer Motion presets)
    /variants.ts

  /icons                    (Custom SVG icons)
    /sacred-geometry.tsx
    /traditions.tsx

/lib
  /utils.ts                 (Utility functions)
  /constants.ts             (Color palette, breakpoints)

/public
  /images                   (Placeholder images)
  /fonts                    (Custom fonts if needed)

/styles
  /tailwind.css             (Tailwind imports)
```

---

## Testing Checklist

- [ ] All sections render correctly
- [ ] Responsive at all breakpoints (320px, 768px, 1024px, 1440px)
- [ ] All buttons clickable with hover states
- [ ] Accordions expand/collapse smoothly
- [ ] Modals open/close correctly
- [ ] Smooth scroll to sections works
- [ ] Animations trigger on scroll
- [ ] Forms (if any) have validation
- [ ] Loading states functional
- [ ] Keyboard navigation works
- [ ] Color contrast passes WCAG AA
- [ ] Images have alt text placeholders
- [ ] No console errors
- [ ] Lighthouse score > 90 (Performance, Accessibility, Best Practices, SEO)

---

## Handoff Notes for Cursor/Claude Code Phase

After template is built in Lovable, export the code and:

1. **Replace placeholder content** with actual writing from knowledge base
2. **Add real images** from old website HTML version
3. **Implement actual forms** with backend integration (Typeform, Calendly, email)
4. **Add CMS** if desired (Sanity, Contentful) for easy content updates
5. **Configure analytics** (Plausible, Google Analytics)
6. **Set up deployment** (Vercel, Netlify)
7. **Add email sequences** (ConvertKit, Mailchimp integration)
8. **Implement blog** (if desired, MDX-based)

---

## Initial Prompt for Lovable

**Copy this into Lovable:**

---

I need you to create a sophisticated, spiritually-aligned landing page template for "Cosmic Blueprint Journey" - a transformative offering that bridges ancient wisdom traditions with modern AI and knowledge management.

**Design Identity:**
- Color palette: Deep cosmic indigo (#1a1a3e) backgrounds, ethereal purple (#6B46C1) CTAs, sacred gold (#D4AF37) accents, celestial blue (#4A90E2) links
- Fonts: 'Playfair Display' for headings, 'Inter' for body
- Style: Glass-morphism cards, cosmic gradients, sacred geometry accents, subtle starfield animations
- Vibe: Spiritual yet sophisticated, mystical yet modern, warm yet professional

**Structure:** Single long-form landing page with these sections:

1. **Hero Section**: Full-height, cosmic gradient background, center-aligned headline "Discover Your Cosmic Blueprint", subtitle "Build a Living Digital Temple for Self-Knowledge", two CTAs (primary "Begin Your Journey", secondary "Explore Experience"), subtle animated stars

2. **The Convergence**: Two-column layout (mobile stacked) - Left: "Ancient Wisdom / The Memory of the Stars" with bullets, Right: "Modern Technology / Digital Consciousness" with bullets, Full-width synthesis quote box below

3. **What You'll Receive**: 4-column grid (responsive) with glass-morphism cards for: (1) Personalized Wisdom Profiles, (2) Tana Self-Knowledge Hub, (3) AI Cosmic Copilots, (4) Expert Guidance. Each card has icon, title, description, bulleted list. Hover: lift + glow effect

4. **Six Wisdom Traditions**: 3x2 grid with expandable cards for: 🌟 Astrology, 🧬 Human Design, 🔑 Gene Keys, 🔢 Numerology, 🌈 Chakras, 🜃 Alchemy. Each card has emoji, name, essence statement, expandable "What it reveals" section (accordion or modal)

5. **The Journey**: Vertical timeline with 7 steps (alternating left/right on desktop): (1) Cosmic Design Recognition, (2) Digital Temple Foundation, (3) Cosmic Copilot Activation, (4) Deep Pattern Integration, (5) Practical Application, (6) Multi-Tradition Synthesis, (7) Alchemical Evolution. Each has step number, icon, description, mindset shift quote

6. **Why This Works**: 2x2 grid with larger feature blocks: (1) Pattern Validation (Venn diagram visual), (2) Nuanced Understanding (prism visual), (3) Fractal Depth (zoom levels), (4) Living Evolution (growth metaphor)

7. **Two Pathways**: Side-by-side comparison cards - Left: "Individual Coaching $963" with format, includes list, best-for list, "Apply Now" CTA. Right: "Cohort Experience $497-$1,497" with tier badges, includes list, best-for list, "Join Waitlist" CTA. Collapsible comparison table below. "Not sure? Discovery call" CTA

8. **Who This Is For**: 4-column grid with profile cards: 🔮 Spiritual Seeker, 🦋 Life Navigator, 🌌 Conscious Explorer, 💻 Knowledge Enthusiast. Each has large emoji, title, characteristics bullets. "Not For You If..." transparency section below

9. **Your Guide**: Split layout - left: professional photo placeholder, right: "Felipe 'Fis' Fraga - The Millennial Mystic with Technical Credentials" bio with sections: Technical Mastery, Spiritual Journey, Unique Position, pull quote, credentials badges, "Book Discovery Call" CTA

10. **What Makes This Different**: 4 pillar cards: (1) Sacred Technology Integration, (2) Multi-System Synthesis, (3) Practical Mysticism, (4) Living Architecture. Each with icon, title, subtitle, supporting bullets

11. **Testimonials**: 3-column grid with testimonial cards (quote, name, title, photo placeholder). Stats section below with 4 stat boxes

12. **FAQ**: Accordion with 8-10 questions (birth time requirements, Tana experience, customization, timeline, adding traditions, religious compatibility, AI personalization, skepticism welcome)

13. **Final CTA**: Full-width elevated section with heading "Ready to Discover Your Cosmic Blueprint?", supporting text, three CTA cards: "Individual Transformation - Apply Now", "Community Experience - Join Waitlist", "Not Sure? - Schedule Call". Trust badges below

14. **Footer**: 4-column footer (brand info, quick links, resources, legal/trust). Social icons, copyright

**Technical Requirements:**
- Next.js 14+ with TypeScript and Tailwind CSS
- shadcn/ui components
- Framer Motion for animations (fade-in-up on scroll, stagger children, scale on hover)
- Fully responsive (mobile-first: 320px, tablet: 768px, desktop: 1024px+)
- Accessible (WCAG AA, keyboard navigation, ARIA labels)
- Smooth scroll to sections
- Glass-morphism card effects

**Content:** Use placeholder content for now (lorem ipsum for body text, keep actual headings and CTA text). Mark placeholders clearly for later content injection.

**Animation Style:** Subtle, elegant, spiritual - fade-in-up on scroll, hover lift effects, smooth transitions. Avoid overwhelming motion.

Build this in iterations: (1) Structure + basic styling, (2) Full design system + glass effects, (3) Interactivity + animations, (4) Polish + accessibility.

Start with the hero section, navigation structure, and reusable components (Button, Card, Section container, Accordion).

---

## Additional Guidance for Lovable Conversation

**If Lovable asks for clarification:**

- **Color specifics:** "Use the cosmic twilight palette with deep indigo backgrounds, purple accents for CTAs, gold for sacred highlights"
- **Component library:** "Use shadcn/ui as base, customize with glass-morphism effects and cosmic theme"
- **Animation intensity:** "Subtle and elegant - fade in on scroll, gentle hover lifts, avoid aggressive motion"
- **Content strategy:** "This is a template - use placeholder text but keep section structure exact for later content injection"
- **Responsive priorities:** "Mobile-first, ensure single-column mobile layouts, multi-column desktop"
- **Sacred geometry:** "Subtle background decorations, not overwhelming - flower of life patterns, golden ratio spacing"

**If Lovable struggles with specific sections:**

- Simplify first, enhance later (e.g., timeline can start as simple cards, animate later)
- Focus on mobile layout clarity first
- Glass-morphism can be added in polish phase if initial implementation is challenging

**Iterate based on output:**

- Review each section
- Request refinements one section at a time
- Test responsive behavior at each stage
- Validate color contrast and accessibility

---

## Post-Build Checklist for Template

Before handing off to Cursor/Claude Code:

- [ ] All 14 sections implemented
- [ ] Responsive at mobile, tablet, desktop
- [ ] All interactive elements functional (accordions, modals, smooth scroll)
- [ ] Animations trigger on scroll
- [ ] Color palette consistent throughout
- [ ] Typography scale applied correctly
- [ ] Glass-morphism effects working
- [ ] Hover states on all interactive elements
- [ ] Placeholder content clearly marked
- [ ] No console errors
- [ ] Accessibility basics in place (semantic HTML, ARIA)
- [ ] Performance optimized (lazy loading, animation performance)
- [ ] Code exported and ready for handoff

---

## Success Criteria

**The template is successful if:**

1. **Visually stunning** - Captures spiritual sophistication with cosmic aesthetic
2. **Structurally complete** - All 14 sections implemented with correct layout
3. **Responsive** - Works beautifully on all device sizes
4. **Interactive** - Smooth animations, working accordions, hover effects
5. **Accessible** - Keyboard navigable, semantic HTML, WCAG AA color contrast
6. **Performant** - Fast load times, smooth animations
7. **Maintainable** - Clean code, reusable components, easy to update content
8. **Ready for handoff** - Clear placeholders for content injection in next phase

---

*This template will serve as the foundation for the complete Cosmic Blueprint Journey website. After building in Lovable, the code will be imported into Cursor/Claude Code where actual content from the knowledge base will replace placeholders, real images will be added, forms will be connected, and the site will be deployed.*

**Last Updated:** 2025-10-01
**Created by:** Claude Code for Felipe Fraga
**Next Phase:** Content injection in Cursor with full knowledge base access
