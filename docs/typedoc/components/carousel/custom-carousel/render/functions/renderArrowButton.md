[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/custom-carousel/render](../README.md) / renderArrowButton

```ts
function renderArrowButton(direction, lang, circumference): Element
```

Defined in: [src/components/carousel/custom-carousel/render.tsx:83](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/carousel/custom-carousel/render.tsx#L83)

One prev/next control button: a WebGL arrow canvas behind an SVG
autoplay progress ring (stroke-dashoffset driven by the carousel's
_updateRingDom) plus a text glyph fallback. `direction` selects the
modifier class, aria-label and glyph (ARROW_TYPES.PREV/NEXT).

## Parameters

### direction

`string`

### lang

[`CarouselLang`](../interfaces/CarouselLang.md)

### circumference

`number`

## Returns

[`Element`](../../../../../globals/namespaces/JSX/type-aliases/Element.md)
