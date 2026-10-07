[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/custom-carousel/render](../README.md) / renderCarousel

```ts
function renderCarousel(host): Element
```

Defined in: [src/components/carousel/custom-carousel/render.tsx:159](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/carousel/custom-carousel/render.tsx#L159)

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

## Returns

[`Element`](../../../../../globals/namespaces/JSX/type-aliases/Element.md)
