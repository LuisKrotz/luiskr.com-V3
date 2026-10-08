# `core/tokens/styles.ts`

BASE_HOST_STYLES — a compiled-in stylesheet injected into

| | |
|---|---|
| **Source** | `src/core/tokens/styles.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `_FOOTER`

'footer' fragment — footers inside skeleton selector composition.

### `_NOTE`

'note' fragment — footnote rows inside skeleton footer selectors.

### `_TITLE`

'title' fragment — heading placeholder variants.

### `_MEDIA`

'media' fragment — media-slot placeholders.

### `_PARA`

'para' fragment — paragraph line placeholders (sized by % width).

### `_D_SKEL`

'.skeleton' — the dotted class selector all skeleton rules descend from.

### `_SKEL_SELECTORS`

Every skeleton placeholder selector, comma-joined — kept as an array so
the ::before twin list below derives by map+join rather than a
hand-maintained second copy that could drift.

### `_SKEL_BEFORE_SELECTORS`

The ::before twins of _SKEL_SELECTORS — the shimmer is painted on a
pseudo-element so it layers above `color:transparent` reserve text but
below injected content. Derived by transform so both lists can never
diverge.

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
