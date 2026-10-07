[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/custom-carousel/render](../README.md) / renderCarouselSlide

```ts
function renderCarouselSlide(item, folder): Element | null
```

Defined in: [src/components/carousel/custom-carousel/render.tsx:42](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/carousel/custom-carousel/render.tsx#L42)

One slide's inner content — a <media-figure> with the item's CDN src
(folder + src), intrinsic size for aspect-ratio layout, and the
expand/video/label flags. Returns null for placeholder entries.

## Parameters

### item

[`CarouselItem`](../interfaces/CarouselItem.md) \| `null`

### folder

`string`

## Returns

\| [`Element`](../../../../../globals/namespaces/JSX/type-aliases/Element.md)
\| `null`
