[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/store/getters](../README.md) / createGetters

```ts
function createGetters(store): StoreGetters;
```

Defined in: [core/store/getters.ts:18](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/getters.ts#L18)

Builds the getter map bound to `store`. Each entry is a thin arrow over
`store.state` — evaluated lazily per call so subscribers always read the
post-mutation snapshot, never a captured copy.

## Parameters

### store

[`Store`](../../classes/Store.md)

The Store instance to read from.

## Returns

[`StoreGetters`](../../state/interfaces/StoreGetters.md)

The StoreGetters facade.
