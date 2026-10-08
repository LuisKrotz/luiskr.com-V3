[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [experiments/earth-playground/earth/scene/surface-material](../README.md) / SurfaceMaterialResult

Defined in: [experiments/earth-playground/earth/scene/surface-material.ts:41](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/scene/surface-material.ts#L41)

The built material plus the uniforms/nodes other shells reuse.

## Properties

### mat

```ts
mat: MeshPhysicalNodeMaterial;
```

Defined in: [experiments/earth-playground/earth/scene/surface-material.ts:43](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/scene/surface-material.ts#L43)

The configured physical node material for the Earth mesh.

***

### earthMatUniforms

```ts
earthMatUniforms: Record<string, UniformNode<"float", number>>;
```

Defined in: [experiments/earth-playground/earth/scene/surface-material.ts:45](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/scene/surface-material.ts#L45)

Slider-bound uniforms (GUI writes straight into .value).

***

### shared

```ts
shared: object;
```

Defined in: [experiments/earth-playground/earth/scene/surface-material.ts:47](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/scene/surface-material.ts#L47)

Lighting terms shared with the cloud/atmosphere shells so the day/night/eclipse model stays consistent.

#### twilTint

```ts
twilTint: unknown;
```

Twilight tint multiplier node.

#### eclDim

```ts
eclDim: unknown;
```

Eclipse dimming multiplier node.

#### nightFade

```ts
nightFade: unknown;
```

0→1 night-side factor node.

#### darkBr

```ts
darkBr: UniformNode<"float", number>;
```

Dark-side ambient brightness uniform.

#### bumpFade

```ts
bumpFade: unknown;
```

Bump-strength fade node (kills normal map at twilight).
