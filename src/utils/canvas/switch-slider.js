import { EVENTS, STRINGS } from '../../core/constants.js'
import store from '../../core/store.js'

/**
 * Contextual WebGL Switch Slider for Developer Tools
 * Renders custom animated graphical draw elements referent to each toggle's context:
 * - 'stats': Live ECG oscilloscope waveform + pulsing chip matrix (Stats for Nerds)
 * - 'grid': Glowing blueprint column grid lines + scanning crosshairs (Show Grid)
 * - 'motion': Subtle ambient drift (OFF) vs calm still horizon datum (ON) (Reduced Motion)
 * All switches share an identical solid centered knob indicator dot.
 */
export class SwitchWebGL {
  constructor(canvas, contextType = 'stats', initialActive = false, onToggle = null) {
    this.canvas = canvas

    this.contextType = contextType // 'stats' | 'grid' | 'motion'

    this.onToggle = onToggle

    this.isActive = Boolean(initialActive)

    this.width = 54

    this.height = 28

    this.targetP = this.isActive ? 1.0 : 0.0

    this.currentP = this.targetP

    this.knobX = this._pToKnobX(this.currentP)

    this.useWebGL = false

    this.animId = null

    this.startTime = performance.now()

    this.init()
  }

  _pToKnobX(p) {
    const minX = 14.0

    const maxX = this.width - 14.0

    return minX + (maxX - minX) * p
  }

  _contextCode() {
    if (this.contextType === 'grid' || this.contextType === 'cyan' || this.contextType === 'space') return 1.0

    if (this.contextType === 'motion') return 2.0

    return 0.0 // stats
  }

  init() {
    if (!this.canvas || typeof this.canvas.getContext !== STRINGS.FUNCTION) {
      this._triggerFallback()

      return
    }

    const dpr = Math.min(Math.max((typeof window !== STRINGS.UNDEFINED ? window.devicePixelRatio : 1) || 1, 2), 3)

    this.dpr = dpr

    this.canvas.width = Math.round(this.width * dpr)

    this.canvas.height = Math.round(this.height * dpr)

    this.canvas.style.width = `${this.width}px`

    this.canvas.style.height = `${this.height}px`

    this.initWebGL()

    if (!this.useWebGL) {
      try {
        this.ctx = this.canvas.getContext('2d')
      } catch {
        this._triggerFallback()

        return
      }

      if (!this.ctx) {
        this._triggerFallback()

        return
      }
    }

    this.bindEvents()

    this.animate()
  }

  _triggerFallback() {
    if (this.animId) cancelAnimationFrame(this.animId)

    this.canvas.style.display = 'none'

    this.canvas.classList.add('is-fallback')
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
          gl_Position = vec4(a_pos, 0.0, 1.0);
        }
      `

      const fsSource = `
        precision mediump float;
        varying vec2 v_uv;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform float u_progress;
        uniform float u_knob_x;
        uniform float u_context; // 0=stats, 1=grid, 2=motion

        float distCapsule(vec2 p, vec2 a, vec2 b) {
          vec2 pa = p - a;
          vec2 ba = b - a;
          float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
          return length(pa - ba * h);
        }

        void main() {
          vec2 pixel = v_uv * u_resolution;
          vec2 centerA = vec2(14.0, 14.0);
          vec2 centerB = vec2(u_resolution.x - 14.0, 14.0);
          float trackDist = distCapsule(pixel, centerA, centerB);

          if (trackDist > 14.0) {
            discard;
          }

          float borderAA = 1.0 - smoothstep(13.2, 14.0, trackDist);

          // Base track background
          vec3 offTrack = vec3(0.18, 0.19, 0.22);
          vec3 onTrack;

          if (u_context < 0.5) {
            // Stats: Emerald green
            onTrack = vec3(0.08, 0.58, 0.36);
          } else if (u_context < 1.5) {
            // Grid: Cyan blueprint
            onTrack = vec3(0.06, 0.48, 0.72);
          } else {
            // Motion: Violet / magenta
            onTrack = vec3(0.48, 0.24, 0.68);
          }

          vec3 col = mix(offTrack, onTrack, u_progress);

          // Contextual Graphical Draw Elements
          if (u_context < 0.5) {
            // ── 0: STATS (Live ECG Oscilloscope / Pulse Wave) ──
            float waveX = pixel.x + u_time * 20.0;
            float pulse = sin(waveX * 0.35) * 2.5;

            // Heartbeat peak spike
            float spikePhase = mod(waveX, 36.0);
            if (spikePhase > 12.0 && spikePhase < 18.0) {
              pulse += (spikePhase - 15.0) * -2.8;
            }

            float waveY = 14.0 + pulse * (0.3 + 0.7 * u_progress);
            float dWave = abs(pixel.y - waveY);
            float waveGlow = 1.0 - smoothstep(0.0, 1.6, dWave);
            vec3 waveCol = mix(vec3(0.35, 0.40, 0.45), vec3(0.45, 1.0, 0.65), u_progress);
            col += waveCol * waveGlow * 0.85;

          } else if (u_context < 1.5) {
            // ── 1: GRID (Blueprint Column Grid Lines) ──
            float gridX = mod(pixel.x + u_time * 3.0, 8.0);
            float gridY = mod(pixel.y, 7.0);
            float isLineX = 1.0 - smoothstep(0.0, 1.0, abs(gridX - 4.0));
            float isLineY = 1.0 - smoothstep(0.0, 1.0, abs(gridY - 3.5));
            float gridPattern = clamp(isLineX + isLineY, 0.0, 1.0);
            vec3 gridCol = mix(vec3(0.30, 0.35, 0.42), vec3(0.50, 0.85, 1.0), u_progress);
            col += gridCol * gridPattern * (0.25 + 0.55 * u_progress);

          } else {
            // ── 2: MOTION (Subtle Ambient Drift vs Calm Still Horizon) ──
            if (u_progress < 0.5) {
              // Full Motion (OFF): Soft, slow, subtle horizontal wind drift (speed 6.0)
              float streakY = mod(pixel.y, 7.0);
              float streakMove = mod(pixel.x - u_time * 6.0, 20.0);
              float lineY = 1.0 - smoothstep(0.0, 1.2, abs(streakY - 3.5));
              float lineFade = 1.0 - smoothstep(0.0, 12.0, streakMove);
              col += vec3(0.85, 0.70, 1.0) * lineY * lineFade * 0.45;
            } else {
              // Reduced Motion (ON): Calm, perfectly still horizontal centerline datum
              float lineY = 1.0 - smoothstep(0.0, 1.2, abs(pixel.y - 14.0));
              col += vec3(0.95, 0.85, 1.0) * lineY * 0.60;
            }
          }

          // Inset Track Border Bezel (antialiased)
          float bezel = smoothstep(11.5, 14.0, trackDist);
          col = mix(col, vec3(0.0, 0.0, 0.0), bezel * 0.35);

          // 3D Knob with smooth anti-aliased shading
          vec2 knobCenter = vec2(u_knob_x, 14.0);
          float knobDist = length(pixel - knobCenter);
          float knobRadius = 11.0;

          // Knob drop shadow
          float kShadow = (1.0 - smoothstep(knobRadius, knobRadius + 2.5, knobDist)) * 0.35;
          col = mix(col, vec3(0.0, 0.0, 0.0), kShadow);

          // 3D sphere gradient lighting
          float kSphere = 1.0 - clamp(knobDist / knobRadius, 0.0, 1.0) * 0.15;
          vec3 knobColor = vec3(0.98, 0.98, 1.0) * kSphere;

          // Unified solid dot (radius 2.5) with smoothstep anti-aliasing
          float dDot = length(pixel - knobCenter);
          float dotLight = 1.0 - smoothstep(2.0, 2.7, dDot);

          vec3 dotCol;
          if (u_context < 0.5) {
            dotCol = mix(vec3(0.6, 0.65, 0.7), vec3(0.1, 0.85, 0.45), u_progress);
          } else if (u_context < 1.5) {
            dotCol = mix(vec3(0.6, 0.65, 0.7), vec3(0.1, 0.65, 0.95), u_progress);
          } else {
            dotCol = mix(vec3(0.6, 0.65, 0.7), vec3(0.65, 0.4, 0.95), u_progress);
          }

          knobColor = mix(knobColor, dotCol, dotLight);

          // Ultra-smooth knob edge anti-aliasing (smoothstep across 1.0 pixel boundary)
          float knobAA = 1.0 - smoothstep(knobRadius - 0.6, knobRadius + 0.4, knobDist);
          col = mix(col, knobColor, knobAA);

          gl_FragColor = vec4(col * borderAA, borderAA);
        }
      `

      const vs = gl.createShader(gl.VERTEX_SHADER)

      gl.shaderSource(vs, vsSource)

      gl.compileShader(vs)

      if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        console.warn('SwitchWebGL VS error:', gl.getShaderInfoLog(vs))
        return
      }

      const fs = gl.createShader(gl.FRAGMENT_SHADER)

      gl.shaderSource(fs, fsSource)

      gl.compileShader(fs)

      if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        console.warn('SwitchWebGL FS error:', gl.getShaderInfoLog(fs))
        return
      }

      const program = gl.createProgram()

      gl.attachShader(program, vs)

      gl.attachShader(program, fs)

      gl.linkProgram(program)

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn('SwitchWebGL Program link error:', gl.getProgramInfoLog(program))
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

      this.uProgress = gl.getUniformLocation(program, 'u_progress')

      this.uKnobX = gl.getUniformLocation(program, 'u_knob_x')

      this.uContext = gl.getUniformLocation(program, 'u_context')

      this.aPos = gl.getAttribLocation(program, 'a_pos')

      gl.enable(gl.BLEND)

      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

      this.useWebGL = true
    } catch (e) {
      console.warn('SwitchWebGL fallback:', e)
      this.useWebGL = false
    }
  }

  bindEvents() {
    this.onClick = () => {
      this.toggle()
    }

    this.canvas.addEventListener(EVENTS.CLICK, this.onClick)
  }

  toggle() {
    this.isActive = !this.isActive

    this.targetP = this.isActive ? 1.0 : 0.0

    this.onToggle?.(this.isActive)
  }

  setActive(active) {
    this.isActive = Boolean(active)

    this.targetP = this.isActive ? 1.0 : 0.0
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

    const diff = this.targetP - this.currentP

    this.currentP += diff * 0.18

    this.knobX = this._pToKnobX(this.currentP)

    if (this.useWebGL && this.gl) {
      this._renderWebGL(now)
    } else if (this.ctx) {
      this._renderCanvas2D(now)
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

    gl.uniform2f(this.uResolution, this.width, this.height)

    gl.uniform1f(this.uTime, (now - this.startTime) * 0.001)

    gl.uniform1f(this.uProgress, this.currentP)

    gl.uniform1f(this.uKnobX, this.knobX)

    gl.uniform1f(this.uContext, this._contextCode())

    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  _renderCanvas2D(now) {
    const ctx = this.ctx

    const dpr = this.dpr || 2

    const w = this.width

    const h = this.height

    const p = this.currentP

    const t = (now - this.startTime) * 0.001

    ctx.save()

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    ctx.scale(dpr, dpr)

    ctx.imageSmoothingEnabled = true

    ctx.imageSmoothingQuality = 'high'

    // Capsule pill track clip
    ctx.beginPath()

    ctx.arc(14, 14, 14, Math.PI * 0.5, Math.PI * 1.5)

    ctx.lineTo(w - 14, 0)

    ctx.arc(w - 14, 14, 14, Math.PI * 1.5, Math.PI * 0.5)

    ctx.closePath()

    ctx.clip()

    // ── Track Background Color ──
    const offColor = [16, 19, 26]

    let onColor = [16, 185, 129] // Emerald (Stats)

    if (this.contextType === 'grid') onColor = [0, 220, 255] // Electric Cyan (Grid)

    if (this.contextType === 'motion') onColor = [168, 85, 247] // Electric Violet (Motion)

    const rCol = Math.round(offColor[0] + (onColor[0] - offColor[0]) * p)

    const gCol = Math.round(offColor[1] + (onColor[1] - offColor[1]) * p)

    const bCol = Math.round(offColor[2] + (onColor[2] - offColor[2]) * p)

    ctx.fillStyle = `rgb(${rCol}, ${gCol}, ${bCol})`

    ctx.fillRect(0, 0, w, h)

    // ── Contextual Animations ──
    if (this.contextType === 'stats') {
      // Live ECG heartbeat pulse wave with high contrast
      ctx.save()

      ctx.beginPath()

      for (let x = 4; x <= w - 4; x += 1.5) {
        const waveX = x + t * 24.0

        let pulse = Math.sin(waveX * 0.35) * 2.2

        const spikePhase = waveX % 36.0

        if (spikePhase > 12.0 && spikePhase < 18.0) {
          pulse += (spikePhase - 15.0) * -2.8
        }

        const waveY = 14.0 + pulse * (0.3 + 0.7 * p)

        if (x === 4) ctx.moveTo(x, waveY)
        else ctx.lineTo(x, waveY)
      }

      ctx.strokeStyle = p > 0.5 ? '#ffffff' : 'rgba(102, 252, 241, 0.95)'

      ctx.lineWidth = 1.6

      ctx.stroke()

      ctx.restore()
    } else if (this.contextType === 'grid') {
      // Blueprint grid columns & crosshairs with high contrast
      ctx.save()

      ctx.strokeStyle = p > 0.5 ? '#ffffff' : 'rgba(0, 229, 255, 0.9)'

      ctx.lineWidth = 1.3

      const gridOffset = (t * 5.0) % 8.0

      for (let gx = 6 + gridOffset; gx < w - 6; gx += 8.0) {
        ctx.beginPath()

        ctx.moveTo(gx, 4)

        ctx.lineTo(gx, h - 4)

        ctx.stroke()
      }

      ctx.beginPath()

      ctx.moveTo(6, 14)

      ctx.lineTo(w - 6, 14)

      ctx.stroke()

      ctx.restore()
    } else {
      // Reduced motion: subtle drift (off) vs calm still horizon (on) with high contrast
      ctx.save()

      if (p < 0.5) {
        const streamX = (t * 12.0) % 24.0

        ctx.strokeStyle = 'rgba(216, 180, 254, 0.95)'

        ctx.lineWidth = 1.5

        ctx.beginPath()

        ctx.moveTo(6 + streamX, 10)

        ctx.lineTo(16 + streamX, 10)

        ctx.moveTo(22 - streamX, 18)

        ctx.lineTo(32 - streamX, 18)

        ctx.stroke()
      } else {
        ctx.strokeStyle = '#ffffff'

        ctx.lineWidth = 1.6

        ctx.beginPath()

        ctx.moveTo(8, 14)

        ctx.lineTo(w - 8, 14)

        ctx.stroke()
      }

      ctx.restore()
    }

    // Inset track bezel shadow
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)'

    ctx.lineWidth = 1.5

    ctx.stroke()

    // ── 3D Sliding Knob ──
    const kx = this.knobX

    // Drop shadow
    ctx.save()

    ctx.beginPath()

    ctx.arc(kx, 14.5, 11, 0, Math.PI * 2)

    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'

    ctx.fill()

    // Knob sphere
    ctx.beginPath()

    ctx.arc(kx, 14, 11, 0, Math.PI * 2)

    const knobGrad = ctx.createRadialGradient(kx - 3, 11, 1, kx, 14, 11)

    knobGrad.addColorStop(0, '#ffffff')

    knobGrad.addColorStop(1, '#e2e8f0')

    ctx.fillStyle = knobGrad

    ctx.fill()

    // Unified solid center dot with bright accent
    let dotColor = 'rgb(16, 185, 129)'

    if (this.contextType === 'grid') dotColor = 'rgb(0, 220, 255)'

    if (this.contextType === 'motion') dotColor = 'rgb(168, 85, 247)'

    ctx.beginPath()

    ctx.arc(kx, 14, 2.8, 0, Math.PI * 2)

    ctx.fillStyle = p > 0.5 ? dotColor : 'rgb(102, 252, 241)'

    ctx.fill()

    ctx.restore()

    // High contrast crisp outer border
    ctx.beginPath()

    ctx.arc(14, 14, 13.5, Math.PI * 0.5, Math.PI * 1.5)

    ctx.lineTo(w - 14, 0.5)

    ctx.arc(w - 14, 14, 13.5, Math.PI * 1.5, Math.PI * 0.5)

    ctx.closePath()

    ctx.strokeStyle = p > 0.5 ? `rgba(${onColor[0]}, ${onColor[1]}, ${onColor[2]}, 0.9)` : 'rgba(255, 255, 255, 0.32)'

    ctx.lineWidth = 1.2

    ctx.stroke()

    ctx.restore()
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId)

    this.canvas?.removeEventListener(EVENTS.CLICK, this.onClick)

    if (this.gl && this.quadBuffer) {
      this.gl.deleteBuffer(this.quadBuffer)

      this.gl.deleteProgram(this.program)
    }
  }
}
