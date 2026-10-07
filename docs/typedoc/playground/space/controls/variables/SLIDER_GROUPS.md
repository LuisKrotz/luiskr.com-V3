[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [playground/space/controls](../README.md) / SLIDER\_GROUPS

```ts
const SLIDER_GROUPS: readonly SpGroup[]
```

Defined in: [src/playground/space/controls.ts:105](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/playground/space/controls.ts#L105)

Declarative control schema — the panel renders straight from this so a
new engine knob needs no JSX change. Per control:
label translation key looked up in the earth-playground node (and
the key used by the CMS `defaults` map)
param SP_PARAMS token — the persisted-settings key + data-param attr
type _R range slider | _C WebGL checkbox
min/max/step/def range geometry; `def` is the shipped default until
the CMS `defaults` map or a saved user value wins
checked checkbox shipped state — same precedence as `def`
actions group-level buttons (reset view, screenshot, copy settings)
`collapsed` controls whether the group starts folded in the panel.
