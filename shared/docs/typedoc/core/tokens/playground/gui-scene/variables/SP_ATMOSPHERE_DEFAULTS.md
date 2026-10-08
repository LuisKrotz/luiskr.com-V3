[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/playground/gui-scene](../README.md) / SP\_ATMOSPHERE\_DEFAULTS

```ts
const SP_ATMOSPHERE_DEFAULTS: Readonly<{
  MODE: "Airglow";
  DENSITY: 20;
  RAYLEIGH_COLOR: 3373055;
  MIE_COLOR: 866122;
  TWILIGHT_COLOR: 16733491;
  AIRGLOW_COLOR: 4521813;
}>;
```

Defined in: [core/tokens/playground/gui-scene.ts:25](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/playground/gui-scene.ts#L25)

Frozen sp atmosphere map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
