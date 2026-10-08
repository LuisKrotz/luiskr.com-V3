[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/utils/schema](../README.md) / generateProjectArticleSchema

```ts
function generateProjectArticleSchema(
   project, 
   slug, 
   locale?
): Record<string, unknown>[];
```

Defined in: [core/utils/schema.ts:114](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/schema.ts#L114)

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
