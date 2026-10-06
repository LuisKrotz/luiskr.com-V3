/**
 * @file switch-slider-shaders.ts
 * @description GLSL sources for SwitchSliderWebGL's animated toggle scene,
 * extracted from switch-slider.ts — pure data, compiled by initWebGL().
 */

/** Fullscreen-quad vertex shader: a_pos in clip space, v_uv 0–1. */
export const SWITCH_SLIDER_VS = `
        attribute vec2 a_pos;
        varying vec2 v_uv;
        void main() {
          v_uv = (a_pos + 1.0) * 0.5;
          gl_Position = vec4(a_pos, 0.0, 1.0);
        }
      `

/** Toggle fragment shader: pill track, knob, per-context accents. */
export const SWITCH_SLIDER_FS = `
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
