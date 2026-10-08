[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [playground/earth/runtime/frame](../README.md) / handleEarthResize

```ts
function handleEarthResize(s): void
```

Defined in: [experiments/earth-playground/earth/runtime/frame.ts:38](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/experiments/earth-playground/earth/runtime/frame.ts#L38)

Resize step: measures the shadow host first, then the canvas parent,
then the window — the canvas lives inside SpacePlayground's shadow
root, so clientWidth must come from the host, not the element.
Pixel ratio = min(devicePixelRatio, 2) × resolutionScale — the cap at
2 prevents 3x-phone GPU fill-rate blowout.

## Parameters

### s

[`EarthState`](../../state/interfaces/EarthState.md)

## Returns

`void`
