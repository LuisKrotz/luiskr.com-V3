[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [website/components/nav/menu](../README.md) / NavMenuHost

Defined in: [website/components/nav/menu.tsx:25](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/menu.tsx#L25)

Host surface the menu helpers need (satisfied by AppNav).

## Extends

- [`NavFlagHost`](../../flag/interfaces/NavFlagHost.md)

## Properties

### \_navFlags

```ts
_navFlags: FlagWebGL[];
```

Defined in: [website/components/nav/flag.tsx:25](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/flag.tsx#L25)

Live flag widgets (max one — the menu flag).

#### Inherited from

[`NavFlagHost`](../../flag/interfaces/NavFlagHost.md).[`_navFlags`](../../flag/interfaces/NavFlagHost.md#_navflags)

***

### \_menuFlagCanvasEl

```ts
_menuFlagCanvasEl: HTMLCanvasElement | null;
```

Defined in: [website/components/nav/flag.tsx:27](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/flag.tsx#L27)

Persistent per-locale flag canvas; rebuilt on locale change.

#### Inherited from

[`NavFlagHost`](../../flag/interfaces/NavFlagHost.md).[`_menuFlagCanvasEl`](../../flag/interfaces/NavFlagHost.md#_menuflagcanvasel)

***

### \_menuFlagLang

```ts
_menuFlagLang: string | null;
```

Defined in: [website/components/nav/flag.tsx:29](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/flag.tsx#L29)

Locale the current flag canvas was built for.

#### Inherited from

[`NavFlagHost`](../../flag/interfaces/NavFlagHost.md).[`_menuFlagLang`](../../flag/interfaces/NavFlagHost.md#_menuflaglang)

***

### locale

```ts
readonly locale: string;
```

Defined in: [website/components/nav/flag.tsx:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/flag.tsx#L31)

Active locale code.

#### Inherited from

[`NavFlagHost`](../../flag/interfaces/NavFlagHost.md).[`locale`](../../flag/interfaces/NavFlagHost.md#locale)

***

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

Defined in: [website/components/nav/flag.tsx:33](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/flag.tsx#L33)

The active LANG_OPTIONS entry (code + label + flag cc).

#### Inherited from

[`NavFlagHost`](../../flag/interfaces/NavFlagHost.md).[`currentLang`](../../flag/interfaces/NavFlagHost.md#currentlang)

***

### \_menuOpen

```ts
_menuOpen: boolean;
```

Defined in: [website/components/nav/menu.tsx:27](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/menu.tsx#L27)

Menu overlay open flag.

***

### \_menuClosing

```ts
_menuClosing: boolean;
```

Defined in: [website/components/nav/menu.tsx:29](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/menu.tsx#L29)

Close animation in flight — guards double-close.

***

### \_menuSettled

```ts
_menuSettled: boolean;
```

Defined in: [website/components/nav/menu.tsx:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/menu.tsx#L31)

Open animation completed — close X may snap to drawn state.

***

### \_menuSettleTimer

```ts
_menuSettleTimer: number | null;
```

Defined in: [website/components/nav/menu.tsx:33](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/menu.tsx#L33)

Settle-delay timer handle; cleared on destroy/close.

***

### \_menuBg

```ts
_menuBg: 
  | MenuBackgroundWebGL
  | null;
```

Defined in: [website/components/nav/menu.tsx:35](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/menu.tsx#L35)

Live menu-background widget over the fullscreen canvas.

***

### \_menuCloseBtn

```ts
_menuCloseBtn: 
  | CloseButtonWebGL
  | null;
```

Defined in: [website/components/nav/menu.tsx:37](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/menu.tsx#L37)

Live close-X widget.

***

### \_burgerBtn

```ts
_burgerBtn: 
  | BurgerButtonWebGL
  | null;
```

Defined in: [website/components/nav/menu.tsx:39](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/menu.tsx#L39)

Live burger widget.

***

### \_burgerCanvasEl

```ts
_burgerCanvasEl: HTMLCanvasElement | null;
```

Defined in: [website/components/nav/menu.tsx:41](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/menu.tsx#L41)

Persistent burger canvas (survives re-renders).

***

### \_menuCanvasEl

```ts
_menuCanvasEl: HTMLCanvasElement | null;
```

Defined in: [website/components/nav/menu.tsx:43](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/menu.tsx#L43)

Persistent menu background canvas.

***

### \_menuCloseCanvasEl

```ts
_menuCloseCanvasEl: HTMLCanvasElement | null;
```

Defined in: [website/components/nav/menu.tsx:45](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/menu.tsx#L45)

Persistent close-X canvas.

***

### \_onDark

```ts
_onDark: boolean;
```

Defined in: [website/components/nav/menu.tsx:47](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/menu.tsx#L47)

True while the nav floats over a dark band (contrast variant).

## Methods

### $()

```ts
$(selector): Element | null;
```

Defined in: [website/components/nav/menu.tsx:49](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/menu.tsx#L49)

Shadow-scoped querySelector.

#### Parameters

##### selector

`string`

#### Returns

`Element` \| `null`

***

### \_updateDom()

```ts
_updateDom(): void;
```

Defined in: [website/components/nav/menu.tsx:51](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/menu.tsx#L51)

Triggers a template re-render.

#### Returns

`void`
