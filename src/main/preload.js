const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("laceria", {
  // Rules
  getRules: () => ipcRenderer.invoke("rules:getAll"),
  saveRule: (rule) => ipcRenderer.invoke("rules:save", rule),
  deleteRule: (id) => ipcRenderer.invoke("rules:delete", id),
  toggleRule: (id) => ipcRenderer.invoke("rules:toggle", id),

  // Watcher
  pauseWatchers: () => ipcRenderer.invoke("watcher:pause"),
  resumeWatchers: () => ipcRenderer.invoke("watcher:resume"),

  // Settings
  getLoginItem: () => ipcRenderer.invoke("settings:getLoginItem"),
  setLoginItem: (enable) => ipcRenderer.invoke("settings:setLoginItem", enable),

  // Dialog
  selectFolder: () => ipcRenderer.invoke("dialog:selectFolder"),
  checkPath: (p) => ipcRenderer.invoke("dialog:checkPath", p),

  // Language
  setLanguage: (lang) => ipcRenderer.invoke("settings:setLanguage", lang),

  // Notifications from main process
  onNotification: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on("notification", handler);
    return () => ipcRenderer.removeListener("notification", handler);
  },
});
