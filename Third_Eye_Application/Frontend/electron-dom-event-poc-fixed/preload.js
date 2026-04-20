const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendEvent: (data) => ipcRenderer.send("third-party-event", data),
  onDisplayLog: (callback) => ipcRenderer.on("display-log", (event, data) => callback(data))
});
