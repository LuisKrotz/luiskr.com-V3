/**
 * @file gpu-accel-shaders.ts
 * @description GLSL sources for the GPUAccelerator passthrough program —
 * a fullscreen-quad blit (attribute `a_position`, varying `v_uv`, one
 * `u_image` sampler) used to upload media frames into a GL texture.
 */

/** Fullscreen-quad vertex shader emitting flipped-normalized UVs. */
export const GPU_ACCEL_VS = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = vec2(a_position.x * 0.5 + 0.5, 1.0 - (a_position.y * 0.5 + 0.5));
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

/** Single-sampler fragment shader — blits the bound texture. */
export const GPU_ACCEL_FS = `
  precision lowp float;
  varying vec2 v_uv;
  uniform sampler2D u_image;
  void main() {
    gl_FragColor = texture2D(u_image, v_uv);
  }
`
