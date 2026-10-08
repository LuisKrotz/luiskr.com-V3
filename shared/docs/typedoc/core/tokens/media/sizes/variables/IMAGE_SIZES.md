[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/media/sizes](../README.md) / IMAGE\_SIZES

```ts
const IMAGE_SIZES: Readonly<{
  HOME_MOSAIC: "(max-width: 540px) 100vw, (max-width: 960px) 50vw, (max-width: 1440px) 33vw, 25vw";
  RELATED_MOSAIC: "(max-width: 768px) 100vw, 50vw";
  PROFILE_PICTURE: "200px";
}>;
```

Defined in: [core/tokens/media/sizes.ts:11](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/media/sizes.ts#L11)

Responsive `sizes` attribute strings per media surface. Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
