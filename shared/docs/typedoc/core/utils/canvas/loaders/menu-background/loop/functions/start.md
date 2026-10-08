[**luiskr.com**](../../../../../../../README.md)

***

[luiskr.com](../../../../../../../README.md) / [core/utils/canvas/loaders/menu-background/loop](../README.md) / start

```ts
function start(host): void;
```

Defined in: [core/utils/canvas/loaders/menu-background/loop.ts:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background/loop.ts#L31)

Begins the render loop on menu open: resamples theme inks, sizes the
buffer, attaches the ResizeObserver, and either starts RAF or — under
reduced motion — draws one fully-revealed static frame.

## Parameters

### host

[`MenuBackgroundWebGL`](../../../menu-background-webgl/classes/MenuBackgroundWebGL.md)

## Returns

`void`
