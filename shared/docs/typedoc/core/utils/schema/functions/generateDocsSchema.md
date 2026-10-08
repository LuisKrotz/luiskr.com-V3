[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/utils/schema](../README.md) / generateDocsSchema

```ts
function generateDocsSchema(docsPath, node): Record<string, unknown>[];
```

Defined in: [core/utils/schema.ts:204](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/schema.ts#L204)

Generates the docs-portal JSON-LD graph for a resolved docs path:
a `BreadcrumbList` mirroring the on-page crumb trail plus one page
entity — `CollectionPage` for the portal root and folders,
`TechArticle` for file pages (markdown/code/report payloads). English
is the only docs locale, so `inLanguage` is fixed to `en`.

## Parameters

### docsPath

`string`

Manifest-relative path ('' → the portal root).

### node

`DocsSchemaNode` \| `null`

Resolved manifest node (null at the root / on misses).

## Returns

`Record`\<`string`, `unknown`\>[]

JSON-LD entities for updateJsonLd().
