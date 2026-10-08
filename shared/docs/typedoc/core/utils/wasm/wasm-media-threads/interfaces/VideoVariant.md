[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/wasm/wasm-media-threads](../README.md) / VideoVariant

Defined in: [core/utils/wasm/wasm-media-threads.ts:22](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/wasm/wasm-media-threads.ts#L22)

One candidate rendition of a video — URL plus optional quality metadata.

## Properties

### url

```ts
url: string;
```

Defined in: [core/utils/wasm/wasm-media-threads.ts:24](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/wasm/wasm-media-threads.ts#L24)

CDN URL of this rendition.

***

### quality?

```ts
optional quality?: string;
```

Defined in: [core/utils/wasm/wasm-media-threads.ts:26](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/wasm/wasm-media-threads.ts#L26)

Quality label ('360p', '720p', …) — informational for the worker.

***

### width?

```ts
optional width?: number;
```

Defined in: [core/utils/wasm/wasm-media-threads.ts:28](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/wasm/wasm-media-threads.ts#L28)

Rendition pixel width — drives the GPU-upload resize hint.

***

### height?

```ts
optional height?: number;
```

Defined in: [core/utils/wasm/wasm-media-threads.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/wasm/wasm-media-threads.ts#L30)

Rendition pixel height — drives the GPU-upload resize hint.
