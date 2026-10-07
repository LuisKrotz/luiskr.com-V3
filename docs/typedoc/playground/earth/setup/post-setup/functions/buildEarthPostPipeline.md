[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [playground/earth/setup/post-setup](../README.md) / buildEarthPostPipeline

```ts
function buildEarthPostPipeline(s, deps): void
```

Defined in: [src/playground/earth/setup/post-setup.ts:81](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/setup/post-setup.ts#L81)

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
