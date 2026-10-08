# `website/views/home/types.ts`

Shapes for the &lt;view-home&gt; route: the portfolio list item,

| | |
|---|---|
| **Source** | `src/website/views/home/types.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

A portfoliolist entry as stored in pages/home — `link` joins to project
routes and `featured` drives awards-carousel/highlight behavior; the index
signature passes through extra CMS fields untouched.

### (module scope)

The pages/home Firebase node — `portfoliolist` is the project list
(Firebase returns keyed objects or arrays depending on insertion order); other
nodes flow through the index signature.

### (module scope)

The pages/about Firebase node — `mentions` is the intro copy and
`mention_items` the awards/mentions rows consumed by AwardsMentions.
