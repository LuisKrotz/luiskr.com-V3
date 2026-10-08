[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [playground/earth/setup/post-setup](../README.md) / buildEarthPostPipeline

```ts
function buildEarthPostPipeline(s, deps): void
```

Defined in: [experiments/earth-playground/earth/setup/post-setup.ts:81](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/experiments/earth-playground/earth/setup/post-setup.ts#L81)

Assembles the RenderPipeline post chain (screen-space, in order):
scene → CA fringe → +bloom → color grade → vignette → film grain
CA is applied before bloom so the halo isn't itself fringed.

## Parameters

### s

[`EarthState`](../../../runtime/state/interfaces/EarthState.md)

### deps

[`EarthPostDeps`](../interfaces/EarthPostDeps.md)

## Returns

`void`
