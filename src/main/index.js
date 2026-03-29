const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, dialog } = require('electron')
const path = require('path')
const crypto = require('crypto')
const { getRules, saveRules } = require('./store')
const { initWatchers, pauseWatchers, resumeWatchers } = require('./watcher')

const isDev = process.env.NODE_ENV === 'development'

let tray = null
let win = null
let watchersPaused = false

function createTrayIcon() {
  const iconPath = path.join(__dirname, '../../src/assets/icon.ico')
  let icon

  try {
    icon = nativeImage.createFromPath(iconPath)
    if (icon.isEmpty()) throw new Error('empty')
  } catch {
    // Placeholder: 16x16 white square
    icon = nativeImage.createFromDataURL(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHklEQVQ4T2NkYGD4z8BAAozSgNHgGI2C0RgAAIABAAANGAOBAAAAAElFTkSuQmCC'
    )
  }

  return icon.resize({ width: 16, height: 16 })
}

function buildTrayMenu() {
  return Menu.buildFromTemplate([
    {
      label: 'Abrir',
      click: () => {
        win.show()
        win.focus()
      },
    },
    {
      label: watchersPaused ? 'Reanudar reglas' : 'Pausar reglas',
      click: () => {
        if (watchersPaused) {
          resumeWatchers()
          watchersPaused = false
        } else {
          pauseWatchers()
          watchersPaused = true
        }
        tray.setContextMenu(buildTrayMenu())
      },
    },
    { type: 'separator' },
    {
      label: 'Salir',
      click: () => app.quit(),
    },
  ])
}

function createTray() {
  tray = new Tray(createTrayIcon())
  tray.setToolTip('Laceria FAR')
  tray.setContextMenu(buildTrayMenu())

  tray.on('double-click', () => {
    win.show()
    win.focus()
  })
}

function registerIpcHandlers() {
  // ── Rules ────────────────────────────────────────────────────────────────
  ipcMain.handle('rules:getAll', () => {
    return getRules()
  })

  ipcMain.handle('rules:save', (_event, rule) => {
    const rules = getRules()
    if (!rule.id) {
      rule.id = crypto.randomUUID()
      rules.push(rule)
    } else {
      const idx = rules.findIndex((r) => r.id === rule.id)
      if (idx !== -1) {
        rules[idx] = rule
      } else {
        rules.push(rule)
      }
    }
    saveRules(rules)
    initWatchers()
    return rule
  })

  ipcMain.handle('rules:delete', (_event, id) => {
    const rules = getRules().filter((r) => r.id !== id)
    saveRules(rules)
    initWatchers()
    return id
  })

  ipcMain.handle('rules:toggle', (_event, id) => {
    const rules = getRules()
    const rule = rules.find((r) => r.id === id)
    if (!rule) throw new Error(`Rule not found: ${id}`)
    rule.enabled = !rule.enabled
    saveRules(rules)
    initWatchers()
    return rule
  })

  // ── Watcher ──────────────────────────────────────────────────────────────
  ipcMain.handle('watcher:pause', () => pauseWatchers())
  ipcMain.handle('watcher:resume', () => resumeWatchers())

  // ── Settings ─────────────────────────────────────────────────────────────
  ipcMain.handle('settings:getLoginItem', () => {
    return app.getLoginItemSettings().openAtLogin
  })

  ipcMain.handle('settings:setLoginItem', (_event, enable) => {
    app.setLoginItemSettings({ openAtLogin: enable })
  })

  // ── Dialog ───────────────────────────────────────────────────────────────
  ipcMain.handle('dialog:selectFolder', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      properties: ['openDirectory'],
    })
    return canceled ? null : filePaths[0]
  })
}

function createWindow() {
  Menu.setApplicationMenu(null)

  win = new BrowserWindow({
    width: 1024,
    height: 768,
    icon: path.join(__dirname, '../../src/assets/icon.ico'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Hide to tray instead of closing
  win.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault()
      win.hide()
    }
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

app.on('before-quit', () => {
  app.isQuitting = true
})

// Keep app alive when all windows are closed (background mode)
app.on('window-all-closed', () => {
  // Do nothing — the tray keeps the app running
})

app.whenReady().then(() => {
  registerIpcHandlers()
  initWatchers()
  createWindow()
  createTray()
})
