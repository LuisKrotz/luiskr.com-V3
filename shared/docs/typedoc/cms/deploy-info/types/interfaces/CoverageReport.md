[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [cms/deploy-info/types](../README.md) / CoverageReport

Defined in: [cms/deploy-info/types.ts:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/deploy-info/types.ts#L31)

Shape of the Jest coverage summary consumed by the Deploy Info tab —
`total` holds per-metric {covered,total,pct} aggregates (statements, branches,
functions, lines).

## Properties

### total?

```ts
optional total?: Record<string, {
  covered?: number;
  total?: number;
  pct?: number;
}>;
```

Defined in: [cms/deploy-info/types.ts:32](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/deploy-info/types.ts#L32)
