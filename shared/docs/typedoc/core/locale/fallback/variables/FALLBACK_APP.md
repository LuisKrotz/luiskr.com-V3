[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/locale/fallback](../README.md) / FALLBACK\_APP

```ts
const FALLBACK_APP: object = FALLBACK.APP;
```

Defined in: [core/locale/fallback.ts:37](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/locale/fallback.ts#L37)

The APP subtree of the fallback snapshot — app-shell copy (actions,
carousel labels, loader lines) consumed before Firebase resolves.

## Type Declaration

## Index Signature

```ts
[key: string]: unknown
```

### actions

```ts
actions: object;
```

#### actions.click

```ts
click: string;
```

#### actions.tap

```ts
tap: string;
```

### carousel

```ts
carousel: Record<string, unknown>;
```

### statsHud

```ts
statsHud: Record<string, unknown>;
```

### loader

```ts
loader: object;
```

#### loader.lines

```ts
lines: string[];
```
