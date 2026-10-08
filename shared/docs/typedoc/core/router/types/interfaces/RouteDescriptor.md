[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/router/types](../README.md) / RouteDescriptor

Defined in: [core/router/types.ts:23](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/types.ts#L23)

A resolved route — everything the nav pipeline and views need.

## Properties

### name

```ts
name: string;
```

Defined in: [core/router/types.ts:25](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/types.ts#L25)

Route table name ('home', 'project', 'legal', 'not-found', …).

***

### view

```ts
view: string;
```

Defined in: [core/router/types.ts:27](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/types.ts#L27)

Custom-element tag of the view to mount.

***

### lang

```ts
lang: string;
```

Defined in: [core/router/types.ts:29](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/types.ts#L29)

Resolved locale id ('en', 'pt', …).

***

### path

```ts
path: string;
```

Defined in: [core/router/types.ts:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/types.ts#L31)

The matched URL path (kept for locale detection and analytics).

***

### meta

```ts
meta: RouteMeta;
```

Defined in: [core/router/types.ts:33](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/types.ts#L33)

Head/scroll classification metadata.

***

### params

```ts
params: Record<string, string | undefined>;
```

Defined in: [core/router/types.ts:35](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/types.ts#L35)

Extracted params — `slug` on project routes, etc.
