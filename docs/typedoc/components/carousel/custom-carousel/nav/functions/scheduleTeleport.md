[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/custom-carousel/nav](../README.md) / scheduleTeleport

```ts
function scheduleTeleport(c, targetIdx): void
```

Defined in: [src/components/carousel/custom-carousel/nav.ts:187](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/carousel/custom-carousel/nav.ts#L187)

Schedules the clone→real teleport: after TELEPORT_DELAY (just past the
smooth-scroll duration so the clone finishes animating in), instant-jump
to the identical real slide — invisible. Any pending teleport is
cancelled first so rapid nav can't queue competing jumps.

## Parameters

### c

[`CustomCarousel`](../../../CustomCarousel/classes/CustomCarousel.md)

The CustomCarousel element.

### targetIdx

`number`

Real-slide index to land on.

## Returns

`void`
