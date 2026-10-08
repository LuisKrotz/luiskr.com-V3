[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [playground/space/controls](../README.md) / PARAM\_HANDLERS

```ts
const PARAM_HANDLERS: Readonly<Record<string, (_bg, v) => void>>
```

Defined in: [experiments/earth-playground/space/controls.ts:345](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/experiments/earth-playground/space/controls.ts#L345)

Param → EarthBackground setter dispatch. Each entry adapts a raw UI
value (slider units / checkbox boolean) into the matching engine update
call — the UI never touches engine internals directly. EARTH_SPEED
divides by 10000 because the slider range 0–50 is human-friendly while
the engine expects radians-per-frame (1 ⇒ 0.0001 rad/frame ≈ slow
cinematic spin).
