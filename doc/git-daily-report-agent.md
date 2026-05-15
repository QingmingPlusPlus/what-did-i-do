# Git 日报 Agent 当前状态

## 模块定位

Git 日报 Agent 是一个本地运行的 Electron 桌面前端，用于配置 Git 日报生成参数并预览中文 Markdown 工作日报。当前已接入真实本地 Git 项目选择、`.git` 目录校验、项目列表持久化和模型供应商 API Key 配置；AI 服务调用、Git commit 扫描和导出文件仍为 mock。

## 技术与入口

- 应用入口：`src/App.tsx`
- Electron 主进程：`electron/main.ts`
- Electron preload：`electron/preload.ts`
- 本地项目存储：`electron/project-store.ts`
- 模型供应商配置存储：`electron/model-config-store.ts`
- mock 数据：`src/mock/report.ts`
- UI 组件：`src/components/`
- 基础样式：`src/styles/index.css`
- OpenSpec capability：`openspec/specs/git-daily-report-agent-ui/spec.md`

## 页面结构

首屏为桌面优先的双栏工作台：

- 顶部状态栏：产品名、本地运行模式、本地服务状态、主题入口占位、设置入口占位、用户菜单占位。
- 左侧配置区：项目选择、模型供应商配置、Git 用户名、时间范围、提示词编辑和生成日报按钮。
- 右侧预览区：日报状态、生成时间、Markdown 风格日报内容、复制、导出 Markdown 和重新生成按钮。

窄窗口下主内容会从双栏调整为纵向布局，避免主要控件互相遮挡。

## 真实项目管理

- 项目选择组件加载时，通过 preload 调用 Electron IPC 查询本机已保存项目。
- 项目列表存储在 Electron `app.getPath("userData")` 下的 `projects.json`。
- 添加项目会打开系统文件夹选择弹窗，只有所选目录直属存在 `.git` 目录时保存成功。
- 首版不支持 Git worktree、`.git` 文件、submodule 特例或向父目录查找仓库。
- 每次加载项目列表都会重新检查 `.git` 目录；缺失时项目保留展示，但选择控件禁用。
- “编辑”状态下可以删除已保存项目，包括已失效项目。

## 真实模型供应商配置

- 模型供应商配置通过 preload 暴露的 `window.dailyReportAgent.modelConfig` 调用 Electron IPC。
- 当前只支持 `deepseek` 和 `opencodego` 两个供应商。
- 用户可切换供应商并输入 API Key，点击“保存配置”后写入 Electron `app.getPath("userData")` 下的 `model-config.json`。
- API Key 按供应商分别保存；切换供应商会回填该供应商已保存的 key。
- 该配置仅负责本地 provider/key 持久化，尚未发起真实 AI 生成请求。

## Mock 行为

- 日报内容会根据当前选中的有效项目名称刷新，但提交内容仍由 mock 模板生成。
- Git 用户名、日期范围、提示词都只保存到 React local state。
- 生成与重新生成会短暂进入 `generating` 状态，然后刷新生成时间。
- 导出 Markdown 只展示 mock 成功反馈，不写入文件。
- 复制会尝试写入剪贴板，但界面反馈按 mock 成功处理。

## 后续替换点

- 在 main process 中执行 Git 命令或接入独立本地服务读取提交记录。
- 增加 API Key 安全存储、真实 provider 调用、日报历史记录和真实 Markdown 导出。
