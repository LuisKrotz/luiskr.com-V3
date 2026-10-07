[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/motion/genie](../README.md) / genieLeave

```ts
function genieLeave(component, done): void
```

Defined in: [src/utils/motion/genie.ts:75](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/motion/genie.ts#L75)

Plays the collapse-back-to-origin animation, then runs done() so the
caller can finish unmounting. Instant (done() immediately) under reduced
motion or when the backdrop isn't in the DOM.

## Parameters

### component

`GenieHost`

### done

() => `void`

## Returns

`void`
