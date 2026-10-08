[**luiskr.com**](../../../../../../../README.md)

***

[luiskr.com](../../../../../../../README.md) / [core/utils/canvas/loaders/skeleton/renderer](../README.md) / SkeletonRenderer

Defined in: [core/utils/canvas/loaders/skeleton/renderer.ts:27](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton/renderer.ts#L27)

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

Defined in: [core/utils/canvas/loaders/skeleton/renderer.ts:29](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton/renderer.ts#L29)

The shared GL context — null before init, after loss, or after dispose.

***

### canvas

```ts
canvas: HTMLCanvasElement | null = null;
```

Defined in: [core/utils/canvas/loaders/skeleton/renderer.ts:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton/renderer.ts#L31)

The offscreen GL canvas frames are drawn on (grown to the largest layer).

***

### program

```ts
program: WebGLProgram | null = null;
```

Defined in: [core/utils/canvas/loaders/skeleton/renderer.ts:33](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton/renderer.ts#L33)

Compiled shimmer program (SKELETON_VS/SKELETON_FS).

***

### quadBuffer

```ts
quadBuffer: WebGLBuffer | null = null;
```

Defined in: [core/utils/canvas/loaders/skeleton/renderer.ts:35](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton/renderer.ts#L35)

Quad vertex buffer bound for every draw.

***

### u

```ts
u: Record<string, WebGLUniformLocation | null> = {};
```

Defined in: [core/utils/canvas/loaders/skeleton/renderer.ts:37](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton/renderer.ts#L37)

Resolved uniform locations keyed by logical name.

***

### refs

```ts
refs: number = 0;
```

Defined in: [core/utils/canvas/loaders/skeleton/renderer.ts:39](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton/renderer.ts#L39)

Live borrowers — the context is disposed when this reaches zero.

***

### lost

```ts
lost: boolean = false;
```

Defined in: [core/utils/canvas/loaders/skeleton/renderer.ts:41](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton/renderer.ts#L41)

Sticky "context is gone" flag — acquire() stops retrying after loss.

## Methods

### acquire()

```ts
acquire(): SkeletonRenderer | null;
```

Defined in: [core/utils/canvas/loaders/skeleton/renderer.ts:49](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton/renderer.ts#L49)

Borrows (and lazily creates) the shared GL context. Refcount +1 on
success; a failed init hands the ref back so the count still reaches
zero and disposal stays reachable. Returns null when GL is
unavailable/lost — the layer keeps its CSS fallback.

#### Returns

`SkeletonRenderer` \| `null`

***

### release()

```ts
release(): void;
```

Defined in: [core/utils/canvas/loaders/skeleton/renderer.ts:70](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton/renderer.ts#L70)

Returns the shared context to the pool, disposing at refcount zero —
the last layer dropping out frees the GL context entirely (browsers
cap ~16 live contexts).

#### Returns

`void`

***

### \_init()

```ts
_init(): void;
```

Defined in: [core/utils/canvas/loaders/skeleton/renderer.ts:82](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton/renderer.ts#L82)

Creates the shared canvas + GL context, wires context-loss handling,
and compiles the shimmer program. Aborts (leaving `gl` null) when the
context can't be created, is software-rendered, or the shaders fail —
each failure self-releases the context so nothing leaks.

#### Returns

`void`

***

### \_isSoftwareRenderer()

```ts
_isSoftwareRenderer(gl): boolean;
```

Defined in: [core/utils/canvas/loaders/skeleton/renderer.ts:142](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton/renderer.ts#L142)

Detects CPU rasterizers (SwiftShader/llvmpipe) via the unmasked
renderer string — software GL pays per-frame CPU cost, so those take
the CSS fallback instead.

#### Parameters

##### gl

`WebGLRenderingContext`

The just-acquired context.

#### Returns

`boolean`

true when the renderer matches SKELETON_WARN.SOFTWARE_RENDERERS.

***

### \_dispose()

```ts
_dispose(): void;
```

Defined in: [core/utils/canvas/loaders/skeleton/renderer.ts:162](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton/renderer.ts#L162)

Frees the GL program + quad buffer and force-loses the context so the
browser's context budget is returned immediately (deleteProgram alone
leaves the context alive). Resets `lost` so a later acquire can retry
on a fresh canvas.

#### Returns

`void`

***

### draw()

```ts
draw(
   layer, 
   t, 
   resolve
): boolean;
```

Defined in: [core/utils/canvas/loaders/skeleton/renderer.ts:195](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton/renderer.ts#L195)

Renders one shimmer frame for a skeleton layer on the shared offscreen
canvas at time t, then blits the result onto the layer's own canvas —
`resolve` ∈ [0,1] cross-fades the shimmer into the "decoded" look.
The shared canvas only ever grows (never shrinks), so per-frame draws
don't thrash GPU allocations; the scissor box limits the draw to the
layer's w×h corner (GL origin is bottom-left — hence the
canvas.height−h blit offset).

#### Parameters

##### layer

[`SkeletonWebGL`](../../../skeleton-webgl/classes/SkeletonWebGL.md)

The skeleton layer requesting the frame.

##### t

`number`

Animation clock in seconds — feeds u_time.

##### resolve

`number`

Content-arrival cross-fade 0→1.

#### Returns

`boolean`

false when GL/layer canvas is missing (caller skips the frame).

***

### \_initProgram()

```ts
_initProgram(gl): boolean;
```

Defined in: [core/utils/canvas/loaders/skeleton/renderer.ts:263](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton/renderer.ts#L263)

Compiles the shimmer shaders and resolves every uniform location up
front — getUniformLocation during draw would cost a driver round-trip
per frame. A compile/link failure returns false so _init can release
the context instead of leaving a broken half-pipeline.

#### Parameters

##### gl

`WebGLRenderingContext`

The live shared context.

#### Returns

`boolean`

true when the program is bound and uniforms resolved.
