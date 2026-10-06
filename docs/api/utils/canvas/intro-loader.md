# `utils/canvas/intro-loader.ts`

Boot loader overlay: types the spec-sheet lines

| | |
|---|---|
| **Source** | `src/utils/canvas/intro-loader.ts` |
| **UX surface** | WebGL micro-widgets with Canvas2D fallback — nav, sliders, arrows. |

## Members

### `IntroLoader`

Command-Line & Spec-Driven Intro Loader

Establishes the Software Engineer identity before transitioning into the UX/UI.
Displays a bold centered percentage load counter and rapid spec terminal sequence.

### `init`

Builds the overlay DOM + starts the line sequence.

### `runAnimation`

Steps through the spec lines with the decode-in effect.

### `finish`

Completes the loader: fades the overlay and calls onComplete.

### `destroy`

Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd.
