# Cosmic Copilot - Architecture Checkpoint Report
**Date:** January 23, 2026
**Purpose:** Clarify deployment URLs, project architecture, and current state

---

## 1. Vercel URL Confusion - EXPLAINED

### The Three URLs You Mentioned

| URL | Owner | What It Is |
|-----|-------|------------|
| `cosmic-copilot.vercel.app` | **Someone else** | NOT your project. Another developer on Vercel happened to create a project named "cosmic-copilot" first and got this URL. This is why it has login, birth chart calculations, etc. - it's a completely different application. |
| `cosmic-copilot-eight.vercel.app` | **You (Felipe)** | YOUR production URL. The `-eight` suffix was added by Vercel because `cosmic-copilot` was already taken. This is where your code deploys. |
| `cosmic-copilot-gs93mi7ay-felipe-fragas-projects-...` | **You (Felipe)** | Preview/deployment URLs. Vercel generates a unique URL for EVERY commit/deployment. These are for testing specific versions. |

### Your Actual Vercel Setup
```
Vercel Account: felipe-fragas-projects-0fed1d2a
Project Name: cosmic-copilot
Production URL: https://cosmic-copilot-eight.vercel.app
GitHub Repo: https://github.com/fisfraga/cosmic-copilot
```

---

## 2. Your Related Projects on Disk

```
/Users/fisfraga/Code/
├── Cosmic Copilot/              ← THIS PROJECT (deployed to cosmic-copilot-eight.vercel.app)
├── Cosmic-Wisdom-Base/          ← Data/research repository
├── cosmic-gateway-temple/       ← Another project (not deployed to Vercel)
├── cosmic-tech-wisdom/          ← Another project (not deployed to Vercel)
└── cosmic-tech-wisdom Backup/   ← Backup
```

---

## 3. Current Cosmic Copilot Architecture

### Tech Stack
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite 5.4
- **Styling:** Tailwind CSS with custom element colors (fire, earth, air, water)
- **Routing:** React Router v6
- **Animations:** Framer Motion
- **Visualizations:** D3.js (for wheel and graph views)
- **State:** React Context (ProfileContext)
- **Storage:** localStorage (for user profile persistence)

### Project Structure
```
src/
├── components/         # Reusable UI components
│   ├── Layout.tsx      # Main app shell with navigation
│   ├── EntityCard.tsx  # Card component for all entities
│   ├── SearchBar.tsx   # Global search
│   ├── Breadcrumb.tsx  # Navigation breadcrumbs
│   ├── BodyGraph.tsx   # Human Design body graph visualization
│   └── ...
├── context/
│   └── ProfileContext.tsx  # User profile state (hardcoded example: Felipe Fraga)
├── data/
│   ├── index.ts        # Data access utilities and Maps
│   └── universal/      # JSON data files
│       ├── planets.json
│       ├── signs.json
│       ├── houses.json
│       ├── elements.json
│       ├── aspects.json
│       ├── gene-keys.json
│       ├── codon-rings.json
│       ├── gk-spheres.json
│       ├── gk-lines.json
│       ├── gk-sequences.json
│       ├── amino-acids.json
│       ├── trigrams.json
│       ├── hd-gates.json
│       ├── hd-centers.json
│       ├── hd-channels.json
│       ├── hd-types.json
│       ├── hd-authorities.json
│       ├── hd-lines.json
│       ├── hd-profiles.json
│       └── ...
├── pages/              # Route pages (lazy-loaded)
│   ├── Home.tsx
│   ├── Profile.tsx     # "My Chart" page
│   ├── Wheel.tsx       # Astrological wheel view
│   ├── Graph.tsx       # Force-directed graph
│   └── ... (45+ pages)
├── types/
│   └── index.ts        # TypeScript interfaces
└── App.tsx             # Routes and providers
```

---

## 4. Current Features

### What EXISTS in Your App (cosmic-copilot-eight.vercel.app)

#### Astrology
- Planets (10) with detail pages
- Zodiac Signs (12) with detail pages
- Houses (12) with detail pages
- Elements (7) with detail pages
- Aspects (10) with detail pages
- Aspect Configurations/Patterns
- Decans
- Dignities Matrix
- Aspect Weaver (interactive tool)

#### Human Design
- Gates (64) with detail pages
- Centers (9) with detail pages
- Channels (36) with detail pages
- Types (5) with detail pages
- Authorities (7) with detail pages
- Lines (6) with detail pages
- Profiles (12) with detail pages
- Variables page
- Body Graph visualization

#### Gene Keys
- All 64 Gene Keys with detail pages
- Codon Rings (21) with detail pages
- Spheres (13) with detail pages
- Sequences (3: Activation, Venus, Pearl)
- Lines (6) with detail pages
- Amino Acids (21)
- Trigrams (8)

#### Profile/Chart Features
- **Cosmic Identity section** showing Sun, Moon, Mercury, Ascendant with:
  - Astrology placement
  - Human Design Gate
  - Gene Key
- Elemental Balance visualization
- All Placements list
- Personal Aspects
- Configurations
- **Human Design Profile section** with Type, Strategy, Authority, Profile, Gates, Centers
- **Gene Keys Profile section** with all three sequences (Activation, Venus, Pearl)

#### Interactive Tools
- Wheel view (D3.js mandala)
- Graph view (force-directed network)
- Element Realms
- Contemplation Chamber
- Search functionality

### What DOESN'T Exist (No Login/Auth)

Your app currently has:
- **NO login system** - It uses a hardcoded example profile (Felipe Fraga)
- **NO user registration**
- **NO birth chart calculation** - Placements are manually defined in code
- **NO database** - All data is in JSON files and localStorage
- **NO backend/API** - It's a static React app

The login/calculation features you saw at `cosmic-copilot.vercel.app` belong to someone else's project.

---

## 5. Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     ProfileContext.tsx                       │
│  (Hardcoded example profile with placements, HD, GK data)   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      src/data/index.ts                       │
│  Loads JSON files → Creates Maps → Exports utilities        │
│  (planets, signs, geneKeys, hdGates, etc.)                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Page Components                        │
│  Use Maps to look up entity data by ID                      │
│  Render cards, lists, detail views                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Build & Deployment

### Build Output (with code-splitting)
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css          (47 KB)
│   ├── index-[hash].js           (496 KB) - main app code + data
│   ├── vendor-react-[hash].js    (164 KB) - React, React Router
│   ├── vendor-motion-[hash].js   (102 KB) - Framer Motion
│   ├── vendor-d3-[hash].js       (68 KB)  - D3.js
│   └── [Page]-[hash].js          (5-20 KB each) - lazy-loaded pages
```

### Deployment Flow
```
Local Code → git push → GitHub → Vercel webhook → Build → Deploy
                                                          ↓
                                    cosmic-copilot-eight.vercel.app
```

---

## 7. What Would Be Needed for Login/Calculations

To add the features you saw on the other site, you would need:

1. **Authentication System**
   - Supabase, Firebase, Auth0, or Clerk
   - User accounts, sessions, protected routes

2. **Database**
   - Store user profiles, birth data
   - Supabase (PostgreSQL), Firebase, or Planetscale

3. **Birth Chart Calculation**
   - Astronomical ephemeris library (Swiss Ephemeris)
   - Server-side calculation (Node.js API or serverless functions)
   - Or use an API service (AstroAPI, etc.)

4. **Backend/API**
   - Vercel serverless functions or separate API
   - Calculate placements from birth datetime + location

---

## 8. Summary

| Question | Answer |
|----------|--------|
| What is cosmic-copilot.vercel.app? | Someone else's project (not yours) |
| What is YOUR production URL? | `cosmic-copilot-eight.vercel.app` |
| Does your app have login? | No |
| Does your app calculate charts? | No (hardcoded data) |
| What does your app do? | Knowledge base explorer for Astrology, Human Design, and Gene Keys with a sample profile |

---

## 9. Next Steps (If You Want Login/Calculations)

1. **Choose auth provider** (Supabase recommended - free tier, easy setup)
2. **Add user registration/login**
3. **Create database schema** for user profiles
4. **Integrate ephemeris calculation** (or API)
5. **Build profile creation flow** (birth date/time/location input)
6. **Calculate and store placements**

Would you like to proceed with adding these features?
