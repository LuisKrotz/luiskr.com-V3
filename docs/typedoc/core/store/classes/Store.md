[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [core/store](../README.md) / Store

Defined in: [src/core/store.ts:26](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store.ts#L26)

The Store class.

## Constructors

### Constructor

```ts
new Store(): Store;
```

Defined in: [src/core/store.ts:32](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store.ts#L32)

#### Returns

`Store`

## Properties

### subscribers

```ts
subscribers: Set<Subscriber>
```

Defined in: [src/core/store.ts:27](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store.ts#L27)

---

### state

```ts
state: StoreState
```

Defined in: [src/core/store.ts:28](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store.ts#L28)

---

### mutations

```ts
mutations: MutationMap
```

Defined in: [src/core/store.ts:29](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store.ts#L29)

---

### getters

```ts
getters: StoreGetters
```

Defined in: [src/core/store.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store.ts#L30)

## Methods

### commit()

```ts
commit(mutationName, payload?): void;
```

Defined in: [src/core/store.ts:49](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store.ts#L49)

Runs a named mutation then notifies subscribers — unless the mutation
explicitly returns false (its way of saying "no state change").

#### Parameters

##### mutationName

`string`

##### payload?

`unknown`

#### Returns

`void`

---

### subscribe()

```ts
subscribe(listener): () => boolean;
```

Defined in: [src/core/store.ts:65](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store.ts#L65)

Subscribes to state changes.

#### Parameters

##### listener

[`Subscriber`](../state/type-aliases/Subscriber.md)

#### Returns

unsubscribe function

() => `boolean`

---

### notify()

```ts
notify(): void;
```

Defined in: [src/core/store.ts:72](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store.ts#L72)

Calls every subscriber; one throwing subscriber can't break the rest.

#### Returns

`void`
