[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/strings/schema](../README.md) / SCHEMA\_STRINGS

```ts
const SCHEMA_STRINGS: Readonly<{
  SCHEMA_CONTEXT: "https://schema.org";
  NOINDEX_NOFOLLOW: "noindex, nofollow";
  JSON_LD_SCRIPT_TYPE: "application/ld+json";
  JSON_LD_SCRIPT_ID: "jsonld-graph";
  SCHEMA_PUBLISHED_DATE: "2021-01-01T00:00:00+00:00";
  SCHEMA_VIDEO_DURATION: "PT1M00S";
}>;
```

Defined in: [core/tokens/strings/schema.ts:12](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/strings/schema.ts#L12)

Schema.org / SEO JSON-LD string tokens. Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
