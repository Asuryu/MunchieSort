const {app, BrowserWindow} = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        transparent: false,
        frame: false,
        resizable: false,
        fullscreen: false,
        fullscreenable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
            enableRemoteModule: true
        },
        icon: __dirname + "/assets/favicon.ico"
    });
  
    // and load the index.html of the app.
    mainWindow.loadFile('index.html');
  
    //mainWindow.webContents.openDevTools();
  
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
      app.quit();
    });
};

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
  
app.on('activate', function () {
    if (mainWindow === null) createWindow()
})
