[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [cms/media-convert/consts](../README.md) / PHASE

```ts
const PHASE: Readonly<{
  IDLE: 'idle'
  UPLOADING: 'uploading'
  CONVERTING: 'converting'
  DONE: 'done'
  ERROR: 'error'
}>
```

Defined in: [src/cms/media-convert/consts.ts:17](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/media-convert/consts.ts#L17)

Job state machine: idle → uploading (per-file PUTs) → converting
(server pipeline) → done | error. The component render switches on this.
