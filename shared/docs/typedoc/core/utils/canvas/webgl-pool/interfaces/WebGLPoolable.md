[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/canvas/webgl-pool](../README.md) / WebGLPoolable

Defined in: [core/utils/canvas/webgl-pool.ts:17](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/webgl-pool.ts#L17)

Widget contract the pool drives on visibility flips and recovery actions.

## Properties

### useWebGL?

```ts
optional useWebGL?: boolean;
```

Defined in: [core/utils/canvas/webgl-pool.ts:19](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/webgl-pool.ts#L19)

Whether the widget currently renders via WebGL (false = CSS/2D fallback).

***

### purge?

```ts
optional purge?: () => void;
```

Defined in: [core/utils/canvas/webgl-pool.ts:21](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/webgl-pool.ts#L21)

Called when the canvas leaves the viewport — free GL resources + stop the loop.

#### Returns

`void`

***

### restore?

```ts
optional restore?: () => void;
```

Defined in: [core/utils/canvas/webgl-pool.ts:23](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/webgl-pool.ts#L23)

Called when the canvas re-enters the viewport — re-acquire + resume.

#### Returns

`void`

***

### retryWebGL?

```ts
optional retryWebGL?: () => boolean | void;
```

Defined in: [core/utils/canvas/webgl-pool.ts:25](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/webgl-pool.ts#L25)

Optional custom re-probe; when absent the pool runs purge+restore.

#### Returns

`boolean` \| `void`
