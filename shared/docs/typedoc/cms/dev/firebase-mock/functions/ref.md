[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [cms/dev/firebase-mock](../README.md) / ref

```ts
function ref(_db, path?): MockRef;
```

Defined in: [cms/dev/firebase-mock.ts:61](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/dev/firebase-mock.ts#L61)

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
