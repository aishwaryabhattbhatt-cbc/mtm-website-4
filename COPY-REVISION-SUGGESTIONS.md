# Suggested Copy Changes — Homepage Hero & Trust Signals

Follow-up to `COMPETITOR-COPY-AUDIT.md`. That audit compared MTM against Numeris, Comscore, and Nielsen — direct research-industry competitors. This pass adds a second reference point: **Stripe**, looked at not as a competitor but as an example of how to structure a hero around stacked proof and intent-based CTAs. Two patterns from Stripe are worth borrowing:

1. **Dense, stacked stat block near the hero** — Stripe surfaces 4–5 numbers (currencies, volume, uptime, subscriptions) right where the pitch is made, not scattered through the page.
2. **Capability-then-proof structure** — every claim ("backbone of global commerce") is immediately followed by a number or named customer that backs it up.

Applied to MTM's actual gap (from the competitor audit): the funding/policy-acceptance claim is real proof no competitor can match, but it's stranded in FAQ #3. The suggestions below pull it forward and stack it next to the existing 300K+/41M stats, Stripe-style — without inventing new claims.

All suggestions map to existing keys in `src/content/copy/home.json` unless marked **(new key)**. `fr` fields are left blank per existing convention.

---

## 1. Hero headline (`hero_title`)

Current: *"The Standard for Canadian Media & Technology Insights"* — a category claim, not a benefit.

Stripe's line works because of its grammar, not its cleverness: **[concrete noun phrase] + "to" + [concrete verb outcome]**. "Financial infrastructure" tells you exactly what it is; "to grow your revenue" tells you exactly what happens if you use it — "revenue" is a real, measurable thing every one of Stripe's customers wants, not a stand-in word.

First pass used "decision" — a container word, not a real thing; almost any action can be called a decision, so it doesn't narrow to anything. Second pass overcorrected the other way, listing three separate artifacts (funding case / media plan / ad campaign) — that's not what Stripe does either. "Grow your revenue" is one concrete, singular noun, not a list.

The equivalent single noun for MTM is **audience** — the one thing all five buyer segments (`solutions_item_1-5`: Industry, Media & Broadcasting, Advertising & Marketing, Education & Research, Government & NGOs) actually have, whether they call it a target market, a viewership, or the public:

- **A.** "Canadian media data to understand your audience."
- **B.** "Real data on the audience you're trying to reach."
- **C.** "The data behind how Canada understands its audience."

Recommendation: **A**. Same shape as Stripe's line — one concrete noun as the payoff, not a list and not an abstraction like "decision."

**AEO/GEO note**: option A never says "Media Technology Monitor" or "MTM" — for AI answer engines matching a heading to an entity query ("what is the Media Technology Monitor"), the brand name living only in the paragraph below the H1, not the H1 itself, is a real gap. The entity name should be in the headline tag, not just nearby. Revised recommendation:

- **A (revised).** "Media Technology Monitor: Canadian data to understand your audience."

Same benefit-noun payoff as before, with the entity name folded into the same tag instead of relying on adjacent copy to carry it.

## 2. Hero description (`hero_description`)

Current: *"Welcome to the Media Technology Monitor. We are your source for real data on how Canadians consume media, technology, and content - built for organizations that need evidence, not assumptions."*

Suggested rewrite (shorter, moves the funding/policy claim up instead of leaving it in FAQ #3):

> "The Media Technology Monitor is Canada's national dataset on media, technology, and content consumption — used by broadcasters, advertisers, and government to support funding, policy, and strategic decisions with evidence, not assumptions."

This is a factual restatement of FAQ #3 ("MTM data is widely used across the Canadian media, advertising, academic, and public sectors to support publications, strategic planning, funding applications, and policy development"), not a new claim — just moved where competitors can't match it.

## 3. Stat block — stack, don't split **(new keys)**

Right now `hero_stat_value` / `hero_stat_label` shows one number ("300,000+ Canadians 18+ Surveyed") in the hero, while "41 Million Canadians Mapped" (`package_1_title`) only appears further down in the Data Products section. Stripe's pattern is to stack 3–4 numbers together at first contact.

Suggested hero stat row (3 stats instead of 1):

| Value | Label |
|---|---|
| 300,000+ | Canadians 18+ surveyed |
| 41M | Canadians mapped across MTM datasets |
| 5,000+ | Variables tracked |

`hero_stat_value`/`hero_stat_label` already cover the first pair. Two more key pairs would be needed for the second and third stat — e.g. `hero_stat_2_value` / `hero_stat_2_label`, `hero_stat_3_value` / `hero_stat_3_label` — reusing copy already present at `package_1_title` and `access_item_3_title` rather than inventing new numbers.

**AEO/GEO note**: stacking the numbers as label/value pairs is right for a visual scan, but per the skill's citation research, stats boost AI visibility mainly when they sit inside extractable prose, not as isolated UI pills. Two follow-ups worth doing alongside the stat row:
- Fold the same three numbers into one sentence somewhere on the page (e.g., in `hero_description` or a caption under the stat row) — something like "Backed by more than 300,000 Canadians surveyed, mapped across 41M Canadians and 5,000+ variables" — so the numbers exist as a citable claim, not only as decoration.
- Add a freshness signal near the stat row **(new key, e.g. `hero_stat_freshness_label`)** — e.g. "Data as of Spring 2026" — undated stats lose out to dated ones in AI citation ranking, and MTM already has real wave dates (FAQ #1: Fall/February, Spring/July) to draw from.

## 4. CTA variation (`hero_cta_1`, `cta_button`)

Current: both the hero CTA and the closing CTA say "Request a Demo" verbatim — identical repetition front and back of the page, unlike Numeris/Nielsen/Stripe, which vary CTA verbs by funnel position (Stripe: "Start now" for high-intent vs. "Contact sales" for enterprise; Nielsen: "Get a demo" vs. "Contact us").

Suggested split:
- `hero_cta_1` (top of page, colder visitor): keep **"Request a Demo"** — fine as-is, it's the right verb for a first touch.
- `cta_button` (bottom of page, visitor who scrolled through the whole pitch, warmer): change to **"Talk to Our Team"** or **"Get Access"** — signals a different stage of intent instead of asking the same question twice.

## 5. "Access Trusted Research On" section (`access_title`, `access_item_*`)

This section's job is to show **scope of coverage**: technology insights, media insights, and how deep that goes across both (5,000+ variables). That's a legitimate, different shape on purpose — two content domains plus one depth claim that spans them — not three parallel topics. (An earlier draft of this section tried to turn the third item into a standalone topic, "Audience & Demographics" — that was a misread of the section's intent and is dropped below.)

Given that shape, the actual gaps are narrower than a full restructure:

- Item 1 (`access_item_1_title/description`) — "Technology Trends" — already strong: an action sentence ("Track rapid shifts across...") plus a payoff ("Identify where consumer demand is heading next").
- Item 2 (`access_item_2_title/description`) — "Media Behaviour" — only one sentence, no payoff, so it reads thinner than item 1 even though it's doing the same job (a domain card).
- Item 3 (`access_item_3_title/description`) — "5,000+ Variables" — correctly a depth claim, not a topic, but the body copy doesn't clearly say it's *the depth behind items 1 and 2 specifically*. "Explore one of Canada's most comprehensive media and technology datasets... to uncover meaningful opportunities" is generic enough that it could be describing any dataset; it doesn't read as "everything you just saw in Technology Trends and Media Behaviour, backed by 5,000+ variables."

Suggested rewrite:

| Key | Current | Suggested |
|---|---|---|
| `access_item_1_title` | Technology Trends | *(unchanged — already strong)* |
| `access_item_1_description` | Track rapid shifts across streaming platforms, AI advancements, connected devices, and emerging technologies. Identify where consumer demand is heading next. | *(unchanged)* |
| `access_item_2_title` | Media Behaviour | *(unchanged)* |
| `access_item_2_description` | Understand attention, viewing habits, engagement, and platform usage across audiences and channels. | Understand attention, viewing habits, engagement, and platform usage across audiences and channels. **See exactly where and how Canadians are spending their time.** *(adds the payoff sentence item 1 already has)* |
| `access_item_3_title` | 5,000+ Variables | *(unchanged — this is the right kind of heading for a depth claim)* |
| `access_item_3_description` | Explore one of Canada's most comprehensive media and technology datasets. Connect demographics, behaviours, attitudes, and intent to uncover meaningful opportunities. | **Every trend and behaviour above is backed by data** — connect demographics, attitudes, and intent across more than 5,000 variables, in one of Canada's most comprehensive media and technology datasets. *(explicitly ties the stat back to items 1–2 instead of reading as a generic, unconnected claim; also cuts "meaningful opportunities," which doesn't say anything concrete)* |

This keeps the section's actual shape (two domains + one depth claim) and only fixes the two real problems: item 2's missing payoff, and item 3 not visibly connecting back to what items 1 and 2 just showed.

**AEO/GEO note**: if `access_title` and the three item titles render as real `<h2>`/`<h3>` tags, "Access Trusted Research On" is a UI phrase, not something a person would type into a search box or an AI would fan out to. This is a lower-priority, optional consideration (not a required change) — worth knowing if these headings are load-bearing for SEO, but not worth breaking the "Access Trusted Research On ___" copy device over.

## 6. Lead-magnet distribution — reuse the existing report-download component

This one isn't a copy change, it's a wiring gap, but it affects both conversion and AI/SEO surface area, so it's worth capturing alongside the copy fixes above.

MTM already has a working gated report-download component (`InsightsReportDownloadSection.astro`) built to accept a different report per instance (`tagKey`/`titleKey`/`descriptionKey` props), but it's only ever instantiated once, generically, at `/insights/report-download`. The five solution pages (`advertising`, `media`, `industry`, `education`, `gov-ngos`) each have their own hero/testimonial copy already, but none of them embed this component — so a visitor on any of the five pages who wants a sample report gets routed to the same generic, unrelated report regardless of which persona page they came from.

Suggested pairing (all copy already exists, no new writing needed):

| Solution page | Gated report to embed | Source key |
|---|---|---|
| Advertising & Marketing | Adoption Report | `free_report_1_*` |
| Media & Broadcasting | "YouTube Is The New Cable" / Rise of Shortform Video | `hero_featured_report_title` / `insights.featured_report_title` |
| Education & Research | Futures Report | `free_report_2_*` |
| Government & NGOs | Arrivals Report | `free_report_3_*` |
| Industry (general) | Streaming-wars infographic | `infographic_title` / `infographic_description` |

**Why this belongs next to the AEO notes above**: each persona page gaining a real, dated, topic-specific gated asset also means more distinct, structured, citable content per page — the same "extractability" and "topical cluster coverage" principles from the AI-SEO pass apply here too, not just to the hero. Five generic-vs-matched report pages is also a cleaner signal for query fan-out than one catch-all download page.

---

## Not changed / kept as-is

- Product naming (MTM 18+, MTM Junior, MTM Newcomers, MTM Census Tool) — already comparable to how Nielsen/Stripe name sub-products.
- `reports_cta_1` / `reports_cta_2` — already varied ("Learn More About Reports" vs. "Download a Sample Report"), no repetition issue here.
- FAQ content itself — the policy/funding claim doesn't need to be removed from FAQ #3, only echoed earlier in the hero.
