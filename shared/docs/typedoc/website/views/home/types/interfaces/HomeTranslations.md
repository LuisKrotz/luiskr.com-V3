[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [website/views/home/types](../README.md) / HomeTranslations

Defined in: [website/views/home/types.ts:24](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/views/home/types.ts#L24)

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

Defined in: [website/views/home/types.ts:25](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/views/home/types.ts#L25)
