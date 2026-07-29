const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const memoryFile = path.join(__dirname, "data", "memories.json");
const createWindow = () => {
  const win = new BrowserWindow({
    width: 500,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });
  win.loadFile("html/memories.html");
  win.webContents.openDevTools();
  win.setMenuBarVisibility(false);
};
app.whenReady().then(() => {
  createWindow();
});

ipcMain.on("save-memory", (event, memory) => {
  console.log("Memory received!");
  console.log(memory);
});

ipcMain.handle("load-memories", function () {
  if (!fs.existsSync(memoryFile)) {
    return [];
  }
  const data = fs.readFileSync(memoryFile, "utf8");

  if (!data) {
    return [];
  }

  return JSON.parse(data);
});
