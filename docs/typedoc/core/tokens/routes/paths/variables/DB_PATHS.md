[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/routes/paths](../README.md) / DB\_PATHS

```ts
const DB_PATHS: Readonly<{
  COVERS: 'covers/'
  COMPONENTS: '/components'
  SLUGS: '/slugs'
  COMPONENTS_RELATED: '/components/related'
  COMPONENTS_RELATED_PROJECTS: '/components/related/projects'
  TRANSLATIONS: 'translations/'
  PROJECTS_SEGMENT: 'projects'
  CORE_SEGMENT: 'core'
  PAGES: '/pages/'
  PROJECTS: '/projects/'
}>
```

Defined in: [core/tokens/routes/paths.ts:41](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/tokens/routes/paths.ts#L41)

Frozen db path map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
