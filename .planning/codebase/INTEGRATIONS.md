# External Integrations

**Analysis Date:** 2026-06-10

## APIs & External Services

**Content / CMS:**
- Google Sheets — source of truth for all page copy in `en` and `fr`
  - SDK/Client: native `fetch` + `papaparse` in `src/lib/cms/sheets.ts`
  - Auth: no OAuth; sheets accessed via exported public CSV URL or via `export?format=csv` with sheet ID
  - Env vars: `GOOGLE_SHEET_ID`, `GOOGLE_SHEET_CSV_URL_MAP_JSON`, `GOOGLE_SHEET_TAB_MAP_JSON`
  - Fetching: `scripts/sync-copy.mjs` fetches at build time → writes `src/content/copy/{pageId}.json`
  - Build-time fallback: if local JSON exists, it is read directly (no network call during `astro build`)
  - Runtime fallback: `src/lib/cms/getPageContent.ts` can fetch live CSV if local file is missing

**Fonts:**
- Google Fonts — `Roboto` and `Source Serif 4`
  - Loaded via `<link>` preconnect + stylesheet in `src/layouts/Layout.astro` (lines 70–75)
  - No API key required; public CDN

## Data Storage

**Databases:**
- None — no database; all content is static files or fetched from Google Sheets at build time

**File Storage:**
- Local filesystem only — `src/content/copy/*.json` is the content cache (committed to git)
- Currently tracked pages: `home.json`, `mtm-18-plus.json`
- Page tab GID map in `src/lib/cms/config.ts` (`DEFAULT_PAGE_TAB_MAP`) covers: `home`, `mtm-18-plus`, `juniors`, `newcomers`, `census`, `analytic-tools`, `census-tool`, `insights`

**Caching:**
- In-memory cache in `src/lib/cms/getPageContent.ts` (`inMemoryCache` Map) — per build process lifetime only
- `sync-copy` fetches with `Cache-Control: no-cache` to bypass Google's CDN (1–5 min lag on published URLs)

## Authentication & Identity

**Auth Provider:**
- None — public marketing site, no user accounts or session management

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- `console.warn` in `src/lib/cms/` for CMS fetch failures
- `scripts/site-audit.mjs` writes structured errors to `stderr` and exits `1` on violations — checked at pre-commit and in CI

## CI/CD & Deployment

**Hosting:**
- GitHub Pages
  - Live URL: `https://aishwaryabhattbhatt-cbc.github.io/mtm-website-4/`
  - Base path: `/mtm-website-4/`
  - Output: static `dist/` directory

**CI Pipeline:**
- GitHub Actions (`.github/workflows/`)
  - `deploy.yml` — triggers on push to `main` or manual dispatch
    1. Checkout → Setup Node 24 → Configure Pages
    2. `npm ci`
    3. `npm run sync-copy` (uses `GOOGLE_SHEET_CSV_URL_MAP_JSON` secret)
    4. `npm run build` (uses same secret)
    5. Upload `./dist` artifact → deploy to GitHub Pages
  - `quality.yml` — triggers on PRs and pushes to `main`/`claude/**`
    1. Checkout → Setup Node 24
    2. `npm run validate` (`astro check` + `astro build` + `site-audit.mjs`)

**Git Hooks:**
- `husky` pre-commit hook (`.husky/pre-commit`):
  1. `npx lint-staged` — ESLint + Prettier on staged `src/**/*.{astro,ts,css}`
  2. `npm run validate` — full type check + build + audit

## Environment Configuration

**Required env vars (set in `.env` locally, GitHub Secrets in CI):**
- `GOOGLE_SHEET_ID` — spreadsheet ID; preferred over published URLs because it bypasses CDN cache
- `GOOGLE_SHEET_CSV_URL_MAP_JSON` — JSON map fallback when `GOOGLE_SHEET_ID` is not set; used as `GOOGLE_SHEET_CSV_URL_MAP_JSON` secret in GitHub Actions

**Optional env vars:**
- `GOOGLE_SHEET_TAB_MAP_JSON` — override default page-to-GID mapping
- `PUBLIC_CMS_REFRESH_MS` — live refresh polling interval (default 30000 ms); `PUBLIC_` prefix makes it available client-side in Astro

**Secrets location:**
- Local: `.env` file (gitignored; see `.gitignore`)
- CI: GitHub repository secrets (`Settings → Secrets and variables → Actions`)

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None — all external communication is outbound HTTP GET to Google Sheets CSV endpoints during `sync-copy`

## Sitemap

- `@astrojs/sitemap` integration generates `sitemap-index.xml` and `sitemap-0.xml` at build time
- Site root configured in `astro.config.mjs` as `https://aishwaryabhattbhatt-cbc.github.io`

---

*Integration audit: 2026-06-10*
