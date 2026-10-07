[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [routes/router](../README.md) / Router

Defined in: [src/routes/router.ts:29](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/routes/router.ts#L29)

History-API router: parses paths into route descriptors, runs before/after
hooks, updates history + title + canonical + scroll, and notifies
subscribers (<app-root> swaps the view element on notification).

## Constructors

### Constructor

```ts
new Router(): Router;
```

Defined in: [src/routes/router.ts:45](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/routes/router.ts#L45)

#### Returns

`Router`

## Properties

### routes

```ts
routes: RouteDescriptor[] = [];
```

Defined in: [src/routes/router.ts:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/routes/router.ts#L31)

Static route table — unused; resolution is imperative in parsePath.

---

### currentRoute

```ts
currentRoute: RouteDescriptor | null = null;
```

Defined in: [src/routes/router.ts:34](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/routes/router.ts#L34)

Last resolved route descriptor {name, view, lang, path, meta, params}.

---

### listeners

```ts
listeners: Set<RouteListener>
```

Defined in: [src/routes/router.ts:37](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/routes/router.ts#L37)

Subscriber callbacks fired by notify() on every successful nav.

---

### beforeHooks

```ts
beforeHooks: NavHook[] = [];
```

Defined in: [src/routes/router.ts:40](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/routes/router.ts#L40)

Navigation guards; each may return a redirect path/{path}.

---

### afterHooks

```ts
afterHooks: NavHook[] = [];
```

Defined in: [src/routes/router.ts:43](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/routes/router.ts#L43)

Post-nav side-effect hooks (run after history+title are updated).

## Methods

### beforeEach()

```ts
beforeEach(fn): void;
```

Defined in: [src/routes/router.ts:61](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/routes/router.ts#L61)

Registers a navigation guard; a hook may return a redirect path/object.

#### Parameters

##### fn

[`NavHook`](../../types/type-aliases/NavHook.md)

#### Returns

`void`

---

### afterEach()

```ts
afterEach(fn): void;
```

Defined in: [src/routes/router.ts:66](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/routes/router.ts#L66)

Registers a post-navigation hook (analytics, side effects).

#### Parameters

##### fn

[`NavHook`](../../types/type-aliases/NavHook.md)

#### Returns

`void`

---

### subscribe()

```ts
subscribe(listener): () => void;
```

Defined in: [src/routes/router.ts:74](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/routes/router.ts#L74)

Subscribes a listener to route changes.

#### Parameters

##### listener

[`RouteListener`](../../types/type-aliases/RouteListener.md)

#### Returns

unsubscribe function

() => `void`

---

### notify()

```ts
notify(to, from): void;
```

Defined in: [src/routes/router.ts:83](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/routes/router.ts#L83)

Fans the route change out to subscribers; one bad listener can't break the rest.

#### Parameters

##### to

[`RouteDescriptor`](../../types/interfaces/RouteDescriptor.md)

##### from

[`RouteDescriptor`](../../types/interfaces/RouteDescriptor.md) \| `null`

#### Returns

`void`

---

### parsePath()

```ts
parsePath(pathname): RouteDescriptor;
```

Defined in: [src/routes/router.ts:97](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/routes/router.ts#L97)

Pure URL → route-descriptor resolution — see parse-path.ts for the
route table and slug priority order.

#### Parameters

##### pathname

`string`

#### Returns

[`RouteDescriptor`](../../types/interfaces/RouteDescriptor.md)

---

### resolve()

```ts
resolve(path): RouteDescriptor;
```

Defined in: [src/routes/router.ts:102](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/routes/router.ts#L102)

Public alias of parsePath kept for API compatibility.

#### Parameters

##### path

`string`

#### Returns

[`RouteDescriptor`](../../types/interfaces/RouteDescriptor.md)

---

### match()

```ts
match(path): RouteDescriptor;
```

Defined in: [src/routes/router.ts:107](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/routes/router.ts#L107)

Public alias of parsePath kept for API compatibility.

#### Parameters

##### path

`string`

#### Returns

[`RouteDescriptor`](../../types/interfaces/RouteDescriptor.md)

---

### handleNavigation()

```ts
handleNavigation(path, replace?): Promise<void>;
```

Defined in: [src/routes/router.ts:112](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/routes/router.ts#L112)

Full navigation pipeline — see navigate.ts.

#### Parameters

##### path

`string`

##### replace?

`boolean` = `false`

#### Returns

`Promise`\<`void`\>

---

### push()

```ts
push(path): Promise<void>;
```

Defined in: [src/routes/router.ts:117](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/routes/router.ts#L117)

Navigates forward, pushing a history entry.

#### Parameters

##### path

`string`

#### Returns

`Promise`\<`void`\>

---

### replace()

```ts
replace(path): Promise<void>;
```

Defined in: [src/routes/router.ts:122](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/routes/router.ts#L122)

Navigates without adding a history entry (redirects, boot).

#### Parameters

##### path

`string`

#### Returns

`Promise`\<`void`\>

---

### init()

```ts
init(): void;
```

Defined in: [src/routes/router.ts:127](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/routes/router.ts#L127)

Bootstraps the router from the current URL (replaces, not pushes).

#### Returns

`void`
