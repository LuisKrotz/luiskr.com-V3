[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/media/draw-text/types](../README.md) / DrawToken

Defined in: [src/components/media/draw-text/types.ts:20](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/media/draw-text/types.ts#L20)

A node of the draw-text token tree — `type` discriminates text vs markup
chunks; `chars` holds the staggered glyphs, `tag`/`attrStr`/`inner` carry parsed
markup, `chunks` nests child tokens so recursion walks one uniform shape.

## Properties

### type

```ts
type: string
```

Defined in: [src/components/media/draw-text/types.ts:21](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/media/draw-text/types.ts#L21)

---

### chars?

```ts
optional chars?: DrawChar[];
```

Defined in: [src/components/media/draw-text/types.ts:22](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/media/draw-text/types.ts#L22)

---

### tag?

```ts
optional tag?: string;
```

Defined in: [src/components/media/draw-text/types.ts:23](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/media/draw-text/types.ts#L23)

---

### attrStr?

```ts
optional attrStr?: string;
```

Defined in: [src/components/media/draw-text/types.ts:24](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/media/draw-text/types.ts#L24)

---

### inner?

```ts
optional inner?: string;
```

Defined in: [src/components/media/draw-text/types.ts:25](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/media/draw-text/types.ts#L25)

---

### chunks?

```ts
optional chunks?: DrawToken[];
```

Defined in: [src/components/media/draw-text/types.ts:26](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/media/draw-text/types.ts#L26)
