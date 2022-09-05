const {app, BrowserWindow, ipcMain} = require('electron');
const { autoUpdater } = require("electron-updater");
const isDev = require('electron-is-dev');
const path = require('path');
const fs = require('fs');

autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        transparent: false,
        frame: false,
        resizable: false,
        fullscreen: false,
        fullscreenable: false,
        backgroundColor: '#181818',
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: __dirname + "/assets/favicon.ico"
    });
  
    // and load the index.html of the app.
    mainWindow.loadFile('index.html');
  
    mainWindow.webContents.openDevTools();
  
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
      app.quit();
    });

};

app.whenReady().then(() => {
    createWindow();
    if(!isDev) {
        autoUpdater.checkForUpdates();
    }
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
  
app.on('activate', function () {
    if (mainWindow === null) createWindow()
})

autoUpdater.on('update-available', (info) => {
    console.log('Update available.');
    console.log("Version: " + info.version);
    console.log("Release date: " + info.releaseDate);
    mainWindow.webContents.send('update-available', info);  
});
autoUpdater.on('update-not-available', () => {
    console.log("Update not available.");
    mainWindow.webContents.send('update-not-available');
})
autoUpdater.on('download-progress', (progress) => {
    console.log(`Progress ${Math.floor(progress.percent)}%`);
    mainWindow.webContents.send('download-progress', progress);
});
autoUpdater.on('update-downloaded', () => {
    console.log("Update downloaded.");
    mainWindow.webContents.send('update-downloaded');
    setTimeout(() => {
        autoUpdater.quitAndInstall();
    }, 2500);
});
autoUpdater.on('error', (error) => {
    mainWindow.webContents.send('error', error);
});

//main process
ipcMain.on('getVersion', (e) => {
    e.reply('version', app.getVersion())
})
ipcMain.on('isDev', (e) => {
    e.reply('dev', isDev)
})
ipcMain.on('closeApp', (e) => {
    app.quit();
})