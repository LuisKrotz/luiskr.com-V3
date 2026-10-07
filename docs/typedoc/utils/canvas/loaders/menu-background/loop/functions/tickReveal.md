[**luiskr.com**](../../../../../../README.md)

---

[luiskr.com](../../../../../../README.md) / [utils/canvas/loaders/menu-background/loop](../README.md) / tickReveal

```ts
function tickReveal(host, now): void
```

Defined in: [src/utils/canvas/loaders/menu-background/loop.ts:90](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/menu-background/loop.ts#L90)

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
