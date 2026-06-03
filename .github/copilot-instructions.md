# Copilot Instructions for MTM Website

## Essential Project Rules

- **Astro 5, i18n, GitHub Pages**: All routes under `[locale]/`, always use `import.meta.env.BASE_URL` for internal assets.
- **Key scripts**: `npm run dev`, `npm run build`, `npm run check`, `npm run lint`, `npm run format`, `npm run sync-copy`, `npm run validate`.
- **Never edit JSON in `src/content/copy/` directly**; always use the sync script.
- **All new pages/components must support both `en` and `fr`**.
- **Do not add new frameworks or major dependencies without discussion.**


- **Component/section creation**: follow `.claude/commands/create-section.md` for step-by-step workflow, naming, Figma integration, wiring, and reporting.
- **Component structure, naming, and import rules**: see `.claude/rules/component-conventions.md` (e.g., never put section markup directly in a page, always use `[PageName][SectionName]Section.astro`).
- **CSS/typography rules**: see `.claude/rules/css-conventions.md` (e.g., never use font properties in component styles, always use design system text classes).
- **Icon registry**: use `src/lib/icons/registry.ts` for all icon references. Type-safe helpers: `getIconPath(category, name)`, `icons[category].iconName`. Categories: demographics, devices, services, tools, solutions, gen (utilities). 450+ SVG icons organized by semantic group.
- **Automated review**: run `.claude/commands/review.md` before marking work complete; any grep output = violation.

## Key Directories

- `src/components/` — UI components (feature- and shared-based)
- `src/pages/` — Astro pages, with `[locale]/` for i18n
- `src/content/copy/` — Localized copy (JSON, synced)
- `src/styles/` — Design tokens, resets, and global styles
- `src/layouts/Layout.astro` — Main layout
- `scripts/sync-copy.mjs` — Google Sheets copy sync

For details or edge cases, see `.claude/` or ask for clarification.
