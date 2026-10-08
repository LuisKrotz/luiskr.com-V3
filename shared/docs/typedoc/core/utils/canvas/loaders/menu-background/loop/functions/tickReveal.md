[**luiskr.com**](../../../../../../../README.md)

***

[luiskr.com](../../../../../../../README.md) / [core/utils/canvas/loaders/menu-background/loop](../README.md) / tickReveal

```ts
function tickReveal(host, now): void;
```

Defined in: [core/utils/canvas/loaders/menu-background/loop.ts:91](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background/loop.ts#L91)

Advances the reveal ease to the current timestamp. easeOutQuint
(1-(1-p)^5) opens: a fast bloom that settles gently; easeInOutQuart
closes: symmetric gather-and-vanish.

## Parameters

### host

[`MenuBackgroundWebGL`](../../../menu-background-webgl/classes/MenuBackgroundWebGL.md)

### now

`number`

## Returns

`void`
