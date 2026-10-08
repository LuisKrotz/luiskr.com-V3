[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/classes/stats](../README.md) / STATS\_CLASSES

```ts
const STATS_CLASSES: Readonly<{
  STATS_HUD_BASE: "stats-hud";
  STATS_HUD_VISIBLE: "stats-hud--visible";
  STATS_HUD_SEGMENT: "stats-hud-segment";
  STATS_HUD_LABEL: "stats-hud-label";
  STATS_HUD_VALUE: "stats-hud-value";
  STATS_HUD_TOGGLE: "stats-hud-toggle";
  STATS_HUD_SWITCH: "stats-hud-switch";
  STATS_HUD_SWITCH_ON: "stats-hud-switch--on";
}>;
```

Defined in: [core/tokens/classes/stats.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/classes/stats.ts#L14)

Frozen stats class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
