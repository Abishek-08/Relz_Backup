const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  sendEmbeddedEvent: (data) => ipcRenderer.send('embedded-event', data),
  onDisplayLog: (cb) => ipcRenderer.on('display-log', (e, d) => cb(d))
});
