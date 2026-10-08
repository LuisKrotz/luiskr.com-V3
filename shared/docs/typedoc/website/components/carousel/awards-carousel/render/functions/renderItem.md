[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/awards-carousel/render](../README.md) / renderItem

```ts
function renderItem(host, item): 
  | Element
  | null;
```

Defined in: [website/components/carousel/awards-carousel/render.tsx:29](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/awards-carousel/render.tsx#L29)

JSX for one slide — two shapes by variant: `awards` renders an outbound
link (target=_blank + rel=noopener — external sites get no opener
access, a tabnabbing fix per MDN) with an icon span or `<img>`; the
`selected` variant renders plain content text. `loading=lazy` +
`decoding=async` keep award images off the critical path.

## Parameters

### host

[`AwardsCarousel`](../../../AwardsCarousel/classes/AwardsCarousel.md)

The AwardsCarousel element.

### item

[`CarouselSlide`](../../types/interfaces/CarouselSlide.md) \| `undefined`

Slide data; null-safe (clones render undefined).

## Returns

  \| [`Element`](../../../../../../shared/src/globals/namespaces/JSX/type-aliases/Element.md)
  \| `null`

Slide JSX or null.
