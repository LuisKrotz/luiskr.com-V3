[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/gpu/npu-predict](../README.md) / npuPredict

```ts
const npuPredict: NPUPredictor;
```

Defined in: [core/utils/gpu/npu-predict.ts:358](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/gpu/npu-predict.ts#L358)

Shared predictor singleton — pointer tracking, preloaded-target dedup,
and analytics are global state; a second instance would double-listen
pointermove.
