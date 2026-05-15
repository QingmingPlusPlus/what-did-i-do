## Context

Git 日报 Agent 当前是 Electron + Vite + React 的本地桌面应用。项目选择数据来自 `src/mock/report.ts`，`App.tsx` 只维护 React 内存状态，“添加项目”按钮只展示 mock 提示。Electron preload 当前只暴露 `getRuntimeInfo`，主进程尚未提供文件夹选择、文件系统校验或本地持久化能力。

这个 change 要把“涉及项目选择”从 mock 原型推进到真实本地 Git 项目管理。实现需要跨 renderer、preload、main process 和本地存储，因此需要明确边界，避免渲染进程直接使用 Node 文件系统权限。

## Goals / Non-Goals

**Goals:**

- 用户可以通过系统文件夹选择弹窗添加本地项目目录。
- 系统仅在所选目录直属 `.git` 目录存在时认为项目有效并保存。
- 系统持久化已添加项目，并在项目选择组件加载时读取和重新校验有效性。
- `.git` 目录缺失的已保存项目继续展示，但不可被选择。
- 用户可以进入编辑状态并删除已保存项目。
- 渲染进程继续通过 preload 的最小 API 与 Electron main process 通信。

**Non-Goals:**

- 不支持 Git worktree。
- 不支持 `.git` 文件、submodule 特例或向父目录查找仓库。
- 不读取真实 Git commit，不生成真实日报内容。
- 不引入项目同步、远程仓库信息或多用户数据。
- 不把 AI provider、API Key、Git 用户名、日报导出一并持久化。

## Decisions

### Use Electron main process for filesystem and dialogs

渲染进程通过 `window.dailyReportAgent.projects` 调用 preload 暴露的 typed API，preload 使用 `ipcRenderer.invoke` 转发到 main process。main process 负责 `dialog.showOpenDialog`、`fs.stat`、`fs.readFile`、`fs.writeFile` 等桌面能力。

这样保留现有 `contextIsolation: true` 和 `nodeIntegration: false` 的安全边界，也让 UI 组件只处理状态和展示。备选方案是在 renderer 打开 Node 能力或通过 Vite 前端直接访问文件系统，但这会扩大权限面，并破坏当前 Electron 架构约束。

### Store projects in a JSON file under `app.getPath("userData")`

首版项目数据量很小，只需要保存路径、展示名、选中状态和创建/更新时间。JSON 文件足够透明、易调试，也不引入新的运行时依赖。

备选方案是 SQLite。SQLite 适合后续保存日报历史、commit 缓存、生成任务记录或复杂查询，但当前项目列表没有关系型查询需求，引入 SQLite 会增加依赖、迁移和打包复杂度。

### Treat validity as derived state, not trusted storage

存储文件只保存项目记录；每次列表读取和添加后，由 main process 重新检查 `<projectPath>/.git` 是否为目录，并返回 `valid` 状态。失效项目不会自动删除，避免用户因为临时移动、卸载磁盘或权限变化丢失配置。

### Require `.git` directory directly under the chosen folder

本 change 明确只认可用户选择目录下的直属 `.git` 目录。`.git` 文件、worktree、submodule 特例、父目录仓库都返回添加失败或失效。

这个规则简单、可解释，也符合用户当前要求。后续如果要支持 worktree，应作为单独 change 扩展仓库识别规则和 UI 文案。

### Keep project deletion explicit

编辑按钮让项目选择区进入编辑状态，项目卡片展示删除操作。删除立即写入本地 JSON，并从列表移除。失效项目也可以删除。

避免在正常选择模式下混入破坏性操作，减少误删风险。

## Risks / Trade-offs

- [Risk] JSON 文件损坏会导致项目列表读取失败 → Mitigation: main process 捕获解析错误，返回空列表或可见错误提示，后续可备份损坏文件。
- [Risk] 同一路径被重复添加 → Mitigation: 保存前按规范化路径去重，重复添加时返回已有记录或提示已存在。
- [Risk] 外接磁盘或权限变化导致项目临时失效 → Mitigation: 不自动删除失效项目，只禁用选择并允许用户手动删除。
- [Risk] Windows/macOS 路径大小写与符号链接可能导致重复判断不一致 → Mitigation: 首版使用 `path.resolve` 规范化路径，复杂 realpath 去重留给后续优化。
- [Risk] 添加项目时用户取消文件夹选择 → Mitigation: 返回取消结果，不修改项目列表，并给出温和提示。
