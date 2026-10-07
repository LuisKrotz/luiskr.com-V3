[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [utils/canvas/widgets/burger-button-webgl](../README.md) / BurgerButtonWebGL

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:29](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L29)

WebGL animated hamburger icon for the mobile burger button.
Renders three sleek horizontal lines with rounded pill caps and subtle wave animation.
Adapts to the current theme: dark icon in light mode, bright icon in dark mode.

## Constructors

### Constructor

```ts
new BurgerButtonWebGL(canvas, onClick?): BurgerButtonWebGL;
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:53](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L53)

#### Parameters

##### canvas

`HTMLCanvasElement`

##### onClick?

`EventListener` \| `null`

#### Returns

`BurgerButtonWebGL`

## Properties

### canvas

```ts
canvas: HTMLCanvasElement
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:36](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L36)

#### Param

**canvas**

icon canvas inside the nav burger button

#### Param

**onClick**

optional click handler (the canvas becomes
interactive — cursor:pointer + click listener); pass null when the
parent button already handles clicks

---

### gl

```ts
gl: WebGLRenderingContext | null = null;
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:37](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L37)

---

### program

```ts
program: WebGLProgram | null = null;
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:38](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L38)

---

### quadBuffer

```ts
quadBuffer: WebGLBuffer | null = null;
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:39](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L39)

---

### animId

```ts
animId: number | null = null;
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:40](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L40)

---

### startTime

```ts
startTime: number
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:41](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L41)

---

### uTime

```ts
uTime: WebGLUniformLocation | null = null;
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:42](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L42)

---

### uResolution

```ts
uResolution: WebGLUniformLocation | null = null;
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:43](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L43)

---

### uDark

```ts
uDark: WebGLUniformLocation | null = null;
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:44](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L44)

---

### \_onClick

```ts
_onClick: EventListener | null
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:45](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L45)

---

### \_onKeyDown

```ts
_onKeyDown: ((e) => void) | null = null;
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:46](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L46)

---

### \_onContextLost

```ts
_onContextLost: EventListener | null = null;
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:47](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L47)

---

### \_onResize

```ts
_onResize: () => void;
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:48](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L48)

#### Returns

`void`

---

### \_purged

```ts
_purged: boolean = false
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:49](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L49)

---

### \_hasDeriv

```ts
_hasDeriv: boolean = false
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:50](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L50)

---

### useWebGL

```ts
useWebGL: boolean = false
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:51](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L51)

## Methods

### \_initGL()

```ts
_initGL(): void;
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:99](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L99)

Creates the WebGL context + shader program; falls back to the CSS/DOM path on failure.

#### Returns

`void`

---

### \_triggerFallback()

```ts
_triggerFallback(): void;
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:164](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L164)

Switches to the non-WebGL path (CSS class on the host / Canvas2D) — used on context loss or init failure.

#### Returns

`void`

---

### \_checkResize()

```ts
_checkResize(): void;
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:191](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L191)

Re-syncs the drawing buffer to the canvas's CSS box × devicePixelRatio
(capped at 2). Only reallocates when the rounded size actually changed,
and repaints one frame immediately when the RAF loop isn't running —
in reduced-motion static mode a resize would otherwise leave the
cleared buffer blank until the next state change.

#### Returns

`void`

---

### \_start()

```ts
_start(): void;
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:221](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L221)

Chooses reduced-motion static render vs the rAF loop.

#### Returns

`void`

---

### \_drawFrame()

```ts
_drawFrame(t): void;
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:250](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L250)

Renders one frame at time t (seconds) — shared by the RAF loop and the
static reduced-motion path. u_dark is re-evaluated per frame from the
live DOM classes (dark theme OR nav-on-dark over the contact band) so
the icon recolors instantly on theme/scroll changes with no listener.

#### Parameters

##### t

`number`

seconds since construction

#### Returns

`void`

---

### \_loop()

```ts
_loop(): void;
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:280](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L280)

rAF callback — repaints each frame while running.

#### Returns

`void`

---

### purge()

```ts
purge(): void;
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:293](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L293)

webglPool hook — offscreen: stops the loop and releases the GL
context entirely; restore() rebuilds it on re-entry so offscreen
widgets never hold context slots.

#### Returns

`void`

---

### restore()

```ts
restore(): void;
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:310](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L310)

Recreates the GL context and resumes the loop after an offscreen purge.

#### Returns

`void`

---

### destroy()

```ts
destroy(): void;
```

Defined in: [src/utils/canvas/widgets/burger-button-webgl.ts:330](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/burger-button-webgl.ts#L330)

Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd.

#### Returns

`void`
