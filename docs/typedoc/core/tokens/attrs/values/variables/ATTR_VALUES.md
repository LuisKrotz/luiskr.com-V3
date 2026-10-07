[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/attrs/values](../README.md) / ATTR\_VALUES

```ts
const ATTR_VALUES: Readonly<{
  EMPTY: ''
  TRUE: 'true'
  FALSE: 'false'
  NONE: 'none'
  BLOCK: 'block'
  FLEX: 'flex'
  AUTO: 'auto'
  SMOOTH: 'smooth'
  INSTANT: 'instant'
  DELAY_25: '25'
  NEGATIVE_TABINDEX: '-1'
}>
```

Defined in: [src/core/tokens/attrs/values.ts:11](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/attrs/values.ts#L11)

Generic attribute-value tokens. Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
