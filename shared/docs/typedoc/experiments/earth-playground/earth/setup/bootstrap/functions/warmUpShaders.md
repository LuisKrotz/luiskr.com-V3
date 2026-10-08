[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [experiments/earth-playground/earth/setup/bootstrap](../README.md) / warmUpShaders

```ts
function warmUpShaders(renderer, s): Promise<void>;
```

Defined in: [experiments/earth-playground/earth/setup/bootstrap.ts:33](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/setup/bootstrap.ts#L33)

Pre-compiles the scene's shader programs so the first visible frame doesn't
hitch on JIT. compileAsync failures (driver hiccups, lost device) are
non-fatal — the renderer recompiles lazily on first draw.

## Parameters

### renderer

`WebGPURenderer`

### s

[`EarthState`](../../../runtime/state/interfaces/EarthState.md)

## Returns

`Promise`\<`void`\>
