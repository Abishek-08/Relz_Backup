// Runs in the main window context. Receives messages from the webview (guest) via ipc-message.
const webview = document.getElementById('thirdPartyView');
const logEl = document.getElementById('log');
const reloadBtn = document.getElementById('reload');

function appendLog(obj){
  const line = document.createElement('div');
  line.textContent = JSON.stringify(obj);
  logEl.appendChild(line);
  logEl.scrollTop = logEl.scrollHeight;
}

webview.addEventListener('dom-ready', () => {
  appendLog({ type: 'info', msg: 'webview dom-ready' });
});

// Listen for messages sent via ipcRenderer.sendToHost in guest-preload
webview.addEventListener('ipc-message', (event) => {
  if (event && event.args && event.args.length > 0) {
    const payload = event.args[0];
    // forward to main process
    if (window.electronAPI && window.electronAPI.sendEvent) {
      window.electronAPI.sendEvent(payload);
    }
    appendLog({ from: 'guest', payload });
  }
});

// Show network or other logs coming from main process
if (window.electronAPI && window.electronAPI.onDisplayLog) {
  window.electronAPI.onDisplayLog((data) => {
    appendLog({ from: 'main', data });
  });
}

reloadBtn.addEventListener('click', () => {
  webview.reload();
});
