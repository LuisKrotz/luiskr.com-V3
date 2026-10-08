[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/store/state](../README.md) / LangState

Defined in: [core/store/state.ts:35](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L35)

The locale slice of StoreState: fetched dictionary nodes (components,
app, slugs) plus the DB path grammar and resolved locale code.
`components`/`app`/`slugs` are false/null until the Firebase fetch lands —
readers must treat falsy as "load pending", never as "empty".

## Properties

### components

```ts
components: unknown;
```

Defined in: [core/store/state.ts:36](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L36)

***

### app

```ts
app: Record<string, unknown> | null;
```

Defined in: [core/store/state.ts:37](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L37)

***

### slugs

```ts
slugs: Record<string, unknown> | null;
```

Defined in: [core/store/state.ts:38](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L38)

***

### carousel

```ts
carousel: Record<string, unknown>;
```

Defined in: [core/store/state.ts:39](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L39)

***

### statsHud

```ts
statsHud: Record<string, unknown>;
```

Defined in: [core/store/state.ts:40](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L40)

***

### database

```ts
database: string;
```

Defined in: [core/store/state.ts:41](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L41)

***

### locale

```ts
locale: string;
```

Defined in: [core/store/state.ts:42](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L42)

***

### pagesPath

```ts
pagesPath: string;
```

Defined in: [core/store/state.ts:43](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L43)

***

### projectPath

```ts
projectPath: string;
```

Defined in: [core/store/state.ts:44](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L44)
