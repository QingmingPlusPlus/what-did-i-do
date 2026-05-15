## ADDED Requirements

### Requirement: Real local Git project management
系统 SHALL 支持用户管理真实本地 Git 项目列表，并将项目列表持久化到本机存储。

#### Scenario: 加载已保存项目
- **WHEN** 用户打开主界面且项目选择组件加载
- **THEN** 系统 SHALL 从本机存储读取已保存项目，并在展示前重新检查每个项目目录下是否存在直属 `.git` 目录

#### Scenario: 添加有效 Git 项目
- **WHEN** 用户点击“添加项目”并在系统文件夹选择弹窗中选择一个包含直属 `.git` 目录的文件夹
- **THEN** 系统 SHALL 保存该项目并在项目选择区展示为可选择状态

#### Scenario: 拒绝非 Git 项目
- **WHEN** 用户选择的文件夹下不存在直属 `.git` 目录
- **THEN** 系统 SHALL 不保存该路径，并展示添加失败提示

#### Scenario: 不支持 worktree 和 .git 文件
- **WHEN** 用户选择的文件夹只包含 `.git` 文件或依赖 Git worktree 元数据
- **THEN** 系统 SHALL 将该文件夹视为无效项目，并展示添加失败提示

#### Scenario: 标记失效项目
- **WHEN** 已保存项目在组件加载或刷新校验时缺少直属 `.git` 目录
- **THEN** 系统 SHALL 保留该项目记录并展示失效状态，且禁用该项目的选择按钮

#### Scenario: 删除已保存项目
- **WHEN** 用户点击“编辑”进入项目编辑状态并删除某个项目
- **THEN** 系统 SHALL 从本机存储移除该项目，并从项目选择区移除该项目卡片

## MODIFIED Requirements

### Requirement: Electron desktop shell
系统 SHALL 提供一个可本地启动的 Electron 桌面应用壳，用于承载 Git 日报 Agent 前端界面，并通过安全 preload 边界暴露必要的本地桌面能力。

#### Scenario: 启动桌面应用
- **WHEN** 开发者执行 README 中记录的本地启动命令
- **THEN** 系统打开一个 Electron 窗口并展示 Git 日报 Agent 主界面

#### Scenario: 保留安全 preload 边界
- **WHEN** 渲染进程需要读取桌面环境信息或管理本地项目
- **THEN** 系统 SHALL 通过 preload 暴露最小 API，并通过 Electron IPC 与主进程通信，而不是在渲染进程直接启用 Node.js 集成

### Requirement: Mock configuration workflow
系统 SHALL 使用真实本地项目列表支持项目选择，并继续使用 mock 数据支持 AI 配置、Git 用户、时间范围和提示词配置。

#### Scenario: 选择项目
- **WHEN** 用户勾选或取消勾选一个有效项目
- **THEN** 系统更新选中状态，并在日报预览中反映选中的真实项目名称

#### Scenario: 禁用失效项目选择
- **WHEN** 项目缺少直属 `.git` 目录并处于失效状态
- **THEN** 系统 SHALL 禁用该项目的选择控件，且不允许用户将其加入日报项目范围

#### Scenario: 配置 AI provider
- **WHEN** 用户选择 AI 供应商、模型或编辑 API Key
- **THEN** 系统更新本地 mock 状态，并保持输入内容在界面中可见

#### Scenario: 校验 Git 用户名
- **WHEN** 用户编辑 Git 用户名
- **THEN** 系统展示 mock 账号有效状态，不访问真实 Git 配置

#### Scenario: 配置时间范围
- **WHEN** 用户切换今日、自定义范围或快捷日期
- **THEN** 系统更新日期显示，并用 mock 数据刷新日报生成时间或预览内容

#### Scenario: 编辑提示词
- **WHEN** 用户编辑提示词或点击提示词模板
- **THEN** 系统更新提示词文本域内容，并保留中文日报生成要求
