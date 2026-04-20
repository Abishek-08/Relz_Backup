const embedArea = document.getElementById('embedArea');
const eventsEl = document.getElementById('events');
const statusEl = document.getElementById('status');

function appendEvent(o) {
  const d = document.createElement('div');
  d.textContent = `${new Date().toLocaleTimeString()} — ${JSON.stringify(o)}`;
  eventsEl.appendChild(d);
  eventsEl.scrollTop = eventsEl.scrollHeight;
}

function createWebview(src, preload) {
  const existing = embedArea.querySelector('webview');
  if (existing) existing.remove();

  const webview = document.createElement('webview');
  webview.setAttribute('src', src);
  webview.setAttribute('preload', preload);
  webview.setAttribute('allowpopups', '');
  webview.style.width = '100%';
  webview.style.height = '100%';
  embedArea.appendChild(webview);

  webview.addEventListener('dom-ready', () => {
    appendEvent({ type: 'dom-ready', src });
    try { webview.openDevTools(); } catch(e) {}
  });

  webview.addEventListener('ipc-message', (ev) => {
    if (ev && ev.args && ev.args.length > 0) {
      const payload = ev.args[0];
      appendEvent({ from: 'guest', payload });
      // map guest messages to embedded-event for main process
      if (payload && payload.event === 'guest-click') {
        window.electronAPI.sendEmbeddedEvent({ type: 'user-click', details: payload.data });
      }
      if (payload && payload.event === 'close-request') {
        handleClose();
      }
    }
  });

  webview.addEventListener('did-navigate', (e) => {
    appendEvent({ type: 'did-navigate', url: e.url });
  });

  webview.addEventListener('did-navigate-in-page', (e) => {
    appendEvent({ type: 'in-page-nav', url: e.url });
  });

  webview.addEventListener('destroyed', () => {
    appendEvent({ type: 'destroyed' });
    window.electronAPI.sendEmbeddedEvent({ type: 'closed' });
  });

  return webview;
}

function handleClose() {
  const w = embedArea.querySelector('webview');
  if (w) {
    w.remove();
    appendEvent({ type: 'host-closed-embed' });
    window.electronAPI.sendEmbeddedEvent({ type: 'closed' });
    statusEl.textContent = 'Embed closed';
  } else {
    appendEvent({ type: 'no-embed-to-close' });
  }
}

document.getElementById('openBtn').addEventListener('click', () => {
  createWebview('https://www.hackerrank.com/', './guest-preload.js');
  statusEl.textContent = 'HackerRank opened';
});

document.getElementById('openMockBtn').addEventListener('click', () => {
  createWebview('./mock-thirdparty.html', './guest-preload.js');
  statusEl.textContent = 'Mock opened';
});

document.getElementById('closeBtn').addEventListener('click', () => {
  handleClose();
});

if (window.electronAPI && window.electronAPI.onDisplayLog) {
  window.electronAPI.onDisplayLog((data) => {
    appendEvent({ from: 'main', data });
  });
}
