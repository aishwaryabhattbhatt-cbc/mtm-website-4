Create a new Astro section component and wire it into a page file.

## Arguments (from the user's message after /create-section)

| Arg | Required | Example |
|---|---|---|
| `pageName` | yes | `home`, `mtm18plus` |
| `sectionName` | yes | PascalCase — `MtmSuite`, `Stats` |
| `pageFilePath` | yes | `src/pages/[locale]/index.astro` |
| `figmaUrl` | no | `https://www.figma.com/design/...?node-id=2-7413` |

## Step 1 — Resolve paths

- Component file: `src/components/<pageName>/<PageName><SectionName>Section.astro`
  - Example: pageName=`home`, sectionName=`MtmSuite` → `src/components/home/HomeMtmSuiteSection.astro`
- Page file: the `pageFilePath` argument exactly as given

Check both:
- If the component file already exists → STOP, tell the user. Never overwrite.
- If the page file does not exist → STOP, tell the user.

## Step 2 — Get the Figma design (if figmaUrl provided)

Parse the URL:
- `fileKey` = path segment after `/design/`
- `nodeId` = the `node-id` query param with `-` replaced by `:` (e.g. `2-7413` → `2:7413`)

Call `get_design_context` with `clientFrameworks: astro` and `clientLanguages: typescript,html,css`.
Call `get_screenshot` in parallel for visual reference.

If the response is sparse (too large), call `get_design_context` on each child symbol node listed in the response, two at a time, to get actual content. Continue until you have enough to understand the layout, text, and visual hierarchy.

Use the design to:
- Identify layout (columns, rows, cards, hero, etc.)
- Extract copy (headings, body text, labels, CTAs)
- Map colors and spacing to design tokens (see token table below)
- Note any image assets that need to be added to `src/assets/`

If no figmaUrl → use the blank template in Step 3.

## Step 3 — Write the component

Create the file at the resolved path. Follow this structure exactly:

```astro
---
// src/components/<pageName>/<FileName>.astro
// Figma node: <nodeId> — "<section description>"
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

### Conventions

**Always include both imports:**
```ts
import type { CMSDictionary, Locale } from '../../lib/cms/types';
import { t } from '../../lib/i18n/t';
```

**Always wrap text in `t()`:**
```astro
{t(copy, 'copy_key_name', locale, 'Fallback English text')}
```
Copy keys use `snake_case`, prefixed with the section name, e.g. `mtm_suite_title`.

**Section class naming** — kebab-case from component name:
- `HomeMtmSuiteSection` → `.mtm-suite-section`

**Full-viewport sections** (background, hero-style): `position: relative; width: 100%; min-height: 100vh`

**Content sections** (plain, scrolls normally): `padding: 80px var(--content-margin-inline)`

**Always add responsive breakpoints:**
- `@media (max-width: 1023px)` — tablet / column layout
- `@media (max-width: 767px)` — mobile

### Text class reference

Never write font properties in `<style>` blocks. Add the class to the HTML element instead.

| Figma text style | Class to use |
|---|---|
| Hero / large display heading | `text-hero` |
| Metrics / stat callout | `text-metrics` |
| h4-level subheading | `text-h4` |
| Body large (1.5rem) | `text-body-p0` |
| Body large bold | `text-body-p0-bold` |
| Body medium (1.25rem) | `text-body-p1` |
| Body medium bold | `text-body-p1-bold` |
| Body small (1.125rem) | `text-body-p2` |
| Body xs (1rem) | `text-body-p3` |
| Button / CTA (large) | `text-button-regular` |
| Button / CTA (small) | `text-button-small` |
| Label / tag (regular) | `text-label-regular` |
| Label / tag (small) | `text-label-small` |

`<h1>`, `<h2>`, `<h3>` are styled by element selectors in `design-system.css` — do not add a text class to them.

### Layout token reference

| Figma value | Token |
|---|---|
| Primary text (near-black) | `var(--text-primary)` |
| Secondary text (grey) | `var(--text-secondary)` |
| Horizontal page margin | `var(--content-margin-inline)` |
| Spacing (4px increments) | `var(--space-1)` → `var(--space-13)` |

## Step 4 — Wire into the page

Read the page file, then make two edits using the Edit tool (do not rewrite the whole file):

**1. Add the import** — insert after the last existing import line in the frontmatter:
```astro
import <ComponentName> from '../../components/<pageName>/<FileName>.astro';
```
Adjust the relative import path to match the page file's location.

**2. Add the component** — insert just before the closing `</main>` tag:
```astro
    <div class="section-gap section-gap-lg" aria-hidden="true"></div>

    <<ComponentName> locale={locale} copy={copy} />
```

## Step 5 — Report back

Tell the user:
- Full path of the component file created
- Lines added to the page file (import + usage)
- All copy keys used, so they can be added to the CMS dictionary
- If Figma was used: one sentence on layout decisions and token mappings
- Any image assets that need to be manually added to `src/assets/`

## Hard rules

- Never overwrite existing files
- Never edit any file other than the new component and the target page file
- Never use hardcoded hex colors if a design token covers it
- Never skip the `t()` wrapper for user-facing text
- Never add debug code or `console.log`
