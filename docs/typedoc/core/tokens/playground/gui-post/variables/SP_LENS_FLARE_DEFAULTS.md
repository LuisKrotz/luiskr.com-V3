[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/playground/gui-post](../README.md) / SP\_LENS\_FLARE\_DEFAULTS

```ts
const SP_LENS_FLARE_DEFAULTS: Readonly<{
  ENABLED: true
  INTENSITY: 0.15
}>
```

Defined in: [src/core/tokens/playground/gui-post.ts:25](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/playground/gui-post.ts#L25)

Frozen sp lens flare map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
