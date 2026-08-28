# SEO reference

What is implemented, where it lives, and what has to be redone by hand when the
site moves to its real domain.

For the domain cutover mechanics themselves (DNS, `CNAME`, the two env vars),
see **[Moving to www.mtm-otm.ca](../README.md#moving-to-wwwmtm-otmca)** in the
README. This file covers the SEO surface specifically — including the parts the
env vars do _not_ carry over.

---

## 1. What's in the build

### Structured data (JSON-LD)

All schema is JSON-LD in `<head>`, emitted per page via the `head` slot in
`Layout.astro`. No microdata, no RDFa.

| Page(s)                                                                                                     | Types                                             |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `/` (en + fr)                                                                                               | `Organization`, `WebSite`, `FAQPage`              |
| `/products/*` (3 × 2 locales)                                                                               | `WebPage`, `Service`, `Dataset`, `BreadcrumbList` |
| `/solutions/*` (5 × 2)                                                                                      | `WebPage`, `Service`, `BreadcrumbList`            |
| `/tools/*`, `/about-us/`, `/insights/`, `/request-demo/`                                                    | `WebPage`, `BreadcrumbList`                       |
| 7 `noindex` pages (sign-in, register, contact, forgot-password, the 3 report-download/success pages)        | none — intentional                                |
| 4 `noindex` success/error pages (contact-success, register-success, request-demo-success, submission-error) | bare `WebPage` only                               |

Shared builders:

- `src/lib/content/datasets.ts` — `buildDataset()`, product pages only.
- `src/lib/content/breadcrumbs.ts` — `buildBreadcrumbList()`. Note the comment at
  the top: Products/Solutions/Tools have **no index route**, so they get no
  middle crumb or it would point at a 404.
- `src/lib/content/homeFaqs.ts` — the FAQ pairs, shared by the visible accordion
  and the `FAQPage` schema, so the two can't drift.

The home page defines `Organization` and `WebSite` with stable `@id`s
(`{siteRoot}#organization`, `#website`). Every other page references
`#organization` by `@id` instead of redefining it — change the org once, it
applies site-wide.

### Meta and crawl control

- `src/layouts/Layout.astro` — canonical, `hreflang` en/fr/x-default,
  `robots` (`noindex, nofollow` when `noindex` prop is set), OG and Twitter cards.
- `astro.config.mjs` — `NOINDEX_SUFFIXES` lists every page that sets
  `noindex`, because `@astrojs/sitemap` can't see that prop. **Keep in sync:**
  `grep -rn "noindex" src/pages/`. A page in the sitemap that also says
  `noindex` is a contradiction crawlers report as an error.
- Sitemap `lastmod` comes from `git log` over both the `.astro` template and its
  CMS JSON (`LASTMOD_SOURCES`), so a copy-only change still bumps the date.

### Generated endpoints

These are Astro endpoints, not static files in `public/`, so every URL inside
them is derived from `site` + `base` and follows a domain change automatically:

| File                            | Serves                                                      |
| ------------------------------- | ----------------------------------------------------------- |
| `src/pages/robots.txt.ts`       | `robots.txt` + the `Sitemap:` line                          |
| `src/pages/llms.txt.ts`         | `llms.txt` ([spec](https://llmstxt.org/)), 14 curated links |
| `src/pages/site.webmanifest.ts` | PWA manifest                                                |
| `scripts/generate-md.mjs`       | 28 `.md.txt` plain-text page twins, postbuild               |

### Crawler/indexing services

| Thing                              | File                                          | Notes                                                                                                      |
| ---------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Google Search Console verification | `public/google11d21769fc961855.html`          | Byte-exact contents. **Never edit or delete** — Google re-checks it and deleting un-verifies the property. |
| IndexNow key                       | `public/1cae23d9e1e9afde45908fe7ea265e6f.txt` | Key must stay reachable at the site root or submissions are rejected.                                      |
| IndexNow submit                    | `scripts/indexnow-submit.mjs`                 | Runs post-deploy in `deploy.yml`. Reads the **live** sitemap over HTTP, not `dist/`.                       |

`scripts/a11y-tree-check.mjs` skips `.html` files with no `<html>` element —
that's what lets the Google verification file coexist with the strict a11y gate
in `npm run validate`.

---

## 2. Domain change checklist

### Carried over automatically

Set `BUILD_SITE_URL` and `BUILD_BASE_PATH` (or change the two defaults in
`astro.config.mjs`) and all of this follows, because every value is derived from
`Astro.site` / `import.meta.env.BASE_URL`:

canonical tags · hreflang · `og:url` / `og:image` · sitemap URLs and the
`Sitemap:` line in robots.txt · `llms.txt` · `site.webmanifest` · `.md.txt`
twins · IndexNow submissions · **all JSON-LD** (`@id`, `url`, `creator`,
`publisher`, breadcrumb items)

Verify before cutting over:

```bash
BUILD_SITE_URL=https://www.mtm-otm.ca BUILD_BASE_PATH=/ npm run build
grep -rl "github.io" dist/ | head    # should return nothing
```

Both files in `public/` (Google verification, IndexNow key) are copied to the
build root as-is, so they serve from the new domain with no edit.

### Must be redone by hand

1. **Create a new Search Console property** for the new domain. Verification is
   per-origin — the existing property does not transfer. The verification file
   is already deployed, so this is just clicking Verify on the new property.
   Consider a Domain property instead of URL-prefix once you control DNS: it
   covers http/https and all subdomains in one.
2. **Resubmit the sitemap** in the new property:
   `https://www.mtm-otm.ca/sitemap-index.xml`
3. **Keep the old property** for a few months and watch the Change of Address /
   crawl reports while Google migrates the index.
4. **Update `README.md`** — the "Live site" line and this doc's example URLs.
5. **Re-test rich results** on the new URLs (see below). Schema `@id`s change
   with the domain, so it's worth confirming once rather than assuming.

### Where the current URLs are hardcoded

Only as **env-var defaults**, both with the same pair of values — there is no
find-and-replace to do:

- `astro.config.mjs` — `site`, `base`
- `scripts/indexnow-submit.mjs` — `SITE_ORIGIN`, `BASE_PATH`
- `scripts/generate-md.mjs` — `BASE_PATH`

---

## 3. Validation

Rich Results Test needs a **public URL**, so it only works after deploy:
<https://search.google.com/test/rich-results>

Test one EN and one FR page — they run the same code with different
`inLanguage` and locale-resolved copy:

```
https://<domain>/en/products/juniors/
https://<domain>/fr/products/juniors/
```

Expected: `Dataset`, `Service`, `WebPage`, `Breadcrumbs` detected.
Expected notice: **missing `license`** on Dataset — omitted on purpose, see
gaps below. That one is informational, not an error.

Local checks (no deploy needed):

```bash
npm run validate      # check + build + site audit + a11y audit
npm run audit:site    # blocks href="#", inline style=, console.log
```

---

## 4. Known gaps and deliberate omissions

| Item                                   | Status                 | Why                                                                                                                                                                                                   |
| -------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `og:image` is `mtm-favicon.svg`        | **Real gap**           | Most social platforms don't render SVG previews. Needs a 1200×630 PNG/JPG.                                                                                                                            |
| Dataset `license`                      | Omitted                | No public licence or terms page exists to link. Add to `datasets.ts` if one is written.                                                                                                               |
| Dataset `distribution`                 | Omitted                | Survey data is gated; `isAccessibleForFree: false` says so.                                                                                                                                           |
| Visible breadcrumbs                    | Not built              | Deliberate product decision. `BreadcrumbList` markup still works in SERPs, but Google's policy prefers markup to mirror visible content. Blocked anyway: no index route for Products/Solutions/Tools. |
| `Article` / `HowTo` schema             | Not applicable         | No blog or public methodology content yet. Revisit when Insights publishes ungated pieces.                                                                                                            |
| `Product` schema                       | Deliberately `Service` | `Product` earns a rich result only with `offers`/`price`/`review`. Data is gated with no public price, so `Product` would be valid but inert.                                                         |
| FR Dataset `name`/`keywords`           | English                | `description` is CMS-driven and localises; name and keywords are hardcoded per page. Move to CMS keys if the FR result matters.                                                                       |
| Dataset `temporalCoverage` start years | Derived, unverified    | 18+ `2001/..` ("since 2001"), Jr. `2018/..` and Newcomers `2021/..` — both arithmetic off the visible "8+ / 5+ Years of data collection" stats as of 2026. Correct if the real first waves differ.    |

### The rule behind several of these

Google's structured data policy: **mark up what is visible on the page.** The
Dataset schema follows it deliberately — `description` reads `hero_description`
(the paragraph users actually see) rather than the meta description, and
`temporalCoverage` traces to the on-page "Years of data collection" stat. Keep
that property when editing: if a value has no on-page counterpart, either
surface it in the UI or drop it from the schema.
