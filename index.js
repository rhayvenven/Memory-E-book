const { app, BrowserWindow } = require("electron");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 500,
    height: 600,
  });
  win.loadFile("html/new_memory.html");
  win.setMenuBarVisibility(false);
};
app.whenReady().then(() => {
  createWindow();
});
