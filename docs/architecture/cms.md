# CMS (cms)

The content manager is a **separate application** sharing only `core/`
primitives and `firebase.ts` with the public site. It has its own entry
(`cms/index.html` → `cms/main.ts`), routes, editor folders, tokens and
stylesheet, and it is excluded from indexing (`noindex`, `robots.txt`).

```
cms/
├── main.ts          boots auth listener → AdminLogin or CmsDashboard;
│                    links the compiled cms.scss into the document
├── routes/
│   ├── AdminLogin.tsx    Firebase email/password login
│   └── CmsDashboard.tsx  tab shell hosting the editors
├── about/               CmsAboutEditor + {data,events,model,render,types}
├── deploy-info/         CmsDeployInfo + {data,render,types}
├── footer/              CmsFooterEditor + {data,events,lists,render,types}
├── lang/                CmsLangEditor (raw JSON dictionary editor)
├── media-convert/       CmsMediaConverter + {consts,events,files,job,render}
├── playground-editor/   CmsPlaygroundEditor + {data,events,render}
├── portfolio/           CmsPortfolioList + {data,events,model,render,types}
├── projects/            CmsProjectsList + {data,events,render,section-render,
│                        sections,types}
├── tokens.ts + tokens/  CMS-only constants (CMS_KEYS, CMS_CLASSES, CMS_LANG_NODES)
├── dev/
│   └── firebase-mock.ts  in-memory Firebase fake for offline CMS dev
└── sass/cms.scss    CMS stylesheet — also publishes the --* design tokens
                     the site emits in _structure.scss (standalone doc has
                     no other source for them)
```

Every editor is self-contained in its feature folder: the `Cms*` facade
holds state + lifecycle + delegates, behavior lives in sibling modules
(`data` = Firebase load/save, `events` = input binding, `render` = JSX).

## Tabs → editors → DB nodes

| Dashboard tab                         | Editor                | Reads / writes (`translations/<loc>/`)                                                                                                                           |
| ------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage & Portfolio                  | `CmsPortfolioList`    | `pages/HOME`, project card lists                                                                                                                                 |
| Project Case Studies                  | `CmsProjectsList`     | `projects/<key>`                                                                                                                                                 |
| About & Gravatar                      | `CmsAboutEditor`      | `pages/ABOUT`, profile/gravatar settings                                                                                                                         |
| Footers & Contact                     | `CmsFooterEditor`     | `components/contact`, `components/legal-footer`, `components/related`                                                                                            |
| Language Dictionary & Keys            | `CmsLangEditor`       | every node in `CMS_LANG_NODES` — `APP`, `components`, `pages/*` (HOME, about, GDPR, privacy-policy, terms-of-use, not-found, earth-playground), `slugs`          |
| Playground & Lang Keys                | `CmsPlaygroundEditor` | `pages/earth-playground` labels **and** the `defaults` object (initial slider/toggle values — seeded from `SP_DB_DEFAULT_SEED` when the node is absent), `slugs` |
| 🎬 Media Converter _(localhost only)_ | `CmsMediaConverter`   | local temp jobs — see below                                                                                                                                      |

## Write rules

- All writes go through `set(ref(db, path), value)` per locale — an editor
  loads every locale's node, shows a locale switcher, and saves the active one.
- **Merge-preserving**: `CmsFooterEditor` writes
  `{ ...relatedExtra, ...relatedFooter }` so unknown fields
  (`related.projects`, `related.path`) survive a save.
- `sections` arrays in projects are stored as `[texts, media]` **tuple arrays**
  (the public `Project.tsx` maps over them) — never as `{texts, media}` objects.

## Media URL convention

CMS thumbnails mirror the public `MediaFigure` pipeline (`core/tokens/*`):

```js
image thumb : CDN_BASE + folder + src + MEDIA.MOZ + MEDIA.THUMB_SUFFIX + MEDIA.EXT
//          → …/img-mozjpg3-MSSIM-tuned-kodak.jpg
video thumb : CDN_BASE + folder + src + MEDIA.VIDEO_THUMB_EXT
//          → …/clip.mp4.jpg-thumb.jpg
```

Suffix-less URLs 404 on the CDN — every preview must apply the suffixes.
Broken/empty `src` shows a `cms-media-thumb-placeholder`.

## Layout notes (fixed bugs)

- `.cms-field-row` is a `minmax(200px,1fr)` auto-fit grid; a bare `.cms-btn`
  inside it stretched to a giant cell — `> .cms-btn` is now intrinsically sized
  (`justify-self: start; align-self: end`).
- Legal footer links use the DB's `page` field as the label (not `label` or
  `description`); the channel-list renderer takes the field name as a param.
- Case-study footer lives at `components/related` (`title`, `note` →
  disclaimer, `socials[]` with `network` labels) — **not**
  `components/related-footer` (a nonexistent node the CMS used to fetch).

## Standalone styling

`cms/index.html` is its own document — it never loads the site's
`_structure.scss`, which is the only place that publishes `--radius-*`,
`--font-*`, `--text-*`, `--bg-*`. `cms.scss` re-declares every consumed token
on `:root` (document) and `:host` (each shadow root), sizes typography at a
readable base, and `cms/main.ts` links the compiled sheet so the document
itself is styled even before components mount. This is what fixed the "tiny
fonts / giant buttons / unstyled layout" class of bugs — the data rendered
correctly but no tokens resolved.

## Offline dev mock

`yarn dev:cms` (`CMS_MOCK=1 vite`) aliases `firebase.ts` +
`firebase/database` to `cms/dev/firebase-mock.ts`, an in-memory fake
seeded from `database.json` — the full dashboard works with no auth and no
network. The alias lives only inside the `CMS_MOCK` branch of `vite.config.js`,
so production builds are untouched.

## Media Converter (localhost only)

A batch converter that produces every CDN variant the site consumes, matching
the manual scripts under `tasks/`:

```
drop folder/files → temp job dir → ffmpeg/convert pipeline → ZIP download
```

**Server** — `scripts/media-convert/` is a Vite plugin mounted on the dev and
preview middleware stacks only (`/api/media-convert/*`). It never ships in a
bundle, so the feature physically cannot exist in production; the dashboard tab
additionally hides itself unless `location.hostname` is localhost.

| Endpoint                 | Purpose                                                   |
| ------------------------ | --------------------------------------------------------- |
| `POST /jobs`             | create temp job (`os.tmpdir()/luiskr-media-convert/<id>`) |
| `PUT /jobs/:id/files`    | stream one input file (`x-file-path` header)              |
| `POST /jobs/:id/convert` | start the async pipeline                                  |
| `GET /jobs/:id`          | poll `{status,total,done,current,results}`                |
| `GET /jobs/:id/zip`      | all outputs as one ZIP                                    |
| `DELETE /jobs/:id`       | cleanup (also auto-pruned after 1 h)                      |

**Pipeline** (`scripts/media-convert/pipeline.js`) mirrors `tasks/image/` + `tasks/video/` exactly:
4 mozjpeg variants per image (`-mozjpg-uncompressed`, `-50`, `-75`,
`-mozjpg3-MSSIM-tuned-kodak` q25+blur) and 6 outputs per video (`mp4`,
`mp4-scaledown-2x.mp4`, posters + `-thumb.jpg` of both). Prefers
`convert`/`cjpeg` when installed, falls back to ffmpeg. Folder structure is
preserved into the ZIP (`scripts/media-convert/zip.js` is a dependency-free
ZIP writer).

**Client** — `CmsMediaConverter` collects drops via
`webkitGetAsEntry` traversal, uploads sequentially with per-file progress,
polls status, then fires the dashboard toast (`CMS_EVENTS.NOTIFY`) **and** a
system `Notification` (permission requested when conversion starts).

## Governance status

All CMS editors render through JSX (`h()`/`CMS_TAGS`) — `CmsLangEditor` and
`CmsPortfolioList` were migrated off template-string HTML. `cms.scss` consumes
`--*` tokens / `to-rem($space-*)`; the remaining gap is that
`style-governance.test.js` scans `core/sass/**` only, so CMS-SCSS violations
are unenforced until the scan is widened.

## Deploy Info tab

`CmsDeployInfo` renders `dist/deploy-info/` (written by
`scripts/build/deploy-info.mjs`): latest Lighthouse CI scores per URL and Jest
coverage totals. Auth-gated like the rest of the CMS; shows an empty-state
hint when no bundle exists yet.
