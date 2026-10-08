[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/jsx/props](../README.md) / JSX\_METADATA\_PROPS

```ts
const JSX_METADATA_PROPS: Readonly<Set<string>>;
```

Defined in: [core/tokens/jsx/props.ts:61](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/jsx/props.ts#L61)

Compiler-only JSX metadata. OXC/Babel may inject these in development
transforms; they describe source locations/runtime ownership and must never
leak into rendered HTML as `"[object Object]"` attributes.
