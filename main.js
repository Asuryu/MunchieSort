const {app, BrowserWindow} = require('electron');
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

app.on('ready', () => {
    if(!isDev) {
        autoUpdater.checkForUpdates();
    }
    createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
  
app.on('activate', function () {
    if (mainWindow === null) createWindow()
})


autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...');
});
autoUpdater.on('update-available', (info) => {
    console.log('Update available.');
    console.log("Version: " + info.version);
    console.log("Release date: " + info.releaseDate);
});
autoUpdater.on('update-not-available', () => {
    console.log("Update not available.");
});
autoUpdater.on('download-progress', (progress) => {
    console.log(`Progress ${Math.floor(progress.percent)}%`);
});
autoUpdater.on('update-downloaded', (info) => {
    console.log("Update downloaded.");
    autoUpdater.quitAndInstall();
});
autoUpdater.on('error', (error) => {
    console.log(error);
});