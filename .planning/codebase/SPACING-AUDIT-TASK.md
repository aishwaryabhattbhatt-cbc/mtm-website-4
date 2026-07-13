# Task: Exhaustive spacing-alias audit (all breakpoints, all selectors)

## Why this task exists

Across several sessions (2026-07-09/10) a semantic spacing-alias system was built and partially migrated (see `SPACING.md` — **read that file in full before starting, it's the system contract**). Every migration pass so far has been incomplete in a specific, repeating way: it was scoped by a pattern (selector naming, or "base declarations only") instead of by exhaustively checking every declaration. Each time, that produced a plausible-looking "done" report that turned out to have real misses once someone looked closer. This task exists to do the audit exhaustively, once, instead of incrementally finding the next blind spot in conversation.

**Do not repeat these specific mistakes:**

1. **Selector-name filtering.** The original alias migration grepped for selectors ending in `-section`. It missed every BEM sub-block (`.home-footer__cta`, `.reports-library-bg`, `.mobile-products-header`, etc.) even where the value was an exact alias match. A follow-up sweep caught most of these — but see #2.
2. **Base-declarations-only filtering.** The follow-up sweep only checked non-media-query (`base`) declarations. It completely missed matches living inside `@media` blocks. Spot checks afterward found real, confirmed misses inside `@media (max-width: 1023px)`, `(max-width: 767px)`, and — critically — **`(max-width: 1200px)`**, a breakpoint that's easy to forget because it doesn't match the site's usual 767/1023/1440/1920 set but is genuinely used (`HomeSolutions.astro:540`).
3. **Assuming "no override exists" without grepping for it.** Multiple times in this project's history, "I checked, there's no override" turned out to be wrong because only one or two breakpoints were checked, not all of them. Every claim of "this section has no responsive override" must be backed by a grep across **every** `@media` block in the file, not a visual skim.
4. **Declaring a sweep "complete" after finding a plausible-sized batch of fixes.** Stop only when a query genuinely returns zero further hits — not when the batch found so far feels sufficient.

## The methodology to use (don't freelance a new one)

1. Build (or reuse/adapt) a spacing-declaration extractor that walks every `.astro`/`.css` file under `src/` and emits one row per `padding`/`margin`/`gap`/`row-gap`/`column-gap` declaration, tagged with: file, selector, **media-query context (including its exact breakpoint value, not just "mobile/tablet")**, property, value, line number. (An earlier session-scratchpad script did this — `extract-spacing.mjs`, walked the tree with a brace-depth tracker to capture selector + media context per declaration. It no longer exists on disk since scratchpad dirs are session-scoped; recreate it, this time make sure it captures declarations **inside** `@media` blocks with their exact condition string, which the later "base-only" queries in this project's history failed to do.)
2. Get the current alias table from `design-system.css` (`--section-pad-block`, `--section-pad-block-lg`, `--section-header-gap`, `--header-stack-gap`, `--title-desc-gap`, `--hero-stack-gap`, `--card-pad`, `--card-pad-thin`, `--card-stack-gap`) **and their responsive override values** (also in `design-system.css`, `@media (max-width: 767px) { :root { ... } }`).
3. For every extracted declaration, at every breakpoint, check whether its value equals what the relevant alias resolves to *at that breakpoint*. Flag every match that isn't already using the alias.
4. For each flagged hit, verify the markup context before converting — a matching value is not sufficient (e.g. an icon+heading horizontal gap can coincidentally equal `--title-desc-gap`'s value without being the same relationship). Read the actual component markup around the selector.
5. Classify each real finding into one of three buckets and handle differently:
   - **Exact match, real relationship** → convert to the alias. Zero-risk, do these directly.
   - **Partial match** (one side of an asymmetric padding matches, the other is a deliberate different value) → convert just the matching side, add a one-line comment on the declaration explaining why the other side differs (see existing examples in `SPACING.md` → "Known intentional deviations").
   - **Same relationship, different value** (e.g. a header→content gap that's 5rem where the standard is 2.5rem) → **do not auto-fix**. This changes actual rendered spacing, which is a design call. Report it in a table (component, current value, standard value, file:line) and ask before touching it.
6. Run `npm run build && npm run check && node scripts/site-audit.mjs` after every batch of edits, not just at the end.
7. Update `SPACING.md`'s "Pending" and "Known intentional deviations" sections to reflect what got fixed vs. what's still open — don't leave it stale.

## Scope

Every file under `src/components/` and `src/pages/`, every `@media` block in each, all four alias-relevant properties (`padding` including shorthand/`-block`/`-top`/`-bottom`, `gap`, `margin` where used for section-adjacent spacing, `row-gap`/`column-gap`). Not just the home page — the home page just happens to be where this was discovered; there is no reason to believe other pages are clean, since the same base-only/selector-only blind spots applied everywhere.

## Already fixed — do not redo, but do verify still correct

- Full alias definitions live in `design-system.css` (`--section-pad-block(-lg)`, `--section-header-gap`, `--header-stack-gap`, `--title-desc-gap`, `--hero-stack-gap`, `--card-pad(-thin)`, `--card-stack-gap`).
- Legacy `styles.css` spacing system fully deleted (see `SPACING.md` "What was removed").
- Base-declaration exact matches converted in: `HomeFaqsSection`, `HomeFooterSection` (`.home-footer__cta`, `.home-footer__newsletter`, `.home-footer__footer`), `HomeSolutions` (base rule only — its `@media (max-width:1200px)` override was NOT fixed, see below), `ToolsHeroSection`, `HomeMtmSuiteSection` (`.reports-library-bg`, `.mobile-products-header`, and the section's own `gap` now references `--section-pad-block` directly instead of a coincidentally-equal raw value), `SolutionsReportsLibrarySection`, `ToolsDatFeaturesSection` (`.dat-features`, not `.dat-features__cards` — that one is carousel scroll-padding, a different semantic, correctly left alone).
- Law of Proximity card-gap inversions fixed (workflow/methodology/your-data cards) — see `SPACING.md`.
- `HomeMtmSuiteSection`'s mobile `@media (max-width: 767px)` override for `.mtm-suite-section` (padding-top/bottom + gap) was deleted so it inherits `--section-pad-block`'s own mobile value instead of a separate hardcoded one.

## Known open items to fix as part of this task

Confirmed via spot-check, not yet fixed:

- `ResearchTabsSection.astro:663` — `@media (max-width: 1023px)`, `.research-section` padding-top/bottom raw `var(--space-12)` → should be `var(--section-pad-block)` (exact match).
- `ResearchTabsSection.astro:740` — `@media (max-width: 767px)`, `.research-section` padding-top/bottom raw `var(--space-8)` → this is a **value mismatch**, not just naming (`--section-pad-block`'s own mobile value is `--space-10`). Classify per bucket 3 above before touching — this is the section that transitions into MTM Suite, and today it's the one outlier making that specific transition tighter (52.5px) than every other transition in the same visual chain (98px each, computed at 14px mobile root). Likely wants fixing to be consistent, but confirm the visual intent first.
- `HomeSolutions.astro:540` — `@media (max-width: 1200px)`, `.home-solutions` padding-top/bottom raw `var(--space-9)`, plus `gap: var(--space-9)` on the same rule. Note this breakpoint (1200px) is unusual — double check there isn't *also* a narrower override further down that supersedes it.
- `HomeFooterSection.astro:688,689` — `@media (max-width: 1023px)`, asymmetric `padding-top: var(--space-9); padding-bottom: var(--space-8)` on `.home-footer__cta` (verify selector at that line before editing, line numbers drift as the file changes).
- `HomeFooterSection.astro:751,752` and `:772,773` — same breakpoint, other two footer sub-blocks, likely the same class of miss.

## Already-known "different value, same relationship" list (bucket 3 — report, don't auto-fix)

- `.home-solutions` heading→cards gap: `--space-12` (5rem) vs. `--section-header-gap` standard `--space-8` (2.5rem), used by 15+ other sections.
- `.home-faqs` heading→accordion gap: `--space-9` (3rem) vs. same `--space-8` standard.
- `.home-footer__cta-copy` eyebrow→title gap: `--space-2` (0.5rem) vs. `--header-stack-gap` standard `--space-6` (1.5rem).

## Separately open, unrelated to the alias sweep (don't conflate, but worth knowing about)

- **Census-tool page**: several `.section-gap` spacer divs are load-bearing (separating sections/cards that have *zero* self-owned vertical padding) — removing them without first giving those sections their own padding will cause visible collisions. See `SPACING.md` "Pending — Phase 5" and the census-tool-specific note from the 2026-07-10 session. Not part of this task unless asked.
- **MTM-suite section structure**: was compared against `HomeFooterSection`'s pattern (every sub-block self-owns full padding, parent owns nothing). Conclusion reached: a literal copy of that pattern is *wrong* for MTM-suite because `reports-library-bg` is the one sub-block with its own background color — giving its plain-background siblings (`data-products`, `tools-suite`) their own full padding *in addition to* the parent's gap would double-pad the transitions into/out of the colored box. Current structure (parent owns boundary + inter-child gap, only the colored child self-owns internal padding) is the correct hybrid for this specific case. Don't re-litigate this without re-reading that reasoning first.

## Verification

`npm run validate` (check + build + site-audit) must pass after every batch. Test on a real mobile viewport (or the network-exposed dev server — `astro dev --host`, `--host` flag required or the phone can't reach it, dev server caches stale CSS after file edits surprisingly often — kill the process, `rm -rf node_modules/.vite`, and restart if curl'd output doesn't match the saved file).
