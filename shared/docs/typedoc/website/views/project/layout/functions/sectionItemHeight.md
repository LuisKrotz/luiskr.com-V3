[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [website/views/project/layout](../README.md) / sectionItemHeight

```ts
function sectionItemHeight(c, section): string;
```

Defined in: [website/views/project/layout.ts:26](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/views/project/layout.ts#L26)

Per-section CSS height: the FIRST media item's intrinsic ratio applied
to the viewport width — min(100vw·h/w, SKELETON_ITEM_HEIGHT). Emitting
the height before decode means the section never reflows when media
arrives. Sections without a sized media array fall back to the fixed
skeleton height. `toFixed(4)` keeps the calc string compact while
preserving sub-pixel accuracy.

## Parameters

### c

[`ViewProject`](../../Project/classes/ViewProject.md)

The ViewProject instance (unused — part of the method facade).

### section

[`SectionChild`](../../types/type-aliases/SectionChild.md)[]

One section's children; the media array is detected by shape.

## Returns

`string`

A CSS `min()` height expression.
