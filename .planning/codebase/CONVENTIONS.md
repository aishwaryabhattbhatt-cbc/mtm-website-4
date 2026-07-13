# Coding Conventions

**Analysis Date:** 2026-06-10

## Naming Patterns

**Files:**
- Section components: `[PageName][SectionName]Section.astro` — e.g. `HomeMtmSuiteSection.astro`, `Mtm18PlusMethodologySection.astro`
- Sub-components within a section folder: `[PageName][SubName].astro` — e.g. `HomeSolutionsCard.astro`, `ReportsTickerCard.astro`
- Shared/reusable components: PascalCase, no prefix — e.g. `Button.astro`, `Eyebrow.astro`, `Navbar.astro`
- Pages: live under `src/pages/[locale]/` with kebab-case slugs — e.g. `mtm-18-plus.astro`

**CSS Classes:**
- Section root class is kebab-case derived from the component name: `HomeMtmSuiteSection` → `.mtm-suite-section`
- All CSS class names in component `<style>` blocks use kebab-case

**TypeScript / JS:**
- CMS copy keys: `snake_case`, prefixed with section name — e.g. `hero_title`, `package_1_eyebrow`, `mtm_suite_cta`
- Interface props named `Props` (Astro convention)
- Locale type values: `'en'` | `'fr'` (see `src/lib/cms/types.ts`)

**Directories:**
- Component folders match the page slug: `src/components/home/`, `src/components/products/`, `src/components/shared/`

## Component Structure

Every section component follows this exact template:

```astro
---
// src/components/<pageName>/<FileName>.astro
import type { CMSDictionary, Locale } from '../../lib/cms/types';
import { t } from '../../lib/i18n/t';

interface Props {
    locale: Locale;
    copy: CMSDictionary;
}

const { locale, copy } = Astro.props as Props;
---

<section class="<section-class>">
  <!-- content -->
</section>

<style>
  .<section-class> {
    width: 100%;
    padding: 0 var(--content-margin-inline);
  }
</style>
```

**Rules:**
- Never put section markup directly in page files — always extract to a component
- Both CMS imports (`CMSDictionary`, `Locale`, `t`) must be present in every section component
- Sub-components (cards, rows) that are used only by one section live in a sub-folder: `src/components/home/solutions/`, `src/components/home/reports/`

## CSS — Typography

**The one rule:** Add a design system text class to the HTML element. Never write font properties (`font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`, `text-transform`) in `<style>` blocks.

**Exceptions in the codebase** (pre-existing, do not follow these patterns):
- `src/components/home/HomeMtmSuiteSection.astro` `.tool-title` writes `font-family`, `font-size`, `font-weight` inline — this is a known violation
- `src/components/home/ResearchTabsSection.astro` uses raw `px` font sizes for Highcharts overrides — accepted only for third-party library overrides with `is:global`
- `src/components/home/HomeHeroSection.astro` uses `calc(var(--fs-hero) * var(--hero-scale))` for a dynamic scale animation — accepted as a special case

**`<h1>` / `<h2>` / `<h3>`:** Never add a text class. These are styled by element selectors in `src/styles/design-system.css`.

**Text class reference** (from `src/styles/design-system.css`):

| Class | Family | Size token | Weight |
|---|---|---|---|
| `.text-hero` | Source Serif 4 | `--fs-hero` (4.5rem) | semibold |
| `.text-metrics` | Source Serif 4 | `--fs-metrics` (3rem) | semibold |
| `.text-h4` | Roboto | `--fs-h4` (2rem) | regular |
| `.text-body-p0` | Roboto | `--fs-body-xl` (1.5rem) | medium |
| `.text-body-p0-bold` | Roboto | `--fs-body-xl` (1.5rem) | semibold |
| `.text-body-p1` | Roboto | `--fs-body-l` (1.25rem) | regular |
| `.text-body-p1-bold` | Roboto | `--fs-body-l` (1.25rem) | medium |
| `.text-body-p2` | Roboto | `--fs-body-m` (1.125rem) | regular |
| `.text-body-p3` | Roboto | `--fs-body-s` (1rem) | regular |
| `.text-button-regular` | Roboto | `--fs-button-regular` (1.125rem) | medium, uppercase |
| `.text-button-small` | Roboto | `--fs-button-small` (0.875rem) | medium, uppercase |
| `.text-label-regular` | Roboto | `--fs-body-m` (1.125rem) | medium, uppercase |
| `.text-label-small` | Roboto | `--fs-label-small` (0.875rem) | medium, uppercase |

No exact match → use the closest by font-size first, then weight. For a new combination, add a class to `src/styles/design-system.css`.

## CSS — Spacing Tokens

- Spacing: `--space-1` (0.25rem) through `--space-13` (7.5rem). Never use raw `px` or `rem` values for padding, margin, or gap.
- Exception: `1px` / `2px` borders → use `--stroke-1` / `--stroke-2`
- Card-to-card gap: always `--layout-card-gap` (desktop: 2.5rem, ≤1023px: 1rem). Never use raw `--space-*` for inter-card spacing.

## CSS — Color Tokens

Semantic tokens only. Never raw hex or `rgba()` when a token exists.

**Available semantic tokens** (from `src/styles/design-system.css`):
- Text: `--text-primary`, `--text-secondary`, `--text-disabled`, `--text-white`, `--text-accent`
- Surface: `--surface-primary`, `--surface-white`, `--surface-blue`
- Border: `--border-primary`, `--border-secondary`, `--border-tertiary`

**Gradient opacity stops:** Use `color-mix(in srgb, var(--token) N%, transparent)` for gradient stops with partial opacity. Do not use raw `rgba()` when a design token covers the color.

## CSS — Other Tokens

- Border radius: `--radius-xs / -tag / -s / -m / -full` — never raw `px`
- Stroke: `--stroke-1` (1px), `--stroke-2` (2px)
- Shadows: `--shadow-e1 / -e2 / -drop / -nav / -card / -eyebrow`

## CSS — What Belongs in a Component Style Block

Only layout properties: `color`, `display`, `position`, `padding`, `margin`, `gap`, `width`, `height`, `border`, `border-radius`, `box-shadow`, `transition`, `z-index`, `overflow`, `cursor`.

## CSS — Section Sizing

- Never hardcode `100vh`. Use `.section-height-100` (`calc(100vh - var(--navbar-height))`) or `.section-height-80` from `src/styles/styles.css`
- Section width is always `100%`. Horizontal page padding uses `--content-margin-inline` (responsive: 24px mobile → 240px 1920px+)
- Between sections on a page: use `<div class="section-gap section-gap-sm" aria-hidden="true"></div>` or `section-gap-lg` spacer divs (not raw margin)

## CSS — Icon Sizing

Always use icon size classes from `src/styles/icon-sizes.css`. Never use `--space-*` tokens or raw values for icon `width`/`height`.

| Class | Size |
|---|---|
| `.icon-xs` | 0.75rem |
| `.icon-s` | 1rem |
| `.icon-m` | 1.5rem |
| `.icon-l` | 2rem |
| `.icon-xl` | 2.5rem |
| `.icon-2xl` | 3rem |
| `.icon-3xl` | 4rem |

Usage: `<img src="..." class="icon icon-3xl" alt="" />`

## CSS — Responsive Breakpoints

Always add responsive breakpoints in component styles. Standard breakpoints:
- `@media (max-width: 1023px)` — tablet / column-stack layout
- `@media (max-width: 767px)` — mobile

Navbar height changes at `max-width: 1023px` (80px → 70px). Hero sections need `margin-top: var(--navbar-height)` on desktop, reset to 0 at max-width 1023px.

## CSS — `is:global`

Only use `is:global` when the component genuinely needs to style elements outside its own template — e.g. `Button.astro` uses it so `.btn` classes work globally. Never use it to work around normal scoping.

## CSS — `!important`

Do not use `!important` without a comment explaining why. Existing uses in `ResearchTabsSection.astro` are for Highcharts overrides.

## Import Organization

Typical frontmatter import order in `.astro` files:

1. Astro built-ins and framework packages: `import { Image } from 'astro:assets'`
2. CMS/i18n lib types and helpers: `import type { CMSDictionary, Locale } from '../../lib/cms/types'`, `import { t } from '../../lib/i18n/t'`
3. Internal shared components: `import Button from '../shared/Button.astro'`
4. Internal page-specific components: `import HomeSolutionsCard from './solutions/HomeSolutionsCard.astro'`
5. Static assets: `import heroImg from '../../assets/images/...'`

## i18n Patterns

- All pages live at `src/pages/[locale]/` — `getStaticPaths()` returns `SUPPORTED_LOCALES.map((locale) => ({ params: { locale } }))`
- Every user-facing string is wrapped in `t()`:
  ```astro
  {t(copy, 'hero_title', locale, 'Fallback English text')}
  ```
- Always include the fallback as the 4th argument — `t()` warns to console and returns fallback or `[key]` on miss
- Copy keys are `snake_case`, prefixed with the section name: `hero_title`, `package_1_eyebrow`, `mtm_suite_cta`
- Before adding a new key, check `src/content/copy/[pageId].json` for an existing key — reuse before creating
- `src/lib/i18n/t.ts` handles locale fallback: missing `fr` falls back to `en`, missing `en` uses the fallback argument

## CMS Copy Pipeline

1. Source of truth: Google Sheets (one tab per page, GID-mapped in `src/lib/cms/config.ts`)
2. `npm run sync-copy` fetches CSV → writes `src/content/copy/[pageId].json`
3. `getPageDictionary(pageId)` in `src/lib/cms/getPageContent.ts` reads local JSON at build time (no live network)
4. Shared copy from `home` tab is merged into every page dictionary automatically
5. Commit `src/content/copy/` to keep copy versioned

## Asset Paths

Always use `import.meta.env.BASE_URL` for internal asset paths. Never hardcode `/mtm-website-4/`.

```astro
<!-- correct -->
<img src={`${import.meta.env.BASE_URL}images/hero.png`} alt="..." />

<!-- wrong -->
<img src="/mtm-website-4/images/hero.png" alt="..." />
```

Astro `Image` component imports (`import heroImg from '../../assets/...'`) handle their own path resolution — `import.meta.env.BASE_URL` is only needed for `public/` asset paths referenced as strings.

## Shared Components — Use, Never Reimplement

**`src/components/shared/Button.astro`**
- Props: `variant` (`primary` | `secondary` | `scroll` | `tertiary` | `secondary-icon`), `size` (`md` | `lg`), `href`, `type`, `class`, `tabindex`, `aria-label`, `iconSrc`, `iconAlt`
- `size="md"` (default) → applies `text-button-small`; `size="lg"` → applies `text-button-regular`
- `href` prop renders `<a>`, no `href` renders `<button>`

**`src/components/shared/Eyebrow.astro`**
- Uses `text-button-small`. Style block contains layout properties only.

**`src/components/shared/Navbar.astro`**
- Locale-aware top nav. Included directly in page files, not in Layout.

## Accessibility Checklist

From `/review` command (`src/.claude/commands/review.md`):
- All `<img>` have `alt` (descriptive text, or `""` for decorative)
- Decorative overlays have `aria-hidden="true"`
- Interactive elements have `:focus-visible` styles
- Icon-only buttons have `aria-label`
- `<section>` landmarks have an accessible name via `aria-label` or heading
- Above-the-fold images use `loading="eager"`; below-the-fold use `loading="lazy"`
- Decorative SVGs have `aria-hidden="true"`

## Code Style

**Formatter:** Prettier with `prettier-plugin-astro`
- `singleQuote: true`
- `tabWidth: 4`
- `semi: true`
- `printWidth: 100`
- `trailingComma: 'es5'`
- Config: `.prettierrc`

**Linter:** ESLint with `eslint-plugin-astro` and `@typescript-eslint`
- Config: `eslint.config.mjs`
- Extends `eslintPluginAstro.configs.recommended` + TypeScript recommended rules

## Site-Audit Checks

`scripts/site-audit.mjs` (runs as part of `npm run validate`) flags:
- `href="#"` placeholder links in `src/`
- Inline `style=""` attributes in Astro templates
- `console.log(` calls in `src/` and `public/js/runtime/script.js`
- Pages under `src/pages/` that include `<html>` tag instead of using `Layout.astro`

---

*Convention analysis: 2026-06-10*
