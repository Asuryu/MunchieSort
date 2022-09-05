const { contextBridge, ipcRenderer } = require('electron')
var ver;
var isDev

ipcRenderer.send('getVersion');
ipcRenderer.once('version', (e, version) => {
  ver = version;
}) 
ipcRenderer.send('isDev');
ipcRenderer.once('dev', (e, dev) => {
  isDev = dev;
}) 

contextBridge.exposeInMainWorld('electronAPI', {
    onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
    onUpdateNotAvailable: (callback) => ipcRenderer.on('update-not-available', callback),
    onDownloadProgress: (callback) => ipcRenderer.on('download-progress', callback),
    onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
    onError: (callback) => ipcRenderer.on('error', callback),
    getVersion: () => ver,
    isDev: () => isDev,
    closeApp: () => ipcRenderer.send('closeApp'),
})

