[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [routes/views/project/layout](../README.md) / textDelay

```ts
function textDelay(c, items): number
```

Defined in: [website/views/project/layout.ts:49](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/website/views/project/layout.ts#L49)

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
