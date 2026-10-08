[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/media/dimensions](../README.md) / NAV\_DIMENSIONS

```ts
const NAV_DIMENSIONS: Readonly<{
  BURGER_CANVAS_SIZE: 68;
}>;
```

Defined in: [core/tokens/media/dimensions.ts:75](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/media/dimensions.ts#L75)

Frozen nav dimension map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
