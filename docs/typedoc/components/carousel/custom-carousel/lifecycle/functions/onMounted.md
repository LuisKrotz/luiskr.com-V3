[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/custom-carousel/lifecycle](../README.md) / onMounted

```ts
function onMounted(host): void
```

Defined in: [src/components/carousel/custom-carousel/lifecycle.ts:18](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/carousel/custom-carousel/lifecycle.ts#L18)

Mount: first render pass, resize binding, fit observer, store sub.
`_markAdjacentLoaded(0)` pre-flags the first neighborhood before the
observer's first callback so slide media starts loading immediately.

## Parameters

### host

[`CustomCarousel`](../../../CustomCarousel/classes/CustomCarousel.md)

## Returns

`void`
