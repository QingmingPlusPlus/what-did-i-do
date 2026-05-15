import { useMemo, useState } from "react";
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
  mockProjects,
  mockProviders,
  type DateMode,
  type ReportState,
} from "@/mock/report";

const runtimeInfo = window.dailyReportAgent?.getRuntimeInfo() ?? {
  appName: "Git 日报 Agent",
  runtime: "Electron Mock",
  serviceStatus: "本地服务运行中",
  user: "demo",
};

function shiftDate(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

function App() {
  const [projects, setProjects] = useState(mockProjects);
  const [providerId, setProviderId] = useState(mockProviders[0].id);
  const [model, setModel] = useState(mockProviders[0].models[0]);
  const [apiKey, setApiKey] = useState("sk-mock-2026-daily-report");
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
    () => projects.filter((project) => project.selected).map((project) => project.name),
    [projects],
  );

  const report = useMemo(
    () => buildReportMarkdown(selectedProjects, gitUser, endDate),
    [selectedProjects, gitUser, endDate],
  );

  function showNotice(message: string) {
    setNotice(message);
  }

  function toggleProject(id: string) {
    setProjects((current) =>
      current.map((project) =>
        project.id === id ? { ...project, selected: !project.selected } : project,
      ),
    );
    showNotice("已更新 mock 项目范围");
  }

  function handleProviderChange(value: string) {
    const provider = mockProviders.find((item) => item.id === value) ?? mockProviders[0];
    setProviderId(provider.id);
    setModel(provider.models[0]);
    showNotice(`已切换到 ${provider.name} mock 配置`);
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
            onToggle={toggleProject}
            onAddProject={() => showNotice("添加项目是 mock 操作，后续会接入本地仓库选择")}
          />
          <AiConfigPanel
            providers={mockProviders}
            providerId={providerId}
            model={model}
            apiKey={apiKey}
            onProviderChange={handleProviderChange}
            onModelChange={(value) => {
              setModel(value);
              showNotice(`已选择模型 ${value}`);
            }}
            onApiKeyChange={(value) => {
              setApiKey(value);
              showNotice("API Key 已更新到本地 mock 状态");
            }}
            onAddProvider={() => showNotice("添加供应商是 mock 操作，当前不保存真实配置")}
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
