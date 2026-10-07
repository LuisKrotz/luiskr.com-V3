[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/portfolio/related/match](../README.md) / buildProjectsList

```ts
function buildProjectsList(translations, homePortfolio, storage): RelatedCard[]
```

Defined in: [src/components/portfolio/related/match.ts:62](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/portfolio/related/match.ts#L62)

Maps the DB `related.projects` rows into display-ready cards.

URL build: [{locale}/]{basePath}/{cleanLink} — basePath may or may not
arrive slash-prefixed, so the pieces are joined defensively rather
than trusting CMS formatting.

## Parameters

### translations

[`RelatedTranslations`](../../types/interfaces/RelatedTranslations.md)

### homePortfolio

[`HomeItem`](../../types/interfaces/HomeItem.md)[]

### storage

`string`

## Returns

[`RelatedCard`](../../types/interfaces/RelatedCard.md)[]
