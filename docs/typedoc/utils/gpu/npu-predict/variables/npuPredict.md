[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/gpu/npu-predict](../README.md) / npuPredict

```ts
const npuPredict: NPUPredictor
```

Defined in: [src/utils/gpu/npu-predict.ts:358](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/gpu/npu-predict.ts#L358)

Shared predictor singleton — pointer tracking, preloaded-target dedup,
and analytics are global state; a second instance would double-listen
pointermove.
