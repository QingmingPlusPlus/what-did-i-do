## Why

当前项目选择仍停留在 mock 数据，无法选择真实本地仓库，也不会在重启后保留用户添加过的项目。Git 日报 Agent 需要先具备可信的本地 Git 项目管理能力，后续日报生成才能基于真实仓库范围继续推进。

## What Changes

- 将项目选择从 mock 列表改为通过 Electron IPC 读取真实本地项目列表。
- 点击“添加项目”时打开系统文件夹选择弹窗，用户选择目录后仅检查该目录下是否存在 `.git` 目录。
- 只有存在 `.git` 目录的路径可以添加成功；缺少 `.git` 目录时显示添加失败。
- 新增本地持久化项目列表，优先使用 `app.getPath("userData")` 下的 JSON 文件保存。
- 每次项目选择组件加载时读取已保存项目，并重新校验每个项目的 `.git` 目录是否仍存在。
- 已保存项目失效时继续展示，但对应项目选择按钮进入禁用状态。
- 在“添加项目”按钮旁新增“编辑”按钮；进入编辑状态后可以删除已保存项目。
- 首版明确不支持 Git worktree、submodule `.git` 文件或向上查找父目录 Git 仓库，只认可所选目录直属的 `.git` 目录。

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `git-daily-report-agent-ui`: 将项目选择从 mock 交互改为真实本地 Git 项目选择、校验、持久化和编辑删除流程。

## Impact

- `electron/main.ts`: 增加文件夹选择、`.git` 目录校验、项目 JSON 存储读写和 IPC handler。
- `electron/preload.ts`: 暴露最小项目管理 API 给渲染进程。
- `src/vite-env.d.ts`: 补充 preload API 类型。
- `src/App.tsx`: 在组件加载时读取项目，处理添加、选择、删除和失效提示。
- `src/components/ProjectSelector.tsx`: 增加加载、失效、编辑、删除等 UI 状态。
- `src/mock/report.ts`: 调整项目类型，移除项目选择对 mock 项目列表的依赖。
- `openspec/specs/git-daily-report-agent-ui/spec.md`: 更新项目选择相关需求。
- `doc/git-daily-report-agent.md`、`README.md`: 更新当前实现状态和真实项目管理说明。
