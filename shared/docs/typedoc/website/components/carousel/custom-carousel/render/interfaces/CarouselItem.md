[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/custom-carousel/render](../README.md) / CarouselItem

Defined in: [website/components/carousel/custom-carousel/render.tsx:23](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/custom-carousel/render.tsx#L23)

Slide descriptor consumed by the carousel.

## Properties

### src

```ts
src: string;
```

Defined in: [website/components/carousel/custom-carousel/render.tsx:25](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/custom-carousel/render.tsx#L25)

Extensionless CDN stem — the media-figure resolves the real filename.

***

### size?

```ts
optional size?: number[];
```

Defined in: [website/components/carousel/custom-carousel/render.tsx:27](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/custom-carousel/render.tsx#L27)

Intrinsic [w,h] for aspect-ratio layout (optional — falls back to GENERIC_DIMENSIONS).

***

### label?

```ts
optional label?: string;
```

Defined in: [website/components/carousel/custom-carousel/render.tsx:29](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/custom-carousel/render.tsx#L29)

Accessible/visible caption.

***

### class?

```ts
optional class?: string;
```

Defined in: [website/components/carousel/custom-carousel/render.tsx:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/custom-carousel/render.tsx#L31)

Extra layout class (e.g. 'landscape') forwarded to the item wrapper.

***

### isVideo?

```ts
optional isVideo?: boolean;
```

Defined in: [website/components/carousel/custom-carousel/render.tsx:33](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/custom-carousel/render.tsx#L33)

Video slide flag — routes to the mp4 grammar + video element.

***

### canExpand?

```ts
optional canExpand?: boolean;
```

Defined in: [website/components/carousel/custom-carousel/render.tsx:35](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/custom-carousel/render.tsx#L35)

Whether the slide can open the fullscreen expand modal.
