[**luiskr.com**](../../../README.md)

***

[luiskr.com](../../../README.md) / [core/store](../README.md) / Store

Defined in: [core/store.ts:29](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store.ts#L29)

Reactive state container. Deliberately tiny: a Set of subscriber callbacks,
a state bag, a named-mutation map, and a getter facade. A Set (not Array)
gives O(1) unsubscribe and dedupes double-subscribe for free.

## Constructors

### Constructor

```ts
new Store(): Store;
```

Defined in: [core/store.ts:42](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store.ts#L42)

#### Returns

`Store`

## Properties

### subscribers

```ts
subscribers: Set<Subscriber>;
```

Defined in: [core/store.ts:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store.ts#L31)

Live subscriber callbacks; invoked in insertion order by notify().

***

### state

```ts
state: StoreState;
```

Defined in: [core/store.ts:34](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store.ts#L34)

The single mutable state bag — replaced by mutations, read via getters.

***

### mutations

```ts
mutations: MutationMap;
```

Defined in: [core/store.ts:37](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store.ts#L37)

name → mutator map built by createMutations(this) at construction.

***

### getters

```ts
getters: StoreGetters;
```

Defined in: [core/store.ts:40](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store.ts#L40)

Read facade — components read state exclusively through getters.

## Methods

### commit()

```ts
commit(mutationName, payload?): void;
```

Defined in: [core/store.ts:63](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store.ts#L63)

Runs a named mutation then notifies subscribers — unless the mutation
explicitly returns false (its way of saying "no state change"). Unknown
names warn through devlog instead of throwing so a typo in one component
can't crash an unrelated render pass.

#### Parameters

##### mutationName

`string`

Key into MUTATIONS (token, not a literal).

##### payload?

`unknown`

Optional value forwarded to the mutator.

#### Returns

`void`

***

### subscribe()

```ts
subscribe(listener): () => boolean;
```

Defined in: [core/store.ts:80](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store.ts#L80)

Subscribes to state changes.

#### Parameters

##### listener

[`Subscriber`](../state/type-aliases/Subscriber.md)

Callback receiving the state bag on every notify().

#### Returns

unsubscribe function

() => `boolean`

***

### notify()

```ts
notify(): void;
```

Defined in: [core/store.ts:91](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store.ts#L91)

Calls every subscriber; one throwing subscriber can't break the rest —
each call is try/catch'd and routed to devlog so a render bug in one
component doesn't starve the remaining subscribers of the update.

#### Returns

`void`
