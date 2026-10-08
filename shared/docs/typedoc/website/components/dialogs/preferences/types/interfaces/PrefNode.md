[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/dialogs/preferences/types](../README.md) / PrefNode

Defined in: [website/components/dialogs/preferences/types.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/dialogs/preferences/types.ts#L14)

`pref.*` translation node consumed by the preferences dialog.

## Properties

### title

```ts
title: string;
```

Defined in: [website/components/dialogs/preferences/types.ts:16](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/dialogs/preferences/types.ts#L16)

Dialog heading.

***

### done

```ts
done: string;
```

Defined in: [website/components/dialogs/preferences/types.ts:18](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/dialogs/preferences/types.ts#L18)

Confirmation text after the apply action.

***

### closeLabel

```ts
closeLabel: string;
```

Defined in: [website/components/dialogs/preferences/types.ts:20](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/dialogs/preferences/types.ts#L20)

aria-label for the close button.

***

### appearance

```ts
appearance: object;
```

Defined in: [website/components/dialogs/preferences/types.ts:22](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/dialogs/preferences/types.ts#L22)

Appearance section — theme picker copy.

#### title

```ts
title: string;
```

Section heading.

#### desc

```ts
desc: string;
```

Section description under the heading.

#### dark

```ts
dark: PrefThemeOption;
```

Dark-theme radio option.

#### system

```ts
system: PrefThemeOption;
```

Follow-OS radio option.

#### light

```ts
light: PrefThemeOption;
```

Light-theme radio option.

***

### devTools

```ts
devTools: object;
```

Defined in: [website/components/dialogs/preferences/types.ts:35](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/dialogs/preferences/types.ts#L35)

Developer-tools section — diagnostic toggles copy.

#### title

```ts
title: string;
```

Section heading.

#### statsForNerds

```ts
statsForNerds: string;
```

Label for the stats-for-nerds toggle.

#### statsForNerdsDesc

```ts
statsForNerdsDesc: string;
```

Description under the stats toggle.

#### showGrid

```ts
showGrid: string;
```

Label for the layout-grid overlay toggle.

#### showGridDesc

```ts
showGridDesc: string;
```

Description under the grid toggle.

#### reducedMotion

```ts
reducedMotion: string;
```

Label for the reduced-motion override toggle.

#### reducedMotionDesc

```ts
reducedMotionDesc: string;
```

Description under the reduced-motion toggle.
