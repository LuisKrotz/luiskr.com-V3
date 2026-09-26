import { EVENTS, STRINGS } from '../../core/constants.js'

/**
 * Animated Sci-Fi WebGL Range Slider for Earth Playground
 * Renders an active energy beam with animated light pulses across the active track,
 * a glowing holographic cyan knob with concentric rings, and an interactive particle ripple.
 * Features a seamless Canvas 2D fallback.
 */
export class RangeSliderWebGL {
  constructor(canvas, initialValue = 0, min = 0, max = 1, step = 0.01, onChange = null) {
    this.canvas = canvas

    this.min = Number(min)

    this.max = Number(max)

    this.step = Number(step)

    this.onChange = onChange

    this.currentValue = Number(initialValue)

    this.width = 160

    this.height = 20

    this.targetP = this._valToP(this.currentValue)

    this.currentP = this.targetP

    this.isDragging = false

    this.useWebGL = false

    this.animId = null

    this.startTime = performance.now()

    this.rippleTime = -10.0

    this.init()
  }

  _valToP(val) {
    if (this.max === this.min) return 0.0

    return Math.max(0.0, Math.min(1.0, (val - this.min) / (this.max - this.min)))
  }

  _pToVal(p) {
    const raw = this.min + p * (this.max - this.min)

    if (this.step <= 0) return raw

    const inv = 1 / this.step

    return Math.round(raw * inv) / inv
  }

  init() {
    if (!this.canvas || typeof this.canvas.getContext !== STRINGS.FUNCTION) {
      this._triggerFallback()

      return
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const rect = this.canvas.getBoundingClientRect()

    if (rect.width > 0) {
      this.width = rect.width
    }

    this.canvas.width = Math.round(this.width * dpr)

    this.canvas.height = Math.round(this.height * dpr)

    try {
      const gl = this.canvas.getContext('webgl', {
        alpha: true,
        antialias: true,
        depth: false,
        stencil: false,
        powerPreference: 'low-power',
      })

      if (gl) {
        this.gl = gl

        this._initWebGL()
      } else {
        this._triggerFallback()
      }
    } catch {
      this._triggerFallback()
    }

    this._bindPointer()

    this._startLoop()
  }

  _triggerFallback() {
    this.useWebGL = false

    this.ctx = this.canvas?.getContext?.('2d')
  }

  _initWebGL() {
    const gl = this.gl

    const vsSource = `
      attribute vec2 a_pos;
      varying vec2 v_uv;
      void main() {
        v_uv = a_pos * 0.5 + 0.5;
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `

    const fsSource = `
      precision mediump float;
      varying vec2 v_uv;
      uniform float u_time;
      uniform float u_p;
      uniform float u_ripple;

      void main() {
        vec2 uv = v_uv;
        float trackY = 0.5;
        float trackH = 0.22;
        float dy = abs(uv.y - trackY);

        // Rounded track capsule
        float trackMask = smoothstep(trackH, trackH - 0.06, dy);

        // Inactive background track
        vec3 colBg = vec3(0.18, 0.20, 0.24);

        // Active energy beam with animated light pulses
        float pulse = sin(uv.x * 24.0 - u_time * 4.0) * 0.5 + 0.5;
        vec3 colBeam = mix(vec3(0.20, 0.75, 0.90), vec3(0.40, 0.98, 0.94), pulse);

        float fillMask = step(uv.x, u_p);
        vec3 trackColor = mix(colBg, colBeam, fillMask);

        // Holographic knob orb at u_p
        float knobDist = distance(vec2(uv.x * 8.0, uv.y), vec2(u_p * 8.0, trackY));
        float knobGlow = 0.06 / (knobDist + 0.05);
        float knobCore = smoothstep(0.42, 0.35, knobDist);

        // Interactive ripple expansion
        float rAge = u_time - u_ripple;
        float rRing = 0.0;
        if (rAge >= 0.0 && rAge < 1.0) {
          float rDist = abs(knobDist - rAge * 1.5);
          rRing = smoothstep(0.15, 0.0, rDist) * (1.0 - rAge);
        }

        vec3 finalColor = trackColor * trackMask + colBeam * (knobGlow + knobCore + rRing);
        float finalAlpha = max(trackMask * 0.85, smoothstep(0.5, 0.2, knobDist));

        gl_FragColor = vec4(finalColor, finalAlpha);
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

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      this._triggerFallback()

      return
    }

    this.program = prog

    this.aPos = gl.getAttribLocation(prog, 'a_pos')
    this.uTime = gl.getUniformLocation(prog, 'u_time')
    this.uP = gl.getUniformLocation(prog, 'u_p')
    this.uRipple = gl.getUniformLocation(prog, 'u_ripple')

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1, -1,  1,
      -1,  1,  1, -1,  1,  1,
    ]), gl.STATIC_DRAW)

    this.quadBuffer = buf
    this.useWebGL = true
  }

  _bindPointer() {
    const handleMove = (clientX) => {
      const rect = this.canvas.getBoundingClientRect()

      const p = Math.max(0.0, Math.min(1.0, (clientX - rect.left) / rect.width))

      this.targetP = p

      const val = this._pToVal(p)

      this.currentValue = val

      if (this.onChange) this.onChange(val)
    }

    this.canvas.addEventListener(EVENTS.POINTERDOWN, (e) => {
      this.isDragging = true

      this.rippleTime = (performance.now() - this.startTime) / 1000

      this.canvas.setPointerCapture?.(e.pointerId)

      handleMove(e.clientX)
    })

    this.canvas.addEventListener(EVENTS.POINTERMOVE, (e) => {
      if (this.isDragging) handleMove(e.clientX)
    })

    const endDrag = (e) => {
      if (this.isDragging) {
        this.isDragging = false

        this.canvas.releasePointerCapture?.(e.pointerId)
      }
    }

    this.canvas.addEventListener(EVENTS.POINTERUP, endDrag)
    this.canvas.addEventListener(EVENTS.POINTERCANCEL, endDrag)
  }

  setValue(val) {
    this.currentValue = Number(val)

    this.targetP = this._valToP(this.currentValue)
  }

  _startLoop() {
    const tick = () => {
      this.animId = requestAnimationFrame(tick)

      this._render()
    }

    this.animId = requestAnimationFrame(tick)
  }

  _render() {
    this.currentP += (this.targetP - this.currentP) * 0.25

    const time = (performance.now() - this.startTime) / 1000

    const rect = this.canvas.getBoundingClientRect()

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    if (rect.width > 0 && Math.abs(this.canvas.width - Math.round(rect.width * dpr)) > 2) {
      this.width = rect.width

      this.canvas.width = Math.round(rect.width * dpr)
    }

    if (this.useWebGL && this.gl && this.program) {
      const gl = this.gl

      gl.viewport(0, 0, this.canvas.width, this.canvas.height)

      gl.clearColor(0, 0, 0, 0)

      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.useProgram(this.program)

      gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer)

      gl.enableVertexAttribArray(this.aPos)

      gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0)

      gl.uniform1f(this.uTime, time)

      gl.uniform1f(this.uP, this.currentP)

      gl.uniform1f(this.uRipple, this.rippleTime)

      gl.drawArrays(gl.TRIANGLES, 0, 6)
    } else if (this.ctx) {
      const ctx = this.ctx

      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      const h = this.canvas.height

      const w = this.canvas.width

      const cy = h * 0.5

      const trkH = h * 0.3

      // Background track
      ctx.fillStyle = 'rgba(255, 255, 255, 0.18)'

      ctx.beginPath()

      ctx.roundRect ? ctx.roundRect(0, cy - trkH * 0.5, w, trkH, trkH * 0.5) : ctx.rect(0, cy - trkH * 0.5, w, trkH)

      ctx.fill()

      // Active track
      const activeW = Math.max(0, Math.min(w, w * this.currentP))

      const grad = ctx.createLinearGradient(0, 0, activeW, 0)

      grad.addColorStop(0, '#00d2ff')

      grad.addColorStop(1, '#66fcf1')

      ctx.fillStyle = grad

      ctx.beginPath()

      ctx.roundRect ? ctx.roundRect(0, cy - trkH * 0.5, activeW, trkH, trkH * 0.5) : ctx.rect(0, cy - trkH * 0.5, activeW, trkH)

      ctx.fill()

      // Thumb
      const kx = activeW

      ctx.fillStyle = '#66fcf1'

      ctx.shadowColor = '#66fcf1'

      ctx.shadowBlur = 10

      ctx.beginPath()

      ctx.arc(kx, cy, h * 0.45, 0, Math.PI * 2)

      ctx.fill()

      ctx.shadowBlur = 0
    }
  }

  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId)

      this.animId = null
    }

    if (this.gl && this.quadBuffer) {
      this.gl.deleteBuffer(this.quadBuffer)

      this.gl.deleteProgram(this.program)
    }
  }
}
