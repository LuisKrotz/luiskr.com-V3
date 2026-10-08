[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/playground/textures](../README.md) / EARTH\_TEXTURES

```ts
const EARTH_TEXTURES: Readonly<{
  ALBEDO: "/experiments/earth-playground/textures/earth/2k_earth_daymap.jpg";
  ALBEDO_2K: "/experiments/earth-playground/textures/earth/2k_earth_daymap.jpg";
  NIGHT: "/experiments/earth-playground/textures/earth/2k_earth_nightmap.jpg";
  SPECULAR: "/experiments/earth-playground/textures/earth/2k_earth_specular_map.jpg";
  NORMAL: "/experiments/earth-playground/textures/earth/2k_earth_normal_map.jpg";
  CLOUDS: "/experiments/earth-playground/textures/earth/2k_earth_clouds.jpg";
  STARS: "/experiments/earth-playground/textures/earth/starmap_2k.jpg";
  MOON: "/experiments/earth-playground/textures/earth/2k_moon.jpg";
  MOON_DISP: "/experiments/earth-playground/textures/earth/ldem_4.png";
}>;
```

Defined in: [core/tokens/playground/textures.ts:15](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/playground/textures.ts#L15)

Public-URL paths for the Earth Playground texture set (served from `public/experiments/earth-playground/textures/earth/`). NASA-visible-earth style maps: day albedo, night city lights, ocean specular mask, bump/normal, cloud layer, star field backdrop, moon albedo + lunar displacement (LDEM). Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
