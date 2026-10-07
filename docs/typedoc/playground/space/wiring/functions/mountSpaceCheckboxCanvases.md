[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [playground/space/wiring](../README.md) / mountSpaceCheckboxCanvases

```ts
function mountSpaceCheckboxCanvases(c): void
```

Defined in: [src/playground/space/wiring.ts:347](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/playground/space/wiring.ts#L347)

Mounts one CheckboxWebGL twin per checkbox canvas: destroys a stale
twin when the canvas element changed identity across a re-render,
creates missing ones, and re-syncs checked state on existing ones.

## Parameters

### c

[`SpacePlayground`](../../../SpacePlayground/classes/SpacePlayground.md)

The SpacePlayground element.

## Returns

`void`
