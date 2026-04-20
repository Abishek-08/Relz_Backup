// This preload runs in the assessment BrowserWindow (external site).
// Keep it minimal and only provide a safe channel to notify the main process if needed.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('assessmentBridge', {
  // Currently empty - we rely on main's webContents events to forward activity.
  pingMain: (msg) => ipcRenderer.send('assessment-ping', msg)
});
