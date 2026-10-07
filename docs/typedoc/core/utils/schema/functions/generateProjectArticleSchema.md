[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/utils/schema](../README.md) / generateProjectArticleSchema

```ts
function generateProjectArticleSchema(project, slug, locale?): Record<string, unknown>[]
```

Defined in: [src/core/utils/schema.ts:105](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/utils/schema.ts#L105)

Generates an Article and VideoObject graph for a project detail page.
Includes multiple aspect ratio image variants (16x9, 4x3, 1x1) for Google Rich Results.

## Parameters

### project

`ProjectSchemaSource` \| `null`

Project translation data

### slug

`string`

Project URL slug

### locale?

`string` = `LOCALES.EN`

Page locale (defaults to LOCALES.EN)

## Returns

`Record`\<`string`, `unknown`\>[]

Array of Schema.org entities
