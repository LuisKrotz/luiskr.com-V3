[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/wasm/wasm-media-threads](../README.md) / VideoProbe

Defined in: [core/utils/wasm/wasm-media-threads.ts:34](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/wasm/wasm-media-threads.ts#L34)

Result of the lightweight header probe — filled by the worker.

## Indexable

```ts
[key: string]: unknown
```

Worker may attach extra diagnostics — forward-compatible.

## Properties

### codec?

```ts
optional codec?: string;
```

Defined in: [core/utils/wasm/wasm-media-threads.ts:36](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/wasm/wasm-media-threads.ts#L36)

Detected codec string (e.g. 'avc1.42E01E'), when parseable.

***

### size?

```ts
optional size?: number;
```

Defined in: [core/utils/wasm/wasm-media-threads.ts:38](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/wasm/wasm-media-threads.ts#L38)

Total byte size, when the server reports Content-Length/ranges.

***

### rangeSupported?

```ts
optional rangeSupported?: boolean;
```

Defined in: [core/utils/wasm/wasm-media-threads.ts:40](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/wasm/wasm-media-threads.ts#L40)

Whether the server honored the Range request (206 vs 200).
