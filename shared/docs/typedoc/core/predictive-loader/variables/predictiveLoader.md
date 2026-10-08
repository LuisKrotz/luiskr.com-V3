[**luiskr.com**](../../../README.md)

***

[luiskr.com](../../../README.md) / [core/predictive-loader](../README.md) / predictiveLoader

```ts
const predictiveLoader: PredictiveLoader;
```

Defined in: [core/predictive-loader.ts:191](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/predictive-loader.ts#L191)

App-wide singleton — constructed at module eval so observation starts as
soon as the bootstrap imports it; the constructor's env guards make that
safe in SSR/test contexts.
