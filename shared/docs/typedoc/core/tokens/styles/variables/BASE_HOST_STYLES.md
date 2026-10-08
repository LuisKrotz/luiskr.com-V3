[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/tokens/styles](../README.md) / BASE\_HOST\_STYLES

```ts
const BASE_HOST_STYLES: string;
```

Defined in: [core/tokens/styles.ts:88](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/styles.ts#L88)

The base stylesheet string injected into every component shadow root.
UX notes per rule group:
 - `:host { display:block; font-family/color }` — every component is a
   block-level, correctly-typeset box by default;
 - `skeleton-*` — grey placeholder boxes with a diagonal shimmer
   (::before gradient sweeping left→right every 1.8s) so loading feels
   alive; `color: transparent` hides the reserve-space text;
 - `skeleton-layer` — absolutely-positioned WebGL canvas overlaying the
   placeholders (has-skeleton-layer pauses the CSS shimmer to save paint);
 - `skeleton-content-in` — 0.45s fade when real content lands;
 - reduced-motion — collapses all animation/transition durations to
   ~0ms so motion-sensitive users see instant state changes.
