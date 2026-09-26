import { EVENTS, STRINGS } from '../../core/constants.js'
import store from '../../core/store.js'

/**
 * WebGL Carousel Arrow Controls with Circular Loading Progress & Gestural Microinteractions
 * - Prev button: Swipe-left gesture (tablet card outline + hand pointing left + arrow) with expanding kinetic ripples
 * - Next button: Swipe-right gesture (tablet card outline + hand pointing right + forward kinetic arrow burst)
 * - Circular WebGL loading ring with glowing leading particle head synchronized to autoplay timer
 * - Normalized coordinate space [-1.0 .. 1.0] scaling to all screen sizes without clipping
 * - Full Canvas 2D fallback
 */
export class CarouselArrowWebGL {
  constructor(canvas, type = 'next', onAction = null) {
    this.canvas = canvas

    this.type = type // 'prev' | 'next'

    this.onAction = onAction

    this.width = 44

    this.height = 44

    this.progress = 0

    this.isHovered = false

    this.hoverLevel = 0.0

    this.isPlaying = true

    this.clickTime = -10.0

    this.useWebGL = false

    this.animId = null

    this.startTime = performance.now()

    this.init()
  }

  init() {
    if (!this.canvas || typeof this.canvas.getContext !== STRINGS.FUNCTION) {
      this._triggerFallback()

      return
    }

    const dpr = Math.min(Math.max((typeof window !== STRINGS.UNDEFINED ? window.devicePixelRatio : 1) || 1, 2), 3)

    const rect = this.canvas.getBoundingClientRect?.()

    const size = rect && rect.width > 0 ? rect.width : 44

    this.width = size

    this.height = size

    this.dpr = dpr

    this.canvas.width = Math.round(this.width * dpr)

    this.canvas.height = Math.round(this.height * dpr)

    this.canvas.style.width = `${this.width}px`

    this.canvas.style.height = `${this.height}px`

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
        #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
        #else
        precision mediump float;
        #endif

        varying vec2 v_uv;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform float u_progress;
        uniform float u_type; // 0 = prev, 1 = next
        uniform float u_hover;
        uniform float u_click_time;

        #define PI 3.14159265359

        float distBox(vec2 p, vec2 b) {
          vec2 d = abs(p) - b;
          return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
        }

        void main() {
          // Normalized coordinates: center at (0.0, 0.0), edge at radius 1.0
          vec2 p = (v_uv - 0.5) * 2.0;
          float d = length(p);

          if (d > 1.0) {
            discard;
          }

          float borderAA = 1.0 - smoothstep(0.96, 1.0, d);

          // Button disk background with hover illumination
          vec3 diskBg = mix(vec3(0.12, 0.13, 0.17), vec3(0.22, 0.24, 0.30), u_hover);
          vec3 col = diskBg;

          // ── Circular Loading Progress Ring (Radius 0.86) ──
          float ringDist = abs(d - 0.86);
          float track = (1.0 - smoothstep(0.0, 0.08, ringDist)) * 0.35;
          col += vec3(0.45, 0.50, 0.60) * track;

          // Clockwise angle from 12 o'clock: 0.0 to 1.0
          float angle = atan(p.x, p.y);
          if (angle < 0.0) angle += 2.0 * PI;
          float angleNorm = angle / (2.0 * PI);

          if (angleNorm <= u_progress && u_progress > 0.005) {
            float arcGlow = 1.0 - smoothstep(0.0, 0.08, ringDist);
            vec3 ringColor = mix(vec3(0.25, 0.85, 0.95), vec3(0.98, 0.82, 0.35), angleNorm);
            col = mix(col, ringColor, arcGlow * 0.95);

            // Leading particle bead
            float headDiff = abs(angleNorm - u_progress);
            if (headDiff < 0.05 || (1.0 - headDiff) < 0.05) {
              float bead = (1.0 - smoothstep(0.0, 0.12, ringDist)) * (1.0 - min(headDiff, 1.0 - headDiff) / 0.05);
              col += vec3(1.0, 1.0, 1.0) * bead * 0.95;
            }
          }

          // ── Click Kinetic Ripple Wave ──
          float clickElapsed = u_time - u_click_time;
          if (clickElapsed >= 0.0 && clickElapsed < 0.45) {
            float waveRad = clickElapsed * 2.2;
            float waveShock = (1.0 - smoothstep(0.0, 0.15, abs(d - waveRad))) * (1.0 - clickElapsed / 0.45);
            col += vec3(0.35, 0.85, 1.0) * waveShock * 0.8;
          }

          // ── Gestural Card Outline + Hand + Arrow ──
          float hoverShift = sin(u_time * 4.0) * u_hover * 0.08;

          if (u_type < 0.5) {
            // ── PREV: Swipe-Left Tablet + Hand/Arrow Gesture ──
            vec2 pIcon = p - vec2(-hoverShift, 0.0);

            // Violet rounded tablet/card outline
            float cardDist = distBox(pIcon, vec2(0.35, 0.48));
            float cardLine = (1.0 - smoothstep(0.0, 0.07, abs(cardDist - 0.04))) * 0.75;
            col += vec3(0.75, 0.58, 1.0) * cardLine;

            // Cyan hand with extended index finger pointing left
            vec2 pHand = pIcon - vec2(0.08, 0.04);
            float finger = 1.0 - smoothstep(0.0, 0.07, length(pHand - vec2(clamp(pHand.x, -0.24, 0.10), -0.05)));
            float palm = 1.0 - smoothstep(0.0, 0.11, length(pHand - vec2(0.10, 0.10)));
            float hand = clamp(finger + palm, 0.0, 1.0);
            col = mix(col, vec3(0.25, 0.95, 0.90), hand * 0.92);

            // Swipe Arrow Left
            float shaft = (1.0 - smoothstep(0.0, 0.05, abs(pIcon.y - 0.12))) * (1.0 - smoothstep(0.0, 0.18, abs(pIcon.x + 0.10)));
            float head = (1.0 - smoothstep(0.0, 0.06, abs((pIcon.y - 0.12) - (pIcon.x + 0.24)))) * step(pIcon.x, -0.12) * step(-0.26, pIcon.x)
                       + (1.0 - smoothstep(0.0, 0.06, abs((pIcon.y - 0.12) + (pIcon.x + 0.24)))) * step(pIcon.x, -0.12) * step(-0.26, pIcon.x);
            float arrow = clamp(shaft + head, 0.0, 1.0);
            col = mix(col, vec3(0.30, 0.98, 0.92), arrow * 0.95);

          } else {
            // ── NEXT: Swipe-Right Tablet + Hand/Arrow Gesture ──
            vec2 pIcon = p - vec2(hoverShift, 0.0);

            // Violet rounded tablet/card outline
            float cardDist = distBox(pIcon, vec2(0.35, 0.48));
            float cardLine = (1.0 - smoothstep(0.0, 0.07, abs(cardDist - 0.04))) * 0.75;
            col += vec3(0.75, 0.58, 1.0) * cardLine;

            // Cyan hand with extended index finger pointing right
            vec2 pHand = pIcon - vec2(-0.08, 0.04);
            float finger = 1.0 - smoothstep(0.0, 0.07, length(pHand - vec2(clamp(pHand.x, -0.10, 0.24), -0.05)));
            float palm = 1.0 - smoothstep(0.0, 0.11, length(pHand - vec2(-0.10, 0.10)));
            float hand = clamp(finger + palm, 0.0, 1.0);
            col = mix(col, vec3(0.25, 0.95, 0.90), hand * 0.92);

            // Swipe Arrow Right
            float shaft = (1.0 - smoothstep(0.0, 0.05, abs(pIcon.y - 0.12))) * (1.0 - smoothstep(0.0, 0.18, abs(pIcon.x - 0.10)));
            float head = (1.0 - smoothstep(0.0, 0.06, abs((pIcon.y - 0.12) - (-pIcon.x + 0.24)))) * step(0.12, pIcon.x) * step(pIcon.x, 0.26)
                       + (1.0 - smoothstep(0.0, 0.06, abs((pIcon.y - 0.12) + (-pIcon.x + 0.24)))) * step(0.12, pIcon.x) * step(pIcon.x, 0.26);
            float arrow = clamp(shaft + head, 0.0, 1.0);
            col = mix(col, vec3(0.30, 0.98, 0.92), arrow * 0.95);
          }

          gl_FragColor = vec4(col, borderAA);
        }
      `

      const vs = gl.createShader(gl.VERTEX_SHADER)

      gl.shaderSource(vs, vsSource)

      gl.compileShader(vs)

      if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        console.warn('CarouselArrow VS error:', gl.getShaderInfoLog(vs))
        return
      }

      const fs = gl.createShader(gl.FRAGMENT_SHADER)

      gl.shaderSource(fs, fsSource)

      gl.compileShader(fs)

      if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        console.warn('CarouselArrow FS error:', gl.getShaderInfoLog(fs))
        return
      }

      const program = gl.createProgram()

      gl.attachShader(program, vs)

      gl.attachShader(program, fs)

      gl.linkProgram(program)

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn('CarouselArrow Program error:', gl.getProgramInfoLog(program))
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

      this.uType = gl.getUniformLocation(program, 'u_type')

      this.uHover = gl.getUniformLocation(program, 'u_hover')

      this.uClickTime = gl.getUniformLocation(program, 'u_click_time')

      this.aPos = gl.getAttribLocation(program, 'a_pos')

      gl.enable(gl.BLEND)

      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

      this.useWebGL = true
    } catch (e) {
      console.warn('CarouselArrow WebGL fallback:', e)
      this.useWebGL = false
    }
  }

  bindEvents() {
    this.onMouseEnter = () => {
      this.isHovered = true
    }

    this.onMouseLeave = () => {
      this.isHovered = false
    }

    this.onClick = () => {
      this.clickTime = (performance.now() - this.startTime) * 0.001

      if (this.canvas === this.boundTarget) {
        this.onAction?.()
      }
    }

    const target = this.canvas.parentElement || this.canvas

    this.boundTarget = target

    target.addEventListener(EVENTS.MOUSEENTER, this.onMouseEnter)

    target.addEventListener(EVENTS.MOUSELEAVE, this.onMouseLeave)
  }

  setHover(hovered) {
    this.isHovered = Boolean(hovered)
  }

  triggerClick() {
    this.clickTime = (performance.now() - this.startTime) * 0.001
  }

  setPlaying(playing) {
    this.isPlaying = Boolean(playing)
  }

  setProgress(p, isPlaying = undefined) {
    if (isPlaying !== undefined) {
      this.isPlaying = Boolean(isPlaying)
    }

    this.progress = Math.max(0, Math.min(1, Number(p) || 0))
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

    this.hoverLevel += (targetH - this.hoverLevel) * 0.16

    // Once autoplay is stopped, smoothly regress the line backwards to zero and keep it at 0
    if (!this.isPlaying && this.progress > 0) {
      this.progress = Math.max(0, this.progress - 0.04)
    }

    if (this.ctx) {
      this._renderCanvas2D(now)
    }
  }

  _renderCanvas2D(now) {
    const ctx = this.ctx

    const dpr = this.dpr || 2

    const w = this.width

    const h = this.height

    const cx = w * 0.5

    const cy = h * 0.5

    const r = w * 0.5 - 2

    const dir = this.type === 'next' ? 1.0 : -1.0

    const t = (now - this.startTime) * 0.001

    ctx.save()

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    ctx.scale(dpr, dpr)

    ctx.imageSmoothingEnabled = true

    ctx.imageSmoothingQuality = 'high'

    // ── 1. Single Button Disc (Obsidian glass, NO double border) ──
    ctx.beginPath()

    ctx.arc(cx, cy, r, 0, Math.PI * 2)

    ctx.fillStyle = this.isHovered ? 'rgba(26, 32, 44, 0.96)' : 'rgba(11, 12, 16, 0.88)'

    ctx.fill()

    // ── 2. Loading Progress Ring Track ──
    const ringR = r - 2.5

    if (this.isPlaying || this.progress > 0.005) {
      ctx.beginPath()

      ctx.arc(cx, cy, ringR, 0, Math.PI * 2)

      ctx.strokeStyle = 'rgba(102, 252, 241, 0.14)'

      ctx.lineWidth = 1.8

      ctx.stroke()
    }

    // ── 3. Active Circular Progress Arc with Glowing Turquoise Light Effect ──
    if (this.progress > 0.005) {
      const startAngle = -Math.PI * 0.5

      const endAngle = startAngle + this.progress * Math.PI * 2

      ctx.save()

      ctx.beginPath()

      ctx.arc(cx, cy, ringR, startAngle, endAngle)

      ctx.strokeStyle = '#66fcf1'

      ctx.lineWidth = 2.4

      ctx.lineCap = 'round'

      ctx.shadowColor = 'rgba(102, 252, 241, 0.95)'

      ctx.shadowBlur = 8

      ctx.stroke()

      // Luminous white/turquoise leading flare bead
      const px = cx + Math.cos(endAngle) * ringR

      const py = cy + Math.sin(endAngle) * ringR

      ctx.beginPath()

      ctx.arc(px, py, 2.2, 0, Math.PI * 2)

      ctx.fillStyle = '#ffffff'

      ctx.shadowColor = '#66fcf1'

      ctx.shadowBlur = 10

      ctx.fill()

      ctx.restore()
    }

    // ── 5. Click Shockwave Ripple ──
    const clickElapsed = (now - this.startTime) * 0.001 - this.clickTime

    if (clickElapsed >= 0.0 && clickElapsed < 0.45) {
      const shockR = clickElapsed * (r * 2.0)

      const shockAlpha = (1.0 - clickElapsed / 0.45) * 0.75

      ctx.save()

      ctx.beginPath()

      ctx.arc(cx, cy, shockR, 0, Math.PI * 2)

      ctx.strokeStyle = `rgba(102, 252, 241, ${shockAlpha.toFixed(3)})`

      ctx.lineWidth = 1.8

      ctx.stroke()

      ctx.restore()
    }

    // ── 6. Center Controls: Touch Glove on Hover & Dynamic Transformation ──
    const hLevel = this.hoverLevel

    const idleAlpha = Math.max(0.0, 1.0 - hLevel * 1.2)

    const hoverAlpha = Math.min(1.0, hLevel * 1.2)

    ctx.save()

    // Dynamic nudge along direction on hover
    const nudge = dir * hLevel * 2.5

    ctx.translate(cx + nudge, cy)

    // A) IDLE STATE: Crisp anti-aliased directional arrow in project white/turquoise
    if (idleAlpha > 0.01) {
      ctx.save()

      ctx.globalAlpha = idleAlpha

      ctx.strokeStyle = '#c5c6c7'

      ctx.fillStyle = '#c5c6c7'

      ctx.lineWidth = 2.2

      ctx.lineCap = 'round'

      ctx.lineJoin = 'round'

      ctx.shadowColor = 'rgba(102, 252, 241, 0.4)'

      ctx.shadowBlur = 4

      const shaft = 7.5

      const head = 5.0

      ctx.beginPath()

      ctx.moveTo(-dir * shaft, 0)

      ctx.lineTo(dir * shaft, 0)

      ctx.moveTo(dir * (shaft - head), -head * 0.9)

      ctx.lineTo(dir * shaft, 0)

      ctx.lineTo(dir * (shaft - head), head * 0.9)

      ctx.stroke()

      ctx.restore()
    }

    // B) HOVER STATE: Animated Touch Glove & Forward Kinetic Arrow Morphing
    if (hoverAlpha > 0.01) {
      ctx.save()

      ctx.globalAlpha = hoverAlpha

      // Expanding touch pulse ripples from contact point
      const touchOriginX = -dir * 2

      const rippleR1 = ((t * 22) % 13)

      const rippleA1 = (1.0 - rippleR1 / 13) * 0.65

      ctx.beginPath()

      ctx.arc(touchOriginX, 0, rippleR1, 0, Math.PI * 2)

      ctx.strokeStyle = `rgba(102, 252, 241, ${rippleA1.toFixed(3)})`

      ctx.lineWidth = 1.2

      ctx.stroke()

      const rippleR2 = ((t * 22 + 6.5) % 13)

      const rippleA2 = (1.0 - rippleR2 / 13) * 0.45

      ctx.beginPath()

      ctx.arc(touchOriginX, 0, rippleR2, 0, Math.PI * 2)

      ctx.strokeStyle = `rgba(102, 252, 241, ${rippleA2.toFixed(3)})`

      ctx.lineWidth = 1.0

      ctx.stroke()

      // Stylized Touch Glove: wrist cuff, palm curve, and pointing index finger
      ctx.strokeStyle = '#66fcf1'

      ctx.fillStyle = 'rgba(102, 252, 241, 0.15)'

      ctx.lineWidth = 1.8

      ctx.lineCap = 'round'

      ctx.lineJoin = 'round'

      ctx.shadowColor = 'rgba(102, 252, 241, 0.85)'

      ctx.shadowBlur = 6

      ctx.beginPath()

      // Glove wrist base
      ctx.moveTo(-dir * 8, 5)

      ctx.lineTo(-dir * 8, -5)

      // Top hand curve to index finger base
      ctx.lineTo(-dir * 3, -5)

      // Extended index finger pointing in navigation direction
      ctx.lineTo(dir * 5, -2)

      ctx.arc(dir * 5, 0, 2, -Math.PI * 0.5, Math.PI * 0.5, dir < 0)

      // Lower hand curve returning to wrist
      ctx.lineTo(-dir * 3, 5)

      ctx.closePath()

      ctx.fill()

      ctx.stroke()

      // Forward kinetic arrow stream emitted from finger touch
      const streamOffset = ((t * 24) % 10)

      const streamAlpha = (1.0 - streamOffset / 10) * 0.85

      const streamX = dir * (6 + streamOffset)

      ctx.save()

      ctx.strokeStyle = `rgba(102, 252, 241, ${streamAlpha.toFixed(3)})`

      ctx.lineWidth = 2.0

      ctx.beginPath()

      ctx.moveTo(streamX - dir * 3, -3.5)

      ctx.lineTo(streamX, 0)

      ctx.lineTo(streamX - dir * 3, 3.5)

      ctx.stroke()

      ctx.restore()

      ctx.restore()
    }

    ctx.restore()

    ctx.restore()
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId)

    this.boundTarget?.removeEventListener(EVENTS.MOUSEENTER, this.onMouseEnter)

    this.boundTarget?.removeEventListener(EVENTS.MOUSELEAVE, this.onMouseLeave)

    this.boundTarget?.removeEventListener(EVENTS.CLICK, this.onClick)

    if (this.gl && this.quadBuffer) {
      this.gl.deleteBuffer(this.quadBuffer)

      this.gl.deleteProgram(this.program)
    }
  }
}
