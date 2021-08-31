const path = require('path')
const url = require('url')
const {app, BrowserWindow} = require('electron')
const server = require("./server")

let win

function createWindow() {
    win = new BrowserWindow({
        width: 900, 
        height: 600, 
        icon: __dirname + '/img/icon.png',
        minWidth: 400, 
        minHeight: 400,
    })

    
    win.loadURL('http://localhost:6060')

     

    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null
    })
}



app.on('ready', createWindow)

app.on('window-all-closed', () => {
    app.quit()
})