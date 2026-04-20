const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openGoogleLogin: () => ipcRenderer.invoke("open-google-login"),
  openPlatform: (platform) => ipcRenderer.invoke("open-platform", platform),
});
