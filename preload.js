const { contextBridge, ipcRenderer } = require("electron");
const { pathToFileURL } = require("url");

contextBridge.exposeInMainWorld("memoryAPI", {
  saveMemory(memory) {
    ipcRenderer.send("save-memory", memory);
  },
  loadMemories() {
    return ipcRenderer.invoke("load-memories");
  },
  saveImage(image) {
    return ipcRenderer.invoke("save-image", image);
  },
  toFileUrl(filePath) {
    let normalized = filePath.replace(/\\/g, "/");
    if (!normalized.startsWith("/")) {
      normalized = "/" + normalized;
    }
    return "file://" + encodeURI(normalized);
  },
});
