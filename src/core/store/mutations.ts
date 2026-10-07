/**
 * @file store/mutations.ts
 * @description Mutation map factory — every named mutation is a pure
 * state transition plus its side effects (localStorage persist,
 * document class toggles). Returning `false` suppresses notify() so
 * no-op writes don't re-render subscribers. The map is composed from
 * the domain groups in mutations/{theme,media,input,lang,ui}.ts.
 */

import { themeMutations } from './mutations/theme.js'
import { mediaMutations } from './mutations/media.js'
import { inputMutations } from './mutations/input.js'
import { langMutations } from './mutations/lang.js'
import { uiMutations } from './mutations/ui.js'
import type { MutationMap } from './state.js'
import type { Store } from '../store.js'

/**
 * Builds the mutation map bound to `store`. Domain groups are spread into
 * one flat map — key collisions would silently overwrite, so each group
 * owns a disjoint prefix of MUTATIONS by convention (theme.*, media.*, …).
 * @param store The Store instance the mutators close over.
 * @returns The composed MutationMap.
 */
export const createMutations = (store: Store): MutationMap => ({
  ...themeMutations(store),
  ...mediaMutations(store),
  ...inputMutations(store),
  ...langMutations(store),
  ...uiMutations(store),
})
