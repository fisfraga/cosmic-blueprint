# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cosmic Copilot is a "digital temple for self-discovery" — an interactive knowledge graph explorer integrating three wisdom traditions through a single birth moment:
- **Astrology**: Planets, signs, houses, elements, aspects, dignities, decans, configurations
- **Human Design**: Types, strategies, authorities, centers, gates, channels, profiles, lines, variables
- **Gene Keys**: 64 Gene Keys with shadow/gift/siddhi, codon rings, amino acids, spheres, sequences, trigrams

## Commands

```bash
# Development (run from cosmic-blueprint/)
npm run dev          # Vite dev server (http://localhost:5173) with Claude API proxy
npm run build        # TypeScript check + production build
npm run test         # Vitest in watch mode
npm run test:run     # Vitest single run
vitest run src/services/aspects.test.ts  # Run a single test file
npm run lint         # ESLint
npm run verify       # test:run + build (pre-push check)
```

## Environment Variables

- `ANTHROPIC_API_KEY` in `.env` — required for Contemplation Chamber AI (Claude API)
- `VITE_ASTROLOGY_API_ENABLED=true` in `.env` — enables FreeAstroAPI for natal chart calculation
- `FREEASTRO_API_KEY` — server-side (Vercel) for FreeAstroAPI

## Architecture

### Tech Stack
React 18, TypeScript (strict), Vite, Tailwind CSS, D3.js, Framer Motion, Zustand, React Router, Vitest, `astronomy-engine` for ephemeris calculations.

### Data Layer (`src/data/`)

**Universal Knowledge Base** — JSON files in `src/data/universal/` loaded as type-safe `Map<string, Entity>` via `src/data/index.ts`. This file is the primary import for all entity data and exposes:
- Maps: `planets`, `signs`, `houses`, `elements`, `aspects`, `configurations`, `hdGates`, `hdChannels`, `hdCenters`, `geneKeys`, `codonRings`, `aminoAcids`, `trigrams`, `lines`, etc.
- Utilities: `getEntityById()` (searches all maps), `getGateByDegree()`, `getGeneKeyByZodiacPosition()`, `signPositionToAbsoluteDegree()`, plus dozens of filtering/retrieval functions per entity type.

**Ephemeris** — `src/data/ephemeris/positions-2020-2035.json` contains pre-computed daily planetary positions. The ephemeris service (`src/services/ephemeris.ts`) uses this for fast lookups, falling back to `astronomy-engine` for dates outside range.

**Profile Data** — `src/data/profile/` (static example profiles), `src/data/ilos/` (Intentional Life OS context for AI prompts).

### Type System (`src/types/index.ts`)

All entity types extend `AstroEntity` (id, type, name, symbol). Discriminated by `EntityType` union (30+ types including `'planet'`, `'sign'`, `'hd-gate'`, `'gene-key'`, `'line'`, `'profile-placement'`, etc.). `UniversalEntity` is the union of all entity types.

Profile types: `CosmicProfile` (v2 hybrid format separating immutable `BirthData` from `CalculatedChart`), `AstroProfile`, `GeneKeysProfile`, `HumanDesignProfile`.

### Services (`src/services/`)

- **`chartCalculation.ts`** — Core pipeline: birth data → planetary positions → HD gate activations + GK sphere placements. Derives HD type, authority, profile, definition, channels from gate activations.
- **`ephemeris.ts`** — Planetary position lookup (pre-computed + astronomy-engine fallback). All positions are geocentric ecliptic longitudes.
- **`astrologyAPI.ts`** — External FreeAstroAPI integration for natal chart data (houses, aspects).
- **`contemplation/`** — AI Contemplation Chamber system:
  - `context.ts` — Builds rich system prompts from profile data across all 3 traditions
  - `prompts.ts` — Prompt templates per contemplation type
  - `ilos.ts` — Bridges Intentional Life OS data into AI context
- **`transits.ts`** — Current transit positions, cosmic weather, moon phases
- **`aspects.ts`** — Aspect calculation between planetary positions
- **`entities/registry.ts`** — Unified entity registry with search across all systems
- **`profiles.ts`** / **`profileMigration.ts`** / **`profileValidation.ts`** — Profile CRUD, v1→v2 migration, validation
- **`pathways.ts`** — Guided contemplation journeys with step tracking
- **`insights.ts`** — Save/manage insights from contemplation sessions (localStorage)

### Claude API Integration

Two implementations of the same API proxy:
- **`api/claude.ts`** — Vercel serverless function (production)
- **`vite.config.ts` `claudeApiProxy()`** — Vite dev middleware (local development)

Both proxy `/api/claude` POST requests to Anthropic API with streaming (SSE) and non-streaming support. Uses prompt caching for multi-turn conversations.

### Components (`src/components/`)

- `Layout.tsx` — App shell with header navigation, `<Outlet>` for pages
- `EntityCard.tsx` — Reusable card with element-based coloring
- `CelestialMandala.tsx` — D3.js zodiac wheel visualization
- `ConstellationGraph.tsx` — D3.js force-directed relationship graph
- `ProfileCreationForm.tsx` — Birth data entry form
- `ProfileBodyGraph.tsx` — Human Design body graph visualization
- `CosmicWeatherWidget.tsx` — Current transit display
- `entities/EntityDetailPanel.tsx` — Sidebar panel for entity details
- `entities/EntityPicker.tsx` — Entity search/selection

### Pages & Routing (`src/App.tsx`)

All pages are lazy-loaded. Routes follow a pattern:
- List pages: `/planets`, `/gene-keys`, `/human-design`
- Detail pages: `/planets/:id`, `/gene-keys/:id`, `/human-design/:id`
- Sub-entity routes: `/gene-keys/codon-rings/:id`, `/human-design/centers/:id`
- Profile pages: `/profile`, `/profile/astrology`, `/profile/gene-keys`, `/profile/human-design`
- Profile detail: `/profile/astrology/placements/:planetId`, `/profile/human-design/gates/:gateId`
- Special pages: `/wheel` (mandala), `/graph` (force graph), `/contemplate` (AI), `/transits`, `/pathways`

### State Management

- `ProfileProvider` (React Context in `src/context/`) — Active profile state
- localStorage — Profile persistence, saved insights, pathway progress

### Element-Based Theming

Tailwind config (`tailwind.config.js`) defines color scales for: `fire`, `earth`, `air`, `water` (classical elements), `humandesign` (amber/gold), `genekey` (purple/violet), `neutral` (dark theme). Components derive element color from entity data (e.g., sign's `elementId`).

## Astrological Domain Principles

- Use invitational language ("This energy invites...") not deterministic ("You ARE...")
- Every placement has gift AND shadow expressions
- Houses = WHERE (life areas); Signs = HOW (energy expression)
- Everyone contains all 12 signs — prominence varies by placement
- The "Big Four" (Sun, Moon, Rising, Mercury) are most important for identity
- HD Gates and Gene Keys share 1-64 numbering via I Ching hexagrams
- Gene Keys operate on a frequency spectrum: Shadow → Gift → Siddhi

## Git Workflow

Repository: **https://github.com/fisfraga/cosmic-blueprint** (private)

### After each sprint
```bash
git add .
git commit -m "feat: Sprint X — brief description

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
git push origin main
```

### Commit types
- `feat:` — new feature or sprint completion
- `fix:` — bug fix
- `chore:` — dependency/config/tooling changes
- `docs:` — documentation only
- `refactor:` — code restructuring without behavior change

Always include `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>` footer.

CI runs automatically on every push — check GitHub Actions tab for build status.

## Tana Sync

To push insights or sessions to the Tana ILOS workspace (`Nd-vpOR3Vvg3`):

Use the Tana MCP tools in Claude Code:
```
mcp__tana-local__import_tana_paste
  parentNodeId: Nd-vpOR3Vvg3_CAPTURE_INBOX
  content: [Tana Paste formatted content from tanaSync.ts utilities]
```

Tana Paste export buttons are available directly in the `/insights` and `/sessions` pages of the app for manual clipboard-based export.

## Key Reference Files

- `_Data/Cosmic Copilot Data/CONTEXT.md` — Full project vision and philosophy
- `_Data/Cosmic Copilot Data/cosmic-copilot-system-architecture.md` — Implementation blueprint
- `_Data/Cosmic Copilot Data/cosmic-copilot-data-schema.md` — TypeScript interfaces specification
- `_Workstation/planning/00-MASTER-PLAN-INDEX.md` — Master planning index
- `docs/contemplation-ai-architecture.md` — Contemplation Chamber AI design
