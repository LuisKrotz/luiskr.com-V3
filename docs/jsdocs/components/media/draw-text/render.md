# `components/media/draw-text/render.ts`

| | |
|---|---|
| **Source** | `src/components/media/draw-text/render.ts` |
| **UX surface** | Shadow-DOM widgets — the visible UI of the public site. |

## Members

### `parseTokens`

Tokenizes the text into word/space/br/inline-tag chunks. Words split
at spaces and each character gets a global index `ci`. Spaces and
<br>s become layout-only tokens so line breaking stays identical to
unsplit text. The regex walks <br>, <tag>…</tag> (attrs preserved,
group 3 back-referenced for the closing tag), and bare text — so
inline markup inside CMS copy (e.g. an <em> or <a>) animates as one
continuous sequence.

### (module scope)

Builds the animated span tree. Each char span carries `--i`
(character index), `--char-delay`, `--offset` as CSS vars — the
stylesheet computes transition-delay = i·delay + offset, so the
whole stagger lives in CSS and JS only writes integers.
`withChars=false` renders plain words (pre/post-animation states).
Words are aria-hidden single units + the host keeps the real text —
screen readers read the whole string once instead of char-by-char.

### `chunkToHtml`

Renders one non-tag token to HTML — word tokens become animated spans via
`renderWord`, spaces become &nbsp;, everything else degrades to "".
- `@param` {DrawToken} chunk — the parsed token
- `@param` {RenderWord} renderWord — word renderer bound to the current delay/offset
- `@returns` {string} HTML for the token

### `tagToHtml`

Renders an HTML-ish tag token (e.g. <strong>, <a>) — recurses into its
chunks for the inner markup, then wraps with the original tag + attrs.
Anchors get an aria-label auto-generated from inner text when the author
did not provide one.
- `@param` {DrawToken} token — the tag token
- `@param` {RenderWord} renderWord — word renderer for nested word chunks
- `@returns` {string} HTML for the tag block

### `tokenToHtml`

The tokenToHtml constant.
- `@param` token — the token
- `@param` renderWord — the value
- `@returns` string

### `renderWordHtml`

Renders one word token's char spans. Exported so the char/offset math and
the empty-chars default are unit-testable — renderContent binds the running
word index `wi` via the closure below.

### `renderContent`

Renders content.
