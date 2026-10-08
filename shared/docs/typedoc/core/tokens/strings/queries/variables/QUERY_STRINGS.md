[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/strings/queries](../README.md) / QUERY\_STRINGS

```ts
const QUERY_STRINGS: Readonly<{
  SELECTOR_LINKS: "a[href^=\"/\"], [data-route]";
  LINK_CANONICAL: "link[rel=\"canonical\"]";
  META_ROBOTS: "meta[name=\"robots\"]";
  ROOT_MARGIN_200: "200px 0px";
  ROOT_MARGIN_100: "100px 0px";
  ROOT_MARGIN_50: "50px 0px";
  DARK_SCHEME_QUERY: "(prefers-color-scheme: dark)";
  CONTAINER_TYPE: "container-type";
  INLINE_SIZE: "inline-size";
}>;
```

Defined in: [core/tokens/strings/queries.ts:12](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/strings/queries.ts#L12)

Selector/media-query/rootMargin string tokens. Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
