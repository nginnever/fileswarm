'use strict'
//const electron = require('electron')
const app = require('electron').remote
const menu = require('./menu')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow(
    {
      icon:'assets/image.png', 
      width: 900, 
      height: 600,
      title: 'Fileswarm',
      webPreferences: {
        nodeIntegration: true
      }
    }
  )

  menu.createMenu()

  mainWindow.loadURL('file://' + __dirname + '/app/dist/index.html')
  
  mainWindow.webContents.openDevTools()

  mainWindow.setTitle('fileswarm')

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}


app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})


