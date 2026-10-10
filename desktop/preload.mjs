import { contextBridge, ipcRenderer } from 'electron'

/**
 * Preload script for the desktop launcher window. Exposes a minimal,
 * namespaced API so the renderer can request a yarn command and receive
 * streamed output without full node integration.
 */
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Request that the main process run a yarn script. Returns immediately
   * with the process pid; output streams through `onOutput`.
   * @param {string} script - one of setup|dev|verify|build|desktop:dev
   */
  run: (script) => ipcRenderer.invoke('run-command', script),

  /**
   * Register a callback for command output lines.
   * @param {(line: string) => void} callback
   */
  onOutput: (callback) => {
    ipcRenderer.on('command-output', (_event, line) => callback(line))
  },
})
