[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/data/ui-keys](../README.md) / ENGINE\_UI\_KEYS

```ts
const ENGINE_UI_KEYS: Readonly<{
  ENGINE_TITLE: "engine.title";
  ENGINE_NPU: "engine.npu";
  ENGINE_GPU: "engine.gpu";
  ENGINE_WASM: "engine.wasm";
  ENGINE_ON: "engine.on";
  ENGINE_OFF: "engine.off";
  ENGINE_CONTROLS: "engine.controls";
}>;
```

Defined in: [core/tokens/data/ui-keys.ts:111](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/data/ui-keys.ts#L111)

Frozen engine ui key map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
