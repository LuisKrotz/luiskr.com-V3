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
 * Reactive state container. Deliberately tiny: a Set of subscriber callbacks,
 * a state bag, a named-mutation map, and a getter facade. A Set (not Array)
 * gives O(1) unsubscribe and dedupes double-subscribe for free.
 */
export class Store {
  /** Live subscriber callbacks; invoked in insertion order by notify(). */
  subscribers = new Set<Subscriber>()

  /** The single mutable state bag — replaced by mutations, read via getters. */
  state: StoreState

  /** name → mutator map built by createMutations(this) at construction. */
  mutations: MutationMap

  /** Read facade — components read state exclusively through getters. */
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
   * explicitly returns false (its way of saying "no state change"). Unknown
   * names warn through devlog instead of throwing so a typo in one component
   * can't crash an unrelated render pass.
   * @param mutationName Key into MUTATIONS (token, not a literal).
   * @param payload Optional value forwarded to the mutator.
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
   * @param listener Callback receiving the state bag on every notify().
   * @returns unsubscribe function
   */
  subscribe(listener: Subscriber): () => boolean {
    this.subscribers.add(listener)

    return () => this.subscribers.delete(listener)
  }

  /**
   * Calls every subscriber; one throwing subscriber can't break the rest —
   * each call is try/catch'd and routed to devlog so a render bug in one
   * component doesn't starve the remaining subscribers of the update.
   */
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
 * The app-wide singleton store. Exported as both a named and default export —
 * both spellings appear across the module graph, so both are kept.
 */
export const store = new Store()
export default store
