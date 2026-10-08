[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/store/state](../README.md) / StoreGetters

Defined in: [core/store/state.ts:148](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L148)

The getter facade — components read state exclusively through these
accessors so the StoreState layout can evolve without touching every
consumer. getLang (lowercase-l variant `getlang` returns the full LangState
slice) returns just the locale code — both spellings exist for legacy
call-site compatibility.

## Properties

### getTheme

```ts
getTheme: () => string;
```

Defined in: [core/store/state.ts:149](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L149)

#### Returns

`string`

***

### getEffectiveTheme

```ts
getEffectiveTheme: () => string;
```

Defined in: [core/store/state.ts:150](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L150)

#### Returns

`string`

***

### getPreferencesOpen

```ts
getPreferencesOpen: () => boolean;
```

Defined in: [core/store/state.ts:151](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L151)

#### Returns

`boolean`

***

### getLangDialogOpen

```ts
getLangDialogOpen: () => boolean;
```

Defined in: [core/store/state.ts:152](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L152)

#### Returns

`boolean`

***

### getModalOrigin

```ts
getModalOrigin: () => 
  | {
  x: number;
  y: number;
}
  | null;
```

Defined in: [core/store/state.ts:153](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L153)

#### Returns

  \| \{
  `x`: `number`;
  `y`: `number`;
\}
  \| `null`

***

### getReducedMotion

```ts
getReducedMotion: () => boolean;
```

Defined in: [core/store/state.ts:154](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L154)

#### Returns

`boolean`

***

### getVideoAutoplay

```ts
getVideoAutoplay: () => boolean;
```

Defined in: [core/store/state.ts:155](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L155)

#### Returns

`boolean`

***

### getStatsForNerds

```ts
getStatsForNerds: () => boolean;
```

Defined in: [core/store/state.ts:156](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L156)

#### Returns

`boolean`

***

### getShowGrid

```ts
getShowGrid: () => boolean;
```

Defined in: [core/store/state.ts:157](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L157)

#### Returns

`boolean`

***

### getMentions

```ts
getMentions: () => MentionsState;
```

Defined in: [core/store/state.ts:158](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L158)

#### Returns

[`MentionsState`](MentionsState.md)

***

### getClickOrTap

```ts
getClickOrTap: () => string;
```

Defined in: [core/store/state.ts:159](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L159)

#### Returns

`string`

***

### getInputMethod

```ts
getInputMethod: () => string;
```

Defined in: [core/store/state.ts:160](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L160)

#### Returns

`string`

***

### getHover

```ts
getHover: () => boolean;
```

Defined in: [core/store/state.ts:161](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L161)

#### Returns

`boolean`

***

### getlang

```ts
getlang: () => LangState;
```

Defined in: [core/store/state.ts:162](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L162)

#### Returns

[`LangState`](LangState.md)

***

### getLang

```ts
getLang: () => string;
```

Defined in: [core/store/state.ts:163](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L163)

#### Returns

`string`

***

### getCarouselLang

```ts
getCarouselLang: () => Record<string, unknown>;
```

Defined in: [core/store/state.ts:164](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L164)

#### Returns

`Record`\<`string`, `unknown`\>

***

### getStatsHudLang

```ts
getStatsHudLang: () => Record<string, unknown>;
```

Defined in: [core/store/state.ts:165](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L165)

#### Returns

`Record`\<`string`, `unknown`\>

***

### getMarqueeAmount

```ts
getMarqueeAmount: () => number;
```

Defined in: [core/store/state.ts:166](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L166)

#### Returns

`number`

***

### getModal

```ts
getModal: () => ModalObject;
```

Defined in: [core/store/state.ts:167](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L167)

#### Returns

[`ModalObject`](ModalObject.md)

***

### getOnMouseMove

```ts
getOnMouseMove: () => PagePos;
```

Defined in: [core/store/state.ts:168](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L168)

#### Returns

[`PagePos`](PagePos.md)

***

### getStorage

```ts
getStorage: () => string;
```

Defined in: [core/store/state.ts:169](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L169)

#### Returns

`string`

***

### getTouch

```ts
getTouch: () => boolean;
```

Defined in: [core/store/state.ts:170](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L170)

#### Returns

`boolean`

***

### getPortfolioList

```ts
getPortfolioList: () => unknown[];
```

Defined in: [core/store/state.ts:171](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L171)

#### Returns

`unknown`[]

***

### getPortfoliolist

```ts
getPortfoliolist: () => unknown[];
```

Defined in: [core/store/state.ts:172](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/store/state.ts#L172)

#### Returns

`unknown`[]
