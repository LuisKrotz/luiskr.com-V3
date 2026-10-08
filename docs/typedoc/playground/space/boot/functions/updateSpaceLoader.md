[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [playground/space/boot](../README.md) / updateSpaceLoader

```ts
function updateSpaceLoader(c, msg, pct): void
```

Defined in: [experiments/earth-playground/space/boot.ts:28](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/experiments/earth-playground/space/boot.ts#L28)

Mirrors an engine progress event into the loader overlay — message,
rounded percent text, and the bar's width style. All three nodes are
optional-chained so a partial loader render can't throw mid-boot.

## Parameters

### c

[`SpacePlayground`](../../../SpacePlayground/classes/SpacePlayground.md)

The SpacePlayground element.

### msg

`string`

Stage message from the engine ('loading textures', …).

### pct

`number`

Progress 0–100.

## Returns

`void`
