/**
 * @file draw-text/render.ts — tokenizer + innerHTML builder.
 *
 * The tokenizer walks words/spaces/<br>/inline-tags into chunks; each
 * character gets a global index `ci` that feeds the CSS stagger (--i).
 * innerHTML is intentional: per-char DOM API creation was the bottleneck
 * on long pages (documented exception — content is tokenized/sanitized,
 * never raw CMS HTML).
 */

import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { DRAW_TEXT_CLASSES } from '@core/tokens/classes/draw-text.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { CSS_STRINGS } from '@core/tokens/strings/css.js'
import { DOM_STRINGS } from '@core/tokens/strings/dom.js'
import { escapeHtml, stripHtml } from '@core/utils/string.js'
import type { DrawChar, DrawToken } from './types.js'
import { DRAW_TIMINGS } from '@core/tokens/media/dimensions.js'

/**
 * Tokenizes the text into word/space/br/inline-tag chunks. Words split
 * at spaces and each character gets a global index `ci`. Spaces and
 * <br>s become layout-only tokens so line breaking stays identical to
 * unsplit text. The regex walks <br>, <tag>…</tag> (attrs preserved,
 * group 3 back-referenced for the closing tag), and bare text — so
 * inline markup inside CMS copy (e.g. an <em> or <a>) animates as one
 * continuous sequence.
 */
export function parseTokens(text: string): DrawToken[] {
  let ci = 0

  const parseText = (str: string): DrawToken[] => {
    const chunks: DrawToken[] = []

    const parts = str.split(CHAR_STRINGS.SPACE_CHAR)

    parts.forEach((part, idx) => {
      if (part.length) {
        const chars: DrawChar[] = []

        for (const ch of part) {
          chars.push({ ci: ci++, value: ch })
        }

        chunks.push({ type: CSS_STRINGS.TOKEN_WORD, chars })
      }

      if (idx < parts.length - 1) {
        ci++

        chunks.push({ type: CSS_STRINGS.TOKEN_SPACE })
      }
    })

    return chunks
  }

  /**
   * Walks one segment of text — tag inner content recurses through this same
   * walker so nested markup (e.g. `<a><span>x</span></a>`) tokenizes instead
   * of leaking raw `<`/`>` chars into the output. `ci` is shared via closure
   * so the char stagger stays globally sequential across nesting levels.
   */
  const tokenize = (str: string): DrawToken[] => {
    const result: DrawToken[] = []

    const regex = /(<br\s*\/?>)|(<(\w+)([^>]*)>(.*?)<\/\3>)|([^<]+)|(<)/gi

    let match: RegExpExecArray | null

    while ((match = regex.exec(str)) !== null) {
      if (match[1]) {
        result.push({ type: CSS_STRINGS.TOKEN_BR })
      } else if (match[2]) {
        const tag = match[3]

        const attrStr = match[4] || ATTR_VALUES.EMPTY

        const inner = match[5] || ATTR_VALUES.EMPTY

        result.push({ type: CSS_STRINGS.TOKEN_TAG, tag, attrStr, inner, chunks: tokenize(inner) })
      } else {
        // Bare text run — or a stray `<` that matched no tag alternative;
        // parseText indexes its chars so the renderer escapes it as `&lt;`.
        result.push(...parseText(match[6] || match[7]))
      }
    }

    return result
  }

  return tokenize(text)
}

/**
 * Builds the animated span tree. Each char span carries `--i`
 * (character index), `--char-delay`, `--offset` as CSS vars — the
 * stylesheet computes transition-delay = i·delay + offset, so the
 * whole stagger lives in CSS and JS only writes integers.
 * `withChars=false` renders plain words (pre/post-animation states).
 * Words are aria-hidden single units + the host keeps the real text —
 * screen readers read the whole string once instead of char-by-char.
 */
type RenderWord = (chars?: DrawChar[]) => string

/**
 * Renders one non-tag token to HTML — word tokens become animated spans via
 * `renderWord`, spaces become &nbsp;, everything else degrades to "".
 * @param {DrawToken} chunk — the parsed token
 * @param {RenderWord} renderWord — word renderer bound to the current delay/offset
 * @returns {string} HTML for the token
 */
const chunkToHtml = (chunk: DrawToken, renderWord: RenderWord): string => {
  if (chunk.type === CSS_STRINGS.TOKEN_WORD) return renderWord(chunk.chars)

  // Bare space text node inside tags: a wrapper span sanitizes to "" per-node in axe's
  // visible-text check (label-content-name-mismatch), so the space must reach the parent.
  if (chunk.type === CSS_STRINGS.TOKEN_SPACE) return CHAR_STRINGS.NBSP

  if (chunk.type === CSS_STRINGS.TOKEN_BR) return '<br aria-hidden="true" />'

  // Nested tag (e.g. <a><span>label</span></a>) — recurse so children render.
  if (chunk.type === CSS_STRINGS.TOKEN_TAG) return tagToHtml(chunk, renderWord)

  return ATTR_VALUES.EMPTY
}

/**
 * Renders an HTML-ish tag token (e.g. <strong>, <a>) — recurses into its
 * chunks for the inner markup, then wraps with the original tag + attrs.
 * Anchors get an aria-label auto-generated from inner text when the author
 * did not provide one.
 * @param {DrawToken} token — the tag token
 * @param {RenderWord} renderWord — word renderer for nested word chunks
 * @returns {string} HTML for the tag block
 */
const tagToHtml = (token: DrawToken, renderWord: RenderWord): string => {
  const innerContent = (token.chunks || [])
    .map((chunk) => chunkToHtml(chunk, renderWord))
    .join(ATTR_VALUES.EMPTY)

  // A tag token without a tag name is malformed input (parseTokens always
  // sets one) — emit the children unwrapped rather than an `<undefined>` tag.
  if (!token.tag) return innerContent

  const labelAttr =
    token.tag.toLowerCase() === DOM_STRINGS.A_TAG &&
    !(token.attrStr || ATTR_VALUES.EMPTY).includes(ARIA_ATTRS.ARIA_LABEL)
      ? ` aria-label="${escapeHtml(
          stripHtml(token.inner || ATTR_VALUES.EMPTY)
            .split(CHAR_STRINGS.SPACE_CHAR)
            .join(CHAR_STRINGS.NBSP)
        )}"`
      : ATTR_VALUES.EMPTY

  return `<${token.tag} ${token.attrStr || ATTR_VALUES.EMPTY}${labelAttr}>${innerContent}</${token.tag}>`
}

/**
 * Top-level token → HTML: <br> and space become aria-hidden layout
 * nodes (the space gets a span so the flex/grid layout sees a real box),
 * words render animated chars, tags recurse. Unknown token types return
 * "" — forward-compatible for tokenizer additions.
 * @param token The parsed token.
 * @param renderWord Word renderer bound to the current delay/offset.
 * @returns HTML string for the token.
 */
export const tokenToHtml = (token: DrawToken, renderWord: RenderWord): string => {
  if (token.type === CSS_STRINGS.TOKEN_BR) return '<br aria-hidden="true" />'

  if (token.type === CSS_STRINGS.TOKEN_SPACE)
    return `<span class="${DRAW_TEXT_CLASSES.DRAW_TEXT_SPACE}" aria-hidden="true">&nbsp;</span>`

  if (token.type === CSS_STRINGS.TOKEN_WORD) return renderWord(token.chars)

  if (token.type === CSS_STRINGS.TOKEN_TAG) return tagToHtml(token, renderWord)

  return ATTR_VALUES.EMPTY
}

/**
 * Renders one word token's char spans. Exported so the char/offset math and
 * the empty-chars default are unit-testable — renderContent binds the running
 * word index `wi` via the closure below.
 * @param chars Char tokens (each carries the global `--i` stagger index).
 * @param wordIdx Running word index — feeds the `--wi` per-word cascade.
 * @param delay Per-char delay in ms (written to `--char-delay`).
 * @param offset Base offset in ms (written to `--offset`).
 * @param withChars false → emit plain word text (pre/post-anim state).
 * @returns The word's `<span>` HTML.
 */
export const renderWordHtml = (
  chars: DrawChar[] = [],
  wordIdx: number,
  delay: number,
  offset: number,
  withChars: boolean
): string => {
  const charsHtml = withChars
    ? chars
        .map(
          (ch) =>
            `<span class="${DRAW_TEXT_CLASSES.DRAW_TEXT_CHAR}" style="--i: ${ch.ci}; --char-delay: ${delay}ms; --offset: ${offset}ms;">${escapeHtml(ch.value)}</span>`
        )
        .join(ATTR_VALUES.EMPTY)
    : chars.map((ch) => escapeHtml(ch.value)).join(ATTR_VALUES.EMPTY)

  // Word-level extra stagger (delay×4, capped) — multi-word phrases
  // cascade gently word-by-word on top of the per-char stagger.
  const wordDelay = Math.min(delay * 4, DRAW_TIMINGS.DRAW_WORD_MAX_DELAY)

  return `<span class="${DRAW_TEXT_CLASSES.DRAW_TEXT_WORD}" aria-hidden="true" style="--wi: ${wordIdx}; --word-delay: ${wordDelay}ms; --offset: ${offset}ms;">${charsHtml}</span>`
}

/**
 * Full pipeline: text → tokens → HTML string. The `wi` closure counter
 * assigns each rendered word a sequential index so the word-level
 * cascade (`--wi`/`--word-delay`) staggers in reading order, including
 * words nested inside tags. Empty input returns "" rather than a stub
 * span tree.
 * @param text Raw text (may contain <br> and inline tags).
 * @param delay Per-char stagger delay in ms.
 * @param offset Base delay offset in ms.
 * @param withChars Whether to emit per-char spans (false = plain text).
 * @returns The assembled HTML string.
 */
export function renderContent(
  text: string,
  delay: number,
  offset: number,
  withChars = true
): string {
  if (!text) return ATTR_VALUES.EMPTY

  const tokens = parseTokens(text)

  let wi = 0

  const renderWord: RenderWord = (chars) => renderWordHtml(chars, wi++, delay, offset, withChars)

  const htmlParts = tokens.map((token) => tokenToHtml(token, renderWord))

  return htmlParts.join(ATTR_VALUES.EMPTY)
}
