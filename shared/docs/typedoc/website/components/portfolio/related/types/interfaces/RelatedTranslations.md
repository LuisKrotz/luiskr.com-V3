[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/portfolio/related/types](../README.md) / RelatedTranslations

Defined in: [website/components/portfolio/related/types.ts:36](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/portfolio/related/types.ts#L36)

The components/related DB node as consumed by <portfolio-related> —
`projects` may arrive keyed-object or array from Firebase, `path` is the
portfolio base route, `socials`/`note`/`title` the footer copy.

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [website/components/portfolio/related/types.ts:37](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/portfolio/related/types.ts#L37)

***

### projects?

```ts
optional projects?: 
  | Record<string, RelatedProject>
  | RelatedProject[];
```

Defined in: [website/components/portfolio/related/types.ts:38](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/portfolio/related/types.ts#L38)

***

### path?

```ts
optional path?: string;
```

Defined in: [website/components/portfolio/related/types.ts:39](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/portfolio/related/types.ts#L39)

***

### socials?

```ts
optional socials?: RelatedSocial[];
```

Defined in: [website/components/portfolio/related/types.ts:40](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/portfolio/related/types.ts#L40)

***

### note?

```ts
optional note?: string;
```

Defined in: [website/components/portfolio/related/types.ts:41](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/portfolio/related/types.ts#L41)
