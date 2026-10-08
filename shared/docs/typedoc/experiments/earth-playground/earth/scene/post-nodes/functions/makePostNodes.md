[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [experiments/earth-playground/earth/scene/post-nodes](../README.md) / makePostNodes

```ts
function makePostNodes(TSL): object;
```

Defined in: [experiments/earth-playground/earth/scene/post-nodes.ts:34](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/scene/post-nodes.ts#L34)

Custom post nodes for the RenderPipeline output chain.

colorGrade math, per channel:
  1. contrast — c = (rgb − 0.5)·contrast + 0.5  → pivots around mid-grey
     so midtones stay put while shadows/highlights separate.
  2. saturation — mix(luma, c, sat) → luma uses Rec.601 weights
     (0.299/0.587/0.114): sat=1 is neutral, >1 pushes away from grey.
  3. blackLevel — max(c − bl, 0) → lifts the floor toward true black.
  4. blueGreenBoost — per-channel gain {1, 1+b·0.5, 1+b}: Earth imagery
     reads richer with boosted oceans (G half-strength, B full).

vignette math:
  d = |uv − 0.5|·2  → 0 at center, ~1.41 at corners.
  v = 1 − |d|·offset, clamped  → linear falloff scaled by offset.
  factor = mix(1, v^darkness, min(darkness,1)) → darkness doubles as
  both the curve exponent (shape) and the lerp weight (amount), so a
  single slider feels like a photographic vignette control.

## Parameters

### TSL

`__module`

three/tsl namespace

## Returns

`object`

### colorGradeNode

```ts
colorGradeNode: FnNode<[ProxiedObject<ColorGradeNodeArgs>], Node<"vec4">>;
```

### vignetteNode

```ts
vignetteNode: FnNode<[ProxiedObject<VignetteNodeArgs>], Node<"vec4">>;
```
