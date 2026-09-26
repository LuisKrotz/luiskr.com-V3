import { CLASSES, STRINGS, TAGS } from '../../core/constants.js'
import store from '../../core/store.js'

/**
 * Iris van Herpen–inspired fluid background.
 *
 * Renders flowing topographic contour isolines — organic, silk-like,
 * barely perceptible. Adapts to dark/light theme.
 */
export class FluidBackgroundWebGL {
  constructor(rootContainer = document.body) {
    this.rootContainer = rootContainer
    this.container = null
    this.canvas = null
    this.gl = null
    this.ctx = null
    this.program = null
    this.quadBuffer = null
    this.animId = null
    this.startTime = performance.now()
    this.uTime = null
    this.uResolution = null
    this.uDark = null
    this.useWebGL = false
    this.isActive = true
    this.width = 0
    this.height = 0
    this._onVisibility = null
    this._ro = null
    this.init()
  }

  init() {
    if (typeof window === STRINGS.UNDEFINED || typeof document === STRINGS.UNDEFINED) return

    this.container = document.createElement(TAGS.DIV)
    this.container.className = CLASSES.FLUID_BG

    this.canvas = document.createElement(TAGS.CANVAS)
    this.canvas.className = CLASSES.FLUID_BG_CANVAS

    this.container.appendChild(this.canvas)
    this.rootContainer.insertBefore(this.container, this.rootContainer.firstChild)

    this.setupContext()
    this.handleResize()

    if (typeof ResizeObserver !== STRINGS.UNDEFINED) {
      this._ro = new ResizeObserver(() => this.handleResize())
      this._ro.observe(this.container)
    }

    this._onVisibility = () => {
      if (document.hidden) {
        this.purge()
      } else {
        this.restore()
      }
    }

    document.addEventListener('visibilitychange', this._onVisibility)
    this.startLoop()
  }

  setupContext() {
    if (!this.canvas || typeof this.canvas.getContext !== STRINGS.FUNCTION) return

    // premultipliedAlpha: true (default) — browser composites canvas correctly
    const gl = this.canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
      preserveDrawingBuffer: false,
    })

    if (gl) {
      this.gl = gl
      this.useWebGL = true

      // Standard alpha blending for premultiplied-alpha canvas
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

      this.initShaders()
    } else {
      this.ctx = this.canvas.getContext('2d')
      this.useWebGL = false
    }
  }

  initShaders() {
    const gl = this.gl

    const vsSource = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `

    // Flowing sine-sum field → smooth topographic contour isolines.
    // Three orthogonal waves at different frequencies and drift speeds
    // produce the complex, organic, slowly-morphing lattice of IVH structures.
    // No texture lookups. No loops over noise. Guaranteed to compile on all GPUs.
    // Premultiplied alpha output for blendFunc(ONE, ONE_MINUS_SRC_ALPHA).
    const fsSource = `
      precision mediump float;
      uniform vec2  u_resolution;
      uniform float u_time;
      uniform float u_dark;

      // Three-wave organic field — cheap, always works, looks like woven fabric
      float field(vec2 p, float t) {
        float a = sin(p.x * 1.60 + p.y * 0.50 + t * 0.20);
        float b = sin(p.x * 0.80 - p.y * 1.30 + t * 0.15);
        float c = sin(p.x * 1.10 + p.y * 1.10 + t * 0.18);
        return (a + b + c) * 0.333;
      }

      // Smooth AA contour at given level, pw = half-width in field units
      float contour(float v, float level, float pw) {
        return 1.0 - smoothstep(0.0, pw, abs(v - level));
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        float asp = u_resolution.x / u_resolution.y;
        vec2 p = (uv - 0.5) * vec2(asp, 1.0) * 3.5;

        float f = field(p, u_time);

        // Derivative-based pixel width for resolution-independent line thickness
        float dx = field(p + vec2(1.0/u_resolution.x * asp * 3.5, 0.0), u_time) - f;
        float dy = field(p + vec2(0.0, 1.0/u_resolution.y * 3.5), u_time) - f;
        float pw = length(vec2(dx, dy)) * 1.8;
        pw = max(pw, 0.004); // minimum line width

        // 8 evenly-spaced contour lines
        float lines = 0.0;
        for (int i = 0; i < 8; i++) {
          float level = -0.85 + float(i) * 0.24;
          lines = max(lines, contour(f, level, pw));
        }

        vec3 col;
        float a;

        if (u_dark > 0.5) {
          // Dark: iridescent violet-to-teal shift across field value
          float h = f * 0.5 + 0.5; // 0-1
          col = vec3(
            0.50 + 0.40 * sin(h * 6.28 + 0.0),
            0.55 + 0.35 * sin(h * 6.28 + 2.1),
            0.72 + 0.25 * sin(h * 6.28 + 4.2)
          );
          a = lines * 0.18;
        } else {
          // Light: cool-grey tracery
          col = vec3(0.45 + 0.10 * f, 0.45 + 0.08 * f, 0.55 + 0.10 * f);
          a = lines * 0.09;
        }

        // Premultiplied output — correct for blendFunc(ONE, ONE_MINUS_SRC_ALPHA)
        gl_FragColor = vec4(col * a, a);
      }
    `

    const makeShader = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)

      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        // If shader fails, gracefully fall back to 2D canvas
        this.useWebGL = false
        this.ctx = this.canvas.getContext('2d')
      }

      return s
    }

    const prog = gl.createProgram()
    gl.attachShader(prog, makeShader(gl.VERTEX_SHADER, vsSource))
    gl.attachShader(prog, makeShader(gl.FRAGMENT_SHADER, fsSource))
    gl.linkProgram(prog)

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      this.useWebGL = false
      this.ctx = this.canvas.getContext('2d')
      return
    }

    this.program = prog

    const pos = gl.getAttribLocation(prog, 'a_pos')
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW)

    this.quadBuffer = buf
    this.uTime       = gl.getUniformLocation(prog, 'u_time')
    this.uResolution = gl.getUniformLocation(prog, 'u_resolution')
    this.uDark       = gl.getUniformLocation(prog, 'u_dark')

    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)
  }

  handleResize() {
    if (!this.canvas) return

    const dpr = Math.min((typeof window !== STRINGS.UNDEFINED ? window.devicePixelRatio : 1) || 1, 1.5)
    const w = typeof window !== STRINGS.UNDEFINED ? window.innerWidth : 800
    const h = typeof window !== STRINGS.UNDEFINED ? window.innerHeight : 600

    this.width = w
    this.height = h
    this.canvas.width  = Math.round(w * dpr)
    this.canvas.height = Math.round(h * dpr)

    if (this.gl) this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
  }

  purge() {
    this.isActive = false
    if (this.animId) {
      cancelAnimationFrame(this.animId)
      this.animId = null
    }
  }

  restore() {
    this.isActive = true
    if (!this.animId) this.startLoop()
  }

  startLoop() {
    const tick = () => {
      if (!this.isActive) return

      if (store.getters.getReducedMotion()) {
        this.renderFrame(0)
        return
      }

      const now = (performance.now() - this.startTime) * 0.001
      this.renderFrame(now)
      this.animId = requestAnimationFrame(tick)
    }

    this.animId = requestAnimationFrame(tick)
  }

  renderFrame(t) {
    const isDark =
      typeof document !== STRINGS.UNDEFINED &&
      document.documentElement.classList.contains(CLASSES.DARK_MODE)

    if (this.useWebGL && this.gl && this.program) {
      const gl = this.gl

      gl.clearColor(0.0, 0.0, 0.0, 0.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(this.program)
      gl.uniform2f(this.uResolution, this.canvas.width, this.canvas.height)
      gl.uniform1f(this.uTime, t)
      gl.uniform1f(this.uDark, isDark ? 1.0 : 0.0)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    } else if (this.ctx) {
      const ctx = this.ctx
      const w = this.canvas.width
      const h = this.canvas.height

      ctx.clearRect(0, 0, w, h)

      const grad = ctx.createRadialGradient(w * 0.5, h * 0.4, w * 0.05, w * 0.5, h * 0.4, w * 0.5)

      if (isDark) {
        grad.addColorStop(0, 'rgba(80, 60, 120, 0.08)')
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      } else {
        grad.addColorStop(0, 'rgba(150, 150, 180, 0.05)')
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
      }

      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)
    }
  }

  destroy() {
    this.purge()

    if (this._onVisibility && typeof document !== STRINGS.UNDEFINED) {
      document.removeEventListener('visibilitychange', this._onVisibility)
      this._onVisibility = null
    }

    if (this._ro) {
      this._ro.disconnect()
      this._ro = null
    }

    if (this.gl && this.quadBuffer) {
      this.gl.deleteBuffer(this.quadBuffer)
      this.gl.deleteProgram(this.program)
    }

    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
      this.container = null
    }
  }
}
