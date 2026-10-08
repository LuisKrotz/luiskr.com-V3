[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [experiments/earth-playground/space/controls](../README.md) / SpControl

Defined in: [experiments/earth-playground/space/controls.ts:42](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/space/controls.ts#L42)

One row in a panel group — a slider or a WebGL checkbox.

## Properties

### label

```ts
label: string;
```

Defined in: [experiments/earth-playground/space/controls.ts:44](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/space/controls.ts#L44)

Translation key for the row's label (and the CMS defaults-map key).

***

### param

```ts
param: string;
```

Defined in: [experiments/earth-playground/space/controls.ts:46](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/space/controls.ts#L46)

SP_PARAMS token — persisted-settings key + data-param attribute.

***

### type

```ts
type: string;
```

Defined in: [experiments/earth-playground/space/controls.ts:48](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/space/controls.ts#L48)

'range' slider | 'checkbox' WebGL twin.

***

### min?

```ts
optional min?: number;
```

Defined in: [experiments/earth-playground/space/controls.ts:50](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/space/controls.ts#L50)

Slider minimum (range only).

***

### max?

```ts
optional max?: number;
```

Defined in: [experiments/earth-playground/space/controls.ts:52](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/space/controls.ts#L52)

Slider maximum (range only).

***

### step?

```ts
optional step?: number;
```

Defined in: [experiments/earth-playground/space/controls.ts:54](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/space/controls.ts#L54)

Slider step granularity (range only).

***

### def?

```ts
optional def?: number;
```

Defined in: [experiments/earth-playground/space/controls.ts:56](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/space/controls.ts#L56)

Shipped numeric default — CMS defaults and saved values override it.

***

### checked?

```ts
optional checked?: boolean;
```

Defined in: [experiments/earth-playground/space/controls.ts:58](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/space/controls.ts#L58)

Shipped checkbox state — same precedence as `def`.
