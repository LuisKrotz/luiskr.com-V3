/**
 * @file three.js (mock)
 * @description Auto-mock for the `three` package used by earth-background.js.
 * Every class is a constructable/chainable proxy so scene-graph code
 * (`new THREE.Mesh().position.set(...)`) resolves without a GPU.
 * TextureLoader is real-ish so loadAsync() resolves textures.
 */

const autoInst = () =>
  new Proxy(
    {},
    {
      get(t, p) {
        if (p === Symbol.toPrimitive) return () => 0
        if (p === 'then' || p === 'catch' || p === 'finally') return undefined
        if (p in t) return t[p]

        return chain()
      },
      set(t, p, v) {
        t[p] = v

        return true
      },
    }
  )

const chain = () =>
  new Proxy(function () {}, {
    get(_t, p) {
      if (p === Symbol.toPrimitive) return () => 0
      if (p === Symbol.iterator) return function* () {}
      if (p === 'then' || p === 'catch' || p === 'finally') return undefined
      if (p === 'prototype') return autoInst()

      return chain()
    },
    set() {
      return true
    },
    apply() {
      return chain()
    },
    construct() {
      return autoInst()
    },
  })

const makeTex = () => ({ mapping: 0, colorSpace: '', anisotropy: 0 })

export class TextureLoader {
  load(_url, onLoad) {
    const tex = makeTex()

    onLoad?.(tex)

    return tex
  }

  async loadAsync() {
    return makeTex()
  }
}

export const Vector3 = chain()
export const Color = chain()
export const Scene = chain()
export const Group = chain()
export const Mesh = chain()
export const LOD = chain()
export const DirectionalLight = chain()
export const PerspectiveCamera = chain()
export const SphereGeometry = chain()
export const MeshBasicMaterial = chain()
export const MeshStandardMaterial = chain()
export const Raycaster = chain()
export const Clock = chain()
export const Vector2 = chain()
export const Vector4 = chain()
export const Quaternion = chain()
export const Euler = chain()
export const Matrix4 = chain()
export const Object3D = chain()
export const AmbientLight = chain()
export const Fog = chain()

export const ACESFilmicToneMapping = 1
export const AdditiveBlending = 1
export const NormalBlending = 1
export const BackSide = 1
export const FrontSide = 1
export const EquirectangularReflectionMapping = 1
export const SRGBColorSpace = 'srgb'
export const MOUSE = { PAN: 0, LEFT: 0, MIDDLE: 0, RIGHT: 0 }

export const __chain = chain
