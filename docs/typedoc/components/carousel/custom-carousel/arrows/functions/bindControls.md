[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/custom-carousel/arrows](../README.md) / bindControls

```ts
function bindControls(c): void
```

Defined in: [src/components/carousel/custom-carousel/arrows.ts:24](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/carousel/custom-carousel/arrows.ts#L24)

Wires every carousel control: prev/next clicks + hover (hover stops
autoplay permanently — pointer over a control is intent to drive),
dot clicks, and track scroll/swipe. Touch listeners are `passive` so
scroll stays on the compositor thread — the handler only reads
positions and never calls preventDefault.

## Parameters

### c

[`CustomCarousel`](../../../CustomCarousel/classes/CustomCarousel.md)

The CustomCarousel element.

## Returns

`void`
