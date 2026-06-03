Run a convention review against every changed file in the working tree.

## Step 1 — Identify files in scope

If arguments are provided, review only those files. Otherwise, collect all staged + unstaged changed files:

```bash
git diff --name-only HEAD
git diff --name-only --cached
```

## Step 2 — Run automated grep checks

Run these commands and collect all output. Any output = a violation.

```bash
# Typography — font properties in component styles
grep -rn "font-family\|font-size\|font-weight\|line-height\|letter-spacing\|text-transform" src/components/ --include="*.astro"

# Typography — raw px font sizes
grep -rn "font-size:.*[0-9]px" src/components/

# Typography — responsive font-size in @media inside components
grep -rn "font-size" src/components/ --include="*.astro" -A2 | grep -B1 "@media"

# Spacing — raw px values (excluding 1px/2px strokes)
grep -Prn "(?<!stroke-width:)\s[1-9][0-9]*px" src/components/ --include="*.astro" | grep -v "stroke\|border-width\|--stroke"

# Color — raw hex values
grep -rn "#[0-9a-fA-F]\{3,6\}" src/components/ --include="*.astro"

# Color — raw rgba when a token exists
grep -rn "rgba(" src/components/ --include="*.astro"

# Assets — hardcoded base path
grep -rn "/mtm-website-4/" src/components/ src/pages/ --include="*.astro"

# Section height — hardcoded 100vh in components
grep -rn "100vh" src/components/ --include="*.astro"
```

## Step 3 — Manual checklist review

Check each changed `.astro` file against these items:

### Typography
- [ ] Every non-heading text element has a design system text class (`text-body-p1`, `text-button-small`, etc.)
- [ ] `<h1>`, `<h2>`, `<h3>` have NO text class added

### Spacing & sizing
- [ ] All padding, margin, gap use `--space-*` tokens
- [ ] Border radius uses `--radius-*` tokens
- [ ] Shadows use `--shadow-*` tokens
- [ ] Strokes use `--stroke-1` / `--stroke-2`

### Color
- [ ] All colors use semantic tokens (`--text-*`, `--surface-*`, `--border-*`)

### Layout
- [ ] Multi-column layouts use the 12-column grid (`.row`, `.col`, `.col-lg-*`)
- [ ] Sections use `.section-height-100` / `.section-height-80` — never `100vh`
- [ ] `--content-margin-inline` used for horizontal padding

### Component structure
- [ ] Section lives in `src/components/[page-name]/` — no markup in page files
- [ ] Shared UI uses Button/Eyebrow/Navbar — not reimplemented inline
- [ ] No `!important` without a comment
- [ ] `is:global` only where genuinely required

### Accessibility
- [ ] All `<img>` have `alt` (descriptive or `""` for decorative)
- [ ] Decorative overlays have `aria-hidden="true"`
- [ ] Interactive elements have `:focus-visible` styles
- [ ] Icon-only buttons have `aria-label`
- [ ] `<section>` landmarks have an accessible name via `aria-label` or heading

### CMS & copy
- [ ] No new copy key without checking existing keys first
- [ ] All `t()` calls include a fallback string (4th arg)
- [ ] Copy keys are `snake_case`

### Assets & paths
- [ ] Internal asset paths use `import.meta.env.BASE_URL`
- [ ] Above-the-fold images use `loading="eager"`; below the fold use `loading="lazy"`
- [ ] Decorative SVGs have `aria-hidden="true"`

## Step 4 — Report

Output a summary with:
- **PASS** or **FAIL** for each category (Typography, Spacing, Color, Layout, Structure, Accessibility, CMS, Assets)
- For each FAIL: the file, line number, and the specific violation
- A final overall verdict: **READY** (all pass) or **NOT READY** (fix required)
