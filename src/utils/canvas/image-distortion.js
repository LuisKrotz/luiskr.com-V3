import { CLASSES, STRINGS, TAGS } from '../../core/constants.js'
import store from '../../core/store.js'

/**
 * WebGL Liquid Wave & Glitch Image Distortion Shader
 *
 * Implements an interactive liquid displacement, wave propagation, and chromatic
 * dispersion shader on project thumbnail images during hover.
 * Adheres strictly to the Pool & Purge pattern: textures and loops are freed when idle.
 */
export class ImageDistortionWebGL {
  constructor(containerEl, imgEl) {
    this.container = containerEl

    this.img = imgEl

    this.canvas = null

    this.gl = null

    this.program = null

    this.texture = null

    this.quadBuffer = null

    this.animId = null

    this.progress = 0

    this.targetProgress = 0

    this.mouseX = 0.5

    this.mouseY = 0.5

    this.startTime = performance.now()

    this.isHovered = false

    this.boundOnMouseEnter = this.onMouseEnter.bind(this)

    this.boundOnMouseMove = this.onMouseMove.bind(this)

    this.boundOnMouseLeave = this.onMouseLeave.bind(this)

    this.initEvents()
  }

  initEvents() {
    if (!this.container) return

    this.container.addEventListener('mouseenter', this.boundOnMouseEnter, { passive: true })

    this.container.addEventListener('mousemove', this.boundOnMouseMove, { passive: true })

    this.container.addEventListener('mouseleave', this.boundOnMouseLeave, { passive: true })
  }

  onMouseEnter(e) {
    if (store.getters.getReducedMotion()) return

    this.isHovered = true

    this.targetProgress = 1.0

    this.updateMousePos(e)

    if (!this.canvas) {
      this.setupCanvas()
    }

    if (!this.animId) {
      this.startLoop()
    }
  }

  onMouseMove(e) {
    if (!this.isHovered) return

    this.updateMousePos(e)
  }

  updateMousePos(e) {
    const rect = this.container.getBoundingClientRect()

    if (rect.width > 0 && rect.height > 0) {
      this.mouseX = (e.clientX - rect.left) / rect.width

      this.mouseY = 1.0 - (e.clientY - rect.top) / rect.height
    }
  }

  onMouseLeave() {
    this.isHovered = false

    this.targetProgress = 0.0
  }

  setupCanvas() {
    if (typeof document === STRINGS.UNDEFINED || !this.img?.complete) return

    const canvas = document.createElement(TAGS.CANVAS)

    canvas.className = CLASSES.IMAGE_DISTORT_CANVAS

    canvas.style.position = 'absolute'

    canvas.style.top = '0'

    canvas.style.left = '0'

    canvas.style.width = '100%'

    canvas.style.height = '100%'

    canvas.style.pointerEvents = 'none'

    canvas.style.zIndex = '2'

    this.container.appendChild(canvas)

    this.canvas = canvas

    const rect = this.container.getBoundingClientRect()

    const dpr = Math.min((typeof window !== STRINGS.UNDEFINED ? window.devicePixelRatio : 1) || 1, 2)

    canvas.width = Math.round(rect.width * dpr)

    canvas.height = Math.round(rect.height * dpr)

    if (!canvas || typeof canvas.getContext !== STRINGS.FUNCTION) return

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
      preserveDrawingBuffer: false,
    })

    if (!gl) return

    this.gl = gl

    this.initShaders()

    this.uploadTexture()
  }

  initShaders() {
    const gl = this.gl

    const vsSource = `
      attribute vec2 a_pos;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_pos + 1.0) * 0.5;
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `

    const fsSource = `
      precision mediump float;
      varying vec2 v_uv;
      uniform sampler2D u_tex;
      uniform vec2 u_mouse;
      uniform float u_time;
      uniform float u_progress;

      void main() {
        vec2 uv = v_uv;

        // Interactive liquid wave ripples
        float dist = distance(uv, u_mouse);
        float wave = sin(dist * 24.0 - u_time * 6.5) * exp(-dist * 4.0);
        vec2 disp = normalize(uv - u_mouse + 0.0001) * wave * 0.035 * u_progress;

        // Technical scanline pulse
        float scan = step(0.97, sin(uv.y * 120.0 + u_time * 16.0)) * 0.008 * u_progress;
        disp.x += scan;

        // Chromatic dispersion
        vec2 rUv = clamp(uv + disp + vec2(0.005 * u_progress, 0.0), 0.0, 1.0);
        vec2 gUv = clamp(uv + disp, 0.0, 1.0);
        vec2 bUv = clamp(uv + disp - vec2(0.005 * u_progress, 0.0), 0.0, 1.0);

        float r = texture2D(u_tex, rUv).r;
        float g = texture2D(u_tex, gUv).g;
        float b = texture2D(u_tex, bUv).b;

        gl_FragColor = vec4(r, g, b, u_progress);
      }
    `

    const vs = gl.createShader(gl.VERTEX_SHADER)

    gl.shaderSource(vs, vsSource)

    gl.compileShader(vs)

    const fs = gl.createShader(gl.FRAGMENT_SHADER)

    gl.shaderSource(fs, fsSource)

    gl.compileShader(fs)

    const prog = gl.createProgram()

    gl.attachShader(prog, vs)

    gl.attachShader(prog, fs)

    gl.linkProgram(prog)

    this.program = prog

    const pos = gl.getAttribLocation(prog, 'a_pos')

    const buf = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, buf)

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    )

    this.quadBuffer = buf

    this.uTex = gl.getUniformLocation(prog, 'u_tex')

    this.uMouse = gl.getUniformLocation(prog, 'u_mouse')

    this.uTime = gl.getUniformLocation(prog, 'u_time')

    this.uProgress = gl.getUniformLocation(prog, 'u_progress')

    gl.enableVertexAttribArray(pos)

    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)
  }

  uploadTexture() {
    const gl = this.gl

    if (!gl || !this.img?.complete) return

    const tex = gl.createTexture()

    gl.bindTexture(gl.TEXTURE_2D, tex)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img)

      this.texture = tex
    } catch {
      this.purge()
    }
  }

  startLoop() {
    const tick = () => {
      this.progress += (this.targetProgress - this.progress) * 0.18

      if (this.gl && this.program && this.texture) {
        const gl = this.gl

        gl.useProgram(this.program)

        gl.uniform2f(this.uMouse, this.mouseX, this.mouseY)

        const now = (performance.now() - this.startTime) * 0.001

        gl.uniform1f(this.uTime, now)

        gl.uniform1f(this.uProgress, this.progress)

        gl.activeTexture(gl.TEXTURE0)

        gl.bindTexture(gl.TEXTURE_2D, this.texture)

        gl.uniform1i(this.uTex, 0)

        gl.drawArrays(gl.TRIANGLES, 0, 6)
      }

      if (this.progress > 0.005) {
        this.animId = requestAnimationFrame(tick)
      } else {
        this.animId = null

        this.purge()
      }
    }

    this.animId = requestAnimationFrame(tick)
  }

  purge() {
    if (this.animId) {
      cancelAnimationFrame(this.animId)

      this.animId = null
    }

    if (this.gl && this.texture) {
      this.gl.deleteTexture(this.texture)

      this.texture = null
    }

    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas)

      this.canvas = null
    }
  }

  destroy() {
    this.purge()

    this.container?.removeEventListener('mouseenter', this.boundOnMouseEnter)

    this.container?.removeEventListener('mousemove', this.boundOnMouseMove)

    this.container?.removeEventListener('mouseleave', this.boundOnMouseLeave)

    if (this.gl && this.quadBuffer) {
      this.gl.deleteBuffer(this.quadBuffer)

      this.gl.deleteProgram(this.program)
    }
  }
}
