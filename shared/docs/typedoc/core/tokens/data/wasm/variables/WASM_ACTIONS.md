[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/data/wasm](../README.md) / WASM\_ACTIONS

```ts
const WASM_ACTIONS: Readonly<{
[k: string]: string;
}>;
```

Defined in: [core/tokens/data/wasm.ts:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/data/wasm.ts#L31)

Frozen `{ NAME: 'NAME' }` action map built from `_WASM_ACTION_LIST` —
workers dispatch on `type`, and self-keyed entries make typos
compile-checkable while the wire value stays the plain string.
