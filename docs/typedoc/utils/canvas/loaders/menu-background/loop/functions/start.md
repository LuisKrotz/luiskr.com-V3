[**luiskr.com**](../../../../../../README.md)

---

[luiskr.com](../../../../../../README.md) / [utils/canvas/loaders/menu-background/loop](../README.md) / start

```ts
function start(host): void
```

Defined in: [src/utils/canvas/loaders/menu-background/loop.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/menu-background/loop.ts#L30)

Begins the render loop on menu open: resamples theme inks, sizes the
buffer, attaches the ResizeObserver, and either starts RAF or — under
reduced motion — draws one fully-revealed static frame.

## Parameters

### host

[`MenuBackgroundWebGL`](../../../menu-background-webgl/classes/MenuBackgroundWebGL.md)

## Returns

`void`
