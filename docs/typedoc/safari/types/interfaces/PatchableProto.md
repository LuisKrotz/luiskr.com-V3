[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [safari/types](../README.md) / PatchableProto

Defined in: [src/safari/types.ts:46](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/safari/types.ts#L46)

The slice of a component prototype the patches may re-bind — every
member is optional because a patch only touches the methods Safari
actually breaks (e.g. media-figure's high-res load path).

## Properties

### \_renderInitial?

```ts
optional _renderInitial?: () => void;
```

Defined in: [src/safari/types.ts:47](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/safari/types.ts#L47)

#### Returns

`void`

---

### \_measureFit?

```ts
optional _measureFit?: () => void;
```

Defined in: [src/safari/types.ts:48](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/safari/types.ts#L48)

#### Returns

`void`

---

### onMounted?

```ts
optional onMounted?: () => void;
```

Defined in: [src/safari/types.ts:49](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/safari/types.ts#L49)

#### Returns

`void`

---

### onDestroy?

```ts
optional onDestroy?: () => void;
```

Defined in: [src/safari/types.ts:50](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/safari/types.ts#L50)

#### Returns

`void`

---

### loadHighRes?

```ts
optional loadHighRes?: () => void;
```

Defined in: [src/safari/types.ts:51](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/safari/types.ts#L51)

#### Returns

`void`

---

### \_updateModalDOM?

```ts
optional _updateModalDOM?: () => void;
```

Defined in: [src/safari/types.ts:52](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/safari/types.ts#L52)

#### Returns

`void`
