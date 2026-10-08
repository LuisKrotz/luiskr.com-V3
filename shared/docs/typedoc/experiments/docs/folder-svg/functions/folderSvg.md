[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [experiments/docs/folder-svg](../README.md) / folderSvg

```ts
function folderSvg(name, isDir?): SVGElement;
```

Defined in: [experiments/docs/folder-svg.tsx:95](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/docs/folder-svg.tsx#L95)

Deterministic animated folder SVG for a manifest node name.

## Parameters

### name

`string`

Folder/file display name — hashed for the artwork.

### isDir?

`boolean` = `true`

Directory glyphs show threads; files show a folded corner.

## Returns

`SVGElement`

The SVG subtree (JSX-created, namespaced).
