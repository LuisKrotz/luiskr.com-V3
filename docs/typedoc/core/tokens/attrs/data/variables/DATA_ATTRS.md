[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/attrs/data](../README.md) / DATA\_ATTRS

```ts
const DATA_ATTRS: Readonly<{
  DATA_INDEX: 'data-index'
  DATA_LANG: 'data-lang'
  DATA_FLAG: 'data-flag'
  DATA_SWITCH: 'data-switch'
  DATA_TAB: 'data-tab'
  DATA_IDX: 'data-idx'
  DATA_SEC: 'data-sec'
  DATA_TIDX: 'data-tidx'
  DATA_COL: 'data-col'
  DATA_MIDX: 'data-midx'
  DATA_SIZE: 'data-size'
  DATA_ACTION: 'data-action'
  DATA_FIELD: 'data-field'
  DATA_DIM_IDX: 'data-dim-idx'
  DATA_PROP: 'data-prop'
  DATA_THEME: 'data-theme'
  DATA_CONTENT: 'data-content'
  DATA_CAROUSEL_IDX: 'data-carousel-idx'
  DATA_SEC_IDX: 'data-sec-idx'
  DATA_PARAM: 'data-param'
  DATA_CHECK: 'data-check'
  DATA_APP_WRAPPER: 'data-app-wrapper'
}>
```

Defined in: [src/core/tokens/attrs/data.ts:18](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/attrs/data.ts#L18)

Frozen data attribute-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
