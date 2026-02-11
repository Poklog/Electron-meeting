import { app, shell, BrowserWindow, session, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // 這裡決定載入什麼
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 修正後的啟動邏輯
app.whenReady().then(() => {
  // [重點] 必須在這裡面設定 session 權限
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    const allowList = ['media', 'audioCapture', 'videoCapture', 'screen']
    if (allowList.includes(permission)) {
      callback(true)
    } else {
      callback(false)
    }
  })

  // 設定 App ID
  electronApp.setAppUserModelId('com.electron')

  // 快捷鍵優化
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})