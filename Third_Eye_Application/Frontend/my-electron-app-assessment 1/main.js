const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

app.setPath("userData", path.join(__dirname, "user_data"));

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  mainWindow.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.handle("open-assessment", async (event, args) => {
  const assessmentUrl =
    args && args.url ? args.url : "https://www.youtube.com/";

  const assessmentWin = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "assessment-preload.js"),
      contextIsolation: true,
    },
  });

  assessmentWin.loadURL(assessmentUrl);

  assessmentWin.webContents.on("did-navigate", (e, url) => {
    mainWindow?.webContents.send("assessment-activity", {
      type: "navigate",
      url,
    });
  });

  assessmentWin.webContents.on("did-finish-load", () => {
    const title = assessmentWin.webContents.getTitle();
    mainWindow?.webContents.send("assessment-activity", {
      type: "loaded",
      title,
      url: assessmentWin.webContents.getURL(),
    });
  });

  assessmentWin.webContents.on(
    "did-start-navigation",
    (e, url, isInPlace, isMainFrame) => {
      mainWindow?.webContents.send("assessment-activity", {
        type: "start-navigation",
        url,
        isMainFrame,
      });
    }
  );

  assessmentWin.on("closed", () => {
    mainWindow?.webContents.send("assessment-activity", { type: "closed" });
  });

  return { status: "opened", url: assessmentUrl };
});
