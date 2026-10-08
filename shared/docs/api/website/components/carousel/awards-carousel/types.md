# `website/components/carousel/awards-carousel/types.ts`

| | |
|---|---|
| **Source** | `src/website/components/carousel/awards-carousel/types.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

One slide of the awards carousel — `link` is the outbound award URL,
`media` the optional cover image (path + intrinsic size for aspect layout),
`icon`/`description`/`content`/`label` the rendered copy fields. All optional:
slides tolerate partial CMS rows without render guards.
