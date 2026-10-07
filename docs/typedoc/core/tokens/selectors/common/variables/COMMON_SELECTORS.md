[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/selectors/common](../README.md) / COMMON\_SELECTORS

```ts
const COMMON_SELECTORS: Readonly<{
  HOST: ':host'
  STYLE: 'style'
  DATA_CONTENT: '[data-content]'
  PREF_THEME_CANVAS: '.pref-theme-canvas'
  BUTTON_OR_ANCHOR: 'button, a'
  MEDIA_ELEMENTS: 'img, video, audio'
  ID_ABOUT: '#about'
  ID_CONTACT: '#contact'
}>
```

Defined in: [src/core/tokens/selectors/common.ts:15](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/selectors/common.ts#L15)

Frozen common selector map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
