[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [cms/tokens](../README.md) / CMS\_TABS

```ts
const CMS_TABS: Readonly<{
  PORTFOLIO: 'portfolio'
  PROJECTS: 'projects'
  ABOUT: 'about'
  FOOTER: 'footer'
  PLAYGROUND: 'playground'
  LANGUAGES: 'languages'
  MEDIA: 'media'
  DEPLOY: 'deploy'
}>
```

Defined in: [src/cms/tokens.ts:26](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/tokens.ts#L26)

Frozen cms map — sole declaration site for these tokens; consumers read members and never
re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token contract
immutable at runtime.
