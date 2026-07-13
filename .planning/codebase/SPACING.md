# Spacing System — Single Source of Truth

**Status:** migrated 2026-07-09 (aliases live, legacy system deleted, inversions fixed; see Pending for what remains). Source of truth for ALL spacing tokens: `src/styles/design-system.css`. The legacy spacing system that lived in `src/styles/styles.css` (`--margin-*`, `--padding-*`, `--section-padding`, grid utilities, `.card`/`.box`/`.showcase` classes, global `p` margin) has been deleted.

## Why this exists

A July 2026 audit of all 1,105 spacing declarations found:

1. **Two competing systems.** `styles.css` shipped a parallel px-based token set and a global `p { margin-bottom: 16px }` that ~140 local `margin: 0` resets existed to fight.
2. **Law of Proximity inversions.** Several cards spaced their own content wider than the gap separating adjacent cards (workflow, methodology, your-data, census-tool cards).
3. **Same relationship, different value.** Section padding ranged `--space-5`→`--space-13`; header→content gaps ranged `--space-8`→`--space-12`; identical eyebrow/title/description stacks used two different spacing grammars (solutions vs insights).

## Semantic spacing aliases

Defined in `design-system.css` under `/* === Semantic spacing === */`. **Use the alias, not the underlying `--space-*` token, whenever the relationship matches.** The alias carries its own responsive behavior — do not add per-component media-query overrides for these relationships.

| Alias | Desktop | ≤767px | Relationship |
|---|---|---|---|
| `--section-pad-block` | `--space-12` (5rem) | `--space-10` (3.5rem) | Default section top/bottom padding |
| `--section-pad-block-lg` | `--space-13` (7.5rem) | `--space-11` (4rem) | Landmark/feature sections |
| `--section-header-gap` | `--space-8` (2.5rem) | `--space-7` (2rem) | Header block → cards/content |
| `--header-stack-gap` | `--space-6` (1.5rem) | — | Eyebrow → title group |
| `--title-desc-gap` | `--space-2` (0.5rem) | — | Heading → its description |
| `--hero-stack-gap` | `--space-6` (1.5rem) | — | Hero title → subtitle → CTA stack |
| `--card-pad` | `--space-6` (1.5rem) | — | Default card padding |
| `--card-pad-thin` | `--space-3` (0.75rem) | — | Image-dominant / report cards |
| `--card-stack-gap` | `--space-4` (1rem) | — | Content stack inside a card |

`--layout-card-gap` (pre-existing) remains the only token for card-to-card gaps.

### Header grammar (Law of Proximity)

Eyebrow, title, and description are not equidistant. The canonical structure:

```html
<div class="my-section__header">      <!-- gap: var(--header-stack-gap) -->
  <Eyebrow ... />
  <div class="my-section__title-group">  <!-- gap: var(--title-desc-gap) -->
    <h2>...</h2>
    <p class="text-body-p1">...</p>
  </div>
</div>
```

The title binds tighter to its description (0.5rem) than the eyebrow binds to the title (1.5rem). The whole header block then sits `--section-header-gap` above its content — always larger than any gap inside the header.

### Proximity rule for cards

Internal gaps inside a card must be **smaller than `--layout-card-gap`** (2.5rem desktop / 1.5rem mobile). If a card's content needs more air, widen that grid's gap — never let within-card spacing exceed between-card spacing.

Fixed 2026-07-09: workflow cards (3.5rem→2rem), methodology cards (5rem→2rem), your-data card halves (5rem→2.5rem, below its 3.5rem grid gap), each with matching tablet/mobile reductions and a `/* proximity */` comment at the declaration. `CensusToolCard`'s 3.5rem internal gap is **not** an inversion — census cards are separated by full `.section-gap-lg` spacers, far larger.

## What was removed from styles.css

- `--margin-xs…2xl`, `--padding-xs…2xl`, `--section-margin-top/bottom`, `--section-padding` (px-based legacy tokens)
- `p { margin-bottom: var(--margin-md) }` — the global paragraph margin. Paragraphs now inherit `margin: 0` from the universal reset; spacing between text blocks is owned by the parent's `gap`.
- Dead layout classes: `.container` (+ all breakpoint variants), `.header`, `.main-content`, `.hero`, `.showcase`, `.two-column`, `.footer`, `.subtitle`, `.card`, `.box`
- The 12-column grid (`.row`, `.col-*` at all breakpoints) — the only consumer was `HomeMtmSuiteSection`, which now carries its own scoped, tokenized copy of the three rules it uses
- All spacing/display utilities: `.mt-*`, `.mb-*`, `.mx-auto`, `.p-*`, `.text-center/left/right`, `.d-*`, `.flex-center`, `.flex-between`, `.d-none-{mobile,tablet,desktop}`
- Dead hero variants: `.blank-section`, `.unicorn-*`, `.hero-2`, `.hero-static`, `.hero-5`–`.hero-9`, `.hero-text-blob`, `.hero-image-right`, `.subtitle`
- Unused `--breakpoint-*`, `--container-width-*`, `--grid-*` tokens

**Moved to design-system.css** (spacing tokens belong in one file): `--content-margin-*` scale + `--content-margin-inline` responsive overrides, `--navbar-height`, `--section-height-100/80`.

**Still in styles.css** (not spacing): universal reset, `html`/`body` base, live home-hero visuals (`fluidWave`, `.hero-section`, `.webgl-background`, `.grain-overlay`, `.breathing-circle`, `.hero-svg*`, `.home-section-1/2`), `.content-boundary`, `.section-height-*` utilities, `.section-gap*` spacers (see Pending).

## Migration coverage gotcha

The Phase 1 alias migration (2026-07-09) was scoped by grepping for selectors matching the `-section` suffix (e.g. `.solutions-workflow-section`, `.product-tools-section`) — about 19 files. That pattern **missed every component using BEM sub-block naming instead** (`.home-footer__cta`, `.home-footer__newsletter`, `.home-solutions`, `.reports-library-bg`, `.tools-hero`, `.mobile-products-header`, etc.), even when their padding/gap value was an exact match for an alias.

Found and fixed 2026-07-10: 8 exact-value matches and 3 partial matches (one side matching, the other a documented raw exception) across `home/`, `tools/`, and `solutions/`. Confirmed via exhaustive query against the full component tree — `insights/`, `products/`, `census/`, and `analytic-tools/` had zero misses of this kind (candidates that surfaced there were carousel scroll-padding, hero `top: 0` bleed patterns, or already-flagged spacious cards — different semantics, correctly left alone).

**Any future alias migration must sweep by property+value across the whole tree, not by selector-name pattern.** Selector naming (`-section` vs `__block` vs bare BEM) is not a reliable signal for "this is a section-level relationship" — check the actual CSS value and markup structure instead. A one-line audit query: grep every `padding`/`gap` declaration for a value that equals a defined alias's value, then verify markup context (don't assume — e.g. a `--space-2` gap next to a heading is just as likely an icon+label pair as a title→description pair).

## Known intentional deviations

Keep a comment at the declaration site for each:

- `HomeMtmSuiteSection` top padding `--space-5` — sits directly under the hero's animated background.
- `AnalyticToolsTrendingTool/ForecastingTool` padding `--space-6` — dense alternating tool rows, deliberately tighter than standard sections.
- `SolutionsTrustedBy`/`SolutionsMediaTrustedBy` sections — logo strips, intentionally shallow.
- `.solutions-topics-card` padding `--stroke-2` — border-width compensation on a filled tag-card.

## Exhaustive sweep — complete (2026-07-10)

The full sitewide sweep described in the task brief below is done. An extractor walked every `.astro`/`.css` file under `src/`, capturing every `padding`/`margin`/`gap`/`row-gap`/`column-gap` declaration at **every** breakpoint (including previously-missed ones like `@media (max-width: 1300px)` and `(max-width: 1200px)`), cross-referenced against the alias table above. All ~450 unique candidates were verified against actual markup (not just numeric value) across every file in `src/components/` and `src/pages/`. Result:

- **~85 exact-value matches converted** to their alias across `home/`, `analytic-tools/`, `census/`, `insights/`, `products/`, `solutions/`, `tools/`, and `shared/Reports.astro`.
- **~11 partial matches** (asymmetric shorthand, one side converted, the other kept with a one-line comment) — e.g. `CensusToolCard__content` (right/left `0` because the grid's own gap separates it), `SolutionsToolsSection__content--flipped`, `InsightsNewsSection` mobile footer padding, `SneakPeekReportCard__body`.
- **Missing intentional-deviation comments backfilled**: `AnalyticToolsTrendingTool/ForecastingTool` root padding, `SolutionsTrustedBySection`/`SolutionsMediaTrustedBySection` logo-strip padding.
- **~35 "same relationship, different value" findings** — reported below, not auto-fixed (rendered-spacing change = design call).
- Everything else (the majority of candidates, mostly in `shared/` UI primitives — `Button`, `Navbar`, `Tabs`, `ProductPill`, `FormField`, `Eyebrow*`) was confirmed as **numeric coincidence, not a real alias relationship** (button/pill/tab/nav internal padding, icon-to-label gaps, negative-margin bleed tricks) and correctly left untouched.
- `npm run check`, `npm run lint`, and `npm run validate` (build + site-audit) all pass clean after every fix.

### Bucket 3 — same relationship, different value (needs a design call, not yet fixed)

| Component | File:line | Current | Resembles | Standard value | Note |
|---|---|---|---|---|---|
| `ResearchTabsSection` | `:742-743` `.research-section` ≤767px | `--space-8` (2rem) | `--section-pad-block` | `--space-10` (3.5rem) mobile | Transition into MTM Suite is tighter (52.5px) than equivalent transitions elsewhere (98px) |
| `HomeSolutions` | `:539-543` `.home-solutions` ≤1200px | `--space-9` padding+gap | `--section-pad-block` / `--section-header-gap` | `--space-12` / `--space-8` | Confirmed sole override, no narrower breakpoint supersedes it |
| `HomeSolutions` | `:382-390` `.home-solutions` gap | `--space-12` (5rem) | `--section-header-gap` | `--space-8` (2.5rem) | Used by 15+ other sections at the standard value |
| `HomeSolutions` | `:420,474,513` `__inner`/`__indicator`/`__logos-grid` | `--space-6` | `--layout-card-gap` | 2.5rem / 1.5rem ≤1023 | Genuine card-grid gap, currently unaliased; 3 coupled selectors |
| `HomeSolutionsCard` | `:149-153` `.solutions-card__content` padding | `--space-4` | `--card-pad` | `--space-6` | Card's own padding, smaller than standard |
| `HomeFaqsSection` | `:167` `.home-faqs` gap | `--space-9` (3rem) | `--section-header-gap` | `--space-8` | Heading→accordion gap |
| `HomeFooterSection` | `:408-409` `__cta-copy` gap | `--space-2` | `--header-stack-gap` | `--space-6` | Eyebrow→title gap |
| `HomeFooterSection` | `:462-467` `__newsletter-content` gap | `--space-4` | `--title-desc-gap` | `--space-2` | Literal h2+p pair |
| `HomeFooterSection` | `:687-690` `__footer` ≤1300px | padding-top `--space-9`/bottom `--space-8` | `--section-pad-block` | `--space-12` | Neither side matches; ≤767 alias override doesn't apply at this breakpoint |
| `HomeMtmSuiteSection` | `:888-892` `.data-products-mobile` gap | `--space-6` | `--section-header-gap` | `--space-8`/`--space-7` mobile | Nested header→content pairing |
| `AnalyticTools Forecasting/Trending` | `.feature-content` gap | `--space-3` | `--title-desc-gap` | `--space-2` | Title+desc pair inside feature card |
| `AnalyticTools Forecasting/Trending` | `@767 .feature` padding | `--space-4` | `--card-pad` | `--space-6` (no mobile variant) | Card's own mobile padding |
| `AnalyticToolsYourData` | `.left` gap | `--space-6` | `--title-desc-gap` | `--space-2` | `.left` is literally `h2` + `p` |
| `AnalyticToolsYourData` | `@767 .card` gap | `--space-6` | `--section-header-gap` | `--space-7` mobile | Base now aliased; mobile override still deviates |
| `CensusHighlights` | `.screenshot-frame` padding (≤1023/≤767) | `--space-4`/`--space-3` | `--card-pad` | `--space-6` (no mobile variant) | No established responsive story |
| `CensusToolCard` | `@1023 .content` padding | `--space-4` | `--card-pad` | `--space-6` | Mobile-stacked card padding |
| `CensusToolFeatures` | `.split-frame-callout` gap | `--space-3` | `--title-desc-gap` | `--space-2` | Stat value + description pair |
| `Reports.astro` (shared) | `:239` `.report-stat-card` gap | `--space-8` | `--card-stack-gap` | `--space-4` | Lower confidence — may be intentional (different layout from mobile grid) |
| `Reports.astro` (shared) | `:285` `.report-stats` ≤1023px gap | `--space-4` | `--layout-card-gap` | 1.5rem at this breakpoint | Desktop sibling already uses the alias; mobile override re-specifies raw value |
| `InsightsHeroSection` | `__text` gap (base/mobile) | `--space-4`/`--space-3` | `--title-desc-gap` | `--space-2` | h1+description pair |
| `InsightsFreeReportsSection` | `__header`/`__content-wrap` ≤767px | `--space-7`/`--space-4` | `--header-stack-gap`/`--title-desc-gap` | `--space-6`/`--space-2` | Mobile override introduces its own values |
| `InsightsNewsSection` | `__header` ≤767px gap | `--space-4` | `--header-stack-gap` | `--space-6` | Title/controls row |
| `InsightsReportsLibrarySection` | `__header`/`__content-wrap` ≤767px | `--space-7`/`--space-4` | `--header-stack-gap`/`--title-desc-gap` | `--space-6`/`--space-2` | Same pattern as FreeReports |
| `InsightsSneakPeekReportsSection` | `__header`/`__content-wrap` ≤767px | `--space-7`/`--space-4` | `--header-stack-gap`/`--title-desc-gap` | `--space-6`/`--space-2` | Same pattern |
| `InsightsFreeReportCard` | root/`__body` gap | `--space-6` | `--card-stack-gap` | `--space-4` | Compositional stack, 1.5x standard |
| `SneakPeekReportCard` | root/`__bottom-content` gap | `--space-6` | `--card-stack-gap` | `--space-4` | Compositional stack |
| `ProductMethodologyCard` | `.methodology-card` gap | `--space-6` | `--card-stack-gap` | `--space-4` | Eyebrow-pill↔stats-list stack |
| `ProductExploreMoreSection` | `.explore-mobile-card` gap | `--space-3` | `--card-stack-gap` | `--space-4` | Mirrors desktop `.explore-card` (now aliased) |
| `ProductExploreMoreSection` | `.explore-more-section` ≤1023px padding | `--space-8` | `--section-pad-block` | `--space-12` desktop | Section's own responsive padding, halved |
| `ProductFeaturesSection` | `.product-feature-title` margin-bottom | `--space-4` | `--title-desc-gap` | `--space-2` | Title→description pair |
| `ProductReportsSection` | `.product-reports-headline` gap | `--space-4` | `--title-desc-gap` | `--space-2` | Title→description pair |
| `ProductSampleCompositionCard` | `.composition-card` gap | `--space-6` | `--card-stack-gap` | `--space-4` | Pill+donuts+description stack |
| `ProductToolsSection` | `.product-tools-headline` gap | `--space-4` | `--title-desc-gap` | `--space-2` | Title→description pair |
| `ProductToolsSection` | `.product-tools-grid` margin-top | `--space-12` | `--section-header-gap` | `--space-8` | Headline→tool-row gap |
| `SolutionsInsightCard`/`Methodology`/`ToolsSection`/`UseCases`/`Workflow`/`ToolsDatFeatures`/`ToolsHeroSection`/`StatDivider` | various `title→desc` gaps | `--space-3`/`--space-4` | `--title-desc-gap` | `--space-2` | Recurring pattern — same text-pair relationship, inflated value, across ~8 components |
| `SolutionsMediaCtaSection` | card padding (base/mobile) | `--space-8`/`--space-7` | `--card-pad` | `--space-6` | CTA card oversized vs standard |
| `SolutionsMediaTestimonialsSection` | card padding/gaps | `--space-12`/`--space-8` | `--card-pad`/`--card-stack-gap` | `--space-6`/`--space-4` | Large bespoke feature card, consistently 2x |
| `SolutionsReportsLibrarySection`/`ToolsDatFeaturesSection` | mobile card/header gaps | various | `--header-stack-gap`/`--card-pad` | various | No mobile override defined for these aliases yet |
| `SolutionsUseCasesSection` | `.solutions-usecase-card__left` gap | `--space-6` | `--card-stack-gap` | `--space-4` | Left-column content stack |

Given how many of these are the *same* recurring pattern (a title+description text pair using `--space-3` or `--space-4` instead of `--title-desc-gap`'s `--space-2`), it's worth deciding as one policy call rather than case-by-case: either (a) these components are all slightly wrong and should be tightened to `--space-2`, or (b) `--title-desc-gap` is too tight for anything larger than a compact card header and a second, looser alias (e.g. `--title-desc-gap-loose` at `--space-3`/`--space-4`) should be introduced for card-body text pairs. Recommend deciding this before fixing any of them individually.

## Pending / follow-ups

- [ ] **Phase 5 — one inter-section rhythm system.** Home, analytic-tools, and census pages still use `vh`-based `.section-gap` spacer divs; other pages use section padding. Converting spacers → padding moves gaps *inside* sections, which changes where colored section backgrounds start/end — needs a visual pass per page, not a mechanical swap. Until then `.section-gap*` stays in styles.css.
- [ ] CLAUDE.md updates (user-managed file — proposed, not applied): spacer-div convention will change if Phase 5 lands; `--layout-card-gap` mobile value is **1.5rem**, not 1rem as currently documented.
- [ ] Opportunistic cleanup of now-redundant `margin: 0` paragraph resets (harmless; remove when touching a file anyway).
- [ ] **Resolve the bucket-3 table above** — each row changes rendered spacing, so needs a design decision (fix to standard, or document as an accepted deviation with a comment), not a mechanical edit.
