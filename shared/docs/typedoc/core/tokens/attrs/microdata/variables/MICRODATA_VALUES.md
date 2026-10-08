[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/attrs/microdata](../README.md) / MICRODATA\_VALUES

```ts
const MICRODATA_VALUES: Readonly<{
  TYPE_TECH_ARTICLE: "https://schema.org/TechArticle";
  TYPE_COLLECTION_PAGE: "https://schema.org/CollectionPage";
  PROP_NAME: "name";
  PROP_URL: "url";
  PROP_DATE_MODIFIED: "dateModified";
  PROP_ARTICLE_BODY: "articleBody";
}>;
```

Defined in: [core/tokens/attrs/microdata.ts:34](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/attrs/microdata.ts#L34)

Frozen microdata value map — Schema.org type URLs (`itemtype` values)
and property names (`itemprop` values) used by the docs portal markup.
Composed from SCHEMA_STRINGS.SCHEMA_CONTEXT so the vocabulary base is
declared exactly once.
