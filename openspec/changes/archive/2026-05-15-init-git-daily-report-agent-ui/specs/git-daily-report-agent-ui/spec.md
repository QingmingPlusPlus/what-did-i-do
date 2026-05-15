## ADDED Requirements

### Requirement: Electron desktop shell
系统 SHALL 提供一个可本地启动的 Electron 桌面应用壳，用于承载 Git 日报 Agent 前端界面。

#### Scenario: 启动桌面应用
- **WHEN** 开发者执行 README 中记录的本地启动命令
- **THEN** 系统打开一个 Electron 窗口并展示 Git 日报 Agent 主界面

#### Scenario: 保留安全 preload 边界
- **WHEN** 渲染进程需要读取桌面环境占位信息
- **THEN** 系统 SHALL 通过 preload 暴露最小 mock API，而不是在渲染进程直接启用 Node.js 集成

### Requirement: Main report generation layout
系统 SHALL 展示与低保真图一致的 Git 日报 Agent 首屏布局，包含顶部状态栏、左侧配置区和右侧日报预览区。

#### Scenario: 展示顶部状态栏
- **WHEN** 用户打开应用
- **THEN** 系统展示产品名、运行模式、本地服务运行状态、主题入口占位和当前用户信息

#### Scenario: 展示配置与预览双栏
- **WHEN** 用户在桌面宽度窗口查看主界面
- **THEN** 系统在左侧展示配置表单，并在右侧展示日报预览和结果操作区

#### Scenario: 窄窗口布局不溢出
- **WHEN** 用户缩小应用窗口到窄屏宽度
- **THEN** 系统 SHALL 将配置区与预览区调整为可读的纵向布局，且主要文本和按钮不互相遮挡

### Requirement: Mock configuration workflow
系统 SHALL 使用 mock 数据支持项目选择、AI 配置、Git 用户、时间范围和提示词配置，不依赖真实 Git 或 AI 服务。

#### Scenario: 选择项目
- **WHEN** 用户勾选或取消勾选项目
- **THEN** 系统更新选中状态，并在日报预览中反映 mock 项目范围

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

### Requirement: Mock report preview and actions
系统 SHALL 展示一份中文 Markdown 工作日报预览，并为主要操作按钮提供 mock 反馈。

#### Scenario: 生成日报
- **WHEN** 用户点击生成日报按钮
- **THEN** 系统展示生成中或已生成的 mock 状态，并刷新右侧日报预览内容

#### Scenario: 查看日报内容
- **WHEN** 日报处于已生成状态
- **THEN** 系统展示包含项目、Git 用户、工作概览、项目进展、提交记录汇总、风险与待办的中文 Markdown 内容

#### Scenario: 复制日报
- **WHEN** 用户点击复制按钮
- **THEN** 系统提供可见的 mock 成功反馈，并不要求真实剪贴板写入成功

#### Scenario: 导出 Markdown
- **WHEN** 用户点击导出 Markdown 按钮
- **THEN** 系统提供可见的 mock 导出反馈，并不创建真实文件

#### Scenario: 重新生成日报
- **WHEN** 用户点击重新生成按钮
- **THEN** 系统刷新 mock 生成状态和生成时间，并保持页面可交互

### Requirement: Project documentation
系统 SHALL 提供 README 和项目记忆入口，说明 Git 日报 Agent 前端的开发方式和当前实现状态。

#### Scenario: 阅读 README
- **WHEN** 开发者打开 README
- **THEN** README 说明技术栈、安装启动命令、主要目录、mock 范围和后续真实接入方向

#### Scenario: 后续 agent 定位项目记忆
- **WHEN** 后续 agent 根据 `doc/agent-memory-map.md` 查找 Git 日报 Agent 相关入口
- **THEN** 路由表指向对应项目文档和 OpenSpec capability
