[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/playground/gui-scene](../README.md) / SP\_EARTH\_DEFAULTS

```ts
const SP_EARTH_DEFAULTS: Readonly<{
  ROTATION_SPEED: 0.0001;
  BUMP_SCALE: 5;
  TERRAIN_SHADOW_INTENSITY: 1;
  TERRAIN_SHADOW_OFFSET: 0.002;
  TRUE_INCLINATION: true;
}>;
```

Defined in: [core/tokens/playground/gui-scene.ts:60](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/playground/gui-scene.ts#L60)

Frozen sp earth map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
