[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [routes/types](../README.md) / RouteDescriptor

Defined in: [src/routes/types.ts:21](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/routes/types.ts#L21)

A resolved route — everything the nav pipeline and views need.

## Properties

### name

```ts
name: string
```

Defined in: [src/routes/types.ts:23](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/routes/types.ts#L23)

Route table name ('home', 'project', 'legal', 'not-found', …).

---

### view

```ts
view: string
```

Defined in: [src/routes/types.ts:25](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/routes/types.ts#L25)

Custom-element tag of the view to mount.

---

### lang

```ts
lang: string
```

Defined in: [src/routes/types.ts:27](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/routes/types.ts#L27)

Resolved locale id ('en', 'pt', …).

---

### path

```ts
path: string
```

Defined in: [src/routes/types.ts:29](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/routes/types.ts#L29)

The matched URL path (kept for locale detection and analytics).

---

### meta

```ts
meta: RouteMeta
```

Defined in: [src/routes/types.ts:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/routes/types.ts#L31)

Head/scroll classification metadata.

---

### params

```ts
params: Record<string, string | undefined>
```

Defined in: [src/routes/types.ts:33](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/routes/types.ts#L33)

Extracted params — `slug` on project routes, etc.
