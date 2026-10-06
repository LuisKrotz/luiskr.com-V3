/**
 * @file earth/post-nodes.ts
 * @description Custom TSL post nodes for the RenderPipeline output chain,
 * extracted from earth-background.ts. Pure node-graph builders — no class
 * state, no WebGL probing.
 */
import type { Node } from 'three/webgpu'
import type { ColorGradeNodeArgs, VignetteNodeArgs } from '../consts.js'

type TslNs = typeof import('three/tsl')

/**
 * Custom post nodes for the RenderPipeline output chain.
 *
 * colorGrade math, per channel:
 *   1. contrast — c = (rgb − 0.5)·contrast + 0.5  → pivots around mid-grey
 *      so midtones stay put while shadows/highlights separate.
 *   2. saturation — mix(luma, c, sat) → luma uses Rec.601 weights
 *      (0.299/0.587/0.114): sat=1 is neutral, >1 pushes away from grey.
 *   3. blackLevel — max(c − bl, 0) → lifts the floor toward true black.
 *   4. blueGreenBoost — per-channel gain {1, 1+b·0.5, 1+b}: Earth imagery
 *      reads richer with boosted oceans (G half-strength, B full).
 *
 * vignette math:
 *   d = |uv − 0.5|·2  → 0 at center, ~1.41 at corners.
 *   v = 1 − |d|·offset, clamped  → linear falloff scaled by offset.
 *   factor = mix(1, v^darkness, min(darkness,1)) → darkness doubles as
 *   both the curve exponent (shape) and the lerp weight (amount), so a
 *   single slider feels like a photographic vignette control.
 *
 * @param {object} TSL - three/tsl namespace
 * @returns {{colorGradeNode: Function, vignetteNode: Function}}
 */
export function makePostNodes(TSL: TslNs) {
  const { Fn, vec3, vec4, float, max, mix, min } = TSL

  const colorGradeNode = Fn<ColorGradeNodeArgs, Node<'vec4'>>(
    ({ color, contrast, saturation, blackLevel, blueGreenBoost }: ColorGradeNodeArgs) => {
      const rgb = color.rgb

      const c = rgb.sub(0.5).mul(contrast).add(0.5)

      const luma = c.dot(vec3(0.299, 0.587, 0.114))

      const sat = mix(vec3(luma), c, saturation)

      const blk = max(sat.sub(vec3(blackLevel)), vec3(0.0))

      const finalRgb = blk.mul(
        vec3(float(1.0), blueGreenBoost.mul(0.5).add(1.0), blueGreenBoost.add(1.0))
      )

      return vec4(finalRgb, color.a)
    }
  )

  const vignetteNode = Fn<VignetteNodeArgs, Node<'vec4'>>(
    ({ color, uv, darkness, offset }: VignetteNodeArgs) => {
      const d = uv.sub(0.5).abs().mul(2.0)

      const v = float(1.0).sub(d.length().mul(offset)).clamp(0.0, 1.0)

      const factor = mix(float(1.0), v.pow(max(darkness, float(0.001))), min(darkness, float(1.0)))

      return vec4(color.rgb.mul(factor), color.a)
    }
  )

  return { colorGradeNode, vignetteNode }
}
