# Hero Section — Responsive Scaling Pattern

A reusable reference for the left-content / right-visual two-column layout used in `HomeHeroSection`. Follow the same rules when applying this pattern elsewhere.

---

## Layout Model

Two modes depending on viewport width:

| Mode | Viewport | Direction | Description |
|---|---|---|---|
| **Row** | ≥ 1024px | Horizontal | Text left, collage right, fixed 80px gap |
| **Column** | ≤ 1023px | Vertical | Text top (centred), collage below (centred) |

---

## Viewport Ranges — Row Mode (≥ 1024px)

### 1920px+ — Base, no scaling

- `--content-margin-inline`: 240px → available = viewport − 480px
- Collage: full size (620 × 530px)
- Text `max-width: min(700px, calc(100% - 700px))`
  - When available < 1400px the formula narrows the text column to preserve an **80px gap**
  - Above 1400px available the cap is 700px and the gap grows naturally

### 1555px – 1919px — Large desktop, gap guard only

- `--content-margin-inline`: 120px → available = viewport − 240px
- No `--hero-scale` active; the base `min()` formula on text max-width keeps the gap ≥ 80px
- At exactly 1640px the text first reaches its 700px cap with an 80px gap

### 1440px – 1554px — Scale-down range 1

- `--content-margin-inline`: 120px → available = viewport − 240px
- `--hero-scale` interpolates **1.0 → 0.913**

```css
--hero-scale: calc(0.913 + (100vw - 1440px) / 1321px);
```

| Viewport | Scale | Collage layout | Text max-width | Gap |
|---|---|---|---|---|
| 1554px | ~1.000 | ~620px | ~614px | 80px |
| 1500px | ~0.954 | ~591px | ~543px | 80px |
| 1440px | 0.913 | 565px | 555px | 80px |

### 1024px – 1439px — Scale-down range 2

- `--content-margin-inline`: 72px → available = viewport − 144px
- `--hero-scale` interpolates **0.913 → 0.700** — continuous with range 1 at the shared boundary

```css
--hero-scale: calc(0.7 + (100vw - 1024px) / 1949px);
```

| Viewport | Scale | Collage layout | Text max-width | Gap |
|---|---|---|---|---|
| 1439px | ~0.913 | ~565px | ~650px | 80px |
| 1200px | ~0.800 | ~496px | ~520px | 80px |
| 1024px | 0.700 | ~434px | ~366px | 80px |

> The text max-width is wider at 1439px than at 1440px because `--content-margin-inline` drops from 120px to 72px at that boundary, adding 96px of available content. The gap formula still holds.

---

## How `--hero-scale` Is Applied (Row Mode)

| Property | Formula |
|---|---|
| Title font size | `calc(var(--fs-hero) * var(--hero-scale))` |
| Subtitle font size | `calc(var(--fs-body-xl) * var(--hero-scale))` |
| Text column gap | `calc(24px * var(--hero-scale))` |
| Text column max-width | `calc(100% - 620px * var(--hero-scale) - 80px)` |
| Collage visual + layout | `zoom: var(--hero-scale)` |

**Text max-width formula** explicitly reserves `620px × scale` for the collage and `80px` for the gap. As the viewport narrows, the text column narrows — the gap never collapses.

**`zoom` vs `transform: scale`** — `zoom` is used on the collage because it shrinks both the visual rendering and the flex layout footprint simultaneously, and correctly scales all five absolutely-positioned child images without coordinate recalculation. `transform: scale` only affects visual rendering, not layout.

**`calc()` division, not multiplication** — interpolation uses `(100vw - Npx) / Mpx` (length ÷ length = dimensionless). Using `(100vw - Npx) * 0.000N` produces a length, and `dimensionless + length` is invalid CSS — it silently invalidates the entire custom property.

---

## Viewport Ranges — Column Mode (≤ 1023px)

### Container behaviour

```css
/* ≤ 1023px */
.hero-container {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 40px;
    top: 0;                /* anchored to section top, not vertically centred */
    transform: none;
    padding-top: 80px;     /* 80px below the 80px navbar = visual breathing room */
}
```

The container switches from `top: 50%; transform: translateY(-50%)` (vertically centred) to `top: 0` so the 80px padding lands a fixed distance below the navbar rather than relative to the section midpoint.

### Text column (`.hero-content`)

| Property | Value | Reason |
|---|---|---|
| `width` | 100% | Fills available width |
| `max-width` | 100% | Unconstrained below 600px |
| `text-align` | center | Content centres within the block |
| `padding` | 0 | Container already provides `--content-margin-inline` padding |
| Font (title) | `var(--fs-metrics)` | Steps down from `--fs-hero` |
| Font (subtitle) | `var(--fs-body-m)` | |

### 600px – 1023px — Text width constrained to collage width

```css
.home-section-1 .hero-content {
    max-width: min(620px, calc(100vw - 48px));
    align-self: center;
}
```

- At 768–1023px: collage is 620px (fits without zoom) → text cap = 620px
- At 600–767px: collage zooms to `vw − 48px` → text cap matches exactly
- Effect: title and subtitle wrap to ~2 lines, content block width mirrors the visual below

### Collage (`.hero-image-collage`)

```css
/* ≤ 1023px */
.hero-image-collage {
    align-self: center;    /* horizontally centred below text */
    flex-shrink: 0;
}

/* ≤ 767px — scale to fit viewport */
.hero-image-collage {
    zoom: min(1, calc((100vw - 48px) / 620px));
}
```

| Viewport | Collage margin | Collage rendered width |
|---|---|---|
| 1023px | 48px × 2 = 96px | 620px (fits, no zoom) |
| 768px | 48px × 2 = 96px | 620px (fits, no zoom) |
| 667px | 24px × 2 = 48px | 619px (~1.0 zoom) |
| 480px | 24px × 2 = 48px | 432px (zoom ≈ 0.70) |
| 320px | 24px × 2 = 48px | 272px (zoom ≈ 0.44) |

### Buttons

```css
.hero-buttons {
    display: grid;
    grid-template-columns: max-content;  /* column sized to widest button */
    justify-content: center;
}
.hero-buttons .btn-size-lg {
    padding: var(--space-4) var(--space-5);  /* 16px top/bottom → ~47px height */
    min-height: 44px;                        /* WCAG / Apple HIG touch target floor */
    text-align: center;
    justify-content: center;
}
```

`grid-template-columns: max-content` sizes the column to the wider button (SCROLL TO LEARN MORE). Both buttons stretch to fill that cell — equal width with no hardcoded value.

---

## Font Size Accessibility Floor (≤ 480px)

The design system sets `html { font-size: 14px }` at ≤480px, pulling all `rem` tokens down. Without compensation, body and button text renders at ~12px.

| Element | Token at ≤480px | Rendered | Override | Corrected |
|---|---|---|---|---|
| Subtitle | `--fs-body-m: 0.875rem` | 12.25px ❌ | `1.143rem` | **16px ✓** |
| Button text | `--fs-body-s: 0.875rem` | 12.25px ❌ | `1rem` | **14px ✓** |

Standards applied: 16px body minimum (WCAG readability guidance), 14px interactive text minimum (Material Design, iOS HIG).

> Note: `html { font-size: 14px }` overrides user browser font preferences, which conflicts with WCAG 1.4.4 (Resize Text). Replacing it with `font-size: 87.5%` would respect user settings while achieving the same default size.

---

## Scale Derivation Reference

```
Divisor = (viewport_range_px) / (scale_range)

Range 1 (1440–1554px): 115 / 0.087 ≈ 1321
Range 2 (1024–1439px): 415 / 0.213 ≈ 1949

General formula:
--hero-scale: calc(scale_min + (100vw - vw_min) / divisor_px)
```

To apply this pattern to a new section with a different visual width (`W`) and desired gap (`G`):
1. Choose `scale_min` at the narrow end of the range: `available_min / available_reference`
2. Text max-width formula: `calc(100% - W * var(--hero-scale) - G)`
3. Collage: `zoom: var(--hero-scale)` with `flex-shrink: 0`
4. For column mode below a breakpoint: anchor container to `top: 0`, add top padding, use `align-self: center` on the visual
5. Collage mobile zoom: `zoom: min(1, calc((100vw - 2 * margin) / W))`
