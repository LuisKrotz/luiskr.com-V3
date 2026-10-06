# `core/utils/schema.ts`

JSON-LD structured-data builders (Schema.org entities for

| | |
|---|---|
| **Source** | `src/core/utils/schema.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `generateWebsiteSchema`

Generates WebSite and Organization schema for the homepage.
- `@returns` JSON-LD entities

### `generateCarouselItemListSchema`

Generates an ItemList matching Google Carousel rich results guidelines.
- `@returns` ItemList entity

### `generateProjectArticleSchema`

Generates an Article and VideoObject graph for a project detail page.
Includes multiple aspect ratio image variants (16x9, 4x3, 1x1) for Google Rich Results.
- `@param` project - Project translation data
- `@param` slug - Project URL slug
- `@param` locale - Page locale (defaults to LOCALES.EN)
- `@returns` Array of Schema.org entities

### `updateJsonLd`

Dynamically updates the JSON-LD script graph in the document head.
