[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [cms/deploy-info/types](../README.md) / AxeReport

Defined in: [cms/deploy-info/types.ts:40](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/deploy-info/types.ts#L40)

Shape of the axe-scan report — `engine` names the axe-core version and
`surfaces` lists each mounted DOM surface with its violations (id, impact, help)
so the CMS tab can render them grouped by page area.

## Properties

### engine?

```ts
optional engine?: string;
```

Defined in: [cms/deploy-info/types.ts:41](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/deploy-info/types.ts#L41)

***

### totals?

```ts
optional totals?: Record<string, number>;
```

Defined in: [cms/deploy-info/types.ts:42](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/deploy-info/types.ts#L42)

***

### surfaces?

```ts
optional surfaces?: object[];
```

Defined in: [cms/deploy-info/types.ts:43](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/deploy-info/types.ts#L43)

#### surface

```ts
surface: string;
```

#### violations?

```ts
optional violations?: object[];
```
