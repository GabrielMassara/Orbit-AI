import { join } from 'node:path'
import { BrowserWindow } from 'electron'
import icon from '../../resources/icon.png?asset'

const BACKGROUND_COLOR = '#f5f9fd'

function loadPage(win: BrowserWindow, page: 'index' | 'splash'): void {
  const devUrl = process.env['ELECTRON_RENDERER_URL']
  if (devUrl) {
    void win.loadURL(`${devUrl}/${page}.html`)
  } else {
    void win.loadFile(join(__dirname, `../renderer/${page}.html`))
  }
}

export function createMainWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 800,
    minHeight: 560,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: BACKGROUND_COLOR,
    icon
  })

  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  win.webContents.on('will-navigate', (event) => event.preventDefault())

  loadPage(win, 'index')
  return win
}

export function createSplashWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 420,
    height: 320,
    frame: false,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    center: true,
    show: false,
    backgroundColor: BACKGROUND_COLOR,
    icon
  })

  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  win.webContents.on('will-navigate', (event) => event.preventDefault())

  win.once('ready-to-show', () => win.show())
  loadPage(win, 'splash')
  return win
}
