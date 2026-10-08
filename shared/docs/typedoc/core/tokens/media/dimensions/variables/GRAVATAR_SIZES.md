[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/media/dimensions](../README.md) / GRAVATAR\_SIZES

```ts
const GRAVATAR_SIZES: Readonly<{
  GRAVATAR_SIZE_1X: 200;
  GRAVATAR_SIZE_2X: 300;
  GRAVATAR_SIZE_3X: 400;
}>;
```

Defined in: [core/tokens/media/dimensions.ts:99](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/media/dimensions.ts#L99)

Frozen gravatar map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
