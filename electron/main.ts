import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import {
  getModelConfig,
  selectModelProvider,
  updateModelProviderKey,
} from "./model-config-store";
import {
  chooseAndAddProject,
  deleteProject,
  listProjects,
  updateProjectSelection,
} from "./project-store";

const devServerUrl = "http://127.0.0.1:5173";

function registerProjectHandlers() {
  ipcMain.handle("projects:list", () => listProjects());
  ipcMain.handle("projects:add", (event) =>
    chooseAndAddProject(BrowserWindow.fromWebContents(event.sender) ?? undefined),
  );
  ipcMain.handle("projects:update-selection", (_event, id: string, selected: boolean) =>
    updateProjectSelection(id, selected),
  );
  ipcMain.handle("projects:delete", (_event, id: string) => deleteProject(id));
}

function registerModelConfigHandlers() {
  ipcMain.handle("model-config:get", () => getModelConfig());
  ipcMain.handle("model-config:select-provider", (_event, providerId: string) =>
    selectModelProvider(providerId),
  );
  ipcMain.handle("model-config:update-key", (_event, providerId: string, apiKey: string) =>
    updateModelProviderKey(providerId, apiKey),
  );
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1480,
    height: 840,
    minWidth: 1040,
    minHeight: 720,
    title: "Git 日报 Agent",
    backgroundColor: "#f8fafc",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  if (!app.isPackaged) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(() => {
  registerProjectHandlers();
  registerModelConfigHandlers();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
