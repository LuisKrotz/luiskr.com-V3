[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/playground/gui-scene](../README.md) / SP\_OCEAN\_DEFAULTS

```ts
const SP_OCEAN_DEFAULTS: Readonly<{
  ROUGHNESS: 0
  METALNESS: 0
}>
```

Defined in: [core/tokens/playground/gui-scene.ts:50](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/tokens/playground/gui-scene.ts#L50)

Frozen sp ocean map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
