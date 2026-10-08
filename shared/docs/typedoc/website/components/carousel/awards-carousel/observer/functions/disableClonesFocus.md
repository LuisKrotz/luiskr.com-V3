[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/awards-carousel/observer](../README.md) / disableClonesFocus

```ts
function disableClonesFocus(host): void;
```

Defined in: [website/components/carousel/awards-carousel/observer.ts:80](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/awards-carousel/observer.ts#L80)

Keyboard/AT exclusion for clone slides: they're visual duplicates
that exist only for the loop illusion, so every focusable inside
them is tabindex−1 + aria-hidden — tab order and screen readers
traverse the real slides exactly once. Re-run after every render since
clones are re-created with the DOM.

## Parameters

### host

[`AwardsCarousel`](../../../AwardsCarousel/classes/AwardsCarousel.md)

The AwardsCarousel element.

## Returns

`void`
