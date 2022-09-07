const { contextBridge, ipcRenderer } = require('electron')
var ver;
var isDev
var data;

ipcRenderer.send('getVersion');
ipcRenderer.once('version', (e, version) => {
  ver = version;
}) 
ipcRenderer.send('isDev');
ipcRenderer.once('dev', (e, dev) => {
  isDev = dev;
}) 
ipcRenderer.send('getItems');
ipcRenderer.once('items', (e, items) => {
  data = items;
}) 

contextBridge.exposeInMainWorld('electronAPI', {
    onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
    onUpdateNotAvailable: (callback) => ipcRenderer.on('update-not-available', callback),
    onDownloadProgress: (callback) => ipcRenderer.on('download-progress', callback),
    onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
    onError: (callback) => ipcRenderer.on('error', callback),
    getVersion: () => ver,
    isDev: () => isDev,
    getItems: () => data,
    closeApp: () => ipcRenderer.send('closeApp'),
})

