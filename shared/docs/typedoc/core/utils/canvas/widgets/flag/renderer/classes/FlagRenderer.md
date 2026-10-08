[**luiskr.com**](../../../../../../../README.md)

***

[luiskr.com](../../../../../../../README.md) / [core/utils/canvas/widgets/flag/renderer](../README.md) / FlagRenderer

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:23](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L23)

One WebGL context for every flag on the page. Each FlagWebGL owns only a
2D canvas; frames are rendered on the shared GL canvas and blitted over.
Textures are decoded once per country code and shared by all instances.
The context and every texture are released when the last flag is
destroyed and recreated on demand when a flag is mounted again.

## Constructors

### Constructor

```ts
new FlagRenderer(): FlagRenderer;
```

#### Returns

`FlagRenderer`

## Properties

### gl

```ts
gl: WebGLRenderingContext | null = null;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:24](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L24)

***

### canvas

```ts
canvas: HTMLCanvasElement | null = null;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:25](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L25)

***

### program

```ts
program: WebGLProgram | null = null;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:26](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L26)

***

### quadBuffer

```ts
quadBuffer: WebGLBuffer | null = null;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:27](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L27)

***

### textures

```ts
textures: Map<string, WebGLTexture>;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:28](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L28)

***

### images

```ts
images: Map<string, HTMLImageElement>;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:29](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L29)

***

### bitmaps

```ts
bitmaps: Map<string, ImageBitmap>;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L31)

Worker-decoded flag bitmaps (WASM pool) — preferred texImage2D source.

***

### \_bitmapPending

```ts
_bitmapPending: Set<string>;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:33](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L33)

Country codes with an in-flight worker decode — dedupes kickWasmDecode.

***

### refs

```ts
refs: number = 0;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:34](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L34)

***

### lost

```ts
lost: boolean = false;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:35](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L35)

***

### aPos

```ts
aPos: number = 0;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:36](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L36)

***

### uResolution

```ts
uResolution: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:37](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L37)

***

### uTime

```ts
uTime: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:38](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L38)

***

### uHover

```ts
uHover: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:39](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L39)

***

### uAnimType

```ts
uAnimType: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:40](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L40)

***

### uIsSplit

```ts
uIsSplit: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:41](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L41)

***

### uSplitX

```ts
uSplitX: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:42](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L42)

***

### uTex1

```ts
uTex1: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:43](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L43)

***

### uTex2

```ts
uTex2: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:44](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L44)

## Methods

### acquire()

```ts
acquire(): FlagRenderer | null;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:48](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L48)

Borrows (and lazily creates) the shared GL context.

#### Returns

`FlagRenderer` \| `null`

***

### release()

```ts
release(): void;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:66](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L66)

Returns the shared context to the pool, disposing when refcount hits zero.

#### Returns

`void`

***

### \_init()

```ts
_init(): void;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:74](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L74)

Creates the GL context, flag shaders and textures.

#### Returns

`void`

***

### \_dispose()

```ts
_dispose(): void;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:80](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L80)

Frees GL program, textures and buffers.

#### Returns

`void`

***

### image()

```ts
image(cc): HTMLImageElement;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:91](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L91)

Builds (once) and caches the flag's composited <img> for country code
cc — composite means the base flag plus any overlays (e.g. the EU
circle for split-locale flags) baked into one source image.

#### Parameters

##### cc

`string`

#### Returns

`HTMLImageElement`

***

### texture()

```ts
texture(cc): WebGLTexture | null;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:97](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L97)

Builds/caches the GL texture for the flag image.

#### Parameters

##### cc

`string`

#### Returns

`WebGLTexture` \| `null`

***

### draw()

```ts
draw(flag, time): boolean;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:106](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L106)

Renders one wave-shader frame for a flag (or its split pair for dual
flags like en-GB/en-US hybrids) onto the shared canvas, then blits
the result to the flag's own 2D canvas at time t.

#### Parameters

##### flag

[`FlagWebGL`](../../../flag-webgl/classes/FlagWebGL.md)

##### time

`number`

#### Returns

`boolean`

***

### \_initProgram()

```ts
_initProgram(gl): boolean;
```

Defined in: [core/utils/canvas/widgets/flag/renderer.ts:112](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/renderer.ts#L112)

Compiles the wave vertex/fragment shaders and resolves uniform locations.

#### Parameters

##### gl

`WebGLRenderingContext`

#### Returns

`boolean`
