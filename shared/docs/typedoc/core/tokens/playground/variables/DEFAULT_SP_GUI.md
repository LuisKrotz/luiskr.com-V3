[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/tokens/playground](../README.md) / DEFAULT\_SP\_GUI

```ts
const DEFAULT_SP_GUI: Readonly<{
  SHOW: true;
  COLOR_GRADING: Readonly<{
     CONTRAST: 1;
     SATURATION: 1.5;
     BLACK_LEVEL: 0.015;
     BLUE_GREEN_BOOST: 0;
  }>;
  MOON: Readonly<{
     ENABLED: true;
     SPEED: 0.0002;
     DISTANCE: 50;
     INCLINATION: 0;
  }>;
  LENS_FLARE: Readonly<{
     ENABLED: true;
     INTENSITY: 0.15;
  }>;
  ANAMORPHIC: Readonly<{
     ENABLED: false;
     INTENSITY: 0.5;
     THICKNESS: 2;
     SIZE: 0.2;
     COLOR: 16777215;
     INNER_FADE: 0.08;
     OUTER_FADE: 0.08;
  }>;
  BLOOM: Readonly<{
     ENABLED: false;
     STRENGTH: 0.1;
     RADIUS: 0.3;
     THRESHOLD: 0.9;
  }>;
  VIGNETTE: Readonly<{
     ENABLED: false;
     DARKNESS: 1;
     OFFSET: 0.5;
  }>;
  CHROMATIC_ABERRATION: Readonly<{
     ENABLED: false;
     STRENGTH: 0.25;
     SCALE: 0.5;
  }>;
  FILM_GRAIN: Readonly<{
     ENABLED: false;
     INTENSITY: 0.25;
  }>;
  ATMOSPHERE: Readonly<{
     MODE: "Airglow";
     DENSITY: 20;
     RAYLEIGH_COLOR: 3373055;
     MIE_COLOR: 866122;
     TWILIGHT_COLOR: 16733491;
     AIRGLOW_COLOR: 4521813;
  }>;
  CLOUD_SHADOWS: Readonly<{
     DISTANCE: 1.2;
     INTENSITY: 0.8;
     COLOR: 3358809;
  }>;
  OCEAN: Readonly<{
     ROUGHNESS: 0;
     METALNESS: 0;
  }>;
  EARTH: Readonly<{
     ROTATION_SPEED: 0.0001;
     BUMP_SCALE: 5;
     TERRAIN_SHADOW_INTENSITY: 1;
     TERRAIN_SHADOW_OFFSET: 0.002;
     TRUE_INCLINATION: true;
  }>;
  CAMERA: Readonly<{
     FOV: 45;
     POSITION: Readonly<{
        x: 21.856154240766372;
        y: -3.6712368727086657;
        z: 20.125738437375286;
     }>;
     TARGET: Readonly<{
        x: 0;
        y: 0;
        z: 0;
     }>;
     AUTO_ROTATE: false;
     AUTO_ROTATE_SPEED: 0.05;
  }>;
  ENVIRONMENT: Readonly<{
     SKYBOX_INTENSITY: 0.5;
     SKYBOX_AZIMUTH: 1.75;
     SKYBOX_PITCH: 0;
     SKYBOX_ROLL: 0;
     DARK_SIDE_BRIGHTNESS: 0.055;
     CITY_LIGHTS: 6.3;
  }>;
  DEBUG: Readonly<{
     STATS: false;
     RESOLUTION_SCALE: 2;
  }>;
  SUN: Readonly<{
     INTENSITY: 2.5;
     COLOR: 16777215;
     AUTO_ROTATE: true;
     SPEED: 0.05;
     INCLINATION: 0.076;
  }>;
}>;
```

Defined in: [core/tokens/playground.ts:46](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/playground.ts#L46)

Engine start state for the Earth Playground — the hardcoded baseline the
scene boots with before any CMS `defaults` node or user localStorage
overrides merge in. Values were hand-tuned visually; each block maps to
one `earth-background.js` subsystem (post-fx chain, moon orbit, sun,
atmosphere scattering, ocean BRDF, camera orbit).
