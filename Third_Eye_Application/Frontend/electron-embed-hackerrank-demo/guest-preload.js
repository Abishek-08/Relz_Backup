// Runs inside the guest (webview) context.
// It forwards clicks, fetch/XHR and a close-request to the host via sendToHost.
const { ipcRenderer } = require('electron');

function sendToHostSafe(payload) {
  try { ipcRenderer.sendToHost(payload); } catch (e) { /* ignore */ }
}

console.log('guest-preload: loaded');

window.addEventListener('click', (e) => {
  try {
    const el = e.target;
    const info = {
      event: 'guest-click',
      data: {
        tag: el.tagName,
        id: el.id || null,
        classes: el.className || null,
        text: (el.innerText || el.textContent || '').trim().slice(0,150),
        href: el.href || null,
        time: Date.now()
      }
    };
    sendToHostSafe(info);
  } catch (err) { /* noop */ }
}, true);

// expose a guest API to request host to close embed (if guest can call it)
window.requestEmbedClose = function() {
  sendToHostSafe({ event: 'close-request' });
};

// intercept fetch/xhr as additional signals
(function(){
  const origFetch = window.fetch;
  if (origFetch) {
    window.fetch = function(...args){
      try { sendToHostSafe({ event: 'fetch', args: args, time: Date.now() }); } catch(e){}
      return origFetch.apply(this, args);
    };
  }
  const XHR = window.XMLHttpRequest;
  if (XHR) {
    const origOpen = XHR.prototype.open;
    XHR.prototype.open = function(method, url, ...rest){
      try { sendToHostSafe({ event: 'xhr-open', method, url, time: Date.now() }); } catch(e){}
      return origOpen.apply(this, [method, url, ...rest]);
    };
  }
})();
