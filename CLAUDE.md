# MTM Website — Claude Reference

## Before marking any task done

Run `/review` to check every change against the project's conventions. A single violation means the work is incomplete.

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
npm run validate     # check + build + site audit (runs in pre-commit)
```

## Stack

- **Framework**: Astro 5 (`.astro` components, `[locale]` routing)
- **Styles**: CSS custom properties only — `src/styles/design-system.css` (tokens + text classes), `src/styles/styles.css` (resets + layout utils)
- **Fonts**: Source Serif 4 (headings), Roboto (body) — loaded via Google Fonts in `Layout.astro`
- **Copy**: Google Sheets → CSV → `src/content/copy/[pageId].json` via `sync-copy`
- **i18n**: `en` / `fr`, all routes under `[locale]/`, translation via `t(copy, 'key', locale, 'Fallback')`
- **Deploy**: GitHub Pages at base path `/mtm-website-4/`
