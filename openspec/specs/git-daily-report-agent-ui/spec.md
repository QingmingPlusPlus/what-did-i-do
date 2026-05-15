## Requirements

### Requirement: Electron desktop shell
系统 SHALL 提供一个可本地启动的 Electron 桌面应用壳，用于承载 Git 日报 Agent 前端界面，并通过安全 preload 边界暴露必要的本地桌面能力。

#### Scenario: 启动桌面应用
- **WHEN** 开发者执行 README 中记录的本地启动命令
- **THEN** 系统打开一个 Electron 窗口并展示 Git 日报 Agent 主界面

#### Scenario: 保留安全 preload 边界
- **WHEN** 渲染进程需要读取桌面环境信息或管理本地项目
- **THEN** 系统 SHALL 通过 preload 暴露最小 API，并通过 Electron IPC 与主进程通信，而不是在渲染进程直接启用 Node.js 集成

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

### Requirement: Real model provider configuration
系统 SHALL 通过 Electron preload 边界提供真实模型供应商配置接口，并支持用户配置 DeepSeek 和 OpenCodeGo 的 API Key。

#### Scenario: 加载模型供应商配置
- **WHEN** 用户打开主界面且模型供应商配置组件加载
- **THEN** 系统 SHALL 通过 `window.dailyReportAgent.modelConfig` 读取已保存配置，并展示 DeepSeek 和 OpenCodeGo 两个可选供应商

#### Scenario: 切换支持的模型供应商
- **WHEN** 用户在模型供应商配置卡片中切换 DeepSeek 或 OpenCodeGo
- **THEN** 系统 SHALL 通过 Electron IPC 保存当前供应商，并回填该供应商已保存的 API Key

#### Scenario: 保存供应商 API Key
- **WHEN** 用户输入 API Key 并点击保存配置
- **THEN** 系统 SHALL 将该供应商的 API Key 写入本机配置存储，并在界面展示已配置状态

#### Scenario: 拒绝不支持的模型供应商
- **WHEN** 渲染进程请求配置 DeepSeek 和 OpenCodeGo 之外的供应商
- **THEN** 系统 SHALL 拒绝该请求并返回可见失败状态

### Requirement: Configuration workflow
系统 SHALL 使用真实本地项目列表支持项目选择，使用真实模型供应商配置接口支持 provider/key 配置，并继续使用 mock 数据支持 Git 用户、时间范围和提示词配置。

#### Scenario: 选择项目
- **WHEN** 用户勾选或取消勾选一个有效项目
- **THEN** 系统更新选中状态，并在日报预览中反映选中的真实项目名称

#### Scenario: 禁用失效项目选择
- **WHEN** 项目缺少直属 `.git` 目录并处于失效状态
- **THEN** 系统 SHALL 禁用该项目的选择控件，且不允许用户将其加入日报项目范围

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
