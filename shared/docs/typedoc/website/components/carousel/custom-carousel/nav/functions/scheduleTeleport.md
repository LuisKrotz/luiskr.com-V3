[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/custom-carousel/nav](../README.md) / scheduleTeleport

```ts
function scheduleTeleport(c, targetIdx): void;
```

Defined in: [website/components/carousel/custom-carousel/nav.ts:187](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/custom-carousel/nav.ts#L187)

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
