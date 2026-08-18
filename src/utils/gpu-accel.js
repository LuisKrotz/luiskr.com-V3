// Hardware GPU & NPU Acceleration Engine (WebGL2 Hardware GPU Texture Context & WebNN Hints)
class GPUAccelerator {
  constructor() {
    this.canvas = null
    this.gl = null
    this.program = null
    this.texture = null
    this.hasNPU = false
    this.initGPU()
  }

  initGPU() {
    if (typeof window === 'undefined') return

    // Detect WebNN NPU capability
    this.hasNPU = typeof navigator !== 'undefined' && 'ml' in navigator

    try {
      this.canvas = document.createElement('canvas')
      this.canvas.width = 1
      this.canvas.height = 1
      this.gl =
        this.canvas.getContext('webgl2', {
          powerPreference: 'high-performance',
          desynchronized: true,
          alpha: false,
          failIfMajorPerformanceCaveat: false,
        }) ||
        this.canvas.getContext('webgl', {
          powerPreference: 'high-performance',
          alpha: false,
        })

      if (this.gl) {
        const vsSource = `
          attribute vec2 a_position;
          varying vec2 v_uv;
          void main() {
            v_uv = vec2(a_position.x * 0.5 + 0.5, 1.0 - (a_position.y * 0.5 + 0.5));
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

          const positionBuffer = this.gl.createBuffer()
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
          this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            this.gl.STATIC_DRAW
          )

          const posLocation = this.gl.getAttribLocation(this.program, 'a_position')
          this.gl.enableVertexAttribArray(posLocation)
          this.gl.vertexAttribPointer(posLocation, 2, this.gl.FLOAT, false, 0, 0)

          this.texture = this.gl.createTexture()
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

  // Promote DOM Element to GPU Compositor layer
  accelerateElementGPU(el) {
    if (!el || !el.style) return
    el.style.willChange = 'transform, opacity'
    el.style.transform = 'translate3d(0, 0, 0)'
    el.style.backfaceVisibility = 'hidden'
  }

  // Upload HTML5 Video frames directly to WebGL GPU hardware texture
  processVideoGPU(videoEl, targetW = 640, targetH = 360) {
    if (!this.gl || !videoEl || videoEl.readyState < 2) return null
    try {
      this.canvas.width = targetW
      this.canvas.height = targetH
      this.gl.viewport(0, 0, targetW, targetH)
      this.gl.useProgram(this.program)

      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        videoEl
      )
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)

      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
      return true
    } catch {
      return false
    }
  }

  // Upload HTML5 Image element directly to WebGL GPU hardware texture
  processImageGPU(imageEl, targetW = 800, targetH = 450) {
    if (!this.gl || !imageEl) return null
    try {
      this.canvas.width = targetW
      this.canvas.height = targetH
      this.gl.viewport(0, 0, targetW, targetH)
      this.gl.useProgram(this.program)

      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
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

      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
      return true
    } catch {
      return false
    }
  }

  processTextureGPU(imageEl, targetW, targetH) {
    return this.processImageGPU(imageEl, targetW, targetH)
  }

  // Upload ImageBitmap directly to WebGL2 GPU hardware VRAM texture
  processBitmapGPU(bitmap, targetW = 800, targetH = 450) {
    if (!this.gl || !bitmap) return null
    try {
      this.canvas.width = targetW
      this.canvas.height = targetH
      this.gl.viewport(0, 0, targetW, targetH)
      this.gl.useProgram(this.program)

      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        bitmap
      )
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)

      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
      return true
    } catch {
      return false
    }
  }
}

export const gpuAccel = new GPUAccelerator()
