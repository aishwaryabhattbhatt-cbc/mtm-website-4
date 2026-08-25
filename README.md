# MTM Website

Marketing website for MTM (Media Technology Monitor), a CBC initiative that tracks Canadian media consumption. Built with [Astro 5](https://astro.build), deployed to GitHub Pages. Supports English (`en`) and French (`fr`).

- **Live site**: https://aishwaryabhattbhatt-cbc.github.io/mtm-website-4/
- **Base path**: `/mtm-website-4/`

## Getting started

```sh
npm install
npm run dev      # http://localhost:4321/mtm-website-4/ (falls back to 4322)
```

## Commands

| Command             | Action                                                    |
| :------------------- | :--------------------------------------------------------- |
| `npm run dev`         | Start the dev server                                       |
| `npm run build`       | Production build to `./dist/`                              |
| `npm run preview`     | Preview the production build locally                       |
| `npm run check`       | TypeScript check via `astro check`                          |
| `npm run lint`        | ESLint (errors block; warnings surfaced only)                |
| `npm run format`      | Prettier — formats all `src` files                          |
| `npm run sync-copy`   | Pull copy from Google Sheets into `src/content/copy/[pageId].json` |
| `npm run validate`    | `check` + `build` + site audit (also runs pre-commit)        |

## Project structure

```text
src/
├── layouts/          # HTML shell (Layout.astro) — no CMS or locale logic
├── pages/[locale]/   # Route entry points, getStaticPaths(), section ordering
├── components/
│   ├── {pageName}/   # Page-specific section components
│   └── shared/       # UI primitives — Button, Navbar, Eyebrow, etc.
├── lib/
│   ├── cms/          # CMS types, page-to-sheet config, page loader
│   ├── i18n/         # t() helper, locale routing
│   └── icons/        # Icon registry
├── content/copy/     # Synced CMS copy (JSON per page)
└── styles/           # design-system.css — tokens, typography, spacing
```

