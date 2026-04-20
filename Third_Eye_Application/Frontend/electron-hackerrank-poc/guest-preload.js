// This preload runs inside the webview's guest page context.
// It attempts to attach click listeners to the page to forward events to the host.
// NOTE: Some large sites may change DOM structure — listeners are best-effort.
const { ipcRenderer } = require('electron');

function sendHost(payload){
  try {
    ipcRenderer.sendToHost(payload);
  } catch (e) {
    // ignore
  }
}

// Try delegation for clicks on buttons
window.addEventListener('click', (e) => {
  try {
    const el = e.target;
    // send basic info: tag, id, classes, text snippet, href if any
    const info = {
      type: 'dom-click',
      tag: el.tagName,
      id: el.id || null,
      classes: el.className || null,
      text: (el.innerText || el.textContent || '').trim().slice(0,80),
      href: el.href || null,
      time: Date.now()
    };
    sendHost(info);
  } catch (err) {
    // noop
  }
}, true);

// Also observe XHR/fetch calls in the guest page as another signal
(function(){
  const origFetch = window.fetch;
  if (origFetch) {
    window.fetch = function(...args){
      sendHost({ type: 'fetch', args: args, time: Date.now() });
      return origFetch.apply(this, args);
    };
  }
  const XHR = window.XMLHttpRequest;
  if (XHR) {
    const origOpen = XHR.prototype.open;
    XHR.prototype.open = function(method, url, ...rest){
      sendHost({ type: 'xhr-open', method, url, time: Date.now() });
      return origOpen.apply(this, [method, url, ...rest]);
    };
  }
})();
