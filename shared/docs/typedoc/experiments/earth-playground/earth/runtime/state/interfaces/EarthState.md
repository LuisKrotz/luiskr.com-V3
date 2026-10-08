[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [experiments/earth-playground/earth/runtime/state](../README.md) / EarthState

Defined in: [experiments/earth-playground/earth/runtime/state.ts:114](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L114)

The single mutable bag for the whole engine — every async-created GPU
handle is nullable because bootstrap fills them progressively and a
mid-boot dispose must see exactly what's live.

## Properties

### animId

```ts
animId: number | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:116](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L116)

RAF handle for the render loop; null while paused/reduced-motion.

***

### disposed

```ts
disposed: boolean;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:119](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L119)

Set by destroy(); checked after every await so a mid-load dispose
 aborts scene assembly without touching the GPU again.

***

### reduced

```ts
reduced: boolean;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:121](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L121)

Mirrors the store's reduced-motion flag; freezes the loop.

***

### isDarkTheme

```ts
isDarkTheme: boolean;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:123](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L123)

UI theme flag — stored for the sun-rotation feature (not yet wired).

***

### onReady

```ts
onReady: (() => void) | null | undefined;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:124](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L124)

***

### onProgress

```ts
onProgress: EarthProgressFn | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:125](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L125)

***

### canvas

```ts
canvas: HTMLCanvasElement | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:126](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L126)

***

### renderer

```ts
renderer: WebGPURenderer | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:127](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L127)

***

### scene

```ts
scene: Scene<Object3DEventMap> | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:128](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L128)

***

### camera

```ts
camera: PerspectiveCamera | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:129](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L129)

***

### controls

```ts
controls: OrbitControls | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:130](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L130)

***

### pipeline

```ts
pipeline: RenderPipeline | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:131](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L131)

***

### earth

```ts
earth: Group<Object3DEventMap> | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:132](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L132)

***

### moon

```ts
moon: LOD<Object3DEventMap> | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:133](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L133)

***

### sunMesh

```ts
sunMesh: 
  | Mesh<BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>, Material<MaterialEventMap> | Material<MaterialEventMap>[], Object3DEventMap>
  | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:134](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L134)

***

### sunLight

```ts
sunLight: DirectionalLight | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:135](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L135)

***

### loader

```ts
loader: TextureLoader | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:136](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L136)

***

### cloudsMesh

```ts
cloudsMesh: 
  | Mesh<BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>, Material<MaterialEventMap> | Material<MaterialEventMap>[], Object3DEventMap>
  | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:137](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L137)

***

### sunDirU

```ts
sunDirU: UniformNode<"vec3", Vector3> | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:138](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L138)

***

### moonPosU

```ts
moonPosU: UniformNode<"vec3", Vector3> | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:139](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L139)

***

### cgUniforms

```ts
cgUniforms: Record<string, UniformNode<"float", number>> | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:140](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L140)

***

### caUniforms

```ts
caUniforms: Record<string, UniformNode<"float", number>> | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:141](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L141)

***

### vigUniforms

```ts
vigUniforms: Record<string, UniformNode<"float", number>> | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:142](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L142)

***

### filmU

```ts
filmU: UniformNode<"float", number> | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:143](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L143)

***

### bloomPass

```ts
bloomPass: BloomNode | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:144](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L144)

***

### earthMatUniforms

```ts
earthMatUniforms: Record<string, UniformNode<"float", number>> | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:145](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L145)

***

### sun

```ts
sun: EarthSunState | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:146](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L146)

***

### moonCfg

```ts
moonCfg: EarthMoonState | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:147](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L147)

***

### earthSpin

```ts
earthSpin: EarthSpinState | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:148](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L148)

***

### bloom

```ts
bloom: EarthBloomState | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:149](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L149)

***

### ca

```ts
ca: EarthCaState | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:150](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L150)

***

### vig

```ts
vig: EarthVigState | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:151](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L151)

***

### film

```ts
film: EarthFilmState | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:152](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L152)

***

### cg

```ts
cg: EarthGradeState | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:153](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L153)

***

### render

```ts
render: object;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:154](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L154)

#### resolutionScale

```ts
resolutionScale: number;
```

***

### onResize

```ts
onResize: (() => void) | null;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:156](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L156)

Stable resize-listener identity so destroy() can removeEventListener.
