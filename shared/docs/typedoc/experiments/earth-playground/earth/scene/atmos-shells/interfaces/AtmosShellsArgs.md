[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [experiments/earth-playground/earth/scene/atmos-shells](../README.md) / AtmosShellsArgs

Defined in: [experiments/earth-playground/earth/scene/atmos-shells.ts:16](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/scene/atmos-shells.ts#L16)

Dependencies injected by the scene assembler (keeps this module mockable).

## Properties

### THREE

```ts
THREE: __module;
```

Defined in: [experiments/earth-playground/earth/scene/atmos-shells.ts:18](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/scene/atmos-shells.ts#L18)

The three.js namespace — geometry/material/mesh constructors.

***

### TSL

```ts
TSL: __module;
```

Defined in: [experiments/earth-playground/earth/scene/atmos-shells.ts:20](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/scene/atmos-shells.ts#L20)

The TSL node-graph namespace (compiled to WGSL/GLSL by the renderer).

***

### mats

```ts
mats: object;
```

Defined in: [experiments/earth-playground/earth/scene/atmos-shells.ts:22](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/scene/atmos-shells.ts#L22)

The node material constructor for the shell materials.

#### MeshBasicNodeMaterial

```ts
MeshBasicNodeMaterial: typeof MeshBasicNodeMaterial;
```

***

### sunDir

```ts
sunDir: UniformNode<"vec3", Vector3>;
```

Defined in: [experiments/earth-playground/earth/scene/atmos-shells.ts:24](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/scene/atmos-shells.ts#L24)

Shared sun-direction uniform the scattering phase functions read.
