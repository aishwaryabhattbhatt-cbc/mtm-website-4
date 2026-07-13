# Testing Patterns

**Analysis Date:** 2026-06-10

## Test Framework

**Runner:** None — there is no unit or integration test framework configured in this project.

No `jest.config.*`, `vitest.config.*`, or test runner packages are present in `package.json`. No `.test.*` or `.spec.*` files exist in the codebase.

**What replaces automated tests:** A multi-step validation pipeline run on every commit and CI push.

## Validation Pipeline

The primary quality gate is `npm run validate`, which chains three steps:

```bash
npm run validate   # runs: npm run check && npm run build && npm run audit:site
```

| Step | Command | What it checks |
|---|---|---|
| TypeScript check | `npm run check` (`astro check`) | Type errors across all `.astro`, `.ts` files |
| Build | `npm run build` | Full Astro production build — fails on broken imports, missing content, build errors |
| Site audit | `npm run audit:site` (`node scripts/site-audit.mjs`) | Production-code quality rules (see below) |

## Site Audit (`scripts/site-audit.mjs`)

Walks `src/` and `public/` (excluding `.claude/`, `.astro/`, `dist/`, `node_modules/`) and fails the build on any of:

- **Placeholder links:** `href="#"` in any `.astro`, `.ts`, `.js`, `.css`, `.mjs` file
- **Inline styles:** `style="..."` attribute in any Astro template
- **Debug output:** `console.log(` in any `src/` file or `public/js/runtime/script.js`
- **Document duplication:** Any page under `src/pages/` that contains `<html` (should use `src/layouts/Layout.astro` instead — only `src/pages/index.astro` is exempted)

Exit code is non-zero on any failure, blocking deployment.

## Pre-commit Hook (`husky`)

Configured via husky (`package.json` `"prepare": "husky"`) with two hooks in `.husky/pre-commit`:

```bash
npx lint-staged
npm run validate
```

**lint-staged** (from `package.json`):
```json
"lint-staged": {
  "src/**/*.{astro,ts,css}": ["eslint", "prettier --write"]
}
```

On every commit, all staged `src/` files are:
1. Linted with ESLint (blocks commit on errors)
2. Formatted with Prettier (auto-rewrites and re-stages)

Then `npm run validate` runs the full TypeScript check + build + site audit. A commit only completes if all three pass.

## CI Pipeline (`.github/workflows/quality.yml`)

Triggers on:
- All pull requests
- Pushes to `main` and `claude/**` branches

Steps:
1. Checkout
2. Setup Node 24
3. `npm ci`
4. `npm run validate` (TypeScript check + build + site audit)

Failures block merge. No separate test job exists — the quality check IS the test suite.

## Deployment Pipeline (`.github/workflows/deploy.yml`)

Triggers on pushes to `main` only. Steps include:
1. `npm run sync-copy` — pulls CMS content from Google Sheets (`GOOGLE_SHEET_CSV_URL_MAP_JSON` secret)
2. `npm run build` — production Astro build
3. Deploy artifact to GitHub Pages

## Convention Review (Manual)

The `/review` command (`.claude/commands/review.md`) defines a manual review checklist run against changed files. It combines:

**Automated grep checks** (run via bash):
```bash
# Font properties in component styles
grep -rn "font-family|font-size|font-weight|line-height|letter-spacing|text-transform" src/components/ --include="*.astro"

# Raw hex colors
grep -rn "#[0-9a-fA-F]{3,6}" src/components/ --include="*.astro"

# Raw rgba() calls
grep -rn "rgba(" src/components/ --include="*.astro"

# Hardcoded base path
grep -rn "/mtm-website-4/" src/components/ src/pages/ --include="*.astro"

# Hardcoded 100vh
grep -rn "100vh" src/components/ --include="*.astro"

# Raw px spacing values (excluding 1px/2px strokes)
grep -Prn "(?<!stroke-width:)\s[1-9][0-9]*px" src/components/ --include="*.astro"
```

**Manual checklist categories:**
- Typography (text classes present, h1/h2/h3 have no class)
- Spacing & sizing (`--space-*` tokens, `--radius-*`, `--shadow-*`, `--stroke-*`)
- Color (semantic tokens only)
- Layout (12-column grid, section height utilities, `--content-margin-inline`)
- Component structure (sections in correct folders, shared components used)
- Accessibility (alt text, aria-hidden, focus-visible, aria-label, section landmarks)
- CMS & copy (no new key without checking existing, `t()` fallback present, snake_case keys)
- Assets & paths (`import.meta.env.BASE_URL`, eager/lazy loading, aria-hidden on decorative SVGs)

Result: **READY** (all pass) or **NOT READY** (violations listed with file + line).

## What Is Effectively Tested

| Area | How tested |
|---|---|
| TypeScript types | `astro check` on every commit and CI |
| Build correctness | `astro build` on every commit and CI |
| Production code quality | `scripts/site-audit.mjs` on every commit and CI |
| Lint rules | ESLint via lint-staged on every commit |
| Code formatting | Prettier via lint-staged on every commit |
| CSS/component conventions | Manual `/review` grep + checklist (not automated) |
| i18n copy | No automated test — missing keys log `console.warn` at build time |
| Visual/UI correctness | No automated test — manual review only |
| Accessibility | No automated test — manual review checklist only |

## Test Coverage Gaps

**No unit or integration test runner is configured.** The following areas have no automated coverage:

- `src/lib/i18n/t.ts` — translation function logic (missing key handling, locale fallback)
- `src/lib/cms/getPageContent.ts` — local file read, sheet fetch fallback, in-memory cache, dictionary merge
- `src/lib/cms/sheets.ts` — CSV parsing logic
- `scripts/sync-copy.mjs` — CSV fetch, parse, and write pipeline
- Component rendering — no snapshot or render tests
- Responsive layout — no automated visual regression

---

*Testing analysis: 2026-06-10*
