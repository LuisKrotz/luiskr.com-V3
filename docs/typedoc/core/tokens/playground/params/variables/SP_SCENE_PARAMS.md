[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/playground/params](../README.md) / SP\_SCENE\_PARAMS

```ts
const SP_SCENE_PARAMS: Readonly<{
  EARTH_SPEED: 'earth-speed'
  BUMP_SCALE: 'bump-scale'
  SELF_SHADOW: 'self-shadow'
  SELF_SHADOW_OFFSET: 'self-shadow-offset'
  WATER_METALNESS: 'water-metalness'
  SUN_AUTO_ROTATE: 'sun-auto-rotate'
}>
```

Defined in: [src/core/tokens/playground/params.ts:25](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/playground/params.ts#L25)

Frozen sp scene parameter map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
