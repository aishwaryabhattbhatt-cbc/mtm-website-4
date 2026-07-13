# Architecture

**Analysis Date:** 2026-06-10

## Pattern Overview

**Overall:** Static Site Generation (SSG) with Astro 5, locale-prefixed routing, build-time CMS hydration, and optional runtime live-reload from Google Sheets.

**Key Characteristics:**
- All pages are statically generated at build time via `getStaticPaths()` — no server-side rendering
- Copy/content is loaded from local JSON files at build time; live Google Sheets fetch is a fallback only
- Every page receives the full `CMSDictionary` and renders via the `t()` helper — no per-component fetch
- Components are purely presentational; all data flows down from the page via props
- JavaScript is minimal and page-specific (Three.js WebGL backgrounds, PapaParse for runtime CMS refresh)

---

## Layers

**Layout Layer:**
- Purpose: Provides the HTML shell, SEO meta tags, Google Fonts, and global CSS imports
- Location: `src/layouts/Layout.astro`
- Contains: `<html>`, `<head>` (canonical, hreflang, OG tags, manifest), named slots (`head`, `scripts`)
- Depends on: None (no CMS, no locale logic)
- Used by: Every page file

**Page Layer:**
- Purpose: Orchestrates a single route — resolves locale, loads CMS dictionary, assembles sections
- Location: `src/pages/[locale]/`
- Contains: `getStaticPaths()`, CMS loading, locale resolution, `localeSwitchUrls` construction
- Depends on: `Layout.astro`, `lib/cms/getPageContent`, `lib/i18n/routing`, section components, `Navbar`
- Used by: Astro build process only

**Section Component Layer:**
- Purpose: Renders a single visual section of a page
- Location: `src/components/{pageName}/`
- Contains: Layout, markup, scoped CSS; all copy accessed via `t(copy, key, locale, fallback)`
- Depends on: `lib/i18n/t`, `lib/icons/registry`, shared components
- Used by: Page files only (never by other section components)

**Shared Component Layer:**
- Purpose: Reusable UI primitives used across pages and sections
- Location: `src/components/shared/`
- Contains: `Button.astro`, `Eyebrow.astro`, `Navbar.astro`, `Reports.astro`, `ProductPill.astro`, `DatePill.astro`, `FormField.astro`
- Depends on: `lib/i18n/t`, `lib/icons/registry`
- Used by: Section components and page files

**Library Layer:**
- Purpose: Pure TypeScript modules — CMS, i18n, icons — no Astro markup
- Location: `src/lib/`
- Contains:
  - `src/lib/cms/` — types, config, sheet fetching, page content loader
  - `src/lib/i18n/` — `t()` translation helper, locale routing utilities
  - `src/lib/icons/registry.ts` — static map of icon category → relative URL paths

**Content Layer:**
- Purpose: Build-time CMS snapshot; written by `npm run sync-copy`
- Location: `src/content/copy/`
- Contains: One JSON file per page: `home.json`, `mtm-18-plus.json`
- Format: `Record<string, { key: string; en: string; fr: string }>`

---

## Data Flow

**Build-Time Copy Flow:**

1. Developer runs `npm run sync-copy` → `scripts/sync-copy.mjs` fetches Google Sheets as CSV
2. PapaParse parses CSV rows; columns matched by header name (`key`, `english`, `french`)
3. Output written to `src/content/copy/{pageId}.json`
4. At build time, page's `getStaticPaths()` returns `[{ params: { locale: 'en' } }, { params: { locale: 'fr' } }]`
5. Page frontmatter calls `getPageDictionary(pageId)` → reads local JSON → stores in `inMemoryCache`
6. Non-home pages automatically merge the `home.json` shared dictionary (nav labels, footer copy)
7. `copy` dictionary passed as prop to every section component and `Navbar`
8. Components call `t(copy, 'key', locale, 'Fallback')` → returns `row.fr` or `row.en` string

**Runtime Live-Reload Flow (optional, dev-only pattern):**

1. Page injects `data-cms-*` attributes onto `<main>` at build time
2. `public/js/runtime/script.js` reads these attributes
3. PapaParse (loaded via CDN) periodically fetches the CSV URL at the configured `refreshMs` interval
4. Parsed values update DOM elements that carry `data-copy-key` attributes

**Icon Resolution Flow:**

1. Component imports from `src/lib/icons/registry.ts` → `icons.{category}.{name}` returns a relative URL string (`icons/tool/tool-dat.svg`)
2. Component prefixes with `import.meta.env.BASE_URL` to get a fully resolved public URL
3. Icons live as static files in `public/icons/{category}/{name}.svg`

---

## Key Abstractions

**CMSDictionary:**
- Purpose: The single in-memory store of all copy for a page, keyed by snake_case string
- Type definition: `src/lib/cms/types.ts`
- Pattern: `Record<string, { key: string; en: string; fr: string }>`
- Loaded by: `getPageDictionary(pageId)` in `src/lib/cms/getPageContent.ts`

**`t()` Translation Helper:**
- Purpose: Safely retrieves a localized string; falls back to English then to the inline fallback
- Location: `src/lib/i18n/t.ts`
- Signature: `t(dictionary: CMSDictionary, key: string, locale: Locale, fallback?: string): string`
- Pattern:
  ```astro
  {t(copy, 'hero_title', locale, 'The Standard for Canadian Media & Technology Insights')}
  ```

**`getPageDictionary(pageId)`:**
- Purpose: Loads a merged CMS dictionary (page copy + shared `home` copy) with in-memory caching
- Location: `src/lib/cms/getPageContent.ts`
- Resolution order: local JSON file → live Google Sheet fetch → empty object (with warning)
- Shared merge: every non-home page dictionary is spread over the `home` dictionary, so nav/footer keys are always available

**`getStaticPaths()`:**
- Purpose: Declares all locale variants of a page for static generation
- Pattern used in every page under `src/pages/[locale]/`:
  ```ts
  export function getStaticPaths() {
    return SUPPORTED_LOCALES.map((locale) => ({ params: { locale } }));
  }
  ```

---

## Entry Points

**Root Redirect:**
- Location: `src/pages/index.astro`
- Triggers: Any request to `/mtm-website-4/`
- Responsibilities: Emits `<meta http-equiv="refresh">` and a JS `window.location.replace` to forward to `/mtm-website-4/en/`

**Home Page:**
- Location: `src/pages/[locale]/index.astro`
- Triggers: `/en/` and `/fr/` routes
- Responsibilities: Loads `home` dictionary, resolves locale switch URLs, renders all home sections in order

**Product Page (MTM 18+):**
- Location: `src/pages/[locale]/products/mtm-18-plus.astro`
- Responsibilities: Loads `mtm-18-plus` dictionary (merged with `home`), renders product sections

**Placeholder Slug Pages:**
- Location: `src/pages/[locale]/[slug].astro`
- Triggers: `/en/sign-in/`, `/fr/sign-in/`, `/en/request-demo/`, `/fr/request-demo/`
- Responsibilities: Renders a "coming soon" card; `noindex: true`

---

## i18n Approach

**Locale Resolution:**
- Supported locales: `['en', 'fr']` (defined in `src/lib/i18n/routing.ts`)
- Default locale: `'en'`
- All user-facing routes are under `src/pages/[locale]/` — there is no locale-less route that serves content
- `resolveLocale(raw)` in `src/lib/i18n/routing.ts` coerces any non-`fr` value to `'en'`

**Locale Switching:**
- Each page constructs a `localeSwitchUrls: Record<Locale, string>` object and passes it to `Navbar` and `Layout`
- `Layout.astro` emits `<link rel="alternate" hreflang="en|fr">` and `hreflang="x-default"` tags
- `Navbar` renders `<a lang="en|fr" hreflang="en|fr">` toggle links

**Copy Keys:**
- `snake_case`, prefixed with section name: `hero_title`, `mtm_suite_body`, `survey_stat_1_label`
- Nav and footer keys live in `home.json` and are merged into all page dictionaries automatically
- Nav copy accessed with dotted prefix: `home.nav.products`, `home.nav.signIn`

---

## CMS Pipeline

**Source of Truth:** Google Sheets (one tab per page, `pageId` maps to a GID in `src/lib/cms/config.ts`)

**Page-to-GID map** (`src/lib/cms/config.ts`):
- `home` → `328712104`
- `mtm-18-plus` → `7615361`
- `juniors` → `1128385549`
- `newcomers` → `1277962868`
- `census` → `0`
- `analytic-tools` → `1734378829`
- (others present with GID `0` — not yet populated)

**Sync script:** `scripts/sync-copy.mjs`
- Reads `.env` for `GOOGLE_SHEET_ID`
- Fetches each configured tab as CSV (`export?format=csv&gid=...`)
- Writes `src/content/copy/{pageId}.json`

**Build-time loader:** `src/lib/cms/getPageContent.ts`
- Reads local JSON from `src/content/copy/` — no network call during build if JSON exists
- Falls back to live CSV fetch if JSON is missing (useful for CI without pre-synced files)
- In-memory cache prevents redundant reads within a single build

---

## Error Handling

**Strategy:** Warn-and-fallback — missing data never throws; components render fallback strings.

**Patterns:**
- `t()` logs `[CMS] Missing key: {key}` and returns inline fallback or `[key]` placeholder
- `getPageDictionary()` logs warnings at each fallback tier; returns `{}` as last resort
- `resolveLocale()` silently returns `'en'` for any unrecognized locale value
- Icon registry returns `''` for unknown category/name combinations via `getIconPath()`

---

## Cross-Cutting Concerns

**Global CSS:** `src/styles/design-system.css` (tokens, typography classes) and `src/styles/styles.css` (resets, layout utilities) — imported once in `Layout.astro`

**Icon Sizes:** `src/styles/icon-sizes.css` — imported in `Layout.astro`; use `.icon-xs` through `.icon-2xl` classes, never raw sizes

**Asset Base Path:** Always `${import.meta.env.BASE_URL}path` — Astro resolves to `/mtm-website-4/` in production, `/` in dev

**Section Spacing:** Use `<div class="section-gap section-gap-lg">` dividers between sections (defined in `styles.css`); never add `margin-top` on sections themselves

---

*Architecture analysis: 2026-06-10*
