# `experiments/earth-playground/earth/runtime/frame.ts`

Per-frame + per-resize behavior for the Earth engine,

| | |
|---|---|
| **Source** | `src/experiments/earth-playground/earth/runtime/frame.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `syncEarthSun`

Repositions the sun light + sprite from sun {angle, inclination} on
the fixed 200u orbit, then renormalizes the sunDir uniform — every
shader term (day/night, eclipse, scattering) reads this one uniform.

### `handleEarthResize`

Resize step: measures the shadow host first, then the canvas parent,
then the window — the canvas lives inside SpacePlayground's shadow
root, so clientWidth must come from the host, not the element.
Pixel ratio = min(devicePixelRatio, 2) × resolutionScale — the cap at
2 prevents 3x-phone GPU fill-rate blowout.

### `tickEarth`

Per-frame update, self-rescheduling via RAF.
  sun  — angle += 0.01·speed rad/frame, wrapped at 2π, then syncEarthSun
  moon — inclined-circle orbit: x = cos·d, y = sin(incl)·d,
         z = sin·cos(incl)·d (the z term flattens the circle into the
         inclination ellipse); lookAt(0,0,0) keeps the near face lit-side
  earth — y-spin at rotationSpeed rad/frame; clouds counter-rotate at
         0.2× for differential atmosphere drift
  render — pipeline if built (post FX), else plain scene render;
         a pipeline throw falls back within the same frame
