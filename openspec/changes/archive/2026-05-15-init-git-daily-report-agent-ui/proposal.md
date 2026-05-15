## Why

当前仓库需要先建立一个可运行、可评审的 Git 日报 Agent 前端原型，用于验证用户配置、日报生成流程和结果预览的交互形态。先用 Electron 承载本地工具形态，并以 mock 数据封闭外部依赖，可以为后续接入真实 Git 记录、AI 服务和本地配置持久化打下清晰界面基础。

## What Changes

- 初始化一个 Electron 桌面应用前端，使用 React、TypeScript、Vite、Tailwind CSS 和 shadcn/ui 风格组件。
- 构建与低保真图一致的主界面：顶部状态栏、左侧配置区、右侧日报预览区和底部操作按钮。
- 提供 mock 项目选择、AI 配置、Git 用户名、时间范围、提示词编辑和日报生成交互。
- 使用 mock 数据展示中文 Markdown 工作日报，包括项目概览、项目进展、提交记录汇总、风险与待办。
- 为复制、导出 Markdown、重新生成、添加项目、添加供应商、提示词模板等按钮提供 mock 回调和可见反馈。
- 更新 README，说明技术栈、启动命令、当前 mock 范围和后续接入方向。
- 本阶段不接入真实 Git 仓库扫描、真实 AI API 调用、文件导出落盘、系统托盘或自动定时任务。

## Capabilities

### New Capabilities

- `git-daily-report-agent-ui`: 定义 Git 日报 Agent 桌面前端的页面结构、mock 交互、日报预览与文档要求。

### Modified Capabilities

- 无。

## Impact

- 新增项目级前端与 Electron 配置文件，包括 package scripts、Vite、Tailwind、TypeScript、Electron main/preload 和 React 源码。
- 新增 shadcn/ui 所需的组件基础、样式变量和工具函数。
- 新增或更新 README，作为本地开发和 mock 范围说明入口。
- 新增项目记忆文档与路由入口，方便后续 agent 定位 Git 日报 Agent 当前状态。
