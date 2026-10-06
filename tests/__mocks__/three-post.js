/**
 * @file three-post.js (mock)
 * @description Auto-mock for the three.js TSL post-processing node modules
 * (BloomNode, ChromaticAberrationNode, FilmNode) and OrbitControls — every
 * node factory is a chainable proxy.
 */
import { __chain as chain } from './three.js'

export const bloom = chain()
export const chromaticAberration = chain()
export const film = chain()

export class OrbitControls {
  constructor() {
    this.target = { x: 0, y: 0, z: 0, set: () => {}, copy: () => {} }
    this.mouseButtons = {}
  }

  update() {}
  saveState() {}
  dispose() {}
  reset() {}
  getAzimuthalAngle() {
    return 0
  }
  getPolarAngle() {
    return 1
  }
  getDistance() {
    return 30
  }
}
