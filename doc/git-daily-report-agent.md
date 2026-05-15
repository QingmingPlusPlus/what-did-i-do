# Git 日报 Agent 当前状态

## 模块定位

Git 日报 Agent 是一个本地运行的 Electron 桌面前端，用于配置 Git 日报生成参数并预览中文 Markdown 工作日报。当前实现是纯前端 mock 原型，不读取真实 Git 仓库、不调用真实 AI 服务、不创建真实导出文件。

## 技术与入口

- 应用入口：`src/App.tsx`
- Electron 主进程：`electron/main.ts`
- Electron preload：`electron/preload.ts`
- mock 数据：`src/mock/report.ts`
- UI 组件：`src/components/`
- 基础样式：`src/styles/index.css`
- OpenSpec capability：`openspec/specs/git-daily-report-agent-ui/spec.md`

## 页面结构

首屏为桌面优先的双栏工作台：

- 顶部状态栏：产品名、本地运行模式、本地服务状态、主题入口占位、设置入口占位、用户菜单占位。
- 左侧配置区：项目选择、AI 配置、Git 用户名、时间范围、提示词编辑和生成日报按钮。
- 右侧预览区：日报状态、生成时间、Markdown 风格日报内容、复制、导出 Markdown 和重新生成按钮。

窄窗口下主内容会从双栏调整为纵向布局，避免主要控件互相遮挡。

## Mock 行为

- 项目选择会更新本地选中状态，并刷新日报涉及项目。
- AI provider、模型、API Key、Git 用户名、日期范围、提示词都只保存到 React local state。
- 生成与重新生成会短暂进入 `generating` 状态，然后刷新生成时间。
- 导出 Markdown 只展示 mock 成功反馈，不写入文件。
- 复制会尝试写入剪贴板，但界面反馈按 mock 成功处理。

## 后续替换点

- 用 Electron IPC 或本地 service adapter 替换 `src/mock/report.ts`。
- 在 main process 中执行 Git 命令或接入独立本地服务读取提交记录。
- 增加 API Key 安全存储、真实 provider 调用、日报历史记录和真实 Markdown 导出。
