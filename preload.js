const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
    onDownloadProgress: (callback) => ipcRenderer.on('download-progress', callback),
    onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
    onError: (callback) => ipcRenderer.on('error', callback),
})

ipcRenderer.send("asyncronous-message", "getAppVersion");
ipcRenderer.on("asyncronous-message", function(evt, messageObj){
    var version = document.getElementById('appVersion');
    console.log(version);
    version.innerHTML = messageObj;
});
