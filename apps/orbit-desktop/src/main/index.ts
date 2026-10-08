import { once } from 'node:events'
import { setTimeout as delay } from 'node:timers/promises'
import { app, BrowserWindow } from 'electron'
import { createMainWindow, createSplashWindow } from './window'

const SPLASH_MIN_MS = 1500

async function start(): Promise<void> {
  const splash = createSplashWindow()
  const main = createMainWindow()

  await Promise.all([once(main, 'ready-to-show'), delay(SPLASH_MIN_MS)])

  splash.close()
  main.show()
}

void app.whenReady().then(() => {
  void start()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      const win = createMainWindow()
      win.once('ready-to-show', () => win.show())
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
