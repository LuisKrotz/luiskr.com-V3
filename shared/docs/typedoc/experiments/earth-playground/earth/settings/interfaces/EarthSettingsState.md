[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [experiments/earth-playground/earth/settings](../README.md) / EarthSettingsState

Defined in: [experiments/earth-playground/earth/settings.ts:21](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/settings.ts#L21)

The mutable engine state the snapshot reads — mirrors the private
 fields on EarthBackground; everything nullable covers pre-bootstrap.

## Properties

### cg

```ts
cg: 
  | {
  contrast: number;
  saturation: number;
  blackLevel: number;
  blueGreenBoost: number;
}
  | null;
```

Defined in: [experiments/earth-playground/earth/settings.ts:22](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/settings.ts#L22)

***

### moonCfg

```ts
moonCfg: 
  | {
  enabled: boolean;
  speed: number;
  distance: number;
  inclination: number;
  angle: number;
}
  | null;
```

Defined in: [experiments/earth-playground/earth/settings.ts:23](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/settings.ts#L23)

***

### bloom\_

```ts
bloom_: 
  | {
  enabled: boolean;
  strength: number;
  radius: number;
  threshold: number;
}
  | null;
```

Defined in: [experiments/earth-playground/earth/settings.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/settings.ts#L30)

***

### vig

```ts
vig: 
  | {
  enabled: boolean;
  darkness: number;
  offset: number;
}
  | null;
```

Defined in: [experiments/earth-playground/earth/settings.ts:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/settings.ts#L31)

***

### ca

```ts
ca: 
  | {
  enabled: boolean;
  strength: number;
  scale: number;
}
  | null;
```

Defined in: [experiments/earth-playground/earth/settings.ts:32](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/settings.ts#L32)

***

### film

```ts
film: 
  | {
  enabled: boolean;
  intensity: number;
}
  | null;
```

Defined in: [experiments/earth-playground/earth/settings.ts:33](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/settings.ts#L33)

***

### earth\_

```ts
earth_: 
  | {
  rotationSpeed: number;
  trueInclination: boolean;
}
  | null;
```

Defined in: [experiments/earth-playground/earth/settings.ts:34](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/settings.ts#L34)

***

### sun

```ts
sun: 
  | {
  autoRotate: boolean;
  speed: number;
  inclination: number;
  intensity: number;
  color: number;
  angle: number;
}
  | null;
```

Defined in: [experiments/earth-playground/earth/settings.ts:35](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/settings.ts#L35)

***

### earthMatUniforms

```ts
earthMatUniforms: Record<string, UniformNode<"float", number>> | null;
```

Defined in: [experiments/earth-playground/earth/settings.ts:43](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/settings.ts#L43)

***

### camera

```ts
camera: PerspectiveCamera | null;
```

Defined in: [experiments/earth-playground/earth/settings.ts:44](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/settings.ts#L44)

***

### controls

```ts
controls: OrbitControls | null;
```

Defined in: [experiments/earth-playground/earth/settings.ts:45](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/settings.ts#L45)

***

### render

```ts
render: object;
```

Defined in: [experiments/earth-playground/earth/settings.ts:46](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/settings.ts#L46)

#### resolutionScale

```ts
resolutionScale: number;
```
