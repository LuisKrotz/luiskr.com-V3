[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/browser/detect](../README.md) / canUseWebGPU

```ts
function canUseWebGPU(): boolean;
```

Defined in: [core/browser/detect.ts:87](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/browser/detect.ts#L87)

True when the engine may expose a usable WebGPU adapter. The check is
`!== false` (not `=== true`) because undefined means "no data" — absence
of the quirk flag must not disable WebGPU for unlisted engines.

## Returns

`boolean`

Whether the WebGPU init path should run.
