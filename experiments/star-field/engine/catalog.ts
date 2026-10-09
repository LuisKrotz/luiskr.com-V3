/**
 * @file engine/catalog.ts
 * @description The star-field body catalog — one static SFBodyDef per
 * navigable object. Values are scene-chart units, NOT real distances:
 * the Solar System sits compressed at the origin, nearby Milky Way
 * systems spread across the mid-field galactic plane, nebulae further
 * out, and external galaxies on the far ring so a single orbit-camera
 * sweep reads as a voyage from home to deep space.
 *
 * `orbit`/`parent` bodies revolve procedurally; `pos` bodies are fixed
 * markers on the chart. `satellites` are decorative non-pickable
 * companions (exoplanets, binary partners). Dossier text lives in
 * `public/data/<id>.json` and lazy-loads on approach/selection.
 */

import { SF_COLORS } from '@core/tokens/starfield/params.js'
import { SF_TEXTURES } from '@core/tokens/starfield/textures.js'
import { SF_GROUPS, SF_KINDS } from '@core/tokens/starfield/kinds.js'
import type { SFBodyDef } from './types.js'

/**
 * Solar-system bodies — compressed orbits so all eight planets fit inside
 * a single readable sweep around the Sun.
 */
const SOLAR: SFBodyDef[] = [
  {
    id: 'sun',
    name: 'Sun',
    kind: SF_KINDS.STAR,
    group: SF_GROUPS.SOLAR,
    radius: 12,
    pos: [0, 0, 0],
    texture: SF_TEXTURES.SUN,
    color: SF_COLORS.EMISSIVE_SUN,
    spin: 0.05,
  },
  {
    id: 'mercury',
    name: 'Mercury',
    kind: SF_KINDS.PLANET,
    group: SF_GROUPS.SOLAR,
    radius: 0.8,
    orbit: 24,
    speed: 1.6,
    spin: 0.02,
    texture: SF_TEXTURES.MERCURY,
    ring: true,
    phase: 0.4,
  },
  {
    id: 'venus',
    name: 'Venus',
    kind: SF_KINDS.PLANET,
    group: SF_GROUPS.SOLAR,
    radius: 1.6,
    orbit: 31,
    speed: 1.2,
    spin: -0.01,
    texture: SF_TEXTURES.VENUS_SURFACE,
    shellTexture: SF_TEXTURES.VENUS_ATMOS,
    ring: true,
    phase: 1.8,
  },
  {
    id: 'earth',
    name: 'Earth',
    kind: SF_KINDS.PLANET,
    group: SF_GROUPS.SOLAR,
    radius: 1.7,
    orbit: 39,
    speed: 1.0,
    spin: 1.0,
    tilt: 0.41,
    texture: SF_TEXTURES.EARTH_DAY,
    ring: true,
    phase: 3.1,
  },
  {
    id: 'moon',
    name: 'Moon',
    kind: SF_KINDS.MOON,
    group: SF_GROUPS.SOLAR,
    radius: 0.45,
    orbit: 4.5,
    parent: 'earth',
    speed: 3.4,
    texture: SF_TEXTURES.MOON,
    phase: 1.2,
  },
  {
    id: 'mars',
    name: 'Mars',
    kind: SF_KINDS.PLANET,
    group: SF_GROUPS.SOLAR,
    radius: 1.1,
    orbit: 47,
    speed: 0.8,
    spin: 0.97,
    texture: SF_TEXTURES.MARS,
    ring: true,
    phase: 4.4,
  },
  {
    id: 'ceres',
    name: 'Ceres',
    kind: SF_KINDS.DWARF,
    group: SF_GROUPS.SOLAR,
    radius: 0.35,
    orbit: 55,
    speed: 0.65,
    color: SF_COLORS.CERES,
    ring: true,
    phase: 0.9,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    kind: SF_KINDS.PLANET,
    group: SF_GROUPS.SOLAR,
    radius: 4.4,
    orbit: 66,
    speed: 0.45,
    spin: 2.4,
    texture: SF_TEXTURES.JUPITER,
    ring: true,
    phase: 5.3,
  },
  {
    id: 'saturn',
    name: 'Saturn',
    kind: SF_KINDS.PLANET,
    group: SF_GROUPS.SOLAR,
    radius: 3.8,
    orbit: 82,
    speed: 0.35,
    spin: 2.2,
    tilt: 0.47,
    texture: SF_TEXTURES.SATURN,
    shellTexture: SF_TEXTURES.SATURN_RING,
    shellRing: true,
    ring: true,
    phase: 2.2,
  },
  {
    id: 'uranus',
    name: 'Uranus',
    kind: SF_KINDS.PLANET,
    group: SF_GROUPS.SOLAR,
    radius: 2.6,
    orbit: 95,
    speed: 0.28,
    spin: -1.4,
    tilt: 1.71,
    texture: SF_TEXTURES.URANUS,
    ring: true,
    phase: 4.9,
  },
  {
    id: 'neptune',
    name: 'Neptune',
    kind: SF_KINDS.PLANET,
    group: SF_GROUPS.SOLAR,
    radius: 2.5,
    orbit: 106,
    speed: 0.22,
    spin: 1.5,
    texture: SF_TEXTURES.NEPTUNE,
    ring: true,
    phase: 5.8,
  },
  {
    id: 'pluto',
    name: 'Pluto',
    kind: SF_KINDS.DWARF,
    group: SF_GROUPS.SOLAR,
    radius: 0.5,
    orbit: 116,
    speed: 0.15,
    color: SF_COLORS.PLUTO,
    ring: true,
    phase: 1.5,
  },
]

/**
 * Milky Way neighborhood — famous nearby systems placed on the mid-field
 * galactic plane; `satellites` dress each system with orbiting companions.
 */
const MILKY_WAY: SFBodyDef[] = [
  {
    id: 'proxima-centauri',
    name: 'Proxima Centauri',
    kind: SF_KINDS.SYSTEM,
    group: SF_GROUPS.MILKY_WAY,
    radius: 3,
    pos: [290, 18, 60],
    color: SF_COLORS.PROXIMA_STAR,
    satellites: [{ radius: 0.7, orbit: 7, speed: 1.4, color: SF_COLORS.PROXIMA_PLANET }],
  },
  {
    id: 'alpha-centauri',
    name: 'Alpha Centauri',
    kind: SF_KINDS.SYSTEM,
    group: SF_GROUPS.MILKY_WAY,
    radius: 3.4,
    pos: [330, -8, -110],
    color: SF_COLORS.ALPHA_STAR,
    satellites: [{ radius: 2.4, orbit: 9, speed: 0.5, color: SF_COLORS.ALPHA_COMPANION }],
  },
  {
    id: 'sirius',
    name: 'Sirius',
    kind: SF_KINDS.STAR,
    group: SF_GROUPS.MILKY_WAY,
    radius: 4,
    pos: [380, 40, 90],
    color: SF_COLORS.SIRIUS,
    spin: 0.3,
  },
  {
    id: 'vega',
    name: 'Vega',
    kind: SF_KINDS.STAR,
    group: SF_GROUPS.MILKY_WAY,
    radius: 3.8,
    pos: [420, 70, -60],
    color: SF_COLORS.VEGA,
    spin: 0.4,
  },
  {
    id: 'betelgeuse',
    name: 'Betelgeuse',
    kind: SF_KINDS.STAR,
    group: SF_GROUPS.MILKY_WAY,
    radius: 6.5,
    pos: [460, -30, -160],
    color: SF_COLORS.BETELGEUSE,
    spin: 0.1,
  },
  {
    id: 'trappist-1',
    name: 'TRAPPIST-1',
    kind: SF_KINDS.SYSTEM,
    group: SF_GROUPS.MILKY_WAY,
    radius: 1.6,
    pos: [350, -55, 170],
    color: SF_COLORS.TRAPPIST_STAR,
    satellites: [
      { radius: 0.45, orbit: 4, speed: 1.8, color: SF_COLORS.TRAPPIST_PLANET },
      { radius: 0.5, orbit: 6, speed: 1.3, color: SF_COLORS.TRAPPIST_PLANET, phase: 2.1 },
      { radius: 0.55, orbit: 8, speed: 0.9, color: SF_COLORS.TRAPPIST_PLANET, phase: 4.2 },
    ],
  },
  {
    id: 'sagittarius-a',
    name: 'Sagittarius A*',
    kind: SF_KINDS.BLACK_HOLE,
    group: SF_GROUPS.MILKY_WAY,
    radius: 4,
    pos: [0, 10, -480],
    color: SF_COLORS.SAGITTARIUS_A,
  },
]

/** Nebulae — billboard sprites with procedural glow, mid-far field. */
const NEBULAE: SFBodyDef[] = [
  {
    id: 'orion-nebula',
    name: 'Orion Nebula',
    kind: SF_KINDS.NEBULA,
    group: SF_GROUPS.NEBULAE,
    radius: 34,
    pos: [480, 40, -280],
    color: SF_COLORS.ORION_NEBULA,
  },
  {
    id: 'eagle-nebula',
    name: 'Eagle Nebula',
    kind: SF_KINDS.NEBULA,
    group: SF_GROUPS.NEBULAE,
    radius: 40,
    pos: [-520, 80, -300],
    color: SF_COLORS.EAGLE_NEBULA,
  },
  {
    id: 'crab-nebula',
    name: 'Crab Nebula',
    kind: SF_KINDS.NEBULA,
    group: SF_GROUPS.NEBULAE,
    radius: 30,
    pos: [-450, -60, 380],
    color: SF_COLORS.CRAB_NEBULA,
  },
  {
    id: 'helix-nebula',
    name: 'Helix Nebula',
    kind: SF_KINDS.NEBULA,
    group: SF_GROUPS.NEBULAE,
    radius: 26,
    pos: [560, -20, 320],
    color: SF_COLORS.HELIX_NEBULA,
  },
]

/** External galaxies — far-field sprite discs on the outer ring. */
const GALAXIES: SFBodyDef[] = [
  {
    id: 'milky-way',
    name: 'Milky Way',
    kind: SF_KINDS.GALAXY,
    group: SF_GROUPS.GALAXIES,
    radius: 90,
    pos: [-260, -90, -180],
    color: SF_COLORS.MILKY_WAY,
    tilt: 0.9,
  },
  {
    id: 'andromeda',
    name: 'Andromeda Galaxy',
    kind: SF_KINDS.GALAXY,
    group: SF_GROUPS.GALAXIES,
    radius: 160,
    pos: [-1400, 300, -900],
    color: SF_COLORS.ANDROMEDA,
    tilt: 0.6,
  },
  {
    id: 'triangulum',
    name: 'Triangulum Galaxy',
    kind: SF_KINDS.GALAXY,
    group: SF_GROUPS.GALAXIES,
    radius: 80,
    pos: [-1250, -140, 700],
    color: SF_COLORS.TRIANGULUM,
    tilt: 0.8,
  },
]

/** Full catalog — the order the navigator drawer lists groups in. */
export const SF_CATALOG: readonly SFBodyDef[] = Object.freeze([
  ...SOLAR,
  ...MILKY_WAY,
  ...NEBULAE,
  ...GALAXIES,
])

/** Ordered group keys for the navigator drawer sections. */
export const SF_GROUP_ORDER: readonly string[] = Object.freeze([
  SF_GROUPS.SOLAR,
  SF_GROUPS.MILKY_WAY,
  SF_GROUPS.NEBULAE,
  SF_GROUPS.GALAXIES,
])

/**
 * Groups catalog entries by SF_GROUPS key — the navigator renders one
 * section per key with the body's display name on a focusable button.
 * @returns group key → defs in catalog order
 */
export function sfCatalogByGroup(): Map<string, SFBodyDef[]> {
  const map = new Map<string, SFBodyDef[]>()

  for (const def of SF_CATALOG) {
    const list = map.get(def.group) ?? []

    list.push(def)

    map.set(def.group, list)
  }

  return map
}
