# Project Rules & Persistent Memory

## Critical Rule: Zero Hardcoding Allowed Anywhere

Under NO circumstances may any hardcoded values be introduced into any file in this codebase:

1. **Zero Hardcoded Colors**:
   - Never use raw hex codes (`#ffffff`, `#262626`, `#0b0c10`, etc.).
   - Never use raw rgb/rgba functions with literal color channels (e.g. `rgba(200,200,200,0.15)`).
   - Never use fallback color values inside CSS variables (e.g. `var(--bg-dark, #262626)`).
   - All colors must strictly use SCSS tokens (`$color-*`, `$cms-*`) or root CSS custom properties (`var(--bg-primary)`, `var(--skel-bg-1)`, `var(--skel-bg-2)`, `var(--skel-bg-3)`).
   - **Exception**: CSS custom property declarations in `_structure.scss` may use `rgba(0,0,0,…)` / `rgba(255,255,255,…)` only inside the shadow token definitions (`--shadow-card-*`) because `to-rem()` is a compile-time SCSS function and cannot be embedded in a CSS var string.

2. **Zero Hardcoded Spacing & Dimensions**:
   - All spacing, margins, paddings, and layout dimensions must come from the Fibonacci token scale via `to-rem($space-*)` or `var(--space-*)`.
   - Never write inline dimension styles with raw numbers (e.g. `height: 180px;`, `width: 35%;`, `height: 1em;`).
   - CSS custom property *values* in `_structure.scss` that contain lengths must use raw `rem` literals (e.g. `0.125rem`) because `to-rem()` is SCSS-only and is not valid inside a CSS var string.

3. **Zero Hardcoded Border Radii**:
   - Border radii must come from CSS tokens (`var(--radius-*)`, `to-rem($space-2xs)`).
   - Never use raw pixel (`border-radius: 4px`, `16px`) or raw rem (`border-radius: 0.25rem`) values.

4. **Zero Hardcoded Class Names (100% DRY)**:
   - All class names used in JSX/DOM must be imported from `CLASSES` in `src/core/constants.js`.
   - Base blocks (`_B_*`) must be declared once and composed without repeating string literals.
   - Any class that appears in more than one place must be moved to `CLASSES` and referenced via constant.

5. **Zero Hardcoded Strings in JS/JSX (100% DRY)**:
   - Every string literal that appears more than once anywhere in the codebase — class name, tag name, event name, route path, URL prefix, CMS key, attribute name, localStorage key, Firebase path prefix, query parameter, or data-attribute — MUST be declared once in `src/core/constants.js` and imported everywhere it is used.
   - Examples of what must live in `constants.js` (not as inline strings):
     - `'router-link-active'` → `CLASSES.ROUTER_LINK_ACTIVE`
     - `'/components/related'` → `PATHS.COMPONENTS_RELATED`
     - `'covers/'` → `PATHS.COVERS`
     - `'https://storage.googleapis.com/luiskr.com/public/_v3/'` → `URLS.CDN_BASE`
     - `'about-section'`, `'legal-footer'` → `CMS_KEYS.ABOUT_SECTION`, `CMS_KEYS.LEGAL_FOOTER`
     - `'decoding'`, `'loading'`, `'trigger'` → `ATTRS.DECODING`, `ATTRS.LOADING`, `ATTRS.TRIGGER`
     - All event names (e.g. `'cookieAction'`, `'resize'`) → `EVENTS.*`
   - Tests must import all string constants and use them — never assert against inline string literals.

6. **JSX Only (No HTML String Interpolation)**:
   - All components returning DOM structure must return native JSX elements using `h` and `Fragment` from `src/core/jsx.js`.
   - Never use template string interpolation (`` `<div class="${...}">` ``) or `innerHTML` for component templates.

7. **Zero `!important`**:
   - `!important` is strictly forbidden in any stylesheet, inline style, or runtime script.

8. **All SASS Files Must Use CSS Variables — Never SCSS Variables for Runtime Values**:
   - SCSS variables (`$color-*`, `$space-*`) are compile-time constants and must ONLY be used as the source-of-truth to define CSS custom properties in `_structure.scss`.
   - All component SCSS files (e.g. `home-mosaic.scss`, `carousel.scss`, etc.) must consume CSS custom properties (`var(--bg-primary)`, `var(--shadow-card)`, etc.) — never raw `$color-*` or `$space-*` SCSS variables directly.
   - Only `_structure.scss`, `_variables.scss`, `_mixins.scss`, and `_placeholders.scss` may reference `$` SCSS variables.
   - Violation: `color: $color-white` in a component stylesheet. Fix: `color: var(--color-white-raw)` or a themed token.

9. **DRY CSS — No Repeated Selectors or Pattern Strings**:
   - Any CSS class or selector that appears more than once in SCSS must use `@extend` or be composed via BEM `&--modifier` from a single root block.
   - Base block strings (e.g. `expand-modal`, `modal-media`, `internal-footer`) must be defined once using `$_B_*` SCSS variables and composed everywhere else.
   - Pattern: define `$_B_MODAL: 'modal'`, then use `#{$_B_MODAL}-open`, `#{$_B_MODAL}-close`, etc.
   - Never repeat a block prefix string more than once in any `.scss` file.

10. **Logic Blocks Separated by Blank Lines**:
    - Every distinct logical step within a function must be separated from adjacent steps by exactly one blank line.
    - Correct:
      ```js
      const dbpath = `${lang?.database || 'translations/'}${locale}/components`

      fetchFirebaseDb(dbpath)
      ```
    - Incorrect (no blank line between assignment and call):
      ```js
      const dbpath = `${lang?.database || 'translations/'}${locale}/components`
      fetchFirebaseDb(dbpath)
      ```
    - This applies to: variable declarations followed by function calls, conditionals followed by assignments, loops followed by returns, and any other logical boundary.

11. **Continuous Automated Governance**:
    - `tests/style-governance.test.js` must validate and pass all these rules automatically on every test run.
    - When a new rule is added here, a corresponding automated check must be added to `style-governance.test.js`.
