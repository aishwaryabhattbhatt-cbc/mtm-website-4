# Technology Stack

**Analysis Date:** 2026-06-10

## Languages

**Primary:**
- TypeScript 5.9 — all `src/lib/` logic, component props, type definitions
- Astro (`.astro` templates) — all page and component markup

**Secondary:**
- JavaScript (`.mjs`, `.js`) — build scripts (`scripts/`), public canvas background animations (`public/js/`)
- CSS — design system (`src/styles/design-system.css`), global resets (`src/styles/styles.css`), icon sizing (`src/styles/icon-sizes.css`), global overrides (`src/styles/global.css`)

## Runtime

**Environment:**
- Node.js 22 (pinned in `.nvmrc` as `22`; CI uses `node-version: 24`)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present and committed

## Frameworks

**Core:**
- Astro 6.4.4 — static site generator with `[locale]` file-based routing, zero client-JS by default

**Build/Dev:**
- `astro dev` — dev server at `http://localhost:4321/mtm-website-4/` (falls back to 4322)
- `astro build` — outputs to `dist/`
- `astro check` — TypeScript checking via `@astrojs/check 0.9.9`

**Testing:**
- No test framework detected — quality gates enforced via `npm run validate` (TypeScript check + build + site audit)

## Key Dependencies

**Critical:**
- `astro ^6.4.4` — framework; everything runs through it
- `@astrojs/sitemap ^3.7.3` — auto-generates `sitemap.xml` at build via Astro integration (declared in `astro.config.mjs`)
- `papaparse ^5.5.3` — CSV parsing for Google Sheets content in `src/lib/cms/sheets.ts`
- `gsap ^3.15.0` — animation library; listed in `dependencies` but no direct imports found in `src/` — likely reserved for future use or used in `public/js/` via CDN/inline scripts

**Infrastructure:**
- `husky ^9.1.7` — Git hooks manager; installs pre-commit hook
- `lint-staged ^16.4.0` — runs ESLint + Prettier on staged `src/**/*.{astro,ts,css}` files before commit

## Configuration

**Environment:**
- `.env` file (gitignored) — required for `sync-copy` to pull from Google Sheets
- `.env.example` documents all required variables:
  - `GOOGLE_SHEET_ID` — spreadsheet ID for live CSV export (preferred, bypasses CDN cache)
  - `GOOGLE_SHEET_CSV_URL_MAP_JSON` — fallback: JSON map of `pageId → published CSV URL`
  - `GOOGLE_SHEET_TAB_MAP_JSON` — optional JSON map of `pageId → sheet GID` override
  - `PUBLIC_CMS_REFRESH_MS` — runtime polling interval (default `30000` ms)
- In CI, `GOOGLE_SHEET_CSV_URL_MAP_JSON` is injected as a GitHub Actions secret

**Build:**
- `astro.config.mjs` — site: `https://aishwaryabhattbhatt-cbc.github.io`, base: `/mtm-website-4/`, integrations: `[sitemap()]`
- `tsconfig.json` — extends `astro/tsconfigs/strict`, path alias `@/*` → `src/*`
- `.prettierrc` — `singleQuote: true`, `tabWidth: 4`, `printWidth: 100`, `trailingComma: "es5"`, `prettier-plugin-astro`
- `eslint.config.mjs` — `eslint-plugin-astro` (recommended) + `@typescript-eslint` (recommended rules) for `.ts`/`.tsx` files

**Linting / Quality Gates:**
- Pre-commit: `npx lint-staged` (ESLint + Prettier) then `npm run validate`
- `npm run validate` = `astro check && astro build && node scripts/site-audit.mjs`
- CI (`quality.yml`): runs `npm run validate` on every PR and push to `main`/`claude/**`

## Platform Requirements

**Development:**
- Node.js 22 (see `.nvmrc`)
- `.env` file with `GOOGLE_SHEET_ID` or `GOOGLE_SHEET_CSV_URL_MAP_JSON` to run `sync-copy`
- `src/content/copy/*.json` files must exist (written by `sync-copy`) for build to succeed without network

**Production:**
- GitHub Pages at `https://aishwaryabhattbhatt-cbc.github.io/mtm-website-4/`
- Base path `/mtm-website-4/` — all internal asset references must use `import.meta.env.BASE_URL`
- Static output only (`dist/`) — no server-side runtime

---

*Stack analysis: 2026-06-10*
