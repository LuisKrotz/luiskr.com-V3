# `cms/media-convert/exts.ts`

| | |
|---|---|
| **Source** | `src/cms/media-convert/exts.ts` |
| **UX surface** | Batch image→WebP conversion pipeline UI. |

## Members

### `VIDEO_EXTS`

Video extensions the pipeline normalizes into h264 mp4 + scaledown + posters.

### `MEDIA_EXTS`

Union of every accepted extension — the drop-time filter.

### `isMediaPath`

Reports whether a file name/path carries a supported media extension.
Extension check is case-insensitive; names with no dot, dotfiles
(.DS_Store) and unknown extensions all report false so OS litter inside
dropped folders never reaches the queue.
- `@param` name — file name or relative path
- `@returns` true when the extension is a known image or video format
