[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/playground/textures](../README.md) / EARTH\_TEXTURES

```ts
const EARTH_TEXTURES: Readonly<{
  ALBEDO: '/textures/earth/2k_earth_daymap.jpg'
  ALBEDO_2K: '/textures/earth/2k_earth_daymap.jpg'
  NIGHT: '/textures/earth/2k_earth_nightmap.jpg'
  SPECULAR: '/textures/earth/2k_earth_specular_map.jpg'
  NORMAL: '/textures/earth/2k_earth_normal_map.jpg'
  CLOUDS: '/textures/earth/2k_earth_clouds.jpg'
  STARS: '/textures/earth/starmap_2k.jpg'
  MOON: '/textures/earth/2k_moon.jpg'
  MOON_DISP: '/textures/earth/ldem_4.png'
}>
```

Defined in: [src/core/tokens/playground/textures.ts:15](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/playground/textures.ts#L15)

Public-URL paths for the Earth Playground texture set (served from `public/textures/earth/`). NASA-visible-earth style maps: day albedo, night city lights, ocean specular mask, bump/normal, cloud layer, star field backdrop, moon albedo + lunar displacement (LDEM). Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
