# Adopted Stylesheets Rule

CSS rules are authored in `.scss` files and delivered through compiled stylesheets. No JS string is a stylesheet.

- Never write `element.style.cssText = 'decl:val;decl:val'` — multi-declaration inline styling is banned (`core/jsx.ts` is the sole exception: it is the runtime compiling the JSX `style` prop).
- Never `element.setAttribute('style', …)` with rule payloads.
- Never hand-author CSS rule strings in JS/TS token files — rules live in `.scss`; JS only transports compiled `?inline` output.
- Document/light-DOM rules go in `core/sass/base/structure/` partials → `_structure.scss` → the global `<link>` sheet.
- Rules that must exist in EVERY shadow root compile `?inline` into `BASE_HOST_STYLES` (`core/tokens/styles.ts`) — `BaseComponent` prepends it to each component's adopted stylesheet (and to the `<style>`-node fallback on legacy engines).
- When a helper adopts a sheet at runtime, ALWAYS append: `root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet]` — never replace the array (`_renderInitial` owns the initial assignment), and re-check `.includes(sheet)` per call since re-mounts evict foreign sheets.
- Document stylesheets never cross shadow boundaries — a document-level class rule silently does not apply to shadow-injected nodes.
- Dynamic value plumbing stays legal: JSX `style={{…}}` props, `style.setProperty()`, single-property writes (`style.display`, `style.transform`).
- `display:none` is banned on accessibility/crawler content — use the clipped-1px visually-hidden rule.
- Full contract: `.agents/skills/adopted-stylesheets/SKILL.md`. Enforced by `shared/tests/governance/style-governance.test.js` (AGENTS.md rule 28).
