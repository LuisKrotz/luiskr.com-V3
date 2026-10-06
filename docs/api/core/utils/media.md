# `core/utils/media.ts`

Media-URL builders — the single place where CDN filename

| | |
|---|---|
| **Source** | `src/core/utils/media.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `isGravatarUrl`

Checks if a given URL belongs to gravatar.com (exact host or any
subdomain like `secure.gravatar.com`). Non-Gravatar URLs must not get
`size=` rewrites — that param is Gravatar-specific.

### `getGravatarSrcset`

Builds responsive Gravatar srcset with 1x, 2x, 3x density descriptors —
200/300/400 px variants chosen by GRAVATAR_SIZE_*. Any existing `size=`
param is stripped first so the rewrite is idempotent; `sep` picks `?` or
`&` depending on whether other query params remain.

### `getOptimizedGravatar`

Replaces size parameter on Gravatar URL.

### `buildMediaUrls`

Constructs media URLs for images and videos following the project's
compression pipeline. URL grammar:
  image source : storage + folder + src + '-mozjpg-uncompressed.jpg'   (full quality)
  image thumb  : storage + folder + src + '-mozjpg3-MSSIM-tuned-kodak.jpg' (blur-up)
  video source : storage + folder + src + '.mp4'
  video thumb  : storage + folder + src + '.mp4.jpg-thumb.jpg'         (poster frame)
`src` in the DB never carries an extension — the pipeline's suffix is
appended here, which is why an unsuffixed URL 404s.
- `@param` storage - Base storage URL (store.getters.getStorage())
- `@param` folder - Project folder prefix, e.g. 'aboutmarco/'
- `@param` item - Media item descriptor `{ src, isVideo }`
