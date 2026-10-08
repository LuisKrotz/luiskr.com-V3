[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/store/mutations](../README.md) / createMutations

```ts
function createMutations(store): MutationMap
```

Defined in: [core/store/mutations.ts:25](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/store/mutations.ts#L25)

Builds the mutation map bound to `store`. Domain groups are spread into
one flat map — key collisions would silently overwrite, so each group
owns a disjoint prefix of MUTATIONS by convention (theme._, media._, …).

## Parameters

### store

[`Store`](../../classes/Store.md)

The Store instance the mutators close over.

## Returns

[`MutationMap`](../../state/type-aliases/MutationMap.md)

The composed MutationMap.
