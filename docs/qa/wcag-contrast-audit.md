# WCAG Contrast Audit — Sprint N (TD-N-04)

**Date:** 2026-02-20
**Standard:** WCAG 2.1 AA (minimum 4.5:1 for normal text, 3:1 for large text)
**Background context:** Dark theme with `neutral-900` (#18181B) and `neutral-950` (#0D0D15) backgrounds

## Issues Found & Fixed

### 1. Earth element colors — CRITICAL
- **Before:** `earth-400` (#3D6A20) on `neutral-900` — ~2.5:1 ratio (FAIL)
- **Before:** `earth-500` (#2D5016) on `neutral-900` — ~1.8:1 ratio (FAIL)
- **Fix:** Lightened earth palette. New `earth-400` (#6B9A45) achieves ~4.8:1
- **Impact:** Earth sign cards, element badges, earth-themed text throughout

### 2. Water element colors — HIGH
- **Before:** `water-400` (#2A7589) on `neutral-900` — ~3.0:1 ratio (FAIL for normal text)
- **Before:** `water-500` (#1A5F7A) on `neutral-900` — ~2.5:1 ratio (FAIL)
- **Fix:** Lightened water palette. New `water-400` (#4A9BB0) achieves ~5.0:1
- **Impact:** Water sign cards, element badges, water-themed text

### 3. Neutral secondary text — MEDIUM
- **Before:** `neutral-500` (#71717A) on `neutral-900` — ~4.0:1 ratio (borderline FAIL)
- **Fix:** Bumped to #8A8A93, achieving ~5.0:1 ratio
- **Impact:** All secondary/muted text across the app (timestamps, descriptions, labels)

## Colors Passing (No Changes Needed)

| Color | Hex | On neutral-900 | Ratio | Status |
|-------|-----|----------------|-------|--------|
| fire-400 | #FF8C5A | Text | ~6.2:1 | PASS |
| fire-500 | #FF6B35 | Text | ~5.0:1 | PASS |
| air-400 | #5CA1E0 | Text | ~5.5:1 | PASS |
| air-500 | #4A90D9 | Text | ~4.8:1 | PASS |
| genekey-400 | #A78BFA | Text | ~5.8:1 | PASS |
| humandesign-400 | #FBBF24 | Text | ~9.5:1 | PASS |
| neutral-400 | #A1A1A3 | Text | ~6.5:1 | PASS |
| neutral-300 | #D1D1D3 | Text | ~11.0:1 | PASS |
| white | #FFFFFF | Text | ~16.8:1 | PASS |

## Updated Color Scales

### Earth (before → after)
| Token | Before | After |
|-------|--------|-------|
| earth-300 | #5D8A3D | #7DA85A |
| earth-400 | #3D6A20 | #6B9A45 |
| earth-500 | #2D5016 | #5A8A35 |
| earth-600 | #234012 | #4A7A28 |
| earth-700 | #1A300E | #3A6A1E |
| earth-secondary | #8B7355 | #A89070 |

### Water (before → after)
| Token | Before | After |
|-------|--------|-------|
| water-300 | #3D8A9A | #5AABBF |
| water-400 | #2A7589 | #4A9BB0 |
| water-500 | #1A5F7A | #3A8BA0 |
| water-600 | #154D63 | #2D7A90 |
| water-700 | #103B4C | #206A80 |
| water-secondary | #57C5B6 | #6DD0C2 |
| water-tertiary | #159895 | #2DB5A8 |

### Neutral
| Token | Before | After |
|-------|--------|-------|
| neutral-500 | #71717A | #8A8A93 |

## Phase 2 Audit: CSS Custom Properties (2026-02-22)

Deeper audit of `src/styles/globals.css` CSS custom properties (semantic text tokens) revealed two additional failures not covered by the initial Tailwind palette audit.

### 4. `--text-tertiary` — AA-Large Only (MEDIUM)
- **Before:** `#6B6B80` on surface-base (`#0D0D15`) — 3.72:1 — passes AA only for large text (≥18px/14px bold)
- **Before:** `#6B6B80` on surface-raised (`#141420`) — 3.51:1 — same issue
- **Used for:** Labels, descriptions, secondary info across all profile tabs and entity pages — often at 12-14px
- **Fix:** `--text-tertiary: #878797` → 5.47:1 on surface-base, 5.16:1 on surface-raised — AA ✓ all surfaces
- **Impact:** Broader than tailwind scale; this semantic token affects the entire app via `text-text-tertiary` classes

### 5. `--text-muted` — FAIL (CRITICAL)
- **Before:** `#4A4A5C` on surface-base (`#0D0D15`) — 2.23:1 — FAILS all thresholds
- **Used for:** EntityLink captions, AuthModal disclaimers, `text-xs` body text; also placeholder text (exempt) and disabled states (exempt)
- **Fix:** `--text-muted: #808090` → 4.98:1 on surface-base, 4.70:1 on surface-raised — AA ✓
- **Note:** Placeholder text and disabled components are WCAG-exempt but fixing the token improves those cases as well

### Tokens Passing (no action needed)
| Token | Value | Min Contrast | Result |
|-------|-------|-------------|--------|
| `--text-primary` | `#FFFFFF` | 19.35:1 on surface-base | AAA ✓ |
| `--text-secondary` | `#A0A0B8` | 6.67:1 on surface-overlay | AA ✓ |
| `--border-subtle` | `#2D2D44` | Border only, exempt | — |
| `--border-default` | `#3D3D58` | Border only, exempt | — |

## Methodology

1. Reviewed all color tokens in `tailwind.config.js` (Phase 1)
2. Calculated contrast ratios against primary backgrounds (neutral-900, neutral-950)
3. Identified tokens used for text that fall below WCAG AA 4.5:1 threshold
4. Adjusted values to meet threshold while preserving visual character (hue, saturation)
5. Verified build passes with updated colors
6. Phase 2 (2026-02-22): Audited `src/styles/globals.css` CSS custom properties
7. Fixed `--text-tertiary` and `--text-muted` semantic tokens — most impactful fixes for body text
