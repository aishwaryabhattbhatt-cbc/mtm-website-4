# MTM Frontend Skills: Layout Defaults

This file defines repeatable layout actions for all future sections/pages.

## 1) Global content margin system (already implemented)

Use `--content-margin-inline` as the single source of truth for horizontal content inset.

Breakpoint mapping:
- Base / small (`<768`): `24px`
- Medium (`>=768`): `48px`
- Large (`>=1024`): `72px`
- Extra large (`>=1440`): `120px`
- XXL (`>=1920`): `240px`

Source of truth is in [public/styles.css](public/styles.css).

## 2) Default structure rule

- Section/background wrappers stay full-bleed (`width: 100%` or `100vw`)
- Content wrappers are inset using the margin system

Use class `content-boundary` for any new content wrapper.

## 3) New section checklist (repeat every time)

1. Create full-width section wrapper (background layer)
2. Add inner content wrapper with class `content-boundary`
3. Put all text/cards/buttons inside this inner wrapper
4. Do not hardcode breakpoint paddings for outer content width
5. Use existing spacing tokens for internal component spacing

## 4) Copy/paste starter pattern

```html
<section class="my-section"> 
  <div class="content-boundary">
    <!-- section content -->
  </div>
</section>
```

```css
.my-section {
  width: 100%;
  /* background styles here */
}
```

## 5) Guardrails

- Prefer `var(--content-margin-inline)` for horizontal inset
- Avoid new per-component page-margin systems
- Keep backgrounds independent from content width
- If a component must be full-bleed, apply that only to the background/media layer

## 6) Section height defaults

The navbar is persistent, so section heights must always account for it.

Use these defaults from [public/styles.css](public/styles.css):
- `--section-height-100` = `calc(100vh - var(--navbar-height))`
- `--section-height-80` = `calc(80vh - var(--navbar-height))`

Navbar height tokens:
- Desktop: `--navbar-height: 80px`
- Tablet/mobile: `--navbar-height: 70px`

Utilities:
- `section-height-100`
- `section-height-80`

Use these instead of hardcoding `100vh`, `80vh`, or manual navbar subtraction.

## 7) Existing components already aligned

- Main container patterns in [public/styles.css](public/styles.css)
- Research section in [src/components/home/ResearchTabsSection.astro](src/components/home/ResearchTabsSection.astro)

## 8) Google Sheets CMS system (EN/FR)

Sheet model (per tab):
- Column 1 = `key`
- Column 2 = English (`en`)
- Column 3 = French (`fr`)

Routing model:
- Locale routes only: `/en/...` and `/fr/...`
- Root `/` redirects to `/en/`

Freshness model:
- Prerender copy at build-time when sheet config exists
- Refresh copy client-side on interval with Papa Parse (near-live updates)

Missing key/value policy:
- If locale value missing, fallback to English
- If key missing, keep fallback literal and log warnings

## 9) CMS rules for all new pages/components

1. In Astro frontmatter, define `copyKeys` for all user-facing strings.
2. Render copy through `t(copy, key, locale, fallback)`.
3. Add `data-copy-key="..."` on rendered text nodes for runtime refresh.
4. Keep fallback literals readable so pages work without sheet access.
5. Do not ship hardcoded translatable text without a key.

## 10) CMS file locations

- Env contract: [.env.example](.env.example)
- Loader/config: [src/lib/cms/config.ts](src/lib/cms/config.ts), [src/lib/cms/sheets.ts](src/lib/cms/sheets.ts), [src/lib/cms/getPageContent.ts](src/lib/cms/getPageContent.ts)
- Translation helper: [src/lib/i18n/t.ts](src/lib/i18n/t.ts)
- Locale page route: [src/pages/[locale]/index.astro](src/pages/%5Blocale%5D/index.astro)

Preferred setup for published sheets:
- Map each page to a direct published CSV URL in `GOOGLE_SHEET_CSV_URL_MAP_JSON`
- Only use `GOOGLE_SHEET_ID` + `GOOGLE_SHEET_TAB_MAP_JSON` when working from raw sheet/tab IDs

## 11) New page checklist (CMS + layout)

1. Add tab mapping (`pageId -> gid`) in env JSON.
2. Use full-bleed section wrappers + `content-boundary` for content.
3. Define frontmatter `copyKeys` and fallback values.
4. Render with `t()` and `data-copy-key` attributes.
5. Validate EN + FR and runtime refresh behavior.
