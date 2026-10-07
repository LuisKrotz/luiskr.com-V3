[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/jsx/props](../README.md) / JSX\_PROPS

```ts
const JSX_PROPS: Readonly<{
  CLASS_NAME: 'className'
  CLASS: 'class'
  STYLE: 'style'
  REF: 'ref'
  DANGEROUSLY_SET_INNER_HTML: 'dangerouslySetInnerHTML'
  PLAYS_INLINE: 'playsInline'
  PLAYSINLINE_ATTR: 'playsinline'
  ON_PREFIX: 'on'
}>
```

Defined in: [src/core/tokens/jsx/props.ts:68](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/tokens/jsx/props.ts#L68)

Special prop names handled by `h()` before the generic setAttribute
fallback — event prefix detection, ref callbacks, sanitized HTML
injection, and the iOS playsinline quirk.
