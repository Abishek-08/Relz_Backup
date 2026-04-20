const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      // send a message to the embedder (host) via sendToHost
      ipcRenderer.sendToHost({ type: 'click', buttonId: 'startBtn' });
    });
  }

  if (stopBtn) {
    stopBtn.addEventListener('click', () => {
      ipcRenderer.sendToHost({ type: 'click', buttonId: 'stopBtn' });
    });
  }
});
