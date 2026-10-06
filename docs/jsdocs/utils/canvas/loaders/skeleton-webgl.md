# `utils/canvas/loaders/skeleton-webgl.ts`

WebGL skeleton/shimmer layer for loading states: a shared

| | |
|---|---|
| **Source** | `src/utils/canvas/loaders/skeleton-webgl.ts` |
| **UX surface** | WebGL micro-widgets with Canvas2D fallback — nav, sliders, arrows. |

## Members

### (module scope)

One measured placeholder: geometry (CSS px) + sampled palette for the shader.

### `SkeletonWebGL`

WebGL skeleton layer: one canvas per component overlays every skeleton
placeholder with a restrained "data decoding" field. Each cell shows a
procedural 0 or 1 glyph that slowly morphs into the other shape while the
colour drifts between the skeleton palette tokens. Text placeholders are
rendered as rows aligned to the real line height so geometry matches the
content that will replace them. When content arrives the layer resolves
(glyphs collapse, layer fades) and the context is destroyed.

Falls back to the CSS shimmer (already on the placeholders) when WebGL is
unavailable: the canvas is simply never attached.

### `host`

- `@param` {HTMLElement} host   The custom element (positioned via :host(.has-skeleton-layer))
- `@param` {ShadowRoot} root    Where the canvas lives (survives content re-renders)
- `@param` {Element} content    The content wrapper that holds the placeholders

### `purge`

webglPool hook — offscreen: stops the loop AND releases this layer's
shared-renderer reference. Once every layer is offscreen the refcount
hits zero and the shared GL context is disposed entirely — offscreen
skeletons hold no GPU resources.

### `restore`

Re-acquires the shared renderer and resumes the loop after a purge —
the GL context is recreated on demand. If re-acquisition fails the
layer destroys itself; the CSS shimmer stays as the fallback.

### `_parseCssColor`

Parses rgb()/hex into normalized floats for shader uniforms.

### `_sampleTheme`

Reads skeleton theme tokens (--skel-bg-*) into shader colors — see skeleton-theme.ts.

### `_scheduleRefresh`

Debounces a geometry re-measure (fonts/layout shifts).

### (module scope)

Re-measures every skeleton placeholder inside the host and resizes the
canvas to the union of their boxes. Call after each render.

### `_upload`

Uploads the latest geometry + theme to shader uniforms.

### `_loop`

rAF callback — animates the shimmer until resolved (see skeleton-loop.ts).

### `_render`

Renders a frame via the shared renderer.

### `resolve`

Content has arrived: fades the real content in, plays the shimmer
resolve-out animation, then tears down and releases the shared GL
context back to the pool.

### `destroy`

Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd.

### `syncSkeletonLayer`

Keeps a component's skeleton layer in sync with its rendered content.
Call from onUpdated()/onMounted(): creates the layer while skeleton nodes
exist, re-measures after every render, resolves it once they are gone.

### `destroySkeletonLayer`

The destroySkeletonLayer constant.
- `@param` component — the value
