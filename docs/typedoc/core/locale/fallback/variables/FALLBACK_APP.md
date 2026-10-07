[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/locale/fallback](../README.md) / FALLBACK\_APP

```ts
const FALLBACK_APP: object = FALLBACK.APP
```

Defined in: [src/core/locale/fallback.ts:37](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/locale/fallback.ts#L37)

The APP subtree of the fallback snapshot — app-shell copy (actions,
carousel labels, loader lines) consumed before Firebase resolves.

## Type Declaration

## Index Signature

```ts
[key: string]: unknown
```

### actions

```ts
actions: object
```

#### actions.click

```ts
click: string
```

#### actions.tap

```ts
tap: string
```

### carousel

```ts
carousel: Record<string, unknown>
```

### statsHud

```ts
statsHud: Record<string, unknown>
```

### loader

```ts
loader: object
```

#### loader.lines

```ts
lines: string[];
```
