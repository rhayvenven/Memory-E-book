const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("memoryAPI", {
  saveMemory(memory) {
    ipcRenderer.send("save-memory", memory);
  },
});
