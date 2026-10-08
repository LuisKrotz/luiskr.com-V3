[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [core/utils/canvas/loaders/skeleton-webgl](../README.md) / SkeletonWebGL

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:74](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L74)

WebGL skeleton layer: one canvas per component overlays every skeleton
placeholder with a restrained "data decoding" field. Each cell shows a
procedural 0 or 1 glyph that slowly morphs into the other shape while the
colour drifts between the skeleton palette tokens. Text placeholders are
rendered as rows aligned to the real line height so geometry matches the
content that will replace them. When content arrives the layer resolves
(glyphs collapse, layer fades) and the context is destroyed.

Falls back to the CSS shimmer (already on the placeholders) when WebGL is
unavailable: the canvas is simply never attached.

## Constructors

### Constructor

```ts
new SkeletonWebGL(
   host, 
   root, 
   content
): SkeletonWebGL;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:139](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L139)

#### Parameters

##### host

`HTMLElement`

##### root

`ShadowRoot`

##### content

`Element`

#### Returns

`SkeletonWebGL`

## Properties

### host

```ts
host: HTMLElement;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:81](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L81)

Host custom element — the layer positions itself via :host(.has-skeleton-layer).

***

### root

```ts
root: ShadowRoot;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:83](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L83)

Shadow root that owns the canvas — survives content re-renders.

***

### content

```ts
content: Element;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:85](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L85)

Content wrapper holding the placeholders being measured.

***

### canvas

```ts
canvas: HTMLCanvasElement | null = null;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:87](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L87)

Per-layer 2D canvas the shared renderer blits into.

***

### ctx

```ts
ctx: CanvasRenderingContext2D | null = null;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:89](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L89)

The canvas's 2D context — receives the blit each frame.

***

### renderer

```ts
renderer: 
  | SkeletonRenderer
  | null = null;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:91](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L91)

Borrowed shared-renderer handle — null until acquire succeeds.

***

### animId

```ts
animId: number | null = null;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:93](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L93)

rAF handle for the shimmer loop — null while paused/destroyed.

***

### rects

```ts
rects: SkelRect[] = [];
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:95](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L95)

Measured placeholder list — rebuilt by refresh().

***

### rectData

```ts
rectData: Float32Array<ArrayBuffer>;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:97](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L97)

Flat xyzw rect data uploaded as the u_rects uniform array.

***

### metaData

```ts
metaData: Float32Array<ArrayBuffer>;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:99](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L99)

Per-rect metadata (radius/cell/row pad) uploaded as u_meta.

***

### skelBaseData

```ts
skelBaseData: Float32Array<ArrayBuffer>;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:101](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L101)

Per-rect base RGBA uploaded as u_sbase.

***

### skelInkData

```ts
skelInkData: Float32Array<ArrayBuffer>;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:103](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L103)

Per-rect ink RGBA uploaded as u_sink.

***

### base

```ts
base: number[] | null = null;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:105](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L105)

Sampled --skel-bg base palette floats (theme-level default).

***

### ink

```ts
ink: number[] | null = null;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:107](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L107)

Sampled ink/glyph palette floats (theme-level default).

***

### inkAlpha

```ts
inkAlpha: number = 1;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:109](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L109)

Ink opacity multiplier — fades during the resolve-out.

***

### origin

```ts
origin: object;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:111](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L111)

Canvas origin in page coords — rect measurements are relative to it.

#### x

```ts
x: number = 0;
```

#### y

```ts
y: number = 0;
```

***

### dpr

```ts
dpr: number = 1;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:113](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L113)

devicePixelRatio — canvas backing store scales by it.

***

### \_frame

```ts
_frame: number = 0;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:115](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L115)

Frame counter — feeds the glyph-morph phase.

***

### useWebGL

```ts
useWebGL: boolean = false;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:117](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L117)

Whether WebGL mode is live on this layer (webglPool reads this).

***

### resolveStart

```ts
resolveStart: number = 0;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:119](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L119)

performance.now() stamp when the resolve-out began — drives the fade.

***

### startTime

```ts
startTime: number;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:121](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L121)

Loop epoch — u_time is (now − startTime)/1000 so shaders see seconds.

***

### \_ro

```ts
_ro: ResizeObserver | null = null;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:123](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L123)

ResizeObserver on the content wrapper — geometry follows layout.

***

### \_idleId

```ts
_idleId: number | null = null;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:125](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L125)

Deferred init id (requestIdleCallback or setTimeout fallback).

***

### \_refreshId

```ts
_refreshId: number | null = null;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:127](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L127)

Pending refresh rAF — debounces repeated layout churn into one measure.

***

### \_paused

```ts
_paused: boolean = false;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:129](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L129)

Purge latch — restore() early-returns unless a purge happened.

***

### \_observed

```ts
_observed: Set<Element>;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:133](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L133)

Placeholder nodes currently observed for size changes — rebuilt on each measure.

***

### \_styleCache

```ts
_styleCache: WeakMap<Element, SkelStyle>;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:135](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L135)

Per-placeholder computed-style cache — cleared by sampleTheme() on a theme flip.

***

### \_wasDark

```ts
_wasDark: boolean | null = null;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:137](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L137)

Last sampled dark-mode flag — drives the style-cache invalidation.

## Methods

### \_onResize()

```ts
_onResize(): void;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:131](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L131)

Bound resize handler — remeasures placeholder geometry.

#### Returns

`void`

***

### \_init()

```ts
_init(): void;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:150](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L150)

Bootstrap — canvas attach, measure, theme sample, renderer acquire (skeleton/init.ts).

#### Returns

`void`

***

### purge()

```ts
purge(): void;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:161](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L161)

webglPool hook — offscreen: stops the loop AND releases this layer's
shared-renderer reference. Once every layer is offscreen the refcount
hits zero and the shared GL context is disposed entirely — offscreen
skeletons hold no GPU resources.

#### Returns

`void`

***

### restore()

```ts
restore(): void;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:182](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L182)

Re-acquires the shared renderer and resumes the loop after a purge —
the GL context is recreated on demand. If re-acquisition fails the
layer destroys itself; the CSS shimmer stays as the fallback.

#### Returns

`void`

***

### \_parseCssColor()

```ts
_parseCssColor(str): number[] | null;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:207](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L207)

Parses rgb()/hex into normalized 0–1 floats for shader uniforms.

#### Parameters

##### str

`unknown`

Raw CSS color string.

#### Returns

`number`[] \| `null`

[r,g,b,a] floats, or null on unparsable input.

***

### \_sampleTheme()

```ts
_sampleTheme(): void;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:212](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L212)

Reads skeleton theme tokens (--skel-bg-*) into shader colors — see skeleton-theme.ts.

#### Returns

`void`

***

### \_scheduleRefresh()

```ts
_scheduleRefresh(): void;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:220](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L220)

Debounces a geometry re-measure (fonts/layout shifts) — coalesces a
burst of RO/resize callbacks into a single post-layout measure.

#### Returns

`void`

***

### refresh()

```ts
refresh(): void;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:234](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L234)

Re-measures every skeleton placeholder inside the host and resizes the
canvas to the union of their boxes. Call after each render.

#### Returns

`void`

***

### \_upload()

```ts
_upload(): void;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:239](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L239)

Uploads the latest geometry + theme to shader uniforms (skeleton/loop.ts).

#### Returns

`void`

***

### \_loop()

```ts
_loop(): void;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:244](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L244)

rAF callback — animates the shimmer until resolved (skeleton/loop.ts).

#### Returns

`void`

***

### \_render()

```ts
_render(t, resolve): void;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:254](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L254)

Renders one frame via the shared renderer — delegates the actual GL
draw + 2D blit to skeleton/loop.ts.

#### Parameters

##### t

`number`

Animation clock in seconds.

##### resolve

`number`

Resolve-out progress 0–1.

#### Returns

`void`

***

### resolve()

```ts
resolve(): void;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:263](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L263)

Content has arrived: fades the real content in, plays the shimmer
resolve-out animation, then tears down and releases the shared GL
context back to the pool.

#### Returns

`void`

***

### destroy()

```ts
destroy(): void;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:273](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L273)

Releases every acquired resource — rAF loop, resize listener,
ResizeObserver, pending idle/refresh callbacks, pool registration,
shared-renderer ref, and the canvas itself — so nothing references
the layer after the host detaches.

#### Returns

`void`
