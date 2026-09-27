import { CLASSES, STRINGS } from '../../core/constants.js'

/**
 * WebGL animated hamburger icon for the mobile burger button.
 * Renders three sleek horizontal lines with rounded pill caps and subtle wave animation.
 * Adapts to the current theme: dark icon in light mode, bright icon in dark mode.
 */
export class BurgerButtonWebGL {
  constructor(canvas, onClick) {
    this.canvas = canvas
    this.gl = null
    this.program = null
    this.quadBuffer = null
    this.animId = null
    this.startTime = performance.now()
    this.uTime = null
    this.uResolution = null
    this.uDark = null
    this._onClick = onClick

    this._initGL()

    if (onClick) {
      canvas.style.cursor = 'pointer'

      canvas.addEventListener('click', onClick)
    }

    this._start()
  }

  _initGL() {
    if (!this.canvas) return

    const gl = this.canvas.getContext('webgl', { alpha: true, antialias: true, preserveDrawingBuffer: false })

    if (!gl) return

    this.gl = gl

    const vs = gl.createShader(gl.VERTEX_SHADER)

    gl.shaderSource(vs, `attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0.,1.);}`)

    gl.compileShader(vs)

    const fs = gl.createShader(gl.FRAGMENT_SHADER)

    gl.shaderSource(fs, `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_res;
      uniform float u_dark;

      float sdCapsule(vec2 p, vec2 a, vec2 b, float r) {
        vec2 pa = p - a, ba = b - a;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
        return length(pa - ba * h) - r;
      }

      float sdHBar(vec2 p, float y, float w, float h) {
        float r = h * 0.5;
        float halfL = max(w * 0.5 - r, 0.0);
        return sdCapsule(p, vec2(0.5 - halfL, y), vec2(0.5 + halfL, y), r);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res;
        float t = u_time;

        // Three sleek horizontal bars with rounded caps
        float barW = 0.54;
        float barH = 0.038;
        float gap = 0.16;

        // Subtle fluid wave on each bar
        float wave1 = sin(t * 2.5) * 0.008;
        float wave2 = sin(t * 2.5 + 1.2) * 0.008;
        float wave3 = sin(t * 2.5 + 2.4) * 0.008;

        float d1 = sdHBar(uv, 0.5 - gap + wave1, barW, barH);
        float d2 = sdHBar(uv, 0.5 + wave2, barW + 0.03, barH);
        float d3 = sdHBar(uv, 0.5 + gap + wave3, barW - 0.03, barH);

        float bar = min(min(d1, d2), d3);

        // Crisp rounded anti-aliased edge
        float alpha = smoothstep(0.012, 0.0, bar);

        // Glow halo
        float glow = smoothstep(0.045, 0.0, bar) * 0.22;

        // Subtle breathing pulse
        float pulse = 0.92 + 0.08 * sin(t * 1.5);

        // Color based on theme:
        // Dark theme: crisp bright white/ice
        // Light theme: dark slate/charcoal (never invisible white on light background!)
        vec3 colDark = vec3(0.95, 0.97, 1.0) * pulse;
        vec3 colLight = vec3(0.10, 0.10, 0.14) * pulse;
        vec3 col = mix(colLight, colDark, u_dark);

        // Subtle glow color
        vec3 glowDark = vec3(0.3, 0.6, 0.9);
        vec3 glowLight = vec3(0.15, 0.15, 0.22);
        vec3 glowCol = mix(glowLight, glowDark, u_dark);

        vec3 finalCol = col * alpha + glowCol * glow;
        float finalAlpha = max(alpha, glow * 0.35);

        gl_FragColor = vec4(finalCol, finalAlpha);
      }
    `)

    gl.compileShader(fs)

    this.program = gl.createProgram()

    gl.attachShader(this.program, vs)

    gl.attachShader(this.program, fs)

    gl.linkProgram(this.program)

    gl.useProgram(this.program)

    const verts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])

    this.quadBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer)

    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW)

    const aPos = gl.getAttribLocation(this.program, 'a_pos')

    gl.enableVertexAttribArray(aPos)

    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    this.uTime = gl.getUniformLocation(this.program, 'u_time')

    this.uResolution = gl.getUniformLocation(this.program, 'u_res')

    this.uDark = gl.getUniformLocation(this.program, 'u_dark')

    gl.enable(gl.BLEND)

    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  }

  _checkResize() {
    if (!this.canvas || !this.gl) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const rect = this.canvas.getBoundingClientRect()

    const w = Math.round((rect.width || 34) * dpr)

    const h = Math.round((rect.height || 34) * dpr)

    if (w > 0 && h > 0 && (this.canvas.width !== w || this.canvas.height !== h)) {
      this.canvas.width = w

      this.canvas.height = h

      this.gl.viewport(0, 0, w, h)
    }
  }

  _start() {
    this._checkResize()

    this._loop()
  }

  _loop() {
    if (!this.gl) return

    this.animId = requestAnimationFrame(() => this._loop())

    this._checkResize()

    if (this.canvas.width === 0 || this.canvas.height === 0) return

    const gl = this.gl

    const t = (performance.now() - this.startTime) / 1000

    const isDark = document.documentElement.classList.contains(CLASSES.DARK_MODE) ? 1 : 0

    gl.clearColor(0, 0, 0, 0)

    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(this.program)

    gl.uniform1f(this.uTime, t)

    gl.uniform2f(this.uResolution, this.canvas.width, this.canvas.height)

    gl.uniform1f(this.uDark, isDark)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId)

      this.animId = null
    }

    if (this._onClick && this.canvas) {
      this.canvas.removeEventListener('click', this._onClick)
    }

    if (this.gl) {
      if (this.quadBuffer) this.gl.deleteBuffer(this.quadBuffer)

      if (this.program) this.gl.deleteProgram(this.program)

      this.gl = null
    }
  }
}
