# luiskr.com V3 — desktop

The Electron shell — wraps the built site+CMS as an installable desktop app.

Rather than `file://` (which would break service workers, module preloads, and
Firebase OAuth), the app serves `dist/` over an ephemeral `127.0.0.1` port so
everything runs on a real http origin — the same behavior as `yarn preview`.

The media-convert API is intentionally not proxied: it exists only under
`yarn dev`'s Vite middleware, so the converter panel behaves exactly like a
non-dev browser (the localhost gate hides it).

## Files

| File                   | What it does                                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| `main.mjs`             | Electron main process — serves `dist/` on a local port, loads the site.                                     |
| `launcher-main.mjs`    | Launcher window — a small GUI for `yarn setup`/`dev`/`verify`/`build` so common operations are one click.   |
| `launcher.html`        | The launcher's renderer page.                                                                               |
| `preload.mjs`          | Context-isolated preload — exposes a namespaced API for command + streamed output without node integration. |
| `electron-builder.yml` | electron-builder config — per-OS installers (dmg/nsis/AppImage).                                            |
| `package.json`         | The `desktop:dev` / `desktop:build` scripts.                                                                |

## Commands

```bash
yarn desktop:dev      # open the built site in an Electron window
yarn desktop:build    # per-OS installers → release/ (dmg/nsis/AppImage)
yarn setup:gui        # open the setup/run/build launcher GUI
```

---

Part of [luiskr.com-V3](https://github.com/LuisKrotz/luiskr.com-V3).

License: [MPL-2.0](https://github.com/LuisKrotz/luiskr.com-V3/blob/development/LICENSE)
