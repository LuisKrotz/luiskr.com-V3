---
name: seo-indexation
description: Search-indexation contract — canonical URLs must serve 200 (never redirect), sitemaps list only final indexable URLs, payload/agent surfaces are noindexed, and unresolvable routes noindex at runtime instead of serving duplicate 200s.
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
- `/docs` and every `/docs/**` manifest route are public indexable pages.
  `generate-sitemap.js` and `build-locale-pages.mjs` share the same docs
  scanner so directory listings, generated API docs, source pages, and
  coverage reports all have a prerendered canonical URL in the sitemap.
  `/docs-content/**` remains a noindex/disallowed JSON payload surface.
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
- The search page's list is seeded by `patch-search-page-themes.js` and
  extended by the all-pages patch with the localized names of every route
  and project it links — run the seed patch first so re-runs reset the
  derived tail.

## RSS feeds

- `generate-sitemap.js` also emits RSS 2.0 + Media RSS — `meta/feed.xml`
  (en) and `meta/<loc>/feed.xml` per locale — pages (including the search
  page) + all projects with cover media + every star-field dossier. Each
  item carries `<dc:creator>`, a permalink `<guid>`, and up to 12
  `<category>` elements from the owning node's localized `searchThemes`.
  Video items use `<media:thumbnail>` only when a bucket-backed
  poster exists and keep the source in `<media:content>`; absent derivatives
  never produce an empty `url` attribute. Rewrites: `/feed.xml`, `/rss.xml`
  → `/meta/feed.xml`;
  `/<loc>/feed.xml` → `/meta/<loc>/feed.xml` (STATIC_REWRITES /
  META_FILE_REWRITES — adding a feed file means editing both).
- Every emitted page advertises its locale feed via
  `<link rel="alternate" type="application/rss+xml">` (localize()
  `feedUrl`); feeds are crawl artifacts, never sitemap entries.
- Humans reach the feed through `<legal-footer>`'s RSS link
  (`feedHrefFor(locale)` → `/<loc>/feed.xml`, label `APP.rssFeed` via
  `SECTION_UI_KEYS.RSS_FEED`, written by `patch-rss-feed-label.js`). The
  delegated SPA click handler skips that anchor so the browser fetches
  the XML. `seo-route-parity.test.js` asserts every locale's footer href
  is a firebase rewrite.

## Payload surfaces — noindex, don't disallow indexable docs

- `X-Robots-Tag: noindex` on `/docs-content/**`, `/deploy-info/**`,
  `/langs/**`, `/cms`, `/admin`, `/llm/**`, and Markdown/JSON replicas
  outside `/docs` (`firebase.json` headers). The suffix-matching header
  patterns must exclude the first `/docs` path segment so `.md` and
  `.json` documentation pages still receive their prerendered HTML and
  indexable robots meta.
- `/docs` and `/docs/**` must remain crawlable and indexable. Locale docs
  aliases redirect to the English canonical route and never enter a sitemap.
- `Disallow` only pure payload paths (`/docs-content/`, `/deploy-info/`,
  `/meta/`, `/langs/`). NEVER `Disallow: /docs` — crawlers must be able
  to fetch canonical pages and follow their internal links.

## IndexNow — real-time submission

- The ownership key lives in `INDEXNOW` (`core/tokens/indexnow.ts`) and is
  hosted as the root key file `website/public/<key>.txt` — it must 200 at
  `https://luiskr.com/<key>.txt` and contain exactly the key, or engines
  403 every submission.
- `shared/scripts/build/submit-indexnow.mjs` ships the whole canonical
  surface (`dist/meta/urllist.txt`, fallback `website/public/meta/`) in
  BOTH protocol forms — JSON `urlList` POSTs (10k/req cap) and per-URL
  `?url=&key=&keyLocation=` GETs — so the inventory is always the same
  final-indexable list the sitemaps carry.
- It is the firebase `hosting.postdeploy` step (after the robots revert):
  submissions only validate once the new build and the key file are live.
  `yarn indexnow` reruns it manually; `--json`/`--param` select one form,
  `--dry-run` writes `reports/indexnow.json` without requests.

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
- An unresolved nonempty docs path (`experiments/docs/Docs.tsx`) must
  noindex rather than emitting an empty `CollectionPage` as a soft-404.
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
  ↔ firebase rewrite/redirect parity, complete docs-manifest coverage,
  media deep links per locale,
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
