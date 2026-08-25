# Hero Section — Responsive Scaling Pattern

A reference for the left-content / right-visual two-column layout used in `HomeHeroSection`. Reflects the implementation in `src/components/home/HomeHeroSection.astro` as of the desktop `--hero-natural-scale`/`--hero-fit-scale` rework and the mobile pre-composed-collage rebuild.

---

## Layout Model

Two modes depending on viewport width:

| Mode | Viewport | Direction | Description |
|---|---|---|---|
| **Row** | ≥ 1024px | Horizontal | Text left, collage right, `.hero-container` uses `justify-content: space-between` |
| **Column** | ≤ 1023px | Vertical | Text top (centred), collage below (centred) |

Base sizes (unscaled): `.hero-content` is `clamp(32rem, 38vw, 640px)`, `.hero-image-collage` is a fixed `620 × 486px`. The 640:620 content:collage ratio is what every scale factor below preserves — the width isn't computed by subtracting a gap, `space-between` handles that.

---

## Viewport Ranges — Row Mode (≥ 1024px)

### ≥ 1555px — Natural scale-up, ratio-locked

Both columns scale together off one factor so the 640:620 ratio never drifts, then get squeezed by a second factor only if the available width (viewport minus `2 × --content-margin-inline`) can't fit their natural combined size:

```css
--hero-natural-scale: min(1.45, calc(1 + (100vw - 1555px) / 1000px));
--hero-content-natural: calc(640px * var(--hero-natural-scale));
--hero-collage-natural: calc(620px * var(--hero-natural-scale));
--hero-fit-scale: min(
    1,
    calc(
        (100vw - 2 * var(--content-margin-inline)) /
            (var(--hero-content-natural) + var(--hero-collage-natural))
    )
);
--collage-scale: calc(var(--hero-natural-scale) * var(--hero-fit-scale));
```

- `.hero-content` width: `calc(var(--hero-content-natural) * var(--hero-fit-scale))`
- `.hero-image-collage`: `zoom: var(--collage-scale)`
- `--hero-natural-scale` caps at 1.45 — without a cap, growth would run away above ~2500px
- `--hero-fit-scale` only bites once `--content-margin-inline` reaches its 240px ceiling and root font-size steps up at 1920px (see `design-system.css`) — before that point it stays at 1

**Title/subtitle** don't track `--hero-natural-scale` — they use their own gentler `clamp()`:

```css
.hero-title { font-size: clamp(var(--fs-hero), calc(4.5rem + (100vw - 1555px) * 0.00211), 5.25rem); }
.hero-subtitle { font-size: clamp(var(--fs-body-xl), calc(1.5rem + (100vw - 1555px) * 0.00068), 1.75rem); }
```

A comment in the component explains why: an earlier version scaled only the collage while `.hero-content` stayed pinned at 640px, so the collage kept outgrowing the content column the wider the screen got. The ratio-lock above replaced that.

### 1440px – 1554px — Scale-down range 1

```css
--hero-scale: calc(0.913 + (100vw - 1440px) / 1321px);
```

- Title/subtitle font-size: `calc(token * var(--hero-scale))`
- `.hero-image-collage`: `zoom: var(--hero-scale)`
- `.hero-content` is **not** scaled here — its `clamp(32rem, 38vw, 640px)` base width handles this range on its own

### 1024px – 1439px — Scale-down range 2

```css
--hero-scale: calc(0.7 + (100vw - 1024px) / 1949px);
```

Same application as the 1440–1554px range (title/subtitle font, collage zoom), continuous with it at the shared 1440px boundary.

---

## How Scaling Is Applied (Row Mode)

| Property | ≥1555px | 1024px–1554px |
|---|---|---|
| Content width | `content-natural × fit-scale` | intrinsic `clamp(32rem, 38vw, 640px)` |
| Title/subtitle font | separate `clamp()` | `token × --hero-scale` |
| Collage | `zoom: var(--collage-scale)` | `zoom: var(--hero-scale)` |

**`zoom` vs `transform: scale`** — `zoom` is used on the collage because it shrinks both the visual rendering and the flex layout footprint simultaneously, and correctly scales all five absolutely-positioned child images without coordinate recalculation. `transform: scale` only affects visual rendering, not layout.

**`calc()` division, not multiplication** — interpolation uses `(100vw - Npx) / Mpx` (length ÷ length = dimensionless). Using `(100vw - Npx) * 0.000N` produces a length, and `dimensionless + length` is invalid CSS — it silently invalidates the entire custom property.

---

## Viewport Ranges — Column Mode (≤ 1023px)

### Container behaviour (≤1023px)

```css
.home-section-1 .hero-container {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: var(--space-8);
    padding-top: var(--section-pad-block);
    padding-bottom: var(--space-9);
    overflow: hidden;
}
```

`.hero-content` goes full width (`width: 100%; max-width: 100%; text-align: center`) and `.hero-image-collage` is `align-self: center`.

### Collage scaling (≤1023px, desktop-collage assets)

```css
.hero-image-collage {
    zoom: min(1, calc((100vw - 2 * var(--content-margin-inline)) / 620px));
}
```

Shrinks the same 5-image desktop collage to fit the available width; never zooms above 1.

### ≤ 767px — Mobile: reorder + pre-composed collage swap

Two changes layer on top of the ≤1023px column rules:

**1. Reorder via `display: contents` + `order`.** `.hero-content` becomes `display: contents`, removing its own box so title/subtitle/buttons become direct flex items of `.hero-container` alongside `.hero-image-collage`. All four then share one `order` sequence:

```css
.hero-title    { order: 1; }
.hero-subtitle { order: 2; }
.hero-buttons  { order: 3; }
.hero-image-collage { order: 4; }
```

Result: title → subtitle → buttons → image, regardless of source order in the markup.

**2. Collage swap.** The desktop collage (5 absolutely-positioned cards + 4 product badges) is hidden (`.collage-row-top`, `.collage-image-3`, `.collage-image-4`, `.collage-row-bottom { display: none }`) in favor of one pre-composed image, `hero-mobile.webp` (both rows already baked into a single asset):

```css
.hero-image-collage {
    zoom: 1;
    position: relative;
    width: 100%;
    height: auto;
}

.collage-mobile-row {
    display: block;
    /* Bleeds full-width regardless of --content-margin-inline at this breakpoint */
    width: calc(100% + 2 * var(--content-margin-inline));
    margin-inline: calc(-1 * var(--content-margin-inline));
    height: auto;
}
```

This replaced an earlier version that zoom-scaled the same 5-image desktop collage down for mobile — five absolutely-positioned images at small sizes forced heavy downsampling and read blurry. One flat, pre-optimized raster avoids that.

Other ≤767px specifics:
- `#hero-scroll-btn` (the "explore more" scroll button) is hidden — no `.home-section-2` scroll affordance needed on mobile.
- `.hero-buttons` uses `grid-template-columns: max-content; justify-content: center` so both buttons share the width of the wider one, centered.
- Section `min-height` drops from the `max(100vh, 900px)` floor to `auto` — that floor is sized for taller tablet content; on phones the actual content (title/subtitle/buttons/collage) is well short of it and would otherwise leave a large empty gap before the next section.

---

## Typography

`.hero-subtitle` carries the `text-body-p0` design-system class rather than a component-level font-size override — responsive scaling (including the ≤480px accessibility floor) is handled centrally by the token system in `design-system.css`, not by per-component media queries. See `CLAUDE.md`'s typography table for the token reference.

---

## Applying This Pattern Elsewhere

1. Lock the content:collage width ratio with a shared natural-scale variable once natural growth needs a cap (`--hero-natural-scale`, `min(cap, calc(1 + (100vw - vw_min) / divisor)))`).
2. Add a fit-scale guard only if the pair can actually outgrow the available width at some viewport (compare `content-natural + collage-natural` against `100vw - 2 × margin`).
3. Below the natural-scale range, an intrinsic `clamp(min, vw, max)` width on the content column plus a plain `--hero-scale` zoom on the visual is enough — no ratio-lock needed once both are shrinking together within their own bounds.
4. For column mode below a breakpoint: `flex-direction: column`, text `width: 100%`, visual `align-self: center`.
5. If mobile needs a materially different asset (not just a scaled-down desktop one), swap it in via `display: none` / `display: block` toggles rather than trying to zoom the desktop version down further — small absolutely-positioned composites downsample badly.
