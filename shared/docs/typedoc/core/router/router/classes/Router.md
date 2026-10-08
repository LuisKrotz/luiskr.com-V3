[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/router/router](../README.md) / Router

Defined in: [core/router/router.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/router.ts#L30)

History-API router: parses paths into route descriptors, runs before/after
hooks, updates history + title + canonical + scroll, and notifies
subscribers (<app-root> swaps the view element on notification).

## Constructors

### Constructor

```ts
new Router(): Router;
```

Defined in: [core/router/router.ts:46](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/router.ts#L46)

#### Returns

`Router`

## Properties

### routes

```ts
routes: RouteDescriptor[] = [];
```

Defined in: [core/router/router.ts:32](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/router.ts#L32)

Static route table — unused; resolution is imperative in parsePath.

***

### currentRoute

```ts
currentRoute: RouteDescriptor | null = null;
```

Defined in: [core/router/router.ts:35](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/router.ts#L35)

Last resolved route descriptor {name, view, lang, path, meta, params}.

***

### listeners

```ts
listeners: Set<RouteListener>;
```

Defined in: [core/router/router.ts:38](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/router.ts#L38)

Subscriber callbacks fired by notify() on every successful nav.

***

### beforeHooks

```ts
beforeHooks: NavHook[] = [];
```

Defined in: [core/router/router.ts:41](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/router.ts#L41)

Navigation guards; each may return a redirect path/{path}.

***

### afterHooks

```ts
afterHooks: NavHook[] = [];
```

Defined in: [core/router/router.ts:44](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/router.ts#L44)

Post-nav side-effect hooks (run after history+title are updated).

## Methods

### beforeEach()

```ts
beforeEach(fn): void;
```

Defined in: [core/router/router.ts:66](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/router.ts#L66)

Registers a navigation guard; a hook may return a redirect path/object.

#### Parameters

##### fn

[`NavHook`](../../types/type-aliases/NavHook.md)

#### Returns

`void`

***

### afterEach()

```ts
afterEach(fn): void;
```

Defined in: [core/router/router.ts:71](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/router.ts#L71)

Registers a post-navigation hook (analytics, side effects).

#### Parameters

##### fn

[`NavHook`](../../types/type-aliases/NavHook.md)

#### Returns

`void`

***

### subscribe()

```ts
subscribe(listener): () => void;
```

Defined in: [core/router/router.ts:80](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/router.ts#L80)

Subscribes a listener to route changes.

#### Parameters

##### listener

[`RouteListener`](../../types/type-aliases/RouteListener.md)

Callback receiving (to, from) descriptors.

#### Returns

unsubscribe function

() => `void`

***

### notify()

```ts
notify(to, from): void;
```

Defined in: [core/router/router.ts:94](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/router.ts#L94)

Fans the route change out to subscribers; each call is wrapped so one
throwing listener can't break the rest (logged via devError).

#### Parameters

##### to

[`RouteDescriptor`](../../types/interfaces/RouteDescriptor.md)

Destination descriptor.

##### from

[`RouteDescriptor`](../../types/interfaces/RouteDescriptor.md) \| `null`

Origin descriptor — null on first navigation.

#### Returns

`void`

***

### parsePath()

```ts
parsePath(pathname): RouteDescriptor;
```

Defined in: [core/router/router.ts:110](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/router.ts#L110)

Pure URL → route-descriptor resolution — see parse-path.ts for the
route table and slug priority order.

#### Parameters

##### pathname

`string`

Raw URL pathname (+search/hash tolerated).

#### Returns

[`RouteDescriptor`](../../types/interfaces/RouteDescriptor.md)

The matched descriptor (404-shaped when nothing matches).

***

### resolve()

```ts
resolve(path): RouteDescriptor;
```

Defined in: [core/router/router.ts:115](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/router.ts#L115)

Public alias of parsePath kept for API compatibility.

#### Parameters

##### path

`string`

#### Returns

[`RouteDescriptor`](../../types/interfaces/RouteDescriptor.md)

***

### match()

```ts
match(path): RouteDescriptor;
```

Defined in: [core/router/router.ts:120](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/router.ts#L120)

Public alias of parsePath kept for API compatibility.

#### Parameters

##### path

`string`

#### Returns

[`RouteDescriptor`](../../types/interfaces/RouteDescriptor.md)

***

### handleNavigation()

```ts
handleNavigation(path, replace?): Promise<void>;
```

Defined in: [core/router/router.ts:130](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/router.ts#L130)

Full navigation pipeline — guards → history → meta → notify; see
navigate.ts for the stage order.

#### Parameters

##### path

`string`

Destination URL path.

##### replace?

`boolean` = `false`

When true, replace the current history entry instead of pushing.

#### Returns

`Promise`\<`void`\>

***

### push()

```ts
push(path): Promise<void>;
```

Defined in: [core/router/router.ts:135](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/router.ts#L135)

Navigates forward, pushing a history entry.

#### Parameters

##### path

`string`

#### Returns

`Promise`\<`void`\>

***

### replace()

```ts
replace(path): Promise<void>;
```

Defined in: [core/router/router.ts:140](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/router.ts#L140)

Navigates without adding a history entry (redirects, boot).

#### Parameters

##### path

`string`

#### Returns

`Promise`\<`void`\>

***

### init()

```ts
init(): void;
```

Defined in: [core/router/router.ts:145](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/router.ts#L145)

Bootstraps the router from the current URL (replaces, not pushes).

#### Returns

`void`
