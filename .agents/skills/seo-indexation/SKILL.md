---
name: seo-indexation
description: Search-indexation contract — canonical URLs must serve 200 (never redirect), sitemaps list only final indexable URLs, internal/agent surfaces are noindexed, and unresolvable routes noindex at runtime instead of serving duplicate 200s.
---

# SEO Indexation

The site's crawl contract. Every public URL on luiskr.com is either an
indexable canonical 200 or explicitly excluded via `noindex` — there is
no third state. Google Search Console regressions (Page with redirect,
Alternate page with proper canonical, Duplicate/soft-404 floods) all
trace back to violating one of these invariants.

## URL form — slashless canonicals, enforced at hosting

- Pages emit as `dir/index.html`. `firebase.json` MUST keep
  `hosting.trailingSlash: false`: `/dir/` → 301 → `/dir`, and `/dir`
  serves the index at 200. Every canonical, sitemap `<loc>`, hreflang
  alternate, JSON-LD url, and internal link is slashless — the URL a
  crawler is told is canonical must never itself redirect.
- Do NOT enable `cleanUrls` — `/docs` serves real `.html` file nodes at
  their literal path; extension-stripping redirects would break them.
- Redirects are for aliases only (`PROJECT_ALIASES`, `/<loc>/docs`,
  `/<loc>/star-field-experiment`, `space-playground`, legacy legal
  segments). They live in `hosting.redirects` via
  `syncFirebaseRewrites()` and must never appear in a sitemap.

## Sitemap / urllist hygiene

- A sitemap lists **final, canonical, indexable** URLs only — never a
  redirect source, a trailing-slash variant, or a noindex surface.
- `/docs/**` is deliberately absent: it mirrors generated artifacts
  (typedoc, coverage, source viewers) for humans and AI agents — an
  `X-Robots-Tag: noindex` surface, not a crawl target.
- Media deep links and star-field body links are real canonical pages in
  every locale and stay listed; their validity is enforced by
  `seo-route-parity.test.js` + `seo-indexation.test.js`.
- `image:image` / `video:video` extension tags carry the owning page's
  localized `searchThemes` (caption / `video:tag`) — every page and
  project node in `database.json` holds a content-derived list
  (`patch-all-pages-search-themes.js`) that also feeds
  `<meta name="keywords">` and WebPage JSON-LD `keywords`.
- The field name is the shared `CMS_KEYS.SEARCH_THEMES` token. Run the
  patch script to refresh the snapshot; `LK_OFFLINE=1` regenerates crawl
  artifacts from that snapshot and the cached media manifest without
  outbound requests.

## RSS feeds

- `generate-sitemap.js` also emits RSS 2.0 + Media RSS — `meta/feed.xml`
  (en) and `meta/<loc>/feed.xml` per locale — pages + all projects with
  cover media. Video items use `<media:thumbnail>` only when a bucket-backed
  poster exists and keep the source in `<media:content>`; absent derivatives
  never produce an empty `url` attribute. Rewrites: `/feed.xml`, `/rss.xml`
  → `/meta/feed.xml`;
  `/<loc>/feed.xml` → `/meta/<loc>/feed.xml` (STATIC_REWRITES /
  META_FILE_REWRITES — adding a feed file means editing both).
- Every emitted page advertises its locale feed via
  `<link rel="alternate" type="application/rss+xml">` (localize()
  `feedUrl`); feeds are crawl artifacts, never sitemap entries.

## Internal surfaces — noindex, don't disallow

- `X-Robots-Tag: noindex` on `/docs`, `/docs/**`, `/docs-content/**`,
  `/deploy-info/**`, `/langs/**`, `/cms`, `/admin` (`firebase.json`
  headers). `/langs/` duplicates the public locale pages byte-for-byte.
- `Disallow` only pure payload paths (`/docs-content/`, `/deploy-info/`,
  `/meta/`, `/langs/`). NEVER `Disallow: /docs` — crawlers must be able
  to fetch it to see the `noindex` header, or already-indexed URLs
  strand as URL-only results.

## Runtime indexation — soft-404s must noindex

The SPA `**` catch-all serves 200 for anything, so unresolvable
locations must self-exclude through `setRobotsMeta`
(`core/utils/schema.ts` — the single authority for `<meta
name="robots">`). Indexable routes are not left meta-less: the shell
(index.html) and every indexable navigation carry
`SCHEMA_STRINGS.INDEX_RICH_DIRECTIVES` (`index, follow,
max-image-preview:large, max-snippet:-1, max-video-preview:-1`) —
`max-image-preview:large` is the opt-in Google/Bing require for large
image cards and Discover previews.

- `syncDocumentHead` (`core/router/navigate.ts`) resets the meta every
  navigation and re-arms it for `ROUTE_NAMES.NOT_FOUND` — a stale
  noindex can never leak onto an indexable route.
- Missing project snapshot (`website/views/project/data.ts`) → noindex.
- Media deep-link slug that resolves to no item in the active locale
  (`modal.ts`) → noindex. A foreign-locale slug on the wrong prefix is a
  duplicate, not a page.
- Star-field `body` segment matching no catalog id (`StarField.tsx`)
  → noindex after the names table settles.
- `data.noindex` (draft projects) stays authoritative post-fetch.

## Link hygiene

Never emit prose as `href` — only values matching `^https?://` may be
linked. Citation/provenance text (`starBodyContent`'s `b.source`, media
labels, credits) renders as text; `meta.refs` are the URLs. A label in
an `<a href>` manufactures garbage relative URLs that crawlers chase
into soft-404s.

## Gates

- `shared/tests/governance/seo-indexation.test.js` — trailingSlash pin,
  X-Robots-Tag coverage, robots disallows, sitemap cleanliness,
  citation-href guard, runtime-noindex wiring.
- `shared/tests/governance/seo-route-parity.test.js` — sitemap ↔ router
  ↔ firebase rewrite/redirect parity, media deep links per locale,
  canonical slug tables.
- Regenerate crawl artifacts after route/slug changes:
  `node shared/scripts/build/generate-sitemap.js` (offline falls back to
  `database.json`).
- `firebase.json` rewrites/redirects are regenerated by
  `syncFirebaseRewrites()` in `build-locale-pages.mjs` — it preserves
  `trailingSlash`, `headers`, and all non-rewrite keys; edit the file
  directly for header/policy changes.

## Expected GSC steady state

"Page with redirect" retains only intentional alias 301s; "Alternate
page with proper canonical" retains only the slash variants that now
301 correctly; "Discovered — currently not indexed" keeps the long tail
of deep links Google chooses not to fetch — that is normal, not an
error. A rising count in any bucket means this contract was broken.
