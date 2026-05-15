import { contextBridge, ipcRenderer } from "electron";

const runtimeInfo = {
  appName: "Git 日报 Agent",
  runtime: "Electron",
  serviceStatus: "本地服务运行中",
  user: "demo",
};

contextBridge.exposeInMainWorld("dailyReportAgent", {
  getRuntimeInfo: () => runtimeInfo,
  projects: {
    list: () => ipcRenderer.invoke("projects:list"),
    add: () => ipcRenderer.invoke("projects:add"),
    updateSelection: (id: string, selected: boolean) =>
      ipcRenderer.invoke("projects:update-selection", id, selected),
    delete: (id: string) => ipcRenderer.invoke("projects:delete", id),
  },
  modelConfig: {
    get: () => ipcRenderer.invoke("model-config:get"),
    selectProvider: (providerId: string) =>
      ipcRenderer.invoke("model-config:select-provider", providerId),
    updateKey: (providerId: string, apiKey: string) =>
      ipcRenderer.invoke("model-config:update-key", providerId, apiKey),
  },
});
