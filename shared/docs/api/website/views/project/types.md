# `website/views/project/types.ts`

Shared shapes for the &lt;view-project&gt; route: media items,

| | |
|---|---|
| **Source** | `src/website/views/project/types.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

A media row inside a project section — `src` is the extensionless CDN
stem, `size` the intrinsic [w,h] for aspect layout, `label`/`class`/`isVideo` the
optional render modifiers. Index signature passes through extra CMS fields.

### (module scope)

The project cover — like ProjectMediaItem but always present when the
project has hero media; `size` [w,h] reserves the box so the skeleton shows the
final aspect ratio before bytes arrive.

### (module scope)

One section row — either a string[] of paragraph text or a media-item
array; the union keeps sections heterogeneous without a wrapper object.

### (module scope)

The project's translation node — `title`, `noindex` SEO flag,
`folder` CDN prefix, `cover`, and `sections` (array of SectionChild arrays).
Index signature preserves CMS fields the view doesn't consume.

### (module scope)

Structural contract for <custom-carousel> — the view calls
`configure()` after upgrading, so the type exposes just that method (an
HTMLElement subclass registered elsewhere).
