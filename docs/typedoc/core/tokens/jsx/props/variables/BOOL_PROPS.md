[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/jsx/props](../README.md) / BOOL\_PROPS

```ts
const BOOL_PROPS: Readonly<Set<string>>
```

Defined in: [src/core/tokens/jsx/props.ts:13](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/tokens/jsx/props.ts#L13)

Boolean attributes — presence means `true`, absence means `false`
(`muted`, `disabled`, `hidden`, `checked`, …). `h()` maps
`prop={true}` → bare attribute + property assignment.
