[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [playground/earth/setup/bootstrap](../README.md) / warmUpShaders

```ts
function warmUpShaders(renderer, s): Promise<void>
```

Defined in: [src/playground/earth/setup/bootstrap.ts:33](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/setup/bootstrap.ts#L33)

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
