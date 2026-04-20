const { app, BrowserWindow, ipcMain, session } = require("electron");
let mainWindow;
let authWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: __dirname + "/preload.js",
      contextIsolation: true,
    },
  });

  mainWindow.loadFile("index.html");
}

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

ipcMain.handle("open-google-login", async () => {
  return new Promise((resolve) => {
    authWindow = new BrowserWindow({
      width: 600,
      height: 700,
      parent: mainWindow,
      modal: true,
      webPreferences: { nodeIntegration: false },
    });

    const loginUrl = "https://accounts.google.com/signin/v2/identifier";

    authWindow.loadURL(loginUrl);

    authWindow.webContents.on("did-navigate", async (_, url) => {
      // Detect successful Google login by domain
      if (
        url.includes("myaccount.google.com") ||
        url.includes("mail.google.com")
      ) {
        console.log("Google login detected ✅");
        authWindow.close();
        resolve(true);
      }
    });

    authWindow.on("closed", () => resolve(false));
  });
});

// Open HackerRank or LeetCode in a shared-session BrowserWindow
ipcMain.handle("open-platform", async (_, platform) => {
  const urls = {
    hackerrank: "https://www.hackerrank.com/auth/login",
    leetcode: "https://leetcode.com/accounts/login/",
  };

  const platformWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    parent: mainWindow,
    webPreferences: {
      partition: null, // Use the same default session
    },
  });

  platformWindow.loadURL(urls[platform]);
});
