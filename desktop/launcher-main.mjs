#!/usr/bin/env node
/**
 * @file desktop/launcher-main.mjs
 * @description Electron launcher window for setup/run/verify/build.
 * Provides a small GUI so the common project operations can be started
 * with a click instead of memorizing CLI commands.
 *
 *   yarn setup:gui  — open the launcher
 */
import { app, BrowserWindow, ipcMain } from 'electron'
import { spawn } from 'node:child_process'
import path from 'node:path'
import url from 'node:url'

const here = path.dirname(url.fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')

const gotLock = app.requestSingleInstanceLock()

if (!gotLock) {
  app.quit()
}

const isWin = process.platform === 'win32'
const shell = isWin ? 'cmd.exe' : '/bin/sh'

/**
 * Maps a launcher button to the shell command that runs it.
 * Dev server intentionally keeps the process alive; setup/verify/build exit.
 */
const scripts = {
  setup: 'yarn setup',
  dev: 'yarn dev',
  verify: 'yarn verify',
  build: 'yarn build',
  'desktop:dev': 'yarn desktop:dev',
}

let currentProcess = null

/**
 * Spawns a command in the project root, forwarding stdout/stderr lines to
 * the renderer. On Windows the command is wrapped in cmd /c; on macOS/Linux
 * it runs under sh -c so the user's PATH and shell profile are respected.
 */
function runCommand(script) {
  const command = scripts[script]

  if (!command) return

  if (currentProcess && !currentProcess.killed) {
    currentProcess.kill()
  }

  const args = isWin ? ['/c', command] : ['-c', command]

  currentProcess = spawn(shell, args, {
    cwd: root,
    env: { ...process.env, FORCE_COLOR: '1' },
  })

  const send = (line) => {
    BrowserWindow.getAllWindows().forEach((win) => {
      if (!win.isDestroyed()) win.webContents.send('command-output', line)
    })
  }

  currentProcess.stdout.on('data', (data) => {
    send(String(data))
  })

  currentProcess.stderr.on('data', (data) => {
    send(String(data))
  })

  currentProcess.on('close', (code) => {
    send(`\n[${script}] exited with code ${code ?? 'unknown'}\n`)
    currentProcess = null
  })

  currentProcess.on('error', (err) => {
    send(`\n[${script}] spawn error: ${err.message}\n`)
    currentProcess = null
  })
}

ipcMain.handle('run-command', (_event, script) => {
  runCommand(script)
})

const createWindow = () => {
  const win = new BrowserWindow({
    width: 960,
    height: 720,
    minWidth: 640,
    minHeight: 480,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(here, 'preload.mjs'),
    },
  })

  win.loadFile(path.join(here, 'launcher.html'))
}

app.whenReady().then(createWindow)

app.on('second-instance', () => {
  const [win] = BrowserWindow.getAllWindows()

  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('window-all-closed', () => {
  if (currentProcess && !currentProcess.killed) currentProcess.kill()
  if (process.platform !== 'darwin') app.quit()
})
