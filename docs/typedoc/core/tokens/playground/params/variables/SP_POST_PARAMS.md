[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/playground/params](../README.md) / SP\_POST\_PARAMS

```ts
const SP_POST_PARAMS: Readonly<{
  BLOOM: 'bloom'
  BLOOM_STRENGTH: 'bloom-strength'
  BLOOM_RADIUS: 'bloom-radius'
  BLOOM_THRESHOLD: 'bloom-threshold'
  VIGNETTE: 'vignette'
  VIGNETTE_DARKNESS: 'vignette-darkness'
  VIGNETTE_OFFSET: 'vignette-offset'
  CHROMATIC: 'chromatic'
  CA_STRENGTH: 'ca-strength'
  FILM_GRAIN: 'film-grain'
}>
```

Defined in: [src/core/tokens/playground/params.ts:39](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/playground/params.ts#L39)

Frozen sp post parameter map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
