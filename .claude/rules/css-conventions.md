---
globs: src/styles/**, src/components/**
---

# CSS Conventions

## Typography — the one rule

**Add a design system text class to the HTML element. Never write font properties in `<style>` blocks.**

Banned from every component `<style>` block:
```
font-family  font-size  font-weight  line-height  letter-spacing  text-transform
```

Also banned: responsive `font-size` overrides inside `@media` queries in components — `design-system.css` already scales tokens at every breakpoint.

### h1 / h2 / h3 — no class needed
These element selectors are defined in `design-system.css`. Never add a text class to them.

### Text class reference

| Class | Family | Size token | Weight |
|---|---|---|---|
| `.text-hero` | Source Serif 4 | `--fs-hero` (4.5rem) | semibold |
| `.text-metrics` | Source Serif 4 | `--fs-metrics` (3rem) | semibold |
| `.text-h4` | Roboto | `--fs-h4` (2rem) | regular |
| `.text-body-p0` | Roboto | `--fs-body-xl` (1.5rem) | medium |
| `.text-body-p0-bold` | Roboto | `--fs-body-xl` (1.5rem) | semibold |
| `.text-body-p1` | Roboto | `--fs-body-l` (1.25rem) | regular |
| `.text-body-p1-bold` | Roboto | `--fs-body-l` (1.25rem) | medium |
| `.text-body-p2` | Roboto | `--fs-body-m` (1.125rem) | regular |
| `.text-body-p3` | Roboto | `--fs-body-s` (1rem) | regular |
| `.text-button-regular` | Roboto | `--fs-button-regular` (1.125rem) | medium, uppercase |
| `.text-button-small` | Roboto | `--fs-button-small` (0.875rem) | medium, uppercase |
| `.text-label-regular` | Roboto | `--fs-body-m` (1.125rem) | medium, uppercase |
| `.text-label-small` | Roboto | `--fs-label-small` (0.875rem) | medium, uppercase |

No exact match → use the closest by font-size first, then weight. If a genuinely new combination is needed, add a class to `design-system.css` following the existing pattern, then use that class.

## Spacing tokens

`--space-1` (0.25rem) through `--space-13` (7.5rem). Never use raw `px` or `rem` values for spacing.

Exceptions: `1px` / `2px` borders → use `--stroke-1` / `--stroke-2`.

### Card gaps

Always use `--layout-card-gap` for the gap between cards in any grid, flex row, or horizontal scroll container. Never use a raw `--space-*` token for inter-card spacing — this token has responsive overrides built in (desktop: 2.5rem, ≤1023px: 1rem).

## Color tokens

Semantic tokens only — never raw hex or `rgba()` when a token exists.

- Text: `--text-primary`, `--text-secondary`, `--text-disabled`, `--text-white`, `--text-accent`
- Surface: `--surface-primary`, `--surface-white`, `--surface-blue`
- Border: `--border-primary`, `--border-secondary`, `--border-tertiary`

## Other tokens

- **Border radius**: `--radius-xs / -tag / -s / -m / -full` — never raw `px`
- **Stroke**: `--stroke-1` (1px), `--stroke-2` (2px)
- **Shadows**: `--shadow-e1 / -e2 / -drop / -nav / -card / -eyebrow`

## What belongs in a component `<style>` block

Only layout properties: `color`, `display`, `position`, `padding`, `margin`, `gap`, `width`, `height`, `border`, `border-radius`, `box-shadow`, `transition`, `z-index`, `overflow`, `cursor`.

## Section sizing

Never hardcode `100vh`. Use utility classes from `styles.css`:
- `.section-height-100` — `calc(100vh - navbar-height)` on desktop, `auto` on mobile
- `.section-height-80` — `calc(80vh - navbar-height)` on desktop, `auto` on mobile

Section width is always `100%`. Use `--content-margin-inline` for horizontal page padding.
