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

  /** Guarda la URL del servidor remoto en userData (multi-computadora) */
  setRemoteUrl: (url) => ipcRenderer.invoke("set-remote-url", url),

  // ── Tema (dark / light) ──────────────────────────────────────────────────

  /**
   * Persiste la preferencia de tema en un archivo nativo.
   * El proceso principal lo lee al iniciar para sincronizar backgroundColor.
   * @param {boolean} isDark
   */
  saveTheme: (isDark) => ipcRenderer.invoke("save-theme", isDark),

  // ── Archivos ─────────────────────────────────────────────────────────────

  /**
   * Abre un archivo de upload (por URL path como "/uploads/expId/file.docx")
   * en la aplicación nativa del sistema (Word, Adobe Reader, etc.).
   * @param {string} urlPath  — ruta relativa del servidor, ej: "/uploads/abc/doc.docx"
   * @returns {Promise<{ok: boolean, error?: string}>}
   */
  openUploadFile: (urlPath) => ipcRenderer.invoke("open-upload-file", urlPath),

  /**
   * Abre un archivo por su ruta absoluta de sistema de archivos.
   * Útil para documentos Word vinculados por ruta absoluta (docPath).
   * @param {string} filePath  — ruta absoluta, ej: "C:/Usuarios/.../doc.docx"
   * @returns {Promise<{ok: boolean, error?: string}>}
   */
  openFilePath: (filePath) => ipcRenderer.invoke("open-file-path", filePath),

  /**
   * Abre un diálogo nativo para seleccionar un archivo .docx/.doc.
   * @returns {Promise<{ok: boolean, filePath?: string}>}
   */
  selectDocx: () => ipcRenderer.invoke("select-docx"),

  /**
   * Imprime un archivo cargando su URL en una ventana oculta de Electron
   * y disparando el diálogo de impresión del sistema.
   * @param {string} fileUrl  — URL completa, ej: "http://localhost:3131/uploads/..."
   * @returns {Promise<{ok: boolean, reason?: string, error?: string}>}
   */
  printFile: (fileUrl) => ipcRenderer.invoke("print-file", fileUrl),
});
