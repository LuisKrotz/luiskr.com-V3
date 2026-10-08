/**
 * @file docs/mermaid.ts
 * @description Mermaid diagram rendering for docs payloads — markdown
 * ```mermaid fences land in the viewer as `.docs-mermaid` divs carrying
 * the escaped diagram source; this module lazily imports mermaid, skins
 * it with the project's live theme tokens (computed-style reads, so
 * light/dark + the turquoise accent follow the active palette), and
 * swaps each block's text for a real SVG — the GitHub behaviour.
 *
 * The import is lazy so the ~1MB mermaid chunk only loads when a doc
 * actually contains a diagram. Failures degrade to the plain source
 * block — never a broken page.
 */

import { DOCS_SELECTORS } from '@core/tokens/selectors/docs.js'
import { THEME_CSS_PROPS } from '@core/tokens/css/theme.js'
import { devWarn } from '@core/devlog.js'

/** Whether mermaid.initialize has already run — it is global config. */
let initialized = false

/**
 * Reads the live theme custom properties into a mermaid `themeVariables`
 * map — the diagram inherits the project's ink/surface/accent tokens
 * instead of shipping mermaid's default palette.
 * @param style Computed style of the docs root (carries the theme vars).
 * @returns themeVariables map for mermaid.initialize.
 */
const themeVars = (style: CSSStyleDeclaration): Record<string, string> => {
  const v = (name: string): string => style.getPropertyValue(name).trim()

  return {
    primaryColor: v(THEME_CSS_PROPS.BG_SECONDARY),
    primaryTextColor: v(THEME_CSS_PROPS.TEXT_PRIMARY),
    primaryBorderColor: v(THEME_CSS_PROPS.COLOR_ACCENT),
    secondaryColor: v(THEME_CSS_PROPS.BG_PRIMARY),
    tertiaryColor: v(THEME_CSS_PROPS.BG_SECONDARY),
    lineColor: v(THEME_CSS_PROPS.COLOR_ACCENT),
    textColor: v(THEME_CSS_PROPS.TEXT_PRIMARY),
    mainBkg: v(THEME_CSS_PROPS.BG_SECONDARY),
    nodeBorder: v(THEME_CSS_PROPS.COLOR_ACCENT),
    clusterBkg: v(THEME_CSS_PROPS.BG_PRIMARY),
    titleColor: v(THEME_CSS_PROPS.TEXT_PRIMARY),
    edgeLabelBackground: v(THEME_CSS_PROPS.BG_PRIMARY),
  }
}

/**
 * Renders every unprocessed `.docs-mermaid` block inside `container`
 * into an inline SVG diagram. Safe to call repeatedly — mermaid marks
 * processed nodes (`data-processed`), so later payloads don't re-render
 * earlier diagrams.
 * @param container The docs-content box holding rendered payload HTML.
 */
export const renderMermaidBlocks = async (container: HTMLElement): Promise<void> => {
  const blocks = Array.from(container.querySelectorAll<HTMLElement>(DOCS_SELECTORS.MERMAID)).filter(
    (b) => !b.hasAttribute('data-processed')
  )

  if (!blocks.length) return

  try {
    const mermaid = (await import('mermaid')).default

    if (!initialized) {
      initialized = true

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'base',
        themeVariables: themeVars(getComputedStyle(document.documentElement)),
      })
    }

    /** Unique render id per block — mermaid.render rejects reused ids. */
    let uid = 0

    // Per-block render — the container lives in a shadow root, so each
    // diagram is rendered headlessly (`render` uses a detached temp node)
    // and the sanitized SVG is injected directly instead of relying on
    // mermaid.run's document-level post-processing.
    for (const block of blocks) {
      try {
        const { svg } = await mermaid.render(
          `${DOCS_SELECTORS.MERMAID.replace('.', '')}-${uid++}`,
          String(block.textContent)
        )

        block.innerHTML = svg
        block.setAttribute('data-processed', 'true')
      } catch (err) {
        // A malformed diagram keeps its escaped source text — the file
        // still reads as documentation.
        devWarn('docs mermaid block failed', err)
      }
    }
  } catch (err) {
    // Import/initialize failure leaves every block as readable source.
    devWarn('docs mermaid render failed', err)
  }
}
