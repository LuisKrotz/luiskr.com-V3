[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [core/utils/canvas/loaders/skeleton-webgl](../README.md) / SkelStyle

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:26](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L26)

Per-placeholder computed style, cached between measures (cleared on theme flip).

## Properties

### lineHeight

```ts
lineHeight: number;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:28](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L28)

Computed line-height — text placeholders tile glyph rows against it.

***

### radius

```ts
radius: number;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L30)

Computed border-radius — forwarded to the shader's corner rounding.

***

### textLike

```ts
textLike: boolean;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:32](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L32)

Whether this placeholder is a text line (vs a media block).

***

### baseStr

```ts
baseStr: string;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:34](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L34)

Raw CSS color string for the base fill — parsed lazily.

***

### inkStr

```ts
inkStr: string;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:36](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L36)

Raw CSS color string for the ink/glyph color — parsed lazily.
