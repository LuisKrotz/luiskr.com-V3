[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/custom-carousel/render](../README.md) / renderCarousel

```ts
function renderCarousel(host): Element;
```

Defined in: [website/components/carousel/custom-carousel/render.tsx:180](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/custom-carousel/render.tsx#L180)

JSX template. Two shapes:
  inactive (≤1 item, or items fit side-by-side) → a plain flex row,
    no track/controls — media is already fully visible
  active → track = [clone-last][items…][clone-first] + controls.
    Clones are aria-hidden + inert — screen readers and tab order see
    only the real slides; the teleport logic uses them for the wrap.
Each control button carries an SVG progress ring (dashoffset driven
by _updateRingDom) behind a WebGL arrow canvas.

## Parameters

### host

[`CustomCarousel`](../../../CustomCarousel/classes/CustomCarousel.md)

The CustomCarousel element.

## Returns

[`Element`](../../../../../../shared/src/globals/namespaces/JSX/type-aliases/Element.md)

JSX — fallback row or the full track+controls shape.
