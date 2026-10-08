/**
 * @file earth/post-setup.ts
 * @description Post-processing chain for the Earth engine: color-grading,
 * chromatic-aberration, vignette and film-grain uniforms seeded from the
 * GUI defaults, then the RenderPipeline assembly —
 * scene → CA fringe → +bloom → color grade → vignette → film grain.
 * Pipeline failure is non-fatal: the frame loop falls back to plain
 * renderer.render(scene, camera), losing post FX but not the scene.
 */
import type { Node } from 'three/webgpu'
import { DEFAULT_SP_GUI } from '@core/tokens/playground.js'
import { makePostNodes } from '../scene/post-nodes.js'
import type { EarthState } from '../runtime/state.js'
import { devWarn } from '@core/devlog.js'

type TslNs = typeof import('three/tsl')
type WebGpuModule = typeof import('three/webgpu')
type BloomFn = typeof import('three/examples/jsm/tsl/display/BloomNode.js').bloom
type CaFn =
  typeof import('three/examples/jsm/tsl/display/ChromaticAberrationNode.js').chromaticAberration
type FilmFn = typeof import('three/examples/jsm/tsl/display/FilmNode.js').film

/**
 * earths post deps.
 */
export interface EarthPostDeps {
  TSL: TslNs
  RenderPipeline: WebGpuModule['RenderPipeline']
  bloom: BloomFn
  chromaticAberration: CaFn
  film: FilmFn
}

/** Seeds the color-grade + post FX state objects and their TSL uniforms. */
export function seedPostState(s: EarthState, TSL: TslNs): void {
  s.cg = {
    contrast: DEFAULT_SP_GUI.COLOR_GRADING.CONTRAST,
    saturation: DEFAULT_SP_GUI.COLOR_GRADING.SATURATION,
    blackLevel: DEFAULT_SP_GUI.COLOR_GRADING.BLACK_LEVEL,
    blueGreenBoost: DEFAULT_SP_GUI.COLOR_GRADING.BLUE_GREEN_BOOST,
  }

  const cgCU = TSL.uniform(s.cg.contrast)
  const cgSU = TSL.uniform(s.cg.saturation)
  const cgBLU = TSL.uniform(s.cg.blackLevel)
  const cgBGU = TSL.uniform(s.cg.blueGreenBoost)

  s.cgUniforms = { contrast: cgCU, saturation: cgSU, blackLevel: cgBLU, blueGreenBoost: cgBGU }

  s.ca = {
    enabled: DEFAULT_SP_GUI.CHROMATIC_ABERRATION.ENABLED,
    strength: DEFAULT_SP_GUI.CHROMATIC_ABERRATION.STRENGTH,
    scale: DEFAULT_SP_GUI.CHROMATIC_ABERRATION.SCALE,
  }
  s.vig = {
    enabled: DEFAULT_SP_GUI.VIGNETTE.ENABLED,
    darkness: DEFAULT_SP_GUI.VIGNETTE.DARKNESS,
    offset: DEFAULT_SP_GUI.VIGNETTE.OFFSET,
  }
  s.film = {
    enabled: DEFAULT_SP_GUI.FILM_GRAIN.ENABLED,
    intensity: DEFAULT_SP_GUI.FILM_GRAIN.INTENSITY,
  }

  const caStrU = TSL.uniform(s.ca.strength * Number(s.ca.enabled))
  const caScU = TSL.uniform(s.ca.scale)
  const vigDU = TSL.uniform(s.vig.darkness * Number(s.vig.enabled))
  const vigOU = TSL.uniform(s.vig.offset)
  const filmU = TSL.uniform(s.film.intensity * Number(s.film.enabled))

  s.caUniforms = { strength: caStrU, scale: caScU }
  s.vigUniforms = { darkness: vigDU, offset: vigOU }
  s.filmU = filmU
}

/**
 * Assembles the RenderPipeline post chain (screen-space, in order):
 *   scene → CA fringe → +bloom → color grade → vignette → film grain
 * CA is applied before bloom so the halo isn't itself fringed.
 */
export function buildEarthPostPipeline(s: EarthState, deps: EarthPostDeps): void {
  const { TSL, RenderPipeline, bloom, chromaticAberration, film } = deps

  if (!s.renderer || !s.scene || !s.camera || !s.ca || !s.vig || !s.film || !s.cg) return

  const { cgUniforms, caUniforms, vigUniforms, filmU } = s

  if (!cgUniforms || !caUniforms || !vigUniforms || !filmU) return

  try {
    s.pipeline = new RenderPipeline(s.renderer)

    const scenePass = TSL.pass(s.scene, s.camera)

    const sceneColor = scenePass.getTextureNode('output')

    s.bloom = {
      enabled: DEFAULT_SP_GUI.BLOOM.ENABLED,
      strength: DEFAULT_SP_GUI.BLOOM.STRENGTH,
      radius: DEFAULT_SP_GUI.BLOOM.RADIUS,
      threshold: DEFAULT_SP_GUI.BLOOM.THRESHOLD,
    }
    s.bloomPass = bloom(
      sceneColor,
      s.bloom.strength * Number(s.bloom.enabled),
      s.bloom.radius,
      s.bloom.threshold
    )

    const caNode = chromaticAberration(
      sceneColor,
      caUniforms.strength,
      TSL.vec2(0.5, 0.5),
      caUniforms.scale
    )
    const baseWithBloom = (caNode as unknown as { add(_b: Node<'vec4'>): Node<'vec4'> }).add(
      s.bloomPass as unknown as Node<'vec4'>
    )

    const { colorGradeNode, vignetteNode } = makePostNodes(TSL)

    const graded = colorGradeNode({
      color: baseWithBloom,
      contrast: cgUniforms.contrast,
      saturation: cgUniforms.saturation,
      blackLevel: cgUniforms.blackLevel,
      blueGreenBoost: cgUniforms.blueGreenBoost,
    })

    const withVig = vignetteNode({
      color: graded,
      uv: TSL.screenCoordinate.div(TSL.screenSize),
      darkness: vigUniforms.darkness,
      offset: vigUniforms.offset,
    })

    s.pipeline.outputNode = film(withVig, filmU)
  } catch (e) {
    devWarn('[EarthBG] RenderPipeline setup skipped:', e)

    s.pipeline = null
  }
}
