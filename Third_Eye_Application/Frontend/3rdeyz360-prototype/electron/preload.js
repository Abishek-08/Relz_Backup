const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendToMain: (msg) => ipcRenderer.send('to-main', msg)
});
