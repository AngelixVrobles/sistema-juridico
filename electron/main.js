/**
 * electron/main.js — Proceso principal de Electron
 * Inicia el servidor Next.js standalone y carga la app en una ventana nativa.
 *
 * Modos:
 *  - Desarrollo: conecta directo a http://localhost:3000 (Next.js dev server)
 *  - Producción: fork del servidor standalone de Next.js en un puerto libre
 */

const { app, BrowserWindow, shell, dialog, ipcMain, Menu } = require("electron");

// Eliminar el menú nativo de Electron para una apariencia profesional
Menu.setApplicationMenu(null);
const path = require("path");
const fs = require("fs");
const http = require("http");

// ─── Constantes ───────────────────────────────────────────────────────────────
const isDev = !app.isPackaged;
const DEV_URL = "http://localhost:3000";
const NEXT_PORT = 3131; // Puerto fijo para producción (diferente al dev)
const PROD_URL = `http://localhost:${NEXT_PORT}`;

/**
 * Lee la URL del servidor remoto desde la configuración persistida en localStorage.
 * El archivo de settings de Zustand (persist middleware) se guarda como
 * "juridico-settings" en el localStorage del renderer. Aquí lo leemos
 * desde un JSON local en userData como alternativa para Electron.
 *
 * ARQUITECTURA MULTI-COMPUTADORA:
 *  - Mac (servidor principal): deja serverUrl vacío → arranca servidor local.
 *  - Windows (cliente): configura serverUrl en Configuración → apunta a la Mac.
 */
function readRemoteServerUrl() {
  try {
    const settingsPath = path.join(app.getPath("userData"), "juridico-remote.json");
    if (fs.existsSync(settingsPath)) {
      const data = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
      if (data && typeof data.serverUrl === "string" && data.serverUrl.trim()) {
        return data.serverUrl.trim().replace(/\/$/, "");
      }
    }
  } catch { /* ignorar errores de lectura */ }
  return null;
}

/** Ruta al servidor standalone empaquetado */
const STANDALONE_DIR = isDev
  ? null
  : path.join(process.resourcesPath, "app");

/** Ruta al server.js de Next.js standalone */
const SERVER_JS = STANDALONE_DIR
  ? path.join(STANDALONE_DIR, "server.js")
  : null;

// ─── Persistencia del tema (dark/light) en archivo nativo ────────────────────
// Guardamos el tema en un JSON en userData para que el proceso principal lo lea
// ANTES de crear la ventana y así sincronizar backgroundColor sin flash.

const THEME_FILE = () => path.join(app.getPath("userData"), "juridico-theme.json");

function readThemePreference() {
  try {
    const p = THEME_FILE();
    if (fs.existsSync(p)) {
      const d = JSON.parse(fs.readFileSync(p, "utf8"));
      if (typeof d.darkMode === "boolean") return d.darkMode;
    }
  } catch { /* ignorar */ }
  return false; // por defecto modo claro
}

function writeThemePreference(isDark) {
  try {
    fs.writeFileSync(THEME_FILE(), JSON.stringify({ darkMode: !!isDark }), "utf8");
  } catch { /* ignorar */ }
}

// ─── Estado ───────────────────────────────────────────────────────────────────
let mainWindow = null;
let serverChild = null;

// ─── Ventana principal ────────────────────────────────────────────────────────
function createWindow() {
  // Leer preferencia de tema ANTES de crear la ventana para evitar flash
  const darkMode = readThemePreference();
  const bgColor  = darkMode ? "#1C1C1E" : "#F2F3F0";

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: "Sistema Jurídico",
    icon: isDev
      ? path.join(__dirname, "resources", "icon.ico")
      : path.join(process.resourcesPath, "icon.ico"),
    backgroundColor: bgColor,  // sincronizado con el tema guardado
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    show: false, // Se mostrará cuando el contenido esté listo (ready-to-show)
  });

  // Abrir links externos en el navegador del sistema, no en Electron
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http://localhost")) return { action: "allow" };
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.once("ready-to-show", () => mainWindow.show());

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// ─── Esperar que el servidor HTTP responda ────────────────────────────────────
function waitForServer(url, retries = 60, delay = 1000) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const check = () => {
      const req = http.get(url, (res) => {
        if (res.statusCode < 500) {
          resolve();
        } else {
          retry();
        }
        res.resume();
      });
      req.on("error", retry);
      req.setTimeout(3000, () => { req.destroy(); retry(); });
    };

    const retry = () => {
      attempts++;
      if (attempts >= retries) {
        reject(new Error(`Servidor no respondió en ${url} después de ${retries} intentos`));
        return;
      }
      setTimeout(check, delay);
    };

    check();
  });
}

// ─── Iniciar servidor Next.js standalone ─────────────────────────────────────
function startNextServer() {
  return new Promise((resolve, reject) => {
    if (!SERVER_JS || !fs.existsSync(SERVER_JS)) {
      reject(new Error(`server.js no encontrado en: ${SERVER_JS}`));
      return;
    }

    // Variables de entorno para el servidor
    const env = {
      ...process.env,
      NODE_ENV: "production",
      PORT: String(NEXT_PORT),
      HOSTNAME: "127.0.0.1",
      DATABASE_URL: `file:${path.join(app.getPath("userData"), "biblioteca.db")}`,
      UPLOAD_DIR: path.join(app.getPath("userData"), "uploads"),
      // Permite que Electron actúe como Node.js puro para resolución de módulos
      ELECTRON_RUN_AS_NODE: "1",
      NODE_PATH: path.join(STANDALONE_DIR, "node_modules"),
    };

    // Copiar DB si es la primera vez
    ensureDatabase(env.DATABASE_URL);

    let serverError = null;

    // spawn() con ELECTRON_RUN_AS_NODE=1: el proceso hijo resuelve módulos
    // desde su propio directorio (resources/app/node_modules/next)
    serverChild = require("child_process").spawn(process.execPath, [SERVER_JS], {
      env,
      cwd: STANDALONE_DIR,
      stdio: "pipe",
    });

    serverChild.stdout?.on("data", (d) => {
      const msg = d.toString().trim();
      if (msg) console.log("[Next.js]", msg);
    });

    serverChild.stderr?.on("data", (d) => {
      const msg = d.toString().trim();
      if (msg) {
        console.error("[Next.js ERR]", msg);
        serverError = msg;
      }
    });

    serverChild.on("exit", (code) => {
      console.log(`[Next.js] Proceso terminado con código ${code}`);
      serverChild = null;
      if (code !== 0 && code !== null) {
        reject(new Error(
          `El servidor terminó inesperadamente (código ${code}).` +
          (serverError ? `\n\n${serverError}` : "")
        ));
      }
    });

    serverChild.on("error", (err) => {
      reject(new Error(`No se pudo iniciar el servidor: ${err.message}`));
    });

    // Esperar que el servidor HTTP esté listo
    waitForServer(PROD_URL, 60, 1000)
      .then(resolve)
      .catch((err) => reject(new Error(
        err.message + (serverError ? `\n\n${serverError}` : "")
      )));
  });
}

// ─── Asegurar que exista la base de datos en userData ────────────────────────
function ensureDatabase(dbUrl) {
  // dbUrl tiene el formato "file:/path/to/db"
  const dbPath = dbUrl.replace("file:", "");
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Si la DB no existe, copiar la DB empaquetada (seed incluido)
  if (!fs.existsSync(dbPath)) {
    const bundledDb = path.join(process.resourcesPath, "app", "prisma", "biblioteca.db");
    if (fs.existsSync(bundledDb)) {
      fs.copyFileSync(bundledDb, dbPath);
      console.log(`[DB] Base de datos copiada a: ${dbPath}`);
    } else {
      console.warn(`[DB] No se encontró la DB empaquetada en: ${bundledDb}`);
    }
  }
}

// ─── App lifecycle ────────────────────────────────────────────────────────────
app.whenReady().then(async () => {
  createWindow();

  try {
    if (isDev) {
      // En desarrollo, simplemente esperar al servidor de Next.js
      console.log("[Electron] Modo desarrollo — conectando a", DEV_URL);
      await waitForServer(DEV_URL, 60, 1000);
      mainWindow?.loadURL(DEV_URL);
    } else {
      // Verificar si hay una URL de servidor remoto configurada (modo cliente — Windows)
      const remoteUrl = readRemoteServerUrl();
      if (remoteUrl) {
        console.log("[Electron] Modo CLIENTE — conectando al servidor remoto:", remoteUrl);
        await waitForServer(remoteUrl, 20, 1000);
        mainWindow?.loadURL(remoteUrl);
      } else {
        // En producción sin servidor remoto, iniciar el servidor local (modo servidor — Mac)
        console.log("[Electron] Modo producción (servidor local) — iniciando Next.js...");
        await startNextServer();
        mainWindow?.loadURL(PROD_URL);
      }
    }
  } catch (err) {
    console.error("[Electron] Error al iniciar:", err);
    dialog.showErrorBox(
      "Error al iniciar el Sistema Jurídico",
      `No se pudo conectar al servidor.\n\nDetalle: ${err.message}\n\nIntenta reiniciar la aplicación.`
    );
    app.quit();
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  if (serverChild) {
    console.log("[Electron] Cerrando servidor Next.js...");
    serverChild.kill("SIGTERM");
    serverChild = null;
  }
});

// ─── IPC: Abrir carpeta de datos del usuario ──────────────────────────────────
ipcMain.handle("open-user-data", () => {
  shell.openPath(app.getPath("userData"));
});

ipcMain.handle("get-version", () => app.getVersion());

/**
 * Guarda la URL del servidor remoto en userData para que el proceso principal
 * pueda leerla al iniciar la app (usado en modo multi-computadora).
 * Llamar desde la página de Configuración después de cambiar serverUrl.
 */
ipcMain.handle("set-remote-url", (_event, url) => {
  try {
    const settingsPath = path.join(app.getPath("userData"), "juridico-remote.json");
    fs.writeFileSync(settingsPath, JSON.stringify({ serverUrl: url || "" }), "utf8");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

// ─── IPC: Guardar preferencia de tema (modo oscuro / claro) ──────────────────
// Se llama desde ThemeProvider cada vez que el usuario cambia el tema.
// Persiste en un archivo nativo para que createWindow() pueda leerlo al
// arrancar y sincronizar backgroundColor antes de mostrar la ventana.
ipcMain.handle("save-theme", (_event, isDark) => {
  try {
    writeThemePreference(!!isDark);
    // Actualizar el color de fondo de la ventana actual en caliente
    if (mainWindow) {
      mainWindow.setBackgroundColor(isDark ? "#1C1C1E" : "#F2F3F0");
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

// ─── IPC: Abrir archivo de upload en su aplicación nativa ────────────────────
// urlPath: ruta URL relativa como "/uploads/{expId}/file.docx"
// Resuelve al path de sistema y abre con shell.openPath (Word, visor PDF, etc.)
ipcMain.handle("open-upload-file", async (_event, urlPath) => {
  try {
    const rel      = urlPath.startsWith("/") ? urlPath.slice(1) : urlPath;
    const baseDir  = isDev ? path.join(__dirname, "..") : STANDALONE_DIR;
    const filePath = path.join(baseDir, "public", rel);
    const result   = await shell.openPath(filePath);
    // shell.openPath devuelve cadena vacía en éxito, o mensaje de error
    return result ? { ok: false, error: result } : { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

// ─── IPC: Abrir diálogo para seleccionar un .docx ────────────────────────────
// Retorna la ruta absoluta del archivo seleccionado, o { ok: false } si cancela.
ipcMain.handle("select-docx", async () => {
  if (!mainWindow) return { ok: false };
  const result = await dialog.showOpenDialog(mainWindow, {
    title:      "Seleccionar documento Word",
    filters:    [{ name: "Documentos Word", extensions: ["docx", "doc"] }],
    properties: ["openFile"],
  });
  if (result.canceled || result.filePaths.length === 0) return { ok: false };
  return { ok: true, filePath: result.filePaths[0] };
});

// ─── IPC: Abrir archivo por ruta absoluta de sistema ─────────────────────────
// Usado para abrir documentos Word vinculados por ruta absoluta (docPath).
ipcMain.handle("open-file-path", async (_event, filePath) => {
  try {
    const result = await shell.openPath(filePath);
    return result ? { ok: false, error: result } : { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

// ─── IPC: Imprimir archivo por URL ───────────────────────────────────────────
// Carga el archivo en una BrowserWindow oculta y lanza el diálogo de impresión.
// fileUrl: URL completa como "http://localhost:3131/uploads/{expId}/file.pdf"
ipcMain.handle("print-file", (_event, fileUrl) => {
  return new Promise((resolve) => {
    const printWin = new BrowserWindow({
      show: false,
      webPreferences: { nodeIntegration: false, contextIsolation: true },
    });

    printWin.loadURL(fileUrl);

    printWin.webContents.once("did-finish-load", () => {
      printWin.webContents.print(
        { silent: false, printBackground: true },
        (success, reason) => {
          printWin.close();
          resolve({ ok: success, reason: reason || "" });
        }
      );
    });

    printWin.webContents.on("did-fail-load", (_e, _code, desc) => {
      printWin.close();
      resolve({ ok: false, error: `No se pudo cargar el archivo: ${desc}` });
    });
  });
});
