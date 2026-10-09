import { once } from 'node:events'
import { setTimeout as delay } from 'node:timers/promises'
import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import { startAgentCore, stopAgentCore, whenAgentCoreReady } from './agentcore-launcher'
import { handleAppScheme, registerAppScheme } from './protocol'
import { createMainWindow, createSplashWindow } from './window'

const SPLASH_MIN_MS = 1500

// Tem que ser registrado antes de o app ficar pronto.
registerAppScheme()

async function start(): Promise<void> {
  const splash = createSplashWindow()
  const main = createMainWindow()

  try {
    await Promise.all([once(main, 'ready-to-show'), delay(SPLASH_MIN_MS), startAgentCore()])
  } catch (error) {
    splash.close()
    dialog.showErrorBox('Orbit AI', `Não foi possível iniciar o AgentCore.\n\n${String(error)}`)
    app.quit()
    return
  }

  splash.close()
  main.show()
}

if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.on('second-instance', () => {
    const win = BrowserWindow.getAllWindows().find((w) => w.isVisible())
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  void app.whenReady().then(() => {
    handleAppScheme()
    ipcMain.handle('orbit:get-api-base-url', () => whenAgentCoreReady())
    ipcMain.handle('orbit:get-default-project-path', () => app.getPath('home'))

    void start()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        const win = createMainWindow()
        win.once('ready-to-show', () => win.show())
      }
    })
  })

  let quitting = false
  app.on('before-quit', (event) => {
    if (quitting) return
    event.preventDefault()
    quitting = true
    void stopAgentCore().finally(() => app.quit())
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}
