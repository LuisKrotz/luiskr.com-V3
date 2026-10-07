# `playground/space/wiring.ts`

Control wiring for SpacePlayground — panel event binding,

| | |
|---|---|
| **Source** | `src/playground/space/wiring.ts` |
| **UX surface** | The /earth-playground WebGPU experience. |

## Members

### `setGroupCollapsed`

Synchronizes one group's collapsed class, accessibility state, and focusability.

### `bindSpaceControls`

Binds space controls.
- `@param` c — the component

### `startSpacePositionLoop`

Starts space position loop.
- `@param` c — the component

### `handleSpaceAction`

Handles space action.
- `@param` c — the component
- `@param` action — the value
- `@param` btn — the value

### `handleSpaceInput`

Handles space input.
- `@param` c — the component
- `@param` input — the value

### `persistSpaceParam`

persists space param.
- `@param` c — the component
- `@param` param — the value
- `@param` val — the value

### `syncSpacePanel`

Syncs space panel.
- `@param` c — the component

### `mountSpaceCheckboxCanvases`

Mounts space checkbox canvases.
- `@param` c — the component

### `destroySpaceCheckboxCanvases`

The destroySpaceCheckboxCanvases value.
- `@param` c — the component
