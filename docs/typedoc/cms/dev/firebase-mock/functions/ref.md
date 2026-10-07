[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [cms/dev/firebase-mock](../README.md) / ref

```ts
function ref(_db, path?): MockRef
```

Defined in: [src/cms/dev/firebase-mock.ts:61](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/dev/firebase-mock.ts#L61)

Mock of firebase/database `ref()` — wraps a path so `child()`/`get()`
can compose it like the real SDK.

## Parameters

### \_db

`unknown`

Unused database handle (kept for signature parity).

### path?

`string` = `''`

Root path for the ref.

## Returns

`MockRef`

A {__path} ref stand-in.
