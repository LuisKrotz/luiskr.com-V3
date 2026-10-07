[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [cms/deploy-info/types](../README.md) / ConsoleScanReport

Defined in: [src/cms/deploy-info/types.ts:72](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/deploy-info/types.ts#L72)

Shape of the console-scan gate output — `ok` is the pass/fail,
`violations` lists each `console.*` callsite found under src/ (file, line,
method) since src is a zero-console zone (AGENTS.md rule 12).

## Properties

### ok?

```ts
optional ok?: boolean;
```

Defined in: [src/cms/deploy-info/types.ts:73](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/deploy-info/types.ts#L73)

---

### totals?

```ts
optional totals?: Record<string, number>;
```

Defined in: [src/cms/deploy-info/types.ts:74](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/deploy-info/types.ts#L74)

---

### violations?

```ts
optional violations?: object[];
```

Defined in: [src/cms/deploy-info/types.ts:75](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/deploy-info/types.ts#L75)

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
