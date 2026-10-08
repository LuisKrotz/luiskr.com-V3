# `core/tokens/attrs/microdata.ts`

HTML microdata attribute tokens (`itemscope`/`itemtype`/

| | |
|---|---|
| **Source** | `src/core/tokens/attrs/microdata.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `MICRODATA_ATTRS`

Frozen microdata attribute-name map — sole declaration site for these
tokens; consumers read members and never re-declare the strings
(zero-hardcoding rules 4–5). Object.freeze makes the token contract
immutable at runtime.

### `ITEMSCOPE`

`itemscope` — boolean attribute that opens a microdata item.

### `ITEMTYPE`

`itemtype` — Schema.org type URL for the enclosing itemscope.

### `ITEMPROP`

`itemprop` — property name of the enclosing itemscope's value.

### `MICRODATA_VALUES`

Frozen microdata value map — Schema.org type URLs (`itemtype` values)
and property names (`itemprop` values) used by the docs portal markup.
Composed from SCHEMA_STRINGS.SCHEMA_CONTEXT so the vocabulary base is
declared exactly once.

### `TYPE_TECH_ARTICLE`

itemtype value — https://schema.org/TechArticle (file pages).

### `TYPE_COLLECTION_PAGE`

itemtype value — https://schema.org/CollectionPage (folder/root pages).

### `PROP_NAME`

itemprop value — the item's display name.

### `PROP_URL`

itemprop value — the item's canonical URL.

### `PROP_DATE_MODIFIED`

itemprop value — last-modified timestamp.

### `PROP_ARTICLE_BODY`

itemprop value — main content body of the page/article.
