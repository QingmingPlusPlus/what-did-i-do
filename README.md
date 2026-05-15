# Git 日报 Agent

一个本地运行的 Electron 前端原型，用于根据 Git 提交记录生成中文工作日报。当前已接入真实本地 Git 项目选择与持久化、模型供应商 API Key 配置，AI 调用、提交扫描和文件导出仍使用 mock 交互。

## 技术栈

- Electron：桌面应用壳
- React + TypeScript：渲染层与状态管理
- Vite：开发服务器与前端构建
- Tailwind CSS：样式系统
- shadcn/ui 风格组件：本地 Button、Input、Select、Textarea、Badge、Card 等基础组件
- lucide-react：界面图标

## 本地运行

```bash
npm install
npm run dev
```

`npm run dev` 会先编译 Electron main/preload，再启动 Vite 和 Electron 窗口。

常用命令：

```bash
npm run typecheck
npm run build
npm run preview
npm run lint
```

## 目录结构

```text
electron/
  main.ts          Electron 主进程，创建窗口、注册 IPC，并加载 Vite 或构建产物
  preload.ts       暴露最小桌面环境、项目管理 API 与模型供应商配置 API
  model-config-store.ts DeepSeek/OpenCodeGo 供应商配置与 API Key 本地持久化
  project-store.ts 本地项目 JSON 存储、.git 目录校验和项目增删改查
src/
  App.tsx        主界面状态与布局编排
  components/    页面区域组件和 shadcn/ui 风格基础组件
  lib/           通用工具函数
  mock/          日报内容和状态的 mock 数据
  styles/        Tailwind 全局样式和主题变量
```

## 项目管理

- 点击“添加项目”会打开系统文件夹选择弹窗。
- 只有所选文件夹直属存在 `.git` 目录时才会添加成功。
- 首版不支持 Git worktree、`.git` 文件、submodule 特例或向父目录查找仓库。
- 已添加项目存储在 Electron `app.getPath("userData")` 下的 `projects.json`。
- 每次加载项目选择组件时，系统会重新检查已保存项目的 `.git` 目录；缺失时项目保留展示，但选择控件禁用。
- 点击“编辑”可以进入编辑状态并删除已保存项目。

## 模型供应商配置

- 当前只支持 DeepSeek 和 OpenCodeGo。
- 配置卡片通过 `window.dailyReportAgent.modelConfig` 读取、切换和保存供应商配置。
- API Key 按供应商分别保存到 Electron `app.getPath("userData")` 下的 `model-config.json`。
- 该配置已脱离 mock 数据，但尚未接入真实 AI 日报生成请求。

## 当前 mock 范围

- Git 用户名和日期范围仍为本地 mock 状态。
- 日报内容由 `src/mock/report.ts` 根据当前选中的有效项目、Git 用户和日期生成。
- 生成、重新生成、复制、导出 Markdown、提示词模板等操作只显示 mock 反馈。
- preload 暴露 `window.dailyReportAgent.getRuntimeInfo()`、最小项目管理 API 和模型供应商配置 API，不开放渲染进程 Node.js 集成。

## 后续接入方向

- 在 Electron main process 或独立本地服务中接入真实 Git commit 扫描。
- 将已保存的模型供应商配置接入 provider adapter，并增加 API Key 安全存储。
- 支持真实 Markdown 文件导出、日报历史记录和配置持久化。
- 增加系统托盘、定时生成和更完整的多仓库管理能力。
