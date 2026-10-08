[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/store/state](../README.md) / StoreState

Defined in: [core/store/state.ts:98](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L98)

The whole reactive state bag. Field naming follows the shape the legacy
CMS data already uses (clickortap, marqueeamount, portfoliolist are
snake/flat because they mirror DB keys verbatim — renaming would break
the translation payload contract).

## Properties

### clickortap

```ts
clickortap: string;
```

Defined in: [core/store/state.ts:99](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L99)

***

### inputMethod

```ts
inputMethod: string;
```

Defined in: [core/store/state.ts:100](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L100)

***

### actionTextMap

```ts
actionTextMap: ActionTextMap;
```

Defined in: [core/store/state.ts:101](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L101)

***

### has\_touch

```ts
has_touch: boolean;
```

Defined in: [core/store/state.ts:102](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L102)

***

### lang

```ts
lang: LangState;
```

Defined in: [core/store/state.ts:103](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L103)

***

### mentions

```ts
mentions: MentionsState;
```

Defined in: [core/store/state.ts:104](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L104)

***

### marqueeamount

```ts
marqueeamount: number;
```

Defined in: [core/store/state.ts:105](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L105)

***

### modalObject

```ts
modalObject: ModalObject;
```

Defined in: [core/store/state.ts:106](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L106)

***

### origin

```ts
origin: string;
```

Defined in: [core/store/state.ts:107](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L107)

***

### page

```ts
page: PagePos;
```

Defined in: [core/store/state.ts:108](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L108)

***

### showhover

```ts
showhover: boolean;
```

Defined in: [core/store/state.ts:109](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L109)

***

### storage

```ts
storage: string;
```

Defined in: [core/store/state.ts:110](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L110)

***

### reducedMotion

```ts
reducedMotion: boolean;
```

Defined in: [core/store/state.ts:111](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L111)

***

### theme

```ts
theme: string;
```

Defined in: [core/store/state.ts:112](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L112)

***

### showStatsForNerds

```ts
showStatsForNerds: boolean;
```

Defined in: [core/store/state.ts:113](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L113)

***

### showGrid

```ts
showGrid: boolean;
```

Defined in: [core/store/state.ts:114](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L114)

***

### videoAutoplay

```ts
videoAutoplay: boolean;
```

Defined in: [core/store/state.ts:115](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L115)

***

### effectiveTheme

```ts
effectiveTheme: string;
```

Defined in: [core/store/state.ts:116](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L116)

***

### preferencesOpen

```ts
preferencesOpen: boolean;
```

Defined in: [core/store/state.ts:117](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L117)

***

### langDialogOpen

```ts
langDialogOpen: boolean;
```

Defined in: [core/store/state.ts:118](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L118)

***

### modalOrigin

```ts
modalOrigin: 
  | {
  x: number;
  y: number;
}
  | null;
```

Defined in: [core/store/state.ts:119](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L119)

***

### portfoliolist

```ts
portfoliolist: unknown[];
```

Defined in: [core/store/state.ts:120](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L120)
