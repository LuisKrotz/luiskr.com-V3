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
  /** Test hook — most recent instance (camera-state assertions). */
  static lastInstance = null

  constructor() {
    this.target = { x: 0, y: 0, z: 0, set: () => {}, copy: () => {} }
    this.mouseButtons = {}
    this._listeners = {}

    OrbitControls.lastInstance = this
  }

  addEventListener(name, fn) {
    ;(this._listeners[name] ||= []).push(fn)
  }

  removeEventListener(name, fn) {
    this._listeners[name] = (this._listeners[name] || []).filter((f) => f !== fn)
  }

  /** Test hook — fires a registered control event ('start'|'end'|…). */
  dispatch(name) {
    ;(this._listeners[name] || []).forEach((f) => f())
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
