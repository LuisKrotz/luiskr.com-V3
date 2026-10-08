[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [core/utils/canvas/widgets/switch-slider](../README.md) / SwitchWebGL

Defined in: [core/utils/canvas/widgets/switch-slider.ts:28](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L28)

Contextual WebGL Switch Slider for Developer Tools
Renders custom animated graphical draw elements referent to each toggle's context:
- 'stats': Live ECG oscilloscope waveform + pulsing chip matrix (Stats for Nerds)
- 'grid': Glowing blueprint column grid lines + scanning crosshairs (Show Grid)
- 'motion': Subtle ambient drift (OFF) vs calm still horizon datum (ON) (Reduced Motion)
All switches share an identical solid centered knob indicator dot.

## Constructors

### Constructor

```ts
new SwitchWebGL(
   canvas, 
   contextType?, 
   initialActive?, 
   onToggle?
): SwitchWebGL;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:56](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L56)

#### Parameters

##### canvas

`HTMLCanvasElement`

##### contextType?

`string` = `SWITCH_TYPES.STATS`

##### initialActive?

`boolean` = `false`

##### onToggle?

((`_active`) => `void`) \| `null`

#### Returns

`SwitchWebGL`

## Properties

### canvas

```ts
canvas: HTMLCanvasElement;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:29](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L29)

***

### contextType

```ts
contextType: string;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L30)

***

### onToggle

```ts
onToggle: ((_active) => void) | null;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L31)

***

### isActive

```ts
isActive: boolean;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:32](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L32)

***

### width

```ts
width: number;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:33](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L33)

***

### height

```ts
height: number;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:34](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L34)

***

### targetP

```ts
targetP: number;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:35](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L35)

***

### currentP

```ts
currentP: number;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:36](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L36)

***

### knobX

```ts
knobX: number;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:37](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L37)

***

### useWebGL

```ts
useWebGL: boolean = false;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:38](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L38)

***

### animId

```ts
animId: number | null = null;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:39](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L39)

***

### startTime

```ts
startTime: number;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:40](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L40)

***

### dpr

```ts
dpr: number = 2;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:41](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L41)

***

### gl

```ts
gl: WebGLRenderingContext | null = null;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:42](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L42)

***

### ctx

```ts
ctx: CanvasRenderingContext2D | null = null;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:43](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L43)

***

### program

```ts
program: WebGLProgram | null = null;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:44](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L44)

***

### quadBuffer

```ts
quadBuffer: WebGLBuffer | null = null;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:45](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L45)

***

### aPos

```ts
aPos: number = -1;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:46](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L46)

***

### uContext

```ts
uContext: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:47](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L47)

***

### uKnobX

```ts
uKnobX: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:48](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L48)

***

### uProgress

```ts
uProgress: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:49](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L49)

***

### uResolution

```ts
uResolution: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:50](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L50)

***

### uTime

```ts
uTime: WebGLUniformLocation | null = null;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:51](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L51)

***

### \_onContextLost

```ts
_onContextLost: EventListener | null = null;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:52](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L52)

***

### \_purged

```ts
_purged: boolean = false;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:53](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L53)

***

### onClick

```ts
onClick: ((_e) => void) | undefined;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:54](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L54)

## Methods

### \_pToKnobX()

```ts
_pToKnobX(p): number;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:101](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L101)

Progress 0–1 → knob pixel X. The knob (radius 11) is inset 14px from
each end — exactly half the 28px track height — so it sits centered
inside the capsule's rounded caps at both extremes.

#### Parameters

##### p

`number`

#### Returns

`number`

CSS px

***

### \_contextCode()

```ts
_contextCode(): number;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:115](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L115)

Context → shader's u_context float id (0=stats, 1=grid/cyan/space,
2=motion). The fragment shader branches on ranges (<0.5, <1.5, else)
so several visual aliases can share the grid animation.

#### Returns

`number`

***

### init()

```ts
init(): void;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:130](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L130)

Boot sequence: GL init → event binding → render start; fully degrades to the fallback path.

#### Returns

`void`

***

### \_triggerFallback()

```ts
_triggerFallback(): void;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:136](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L136)

Switches to the non-WebGL path (CSS class on the host / Canvas2D) — used on context loss or init failure.

#### Returns

`void`

***

### initWebGL()

```ts
initWebGL(): void;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:142](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L142)

Creates the WebGL context, compiles the shader program and sets up uniforms/buffers; falls back on any failure.

#### Returns

`void`

***

### bindEvents()

```ts
bindEvents(): void;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:148](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L148)

Wires pointer/hover listeners that drive the widget's interactive state.

#### Returns

`void`

***

### toggle()

```ts
toggle(): void;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:160](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L160)

Flips the switch and fires the onToggle callback.

#### Returns

`void`

***

### setActive()

```ts
setActive(active): void;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:172](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L172)

Sets the knob position programmatically (animates the slide).

#### Parameters

##### active

`boolean`

#### Returns

`void`

***

### setReducedMotion()

```ts
setReducedMotion(isReduced): void;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:185](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L185)

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

Defined in: [core/utils/canvas/widgets/switch-slider.ts:197](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L197)

Snap state to target and draw a single settled frame — used under
reduced motion or when the loop is stopped.

#### Returns

`void`

***

### animate()

```ts
animate(): void;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:203](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L203)

Starts the requestAnimationFrame render loop (skipped under reduced motion).

#### Returns

`void`

***

### \_renderWebGL()

```ts
_renderWebGL(now): void;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:209](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L209)

Per-frame WebGL render: updates time/knob uniforms and draws the quad.

#### Parameters

##### now

`number`

#### Returns

`void`

***

### \_renderCanvas2D()

```ts
_renderCanvas2D(now): void;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:215](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L215)

Per-frame Canvas2D fallback render — same visual language as the shader.

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

Defined in: [core/utils/canvas/widgets/switch-slider.ts:224](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L224)

webglPool hook — offscreen: stops the loop (GL or 2D) and force-loses
the GL context so offscreen widgets hold no context slots; restore()
rebuilds the GL program or re-acquires the 2D context on re-entry.

#### Returns

`void`

***

### restore()

```ts
restore(): void;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:245](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L245)

Recreates the GL context + program (or the 2D fallback) and resumes the loop after a purge.

#### Returns

`void`

***

### destroy()

```ts
destroy(): void;
```

Defined in: [core/utils/canvas/widgets/switch-slider.ts:283](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/switch-slider.ts#L283)

Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd.

#### Returns

`void`
