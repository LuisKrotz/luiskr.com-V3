[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/data/notify](../README.md) / NOTIFY\_TYPES

```ts
const NOTIFY_TYPES: Readonly<{
  ERROR: 'error'
  INFO: 'info'
  SUCCESS: 'success'
}>
```

Defined in: [src/core/tokens/data/notify.ts:16](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/data/notify.ts#L16)

Toast severity tokens. ERROR intentionally aliases `WINDOW_EVENTS.ERROR`
so the 'error' literal stays single-declared — the toast modifier and the
window event name share one token source (zero-hardcoding).
