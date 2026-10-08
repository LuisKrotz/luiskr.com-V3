[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [website/views/project/layout](../README.md) / textDelay

```ts
function textDelay(c, items): number;
```

Defined in: [website/views/project/layout.ts:49](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/views/project/layout.ts#L49)

Per-char draw delay for a section's text run: counts REAL characters
(HTML stripped — tags don't consume stagger time), then sizes the
interval so the whole run lands inside DRAW_TARGET_MS. Non-array input
gets the fallback delay so malformed CMS data still animates.

## Parameters

### c

[`ViewProject`](../../Project/classes/ViewProject.md)

The ViewProject instance (unused — facade signature).

### items

`unknown`

Section text items (expected string[]).

## Returns

`number`

Per-char delay in ms.
