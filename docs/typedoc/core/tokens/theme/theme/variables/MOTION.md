[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/theme/theme](../README.md) / MOTION

```ts
const MOTION: Readonly<{
  FULL: 'full'
  REDUCED: 'reduced'
}>
```

Defined in: [src/core/tokens/theme/theme.ts:24](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/theme/theme.ts#L24)

Frozen motion map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
