[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/playground/gui-scene](../README.md) / SP\_ENVIRONMENT\_DEFAULTS

```ts
const SP_ENVIRONMENT_DEFAULTS: Readonly<{
  SKYBOX_INTENSITY: 0.5;
  SKYBOX_AZIMUTH: 1.75;
  SKYBOX_PITCH: 0;
  SKYBOX_ROLL: 0;
  DARK_SIDE_BRIGHTNESS: 0.055;
  CITY_LIGHTS: 6.3;
}>;
```

Defined in: [core/tokens/playground/gui-scene.ts:94](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/playground/gui-scene.ts#L94)

Frozen sp environment map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
