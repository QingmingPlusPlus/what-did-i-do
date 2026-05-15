import { useEffect, useMemo, useState } from "react";
import { AiConfigPanel } from "@/components/AiConfigPanel";
import { AppHeader } from "@/components/AppHeader";
import { DateRangePanel } from "@/components/DateRangePanel";
import { GitUserPanel } from "@/components/GitUserPanel";
import { ProjectSelector } from "@/components/ProjectSelector";
import { PromptPanel } from "@/components/PromptPanel";
import { ReportPreview } from "@/components/ReportPreview";
import {
  buildReportMarkdown,
  defaultPrompt,
  formatTimestamp,
  type DateMode,
  type Project,
  type ReportState,
} from "@/mock/report";

const runtimeInfo = window.dailyReportAgent?.getRuntimeInfo() ?? {
  appName: "Git 日报 Agent",
  runtime: "Electron",
  serviceStatus: "本地服务运行中",
  user: "demo",
};

const emptyModelConfig: DailyReportModelConfig = {
  selectedProviderId: "deepseek",
  providers: [],
};

function shiftDate(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectActionBusy, setProjectActionBusy] = useState(false);
  const [projectFeedback, setProjectFeedback] = useState<
    { tone: "error" | "info"; message: string } | undefined
  >();
  const [modelConfig, setModelConfig] = useState<DailyReportModelConfig>(emptyModelConfig);
  const [modelConfigLoading, setModelConfigLoading] = useState(true);
  const [modelConfigSaving, setModelConfigSaving] = useState(false);
  const [apiKeyDraft, setApiKeyDraft] = useState("");
  const [gitUser, setGitUser] = useState(runtimeInfo.user);
  const [dateMode, setDateMode] = useState<DateMode>("today");
  const [startDate, setStartDate] = useState("2025-05-29");
  const [endDate, setEndDate] = useState("2025-05-29");
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [notice, setNotice] = useState("已加载 mock 提交记录");
  const [reportState, setReportState] = useState<ReportState>({
    status: "generated",
    generatedAt: "2025-05-29 11:35:42",
  });

  const selectedProjects = useMemo(
    () =>
      projects
        .filter((project) => project.valid && project.selected)
        .map((project) => project.name),
    [projects],
  );

  const report = useMemo(
    () => buildReportMarkdown(selectedProjects, gitUser, endDate),
    [selectedProjects, gitUser, endDate],
  );

  function showNotice(message: string) {
    setNotice(message);
  }

  useEffect(() => {
    if (projectFeedback?.tone !== "error") {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setProjectFeedback(undefined);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [projectFeedback]);

  function applyProjectResult(result: DailyReportProjectResult, fallbackMessage: string) {
    setProjects(result.projects);
    showNotice(result.message ?? fallbackMessage);
  }

  function applyModelConfigResult(result: DailyReportModelConfigResult, fallbackMessage: string) {
    setModelConfig(result.config);
    const selectedProvider = result.config.providers.find(
      (provider) => provider.id === result.config.selectedProviderId,
    );
    setApiKeyDraft(selectedProvider?.apiKey ?? "");
    showNotice(result.message ?? fallbackMessage);
  }

  useEffect(() => {
    let ignore = false;

    async function loadProjects() {
      const api = window.dailyReportAgent?.projects;

      if (!api) {
        setProjectsLoading(false);
        setProjectFeedback({
          tone: "error",
          message: "未检测到 Electron 项目接口，请在桌面应用中使用项目管理",
        });
        showNotice("未检测到 Electron 项目接口，请在桌面应用中使用项目管理");
        return;
      }

      setProjectsLoading(true);

      try {
        const result = await api.list();

        if (!ignore) {
          setProjectFeedback(undefined);
          applyProjectResult(result, "已加载本地项目列表");
        }
      } catch {
        if (!ignore) {
          setProjectFeedback({ tone: "error", message: "读取本地项目列表失败" });
          showNotice("读取本地项目列表失败");
        }
      } finally {
        if (!ignore) {
          setProjectsLoading(false);
        }
      }
    }

    void loadProjects();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadModelConfig() {
      const api = window.dailyReportAgent?.modelConfig;

      if (!api) {
        setModelConfigLoading(false);
        showNotice("未检测到 Electron 模型供应商接口");
        return;
      }

      setModelConfigLoading(true);

      try {
        const result = await api.get();

        if (!ignore) {
          applyModelConfigResult(result, "已加载模型供应商配置");
        }
      } catch {
        if (!ignore) {
          showNotice("读取模型供应商配置失败");
        }
      } finally {
        if (!ignore) {
          setModelConfigLoading(false);
        }
      }
    }

    void loadModelConfig();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleAddProject() {
    const api = window.dailyReportAgent?.projects;

    if (!api) {
      setProjectFeedback({
        tone: "error",
        message: "未检测到 Electron 项目接口，请在桌面应用中添加项目",
      });
      showNotice("未检测到 Electron 项目接口，请在桌面应用中添加项目");
      return;
    }

    setProjectFeedback(undefined);
    setProjectActionBusy(true);

    try {
      const result = await api.add();
      if (!result.ok || result.status === "invalid" || result.status === "error") {
        setProjectFeedback({
          tone: "error",
          message: result.message ?? "添加失败：请选择包含直属 .git 目录的文件夹",
        });
      } else if (result.status === "duplicate") {
        setProjectFeedback({
          tone: "info",
          message: result.message ?? "该项目已存在",
        });
      } else {
        setProjectFeedback(undefined);
      }
      applyProjectResult(result, "项目操作已完成");
    } catch {
      setProjectFeedback({ tone: "error", message: "添加项目失败" });
      showNotice("添加项目失败");
    } finally {
      setProjectActionBusy(false);
    }
  }

  async function toggleProject(project: Project) {
    const api = window.dailyReportAgent?.projects;
    setProjectFeedback(undefined);

    if (!project.valid) {
      showNotice("项目已失效，缺少 .git 目录");
      return;
    }

    if (!api) {
      showNotice("未检测到 Electron 项目接口，无法保存项目范围");
      return;
    }

    setProjectActionBusy(true);

    try {
      const result = await api.updateSelection(project.id, !project.selected);
      applyProjectResult(result, "项目范围已更新");
    } catch {
      showNotice("更新项目范围失败");
    } finally {
      setProjectActionBusy(false);
    }
  }

  async function handleDeleteProject(id: string) {
    const api = window.dailyReportAgent?.projects;
    setProjectFeedback(undefined);

    if (!api) {
      showNotice("未检测到 Electron 项目接口，无法删除项目");
      return;
    }

    setProjectActionBusy(true);

    try {
      const result = await api.delete(id);
      applyProjectResult(result, "项目已删除");
    } catch {
      showNotice("删除项目失败");
    } finally {
      setProjectActionBusy(false);
    }
  }

  async function handleModelProviderChange(value: string) {
    const api = window.dailyReportAgent?.modelConfig;
    const provider = modelConfig.providers.find((item) => item.id === value);

    if (!provider) {
      showNotice("暂不支持该模型供应商");
      return;
    }

    if (!api) {
      showNotice("未检测到 Electron 模型供应商接口");
      return;
    }

    setModelConfigSaving(true);

    try {
      const result = await api.selectProvider(provider.id);
      applyModelConfigResult(result, `已切换到 ${provider.name}`);
    } catch {
      showNotice("切换模型供应商失败");
    } finally {
      setModelConfigSaving(false);
    }
  }

  async function handleSaveModelConfig() {
    const api = window.dailyReportAgent?.modelConfig;
    const providerId = modelConfig.selectedProviderId;

    if (!api) {
      showNotice("未检测到 Electron 模型供应商接口");
      return;
    }

    setModelConfigSaving(true);

    try {
      const result = await api.updateKey(providerId, apiKeyDraft);
      applyModelConfigResult(result, "模型供应商配置已保存");
    } catch {
      showNotice("保存模型供应商配置失败");
    } finally {
      setModelConfigSaving(false);
    }
  }

  function handleQuickRange(range: "yesterday" | "7d" | "30d") {
    setDateMode("custom");

    if (range === "yesterday") {
      const day = shiftDate(1);
      setStartDate(day);
      setEndDate(day);
      showNotice("已切换到昨日范围");
      return;
    }

    const days = range === "7d" ? 6 : 29;
    setStartDate(shiftDate(days));
    setEndDate(shiftDate(0));
    showNotice(range === "7d" ? "已切换到近7天" : "已切换到近30天");
  }

  function simulateGenerate(message: string) {
    setReportState((current) => ({ ...current, status: "generating" }));
    showNotice(message);

    window.setTimeout(() => {
      setReportState({ status: "generated", generatedAt: formatTimestamp() });
      showNotice("mock 日报已生成");
    }, 650);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader
        runtime={runtimeInfo.runtime}
        serviceStatus={runtimeInfo.serviceStatus}
        user={runtimeInfo.user}
      />

      <main className="grid gap-5 px-6 py-5 xl:grid-cols-[1.15fr_1fr]">
        <section className="space-y-0 overflow-hidden rounded-lg border border-border bg-card shadow-panel">
          <ProjectSelector
            projects={projects}
            isLoading={projectsLoading}
            isBusy={projectActionBusy}
            feedback={projectFeedback}
            onToggle={toggleProject}
            onAddProject={() => void handleAddProject()}
            onDeleteProject={(id) => void handleDeleteProject(id)}
          />
          <AiConfigPanel
            providers={modelConfig.providers}
            providerId={modelConfig.selectedProviderId}
            apiKey={apiKeyDraft}
            isLoading={modelConfigLoading}
            isSaving={modelConfigSaving}
            onProviderChange={(value) => void handleModelProviderChange(value)}
            onApiKeyChange={(value) => {
              setApiKeyDraft(value);
            }}
            onSave={() => void handleSaveModelConfig()}
          />
          <div className="grid md:grid-cols-2">
            <GitUserPanel
              gitUser={gitUser}
              onGitUserChange={(value) => {
                setGitUser(value);
                showNotice("Git 用户名已通过 mock 校验");
              }}
            />
            <DateRangePanel
              mode={dateMode}
              startDate={startDate}
              endDate={endDate}
              onModeChange={(mode) => {
                setDateMode(mode);
                showNotice(mode === "today" ? "已切换到今日" : "已切换到自定义范围");
              }}
              onStartDateChange={(value) => {
                setStartDate(value);
                setDateMode("custom");
                showNotice("开始日期已更新");
              }}
              onEndDateChange={(value) => {
                setEndDate(value);
                setDateMode("custom");
                showNotice("结束日期已更新");
              }}
              onQuickRange={handleQuickRange}
            />
          </div>
          <PromptPanel
            prompt={prompt}
            onPromptChange={(value) => {
              setPrompt(value);
              showNotice("提示词已更新");
            }}
            onUseTemplate={() => {
              setPrompt(defaultPrompt);
              showNotice("已应用默认提示词模板");
            }}
            onGenerate={() => simulateGenerate("正在使用 mock Git 记录生成日报")}
            isGenerating={reportState.status === "generating"}
          />
        </section>

        <section className="space-y-3">
          <ReportPreview
            report={report}
            reportState={reportState}
            onCopy={() => {
              void navigator.clipboard?.writeText(report).catch(() => undefined);
              showNotice("日报内容已复制到 mock 剪贴板反馈");
            }}
            onExport={() => showNotice("Markdown 导出已完成 mock 反馈，未创建真实文件")}
            onRegenerate={() => simulateGenerate("正在重新生成 mock 日报")}
          />
          <div className="rounded-md border border-border bg-card px-4 py-3 text-sm text-slate-600 shadow-sm">
            {notice}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
