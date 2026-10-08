[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [cms/deploy-info/types](../README.md) / ConsoleScanReport

Defined in: [cms/deploy-info/types.ts:72](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/deploy-info/types.ts#L72)

Shape of the console-scan gate output — `ok` is the pass/fail,
`violations` lists each `console.*` callsite found under src/ (file, line,
method) since src is a zero-console zone (AGENTS.md rule 12).

## Properties

### ok?

```ts
optional ok?: boolean;
```

Defined in: [cms/deploy-info/types.ts:73](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/deploy-info/types.ts#L73)

***

### totals?

```ts
optional totals?: Record<string, number>;
```

Defined in: [cms/deploy-info/types.ts:74](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/deploy-info/types.ts#L74)

***

### violations?

```ts
optional violations?: object[];
```

Defined in: [cms/deploy-info/types.ts:75](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/deploy-info/types.ts#L75)

#### file?

```ts
optional file?: string;
```

#### line?

```ts
optional line?: number;
```

#### method?

```ts
optional method?: string;
```
