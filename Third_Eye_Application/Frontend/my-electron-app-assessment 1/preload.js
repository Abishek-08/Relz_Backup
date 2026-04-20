const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
  greet: () => 'Hello from Electron Preload!',
  openAssessment: (opts) => ipcRenderer.invoke('open-assessment', opts || {}),
  onActivity: (callback) => {
    // callback will receive a single argument: the activity object
    ipcRenderer.on('assessment-activity', (event, data) => {
      try {
        callback(data);
      } catch (err) {
        console.error('Error in activity callback', err);
      }
    });
  }
});
