[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/store/state](../README.md) / Mutation

```ts
type Mutation = (_payload?) => void | boolean
```

Defined in: [core/store/state.ts:129](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/store/state.ts#L129)

One named mutation: receives an optional payload, mutates store.state,
and returns `false` to suppress notify() for no-op writes (any other
return value means "state changed, fan out").

## Parameters

### \_payload?

`unknown`

Caller-supplied mutation input.

## Returns

`void` \| `boolean`
