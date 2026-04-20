// Runs in the main window (not the webview). Listens for ipc-message events from the webview.
const webview = document.getElementById('thirdPartyView');

webview.addEventListener('ipc-message', (event) => {
  // payload is in event.args[0] when using ipcRenderer.sendToHost from the guest preload
  if (event && event.args && event.args.length > 0) {
    const payload = event.args[0];
    // forward payload to main process via the exposed electronAPI
    window.electronAPI.sendEvent(payload);
  }
});

// also show logs coming back from main
window.electronAPI.onDisplayLog((data) => {
  const log = document.getElementById('log');
  const line = document.createElement('div');
  line.textContent = `Event: ${data.type} | Button: ${data.buttonId}`;
  log.appendChild(line);
});
