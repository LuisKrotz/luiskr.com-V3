[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [experiments/earth-playground/earth-background](../README.md) / EarthBackground

Defined in: [experiments/earth-playground/earth-background.ts:62](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth-background.ts#L62)

Owns the full WebGPU/WebGL Earth scene: renderer, camera rig, sun+moon
lighting, the textured Earth group (surface/clouds/atmosphere shells), and
the TSL post-processing pipeline (bloom → chromatic aberration → color
grade → vignette → film grain).

## Constructors

### Constructor

```ts
new EarthBackground(canvas, __namedParameters?): EarthBackground;
```

Defined in: [experiments/earth-playground/earth-background.ts:66](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth-background.ts#L66)

#### Parameters

##### canvas

`HTMLCanvasElement`

##### \_\_namedParameters?

###### onReady?

() => `void`

###### onProgress?

[`EarthProgressFn`](../../earth/runtime/state/type-aliases/EarthProgressFn.md)

#### Returns

`EarthBackground`

## Accessors

### settings

#### Get Signature

```ts
get settings(): object;
```

Defined in: [experiments/earth-playground/earth-background.ts:177](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth-background.ts#L177)

Snapshot of every tunable, shaped exactly like DEFAULT_SP_GUI so the
playground control panel can render sliders without knowing which
values are live uniforms vs build-time constants.

##### Returns

`object`

settings tree keyed like DEFAULT_SP_GUI

###### SHOW

```ts
SHOW: boolean = true;
```

###### COLOR\_GRADING

```ts
COLOR_GRADING: object;
```

###### COLOR\_GRADING.CONTRAST

```ts
CONTRAST: number;
```

###### COLOR\_GRADING.SATURATION

```ts
SATURATION: number;
```

###### COLOR\_GRADING.BLACK\_LEVEL

```ts
BLACK_LEVEL: number;
```

###### COLOR\_GRADING.BLUE\_GREEN\_BOOST

```ts
BLUE_GREEN_BOOST: number;
```

###### MOON

```ts
MOON: object;
```

###### MOON.ENABLED

```ts
ENABLED: boolean;
```

###### MOON.SPEED

```ts
SPEED: number;
```

###### MOON.DISTANCE

```ts
DISTANCE: number;
```

###### MOON.INCLINATION

```ts
INCLINATION: number;
```

###### LENS\_FLARE

```ts
LENS_FLARE: object;
```

###### LENS\_FLARE.ENABLED

```ts
ENABLED: true = DEFAULT_SP_GUI.LENS_FLARE.ENABLED;
```

###### LENS\_FLARE.INTENSITY

```ts
INTENSITY: 0.15 = DEFAULT_SP_GUI.LENS_FLARE.INTENSITY;
```

###### ANAMORPHIC

```ts
ANAMORPHIC: object;
```

###### ANAMORPHIC.ENABLED

```ts
ENABLED: false = DEFAULT_SP_GUI.ANAMORPHIC.ENABLED;
```

###### ANAMORPHIC.INTENSITY

```ts
INTENSITY: 0.5 = DEFAULT_SP_GUI.ANAMORPHIC.INTENSITY;
```

###### ANAMORPHIC.THICKNESS

```ts
THICKNESS: 2 = DEFAULT_SP_GUI.ANAMORPHIC.THICKNESS;
```

###### ANAMORPHIC.SIZE

```ts
SIZE: 0.2 = DEFAULT_SP_GUI.ANAMORPHIC.SIZE;
```

###### ANAMORPHIC.COLOR

```ts
COLOR: 16777215 = DEFAULT_SP_GUI.ANAMORPHIC.COLOR;
```

###### ANAMORPHIC.INNER\_FADE

```ts
INNER_FADE: 0.08 = DEFAULT_SP_GUI.ANAMORPHIC.INNER_FADE;
```

###### ANAMORPHIC.OUTER\_FADE

```ts
OUTER_FADE: 0.08 = DEFAULT_SP_GUI.ANAMORPHIC.OUTER_FADE;
```

###### BLOOM

```ts
BLOOM: object;
```

###### BLOOM.ENABLED

```ts
ENABLED: boolean;
```

###### BLOOM.STRENGTH

```ts
STRENGTH: number;
```

###### BLOOM.RADIUS

```ts
RADIUS: number;
```

###### BLOOM.THRESHOLD

```ts
THRESHOLD: number;
```

###### VIGNETTE

```ts
VIGNETTE: object;
```

###### VIGNETTE.ENABLED

```ts
ENABLED: boolean;
```

###### VIGNETTE.DARKNESS

```ts
DARKNESS: number;
```

###### VIGNETTE.OFFSET

```ts
OFFSET: number;
```

###### CHROMATIC\_ABERRATION

```ts
CHROMATIC_ABERRATION: object;
```

###### CHROMATIC\_ABERRATION.ENABLED

```ts
ENABLED: boolean;
```

###### CHROMATIC\_ABERRATION.STRENGTH

```ts
STRENGTH: number;
```

###### CHROMATIC\_ABERRATION.SCALE

```ts
SCALE: number;
```

###### FILM\_GRAIN

```ts
FILM_GRAIN: object;
```

###### FILM\_GRAIN.ENABLED

```ts
ENABLED: boolean;
```

###### FILM\_GRAIN.INTENSITY

```ts
INTENSITY: number;
```

###### ATMOSPHERE

```ts
ATMOSPHERE: object;
```

###### ATMOSPHERE.MODE

```ts
MODE: "Airglow" = DEFAULT_SP_GUI.ATMOSPHERE.MODE;
```

###### ATMOSPHERE.DENSITY

```ts
DENSITY: 20 = DEFAULT_SP_GUI.ATMOSPHERE.DENSITY;
```

###### ATMOSPHERE.RAYLEIGH\_COLOR

```ts
RAYLEIGH_COLOR: 3373055 = DEFAULT_SP_GUI.ATMOSPHERE.RAYLEIGH_COLOR;
```

###### ATMOSPHERE.MIE\_COLOR

```ts
MIE_COLOR: 866122 = DEFAULT_SP_GUI.ATMOSPHERE.MIE_COLOR;
```

###### ATMOSPHERE.TWILIGHT\_COLOR

```ts
TWILIGHT_COLOR: 16733491 = DEFAULT_SP_GUI.ATMOSPHERE.TWILIGHT_COLOR;
```

###### ATMOSPHERE.AIRGLOW\_COLOR

```ts
AIRGLOW_COLOR: 4521813 = DEFAULT_SP_GUI.ATMOSPHERE.AIRGLOW_COLOR;
```

###### CLOUD\_SHADOWS

```ts
CLOUD_SHADOWS: object;
```

###### CLOUD\_SHADOWS.DISTANCE

```ts
DISTANCE: 1.2 = DEFAULT_SP_GUI.CLOUD_SHADOWS.DISTANCE;
```

###### CLOUD\_SHADOWS.INTENSITY

```ts
INTENSITY: 0.8 = DEFAULT_SP_GUI.CLOUD_SHADOWS.INTENSITY;
```

###### CLOUD\_SHADOWS.COLOR

```ts
COLOR: 3358809 = DEFAULT_SP_GUI.CLOUD_SHADOWS.COLOR;
```

###### OCEAN

```ts
OCEAN: object;
```

###### OCEAN.ROUGHNESS

```ts
ROUGHNESS: 0 = DEFAULT_SP_GUI.OCEAN.ROUGHNESS;
```

###### OCEAN.METALNESS

```ts
METALNESS: number;
```

###### EARTH

```ts
EARTH: object;
```

###### EARTH.ROTATION\_SPEED

```ts
ROTATION_SPEED: number;
```

###### EARTH.BUMP\_SCALE

```ts
BUMP_SCALE: number;
```

###### EARTH.TERRAIN\_SHADOW\_INTENSITY

```ts
TERRAIN_SHADOW_INTENSITY: number;
```

###### EARTH.TERRAIN\_SHADOW\_OFFSET

```ts
TERRAIN_SHADOW_OFFSET: number;
```

###### EARTH.TRUE\_INCLINATION

```ts
TRUE_INCLINATION: boolean;
```

###### CAMERA

```ts
CAMERA: object;
```

###### CAMERA.FOV

```ts
FOV: number;
```

###### CAMERA.POSITION

```ts
POSITION: 
  | Readonly<{
  x: 21.856154240766372;
  y: -3.6712368727086657;
  z: 20.125738437375286;
}>
  | {
  x: number;
  y: number;
  z: number;
};
```

###### CAMERA.TARGET

```ts
TARGET: 
  | Readonly<{
  x: 0;
  y: 0;
  z: 0;
}>
  | {
  x: number;
  y: number;
  z: number;
};
```

###### CAMERA.AUTO\_ROTATE

```ts
AUTO_ROTATE: boolean;
```

###### CAMERA.AUTO\_ROTATE\_SPEED

```ts
AUTO_ROTATE_SPEED: number;
```

###### ENVIRONMENT

```ts
ENVIRONMENT: object;
```

###### ENVIRONMENT.SKYBOX\_INTENSITY

```ts
SKYBOX_INTENSITY: 0.5 = DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_INTENSITY;
```

###### ENVIRONMENT.SKYBOX\_AZIMUTH

```ts
SKYBOX_AZIMUTH: 1.75 = DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_AZIMUTH;
```

###### ENVIRONMENT.SKYBOX\_PITCH

```ts
SKYBOX_PITCH: 0 = DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_PITCH;
```

###### ENVIRONMENT.SKYBOX\_ROLL

```ts
SKYBOX_ROLL: 0 = DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_ROLL;
```

###### ENVIRONMENT.DARK\_SIDE\_BRIGHTNESS

```ts
DARK_SIDE_BRIGHTNESS: 0.055 = DEFAULT_SP_GUI.ENVIRONMENT.DARK_SIDE_BRIGHTNESS;
```

###### ENVIRONMENT.CITY\_LIGHTS

```ts
CITY_LIGHTS: 6.3 = DEFAULT_SP_GUI.ENVIRONMENT.CITY_LIGHTS;
```

###### DEBUG

```ts
DEBUG: object;
```

###### DEBUG.STATS

```ts
STATS: false = DEFAULT_SP_GUI.DEBUG.STATS;
```

###### DEBUG.RESOLUTION\_SCALE

```ts
RESOLUTION_SCALE: number = s.render.resolutionScale;
```

###### SUN

```ts
SUN: object;
```

###### SUN.INTENSITY

```ts
INTENSITY: number;
```

###### SUN.COLOR

```ts
COLOR: 16777215 = DEFAULT_SP_GUI.SUN.COLOR;
```

###### SUN.AUTO\_ROTATE

```ts
AUTO_ROTATE: boolean;
```

###### SUN.SPEED

```ts
SPEED: number;
```

###### SUN.INCLINATION

```ts
INCLINATION: number;
```

## Methods

### init()

```ts
init(): Promise<void>;
```

Defined in: [experiments/earth-playground/earth-background.ts:81](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth-background.ts#L81)

#### Returns

`Promise`\<`void`\>

***

### setReducedMotion()

```ts
setReducedMotion(reduced): void;
```

Defined in: [experiments/earth-playground/earth-background.ts:95](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth-background.ts#L95)

Pause/resume the render loop for prefers-reduced-motion. The last frame
stays on screen (preserveDrawingBuffer), so pausing never blanks the
background — motion just stops.

#### Parameters

##### reduced

`boolean`

#### Returns

`void`

***

### setTheme()

```ts
setTheme(isDark): void;
```

Defined in: [experiments/earth-playground/earth-background.ts:114](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth-background.ts#L114)

Store the UI theme for the sun-rotation theme feature (not yet wired
into the scene — kept as public API for the playground controls).

#### Parameters

##### isDark

`boolean`

#### Returns

`void`

***

### setVisible()

```ts
setVisible(visible): void;
```

Defined in: [experiments/earth-playground/earth-background.ts:123](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth-background.ts#L123)

Show/hide the canvas and stop the loop while hidden — the playground
page is the only consumer, so hiding releases GPU work entirely.

#### Parameters

##### visible

`boolean`

#### Returns

`void`

***

### takeScreenshot()

```ts
takeScreenshot(): Promise<void>;
```

Defined in: [experiments/earth-playground/earth-background.ts:144](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth-background.ts#L144)

Renders one frame at 2× resolutionScale and downloads it as PNG.
Temporarily bumps pixel ratio → resize → render → capture → restore,
so the saved image is sharper than the live viewport.

#### Returns

`Promise`\<`void`\>

***

### destroy()

```ts
destroy(): void;
```

Defined in: [experiments/earth-playground/earth-background.ts:154](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth-background.ts#L154)

Tears down the engine: stops RAF, unbinds resize, releases the
renderer's GPU context and the controls' DOM listeners. Idempotent —
safe to call while bootstrap awaits are still in flight (they check
disposed after each await and bail).

#### Returns

`void`

***

### updateBloom()

```ts
updateBloom(o?): void;
```

Defined in: [experiments/earth-playground/earth-background.ts:201](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth-background.ts#L201)

#### Parameters

##### o?

###### enabled?

`boolean`

###### strength?

`number`

###### radius?

`number`

###### threshold?

`number`

#### Returns

`void`

***

### updateColorGrading()

```ts
updateColorGrading(o?): void;
```

Defined in: [experiments/earth-playground/earth-background.ts:207](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth-background.ts#L207)

#### Parameters

##### o?

###### contrast?

`number`

###### saturation?

`number`

###### blackLevel?

`number`

###### blueGreenBoost?

`number`

#### Returns

`void`

***

### updateCamera()

```ts
updateCamera(o?): void;
```

Defined in: [experiments/earth-playground/earth-background.ts:213](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth-background.ts#L213)

#### Parameters

##### o?

###### fov?

`number`

###### autoRotate?

`boolean`

###### autoRotateSpeed?

`number`

#### Returns

`void`

***

### updateEarth()

```ts
updateEarth(o?): void;
```

Defined in: [experiments/earth-playground/earth-background.ts:217](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth-background.ts#L217)

#### Parameters

##### o?

###### rotationSpeed?

`number`

###### trueInclination?

`boolean`

#### Returns

`void`

***

### updateEarthMaterial()

```ts
updateEarthMaterial(o?): void;
```

Defined in: [experiments/earth-playground/earth-background.ts:221](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth-background.ts#L221)

#### Parameters

##### o?

###### waterMetalness?

`number`

###### waterRoughness?

`number`

###### bumpScale?

`number`

###### terrainShadowIntensity?

`number`

###### terrainShadowOffset?

`number`

#### Returns

`void`

***

### updateVignette()

```ts
updateVignette(o?): void;
```

Defined in: [experiments/earth-playground/earth-background.ts:233](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth-background.ts#L233)

#### Parameters

##### o?

###### enabled?

`boolean`

###### darkness?

`number`

###### offset?

`number`

#### Returns

`void`

***

### updateChromatic()

```ts
updateChromatic(o?): void;
```

Defined in: [experiments/earth-playground/earth-background.ts:237](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth-background.ts#L237)

#### Parameters

##### o?

###### enabled?

`boolean`

###### strength?

`number`

###### scale?

`number`

#### Returns

`void`

***

### updateRender()

```ts
updateRender(o?): void;
```

Defined in: [experiments/earth-playground/earth-background.ts:241](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth-background.ts#L241)

#### Parameters

##### o?

###### resolutionScale?

`number`

#### Returns

`void`

***

### updateFilm()

```ts
updateFilm(o?): void;
```

Defined in: [experiments/earth-playground/earth-background.ts:245](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth-background.ts#L245)

#### Parameters

##### o?

###### enabled?

`boolean`

###### intensity?

`number`

#### Returns

`void`

***

### updateSun()

```ts
updateSun(o?): void;
```

Defined in: [experiments/earth-playground/earth-background.ts:249](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth-background.ts#L249)

#### Parameters

##### o?

###### autoRotate?

`boolean`

###### speed?

`number`

###### angle?

`number`

#### Returns

`void`

***

### getCameraState()

```ts
getCameraState(): 
  | {
  position: {
     x: number;
     y: number;
     z: number;
  };
  target: {
     x: number;
     y: number;
     z: number;
  };
}
  | null;
```

Defined in: [experiments/earth-playground/earth-background.ts:257](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth-background.ts#L257)

Current camera position + orbit target, rounded to 2 decimals — used
to persist/restore the view in the playground's settings snapshot.

#### Returns

  \| \{
  `position`: \{
     `x`: `number`;
     `y`: `number`;
     `z`: `number`;
  \};
  `target`: \{
     `x`: `number`;
     `y`: `number`;
     `z`: `number`;
  \};
\}
  \| `null`

***

### resetView()

```ts
resetView(): void;
```

Defined in: [experiments/earth-playground/earth-background.ts:266](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth-background.ts#L266)

Restore the default framing: OrbitControls.reset() replays saveState()
(captured at bootstrap), then fov/position/target are pinned to
DEFAULT_SP_GUI.CAMERA in case the saved state drifted.

#### Returns

`void`
