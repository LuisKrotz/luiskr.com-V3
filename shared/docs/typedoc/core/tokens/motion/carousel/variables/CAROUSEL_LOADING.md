[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/motion/carousel](../README.md) / CAROUSEL\_LOADING

```ts
const CAROUSEL_LOADING: Readonly<{
  EAGER_COUNT: 2;
  BATCH_SIZE: 2;
  DEFERRED_TIMEOUT: 250;
}>;
```

Defined in: [core/tokens/motion/carousel.ts:87](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/motion/carousel.ts#L87)

Frozen carousel map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
