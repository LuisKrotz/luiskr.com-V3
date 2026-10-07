[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [cms/projects/types](../README.md) / CmsProject

Defined in: [src/cms/projects/types.ts:25](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/projects/types.ts#L25)

The persisted CMS project document shape.

## Properties

### title

```ts
title: string
```

Defined in: [src/cms/projects/types.ts:27](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/projects/types.ts#L27)

Project title (heading + metadata).

---

### folder

```ts
folder: string
```

Defined in: [src/cms/projects/types.ts:29](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/projects/types.ts#L29)

CDN folder prefix all media resolves under.

---

### seo

```ts
seo: object
```

Defined in: [src/cms/projects/types.ts:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/projects/types.ts#L31)

SEO flags — noIndex removes the project from crawlers/schema.

#### noIndex

```ts
noIndex: boolean
```

---

### cover

```ts
cover: CmsMediaItem
```

Defined in: [src/cms/projects/types.ts:33](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/projects/types.ts#L33)

Cover media shown in mosaics/cards.

---

### sections

```ts
sections: CmsSection[];
```

Defined in: [src/cms/projects/types.ts:35](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/projects/types.ts#L35)

Ordered content sections.
