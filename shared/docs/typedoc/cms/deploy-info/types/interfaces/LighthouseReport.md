[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [cms/deploy-info/types](../README.md) / LighthouseReport

Defined in: [cms/deploy-info/types.ts:22](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/deploy-info/types.ts#L22)

Shape of the Lighthouse JSON summary — `urls` pairs each audited
URL with its category scores (performance, a11y, best-practices, SEO).

## Properties

### urls?

```ts
optional urls?: object[];
```

Defined in: [cms/deploy-info/types.ts:23](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/deploy-info/types.ts#L23)

#### url

```ts
url: string;
```

#### scores

```ts
scores: Record<string, number>;
```
