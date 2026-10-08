# `core/utils/schema.ts`

JSON-LD structured-data builders (Schema.org entities for

| | |
|---|---|
| **Source** | `core/utils/schema.ts` |
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

### `updateJsonLd`

Dynamically updates the JSON-LD script graph in the document head.
Maintains exactly one `<script type="application/ld+json">` node — an
array payload is wrapped in a `@graph` container so a single script can
carry the whole entity set (the form Google's parsers prefer), and
`textContent` (not innerHTML) writes it since JSON must not go through
the HTML parser.
- `@param` graph Entity or entity array; null/undefined leaves the DOM alone.
