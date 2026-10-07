[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/data/wasm](../README.md) / WASM\_ACTIONS

```ts
const WASM_ACTIONS: Readonly<{
  [k: string]: string
}>
```

Defined in: [src/core/tokens/data/wasm.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/data/wasm.ts#L30)

Frozen `{ NAME: 'NAME' }` action map built from `_WASM_ACTION_LIST` —
workers dispatch on `type`, and self-keyed entries make typos
compile-checkable while the wire value stays the plain string.
