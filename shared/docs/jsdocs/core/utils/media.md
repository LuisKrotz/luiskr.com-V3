# `core/utils/media.ts`

Media-URL builders — the single place where CDN filename

| | |
|---|---|
| **Source** | `src/core/utils/media.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

A media entry's URL-relevant fields as stored in the DB: `src` is the
extensionless stem the CDN grammar appends suffixes to, and `isVideo`
selects between the image and video suffix sets.

### (module scope)

Resolved media URL triple — the full-quality `source`, the progressive
`thumb` (mozjpeg small variant or video poster frame), and the `isVideo`
discriminator echoed back so consumers don't re-inspect the item.

### `isGravatarUrl`

Checks if a given URL belongs to gravatar.com (exact host or any
subdomain like `secure.gravatar.com`). Non-Gravatar URLs must not get
`size=` rewrites — that param is Gravatar-specific. `new URL` throws on
malformed input and relative URLs without a base — the try/catch maps
both to `false` (not-Gravatar) since either case is unrewritable anyway.
- `@param` urlStr Candidate URL (absolute or relative).
- `@returns` Whether the host is gravatar.com or a subdomain.

### `getGravatarSrcset`

Builds responsive Gravatar srcset with 1x, 2x, 3x density descriptors —
200/300/400 px variants chosen by GRAVATAR_SIZE_*. Any existing `size=`
param is stripped first so the rewrite is idempotent; `sep` picks `?` or
`&` depending on whether other query params remain (stripping `size=`
may have consumed the `?`).
- `@param` urlStr Gravatar URL to expand.
- `@returns` srcset string, or '' for non-Gravatar input.

### `getOptimizedGravatar`

Replaces the `size=` parameter on a Gravatar URL. Non-Gravatar URLs pass
through unchanged (the param is meaningless off-domain), and a URL with
no `size=` is left alone since the regex finds no match.
- `@param` urlStr Candidate Gravatar URL.
- `@param` size Pixel edge to request (default 300 — the rendered avatar box).
- `@returns` Rewritten URL, original URL, or '' for non-string input.

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
