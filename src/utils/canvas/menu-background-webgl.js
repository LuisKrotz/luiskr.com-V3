import { CLASSES, STRINGS } from '../../core/constants.js'

/**
 * WebGL animated background for the mobile burger menu.
 * Renders a subtle pulsing particle field with flowing connections,
 * inspired by neural network / constellation aesthetics.
 * Adapts to dark/light theme automatically.
 */
export class MenuBackgroundWebGL {
  constructor(canvas) {
    this.canvas = canvas
    this.gl = null
    this.program = null
    this.quadBuffer = null
    this.animId = null
    this.startTime = performance.now()
    this.uTime = null
    this.uResolution = null
    this.uDark = null
    this.width = 0
    this.height = 0
    this.isActive = false
    this._ro = null
    this._initGL()
  }

  _initGL() {
    if (!this.canvas) return

    const gl = this.canvas.getContext('webgl', { alpha: true, antialias: false, preserveDrawingBuffer: false })

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

      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){
        vec2 i=floor(p),f=fract(p);
        f=f*f*(3.-2.*f);
        return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),
                   mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);
      }

      void main(){
        vec2 uv=gl_FragCoord.xy/u_res;
        float t=u_time*0.15;

        // Layered noise field
        float n=0.;
        n+=noise(uv*3.+t)*0.5;
        n+=noise(uv*6.-t*1.3)*0.25;
        n+=noise(uv*12.+t*0.7)*0.125;

        // Flowing gradient
        float flow=sin(uv.x*6.28+t*2.)*0.5+0.5;
        flow*=cos(uv.y*4.+t)*0.5+0.5;

        // Particle dots
        float dots=0.;
        for(int i=0;i<8;i++){
          float fi=float(i);
          vec2 p=vec2(
            0.1+0.8*hash(vec2(fi,0.)),
            0.1+0.8*hash(vec2(0.,fi))
          );
          p+=vec2(sin(t+fi*1.7)*0.08,cos(t*1.3+fi*2.1)*0.08);
          float d=length(uv-p);
          dots+=smoothstep(0.02,0.0,d)*0.4;
          // Glow halo
          dots+=smoothstep(0.08,0.0,d)*0.08;
        }

        // Compose
        float alpha=n*0.06+flow*0.03+dots;
        alpha=clamp(alpha,0.,0.6);

        vec3 colDark=vec3(0.3,0.6,1.)*alpha;
        vec3 colLight=vec3(0.1,0.2,0.5)*alpha;
        vec3 col=mix(colLight,colDark,u_dark);

        gl_FragColor=vec4(col,alpha*0.7);
      }
    `)

    gl.compileShader(fs)

    this.program = gl.createProgram()

    gl.attachShader(this.program, vs)

    gl.attachShader(this.program, fs)

    gl.linkProgram(this.program)

    gl.useProgram(this.program)

    // Full-screen quad
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

  start() {
    if (this.isActive) return

    this.isActive = true

    this.startTime = performance.now()

    this._handleResize()

    if (typeof ResizeObserver !== STRINGS.UNDEFINED) {
      this._ro = new ResizeObserver(() => this._handleResize())

      this._ro.observe(this.canvas.parentElement || this.canvas)
    }

    this._loop()
  }

  stop() {
    this.isActive = false

    if (this.animId) {
      cancelAnimationFrame(this.animId)

      this.animId = null
    }

    if (this._ro) {
      this._ro.disconnect()

      this._ro = null
    }
  }

  _handleResize() {
    const parent = this.canvas.parentElement || this.canvas

    const rect = parent.getBoundingClientRect()

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    this.width = Math.round(rect.width * dpr)

    this.height = Math.round(rect.height * dpr)

    this.canvas.width = this.width

    this.canvas.height = this.height

    if (this.gl) {
      this.gl.viewport(0, 0, this.width, this.height)
    }
  }

  _loop() {
    if (!this.isActive || !this.gl) return

    this.animId = requestAnimationFrame(() => this._loop())

    const gl = this.gl

    const t = (performance.now() - this.startTime) / 1000

    const isDark = document.documentElement.classList.contains(CLASSES.DARK_MODE) ? 1 : 0

    gl.clearColor(0, 0, 0, 0)

    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(this.program)

    gl.uniform1f(this.uTime, t)

    gl.uniform2f(this.uResolution, this.width, this.height)

    gl.uniform1f(this.uDark, isDark)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  destroy() {
    this.stop()

    if (this.gl) {
      if (this.quadBuffer) this.gl.deleteBuffer(this.quadBuffer)

      if (this.program) this.gl.deleteProgram(this.program)

      this.gl = null
    }
  }
}
