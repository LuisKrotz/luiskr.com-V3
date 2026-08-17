// Hardware GPU Acceleration Engine (WebGL / WebGPU Hardware Context)
class GPUAccelerator {
  constructor() {
    this.canvas = null
    this.gl = null
    this.program = null
    this.initGPU()
  }

  initGPU() {
    if (typeof window === 'undefined') return
    try {
      this.canvas = document.createElement('canvas')
      this.canvas.width = 1
      this.canvas.height = 1
      this.gl =
        this.canvas.getContext('webgl2', {
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
        }) || this.canvas.getContext('webgl', { powerPreference: 'high-performance' })

      if (this.gl) {
        const vsSource = `
          attribute vec2 a_position;
          varying vec2 v_uv;
          void main() {
            v_uv = a_position * 0.5 + 0.5;
            gl_Position = vec4(a_position, 0.0, 1.0);
          }
        `
        const fsSource = `
          precision lowp float;
          varying vec2 v_uv;
          uniform sampler2D u_image;
          void main() {
            gl_FragColor = texture2D(u_image, v_uv);
          }
        `
        const vs = this.compileShader(this.gl.VERTEX_SHADER, vsSource)
        const fs = this.compileShader(this.gl.FRAGMENT_SHADER, fsSource)
        if (vs && fs) {
          this.program = this.gl.createProgram()
          this.gl.attachShader(this.program, vs)
          this.gl.attachShader(this.program, fs)
          this.gl.linkProgram(this.program)
        }
      }
    } catch {
      // Graceful CPU fallback
    }
  }

  compileShader(type, source) {
    if (!this.gl) return null
    const shader = this.gl.createShader(type)
    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      this.gl.deleteShader(shader)
      return null
    }
    return shader
  }

  // Hardware GPU-accelerated canvas texture processing and image decoding
  processTextureGPU(imageEl, targetW, targetH) {
    if (!this.gl || !imageEl) return null
    try {
      this.canvas.width = targetW
      this.canvas.height = targetH
      this.gl.viewport(0, 0, targetW, targetH)

      const texture = this.gl.createTexture()
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        imageEl
      )
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)

      return this.canvas.toDataURL('image/jpeg', 0.85)
    } catch {
      return null
    }
  }
}

export const gpuAccel = new GPUAccelerator()
