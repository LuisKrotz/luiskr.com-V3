[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [cms/media-convert/exts](../README.md) / isMediaPath

```ts
function isMediaPath(name): boolean
```

Defined in: [cms/media-convert/exts.ts:56](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/cms/media-convert/exts.ts#L56)

Reports whether a file name/path carries a supported media extension.
Extension check is case-insensitive; names with no dot, dotfiles
(.DS_Store) and unknown extensions all report false so OS litter inside
dropped folders never reaches the queue.

## Parameters

### name

`string`

— file name or relative path

## Returns

`boolean`

true when the extension is a known image or video format
