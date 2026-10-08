# `core/utils/schema.ts`

JSON-LD structured-data builders (Schema.org entities for

| | |
|---|---|
| **Source** | `src/core/utils/schema.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

Award/press item as handed to the ItemList builder — label/title are display names, link/slug feed the target URL.

### (module scope)

Project translation slice the Article/VideoObject builders read — cover drives both image variants and the optional VideoObject.

### `generateWebsiteSchema`

Generates WebSite and Organization schema for the homepage.
- `@returns` JSON-LD entities

### `generateCarouselItemListSchema`

Generates an ItemList matching Google Carousel rich results guidelines —
`position` is 1-based per the spec, and `image` is only emitted when the
item carries a src (an absent property beats an empty one for parsers).
- `@returns` ItemList entity, or null when there is nothing to list.

### `generateProjectArticleSchema`

Generates an Article and VideoObject graph for a project detail page.
Includes multiple aspect ratio image variants (16x9, 4x3, 1x1) for Google Rich Results.
- `@param` project - Project translation data
- `@param` slug - Project URL slug
- `@param` locale - Page locale (defaults to LOCALES.EN)
- `@returns` Array of Schema.org entities

### (module scope)

Minimal manifest-node shape the docs schema reads — kept structural so `core` never imports from `experiments`.

### `generateDocsSchema`

Generates the docs-portal JSON-LD graph for a resolved docs path:
a `BreadcrumbList` mirroring the on-page crumb trail plus one page
entity — `CollectionPage` for the portal root and folders,
`TechArticle` for file pages (markdown/code/report payloads). English
is the only docs locale, so `inLanguage` is fixed to `en`.
- `@param` docsPath Manifest-relative path ('' → the portal root).
- `@param` node     Resolved manifest node (null at the root / on misses).
- `@returns` JSON-LD entities for updateJsonLd().

### `updateJsonLd`

Dynamically updates the JSON-LD script graph in the document head.
Maintains exactly one `<script type="application/ld+json">` node — an
array payload is wrapped in a `@graph` container so a single script can
carry the whole entity set (the form Google's parsers prefer), and
`textContent` (not innerHTML) writes it since JSON must not go through
the HTML parser. Passing `null`/`undefined` REMOVES the node — routes
that own a page-scoped graph (docs TechArticle, project Article) clear
it on teardown so the entity never leaks onto the next route.
- `@param` graph Entity or entity array; null/undefined removes the node.
