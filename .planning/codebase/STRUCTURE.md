# Codebase Structure

**Analysis Date:** 2026-06-10

## Directory Layout

```
mtm-website-4/
├── src/
│   ├── assets/              # Build-processed assets (Astro Image pipeline)
│   │   ├── images/          # .webp/.png images — imported with `import { Image } from 'astro:assets'`
│   │   └── svg/             # SVG files — imported as `?url` for `<img src>` use
│   ├── components/
│   │   ├── home/            # Section components for the home page
│   │   │   ├── reports/     # Sub-components used only within HomeMtmSuiteSection
│   │   │   └── solutions/   # Sub-components used only within HomeSolutions
│   │   ├── products/        # Section components for product pages (MTM 18+, etc.)
│   │   ├── pattern-tool/    # Standalone tool page component
│   │   └── shared/          # Reusable primitives: Button, Eyebrow, Navbar, Reports, etc.
│   ├── content/
│   │   └── copy/            # CMS snapshots — written by `npm run sync-copy`
│   │       ├── home.json    # Shared copy (nav, footer) + home page copy
│   │       └── mtm-18-plus.json
│   ├── layouts/
│   │   └── Layout.astro     # HTML shell with SEO meta, fonts, global CSS imports
│   ├── lib/
│   │   ├── cms/             # CMS abstraction: config, loader, sheet parser, types
│   │   ├── i18n/            # `t()` helper and locale routing utilities
│   │   └── icons/           # Icon registry mapping category → public URL
│   ├── pages/
│   │   ├── index.astro      # Root redirect to /en/
│   │   ├── pattern-tool.astro  # Non-locale tool page
│   │   └── [locale]/        # All locale-prefixed pages
│   │       ├── index.astro  # Home page
│   │       ├── insights.astro
│   │       ├── [slug].astro # Catches sign-in, request-demo (placeholder pages)
│   │       ├── products/
│   │       │   ├── mtm-18-plus.astro
│   │       │   ├── juniors.astro
│   │       │   ├── newcomers.astro
│   │       │   └── census.astro
│   │       ├── solutions/
│   │       │   ├── advertising.astro
│   │       │   ├── media.astro
│   │       │   ├── industry.astro
│   │       │   ├── education.astro
│   │       │   └── gov-ngos.astro
│   │       └── tools/
│   │           ├── analytic-tools.astro
│   │           └── census-tool.astro
│   └── styles/
│       ├── design-system.css   # Tokens, typography classes, spacing, color variables
│       ├── styles.css          # Resets, layout utilities, section-gap helpers
│       ├── icon-sizes.css      # .icon-xs through .icon-2xl utility classes
│       └── global.css          # Legacy/leftover CSS (prefer design-system.css)
├── public/
│   ├── icons/               # Static SVG icon files — served as-is, referenced via registry
│   │   └── {category}/      # e.g., demographics-group/, tool/, gen/, solutions/
│   ├── images/              # Static images served directly (not Astro-processed)
│   ├── js/
│   │   ├── backgrounds/     # Three.js WebGL canvas scripts (home-hero, research-hero)
│   │   └── runtime/         # script.js — runtime CMS refresh + DOM hydration
│   └── svg/                 # SVG files served directly
├── scripts/
│   ├── sync-copy.mjs        # Fetches Google Sheets → writes src/content/copy/*.json
│   ├── site-audit.mjs       # Post-build site audit (run by `npm run validate`)
│   └── create-section.js    # Scaffolding helper for new section components
├── .claude/
│   └── rules/               # Project-specific coding rules loaded by Claude
├── .planning/
│   └── codebase/            # GSD codebase map documents
├── astro.config.mjs         # Astro config: base=/mtm-website-4/, sitemap integration
├── tsconfig.json
├── package.json
└── CLAUDE.md                # Primary project reference for AI assistants
```

---

## Directory Purposes

**`src/assets/`:**
- Purpose: Source assets that Astro processes (optimization, hashing, type-safe imports)
- Images here: import with `import foo from '../../assets/images/foo.webp'` then `<Image src={foo} />`
- SVGs used as `<img src>`: import with `import foo from '../../assets/svg/foo.svg?url'`
- Key files: `src/assets/svg/mtm-logo.svg`, `src/assets/svg/icon-chevron.svg`

**`src/components/home/`:**
- Purpose: All section components for the home page
- Key files:
  - `HomeHeroSection.astro` — WebGL canvas hero
  - `HomeMtmSuiteSection.astro` — interactive product suite tabs
  - `HomeSolutions.astro` — solutions grid
  - `HomeFaqsSection.astro`, `HomeFooterSection.astro`
- Sub-folders `reports/` and `solutions/` contain sub-components used only within their parent section

**`src/components/products/`:**
- Purpose: Section components for product detail pages
- Naming: `Mtm18Plus{SectionName}.astro` for all MTM 18+ sections
- Key files:
  - `ProductsHeroSection.astro` — shared hero used across all product pages
  - `Mtm18PlusFeaturesSection.astro`, `Mtm18PlusToolsSection.astro`, `Mtm18PlusReportsSection.astro`
  - `Mtm18PlusMethodologySection.astro`, `Mtm18PlusMethodologyCard.astro`, `Mtm18PlusSampleCompositionCard.astro`
  - `Mtm18PlusExploreMoreSection.astro`, `Mtm18PlusDonutChart.astro`

**`src/components/shared/`:**
- Purpose: Primitives used by multiple pages and sections
- Key files:
  - `Button.astro` — all interactive links and actions
  - `Eyebrow.astro` — section label pill
  - `Navbar.astro` — locale-aware top navigation with dropdown menus
  - `Reports.astro` — report preview card with stats
  - `ProductPill.astro`, `DatePill.astro`, `FormField.astro`

**`src/lib/cms/`:**
- Purpose: All CMS logic
- `types.ts` — `Locale`, `CMSRow`, `CMSDictionary`, `PageCMSConfig`
- `config.ts` — page-to-GID map, env var readers (`GOOGLE_SHEET_ID`, etc.)
- `sheets.ts` — `fetchSheetDictionary(csvUrl)`, `parseSheetCsv(csvText)`
- `getPageContent.ts` — `getPageDictionary(pageId)` with local-first resolution and in-memory cache

**`src/lib/i18n/`:**
- Purpose: Locale utilities
- `t.ts` — `t(dictionary, key, locale, fallback)` translation function
- `routing.ts` — `SUPPORTED_LOCALES`, `DEFAULT_LOCALE`, `resolveLocale()`, `getLocaleSwitchUrls()`

**`src/lib/icons/registry.ts`:**
- Purpose: Typed static map of all icon paths
- Usage: `icons['demographics-group'].adult` → `'icons/demographics-group/adult.svg'`
- Prefix with `import.meta.env.BASE_URL` to get full resolved URL

**`src/content/copy/`:**
- Purpose: Build-time CMS snapshots generated by `npm run sync-copy`
- One file per page: `home.json`, `mtm-18-plus.json`
- `home.json` is shared — it is merged into every other page's dictionary at build time
- Format: `{ [key: string]: { key: string, en: string, fr: string } }`

**`public/`:**
- Purpose: Static files copied as-is — not processed by Astro
- `public/icons/` — SVG icons served at `/mtm-website-4/icons/...`
- `public/js/runtime/script.js` — runtime CMS refresh script loaded by all pages
- `public/js/backgrounds/` — Three.js canvas modules for hero sections
- Reference in components: always `${import.meta.env.BASE_URL}path/to/file`

---

## Key File Locations

**Entry Points:**
- `src/pages/index.astro` — root redirect only
- `src/pages/[locale]/index.astro` — home page
- `src/pages/[locale]/products/mtm-18-plus.astro` — most complete product page (reference for new pages)
- `src/pages/[locale]/[slug].astro` — placeholder catch-all for sign-in and request-demo

**Configuration:**
- `astro.config.mjs` — base path, integrations
- `src/lib/cms/config.ts` — Google Sheets GID map and env var configuration
- `.env` — `GOOGLE_SHEET_ID` and optional overrides (never read contents)
- `.env.example` — template showing required variables

**Core Logic:**
- `src/lib/cms/getPageContent.ts` — primary CMS loader
- `src/lib/i18n/t.ts` — translation function used in every component
- `src/lib/i18n/routing.ts` — locale constants and URL helpers

**Styles:**
- `src/styles/design-system.css` — authoritative design tokens and typography classes
- `src/styles/styles.css` — utility classes and layout helpers

**CMS Sync:**
- `scripts/sync-copy.mjs` — run via `npm run sync-copy`

---

## Naming Conventions

**Files:**
- Page files: match their URL slug (`mtm-18-plus.astro` → `/products/mtm-18-plus/`)
- Section components: `[PageName][SectionName]Section.astro` (e.g., `HomeMtmSuiteSection.astro`, `Mtm18PlusFeaturesSection.astro`)
- Sub-components: `[PageName][ComponentName].astro` (e.g., `Mtm18PlusMethodologyCard.astro`, `HomeSolutionsCard.astro`)
- Shared components: PascalCase noun (e.g., `Button.astro`, `Eyebrow.astro`, `Navbar.astro`)

**CSS Classes:**
- Section wrapper class: kebab-case from component name, dropping `Section` suffix
  - `HomeMtmSuiteSection` → `.mtm-suite-section`
  - `Mtm18PlusFeaturesSection` → `.features-section`
- Child element classes: BEM-style with parent prefix: `.mtm-suite-section`, `.mtm-suite-card`, `.mtm-suite-card-title`

**CMS Keys:**
- `snake_case`, prefixed with section name: `hero_title`, `survey_stat_1_label`, `method_1_percentage`
- Nav/footer keys: `home.nav.products`, `home.nav.signIn`, `home.footer.copyright`

**Directories:**
- Component folders: lowercase kebab-case matching the page name: `home/`, `products/`, `pattern-tool/`
- Asset sub-folders: mirror the page/feature name: `images/home/mtm-suite/`, `images/products/mtm-18-plus/`

---

## Where to Add New Code

**New page (e.g., `/products/juniors/`):**
1. Page file: `src/pages/[locale]/products/juniors.astro` — copy structure from `mtm-18-plus.astro`, set `pageId = 'juniors'`
2. Components: `src/components/products/Juniors{SectionName}Section.astro` per section
3. CMS copy: `src/content/copy/juniors.json` (run `npm run sync-copy` after setting up the Sheet)
4. Static paths: `getStaticPaths()` must return both `en` and `fr` params

**New section on an existing page:**
1. Create `src/components/{pageName}/{PageName}{SectionName}Section.astro`
2. Use the standard component template:
   ```astro
   ---
   import type { CMSDictionary, Locale } from '../../lib/cms/types';
   import { t } from '../../lib/i18n/t';
   interface Props { locale: Locale; copy: CMSDictionary; }
   const { locale, copy } = Astro.props as Props;
   ---
   <section class="my-section">...</section>
   <style>.my-section { width: 100%; padding: 0 var(--content-margin-inline); }</style>
   ```
3. Import and render in the page file between `section-gap` dividers

**New shared component:**
- Place in `src/components/shared/`
- Use `is:global` styles only if the component genuinely needs to style outside its template

**New copy key:**
1. First check `src/content/copy/{pageId}.json` for an existing key — reuse before creating
2. Add the row to the Google Sheet under the correct tab
3. Run `npm run sync-copy`
4. Use in component: `{t(copy, 'new_key', locale, 'English fallback text')}`

**New icon:**
1. Place SVG in `public/icons/{category}/`
2. Add entry to `src/lib/icons/registry.ts` under the correct category object
3. Reference in component: `icons.{category}.{name}` prefixed with `import.meta.env.BASE_URL`

**New static asset (image):**
- Astro-processed (for optimization): `src/assets/images/{page-name}/`
- Served as-is (referenced directly): `public/images/{page-name}/`

---

## Special Directories

**`.planning/codebase/`:**
- Purpose: GSD codebase map documents used by planning and execution agents
- Generated: Yes (by Claude agent)
- Committed: Yes

**`dist/`:**
- Purpose: Astro build output — complete static site for GitHub Pages deployment
- Generated: Yes (by `npm run build`)
- Committed: No (in `.gitignore`)

**`.astro/`:**
- Purpose: Astro's generated type definitions and collection manifests
- Generated: Yes
- Committed: No

**`public/js/runtime/`:**
- Purpose: Vanilla JS for runtime CMS refresh and DOM hydration
- Key file: `public/js/runtime/script.js` — loaded by every page via `<Fragment slot="scripts">`

**`public/js/backgrounds/`:**
- Purpose: Three.js WebGL background modules for hero sections
- Referenced by individual pages that need animated backgrounds (home page, research page)

**`scripts/`:**
- Purpose: Node.js scripts run outside Astro build
- `sync-copy.mjs` — CMS sync
- `site-audit.mjs` — post-build audit run by `npm run validate`
- `create-section.js` — scaffolding helper (run manually)

---

*Structure analysis: 2026-06-10*
