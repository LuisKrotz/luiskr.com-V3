[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [cms/deploy-info/types](../README.md) / SnykReport

Defined in: [src/cms/deploy-info/types.ts:42](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/cms/deploy-info/types.ts#L42)

The SnykReport value.

## Properties

### scanner?

```ts
optional scanner?: string;
```

Defined in: [src/cms/deploy-info/types.ts:43](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/cms/deploy-info/types.ts#L43)

---

### ok?

```ts
optional ok?: boolean;
```

Defined in: [src/cms/deploy-info/types.ts:44](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/cms/deploy-info/types.ts#L44)

---

### totals?

```ts
optional totals?: Record<string, number>;
```

Defined in: [src/cms/deploy-info/types.ts:45](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/cms/deploy-info/types.ts#L45)

---

### vulnerabilities?

```ts
optional vulnerabilities?: object[];
```

Defined in: [src/cms/deploy-info/types.ts:46](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/cms/deploy-info/types.ts#L46)

#### packageName?

```ts
optional packageName?: string;
```

#### severity?

```ts
optional severity?: string;
```

#### title?

```ts
optional title?: string;
```

#### acceptedRisk?

```ts
optional acceptedRisk?: boolean;
```

#### fixedIn?

```ts
optional fixedIn?: string;
```
