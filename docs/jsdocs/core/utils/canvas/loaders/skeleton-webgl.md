# `core/utils/canvas/loaders/skeleton-webgl.ts`

WebGL skeleton/shimmer layer for loading states: a shared

| | |
|---|---|
| **Source** | `src/core/utils/canvas/loaders/skeleton-webgl.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

Per-placeholder computed style, cached between measures (cleared on theme flip).

### `lineHeight`

Computed line-height — text placeholders tile glyph rows against it.

### `radius`

Computed border-radius — forwarded to the shader's corner rounding.

### `textLike`

Whether this placeholder is a text line (vs a media block).

### `baseStr`

Raw CSS color string for the base fill — parsed lazily.

### `inkStr`

Raw CSS color string for the ink/glyph color — parsed lazily.

### (module scope)

One measured placeholder: geometry (CSS px) + sampled palette for the shader.

### `x`

Left edge relative to the layer canvas origin.

### `y`

Top edge relative to the layer canvas origin.

### `w`

Box width in CSS px.

### `h`

Box height in CSS px.

### `radius`

Corner radius in CSS px — matches the placeholder's own border-radius.

### `cell`

Glyph cell size driving the procedural 0/1 grid density.

### `row`

Row index within a text placeholder (0 for media blocks).

### `base`

Parsed [r,g,b,a] base fill 0–1 floats for the u_sbase uniform array.

### `ink`

Parsed [r,g,b,a] ink/glyph floats for the u_sink uniform array.

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

### (module scope)

- `@param` {HTMLElement} host   The custom element (positioned via :host(.has-skeleton-layer))
- `@param` {ShadowRoot} root    Where the canvas lives (survives content re-renders)
- `@param` {Element} content    The content wrapper that holds the placeholders

### `root`

Shadow root that owns the canvas — survives content re-renders.

### `content`

Content wrapper holding the placeholders being measured.

### `canvas`

Per-layer 2D canvas the shared renderer blits into.

### `ctx`

The canvas's 2D context — receives the blit each frame.

### `renderer`

Borrowed shared-renderer handle — null until acquire succeeds.

### `animId`

rAF handle for the shimmer loop — null while paused/destroyed.

### `rects`

Measured placeholder list — rebuilt by refresh().

### `rectData`

Flat xyzw rect data uploaded as the u_rects uniform array.

### `metaData`

Per-rect metadata (radius/cell/row pad) uploaded as u_meta.

### `skelBaseData`

Per-rect base RGBA uploaded as u_sbase.

### `skelInkData`

Per-rect ink RGBA uploaded as u_sink.

### `base`

Sampled --skel-bg base palette floats (theme-level default).

### `ink`

Sampled ink/glyph palette floats (theme-level default).

### `inkAlpha`

Ink opacity multiplier — fades during the resolve-out.

### `origin`

Canvas origin in page coords — rect measurements are relative to it.

### `dpr`

devicePixelRatio — canvas backing store scales by it.

### `_frame`

Frame counter — feeds the glyph-morph phase.

### `useWebGL`

Whether WebGL mode is live on this layer (webglPool reads this).

### `resolveStart`

performance.now() stamp when the resolve-out began — drives the fade.

### `startTime`

Loop epoch — u_time is (now − startTime)/1000 so shaders see seconds.

### `_ro`

ResizeObserver on the content wrapper — geometry follows layout.

### `_idleId`

Deferred init id (requestIdleCallback or setTimeout fallback).

### `_refreshId`

Pending refresh rAF — debounces repeated layout churn into one measure.

### `_paused`

Purge latch — restore() early-returns unless a purge happened.

### `_onResize`

Bound resize handler — remeasures placeholder geometry.

### `_observed`

Placeholder nodes currently observed for size changes — rebuilt on each measure.

### `_styleCache`

Per-placeholder computed-style cache — cleared by sampleTheme() on a theme flip.

### `_wasDark`

Last sampled dark-mode flag — drives the style-cache invalidation.

### `_init`

Bootstrap — canvas attach, measure, theme sample, renderer acquire (skeleton/init.ts).

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

Parses rgb()/hex into normalized 0–1 floats for shader uniforms.
- `@param` str Raw CSS color string.
- `@returns` [r,g,b,a] floats, or null on unparsable input.

### `_sampleTheme`

Reads skeleton theme tokens (--skel-bg-*) into shader colors — see skeleton-theme.ts.

### `_scheduleRefresh`

Debounces a geometry re-measure (fonts/layout shifts) — coalesces a
burst of RO/resize callbacks into a single post-layout measure.

### `refresh`

Re-measures every skeleton placeholder inside the host and resizes the
canvas to the union of their boxes. Call after each render.

### `_upload`

Uploads the latest geometry + theme to shader uniforms (skeleton/loop.ts).

### `_loop`

rAF callback — animates the shimmer until resolved (skeleton/loop.ts).

### `_render`

Renders one frame via the shared renderer — delegates the actual GL
draw + 2D blit to skeleton/loop.ts.
- `@param` t Animation clock in seconds.
- `@param` resolve Resolve-out progress 0–1.

### `resolve`

Content has arrived: fades the real content in, plays the shimmer
resolve-out animation, then tears down and releases the shared GL
context back to the pool.

### `destroy`

Releases every acquired resource — rAF loop, resize listener,
ResizeObserver, pending idle/refresh callbacks, pool registration,
shared-renderer ref, and the canvas itself — so nothing references
the layer after the host detaches.

### `syncSkeletonLayer`

Keeps a component's skeleton layer in sync with its rendered content.
Call from onUpdated()/onMounted(): creates the layer while skeleton nodes
exist, re-measures after every render, resolves it once they are gone.
- `@param` component The host component whose content is being watched.

### `destroySkeletonLayer`

Component-unmount teardown — destroys the layer immediately (no
resolve-out: the host is going away, so a fade would never be seen) and
clears the component's reference.
- `@param` component The host component being unmounted.
