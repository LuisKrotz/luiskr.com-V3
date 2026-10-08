[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/wasm/wasm-scroll](../README.md) / wasmSmoothScroll

```ts
function wasmSmoothScroll(options?): void;
```

Defined in: [core/utils/wasm/wasm-scroll.ts:48](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/wasm/wasm-scroll.ts#L48)

Smoothly scrolls a container (or the window) to a target element or
numeric offset. Target resolution order: `element` (bounding rect
relative to the container's scroll origin) → numeric `scrollTo` →
`{y}/{top}` object → 0. Sub-`SCROLL_MIN_DISTANCE` moves early-out —
an invisible scroll would still run a full RAF loop and promote the
compositor layer for nothing. During the animation the scrolled root
gets a GPU compositor promotion (will-change/transform) so the browser
repaints a layer instead of relayouting, then `releaseElementGPU`
restores it on the last frame. `updateHistory` rewrites `#id` via
replaceState so it never pushes a history entry.

## Parameters

### options?

[`WasmScrollOptions`](../interfaces/WasmScrollOptions.md) = `{}`

Container/target/duration configuration.

## Returns

`void`
