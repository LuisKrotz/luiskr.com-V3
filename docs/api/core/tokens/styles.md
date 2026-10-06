# `core/tokens/styles.ts`

BASE_HOST_STYLES — a compiled-in stylesheet injected into

| | |
|---|---|
| **Source** | `src/core/tokens/styles.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `BASE_HOST_STYLES`

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
