[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [core/utils/canvas/widgets/close-button](../README.md) / CloseButtonWebGL

Defined in: [core/utils/canvas/widgets/close-button.ts:29](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L29)

WebGL Animated Close Button
Features:
- Liquid fills slower and procedural rising bubbles with specular highlights
- Rotating X during hover/liquid animation
- Razor-sharp vector anti-aliased X line strokes (zero blur)
- Kinetic shockwave ripple on click
- Resilient Canvas 2D fallback

## Constructors

### Constructor

```ts
new CloseButtonWebGL(canvas, onClickAction?): CloseButtonWebGL;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:74](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L74)

#### Parameters

##### canvas

`HTMLCanvasElement`

overlay canvas inside the host
  <button>; pointer events are bound to the parent button, not the canvas

##### onClickAction?

(() => `void`) \| `null`

forwarded after each click (the
  shockwave always fires; the host's close handler runs alongside)

#### Returns

`CloseButtonWebGL`

## Properties

### canvas

```ts
canvas: HTMLCanvasElement;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L30)

***

### onClickAction

```ts
onClickAction: (() => void) | null;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L31)

***

### width

```ts
width: number;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:32](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L32)

***

### height

```ts
height: number;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:33](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L33)

***

### isHovered

```ts
isHovered: boolean;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:34](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L34)

***

### hoverLevel

```ts
hoverLevel: number;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:35](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L35)

***

### drawProgress

```ts
drawProgress: number;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:36](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L36)

***

### rotation

```ts
rotation: number;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:37](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L37)

***

### clickTime

```ts
clickTime: number;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:38](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L38)

***

### useWebGL

```ts
useWebGL: boolean;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:39](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L39)

***

### animId

```ts
animId: number | null;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:40](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L40)

***

### startTime

```ts
startTime: number;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:41](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L41)

***

### gl

```ts
gl: WebGLRenderingContext | null = null;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:42](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L42)

***

### program

```ts
program: WebGLProgram | null = null;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:43](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L43)

***

### quadBuffer

```ts
quadBuffer: WebGLBuffer | null = null;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:44](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L44)

***

### uResolution

```ts
uResolution: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:45](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L45)

***

### uTime

```ts
uTime: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:46](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L46)

***

### uLiquid

```ts
uLiquid: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:47](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L47)

***

### uDraw

```ts
uDraw: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:48](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L48)

***

### uRot

```ts
uRot: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:49](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L49)

***

### uClickTime

```ts
uClickTime: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:50](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L50)

***

### aPos

```ts
aPos: number = 0;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:51](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L51)

***

### \_ro

```ts
_ro: ResizeObserver | null = null;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:52](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L52)

***

### \_onContextLost

```ts
_onContextLost: EventListener | null = null;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:53](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L53)

***

### \_purged

```ts
_purged: boolean = false;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:54](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L54)

***

### boundTarget

```ts
boundTarget: Element | null = null;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:55](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L55)

## Methods

### onMouseEnter()

```ts
onMouseEnter(): void;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:56](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L56)

#### Returns

`void`

***

### onMouseLeave()

```ts
onMouseLeave(): void;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:59](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L59)

#### Returns

`void`

***

### onClick()

```ts
onClick(): void;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:62](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L62)

#### Returns

`void`

***

### init()

```ts
init(): void;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:111](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L111)

Boot sequence: GL init → event binding → render start; fully degrades to the fallback path.

#### Returns

`void`

***

### initWebGL()

```ts
initWebGL(): void;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:117](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L117)

Creates the WebGL context, compiles the shader program and sets up uniforms/buffers; falls back on any failure.

#### Returns

`void`

***

### bindEvents()

```ts
bindEvents(): void;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:126](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L126)

Wires hover + click on the parent button (not the canvas) — the canvas
is a decorative overlay so interaction belongs to the semantic button.
boundTarget is remembered for destroy().

#### Returns

`void`

***

### setHover()

```ts
setHover(hovered): void;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:140](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L140)

Updates hover state — the shader renders the hover accent when true.

#### Parameters

##### hovered

`boolean`

#### Returns

`void`

***

### triggerClick()

```ts
triggerClick(): void;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:149](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L149)

Records the click timestamp — the shader reads u_click_time to expand
the shockwave ring over its 0.4s window. The onClickAction callback is
invoked separately by the click handler, not here.

#### Returns

`void`

***

### setReducedMotion()

```ts
setReducedMotion(isReduced): void;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:157](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L157)

Applies prefers-reduced-motion: swaps the animation loop for one
static frame render, or restarts the loop when motion is re-allowed.

#### Parameters

##### isReduced

`boolean`

#### Returns

`void`

***

### \_renderStatic()

```ts
_renderStatic(): void;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:169](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L169)

Draws one settled frame with the X fully drawn — used under reduced
motion or when the loop is stopped.

#### Returns

`void`

***

### animate()

```ts
animate(): void;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:175](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L175)

Starts the requestAnimationFrame render loop (skipped under reduced motion).

#### Returns

`void`

***

### \_renderWebGL()

```ts
_renderWebGL(now): void;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:181](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L181)

Per-frame WebGL render: updates time/hover uniforms and draws the quad.

#### Parameters

##### now

`number`

#### Returns

`void`

***

### purge()

```ts
purge(): void;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:190](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L190)

webglPool hook — offscreen: stops the loop and force-loses the GL
context so offscreen widgets hold no context slots; restore()
rebuilds the program on re-entry.

#### Returns

`void`

***

### restore()

```ts
restore(): void;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:209](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L209)

Recreates the GL context + program and resumes the loop after a purge.

#### Returns

`void`

***

### destroy()

```ts
destroy(): void;
```

Defined in: [core/utils/canvas/widgets/close-button.ts:233](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button.ts#L233)

Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd.

#### Returns

`void`
