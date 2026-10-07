[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [playground/earth/setup/post-setup](../README.md) / EarthPostDeps

Defined in: [src/playground/earth/setup/post-setup.ts:26](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/playground/earth/setup/post-setup.ts#L26)

earths post deps.

## Properties

### TSL

```ts
TSL: __module
```

Defined in: [src/playground/earth/setup/post-setup.ts:27](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/playground/earth/setup/post-setup.ts#L27)

---

### RenderPipeline

```ts
RenderPipeline: typeof RenderPipeline
```

Defined in: [src/playground/earth/setup/post-setup.ts:28](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/playground/earth/setup/post-setup.ts#L28)

---

### bloom

```ts
bloom: (node, strength?, radius?, threshold?) => BloomNode
```

Defined in: [src/playground/earth/setup/post-setup.ts:29](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/playground/earth/setup/post-setup.ts#L29)

#### Parameters

##### node

`Node`

##### strength?

`number`

##### radius?

`number`

##### threshold?

`number`

#### Returns

`BloomNode`

---

### chromaticAberration

```ts
chromaticAberration: (node, strength?, center?, scale?) => ChromaticAberrationNode
```

Defined in: [src/playground/earth/setup/post-setup.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/playground/earth/setup/post-setup.ts#L30)

#### Parameters

##### node

`Node`

##### strength?

`Node`

##### center?

`Vector2` \| `Node` \| `null`

##### scale?

`Node`

#### Returns

`ChromaticAberrationNode`

---

### film

```ts
film: (inputNode, intensityNode?, uvNode?) => FilmNode
```

Defined in: [src/playground/earth/setup/post-setup.ts:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/playground/earth/setup/post-setup.ts#L31)

#### Parameters

##### inputNode

`Node`

##### intensityNode?

`Node` \| `null`

##### uvNode?

`Node` \| `null`

#### Returns

`FilmNode`
