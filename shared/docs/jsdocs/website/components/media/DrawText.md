# `website/components/media/DrawText.tsx`

&lt;draw-text&gt; — character-staggered text reveal: splits its

| | |
|---|---|
| **Source** | `src/website/components/media/DrawText.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `DrawText`

Draws text.

### `text`

Setter/getter — the text content to animate.

### `delay`

Setter/getter — per-character animation delay in ms.

### `offset`

Setter/getter — start-time offset before the first character.

### `triggerMode`

Setter/getter — how the animation starts (visible/manual/hover).

### `ordered`

Ordered-queue flag — when set, `offset` is a scheduled start on the
shared session clock (document-order cascade) rather than a delay
after this element's own trigger.

### `visible`

Setter/getter — visibility flag used by the auto trigger.

### `_needsCharSpans`

Per-character spans only exist while the animation runs. Before the
element enters the viewport and after the animation has finished the
words are rendered as single nodes: same line breaking, a fraction of
the DOM — long project pages would otherwise mount thousands of char
spans permanently.

### `_updateDom`

Re-renders the shadow DOM for current props.

### `_rootEl`

The animated content element inside the shadow root — cached by _applyContent so repeated queries are free.

### `trigger`

Starts the animation externally (manual trigger mode).

### `reset`

Returns characters to the hidden start state so the animation can replay.

### `_setupTrigger`

Wires the active trigger mode (delegate — ./draw-text/trigger.ts).

### `_setupFit`

Installs the fit-to-width pipeline (delegate — ./draw-text/fit.ts).

### `_startAnimation`

Runs the reveal sequence (delegate — ./draw-text/trigger.ts).

### `_parseTokens`

Tokenizes the text into word/space/br/inline-tag chunks (delegate).

### `_renderContent`

Builds the animated span tree (delegate — ./draw-text/render.ts).
