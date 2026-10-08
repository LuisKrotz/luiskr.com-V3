[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/data/ui-keys](../README.md) / STATS\_UI\_KEYS

```ts
const STATS_UI_KEYS: Readonly<{
  STATS_TITLE: "statsHud.title";
  STATS_FPS: "statsHud.fps";
  STATS_CPU: "statsHud.cpu";
  STATS_NET: "statsHud.network";
  STATS_LAT: "statsHud.latency";
  STATS_REQ: "statsHud.requests";
  STATS_MEM: "statsHud.memory";
  STATS_GPU: "statsHud.gpu";
}>;
```

Defined in: [core/tokens/data/ui-keys.ts:85](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/data/ui-keys.ts#L85)

Frozen stats ui key map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
