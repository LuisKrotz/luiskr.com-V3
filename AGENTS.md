# Project Rules & Persistent Memory

## Critical Rule: Zero Hardcoding Allowed Anywhere

Under NO circumstances may any hardcoded values be introduced into any file in this codebase:

1. **Zero Hardcoded Colors**:
   - Never use raw hex codes (`#ffffff`, `#262626`, `#0b0c10`, etc.).
   - Never use raw rgb/rgba functions with literal color channels (e.g. `rgba(200,200,200,0.15)`).
   - Never use fallback color values inside CSS variables (e.g. `var(--bg-dark, #262626)`).
   - All colors must strictly use SCSS tokens (`$color-*`, `$cms-*`) or root CSS custom properties (`var(--bg-primary)`, `var(--skel-bg-1)`, `var(--skel-bg-2)`, `var(--skel-bg-3)`).

2. **Zero Hardcoded Spacing & Dimensions**:
   - All spacing, margins, paddings, and layout dimensions must come from the Fibonacci token scale via `to-rem($space-*)` or `var(--space-*)`.
   - Never write inline dimension styles with raw numbers (e.g. `height: 180px;`, `width: 35%;`, `height: 1em;`).

3. **Zero Hardcoded Border Radii**:
   - Border radii must come from CSS tokens (`var(--radius-*)`, `to-rem($space-2xs)`).
   - Never use raw pixel (`border-radius: 4px`, `16px`) or raw rem (`border-radius: 0.25rem`) values.

4. **Zero Hardcoded Class Names (100% DRY)**:
   - All class names used in JSX/DOM must be imported from `CLASSES` in `src/core/constants.js`.
   - Base blocks (`_B_*`) must be declared once and composed without repeating string literals.

5. **JSX Only (No HTML String Interpolation)**:
   - All components returning DOM structure must return native JSX elements using `h` and `Fragment` from `src/core/jsx.js`.
   - Never use template string interpolation (`\`<div class="${...}">\``) or `innerHTML` for component templates.

6. **Zero `!important`**:
   - `!important` is strictly forbidden in any stylesheet, inline style, or runtime script.

7. **Continuous Automated Governance**:
   - `tests/style-governance.test.js` must validate and pass all these rules automatically on every test run.
