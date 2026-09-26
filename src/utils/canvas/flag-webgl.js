import { EVENTS, STRINGS } from '../../core/constants.js'
import store from '../../core/store.js'

/**
 * WebGL Flag Animator for Language Selection Buttons
 * Each flag has a completely unique animated kinetic effect and wave physics:
 * - EN (0): Star-spangled waving ripple with specular stars sparkle
 * - PT (1): Solar burst pulse radiating from rhombus with Southern Cross constellation twinkle
 * - ES (2): Warm flamenco silk wave with golden crest glow
 * - DE (3): Swiss cross kinetic pulse transitioning into German horizontal ribbon wave
 * - HRK (4): Harmonic dual-wave blending German tricolor and Brazilian tropical pulse
 * - CAS (5): Sol de Mayo radiant solar rays pulsing across Argentine & Uruguayan sky-blue stripes
 * - RIV (6): Border river ripple reflecting the Uruguayan sun into Brazilian green-gold canopy
 * - GN (7): Tricolor horizontal fluid wave with national seal star glow
 * - IT (8): Mediterranean silk flutter with delicate cloth folds
 * - RU (9): Northern lights aurora borealis shimmer waving across the stripes
 * - FR (10): Revolutionary vertical tricolor ripple with satin sheen
 * - TLN (11): Venetian gondola water reflection merging Italian and Brazilian tones
 */
export class FlagWebGL {
  constructor(canvas, langOption) {
    this.canvas = canvas

    this.lang = langOption

    const rect = canvas.getBoundingClientRect?.()

    const isSmall = (rect && rect.height > 0 && rect.height < 25) || canvas.classList?.contains('flag-canvas--nav')

    this.width = isSmall ? (langOption.cc2 ? 24 : 18) : (langOption.cc2 ? 66 : 60)

    this.height = isSmall ? 13 : 44

    this.isHovered = false

    this.hoverLevel = 0.0

    this.useWebGL = false

    this.animId = null

    this.startTime = performance.now()

    this.tex1 = null

    this.tex2 = null

    this.img1 = null

    this.img2 = null

    this.isLoaded = false

    this.init()
  }

  _getAnimType() {
    const code = this.lang.code

    switch (code) {
      case 'en': return 0.0
      case 'br': return 1.0
      case 'es': return 2.0
      case 'de': return 3.0
      case 'hrk': return 4.0
      case 'cas': return 5.0
      case 'riv': return 6.0
      case 'gn': return 7.0
      case 'it': return 8.0
      case 'ru': return 9.0
      case 'fr': return 10.0
      case 'tln': return 11.0
      default: return 0.0
    }
  }

  init() {
    if (!this.canvas || typeof this.canvas.getContext !== STRINGS.FUNCTION) {
      this._triggerFallback()

      return
    }

    this.canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault()

      this._triggerFallback()
    }, false)

    const dpr = Math.max((typeof window !== STRINGS.UNDEFINED ? window.devicePixelRatio : 1) || 1, 2) * 2

    this.canvas.width = Math.round(this.width * dpr)

    this.canvas.height = Math.round(this.height * dpr)

    this.initWebGL()

    if (!this.useWebGL) {
      this._triggerFallback()

      return
    }

    this.loadImages()

    this.bindEvents()

    this.animate()
  }

  _triggerFallback() {
    this.useWebGL = false

    if (this.animId) {
      cancelAnimationFrame(this.animId)

      this.animId = null
    }

    this.canvas.style.display = 'none'

    this.canvas.classList.add('is-fallback')
  }

  loadImages() {
    const cc = this.lang.cc

    const cc2 = this.lang.cc2

    let loaded1 = false

    let loaded2 = false

    const checkDone = () => {
      if (loaded1 && (!cc2 || loaded2)) {
        this.isLoaded = true

        if (this.useWebGL && this.gl) {
          this._uploadTextures()
        }
      }
    }

    this.img1 = new Image()

    this.img1.crossOrigin = 'anonymous'

    this.img1.onload = () => {
      if (!loaded1) {
        loaded1 = true
        checkDone()
      }
    }

    this.img1.onerror = () => {
      console.warn(`Failed to load flag: ${cc}`)

      this._triggerFallback()
    }

    this.img1.src = `/flags/${cc}.svg`

    if (this.img1.complete && this.img1.naturalWidth) {
      loaded1 = true
      checkDone()
    }

    if (cc2) {
      this.img2 = new Image()

      this.img2.crossOrigin = 'anonymous'

      this.img2.onload = () => {
        if (!loaded2) {
          loaded2 = true
          checkDone()
        }
      }

      this.img2.onerror = () => {
        console.warn(`Failed to load flag: ${cc2}`)

        this._triggerFallback()
      }

      this.img2.src = `/flags/${cc2}.svg`

      if (this.img2.complete && this.img2.naturalWidth) {
        loaded2 = true
        checkDone()
      }
    }
  }

  _createPotTexture(gl, img) {
    const potCanvas = document.createElement('canvas')

    potCanvas.width = 512

    potCanvas.height = 256

    const ctx = potCanvas.getContext('2d')

    ctx.imageSmoothingEnabled = true

    ctx.imageSmoothingQuality = 'high'

    ctx.drawImage(img, 0, 0, 512, 256)

    const tex = gl.createTexture()

    gl.bindTexture(gl.TEXTURE_2D, tex)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, potCanvas)

    gl.generateMipmap(gl.TEXTURE_2D)

    return tex
  }

  _uploadTextures() {
    const gl = this.gl

    if (!gl) return

    if (this.img1 && this.img1.complete && this.img1.naturalWidth) {
      this.tex1 = this._createPotTexture(gl, this.img1)
    }

    if (this.img2 && this.img2.complete && this.img2.naturalWidth) {
      this.tex2 = this._createPotTexture(gl, this.img2)
    }
  }

  initWebGL() {
    try {
      const gl = this.canvas.getContext('webgl', { alpha: true, antialias: true }) ||
                 this.canvas.getContext('experimental-webgl', { alpha: true, antialias: true })

      if (!gl) return

      const vsSource = `
        attribute vec2 a_pos;
        varying vec2 v_uv;
        void main() {
          v_uv = (a_pos + 1.0) * 0.5;
          // Invert y so top-left matches standard image coords
          v_uv.y = 1.0 - v_uv.y;
          gl_Position = vec4(a_pos, 0.0, 1.0);
        }
      `

      const fsSource = `
        #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
        #else
        precision mediump float;
        #endif

        varying vec2 v_uv;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform float u_hover;
        uniform float u_anim_type;
        uniform float u_is_split;
        uniform sampler2D u_tex1;
        uniform sampler2D u_tex2;

        void main() {
          vec2 uv = v_uv;
          float t = u_time;
          float h = u_hover;
          float anim = u_anim_type;

          vec2 uvWarp = uv;
          float specular = 0.0;

          // Universal realistic aerodynamic wind model: Left-to-right
          // Fixed at flagpole (x=0.0) -> free flutter at edge (x=1.0)
          float windPhase = uv.x * 9.5 - t * 3.2;
          float windAmp = (0.20 + 0.80 * uv.x) * (0.016 + 0.010 * h);
          float baseWave = sin(windPhase);

          // Unique secondary cloth flutter & specular personality per flag (all synchronized with wind vector)
          float flutter = 0.0;

          if (anim < 0.5) {
            // 0: EN (US Flag - Stars shimmer)
            flutter = sin(windPhase * 1.5) * 0.005 + cos(uv.y * 7.0 - t * 1.8) * 0.003;
            specular = (0.5 + 0.5 * sin(windPhase)) * 0.28;

          } else if (anim < 1.5) {
            // 1: PT (BR Flag - Rhombus solar glow)
            flutter = sin(windPhase * 1.3) * 0.006 + sin(uv.y * 6.0 - t * 1.5) * 0.003;
            specular = (0.5 + 0.5 * cos(windPhase)) * 0.30;

          } else if (anim < 2.5) {
            // 2: ES (Spain - Flamenco silk)
            flutter = sin(windPhase + uv.y * 4.0) * 0.007;
            specular = (0.5 + 0.5 * sin(windPhase)) * 0.32;

          } else if (anim < 3.5) {
            // 3: DE (CH + DE split - Cross-ribbon)
            flutter = cos(windPhase * 1.2) * 0.005 + sin(uv.y * 5.0 - t * 1.6) * 0.003;
            specular = (0.5 + 0.5 * sin(windPhase)) * 0.25;

          } else if (anim < 4.5) {
            // 4: HRK (DE + BR split - Harmonic wave)
            flutter = sin(windPhase * 1.4) * 0.006;
            specular = (0.5 + 0.5 * sin(windPhase)) * 0.28;

          } else if (anim < 5.5) {
            // 5: CAS (AR + UY split - Sol de Mayo rays)
            flutter = sin(windPhase * 1.2) * 0.005 + cos(uv.y * 6.0 - t * 2.0) * 0.003;
            specular = (0.5 + 0.5 * cos(windPhase)) * 0.35;

          } else if (anim < 6.5) {
            // 6: RIV (UY + BR split - River reflection)
            flutter = sin(windPhase * 1.3) * 0.007;
            specular = (0.5 + 0.5 * sin(windPhase)) * 0.30;

          } else if (anim < 7.5) {
            // 7: GN (Paraguay - Horizontal surge)
            flutter = cos(windPhase * 1.1) * 0.006;
            specular = (0.5 + 0.5 * sin(windPhase)) * 0.28;

          } else if (anim < 8.5) {
            // 8: IT (Italy - Mediterranean silk)
            flutter = sin(windPhase * 1.2) * 0.006 + sin(uv.y * 5.0 - t * 1.5) * 0.003;
            specular = (0.5 + 0.5 * sin(windPhase)) * 0.30;

          } else if (anim < 9.5) {
            // 9: RU (Russia - Aurora shimmer)
            flutter = sin(windPhase * 1.1) * 0.007 + cos(uv.y * 7.0 - t * 1.8) * 0.003;
            specular = (0.5 + 0.5 * cos(windPhase)) * 0.35;

          } else if (anim < 10.5) {
            // 10: FR (France - Satin ripple)
            flutter = sin(windPhase * 1.3) * 0.006;
            specular = (0.5 + 0.5 * sin(windPhase)) * 0.28;

          } else {
            // 11: TLN (IT + BR split - Venetian pulse)
            flutter = sin(windPhase * 1.2) * 0.006 + cos(uv.y * 6.0 - t * 1.9) * 0.003;
            specular = (0.5 + 0.5 * sin(windPhase)) * 0.30;
          }

          uvWarp.y += (baseWave * windAmp) + (flutter * windAmp);
          uvWarp.x += cos(windPhase) * (windAmp * 0.35);

          vec4 col = vec4(0.0);

          if (u_is_split > 0.5) {
            // Split flag: left half is tex1, right half is tex2
            if (uvWarp.x < 0.5) {
              vec2 uv1 = vec2(uvWarp.x * 2.0, uvWarp.y);
              uv1 = clamp(uv1, 0.005, 0.995);
              col = texture2D(u_tex1, uv1);
            } else {
              vec2 uv2 = vec2((uvWarp.x - 0.5) * 2.0, uvWarp.y);
              uv2 = clamp(uv2, 0.005, 0.995);
              col = texture2D(u_tex2, uv2);
            }

            // Thin dividing line
            float lineDist = abs(uv.x - 0.5);
            float lineEdge = 1.0 - smoothstep(0.0, 0.015, lineDist);
            col = mix(col, vec4(0.1, 0.1, 0.1, 1.0), lineEdge * 0.4);

          } else {
            vec2 uvSingle = clamp(uvWarp, 0.005, 0.995);
            col = texture2D(u_tex1, uvSingle);
          }

          // Apply gentle specular sheen and hover lighting
          col.rgb += vec3(specular * (0.4 + 0.6 * h));

          // Soft rounded corner masking
          vec2 pixel = v_uv * u_resolution;
          vec2 cornerRadius = vec2(3.0, 3.0);
          vec2 dCorner = max(abs(pixel - u_resolution * 0.5) - (u_resolution * 0.5 - cornerRadius), 0.0);
          float cornerDist = length(dCorner);
          float alpha = 1.0 - smoothstep(cornerRadius.x - 1.0, cornerRadius.x, cornerDist);

          gl_FragColor = vec4(col.rgb * (col.a * alpha), col.a * alpha);
        }
      `

      const vs = gl.createShader(gl.VERTEX_SHADER)

      gl.shaderSource(vs, vsSource)

      gl.compileShader(vs)

      if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        console.warn('FlagWebGL VS error:', gl.getShaderInfoLog(vs))
        return
      }

      const fs = gl.createShader(gl.FRAGMENT_SHADER)

      gl.shaderSource(fs, fsSource)

      gl.compileShader(fs)

      if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        console.warn('FlagWebGL FS error:', gl.getShaderInfoLog(fs))
        return
      }

      const program = gl.createProgram()

      gl.attachShader(program, vs)

      gl.attachShader(program, fs)

      gl.linkProgram(program)

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn('FlagWebGL Link error:', gl.getProgramInfoLog(program))
        return
      }

      const quadBuffer = gl.createBuffer()

      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)

      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
      )

      this.gl = gl

      this.program = program

      this.quadBuffer = quadBuffer

      this.uResolution = gl.getUniformLocation(program, 'u_resolution')

      this.uTime = gl.getUniformLocation(program, 'u_time')

      this.uHover = gl.getUniformLocation(program, 'u_hover')

      this.uAnimType = gl.getUniformLocation(program, 'u_anim_type')

      this.uIsSplit = gl.getUniformLocation(program, 'u_is_split')

      this.uTex1 = gl.getUniformLocation(program, 'u_tex1')

      this.uTex2 = gl.getUniformLocation(program, 'u_tex2')

      this.aPos = gl.getAttribLocation(program, 'a_pos')

      gl.enable(gl.BLEND)

      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

      this.useWebGL = true
    } catch (e) {
      console.warn('FlagWebGL fallback:', e)
      this.useWebGL = false
    }
  }

  bindEvents() {
    this.onMouseEnter = () => {
      this.setHover(true)
    }

    this.onMouseLeave = () => {
      this.setHover(false)
    }

    const target = this.canvas.parentElement || this.canvas

    this.boundTarget = target

    target.addEventListener(EVENTS.MOUSEENTER, this.onMouseEnter)

    target.addEventListener(EVENTS.MOUSELEAVE, this.onMouseLeave)
  }

  setHover(hovered) {
    this.isHovered = Boolean(hovered)
  }

  /**
   * Called when the reduced-motion preference changes.
   * Restarts the animation loop if motion is now allowed.
   */
  setReducedMotion(isReduced) {
    if (!isReduced && !this.animId) {
      this.animate()
    }
  }

  animate() {
    if (store.getters.getReducedMotion()) {
      if (this.animId) {
        cancelAnimationFrame(this.animId)
        this.animId = null
      }
      return
    }

    this.animId = requestAnimationFrame(() => this.animate())

    const now = performance.now()

    const targetH = this.isHovered ? 1.0 : 0.0

    this.hoverLevel += (targetH - this.hoverLevel) * 0.12

    if (this.useWebGL && this.gl && this.isLoaded) {
      this._renderWebGL(now)
    }
  }

  _renderWebGL(now) {
    const gl = this.gl

    gl.viewport(0, 0, this.canvas.width, this.canvas.height)

    gl.clearColor(0.0, 0.0, 0.0, 0.0)

    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(this.program)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer)

    gl.enableVertexAttribArray(this.aPos)

    gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0)

    gl.uniform2f(this.uResolution, this.canvas.width, this.canvas.height)

    gl.uniform1f(this.uTime, (now - this.startTime) * 0.001)

    gl.uniform1f(this.uHover, this.hoverLevel)

    gl.uniform1f(this.uAnimType, this._getAnimType())

    gl.uniform1f(this.uIsSplit, this.lang.cc2 ? 1.0 : 0.0)

    if (this.tex1) {
      gl.activeTexture(gl.TEXTURE0)

      gl.bindTexture(gl.TEXTURE_2D, this.tex1)

      gl.uniform1i(this.uTex1, 0)
    }

    if (this.tex2) {
      gl.activeTexture(gl.TEXTURE1)

      gl.bindTexture(gl.TEXTURE_2D, this.tex2)

      gl.uniform1i(this.uTex2, 1)
    }

    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId)

      this.animId = null
    }

    this.boundTarget?.removeEventListener(EVENTS.MOUSEENTER, this.onMouseEnter)

    this.boundTarget?.removeEventListener(EVENTS.MOUSELEAVE, this.onMouseLeave)

    if (this.gl) {
      if (this.tex1) this.gl.deleteTexture(this.tex1)

      if (this.tex2) this.gl.deleteTexture(this.tex2)

      if (this.quadBuffer) this.gl.deleteBuffer(this.quadBuffer)

      if (this.program) this.gl.deleteProgram(this.program)

      const loseExt = this.gl.getExtension('WEBGL_lose_context')

      if (loseExt) loseExt.loseContext()
    }
  }
}
