[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/utils/schema](../README.md) / generateProjectArticleSchema

```ts
function generateProjectArticleSchema(project, slug, locale?): Record<string, unknown>[]
```

Defined in: [src/core/utils/schema.ts:112](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/utils/schema.ts#L112)

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
