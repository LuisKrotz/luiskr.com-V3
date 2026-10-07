[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/custom-carousel/render](../README.md) / renderCarouselSlide

```ts
function renderCarouselSlide(item, folder): Element | null
```

Defined in: [src/components/carousel/custom-carousel/render.tsx:57](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/carousel/custom-carousel/render.tsx#L57)

One slide's inner content — a <media-figure> with the item's CDN src
(folder + src), intrinsic size for aspect-ratio layout, and the
expand/video/label flags. Returns null for placeholder entries.
`classes`/`class` are both set — the custom-element attribute and the
rendered class list must match for the Safari CSS path.

## Parameters

### item

[`CarouselItem`](../interfaces/CarouselItem.md) \| `null`

Slide descriptor, or null for empty slots.

### folder

`string`

CDN folder prefix (e.g. 'projectslug/').

## Returns

\| [`Element`](../../../../../globals/namespaces/JSX/type-aliases/Element.md)
\| `null`
