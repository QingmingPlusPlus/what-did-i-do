import { contextBridge } from "electron";

const runtimeInfo = {
  appName: "Git 日报 Agent",
  runtime: "Electron Mock",
  serviceStatus: "本地服务运行中",
  user: "demo",
};

contextBridge.exposeInMainWorld("dailyReportAgent", {
  getRuntimeInfo: () => runtimeInfo,
});
