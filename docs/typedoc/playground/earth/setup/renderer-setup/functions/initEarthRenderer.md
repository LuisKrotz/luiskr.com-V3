[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [playground/earth/setup/renderer-setup](../README.md) / initEarthRenderer

```ts
function initEarthRenderer(s, WebGPURenderer): Promise<boolean>
```

Defined in: [src/playground/earth/setup/renderer-setup.ts:22](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/playground/earth/setup/renderer-setup.ts#L22)

Builds + initializes the renderer on `s`. Probes WebGPU first; a failed
init swaps in a fresh canvas clone (a canvas that failed context
creation is poisoned) and retries with forceWebGL.

## Parameters

### s

[`EarthState`](../../../runtime/state/interfaces/EarthState.md)

### WebGPURenderer

_typeof_ `WebGPURenderer`

## Returns

`Promise`\<`boolean`\>
