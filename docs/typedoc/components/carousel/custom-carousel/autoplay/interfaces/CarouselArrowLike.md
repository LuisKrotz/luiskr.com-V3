[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/custom-carousel/autoplay](../README.md) / CarouselArrowLike

Defined in: [website/components/carousel/custom-carousel/autoplay.ts:15](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/website/components/carousel/custom-carousel/autoplay.ts#L15)

Slice of CarouselArrowWebGL the autoplay engine drives.

## Methods

### setPlaying()

```ts
setPlaying(playing): void;
```

Defined in: [website/components/carousel/custom-carousel/autoplay.ts:17](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/website/components/carousel/custom-carousel/autoplay.ts#L17)

Toggles the arrow's playing affordance (ring visible vs idle).

#### Parameters

##### playing

`boolean`

#### Returns

`void`

---

### setProgress()

```ts
setProgress(progress, running): void;
```

Defined in: [website/components/carousel/custom-carousel/autoplay.ts:19](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/website/components/carousel/custom-carousel/autoplay.ts#L19)

Paints the 0–1 progress arc.

#### Parameters

##### progress

`number`

##### running

`boolean`

#### Returns

`void`
