[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [playground/earth/runtime/state](../README.md) / EarthState

Defined in: [src/playground/earth/runtime/state.ts:102](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L102)

earths state.

## Properties

### animId

```ts
animId: number | null
```

Defined in: [src/playground/earth/runtime/state.ts:104](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L104)

RAF handle for the render loop; null while paused/reduced-motion.

---

### disposed

```ts
disposed: boolean
```

Defined in: [src/playground/earth/runtime/state.ts:107](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L107)

Set by destroy(); checked after every await so a mid-load dispose
aborts scene assembly without touching the GPU again.

---

### reduced

```ts
reduced: boolean
```

Defined in: [src/playground/earth/runtime/state.ts:109](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L109)

Mirrors the store's reduced-motion flag; freezes the loop.

---

### isDarkTheme

```ts
isDarkTheme: boolean
```

Defined in: [src/playground/earth/runtime/state.ts:111](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L111)

UI theme flag — stored for the sun-rotation feature (not yet wired).

---

### onReady

```ts
onReady: (() => void) | null | undefined;
```

Defined in: [src/playground/earth/runtime/state.ts:112](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L112)

---

### onProgress

```ts
onProgress: EarthProgressFn | null
```

Defined in: [src/playground/earth/runtime/state.ts:113](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L113)

---

### canvas

```ts
canvas: HTMLCanvasElement | null
```

Defined in: [src/playground/earth/runtime/state.ts:114](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L114)

---

### renderer

```ts
renderer: WebGPURenderer | null
```

Defined in: [src/playground/earth/runtime/state.ts:115](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L115)

---

### scene

```ts
scene: Scene<Object3DEventMap> | null
```

Defined in: [src/playground/earth/runtime/state.ts:116](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L116)

---

### camera

```ts
camera: PerspectiveCamera | null
```

Defined in: [src/playground/earth/runtime/state.ts:117](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L117)

---

### controls

```ts
controls: OrbitControls | null
```

Defined in: [src/playground/earth/runtime/state.ts:118](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L118)

---

### pipeline

```ts
pipeline: RenderPipeline | null
```

Defined in: [src/playground/earth/runtime/state.ts:119](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L119)

---

### earth

```ts
earth: Group<Object3DEventMap> | null
```

Defined in: [src/playground/earth/runtime/state.ts:120](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L120)

---

### moon

```ts
moon: LOD<Object3DEventMap> | null
```

Defined in: [src/playground/earth/runtime/state.ts:121](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L121)

---

### sunMesh

```ts
sunMesh:
  | Mesh<BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>, Material<MaterialEventMap> | Material<MaterialEventMap>[], Object3DEventMap>
  | null;
```

Defined in: [src/playground/earth/runtime/state.ts:122](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L122)

---

### sunLight

```ts
sunLight: DirectionalLight | null
```

Defined in: [src/playground/earth/runtime/state.ts:123](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L123)

---

### loader

```ts
loader: TextureLoader | null
```

Defined in: [src/playground/earth/runtime/state.ts:124](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L124)

---

### cloudsMesh

```ts
cloudsMesh:
  | Mesh<BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>, Material<MaterialEventMap> | Material<MaterialEventMap>[], Object3DEventMap>
  | null;
```

Defined in: [src/playground/earth/runtime/state.ts:125](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L125)

---

### sunDirU

```ts
sunDirU: UniformNode<'vec3', Vector3> | null
```

Defined in: [src/playground/earth/runtime/state.ts:126](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L126)

---

### moonPosU

```ts
moonPosU: UniformNode<'vec3', Vector3> | null
```

Defined in: [src/playground/earth/runtime/state.ts:127](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L127)

---

### cgUniforms

```ts
cgUniforms: Record<string, UniformNode<'float', number>> | null
```

Defined in: [src/playground/earth/runtime/state.ts:128](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L128)

---

### caUniforms

```ts
caUniforms: Record<string, UniformNode<'float', number>> | null
```

Defined in: [src/playground/earth/runtime/state.ts:129](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L129)

---

### vigUniforms

```ts
vigUniforms: Record<string, UniformNode<'float', number>> | null
```

Defined in: [src/playground/earth/runtime/state.ts:130](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L130)

---

### filmU

```ts
filmU: UniformNode<'float', number> | null
```

Defined in: [src/playground/earth/runtime/state.ts:131](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L131)

---

### bloomPass

```ts
bloomPass: BloomNode | null
```

Defined in: [src/playground/earth/runtime/state.ts:132](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L132)

---

### earthMatUniforms

```ts
earthMatUniforms: Record<string, UniformNode<'float', number>> | null
```

Defined in: [src/playground/earth/runtime/state.ts:133](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L133)

---

### sun

```ts
sun: EarthSunState | null
```

Defined in: [src/playground/earth/runtime/state.ts:134](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L134)

---

### moonCfg

```ts
moonCfg: EarthMoonState | null
```

Defined in: [src/playground/earth/runtime/state.ts:135](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L135)

---

### earthSpin

```ts
earthSpin: EarthSpinState | null
```

Defined in: [src/playground/earth/runtime/state.ts:136](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L136)

---

### bloom

```ts
bloom: EarthBloomState | null
```

Defined in: [src/playground/earth/runtime/state.ts:137](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L137)

---

### ca

```ts
ca: EarthCaState | null
```

Defined in: [src/playground/earth/runtime/state.ts:138](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L138)

---

### vig

```ts
vig: EarthVigState | null
```

Defined in: [src/playground/earth/runtime/state.ts:139](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L139)

---

### film

```ts
film: EarthFilmState | null
```

Defined in: [src/playground/earth/runtime/state.ts:140](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L140)

---

### cg

```ts
cg: EarthGradeState | null
```

Defined in: [src/playground/earth/runtime/state.ts:141](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L141)

---

### render

```ts
render: object
```

Defined in: [src/playground/earth/runtime/state.ts:142](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L142)

#### resolutionScale

```ts
resolutionScale: number
```

---

### onResize

```ts
onResize: (() => void) | null;
```

Defined in: [src/playground/earth/runtime/state.ts:144](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/state.ts#L144)

Stable resize-listener identity so destroy() can removeEventListener.
