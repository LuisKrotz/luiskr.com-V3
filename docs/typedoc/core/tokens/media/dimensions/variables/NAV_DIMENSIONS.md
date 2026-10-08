[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/media/dimensions](../README.md) / NAV\_DIMENSIONS

```ts
const NAV_DIMENSIONS: Readonly<{
  BURGER_CANVAS_SIZE: 68
}>
```

Defined in: [core/tokens/media/dimensions.ts:75](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/tokens/media/dimensions.ts#L75)

Frozen nav dimension map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
