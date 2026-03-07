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
const path   = require("path");
const fs     = require("fs");
const http   = require("http");

// ─── Constantes ───────────────────────────────────────────────────────────────
const isDev        = !app.isPackaged;
const DEV_URL      = "http://localhost:3000";
const NEXT_PORT    = 3131; // Puerto fijo para producción (diferente al dev)
const PROD_URL     = `http://localhost:${NEXT_PORT}`;

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
  : path.join(process.resourcesPath, "app", ".next", "standalone");

/** Ruta al server.js de Next.js standalone */
const SERVER_JS = STANDALONE_DIR
  ? path.join(STANDALONE_DIR, "server.js")
  : null;

// ─── Estado ───────────────────────────────────────────────────────────────────
let mainWindow  = null;
let serverChild = null;

// ─── Ventana principal ────────────────────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width:           1280,
    height:          800,
    minWidth:        900,
    minHeight:       600,
    title:           "Sistema Jurídico",
    icon:            path.join(__dirname, "icon.png"),
    backgroundColor: "#0F172A",  // mismo fondo que la app
    webPreferences: {
      preload:          path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration:  false,
      sandbox:          true,
    },
    show: false, // Se mostrará cuando el servidor esté listo
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
function waitForServer(url, retries = 40, delay = 500) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const check = () => {
      http.get(url, (res) => {
        if (res.statusCode < 500) {
          resolve();
        } else {
          retry();
        }
      }).on("error", retry);
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
      NODE_ENV:        "production",
      PORT:            String(NEXT_PORT),
      HOSTNAME:        "127.0.0.1",
      // Apuntar la DB a userData para persistencia entre actualizaciones
      DATABASE_URL:    `file:${path.join(app.getPath("userData"), "biblioteca.db")}`,
      // Archivos subidos → userData también
      UPLOAD_DIR:      path.join(app.getPath("userData"), "uploads"),
    };

    // Copiar DB si es la primera vez
    ensureDatabase(env.DATABASE_URL);

    serverChild = require("child_process").fork(SERVER_JS, [], {
      env,
      cwd:   STANDALONE_DIR,
      stdio: "pipe",
    });

    serverChild.stdout?.on("data", (d) => {
      const msg = d.toString().trim();
      if (msg) console.log("[Next.js]", msg);
    });

    serverChild.stderr?.on("data", (d) => {
      const msg = d.toString().trim();
      if (msg) console.error("[Next.js ERR]", msg);
    });

    serverChild.on("exit", (code) => {
      console.log(`[Next.js] Proceso terminado con código ${code}`);
      serverChild = null;
    });

    serverChild.on("error", reject);

    // Esperar que el servidor HTTP esté listo
    waitForServer(PROD_URL)
      .then(resolve)
      .catch(reject);
  });
}

// ─── Asegurar que exista la base de datos en userData ────────────────────────
function ensureDatabase(dbUrl) {
  // dbUrl tiene el formato "file:/path/to/db"
  const dbPath = dbUrl.replace("file:", "");
  const dbDir  = path.dirname(dbPath);

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
