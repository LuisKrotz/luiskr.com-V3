[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [cms/projects/types](../README.md) / gcs

```ts
function gcs(filename, isVideo?): string;
```

Defined in: [cms/projects/types.ts:46](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/projects/types.ts#L46)

Builds the CDN URL for a media filename the same way the public site
does — videos resolve to their poster frame, images to the mozjpeg
thumb variant — so CMS previews show exactly what visitors will see.

## Parameters

### filename

`string`

Extensionless CDN stem (folder + name).

### isVideo?

`boolean`

When true, resolves the generated poster frame instead.

## Returns

`string`

The full preview URL.
