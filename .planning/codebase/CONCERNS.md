# Codebase Concerns

**Analysis Date:** 2026-06-10

---

## Tech Debt

**Banned font properties in component `<style>` blocks:**
- Issue: The CSS convention bans `font-family`, `font-size`, `font-weight`, `line-height` in component styles. Multiple components violate this.
- Files:
  - `src/components/home/HomeMtmSuiteSection.astro` — lines 1033–1036: `font-family: var(--font-body)`, `font-size: var(--fs-body-l)`, `font-weight: 500`, `line-height: 1.1` in `.tool-title`
  - `src/components/home/HomeFaqsSection.astro` — line 198: `font-weight: 600`
  - `src/components/home/ResearchTabsSection.astro` — lines 658–672: `font-size: 18px !important`, `line-height: 1 !important`, `font-size: 12px`, `font-size: 13px`
  - `src/components/home/HomeIntroductionSection.astro` — lines 76–100: `font-size: 13px`, `font-size: 18px !important`, `line-height: 1 !important`, `font-size: 12px`, `font-size: 13px`
  - `src/components/shared/DatePill.astro` — lines 34–51: `font-family`, `font-size`, `font-weight`, `line-height`
  - `src/components/shared/ProductPill.astro` — lines 46–90: `font-family`, `font-size`, `font-weight`, `line-height` (three variants)
  - `src/components/shared/FormField.astro` — lines 113–130: `font-weight`, `font-size: inherit`, `font-family`
- Impact: Typography is not driven by design system text classes; responsive font scaling from `design-system.css` may not apply.
- Fix approach: Replace all font property declarations with the appropriate `.text-*` class on the HTML element per `css-conventions.md`.

**Raw `!important` overrides without documented reason:**
- Issue: Convention states `!important` must have a comment explaining why. Several uses are undocumented.
- Files:
  - `src/components/home/HomeHeroSection.astro` — lines 112, 171–172
  - `src/components/home/HomeIntroductionSection.astro` — lines 58, 97–100
  - `src/components/home/ResearchTabsSection.astro` — lines 546, 635, 656–659, 676, 681
- Impact: Fragile overrides; harder to maintain as styles evolve.
- Fix approach: Add an inline comment justifying each `!important`, or refactor specificity so the override is unnecessary.

**Raw hex/rgba colour values bypassing semantic tokens:**
- Issue: Convention requires semantic tokens. Raw hex and `rgba()` appear in several components.
- Files:
  - `src/components/home/HomeHeroSection.astro` — `rgba(255, 255, 255, 0.95)`, `rgba(255, 255, 255, ...)` gradients
  - `src/components/home/HomeMtmSuiteSection.astro` — `rgba(0,0,0,0.1)`, `rgba(211, 211, 211, 0.58)`, `rgba(0,0,0,0.02)`, `#e5e5e5`, `rgba(255,255,255,0.9)`, `rgba(0,0,0,0.15)`, hardcoded SVG fill `#026BC4`
  - `src/components/home/HomeIntroductionSection.astro` — `rgba(...)` gradients, `#fff`, `#d9d9d9`
  - `src/components/home/ResearchTabsSection.astro` — `#d8d8d8`, `#fff`
  - `src/components/home/HomeFooterSection.astro` — `rgba(255,255,255,0.39)`
  - `src/components/shared/FormField.astro` — `#c00`, `rgba(85, 61, 204, 0.1)` (used twice)
  - `src/components/shared/Navbar.astro` — `#706F6C` inline SVG fill, `#f3f4f6` (three uses), `rgba(12,12,13,0.45)`
  - `src/components/pattern-tool/PatternTool.astro` — `#fff`
- Impact: Colors diverge from design system; dark mode or theme changes require hunting raw values.
- Fix approach: Use `color-mix(in srgb, var(--token) N%, transparent)` for semi-transparent variants per memory note. Match raw hex to nearest semantic token. For SVG fill attributes, map `#026BC4` to `var(--badge-mtm-18)` or the appropriate badge token.

**Palette tokens used instead of semantic tokens:**
- Issue: Components reference raw palette tokens (`--neutral-grey-*`, `--brand-blue-main`, `--neutral-white`) instead of semantic tokens (`--text-primary`, `--text-secondary`, `--surface-white`, etc.).
- Files: 38 occurrences across `src/components/home/HomeMtmSuiteSection.astro`, `ResearchTabsSection.astro`, `HomeFooterSection.astro`, `reports/ReportsRow.astro`, `src/components/products/Mtm18PlusToolsSection.astro`, `Mtm18PlusMethodologyCard.astro`, `Mtm18PlusDonutChart.astro`, `src/components/shared/DatePill.astro`, `FormField.astro`
- Impact: Palette tokens are not semantic — they don't convey intent, and won't update automatically if the design system evolves.
- Fix approach: Audit each use and replace with the closest semantic token (`--brand-blue-main` → `--text-accent` or `--surface-primary`; `--neutral-grey-*` → `--text-secondary` / `--text-disabled`; `--neutral-white` → `--surface-white`).

**Raw spacing / size values instead of tokens:**
- Issue: Several components use raw `px` values for spacing and sizing instead of `--space-*` tokens.
- Files:
  - `src/components/home/HomeIntroductionSection.astro` — `padding: 16px 18px`, `padding: 6px`, `width: 28px`, `height: 28px`, `gap: 4px`
  - `src/components/home/ResearchTabsSection.astro` — `padding: 6px`, `width: 28px`, `height: 28px`, `gap: 4px`, `gap: 8px`, `padding: 6px 8px`
  - `src/components/home/HomeHeroSection.astro` — `width: 314px`, `height: 348px`, `width: 158px`, `width: 287px`, `height: 346px` (collage image absolute positions — may be intentional)
- Impact: Spacing is inconsistent with the design token scale; responsive behaviour is manual.
- Fix approach: Replace raw `px` values with the nearest `--space-*` token where semantically equivalent.

**Raw `border-radius` values:**
- Issue: Some components hardcode `border-radius` in `px` instead of using `--radius-*` tokens.
- Files:
  - `src/components/home/HomeIntroductionSection.astro` — line 68: `border-radius: 10px`
  - `src/components/home/ResearchTabsSection.astro` — line 709: `border-radius: 8px`
  - `src/components/pattern-tool/PatternTool.astro` — line 25: `border-radius: 12px`
- Fix approach: Map to `--radius-s` (0.5rem = 8px), `--radius-m` (1rem = 16px), `--radius-tag` (6px), as appropriate.

**Hardcoded box-shadow values instead of `--shadow-*` tokens:**
- Issue: Custom `box-shadow` declarations exist outside the design token set.
- Files:
  - `src/components/home/HomeMtmSuiteSection.astro` — lines 600, 1091
  - `src/components/home/HomeIntroductionSection.astro` — line 69
  - `src/components/shared/FormField.astro` — lines 141, 187 (focus ring — `rgba(85, 61, 204, 0.1)`)
  - `src/components/shared/Navbar.astro` — line 568
- Fix approach: Check whether any `--shadow-*` token matches; if not, add a new named shadow to `design-system.css`.

**`is:global` used on non-shared components:**
- Issue: Convention allows `is:global` only when a component genuinely needs to style elements outside its template. Two section components use it to style injected child elements, which is a scoping workaround.
- Files:
  - `src/components/home/HomeHeroSection.astro` — `<style is:global>` on a section-level component
  - `src/components/home/HomeIntroductionSection.astro` — `<style is:global>` on a section-level component
- Impact: Global styles leak; naming collisions are possible as the codebase grows.
- Fix approach: Restructure styles to be scoped, or extract the elements needing styling into child components.

**`text-*` class applied to `h3` elements (convention violation):**
- Issue: Convention states h1/h2/h3 must not receive a text class — `design-system.css` defines them via element selectors.
- Files:
  - `src/components/home/solutions/HomeSolutionsCard.astro` — line 37: `<h3 class="product-name text-body-p2">`
  - `src/components/home/HomeFooterSection.astro` — line 223: `<h3 class="home-footer__footer-menu-title text-body-p2">`
- Fix approach: Remove the `text-body-p2` class; either rely on the `h3` element selector or use a `<p>` / `<span>` if the semantic heading level is wrong.

---

## Known Bugs

**Broken link: `government-ngos` vs `gov-ngos` route mismatch:**
- Symptoms: Clicking the Gov & NGOs entry in `HomeSolutions` or the footer navigates to a 404.
- Files:
  - `src/components/home/HomeSolutions.astro` — line 103: `href: /${locale}/solutions/government-ngos`
  - `src/components/home/HomeFooterSection.astro` — line 83: `href: ${base}${locale}/solutions/government-ngos/`
  - Actual page file: `src/pages/[locale]/solutions/gov-ngos.astro` (route is `/solutions/gov-ngos/`)
  - `src/components/shared/Navbar.astro` uses the correct `gov-ngos` slug
- Trigger: Any visitor clicking the Gov & NGOs solution card or footer link.
- Fix: Change `government-ngos` to `gov-ngos` in `HomeSolutions.astro` and `HomeFooterSection.astro`.

**Missing BASE_URL prefix on internal hrefs:**
- Symptoms: Links to product pages and solutions routes break on GitHub Pages where the site is served under `/mtm-website-4/`.
- Files:
  - `src/components/home/HomeMtmSuiteSection.astro` — product `href` values use `/${locale}/products/...` (4 entries) and `/${locale}/reports` (4 entries) — no `BASE_URL`
  - `src/components/home/HomeSolutions.astro` — solution `href` values use `/${locale}/solutions/...` (5 entries) — no `BASE_URL`
  - `src/components/products/Mtm18PlusExploreMoreSection.astro` — product `href` values use `/${locale}/products/...` (3 entries) — no `BASE_URL`
  - `src/components/home/HomeFooterSection.astro` — line 128: `/${locale}/contact` — no `BASE_URL`
- Fix: Prefix all internal hrefs with `` `${import.meta.env.BASE_URL}` `` (remove the leading `/` from locale segment).

**`/reports` page does not exist:**
- Symptoms: Four links in `HomeMtmSuiteSection.astro` (lines 319, 326, 363, 370) point to `/${locale}/reports` and `/${locale}/reports#sneak-peek`. No such page exists in `src/pages/`.
- Files: `src/components/home/HomeMtmSuiteSection.astro`
- Fix: Either create the reports page or update the hrefs to point to an existing page.

**Video element with no source (tools suite section):**
- Symptoms: `HomeMtmSuiteSection.astro` renders a `<video>` element with no `<source>` — a broken media player is visible.
- Files: `src/components/home/HomeMtmSuiteSection.astro` — lines 473–483
- Comment in code: `TODO: Connect video asset when available`
- Fix: Either add the video asset and uncomment the source, or replace the video container with a static image placeholder until the asset is ready.

---

## Incomplete Pages (Stub Content)

**Seven pages render only a Navbar — no page sections:**
- Files:
  - `src/pages/[locale]/products/juniors.astro` — comment: `<!-- Juniors page content goes here -->`
  - `src/pages/[locale]/products/newcomers.astro` — comment: `<!-- Newcomers page content goes here -->`
  - `src/pages/[locale]/products/census.astro` — comment: `<!-- Census page content goes here -->`
  - `src/pages/[locale]/insights.astro` — comment: `<!-- Insights page content goes here -->`
  - `src/pages/[locale]/tools/analytic-tools.astro` — stub
  - `src/pages/[locale]/tools/census-tool.astro` — stub
  - `src/pages/[locale]/solutions/advertising.astro`, `education.astro`, `gov-ngos.astro`, `industry.astro`, `media.astro` — all stubs
- Impact: 11 of the 14 non-home pages are empty shells. Navigation links that lead to them show a blank page.
- Priority: High — these are publicly accessible URLs.

**`Mtm18PlusExploreMoreSection.astro` is untracked (not committed):**
- File: `src/components/products/Mtm18PlusExploreMoreSection.astro`
- It is imported and rendered in `src/pages/[locale]/products/mtm-18-plus.astro` (line 71), so it does affect the build.
- Fix: Stage and commit the file.

---

## i18n / CMS Gaps

**All French translations are empty strings across both copy files:**
- `src/content/copy/mtm-18-plus.json` — 70 keys with `"fr": ""`
- `src/content/copy/home.json` — 64 keys with `"fr": ""`
- Impact: The French locale renders English fallback text from the `t()` call for every string on every page.

**`Mtm18PlusExploreMoreSection.astro` — hardcoded English heading not in CMS:**
- File: `src/components/products/Mtm18PlusExploreMoreSection.astro` — line 65: `<h2>Explore More Data</h2>`
- The heading is a bare string literal. It has no `t()` call and no CMS key. It will never display in French.
- Fix: Add a `explore_more_title` key to `src/content/copy/mtm-18-plus.json` and wrap with `{t(copy, 'explore_more_title', locale, 'Explore More Data')}`.

**`Mtm18PlusExploreMoreSection.astro` uses copy keys from the wrong page dictionary:**
- The component uses `product_2_title`, `product_2_description`, `product_3_title`, etc. (lines 26, 28, 37, 39, 48, 50).
- These keys exist only in `src/content/copy/home.json` (lines 97–127).
- The component receives `copy` from the `mtm-18-plus` page dictionary, which does not contain these keys.
- At runtime, `t()` will fall back to the hardcoded English fallback string for all six keys.
- Fix: Either add the keys to `src/content/copy/mtm-18-plus.json`, or document that these strings are intentionally served from shared home copy and ensure the merge logic includes them (the `mergeSharedDictionary` in `getPageContent.ts` does merge `home.json` into every other page at build time, which means the keys ARE available — but they have empty French values).

**MTM 18+ page title is identical for en and fr:**
- File: `src/pages/[locale]/products/mtm-18-plus.astro` — line 34: `locale === 'fr' ? 'MTM | MTM 18+' : 'MTM | MTM 18+'`
- The conditional is a no-op. Same issue in `src/pages/[locale]/products/juniors.astro` (line 28) and `src/pages/[locale]/[slug].astro` (line 35).

**Malformed CMS key in `mtm-18-plus.json`:**
- File: `src/content/copy/mtm-18-plus.json` — line 102: key is `"???(Key Insights text?)"` — a placeholder that was never resolved.
- This key will never match a `t()` call and serves no purpose.
- Fix: Determine the correct key name, rename it, and add the copy.

**Typos in English copy strings (`mtm-18-plus.json`):**
- `"acccess"` (line 144) — should be `"access"`
- `"compontent"` (line 194) — should be `"component"`
- `"optomized"` (line 299) — should be `"optimized"`

---

## Security Considerations

**No concerns identified at this layer.**
The site is a static marketing site with no server-side authentication, no user input stored, and no secrets in source. The CMS pipeline reads a public Google Sheets CSV URL.

---

## Performance Concerns

**Three large WebGL background scripts loaded as unminified source:**
- Files: `public/js/backgrounds/home-hero-background.js` (1,476 lines), `public/js/backgrounds/research-hero-background.js` (1,472 lines), `public/js/backgrounds/pattern-tool-background.js` (1,373 lines)
- These are ES module files in `public/` — Astro does not process or bundle them. They are served as-is.
- Each imports `three.js` via an importmap pointing to a CDN module (`https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js`).
- The importmap is only added on `src/pages/[locale]/index.astro` and `src/pages/pattern-tool.astro`. If the background scripts were ever imported on another page, they would silently fail.
- `console.log` debug calls are present in all three files (e.g. `'Initializing LiquidGradientEffect...'`) — these should be removed for production.
- Impact: ~600KB of unminified JS + Three.js CDN dependency on every home page load.
- Fix approach: Move background JS into `src/`, let Astro/Vite bundle and tree-shake it, and remove debug `console.log` calls.

**`home-hero-background.js` and `research-hero-background.js` are nearly identical:**
- 1,476 and 1,472 lines respectively with the same LiquidGradientEffect class structure.
- Impact: Maintenance burden — any fix or tuning must be applied to both files.
- Fix approach: Extract a shared base class or config object.

---

## Fragile Areas

**CMS page gid `'0'` for multiple pages means live sheet fetch will silently return empty:**
- File: `src/lib/cms/config.ts` — `census: '0'`, `media: '0'`, `advertising: '0'`, `industry: '0'`, `education: '0'`, `gov-ngos: '0'`
- When there is no local copy file and the gid is `'0'`, the fallback URL resolves to an invalid sheet URL. `getPageDictionary` will call `fetchSheetDictionary` with a broken URL and return an empty dictionary.
- Safe modification: Add local copy JSON files for each page before exposing these pages publicly.

**`[slug].astro` placeholder page uses undefined `--color-gray-200` / `--color-white` tokens:**
- File: `src/pages/[locale]/[slug].astro` — lines 60–62 reference `--color-gray-200` and `--color-white`.
- These tokens exist in `src/styles/styles.css` (lines 75–79), not in `design-system.css`. They are legacy utility tokens outside the documented semantic set.
- Impact: Any future token cleanup of `styles.css` could break this page's styling.
- Fix approach: Replace with `--border-primary` / `--surface-white` from `design-system.css`.

**Footer legal links all point to `/contact/` (not dedicated legal pages):**
- File: `src/components/home/HomeFooterSection.astro` — lines 272–290
- "Site Policies", "Privacy Policy", and "Terms & Conditions" all `href` to `${base}${locale}/contact/`, which is itself an unimplemented page.
- Impact: Visitors clicking legal links land on a non-existent page.

**`Mtm18PlusExploreMoreSection.astro` mobile scroll query selector is global:**
- File: `src/components/products/Mtm18PlusExploreMoreSection.astro` — lines 533–534: `document.querySelector('.explore-nav')`, `document.querySelector('.explore-nav-prev')`
- If this component were ever rendered more than once on a page, the selectors would only target the first instance.
- The `getElementById('exploreMobileScroll')` on line 533 has the same single-instance assumption.
- Fix approach: Use `document.querySelector` scoped to the section's element, or switch to Astro's `<script>` with `this` referencing.

---

## Test Coverage Gaps

**No test files exist anywhere in the project:**
- No `*.test.*` or `*.spec.*` files found under `src/`.
- No `jest.config.*`, `vitest.config.*`, or `playwright.config.*` detected.
- Impact: Every change is manually verified. CSS token violations, broken hrefs, and CMS key mismatches are caught only at build time (or not at all).
- Priority: High for the CMS merge logic (`src/lib/cms/getPageContent.ts`) and the `t()` i18n helper (`src/lib/i18n/t.ts`) — these are the most logic-heavy units.

---

*Concerns audit: 2026-06-10*
