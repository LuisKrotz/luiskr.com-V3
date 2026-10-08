[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/media/dimensions](../README.md) / GENERIC\_DIMENSIONS

```ts
const GENERIC_DIMENSIONS: Readonly<{
  DEFAULT_WIDTH: 800;
  DEFAULT_HEIGHT: 450;
  PROFILE_SIZE: 200;
  AWARD_ICON_SIZE: 60;
  ITEM_FALLBACK_HEIGHT: 1200;
}>;
```

Defined in: [core/tokens/media/dimensions.ts:26](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/media/dimensions.ts#L26)

Frozen generic dimension map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
