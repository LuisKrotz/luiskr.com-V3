# `experiments/earth-playground/space/panel-render.tsx`

Pure JSX renderers for the space-playground control panel,

| | |
|---|---|
| **Source** | `src/experiments/earth-playground/space/panel-render.tsx` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `renderSpControl`

One control row. Checkboxes render a WebGL check canvas + SVG check icon;
ranges render a slider with the range-fill CSS var + a value readout.
`savedVal` (persisted user value) wins over the control's shipped default.

### `renderSpAction`

One group-level action button (reset view / screenshot / copy settings).
