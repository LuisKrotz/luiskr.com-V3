# `experiments/docs/mermaid.ts`

Mermaid diagram rendering for docs payloads — markdown

| | |
|---|---|
| **Source** | `src/experiments/docs/mermaid.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `initialized`

Whether mermaid.initialize has already run — it is global config.

### `themeVars`

Reads the live theme custom properties into a mermaid `themeVariables`
map — the diagram inherits the project's ink/surface/accent tokens
instead of shipping mermaid's default palette.
- `@param` style Computed style of the docs root (carries the theme vars).
- `@returns` themeVariables map for mermaid.initialize.

### `renderMermaidBlocks`

Renders every unprocessed `.docs-mermaid` block inside `container`
into an inline SVG diagram. Safe to call repeatedly — mermaid marks
processed nodes (`data-processed`), so later payloads don't re-render
earlier diagrams.
- `@param` container The docs-content box holding rendered payload HTML.

### `uid`

Unique render id per block — mermaid.render rejects reused ids.
