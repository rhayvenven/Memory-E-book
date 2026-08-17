const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const imageFolder = path.join(__dirname, "data", "images");
if (!fs.existsSync(imageFolder)) {
  fs.mkdirSync(imageFolder, { recursive: true });
}
ipcMain.handle("save-image", function (event, image) {
  const imagePath = path.join(imageFolder, image.name);
  fs.writeFileSync(imagePath, Buffer.from(image.data));
  console.log("Image saved!");
  console.log(imagePath);
  return imagePath;
});
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
  win.loadFile("html/index.html");
  win.webContents.openDevTools();
  win.setMenuBarVisibility(false);
};
app.whenReady().then(() => {
  createWindow();
});

ipcMain.on("save-memory", function (event, memory) {
  let memories = [];

  if (fs.existsSync(memoryFile)) {
    const data = fs.readFileSync(memoryFile, "utf8");

    if (data) {
      memories = JSON.parse(data);
    }
  }

  memories.push(memory);

  fs.writeFileSync(memoryFile, JSON.stringify(memories, null, 2));

  console.log("Memory saved!");
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
