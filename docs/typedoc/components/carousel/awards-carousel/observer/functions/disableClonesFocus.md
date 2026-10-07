[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/awards-carousel/observer](../README.md) / disableClonesFocus

```ts
function disableClonesFocus(host): void
```

Defined in: [src/components/carousel/awards-carousel/observer.ts:71](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/carousel/awards-carousel/observer.ts#L71)

Keyboard/AT exclusion for clone slides: they're visual duplicates
that exist only for the loop illusion, so every focusable inside
them is tabindex−1 + aria-hidden — tab order and screen readers
traverse the real slides exactly once.

## Parameters

### host

[`AwardsCarousel`](../../../AwardsCarousel/classes/AwardsCarousel.md)

## Returns

`void`
