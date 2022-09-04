const { contextBridge, ipcRenderer } = require('electron')
var ver;

ipcRenderer.send('getVersion');
ipcRenderer.once('version', (e, version) => {
  ver = version;
}) 

contextBridge.exposeInMainWorld('electronAPI', {
    onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
    onDownloadProgress: (callback) => ipcRenderer.on('download-progress', callback),
    onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
    onError: (callback) => ipcRenderer.on('error', callback),
    getVersion: () => ver,
})

