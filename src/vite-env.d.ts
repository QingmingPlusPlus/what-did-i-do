/// <reference types="vite/client" />

interface DailyReportRuntimeInfo {
  appName: string;
  runtime: string;
  serviceStatus: string;
  user: string;
}

interface Window {
  dailyReportAgent?: {
    getRuntimeInfo: () => DailyReportRuntimeInfo;
  };
}
