[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/canvas/gl-program](../README.md) / QuadProgramOptions

Defined in: [core/utils/canvas/gl-program.ts:55](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/gl-program.ts#L55)

Compiles + links a vertex/fragment pair and uploads the shared
fullscreen-quad buffer ([-1,-1 … 1,1] triangle pair). Returns null on
any stage failure — the caller treats it as "no WebGL" and falls back.

## Properties

### verts?

```ts
optional verts?: Float32Array<ArrayBufferLike>;
```

Defined in: [core/utils/canvas/gl-program.ts:58](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/gl-program.ts#L58)

Quad vertex layout — defaults to the 6-vertex TRIANGLES quad;
 TRIANGLE_STRIP callers pass their 4-vertex ordering instead.

***

### warn?

```ts
optional warn?: (_stage, _info) => void;
```

Defined in: [core/utils/canvas/gl-program.ts:60](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/gl-program.ts#L60)

Custom warn sink — stage is 'VS' | 'FS' | 'Link' | 'fallback'.

#### Parameters

##### \_stage

`string`

##### \_info

`unknown`

#### Returns

`void`

***

### premultiplied?

```ts
optional premultiplied?: boolean;
```

Defined in: [core/utils/canvas/gl-program.ts:63](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/gl-program.ts#L63)

Blend factors — default premultiplied (ONE, ONE_MINUS_SRC_ALPHA);
 false gives straight-alpha (SRC_ALPHA, ONE_MINUS_SRC_ALPHA).
