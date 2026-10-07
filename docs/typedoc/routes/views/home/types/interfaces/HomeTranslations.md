[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [routes/views/home/types](../README.md) / HomeTranslations

Defined in: [src/routes/views/home/types.ts:24](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/routes/views/home/types.ts#L24)

The pages/home Firebase node — `portfoliolist` is the project list
(Firebase returns keyed objects or arrays depending on insertion order); other
nodes flow through the index signature.

## Indexable

```ts
[key: string]: unknown
```

## Properties

### portfoliolist?

```ts
optional portfoliolist?:
  | PortfolioItem[]
| Record<string, PortfolioItem>;
```

Defined in: [src/routes/views/home/types.ts:25](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/routes/views/home/types.ts#L25)
