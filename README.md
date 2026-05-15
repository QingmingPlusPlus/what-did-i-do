# Git 日报 Agent

一个本地运行的 Electron 前端原型，用于根据 Git 提交记录生成中文工作日报。本阶段只实现纯前端与 mock 交互，真实 Git 扫描、AI 调用和文件导出会在后续迭代接入。

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
  main.ts        Electron 主进程，创建窗口并加载 Vite 或构建产物
  preload.ts     暴露最小 mock 桌面环境信息
src/
  App.tsx        主界面状态与布局编排
  components/    页面区域组件和 shadcn/ui 风格基础组件
  lib/           通用工具函数
  mock/          项目、AI 配置、日报内容和状态的 mock 数据
  styles/        Tailwind 全局样式和主题变量
```

## 当前 mock 范围

- 项目选择、添加项目、AI 供应商、模型、API Key、Git 用户名和日期范围均为本地 mock 状态。
- 日报内容由 `src/mock/report.ts` 根据当前选中项目、Git 用户和日期生成。
- 生成、重新生成、复制、导出 Markdown、添加供应商、提示词模板等操作只显示 mock 反馈。
- preload 只暴露 `window.dailyReportAgent.getRuntimeInfo()`，不开放渲染进程 Node.js 集成。

## 后续接入方向

- 在 Electron main process 或独立本地服务中接入真实 Git 仓库扫描。
- 将 mock AI 配置替换为 provider adapter，并增加 API Key 安全存储。
- 支持真实 Markdown 文件导出、日报历史记录和配置持久化。
- 增加系统托盘、定时生成和多仓库路径管理。
