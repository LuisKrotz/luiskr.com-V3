[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [core/utils/canvas/loaders/menu-background-webgl](../README.md) / MenuBackgroundWebGL

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:41](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L41)

WebGL animated background for the mobile burger menu — "Membrane" concept.
Renders fine organic monochrome contour lines (domain-warped fbm isolines)
that slowly breathe, inspired by Iris van Herpen's material studies.
The field materialises from the centre as `u_reveal` eases toward 1 and
dissolves back on release(). Line colour is sampled from --menu-ink /
--menu-ink-2 so it always matches the active theme — monochrome in dark,
water-blues in light; falls back to a CSS moiré layer when WebGL is
unavailable or the shader fails to compile/link.

## Constructors

### Constructor

```ts
new MenuBackgroundWebGL(canvas): MenuBackgroundWebGL;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:78](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L78)

#### Parameters

##### canvas

`HTMLCanvasElement`

#### Returns

`MenuBackgroundWebGL`

## Properties

### canvas

```ts
canvas: HTMLCanvasElement;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:47](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L47)

#### Param

**canvas**

fullscreen canvas behind the menu
  overlay's content; owned by AppNav which calls start/release/stop
  with the menu's open/close lifecycle

***

### gl

```ts
gl: WebGLRenderingContext | null = null;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:48](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L48)

***

### program

```ts
program: WebGLProgram | null = null;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:49](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L49)

***

### quadBuffer

```ts
quadBuffer: WebGLBuffer | null = null;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:50](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L50)

***

### animId

```ts
animId: number | null = null;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:51](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L51)

***

### uTime

```ts
uTime: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:52](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L52)

***

### uResolution

```ts
uResolution: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:53](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L53)

***

### uColor

```ts
uColor: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:54](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L54)

***

### uColor2

```ts
uColor2: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:55](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L55)

***

### uReveal

```ts
uReveal: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:56](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L56)

***

### uAlpha

```ts
uAlpha: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:57](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L57)

***

### width

```ts
width: number = 0;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:58](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L58)

***

### height

```ts
height: number = 0;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:59](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L59)

***

### isActive

```ts
isActive: boolean = false;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:60](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L60)

***

### \_ro

```ts
_ro: ResizeObserver | null = null;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:61](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L61)

***

### useWebGL

```ts
useWebGL: boolean = false;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:62](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L62)

***

### \_reveal

```ts
_reveal: number = 0;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:63](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L63)

***

### \_revealTarget

```ts
_revealTarget: number = 0;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:64](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L64)

***

### \_revealFrom

```ts
_revealFrom: number = 0;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:65](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L65)

***

### \_revealT0

```ts
_revealT0: number = 0;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:66](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L66)

***

### \_revealDur

```ts
_revealDur: number = 0;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:67](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L67)

***

### \_lastFrame

```ts
_lastFrame: number = 0;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:68](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L68)

***

### \_elapsed

```ts
_elapsed: number = 0;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:69](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L69)

***

### \_color

```ts
_color: number[];
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:70](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L70)

***

### \_color2

```ts
_color2: number[];
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:71](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L71)

***

### \_darkAtStart

```ts
_darkAtStart: boolean = false;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:72](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L72)

***

### \_hasDeriv

```ts
_hasDeriv: boolean = false;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:73](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L73)

***

### \_onContextLost

```ts
_onContextLost: EventListener | null = null;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:74](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L74)

***

### \_purged

```ts
_purged: boolean = false;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:75](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L75)

***

### \_wantsActive

```ts
_wantsActive: boolean = false;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:76](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L76)

## Methods

### \_initGL()

```ts
_initGL(): void;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:91](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L91)

Creates the WebGL context + shader program; falls back to the CSS/DOM path on failure.

#### Returns

`void`

***

### \_triggerFallback()

```ts
_triggerFallback(): void;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:97](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L97)

Switches to the non-WebGL path (CSS moiré layer) — used on context loss or init failure.

#### Returns

`void`

***

### \_releaseGL()

```ts
_releaseGL(): void;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:103](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L103)

Frees the quad program/buffer and force-loses the context (listener detached first).

#### Returns

`void`

***

### \_parseCssColor()

```ts
_parseCssColor(str): number[] | null;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:113](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L113)

Parses a CSS colour string (#rgb, #rrggbb, rgb(), rgba()) into a
normalized [r,g,b] float triple for the shader uniform.

#### Parameters

##### str

`string`

#### Returns

`number`[] \| `null`

***

### \_sampleTheme()

```ts
_sampleTheme(): void;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:119](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L119)

Samples --menu-ink / --menu-ink-2 into the shader ink colors.

#### Returns

`void`

***

### start()

```ts
start(): void;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:125](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L125)

Begins the render loop on menu open (see menu-background-loop.ts).

#### Returns

`void`

***

### release()

```ts
release(): void;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:135](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L135)

Eases the reveal back to 0 so the field dissolves on menu close.

#### Returns

`void`

***

### purge()

```ts
purge(): void;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:147](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L147)

webglPool hook — canvas scrolled offscreen (or the browser trimmed
contexts): tears the GL resources down entirely instead of merely
pausing, freeing the context slot for other surfaces. restore()
recreates them on re-entry.

#### Returns

`void`

***

### restore()

```ts
restore(): void;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:161](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L161)

Recreates the GL context + restarts the loop after an offscreen purge.

#### Returns

`void`

***

### \_animateReveal()

```ts
_animateReveal(target, dur): void;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:180](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L180)

Starts (or restarts mid-flight) a timed reveal ease.

#### Parameters

##### target

`number`

##### dur

`number`

#### Returns

`void`

***

### \_tickReveal()

```ts
_tickReveal(now): void;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:186](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L186)

Advances the reveal ease to the current timestamp.

#### Parameters

##### now

`number`

#### Returns

`void`

***

### stop()

```ts
stop(): void;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:192](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L192)

Stops the rAF loop.

#### Returns

`void`

***

### \_handleResize()

```ts
_handleResize(): void;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:198](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L198)

Syncs buffer size + u_res uniform with the viewport.

#### Returns

`void`

***

### \_loop()

```ts
_loop(): void;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:204](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L204)

rAF callback — draws the animated contour field each frame.

#### Returns

`void`

***

### \_renderFrame()

```ts
_renderFrame(staticTime?): void;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:210](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L210)

Renders the noise field; a fixed staticTime renders one settled frame.

#### Parameters

##### staticTime?

`number` \| `null`

#### Returns

`void`

***

### destroy()

```ts
destroy(): void;
```

Defined in: [core/utils/canvas/loaders/menu-background-webgl.ts:216](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background-webgl.ts#L216)

Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd.

#### Returns

`void`
