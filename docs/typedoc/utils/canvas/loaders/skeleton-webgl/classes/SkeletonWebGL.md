[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [utils/canvas/loaders/skeleton-webgl](../README.md) / SkeletonWebGL

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:60](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L60)

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

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:99](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L99)

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
host: HTMLElement
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:66](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L66)

#### Param

**host**

The custom element (positioned via :host(.has-skeleton-layer))

#### Param

**root**

Where the canvas lives (survives content re-renders)

#### Param

**content**

The content wrapper that holds the placeholders

---

### root

```ts
root: ShadowRoot
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:67](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L67)

---

### content

```ts
content: Element
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:68](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L68)

---

### canvas

```ts
canvas: HTMLCanvasElement | null = null;
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:69](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L69)

---

### ctx

```ts
ctx: CanvasRenderingContext2D | null = null;
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:70](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L70)

---

### renderer

```ts
renderer:
  | SkeletonRenderer
  | null = null;
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:71](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L71)

---

### animId

```ts
animId: number | null = null;
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:72](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L72)

---

### rects

```ts
rects: SkelRect[] = [];
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:73](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L73)

---

### rectData

```ts
rectData: Float32Array<ArrayBuffer>
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:74](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L74)

---

### metaData

```ts
metaData: Float32Array<ArrayBuffer>
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:75](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L75)

---

### skelBaseData

```ts
skelBaseData: Float32Array<ArrayBuffer>
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:76](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L76)

---

### skelInkData

```ts
skelInkData: Float32Array<ArrayBuffer>
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:77](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L77)

---

### base

```ts
base: number[] | null = null;
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:78](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L78)

---

### ink

```ts
ink: number[] | null = null;
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:79](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L79)

---

### inkAlpha

```ts
inkAlpha: number = 1
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:80](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L80)

---

### origin

```ts
origin: object
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:81](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L81)

#### x

```ts
x: number = 0
```

#### y

```ts
y: number = 0
```

---

### dpr

```ts
dpr: number = 1
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:82](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L82)

---

### \_frame

```ts
_frame: number = 0
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:83](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L83)

---

### useWebGL

```ts
useWebGL: boolean = false
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:84](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L84)

---

### resolveStart

```ts
resolveStart: number = 0
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:85](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L85)

---

### startTime

```ts
startTime: number
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:86](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L86)

---

### \_ro

```ts
_ro: ResizeObserver | null = null;
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:87](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L87)

---

### \_idleId

```ts
_idleId: number | null = null;
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:88](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L88)

---

### \_refreshId

```ts
_refreshId: number | null = null;
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:89](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L89)

---

### \_paused

```ts
_paused: boolean = false
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:90](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L90)

---

### \_observed

```ts
_observed: Set<Element>
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:93](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L93)

Placeholder nodes currently observed for size changes — rebuilt on each measure.

---

### \_styleCache

```ts
_styleCache: WeakMap<Element, SkelStyle>
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:95](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L95)

Per-placeholder computed-style cache — cleared by sampleTheme() on a theme flip.

---

### \_wasDark

```ts
_wasDark: boolean | null = null;
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:97](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L97)

Last sampled dark-mode flag — drives the style-cache invalidation.

## Methods

### \_onResize()

```ts
_onResize(): void;
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:91](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L91)

#### Returns

`void`

---

### \_init()

```ts
_init(): void;
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:109](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L109)

#### Returns

`void`

---

### purge()

```ts
purge(): void;
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:120](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L120)

webglPool hook — offscreen: stops the loop AND releases this layer's
shared-renderer reference. Once every layer is offscreen the refcount
hits zero and the shared GL context is disposed entirely — offscreen
skeletons hold no GPU resources.

#### Returns

`void`

---

### restore()

```ts
restore(): void;
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:141](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L141)

Re-acquires the shared renderer and resumes the loop after a purge —
the GL context is recreated on demand. If re-acquisition fails the
layer destroys itself; the CSS shimmer stays as the fallback.

#### Returns

`void`

---

### \_parseCssColor()

```ts
_parseCssColor(str): number[] | null;
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:163](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L163)

Parses rgb()/hex into normalized floats for shader uniforms.

#### Parameters

##### str

`unknown`

#### Returns

`number`[] \| `null`

---

### \_sampleTheme()

```ts
_sampleTheme(): void;
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:168](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L168)

Reads skeleton theme tokens (--skel-bg-*) into shader colors — see skeleton-theme.ts.

#### Returns

`void`

---

### \_scheduleRefresh()

```ts
_scheduleRefresh(): void;
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:174](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L174)

Debounces a geometry re-measure (fonts/layout shifts).

#### Returns

`void`

---

### refresh()

```ts
refresh(): void;
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:189](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L189)

Re-measures the skeleton DOM rects into the layer's draw list.

#### Returns

`void`

---

### \_upload()

```ts
_upload(): void;
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:195](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L195)

Uploads the latest geometry + theme to shader uniforms.

#### Returns

`void`

---

### \_loop()

```ts
_loop(): void;
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:201](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L201)

rAF callback — animates the shimmer until resolved (see skeleton-loop.ts).

#### Returns

`void`

---

### \_render()

```ts
_render(t, resolve): void;
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:207](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L207)

Renders a frame via the shared renderer.

#### Parameters

##### t

`number`

##### resolve

`number`

#### Returns

`void`

---

### resolve()

```ts
resolve(): void;
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:216](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L216)

Content has arrived: fades the real content in, plays the shimmer
resolve-out animation, then tears down and releases the shared GL
context back to the pool.

#### Returns

`void`

---

### destroy()

```ts
destroy(): void;
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:222](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L222)

Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd.

#### Returns

`void`
