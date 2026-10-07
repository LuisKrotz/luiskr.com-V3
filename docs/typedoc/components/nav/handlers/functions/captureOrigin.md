[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [components/nav/handlers](../README.md) / captureOrigin

```ts
function captureOrigin(e?): void
```

Defined in: [src/components/nav/handlers.ts:36](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/nav/handlers.ts#L36)

Records the clicked button's center point in store.modalOrigin — the
preferences/lang dialogs read it to zoom their "genie" open animation
out from the trigger instead of from screen center. Falls back to
`closest('button,a')` because the click may land on an inner span —
the origin should be the control's center, not the text node's.

## Parameters

### e?

`Event`

Click event on (or inside) the trigger control.

## Returns

`void`
