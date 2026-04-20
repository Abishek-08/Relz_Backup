const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true // <-- enable <webview> tag
    },
  });

  win.loadFile("index.html");

  ipcMain.on("third-party-event", (event, data) => {
    console.log("Received event from 3rd-party app:", data);
    win.webContents.send("display-log", data);
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
