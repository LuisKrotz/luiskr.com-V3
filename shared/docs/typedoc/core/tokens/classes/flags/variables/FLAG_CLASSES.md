[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/classes/flags](../README.md) / FLAG\_CLASSES

```ts
const FLAG_CLASSES: Readonly<{
  FLAG_IMG: "flag-img";
  FLAG_SPLIT: "flag-split";
  FLAG_CANVAS: "flag-canvas";
  FLAG_CANVAS_NAV: "flag-canvas--nav";
}>;
```

Defined in: [core/tokens/classes/flags.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/classes/flags.ts#L14)

Language-flag classes — `flag-img`/`flag-split` for the SVG flag images,
`flag-canvas`/`flag-canvas--nav` for the WebGL/2D-drawn flag surfaces in
the locale picker. `_B_FLAG_CANVAS` is its own block so canvas variants
(nav vs dialog sizing) key off `--nav` modifiers.
