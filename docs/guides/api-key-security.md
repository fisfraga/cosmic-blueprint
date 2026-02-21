# API Key Security Guide

This document covers how API keys are handled in the Cosmic Blueprint application, common pitfalls to avoid, and a security checklist for deployment.

## The VITE_ Prefix Rule

Vite exposes any environment variable prefixed with `VITE_` to the client-side JavaScript bundle. This means the value is embedded in the built output and visible to anyone who inspects the page source or network requests.

**NEVER use `VITE_ANTHROPIC_API_KEY` or `VITE_OPENROUTER_API_KEY`.**

These would embed your LLM provider API key directly into the browser bundle, allowing anyone to extract and abuse it.

### Correct variable names

| Variable | Scope | Usage |
|----------|-------|-------|
| `ANTHROPIC_API_KEY` | Server-only | Used by `api/claude.ts` Vercel function (if using Anthropic directly) |
| `OPENROUTER_API_KEY` | Server-only | Used by `api/claude.ts` Vercel function (current production proxy) |
| `VITE_APP_URL` | Client | Safe -- only contains the public app URL for CORS |
| `VITE_ASTROLOGY_API_ENABLED` | Client | Safe -- boolean flag, no secret |
| `VITE_SUPABASE_URL` | Client | Safe -- Supabase URL is designed to be public |
| `VITE_SUPABASE_ANON_KEY` | Client | Safe -- Supabase anon key is designed to be public (RLS enforces access) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Bypasses RLS -- NEVER expose to client |

## How the Vercel Serverless Proxy Works

The file `api/claude.ts` is a Vercel serverless function. It runs on the server, never in the browser. The flow is:

1. The browser sends a POST request to `/api/claude` with the prompt and messages.
2. The Vercel function reads `process.env.OPENROUTER_API_KEY` on the server.
3. It forwards the request to OpenRouter with the key in the `Authorization` header.
4. The response streams back to the browser.

The API key never leaves the server. The browser never sees it.

## Setting Vercel Environment Variables

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Select the **Cosmic Blueprint** project.
3. Navigate to **Settings** > **Environment Variables**.
4. Add the following variables:

| Name | Environment | Value |
|------|-------------|-------|
| `OPENROUTER_API_KEY` | Production, Preview | Your OpenRouter API key |
| `ANTHROPIC_API_KEY` | Production, Preview | Your Anthropic API key (if using direct Anthropic) |
| `VITE_APP_URL` | Production | `https://cosmic-blueprint.vercel.app` |
| `RATE_LIMIT_MAX` | Production | `20` (or your preferred limit) |
| `FREEASTRO_API_KEY` | Production, Preview | Your FreeAstroAPI key (if used) |

5. Click **Save** for each variable.
6. **Redeploy** the project for changes to take effect (Settings > Deployments > redeploy latest).

**Important:** Do not check the "Expose to client" option for any secret key. Only `VITE_`-prefixed variables should be client-visible, and those should never contain secrets.

## Local Development

For local development, the Vite dev server includes a proxy middleware (`claudeApiProxy()` in `vite.config.ts`) that reads from a local `.env` file.

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in your API keys in `.env`.
3. The `.env` file is listed in `.gitignore` and will never be committed.

## Security Checklist

- [ ] `OPENROUTER_API_KEY` is set as a server-only Vercel environment variable (no `VITE_` prefix)
- [ ] `ANTHROPIC_API_KEY` is set as a server-only Vercel environment variable (no `VITE_` prefix)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is server-only (no `VITE_` prefix)
- [ ] `.env` is listed in `.gitignore`
- [ ] `.env.example` contains only empty placeholders, no real keys
- [ ] `api/claude.ts` does not log the API key or full request bodies (only error messages)
- [ ] No `console.log(apiKey)` or similar statements exist in serverless functions
- [ ] CSP headers are configured in `vercel.json` to restrict `connect-src` to known API domains
- [ ] CORS in `api/claude.ts` restricts allowed origins to the production URL and localhost dev ports
- [ ] Rate limiting is enabled in `api/claude.ts` to prevent abuse
- [ ] Model whitelist in `api/claude.ts` prevents use of unauthorized models

## What to Do If a Key Is Leaked

1. **Revoke the key immediately** at the provider's dashboard (OpenRouter, Anthropic, Supabase, etc.).
2. **Generate a new key** and update the Vercel environment variable.
3. **Redeploy** the Vercel project.
4. **Audit git history** -- if the key was committed, consider it permanently compromised. Rotating the key is the only safe action; do not rely on `git rebase` or force-push to remove it.
5. **Check usage logs** at the provider dashboard for any unauthorized usage during the exposure window.
