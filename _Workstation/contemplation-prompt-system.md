# Contemplation Chamber: Prompt System Architecture

## Overview

The Contemplation Chamber uses a **Harmonic Resonance Architecture** to create meaningful AI-guided contemplation sessions. This document explains how the prompts are constructed, what data flows to Claude, and how the system creates a personalized experience.

---

## How It Works: The Full Picture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION FLOW                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   1. User selects CATEGORY (Astrology / Human Design / Gene Keys / Cross)  │
│                              ↓                                              │
│   2. User selects CONTEMPLATION TYPE (e.g., Natal Overview, Shadow Work)   │
│                              ↓                                              │
│   3. User selects FOCUS ENTITY (if required - e.g., specific placement)    │
│                              ↓                                              │
│   4. User clicks "Begin Contemplation"                                      │
│                              ↓                                              │
│   5. buildSystemPrompt() assembles 4-6 layers into complete prompt         │
│                              ↓                                              │
│   6. sendContemplation() → POST /api/claude (Vercel serverless)            │
│                              ↓                                              │
│   7. Serverless function calls Claude API (API key stays server-side)      │
│                              ↓                                              │
│   8. Response streamed back to UI (text appears progressively)             │
│                              ↓                                              │
│   9. User can continue conversation with follow-up questions               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Prompt Construction

Every API call to Claude includes a **System Prompt** that is constructed from multiple layers:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SYSTEM PROMPT STRUCTURE                            │
│                          (4,600 - 6,400 tokens)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   LAYER 1: BASE_PROMPT (~800 tokens)                                        │
│   ├── Identity: "You are a Cosmic Guide in the Contemplation Chamber"       │
│   ├── Harmonic Resonance Protocol (5 principles)                            │
│   ├── Three Wisdom Systems Overview                                         │
│   └── Language & Response Guidelines                                        │
│                                                                             │
│   LAYER 2: CATEGORY_PROMPT (~280 tokens)                                    │
│   └── Specific framing for Astrology / HD / GK / Cross-System               │
│                                                                             │
│   LAYER 3: CONTEMPLATION_TYPE_PROMPT (~180 tokens)                          │
│   └── Detailed instructions for the specific type (e.g., shadowWork)        │
│                                                                             │
│   LAYER 4: COMPLETE PROFILE CONTEXT (~3,500 tokens)                         │
│   ├── Profile Header (name, birth data, location)                           │
│   ├── Full Astrological Chart (all placements, aspects, configurations)     │
│   ├── Full Human Design Chart (type, strategy, authority, all gates)        │
│   ├── Full Gene Keys Profile (all sequences and spheres)                    │
│   └── Cross-System Bridges (planet→sphere→gate mappings)                    │
│                                                                             │
│   LAYER 5: TRANSIT CONTEXT (~1,200 tokens) [CONDITIONAL]                    │
│   └── Only included for transitReading contemplation type                   │
│   ├── Current planetary positions (real-time ephemeris)                     │
│   ├── Active transit-to-natal aspects                                       │
│   └── Most significant transits highlighted                                 │
│                                                                             │
│   LAYER 6: FOCUS HIGHLIGHT (~300 tokens) [CONDITIONAL]                      │
│   └── Only included when user selects a specific entity to explore          │
│   └── Detailed breakdown of the focused placement/gate/aspect               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Token Budget Breakdown

| Component | Tokens | Notes |
|-----------|--------|-------|
| BASE_PROMPT | ~800 | Always included |
| CATEGORY_PROMPT | ~280 | Always included (1 of 4) |
| TYPE_PROMPT | ~180 | Always included (1 of 21) |
| Profile Header | ~50 | Always included |
| Astrology Context | ~1,200 | Always included |
| Human Design Context | ~900 | Always included |
| Gene Keys Context | ~800 | Always included |
| Cross-System Bridges | ~300 | Always included |
| Transit Context | ~1,200 | Only for transitReading |
| Focus Highlight | ~300 | Only when entity selected |
| **TOTAL** | **4,600 - 6,400** | Depends on selections |

---

## Code Flow: Button Click to Response

### Step 1: User Clicks "Begin Contemplation"

**File:** `src/pages/ContemplationChamber.tsx`

```typescript
// Line 263 - startContemplation() triggered by button click
const startContemplation = async () => {
  if (!canStartChat) return;  // Validates selections are complete

  setError(null);
  setIsSending(true);

  // Create new session for persistence
  const newSessionId = generateSessionId();
  setCurrentSessionId(newSessionId);

  // Build the complete system prompt (Step 2)
  const systemPrompt = buildSystemPrompt();

  // Send to API (Step 3)
  const response = await sendContemplation(systemPrompt, [
    { role: 'user', content: 'Begin the contemplation session.' },
  ]);

  setIsSending(false);

  if (response.error) {
    setError(response.error);
    return;
  }

  // Display response in chat
  setMessages([{ role: 'assistant', content: response.content || starter }]);
};
```

### Step 2: buildSystemPrompt() Assembles Layers

**File:** `src/pages/ContemplationChamber.tsx` (lines 239-261)

```typescript
const buildSystemPrompt = (): string => {
  if (!category || !contemplationType) return BASE_PROMPT;

  // Create selection object for context formatting
  const selection: ContemplationSelection = {
    category,
    type: contemplationType,
    focus: focusEntity || undefined,
  };

  // Format the complete profile context (includes conditional sections)
  const context = formatProfileContext(profile, selection);

  // Get category-specific prompt
  const categoryPrompt = CATEGORY_PROMPTS[category];

  // Get contemplation type-specific prompt
  const typePrompt = CONTEMPLATION_TYPE_PROMPTS[contemplationType];

  // Assemble all layers into final prompt
  return `${BASE_PROMPT}

${categoryPrompt}

${typePrompt}

---

${context}`;
};
```

### Step 3: sendContemplation() Calls API

**File:** `src/services/claude.ts`

```typescript
const API_URL = '/api/claude';  // Vercel serverless endpoint

export async function sendContemplation(
  systemPrompt: string,
  messages: Message[]
): Promise<ContemplationResponse> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemPrompt,  // Full 4,600-6,400 token prompt
        messages,      // Conversation history array
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    return { content: data.content || '' };
  } catch (error) {
    console.error('Claude API error:', error);
    return {
      content: '',
      error: error instanceof Error ? error.message : 'Failed to connect to Claude API',
    };
  }
}
```

### Step 4: Vercel Serverless Function

**File:** `api/claude.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Security: API key never exposed to client
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  try {
    const { systemPrompt, messages } = req.body;

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Call Claude API with assembled prompt
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,  // The complete multi-layer prompt
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    const textContent = response.content.find(
      (block: { type: string }) => block.type === 'text'
    );

    return res.status(200).json({
      content: textContent?.text || '',
    });
  } catch (error) {
    // Error handling...
  }
}
```

---

## The Harmonic Resonance Protocol

The core philosophy of the prompt system is "Harmonic Resonance" - creating attunement between the AI guide and the user's unique design:

### 5 Principles

1. **MIRRORING** - Speak to what IS, not what should be
2. **HONORING THE PARADOX** - Every shadow contains a gift, every gift casts a shadow
3. **BRIDGING SYSTEMS** - Astrology (WHY) + Human Design (HOW) + Gene Keys (TRANSFORMATION)
4. **INVITING EMBODIMENT** - "How does this land in your body?" over "This means you are..."
5. **TRUSTING THEIR WISDOM** - You illuminate, they integrate

### Language Principles

The prompts explicitly instruct Claude to use:
- "This placement invites..." NOT "You are..."
- "There may be a pattern of..." NOT "You always..."
- "What arises when you consider..." NOT "You should..."
- Honor both/and rather than either/or

---

## Full Chart Context: What Claude Sees

Unlike typical chatbots that only know what the user tells them, our system provides Claude with the **complete cosmic profile** automatically:

### Astrological Chart Section (~1,200 tokens)
```
═══════════════════════════════════════════════════════════════════════════════
                              ASTROLOGICAL CHART
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────┐
│          THE BIG FOUR               │
└─────────────────────────────────────┘
☉ Sun: Libra in 12th House (24°48') [fall]
☽ Moon: Aries in 5th House (12°47')
ASC Ascendant: Scorpio in 1st House (26°52')
☿ Mercury: Scorpio in 12th House (0°59' ℞)

┌─────────────────────────────────────┐
│         ALL PLACEMENTS              │
└─────────────────────────────────────┘
[Full list of 18 planets/points with degrees, houses, dignities]
• Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto
• Chiron, North Node, South Node, Lilith, Part of Fortune, Vertex
• Ascendant, Midheaven

┌─────────────────────────────────────┐
│        ELEMENTAL BALANCE            │
└─────────────────────────────────────┘
🜂 Fire:  2 planets (☽, ♂)
🜃 Earth: 2 planets (♅, ♆)
🜁 Air:   1 planets (☉)
🜄 Water: 5 planets (☿, ♀, ♃, ♄, ♇)

Dominant: WATER | Deficient: AIR

[Plus: Chart Rulers, All Aspects with orbs, Configurations]
```

### Human Design Chart Section (~900 tokens)
```
═══════════════════════════════════════════════════════════════════════════════
                             HUMAN DESIGN CHART
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────┐
│          CORE DESIGN                │
└─────────────────────────────────────┘
Type: Generator
Strategy: Wait to Respond
Authority: Emotional
Profile: 5/1
Definition: Quadruple Split
Incarnation Cross: Left Angle Cross of Limitation (32/42 | 56/60)

┌─────────────────────────────────────┐
│            CENTERS                  │
└─────────────────────────────────────┘
■ DEFINED       Head
■ DEFINED       Ajna
■ DEFINED       Throat
○ Undefined     G Center
[... all 9 centers]

┌─────────────────────────────────────┐
│    PERSONALITY GATES (Conscious)    │
└─────────────────────────────────────┘
Gate 32.5 (☉) - Continuity - Spleen
Gate 42.5 (⊕) - Growth - Sacral
[... all personality gates with planets]

┌─────────────────────────────────────┐
│     DESIGN GATES (Unconscious)      │
└─────────────────────────────────────┘
[... all design gates]

┌─────────────────────────────────────┐
│       DEFINED CHANNELS              │
└─────────────────────────────────────┘
1-8 Channel of Inspiration (Individual)
[... all defined channels with circuit types]
```

### Gene Keys Profile Section (~800 tokens)
```
═══════════════════════════════════════════════════════════════════════════════
                             GENE KEYS PROFILE
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────┐
│  ACTIVATION SEQUENCE (Purpose)      │
└─────────────────────────────────────┘
Life's Work    Key 32.5
               Shadow: Failure → Gift: Preservation → Siddhi: Veneration
               Source: Natal Sun

Evolution      Key 42.5
               Shadow: Expectation → Gift: Detachment → Siddhi: Celebration
               Source: Natal Earth

Radiance       Key 15.2
               Shadow: Dullness → Gift: Magnetism → Siddhi: Florescence
               Source: Natal Moon

Purpose        Key 10.2
               Shadow: Self-Obsession → Gift: Naturalness → Siddhi: Being
               Source: Natal North Node

┌─────────────────────────────────────┐
│    VENUS SEQUENCE (Heart)           │
└─────────────────────────────────────┘
Attraction     Key 15.2 (Moon)
IQ             Key 28.3 (Venus)
EQ             Key 21.6 (Mars)
SQ             Key 54.6 (Jupiter)

┌─────────────────────────────────────┐
│    PEARL SEQUENCE (Prosperity)      │
└─────────────────────────────────────┘
Vocation       Key 32.5 (Sun)
Culture        Key 54.6 (Jupiter)
Pearl          Key 42.5 (Earth)
```

### Cross-System Bridges Section (~300 tokens)
```
═══════════════════════════════════════════════════════════════════════════════
                           CROSS-SYSTEM BRIDGES
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────┐
│    PLANET → SPHERE → GATE MAP       │
└─────────────────────────────────────┘
☉ Sun in Libra → Life's Work Sphere → Gate 32
   Gene Key 32: Failure → Preservation → Veneration

☽ Moon in Aries → Attraction Sphere → Gate 15
   Gene Key 15: Dullness → Magnetism → Florescence

♀ Venus in Scorpio → IQ Sphere → Gate 28
   Gene Key 28: Purposelessness → Totality → Immortality

♂ Mars in Capricorn → EQ Sphere → Gate 21
   Gene Key 21: Control → Authority → Valor
```

### Transit Context Section (~1,200 tokens) [CONDITIONAL]

**Only included when contemplationType === 'transitReading'**

```
═══════════════════════════════════════════════════════════════════════════════
                            CURRENT COSMIC WEATHER
═══════════════════════════════════════════════════════════════════════════════

Date: January 25, 2026
Moon Phase: Waxing Gibbous (78% illuminated)
Retrogrades: Mercury ℞

┌─────────────────────────────────────┐
│     CURRENT PLANETARY POSITIONS     │
└─────────────────────────────────────┘
☉ Sun: Aquarius 5°14'
☽ Moon: Gemini 18°42'
☿ Mercury: Capricorn 12°33' ℞
[... all 10 planets with real-time positions]

┌─────────────────────────────────────┐
│  ACTIVE TRANSITS TO YOUR CHART      │
└─────────────────────────────────────┘

CHALLENGING ASPECTS (Growth Catalysts):
□ Transit Saturn in Aries □ Natal Moon in Aries (orb: 2°15')
  Theme: Emotional restructuring, responsibility in self-expression

HARMONIOUS ASPECTS (Flowing Energy):
△ Transit Jupiter in Cancer △ Natal Venus in Scorpio (orb: 1°48')
  Theme: Expansion in relationships, emotional abundance

┌─────────────────────────────────────┐
│    MOST SIGNIFICANT TRANSITS        │
└─────────────────────────────────────┘
1. Saturn conjunct Moon - Major theme of emotional maturation
2. Jupiter trine Venus - Relationship opportunities expanding
3. Uranus square Sun - Identity transformation in progress
```

### Focus Highlight Section (~300 tokens) [CONDITIONAL]

**Only included when focusEntity is selected**

```
═══════════════════════════════════════════════════════════════════════════════
                     ** CURRENT FOCUS: MERCURY IN SCORPIO **
═══════════════════════════════════════════════════════════════════════════════

Planet: Mercury (☿) - Mind, Communication, Learning
Sign: Scorpio - Fixed Water, ruled by Pluto
House: 12th House - Hidden realms, spirituality, unconscious
Degree: 0°59' (early degree - newly entering this energy)
Status: Retrograde ℞
Dignity: None

Related Aspects:
• Mercury △ Mars (trine, 3°12') - Harmonious
• Mercury □ Jupiter (square, 2°45') - Challenging
• Mercury ☌ Venus (conjunction, 1°18') - Intensifying

Gene Key Connection:
Gate 33 - Retreat (I Ching: Tun)
Shadow: Forgetting → Gift: Mindfulness → Siddhi: Revelation
```

---

## Contemplation Types

### Astrology (6 types)
| Type | Description | Requires Focus? |
|------|-------------|-----------------|
| Natal Overview | Big picture of the celestial blueprint | No |
| Current Transits | How today's sky affects your chart | Yes - Transit Aspect |
| Placement Deep Dive | Single planet/sign/house exploration | Yes - Placement |
| Aspect Exploration | Dialogue between two planets | Yes - Aspect |
| Configuration Reading | Grand patterns (Stellium, T-Square, etc.) | Yes - Configuration |
| Elemental Balance | Fire/Earth/Air/Water distribution | No |

### Human Design (6 types)
| Type | Description | Requires Focus? |
|------|-------------|-----------------|
| Type & Strategy | How to engage with life correctly | No |
| Authority Check-in | Somatic decision-making wisdom | No |
| Gate Contemplation | Specific gate through HD + GK lens | Yes - Gate |
| Channel Exploration | Defined channel energy flow | Yes - Channel |
| Center Awareness | Defined vs undefined center relationship | Yes - Center |
| Profile Lines | Conscious/unconscious role exploration | No |

### Gene Keys (6 types)
| Type | Description | Requires Focus? |
|------|-------------|-----------------|
| Activation Sequence | Path of Purpose (4 spheres) | No |
| Venus Sequence | Path of the Heart (4 spheres) | No |
| Pearl Sequence | Path of Prosperity (3 spheres) | No |
| Shadow Work | Gentle shadow illumination | Yes - Gene Key |
| Gift Activation | Embodying specific gifts | Yes - Gene Key |
| Siddhi Meditation | Highest potential contemplation | Yes - Gene Key |

### Cross-System (3 types)
| Type | Description | Requires Focus? |
|------|-------------|-----------------|
| Gate-Key Bridge | HD + GK perspectives on same hexagram | Yes - Gate/Key |
| Planet-Sphere Synthesis | Astrological planet + GK sphere | No |
| Holistic Reading | All three systems woven together | No |

---

## Conditional Logic

### When Transit Context is Included

```typescript
// In formatProfileContext() - context.ts
if (selection.type === 'transitReading') {
  context += formatTransitContext(profile);  // Adds ~1,200 tokens
}
```

Transit context includes:
- Current date and moon phase
- Real-time planetary positions (from ephemeris)
- All active transit-to-natal aspects
- Top 3 most significant transits with interpretations

### When Focus Highlight is Included

```typescript
// In formatProfileContext() - context.ts
if (selection.focus) {
  context += formatFocusHighlight(profile, selection.focus);  // Adds ~300 tokens
}
```

Focus types and their highlights:
- **placement** - Planet, sign, house, dignity, related aspects
- **aspect** - Both planets, aspect type, orb, nature
- **configuration** - All planets in pattern, geometric meaning
- **gate** - HD gate name, I Ching name, GK spectrum, activations
- **channel** - Both gates, circuit type, theme, connected centers
- **transitAspect** - Transit planet, natal planet, aspect details

---

## File Structure

```
src/
├── pages/
│   └── ContemplationChamber.tsx      # Main UI + buildSystemPrompt()
│
├── services/
│   ├── claude.ts                      # Frontend API client
│   ├── index.ts                       # Exports
│   └── contemplation/
│       ├── index.ts                   # Exports
│       ├── prompts.ts                 # BASE_PROMPT, CATEGORY_PROMPTS, TYPE_PROMPTS
│       └── context.ts                 # formatProfileContext(), getFocusOptions()
│
└── context/
    └── ProfileContext.tsx             # React context for user profile

api/
└── claude.ts                          # Vercel serverless function (API proxy)
```

---

## Key Design Decisions

### 1. Full Chart Always Sent
**Why:** Claude can make connections across the entire chart, noticing patterns the user might not ask about directly. The AI becomes a true holder of their complete design.

### 2. Structured Context Format
**Why:** The ASCII art boxes and clear sections help Claude parse and reference specific parts of the chart easily. It also makes debugging easier when viewing logs.

### 3. Harmonic Resonance Language
**Why:** Astrology, HD, and GK all have invitational philosophies. The prompt reinforces this to prevent Claude from being deterministic or prescriptive.

### 4. Category → Type → Focus Flow
**Why:** Progressive disclosure helps users narrow down what they want to explore without overwhelming them with 20+ options at once.

### 5. Cross-System Bridges
**Why:** The power of having all three systems is in seeing their connections. The bridges section explicitly shows Claude how they map to each other.

### 6. Server-Side API Key
**Why:** The API key stays in the Vercel serverless function, never exposed to the browser. This prevents key theft and allows proper security.

### 7. Same Prompt on Every Message
**Why:** Claude receives the complete profile context on every message in the conversation. This ensures it always has full context for follow-up questions.

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SECURITY MODEL                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Browser (Client)                                                          │
│   ├── React App                                                             │
│   ├── Builds system prompt                                                  │
│   ├── Sends to /api/claude                                                  │
│   └── NEVER sees API key                                                    │
│                              ↓                                              │
│   Vercel Serverless Function (/api/claude)                                  │
│   ├── Receives request from client                                          │
│   ├── Reads ANTHROPIC_API_KEY from environment                              │
│   ├── Calls api.anthropic.com                                               │
│   └── Returns response to client                                            │
│                              ↓                                              │
│   Claude API (api.anthropic.com)                                            │
│   └── Processes request with API key authentication                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

Environment variables:
- `ANTHROPIC_API_KEY` - Set in Vercel dashboard, never exposed to client

---

## Future Enhancements

### Implemented
- [x] Transit Overlays - Real-time transit context for transit readings
- [x] Session Memory - Store contemplation history in localStorage

### Planned
1. **Streaming Responses** - Text appears as Claude generates (in progress)
2. **Prompt Caching** - Cache system prompt to reduce API costs
3. **Journaling Integration** - Save insights from sessions
4. **Multi-Profile** - Compare charts in relationship contemplations
5. **Voice Mode** - Audio contemplation sessions

---

## Testing the System

### View the Complete Prompt
1. Open browser DevTools → Network tab
2. Start a contemplation session
3. Find the request to `/api/claude`
4. Look at the request body → `systemPrompt` field

This shows exactly what Claude receives, including the complete profile context.

### Check Vercel Function Logs
1. Go to Vercel Dashboard → Your Project
2. Click Logs tab
3. Filter by "Functions"
4. See requests to `/api/claude` with timing and status

### Local Development
```bash
# Run with serverless functions
vercel dev

# Or standard dev (calls production API)
npm run dev
```
