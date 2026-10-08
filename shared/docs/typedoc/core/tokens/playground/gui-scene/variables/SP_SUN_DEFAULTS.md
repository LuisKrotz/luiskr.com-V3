[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/playground/gui-scene](../README.md) / SP\_SUN\_DEFAULTS

```ts
const SP_SUN_DEFAULTS: Readonly<{
  INTENSITY: 2.5;
  COLOR: 16777215;
  AUTO_ROTATE: true;
  SPEED: 0.05;
  INCLINATION: 0.076;
}>;
```

Defined in: [core/tokens/playground/gui-scene.ts:108](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/playground/gui-scene.ts#L108)

Frozen sp sun map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
