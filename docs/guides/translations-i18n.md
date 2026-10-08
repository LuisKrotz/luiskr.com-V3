# Translations & i18n

## Locales

`VALID_LANGS` (`core/i18n.ts`) — 16 locales:

`en br es de hrk cas riv gn it ru fr tln gl ca nl ga`

`gl` (Galician), `ca` (Catalan), `nl` (Dutch), `ga` (Irish) were added later;
Firebase was synced so all locales mirror the English structure exactly.

## Database tree

All copy lives under `translations/<locale>/` — see
[data-model.md](../architecture/data-model.md) for full schema. Layers:

```
translations/<loc>/
├── APP/          global UI strings (menu, loader, engine, statsHud, …)
├── components/   per-component copy (contact, legal-footer, related, media, …)
├── pages/        per-route copy (HOME, ABOUT, GDPR, EARTH_PLAYGROUND, …)
├── projects/     portfolio case-study docs
└── slugs/        localized route slugs (see routing.md)
```

## Load path

```
main.ts
  └─► virtual:locale-bootstrap chunks   (per-locale, emitted by Vite plugin)
        renders snapshot instantly — zero network wait

        fetchFirebaseDb(path, { onUpdate })   core/utils/data/db.ts
          ├─► stale → snapshot value (same as bootstrap)
          └─► live  → Firebase realtime value
                    • deep-equal (order-insensitive) → no re-render
                    • live === null → keep snapshot (never wipe)
                    • different → onUpdate() → view re-renders
```

`App.tsx` subscribes `APP`, `components` and `slugs` once per locale; views
subscribe their own `pages/*` or `projects/*` nodes.

## Lookup order in components

```
appText(UI_KEYS.X)            core/locale/ui-text.ts
  1. store APP dict (live/snapshot, current locale)
  2. FALLBACK.APP (build-time embedded English snapshot)
component/page text:
  view passes its fetched node down; missing keys fall back to
  FALLBACK_PAGES (embedded snapshot)
```

Hardcoded English strings in components are a **bug** — user-facing copy must
come from the DB/snapshot. `scripts/i18n/ast-string-extract.js` regenerates
`core/locale/string-inventory.json` auditing every literal against the DB.

## Invariants (enforced by tests)

- Every locale mirrors the English key structure and ordering.
- Every `UI_KEYS` path resolves in the `en` APP dict.
- `pages/EARTH_PLAYGROUND` holds all playground labels (39 keys).
- `APP.statsHud` holds all HUD labels (`fps`, `cpu`, `gpu`, `net`, `lat`,
  `requests`, `mem`, `engine.on`, `engine.off`).

## CMS editing

- `CmsLangEditor` edits the `APP` dictionary per locale.
- `CmsPlaygroundEditor` edits `pages/EARTH_PLAYGROUND` + `slugs`.
- `CmsFooterEditor` writes `components/contact`, `components/legal-footer`,
  `components/related` (merge-preserving unrelated fields).
