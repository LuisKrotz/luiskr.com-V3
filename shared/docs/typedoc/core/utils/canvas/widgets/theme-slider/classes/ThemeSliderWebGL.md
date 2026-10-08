[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [core/utils/canvas/widgets/theme-slider](../README.md) / ThemeSliderWebGL

Defined in: [core/utils/canvas/widgets/theme-slider.ts:29](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L29)

Full Animated Day/Night/System Theme Slider
Powered by WebGL with robust Canvas 2D fallback.
Uses normalized aspect coordinates (range 0.0 to 3.33) to prevent GPU float overflow on all platforms.
Position 0: Dark (Night - Lunar moon with craters, twinkling stars, starry canyon mesas)
Position 1: System (Twilight - Balanced orb, sun rings rising on left, crescent on right)
Position 2: Light (Day - Sun knob on right, peach/coral sky, radiant sun on left)

## Constructors

### Constructor

```ts
new ThemeSliderWebGL(
   canvas, 
   initialTheme?, 
   onThemeChange?
): ThemeSliderWebGL;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:65](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L65)

#### Parameters

##### canvas

`HTMLCanvasElement`

##### initialTheme?

`string` = `THEME.SYSTEM`

##### onThemeChange?

((`_theme`) => `void`) \| `null`

#### Returns

`ThemeSliderWebGL`

## Properties

### canvas

```ts
canvas: HTMLCanvasElement;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L30)

***

### onThemeChange

```ts
onThemeChange: ((_theme) => void) | null;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L31)

***

### currentTheme

```ts
currentTheme: string;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:32](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L32)

***

### width

```ts
width: number;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:33](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L33)

***

### height

```ts
height: number;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:34](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L34)

***

### targetP

```ts
targetP: number;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:35](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L35)

***

### currentP

```ts
currentP: number;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:36](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L36)

***

### knobX

```ts
knobX: number;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:37](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L37)

***

### isDragging

```ts
isDragging: boolean = false;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:38](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L38)

***

### startX

```ts
startX: number = 0;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:39](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L39)

***

### useWebGL

```ts
useWebGL: boolean = false;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:40](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L40)

***

### animId

```ts
animId: number | null = null;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:41](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L41)

***

### startTime

```ts
startTime: number;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:42](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L42)

***

### rippleTime

```ts
rippleTime: number;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:43](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L43)

***

### ripplePos

```ts
ripplePos: number;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:44](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L44)

***

### gl

```ts
gl: WebGLRenderingContext | null = null;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:45](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L45)

***

### ctx

```ts
ctx: CanvasRenderingContext2D | null = null;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:46](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L46)

***

### program

```ts
program: WebGLProgram | null = null;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:47](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L47)

***

### quadBuffer

```ts
quadBuffer: WebGLBuffer | null = null;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:48](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L48)

***

### uResolution

```ts
uResolution: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:49](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L49)

***

### uTime

```ts
uTime: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:50](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L50)

***

### uProgress

```ts
uProgress: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:51](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L51)

***

### uKnobX

```ts
uKnobX: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:52](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L52)

***

### uRippleTime

```ts
uRippleTime: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:53](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L53)

***

### uRipplePos

```ts
uRipplePos: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:54](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L54)

***

### aPos

```ts
aPos: number = -1;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:55](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L55)

***

### \_resizeObserver

```ts
_resizeObserver: ResizeObserver | null = null;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:56](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L56)

***

### \_onContextLost

```ts
_onContextLost: EventListener | null = null;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:57](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L57)

***

### \_purged

```ts
_purged: boolean = false;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:58](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L58)

***

### onPointerDown

```ts
onPointerDown: ((_e) => void) | undefined;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:59](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L59)

***

### onPointerMove

```ts
onPointerMove: ((_e) => void) | undefined;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:60](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L60)

***

### onPointerUp

```ts
onPointerUp: ((_e) => void) | undefined;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:61](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L61)

***

### onClick

```ts
onClick: ((_e) => void) | undefined;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:62](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L62)

***

### onKeyDown

```ts
onKeyDown: ((_e) => void) | undefined;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:63](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L63)

## Methods

### \_themeToP()

```ts
_themeToP(theme): number;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:112](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L112)

THEME → normalized track position. Positions are the integer stops
0/1/2 — fractional values only exist mid-animation.

#### Parameters

##### theme

`string`

#### Returns

`number`

***

### \_pToTheme()

```ts
_pToTheme(p): string;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:118](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L118)

Maps a normalized track position back to the nearest THEME value.

#### Parameters

##### p

`number`

#### Returns

`string`

***

### \_pToKnobX()

```ts
_pToKnobX(p): number;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:126](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L126)

Normalized position → knob pixel X inside the track — see
theme-slider-math.ts for the inset geometry.

#### Parameters

##### p

`number`

#### Returns

`number`

***

### init()

```ts
init(): void;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:132](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L132)

Boot sequence: GL init → event binding → render start; fully degrades to the fallback path.

#### Returns

`void`

***

### \_triggerFallback()

```ts
_triggerFallback(): void;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:138](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L138)

Switches to the non-WebGL path (CSS class on the host / Canvas2D) — used on context loss or init failure.

#### Returns

`void`

***

### initWebGL()

```ts
initWebGL(): void;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:144](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L144)

Creates the WebGL context, compiles the shader program and sets up uniforms/buffers; falls back on any failure.

#### Returns

`void`

***

### bindEvents()

```ts
bindEvents(): void;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:150](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L150)

Wires pointer drag + tap-to-snap; supports keyboard arrows for a11y.

#### Returns

`void`

***

### \_xToContinuousP()

```ts
_xToContinuousP(x, rectWidth?): number;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:158](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L158)

Pointer pixel X → continuous (unclamped-drag) normalized position —
see theme-slider-math.ts for the 12%–88% active band.

#### Parameters

##### x

`number`

##### rectWidth?

`number` \| `null`

#### Returns

`number`

***

### \_xToP()

```ts
_xToP(x): number;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:166](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L166)

Pointer pixel X → normalized position using the fixed 32px insets
(same span as _pToKnobX). Retained for non-drag hit paths.

#### Parameters

##### x

`number`

#### Returns

`number`

***

### setTheme()

```ts
setTheme(theme): void;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:172](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L172)

Moves the knob to the given theme's stop (spring-animated).

#### Parameters

##### theme

`string`

#### Returns

`void`

***

### setReducedMotion()

```ts
setReducedMotion(isReduced): void;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:189](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L189)

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

Defined in: [core/utils/canvas/widgets/theme-slider.ts:201](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L201)

Snap state to target and draw a single settled frame — used under
reduced motion or when the loop is stopped.

#### Returns

`void`

***

### animate()

```ts
animate(): void;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:207](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L207)

Starts the requestAnimationFrame render loop (skipped under reduced motion).

#### Returns

`void`

***

### \_renderWebGL()

```ts
_renderWebGL(now): void;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:213](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L213)

Per-frame WebGL render: updates time/knob uniforms and draws the quad.

#### Parameters

##### now

`number`

#### Returns

`void`

***

### \_renderCanvas2D()

```ts
_renderCanvas2D(): void;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:222](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L222)

Canvas2D fallback renderer — dormant defensive code; the real
fallback hides the canvas and activates the CSS/DOM fallback
(see theme-slider-init.ts triggerFallback).

#### Returns

`void`

***

### purge()

```ts
purge(): void;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:231](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L231)

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

Defined in: [core/utils/canvas/widgets/theme-slider.ts:250](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L250)

Recreates the GL context + program and resumes the loop after a purge.

#### Returns

`void`

***

### destroy()

```ts
destroy(): void;
```

Defined in: [core/utils/canvas/widgets/theme-slider.ts:278](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider.ts#L278)

Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd.

#### Returns

`void`
