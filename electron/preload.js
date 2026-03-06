/**
 * electron/preload.js — Script de precarga de Electron
 * Expone una API segura al renderer mediante contextBridge.
 * No se expone Node.js directamente (sandbox: true).
 */

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  /** Abre la carpeta de datos del usuario en el explorador */
  openUserData: () => ipcRenderer.invoke("open-user-data"),

  /** Devuelve la versión de la aplicación */
  getVersion: () => ipcRenderer.invoke("get-version"),

  /** Indica que estamos dentro de Electron (para feature detection) */
  isElectron: true,
});
