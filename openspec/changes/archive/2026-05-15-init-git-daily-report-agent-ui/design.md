## Context

当前仓库尚未包含应用代码，只有 agent 协作文档和 OpenSpec 基础结构。本次变更需要从零初始化 Git 日报 Agent 的桌面前端，用低保真图定义首版信息架构：顶部展示产品名、本地服务状态和用户信息，主体采用左侧配置、右侧日报预览的双栏布局。

首版目标是验证桌面工具体验和页面结构，不连接真实 Git、AI 服务或文件系统导出能力。所有数据、状态变更和按钮操作都通过 mock 实现，确保界面可以本地运行并被后续迭代替换为真实服务。

## Goals / Non-Goals

**Goals:**

- 提供可运行的 Electron + React + TypeScript 前端基础工程。
- 使用 Tailwind CSS 和 shadcn/ui 风格组件搭建接近低保真设计图的桌面界面。
- 将页面拆分为清晰组件，便于后续替换 mock 数据和接入真实 Electron IPC。
- 为主要交互提供 mock 状态反馈，而不是空按钮。
- 用 README 记录启动方式、目录结构、mock 范围和后续接入点。
- 新增项目记忆文档和路由入口，让后续 agent 能快速定位当前实现状态。

**Non-Goals:**

- 不实现真实 Git commit 扫描、仓库发现或用户名校验。
- 不调用真实 OpenAI 或其他 AI provider。
- 不实现 API Key 加密存储、本地数据库、系统托盘、后台定时任务或自动开机启动。
- 不实现真实 Markdown 文件下载到磁盘；导出仅保留 mock 操作反馈。
- 不引入服务端或远程 Web 部署形态。

## Decisions

### 使用 Electron + Vite + React 初始化桌面前端

Electron 匹配“本地运行”的产品形态，Vite 能以较少配置支撑 React 和 TypeScript。主进程只负责打开窗口和加载开发/生产地址，preload 暂时暴露最小安全上下文，为后续 IPC 留出位置。

备选方案是 Next.js Web 或纯 Vite Web。低保真图虽标注过 “Next.js Web”，但用户明确要求 Electron，因此本阶段以桌面壳为准；Web 构建只作为渲染层开发体验的一部分。

### 使用 Tailwind CSS 和 shadcn/ui 风格的本地组件

Tailwind 负责布局、间距和主题变量，shadcn/ui 风格组件负责 Button、Input、Select、Textarea、Card、Badge 等基础控件。组件保存在项目源码内，避免把首版 UI 绑定到运行期组件服务。

备选方案是直接使用完整 UI 框架。考虑 shadcn/ui 本身偏向复制源码的组合方式，本项目先建立必要组件，保持首版依赖简单且样式可控。

### 使用 mock 数据层集中驱动界面

项目列表、AI provider、模型、Git 用户、日期范围、日报 Markdown、生成状态和操作反馈集中放在 mock 模块中。UI 组件只消费 typed mock 数据和事件处理函数，后续真实接入时可以替换为 hook、IPC client 或本地服务 adapter。

备选方案是在组件内硬编码内容。集中 mock 更利于测试、阅读和后续迁移。

### 采用桌面优先的双栏响应式布局

主界面优先还原低保真图的桌面双栏：左侧配置区约占一半宽度，右侧预览区保持阅读宽度和操作按钮。较窄窗口下允许纵向堆叠，避免内容溢出。

备选方案是只做固定宽度页面。响应式约束能降低 Electron 窗口缩放时的破版风险。

## Risks / Trade-offs

- [Risk] shadcn/ui 组件初始化命令可能受包管理器或网络状态影响 → Mitigation: 采用项目内可维护的最小组件集合，保留 shadcn 命名和样式约定。
- [Risk] mock 反馈容易被误认为真实能力 → Mitigation: README 明确列出 mock 范围，界面反馈文案避免暗示真实文件或 API 已执行。
- [Risk] 从零初始化会引入较多配置文件 → Mitigation: 只加入 Electron、Vite、Tailwind、TypeScript 和 UI 必需配置，避免过早引入测试框架或打包发布配置。
- [Risk] 低保真图是宽屏设计，窄窗口可能拥挤 → Mitigation: 使用 responsive grid、固定控件高度和可滚动预览区处理窗口变化。

## Migration Plan

1. 初始化前端和 Electron 基础配置。
2. 增加 Tailwind、主题变量、shadcn/ui 风格组件和工具函数。
3. 实现 mock 数据层与页面组件。
4. 补充 README 和项目记忆文档。
5. 运行安装、类型检查和本地开发验证。

回滚策略是删除本次新增应用文件、README 中的应用说明以及新增项目记忆入口。当前无线上服务或数据迁移影响。

## Open Questions

- 后续真实 Git 接入使用 Electron main process 直接执行 git，还是引入独立本地服务？
- API Key 后续使用系统 keychain、加密文件，还是由外部环境变量提供？
- 日报生成结果是否需要保存历史记录，以及保存到本地文件还是轻量数据库？
