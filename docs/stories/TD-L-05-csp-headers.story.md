# Story TD-L-05: CSP Headers + API Key Documentation
**Epic:** EPIC-TD-01 — Technical Debt Resolution
**Sprint:** L
**Status:** Ready
**Points:** 2
**Agent:** @dev (Dex)

---

## Description

Two related security hygiene items identified in the QA Gate review (GAP-04 and GAP-05):

1. **No Content Security Policy headers** — The app has no CSP, leaving it open to XSS via injected scripts.
2. **API key exposure risk** — The Anthropic/OpenRouter key is used in the Vercel function but there is no documentation about how it should be secured. Developers cloning the repo may accidentally expose it via `VITE_` prefix or client-side logs.

Both are quick wins with no functional impact.

## Acceptance Criteria

### CSP Headers
- [ ] `vercel.json` updated to add CSP header on all routes:
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://api.anthropic.com https://openrouter.ai https://*.supabase.co; frame-ancestors 'none'
  ```
- [ ] App still loads and functions correctly after CSP is applied (no blocked resources)
- [ ] No inline script errors in browser console

### API Key Documentation
- [ ] `docs/guides/api-key-security.md` created documenting:
  - NEVER use `VITE_ANTHROPIC_API_KEY` — `VITE_` prefix exposes to client bundle
  - Use `ANTHROPIC_API_KEY` (server-only) in Vercel environment settings
  - Vercel function (`api/claude.ts`) reads `process.env.ANTHROPIC_API_KEY` server-side only
  - How to set Vercel environment variables (link to Vercel docs)
  - That `.env` is gitignored; `.env.example` (TD-K-06) has the correct variable names
- [ ] `api/claude.ts` contains no `console.log` statements that could expose the key or request details

## Tasks

- [ ] Read `vercel.json` and `api/claude.ts`
- [ ] Add CSP header block to `vercel.json`
- [ ] Test CSP locally (if possible): `npm run build && npm run preview` with network tab open
- [ ] Check `api/claude.ts` for any logging that could expose the API key
- [ ] Create `docs/guides/api-key-security.md`
- [ ] Run `npm run verify`

## Scope

**IN:** CSP via vercel.json, API key security documentation
**OUT:** Nonce-based CSP, report-uri (telemetry), eval removal from build tools, SRI hashes

## Dependencies

TD-K-06 (which creates `.env.example`) should precede this, but it is not blocking.

## Technical Notes

- Tailwind/Vite may inject inline styles — `'unsafe-inline'` for `style-src` is acceptable at this stage. Future story: migrate to hashed inline styles.
- Google Fonts CDN (`fonts.googleapis.com`, `fonts.gstatic.com`) must be explicitly allowed for the font load to work.
- Supabase URL pattern: `*.supabase.co` covers both REST and Realtime endpoints.
- `frame-ancestors 'none'` is equivalent to `X-Frame-Options: DENY` and blocks clickjacking.

## Definition of Done

CSP header present in production response. App loads without console errors. API key security guide created. `npm run verify` passes.
