'use strict'

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const menu = require('./menu')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow(
    {
      icon:'assets/image.png', 
      width: 900, 
      height: 600,
      title: 'Fileswarm'
    }
  )
console.log(window.IpfsApi('localhost', '5001'))
  menu.createMenu()

  mainWindow.loadURL('file://' + __dirname + '/app/dist/index.html')

  mainWindow.setTitle('fileswarm')

  //mainWindow.webContents.openDevTools()

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


