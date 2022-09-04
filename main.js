const {app, BrowserWindow, ipcMain} = require('electron');
const { autoUpdater } = require("electron-updater");
const isDev = require('electron-is-dev');
const path = require('path');
const fs = require('fs');

autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

Object.defineProperty(app, 'isPackaged', {
    get() {
      return true;
    }
});

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

    mainWindow.webContents.send('app-version', app.getVersion());
    console.log(app.getVersion());
  
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
      app.quit();
    });

};

app.on('ready', () => {
    createWindow();
    if(isDev) {
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
autoUpdater.on('download-progress', (progress) => {
    console.log(`Progress ${Math.floor(progress.percent)}%`);
    mainWindow.webContents.send('download-progress', progress);
});
autoUpdater.on('update-downloaded', () => {
    console.log("Update downloaded.");
    mainWindow.webContents.send('update-downloaded');
    setTimeout(() => {
        autoUpdater.quitAndInstall();
    }, 5000);
});
autoUpdater.on('error', () => {
    mainWindow.webContents.send('error');
});

ipcMain.on("asyncronous-message", function(evt, messageObj){
    if(messageObj == "getAppVersion") {
        evt.sender.send("asyncronous-message", app.getVersion());
    }
});