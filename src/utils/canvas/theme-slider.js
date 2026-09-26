import { THEME, EVENTS, STRINGS } from '../../core/constants.js'
import store from '../../core/store.js'

/**
 * Full Animated Day/Night/System Theme Slider
 * Powered by WebGL with robust Canvas 2D fallback.
 * Uses normalized aspect coordinates (range 0.0 to 3.33) to prevent GPU float overflow on all platforms.
 * Position 0: Dark (Night - Lunar moon with craters, twinkling stars, starry canyon mesas)
 * Position 1: System (Twilight - Balanced orb, sun rings rising on left, crescent on right)
 * Position 2: Light (Day - Sun knob on right, peach/coral sky, radiant sun on left)
 */
export class ThemeSliderWebGL {
  constructor(canvas, initialTheme = THEME.SYSTEM, onThemeChange = null) {
    this.canvas = canvas

    this.onThemeChange = onThemeChange

    this.currentTheme = initialTheme

    this.width = 280

    this.height = 64

    this.targetP = this._themeToP(initialTheme)

    this.currentP = this.targetP

    this.knobX = this._pToKnobX(this.currentP)

    this.isDragging = false

    this.startX = 0

    this.useWebGL = false

    this.animId = null

    this.startTime = performance.now()

    this.rippleTime = -10.0

    this.ripplePos = 32.0

    this.init()
  }

  _themeToP(theme) {
    if (theme === THEME.DARK) return 0.0

    if (theme === THEME.LIGHT) return 2.0

    return 1.0
  }

  _pToTheme(p) {
    if (p < 0.5) return THEME.DARK

    if (p > 1.5) return THEME.LIGHT

    return THEME.SYSTEM
  }

  _pToKnobX(p) {
    const minX = 32.0

    const maxX = this.width - 32.0

    return minX + (maxX - minX) * (p / 2.0)
  }

  init() {
    if (!this.canvas || typeof this.canvas.getContext !== STRINGS.FUNCTION) {
      this._triggerFallback()

      return
    }

    const rect = this.canvas.getBoundingClientRect?.()

    if (rect && rect.width > 50) {
      this.width = rect.width
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

    if (typeof ResizeObserver !== STRINGS.UNDEFINED) {
      this._resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = entry.contentRect.width

          if (w > 50 && Math.abs(w - this.width) > 2) {
            this.width = w

            const currentDpr = Math.max((typeof window !== STRINGS.UNDEFINED ? window.devicePixelRatio : 1) || 1, 2) * 2

            this.canvas.width = Math.round(this.width * currentDpr)

            this.canvas.height = Math.round(this.height * currentDpr)

            this.knobX = this._pToKnobX(this.currentP)
          }
        }
      })

      this._resizeObserver.observe(this.canvas)
    }

    this.bindEvents()

    this.animate()
  }

  _triggerFallback() {
    this.useWebGL = false

    if (this.animId) cancelAnimationFrame(this.animId)

    this.canvas.style.display = 'none'

    this.canvas.classList.add('is-fallback')

    const wrapper = this.canvas.closest('.pref-theme-wrapper')

    if (wrapper) wrapper.classList.add('has-fallback')
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
        uniform float u_knob_x;
        uniform float u_ripple_time;
        uniform float u_ripple_pos;

        // Normalized capsule distance in aspect space [0.0 .. aspect, 0.0 .. 1.0]
        float distCapsule(vec2 p, vec2 a, vec2 b) {
          vec2 pa = p - a;
          vec2 ba = b - a;
          float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
          return length(pa - ba * h);
        }

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 437.585453);
        }

        void main() {
          float aspect = u_resolution.x / u_resolution.y;
          vec2 p = vec2(v_uv.x * aspect, v_uv.y);

          // Stadium ends centered at (0.5, 0.5) and (aspect - 0.5, 0.5) with radius 0.5
          vec2 cA = vec2(0.5, 0.5);
          vec2 cB = vec2(aspect - 0.5, 0.5);
          float trackDist = distCapsule(p, cA, cB);

          if (trackDist > 0.5) {
            discard;
          }

          float borderAA = 1.0 - smoothstep(0.485, 0.5, trackDist);

          // Sky gradient mapped by height
          float h = p.y;
          vec3 nightSky = mix(vec3(0.38, 0.28, 0.60), vec3(0.46, 0.35, 0.70), h);
          vec3 sysSky   = mix(vec3(0.60, 0.38, 0.52), vec3(0.72, 0.48, 0.62), h);
          vec3 daySky   = mix(vec3(0.92, 0.48, 0.40), vec3(0.98, 0.64, 0.50), h);

          vec3 sky;
          if (u_progress <= 1.0) {
            sky = mix(nightSky, sysSky, u_progress);
          } else {
            sky = mix(sysSky, daySky, u_progress - 1.0);
          }

          vec3 col = sky;

          // Twinkling stars (Night / Twilight)
          float starAlpha = 1.0 - smoothstep(0.2, 1.1, u_progress);
          if (starAlpha > 0.01) {
            vec2 starGrid = floor(p * 20.0);
            float rnd = hash(starGrid);
            if (rnd > 0.72) {
              vec2 sPos = (starGrid + 0.5) / 20.0;
              float dStar = length(p - sPos);
              float twinkle = 0.5 + 0.5 * sin(u_time * 3.5 + rnd * 6.28);
              float sGlow = (1.0 - smoothstep(0.0, 0.022, dStar)) * twinkle * starAlpha;
              col += vec3(1.0, 1.0, 1.0) * sGlow;
            }
          }

          // Rising Sun with Concentric Glowing Rings and Rotating Animated Rays (Left mesa)
          float sunAlpha = smoothstep(0.3, 1.8, u_progress);
          if (sunAlpha > 0.01) {
            vec2 sunPos = vec2(0.80, 0.62);
            float dSun = length(p - sunPos);
            float coronaPulse = 0.012 * sin(u_time * 2.8);
            float core = 1.0 - smoothstep(0.135 + coronaPulse, 0.165 + coronaPulse, dSun);
            float ring1 = (1.0 - smoothstep(0.22, 0.26, dSun)) * 0.45;
            float ring2 = (1.0 - smoothstep(0.30, 0.35, dSun)) * 0.28;
            float ring3 = (1.0 - smoothstep(0.39, 0.45, dSun)) * 0.16;

            // Rotating solar corona rays
            float sunAngle = atan(p.y - sunPos.y, p.x - sunPos.x);
            float sunRays = 0.5 + 0.5 * sin(sunAngle * 10.0 + u_time * 0.85);
            float rayGlow = (1.0 - smoothstep(0.14, 0.44, dSun)) * sunRays * 0.28;

            vec3 sunCream = vec3(0.99, 0.90, 0.75);
            vec3 ringCol = mix(vec3(0.98, 0.76, 0.60), vec3(0.96, 0.64, 0.52), clamp(dSun / 0.45, 0.0, 1.0));
            float totalSun = clamp(core + ring1 + ring2 + ring3 + rayGlow, 0.0, 1.0);
            col = mix(col, mix(ringCol, sunCream, core), totalSun * sunAlpha);
          }

          // System Mode: Shifting Twilight Auroral Waves (Mid Position)
          float sysFactor = 1.0 - min(1.0, abs(u_progress - 1.0) * 1.6);
          if (sysFactor > 0.01) {
            float auroraWave = sin(p.x * 2.6 + sin(p.y * 3.8 + u_time * 1.4) + u_time * 1.6) * 0.5 + 0.5;
            float auroraBand = smoothstep(0.35, 0.75, p.y) * (1.0 - smoothstep(0.70, 0.95, p.y));
            vec3 auroraCol = mix(vec3(0.38, 0.78, 0.92), vec3(0.85, 0.45, 0.80), sin(p.x * 1.8 + u_time * 0.9) * 0.5 + 0.5);
            col += auroraCol * auroraWave * auroraBand * 0.38 * sysFactor;
          }

          // Crescent Moon in Upper Right (Night / Twilight)
          vec2 moonPos = vec2(2.58, 0.60);
          float dMoonOut = length(p - moonPos);
          float dMoonIn = length(p - (moonPos + vec2(-0.052, 0.042)));
          float moonOut = 1.0 - smoothstep(0.16, 0.18, dMoonOut);
          float moonIn = smoothstep(0.138, 0.174, dMoonIn);
          float crescent = moonOut * moonIn;
          float crescentAlpha = 1.0 - smoothstep(0.1, 1.2, u_progress);
          col = mix(col, vec3(1.0, 1.0, 1.0), clamp(crescent, 0.0, 1.0) * crescentAlpha * 0.95);

          // Canyon Mesas & Ridges with Multi-Layer Parallax and Heat Shimmer
          float parallax = (u_progress - 1.0) * 0.12;
          float px = p.x + parallax;
          float dayAlpha = smoothstep(1.0, 1.9, u_progress);
          float heatShimmer = sin(p.x * 14.0 + u_time * 2.8) * 0.005 * dayAlpha;

          float mesa1 = 0.33 + 0.14 * sin(px * 2.6) + 0.09 * cos(px * 5.4);
          float plateau1 = (1.0 - smoothstep(0.0, 0.3, abs(px - 1.72))) * 0.16;
          float plateau2 = (1.0 - smoothstep(0.0, 0.24, abs(px - 2.68))) * 0.18;
          float backHeight = mesa1 + plateau1 + plateau2 + heatShimmer * 0.5;

          vec3 mBackNight = vec3(0.34, 0.16, 0.49);
          vec3 mBackSys   = vec3(0.52, 0.24, 0.45);
          vec3 mBackDay   = vec3(0.76, 0.30, 0.40);
          vec3 mBackCol;
          if (u_progress <= 1.0) {
            mBackCol = mix(mBackNight, mBackSys, u_progress);
          } else {
            mBackCol = mix(mBackSys, mBackDay, u_progress - 1.0);
          }

          float duneBackAA = 1.0 - smoothstep(backHeight - 0.015, backHeight + 0.005, p.y);
          col = mix(col, mBackCol, duneBackAA);

          // Front rolling desert dunes with atmospheric heat shimmer
          float frontHeight = 0.21 + 0.09 * sin((p.x - parallax * 0.5) * 2.4 + 0.8) + 0.05 * cos(p.x * 3.8) + heatShimmer;
          vec3 mFrontNight = vec3(0.42, 0.22, 0.58);
          vec3 mFrontSys   = vec3(0.62, 0.30, 0.50);
          vec3 mFrontDay   = vec3(0.85, 0.40, 0.48);
          vec3 mFrontCol;
          if (u_progress <= 1.0) {
            mFrontCol = mix(mFrontNight, mFrontSys, u_progress);
          } else {
            mFrontCol = mix(mFrontSys, mFrontDay, u_progress - 1.0);
          }

          float duneFrontAA = 1.0 - smoothstep(frontHeight - 0.015, frontHeight + 0.005, p.y);
          col = mix(col, mFrontCol, duneFrontAA);

          // Inset Track Border Bezel
          float bezel = smoothstep(0.46, 0.50, trackDist);
          col = mix(col, col * 0.65, bezel * 0.55);

          // Interactive Energy Ripple
          float rippleElapsed = u_time - u_ripple_time;
          if (rippleElapsed >= 0.0 && rippleElapsed < 0.6) {
            float rX = (u_ripple_pos / u_resolution.x) * aspect;
            float rDist = length(p - vec2(rX, 0.5));
            float rRadius = rippleElapsed * 1.0;
            float rWave = (1.0 - smoothstep(0.0, 0.08, abs(rDist - rRadius))) * (1.0 - rippleElapsed / 0.6);
            col += vec3(0.35, 0.25, 0.45) * rWave * 0.55;
          }

          // 3D Knob (radius ~ 0.38)
          float knobXNorm = (u_knob_x / u_resolution.x) * aspect;
          vec2 knobCenter = vec2(knobXNorm, 0.5);
          float knobDist = length(p - knobCenter);
          float knobRadius = 0.38;

          float knobShadow = (1.0 - smoothstep(knobRadius, knobRadius + 0.07, knobDist)) * 0.38;
          col = mix(col, vec3(0.12, 0.08, 0.20), knobShadow);

          vec3 moonColor = vec3(0.98, 0.98, 1.0);
          vec3 sysColor  = vec3(0.98, 0.94, 0.90);
          vec3 sunColor  = vec3(0.99, 0.89, 0.73);

          vec3 baseKnob;
          if (u_progress <= 1.0) {
            baseKnob = mix(moonColor, sysColor, u_progress);
          } else {
            baseKnob = mix(sysColor, sunColor, u_progress - 1.0);
          }

          // Crater Spots on Lunar Moon (Position 0 / Night)
          float craterFactor = 1.0 - smoothstep(0.1, 0.9, u_progress);
          if (craterFactor > 0.01) {
            vec2 kp = p - knobCenter;
            float c1 = 1.0 - smoothstep(0.075, 0.095, length(kp - vec2(-0.13, 0.12)));
            float c2 = 1.0 - smoothstep(0.053, 0.071, length(kp - vec2(-0.11, -0.11)));
            float c3 = 1.0 - smoothstep(0.041, 0.059, length(kp - vec2(0.12, -0.07)));
            float c4 = 1.0 - smoothstep(0.059, 0.077, length(kp - vec2(0.09, 0.11)));
            float c5 = 1.0 - smoothstep(0.024, 0.042, length(kp - vec2(-0.01, 0.02)));
            float anyCrater = clamp(c1 + c2 + c3 + c4 + c5, 0.0, 1.0);
            vec3 craterColor = vec3(0.88, 0.89, 0.92);
            baseKnob = mix(baseKnob, craterColor, anyCrater * craterFactor * 0.75);
          }

          // Sphere 3D lighting
          float sphere3D = 1.0 - (knobDist / knobRadius) * 0.14;
          vec3 litKnob = baseKnob * sphere3D;

          // Smoothstep knob edge
          float knobAA = 1.0 - smoothstep(knobRadius - 0.02, knobRadius + 0.005, knobDist);
          col = mix(col, litKnob, knobAA);

          // Animated Knob Corona Aura in Light and System positions
          if (dayAlpha > 0.01) {
            float sunKnobHalo = (1.0 - smoothstep(knobRadius, knobRadius + 0.08 + 0.02 * sin(u_time * 3.0), knobDist)) * 0.42 * dayAlpha;
            col += vec3(1.0, 0.82, 0.50) * sunKnobHalo;
          }
          if (sysFactor > 0.01) {
            float sysKnobHalo = (1.0 - smoothstep(knobRadius, knobRadius + 0.07 + 0.015 * sin(u_time * 2.4), knobDist)) * 0.35 * sysFactor;
            col += vec3(0.85, 0.72, 0.98) * sysKnobHalo;
          }

          gl_FragColor = vec4(col * borderAA, borderAA);
        }
      `

      const vs = gl.createShader(gl.VERTEX_SHADER)

      gl.shaderSource(vs, vsSource)

      gl.compileShader(vs)

      if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        console.warn('ThemeSlider VS error:', gl.getShaderInfoLog(vs))
        return
      }

      const fs = gl.createShader(gl.FRAGMENT_SHADER)

      gl.shaderSource(fs, fsSource)

      gl.compileShader(fs)

      if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        console.warn('ThemeSlider FS error:', gl.getShaderInfoLog(fs))
        return
      }

      const program = gl.createProgram()

      gl.attachShader(program, vs)

      gl.attachShader(program, fs)

      gl.linkProgram(program)

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn('ThemeSlider Link error:', gl.getProgramInfoLog(program))
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

      this.uRippleTime = gl.getUniformLocation(program, 'u_ripple_time')

      this.uRipplePos = gl.getUniformLocation(program, 'u_ripple_pos')

      this.aPos = gl.getAttribLocation(program, 'a_pos')

      gl.enable(gl.BLEND)

      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

      this.useWebGL = true
    } catch (e) {
      console.warn('ThemeSlider WebGL fallback:', e)
      this.useWebGL = false
    }
  }

  bindEvents() {
    this.onPointerDown = (e) => {
      this.isDragging = true

      try {
        this.canvas.setPointerCapture?.(e.pointerId)
      } catch {}

      const rect = this.canvas.getBoundingClientRect()

      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0

      const x = clientX - rect.left

      this.targetP = this._xToContinuousP(x, rect.width)

      this.rippleTime = (performance.now() - this.startTime) * 0.001

      this.ripplePos = this._pToKnobX(this.targetP)
    }

    this.onPointerMove = (e) => {
      if (!this.isDragging) return

      const rect = this.canvas.getBoundingClientRect()

      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0

      const x = clientX - rect.left

      this.targetP = this._xToContinuousP(x, rect.width)
    }

    this.onPointerUp = (e) => {
      if (!this.isDragging) return

      this.isDragging = false

      try {
        this.canvas.releasePointerCapture?.(e.pointerId)
      } catch {}

      const snapP = Math.round(Math.max(0, Math.min(2, this.targetP)))

      this.targetP = snapP

      const newTheme = this._pToTheme(snapP)

      if (newTheme !== this.currentTheme) {
        this.currentTheme = newTheme

        this.onThemeChange?.(newTheme)
      }
    }

    this.onClick = (e) => {
      const rect = this.canvas.getBoundingClientRect()

      const clientX = e.clientX || 0

      const x = clientX - rect.left

      const normX = x / (rect.width || this.width)

      let snapP = 1.0

      if (normX < 0.35) snapP = 0.0
      else if (normX > 0.65) snapP = 2.0

      this.targetP = snapP

      this.rippleTime = (performance.now() - this.startTime) * 0.001

      this.ripplePos = this._pToKnobX(snapP)

      const newTheme = this._pToTheme(snapP)

      if (newTheme !== this.currentTheme) {
        this.currentTheme = newTheme

        this.onThemeChange?.(newTheme)
      }
    }

    this.onKeyDown = (e) => {
      if (e.key === KEYS.ARROW_LEFT || e.key === KEYS.ARROW_DOWN) {
        e.preventDefault()

        const snapP = Math.max(0, Math.round(this.targetP) - 1)

        this.targetP = snapP

        const newTheme = this._pToTheme(snapP)

        if (newTheme !== this.currentTheme) {
          this.currentTheme = newTheme

          this.onThemeChange?.(newTheme)
        }
      } else if (e.key === KEYS.ARROW_RIGHT || e.key === KEYS.ARROW_UP) {
        e.preventDefault()

        const snapP = Math.min(2, Math.round(this.targetP) + 1)

        this.targetP = snapP

        const newTheme = this._pToTheme(snapP)

        if (newTheme !== this.currentTheme) {
          this.currentTheme = newTheme

          this.onThemeChange?.(newTheme)
        }
      }
    }

    this.canvas.addEventListener(EVENTS.POINTERDOWN, this.onPointerDown)

    window.addEventListener(EVENTS.POINTERMOVE, this.onPointerMove)

    window.addEventListener(EVENTS.POINTERUP, this.onPointerUp)

    this.canvas.addEventListener(EVENTS.CLICK, this.onClick)

    this.canvas.addEventListener(EVENTS.KEYDOWN, this.onKeyDown)
  }

  _xToContinuousP(x, rectWidth = null) {
    const totalW = rectWidth && rectWidth > 0 ? rectWidth : this.width

    const minX = totalW * 0.12

    const maxX = totalW * 0.88

    const clampedX = Math.max(minX, Math.min(maxX, x))

    return ((clampedX - minX) / (maxX - minX)) * 2.0
  }

  _xToP(x) {
    const minX = 32.0

    const maxX = this.width - 32.0

    const clampedX = Math.max(minX, Math.min(maxX, x))

    return ((clampedX - minX) / (maxX - minX)) * 2.0
  }

  setTheme(theme) {
    this.currentTheme = theme

    this.targetP = this._themeToP(theme)

    this.rippleTime = (performance.now() - this.startTime) * 0.001

    this.ripplePos = this._pToKnobX(this.targetP)
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

    this.currentP += diff * 0.14

    this.knobX = this._pToKnobX(this.currentP)

    if (this.useWebGL && this.gl) {
      this._renderWebGL(now)
    } else if (this.ctx) {
      this._renderCanvas2D()
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

    gl.uniform1f(this.uRippleTime, this.rippleTime)

    gl.uniform1f(this.uRipplePos, this.ripplePos)

    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  _renderCanvas2D() {
    const ctx = this.ctx

    const w = this.width

    const h = this.height

    const p = this.currentP

    const dpr = Math.min((typeof window !== STRINGS.UNDEFINED ? window.devicePixelRatio : 1) || 1, 2)

    ctx.save()

    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, w, h)

    ctx.beginPath()

    if (typeof ctx.roundRect === STRINGS.FUNCTION) {
      ctx.roundRect(0, 0, w, h, 42)
    } else {
      ctx.arc(42, 42, 42, Math.PI * 0.5, Math.PI * 1.5)

      ctx.lineTo(w - 42, 0)

      ctx.arc(w - 42, 42, 42, Math.PI * 1.5, Math.PI * 0.5)

      ctx.closePath()
    }

    ctx.clip()

    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h)

    if (p <= 1.0) {
      skyGrad.addColorStop(0, 'rgb(112, 92, 173)')

      skyGrad.addColorStop(1, 'rgb(153, 97, 133)')
    } else {
      skyGrad.addColorStop(0, 'rgb(184, 122, 158)')

      skyGrad.addColorStop(1, 'rgb(250, 163, 128)')
    }

    ctx.fillStyle = skyGrad

    ctx.fillRect(0, 0, w, h)

    const time = (performance.now() - this.startTime) * 0.001

    // Sun rings on left with rotating rays and breathing corona
    if (p > 0.4) {
      const sunAlpha = Math.min(1.0, (p - 0.4) / 0.8)
      const pulse = Math.sin(time * 2.8) * 2.5

      ctx.save()
      ctx.globalAlpha = sunAlpha

      // Rotating sun rays
      ctx.save()
      ctx.translate(68, 52)
      ctx.rotate(time * 0.4)
      ctx.fillStyle = 'rgba(252, 227, 186, 0.16)'
      for (let i = 0; i < 8; i++) {
        ctx.rotate(Math.PI / 4)
        ctx.beginPath()
        ctx.moveTo(-3, -42)
        ctx.lineTo(3, -42)
        ctx.lineTo(0, -20)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()

      ctx.fillStyle = 'rgba(252, 227, 186, 0.25)'
      ctx.beginPath()
      ctx.arc(68, 52, 38 + pulse, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = 'rgba(252, 227, 186, 0.4)'
      ctx.beginPath()
      ctx.arc(68, 52, 24 + pulse * 0.5, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = 'rgb(252, 237, 201)'
      ctx.beginPath()
      ctx.arc(68, 52, 14, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    // System mode twilight auroral wave
    const sysFactor = 1.0 - Math.min(1.0, Math.abs(p - 1.0) * 1.6)
    if (sysFactor > 0.01) {
      ctx.save()
      ctx.globalAlpha = sysFactor * 0.4
      const auroraGrad = ctx.createLinearGradient(0, 10, w, 40)
      auroraGrad.addColorStop(0, 'rgba(97, 199, 235, 0.35)')
      auroraGrad.addColorStop(0.5, 'rgba(217, 115, 204, 0.45)')
      auroraGrad.addColorStop(1, 'rgba(97, 199, 235, 0.35)')
      ctx.fillStyle = auroraGrad
      ctx.beginPath()
      ctx.moveTo(0, 20 + Math.sin(time * 1.5) * 6)
      ctx.bezierCurveTo(w * 0.33, 10 + Math.sin(time * 1.8 + 1) * 8, w * 0.66, 30 + Math.sin(time * 1.4 + 2) * 8, w, 20 + Math.sin(time * 1.6) * 6)
      ctx.lineTo(w, 45)
      ctx.lineTo(0, 45)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    // Canyon Mesas
    ctx.fillStyle = p <= 1.0 ? 'rgb(87, 41, 125)' : 'rgb(194, 76, 102)'

    ctx.beginPath()

    ctx.moveTo(0, h)

    ctx.lineTo(0, 48)

    ctx.lineTo(80, 52)

    ctx.lineTo(130, 36)

    ctx.lineTo(190, 42)

    ctx.lineTo(w, 48)

    ctx.lineTo(w, h)

    ctx.closePath()

    ctx.fill()

    // Front dunes
    ctx.fillStyle = p <= 1.0 ? 'rgb(107, 56, 148)' : 'rgb(217, 102, 122)'

    ctx.beginPath()

    ctx.moveTo(0, h)

    ctx.lineTo(0, 68)

    ctx.bezierCurveTo(70, 58, 140, 72, 200, 60)

    ctx.bezierCurveTo(240, 52, 260, 65, w, 62)

    ctx.lineTo(w, h)

    ctx.closePath()

    ctx.fill()

    // 3D Knob
    const kx = this.knobX

    ctx.save()

    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'

    ctx.shadowBlur = 10

    ctx.shadowOffsetX = 0

    ctx.shadowOffsetY = 4

    ctx.fillStyle = p < 0.5 ? 'rgb(245, 245, 252)' : (p > 1.5 ? 'rgb(252, 227, 186)' : 'rgb(250, 240, 230)')

    ctx.beginPath()

    ctx.arc(kx, 42, 34, 0, Math.PI * 2)

    ctx.fill()

    ctx.restore()

    // Moon craters in dark mode
    if (p < 0.6) {
      ctx.fillStyle = 'rgba(215, 218, 230, 0.7)'

      ctx.beginPath()

      ctx.arc(kx - 11, 32, 6, 0, Math.PI * 2)

      ctx.arc(kx - 9, 51, 4.5, 0, Math.PI * 2)

      ctx.arc(kx + 10, 48, 3.5, 0, Math.PI * 2)

      ctx.arc(kx + 8, 33, 5, 0, Math.PI * 2)

      ctx.fill()
    }

    ctx.restore()
  }

  destroy() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect()

      this._resizeObserver = null
    }

    if (this.animId) cancelAnimationFrame(this.animId)

    this.canvas.removeEventListener(EVENTS.POINTERDOWN, this.onPointerDown)

    window.removeEventListener(EVENTS.POINTERMOVE, this.onPointerMove)

    window.removeEventListener(EVENTS.POINTERUP, this.onPointerUp)

    if (this.gl && this.quadBuffer) {
      this.gl.deleteBuffer(this.quadBuffer)

      this.gl.deleteProgram(this.program)
    }
  }
}
