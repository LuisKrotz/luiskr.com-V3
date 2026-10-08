[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/jsx/props](../README.md) / BOOL\_PROPS

```ts
const BOOL_PROPS: Readonly<Set<string>>;
```

Defined in: [core/tokens/jsx/props.ts:13](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/jsx/props.ts#L13)

Boolean attributes — presence means `true`, absence means `false`
(`muted`, `disabled`, `hidden`, `checked`, …). `h()` maps
`prop={true}` → bare attribute + property assignment.
