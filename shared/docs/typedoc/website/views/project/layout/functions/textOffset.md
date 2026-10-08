[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [website/views/project/layout](../README.md) / textOffset

```ts
function textOffset(
   c, 
   items, 
   idx
): number;
```

Defined in: [website/views/project/layout.ts:71](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/views/project/layout.ts#L71)

Start offset for the text run at index `idx`: cumulative real chars of
the preceding items × the per-char delay, plus the per-index step — so
sequential sections cascade rather than all starting at t=0.

## Parameters

### c

[`ViewProject`](../../Project/classes/ViewProject.md)

The ViewProject instance — supplies textDelay via the facade.

### items

`unknown`

Section text items (expected string[]).

### idx

`number`

Index of this item in the section.

## Returns

`number`

Start offset in ms (0 for non-array input).
