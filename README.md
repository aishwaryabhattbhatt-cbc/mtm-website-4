# MTM Website

Marketing website for MTM (Media Technology Monitor), a CBC initiative that tracks Canadian media consumption. Built with [Astro 5](https://astro.build), deployed to GitHub Pages. Supports English (`en`) and French (`fr`).

- **Live site**: https://aishwaryabhattbhatt-cbc.github.io/mtm-website-4/
- **Base path**: `/mtm-website-4/`
- **Future domain**: `https://www.mtm-otm.ca` (not yet cut over — see below)

### Moving to www.mtm-otm.ca

Every absolute URL on the site is derived from the `site` + `base` values in
`astro.config.mjs`, so the cutover is a config change, not a find-and-replace.
That covers canonical tags, hreflang, og:image, the sitemap, `robots.txt`,
`llms.txt`, `site.webmanifest`, the `.md.txt` page twins, and IndexNow.

Verify first:

```bash
BUILD_SITE_URL=https://www.mtm-otm.ca BUILD_BASE_PATH=/ npm run build
```

To cut over for real:

1. Point DNS at GitHub Pages (`www` CNAME -> `aishwaryabhattbhatt-cbc.github.io`).
2. Change the two defaults in `astro.config.mjs` to `https://www.mtm-otm.ca` and `/`.
3. Add `public/CNAME` containing `www.mtm-otm.ca`. **This file is the switch** —
   committing it makes GitHub Pages serve the custom domain, so add it last.
4. Redeploy, then resubmit the sitemap in Google Search Console.

See [`docs/seo.md`](docs/seo.md) for the full SEO inventory and the parts of a
domain change the env vars do *not* cover.

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

