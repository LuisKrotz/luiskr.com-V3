[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [playground/earth/runtime/state](../README.md) / createEarthState

```ts
function createEarthState(canvas, onReady, onProgress): EarthState
```

Defined in: [src/playground/earth/runtime/state.ts:168](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/playground/earth/runtime/state.ts#L168)

Builds the initial null-everything state bag — every GPU handle starts
null so bootstrap can fill them in any order and dispose can skip
whatever never got created.

## Parameters

### canvas

`HTMLCanvasElement`

The target canvas element.

### onReady

(() => `void`) \| `undefined`

Callback once the scene is first rendered.

### onProgress

[`EarthProgressFn`](../type-aliases/EarthProgressFn.md) \| `undefined`

Boot progress reporter.

## Returns

[`EarthState`](../interfaces/EarthState.md)

The zeroed state bag.
