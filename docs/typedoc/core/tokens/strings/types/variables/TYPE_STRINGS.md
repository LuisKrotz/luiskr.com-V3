[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/strings/types](../README.md) / TYPE\_STRINGS

```ts
const TYPE_STRINGS: Readonly<{
  UNDEFINED: 'undefined'
  FUNCTION: 'function'
  OBJECT: 'object'
  STRING: 'string'
  BOOLEAN: 'boolean'
  NUMBER: 'number'
}>
```

Defined in: [src/core/tokens/strings/types.ts:11](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/strings/types.ts#L11)

`typeof` result string tokens. Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
