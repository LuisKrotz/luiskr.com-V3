[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/utils/notify](../README.md) / initGlobalErrorHandlers

```ts
function initGlobalErrorHandlers(): boolean;
```

Defined in: [core/utils/notify.ts:205](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/notify.ts#L205)

Wires window 'error' + 'unhandledrejection' to the generic error toast so
uncaught failures surface gracefully instead of only logging. Idempotent.

## Returns

`boolean`

false outside a windowed context
