/**
 * @file engine/state.ts
 * @description Factory for the star-field engine state bag — one mutable
 * SFState threaded through bootstrap/frame/fly/picking so every stage
 * shares the renderer, scene graph, tween and dispose flags. Mirrors the
 * earth engine's `createEarthState` convention.
 */

import type { SFBodyFn, SFProgressFn, SFState } from './types.js'

/** Lifecycle callbacks the host component wires in at construction. */
export interface SFEvents {
  onReady?: () => void
  onProgress?: SFProgressFn
  onSelect?: SFBodyFn
  onApproach?: SFBodyFn
  onHover?: (bodyId: string | null) => void
}

/**
 * Builds the initial engine state — everything null/empty until bootstrap
 * fills it; `disposed`/`failed`/`reduced` are the flags every async stage
 * re-checks before touching the scene.
 * @param canvas Persistent canvas the host renders into.
 * @param events Host callbacks (ready/progress/select/approach/hover).
 * @returns Fresh SFState.
 */
export function createStarState(canvas: HTMLCanvasElement, events: SFEvents = {}): SFState {
  return {
    canvas,
    renderer: null,
    scene: null,
    camera: null,
    controls: null,
    nodes: new Map(),
    anchors: new Map(),
    pickables: [],
    rings: [],
    approached: new Set(),
    fly: null,
    animId: null,
    disposed: false,
    failed: false,
    reduced: false,
    onResize: null,
    onPointerDown: null,
    onPointerMove: null,
    onPointerUp: null,
    onWheel: null,
    downXY: null,
    lastT: 0,
    t: 0,
    hoverId: null,
    selectedId: null,
    onReady: events.onReady,
    onProgress: events.onProgress,
    onSelect: events.onSelect,
    onApproach: events.onApproach,
    onHover: events.onHover,
  }
}
