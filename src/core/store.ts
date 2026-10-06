/**
 * @file store.ts
 * @description Framework-free reactive state container (tiny pub/sub).
 *
 * Holds the app's shared state: locale + loaded translation nodes, theme
 * (with persisted preference and OS-scheme resolution), reduced-motion /
 * video-autoplay / stats / grid preferences, the expand-modal descriptor,
 * input method (pointer vs touch), and the portfolio list.
 *
 * Mutation names live in MUTATIONS (constants.js); components commit via
 * store.commit(MUTATIONS.X, payload) and re-render through their
 * subscribe()d onStoreUpdate callback.
 */

import { createGetters } from './store/getters.js'
import { createMutations } from './store/mutations.js'
import { createInitialState } from './store/state.js'
import type { MutationMap, StoreGetters, StoreState, Subscriber } from './store/state.js'
import { devError, devWarn } from '@/core/devlog.js'

export type { StoreState } from './store/state.js'

/**
 * The Store class.
 */
export class Store {
  subscribers = new Set<Subscriber>()
  state: StoreState
  mutations: MutationMap
  getters: StoreGetters

  constructor() {
    this.state = createInitialState()

    // Every named mutation is a pure state transition + its side effects
    // (localStorage persist, document class toggles). Returning `false`
    // suppresses notify() — used for no-op writes so subscribers don't
    // re-render needlessly.
    this.mutations = createMutations(this)

    // Read-only accessors — components go through getters so the state
    // shape can evolve without touching every consumer.
    this.getters = createGetters(this)
  }
  /**
   * Runs a named mutation then notifies subscribers — unless the mutation
   * explicitly returns false (its way of saying "no state change").
   */
  commit(mutationName: string, payload?: unknown): void {
    if (this.mutations[mutationName]) {
      const res = this.mutations[mutationName](payload)

      if (res !== false) {
        this.notify()
      }
    } else {
      devWarn(`[Store] Unknown mutation: ${mutationName}`)
    }
  }

  /**
   * Subscribes to state changes.
   * @returns unsubscribe function
   */
  subscribe(listener: Subscriber): () => boolean {
    this.subscribers.add(listener)

    return () => this.subscribers.delete(listener)
  }

  /** Calls every subscriber; one throwing subscriber can't break the rest. */
  notify(): void {
    for (const sub of this.subscribers) {
      try {
        sub(this.state)
      } catch (err) {
        devError('[Store] Subscriber error:', err)
      }
    }
  }
}

/**
 * The store constant.
 */
export const store = new Store()
export default store
