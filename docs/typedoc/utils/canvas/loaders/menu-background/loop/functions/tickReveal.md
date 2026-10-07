[**luiskr.com**](../../../../../../README.md)

---

[luiskr.com](../../../../../../README.md) / [utils/canvas/loaders/menu-background/loop](../README.md) / tickReveal

```ts
function tickReveal(host, now): void
```

Defined in: [src/utils/canvas/loaders/menu-background/loop.ts:91](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/canvas/loaders/menu-background/loop.ts#L91)

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
