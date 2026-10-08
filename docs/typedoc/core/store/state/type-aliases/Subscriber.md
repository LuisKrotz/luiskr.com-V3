[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/store/state](../README.md) / Subscriber

```ts
type Subscriber = (_state) => void
```

Defined in: [core/store/state.ts:139](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/store/state.ts#L139)

Subscriber callback — invoked by notify() with the state bag after every
commit that didn't suppress notification.

## Parameters

### \_state

[`StoreState`](../interfaces/StoreState.md)

The post-mutation state.

## Returns

`void`
