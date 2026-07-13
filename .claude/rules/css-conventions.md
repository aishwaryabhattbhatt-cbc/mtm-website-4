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
| `.text-metrics` | Source Serif 4 | `--fs-metrics` (3.25rem) | semibold |
| `.text-h4` | Roboto | `--fs-h4` (1.5rem) | regular |
| `.text-body-p0` | Roboto | `--fs-body-xl` (1.5rem) | regular |
| `.text-body-p0-bold` | Roboto | `--fs-body-xl` (1.5rem) | medium |
| `.text-body-p1` | Roboto | `--fs-body-l` (1.25rem) | regular |
| `.text-body-p1-bold` | Roboto | `--fs-body-l` (1.25rem) | medium |
| `.text-body-p1-upper` | Roboto | `--fs-body-l` (1.25rem) | regular, uppercase |
| `.text-body-p1-bold-upper` | Roboto | `--fs-body-l` (1.25rem) | medium, uppercase |
| `.text-body-p2` | Roboto | `--fs-body-m` (1.125rem) | regular |
| `.text-body-p2-bold` | Roboto | `--fs-body-m` (1.125rem) | medium |
| `.text-body-p2-upper` | Roboto | `--fs-body-m` (1.125rem) | regular, uppercase |
| `.text-body-p2-bold-upper` | Roboto | `--fs-body-m` (1.125rem) | medium, uppercase |
| `.text-body-p3` | Roboto | `--fs-body-s` (1rem) | regular |
| `.text-body-p3-small` | Roboto | `--fs-label-small` (0.875rem) | regular |
| `.text-button-regular` | Roboto | `--fs-button-regular` (1.125rem) | medium, uppercase |
| `.text-button-small` | Roboto | `--fs-button-small` (0.875rem) | medium, uppercase |
| `.text-label-regular` | Roboto | `--fs-body-m` (1.125rem) | medium, uppercase |
| `.text-label-small` | Roboto | `--fs-label-small` (0.875rem) | medium, uppercase |

Note: `.text-h4` and `.text-body-p0` coincide at 1.5rem regular on desktop but scale differently at breakpoints — h4 is a heading tier (steps down with the heading scale), p0 is the largest body tier. Pick by role, not by desktop appearance.

Line-height is consistent within each role: all heading classes (hero, h1–h4, metrics, tertiary-h3) use `--lh-tight` (1.1); all `.text-body-p*` classes use `--lh-relaxed` (1.4); all button/label/pill classes use `--lh-tight` (1.1). Don't override `line-height` locally for paragraph-length text — only a genuinely single-line, non-paragraph use (a pill, a badge) may justify a commented exception.

`.text-body-p0-bold` uses medium weight (500, matching `.text-body-p1-bold`/`.text-body-p2-bold` — not semibold) and `--ls-body-lg` letter-spacing (-1px), not `--ls-subhead` (-1.5px) like `.text-body-p0`/`.text-h4`. The heavier `--ls-subhead` pull (tuned for regular-weight h4) over-compresses bold glyphs at this size. Don't "fix" either of these back to match p0 — they're intentional.

No exact match → use the closest by font-size first, then weight. If a genuinely new combination is needed, add a class to `design-system.css` following the existing pattern, then use that class.

## Spacing tokens

Never use raw `px` or `rem` values for spacing. Always use a token.

Exceptions: `1px` / `2px` borders → `--stroke-1` / `--stroke-2`.

### Token reference

| Token | Value | Purpose |
|---|---|---|
| `--space-1` | 0.25rem (4px) | Micro gaps — icon-to-label, dot separators |
| `--space-2` | 0.5rem (8px) | Tight inline gaps — tags, pill rows, icon+text pairs |
| `--space-3` | 0.75rem (12px) | Small element gaps — stacked labels, button icon gap |
| `--space-4` | 1rem (16px) | Default element gap — list rows, inline groups |
| `--space-5` | 1.25rem (20px) | Slightly loose element gap — nav items, form fields |
| `--space-6` | 1.5rem (24px) | Component internal padding — cards, small sections |
| `--space-7` | 2rem (32px) | Comfortable component gap — between text blocks |
| `--space-8` | 2.5rem (40px) | Section sub-group spacing — between heading and content |
| `--space-9` | 3rem (48px) | Section vertical padding — top/bottom of content sections |
| `--space-10` | 3.5rem (56px) | Generous section padding |
| `--space-11` | 4rem (64px) | Large section padding |
| `--space-12` | 5rem (80px) | Hero / feature section vertical padding |
| `--space-13` | 7.5rem (120px) | Maximum page-level vertical spacing (scales to 3rem on mobile) |

### Usage by context

**Micro (--space-1 to --space-3)** — gaps inside a single UI element: icon-to-text, tag-to-tag, dot separators, chevron gaps.

**Element (--space-3 to --space-6)** — spacing between sibling elements within a component: label+value stacks, button rows, form field gaps, card internal padding.

**Component (--space-6 to --space-9)** — spacing within a section between its sub-groups: heading+body, body+CTA, feature rows. Also use for card internal padding on larger cards.

**Section (--space-9 to --space-13)** — vertical padding on `<section>` elements and major layout blocks. Use `--space-12` or `--space-13` for hero and full-bleed feature sections.

### Consistency rule

Pick the token that matches the context tier above and use it consistently across all components for that same context. For example, if the gap between a card heading and its body copy is `--space-4`, every card on the page should use `--space-4` for that relationship — not `--space-3` in one card and `--space-5` in another.

### Card gaps

Always use `--layout-card-gap` for the gap between cards in any grid, flex row, or horizontal scroll container. Never substitute a `--space-*` token — `--layout-card-gap` has responsive overrides built in (desktop: 2.5rem, ≤1023px: 1rem).

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
