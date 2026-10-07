[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/canvas/webgl-pool](../README.md) / WebGLPoolable

Defined in: [src/utils/canvas/webgl-pool.ts:15](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/webgl-pool.ts#L15)

Widget contract the pool drives on visibility flips and recovery actions.

## Properties

### useWebGL?

```ts
optional useWebGL?: boolean;
```

Defined in: [src/utils/canvas/webgl-pool.ts:16](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/webgl-pool.ts#L16)

---

### purge?

```ts
optional purge?: () => void;
```

Defined in: [src/utils/canvas/webgl-pool.ts:17](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/webgl-pool.ts#L17)

#### Returns

`void`

---

### restore?

```ts
optional restore?: () => void;
```

Defined in: [src/utils/canvas/webgl-pool.ts:18](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/webgl-pool.ts#L18)

#### Returns

`void`

---

### retryWebGL?

```ts
optional retryWebGL?: () => boolean | void;
```

Defined in: [src/utils/canvas/webgl-pool.ts:19](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/webgl-pool.ts#L19)

#### Returns

`boolean` \| `void`
