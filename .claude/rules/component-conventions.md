---
globs: src/components/**, src/pages/**
---

# Component & Page Conventions

## File naming

Section components follow: `[PageName][SectionName]Section.astro`

```
src/components/
  home/
    HomeHeroSection.astro
    HomeIntroductionSection.astro
    HomeMtmSuiteSection.astro
  [page-name]/
    [PageName][SectionName]Section.astro
  shared/
    Button.astro
    Eyebrow.astro
    Navbar.astro
```

Never put section markup directly in a page file. Always extract to a component in the matching folder, then import and render it in the page.

**Always use existing shared components.** Before writing markup for a button, chevron, pill, card, eyebrow, or nav element — check `src/components/shared/`. If a component covers it, use it. Never inline a re-implementation.

**Changes to a component go in the component file.** If asked to change how a shared element looks or behaves, edit the component — not a single usage site. Patching one location leaves every other instance inconsistent.

## Component structure

Every section component follows this template:

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

Section class naming is kebab-case from the component name: `HomeMtmSuiteSection` → `.mtm-suite-section`.

## Shared components — use these, never reimplement

### Button (`src/components/shared/Button.astro`)
Props: `variant` (`primary` | `secondary` | `scroll` | `tertiary`), `size` (`md` | `lg`), `href`, `type`, `class`

- `size="md"` (default) → `text-button-small`
- `size="lg"` → `text-button-regular`

### Eyebrow (`src/components/shared/Eyebrow.astro`)
Uses `text-button-small`. Style block contains layout properties only.

### Navbar (`src/components/shared/Navbar.astro`)
Locale-aware top nav. Included in page templates directly, not in Layout.

## i18n

- Locales: `en` (default), `fr`
- All pages live at `[locale]/...` — e.g. `/en/`, `/fr/`
- Wrap every user-facing string in `t()`:
  ```astro
  {t(copy, 'hero_title', locale, 'Fallback English text')}
  ```
- Always include the fallback string as the 4th argument.
- Copy keys are `snake_case`, prefixed with section name: `hero_title`, `mtm_suite_body`.

## CMS copy pipeline

1. Source of truth: Google Sheets (one tab per page)
2. `npm run sync-copy` writes `src/content/copy/[pageId].json`
3. `getPageDictionary(pageId)` reads local JSON at build time (no network)

**Before adding any new copy key** — check `src/content/copy/[pageId].json` for an existing key. Reuse before creating.

## Asset paths

Always use `import.meta.env.BASE_URL` for internal asset paths. Never hardcode `/mtm-website-4/`.

```astro
<!-- correct -->
<img src={`${import.meta.env.BASE_URL}images/hero.png`} alt="..." />

<!-- wrong -->
<img src="/mtm-website-4/images/hero.png" alt="..." />
```

## `is:global` styles

Only use `is:global` when the component genuinely needs to style elements outside its own template (e.g. Button, Navbar). Never use it to work around scoping for normal component styles.

## No `!important`

Do not use `!important` unless there is a documented reason in a comment.
