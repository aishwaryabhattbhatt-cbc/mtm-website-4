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

`src/pages/[locale]/about-us.astro` and `src/pages/[locale]/contact.astro` now exist (Navbar + Footer only, `noindex={true}`) so the footer links no longer 404. Still needed:

- Real page content for both (methodology/entity info for About Us; a contact form or details for Contact Us)
- Once content is in, remove `noindex={true}` from both `<Layout>` calls so they become indexable
- Consider wiring a real CMS page id for these once there's copy to manage (currently they reuse the `home` dictionary just for Navbar/Footer strings — no dedicated tab)

## Also noticed while in the footer (not yet fixed, adjacent to the above)

- `src/components/home/HomeSolutions.astro` and `src/components/home/HomeFooterSection.astro` link to `/solutions/government-ngos/` — the real route is `/solutions/gov-ngos/`. This is a live broken link on the homepage and in the footer.
- Footer "Tools" column (`HomeFooterSection.astro`) — Data Analysis / Trending / Forecasting all link to `/tools/` (bare), which isn't a real route (the tools live at `/tools/analytic-tools/`).
- Footer "Site Policies" / "Privacy Policy" / "Terms & Conditions" all point at `/contact/` — likely meant to be separate pages or anchors, not the same route repeated three times.
