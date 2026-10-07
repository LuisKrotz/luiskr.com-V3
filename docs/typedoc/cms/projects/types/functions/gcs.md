[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [cms/projects/types](../README.md) / gcs

```ts
function gcs(filename, isVideo?): string
```

Defined in: [src/cms/projects/types.ts:40](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/cms/projects/types.ts#L40)

Builds the CDN URL for a media filename the same way the public site
does — videos resolve to their poster frame, images to the mozjpeg
thumb variant — so CMS previews show exactly what visitors will see.

## Parameters

### filename

`string`

### isVideo?

`boolean`

## Returns

`string`
