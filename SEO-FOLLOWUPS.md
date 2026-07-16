# SEO Follow-Ups

Deferred items from the 2026-07-16 SEO audit. Not yet fixed — pick up when ready.

## 1. Placeholder copy still live in production

These are literal placeholder strings shipping as real body copy. Fix via the Google Sheet source, then `npm run sync-copy`.

- `src/content/copy/home.json`
  - `package_description` → currently `"Description about the MTM suite"` (renders under "The MTM Suite" heading)
  - `package_1_description` → currently `"Description about the data products"` (renders directly under the "41 Million Canadians Mapped" headline stat — this is the site's flagship claim with no supporting sentence explaining what it means or how it's counted)
- `src/content/copy/insights.json`
  - `section_5_description` → currently `"Description about what this section is"`
  - `free_report_2_date`, `free_report_3_date`, `news_card_tag_date` → all currently `"TBD"`
  - Line 79 (report card source): six "Free Report" cards on `/insights/` all render the *same* duplicated title/description ("Kids and their Reliance on the media and their portable devices…") — looks like a loop reusing one CMS entry for what should be six distinct reports. Needs six distinct entries, not just a copy fix.

## 2. About Us / Contact Us content

`src/pages/[locale]/about-us.astro` now has real content (products, methodology, CBC/Radio-Canada tie — grounded in facts already published elsewhere on the site) and is indexable. `src/pages/[locale]/contact.astro` is still Navbar + Footer only, `noindex={true}` — so it no longer 404s, but still needs:

- A real contact form or contact details
- Once content is in: remove `noindex={true}` from its `<Layout>` call, and remove its `/contact/` exclusion from the `isNoindexPath()` filter in `astro.config.mjs` so it rejoins the sitemap
- Consider wiring a real CMS page id for it once there's copy to manage (currently reuses the `home` dictionary just for Navbar/Footer strings — no dedicated tab)
- About Us content is hardcoded directly in `about-us.astro` (en/fr inline), not sheet-driven — there's no CMS tab for it yet. Fine for now, but if it needs frequent editing later, consider giving it a real Sheet tab like every other page.

## 3. No freshness/"as of" labels on headline stats

Audit finding: headline stats (sample size, response rate) have no date attached, so a claim like "MTM found X%" has nothing anchoring when that was measured. Tried adding a pill (`"Fielded Feb 2026"`, etc.) to the product-page heroes, next to the description — pulled it back out because it read as clutter next to the CTA. Real dates already exist in copy if this gets revisited:

- MTM 18+: no single date — released twice yearly (Fall wave in Feb, Spring wave in July), per the homepage FAQ
- Juniors: fielded Feb 2026 (`juniors.json` → `provider_description`)
- Newcomers: fielded Summer 2025 (`newcomers.json` → `provider_description`)

If picked up again, consider a quieter treatment than a hero pill — e.g. a small date inline within the `ProductMethodologySection` stat cards themselves rather than a standalone element competing with the CTA.

## Also noticed while in the footer (not yet fixed, adjacent to the above)

- `src/components/home/HomeSolutions.astro` and `src/components/home/HomeFooterSection.astro` link to `/solutions/government-ngos/` — the real route is `/solutions/gov-ngos/`. This is a live broken link on the homepage and in the footer.
- Footer "Tools" column (`HomeFooterSection.astro`) — Data Analysis / Trending / Forecasting all link to `/tools/` (bare), which isn't a real route (the tools live at `/tools/analytic-tools/`).
- Footer "Site Policies" / "Privacy Policy" / "Terms & Conditions" all point at `/contact/` — likely meant to be separate pages or anchors, not the same route repeated three times.
