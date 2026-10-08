# `core/store/state.ts`

StoreState shape + initial-state factory — locale nodes,

| | |
|---|---|
| **Source** | `src/core/store/state.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

Localized action verbs for pointer hints — 'Click' on fine-pointer
devices, 'Tap' on touch. Loaded per locale from APP.actions.

### (module scope)

The locale slice of StoreState: fetched dictionary nodes (components,
app, slugs) plus the DB path grammar and resolved locale code.
`components`/`app`/`slugs` are false/null until the Firebase fetch lands —
readers must treat falsy as "load pending", never as "empty".

### (module scope)

Awards-mentions strip state — null fields mean "not loaded yet" so the
section renders its skeleton until the fetch resolves.

### (module scope)

One media item inside the expand-modal: full-size source, thumbnail,
accessibility alt, intrinsic dimensions (kept so the lightbox can reserve
the box before the asset lands), and the video discriminator.

### (module scope)

Expand-modal descriptor written by MediaExpanded and read by the modal
component: `open` drives mount/visibility, `class` carries the figure's
orientation class so the lightbox inherits aspect styling, `transform` is
the carousel translateX offset at open time.

### (module scope)

Last known pointer position in page coordinates — feeds the magnetic
cursor follower and the modal-origin calculation.

### (module scope)

The whole reactive state bag. Field naming follows the shape the legacy
CMS data already uses (clickortap, marqueeamount, portfoliolist are
snake/flat because they mirror DB keys verbatim — renaming would break
the translation payload contract).

### (module scope)

One named mutation: receives an optional payload, mutates store.state,
and returns `false` to suppress notify() for no-op writes (any other
return value means "state changed, fan out").
- `@param` _payload Caller-supplied mutation input.

### (module scope)

Map of mutation name → mutator built by createMutations().

### (module scope)

Subscriber callback — invoked by notify() with the state bag after every
commit that didn't suppress notification.
- `@param` _state The post-mutation state.

### (module scope)

The getter facade — components read state exclusively through these
accessors so the StoreState layout can evolve without touching every
consumer. getLang (lowercase-l variant `getlang` returns the full LangState
slice) returns just the locale code — both spellings exist for legacy
call-site compatibility.

### (module scope)

Framework-free reactive state container — the app's single source of truth.
Components never read each other; they read `store.getters.*` / `store.state`
and react via `store.commit(MUTATIONS.X)` → `notify()` → every subscriber's
`onStoreUpdate`. That single fan-in/fan-out is what lets a nav button click
in one shadow root open a dialog owned by another.
