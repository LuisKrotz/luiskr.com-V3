[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [core/utils/canvas/loaders/intro-loader](../README.md) / IntroLoader

Defined in: [core/utils/canvas/loaders/intro-loader.ts:23](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/intro-loader.ts#L23)

Command-Line & Spec-Driven Intro Loader

Establishes the Software Engineer identity before transitioning into the UX/UI.
Displays a bold centered percentage load counter and rapid spec terminal sequence.

## Constructors

### Constructor

```ts
new IntroLoader(rootContainer?, onComplete?): IntroLoader;
```

Defined in: [core/utils/canvas/loaders/intro-loader.ts:33](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/intro-loader.ts#L33)

#### Parameters

##### rootContainer?

`HTMLElement` = `document.body`

##### onComplete?

(() => `void`) \| `null`

#### Returns

`IntroLoader`

## Properties

### rootContainer

```ts
rootContainer: HTMLElement;
```

Defined in: [core/utils/canvas/loaders/intro-loader.ts:24](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/intro-loader.ts#L24)

***

### onComplete

```ts
onComplete: (() => void) | null;
```

Defined in: [core/utils/canvas/loaders/intro-loader.ts:25](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/intro-loader.ts#L25)

***

### container

```ts
container: HTMLElement | null = null;
```

Defined in: [core/utils/canvas/loaders/intro-loader.ts:26](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/intro-loader.ts#L26)

***

### percentEl

```ts
percentEl: HTMLElement | null = null;
```

Defined in: [core/utils/canvas/loaders/intro-loader.ts:27](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/intro-loader.ts#L27)

***

### terminalEl

```ts
terminalEl: HTMLElement | null = null;
```

Defined in: [core/utils/canvas/loaders/intro-loader.ts:28](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/intro-loader.ts#L28)

***

### progress

```ts
progress: number = 0;
```

Defined in: [core/utils/canvas/loaders/intro-loader.ts:29](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/intro-loader.ts#L29)

***

### animId

```ts
animId: number | null = null;
```

Defined in: [core/utils/canvas/loaders/intro-loader.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/intro-loader.ts#L30)

***

### startTime

```ts
startTime: number;
```

Defined in: [core/utils/canvas/loaders/intro-loader.ts:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/intro-loader.ts#L31)

## Methods

### init()

```ts
init(): void;
```

Defined in: [core/utils/canvas/loaders/intro-loader.ts:44](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/intro-loader.ts#L44)

Builds the overlay DOM + starts the line sequence.

#### Returns

`void`

***

### runAnimation()

```ts
runAnimation(): void;
```

Defined in: [core/utils/canvas/loaders/intro-loader.ts:86](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/intro-loader.ts#L86)

Steps through the spec lines with the decode-in effect.

#### Returns

`void`

***

### finish()

```ts
finish(): void;
```

Defined in: [core/utils/canvas/loaders/intro-loader.ts:127](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/intro-loader.ts#L127)

Completes the loader: fades the overlay and calls onComplete.

#### Returns

`void`

***

### destroy()

```ts
destroy(): void;
```

Defined in: [core/utils/canvas/loaders/intro-loader.ts:144](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/intro-loader.ts#L144)

Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd.

#### Returns

`void`
