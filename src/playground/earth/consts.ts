/**
 * @file earth/consts.ts
 * @description Scene-graph scale constants + shared TSL arg types for the
 * WebGPU Earth background engine, extracted from earth-background.ts.
 */
import type { Node } from 'three/webgpu'

/**
 * Scene-graph scale constants. The Earth sphere is 10 world units across the
 * radius — an arbitrary "comfortable" scale that keeps camera distances and
 * light falloff in the 10–200 range where float precision is excellent.
 */
export const EARTH_RADIUS = 10

/** Earth's real axial tilt — 23.44° converted to radians for the group rotation. */
export const EARTH_AXIAL_TILT = (23.44 * Math.PI) / 180

/**
 * Outer atmosphere shell radius. 2% larger than the surface (10.2/10) — real
 * Earth's effective scattering shell is ~1% of radius (100km/6371km), but a
 * slightly exaggerated shell reads better visually at this scale.
 */
export const ATMOS_RADIUS = 10.2

/**
 * Sphere tessellation: 128×128 segments ≈ 32k triangles per shell. Chosen so
 * the silhouette stays smooth when the camera zooms to 1.2× radius — below
 * ~64 segments the limb shows polygon edges.
 */
export const SEG_HIGH = 128

/** Arg shapes for the Fn-defined post nodes — per-node-type annotations
 *  unlock the typed swizzle/fluent-op surface (vec4 gets .rgb/.a, float
 *  gets .mul/.add etc.). */
export interface ColorGradeNodeArgs {
  [key: string]: unknown
  color: Node<'vec4'>
  contrast: Node<'float'>
  saturation: Node<'float'>
  blackLevel: Node<'float'>
  blueGreenBoost: Node<'float'>
}

/**
 * Args for the vignette post node — `{ color, uv, darkness, offset }`,
 * typed so the Fn body gets the fluent vec/float node surface.
 */
export interface VignetteNodeArgs {
  [key: string]: unknown
  color: Node<'vec4'>
  uv: Node<'vec2'>
  darkness: Node<'float'>
  offset: Node<'float'>
}
