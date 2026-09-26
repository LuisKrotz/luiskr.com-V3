import { EVENTS, STRINGS } from '../../core/constants.js'
import store from '../../core/store.js'

/**
 * WebGL Animated Close Button
 * Features:
 * - Liquid fills slower and procedural rising bubbles with specular highlights
 * - Rotating X during hover/liquid animation
 * - Razor-sharp vector anti-aliased X line strokes (zero blur)
 * - Kinetic shockwave ripple on click
 * - Resilient Canvas 2D fallback
 */
export class CloseButtonWebGL {
  constructor(canvas, onClickAction = null) {
    this.canvas = canvas

    this.onClickAction = onClickAction

    this.width = 36

    this.height = 36

    this.isHovered = false

    this.hoverLevel = 0.0

    this.drawProgress = 0.0

    this.rotation = 0.0

    this.clickTime = -10.0

    this.useWebGL = false

    this.animId = null

    this.startTime = performance.now()

    this.init()
  }

  init() {
    if (!this.canvas || typeof this.canvas.getContext !== STRINGS.FUNCTION) return

    const rect = this.canvas.getBoundingClientRect?.()

    const parentRect = this.canvas.parentElement?.getBoundingClientRect?.()

    const detectedW = (rect && rect.width > 10) ? rect.width : (parentRect && parentRect.width > 10 ? parentRect.width : 55)

    this.width = detectedW

    this.height = (rect && rect.height > 10) ? rect.height : (parentRect && parentRect.height > 10 ? parentRect.height : detectedW)

    const dpr = Math.max((typeof window !== STRINGS.UNDEFINED ? window.devicePixelRatio : 1) || 1, 2) * 2

    this.canvas.width = Math.round(this.width * dpr)

    this.canvas.height = Math.round(this.height * dpr)

    if (typeof ResizeObserver !== STRINGS.UNDEFINED) {
      this._ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = entry.contentRect.width

          const h = entry.contentRect.height

          if (w > 10 && (Math.abs(w - this.width) > 2 || Math.abs(h - this.height) > 2)) {
            this.width = w

            this.height = h || w

            const currentDpr = Math.max((typeof window !== STRINGS.UNDEFINED ? window.devicePixelRatio : 1) || 1, 2) * 2

            this.canvas.width = Math.round(this.width * currentDpr)

            this.canvas.height = Math.round(this.height * currentDpr)

            if (this.gl) {
              this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
            }
          }
        }
      })

      if (this.canvas.parentElement) {
        this._ro.observe(this.canvas.parentElement)
      } else {
        this._ro.observe(this.canvas)
      }
    }

    this.canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault()

      this.useWebGL = false

      try {
        const freshCanvas = this.canvas.cloneNode(true)

        this.canvas.replaceWith(freshCanvas)

        this.canvas = freshCanvas

        this.ctx = this.canvas.getContext('2d')
      } catch {
        this.ctx = this.canvas.getContext('2d')
      }
    }, false)

    this.initWebGL()

    if (!this.useWebGL) {
      // If WebGL failed on this canvas, clone to get clean 2D context
      if (!this.ctx) {
        try {
          const freshCanvas = this.canvas.cloneNode(true)

          this.canvas.replaceWith(freshCanvas)

          this.canvas = freshCanvas

          this.ctx = this.canvas.getContext('2d')
        } catch {
          this.ctx = this.canvas.getContext('2d')
        }
      }
    }

    this.bindEvents()

    this.animate()
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
        uniform float u_liquid;
        uniform float u_draw;
        uniform float u_rot;
        uniform float u_click_time;

        float distSegment(vec2 p, vec2 a, vec2 b) {
          vec2 pa = p - a;
          vec2 ba = b - a;
          float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
          return length(pa - ba * h);
        }

        void main() {
          vec2 pixel = v_uv * u_resolution;
          vec2 center = u_resolution * 0.5;
          vec2 pRel = pixel - center;
          float radius = min(center.x, center.y) - 1.0;
          float d = length(pRel);

          if (d > radius) {
            discard;
          }

          float borderAA = 1.0 - smoothstep(radius - 1.0, radius, d);

          // Neutral background
          vec3 baseBg = vec3(0.22, 0.23, 0.27);
          vec3 col = baseBg;

          // Slower liquid wave filling from bottom
          float targetY = (u_liquid * 2.2 - 1.1) * radius;
          float wave = sin(pRel.x * 0.28 + u_time * 4.0) * 1.6 * min(u_liquid * 2.5, 1.0)
                     + cos(pRel.x * 0.45 - u_time * 2.8) * 1.0 * min(u_liquid * 2.5, 1.0);
          float surfaceY = targetY + wave;

          if (pRel.y <= surfaceY && u_liquid > 0.01) {
            float depth = clamp((surfaceY - pRel.y) / (radius * 2.0), 0.0, 1.0);
            vec3 deepTurquoise = vec3(0.18, 0.65, 0.62);
            vec3 topTurquoise  = vec3(0.40, 0.988, 0.945); // Turquoise matching awards progress bar (#66fcf1)
            vec3 liquidColor = mix(topTurquoise, deepTurquoise, depth);

            // Glowing foam crest
            float crestDist = abs(pRel.y - surfaceY);
            float crest = 1.0 - smoothstep(0.0, 2.0, crestDist);
            liquidColor += vec3(0.75, 1.0, 0.98) * crest * 0.75;

            // Procedural rising bubbles inside liquid
            for (int i = 0; i < 4; i++) {
              float fi = float(i);
              float bSpeed = 12.0 + fi * 4.0;
              float bX = -8.0 + fi * 5.5 + sin(u_time * 2.5 + fi * 1.7) * 2.5;
              float bY = mod(u_time * bSpeed + fi * 9.0, radius * 2.2) - radius;
              vec2 bPos = vec2(bX, bY);
              float bRad = 1.2 + mod(fi, 2.0) * 0.7;

              if (bY <= surfaceY && bY > -radius) {
                float dBubble = length(pRel - bPos);
                float bRing = (1.0 - smoothstep(bRad - 0.4, bRad + 0.4, dBubble)) * smoothstep(bRad - 1.2, bRad - 0.3, dBubble);
                float bSpot = 1.0 - smoothstep(0.0, 0.6, length(pRel - (bPos + vec2(0.4, 0.4))));
                liquidColor += vec3(0.85, 1.0, 0.98) * (bRing * 0.55 + bSpot * 0.75);
              }
            }

            col = mix(col, liquidColor, borderAA);
          }

          // Inset rim shadow
          float rim = smoothstep(radius - 3.0, radius, d);
          col = mix(col, col * 0.7, rim * 0.35);

          // Rotating X lines (auto-drawing, ultra-crisp antialiasing, zero blur)
          vec2 pRot = vec2(
            pRel.x * cos(u_rot) - pRel.y * sin(u_rot),
            pRel.x * sin(u_rot) + pRel.y * cos(u_rot)
          );

          float halfLen = radius * 0.38;
          float progress = clamp(u_draw, 0.0, 1.0);

          vec2 l1A = vec2(-halfLen, -halfLen);
          vec2 l1B = l1A + vec2(halfLen * 2.0, halfLen * 2.0) * progress;
          float d1 = distSegment(pRot, l1A, l1B);

          vec2 l2A = vec2(-halfLen, halfLen);
          vec2 l2B = l2A + vec2(halfLen * 2.0, -halfLen * 2.0) * progress;
          float d2 = distSegment(pRot, l2A, l2B);

          // Sharp vector-like 1.8px stroke width with crisp 0.7px AA edge
          float stroke1 = (1.0 - smoothstep(0.9, 1.7, d1)) * step(0.01, progress);
          float stroke2 = (1.0 - smoothstep(0.9, 1.7, d2)) * step(0.01, progress);
          float totalX = clamp(stroke1 + stroke2, 0.0, 1.0);

          col = mix(col, vec3(1.0, 1.0, 1.0), totalX * borderAA);

          // Click shockwave
          float clickElapsed = u_time - u_click_time;
          if (clickElapsed >= 0.0 && clickElapsed < 0.4) {
            float waveRad = clickElapsed * 45.0;
            float waveShock = (1.0 - smoothstep(0.0, 2.5, abs(d - waveRad))) * (1.0 - clickElapsed / 0.4);
            col += vec3(0.40, 0.988, 0.945) * waveShock * 0.8;
          }

          gl_FragColor = vec4(col, borderAA);
        }
      `

      const vs = gl.createShader(gl.VERTEX_SHADER)

      gl.shaderSource(vs, vsSource)

      gl.compileShader(vs)

      if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        console.warn('CloseButton vs error:', gl.getShaderInfoLog(vs))
        return
      }

      const fs = gl.createShader(gl.FRAGMENT_SHADER)

      gl.shaderSource(fs, fsSource)

      gl.compileShader(fs)

      if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        console.warn('CloseButton fs error:', gl.getShaderInfoLog(fs))
        return
      }

      const program = gl.createProgram()

      gl.attachShader(program, vs)

      gl.attachShader(program, fs)

      gl.linkProgram(program)

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn('CloseButton program error:', gl.getProgramInfoLog(program))
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

      this.uLiquid = gl.getUniformLocation(program, 'u_liquid')

      this.uDraw = gl.getUniformLocation(program, 'u_draw')

      this.uRot = gl.getUniformLocation(program, 'u_rot')

      this.uClickTime = gl.getUniformLocation(program, 'u_click_time')

      this.aPos = gl.getAttribLocation(program, 'a_pos')

      gl.enable(gl.BLEND)

      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

      this.canvas.addEventListener('webglcontextlost', (e) => {
        e.preventDefault()

        this.useWebGL = false

        if (this.animId) cancelAnimationFrame(this.animId)

        this.canvas.style.display = 'none'
      }, false)

      this.useWebGL = true
    } catch (e) {
      console.warn('CloseButton WebGL fallback:', e)
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

    this.onClick = () => {
      this.triggerClick()

      this.onClickAction?.()
    }

    const target = this.canvas.parentElement || this.canvas

    this.boundTarget = target

    target.addEventListener(EVENTS.MOUSEENTER, this.onMouseEnter)

    target.addEventListener(EVENTS.MOUSELEAVE, this.onMouseLeave)

    target.addEventListener(EVENTS.CLICK, this.onClick)
  }

  setHover(hovered) {
    this.isHovered = Boolean(hovered)
  }

  triggerClick() {
    this.clickTime = (performance.now() - this.startTime) * 0.001
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

    // Slower, graceful liquid filling
    const targetHover = this.isHovered ? 1.0 : 0.0

    this.hoverLevel += (targetHover - this.hoverLevel) * 0.016

    // Rotating X: rotates up to 180 degrees (PI) as liquid fills
    const targetRot = this.hoverLevel * Math.PI

    this.rotation += (targetRot - this.rotation) * 0.04

    if (this.drawProgress < 1.0) {
      this.drawProgress = Math.min(1.0, this.drawProgress + 0.02)
    }

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

    gl.uniform2f(this.uResolution, this.canvas.width, this.canvas.height)

    gl.uniform1f(this.uTime, (now - this.startTime) * 0.001)

    gl.uniform1f(this.uLiquid, this.hoverLevel)

    gl.uniform1f(this.uDraw, this.drawProgress)

    gl.uniform1f(this.uRot, this.rotation)

    gl.uniform1f(this.uClickTime, this.clickTime)

    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  _renderCanvas2D(now) {
    const ctx = this.ctx

    const w = this.canvas.width

    const h = this.canvas.height

    const r = w * 0.5 - 1.0

    ctx.save()

    ctx.clearRect(0, 0, w, h)

    ctx.beginPath()

    ctx.arc(w * 0.5, h * 0.5, r, 0, Math.PI * 2)

    ctx.clip()

    // Base background
    ctx.fillStyle = 'rgb(56, 58, 68)'

    ctx.fillRect(0, 0, w, h)

    // Turquoise liquid with bubbles (matching awards progress bar)
    if (this.hoverLevel > 0.01) {
      const liquidH = this.hoverLevel * h

      const grad = ctx.createLinearGradient(0, h, 0, h - liquidH)

      grad.addColorStop(0, '#45a29e')

      grad.addColorStop(1, '#66fcf1')

      ctx.fillStyle = grad

      ctx.fillRect(0, h - liquidH, w, liquidH)

      // Bubbles in liquid
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'

      ctx.beginPath()

      ctx.arc(w * 0.35, h - liquidH * 0.4, 2, 0, Math.PI * 2)

      ctx.arc(w * 0.65, h - liquidH * 0.7, 1.5, 0, Math.PI * 2)

      ctx.fill()
    }

    // Rotating X lines
    ctx.save()

    ctx.translate(w * 0.5, h * 0.5)

    ctx.rotate(this.rotation)

    ctx.strokeStyle = 'rgb(255, 255, 255)'

    ctx.lineWidth = 2.4

    ctx.lineCap = 'round'

    const arm = r * 0.4 * this.drawProgress

    ctx.beginPath()

    ctx.moveTo(-arm, -arm)

    ctx.lineTo(arm, arm)

    ctx.moveTo(-arm, arm)

    ctx.lineTo(arm, -arm)

    ctx.stroke()

    ctx.restore()

    ctx.restore()
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId)

    this.boundTarget?.removeEventListener(EVENTS.MOUSEENTER, this.onMouseEnter)

    this.boundTarget?.removeEventListener(EVENTS.MOUSELEAVE, this.onMouseLeave)

    this.boundTarget?.removeEventListener(EVENTS.CLICK, this.onClick)

    if (this._ro) {
      this._ro.disconnect()

      this._ro = null
    }

    if (this.gl && this.quadBuffer) {
      this.gl.deleteBuffer(this.quadBuffer)

      this.gl.deleteProgram(this.program)
    }
  }
}
