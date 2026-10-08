[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [cms/media-convert/consts](../README.md) / PHASE

```ts
const PHASE: Readonly<{
  IDLE: "idle";
  UPLOADING: "uploading";
  CONVERTING: "converting";
  DONE: "done";
  ERROR: "error";
}>;
```

Defined in: [cms/media-convert/consts.ts:17](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/consts.ts#L17)

Job state machine: idle → uploading (per-file PUTs) → converting
(server pipeline) → done | error. The component render switches on this.
