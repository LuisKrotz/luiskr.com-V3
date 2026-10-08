/**
 * @file mermaid.js (mock)
 * @description Minimal mermaid stub for the docs portal — initialize()
 * records config, render() returns a placeholder SVG per block so tests
 * can assert wiring without the real diagram engine.
 */

export const __mermaidState = { initialized: null, ranNodes: 0 }

const mermaid = {
  initialize(config) {
    __mermaidState.initialized = config
  },

  async run({ nodes }) {
    for (const node of nodes) {
      node.setAttribute('data-processed', 'true')
      node.innerHTML = '<svg data-mermaid-mock="1"></svg>'
      __mermaidState.ranNodes++
    }
  },

  async render() {
    __mermaidState.ranNodes++
    return { svg: '<svg data-mermaid-mock="1"></svg>' }
  },
}

export default mermaid
