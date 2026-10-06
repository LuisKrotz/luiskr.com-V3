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

/** Builds the mutation map bound to `store`. */
export const createMutations = (store: Store): MutationMap => ({
  ...themeMutations(store),
  ...mediaMutations(store),
  ...inputMutations(store),
  ...langMutations(store),
  ...uiMutations(store),
})
