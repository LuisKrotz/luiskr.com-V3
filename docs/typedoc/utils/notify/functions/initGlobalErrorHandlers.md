[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [utils/notify](../README.md) / initGlobalErrorHandlers

```ts
function initGlobalErrorHandlers(): boolean
```

Defined in: [src/utils/notify.ts:205](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/notify.ts#L205)

Wires window 'error' + 'unhandledrejection' to the generic error toast so
uncaught failures surface gracefully instead of only logging. Idempotent.

## Returns

`boolean`

false outside a windowed context
