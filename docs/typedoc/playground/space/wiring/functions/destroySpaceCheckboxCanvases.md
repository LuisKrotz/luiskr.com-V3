[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [playground/space/wiring](../README.md) / destroySpaceCheckboxCanvases

```ts
function destroySpaceCheckboxCanvases(c): void
```

Defined in: [experiments/earth-playground/space/wiring.ts:384](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/experiments/earth-playground/space/wiring.ts#L384)

Tears down every CheckboxWebGL twin — frees their GL contexts via the
shared release path and clears the registry so a remount starts clean.

## Parameters

### c

[`SpacePlayground`](../../../SpacePlayground/classes/SpacePlayground.md)

The SpacePlayground element.

## Returns

`void`
