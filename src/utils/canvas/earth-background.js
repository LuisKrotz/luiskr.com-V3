/**
 * @file earth-background.js
 * @description Three.js WebGPU Earth background engine.
 * Renders a photorealistic Earth as a fixed canvas behind all site content.
 * All controls are exposed via method API (no lil-gui).
 *
 * Public API:
 *   init()                  → async bootstrap
 *   setReducedMotion(bool)  → pause/resume RAF
 *   setTheme(isDark)        → rotate sun to show lit or night hemisphere
 *   takeScreenshot()        → download 4K PNG
 *   updateBloom(opts)       → live bloom tweaks
 *   updateColorGrading(opts)
 *   updateCamera(opts)
 *   updateEarth(opts)
 *   updateVignette(opts)
 *   updateChromatic(opts)
 *   get settings            → current settings snapshot
 *   destroy()
 */
import { STRINGS, EARTH_TEXTURES as TEXTURES, DEFAULT_SP_GUI } from '../../core/constants.js'

const EARTH_RADIUS   = 10
const ATMOS_RADIUS   = 10.2
const SEG_HIGH       = 128
const SEG_MED        = 64
const SEG_LOW        = 32

export class EarthBackground {
  /* ─── Private fields ─────────────────────────────────────────────────── */
  #animId     = null
  #disposed   = false
  #reduced    = false
  #onReady    = null
  #onProgress = null

  // Three.js objects
  #canvas    = null
  #renderer  = null
  #scene     = null
  #camera    = null
  #controls  = null
  #pipeline  = null
  #earth     = null
  #moon      = null
  #sunMesh   = null
  #sunLight  = null
  #loader    = null
  #cloudsMesh = null
  #three      = null
  #vecA       = null
  #vecB       = null
  #vecC       = null

  // TSL uniforms
  #sunDirU   = null
  #moonPosU  = null
  #flarePosU = null
  #flareIntU = null
  #cgUniforms = null
  #caUniforms = null
  #vigUniforms = null
  #filmU     = null
  #bloomPass = null
  #earthMatUniforms = null

  // Settings objects (mutable, read by tick)
  #sun     = null
  #moonCfg = null
  #earth_  = null
  #bloom_  = null
  #flare   = null
  #ca      = null
  #vig     = null
  #film    = null
  #cg      = null
  #render  = { resolutionScale: DEFAULT_SP_GUI.DEBUG.RESOLUTION_SCALE }
  #isDark   = true
  #starsTex = null

  constructor(canvas, { onReady, onProgress } = {}) {
    this.#canvas     = canvas
    this.#onReady    = onReady
    this.#onProgress = onProgress || null
  }

  /* ─── Public API ─────────────────────────────────────────────────────── */

  async init() {
    try {
      await this.#bootstrap()
    } catch (e) {
      console.error('[EarthBG] Bootstrap failed:', e)
      this.#onReady?.()
    }
  }

  setReducedMotion(reduced) {
    this.#reduced = reduced
    if (reduced) {
      if (this.#animId) { cancelAnimationFrame(this.#animId); this.#animId = null }
    } else if (!this.#animId && !this.#disposed) {
      this.#tick()
    }
  }

  setTheme(isDark) {
    this.#isDark = isDark
  }

  setVisible(visible) {
    if (!this.#canvas) return
    this.#canvas.style.opacity        = visible ? STRINGS.ONE : STRINGS.ZERO
    this.#canvas.style.pointerEvents  = visible ? STRINGS.EMPTY : STRINGS.NONE

    if (visible && !this.#animId && !this.#reduced && !this.#disposed) {
      this.#tick()
    } else if (!visible && this.#animId) {
      cancelAnimationFrame(this.#animId)
      this.#animId = null
    }
  }

  async takeScreenshot() {
    if (!this.#canvas || !this.#renderer || !this.#pipeline) return

    const old = this.#render.resolutionScale
    this.#render.resolutionScale = 4
    this.#handleResize()

    try {
      if (typeof this.#pipeline.renderAsync === STRINGS.FUNCTION) {
        await this.#pipeline.renderAsync()
      } else {
        this.#pipeline.render()
      }

      let dataUrl = ''

      try {
        dataUrl = this.#canvas.toDataURL(STRINGS.IMAGE_PNG)
      } catch (err) {
        console.warn('[EarthBG] toDataURL fallback:', err)
      }

      if (!dataUrl || dataUrl === 'data:,') {
        const blob = await new Promise((resolve) => this.#canvas.toBlob(resolve, STRINGS.IMAGE_PNG))

        if (blob) {
          dataUrl = URL.createObjectURL(blob)
        }
      }

      if (dataUrl) {
        const a = document.createElement('a')

        a.style.display = 'none'

        a.download = `earth-4k-${Date.now()}.png`

        a.href = dataUrl

        document.body.appendChild(a)

        a.click()

        setTimeout(() => {
          if (a.parentNode) a.parentNode.removeChild(a)

          if (dataUrl.startsWith(STRINGS.BLOB_COLON)) URL.revokeObjectURL(dataUrl)
        }, 1000)
      }
    } catch (e) {
      console.error('[EarthBG] Screenshot failed:', e)
    } finally {
      this.#render.resolutionScale = old
      this.#handleResize()
    }
  }

  destroy() {
    this.#disposed = true
    if (this.#animId) { cancelAnimationFrame(this.#animId); this.#animId = null }
    window.removeEventListener('resize', this.#handleResize)
    this.#renderer?.dispose()
    this.#controls?.dispose()
  }

  get settings() {
    const cam = this.getCameraState()

    return {
      SHOW: true,
      COLOR_GRADING: {
        CONTRAST: this.#cg?.contrast ?? DEFAULT_SP_GUI.COLOR_GRADING.CONTRAST,
        SATURATION: this.#cg?.saturation ?? DEFAULT_SP_GUI.COLOR_GRADING.SATURATION,
        BLACK_LEVEL: this.#cg?.blackLevel ?? DEFAULT_SP_GUI.COLOR_GRADING.BLACK_LEVEL,
        BLUE_GREEN_BOOST: this.#cg?.blueGreenBoost ?? DEFAULT_SP_GUI.COLOR_GRADING.BLUE_GREEN_BOOST,
      },
      MOON: {
        ENABLED: this.#moonCfg?.enabled ?? DEFAULT_SP_GUI.MOON.ENABLED,
        SPEED: this.#moonCfg?.speed ?? DEFAULT_SP_GUI.MOON.SPEED,
        DISTANCE: this.#moonCfg?.distance ?? DEFAULT_SP_GUI.MOON.DISTANCE,
        INCLINATION: this.#moonCfg?.inclination ?? DEFAULT_SP_GUI.MOON.INCLINATION,
      },
      LENS_FLARE: {
        ENABLED: this.#flare?.enabled ?? DEFAULT_SP_GUI.LENS_FLARE.ENABLED,
        INTENSITY: this.#flare?.intensity ?? DEFAULT_SP_GUI.LENS_FLARE.INTENSITY,
      },
      ANAMORPHIC: {
        ENABLED: DEFAULT_SP_GUI.ANAMORPHIC.ENABLED,
        INTENSITY: DEFAULT_SP_GUI.ANAMORPHIC.INTENSITY,
        THICKNESS: DEFAULT_SP_GUI.ANAMORPHIC.THICKNESS,
        SIZE: DEFAULT_SP_GUI.ANAMORPHIC.SIZE,
        COLOR: DEFAULT_SP_GUI.ANAMORPHIC.COLOR,
        INNER_FADE: DEFAULT_SP_GUI.ANAMORPHIC.INNER_FADE,
        OUTER_FADE: DEFAULT_SP_GUI.ANAMORPHIC.OUTER_FADE,
      },
      BLOOM: {
        ENABLED: this.#bloom_?.enabled ?? DEFAULT_SP_GUI.BLOOM.ENABLED,
        STRENGTH: this.#bloom_?.strength ?? DEFAULT_SP_GUI.BLOOM.STRENGTH,
        RADIUS: this.#bloom_?.radius ?? DEFAULT_SP_GUI.BLOOM.RADIUS,
        THRESHOLD: this.#bloom_?.threshold ?? DEFAULT_SP_GUI.BLOOM.THRESHOLD,
      },
      VIGNETTE: {
        ENABLED: this.#vig?.enabled ?? DEFAULT_SP_GUI.VIGNETTE.ENABLED,
        DARKNESS: this.#vig?.darkness ?? DEFAULT_SP_GUI.VIGNETTE.DARKNESS,
        OFFSET: this.#vig?.offset ?? DEFAULT_SP_GUI.VIGNETTE.OFFSET,
      },
      CHROMATIC_ABERRATION: {
        ENABLED: this.#ca?.enabled ?? DEFAULT_SP_GUI.CHROMATIC_ABERRATION.ENABLED,
        STRENGTH: this.#ca?.strength ?? DEFAULT_SP_GUI.CHROMATIC_ABERRATION.STRENGTH,
        SCALE: this.#ca?.scale ?? DEFAULT_SP_GUI.CHROMATIC_ABERRATION.SCALE,
      },
      FILM_GRAIN: {
        ENABLED: this.#film?.enabled ?? DEFAULT_SP_GUI.FILM_GRAIN.ENABLED,
        INTENSITY: this.#film?.intensity ?? DEFAULT_SP_GUI.FILM_GRAIN.INTENSITY,
      },
      ATMOSPHERE: {
        MODE: DEFAULT_SP_GUI.ATMOSPHERE.MODE,
        DENSITY: DEFAULT_SP_GUI.ATMOSPHERE.DENSITY,
        RAYLEIGH_COLOR: DEFAULT_SP_GUI.ATMOSPHERE.RAYLEIGH_COLOR,
        MIE_COLOR: DEFAULT_SP_GUI.ATMOSPHERE.MIE_COLOR,
        TWILIGHT_COLOR: DEFAULT_SP_GUI.ATMOSPHERE.TWILIGHT_COLOR,
        AIRGLOW_COLOR: DEFAULT_SP_GUI.ATMOSPHERE.AIRGLOW_COLOR,
      },
      CLOUD_SHADOWS: {
        DISTANCE: DEFAULT_SP_GUI.CLOUD_SHADOWS.DISTANCE,
        INTENSITY: DEFAULT_SP_GUI.CLOUD_SHADOWS.INTENSITY,
        COLOR: DEFAULT_SP_GUI.CLOUD_SHADOWS.COLOR,
      },
      OCEAN: {
        ROUGHNESS: DEFAULT_SP_GUI.OCEAN.ROUGHNESS,
        METALNESS: this.#earthMatUniforms?.waterMetalness?.value ?? DEFAULT_SP_GUI.OCEAN.METALNESS,
      },
      EARTH: {
        ROTATION_SPEED: this.#earth_?.rotationSpeed ?? DEFAULT_SP_GUI.EARTH.ROTATION_SPEED,
        BUMP_SCALE: this.#earthMatUniforms?.bumpScale?.value ?? DEFAULT_SP_GUI.EARTH.BUMP_SCALE,
        TERRAIN_SHADOW_INTENSITY: this.#earthMatUniforms?.terrainShadowIntensity?.value ?? DEFAULT_SP_GUI.EARTH.TERRAIN_SHADOW_INTENSITY,
        TERRAIN_SHADOW_OFFSET: this.#earthMatUniforms?.terrainShadowOffset?.value ?? DEFAULT_SP_GUI.EARTH.TERRAIN_SHADOW_OFFSET,
        TRUE_INCLINATION: this.#earth_?.trueInclination ?? DEFAULT_SP_GUI.EARTH.TRUE_INCLINATION,
      },
      CAMERA: {
        FOV: this.#camera?.fov ?? DEFAULT_SP_GUI.CAMERA.FOV,
        POSITION: cam?.position ?? DEFAULT_SP_GUI.CAMERA.POSITION,
        TARGET: cam?.target ?? DEFAULT_SP_GUI.CAMERA.TARGET,
        AUTO_ROTATE: this.#controls?.autoRotate ?? DEFAULT_SP_GUI.CAMERA.AUTO_ROTATE,
        AUTO_ROTATE_SPEED: this.#controls?.autoRotateSpeed ?? DEFAULT_SP_GUI.CAMERA.AUTO_ROTATE_SPEED,
      },
      ENVIRONMENT: {
        SKYBOX_INTENSITY: DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_INTENSITY,
        SKYBOX_AZIMUTH: DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_AZIMUTH,
        SKYBOX_PITCH: DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_PITCH,
        SKYBOX_ROLL: DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_ROLL,
        DARK_SIDE_BRIGHTNESS: DEFAULT_SP_GUI.ENVIRONMENT.DARK_SIDE_BRIGHTNESS,
        CITY_LIGHTS: DEFAULT_SP_GUI.ENVIRONMENT.CITY_LIGHTS,
      },
      DEBUG: {
        STATS: DEFAULT_SP_GUI.DEBUG.STATS,
        RESOLUTION_SCALE: this.#render.resolutionScale ?? DEFAULT_SP_GUI.DEBUG.RESOLUTION_SCALE,
      },
      SUN: {
        INTENSITY: this.#sun?.intensity ?? DEFAULT_SP_GUI.SUN.INTENSITY,
        COLOR: DEFAULT_SP_GUI.SUN.COLOR,
        AUTO_ROTATE: this.#sun?.autoRotate ?? DEFAULT_SP_GUI.SUN.AUTO_ROTATE,
        SPEED: this.#sun?.speed ?? DEFAULT_SP_GUI.SUN.SPEED,
        INCLINATION: this.#sun?.inclination ?? DEFAULT_SP_GUI.SUN.INCLINATION,
      },
    }
  }

  updateBloom({ strength, radius, threshold, enabled } = {}) {
    if (!this.#bloom_ || !this.#bloomPass) return
    if (enabled !== undefined)   this.#bloom_.enabled  = enabled
    if (strength !== undefined)  this.#bloom_.strength = strength
    this.#bloomPass.strength.value = this.#bloom_.enabled ? this.#bloom_.strength : 0
    if (radius    !== undefined) this.#bloomPass.radius.value    = radius
    if (threshold !== undefined) this.#bloomPass.threshold.value = threshold
  }

  updateColorGrading({ contrast, saturation, blackLevel, blueGreenBoost } = {}) {
    if (!this.#cgUniforms) return
    if (contrast      !== undefined) { this.#cg.contrast      = contrast;      this.#cgUniforms.contrast.value      = contrast }
    if (saturation    !== undefined) { this.#cg.saturation    = saturation;    this.#cgUniforms.saturation.value    = saturation }
    if (blackLevel    !== undefined) { this.#cg.blackLevel    = blackLevel;    this.#cgUniforms.blackLevel.value    = blackLevel }
    if (blueGreenBoost!== undefined) { this.#cg.blueGreenBoost = blueGreenBoost; this.#cgUniforms.blueGreenBoost.value = blueGreenBoost }
  }

  updateCamera({ fov, autoRotate, autoRotateSpeed } = {}) {
    if (!this.#camera || !this.#controls) return
    if (fov             !== undefined) { this.#camera.fov = fov; this.#camera.updateProjectionMatrix() }
    if (autoRotate      !== undefined) this.#controls.autoRotate      = autoRotate
    if (autoRotateSpeed !== undefined) this.#controls.autoRotateSpeed = autoRotateSpeed
  }

  updateEarth({ rotationSpeed, trueInclination } = {}) {
    if (!this.#earth_) return
    if (rotationSpeed    !== undefined) this.#earth_.rotationSpeed    = rotationSpeed
    if (trueInclination  !== undefined) this.#earth_.trueInclination  = trueInclination
  }

  updateEarthMaterial({ waterMetalness, waterRoughness, bumpScale, terrainShadowIntensity, terrainShadowOffset } = {}) {
    if (!this.#earthMatUniforms) return
    if (waterMetalness        !== undefined) this.#earthMatUniforms.waterMetalness.value        = waterMetalness
    if (waterRoughness        !== undefined) this.#earthMatUniforms.waterRoughness.value        = waterRoughness
    if (bumpScale             !== undefined) this.#earthMatUniforms.bumpScale.value             = bumpScale
    if (terrainShadowIntensity !== undefined) this.#earthMatUniforms.terrainShadowIntensity.value = terrainShadowIntensity
    if (terrainShadowOffset   !== undefined) this.#earthMatUniforms.terrainShadowOffset.value   = terrainShadowOffset
  }

  updateVignette({ enabled, darkness, offset } = {}) {
    if (!this.#vigUniforms) return
    if (enabled  !== undefined) this.#vig.enabled  = enabled
    if (darkness !== undefined) this.#vig.darkness = darkness
    if (offset   !== undefined) this.#vig.offset   = offset
    this.#vigUniforms.darkness.value = this.#vig.enabled ? this.#vig.darkness : 0
    if (offset !== undefined) this.#vigUniforms.offset.value = offset
  }

  updateChromatic({ enabled, strength, scale } = {}) {
    if (!this.#caUniforms) return
    if (enabled  !== undefined) this.#ca.enabled  = enabled
    if (strength !== undefined) this.#ca.strength = strength
    if (scale    !== undefined) this.#ca.scale    = scale
    this.#caUniforms.strength.value = this.#ca.enabled ? this.#ca.strength : 0
    if (scale !== undefined) this.#caUniforms.scale.value = scale
  }

  updateRender({ resolutionScale } = {}) {
    if (resolutionScale !== undefined) {
      this.#render.resolutionScale = resolutionScale

      this.#handleResize()
    }
  }

  updateFilm({ enabled, intensity } = {}) {
    if (!this.#filmU) return

    if (enabled  !== undefined) this.#film.enabled   = enabled
    if (intensity !== undefined) this.#film.intensity = intensity

    this.#filmU.value = this.#film.enabled ? this.#film.intensity : 0
  }

  updateSun({ autoRotate } = {}) {
    if (!this.#sun) return

    if (autoRotate !== undefined) this.#sun.autoRotate = autoRotate
  }

  getCameraState() {
    if (!this.#camera || !this.#controls) return null

    const p = this.#camera.position
    const t = this.#controls.target

    return {
      position: { x: Number(p.x.toFixed(2)), y: Number(p.y.toFixed(2)), z: Number(p.z.toFixed(2)) },
      target:   { x: Number(t.x.toFixed(2)), y: Number(t.y.toFixed(2)), z: Number(t.z.toFixed(2)) },
    }
  }

  resetView() {
    this.#controls?.reset()
    if (this.#camera) {
      this.#camera.fov = DEFAULT_SP_GUI.CAMERA.FOV
      this.#camera.updateProjectionMatrix()
      this.#camera.position.set(
        DEFAULT_SP_GUI.CAMERA.POSITION.x,
        DEFAULT_SP_GUI.CAMERA.POSITION.y,
        DEFAULT_SP_GUI.CAMERA.POSITION.z
      )
    }
    if (this.#controls) {
      this.#controls.target.set(
        DEFAULT_SP_GUI.CAMERA.TARGET.x,
        DEFAULT_SP_GUI.CAMERA.TARGET.y,
        DEFAULT_SP_GUI.CAMERA.TARGET.z
      )
      this.#controls.update()
    }
  }

  /* ─── Bootstrap ──────────────────────────────────────────────────────── */

  async #bootstrap() {
    const THREE = await import('three')
    const { WebGPURenderer, MeshPhysicalNodeMaterial, MeshBasicNodeMaterial } = await import('three/webgpu')
    const TSL = await import('three/tsl')
    const { bloom }               = await import('three/examples/jsm/tsl/display/BloomNode.js')
    const { chromaticAberration } = await import('three/examples/jsm/tsl/display/ChromaticAberrationNode.js')
    const { film }                = await import('three/examples/jsm/tsl/display/FilmNode.js')
    const { OrbitControls }       = await import('three/examples/jsm/controls/OrbitControls.js')
    const { RenderPipeline }      = await import('three/webgpu')

    this.#three = THREE
    this.#vecA = new THREE.Vector3()
    this.#vecB = new THREE.Vector3()
    this.#vecC = new THREE.Vector3()

    if (this.#disposed) return

    /* Renderer */
    let useWebGL = true

    if (typeof navigator !== STRINGS.UNDEFINED && navigator.gpu) {
      try {
        const adapter = await navigator.gpu.requestAdapter()

        if (adapter) useWebGL = false
      } catch {
        useWebGL = true
      }
    }

    try {
      this.#renderer = new WebGPURenderer({
        canvas: this.#canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        forceWebGL: useWebGL,
        preserveDrawingBuffer: true,
      })

      await this.#renderer.init()
    } catch (e) {
      console.warn('[EarthBG] WebGPU init failed, falling back to WebGL:', e)

      const oldCanvas = this.#canvas

      const parent = oldCanvas?.parentElement

      if (parent) {
        const newCanvas = oldCanvas.cloneNode(true)

        parent.replaceChild(newCanvas, oldCanvas)

        this.#canvas = newCanvas
      }

      this.#renderer = new WebGPURenderer({
        canvas: this.#canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        forceWebGL: true,
        preserveDrawingBuffer: true,
      })

      await this.#renderer.init()
    }

    if (this.#disposed) return

    this.#renderer.toneMapping         = THREE.NoToneMapping
    this.#renderer.toneMappingExposure = 1
    this.#renderer.shadowMap.enabled   = false

    /* Scene / Camera */
    this.#scene  = new THREE.Scene()
    this.#camera = new THREE.PerspectiveCamera(DEFAULT_SP_GUI.CAMERA.FOV, 1, 0.1, 1000)
    this.#camera.position.set(
      DEFAULT_SP_GUI.CAMERA.POSITION.x,
      DEFAULT_SP_GUI.CAMERA.POSITION.y,
      DEFAULT_SP_GUI.CAMERA.POSITION.z
    )

    /* Controls */
    this.#controls = new OrbitControls(this.#camera, this.#canvas)
    this.#controls.enableDamping    = true
    this.#controls.enablePan        = true
    this.#controls.enableZoom       = true
    this.#controls.mouseButtons.RIGHT = THREE.MOUSE.PAN
    this.#controls.minDistance      = EARTH_RADIUS * 1.2
    this.#controls.maxDistance      = EARTH_RADIUS * 10
    this.#controls.autoRotate       = DEFAULT_SP_GUI.CAMERA.AUTO_ROTATE
    this.#controls.autoRotateSpeed  = DEFAULT_SP_GUI.CAMERA.AUTO_ROTATE_SPEED
    this.#controls.target.set(
      DEFAULT_SP_GUI.CAMERA.TARGET.x,
      DEFAULT_SP_GUI.CAMERA.TARGET.y,
      DEFAULT_SP_GUI.CAMERA.TARGET.z
    )
    this.#controls.update()
    this.#controls.saveState()

    this.#loader = new THREE.TextureLoader()

    this.#onProgress?.('Initializing WebGPU renderer…', 5)

    /* Sun */
    const sunDist = 200
    const sa = 0
    const si = DEFAULT_SP_GUI.SUN.INCLINATION
    this.#sun = {
      autoRotate: DEFAULT_SP_GUI.SUN.AUTO_ROTATE,
      speed: DEFAULT_SP_GUI.SUN.SPEED,
      inclination: DEFAULT_SP_GUI.SUN.INCLINATION,
      intensity: DEFAULT_SP_GUI.SUN.INTENSITY,
      color: DEFAULT_SP_GUI.SUN.COLOR,
      angle: sa,
    }
    this.#sunLight = new THREE.DirectionalLight(this.#sun.color, this.#sun.intensity)
    this.#sunLight.position.set(Math.cos(sa) * sunDist, Math.sin(si) * sunDist, Math.sin(sa) * sunDist)
    this.#scene.add(this.#sunLight)

    const sunGeom = new THREE.SphereGeometry(6, 32, 32)
    const sunMat  = new THREE.MeshBasicMaterial({ color: new THREE.Color(this.#sun.color).multiplyScalar(2) })
    this.#sunMesh  = new THREE.Mesh(sunGeom, sunMat)
    this.#sunMesh.position.copy(this.#sunLight.position)
    this.#scene.add(this.#sunMesh)

    this.#sunDirU  = TSL.uniform(this.#sunLight.position.clone().normalize())
    this.#moonPosU = TSL.uniform(new THREE.Vector3())

    this.#syncSun()

    /* Starfield */
    this.#onProgress?.('Loading starfield…', 15)
    const starsTex = await this.#loader.loadAsync(TEXTURES.STARS)
    if (this.#disposed) return
    this.#starsTex = starsTex
    starsTex.mapping     = THREE.EquirectangularReflectionMapping
    starsTex.colorSpace  = THREE.SRGBColorSpace
    this.#scene.background             = starsTex
    this.#scene.backgroundRotation.order = 'YXZ'
    this.#scene.backgroundIntensity    = DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_INTENSITY
    this.#scene.backgroundRotation.y   = DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_AZIMUTH
    this.#scene.backgroundRotation.x   = DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_PITCH
    this.#scene.backgroundRotation.z   = DEFAULT_SP_GUI.ENVIRONMENT.SKYBOX_ROLL

    /* Moon */
    this.#onProgress?.('Building Moon…', 30)
    this.#moonCfg = {
      enabled: DEFAULT_SP_GUI.MOON.ENABLED,
      speed: DEFAULT_SP_GUI.MOON.SPEED,
      distance: DEFAULT_SP_GUI.MOON.DISTANCE,
      inclination: DEFAULT_SP_GUI.MOON.INCLINATION,
      angle: Math.PI,
    }
    this.#moon    = await this.#buildMoon(THREE)
    if (this.#disposed) return
    this.#scene.add(this.#moon)
    this.#moon.position.set(0, 0, -100)

    /* Earth */
    this.#onProgress?.('Loading Earth textures…', 50)
    const maxAniso = this.#renderer.getMaxAnisotropy?.() ?? 4
    this.#earth = await this.#buildEarth(THREE, TSL, { MeshPhysicalNodeMaterial, MeshBasicNodeMaterial }, maxAniso)
    if (this.#disposed) return
    this.#scene.add(this.#earth)
    this.#earth_ = {
      rotationSpeed: DEFAULT_SP_GUI.EARTH.ROTATION_SPEED,
      trueInclination: DEFAULT_SP_GUI.EARTH.TRUE_INCLINATION,
    }
    if (this.#earth_.trueInclination) {
      this.#earth.rotation.z = (23.44 * Math.PI) / 180
    }

    /* Render pipeline */
    this.#onProgress?.('Building post-processing pipeline…', 70)
    this.#pipeline = new RenderPipeline(this.#renderer)
    const scenePass = TSL.pass(this.#scene, this.#camera)

    this.#bloom_ = {
      enabled: DEFAULT_SP_GUI.BLOOM.ENABLED,
      strength: DEFAULT_SP_GUI.BLOOM.STRENGTH,
      radius: DEFAULT_SP_GUI.BLOOM.RADIUS,
      threshold: DEFAULT_SP_GUI.BLOOM.THRESHOLD,
    }
    this.#bloomPass = bloom(scenePass, this.#bloom_.strength, this.#bloom_.radius, this.#bloom_.threshold)

    /* Lens flare */
    this.#flarePosU = TSL.uniform(new THREE.Vector2(-99, -99))
    this.#flareIntU = TSL.uniform(DEFAULT_SP_GUI.LENS_FLARE.INTENSITY)
    this.#flare     = {
      enabled: DEFAULT_SP_GUI.LENS_FLARE.ENABLED,
      intensity: DEFAULT_SP_GUI.LENS_FLARE.INTENSITY,
    }

    const { lensflareNode, ccNode } = this.#makeLensflareNodes(TSL)
    const baseUv    = TSL.screenCoordinate.div(TSL.screenSize).sub(TSL.vec2(0.5))
    const aspect    = TSL.screenSize.x.div(TSL.screenSize.y)
    const flareUv   = TSL.vec2(baseUv.x.mul(aspect), baseUv.y)
    const lF        = lensflareNode({ uv: flareUv, pos: this.#flarePosU, iTime: TSL.time })
    const colorFlare = TSL.mul(ccNode({ color: lF, factor: 0.5, factor2: 0.1 }), this.#flareIntU)

    /* Color grading */
    this.#cg = {
      contrast: DEFAULT_SP_GUI.COLOR_GRADING.CONTRAST,
      saturation: DEFAULT_SP_GUI.COLOR_GRADING.SATURATION,
      blackLevel: DEFAULT_SP_GUI.COLOR_GRADING.BLACK_LEVEL,
      blueGreenBoost: DEFAULT_SP_GUI.COLOR_GRADING.BLUE_GREEN_BOOST,
    }
    const cgCU  = TSL.uniform(this.#cg.contrast)
    const cgSU  = TSL.uniform(this.#cg.saturation)
    const cgBLU = TSL.uniform(this.#cg.blackLevel)
    const cgBGU = TSL.uniform(this.#cg.blueGreenBoost)
    this.#cgUniforms = { contrast: cgCU, saturation: cgSU, blackLevel: cgBLU, blueGreenBoost: cgBGU }

    const { colorGradeNode, vignetteNode } = this.#makePostNodes(TSL)
    const preGrade  = scenePass.add(this.#bloomPass).add(colorFlare)
    const hdrGraded = colorGradeNode({ color: preGrade, contrast: cgCU, saturation: cgSU, blackLevel: cgBLU, blueGreenBoost: cgBGU })
    const sdrToned  = hdrGraded.toneMapping(THREE.ACESFilmicToneMapping)

    /* Post: CA, film, vignette */
    this.#ca  = {
      enabled: DEFAULT_SP_GUI.CHROMATIC_ABERRATION.ENABLED,
      strength: DEFAULT_SP_GUI.CHROMATIC_ABERRATION.STRENGTH,
      scale: DEFAULT_SP_GUI.CHROMATIC_ABERRATION.SCALE,
    }
    this.#vig = {
      enabled: DEFAULT_SP_GUI.VIGNETTE.ENABLED,
      darkness: DEFAULT_SP_GUI.VIGNETTE.DARKNESS,
      offset: DEFAULT_SP_GUI.VIGNETTE.OFFSET,
    }
    this.#film = {
      enabled: DEFAULT_SP_GUI.FILM_GRAIN.ENABLED,
      intensity: DEFAULT_SP_GUI.FILM_GRAIN.INTENSITY,
    }

    const caStrU  = TSL.uniform(this.#ca.enabled  ? this.#ca.strength  : 0)
    const caScU   = TSL.uniform(this.#ca.scale)
    const vigDU   = TSL.uniform(this.#vig.enabled  ? this.#vig.darkness : 0)
    const vigOU   = TSL.uniform(this.#vig.offset)
    const filmU   = TSL.uniform(this.#film.enabled ? this.#film.intensity : 0)

    this.#caUniforms  = { strength: caStrU, scale: caScU }
    this.#vigUniforms = { darkness: vigDU, offset: vigOU }
    this.#filmU       = filmU

    let finalNode = sdrToned
    finalNode = vignetteNode({ color: finalNode, uv: TSL.screenCoordinate.div(TSL.screenSize), darkness: vigDU, offset: vigOU })
    finalNode = chromaticAberration(finalNode, caStrU, TSL.vec2(0.5, 0.5), caScU)
    finalNode = film(finalNode, filmU)

    this.#pipeline.outputNode = finalNode
    this.#render.resolutionScale = DEFAULT_SP_GUI.DEBUG.RESOLUTION_SCALE

    /* Resize + start */
    this.#handleResize()
    window.addEventListener('resize', this.#handleResize)

    this.#onProgress?.('Compiling shaders…', 90)
    try {
      await this.#renderer.compileAsync(this.#scene, this.#camera)
    } catch (err) {
      console.warn('[EarthBG] Shader compile warmup notice:', err)
    }
    if (this.#disposed) return

    if (!this.#reduced) this.#tick()
    this.#onProgress?.('Ready', 100)
    this.#onReady?.()
  }

  /* ─── Earth builder ──────────────────────────────────────────────────── */

  async #buildEarth(THREE, TSL, mats, maxAniso) {
    const { MeshPhysicalNodeMaterial, MeshBasicNodeMaterial } = mats
    const {
      texture, normalMap, mix, normalize, cross, cameraPosition, positionWorld,
      pow, dot, max, vec3, vec4, float, min, bumpMap, smoothstep,
      equirectUV, positionLocal, modelWorldMatrixInverse, uniform,
    } = TSL

    const group = new THREE.Group()
    const ld    = this.#loader

    const [colorTex, specTex, normalTex, cloudsTex, nightTex] = await Promise.all([
      ld.loadAsync(TEXTURES.ALBEDO), ld.loadAsync(TEXTURES.SPECULAR),
      ld.loadAsync(TEXTURES.NORMAL), ld.loadAsync(TEXTURES.CLOUDS),
      ld.loadAsync(TEXTURES.NIGHT),
    ])

    for (const t of [colorTex, cloudsTex, nightTex]) t.colorSpace = THREE.SRGBColorSpace
    for (const t of [colorTex, specTex, normalTex, cloudsTex, nightTex]) t.anisotropy = maxAniso

    const mkGeo = (r, s) => new THREE.SphereGeometry(r, s, s)

    const mat = new MeshPhysicalNodeMaterial()
    const sunDir   = this.#sunDirU
    const sunLocal = normalize(modelWorldMatrixInverse.mul(vec4(sunDir, 0)).xyz)

    /* Cloud shadows */
    const sDist    = uniform(DEFAULT_SP_GUI.CLOUD_SHADOWS.DISTANCE)
    const sInt     = uniform(DEFAULT_SP_GUI.CLOUD_SHADOWS.INTENSITY)
    const sColor   = uniform(new THREE.Color(DEFAULT_SP_GUI.CLOUD_SHADOWS.COLOR))
    const sFaded   = mix(0.1, sDist, smoothstep(0.8, 0, dot(normalize(positionLocal), sunLocal)))
    const sPosL    = positionLocal.add(sunLocal.mul(sFaded))
    const sUv      = equirectUV(normalize(sPosL))
    const sOp      = texture(cloudsTex, sUv).r
    const cloudShadow = mix(vec3(1), sColor, sOp.mul(sInt))

    /* Day/night */
    const sunDot   = dot(normalize(positionWorld), sunDir)
    const nightFade = smoothstep(0.2, -0.2, sunDot)
    const twilColor = uniform(new THREE.Color(DEFAULT_SP_GUI.ATMOSPHERE.TWILIGHT_COLOR))
    const darkBr   = uniform(DEFAULT_SP_GUI.ENVIRONMENT.DARK_SIDE_BRIGHTNESS)
    const cityLts  = uniform(DEFAULT_SP_GUI.ENVIRONMENT.CITY_LIGHTS)
    const t1 = smoothstep(0, 0.2, sunDot).oneMinus()
    const t2 = smoothstep(-0.2, 0, sunDot)
    const twilTint  = mix(vec3(1), twilColor, t1.mul(t2).mul(0.5))

    const spec = texture(specTex).r

    /* Water */
    const wRough = uniform(DEFAULT_SP_GUI.OCEAN.ROUGHNESS)
    const wMetal = uniform(DEFAULT_SP_GUI.OCEAN.METALNESS)

    /* Normals + self shadow */
    const surf  = normalize(positionLocal)
    const vTan  = normalize(cross(vec3(0, 1, 0), surf))
    const vBit  = normalize(cross(surf, vTan))
    const nMap  = texture(normalTex).xyz.mul(2).sub(1)
    const pN    = normalize(vTan.mul(nMap.x).add(vBit.mul(nMap.y)).add(surf.mul(nMap.z)))
    const tSSI  = uniform(DEFAULT_SP_GUI.EARTH.TERRAIN_SHADOW_INTENSITY)
    const tSSO  = uniform(DEFAULT_SP_GUI.EARTH.TERRAIN_SHADOW_OFFSET)
    const tDot  = max(0, dot(pN, sunLocal))
    const sProj = sunLocal.sub(surf.mul(dot(sunLocal, surf)))
    const sT    = normalize(sProj.add(vec3(1e-6)))
    const offP  = normalize(positionLocal.add(sT.mul(tSSO)))
    const offUv = equirectUV(offP)
    const offN  = texture(normalTex, offUv).xyz.mul(2).sub(1)
    const pNOff = normalize(vTan.mul(offN.x).add(vBit.mul(offN.y)).add(surf.mul(offN.z)))
    const offDot= max(0, dot(pNOff, sunLocal))
    const occ   = max(0, offDot.sub(tDot))
    const lMask = spec.oneMinus()
    const dayM  = smoothstep(0, 0.2, dot(surf, sunLocal))
    const ssF   = smoothstep(0, 0.3, occ).mul(lMask).mul(tSSI).mul(dayM)
    const tSC   = mix(vec3(1), vec3(0.1, 0.15, 0.2), ssF)

    /* Moon eclipse */
    const { length: len_, acos: ac_, sub: sub_ } = TSL
    const moonP   = this.#moonPosU
    const fToMoon = sub_(moonP, positionWorld)
    const thetaM_ = ac_(max(float(-1), min(float(1), dot(normalize(fToMoon), sunDir))))
    const tMr     = float(0.024)
    const sAR     = float(0.02)
    const penOuter = tMr.add(sAR)
    const umbInner = max(float(0), tMr.sub(sAR))
    const eclSh    = smoothstep(penOuter, umbInner, thetaM_)
    const eclDim   = mix(vec3(1), vec3(0.015, 0.02, 0.025), eclSh)

    mat.colorNode         = texture(colorTex).mul(cloudShadow).mul(twilTint).mul(tSC).mul(eclDim)
    mat.roughnessNode     = mix(mix(0.9, wRough, spec), float(1), eclSh)
    mat.metalnessNode     = mix(mix(0, wMetal, spec), float(0), eclSh)

    const bumpScale = uniform(DEFAULT_SP_GUI.EARTH.BUMP_SCALE)
    const bumpFade  = smoothstep(-0.15, 0.15, sunDot)

    mat.normalNode  = normalMap(texture(normalTex), bumpScale.mul(bumpFade))

    const nightLights = texture(nightTex).mul(nightFade).mul(cityLts)
    const darkAmb     = texture(colorTex).mul(nightFade).mul(darkBr).mul(0.5)

    mat.emissiveNode = nightLights.add(darkAmb)

    this.#earthMatUniforms = {
      waterRoughness: wRough,
      waterMetalness: wMetal,
      bumpScale,
      terrainShadowIntensity: tSSI,
      terrainShadowOffset: tSSO,
      cityLights: cityLts,
      darkSideBrightness: darkBr,
    }

    const earthMesh = new THREE.Mesh(mkGeo(EARTH_RADIUS, SEG_HIGH), mat)

    /* Clouds */
    const cMat  = new MeshPhysicalNodeMaterial()
    cMat.transparent = true; cMat.depthWrite = false; cMat.blending = THREE.NormalBlending
    cMat.colorNode   = vec3(1).mul(twilTint).mul(eclDim)
    cMat.emissiveNode = mix(vec3(0.005, 0.007, 0.01), vec3(0.05, 0.06, 0.08), nightFade).mul(darkBr).mul(20)
    cMat.normalNode  = bumpMap(texture(cloudsTex), float(0.02).mul(bumpFade))
    cMat.opacityNode = texture(cloudsTex).r

    const cloudsMesh = new THREE.Mesh(mkGeo(EARTH_RADIUS + 0.05, SEG_HIGH), cMat)
    cloudsMesh.name = 'clouds'
    this.#cloudsMesh = cloudsMesh

    /* Outer atmosphere */
    const aMat  = new MeshBasicNodeMaterial()
    aMat.transparent = true; aMat.side = THREE.BackSide; aMat.depthWrite = false; aMat.blending = THREE.AdditiveBlending

    const dirToFrag  = normalize(positionWorld.sub(cameraPosition))
    const worldNorm  = normalize(positionWorld)
    const v_         = dot(dirToFrag, worldNorm).clamp(0, 1)
    const optD       = pow(v_.mul(5).clamp(1e-5, 1), 2.5)
    const sunDotA    = dot(worldNorm, sunDir)
    const cosTheta   = dot(dirToFrag, sunDir)
    const rCol       = uniform(new THREE.Color(DEFAULT_SP_GUI.ATMOSPHERE.RAYLEIGH_COLOR))
    const rInt       = uniform(1.0)
    const mCol       = uniform(new THREE.Color(DEFAULT_SP_GUI.ATMOSPHERE.MIE_COLOR))
    const airglowCol = uniform(new THREE.Color(DEFAULT_SP_GUI.ATMOSPHERE.AIRGLOW_COLOR))
    const atmosDens  = uniform(DEFAULT_SP_GUI.ATMOSPHERE.DENSITY)
    const atmosMode  = uniform(DEFAULT_SP_GUI.ATMOSPHERE.MODE === 'Scattering' ? 0 : 1)
    const rPhase     = cosTheta.mul(cosTheta).add(1).mul(3 / (16 * Math.PI))
    const rScatter   = rCol.mul(rPhase).mul(atmosDens).mul(rInt)
    const g = 0.76; const g2 = g * g
    const mPhaseBase = cosTheta.mul(-2 * g).add(1 + g2)
    const mPC        = 3 * (1 - g2) / (8 * Math.PI * (2 + g2))
    const mPhase     = cosTheta.mul(cosTheta).add(1).mul(mPC).div(pow(mPhaseBase, 1.5))
    const mScatter   = mCol.mul(mPhase).mul(atmosDens)
    const intPhase   = smoothstep(-0.2, 0.2, sunDotA)
    const scattered  = rScatter.add(mScatter).mul(intPhase)
    const greenBand  = smoothstep(0.06, 0.02, v_).mul(smoothstep(0, 0.04, v_))
    const blueBand   = smoothstep(0.15, 0.05, v_).mul(smoothstep(0.03, 0.1, v_))
    const airglowLight = airglowCol.mul(greenBand).mul(4).add(vec3(0.2, 0.3, 0.6).mul(blueBand).mul(1.5)).mul(intPhase)
    const finalScat  = scattered.mul(optD)
    const finalAirglow = airglowLight.add(finalScat.mul(0.1))

    aMat.colorNode = mix(finalScat, finalAirglow, atmosMode)

    const atmosMesh = new THREE.Mesh(mkGeo(ATMOS_RADIUS, SEG_HIGH), aMat)

    /* Inner atmosphere (fresnel) */
    const iMat  = new MeshBasicNodeMaterial()
    iMat.transparent = true; iMat.side = THREE.FrontSide; iMat.depthWrite = false; iMat.blending = THREE.AdditiveBlending

    const viewDir   = normalize(cameraPosition.sub(positionWorld))
    const invDot_   = dot(viewDir, worldNorm).clamp(0, 1).oneMinus()
    const innerOpt  = pow(invDot_.clamp(1e-4, 1), 6).mul(1.5)
    const innerFinalScat = scattered.mul(innerOpt)
    const innerFinalAirglow = innerFinalScat.mul(0.5).add(airglowCol.mul(innerOpt).mul(0.5).mul(intPhase))

    iMat.colorNode = mix(innerFinalScat, innerFinalAirglow, atmosMode)

    const innerMesh = new THREE.Mesh(mkGeo(EARTH_RADIUS + 0.02, SEG_HIGH), iMat)

    group.add(earthMesh, cloudsMesh, atmosMesh, innerMesh)

    return group
  }

  async #buildMoon(THREE) {
    const [map, disp] = await Promise.all([
      this.#loader.loadAsync(TEXTURES.MOON),
      this.#loader.loadAsync(TEXTURES.MOON_DISP),
    ])
    map.colorSpace = THREE.SRGBColorSpace

    const mat = new THREE.MeshStandardMaterial({
      map, displacementMap: disp, displacementScale: 0,
      emissive: new THREE.Color(0xffffff), emissiveMap: map, emissiveIntensity: 0.02,
      roughness: 0.9, metalness: 0,
    })
    const lod = new THREE.LOD()
    lod.addLevel(new THREE.Mesh(new THREE.SphereGeometry(5, 96, 96), mat), 0)
    lod.addLevel(new THREE.Mesh(new THREE.SphereGeometry(5, 48, 48), mat), 30)
    lod.addLevel(new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), mat), 60)
    return lod
  }

  /* ─── TSL shader nodes (universal WebGPU + WebGL) ───────────────────── */

  #makeLensflareNodes(TSL) {
    const { Fn, vec2, vec3, float, max, mix, atan2 } = TSL

    const n1 = Fn(([t]) => t.mul(12.9898).sin().mul(43758.5453).fract())

    const n2 = Fn(([t]) => t.dot(vec2(12.9898, 78.233)).sin().mul(43758.5453).fract())

    const lensflareNode = Fn(({ uv, pos, iTime }) => {
      const main = uv.sub(pos)

      const uvd  = uv.mul(uv.length())

      const ang  = atan2(main.y, main.x)

      const dist = main.length().pow(0.1)

      const t    = vec2(ang.sub(iTime.div(9.0)).mul(16.0), dist.mul(32.0))

      const n    = n2(t.add(vec2(iTime, iTime)))

      let f0     = float(1.0).div(uv.sub(pos).length().mul(16.0).add(1.0))

      const sinPart = ang.add(iTime.div(18.0)).add(n1(ang.abs().add(n.div(2.0))).mul(2.0)).mul(12.0).sin().mul(0.1)

      f0 = f0.add(f0.mul(sinPart.add(dist.mul(0.1)).add(0.8)))

      const f2  = max(float(1.0).div(float(1.0).add(uvd.add(pos.mul(0.80)).length().pow(2.0).mul(32.0))), 0.0).mul(0.25)

      const f22 = max(float(1.0).div(float(1.0).add(uvd.add(pos.mul(0.85)).length().pow(2.0).mul(32.0))), 0.0).mul(0.23)

      const f23 = max(float(1.0).div(float(1.0).add(uvd.add(pos.mul(0.90)).length().pow(2.0).mul(32.0))), 0.0).mul(0.21)

      const uvx = mix(uv, uvd, vec2(-0.5, -0.5))

      const f4  = max(float(0.01).sub(uvx.add(pos.mul(0.40)).length().pow(2.4)), 0.0).mul(6.0)

      const f42 = max(float(0.01).sub(uvx.add(pos.mul(0.45)).length().pow(2.4)), 0.0).mul(5.0)

      const f43 = max(float(0.01).sub(uvx.add(pos.mul(0.50)).length().pow(2.4)), 0.0).mul(3.0)

      return vec3(f0.add(f2).add(f4), f0.add(f22).add(f42), f0.add(f23).add(f43))
    })

    const ccNode = Fn(({ color, factor, factor2 }) => {
      const w = color.x.add(color.y).add(color.z)

      return mix(color, vec3(w).mul(factor), vec3(w.mul(factor2)))
    })

    return { lensflareNode, ccNode }
  }

  #makePostNodes(TSL) {
    const { Fn, vec3, float, max, mix } = TSL

    const colorGradeNode = Fn(({ color, contrast, saturation, blackLevel, blueGreenBoost }) => {
      const c = color.sub(0.5).mul(contrast).add(0.5)

      const luma = c.dot(vec3(0.299, 0.587, 0.114))

      const sat = mix(vec3(luma), c, saturation)

      const blk = max(sat.sub(vec3(blackLevel)), vec3(0.0))

      return blk.mul(vec3(1.0, blueGreenBoost.mul(0.5).add(1.0), blueGreenBoost.add(1.0)))
    })

    const vignetteNode = Fn(({ color, uv, darkness, offset }) => {
      const d = uv.sub(0.5).abs().mul(2.0)

      const v = float(1.0).sub(d.length().mul(offset)).clamp(0.0, 1.0)

      return color.mul(v.pow(darkness))
    })

    return { colorGradeNode, vignetteNode }
  }

  /* ─── Helpers ────────────────────────────────────────────────────────── */

  #syncSun() {
    if (!this.#sunLight || !this.#sunMesh || !this.#sun || !this.#sunDirU) return
    const { angle: a, inclination: si } = this.#sun
    const dist = 200
    this.#sunLight.position.set(Math.cos(a) * dist, Math.sin(si) * dist, Math.sin(a) * dist)
    this.#sunMesh.position.copy(this.#sunLight.position)
    this.#sunDirU.value.copy(this.#sunLight.position).normalize()
  }

  #updateLensFlare() {
    if (!this.#sunMesh || !this.#flarePosU || !this.#camera || !this.#vecA) return
    const sunPos = this.#sunMesh.position
    const camPos = this.#camera.position
    const p    = this.#vecA.copy(sunPos).project(this.#camera)
    const sDist = sunPos.distanceTo(camPos)
    const sDir  = this.#vecB.copy(sunPos).sub(camPos).normalize()
    const proj  = -camPos.dot(sDir)
    let occlusion = 1
    if (proj > 0 && proj < sDist) {
      const closest = this.#vecC.copy(camPos).addScaledVector(sDir, proj)
      const r = EARTH_RADIUS * 1.02
      const len = closest.length()
      if (len < r) occlusion = 0
      else if (len < r * 1.05) occlusion = (len - r) / (r * 0.05)
    }
    if (p.z > 1) {
      this.#flarePosU.value.set(-999, -999)
    } else {
      this.#flarePosU.value.set(p.x * 0.5 * this.#camera.aspect, -p.y * 0.5)
    }
    if (!this.#flare?.enabled) occlusion = 0
    this.#flareIntU.value = (this.#flare?.intensity ?? 0.12) * occlusion
  }

  #handleResize = () => {
    if (!this.#canvas || !this.#renderer || !this.#camera) return

    const host = this.#canvas.getRootNode()?.host
    const w    = host?.clientWidth || this.#canvas.parentElement?.clientWidth || window.innerWidth
    const h    = host?.clientHeight || this.#canvas.parentElement?.clientHeight || window.innerHeight

    if (!w || !h) return

    this.#camera.aspect = w / h
    this.#camera.updateProjectionMatrix()
    this.#renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2) * this.#render.resolutionScale)
    this.#renderer.setSize(w, h)
  }

  #tick = () => {
    if (this.#disposed || this.#reduced) return
    this.#animId = requestAnimationFrame(this.#tick)

    if (this.#sun?.autoRotate) {
      this.#sun.angle += 0.01 * this.#sun.speed
      if (this.#sun.angle > Math.PI * 2) this.#sun.angle -= Math.PI * 2
      this.#syncSun()
    }

    if (this.#moonCfg?.enabled && this.#moon) {
      this.#moonCfg.angle += this.#moonCfg.speed
      const { angle, inclination, distance } = this.#moonCfg
      this.#moon.position.set(
        Math.cos(angle) * distance,
        Math.sin(inclination) * distance,
        Math.sin(angle) * Math.cos(inclination) * distance,
      )
      this.#moon.lookAt(0, 0, 0)
      this.#moonPosU.value.copy(this.#moon.position)
    }

    if (this.#earth && this.#earth_) {
      this.#earth.rotation.y += this.#earth_.rotationSpeed
      this.#earth.rotation.z = this.#earth_.trueInclination ? (23.44 * Math.PI) / 180 : 0
      if (this.#cloudsMesh) this.#cloudsMesh.rotation.y += this.#earth_.rotationSpeed * 0.2
    }

    this.#updateLensFlare()
    this.#controls?.update()

    if (this.#renderer) {
      try {
        if (this.#pipeline) {
          this.#pipeline.render()
        } else if (this.#scene && this.#camera) {
          this.#renderer.render(this.#scene, this.#camera)
        }
      } catch (e) {
        console.warn('[EarthBG] Render error, fallback to direct render:', e)
        this.#pipeline = null
        if (this.#scene && this.#camera) {
          this.#renderer.render(this.#scene, this.#camera)
        }
      }
    }
  }
}
