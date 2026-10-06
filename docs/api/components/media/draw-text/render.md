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

### `renderContent`

Builds the animated span tree. Each char span carries `--i`
(character index), `--char-delay`, `--offset` as CSS vars — the
stylesheet computes transition-delay = i·delay + offset, so the
whole stagger lives in CSS and JS only writes integers.
`withChars=false` renders plain words (pre/post-animation states).
Words are aria-hidden single units + the host keeps the real text —
screen readers read the whole string once instead of char-by-char.
