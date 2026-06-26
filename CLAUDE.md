# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Marketing website for MTM (Media Technology Monitor), a CBC initiative that tracks Canadian media consumption. Built with Astro 5, deployed to GitHub Pages. Supports English (`en`) and French (`fr`).

- **Live URL**: `https://aishwaryabhattbhatt-cbc.github.io/mtm-website-4/`
- **Base path**: `/mtm-website-4/` — always use `import.meta.env.BASE_URL` for internal asset paths, never hardcode
- **Dev server**: `npm run dev` → `http://localhost:4321/mtm-website-4/` (falls back to 4322)

## Key commands

```bash
npm run dev          # start dev server
npm run build        # production build
npm run check        # TypeScript check via astro check
npm run lint         # ESLint (errors block; warnings surfaced only)
npm run format       # Prettier format all src files
npm run sync-copy    # pull copy from Google Sheets → src/content/copy/[pageId].json
npm run validate     # check + build + site audit (runs in pre-commit hook)
```

## Before marking any task done

Run `/review` to check every change against the project's conventions. A single violation means the work is incomplete.

Pre-commit also runs `npm run validate`. The site audit (`scripts/site-audit.mjs`) will block commits that contain:
- `href="#"` placeholder links — use a real locale-aware destination or the closest real page
- Inline `style=""` attributes — always use a CSS class in the component `<style>` block
- `console.log()` calls in `src/` or `public/js/runtime/`

---

## Architecture

### Layer model

The codebase has five strict layers — data only flows downward:

1. **Layout** (`src/layouts/Layout.astro`) — HTML shell, `<head>`, global CSS imports, named slots (`head`, `scripts`). No CMS, no locale logic.
2. **Page** (`src/pages/[locale]/`) — Resolves locale, loads `CMSDictionary`, constructs `localeSwitchUrls`, renders sections in order. Contains `getStaticPaths()`.
3. **Section component** (`src/components/{pageName}/`) — Single visual section. Receives `locale` + `copy` as props. All copy via `t()`. No direct data fetching.
4. **Shared component** (`src/components/shared/`) — UI primitives: `Button`, `Eyebrow`, `Navbar`, `ProductPill`, `DatePill`, `FormField`, `Reports`.
5. **Library** (`src/lib/`) — Pure TS modules: `cms/` (types, config, page loader), `i18n/` (`t()` helper, routing), `icons/registry.ts`.

### CMS data flow

**Build time (always):**
1. `npm run sync-copy` fetches Google Sheets tabs as CSV → writes `src/content/copy/{pageId}.json`
2. `getPageDictionary(pageId)` reads local JSON at build time; `home.json` is automatically merged into every non-home page dictionary so nav/footer keys are always available
3. `copy` dict passed as prop through page → sections; components call `t(copy, 'key', locale, 'Fallback')`

**Runtime live-reload (dev-only):**
`<main>` elements carry `data-cms-*` attributes; `public/js/runtime/script.js` uses PapaParse + CDN fetch to re-hydrate elements with `data-copy-key` attributes at a configured interval.

### Icon resolution

```ts
import { icons } from '../../lib/icons/registry';
const base = import.meta.env.BASE_URL;
// Usage:
`${base}${icons.tool.dat}`      // → /mtm-website-4/icons/tool/tool-dat.svg
`${base}${icons.gen.trends}`    // → /mtm-website-4/icons/gen/trends.svg
```

Icons live as static SVGs in `public/icons/{category}/`. Registry categories: `demographics`, `demographics-group`, `demographics-household`, `demographics-income`, `demographics-language`, `demographics-user`, `device-audio`, `device-cellphone`, `device-gaming`, `device-tablet`, `device-tv`, `service-*`, `tool`, `tool-ras`, `gen`, `solutions`, `time`.

---

## Component conventions

**Naming:** `[PageName][SectionName]Section.astro` — e.g. `HomeMtmSuiteSection.astro`, `Mtm18PlusToolsSection.astro`. Sub-components used only within one section go in a sub-folder: `src/components/home/solutions/HomeSolutionsCard.astro`.

**Never put section markup in page files.** Always extract to a component.

**Always use existing components.** Before writing any markup for a button, chevron, pill, card, eyebrow, or nav element — check `src/components/shared/` and the relevant page component folder. If a component covers it, use it. Never inline a re-implementation.

**Changes to a component go in the component file.** If asked to change how a button, icon, or card element looks or behaves, edit the shared component — not a single usage site. Patching one location leaves every other instance inconsistent.

**Template every section component follows:**

```astro
---
import type { CMSDictionary, Locale } from '../../lib/cms/types';
import { t } from '../../lib/i18n/t';

interface Props {
    locale: Locale;
    copy: CMSDictionary;
}

const { locale, copy } = Astro.props as Props;
---

<section class="my-section">
  <!-- content -->
</section>

<style>
  .my-section {
    width: 100%;
    padding: 0 var(--content-margin-inline);
  }
</style>
```

Section root CSS class is kebab-case from the component name: `HomeMtmSuiteSection` → `.mtm-suite-section`.

**Between sections on a page**, use spacer divs — never `margin-top` on sections:
```html
<div class="section-gap section-gap-lg" aria-hidden="true"></div>
```

**Hero sections** need `margin-top: var(--navbar-height)` on desktop, reset to `0` at `max-width: 1023px` (navbar collapses from 80px to 70px at that breakpoint).

---

## CSS conventions

### Typography — the critical rule

**Add a design system text class to the HTML element. Never write font properties in `<style>` blocks.**

Banned from every component `<style>` block:
```
font-family  font-size  font-weight  line-height  letter-spacing  text-transform
```

`h1 / h2 / h3` — these are styled by element selectors in `design-system.css`. Never add a text class to them.

| Class | Family | Size token | Weight |
|---|---|---|---|
| `.text-hero` | Source Serif 4 | `--fs-hero` (4.5rem) | semibold |
| `.text-metrics` | Source Serif 4 | `--fs-metrics` (3rem) | semibold |
| `.text-h4` | Roboto | `--fs-h4` (2rem) | regular |
| `.text-body-p0` | Roboto | `--fs-body-xl` (1.5rem) | medium |
| `.text-body-p0-bold` | Roboto | `--fs-body-xl` (1.5rem) | semibold |
| `.text-body-p1` | Roboto | `--fs-body-l` (1.25rem) | regular |
| `.text-body-p1-bold` | Roboto | `--fs-body-l` (1.25rem) | medium |
| `.text-body-p1-upper` | Roboto | `--fs-body-l` (1.25rem) | regular, uppercase |
| `.text-body-p1-bold-upper` | Roboto | `--fs-body-l` (1.25rem) | medium, uppercase |
| `.text-body-p2` | Roboto | `--fs-body-m` (1.125rem) | regular |
| `.text-body-p2-upper` | Roboto | `--fs-body-m` (1.125rem) | regular, uppercase |
| `.text-body-p2-bold-upper` | Roboto | `--fs-body-m` (1.125rem) | medium, uppercase |
| `.text-body-p3` | Roboto | `--fs-body-s` (1rem) | regular |
| `.text-button-regular` | Roboto | `--fs-button-regular` (1.125rem) | medium, uppercase |
| `.text-button-small` | Roboto | `--fs-button-small` (0.875rem) | medium, uppercase |
| `.text-label-regular` | Roboto | `--fs-body-m` (1.125rem) | medium, uppercase |
| `.text-label-small` | Roboto | `--fs-label-small` (0.875rem) | medium, uppercase |

No exact match → use the closest by font-size first, then weight. For a genuinely new combination, add a class to `src/styles/design-system.css` following the existing pattern.

### Spacing tokens

`--space-1` (0.25rem) through `--space-13` (7.5rem). **Never use raw `px` or `rem` values for padding, margin, or gap.**

Exception: `1px` / `2px` borders → `--stroke-1` / `--stroke-2`.

**Card-to-card gaps:** always `--layout-card-gap` (desktop: 2.5rem, ≤1023px: 1rem). Never a raw `--space-*` token for inter-card spacing.

### Color tokens

Semantic tokens only — never raw hex or `rgba()` when a token exists.

- Text: `--text-primary`, `--text-secondary`, `--text-disabled`, `--text-white`, `--text-accent`
- Surface: `--surface-primary`, `--surface-white`, `--surface-blue`
- Border: `--border-primary`, `--border-secondary`, `--border-tertiary`

For gradient opacity stops: `color-mix(in srgb, var(--token) N%, transparent)` — never raw `rgba()`.

### Other tokens

- Border radius: `--radius-xs / -tag / -s / -m / -full` — never raw `px`
- Stroke: `--stroke-1` (1px), `--stroke-2` (2px)
- Shadows: `--shadow-e1 / -e2 / -drop / -nav / -card / -eyebrow`
- Section height: `.section-height-100` / `.section-height-80` — never hardcode `100vh`

### Icon sizes

Always use classes from `src/styles/icon-sizes.css`. Never `--space-*` tokens or raw values for icon `width`/`height`.

`.icon-xs` (0.75rem) · `.icon-s` (1rem) · `.icon-m` (1.5rem) · `.icon-l` (2rem) · `.icon-xl` (2.5rem) · `.icon-2xl` (3rem) · `.icon-3xl` (4rem) · `.icon-4xl` (5rem)

Usage: `<img src="..." class="icon-3xl" alt="" />`

### What belongs in a component `<style>` block

Only layout properties: `color`, `display`, `position`, `padding`, `margin`, `gap`, `width`, `height`, `border`, `border-radius`, `box-shadow`, `transition`, `z-index`, `overflow`, `cursor`.

### Responsive breakpoints

- `@media (max-width: 1023px)` — tablet / column stack
- `@media (max-width: 767px)` — mobile

### `is:global` and `!important`

`is:global` only when a component genuinely needs to style elements outside its own template. `!important` requires a comment explaining why.

---

## i18n and CMS

### Translation helper

```astro
{t(copy, 'hero_title', locale, 'Fallback English text')}
```

Always include the 4th fallback argument. Copy keys are `snake_case`, prefixed with the section name: `hero_title`, `mtm_suite_body`, `dat_feature_1_label`.

### Before adding any new copy key

Check `src/content/copy/[pageId].json` first — reuse existing keys. When a key is genuinely new, add it to the JSON with both `en` and `fr` fields (empty `fr` is acceptable if untranslated).

### Locale patterns

- `getStaticPaths()` returns `[{ params: { locale: 'en' } }, { params: { locale: 'fr' } }]`
- Every page builds `localeSwitchUrls: { en: '...', fr: '...' }` and passes it to `<Navbar>` and `<Layout>`
- `resolveLocale(raw)` coerces any non-`fr` value to `'en'`

### Page-to-GID map (`src/lib/cms/config.ts`)

`home`, `mtm-18-plus`, `juniors`, `newcomers`, `census`, `analytic-tools` are active. Solution pages (`media`, `advertising`, etc.) have GID `0` — no live sheet data yet; always commit local JSON before making those pages public.

---

## Shared components

**`Button.astro`** — Props: `variant` (`primary` | `secondary` | `scroll` | `tertiary` | `secondary-icon`), `size` (`md` | `lg`), `href`, `type`, `class`. `href` → `<a>`, no `href` → `<button>`. `size="md"` → `text-button-small`; `size="lg"` → `text-button-regular`.

**`Eyebrow.astro`** — Uses `text-button-small`. Style block: layout only.

**`Navbar.astro`** — Locale-aware. Included in page files directly, not in Layout.

**`ProductPill.astro`** — Props: `variant` (`mtm18plus` | `junior` | `newcomers` | `census`), `size` (`xsmall` | `small` | `big`).

---

## Codebase map

Structured analysis lives in `.planning/codebase/`:
- `STACK.md` — build tooling and dependency details
- `ARCHITECTURE.md` — layer model, data flow, entry points
- `STRUCTURE.md` — directory inventory
- `CONVENTIONS.md` — full naming and CSS rules with examples
- `CONCERNS.md` — tech debt, known bugs (broken `gov-ngos` links, missing BASE_URL prefixes), and incomplete pages

Detailed Figma integration and section creation workflow: `.claude/commands/create-section.md`
