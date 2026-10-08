[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/gpu/gpu-info](../README.md) / GPUInfo

Defined in: [core/utils/gpu/gpu-info.ts:22](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/gpu/gpu-info.ts#L22)

Classified GPU probe result — frozen so consumers can't mutate the cache.

## Properties

### renderer

```ts
renderer: string;
```

Defined in: [core/utils/gpu/gpu-info.ts:24](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/gpu/gpu-info.ts#L24)

Unmasked renderer string ('ANGLE (NVIDIA…)', 'Apple M1', 'SwiftShader', …).

***

### dedicated

```ts
dedicated: boolean;
```

Defined in: [core/utils/gpu/gpu-info.ts:26](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/gpu/gpu-info.ts#L26)

Discrete-card class detected (NVIDIA/AMD/Radeon Pro).

***

### apple

```ts
apple: boolean;
```

Defined in: [core/utils/gpu/gpu-info.ts:28](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/gpu/gpu-info.ts#L28)

Apple Silicon detected — unified memory but GPU-class performance.

***

### integrated

```ts
integrated: boolean;
```

Defined in: [core/utils/gpu/gpu-info.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/gpu/gpu-info.ts#L30)

Integrated GPU detected (Intel UHD/Iris, basic ANGLE adapters).

***

### software

```ts
software: boolean;
```

Defined in: [core/utils/gpu/gpu-info.ts:32](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/gpu/gpu-info.ts#L32)

Software rasterizer (SwiftShader/llvmpipe) — GPU work falls back to CSS.

***

### mobile

```ts
mobile: boolean;
```

Defined in: [core/utils/gpu/gpu-info.ts:34](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/gpu/gpu-info.ts#L34)

Mobile-class user agent — deprioritizes GPU pinning regardless of chip.

***

### capable

```ts
capable: boolean;
```

Defined in: [core/utils/gpu/gpu-info.ts:36](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/gpu/gpu-info.ts#L36)

Worth pinning GPU work to — desktop discrete or Apple Silicon.
