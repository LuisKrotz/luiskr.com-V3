# Zero Hardcoding Rule

Hardcoded values are strictly forbidden anywhere in this project:
- No raw hex, rgb, or rgba literals (e.g. `rgba(200,200,200,0.15)`). Use tokens: `var(--skel-bg-1)`, `$color-*`, etc.
- No hardcoded CSS variable fallbacks (e.g. `var(--bg, #262626)`).
- No hardcoded inline style numbers (e.g. `height: 180px`, `width: 35%`, `border-radius: 4px`, `0.25rem`). Use tokens (`to-rem($space-*)`, `var(--radius-*)`).
- No string interpolation for HTML templates. All components must return JSX (`h`, `Fragment`).
- All class names must come from `CLASSES` in `src/core/constants.js`.
- No `!important` anywhere.
