[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/store/state](../README.md) / StoreGetters

Defined in: [src/core/store/state.ts:128](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L128)

Type contract for store getters.

## Properties

### getTheme

```ts
getTheme: () => string
```

Defined in: [src/core/store/state.ts:129](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L129)

#### Returns

`string`

---

### getEffectiveTheme

```ts
getEffectiveTheme: () => string
```

Defined in: [src/core/store/state.ts:130](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L130)

#### Returns

`string`

---

### getPreferencesOpen

```ts
getPreferencesOpen: () => boolean
```

Defined in: [src/core/store/state.ts:131](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L131)

#### Returns

`boolean`

---

### getLangDialogOpen

```ts
getLangDialogOpen: () => boolean
```

Defined in: [src/core/store/state.ts:132](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L132)

#### Returns

`boolean`

---

### getModalOrigin

```ts
getModalOrigin: () =>
  | {
  x: number;
  y: number;
}
  | null;
```

Defined in: [src/core/store/state.ts:133](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L133)

#### Returns

\| \{
`x`: `number`;
`y`: `number`;
\}
\| `null`

---

### getReducedMotion

```ts
getReducedMotion: () => boolean
```

Defined in: [src/core/store/state.ts:134](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L134)

#### Returns

`boolean`

---

### getVideoAutoplay

```ts
getVideoAutoplay: () => boolean
```

Defined in: [src/core/store/state.ts:135](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L135)

#### Returns

`boolean`

---

### getStatsForNerds

```ts
getStatsForNerds: () => boolean
```

Defined in: [src/core/store/state.ts:136](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L136)

#### Returns

`boolean`

---

### getShowGrid

```ts
getShowGrid: () => boolean
```

Defined in: [src/core/store/state.ts:137](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L137)

#### Returns

`boolean`

---

### getMentions

```ts
getMentions: () => MentionsState
```

Defined in: [src/core/store/state.ts:138](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L138)

#### Returns

[`MentionsState`](MentionsState.md)

---

### getClickOrTap

```ts
getClickOrTap: () => string
```

Defined in: [src/core/store/state.ts:139](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L139)

#### Returns

`string`

---

### getInputMethod

```ts
getInputMethod: () => string
```

Defined in: [src/core/store/state.ts:140](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L140)

#### Returns

`string`

---

### getHover

```ts
getHover: () => boolean
```

Defined in: [src/core/store/state.ts:141](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L141)

#### Returns

`boolean`

---

### getlang

```ts
getlang: () => LangState
```

Defined in: [src/core/store/state.ts:142](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L142)

#### Returns

[`LangState`](LangState.md)

---

### getLang

```ts
getLang: () => string
```

Defined in: [src/core/store/state.ts:143](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L143)

#### Returns

`string`

---

### getCarouselLang

```ts
getCarouselLang: () => Record<string, unknown>
```

Defined in: [src/core/store/state.ts:144](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L144)

#### Returns

`Record`\<`string`, `unknown`\>

---

### getStatsHudLang

```ts
getStatsHudLang: () => Record<string, unknown>
```

Defined in: [src/core/store/state.ts:145](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L145)

#### Returns

`Record`\<`string`, `unknown`\>

---

### getMarqueeAmount

```ts
getMarqueeAmount: () => number
```

Defined in: [src/core/store/state.ts:146](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L146)

#### Returns

`number`

---

### getModal

```ts
getModal: () => ModalObject
```

Defined in: [src/core/store/state.ts:147](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L147)

#### Returns

[`ModalObject`](ModalObject.md)

---

### getOnMouseMove

```ts
getOnMouseMove: () => PagePos
```

Defined in: [src/core/store/state.ts:148](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L148)

#### Returns

[`PagePos`](PagePos.md)

---

### getStorage

```ts
getStorage: () => string
```

Defined in: [src/core/store/state.ts:149](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L149)

#### Returns

`string`

---

### getTouch

```ts
getTouch: () => boolean
```

Defined in: [src/core/store/state.ts:150](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L150)

#### Returns

`boolean`

---

### getPortfolioList

```ts
getPortfolioList: () => unknown[];
```

Defined in: [src/core/store/state.ts:151](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L151)

#### Returns

`unknown`[]

---

### getPortfoliolist

```ts
getPortfoliolist: () => unknown[];
```

Defined in: [src/core/store/state.ts:152](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/store/state.ts#L152)

#### Returns

`unknown`[]
