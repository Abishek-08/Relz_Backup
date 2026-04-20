const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');

function createWindow(){
  const win = new BrowserWindow({
    width: 1200, height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true
    }
  });

  win.loadFile('index.html');
  // Auto-open devtools for easier debugging on Ubuntu
  win.webContents.openDevTools({ mode: 'detach' });

  // Listen for events forwarded from renderer
  ipcMain.on('embedded-event', (ev, payload) => {
    console.log('[main] embedded-event ->', payload);
    // broadcast back to renderer for display
    win.webContents.send('display-log', payload);
  });

  // Optional network fallback for hackerank - log network calls to renderer
  const filter = { urls: ['*://*.hackerrank.com/*'] };
  session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
    win.webContents.send('display-log', { type: 'network', url: details.url });
    callback({});
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
