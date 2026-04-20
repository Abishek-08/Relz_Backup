const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true
    }
  });

  win.loadFile('index.html');

  // Listen for messages from renderer
  ipcMain.on('third-party-event', (event, data) => {
    console.log('Received event from webview:', data);
    win.webContents.send('display-log', data);
  });

  // Monitor network requests as a fallback (detect navigations or API calls)
  const filter = { urls: ['*://*.hackerrank.com/*'] };
  session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
    // send to renderer when hackerrank network activity is observed
    win.webContents.send('display-log', { type: 'network', url: details.url });
    callback({});
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
