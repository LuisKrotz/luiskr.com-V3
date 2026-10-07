[**luiskr.com**](../../../../../../README.md)

---

[luiskr.com](../../../../../../README.md) / [utils/canvas/loaders/skeleton/renderer](../README.md) / SkeletonRenderer

Defined in: [src/utils/canvas/loaders/skeleton/renderer.ts:26](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton/renderer.ts#L26)

Single shared WebGL context for every skeleton layer on the page. Layers
own a cheap 2D canvas; each frame is drawn on the shared GL canvas (grown
to the largest live layer, never reallocated per frame) and blitted over.
Released when the last layer is destroyed, recreated on demand.

## Constructors

### Constructor

```ts
new SkeletonRenderer(): SkeletonRenderer;
```

#### Returns

`SkeletonRenderer`

## Properties

### gl

```ts
gl: WebGLRenderingContext | null = null;
```

Defined in: [src/utils/canvas/loaders/skeleton/renderer.ts:27](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton/renderer.ts#L27)

---

### canvas

```ts
canvas: HTMLCanvasElement | null = null;
```

Defined in: [src/utils/canvas/loaders/skeleton/renderer.ts:28](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton/renderer.ts#L28)

---

### program

```ts
program: WebGLProgram | null = null;
```

Defined in: [src/utils/canvas/loaders/skeleton/renderer.ts:29](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton/renderer.ts#L29)

---

### quadBuffer

```ts
quadBuffer: WebGLBuffer | null = null;
```

Defined in: [src/utils/canvas/loaders/skeleton/renderer.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton/renderer.ts#L30)

---

### u

```ts
u: Record<string, WebGLUniformLocation | null> = {}
```

Defined in: [src/utils/canvas/loaders/skeleton/renderer.ts:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton/renderer.ts#L31)

---

### refs

```ts
refs: number = 0
```

Defined in: [src/utils/canvas/loaders/skeleton/renderer.ts:32](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton/renderer.ts#L32)

---

### lost

```ts
lost: boolean = false
```

Defined in: [src/utils/canvas/loaders/skeleton/renderer.ts:33](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton/renderer.ts#L33)

## Methods

### acquire()

```ts
acquire(): SkeletonRenderer | null;
```

Defined in: [src/utils/canvas/loaders/skeleton/renderer.ts:36](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton/renderer.ts#L36)

Borrows (and lazily creates) the shared GL context.

#### Returns

`SkeletonRenderer` \| `null`

---

### release()

```ts
release(): void;
```

Defined in: [src/utils/canvas/loaders/skeleton/renderer.ts:54](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton/renderer.ts#L54)

Returns the shared context to the pool, disposing at refcount zero.

#### Returns

`void`

---

### \_init()

```ts
_init(): void;
```

Defined in: [src/utils/canvas/loaders/skeleton/renderer.ts:62](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton/renderer.ts#L62)

Sizes the canvas over the host and binds the shared renderer.

#### Returns

`void`

---

### \_isSoftwareRenderer()

```ts
_isSoftwareRenderer(gl): boolean;
```

Defined in: [src/utils/canvas/loaders/skeleton/renderer.ts:117](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton/renderer.ts#L117)

Detects CPU rasterizers (SwiftShader/llvmpipe) — those take the CSS fallback.

#### Parameters

##### gl

`WebGLRenderingContext`

#### Returns

`boolean`

---

### \_dispose()

```ts
_dispose(): void;
```

Defined in: [src/utils/canvas/loaders/skeleton/renderer.ts:133](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton/renderer.ts#L133)

Frees GL program, textures and buffers.

#### Returns

`void`

---

### draw()

```ts
draw(
   layer,
   t,
   resolve
): boolean;
```

Defined in: [src/utils/canvas/loaders/skeleton/renderer.ts:158](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton/renderer.ts#L158)

Renders one shimmer frame for a skeleton layer on the shared offscreen
canvas at time t, then blits the result onto the layer's own canvas —
`resolve` ∈ [0,1] cross-fades the shimmer into the "decoded" look.

#### Parameters

##### layer

[`SkeletonWebGL`](../../../skeleton-webgl/classes/SkeletonWebGL.md)

##### t

`number`

##### resolve

`number`

#### Returns

`boolean`

---

### \_initProgram()

```ts
_initProgram(gl): boolean;
```

Defined in: [src/utils/canvas/loaders/skeleton/renderer.ts:220](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton/renderer.ts#L220)

Compiles the shimmer shaders + resolves uniforms.

#### Parameters

##### gl

`WebGLRenderingContext`

#### Returns

`boolean`
