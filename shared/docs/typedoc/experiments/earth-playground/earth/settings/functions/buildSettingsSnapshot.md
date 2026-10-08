[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [experiments/earth-playground/earth/settings](../README.md) / buildSettingsSnapshot

```ts
function buildSettingsSnapshot(s, cam): object;
```

Defined in: [experiments/earth-playground/earth/settings.ts:56](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/settings.ts#L56)

Snapshot of every tunable, shaped exactly like DEFAULT_SP_GUI so the
playground control panel can render sliders without knowing which
values are live uniforms vs build-time constants. `??` fallbacks cover
the pre-bootstrap window where the private state is still null.

## Parameters

### s

[`EarthSettingsState`](../interfaces/EarthSettingsState.md)

### cam

[`CameraState`](../interfaces/CameraState.md) \| `null`

## Returns

`object`

settings tree keyed like DEFAULT_SP_GUI

### SHOW

```ts
SHOW: boolean = true;
```

### COLOR\_GRADING

```ts
COLOR_GRADING: object;
```

#### COLOR\_GRADING.CONTRAST

```ts
CONTRAST: number;
```

#### COLOR\_GRADING.SATURATION

```ts
SATURATION: number;
```

#### COLOR\_GRADING.BLACK\_LEVEL

```ts
BLACK_LEVEL: number;
```

#### COLOR\_GRADING.BLUE\_GREEN\_BOOST

```ts
BLUE_GREEN_BOOST: number;
```

### MOON

```ts
MOON: object;
```

#### MOON.ENABLED

```ts
ENABLED: boolean;
```

#### MOON.SPEED

```ts
SPEED: number;
```

#### MOON.DISTANCE

```ts
DISTANCE: number;
```

#### MOON.INCLINATION

```ts
INCLINATION: number;
```

### LENS\_FLARE

```ts
LENS_FLARE: object;
```

#### LENS\_FLARE.ENABLED

```ts
ENABLED: true = DEFAULT_SP_GUI.LENS_FLARE.ENABLED;
```

#### LENS\_FLARE.INTENSITY

```ts
INTENSITY: 0.15 = DEFAULT_SP_GUI.LENS_FLARE.INTENSITY;
```

### ANAMORPHIC

```ts
ANAMORPHIC: object;
```

#### ANAMORPHIC.ENABLED

```ts
ENABLED: false = DEFAULT_SP_GUI.ANAMORPHIC.ENABLED;
```

#### ANAMORPHIC.INTENSITY

```ts
INTENSITY: 0.5 = DEFAULT_SP_GUI.ANAMORPHIC.INTENSITY;
```

#### ANAMORPHIC.THICKNESS

```ts
THICKNESS: 2 = DEFAULT_SP_GUI.ANAMORPHIC.THICKNESS;
```

#### ANAMORPHIC.SIZE

```ts
SIZE: 0.2 = DEFAULT_SP_GUI.ANAMORPHIC.SIZE;
```

#### ANAMORPHIC.COLOR

```ts
COLOR: 16777215 = DEFAULT_SP_GUI.ANAMORPHIC.COLOR;
```

#### ANAMORPHIC.INNER\_FADE

```ts
INNER_FADE: 0.08 = DEFAULT_SP_GUI.ANAMORPHIC.INNER_FADE;
```

#### ANAMORPHIC.OUTER\_FADE

```ts
OUTER_FADE: 0.08 = DEFAULT_SP_GUI.ANAMORPHIC.OUTER_FADE;
```

### BLOOM

```ts
BLOOM: object;
```

#### BLOOM.ENABLED

```ts
ENABLED: boolean;
```

#### BLOOM.STRENGTH

```ts
STRENGTH: number;
```

#### BLOOM.RADIUS

```ts
RADIUS: number;
```

#### BLOOM.THRESHOLD

```ts
THRESHOLD: number;
```

### VIGNETTE

```ts
VIGNETTE: object;
```

#### VIGNETTE.ENABLED

```ts
ENABLED: boolean;
```

#### VIGNETTE.DARKNESS

```ts
DARKNESS: number;
```

#### VIGNETTE.OFFSET

```ts
OFFSET: number;
```

### CHROMATIC\_ABERRATION

```ts
CHROMATIC_ABERRATION: object;
```

#### CHROMATIC\_ABERRATION.ENABLED

```ts
ENABLED: boolean;
```

#### CHROMATIC\_ABERRATION.STRENGTH

```ts
STRENGTH: number;
```

#### CHROMATIC\_ABERRATION.SCALE

```ts
SCALE: number;
```

### FILM\_GRAIN

```ts
FILM_GRAIN: object;
```

#### FILM\_GRAIN.ENABLED

```ts
ENABLED: boolean;
```

#### FILM\_GRAIN.INTENSITY

```ts
INTENSITY: number;
```

### ATMOSPHERE

```ts
ATMOSPHERE: object;
```

#### ATMOSPHERE.MODE

```ts
MODE: "Airglow" = DEFAULT_SP_GUI.ATMOSPHERE.MODE;
```

#### ATMOSPHERE.DENSITY

```ts
DENSITY: 20 = DEFAULT_SP_GUI.ATMOSPHERE.DENSITY;
```

#### ATMOSPHERE.RAYLEIGH\_COLOR

```ts
RAYLEIGH_COLOR: 3373055 = DEFAULT_SP_GUI.ATMOSPHERE.RAYLEIGH_COLOR;
```

#### ATMOSPHERE.MIE\_COLOR

```ts
MIE_COLOR: 866122 = DEFAULT_SP_GUI.ATMOSPHERE.MIE_COLOR;
```

#### ATMOSPHERE.TWILIGHT\_COLOR

```ts
TWILIGHT_COLOR: 16733491 = DEFAULT_SP_GUI.ATMOSPHERE.TWILIGHT_COLOR;
```

#### ATMOSPHERE.AIRGLOW\_COLOR

```ts
AIRGLOW_COLOR: 4521813 = DEFAULT_SP_GUI.ATMOSPHERE.AIRGLOW_COLOR;
```

### CLOUD\_SHADOWS

```ts
CLOUD_SHADOWS: object;
```

#### CLOUD\_SHADOWS.DISTANCE

```ts
DISTANCE: 1.2 = DEFAULT_SP_GUI.CLOUD_SHADOWS.DISTANCE;
```

#### CLOUD\_SHADOWS.INTENSITY

```ts
INTENSITY: 0.8 = DEFAULT_SP_GUI.CLOUD_SHADOWS.INTENSITY;
```

#### CLOUD\_SHADOWS.COLOR

```ts
COLOR: 3358809 = DEFAULT_SP_GUI.CLOUD_SHADOWS.COLOR;
```

### OCEAN

```ts
OCEAN: object;
```

#### OCEAN.ROUGHNESS

```ts
ROUGHNESS: 0 = DEFAULT_SP_GUI.OCEAN.ROUGHNESS;
```

#### OCEAN.METALNESS

```ts
METALNESS: number;
```

### EARTH

```ts
EARTH: object;
```

#### EARTH.ROTATION\_SPEED

```ts
ROTATION_SPEED: number;
```

#### EARTH.BUMP\_SCALE

```ts
BUMP_SCALE: number;
```

#### EARTH.TERRAIN\_SHADOW\_INTENSITY

```ts
TERRAIN_SHADOW_INTENSITY: number;
```

#### EARTH.TERRAIN\_SHADOW\_OFFSET

```ts
TERRAIN_SHADOW_OFFSET: number;
```

#### EARTH.TRUE\_INCLINATION

```ts
TRUE_INCLINATION: boolean;
```

### CAMERA

```ts
CAMERA: object;
```

#### CAMERA.FOV

```ts
FOV: number;
```

#### CAMERA.POSITION

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

#### CAMERA.TARGET

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

#### CAMERA.AUTO\_ROTATE

```ts
AUTO_ROTATE: boolean;
```

#### CAMERA.AUTO\_ROTATE\_SPEED

```ts
AUTO_ROTATE_SPEED: number;
```

### ENVIRONMENT

```ts
ENVIRONMENT: object;
```

#### ENVIRONMENT.SKYBOX\_INTENSITY

```ts
SKYBOX_INTENSITY: 0.5 = DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_INTENSITY;
```

#### ENVIRONMENT.SKYBOX\_AZIMUTH

```ts
SKYBOX_AZIMUTH: 1.75 = DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_AZIMUTH;
```

#### ENVIRONMENT.SKYBOX\_PITCH

```ts
SKYBOX_PITCH: 0 = DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_PITCH;
```

#### ENVIRONMENT.SKYBOX\_ROLL

```ts
SKYBOX_ROLL: 0 = DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_ROLL;
```

#### ENVIRONMENT.DARK\_SIDE\_BRIGHTNESS

```ts
DARK_SIDE_BRIGHTNESS: 0.055 = DEFAULT_SP_GUI.ENVIRONMENT.DARK_SIDE_BRIGHTNESS;
```

#### ENVIRONMENT.CITY\_LIGHTS

```ts
CITY_LIGHTS: 6.3 = DEFAULT_SP_GUI.ENVIRONMENT.CITY_LIGHTS;
```

### DEBUG

```ts
DEBUG: object;
```

#### DEBUG.STATS

```ts
STATS: false = DEFAULT_SP_GUI.DEBUG.STATS;
```

#### DEBUG.RESOLUTION\_SCALE

```ts
RESOLUTION_SCALE: number = s.render.resolutionScale;
```

### SUN

```ts
SUN: object;
```

#### SUN.INTENSITY

```ts
INTENSITY: number;
```

#### SUN.COLOR

```ts
COLOR: 16777215 = DEFAULT_SP_GUI.SUN.COLOR;
```

#### SUN.AUTO\_ROTATE

```ts
AUTO_ROTATE: boolean;
```

#### SUN.SPEED

```ts
SPEED: number;
```

#### SUN.INCLINATION

```ts
INCLINATION: number;
```
