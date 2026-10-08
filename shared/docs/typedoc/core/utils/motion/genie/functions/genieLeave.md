[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/motion/genie](../README.md) / genieLeave

```ts
function genieLeave(component, done): void;
```

Defined in: [core/utils/motion/genie.ts:75](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/motion/genie.ts#L75)

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
