# `website/components/media/draw-text/render.ts`

| | |
|---|---|
| **Source** | `src/website/components/media/draw-text/render.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `parseTokens`

Tokenizes the text into word/space/br/inline-tag chunks. Words split
at spaces and each character gets a global index `ci`. Spaces and
<br>s become layout-only tokens so line breaking stays identical to
unsplit text. The regex walks <br>, <tag>…</tag> (attrs preserved,
group 3 back-referenced for the closing tag), and bare text — so
inline markup inside CMS copy (e.g. an <em> or <a>) animates as one
continuous sequence.

### `tokenize`

Walks one segment of text — tag inner content recurses through this same
walker so nested markup (e.g. `<a><span>x</span></a>`) tokenizes instead
of leaking raw `<`/`>` chars into the output. `ci` is shared via closure
so the char stagger stays globally sequential across nesting levels.

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

Top-level token → HTML: <br> and space become aria-hidden layout
nodes (the space gets a span so the flex/grid layout sees a real box),
words render animated chars, tags recurse. Unknown token types return
"" — forward-compatible for tokenizer additions.
- `@param` token The parsed token.
- `@param` renderWord Word renderer bound to the current delay/offset.
- `@returns` HTML string for the token.

### `renderWordHtml`

Renders one word token's char spans. Exported so the char/offset math and
the empty-chars default are unit-testable — renderContent binds the running
word index `wi` via the closure below.
- `@param` chars Char tokens (each carries the global `--i` stagger index).
- `@param` wordIdx Running word index — feeds the `--wi` per-word cascade.
- `@param` delay Per-char delay in ms (written to `--char-delay`).
- `@param` offset Base offset in ms (written to `--offset`).
- `@param` withChars false → emit plain word text (pre/post-anim state).
- `@returns` The word's `<span>` HTML.

### `renderContent`

Full pipeline: text → tokens → HTML string. The `wi` closure counter
assigns each rendered word a sequential index so the word-level
cascade (`--wi`/`--word-delay`) staggers in reading order, including
words nested inside tags. Empty input returns "" rather than a stub
span tree.
- `@param` text Raw text (may contain <br> and inline tags).
- `@param` delay Per-char stagger delay in ms.
- `@param` offset Base delay offset in ms.
- `@param` withChars Whether to emit per-char spans (false = plain text).
- `@returns` The assembled HTML string.
