/// <reference types="vite/client" />

interface DailyReportRuntimeInfo {
  appName: string;
  runtime: string;
  serviceStatus: string;
  user: string;
}

interface DailyReportProject {
  id: string;
  name: string;
  path: string;
  selected: boolean;
  valid: boolean;
  createdAt: string;
  updatedAt: string;
}

type DailyReportProjectStatus =
  | "success"
  | "added"
  | "duplicate"
  | "cancelled"
  | "invalid"
  | "not-found"
  | "error";

interface DailyReportProjectResult {
  ok: boolean;
  status: DailyReportProjectStatus;
  projects: DailyReportProject[];
  project?: DailyReportProject;
  message?: string;
}

type DailyReportModelProviderId = "deepseek" | "opencodego";

interface DailyReportModelProvider {
  id: DailyReportModelProviderId;
  name: string;
  apiKey: string;
  configured: boolean;
  updatedAt?: string;
}

type DailyReportModelConfigStatus = "success" | "invalid-provider" | "error";

interface DailyReportModelConfig {
  selectedProviderId: DailyReportModelProviderId;
  providers: DailyReportModelProvider[];
}

interface DailyReportModelConfigResult {
  ok: boolean;
  status: DailyReportModelConfigStatus;
  config: DailyReportModelConfig;
  message?: string;
}

interface Window {
  dailyReportAgent?: {
    getRuntimeInfo: () => DailyReportRuntimeInfo;
    projects?: {
      list: () => Promise<DailyReportProjectResult>;
      add: () => Promise<DailyReportProjectResult>;
      updateSelection: (id: string, selected: boolean) => Promise<DailyReportProjectResult>;
      delete: (id: string) => Promise<DailyReportProjectResult>;
    };
    modelConfig?: {
      get: () => Promise<DailyReportModelConfigResult>;
      selectProvider: (providerId: string) => Promise<DailyReportModelConfigResult>;
      updateKey: (providerId: string, apiKey: string) => Promise<DailyReportModelConfigResult>;
    };
  };
}
