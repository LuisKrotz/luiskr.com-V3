[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [core/predictive-loader](../README.md) / predictiveLoader

```ts
const predictiveLoader: PredictiveLoader
```

Defined in: [core/predictive-loader.ts:191](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/predictive-loader.ts#L191)

App-wide singleton — constructed at module eval so observation starts as
soon as the bootstrap imports it; the constructor's env guards make that
safe in SSR/test contexts.
