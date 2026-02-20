# Story TD-K-02: Rate Limiting on `/api/claude` Endpoint
**Epic:** EPIC-TD-01 — Technical Debt Resolution
**Sprint:** K
**Status:** Ready
**Points:** 5
**Agent:** @dev (Dex)

---

## Description

The Vercel serverless function `api/claude.ts` proxies requests to the Anthropic API. Currently there is no rate limiting, origin validation, or request size capping. Any actor who discovers this endpoint can make unlimited API calls, generating unbounded costs. This story adds basic protections.

## Acceptance Criteria

- [ ] Requests to `/api/claude` from non-app origins are rejected (CORS validation)
- [ ] Per-IP rate limit applied: max 20 requests per minute (adjustable via env var)
- [ ] Request body size is capped (max 50KB for `systemPrompt` + `messages` combined)
- [ ] Rate limit exceeded returns HTTP 429 with a `Retry-After` header
- [ ] Existing in-app contemplation functionality continues to work normally
- [ ] API key is never exposed in response headers or error messages

## Tasks

- [ ] Read `api/claude.ts` fully before modifying
- [ ] Add `CORS_ALLOWED_ORIGIN` check — reject requests not from `VITE_APP_URL` or `localhost`
- [ ] Implement in-memory rate limiter (Vercel KV or simple Map with TTL) per IP
- [ ] Add `MAX_REQUEST_SIZE_BYTES` check on request body
- [ ] Update `vercel.json` to add origin header if needed
- [ ] Add `VITE_APP_URL` to environment documentation
- [ ] Test: verify 429 is returned after 20 rapid requests
- [ ] Test: verify normal in-app usage is unaffected

## Scope

**IN:** `api/claude.ts` rate limiting, CORS, request size cap
**OUT:** User-level quotas (subscription-based limits), authentication on API (future)

## Dependencies

None — independent.

## Technical Notes

Vercel serverless functions are stateless — in-memory rate limiting resets per cold start. For production-grade rate limiting, use Vercel KV (Redis). For MVP protection, a simple `Map<ip, {count, resetAt}>` with cold-start awareness is sufficient.

## Definition of Done

`/api/claude` returns 429 after 20 requests/minute from same IP. CORS blocks external origins. Request size cap applied.
