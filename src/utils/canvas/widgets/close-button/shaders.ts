/**
 * @file close-button-shaders.ts
 * @description GLSL sources for CloseButtonWebGL, extracted from
 * close-button.ts — quad vertex shader with UV varying, and the
 * liquid-fill fragment shader (turquoise fill, foam crest, bubbles,
 * rotating X strokes, click shockwave).
 */

/** Fullscreen quad vertex shader — passes a_pos through as v_uv 0..1. */
export const CLOSE_BUTTON_VS = `
        attribute vec2 a_pos;
        varying vec2 v_uv;
        void main() {
          v_uv = (a_pos + 1.0) * 0.5;
          gl_Position = vec4(a_pos, 0.0, 1.0);
        }
      `

/** Liquid-fill fragment shader (see class docblock for the effect layers). */
export const CLOSE_BUTTON_FS = `
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
