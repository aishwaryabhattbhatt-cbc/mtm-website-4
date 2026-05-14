# HomeHeroSection — Responsive Scaling Logic

## Overview

The hero section uses a single CSS custom property `--hero-scale` to shrink both the text column and the image collage proportionally as the viewport narrows. The same scale factor drives font sizes, internal gaps, and the collage zoom — keeping the two-column layout in the same visual proportion at every breakpoint.

---

## Viewport Ranges

### 1920px+ (base — no scaling)
- `--content-margin-inline`: 240px → available content: viewport − 480px
- Collage: full size (620 × 530px)
- Text: `max-width: min(700px, calc(100% - 700px))`
  - The `min()` formula ensures the gap never collapses: if available width < 1400px the text narrows to hold an 80px gap; above 1400px it caps at 700px and the gap grows naturally.

### 1555px – 1919px (large desktop — no scaling, gap guard active)
- `--content-margin-inline`: 120px → available content: viewport − 240px
- No media query overrides; the `min(700px, calc(100% - 700px))` base rule maintains the 80px minimum gap.
- At 1640px the full 700px text width is first reachable with an 80px gap.

### 1440px – 1554px (scale-down range 1)
- `--content-margin-inline`: 120px → available content: viewport − 240px
- `--hero-scale` interpolates from **1.0 → 0.913**

```
--hero-scale: calc(0.913 + (100vw - 1440px) / 1321px)
```

| Viewport | Scale  | Collage layout | Text max-width | Gap  |
|----------|--------|----------------|----------------|------|
| 1554px   | ~1.000 | ~620px         | ~614px         | 80px |
| 1500px   | ~0.954 | ~591px         | ~543px         | 80px |
| 1440px   | 0.913  | 565px          | 555px          | 80px |

### 1024px – 1439px (scale-down range 2)
- `--content-margin-inline`: 72px → available content: viewport − 144px
- `--hero-scale` interpolates from **0.913 → 0.700** (continuous with range 1 at the 1439/1440 boundary)

```
--hero-scale: calc(0.7 + (100vw - 1024px) / 1949px)
```

| Viewport | Scale  | Collage layout | Text max-width | Gap  |
|----------|--------|----------------|----------------|------|
| 1439px   | ~0.913 | ~565px         | ~650px         | 80px |
| 1200px   | ~0.800 | ~496px         | ~520px         | 80px |
| 1024px   | 0.700  | ~434px         | ~366px         | 80px |

Note: the text max-width is wider at 1439px than at 1440px because the margin drops from 120px to 72px at that boundary, adding 96px of available content.

### ≤ 1023px (mobile/tablet — separate layout)
- Collage is not scaled by `--hero-scale`; this range uses separate mobile styles (single-column, different font sizes).

---

## How `--hero-scale` Is Applied

| Property | Formula |
|---|---|
| Font size (title) | `calc(var(--fs-hero) * var(--hero-scale))` |
| Font size (subtitle) | `calc(var(--fs-body-xl) * var(--hero-scale))` |
| Text column gap | `calc(24px * var(--hero-scale))` |
| Text column max-width | `calc(100% - 620px * var(--hero-scale) - 80px)` |
| Collage visual + layout | `zoom: var(--hero-scale)` on `.hero-image-collage` |

The text `max-width` formula explicitly reserves space for the collage (`620px × scale`) and a fixed **80px gap**, so the gap never collapses — the text column narrows instead.

`zoom` is used on the collage (rather than `transform: scale`) because it shrinks both the visual rendering and the flex layout footprint in one step, and it correctly scales all five absolutely-positioned child images without requiring coordinate recalculation.

---

## Why `calc()` Division, Not Multiplication

The interpolation uses `(100vw - Npx) / Mpx` (length ÷ length = dimensionless), **not** `(100vw - Npx) * 0.000N` (length × number = length). Adding a length to the dimensionless base value `0.913` would be invalid CSS and silently invalidate the entire custom property.

---

## Scale Derivation

**Range 1 (1440–1554px):**
- At 1555px: available content = 1315px, scale = 1.0
- At 1440px: available content = 1200px, scale = 1200 ÷ 1315 = **0.913**
- Divisor: (1555 − 1440) ÷ (1 − 0.913) = 115 ÷ 0.087 ≈ **1321**

**Range 2 (1024–1439px):**
- At 1439px: scale = **0.913** (matches range 1 bottom)
- At 1024px: scale = **0.700** (target for readable layout at laptop minimum)
- Divisor: (1439 − 1024) ÷ (0.913 − 0.700) = 415 ÷ 0.213 ≈ **1949**
