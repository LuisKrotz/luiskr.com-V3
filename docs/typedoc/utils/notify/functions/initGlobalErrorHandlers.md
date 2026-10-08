[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [utils/notify](../README.md) / initGlobalErrorHandlers

```ts
function initGlobalErrorHandlers(): boolean
```

Defined in: [core/utils/notify.ts:205](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/notify.ts#L205)

Wires window 'error' + 'unhandledrejection' to the generic error toast so
uncaught failures surface gracefully instead of only logging. Idempotent.

## Returns

`boolean`

false outside a windowed context
