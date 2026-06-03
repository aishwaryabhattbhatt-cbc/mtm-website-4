# MTM Website — Self-Review Checklist

Run this against every component change before marking work complete.
A single failing item means the work is not done.

---

## 1. Typography

- [ ] Zero `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`, or `text-transform` properties exist in any component `<style>` block
- [ ] Every text element has a design system class on the HTML element (e.g. `text-body-p1`, `text-button-small`)
- [ ] `<h1>`, `<h2>`, `<h3>` have NO text class added — they are covered by element selectors in `design-system.css`
- [ ] No `font-size` overrides inside `@media` queries in component styles — responsive sizing comes from token overrides in `design-system.css`
- [ ] No raw font sizes anywhere (`13px`, `1.2em`, `18px`) — only token references allowed

---

## 2. Spacing & sizing

- [ ] All padding, margin, gap, width, height values use `--space-*` tokens or are expressed in `rem` where no token exists
- [ ] No raw `px` values for spacing (exceptions: `1px` / `2px` borders → use `--stroke-1` / `--stroke-2`)
- [ ] Border radius uses `--radius-*` tokens, not raw `px`
- [ ] Shadows use `--shadow-*` tokens, not raw `box-shadow` values
- [ ] Stroke/border widths use `--stroke-1` or `--stroke-2`

---

## 3. Color

- [ ] All colors use semantic tokens (`--text-primary`, `--surface-white`, `--neutral-grey-3`, etc.)
- [ ] No raw hex values (`#fff`, `#1c1c1c`, `#a9a8a8`)
- [ ] No raw `rgba()` values when a token exists for that color
- [ ] Background colors use `--surface-*` tokens, text colors use `--text-*` tokens

---

## 4. Layout & grid

- [ ] Multi-column desktop layouts use the 12-column grid (`.row`, `.col`, `.col-lg-*`)
- [ ] Mobile/tablet column stacking is handled by the grid (`col-12` base), not custom `flex-direction: column` overrides
- [ ] Sections use `.section-height-100` or `.section-height-80` — never hardcoded `100vh`
- [ ] Section width is always `100%` — never hardcoded `100vw` in component styles
- [ ] `--content-margin-inline` used for horizontal page padding, not hardcoded values

---

## 5. Component structure

- [ ] Section component lives in `src/components/[page-name]/` folder
- [ ] Section is imported and rendered in the page `.astro` file — no markup written directly in pages
- [ ] Shared UI (buttons, eyebrows) uses the shared components, not reimplemented inline
- [ ] No `!important` used unless there is a documented reason
- [ ] No `is:global` styles unless the component genuinely needs to style elements outside its own template (e.g. Button, Navbar)

---

## 6. Accessibility

- [ ] All `<img>` elements have an `alt` attribute — descriptive if informative, empty (`alt=""`) if decorative
- [ ] Decorative `<div>` overlays (grain, gradients, WebGL canvas) have `aria-hidden="true"`
- [ ] Interactive elements (buttons, links) have visible `:focus-visible` styles or inherit them from the design system
- [ ] Icon-only buttons have `aria-label`
- [ ] `<button>` elements that toggle state update `aria-expanded` via JS, not just in HTML
- [ ] Language/locale switcher links use `hreflang` and `lang` attributes ✓ (already done in Navbar)
- [ ] Colour contrast: text on backgrounds meets WCAG AA (4.5:1 for body text, 3:1 for large text)
- [ ] Touch targets are at least 44×44px on mobile
- [ ] `<section>` elements that are top-level landmarks have an accessible name via `aria-label` or a heading

---

## 7. CMS & copy

- [ ] No new copy key created without first checking `src/content/copy/[pageId].json` for an existing one
- [ ] All `t()` calls include a fallback string as the 4th argument
- [ ] Copy keys are `snake_case` and match the page they belong to

---

## 8. Assets & paths

- [ ] All internal asset paths use `import.meta.env.BASE_URL` — never hardcoded `/mtm-website-4/`
- [ ] Images that are above the fold use `loading="eager"`; below the fold use `loading="lazy"`
- [ ] SVG icons used as decoration have `aria-hidden="true"`

---

## Quick scan command

Before finishing, grep for banned patterns:

```bash
# Find raw px font sizes in component styles
grep -rn "font-size:.*[0-9]px" src/components/

# Find raw hex colors in component styles
grep -rn "#[0-9a-fA-F]\{3,6\}" src/components/

# Find font properties in component styles
grep -rn "font-family\|font-weight\|line-height\|letter-spacing" src/components/

# Find raw px spacing (not stroke)
grep -rn "[^-][0-9]\+px" src/components/ | grep -v "stroke\|border-width"
```

Any output from these commands = work is not done.
