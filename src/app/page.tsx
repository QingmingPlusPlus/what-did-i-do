"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { ProjectSection } from "@/components/ProjectSection";
import { AIConfigSection } from "@/components/AIConfigSection";
import { GitUserSection } from "@/components/GitUserSection";
import { TimeRangeSection } from "@/components/TimeRangeSection";
import { PromptSection } from "@/components/PromptSection";
import { ReportPreview } from "@/components/ReportPreview";
import { AddProjectModal } from "@/components/AddProjectModal";
import { AddSupplierModal } from "@/components/AddSupplierModal";

const MOCK_PROJECTS = [
  { id: "project-a", name: "project-a", selected: true },
  { id: "project-b", name: "project-b", selected: true },
  { id: "project-c", name: "project-c", selected: false },
  { id: "project-d", name: "project-d", selected: false },
  { id: "tools", name: "tools", selected: false },
];

const MOCK_SUPPLIERS = [
  { id: "openai", name: "OpenAI" },
  { id: "anthropic", name: "Anthropic" },
  { id: "deepseek", name: "DeepSeek" },
];

const MOCK_MODELS = [
  { id: "gpt-4.1", name: "gpt-4.1" },
  { id: "gpt-4o", name: "gpt-4o" },
  { id: "claude-3.5", name: "claude-3.5-sonnet" },
  { id: "deepseek-chat", name: "deepseek-chat" },
];

const MOCK_REPORT = `# 2025-05-29 工作日报（周四）

涉及项目：project-a、project-b ｜ Git 用户：demo

## 今日工作概览

今日主要围绕项目功能优化与缺陷修复展开，完成了核心模块的优化与接口联调工作，
同时新增了文档与单元测试，整体进展顺利。

## 项目进展

- project-a：完成用户权限模块优化，新增角色批量分配能力。
- project-b：修复搜索导出功能，支持多条件筛选。

## 提交记录汇总

### project-a（5 次提交）
- feat(auth)：优化权限校验逻辑
- fix：修复接口超时不生效问题
- test：补充权限相关单元测试
- docs：更新权限相关文档

### project-b（4 次提交）
- feat(export)：导出功能支持 Excel/CSV
- refactor：清理多余样式与冗余请求
- refactor：优化筛选条件查询逻辑
- docs：更新导出功能使用说明

## 风险与待办

- project-a：异步加载在大数据量场景下性能仍需验证。
- project-b：关联表数据的并发更新需进一步评估。
- 明日计划：完善 export 的权限校验，优化 project-a 的日志埋点。`;

const DEFAULT_PROMPT = `你是一位技术日报助手，请根据以下 Git 提交记录生成一份中文的工作日报。

1. 聚焦今日的主要变化和工作成果
2. 梳理变更主题，按项目/模块归类并概要说明
3. 识别风险与待办，给出下一步建议

输出要求：
- 使用简洁的 Markdown 结构
- 语言简洁、专业，聚焦结果
- Git 信息：{git_commits}
- Git 用户名：{git_username}`;

export default function Home() {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [suppliers, setSuppliers] = useState(MOCK_SUPPLIERS);
  const [models] = useState(MOCK_MODELS);
  const [selectedSupplier, setSelectedSupplier] = useState("openai");
  const [selectedModel, setSelectedModel] = useState("gpt-4.1");
  const [apiKey, setApiKey] = useState("sk-************************");
  const [gitUsername, setGitUsername] = useState("demo");
  const [timeMode, setTimeMode] = useState<"today" | "custom">("today");
  const [startDate, setStartDate] = useState("2025-05-29");
  const [endDate, setEndDate] = useState("2025-05-29");
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [reportStatus, setReportStatus] = useState<
    "generated" | "generating" | "idle"
  >("generated");
  const [reportContent, setReportContent] = useState(MOCK_REPORT);
  const [generatedAt] = useState("2025-05-29 11:35:42");

  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [addSupplierOpen, setAddSupplierOpen] = useState(false);

  const handleToggleProject = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)),
    );
  };

  const handleAddProject = (name: string, path: string) => {
    void path;
    setProjects((prev) => [...prev, { id: name, name, selected: true }]);
  };

  const handleAddSupplier = (name: string, baseUrl: string, apiKey: string) => {
    void baseUrl;
    void apiKey;
    const id = name.toLowerCase().replace(/\s+/g, "-");
    setSuppliers((prev) => [...prev, { id, name }]);
    setSelectedSupplier(id);
  };

  const handleQuickSelect = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days + 1);
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
    setTimeMode("custom");
  };

  const handleGenerate = () => {
    setReportStatus("generating");
    setReportContent("");
    setTimeout(() => {
      setReportStatus("generated");
      setReportContent(MOCK_REPORT);
    }, 1500);
  };

  const handleCopy = () => {
    if (reportContent) {
      navigator.clipboard.writeText(reportContent);
    }
  };

  const handleExport = () => {
    if (!reportContent) return;
    const blob = new Blob([reportContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `日报-${startDate}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleOpenTemplate = () => {
    window.alert("提示词模板工具暂未接入");
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 gap-4 overflow-hidden p-4">
        <div className="flex w-130 shrink-0 flex-col gap-4 overflow-y-auto pr-1">
          <ProjectSection
            projects={projects}
            onToggleProject={handleToggleProject}
            onAddProject={() => setAddProjectOpen(true)}
          />
          <AIConfigSection
            suppliers={suppliers}
            models={models}
            selectedSupplier={selectedSupplier}
            selectedModel={selectedModel}
            apiKey={apiKey}
            onSupplierChange={setSelectedSupplier}
            onModelChange={setSelectedModel}
            onApiKeyChange={setApiKey}
            onAddSupplier={() => setAddSupplierOpen(true)}
          />
          <div className="flex gap-4">
            <GitUserSection
              username={gitUsername}
              isValid={gitUsername.length > 0}
              onChange={setGitUsername}
            />
            <TimeRangeSection
              mode={timeMode}
              startDate={startDate}
              endDate={endDate}
              onModeChange={setTimeMode}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onQuickSelect={handleQuickSelect}
            />
          </div>
          <PromptSection
            prompt={prompt}
            onPromptChange={setPrompt}
            onOpenTemplate={handleOpenTemplate}
          />
          <button
            onClick={handleGenerate}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 active:translate-y-px disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            生成日报
          </button>
        </div>
        <div className="min-w-0 flex-1">
          <ReportPreview
            status={reportStatus}
            generatedAt={generatedAt}
            content={reportContent}
            onCopy={handleCopy}
            onExport={handleExport}
            onRegenerate={handleRegenerate}
          />
        </div>
      </main>
      <AddProjectModal
        open={addProjectOpen}
        onClose={() => setAddProjectOpen(false)}
        onAdd={handleAddProject}
      />
      <AddSupplierModal
        open={addSupplierOpen}
        onClose={() => setAddSupplierOpen(false)}
        onAdd={handleAddSupplier}
      />
    </div>
  );
}
