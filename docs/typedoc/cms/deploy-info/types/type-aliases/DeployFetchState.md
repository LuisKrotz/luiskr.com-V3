[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [cms/deploy-info/types](../README.md) / DeployFetchState

```ts
type DeployFetchState = 'loading' | 'missing' | 'ready'
```

Defined in: [src/cms/deploy-info/types.ts:82](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/deploy-info/types.ts#L82)

Tri-state of the Deploy Info fetch: still `loading`, the bundle
is `missing` (no deploy-info/ in this build), or the index parsed `ready`.
