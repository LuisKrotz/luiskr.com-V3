[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [playground/space/boot](../README.md) / dismissSpaceLoader

```ts
function dismissSpaceLoader(c): void
```

Defined in: [src/playground/space/boot.ts:87](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/playground/space/boot.ts#L87)

Fades the loader overlay to transparent, then removes it after the CSS
transition completes — removing earlier would clip the fade, removing
never would leave an invisible overlay intercepting pointer events.

## Parameters

### c

[`SpacePlayground`](../../../SpacePlayground/classes/SpacePlayground.md)

The SpacePlayground element.

## Returns

`void`
