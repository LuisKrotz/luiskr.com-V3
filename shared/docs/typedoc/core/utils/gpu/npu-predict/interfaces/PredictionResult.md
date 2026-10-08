[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/gpu/npu-predict](../README.md) / PredictionResult

Defined in: [core/utils/gpu/npu-predict.ts:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/gpu/npu-predict.ts#L31)

Outcome of one likelihood prediction.

## Properties

### probability

```ts
probability: number;
```

Defined in: [core/utils/gpu/npu-predict.ts:33](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/gpu/npu-predict.ts#L33)

Estimated navigation probability 0–1.

***

### preloaded?

```ts
optional preloaded?: boolean;
```

Defined in: [core/utils/gpu/npu-predict.ts:35](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/gpu/npu-predict.ts#L35)

true when the target was already prefetched.

***

### npuAccelerated?

```ts
optional npuAccelerated?: boolean;
```

Defined in: [core/utils/gpu/npu-predict.ts:37](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/gpu/npu-predict.ts#L37)

Which tier scored it — WebNN NPU.

***

### gpuAccelerated?

```ts
optional gpuAccelerated?: boolean;
```

Defined in: [core/utils/gpu/npu-predict.ts:39](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/gpu/npu-predict.ts#L39)

Which tier scored it — shared GPU.
