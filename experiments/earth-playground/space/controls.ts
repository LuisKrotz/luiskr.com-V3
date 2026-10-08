/**
 * @file playground/space/controls.ts
 * @description Control schema + persistence for <view-space-playground>,
 * extracted from SpacePlayground.tsx: the declarative SLIDER_GROUPS the
 * panel renders from, the SP_PARAMS → EarthBackground method adapter map,
 * and the versioned localStorage helpers. English label defaults come
 * from FALLBACK_PAGES and are overwritten by CMS translations at runtime.
 */

import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { SP_ACTIONS } from '@core/tokens/playground/actions.js'
import { TRANSLATION_KEYS } from '@core/tokens/routes/translation-keys.js'
import { FALLBACK_PAGES } from '@core/locale/fallback.js'
import type { EarthBackground } from '../earth-background.js'
import {
  SP_CAMERA_PARAMS,
  SP_DEBUG_PARAMS,
  SP_GRADE_PARAMS,
  SP_POST_PARAMS,
  SP_SCENE_PARAMS,
} from '@core/tokens/playground/params.js'
import { PREF_STORAGE_KEYS } from '@core/tokens/data/storage.js'

// ─── English defaults (overwritten by CMS translations when loaded) ──────────
/**
 * Build-time English copy for the earth-playground panel — CMS
 * translations merge over this node at runtime so the UI never renders
 * empty labels before locale data resolves.
 */
export const SP_DEFAULTS = FALLBACK_PAGES[TRANSLATION_KEYS.EARTH_PLAYGROUND] as Record<
  string,
  unknown
>

// ─── Collapsible groups with controls ────────────────────────────────────────
/** Input-type aliases — keep the schema rows terse. */
const _R = FORM_ATTRS.RANGE
/** Checkbox input-type alias for the schema rows. */
const _C = FORM_ATTRS.CHECKBOX

/** One row in a panel group — a slider or a WebGL checkbox. */
export interface SpControl {
  /** Translation key for the row's label (and the CMS defaults-map key). */
  label: string
  /** SP_PARAMS token — persisted-settings key + data-param attribute. */
  param: string
  /** 'range' slider | 'checkbox' WebGL twin. */
  type: string
  /** Slider minimum (range only). */
  min?: number
  /** Slider maximum (range only). */
  max?: number
  /** Slider step granularity (range only). */
  step?: number
  /** Shipped numeric default — CMS defaults and saved values override it. */
  def?: number
  /** Shipped checkbox state — same precedence as `def`. */
  checked?: boolean
}

/** A group-level action button (reset view, screenshot, copy settings). */
export interface SpAction {
  /** Translation key for the button label. */
  label: string
  /** SP_ACTIONS token dispatched on click. */
  action: string
  /** Initial aria-pressed state for toggle-style actions. */
  pressed?: boolean
}

/** One collapsible panel section. */
export interface SpGroup {
  /** Translation key for the group header. */
  label: string
  /** Whether the group starts folded. */
  collapsed: boolean
  /** The group's input rows. */
  controls: SpControl[]
  /** Optional buttons rendered under the controls. */
  actions?: SpAction[]
}

/** A persistable control value — sliders are numeric, checkboxes boolean. */
export type SpParamValue = number | boolean

/** Persisted settings blob shape: param → value. */
export type SpSavedSettings = Record<string, SpParamValue>

/** Input-type discriminator shared with the panel renderer/binder. */
export const SP_INPUT_TYPES = Object.freeze({ RANGE: _R, CHECKBOX: _C })

/**
 * Declarative control schema — the panel renders straight from this so a
 * new engine knob needs no JSX change. Per control:
 *   label   translation key looked up in the earth-playground node (and
 *           the key used by the CMS `defaults` map)
 *   param   SP_PARAMS token — the persisted-settings key + data-param attr
 *   type    _R range slider | _C WebGL checkbox
 *   min/max/step/def   range geometry; `def` is the shipped default until
 *                      the CMS `defaults` map or a saved user value wins
 *   checked checkbox shipped state — same precedence as `def`
 *   actions group-level buttons (reset view, screenshot, copy settings)
 * `collapsed` controls whether the group starts folded in the panel.
 */
export const SLIDER_GROUPS: readonly SpGroup[] = Object.freeze([
  {
    label: 'engine',
    collapsed: true,
    controls: [
      {
        label: 'waterMetalness',
        param: SP_SCENE_PARAMS.WATER_METALNESS,
        type: _R,
        min: 0,
        max: 1,
        step: 0.01,
        def: 0,
      },
    ],
  },
  {
    label: 'terrain',
    collapsed: true,
    controls: [
      {
        label: 'bumpScale',
        param: SP_SCENE_PARAMS.BUMP_SCALE,
        type: _R,
        min: 0,
        max: 20,
        step: 0.5,
        def: 5,
      },
      {
        label: 'selfShadow',
        param: SP_SCENE_PARAMS.SELF_SHADOW,
        type: _R,
        min: 0,
        max: 5,
        step: 0.1,
        def: 1,
      },
      {
        label: 'selfShadowOff',
        param: SP_SCENE_PARAMS.SELF_SHADOW_OFFSET,
        type: _R,
        min: 0,
        max: 0.01,
        step: 0.0005,
        def: 0.002,
      },
    ],
  },
  {
    label: 'postFx',
    collapsed: true,
    controls: [
      { label: 'bloom', param: SP_POST_PARAMS.BLOOM, type: _C, checked: false },
      {
        label: 'bloomStr',
        param: SP_POST_PARAMS.BLOOM_STRENGTH,
        type: _R,
        min: 0,
        max: 3,
        step: 0.05,
        def: 0.1,
      },
      {
        label: 'bloomRadius',
        param: SP_POST_PARAMS.BLOOM_RADIUS,
        type: _R,
        min: 0,
        max: 2,
        step: 0.05,
        def: 0.3,
      },
      {
        label: 'bloomThreshold',
        param: SP_POST_PARAMS.BLOOM_THRESHOLD,
        type: _R,
        min: 0,
        max: 1.5,
        step: 0.01,
        def: 0.9,
      },
      { label: 'vignette', param: SP_POST_PARAMS.VIGNETTE, type: _C, checked: false },
      {
        label: 'vigDarkness',
        param: SP_POST_PARAMS.VIGNETTE_DARKNESS,
        type: _R,
        min: 0,
        max: 2,
        step: 0.05,
        def: 1,
      },
      {
        label: 'vigOffset',
        param: SP_POST_PARAMS.VIGNETTE_OFFSET,
        type: _R,
        min: 0,
        max: 1,
        step: 0.01,
        def: 0.5,
      },
      { label: 'chromaticAb', param: SP_POST_PARAMS.CHROMATIC, type: _C, checked: false },
      {
        label: 'caStrength',
        param: SP_POST_PARAMS.CA_STRENGTH,
        type: _R,
        min: 0,
        max: 2,
        step: 0.01,
        def: 0.25,
      },
      {
        label: 'filmGrain',
        param: SP_POST_PARAMS.FILM_GRAIN,
        type: _R,
        min: 0,
        max: 1,
        step: 0.01,
        def: 0,
      },
    ],
  },
  {
    label: 'camera',
    collapsed: false,
    controls: [
      { label: 'fov', param: SP_CAMERA_PARAMS.FOV, type: _R, min: 15, max: 90, step: 1, def: 45 },
      { label: 'autoRotate', param: SP_CAMERA_PARAMS.AUTO_ROTATE, type: _C, checked: false },
      {
        label: 'rotateSpeed',
        param: SP_CAMERA_PARAMS.ROTATE_SPEED,
        type: _R,
        min: -5,
        max: 5,
        step: 0.01,
        def: 0.05,
      },
    ],
    actions: [{ label: 'resetView', action: SP_ACTIONS.RESET }],
  },
  {
    label: 'earth',
    collapsed: true,
    controls: [
      {
        label: 'spinSpeed',
        param: SP_SCENE_PARAMS.EARTH_SPEED,
        type: _R,
        min: 0,
        max: 50,
        step: 1,
        def: 1,
      },
      { label: 'sunAutoRotate', param: SP_SCENE_PARAMS.SUN_AUTO_ROTATE, type: _C, checked: true },
    ],
  },
  {
    label: 'color',
    collapsed: true,
    controls: [
      {
        label: 'contrast',
        param: SP_GRADE_PARAMS.CONTRAST,
        type: _R,
        min: 0.5,
        max: 2,
        step: 0.01,
        def: 1,
      },
      {
        label: 'saturation',
        param: SP_GRADE_PARAMS.SATURATION,
        type: _R,
        min: 0,
        max: 2,
        step: 0.01,
        def: 1.5,
      },
      {
        label: 'blackLevel',
        param: SP_GRADE_PARAMS.BLACK_LEVEL,
        type: _R,
        min: 0,
        max: 0.2,
        step: 0.005,
        def: 0.015,
      },
    ],
  },
  {
    label: 'displayDebug',
    collapsed: true,
    controls: [
      {
        label: 'resScale',
        param: SP_DEBUG_PARAMS.RES_SCALE,
        type: _R,
        min: 0.5,
        max: 2,
        step: 0.1,
        def: 1,
      },
    ],
    actions: [
      { label: 'copyConstants', action: SP_ACTIONS.COPY_CONSTANTS },
      { label: 'screenshot', action: SP_ACTIONS.SCREENSHOT },
    ],
  },
])

/**
 * Pristine def/checked snapshot — _applyDbDefaults restores this baseline
 * before merging so CMS defaults never bleed across locale switches. The
 * shape mirrors SLIDER_GROUPS (group → controls) so restoration indexes
 * positionally without re-deriving keys.
 */
export const SP_DEF_BASELINE = SLIDER_GROUPS.map((g) =>
  g.controls.map((c) => ({ def: c.def, checked: c.checked }))
)

/**
 * Label-keyed seed for the CMS-managed `earth-playground/defaults` node —
 * `{ waterMetalness: 0, bumpScale: 5, … }`. The CMS prefills its defaults
 * card from this map when the DB node is absent so the editor always
 * shows the real shipped values instead of claiming none exist.
 */
export const SP_DB_DEFAULT_SEED: Record<string, number | boolean> = Object.fromEntries(
  SLIDER_GROUPS.flatMap((g) =>
    g.controls.map((c) => [c.label, c.type === _C ? Boolean(c.checked) : Number(c.def)])
  )
)

// ─── Param → earthBg method mapper ───────────────────────────────────────────
/**
 * Param → EarthBackground setter dispatch. Each entry adapts a raw UI
 * value (slider units / checkbox boolean) into the matching engine update
 * call — the UI never touches engine internals directly. EARTH_SPEED
 * divides by 10000 because the slider range 0–50 is human-friendly while
 * the engine expects radians-per-frame (1 ⇒ 0.0001 rad/frame ≈ slow
 * cinematic spin).
 */
export const PARAM_HANDLERS: Readonly<
  Record<string, (_bg: EarthBackground, v: SpParamValue) => void>
> = Object.freeze({
  [SP_CAMERA_PARAMS.FOV]: (bg: EarthBackground, v: SpParamValue) =>
    bg.updateCamera({ fov: Number(v) }),
  [SP_CAMERA_PARAMS.ROTATE_SPEED]: (bg: EarthBackground, v: SpParamValue) =>
    bg.updateCamera({ autoRotateSpeed: Number(v) }),
  [SP_CAMERA_PARAMS.AUTO_ROTATE]: (bg: EarthBackground, v: SpParamValue) =>
    bg.updateCamera({ autoRotate: Boolean(v) }),
  [SP_SCENE_PARAMS.EARTH_SPEED]: (bg: EarthBackground, v: SpParamValue) =>
    bg.updateEarth({ rotationSpeed: Number(v) / 10000 }),
  [SP_POST_PARAMS.BLOOM]: (bg: EarthBackground, v: SpParamValue) =>
    bg.updateBloom({ enabled: Boolean(v) }),
  [SP_POST_PARAMS.BLOOM_STRENGTH]: (bg: EarthBackground, v: SpParamValue) =>
    bg.updateBloom({ strength: Number(v) }),
  [SP_POST_PARAMS.BLOOM_RADIUS]: (bg: EarthBackground, v: SpParamValue) =>
    bg.updateBloom({ radius: Number(v) }),
  [SP_POST_PARAMS.BLOOM_THRESHOLD]: (bg: EarthBackground, v: SpParamValue) =>
    bg.updateBloom({ threshold: Number(v) }),
  [SP_POST_PARAMS.VIGNETTE]: (bg: EarthBackground, v: SpParamValue) =>
    bg.updateVignette({ enabled: Boolean(v) }),
  [SP_POST_PARAMS.VIGNETTE_DARKNESS]: (bg: EarthBackground, v: SpParamValue) =>
    bg.updateVignette({ darkness: Number(v) }),
  [SP_POST_PARAMS.VIGNETTE_OFFSET]: (bg: EarthBackground, v: SpParamValue) =>
    bg.updateVignette({ offset: Number(v) }),
  [SP_POST_PARAMS.CHROMATIC]: (bg: EarthBackground, v: SpParamValue) =>
    bg.updateChromatic({ enabled: Boolean(v) }),
  [SP_POST_PARAMS.CA_STRENGTH]: (bg: EarthBackground, v: SpParamValue) =>
    bg.updateChromatic({ strength: Number(v) }),
  [SP_GRADE_PARAMS.CONTRAST]: (bg: EarthBackground, v: SpParamValue) =>
    bg.updateColorGrading({ contrast: Number(v) }),
  [SP_GRADE_PARAMS.SATURATION]: (bg: EarthBackground, v: SpParamValue) =>
    bg.updateColorGrading({ saturation: Number(v) }),
  [SP_GRADE_PARAMS.BLACK_LEVEL]: (bg: EarthBackground, v: SpParamValue) =>
    bg.updateColorGrading({ blackLevel: Number(v) }),
  [SP_POST_PARAMS.FILM_GRAIN]: (bg: EarthBackground, v: SpParamValue) =>
    bg.updateFilm({ enabled: Number(v) > 0, intensity: Number(v) }),
  [SP_DEBUG_PARAMS.RES_SCALE]: (bg: EarthBackground, v: SpParamValue) =>
    bg.updateRender({ resolutionScale: Number(v) }),
  [SP_SCENE_PARAMS.SUN_AUTO_ROTATE]: (bg: EarthBackground, v: SpParamValue) =>
    bg.updateSun({ autoRotate: Boolean(v) }),
  [SP_SCENE_PARAMS.WATER_METALNESS]: (bg: EarthBackground, v: SpParamValue) =>
    bg.updateEarthMaterial({ waterMetalness: Number(v) }),
  [SP_SCENE_PARAMS.BUMP_SCALE]: (bg: EarthBackground, v: SpParamValue) =>
    bg.updateEarthMaterial({ bumpScale: Number(v) }),
  [SP_SCENE_PARAMS.SELF_SHADOW]: (bg: EarthBackground, v: SpParamValue) =>
    bg.updateEarthMaterial({ terrainShadowIntensity: Number(v) }),
  [SP_SCENE_PARAMS.SELF_SHADOW_OFFSET]: (bg: EarthBackground, v: SpParamValue) =>
    bg.updateEarthMaterial({ terrainShadowOffset: Number(v) }),
})

// ─── localStorage helpers ────────────────────────────────────────────────────
// Version tag baked into the stored blob: bump it whenever SLIDER_GROUPS'
// params or semantics change so stale saves (old ranges/removed controls)
// are discarded instead of applying out-of-range values to the engine.
/**
 * Schema version baked into the stored blob — bump whenever SLIDER_GROUPS'
 * params or semantics change so stale saves (old ranges, removed controls)
 * are discarded instead of applying out-of-range values to the engine.
 */
const SP_VERSION = '3.3'

/**
 * Reads the persisted panel settings, discarding blobs from another
 * SP_VERSION or corrupted JSON — both collapse to "no saved state" so a
 * stale/corrupt blob can never apply out-of-range engine values.
 * @returns The saved param map, or null.
 */
export const loadSpaceSettings = (): SpSavedSettings | null => {
  try {
    const raw = localStorage.getItem(PREF_STORAGE_KEYS.SPACE_PLAYGROUND)

    if (!raw) return null

    const parsed = JSON.parse(raw)

    return parsed?._v === SP_VERSION ? (parsed.settings as SpSavedSettings) : null
  } catch {
    return null
  }
}

/**
 * Persists the panel settings as a {_v, settings} blob — the version tag
 * lets loadSpaceSettings reject blobs written by a different schema.
 * Quota/security failures are swallowed: the panel works fine session-only.
 * @param settings The full param → value map.
 */
export const saveSpaceSettings = (settings: SpSavedSettings): void => {
  try {
    localStorage.setItem(
      PREF_STORAGE_KEYS.SPACE_PLAYGROUND,
      JSON.stringify({ _v: SP_VERSION, settings })
    )
  } catch {
    /* quota exceeded — silently ignore */
  }
}
