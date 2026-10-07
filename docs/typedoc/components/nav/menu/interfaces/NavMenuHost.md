[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [components/nav/menu](../README.md) / NavMenuHost

Defined in: [src/components/nav/menu.tsx:25](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/menu.tsx#L25)

Host surface the menu helpers need (satisfied by AppNav).

## Extends

- [`NavFlagHost`](../../flag/interfaces/NavFlagHost.md)

## Properties

### \_navFlags

```ts
_navFlags: FlagWebGL[];
```

Defined in: [src/components/nav/flag.tsx:24](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/flag.tsx#L24)

#### Inherited from

[`NavFlagHost`](../../flag/interfaces/NavFlagHost.md).[`_navFlags`](../../flag/interfaces/NavFlagHost.md#_navflags)

---

### \_menuFlagCanvasEl

```ts
_menuFlagCanvasEl: HTMLCanvasElement | null
```

Defined in: [src/components/nav/flag.tsx:25](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/flag.tsx#L25)

#### Inherited from

[`NavFlagHost`](../../flag/interfaces/NavFlagHost.md).[`_menuFlagCanvasEl`](../../flag/interfaces/NavFlagHost.md#_menuflagcanvasel)

---

### \_menuFlagLang

```ts
_menuFlagLang: string | null
```

Defined in: [src/components/nav/flag.tsx:26](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/flag.tsx#L26)

#### Inherited from

[`NavFlagHost`](../../flag/interfaces/NavFlagHost.md).[`_menuFlagLang`](../../flag/interfaces/NavFlagHost.md#_menuflaglang)

---

### locale

```ts
readonly locale: string;
```

Defined in: [src/components/nav/flag.tsx:27](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/flag.tsx#L27)

#### Inherited from

[`NavFlagHost`](../../flag/interfaces/NavFlagHost.md).[`locale`](../../flag/interfaces/NavFlagHost.md#locale)

---

### currentLang

```ts
readonly currentLang:
  | {
  code: "en";
  label: string;
  cc: string;
  flag: string;
  cc2?: undefined;
  short: string;
}
  | {
  code: "br";
  label: string;
  cc: string;
  flag: string;
  cc2?: undefined;
  short: string;
}
  | {
  code: "es";
  label: string;
  cc: string;
  flag: string;
  cc2?: undefined;
  short: string;
}
  | {
  code: "de";
  label: string;
  cc: string;
  cc2: string;
  flag: string;
  short: string;
}
  | {
  code: "hrk";
  label: string;
  cc: string;
  cc2: string;
  flag: string;
  short: string;
}
  | {
  code: "cas";
  label: string;
  cc: string;
  cc2: string;
  flag: string;
  short: string;
}
  | {
  code: "riv";
  label: string;
  cc: string;
  cc2: string;
  flag: string;
  short: string;
}
  | {
  code: "gn";
  label: string;
  cc: string;
  flag: string;
  cc2?: undefined;
  short: string;
}
  | {
  code: "it";
  label: string;
  cc: string;
  flag: string;
  cc2?: undefined;
  short: string;
}
  | {
  code: "ru";
  label: string;
  cc: string;
  flag: string;
  cc2?: undefined;
  short: string;
}
  | {
  code: "fr";
  label: string;
  cc: string;
  flag: string;
  cc2?: undefined;
  short: string;
}
  | {
  code: "tln";
  label: string;
  cc: string;
  cc2: string;
  flag: string;
  short: string;
}
  | {
  cc2?: undefined;
  code: "gl";
  label: string;
  cc: string;
  flag: string;
  short: string;
}
  | {
  cc2?: undefined;
  code: "ca";
  label: string;
  cc: string;
  flag: string;
  short: string;
}
  | {
  cc2?: undefined;
  code: "nl";
  label: string;
  cc: string;
  flag: string;
  short: string;
}
  | {
  cc2?: undefined;
  code: "ga";
  label: string;
  cc: string;
  flag: string;
  short: string;
}
  | null;
```

Defined in: [src/components/nav/flag.tsx:28](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/flag.tsx#L28)

#### Inherited from

[`NavFlagHost`](../../flag/interfaces/NavFlagHost.md).[`currentLang`](../../flag/interfaces/NavFlagHost.md#currentlang)

---

### \_menuOpen

```ts
_menuOpen: boolean
```

Defined in: [src/components/nav/menu.tsx:26](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/menu.tsx#L26)

---

### \_menuClosing

```ts
_menuClosing: boolean
```

Defined in: [src/components/nav/menu.tsx:27](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/menu.tsx#L27)

---

### \_menuSettled

```ts
_menuSettled: boolean
```

Defined in: [src/components/nav/menu.tsx:28](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/menu.tsx#L28)

---

### \_menuSettleTimer

```ts
_menuSettleTimer: number | null
```

Defined in: [src/components/nav/menu.tsx:29](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/menu.tsx#L29)

---

### \_menuBg

```ts
_menuBg:
  | MenuBackgroundWebGL
  | null;
```

Defined in: [src/components/nav/menu.tsx:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/menu.tsx#L30)

---

### \_menuCloseBtn

```ts
_menuCloseBtn:
  | CloseButtonWebGL
  | null;
```

Defined in: [src/components/nav/menu.tsx:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/menu.tsx#L31)

---

### \_burgerBtn

```ts
_burgerBtn:
  | BurgerButtonWebGL
  | null;
```

Defined in: [src/components/nav/menu.tsx:32](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/menu.tsx#L32)

---

### \_burgerCanvasEl

```ts
_burgerCanvasEl: HTMLCanvasElement | null
```

Defined in: [src/components/nav/menu.tsx:33](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/menu.tsx#L33)

---

### \_menuCanvasEl

```ts
_menuCanvasEl: HTMLCanvasElement | null
```

Defined in: [src/components/nav/menu.tsx:34](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/menu.tsx#L34)

---

### \_menuCloseCanvasEl

```ts
_menuCloseCanvasEl: HTMLCanvasElement | null
```

Defined in: [src/components/nav/menu.tsx:35](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/menu.tsx#L35)

---

### \_onDark

```ts
_onDark: boolean
```

Defined in: [src/components/nav/menu.tsx:36](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/menu.tsx#L36)

## Methods

### $()

```ts
$(selector): Element | null;
```

Defined in: [src/components/nav/menu.tsx:37](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/menu.tsx#L37)

#### Parameters

##### selector

`string`

#### Returns

`Element` \| `null`

---

### \_updateDom()

```ts
_updateDom(): void;
```

Defined in: [src/components/nav/menu.tsx:38](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/menu.tsx#L38)

#### Returns

`void`
