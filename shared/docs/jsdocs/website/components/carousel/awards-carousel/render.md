# `website/components/carousel/awards-carousel/render.tsx`

| | |
|---|---|
| **Source** | `src/website/components/carousel/awards-carousel/render.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `renderItem`

JSX for one slide — two shapes by variant: `awards` renders an outbound
link (target=_blank + rel=noopener — external sites get no opener
access, a tabnabbing fix per MDN) with an icon span or `<img>`; the
`selected` variant renders plain content text. `loading=lazy` +
`decoding=async` keep award images off the critical path.
- `@param` host The AwardsCarousel element.
- `@param` item Slide data; null-safe (clones render undefined).
- `@returns` Slide JSX or null.

### `renderDots`

Dot nav row (awards variant only) — one button per slide; the active
dot gets `aw-c-dot--active`, and each carries an aria-label built from
the localized "go to slide" string + 1-based position.

### `renderCloneSlide`

Clone-ended slide — a visual duplicate of the first/last real slide so
the loop wraps seamlessly. `aria-hidden` + `inert` make it invisible to
AT and unfocusable: it's markup for the eye only; nav.ts teleports to
the real twin once the scroll animation lands on the clone.

### `renderAwardsCarousel`

JSX template for the component's shadow DOM — the track is
`[clone(last)] …real slides… [clone(first)]`; the clone ends are what
make the infinite wrap seamless (see nav.ts). An empty item list still
emits the root wrapper so the element keeps its box for layout.
- `@param` host The AwardsCarousel element.
