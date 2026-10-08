[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [core/utils/canvas/widgets/flag-webgl](../README.md) / FlagWebGL

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:40](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L40)

WebGL Flag Animator for Language Selection Buttons
Each flag has a completely unique animated kinetic effect and wave physics:
- EN (0): Star-spangled waving ripple with specular stars sparkle
- PT (1): Solar burst pulse radiating from rhombus with Southern Cross constellation twinkle
- ES (2): Warm flamenco silk wave with golden crest glow
- DE (3): Swiss cross kinetic pulse transitioning into German horizontal ribbon wave
- HRK (4): Harmonic dual-wave blending German tricolor and Brazilian tropical pulse
- CAS (5): Sol de Mayo radiant solar rays pulsing across Argentine & Uruguayan sky-blue stripes
- RIV (6): Border river ripple reflecting the Uruguayan sun into Brazilian green-gold canopy
- GN (7): Tricolor horizontal fluid wave with national seal star glow
- IT (8): Mediterranean silk flutter with delicate cloth folds
- RU (9): Northern lights aurora borealis shimmer waving across the stripes
- FR (10): Revolutionary vertical tricolor ripple with satin sheen
- TLN (11): Venetian gondola water reflection merging Italian and Brazilian tones

## Constructors

### Constructor

```ts
new FlagWebGL(canvas, langOption): FlagWebGL;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:60](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L60)

#### Parameters

##### canvas

`HTMLCanvasElement`

##### langOption

  \| \{
  `code`: `"en"`;
  `label`: `string`;
  `cc`: `string`;
  `flag`: `string`;
  `cc2?`: `undefined`;
  `short`: `string`;
\}
  \| \{
  `code`: `"br"`;
  `label`: `string`;
  `cc`: `string`;
  `flag`: `string`;
  `cc2?`: `undefined`;
  `short`: `string`;
\}
  \| \{
  `code`: `"es"`;
  `label`: `string`;
  `cc`: `string`;
  `flag`: `string`;
  `cc2?`: `undefined`;
  `short`: `string`;
\}
  \| \{
  `code`: `"de"`;
  `label`: `string`;
  `cc`: `string`;
  `cc2`: `string`;
  `flag`: `string`;
  `short`: `string`;
\}
  \| \{
  `code`: `"hrk"`;
  `label`: `string`;
  `cc`: `string`;
  `cc2`: `string`;
  `flag`: `string`;
  `short`: `string`;
\}
  \| \{
  `code`: `"cas"`;
  `label`: `string`;
  `cc`: `string`;
  `cc2`: `string`;
  `flag`: `string`;
  `short`: `string`;
\}
  \| \{
  `code`: `"riv"`;
  `label`: `string`;
  `cc`: `string`;
  `cc2`: `string`;
  `flag`: `string`;
  `short`: `string`;
\}
  \| \{
  `code`: `"gn"`;
  `label`: `string`;
  `cc`: `string`;
  `flag`: `string`;
  `cc2?`: `undefined`;
  `short`: `string`;
\}
  \| \{
  `code`: `"it"`;
  `label`: `string`;
  `cc`: `string`;
  `flag`: `string`;
  `cc2?`: `undefined`;
  `short`: `string`;
\}
  \| \{
  `code`: `"ru"`;
  `label`: `string`;
  `cc`: `string`;
  `flag`: `string`;
  `cc2?`: `undefined`;
  `short`: `string`;
\}
  \| \{
  `code`: `"fr"`;
  `label`: `string`;
  `cc`: `string`;
  `flag`: `string`;
  `cc2?`: `undefined`;
  `short`: `string`;
\}
  \| \{
  `code`: `"tln"`;
  `label`: `string`;
  `cc`: `string`;
  `cc2`: `string`;
  `flag`: `string`;
  `short`: `string`;
\}
  \| \{
  `cc2?`: `undefined`;
  `code`: `"gl"`;
  `label`: `string`;
  `cc`: `string`;
  `flag`: `string`;
  `short`: `string`;
\}
  \| \{
  `cc2?`: `undefined`;
  `code`: `"ca"`;
  `label`: `string`;
  `cc`: `string`;
  `flag`: `string`;
  `short`: `string`;
\}
  \| \{
  `cc2?`: `undefined`;
  `code`: `"nl"`;
  `label`: `string`;
  `cc`: `string`;
  `flag`: `string`;
  `short`: `string`;
\}
  \| \{
  `cc2?`: `undefined`;
  `code`: `"ga"`;
  `label`: `string`;
  `cc`: `string`;
  `flag`: `string`;
  `short`: `string`;
\}

#### Returns

`FlagWebGL`

## Properties

### canvas

```ts
canvas: HTMLCanvasElement;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:41](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L41)

***

### lang

```ts
lang: 
  | {
  code: "en";
  label: string;
  cc: string;
  flag: string;
  cc2?: undefined;
  short: string;
}
  | {
  code: "br";
  label: string;
  cc: string;
  flag: string;
  cc2?: undefined;
  short: string;
}
  | {
  code: "es";
  label: string;
  cc: string;
  flag: string;
  cc2?: undefined;
  short: string;
}
  | {
  code: "de";
  label: string;
  cc: string;
  cc2: string;
  flag: string;
  short: string;
}
  | {
  code: "hrk";
  label: string;
  cc: string;
  cc2: string;
  flag: string;
  short: string;
}
  | {
  code: "cas";
  label: string;
  cc: string;
  cc2: string;
  flag: string;
  short: string;
}
  | {
  code: "riv";
  label: string;
  cc: string;
  cc2: string;
  flag: string;
  short: string;
}
  | {
  code: "gn";
  label: string;
  cc: string;
  flag: string;
  cc2?: undefined;
  short: string;
}
  | {
  code: "it";
  label: string;
  cc: string;
  flag: string;
  cc2?: undefined;
  short: string;
}
  | {
  code: "ru";
  label: string;
  cc: string;
  flag: string;
  cc2?: undefined;
  short: string;
}
  | {
  code: "fr";
  label: string;
  cc: string;
  flag: string;
  cc2?: undefined;
  short: string;
}
  | {
  code: "tln";
  label: string;
  cc: string;
  cc2: string;
  flag: string;
  short: string;
}
  | {
  cc2?: undefined;
  code: "gl";
  label: string;
  cc: string;
  flag: string;
  short: string;
}
  | {
  cc2?: undefined;
  code: "ca";
  label: string;
  cc: string;
  flag: string;
  short: string;
}
  | {
  cc2?: undefined;
  code: "nl";
  label: string;
  cc: string;
  flag: string;
  short: string;
}
  | {
  cc2?: undefined;
  code: "ga";
  label: string;
  cc: string;
  flag: string;
  short: string;
};
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:42](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L42)

***

### height

```ts
height: number;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:43](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L43)

***

### aspect1

```ts
aspect1: number;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:44](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L44)

***

### aspect2

```ts
aspect2: number;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:45](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L45)

***

### width

```ts
width: number;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:46](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L46)

***

### isHovered

```ts
isHovered: boolean = false;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:47](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L47)

***

### hoverLevel

```ts
hoverLevel: number = 0;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:48](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L48)

***

### useWebGL

```ts
useWebGL: boolean = false;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:49](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L49)

***

### \_paused

```ts
_paused: boolean = false;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:50](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L50)

***

### animId

```ts
animId: number | null = null;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:51](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L51)

***

### startTime

```ts
startTime: number;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:52](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L52)

***

### ctx

```ts
ctx: CanvasRenderingContext2D | null = null;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:53](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L53)

***

### renderer

```ts
renderer: FlagRenderer | null = null;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:54](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L54)

***

### isLoaded

```ts
isLoaded: boolean = false;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:55](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L55)

***

### onMouseEnter

```ts
onMouseEnter: (() => void) | undefined;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:56](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L56)

***

### onMouseLeave

```ts
onMouseLeave: (() => void) | undefined;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:57](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L57)

***

### boundTarget

```ts
boundTarget: HTMLElement | undefined;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:58](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L58)

## Methods

### \_displayAspect()

```ts
_displayAspect(): number;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:106](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L106)

Natural aspect ratio the flag should display at (from its source SVG).

#### Returns

`number`

***

### \_splitPoint()

```ts
_splitPoint(): number;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:116](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L116)

Normalized 0–1 x where a hybrid flag's two halves meet: the first
flag's share of the combined aspect widths (aspect1/(aspect1+aspect2))
so each half keeps its natural proportions instead of stretching 50/50.

#### Returns

`number`

***

### \_resizeToNaturalAspect()

```ts
_resizeToNaturalAspect(): void;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:122](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L122)

Sizes the canvas to the flag's natural aspect ratio.

#### Returns

`void`

***

### \_getAnimType()

```ts
_getAnimType(): number;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:128](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L128)

Picks the shader's animation mode (wave / gentle ripple / static).

#### Returns

`number`

***

### init()

```ts
init(): void;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:134](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L134)

Boot sequence: GL init → event binding → render start; fully degrades to the fallback path.

#### Returns

`void`

***

### purge()

```ts
purge(): void;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:171](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L171)

webglPool hook — offscreen: stops the loop and releases the shared
renderer reference so the pooled GL context can be disposed once
every flag is out of view (or destroyed).

#### Returns

`void`

***

### restore()

```ts
restore(): void;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:188](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L188)

Re-acquires the shared renderer and resumes the wave loop after a purge.

#### Returns

`void`

***

### \_triggerFallback()

```ts
_triggerFallback(): void;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:210](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L210)

Switches to the non-WebGL path (CSS class on the host / Canvas2D) — used on context loss or init failure.

#### Returns

`void`

***

### loadImages()

```ts
loadImages(): void;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:216](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L216)

Loads the flag's SVG source(s) into the texture cache.

#### Returns

`void`

***

### bindEvents()

```ts
bindEvents(): void;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:252](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L252)

Wires pointer/hover listeners that drive the widget's interactive state.

#### Returns

`void`

***

### setHover()

```ts
setHover(hovered): void;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:272](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L272)

Updates hover state — the shader renders the hover accent when true.

#### Parameters

##### hovered

`boolean`

#### Returns

`void`

***

### setReducedMotion()

```ts
setReducedMotion(isReduced): void;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:282](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L282)

Applies prefers-reduced-motion: swaps the animation loop for one static frame render.

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

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:295](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L295)

Draws a single settled frame — used under reduced motion or when the loop is stopped.

#### Returns

`void`

***

### animate()

```ts
animate(): void;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:301](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L301)

Starts the requestAnimationFrame render loop (skipped under reduced motion).

#### Returns

`void`

***

### \_renderWebGL()

```ts
_renderWebGL(now): void;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:307](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L307)

Per-frame WebGL render: updates time/hover uniforms and draws the quad.

#### Parameters

##### now

`number`

#### Returns

`void`

***

### destroy()

```ts
destroy(): void;
```

Defined in: [core/utils/canvas/widgets/flag-webgl.ts:313](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag-webgl.ts#L313)

Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd.

#### Returns

`void`
