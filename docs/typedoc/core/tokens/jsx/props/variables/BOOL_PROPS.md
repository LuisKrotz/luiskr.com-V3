[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/jsx/props](../README.md) / BOOL\_PROPS

```ts
const BOOL_PROPS: Readonly<Set<string>>
```

Defined in: [src/core/tokens/jsx/props.ts:13](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/jsx/props.ts#L13)

Boolean attributes — presence means `true`, absence means `false`
(`muted`, `disabled`, `hidden`, `checked`, …). `h()` maps
`prop={true}` → bare attribute + property assignment.
